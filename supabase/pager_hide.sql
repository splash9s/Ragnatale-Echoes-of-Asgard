-- Rune Thread: delete a whole conversation from your own Guest Book (the other side keeps it).
-- Run once in the SQL editor of project krtzvossvqddhveozcnb, after tent_messages.sql. Safe to re-run.
-- Messages sent before you deleted the conversation stop showing for you; new messages show again.

create table if not exists public.tent_pager_hides (
    owner_id uuid not null references auth.users(id) on delete cascade,
    partner_id uuid not null references auth.users(id) on delete cascade,
    hidden_before timestamptz not null default now(),
    primary key (owner_id, partner_id)
);
alter table public.tent_pager_hides enable row level security;

-- Delete the conversation with one friend from your own Guest Book.
create or replace function public.pager_hide_conversation(p_with uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
begin
    if me is null then raise exception 'Sign in first'; end if;
    insert into public.tent_pager_hides (owner_id, partner_id, hidden_before)
    values (me, p_with, now())
    on conflict (owner_id, partner_id) do update set hidden_before = excluded.hidden_before;
    return true;
end $$;

-- The thread with one friend: both sides, last 7 days, newest first (up to 100), minus anything you deleted.
create or replace function public.pager_thread(p_with uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    since timestamptz;
    result jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_messages where created_at < now() - interval '7 days';
    select h.hidden_before into since from public.tent_pager_hides h where h.owner_id = me and h.partner_id = p_with;

    select coalesce(jsonb_agg(jsonb_build_object(
        'id', t.id,
        'mine', t.sender_id = me,
        'sender_name', t.sender_name,
        'body', t.body,
        'created_at', t.created_at
    ) order by t.created_at desc, t.id desc), '[]'::jsonb) into result
    from (
        select * from public.tent_messages
        where ((sender_id = me and recipient_id = p_with) or (sender_id = p_with and recipient_id = me))
          and created_at > coalesce(since, '-infinity'::timestamptz)
        order by created_at desc, id desc limit 100
    ) t;

    update public.tent_messages set read_by_recipient = true
    where recipient_id = me and sender_id = p_with and not read_by_recipient
      and created_at > coalesce(since, '-infinity'::timestamptz);
    return result;
end $$;

-- All the caller's conversations, newest first, minus the ones they deleted.
create or replace function public.pager_inbox() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    result jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_messages where created_at < now() - interval '7 days';

    with mine as (
        select case when m.sender_id = me then m.recipient_id else m.sender_id end as partner_id, m.*
        from public.tent_messages m
        where (m.sender_id = me or m.recipient_id = me)
          and m.created_at > coalesce((
                select h.hidden_before from public.tent_pager_hides h
                where h.owner_id = me
                  and h.partner_id = (case when m.sender_id = me then m.recipient_id else m.sender_id end)
              ), '-infinity'::timestamptz)
    ),
    latest as (
        select distinct on (partner_id) partner_id, body as last_body, sender_id as last_sender, created_at as last_at
        from mine order by partner_id, created_at desc, id desc
    ),
    counts as (
        select partner_id, count(*) as unread from mine
        where recipient_id = me and not read_by_recipient group by partner_id
    )
    select coalesce(jsonb_agg(jsonb_build_object(
        'partner_id', l.partner_id,
        'partner_name', coalesce(p.name, 'Hero'),
        'last_body', l.last_body,
        'last_mine', l.last_sender = me,
        'last_at', l.last_at,
        'unread', coalesce(c.unread, 0)
    ) order by l.last_at desc), '[]'::jsonb) into result
    from latest l
    left join counts c on c.partner_id = l.partner_id
    left join public.profiles p on p.user_id = l.partner_id;
    return result;
end $$;

-- Unread messages sent to the caller that are still in a conversation they have not deleted.
create or replace function public.pager_unread() returns int
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    n int;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select count(*) into n from public.tent_messages m
    where m.recipient_id = me and not m.read_by_recipient
      and m.created_at > coalesce((
            select h.hidden_before from public.tent_pager_hides h
            where h.owner_id = me and h.partner_id = m.sender_id
          ), '-infinity'::timestamptz);
    return n;
end $$;

drop function if exists public.pager_delete(bigint);

revoke execute on function public.pager_hide_conversation(uuid) from public, anon;
grant execute on function public.pager_hide_conversation(uuid) to authenticated;
