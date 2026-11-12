-- Ragnatale: visit a friend's tent (read-only) and the visitor log kept for 3 days.
-- Run once in the SQL editor of project krtzvossvqddhveozcnb, after friends.sql (and requests.sql).

-- Who visited whose tent. Rows older than 3 days are deleted whenever a visit is made or the list is read.
create table if not exists public.tent_visits (
    id bigserial primary key,
    owner_id uuid not null references auth.users(id) on delete cascade,
    visitor_id uuid not null references auth.users(id) on delete cascade,
    visited_at timestamptz not null default now()
);
create index if not exists tent_visits_owner_idx on public.tent_visits (owner_id, visited_at desc);

-- No direct access: everything goes through the functions below.
alter table public.tent_visits enable row level security;

-- Visit a friend's tent. Only friends (in the caller's own friend list) can visit.
-- Returns only what the tent needs: look, stats, skills, runes, tent pets and pet items.
-- Gold, diamonds, mail, quests, potions and other items are never sent.
create or replace function public.visit_friend_tent(p_friend uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    snap jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    if not exists (select 1 from public.friendships where owner_id = me and friend_id = p_friend) then
        raise exception 'Not in your friend list';
    end if;

    select s.data into snap from public.saves s where s.user_id = p_friend;
    if snap is null then raise exception 'That player has no saved tent yet'; end if;

    delete from public.tent_visits where visited_at < now() - interval '3 days';
    insert into public.tent_visits (owner_id, visitor_id) values (p_friend, me);

    return jsonb_build_object(
        'name', coalesce(snap->'name', to_jsonb('Hero'::text)),
        'avatar', snap->'avatar',
        'baseLv', snap->'baseLv',
        'jobLv', snap->'jobLv',
        'stats', snap->'stats',
        'skills', snap->'skills',
        'equipped', snap->'equipped',
        'runes', snap->'runes',
        'tentPets', coalesce(snap->'tentPets', '[]'::jsonb),
        'inventory', (
            select coalesce(jsonb_agg(case when e->>'slot' = 'pet' then e else 'null'::jsonb end order by ord), '[]'::jsonb)
            from jsonb_array_elements(coalesce(snap->'inventory', '[]'::jsonb)) with ordinality as t(e, ord)
        )
    );
end $$;

-- The owner's visitor list: the last 3 days of visits, newest first.
create or replace function public.my_tent_visitors() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    result jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    delete from public.tent_visits where visited_at < now() - interval '3 days';
    select coalesce(jsonb_agg(row_data order by row_data->>'visited_at' desc), '[]'::jsonb) into result
    from (
        select jsonb_build_object(
            'name', coalesce(p.name, 'Hero'),
            'visited_at', v.visited_at
        ) as row_data
        from public.tent_visits v
        left join public.profiles p on p.user_id = v.visitor_id
        where v.owner_id = me
        order by v.visited_at desc
        limit 50
    ) s;
    return result;
end $$;

revoke execute on function public.visit_friend_tent(uuid) from public, anon;
revoke execute on function public.my_tent_visitors() from public, anon;
grant execute on function public.visit_friend_tent(uuid) to authenticated;
grant execute on function public.my_tent_visitors() to authenticated;
