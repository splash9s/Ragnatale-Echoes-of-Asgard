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
    renderFriendPage();
}

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
            <div class="friend-lv">Base Lv. <strong>${r.base_lv || 1}</strong> · ID <strong>${escapeHtml(r.friend_code || '')}</strong></div>
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
            <div class="friend-name">${escapeHtml(f.name || 'Hero')}</div>
            <div class="friend-lv">Base Lv. <strong>${f.base_lv || 1}</strong> · ID <strong>${escapeHtml(f.friend_code || '')}</strong></div>
            <div class="friend-bond">Friendship Lv. <strong>${lv}</strong> · ${streakText}</div>
            <div class="friend-bar"><div class="fill" style="width:${progress.pct}%"></div></div>
            <div class="friend-hint">${progress.text}</div>
            <div class="friend-hint">${st.sentToday ? 'Today\'s gift is sent.' : `Today's gift: ${friendGiftText(lv)}`}</div>
        </div>
        <div class="friend-actions">
            <button class="friend-btn gift" ${st.sentToday ? 'disabled' : ''} onclick="sendFriendGift(${idx})">${giftLabel}</button>
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
    if ((player.diamonds || 0) < 1) { setFriendStatus('You need 1 diamond to continue this streak.', true); return; }
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
