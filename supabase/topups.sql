-- Rune Thread: Stripe diamond top-ups. Run once in the SQL editor of project krtzvossvqddhveozcnb.
-- The stripe-webhook function writes a row per paid checkout (payment_id is unique, so a repeat call cannot credit twice).
-- The game calls claim_diamond_topups() on sign-in, which adds unclaimed diamonds once and marks them claimed.

create table if not exists public.diamond_topups (
  payment_id text primary key,
  user_id uuid not null,
  diamonds integer not null check (diamonds > 0),
  amount_total integer,
  currency text,
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists diamond_topups_unclaimed_idx on public.diamond_topups (user_id) where claimed = false;

alter table public.diamond_topups enable row level security;

drop policy if exists "own topups" on public.diamond_topups;
create policy "own topups" on public.diamond_topups
  for select using (auth.uid() = user_id);

-- Claims every unclaimed top-up for the signed-in player in one statement and returns the total diamonds.
create or replace function public.claim_diamond_topups() returns integer
language sql security definer set search_path = public as $$
  with c as (
    update public.diamond_topups
       set claimed = true
     where user_id = auth.uid() and claimed = false
    returning diamonds
  )
  select coalesce(sum(diamonds), 0)::integer from c;
$$;

revoke all on function public.claim_diamond_topups() from public;
grant execute on function public.claim_diamond_topups() to authenticated;
