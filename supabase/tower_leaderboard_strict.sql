-- Warded Tower leaderboard: stricter checks. Run once in the Supabase SQL editor,
-- after supabase/tower_leaderboard.sql.
--
-- The server now keeps the clock. The game asks the server to start a run, then reports
-- each floor as it is cleared. The server checks every report and records the time it
-- measured itself, so a time sent by the game is never trusted.
--
-- Checks:
--   * a floor counts only inside a run the server started for this player
--   * floors must be reported in order, one at a time (1, 2, 3 ... 21), never skipped
--   * each floor must take at least 3 seconds of real (server) time
--   * a run expires 3 hours after it starts
--   * starting a new run ends the old one (one active run per player)
--   * the old submit_tower_record (time sent by the game) is removed

create table if not exists public.tower_runs (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  run_id     uuid not null default gen_random_uuid(),
  started_at timestamptz not null default now(),
  floor      int not null default 0,
  last_at    timestamptz not null default now()
);

alter table public.tower_runs enable row level security;
-- No policies: the table is read and written only by the functions below.

-- Starts (or restarts) this player's run; returns the run id the game sends with each floor
create or replace function public.start_tower_run()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run uuid := gen_random_uuid();
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into public.tower_runs (user_id, run_id, started_at, floor, last_at)
  values (auth.uid(), v_run, now(), 0, now())
  on conflict (user_id) do update
    set run_id = v_run, started_at = now(), floor = 0, last_at = now();
  return v_run;
end;
$$;

-- Reports a cleared floor. Records the server-measured time when it beats the player's best.
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
  insert into public.tower_records (user_id, floor, time_ms, updated_at)
  values (auth.uid(), p_floor, v_ms, now())
  on conflict (user_id) do update
    set floor = excluded.floor, time_ms = excluded.time_ms, updated_at = now()
    where excluded.floor > public.tower_records.floor
       or (excluded.floor = public.tower_records.floor and excluded.time_ms < public.tower_records.time_ms);
end;
$$;

grant execute on function public.start_tower_run() to authenticated;
grant execute on function public.tower_floor_clear(uuid, int) to authenticated;

-- The old path took the time from the game; remove it
drop function if exists public.submit_tower_record(int, bigint);

-- Optional: clear records saved before these checks existed (remove the two dashes to run it)
-- truncate public.tower_records;
