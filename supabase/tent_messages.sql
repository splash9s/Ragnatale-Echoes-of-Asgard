-- Rune Thread: tent messages, a pager between friends. Replaces guestbook.sql and guestbook_unread.sql
-- (this file drops them). Run once in the SQL editor of project krtzvossvqddhveozcnb, after friends.sql.
-- Messages are up to 32 characters, kept for 7 days. A visitor writes on a friend's tent; the owner replies
-- from the same Guest Book, and the reply goes back to the visitor. Either side can read the whole thread.

drop function if exists public.guestbook_write(uuid, text);
drop function if exists public.guestbook_list();
drop function if exists public.guestbook_delete(bigint);
drop function if exists public.guestbook_unread();
drop table if exists public.tent_guestbook;

create table if not exists public.tent_messages (
    id bigserial primary key,
    sender_id uuid not null references auth.users(id) on delete cascade,
    recipient_id uuid not null references auth.users(id) on delete cascade,
    sender_name text not null default 'Hero',
    body text not null check (char_length(body) between 1 and 32),
    created_at timestamptz not null default now(),
    read_by_recipient boolean not null default false
);
create index if not exists tent_messages_recipient_idx on public.tent_messages (recipient_id, created_at desc);
create index if not exists tent_messages_sender_idx on public.tent_messages (sender_id, created_at desc);
create index if not exists tent_messages_created_idx on public.tent_messages (created_at);

-- No direct access: everything goes through the functions below.
alter table public.tent_messages enable row level security;

-- Send a message to a friend (the visitor writing on their tent, or the owner replying). Only friends can.
create or replace function public.pager_send(p_to uuid, p_body text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    v_body text := btrim(coalesce(p_body, ''));
    my_name text;
    row_data jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    if p_to = me then raise exception 'You cannot message yourself'; end if;
    if char_length(v_body) < 1 then raise exception 'Write a message first'; end if;
    if char_length(v_body) > 32 then raise exception 'Messages can be up to 32 characters'; end if;
    if not exists (select 1 from public.friendships where owner_id = me and friend_id = p_to) then
        raise exception 'Not in your friend list';
    end if;

    delete from public.tent_messages where created_at < now() - interval '7 days';

    select coalesce(p.name, 'Hero') into my_name from public.profiles p where p.user_id = me;
    insert into public.tent_messages (sender_id, recipient_id, sender_name, body)
    values (me, p_to, coalesce(my_name, 'Hero'), v_body)
    returning jsonb_build_object('id', id, 'sender_id', sender_id, 'recipient_id', recipient_id,
                                 'sender_name', sender_name, 'body', body, 'created_at', created_at)
    into row_data;
    return row_data;
end $$;

-- The thread with one friend: both sides, last 7 days, newest first (up to 100).
-- Messages sent to the caller are marked read. Each row says whether it is from the caller.
create or replace function public.pager_thread(p_with uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    result jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_messages where created_at < now() - interval '7 days';

    select coalesce(jsonb_agg(jsonb_build_object(
        'id', t.id,
        'mine', t.sender_id = me,
        'sender_name', t.sender_name,
        'body', t.body,
        'created_at', t.created_at
    ) order by t.created_at desc, t.id desc), '[]'::jsonb) into result
    from (
        select * from public.tent_messages
        where (sender_id = me and recipient_id = p_with) or (sender_id = p_with and recipient_id = me)
        order by created_at desc, id desc limit 100
    ) t;

    update public.tent_messages set read_by_recipient = true
    where recipient_id = me and sender_id = p_with and not read_by_recipient;
    return result;
end $$;

-- All the caller's conversations (sent or received), newest first. Each shows the partner, the last
-- message and how many messages from them are unread.
create or replace function public.pager_inbox() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    result jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_messages where created_at < now() - interval '7 days';

    with mine as (
        select case when sender_id = me then recipient_id else sender_id end as partner_id, *
        from public.tent_messages
        where sender_id = me or recipient_id = me
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

-- How many messages sent to the caller are unread (drives the red mark on the Guest Book icon).
create or replace function public.pager_unread() returns int
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    n int;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select count(*) into n from public.tent_messages where recipient_id = me and not read_by_recipient;
    return n;
end $$;

-- The caller deletes a message they received.
create or replace function public.pager_delete(p_id bigint) returns boolean
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    removed int;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_messages where id = p_id and recipient_id = me;
    get diagnostics removed = row_count;
    return removed > 0;
end $$;

revoke execute on function public.pager_send(uuid, text) from public, anon;
revoke execute on function public.pager_thread(uuid) from public, anon;
revoke execute on function public.pager_inbox() from public, anon;
revoke execute on function public.pager_unread() from public, anon;
revoke execute on function public.pager_delete(bigint) from public, anon;
grant execute on function public.pager_send(uuid, text) to authenticated;
grant execute on function public.pager_thread(uuid) to authenticated;
grant execute on function public.pager_inbox() to authenticated;
grant execute on function public.pager_unread() to authenticated;
grant execute on function public.pager_delete(bigint) to authenticated;
