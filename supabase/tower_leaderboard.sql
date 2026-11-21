-- Warded Tower leaderboard: one best record per player.
-- Ranking: furthest floor first, then the fastest time to reach that floor.
-- Run once in the Supabase SQL editor (the profiles table already exists).

create table if not exists public.tower_records (
  user_id uuid primary key references auth.users(id) on delete cascade,
  floor int not null check (floor >= 1),
  time_ms bigint not null check (time_ms >= 0),
  updated_at timestamptz not null default now()
);

alter table public.tower_records enable row level security;

drop policy if exists "tower records readable" on public.tower_records;
create policy "tower records readable" on public.tower_records
  for select to authenticated using (true);
-- No insert or update policy: rows are written only by submit_tower_record below.

create or replace function public.submit_tower_record(p_floor int, p_time_ms bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_floor < 1 or p_floor > 99 or p_time_ms < 0 then raise exception 'bad record'; end if;
  insert into public.tower_records (user_id, floor, time_ms, updated_at)
  values (auth.uid(), p_floor, p_time_ms, now())
  on conflict (user_id) do update
    set floor = excluded.floor, time_ms = excluded.time_ms, updated_at = now()
    where excluded.floor > public.tower_records.floor
       or (excluded.floor = public.tower_records.floor and excluded.time_ms < public.tower_records.time_ms);
end;
$$;

grant execute on function public.submit_tower_record(int, bigint) to authenticated;

create or replace function public.tower_leaderboard()
returns table (rank int, name text, base_lv int, avatar text, floor int, time_ms bigint)
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
    r.time_ms
  from public.tower_records r
  left join public.profiles p on p.user_id = r.user_id
  order by r.floor desc, r.time_ms asc
  limit 5;
$$;

grant execute on function public.tower_leaderboard() to authenticated;
