-- Ragnatale: how many players use each function (shown on the developer dashboard).
-- Run after admin.sql. Safe to re-run.

create table if not exists public.feature_usage (
    user_id uuid not null references auth.users(id) on delete cascade,
    feature text not null,
    uses bigint not null default 0,
    last_used timestamptz not null default now(),
    primary key (user_id, feature)
);
alter table public.feature_usage enable row level security;

-- Features the game may report (anything else is ignored)
create or replace function public.feature_name_ok(p text) returns boolean
language sql immutable as $$
    select p in ('town','shop','blacksmith','market','diamond','vip','events','friend','mail','setting','quests','skills','tent','puzzle','pets','expedition','diamond_buy','void_tower','inventory');
$$;

-- The game reports one use of a feature (one call per feature per 5 seconds, enforced by the client)
create or replace function public.log_feature(p_feature text) returns void
language plpgsql security definer set search_path = public as $$
begin
    if auth.uid() is null or not public.feature_name_ok(p_feature) then return; end if;
    insert into public.feature_usage (user_id, feature, uses, last_used)
    values (auth.uid(), p_feature, 1, now())
    on conflict (user_id, feature)
    do update set uses = public.feature_usage.uses + 1, last_used = now();
end;
$$;

-- Per feature: how many players used it, and how many times in total
create or replace function public.admin_feature_usage() returns jsonb
language plpgsql security definer set search_path = public as $$
begin
    if not public.is_admin() then raise exception 'Admin only'; end if;
    return coalesce((
        select jsonb_agg(jsonb_build_object('feature', feature, 'players', players, 'uses', uses, 'last_used', last_used)
                         order by players desc, feature)
        from (select feature, count(*) players, sum(uses) uses, max(last_used) last_used
              from public.feature_usage group by feature) f
    ), '[]'::jsonb);
end;
$$;

revoke execute on function public.log_feature(text) from public, anon;
revoke execute on function public.admin_feature_usage() from public, anon;
grant execute on function public.log_feature(text) to authenticated;
grant execute on function public.admin_feature_usage() to authenticated;
