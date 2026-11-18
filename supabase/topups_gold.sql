-- Rune Thread: gold top-ups. Run once in the SQL editor of project krtzvossvqddhveozcnb, after topups.sql.
-- Adds a gold column to diamond_topups, lets a row carry gold only, and makes claim_diamond_topups() return both totals.

alter table public.diamond_topups add column if not exists gold integer not null default 0 check (gold >= 0);

-- Gold-only rows have 0 diamonds, so the diamonds check must allow 0
alter table public.diamond_topups drop constraint if exists diamond_topups_diamonds_check;
alter table public.diamond_topups add constraint diamond_topups_diamonds_check check (diamonds >= 0);

drop function if exists public.claim_diamond_topups();

create function public.claim_diamond_topups() returns json
language sql security definer set search_path = public as $$
  with c as (
    update public.diamond_topups
       set claimed = true
     where user_id = auth.uid() and claimed = false
    returning diamonds, gold
  )
  select json_build_object(
    'diamonds', coalesce(sum(diamonds), 0)::integer,
    'gold', coalesce(sum(gold), 0)::integer
  ) from c;
$$;

revoke all on function public.claim_diamond_topups() from public;
grant execute on function public.claim_diamond_topups() to authenticated;
