-- Rune Thread: refunds take diamonds and gold back. Run once in the SQL editor of project krtzvossvqddhveozcnb, after topups_gold.sql.
-- Top-up rows now remember the Stripe payment intent, so a refund can find the row it reverses.
-- A refund is written as a negative row. The game subtracts it on the player's next sign-in, and never goes below zero.

alter table public.diamond_topups add column if not exists payment_intent text;
create index if not exists diamond_topups_pi_idx on public.diamond_topups (payment_intent);

-- Negative rows are needed for refunds
alter table public.diamond_topups drop constraint if exists diamond_topups_diamonds_check;
alter table public.diamond_topups drop constraint if exists diamond_topups_gold_check;
