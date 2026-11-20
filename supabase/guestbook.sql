-- Rune Thread: the guest book on a tent. A friend writes a message (up to 100 characters) on a tent;
-- the owner reads and deletes them. Run once in the SQL editor of project krtzvossvqddhveozcnb,
-- after friends.sql (and friend_tent.sql).

create table if not exists public.tent_guestbook (
    id bigserial primary key,
    owner_id uuid not null references auth.users(id) on delete cascade,
    writer_id uuid not null references auth.users(id) on delete cascade,
    writer_name text not null default 'Hero',
    body text not null check (char_length(body) between 1 and 100),
    created_at timestamptz not null default now()
);
create index if not exists tent_guestbook_owner_idx on public.tent_guestbook (owner_id, created_at desc);

-- No direct access: everything goes through the functions below.
alter table public.tent_guestbook enable row level security;

-- Write a message on a friend's tent. Only friends (in the caller's own friend list) can write.
-- Each tent keeps its newest 100 messages; older ones are removed.
create or replace function public.guestbook_write(p_owner uuid, p_body text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    body text := btrim(coalesce(p_body, ''));
    my_name text;
    row_data jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    if p_owner = me then raise exception 'You cannot write in your own guest book'; end if;
    if char_length(body) < 1 then raise exception 'Write a message first'; end if;
    if char_length(body) > 100 then raise exception 'Messages can be up to 100 characters'; end if;
    if not exists (select 1 from public.friendships where owner_id = me and friend_id = p_owner) then
        raise exception 'Not in your friend list';
    end if;

    select coalesce(p.name, 'Hero') into my_name from public.profiles p where p.user_id = me;
    insert into public.tent_guestbook (owner_id, writer_id, writer_name, body)
    values (p_owner, me, coalesce(my_name, 'Hero'), body)
    returning jsonb_build_object('id', id, 'writer_name', writer_name, 'body', body, 'created_at', created_at)
    into row_data;

    delete from public.tent_guestbook g
    where g.owner_id = p_owner
      and g.id not in (select id from public.tent_guestbook where owner_id = p_owner order by created_at desc, id desc limit 100);

    return row_data;
end $$;

-- The owner's guest book: newest first.
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
        'created_at', g.created_at
    ) order by g.created_at desc, g.id desc), '[]'::jsonb) into result
    from (
        select * from public.tent_guestbook where owner_id = me
        order by created_at desc, id desc limit 100
    ) g;
    return result;
end $$;

-- The owner deletes one message from their own guest book.
create or replace function public.guestbook_delete(p_id bigint) returns boolean
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    removed int;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_guestbook where id = p_id and owner_id = me;
    get diagnostics removed = row_count;
    return removed > 0;
end $$;

revoke execute on function public.guestbook_write(uuid, text) from public, anon;
revoke execute on function public.guestbook_list() from public, anon;
revoke execute on function public.guestbook_delete(bigint) from public, anon;
grant execute on function public.guestbook_write(uuid, text) to authenticated;
grant execute on function public.guestbook_list() to authenticated;
grant execute on function public.guestbook_delete(bigint) to authenticated;
