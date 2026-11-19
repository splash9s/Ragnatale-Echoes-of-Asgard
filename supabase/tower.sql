-- Rune Thread: Warded Tower friend rewards. A friend gets one mail per day with their share of the floors cleared.
-- Run once in the SQL editor of project krtzvossvqddhveozcnb, after friends.sql.

-- One send per (leader, friend, day). Keeps the mail from being spammed.
create table if not exists public.tower_mail_log (
    owner_id uuid not null references auth.users(id) on delete cascade,
    friend_id uuid not null references auth.users(id) on delete cascade,
    sent_on date not null,
    primary key (owner_id, friend_id, sent_on)
);
alter table public.tower_mail_log enable row level security;

-- Sends a friend the same gold, diamonds, planks, refine ore, elemental stones (and the floor 21 chest)
-- as the leader earned for floors 1..p_floors. Amounts are computed here, not taken from the client.
create or replace function public.send_tower_rewards(p_friend uuid, p_floors int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    today date := (now() at time zone 'utc')::date;
    n int := greatest(0, least(21, coalesce(p_floors, 0)));
    f int;
    k int;
    gold bigint := 0;
    dia int := 0;
    planks int := 0;
    ore int := 0;
    stone_count int;
    stones jsonb := '{}'::jsonb;
    els text[] := array['fire', 'wind', 'earth', 'water'];
    el text;
    rewards jsonb;
    sender text;
begin
    if me is null then raise exception 'Sign in first'; end if;
    if n = 0 then return '{}'::jsonb; end if;
    if not exists (select 1 from public.friendships where owner_id = me and friend_id = p_friend) then
        raise exception 'Not in your friend list';
    end if;

    insert into public.tower_mail_log (owner_id, friend_id, sent_on) values (me, p_friend, today) on conflict do nothing;
    if not found then raise exception 'Tower rewards already sent to this friend today'; end if;

    for f in 1..n loop
        gold := gold + 1600 * f;
        dia := dia + case when f <= 6 then 10 when f <= 15 then 20 when f <= 20 then 30 else 100 end;
        planks := planks + case when f <= 6 then 1 when f <= 15 then 2 when f <= 20 then 3 else 5 end;
        ore := ore + case when f <= 6 then 2 when f <= 15 then 4 when f <= 20 then 6 else 10 end;
        stone_count := case when f <= 6 then 0
                            when f <= 15 then (case when random() < 0.5 then 1 else 0 end)
                            when f = 21 then 2
                            else 1 end;
        for k in 1..stone_count loop
            el := els[1 + floor(random() * 4)::int];
            stones := jsonb_set(stones, array[el], to_jsonb(coalesce((stones->>el)::int, 0) + 1), true);
        end loop;
    end loop;

    rewards := jsonb_build_object(
        'gold', gold, 'diamonds', dia, 'planks', planks, 'refineOre', ore, 'elementStones', stones
    );
    if n = 21 then rewards := rewards || '{"chest": "costume"}'::jsonb; end if;

    select name into sender from public.profiles where user_id = me;
    insert into public.mail (recipient_id, title, sender, message, rewards)
    values (p_friend, 'Warded Tower', coalesce(sender, 'Friend'),
            'Your share of the Warded Tower: floors 1 to ' || n || ' cleared with you.', rewards);

    return rewards;
end $$;

revoke execute on function public.send_tower_rewards(uuid, int) from public, anon;
grant execute on function public.send_tower_rewards(uuid, int) to authenticated;
