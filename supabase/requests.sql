-- Ragnatale: friend requests. Run once in the SQL editor of project krtzvossvqddhveozcnb,
-- after friends.sql and names.sql. Adding a friend now sends a request; the other player accepts it.

create table if not exists public.friend_requests (
    from_id uuid not null references auth.users(id) on delete cascade,
    to_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (from_id, to_id),
    check (from_id <> to_id)
);

alter table public.friend_requests enable row level security;

drop policy if exists "own requests" on public.friend_requests;
create policy "own requests" on public.friend_requests for select
    using (auth.uid() = from_id or auth.uid() = to_id);

-- Accept a request from another player: both sides become friends.
create or replace function public.accept_friend_request(p_from uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    v_name text;
begin
    if me is null then raise exception 'Sign in first'; end if;
    if not exists (select 1 from public.friend_requests where from_id = p_from and to_id = me) then
        raise exception 'No friend request from this player';
    end if;
    delete from public.friend_requests where from_id = p_from and to_id = me;
    insert into public.friendships (owner_id, friend_id) values (me, p_from) on conflict do nothing;
    insert into public.friendships (owner_id, friend_id) values (p_from, me) on conflict do nothing;
    select coalesce(p.name, 'Hero') into v_name from public.profiles p where p.user_id = p_from;
    return jsonb_build_object('user_id', p_from, 'name', coalesce(v_name, 'Hero'));
end $$;

-- Decline a request you received. The other player is not told.
create or replace function public.decline_friend_request(p_from uuid) returns void
language sql security definer set search_path = public as $$
    delete from public.friend_requests where from_id = p_from and to_id = auth.uid()
$$;

-- Take back a request you sent.
create or replace function public.cancel_friend_request(p_to uuid) returns void
language sql security definer set search_path = public as $$
    delete from public.friend_requests where from_id = auth.uid() and to_id = p_to
$$;

-- Add a friend by ID or exact name. This sends a request; if they already sent you one, it is accepted.
-- Returns status 'requested' or 'friends'.
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
    if exists (select 1 from public.friend_requests where from_id = me and to_id = target.user_id) then
        raise exception 'Request already sent. Wait for them to accept.';
    end if;

    -- They already asked to be your friend: adding them accepts that request
    if exists (select 1 from public.friend_requests where from_id = target.user_id and to_id = me) then
        perform public.accept_friend_request(target.user_id);
        return jsonb_build_object('user_id', target.user_id, 'name', target.name, 'status', 'friends');
    end if;

    insert into public.friend_requests (from_id, to_id) values (me, target.user_id);
    return jsonb_build_object('user_id', target.user_id, 'name', target.name, 'status', 'requested');
end $$;

-- Requests for the friend page: received (incoming) and sent (outgoing), oldest first.
create or replace function public.list_requests() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    incoming jsonb;
    outgoing jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;

    select coalesce(jsonb_agg(s.x order by s.created_at), '[]'::jsonb) into incoming
    from (
        select r.created_at, jsonb_build_object(
            'user_id', r.from_id,
            'name', coalesce(p.name, 'Hero'),
            'base_lv', coalesce(p.base_lv, 1),
            'avatar', coalesce(p.avatar, ''),
            'friend_code', p.friend_code,
            'created_at', r.created_at) as x
        from public.friend_requests r
        left join public.profiles p on p.user_id = r.from_id
        where r.to_id = me
    ) s;

    select coalesce(jsonb_agg(s.x order by s.created_at), '[]'::jsonb) into outgoing
    from (
        select r.created_at, jsonb_build_object(
            'user_id', r.to_id,
            'name', coalesce(p.name, 'Hero'),
            'base_lv', coalesce(p.base_lv, 1),
            'avatar', coalesce(p.avatar, ''),
            'friend_code', p.friend_code,
            'created_at', r.created_at) as x
        from public.friend_requests r
        left join public.profiles p on p.user_id = r.to_id
        where r.from_id = me
    ) s;

    return jsonb_build_object('incoming', incoming, 'outgoing', outgoing);
end $$;

revoke execute on function public.accept_friend_request(uuid) from public, anon;
revoke execute on function public.decline_friend_request(uuid) from public, anon;
revoke execute on function public.cancel_friend_request(uuid) from public, anon;
revoke execute on function public.add_friend(text) from public, anon;
revoke execute on function public.list_requests() from public, anon;
grant execute on function public.accept_friend_request(uuid) to authenticated;
grant execute on function public.decline_friend_request(uuid) to authenticated;
grant execute on function public.cancel_friend_request(uuid) to authenticated;
grant execute on function public.add_friend(text) to authenticated;
grant execute on function public.list_requests() to authenticated;
