-- Market: browse open auctions with gear filters. Run once in the Supabase SQL editor (after market.sql).
--
-- Filters (all optional):
--   p_stat      stat key: atk, def, hp, crit, flee, hit, aspd, armor, block, mdef, res_fire, res_wind, res_earth, res_water
--   p_min       minimum total for that stat (base stats + bonus stats - penalties), like the item detail shows
--   p_rarity    minimum rarity 1..5
--   p_max_level only gear with level requirement at or below this (e.g. the player's level)
--   p_element   weapon element: fire, wind, earth, water
--   p_sort      'ending' (default), 'price_asc', 'price_desc'

create or replace function public.auction_browse_filter(
    p_category text default 'all', p_offset int default 0,
    p_stat text default null, p_min numeric default null, p_rarity int default null,
    p_max_level int default null, p_element text default null, p_sort text default 'ending'
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    me uuid := auth.uid();
    rows jsonb;
begin
    if me is null then raise exception 'Sign in first'; end if;
    select coalesce(jsonb_agg(to_jsonb(r) - 'rn' order by r.rn), '[]'::jsonb) into rows from (
        select id, item, category, seller_name, start_price, current_price, bid_count, top_bidder_name,
               duration_hours, ends_at,
               (seller_id = me) as is_mine, (top_bidder_id = me) as i_lead,
               row_number() over (order by
                   case when p_sort = 'price_asc' then current_price end asc,
                   case when p_sort = 'price_desc' then current_price end desc,
                   ends_at) as rn
        from public.auction_listings l
        where status = 'open' and ends_at > now()
          and (p_category is null or p_category = 'all' or category = p_category)
          and (p_rarity is null or coalesce((item->>'rarity')::int, 1) >= p_rarity)
          and (p_max_level is null or coalesce((item->>'levelReq')::int, 1) <= p_max_level)
          and (p_element is null or p_element = '' or item->>'element' = p_element)
          and (p_stat is null or p_stat = '' or (
                coalesce((item->'stats'->>p_stat)::numeric, 0)
              + coalesce((select sum((b->>'value')::numeric) from jsonb_array_elements(coalesce(item->'buffs', '[]'::jsonb)) b where b->>'stat' = p_stat), 0)
              + coalesce((select sum((d->>'value')::numeric) from jsonb_array_elements(coalesce(item->'debuffs', '[]'::jsonb)) d where d->>'stat' = p_stat), 0)
              ) >= coalesce(p_min, 1))
        order by rn
        limit 50 offset greatest(0, p_offset)
    ) r;
    return rows;
end $$;

grant execute on function public.auction_browse_filter(text, int, text, numeric, int, int, text, text) to authenticated;
