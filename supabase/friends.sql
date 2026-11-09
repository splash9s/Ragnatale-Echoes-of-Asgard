-- Ragnatale: friends, friend gifts and player IDs.
-- Run once in the SQL editor of project krtzvossvqddhveozcnb, after schema.sql.

-- Public face of each player: name, base level, avatar and a short ID for adding friends.
-- The game writes this row whenever the save is written (see js/cloud.js).
create table if not exists public.profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    name text not null default 'Hero',
    base_lv int not null default 1,
    avatar text not null default '',
    friend_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8))
);

-- One row per direction: what the owner sees of a friend.
-- Gifts, streak and the last gift day belong to the owner, so each side has its own friendship level.
create table if not exists public.friendships (
    owner_id uuid not null references auth.users(id) on delete cascade,
    friend_id uuid not null references auth.users(id) on delete cascade,
    gifts_sent int not null default 0,
    streak int not null default 0,
    last_gift_on date,
    added_at timestamptz not null default now(),
    primary key (owner_id, friend_id),
    check (owner_id <> friend_id)
);

alter table public.profiles enable row level security;
alter table public.friendships enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own friendships" on public.friendships;
create policy "own friendships" on public.friendships for select
    using (auth.uid() = owner_id);

-- Friendship level from gifts sent: level L needs (L-1)*L/2 gifts in total
-- (lv 2 = 1 gift, lv 3 = 3, lv 4 = 6, ... lv 15 = 105). Capped at 15.
create or replace function public.friend_level(p_gifts int) returns int
language sql immutable as $$
    select coalesce(max(l), 1)::int from generate_series(1, 15) as l
    where p_gifts >= (l - 1) * l / 2
$$;

-- Potions in one gift: lv 1-5 minor x lv, lv 6-10 medium x (lv-5), lv 11-15 large x (lv-10)
create or replace function public.friend_gift_items(p_level int) returns jsonb
language sql immutable as $$
    select case
        when p_level <= 5 then jsonb_build_object('potion_minor', p_level)
        when p_level <= 10 then jsonb_build_object('potion_med', p_level - 5)
        else jsonb_build_object('potion_large', p_level - 10)
    end
$$;

-- Add a friend by ID (8 characters) or by exact name. Both sides get a friendship row.
create or replace function public.add_friend(p_query text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    q text := btrim(coalesce(p_query, ''));
    target public.profiles;
    matches int;
begin
    if me is null then raise exception 'Sign in first'; end if;
    if q = '' then raise exception 'Type a player name or ID'; end if;

    select * into target from public.profiles where friend_code = upper(q);
    if not found then
        select count(*) into matches from public.profiles where lower(name) = lower(q);
        if matches = 0 then raise exception 'No player found'; end if;
        if matches > 1 then raise exception 'Several players have that name. Use their ID instead.'; end if;
        select * into target from public.profiles where lower(name) = lower(q);
    end if;

    if target.user_id = me then raise exception 'That is your own ID'; end if;
    if exists (select 1 from public.friendships where owner_id = me and friend_id = target.user_id) then
        raise exception 'Already in your friend list';
    end if;

    insert into public.friendships (owner_id, friend_id) values (me, target.user_id) on conflict do nothing;
    insert into public.friendships (owner_id, friend_id) values (target.user_id, me) on conflict do nothing;
    return jsonb_build_object('user_id', target.user_id, 'name', target.name);
end $$;

-- Delete a friend: both rows go, so the friendship level starts again if they are added later.
create or replace function public.remove_friend(p_friend uuid) returns void
language sql security definer set search_path = public as $$
    delete from public.friendships
    where (owner_id = auth.uid() and friend_id = p_friend)
       or (owner_id = p_friend and friend_id = auth.uid())
$$;

-- Send today's gift: once a day per friend. The items go to the friend's mailbox (claimed in the game).
create or replace function public.send_friend_gift(p_friend uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    today date := (now() at time zone 'utc')::date;
    f public.friendships;
    lv int;
    items jsonb;
    new_streak int;
    sender text;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select * into f from public.friendships where owner_id = me and friend_id = p_friend for update;
    if not found then raise exception 'Not in your friend list'; end if;
    if f.last_gift_on = today then raise exception 'You already sent a gift to this friend today'; end if;

    lv := public.friend_level(f.gifts_sent);
    items := public.friend_gift_items(lv);
    if f.last_gift_on = today - 1 then new_streak := f.streak + 1; else new_streak := 1; end if;

    select name into sender from public.profiles where user_id = me;
    insert into public.mail (recipient_id, title, sender, message, rewards)
    values (p_friend, 'Friend Gift', coalesce(sender, 'Friend'),
            'A gift from a friend (Friendship Lv. ' || lv || ').',
            jsonb_build_object('potions', items));

    update public.friendships
        set gifts_sent = gifts_sent + 1, streak = new_streak, last_gift_on = today
        where owner_id = me and friend_id = p_friend;

    return jsonb_build_object('level', lv, 'potions', items, 'streak', new_streak);
end $$;

-- Continue a streak that was missed by exactly one day (the game charges 1 diamond before calling this).
create or replace function public.restore_friend_streak(p_friend uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    today date := (now() at time zone 'utc')::date;
    f public.friendships;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select * into f from public.friendships where owner_id = me and friend_id = p_friend for update;
    if not found then raise exception 'Not in your friend list'; end if;
    if f.last_gift_on is distinct from today - 2 or f.streak <= 0 then
        raise exception 'No streak to continue';
    end if;
    update public.friendships set last_gift_on = today - 1 where owner_id = me and friend_id = p_friend;
    return jsonb_build_object('streak', f.streak);
end $$;

-- The friend list for the friend page: names, levels, friendship stats, and the server's date (UTC).
create or replace function public.list_friends() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    today date := (now() at time zone 'utc')::date;
    result jsonb;
    my_code text;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select friend_code into my_code from public.profiles where user_id = me;
    select coalesce(jsonb_agg(row_data order by row_data->>'name'), '[]'::jsonb) into result
    from (
        select jsonb_build_object(
            'user_id', f.friend_id,
            'name', coalesce(p.name, 'Hero'),
            'base_lv', coalesce(p.base_lv, 1),
            'avatar', coalesce(p.avatar, ''),
            'friend_code', p.friend_code,
            'gifts_sent', f.gifts_sent,
            'streak', f.streak,
            'last_gift_on', f.last_gift_on
        ) as row_data
        from public.friendships f
        left join public.profiles p on p.user_id = f.friend_id
        where f.owner_id = me
    ) s;
    return jsonb_build_object('today', today, 'my_code', my_code, 'friends', result);
end $$;

revoke execute on function public.add_friend(text) from public, anon;
revoke execute on function public.remove_friend(uuid) from public, anon;
revoke execute on function public.send_friend_gift(uuid) from public, anon;
revoke execute on function public.restore_friend_streak(uuid) from public, anon;
revoke execute on function public.list_friends() from public, anon;
grant execute on function public.add_friend(text) to authenticated;
grant execute on function public.remove_friend(uuid) to authenticated;
grant execute on function public.send_friend_gift(uuid) to authenticated;
grant execute on function public.restore_friend_streak(uuid) to authenticated;
grant execute on function public.list_friends() to authenticated;
