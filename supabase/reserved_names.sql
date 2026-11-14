-- Ragnatale: reserved player names (staff-like names cannot be used).
-- Run once in the SQL editor after names.sql. Replaces public.name_available.

create or replace function public.name_available(p_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_name text := btrim(coalesce(p_name, ''));
    v_norm text := regexp_replace(lower(v_name), '[^a-z0-9]', '', 'g');
begin
    if auth.uid() is null then
        raise exception 'Sign in first';
    end if;
    if v_name = '' then
        return false;
    end if;
    -- Reserved: staff-like words, checked ignoring case, spaces and symbols
    if v_norm in ('gm', 'mod', 'dev', 'sys', 'op')
       or v_norm like '%admin%' or v_norm like '%gamemaster%' or v_norm like '%gamemod%'
       or v_norm like '%moderator%' or v_norm like '%gamesupport%' or v_norm like '%support%'
       or v_norm like '%staff%' or v_norm like '%official%' or v_norm like '%system%'
       or v_norm like '%developer%' or v_norm like '%owner%' or v_norm like '%superuser%'
       or v_norm like '%root%' then
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
