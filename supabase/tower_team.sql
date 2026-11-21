-- Warded Tower leaderboard: show the team (the friends who came along) with each record.
-- Run once in the Supabase SQL editor, after tower_leaderboard_strict.sql.
--
-- The game sends the chosen friends when the run starts. The server keeps only players who are
-- really on this player's friend list (at most 2), stores them with the run, and copies them to
-- the record when the record improves. The leaderboard returns each friend's name, level and avatar.

alter table public.tower_runs    add column if not exists team uuid[] not null default '{}';
alter table public.tower_records add column if not exists team uuid[] not null default '{}';

-- Replaces start_tower_run(): same job, now with the team
drop function if exists public.start_tower_run();
create or replace function public.start_tower_run(p_team uuid[] default '{}')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run uuid := gen_random_uuid();
  v_team uuid[];
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  -- keep only real friends, in the order sent, at most 2
  select coalesce(array_agg(t.id order by t.ord), '{}') into v_team
  from (
    select x.id, min(x.ord) as ord
    from unnest(coalesce(p_team, '{}')) with ordinality as x(id, ord)
    where exists (select 1 from public.friendships f where f.owner_id = auth.uid() and f.friend_id = x.id)
    group by x.id
    order by min(x.ord)
    limit 2
  ) t;
  insert into public.tower_runs (user_id, run_id, started_at, floor, last_at, team)
  values (auth.uid(), v_run, now(), 0, now(), v_team)
  on conflict (user_id) do update
    set run_id = v_run, started_at = now(), floor = 0, last_at = now(), team = v_team;
  return v_run;
end;
$$;
grant execute on function public.start_tower_run(uuid[]) to authenticated;

-- Same checks as before; the record now also keeps the run's team
create or replace function public.tower_floor_clear(p_run uuid, p_floor int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.tower_runs%rowtype;
  v_ms bigint;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into r from public.tower_runs where user_id = auth.uid() for update;
  if not found or r.run_id <> p_run then raise exception 'no such run'; end if;
  if now() - r.started_at > interval '3 hours' then raise exception 'run expired'; end if;
  if p_floor <> r.floor + 1 or p_floor > 21 then raise exception 'floor out of order'; end if;
  if now() - r.last_at < interval '3 seconds' then raise exception 'floor cleared too fast'; end if;

  update public.tower_runs set floor = p_floor, last_at = now() where user_id = auth.uid();

  v_ms := floor(extract(epoch from (now() - r.started_at)) * 1000)::bigint;
  insert into public.tower_records (user_id, floor, time_ms, updated_at, team)
  values (auth.uid(), p_floor, v_ms, now(), coalesce(r.team, '{}'))
  on conflict (user_id) do update
    set floor = excluded.floor, time_ms = excluded.time_ms, updated_at = now(), team = excluded.team
    where excluded.floor > public.tower_records.floor
       or (excluded.floor = public.tower_records.floor and excluded.time_ms < public.tower_records.time_ms);
end;
$$;
grant execute on function public.tower_floor_clear(uuid, int) to authenticated;

-- The leaderboard now has a team column: [{name, base_lv, avatar}, ...] in the order the player picked
drop function if exists public.tower_leaderboard();
create or replace function public.tower_leaderboard()
returns table (rank int, name text, base_lv int, avatar text, floor int, time_ms bigint, team jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select
    row_number() over (order by r.floor desc, r.time_ms asc)::int as rank,
    coalesce(p.name, 'Hero') as name,
    coalesce(p.base_lv, 1) as base_lv,
    coalesce(p.avatar, '') as avatar,
    r.floor,
    r.time_ms,
    coalesce((
      select jsonb_agg(jsonb_build_object('name', coalesce(fp.name, 'Hero'), 'base_lv', coalesce(fp.base_lv, 1), 'avatar', coalesce(fp.avatar, '')) order by t.ord)
      from unnest(r.team) with ordinality as t(id, ord)
      left join public.profiles fp on fp.user_id = t.id
    ), '[]'::jsonb) as team
  from public.tower_records r
  left join public.profiles p on p.user_id = r.user_id
  order by r.floor desc, r.time_ms asc
  limit 5;
$$;
grant execute on function public.tower_leaderboard() to authenticated;
