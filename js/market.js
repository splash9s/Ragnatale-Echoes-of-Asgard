// ==========================================
// RAGNATALE - MARKET (auction house)
// Gear auctions for gold. Level 10+, Gmail-linked accounts only. Rules are enforced on the server
// (supabase/market.sql); this file shows them and keeps the gold and bag in step with each accepted action.
// Flow: Sell takes the item out of the bag only after the server accepts the listing. Bidding takes gold
// only after the server accepts the bid. Outbid gold, won items and sale gold arrive by mail.
// ==========================================

const MARKET_LEVEL = 10;
const MARKET_FEE_PCT = 5;      // listing fee (paid when listed) and sale fee (taken from the seller's payout)
const MARKET_MAX_GOLD = 1000000000;
const MARKET_CATEGORIES = [
    ['all', 'All'], ['weapon', 'Weapon'], ['shield', 'Shield'], ['armor', 'Armor'], ['hat', 'Hat'],
    ['midHead', 'Mid Head'], ['mouth', 'Mouth'], ['garment', 'Garment'], ['footgear', 'Footgear'], ['ring', 'Ring']
];
const MARKET_DURATIONS = [[6, '6 hours'], [12, '12 hours'], [24, '1 day']];
let marketTab = 'buy';          // buy | sell | mine
let marketCat = 'all';
let marketBusy = false;

function marketEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// Gear slot -> market category (both rings are one category)
function marketCategoryOf(item) {
    const slot = item && item.slot;
    if (slot === 'ringLeft' || slot === 'ringRight' || slot === 'ring') return 'ring';
    return MARKET_CATEGORIES.some(([k]) => k === slot) ? slot : null;
}

// Gear in the bag that can be listed (potions, chests and other non-gear items have no slot)
function marketListableItems() {
    if (!Array.isArray(player.inventory)) return [];
    const out = [];
    player.inventory.forEach((s, i) => { if (s && !s.type && marketCategoryOf(s)) out.push({ idx: i, item: s }); });
    return out;
}

// Item icon that starts each list row
function marketRowIcon(item) {
    return `<span class="shrink-0 flex items-center justify-center" style="width:64px;height:64px;">${itemIconHTML(item, 60)}</span>`;
}

// Calls a market function. Resolves to { data } or { error } with the server's message.
async function marketRpc(name, args) {
    if (!cloudInitClient() || !cloudClient) return { error: 'The market needs the cloud. Check your connection and try again.' };
    try {
        const { data, error } = await cloudClient.rpc(name, args || {});
        if (error) return { error: error.message || 'The market is unavailable right now.' };
        return { data };
    } catch (e) {
        console.warn('Market call failed:', name, e);
        return { error: 'The market is unavailable right now.' };
    }
}

// Client-side pre-check (the server enforces the same rules)
async function marketAccessMessage() {
    if (player.baseLv < MARKET_LEVEL) return `The market opens at level ${MARKET_LEVEL}.`;
    const user = await cloudCurrentUser();
    if (!user) return 'The market needs a cloud save. Sign in first.';
    if (user.is_anonymous) return 'Link your Gmail in Settings to use the market.';
    return null;
}

function marketTimeLeft(endsAt) {
    const ms = Date.parse(endsAt) - Date.now();
    if (!(ms > 0)) return 'ended';
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${Math.max(1, m)}m`;
}

function marketFeeOf(price) { return Math.floor(price * MARKET_FEE_PCT / 100); }

function marketItemText(item) {
    const lvl = item.levelReq ? `Lv. ${item.levelReq} ` : '';
    return `<span class="font-bold text-amber-200">${marketEsc(item.name)}</span> <span class="text-[10px] text-slate-400">${marketEsc(lvl)}${marketEsc(item.desc || '')}</span>`;
}

// Opens the market: settles finished auctions first, so winners and sellers get their mail
async function marketOpen() {
    marketTab = marketTab || 'buy';
    renderMarket();
    const msg = await marketAccessMessage();
    if (msg) { renderMarketNotice(msg); return; }
    const res = await marketRpc('auction_settle');
    if (!res.error && res.data > 0) {
        logMessage(`[Market] ${res.data} auction${res.data > 1 ? 's' : ''} finished. Check your mailbox.`, 'drop');
        if (typeof syncServerMail === 'function') syncServerMail();
    }
    renderMarket();
}

function setMarketTab(tab) { marketTab = tab; renderMarket(); }
function setMarketCat(cat) { marketCat = cat; renderMarket(); }

function renderMarketNotice(text) {
    const body = document.getElementById('market-body');
    if (body) body.innerHTML = `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-amber-200">${marketEsc(text)}</div>`;
}

function renderMarket() {
    const tabs = document.getElementById('market-tabs');
    const cats = document.getElementById('market-cats');
    const gold = document.getElementById('market-gold');
    if (!document.getElementById('view-market')) return;
    if (tabs) tabs.innerHTML = [['buy', 'Buy'], ['sell', 'Sell'], ['mine', 'My Auctions']].map(([k, l]) =>
        `<button onclick="setMarketTab('${k}')" class="px-4 py-2 rounded-xl font-bold text-sm cursor-pointer ${marketTab === k ? 'bg-amber-600 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}">${l}</button>`).join('');
    if (gold) gold.textContent = `Your gold: ${Number(player.gold || 0).toLocaleString()}`;
    if (cats) cats.innerHTML = marketTab === 'buy' ? MARKET_CATEGORIES.map(([k, l]) =>
        `<button onclick="setMarketCat('${k}')" class="px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${marketCat === k ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">${l}</button>`).join('') : '';
    if (marketTab === 'buy') renderMarketBuy();
    else if (marketTab === 'sell') renderMarketSell();
    else renderMarketMine();
}

// ---- Buy ----
async function renderMarketBuy() {
    const body = document.getElementById('market-body');
    if (!body) return;
    body.innerHTML = '<div class="text-sm text-slate-400">Loading auctions...</div>';
    const msg = await marketAccessMessage();
    if (msg && !(await cloudCurrentUser())) { renderMarketNotice(msg); return; }
    const res = await marketRpc('auction_browse', { p_category: marketCat, p_offset: 0 });
    if (res.error) { renderMarketNotice(res.error); return; }
    const rows = res.data || [];
    const note = msg ? `<div class="text-xs text-amber-200">${marketEsc(msg)} You can look but not bid.</div>` : '';
    if (!rows.length) { body.innerHTML = note + '<div class="text-sm text-slate-400">No auctions in this category right now.</div>'; return; }
    body.innerHTML = note + rows.map(r => {
        const price = Number(r.current_price);
        const lead = r.i_lead ? '<span class="text-emerald-300">You lead</span>' : (r.top_bidder_name ? `Top bid: ${marketEsc(r.top_bidder_name)}` : 'No bids yet');
        const btn = r.is_mine ? '<span class="text-xs text-slate-500">Your auction</span>'
            : (r.i_lead || msg ? '' : `<button onclick="marketBidPrompt(${r.id}, ${price}, ${r.bid_count})" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-sm cursor-pointer">Bid</button>`);
        return `<div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            ${marketRowIcon(r.item)}
            <div class="flex-1 min-w-0">
                <div class="text-sm">${marketItemText(r.item)}</div>
                <div class="text-xs text-slate-400 mt-1">${marketEsc(r.seller_name)} · ${r.bid_count} bid${r.bid_count === 1 ? '' : 's'} · ${lead} · ends in ${marketTimeLeft(r.ends_at)}</div>
            </div>
            <div class="text-right">
                <div class="font-mono text-amber-200">${price.toLocaleString()} G</div>
                <div class="mt-1">${btn}</div>
            </div>
        </div>`;
    }).join('');
}

// Minimum next bid: the start price for the first bid, then 5% over the current price (at least 1)
function marketMinBid(price, bidCount) {
    return bidCount === 0 ? price : price + Math.max(1, Math.floor(price * 0.05));
}

function marketBidPrompt(id, price, bidCount) {
    const min = marketMinBid(price, bidCount);
    showModal('Place a Bid', '', `
        <div class="flex flex-col gap-3 text-left text-sm">
            <p class="text-slate-300">Minimum bid: <span class="font-mono text-amber-200">${min.toLocaleString()} G</span> · Your gold: ${Number(player.gold || 0).toLocaleString()}</p>
            <input id="market-bid-amount" type="number" min="${min}" value="${min}" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-100">
            <button onclick="marketConfirmBid(${id})" class="py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer">Confirm bid</button>
        </div>`);
}

async function marketConfirmBid(id) {
    if (marketBusy) return;
    const amount = Math.floor(Number(document.getElementById('market-bid-amount')?.value) || 0);
    if (amount < 1 || amount > MARKET_MAX_GOLD) { showModal('Market', 'Enter a valid bid.'); return; }
    if (amount > (player.gold || 0)) { showModal('Market', 'You do not have enough gold for this bid.'); return; }
    marketBusy = true;
    const res = await marketRpc('auction_bid', { p_id: id, p_amount: amount });
    marketBusy = false;
    if (res.error) { showModal('Market', res.error); return; }
    player.gold -= amount;
    saveGame();
    updateUI();
    closeModal();
    logMessage(`[Market] Bid ${amount.toLocaleString()} gold`, 'drop');
    renderMarket();
}

// ---- Sell ----
function renderMarketSell() {
    const body = document.getElementById('market-body');
    if (!body) return;
    const items = marketListableItems();
    if (!items.length) { body.innerHTML = '<div class="text-sm text-slate-400">No gear in your bag to sell. Take off or move gear out of equipped slots first.</div>'; return; }
    const field = 'px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-100 w-full';
    body.innerHTML = `
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 text-sm">
            <div id="market-sell-icon" class="flex justify-center"></div>
            <label>Item <select id="market-sell-item" onchange="marketSellPreview()" class="${field}">
                ${items.map(({ idx, item }) => `<option value="${idx}">${marketEsc(item.name)}${item.levelReq ? ` (Lv. ${item.levelReq})` : ''}</option>`).join('')}
            </select></label>
            <label>Starting price (gold) <input id="market-sell-start" type="number" min="1" max="${MARKET_MAX_GOLD}" value="1000" oninput="marketSellPreview()" class="${field}"></label>
            <label>Auction time <select id="market-sell-hours" onchange="marketSellPreview()" class="${field}">
                ${MARKET_DURATIONS.map(([h, l]) => `<option value="${h}">${l}</option>`).join('')}
            </select></label>
            <div id="market-sell-fee" class="text-xs text-slate-300"></div>
            <button onclick="marketConfirmList()" class="py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer">List for auction</button>
        </div>`;
    marketSellPreview();
}

function marketSellPreview() {
    const pick = document.getElementById('market-sell-item');
    const iconEl = document.getElementById('market-sell-icon');
    if (iconEl && pick && player.inventory && player.inventory[Number(pick.value)]) {
        iconEl.innerHTML = itemIconHTML(player.inventory[Number(pick.value)], 120);
    }
    const start = Math.floor(Number(document.getElementById('market-sell-start')?.value) || 0);
    const el = document.getElementById('market-sell-fee');
    if (!el) return;
    const fee = marketFeeOf(start);
    el.innerHTML = `Listing fee: <span class="font-mono text-amber-200">${fee.toLocaleString()} G</span> (paid now, not refunded).<br>Sale fee: ${MARKET_FEE_PCT}% of the final price, taken from your payout.`;
}

async function marketConfirmList() {
    if (marketBusy) return;
    const msg = await marketAccessMessage();
    if (msg) { showModal('Market', msg); return; }
    const idx = Number(document.getElementById('market-sell-item')?.value);
    const item = player.inventory && player.inventory[idx];
    if (!item || !marketCategoryOf(item)) { showModal('Market', 'That item is no longer in your bag.'); renderMarket(); return; }
    const start = Math.floor(Number(document.getElementById('market-sell-start')?.value) || 0);
    const hours = Number(document.getElementById('market-sell-hours')?.value) || 6;
    if (start < 1 || start > MARKET_MAX_GOLD) { showModal('Market', 'Starting price must be 1 to 1,000,000,000 gold.'); return; }
    const fee = marketFeeOf(start);
    if (fee > (player.gold || 0)) { showModal('Market', `You need ${fee.toLocaleString()} gold for the listing fee.`); return; }

    marketBusy = true;
    const copy = JSON.parse(JSON.stringify(item));
    player.inventory[idx] = null; // out of the bag first, so the same gear cannot be listed twice
    const res = await marketRpc('auction_create', { p_item: copy, p_start: start, p_hours: hours });
    marketBusy = false;
    if (res.error) {
        player.inventory[idx] = item; // the listing did not happen: the item goes back
        showModal('Market', res.error);
        updateUI();
        return;
    }
    player.gold -= Number(res.data.fee || fee);
    saveGame();
    updateUI();
    logMessage(`[Market] Listed ${copy.name} for ${start.toLocaleString()} gold`, 'drop');
    marketTab = 'mine';
    renderMarket();
}

// ---- Mine ----
async function renderMarketMine() {
    const body = document.getElementById('market-body');
    if (!body) return;
    body.innerHTML = '<div class="text-sm text-slate-400">Loading...</div>';
    const msg = await marketAccessMessage();
    if (msg && !(await cloudCurrentUser())) { renderMarketNotice(msg); return; }
    const res = await marketRpc('auction_mine');
    if (res.error) { renderMarketNotice(res.error); return; }
    const sellingRows = (res.data && res.data.selling) || [];
    const leadingRows = (res.data && res.data.leading) || [];
    const statusText = { open: 'Open', sold: 'Sold', expired: 'No bids', cancelled: 'Cancelled' };
    const card = (r, extra) => `<div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        ${marketRowIcon(r.item)}
        <div class="flex-1 min-w-0"><div class="text-sm">${marketItemText(r.item)}</div>${extra}</div></div>`;
    const sellHtml = sellingRows.length ? sellingRows.map(r => card(r,
        `<div class="text-xs text-slate-400 mt-1">${statusText[r.status] || r.status} · ${Number(r.current_price).toLocaleString()} G · ${r.bid_count} bid${r.bid_count === 1 ? '' : 's'}${r.status === 'open' ? ` · ends in ${marketTimeLeft(r.ends_at)}` : ''}${r.top_bidder_name ? ` · top: ${marketEsc(r.top_bidder_name)}` : ''}</div>
         ${r.status === 'open' && r.bid_count === 0 ? `<button onclick="marketCancel(${r.id})" class="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs cursor-pointer">Cancel auction</button>` : ''}`
    )).join('') : '<div class="text-sm text-slate-400">You have no auctions.</div>';
    const leadHtml = leadingRows.length ? leadingRows.map(r => card(r,
        `<div class="text-xs text-emerald-300 mt-1">You lead at ${Number(r.current_price).toLocaleString()} G · ends in ${marketTimeLeft(r.ends_at)}</div>`
    )).join('') : '<div class="text-sm text-slate-400">You are not leading any auction.</div>';
    body.innerHTML = `${msg ? `<div class="text-xs text-amber-200">${marketEsc(msg)}</div>` : ''}
        <h3 class="text-sm font-bold text-sky-300">Selling</h3>${sellHtml}
        <h3 class="text-sm font-bold text-sky-300 mt-2">Leading</h3>${leadHtml}
        <p class="text-[11px] text-slate-500">Items and gold from finished auctions arrive in your mailbox.</p>`;
}

async function marketCancel(id) {
    if (marketBusy) return;
    marketBusy = true;
    const res = await marketRpc('auction_cancel', { p_id: id });
    marketBusy = false;
    if (res.error) { showModal('Market', res.error); return; }
    logMessage('[Market] Auction cancelled. The item is in your mailbox.', 'drop');
    if (typeof syncServerMail === 'function') syncServerMail();
    renderMarket();
}
