-- Ragnatale: player stats, suspicious activity and the developer dashboard.
-- Run after schema.sql (any time after that). Safe to re-run.
-- Only the owner's Google account (is_admin below) can read the admin functions.

create table if not exists public.user_stats (
    user_id uuid primary key references auth.users(id) on delete cascade,
    login_method text not null default 'anonymous',
    first_seen timestamptz not null default now(),
    last_seen timestamptz not null default now(),
    last_touch timestamptz not null default 'epoch',
    play_seconds bigint not null default 0,
    play_days date[] not null default '{}'
);

create table if not exists public.suspicious_events (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    kind text not null,
    detail jsonb,
    created_at timestamptz not null default now()
);

-- No direct table access from the game: everything goes through the functions below
alter table public.user_stats enable row level security;
alter table public.suspicious_events enable row level security;

-- The owner's Google account only (anonymous and other accounts are refused)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce(auth.jwt() ->> 'email', '') = 'splash6s7s8s@gmail.com'
       and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

-- The game sends the seconds played since its last call (client total).
-- Each call is capped at 120 seconds and at most one call every 20 seconds per player.
create or replace function public.touch_stats(p_seconds int) returns void
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    today date := (now() at time zone 'Asia/Bangkok')::date;
    secs int := coalesce(p_seconds, 0);
    method text := case when coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
                        then 'anonymous' else coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', 'email') end;
    last_t timestamptz;
begin
    if me is null then raise exception 'Not signed in'; end if;
    select last_touch into last_t from public.user_stats where user_id = me;
    if last_t is not null and last_t > now() - interval '20 seconds' then
        insert into public.suspicious_events (user_id, kind, detail)
            values (me, 'stats_too_fast', jsonb_build_object('seconds', secs));
        return;
    end if;
    if secs > 120 then
        insert into public.suspicious_events (user_id, kind, detail)
            values (me, 'stats_over_cap', jsonb_build_object('seconds', secs));
        secs := 120;
    end if;
    secs := greatest(0, secs);
    insert into public.user_stats (user_id, login_method, first_seen, last_seen, last_touch, play_seconds, play_days)
        values (me, method, now(), now(), now(), secs, array[today])
    on conflict (user_id) do update set
        login_method = excluded.login_method,
        last_seen = now(),
        last_touch = now(),
        play_seconds = public.user_stats.play_seconds + excluded.play_seconds,
        play_days = case when today = any (public.user_stats.play_days)
                         then public.user_stats.play_days
                         else array_append(public.user_stats.play_days, today) end;
end;
$$;

-- Suspicious activity from the game (for example a browser that looks automated).
-- Each player can log at most 30 events an hour, so one client cannot flood the table.
create or replace function public.log_suspicious(p_kind text, p_detail jsonb default null) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
    if me is null then raise exception 'Not signed in'; end if;
    if (select count(*) from public.suspicious_events where user_id = me and created_at > now() - interval '1 hour') >= 30 then
        return;
    end if;
    insert into public.suspicious_events (user_id, kind, detail)
        values (me, left(coalesce(p_kind, 'unknown'), 40), p_detail);
end;
$$;

-- ---- Admin functions (owner only) ----

-- Whether the signed-in account is the owner (the game checks this to show the dashboard)
create or replace function public.admin_check() returns boolean
language sql stable security definer set search_path = public as $$
    select public.is_admin();
$$;

-- Overview: player counts, login methods, playtime and days played
create or replace function public.admin_overview() returns jsonb
language plpgsql security definer set search_path = public as $$
begin
    if not public.is_admin() then raise exception 'Admin only'; end if;
    return jsonb_build_object(
        'players', (select count(*) from public.user_stats),
        'saves', (select count(*) from public.saves),
        'by_login', (select coalesce(jsonb_object_agg(login_method, n), '{}'::jsonb) from (select login_method, count(*) n from public.user_stats group by login_method) s),
        'active_24h', (select count(*) from public.user_stats where last_seen > now() - interval '24 hours'),
        'active_7d', (select count(*) from public.user_stats where last_seen > now() - interval '7 days'),
        'playtime', jsonb_build_object(
            'under_10_min', (select count(*) from public.user_stats where play_seconds < 600),
            'over_10_min', (select count(*) from public.user_stats where play_seconds >= 600),
            'under_1_hour', (select count(*) from public.user_stats where play_seconds < 3600),
            'over_5_hours', (select count(*) from public.user_stats where play_seconds >= 18000)),
        'days_played', jsonb_build_object(
            'day_1', (select count(*) from public.user_stats where cardinality(play_days) = 1),
            'day_2', (select count(*) from public.user_stats where cardinality(play_days) = 2),
            'day_3', (select count(*) from public.user_stats where cardinality(play_days) = 3),
            'day_4', (select count(*) from public.user_stats where cardinality(play_days) = 4),
            'day_5', (select count(*) from public.user_stats where cardinality(play_days) = 5),
            'day_6', (select count(*) from public.user_stats where cardinality(play_days) = 6),
            'day_7_plus', (select count(*) from public.user_stats where cardinality(play_days) >= 7)),
        'suspicious_24h', (select count(*) from public.suspicious_events where created_at > now() - interval '24 hours'),
        'suspicious_by_kind', (select coalesce(jsonb_object_agg(kind, n), '{}'::jsonb) from
            (select kind, count(*) n from public.suspicious_events where created_at > now() - interval '7 days' group by kind) k)
    );
end;
$$;

-- Recent players: name, login, playtime, days played, last seen
create or replace function public.admin_users(p_limit int default 50) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
    if not public.is_admin() then raise exception 'Admin only'; end if;
    return coalesce((select jsonb_agg(x) from (
        select jsonb_build_object(
            'user_id', s.user_id, 'name', coalesce(p.name, '?'), 'login', s.login_method,
            'play_minutes', round(s.play_seconds / 60.0, 1),
            'days', cardinality(s.play_days), 'first_seen', s.first_seen, 'last_seen', s.last_seen) as x
        from public.user_stats s left join public.profiles p on p.user_id = s.user_id
        order by s.last_seen desc limit greatest(1, least(p_limit, 200))) q), '[]'::jsonb);
end;
$$;

-- Latest suspicious events
create or replace function public.admin_suspicious(p_limit int default 50) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
    if not public.is_admin() then raise exception 'Admin only'; end if;
    return coalesce((select jsonb_agg(x) from (
        select jsonb_build_object(
            'at', e.created_at, 'kind', e.kind, 'detail', e.detail,
            'user_id', e.user_id, 'name', coalesce(p.name, '?')) as x
        from public.suspicious_events e left join public.profiles p on p.user_id = e.user_id
        order by e.created_at desc limit greatest(1, least(p_limit, 200))) q), '[]'::jsonb);
end;
$$;

revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.touch_stats(int) from public, anon;
revoke execute on function public.log_suspicious(text, jsonb) from public, anon;
revoke execute on function public.admin_check() from public, anon;
revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.admin_users(int) from public, anon;
revoke execute on function public.admin_suspicious(int) from public, anon;
grant execute on function public.touch_stats(int) to authenticated;
grant execute on function public.log_suspicious(text, jsonb) to authenticated;
grant execute on function public.admin_check() to authenticated;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_users(int) to authenticated;
grant execute on function public.admin_suspicious(int) to authenticated;
