-- Rune Thread: unread guest book messages. Run once in the SQL editor of project krtzvossvqddhveozcnb,
-- after guestbook.sql. Safe to re-run.

-- Whether the owner has seen the message yet
alter table public.tent_guestbook add column if not exists read_by_owner boolean not null default false;

-- How many messages on the caller's tent the owner has not read yet
create or replace function public.guestbook_unread() returns int
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    n int;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select count(*) into n from public.tent_guestbook where owner_id = me and not read_by_owner;
    return n;
end $$;

-- The owner's guest book, newest first. Each row says whether it was unread; opening the list marks them read.
create or replace function public.guestbook_list() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    result jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select coalesce(jsonb_agg(jsonb_build_object(
        'id', g.id,
        'writer_name', g.writer_name,
        'body', g.body,
        'created_at', g.created_at,
        'unread', not g.read_by_owner
    ) order by g.created_at desc, g.id desc), '[]'::jsonb) into result
    from (
        select * from public.tent_guestbook where owner_id = me
        order by created_at desc, id desc limit 100
    ) g;

    update public.tent_guestbook set read_by_owner = true where owner_id = me and not read_by_owner;
    return result;
end $$;

revoke execute on function public.guestbook_unread() from public, anon;
grant execute on function public.guestbook_unread() to authenticated;
