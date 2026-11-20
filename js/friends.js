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
setTimeout(refreshGuestBookAlert, 3000);
setInterval(() => { if (!document.hidden) refreshGuestBookAlert(); }, 60000);

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
    refreshGuestBookAlert();
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
// GUEST BOOK (Diary button in the tent menu): a pager between friends.
// A visitor writes on a friend's tent; the owner replies and the reply goes back to the visitor.
// Messages are up to 32 characters and kept for 7 days (supabase/tent_messages.sql).
// On your own tent the book opens to your conversations; on a friend's tent it opens to that friend.
// ==========================================
const GB_MAX = 32;
let guestBookView = 'inbox';     // 'inbox' (list of conversations) or 'thread' (one friend)
let guestBookPartner = null;     // { id, name } of the friend in the open thread
let guestBookInbox = null;       // conversations, newest first (null while loading)
let guestBookThread = null;      // messages with the open friend, newest first (null while loading)
let guestBookPendingId = null;   // received message waiting for a yes/no before it is deleted
let guestBookBusy = false;
let guestBookStatus = null;      // { msg, err } shown under the panel

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
    if (friendTentVisiting()) {
        guestBookView = 'thread';
        guestBookPartner = { id: window.friendVisit.ownerId, name: window.friendVisit.name };
        loadGuestBookThread();
    } else {
        guestBookView = 'inbox';
        guestBookPartner = null;
        loadGuestBookInbox();
    }
}
function closeGuestBook() {
    guestBookPendingId = null;
    guestBookStatus = null;
    const box = document.getElementById('guestbook-panel');
    if (box) box.remove();
    refreshGuestBookAlert();
}

// Red mark on the Guest Book icon and the menu button while messages sent to you are unread
async function refreshGuestBookAlert() {
    const show = (on) => ['alert-tent-diary', 'alert-tent-menu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = on ? '' : 'none';
    });
    if (typeof cloudUserId === 'undefined' || !cloudUserId) { show(false); return; }
    const res = await friendApi.pagerUnread();
    show(!res.error && Number(res.data) > 0);
}

async function loadGuestBookInbox() {
    guestBookInbox = null;
    renderGuestBook();
    const res = await friendApi.pagerInbox();
    if (res.error) { guestBookStatus = { msg: res.error, err: true }; guestBookInbox = []; }
    else guestBookInbox = res.data || [];
    renderGuestBook();
    refreshGuestBookAlert();
}
async function loadGuestBookThread() {
    guestBookThread = null;
    renderGuestBook();
    const res = await friendApi.pagerThread(guestBookPartner.id);
    if (res.error) { guestBookStatus = { msg: res.error, err: true }; guestBookThread = []; }
    else guestBookThread = res.data || [];
    renderGuestBook();
    refreshGuestBookAlert();
}
function guestBookOpenThread(id, name) {
    guestBookView = 'thread';
    guestBookPartner = { id, name };
    guestBookStatus = null;
    guestBookPendingId = null;
    loadGuestBookThread();
}
function guestBookBack() {
    guestBookView = 'inbox';
    guestBookPartner = null;
    guestBookStatus = null;
    guestBookPendingId = null;
    loadGuestBookInbox();
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
    if (ta && c) c.textContent = `${ta.value.length} / ${GB_MAX}`;
}

function gbInboxHTML() {
    if (guestBookInbox === null) return `<p class="gb-sub">Loading...</p>`;
    if (!guestBookInbox.length) return `<p class="gb-sub">No messages in the last 7 days.</p>`;
    return `<div class="gb-list">` + guestBookInbox.map(c => {
        const badge = c.unread > 0 ? `<span class="gb-unread">${Number(c.unread)}</span>` : '';
        return `<button class="gb-row gb-thread" onclick="guestBookOpenThread('${gbEsc(c.partner_id)}', '${gbEsc(String(c.partner_name).replace(/'/g, ''))}')">`
            + `<div class="gb-meta"><b>${gbEsc(c.partner_name)}</b><span>${badge}${gbStamp(c.last_at)}</span></div>`
            + `<div class="gb-body">${c.last_mine ? 'You: ' : ''}${gbEsc(c.last_body)}</div></button>`;
    }).join('') + `</div>`;
}

function gbThreadHTML() {
    if (guestBookThread === null) return `<p class="gb-sub">Loading...</p>`;
    if (!guestBookThread.length) return `<p class="gb-sub">No messages yet. Say hello.</p>`;
    // Oldest first, so the newest message is at the bottom
    const msgs = guestBookThread.slice().reverse().map(m => {
        const id = Number(m.id);
        if (m.mine) {
            return `<div class="gb-msg mine"><div class="gb-body">${gbEsc(m.body)}</div><div class="gb-meta"><span>${gbStamp(m.created_at)}</span></div></div>`;
        }
        const action = guestBookPendingId === id
            ? `<div class="gb-confirm"><span>Delete?</span><button class="gb-del" onclick="guestBookDelete(${id})" ${guestBookBusy ? 'disabled' : ''}>Yes</button><button class="gb-del" onclick="guestBookCancel()">No</button></div>`
            : `<button class="gb-del" onclick="guestBookAsk(${id})">Delete</button>`;
        return `<div class="gb-msg theirs"><div class="gb-meta"><b>${gbEsc(m.sender_name || 'Hero')}</b><span>${gbStamp(m.created_at)}</span></div>`
            + `<div class="gb-body">${gbEsc(m.body)}</div>${action}</div>`;
    }).join('');
    return `<div class="gb-chat" id="gb-chat">${msgs}</div>`;
}

function renderGuestBook() {
    const box = document.getElementById('guestbook-panel');
    if (!box) return;
    const inThread = guestBookView === 'thread' && guestBookPartner;
    const canBack = !friendTentVisiting() && inThread;
    const title = friendTentVisiting() ? `${gbEsc(window.friendVisit.name)}'s Guest Book` : (inThread ? gbEsc(guestBookPartner.name) : 'Guest Book');
    const head = `<div class="gb-head">${canBack ? '<button class="gb-x" onclick="guestBookBack()">←</button>' : ''}<h3>${title}</h3><button class="gb-x" onclick="closeGuestBook()">✕</button></div>`;
    let body;
    if (inThread) {
        body = gbThreadHTML()
            + `<div class="gb-foot"><input type="text" id="gb-text" maxlength="${GB_MAX}" placeholder="Write a message..." oninput="gbCount()" onkeydown="if(event.key==='Enter')guestBookSend()">`
            + `<button class="gb-btn" id="gb-send" onclick="guestBookSend()" ${guestBookBusy ? 'disabled' : ''}>Send</button></div>`
            + `<div class="gb-foot"><span class="gb-count" id="gb-count">0 / ${GB_MAX}</span><span></span></div>`;
    } else {
        body = gbInboxHTML();
    }
    const st = guestBookStatus ? guestBookStatus.msg : '';
    const stErr = guestBookStatus && guestBookStatus.err ? ' err' : '';
    box.innerHTML = head + body + `<p class="gb-status${stErr}" id="gb-status">${gbEsc(st)}</p>`;
    const chat = document.getElementById('gb-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
    if (inThread) gbCount();
}

// Send to the friend in the open thread (a visitor's message, or the owner's reply)
async function guestBookSend() {
    if (guestBookBusy || !guestBookPartner) return;
    const ta = document.getElementById('gb-text');
    const body = (ta ? ta.value : '').trim();
    if (!body) { setGuestBookStatus('Write a message first.', true); return; }
    if (body.length > GB_MAX) { setGuestBookStatus(`Messages can be up to ${GB_MAX} characters.`, true); return; }
    guestBookBusy = true;
    const btn = document.getElementById('gb-send');
    if (btn) btn.disabled = true;
    const res = await friendApi.pagerSend(guestBookPartner.id, body);
    guestBookBusy = false;
    if (btn) btn.disabled = false;
    if (res.error) { setGuestBookStatus(res.error, true); return; }
    if (ta) ta.value = '';
    setGuestBookStatus('', false);
    loadGuestBookThread();
}

function guestBookAsk(id) { guestBookPendingId = id; renderGuestBook(); }
function guestBookCancel() { guestBookPendingId = null; renderGuestBook(); }
async function guestBookDelete(id) {
    if (guestBookBusy) return;
    guestBookBusy = true;
    renderGuestBook();
    const res = await friendApi.pagerDelete(id);
    guestBookBusy = false;
    guestBookPendingId = null;
    if (res.error) { guestBookStatus = { msg: res.error, err: true }; renderGuestBook(); return; }
    guestBookThread = (guestBookThread || []).filter(m => Number(m.id) !== Number(id));
    guestBookStatus = null;
    renderGuestBook();
}
