-- Rune Thread: player feedback from Settings. Run once in the SQL editor of project krtzvossvqddhveozcnb.
-- Players can only add their own rows. Read them in the Table Editor.

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid(),
  player_name text,
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "insert own feedback" on public.feedback;
create policy "insert own feedback" on public.feedback
  for insert to authenticated with check (auth.uid() = user_id);
