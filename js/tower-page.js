// ==========================================
// WARDED TOWER PAGE (opened from the castle button on the main page)
// Layout: graphic/cha/page/towerpage/bglayout.png
//   left:  Friend / Leaderboard tabs, then the teammate picker or the leaderboard
//   right: Normal / Hard / Hell tabs, highest floor reached and the previous run's reward
//   bottom right: Start
// Uses the tower state in ui.js (towerFriends, towerPick, towerOpenArrange) and combat.js (TOWER_FLOORS).
// ==========================================

// Difficulty: monster strength and reward (gold and diamonds) multipliers.
// Hard unlocks after clearing every floor on Normal; Hell after clearing every floor on Hard.
// Only Normal runs go to the leaderboard.
const TOWER_DIFFS = {
    // bossLv: the level of the first and last boss floor (the boss floors are spread evenly between them)
    normal: { label: 'Normal', monster: 1, reward: 1, needs: null,     bossLv: [1, 30] },
    hard:   { label: 'Hard',   monster: 2, reward: 2, needs: 'normal', bossLv: [40, 70] },
    hell:   { label: 'Hell',   monster: 4, reward: 3, needs: 'hard',   bossLv: [80, 99] },
};
let towerDifficulty = 'normal';  // the difficulty chosen on the Tower page (used when the run starts)
let towerPageTab = 'friend';     // left panel: 'friend' or 'leaderboard'

function towerBestFloor(diff) {
    const b = (typeof player !== 'undefined' && player.towerBest) || {};
    return Number(b[diff]) || 0;
}
function towerDiffUnlocked(diff) {
    const need = TOWER_DIFFS[diff] && TOWER_DIFFS[diff].needs;
    return !need || towerBestFloor(need) >= TOWER_FLOORS;
}
// The difficulty of the run in progress (fixed when the run starts)
function towerRunDiff() {
    return (typeof towerParty !== 'undefined' && towerParty && towerParty.diff) || towerDifficulty;
}
function towerDiffMonsterMult() { return (TOWER_DIFFS[towerRunDiff()] || TOWER_DIFFS.normal).monster; }
function towerDiffRewardMult() { return (TOWER_DIFFS[towerRunDiff()] || TOWER_DIFFS.normal).reward; }

function openTowerPage() {
    switchView('tower');
}

function setTowerPageTab(tab) {
    towerPageTab = tab;
    renderTowerPage();
}
function setTowerDifficulty(diff) {
    if (!TOWER_DIFFS[diff]) return;
    if (!towerDiffUnlocked(diff)) {
        const need = TOWER_DIFFS[diff].needs;
        floatFailAt(currentLanguage === 'th'
            ? `ผ่านชั้น ${TOWER_FLOORS} ระดับ${need === 'normal' ? 'ปกติ' : 'ยาก'}ก่อน`
            : `Clear floor ${TOWER_FLOORS} on ${TOWER_DIFFS[need].label} first`);
        return;
    }
    towerDifficulty = diff;
    renderTowerPage();
}

function towerPageEsc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderTowerPage() {
    const root = document.getElementById('view-tower');
    if (!root) return;
    // Left tabs
    root.querySelectorAll('.tw-tab[data-tab]').forEach(b => b.classList.toggle('tw-on', b.dataset.tab === towerPageTab));
    // Right tabs (difficulty)
    root.querySelectorAll('.tw-tab[data-diff]').forEach(b => {
        b.classList.toggle('tw-on', b.dataset.diff === towerDifficulty);
        b.classList.toggle('tw-locked', !towerDiffUnlocked(b.dataset.diff));
    });
    renderTowerLeft();
    renderTowerRight();
    const start = document.getElementById('tw-start');
    if (start) start.disabled = !eventCanPlay('tower') || !towerDiffUnlocked(towerDifficulty);
}

// ---- Left panel: pick teammates, or the leaderboard ----
function renderTowerLeft() {
    const box = document.getElementById('tw-left-body');
    const title = document.getElementById('tw-left-title');
    if (!box || !title) return;
    if (towerPageTab === 'leaderboard') {
        title.textContent = 'Leaderboard';
        box.innerHTML = '<div id="tw-leaderboard"><p class="tw-status">Loading...</p></div>';
        loadTowerPageLeaderboard();
        return;
    }
    title.textContent = 'Pick teammate';
    if (towerFriends === null) { box.innerHTML = '<p class="tw-status">Loading friends…</p>'; loadTowerFriends(); return; }
    if (towerFriendsError) { box.innerHTML = `<p class="tw-status">${towerPageEsc(towerFriendsError)}</p>`; return; }
    const head = `<p class="tw-sub">${towerPick.length} / 2 selected · or go alone</p>`;
    if (!towerFriends.length) { box.innerHTML = head + '<p class="tw-status">No friends yet. Go alone, or add friends.</p>'; return; }
    box.innerHTML = head + `<div class="tw-list">${towerFriends.map(f => {
        const idx = towerPick.indexOf(f.user_id);
        const cd = towerFriendCooldownLeft(f.user_id);
        const resting = cd > 0;
        const sub = resting ? `Resting ${Math.ceil(cd / 86400000)} day(s)` : `Lv. ${Number(f.base_lv) || 1}`;
        return `<button class="tw-friend${idx >= 0 ? ' tw-on' : ''}${resting ? ' tw-rest' : ''}" ${resting ? 'disabled' : ''} onclick="toggleTowerFriend('${towerPageEsc(f.user_id)}')">
            <span class="tw-num">${idx >= 0 ? idx + 1 : ''}</span>
            <span class="tw-av">${friendAvatarHTML(f.avatar)}</span>
            <span class="tw-who"><b>${towerPageEsc(f.name)}</b><small>${sub}</small></span>
        </button>`;
    }).join('')}</div>`;
}

// Compact leaderboard for the narrow left panel: each row shows the player, floor and time, then the team below
async function loadTowerPageLeaderboard() {
    const res = await fetchTowerLeaderboard();
    const box = document.getElementById('tw-leaderboard');
    if (!box) return; // tab changed
    if (res.error) {
        box.innerHTML = `<p class="tw-status">${res.error === 'signin' ? 'Sign in to see the leaderboard.' : 'The leaderboard is unavailable right now.'}</p>`;
        if (typeof translateDomIn === 'function') translateDomIn(box);
        return;
    }
    if (!res.rows.length) {
        box.innerHTML = '<p class="tw-status">No records yet. Clear a floor in the Warded Tower to appear here.</p>';
        if (typeof translateDomIn === 'function') translateDomIn(box);
        return;
    }
    box.innerHTML = `<p class="tw-sub">Normal difficulty · furthest floor, then fastest time</p>` + res.rows.map(r => {
        const team = Array.isArray(r.team) ? r.team : [];
        const mates = team.length
            ? team.map(f => `<span class="tw-mate"><span class="tw-av tw-av-sm">${friendAvatarHTML(f.avatar)}</span><span class="tw-who"><b>${towerPageEsc(f.name || 'Hero')}</b><small>Lv. ${Number(f.base_lv) || 1}</small></span></span>`).join('')
            : '<span class="tw-solo">Solo</span>';
        return `<div class="tw-lb-row tw-rank-${Number(r.rank)}">
            <div class="tw-lb-top">
                <span class="tw-rank">${Number(r.rank)}</span>
                <span class="tw-av">${friendAvatarHTML(r.avatar)}</span>
                <span class="tw-who"><b>${towerPageEsc(r.name)}</b><small>Base Lv. ${Number(r.base_lv)}</small></span>
                <span class="tw-lb-score"><b>${Number(r.floor)}F</b><small>${formatTowerTime(Number(r.time_ms))}</small></span>
            </div>
            <div class="tw-lb-team"><span class="tw-team-label">Team</span>${mates}</div>
        </div>`;
    }).join('');
    if (typeof translateDomIn === 'function') translateDomIn(box);
}

// ---- Right panel: highest floor reached and the previous run's reward ----
function renderTowerRight() {
    const box = document.getElementById('tw-right-body');
    if (!box) return;
    const d = TOWER_DIFFS[towerDifficulty];
    const best = towerBestFloor(towerDifficulty);
    const unlocked = towerDiffUnlocked(towerDifficulty);
    const info = d.monster === 1
        ? 'Normal monsters and rewards'
        : `Monsters x${d.monster} · Gold and Diamonds x${d.reward}`;
    const lock = unlocked ? '' : `<p class="tw-lock">Locked: clear floor ${TOWER_FLOORS} on ${TOWER_DIFFS[d.needs].label} first</p>`;
    const last = ((typeof player !== 'undefined' && player.towerLast) || {})[towerDifficulty];
    let reward = '<p class="tw-status">No run yet on this difficulty.</p>';
    if (last) {
        const items = [];
        const line = (icon, label, qty) => `<li><img src="${icon}" alt=""><span>${label}</span><b>x${Number(qty).toLocaleString()}</b></li>`;
        if (last.gold) items.push(line('assets/icons/goldpile_q85.webp', 'Gold', last.gold));
        if (last.diamonds) items.push(line('assets/icons/diamondiconsmall_q85.webp', 'Diamond', last.diamonds));
        if (last.planks) items.push(line('assets/items/mat_plank_q85.webp', 'Plank', last.planks));
        if (last.ore) items.push(line('assets/items/mat_bar_q85.webp', 'Bar', last.ore));
        Object.keys(last.stones || {}).forEach(el => {
            if (last.stones[el] && typeof ELEMENTS !== 'undefined' && ELEMENTS[el]) items.push(line(`assets/items/elemental/stone_${el}.webp`, `${ELEMENTS[el].name} Stone`, last.stones[el]));
        });
        if (last.costume) items.push(line('assets/chest/costume/costumeicon_q85.webp', 'Costume Chest', last.costume));
        reward = `<p class="tw-sub">Floor ${Number(last.floor)} reached</p><ol class="tw-reward">${items.join('')}</ol>`;
    }
    box.innerHTML = `
        <div class="tw-best"><span class="tw-best-num">${best}</span><span class="tw-best-of">/ ${TOWER_FLOORS}</span></div>
        <p class="tw-info">${info}</p>
        ${lock}
        <div class="tw-h2">Previous reward</div>
        ${reward}`;
}

// Start: picks the difficulty, then the usual party arrangement (or straight in when going alone)
function towerPageStart() {
    if (!towerDiffUnlocked(towerDifficulty)) { setTowerDifficulty(towerDifficulty); return; }
    towerOpenArrange();
}
