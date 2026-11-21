-- Developer mail to any player: writes a server mail that the recipient receives on their next sync.
-- Recipient: a player ID (friend_code) or a unique player name. Admin only.
create or replace function public.admin_send_mail(p_to text, p_title text, p_sender text, p_message text, p_rewards jsonb)
returns text
language plpgsql security definer set search_path = public as $$
declare
    q text := btrim(coalesce(p_to, ''));
    target public.profiles;
    matches int;
begin
    if not public.is_admin() then raise exception 'Admin only'; end if;
    if q = '' then raise exception 'Type a player name or ID'; end if;

    select * into target from public.profiles where friend_code = upper(q);
    if not found then
        select count(*) into matches from public.profiles where lower(name) = lower(q);
        if matches = 0 then raise exception 'No player found'; end if;
        if matches > 1 then raise exception 'Several players have that name. Use their ID instead.'; end if;
        select * into target from public.profiles where lower(name) = lower(q);
    end if;

    insert into public.mail (recipient_id, title, sender, message, rewards)
    values (target.user_id, coalesce(nullif(btrim(p_title), ''), 'Mail'), coalesce(nullif(btrim(p_sender), ''), 'System'),
            coalesce(p_message, ''), coalesce(p_rewards, '{}'::jsonb));
    return target.name;
end;
$$;

revoke execute on function public.admin_send_mail(text, text, text, text, jsonb) from public, anon;
grant execute on function public.admin_send_mail(text, text, text, text, jsonb) to authenticated;
