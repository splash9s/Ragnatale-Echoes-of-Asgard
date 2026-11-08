-- Ragnatale: unique player names.
-- Run once in the SQL editor of project krtzvossvqddhveozcnb, after friends.sql.

-- Older profiles may already share a name (for example the default 'Hero').
-- Keep the first row of each name and give the others a short suffix from their friend ID.
with ranked as (
    select user_id, row_number() over (partition by lower(name) order by user_id) as rn
    from public.profiles
)
update public.profiles p
set name = left(p.name, 13) || ' ' || left(p.friend_code, 4)
from ranked r
where p.user_id = r.user_id and r.rn > 1;

-- No two players can have the same name, ignoring upper and lower case.
create unique index if not exists profiles_name_lower_key on public.profiles (lower(name));

-- Called by the game before a name is used. True when no other player has it.
-- A player's own current name counts as free.
create or replace function public.name_available(p_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_name text := btrim(coalesce(p_name, ''));
begin
    if auth.uid() is null then
        raise exception 'Sign in first';
    end if;
    if v_name = '' then
        return false;
    end if;
    return not exists (
        select 1 from public.profiles
        where lower(name) = lower(v_name) and user_id <> auth.uid()
    );
end;
$$;

revoke all on function public.name_available(text) from public, anon;
grant execute on function public.name_available(text) to authenticated;
