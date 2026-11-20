// ==========================================
// FRIENDS PAGE
// Friend list, add a friend by name or ID, one gift per friend per day (sent to their mailbox),
// friendship level and streak. The rules are enforced on the server (supabase/friends.sql);
// this file shows the state and asks the server to act.
// ==========================================

const FRIEND_MAX_LV = 15;

// Friendship level from the gifts sent so far: level L needs (L-1)*L/2 gifts (lv 2 = 1, lv 3 = 3, ... lv 15 = 105)
function friendLevelOf(gifts) {
    let lv = 1;
    while (lv < FRIEND_MAX_LV && gifts >= lv * (lv + 1) / 2) lv++;
    return lv;
}
// Gifts sent when a level starts (level 1 starts at 0)
function friendLevelStart(lv) { return (lv - 1) * lv / 2; }

// Items in one gift at a level (the server uses the same rule):
// lv 1-5 minor x lv, lv 6-10 medium x (lv-5), lv 11-15 large x (lv-10)
function friendGiftItems(lv) {
    if (lv <= 5) return [{ id: 'potion_minor', qty: lv }];
    if (lv <= 10) return [{ id: 'potion_med', qty: lv - 5 }];
    return [{ id: 'potion_large', qty: lv - 10 }];
}
function friendGiftText(lv) {
    return friendGiftItems(lv).map(g => {
        const t = GOLD_SHOP_CONSUMABLES.find(i => i.id === g.id);
        return `${g.qty} × ${t ? t.name : g.id}`;
    }).join(', ');
}

// Whole days from date a to date b (YYYY-MM-DD, UTC)
function friendDaysBetween(a, b) {
    return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

// The streak as the player should see it. A streak lasts while a gift is sent at least every day;
// missing exactly one day loses it, unless the player pays 1 diamond to continue it.
function friendStreakState(f, today) {
    const gap = f.last_gift_on ? friendDaysBetween(f.last_gift_on, today) : null; // 0 = sent today, 1 = yesterday, 2 = one day missed
    if (gap === 0) return { streak: f.streak || 0, sentToday: true, canRestore: false };
    if (gap === 1) return { streak: f.streak || 0, sentToday: false, canRestore: false };
    if (gap === 2 && (f.streak || 0) > 0) return { streak: 0, sentToday: false, canRestore: true, lost: f.streak };
    return { streak: 0, sentToday: false, canRestore: false };
}

const friendState = { loaded: false, error: '', today: null, myCode: '', friends: [], incoming: [], outgoing: [], tab: 'friends', busy: false };

// The diamond icon used in price and cost labels
const FRIEND_DIAMOND_ICON = '<img src="assets/icons/diamondiconsmall_q85.webp" alt="" style="width:20px;height:20px;vertical-align:-4px;display:inline-block">';

function setFriendStatus(msg, isErr) {
    const el = document.getElementById('friend-status');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('err', !!isErr);
}

function setFriendBusy(busy) {
    friendState.busy = busy;
    const add = document.getElementById('friend-add-btn');
    if (add) add.disabled = busy;
}

// Opens the page: shows the last known list at once, then asks the server for the newest one
function openFriendPage() {
    renderFriendPage();
    refreshFriends();
}

async function refreshFriends() {
    const [res, reqs] = await Promise.all([friendApi.list(), friendApi.requests()]);
    friendState.loaded = true;
    if (res.error) {
        friendState.error = res.error;
    } else {
        friendState.error = '';
        friendState.today = res.data.today;
        friendState.myCode = res.data.my_code || '';
        friendState.friends = res.data.friends || [];
    }
    if (reqs.error) {
        setFriendStatus(reqs.error, true);
    } else {
        friendState.incoming = reqs.data.incoming || [];
        friendState.outgoing = reqs.data.outgoing || [];
    }
    updateFriendAlert();
    renderFriendPage();
    loadTentVisitors();
}

// Friend button alert: shown only while another player's friend request is waiting for an accept or decline
function updateFriendAlert() {
    const el = document.getElementById('alert-friend');
    if (el) el.style.display = friendState.incoming.length > 0 ? 'block' : 'none';
}
// Checks for new requests without opening the page (at startup, then once a minute while signed in)
async function refreshFriendAlert() {
    if (typeof cloudUserId === 'undefined' || !cloudUserId) return;
    try {
        const reqs = await friendApi.requests();
        if (reqs.error || !reqs.data) return;
        friendState.incoming = reqs.data.incoming || [];
        friendState.outgoing = reqs.data.outgoing || [];
        updateFriendAlert();
    } catch (e) { /* offline or signed out: no alert */ }
}
setTimeout(refreshFriendAlert, 3000);
setInterval(() => { if (!document.hidden) refreshFriendAlert(); }, 60000);

// Switches between the Friends and Requests tabs
function setFriendTab(tab) {
    friendState.tab = tab;
    setFriendStatus('');
    renderFriendPage();
}

// One row in the Requests tab: 'in' = someone asked to be your friend, 'out' = you asked them
function requestRowHTML(r, kind, idx) {
    const hint = kind === 'in' ? 'Wants to be your friend.' : 'Waiting for them to accept.';
    const actions = kind === 'in'
        ? `<button class="friend-btn gift" onclick="acceptFriendRequest(${idx})">Accept</button>
           <button class="friend-btn del" onclick="declineFriendRequest(${idx})">Decline</button>`
        : `<button class="friend-btn copy" onclick="cancelFriendRequest(${idx})">Cancel Request</button>`;
    return `
    <div class="friend-row">
        <div class="friend-avatar">${friendAvatarHTML(r.avatar)}</div>
        <div class="friend-info">
            <div class="friend-name">${escapeHtml(r.name || 'Hero')}</div>
            <div class="friend-lv">Lv. <strong>${r.base_lv || 1}</strong></div>
            <div class="friend-hint">${hint}</div>
        </div>
        <div class="friend-actions">${actions}</div>
    </div>`;
}

async function acceptFriendRequest(idx) {
    const r = friendState.incoming[idx];
    if (!r) return;
    const res = await friendApi.accept(r.user_id);
    if (res.error) { setFriendStatus(res.error, true); return; }
    setFriendStatus(`${r.name} is now your friend.`);
    refreshFriends();
}

async function declineFriendRequest(idx) {
    const r = friendState.incoming[idx];
    if (!r) return;
    const res = await friendApi.decline(r.user_id);
    if (res.error) { setFriendStatus(res.error, true); return; }
    setFriendStatus(`Request from ${r.name} declined.`);
    refreshFriends();
}

async function cancelFriendRequest(idx) {
    const r = friendState.outgoing[idx];
    if (!r) return;
    const res = await friendApi.cancel(r.user_id);
    if (res.error) { setFriendStatus(res.error, true); return; }
    setFriendStatus(`Request to ${r.name} cancelled.`);
    refreshFriends();
}

function friendRowHTML(f, today, idx) {
    const lv = friendLevelOf(f.gifts_sent || 0);
    const st = friendStreakState(f, today);
    const fire = st.streak > 2 ? ' 🔥' : '';
    const streakText = st.streak > 0 ? `${st.streak}-day streak${fire}` : 'No streak';

    let progress;
    if (lv >= FRIEND_MAX_LV) {
        progress = { pct: 100, text: 'Max friendship level' };
    } else {
        const start = friendLevelStart(lv), next = friendLevelStart(lv + 1);
        const done = (f.gifts_sent || 0) - start;
        progress = { pct: Math.min(100, Math.round(done * 100 / (next - start))), text: `${done} / ${next - start} gifts to Lv. ${lv + 1}` };
    }

    const giftLabel = st.sentToday ? 'Sent today' : 'Send Gift';
    const restoreBtn = st.canRestore
        ? `<button class="friend-btn restore" onclick="restoreFriendStreak(${idx})">Continue streak ${FRIEND_DIAMOND_ICON}1</button>
           <span class="friend-hint">You missed a day. Continue your ${st.lost}-day streak before sending today's gift.</span>`
        : '';

    return `
    <div class="friend-row">
        <div class="friend-avatar">${friendAvatarHTML(f.avatar)}</div>
        <div class="friend-info">
            <div class="friend-name-row"><div class="friend-name">${escapeHtml(f.name || 'Hero')}</div>${(friendState.visitors || {})[f.name || 'Hero'] ? `<div class="friend-visit">Visited tent: ${escapeHtml((friendState.visitors || {})[f.name || 'Hero'])}</div>` : ''}</div>
            <div class="friend-lv">Lv. <strong>${f.base_lv || 1}</strong></div>
            <div class="friend-bond">Friendship Lv. <strong>${lv}</strong> · ${streakText}</div>
            <div class="friend-bar"><div class="fill" style="width:${progress.pct}%"></div></div>
            <div class="friend-hint">${progress.text}</div>
            ${st.sentToday ? '<div class="friend-hint">Today\'s gift is sent.</div>' : ''}
        </div>
        <div class="friend-actions">
            <button class="friend-btn send" ${st.sentToday ? 'disabled' : ''} onclick="sendFriendGift(${idx})">${giftLabel}</button>
            <button class="friend-btn visit" onclick="visitFriendTent(${idx})">Visit Tent</button>
            ${restoreBtn}
            <button class="friend-btn del" onclick="deleteFriendAsk(${idx})">Delete</button>
        </div>
    </div>`;
}

function friendAvatarHTML(av) {
    const src = av && (av.startsWith('assets/') || av.startsWith('data:image')) ? av : 'assets/avatars/slime_q85.webp';
    return `<img src="${escapeHtml(src)}" alt="">`;
}

function renderFriendPage() {
    const list = document.getElementById('friend-list');
    if (!list) return;
    const code = document.getElementById('friend-my-code');
    if (code) code.textContent = friendState.myCode || '--------';

    const tabFriends = document.getElementById('friend-tab-friends');
    const tabRequests = document.getElementById('friend-tab-requests');
    if (tabFriends) {
        tabFriends.textContent = `Friends (${friendState.friends.length})`;
        tabFriends.classList.toggle('active', friendState.tab === 'friends');
    }
    if (tabRequests) {
        tabRequests.textContent = friendState.incoming.length ? `Requests (${friendState.incoming.length})` : 'Requests';
        tabRequests.classList.toggle('active', friendState.tab === 'requests');
    }

    if (friendState.tab === 'requests') {
        if (!friendState.loaded) {
            list.innerHTML = '<div class="friend-empty">Loading requests...</div>';
            return;
        }
        const rows = [
            ...friendState.incoming.map((r, i) => requestRowHTML(r, 'in', i)),
            ...friendState.outgoing.map((r, i) => requestRowHTML(r, 'out', i)),
        ];
        list.innerHTML = rows.length ? rows.join('') : '<div class="friend-empty">No friend requests.</div>';
        return;
    }

    if (!friendState.loaded) {
        list.innerHTML = '<div class="friend-empty">Loading friends...</div>';
    } else if (friendState.error) {
        list.innerHTML = `<div class="friend-empty">${escapeHtml(friendState.error)}</div>`;
    } else if (friendState.friends.length === 0) {
        list.innerHTML = '<div class="friend-empty">No friends yet. Add a player with their name or ID above.</div>';
    } else {
        list.innerHTML = friendState.friends.map((f, i) => friendRowHTML(f, friendState.today, i)).join('');
    }
}

async function addFriendFromInput() {
    if (friendState.busy) return;
    const input = document.getElementById('friend-add-input');
    const q = (input?.value || '').trim();
    if (!q) { setFriendStatus('Type a player name or ID.', true); return; }
    setFriendBusy(true);
    const res = await friendApi.add(q);
    setFriendBusy(false);
    if (res.error) { setFriendStatus(res.error, true); return; }
    if (input) input.value = '';
    setFriendStatus(res.data.status === 'friends'
        ? `${res.data.name} is now your friend.`
        : `Friend request sent to ${res.data.name}. They must accept it first.`);
    refreshFriends();
}

async function copyFriendCode() {
    const code = friendState.myCode;
    if (!code) return;
    try {
        await navigator.clipboard.writeText(code);
        setFriendStatus(`Copied your ID: ${code}`);
    } catch (e) {
        setFriendStatus(`Your ID: ${code}`);
    }
}

async function sendFriendGift(idx) {
    const f = friendState.friends[idx];
    if (!f) return;
    const res = await friendApi.sendGift(f.user_id);
    if (res.error) { setFriendStatus(res.error, true); return; }
    setFriendStatus(`Gift sent to ${f.name}: ${friendGiftText(res.data.level)}. It is in their mailbox.`);
    refreshFriends();
}

async function restoreFriendStreak(idx) {
    const f = friendState.friends[idx];
    if (!f) return;
    if ((player.diamonds || 0) < 1) { diamondShortPopup(); return; }
    const res = await friendApi.restoreStreak(f.user_id);
    if (res.error) { setFriendStatus(res.error, true); return; }
    player.diamonds -= 1;
    updateUI();
    saveGame();
    setFriendStatus(`Streak with ${f.name} continued. Send today's gift to keep it going.`);
    refreshFriends();
}

function deleteFriendAsk(idx) {
    const f = friendState.friends[idx];
    if (!f) return;
    confirmAction('Delete Friend', `Remove ${escapeHtml(f.name || 'this friend')} from your friends? Your gifts and streak with them are lost.`, async () => {
        const res = await friendApi.remove(f.user_id);
        if (res.error) { setFriendStatus(res.error, true); return; }
        setFriendStatus(`${f.name} was removed from your friends.`);
        refreshFriends();
    });
}

// ---- Visiting a friend's tent (read-only) ----
// While a friend's tent is open, `player` holds their copy (from the server, loaded on entry). Nothing is saved then:
// the save, cloud and profile writes all check friendTentVisiting(). The owner's copy is put back on exit.
async function visitFriendTent(idx) {
    if (friendTentVisiting()) return;
    const f = friendState.friends[idx];
    if (!f) return;
    setFriendStatus('Opening ' + (f.name || 'Hero') + "'s tent...", false);
    const res = await friendApi.visitTent(f.user_id);
    if (res.error) { setFriendStatus(res.error, true); return; }
    setFriendStatus('', false);
    enterFriendTent(f.name || 'Hero', res.data, f.user_id);
}

function enterFriendTent(name, snap, ownerId) {
    if (friendTentVisiting()) return;
    const backup = JSON.parse(JSON.stringify(player));
    const copy = JSON.parse(JSON.stringify(snap));
    if (typeof removeTentPetWalker === 'function' && typeof tentPetWalkers !== 'undefined') [...tentPetWalkers.keys()].forEach(removeTentPetWalker);
    Object.keys(player).forEach(k => { delete player[k]; });
    Object.assign(player, copy);
    window.friendVisit = { name, backup, ownerId };
    document.body.classList.add('friend-visiting');
    const nameEl = document.getElementById('friend-visit-name');
    if (nameEl) nameEl.textContent = `${name}'s Tent`;
    switchView('character'); // opens the character page reset to the inventory; the tent is turned on after it
    if (!isCharClear()) toggleCharClear();
}

function exitFriendTent() {
    if (!friendTentVisiting()) return;
    closeGuestBook();
    const backup = window.friendVisit.backup;
    if (typeof removeTentPetWalker === 'function' && typeof tentPetWalkers !== 'undefined') [...tentPetWalkers.keys()].forEach(removeTentPetWalker);
    Object.keys(player).forEach(k => { delete player[k]; });
    Object.assign(player, backup);
    window.friendVisit = null;
    document.body.classList.remove('friend-visiting');
    if (isCharClear()) toggleCharClear();
    switchView('friend');
}

// The owner's list of who visited their tent in the last 3 days
async function loadTentVisitors() {
    const box = document.getElementById('friend-visitors');
    if (!box) return;
    const res = await friendApi.visitors();
    // Latest visit per visitor name; each friend row shows its visit beside the name
    const visits = {};
    if (!res.error) {
        for (const r of res.data || []) {
            const name = r.name || 'Hero';
            if (!visits[name]) visits[name] = new Date(r.visited_at).toLocaleString();
        }
    }
    friendState.visitors = visits;
    box.style.display = 'none';
    if (res.error) { box.style.display = ''; box.textContent = res.error; return; }
    renderFriendPage();
}

// ==========================================
// GUEST BOOK (Diary button in the tent menu)
// A visitor writes a message (up to 100 characters) on a friend's tent. The owner reads and deletes
// the messages on their own tent. The server keeps the writer's name and the time (supabase/guestbook.sql).
// ==========================================
let guestBookRows = null;       // owner view: messages on this tent, newest first (null while loading)
let guestBookPendingId = null;  // message waiting for a yes/no before it is deleted
let guestBookBusy = false;
let guestBookStatus = null;     // { msg, err } shown under the panel

function gbEsc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// Local date and time, e.g. 2026-11-20 12:44
function gbStamp(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function openGuestBook() {
    let box = document.getElementById('guestbook-panel');
    if (!box) {
        box = document.createElement('div');
        box.id = 'guestbook-panel';
        box.setAttribute('data-drag-panel', '');
        box.style.left = (window.innerWidth / 2) + 'px';
        box.style.top = (window.innerHeight / 2) + 'px';
        document.body.appendChild(box);
        box.style.setProperty('--ps', Math.min(window.innerWidth / 1920, window.innerHeight / 1080) || 1);
    }
    guestBookPendingId = null;
    guestBookStatus = null;
    guestBookRows = null;
    renderGuestBook();
    if (!friendTentVisiting()) loadGuestBook();
}
function closeGuestBook() {
    guestBookPendingId = null;
    guestBookStatus = null;
    const box = document.getElementById('guestbook-panel');
    if (box) box.remove();
}

async function loadGuestBook() {
    const res = await friendApi.guestbookList();
    if (res.error) { guestBookStatus = { msg: res.error, err: true }; guestBookRows = []; }
    else guestBookRows = res.data || [];
    renderGuestBook();
}

// Updates only the status line, so text typed in the message box is kept
function setGuestBookStatus(msg, isErr) {
    guestBookStatus = msg ? { msg, err: !!isErr } : null;
    const el = document.getElementById('gb-status');
    if (el) { el.textContent = msg || ''; el.classList.toggle('err', !!isErr); }
}
function gbCount() {
    const ta = document.getElementById('gb-text');
    const c = document.getElementById('gb-count');
    if (ta && c) c.textContent = `${ta.value.length} / 100`;
}

function renderGuestBook() {
    const box = document.getElementById('guestbook-panel');
    if (!box) return;
    const visiting = friendTentVisiting();
    const who = visiting ? window.friendVisit.name : '';
    let body;
    if (visiting) {
        body = `<p class="gb-sub">Leave a message for ${gbEsc(who)} (up to 100 characters). Your name and the time are saved with it.</p>
            <textarea id="gb-text" maxlength="100" placeholder="Write a message..." oninput="gbCount()"></textarea>
            <div class="gb-foot"><span class="gb-count" id="gb-count">0 / 100</span>`
            + `<button class="gb-btn" id="gb-send" onclick="guestBookSend()" ${guestBookBusy ? 'disabled' : ''}>Send</button></div>`;
    } else if (guestBookRows === null) {
        body = `<p class="gb-sub">Loading...</p>`;
    } else if (!guestBookRows.length) {
        body = `<p class="gb-sub">No messages yet.</p>`;
    } else {
        const rows = guestBookRows.map(r => {
            const id = Number(r.id);
            const action = guestBookPendingId === id
                ? `<div class="gb-confirm"><span>Delete this message?</span>`
                  + `<button class="gb-del" onclick="guestBookDelete(${id})" ${guestBookBusy ? 'disabled' : ''}>Yes</button>`
                  + `<button class="gb-del" onclick="guestBookCancel()">No</button></div>`
                : `<div class="gb-foot"><span></span><button class="gb-del" onclick="guestBookAsk(${id})">Delete</button></div>`;
            return `<div class="gb-row"><div class="gb-meta"><b>${gbEsc(r.writer_name || 'Hero')}</b><span>${gbStamp(r.created_at)}</span></div>`
                + `<div class="gb-body">${gbEsc(r.body)}</div>${action}</div>`;
        }).join('');
        body = `<p class="gb-sub">${guestBookRows.length} message${guestBookRows.length === 1 ? '' : 's'}</p><div class="gb-list">${rows}</div>`;
    }
    const st = guestBookStatus ? guestBookStatus.msg : '';
    const stErr = guestBookStatus && guestBookStatus.err ? ' err' : '';
    const title = visiting ? `${gbEsc(who)}'s Guest Book` : 'Guest Book';
    box.innerHTML = `<div class="gb-head"><h3>${title}</h3><button class="gb-x" onclick="closeGuestBook()">✕</button></div>`
        + body + `<p class="gb-status${stErr}" id="gb-status">${gbEsc(st)}</p>`;
    if (visiting) gbCount();
}

// Visitor: send the message to the friend's guest book
async function guestBookSend() {
    if (guestBookBusy || !friendTentVisiting()) return;
    const ta = document.getElementById('gb-text');
    const body = (ta ? ta.value : '').trim();
    if (!body) { setGuestBookStatus('Write a message first.', true); return; }
    if (body.length > 100) { setGuestBookStatus('Messages can be up to 100 characters.', true); return; }
    guestBookBusy = true;
    const btn = document.getElementById('gb-send');
    if (btn) btn.disabled = true;
    const res = await friendApi.guestbookWrite(window.friendVisit.ownerId, body);
    guestBookBusy = false;
    if (btn) btn.disabled = false;
    if (res.error) { setGuestBookStatus(res.error, true); return; }
    if (ta) ta.value = '';
    gbCount();
    setGuestBookStatus('Message sent.', false);
}

// Owner: read and delete messages
function guestBookAsk(id) { guestBookPendingId = id; renderGuestBook(); }
function guestBookCancel() { guestBookPendingId = null; renderGuestBook(); }
async function guestBookDelete(id) {
    if (guestBookBusy) return;
    guestBookBusy = true;
    renderGuestBook();
    const res = await friendApi.guestbookDelete(id);
    guestBookBusy = false;
    guestBookPendingId = null;
    if (res.error) { guestBookStatus = { msg: res.error, err: true }; renderGuestBook(); return; }
    guestBookRows = (guestBookRows || []).filter(r => Number(r.id) !== Number(id));
    guestBookStatus = null;
    renderGuestBook();
}
