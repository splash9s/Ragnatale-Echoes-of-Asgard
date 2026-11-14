// ==========================================
// BEGINNER QUEST LADDER
// One step at a time, shown on the main page under the Settings button.
// Each step is done when its check passes; its chest goes to the bag when claimed.
// Progress lives in player.beginnerQuest = { index, flags }.
// ==========================================

// Flags are set where the action happens (shop purchase, stat point, skill point)
function markBeginnerFlag(key) {
    beginnerState().flags[key] = true;
}

function beginnerState() {
    if (!player.beginnerQuest) player.beginnerQuest = { index: 0, flags: {} };
    if (!player.beginnerQuest.flags) player.beginnerQuest.flags = {};
    return player.beginnerQuest;
}

function beginnerPathKeys() {
    return Object.keys((typeof GAME_DATA !== 'undefined' && GAME_DATA.paths) || {});
}

function beginnerLevelStep(target, chest) {
    return {
        id: `lv${target}`,
        title: `Reach level ${target}`,
        desc: `Reach Base Lv. ${target}.`,
        chest,
        progress: () => `Base Lv. ${Math.min(player.baseLv || 1, target)} / ${target}`,
        check: () => (player.baseLv || 1) >= target
    };
}

// Clear the map at this level (map1, map10, ...) on every path
function beginnerClearStep(level, chest) {
    return {
        id: `clear${level}`,
        title: `Clear LV ${level} of all path`,
        desc: `Clear the LV ${level} map on every path: Fire, Water, Earth and Wind.`,
        pathsDone: () => beginnerPathKeys().map(pk => ({ name: pk, done: !!(player.clearedMaps || {})[`${pk}:map${level}`] })),
        chest,
        check: () => {
            const paths = beginnerPathKeys();
            return paths.length > 0 && paths.every(pk => !!(player.clearedMaps || {})[`${pk}:map${level}`]);
        }
    };
}

function beginnerAnyGear(test) {
    const worn = Object.values(player.equipped || {}).filter(Boolean);
    const bag = (player.inventory || []).filter(Boolean);
    return [...worn, ...bag].some(test);
}

const BEGINNER_STEPS = [
    { id: 'expedition', title: 'Finish First Expedition', chest: 'copper', desc: "Clear any expedition map.",
      check: () => Object.keys(player.clearedMaps || {}).length > 0 },
    { id: 'potion', title: 'Buy 1 Potion', chest: 'copper', desc: "Buy any potion from the Shop.",
      check: () => !!beginnerState().flags.potion },
    { id: 'stat', title: 'Use 1 stat point', chest: 'copper', desc: "Spend 1 stat point on a stat.",
      check: () => !!beginnerState().flags.stat },
    { id: 'skill', title: 'Use 1 skill point', chest: 'copper', desc: "Spend 1 Class SP on a skill.",
      check: () => !!beginnerState().flags.skill },
    { id: 'helmet', title: 'Wear helmet', chest: 'copper', desc: "Equip a helmet on the Hat slot.",
      check: () => !!(player.equipped && player.equipped.hat) },
    beginnerLevelStep(10, 'copper'),
    { id: 'refine4', title: 'Refine item to +4', chest: 'copper', desc: "Refine any gear to +4 at the Blacksmith.",
      check: () => beginnerAnyGear(g => (g.refineLevel || 0) >= 4) },
    beginnerClearStep(1, 'copper'),
    beginnerLevelStep(20, 'silver'),
    beginnerClearStep(10, 'silver'),
    beginnerLevelStep(30, 'silver'),
    beginnerClearStep(20, 'silver'),
    beginnerLevelStep(40, 'silver'),
    beginnerClearStep(30, 'silver'),
    beginnerLevelStep(50, 'gold'),
    beginnerLevelStep(60, 'gold'),
    beginnerLevelStep(70, 'gold'),
    beginnerLevelStep(80, 'gold'),
    beginnerLevelStep(90, 'gold'),
    beginnerLevelStep(99, 'gold')
];

const BEGINNER_CHEST_NAMES = { copper: 'Copper Chest', silver: 'Silver Chest', gold: 'Gold Chest' };

function claimBeginnerQuest() {
    const st = beginnerState();
    const step = BEGINNER_STEPS[st.index];
    if (!step || !step.check()) return;
    const placed = placeItemInInventory({
        name: BEGINNER_CHEST_NAMES[step.chest],
        type: 'chest', chestType: step.chest, desc: '', qty: 1
    });
    if (!placed) {
        if (typeof showModal === 'function') showModal('Bag Full', 'Make room in your bag, then claim the reward.');
        return;
    }
    st.index += 1;
    if (typeof saveGame === 'function') saveGame();
    if (typeof updateUI === 'function') updateUI();
    if (typeof floatSuccessAt === 'function') floatSuccessAt('Chest added!');
    renderBeginnerQuest();
}

let beginnerLastHtml = '';

// The reward shows as the chest icon (its name is kept as the tooltip)
function beginnerRewardIcon(chest) {
    const name = BEGINNER_CHEST_NAMES[chest] || 'Chest';
    return `<span class="bq-reward-icon" title="${name}">${chestIconHTML(chest, 56)}</span>`;
}

function renderBeginnerQuest() {
    const el = document.getElementById('beginner-quest');
    if (!el) return;
    const st = beginnerState();
    const total = BEGINNER_STEPS.length;
    let html;
    if (st.index >= total) {
        html = `
            <div class="bq-head">Beginner Quest</div>
            <div class="bq-row"><span class="bq-task">All beginner quests complete!</span></div>
            <div class="bq-count">${total} / ${total} done</div>`;
    } else {
        const step = BEGINNER_STEPS[st.index];
        const done = step.check();
        const progress = step.progress ? step.progress() : '';
        const status = done ? 'Complete' : 'In Progress';
        html = `
            <div class="bq-head">Beginner Quest</div>
            <div class="bq-row bq-clickable" onclick="openBeginnerDetail()"><span class="bq-task">- ${step.title}</span><span class="bq-status ${done ? 'bq-done' : ''}">${status}</span></div>
            ${done ? `<button class="bq-claim" onclick="claimBeginnerQuest()">Claim</button>` : ''}
            <div class="bq-reward">Reward: ${beginnerRewardIcon(step.chest)}</div>`;
    }
    if (html !== beginnerLastHtml) {
        el.innerHTML = html;
        beginnerLastHtml = html;
    }
    renderBeginnerDetail();
}

// ---- Detail window (opens when the step row is clicked) ----
let beginnerDetailOpen = false;
let beginnerDetailHtml = '';

function openBeginnerDetail() { beginnerDetailOpen = true; renderBeginnerDetail(true); }
function closeBeginnerDetail() { beginnerDetailOpen = false; renderBeginnerDetail(true); }

function renderBeginnerDetail(force) {
    const el = document.getElementById('beginner-detail');
    if (!el) return;
    if (!beginnerDetailOpen) {
        el.style.display = 'none';
        return;
    }
    el.style.display = '';
    const st = beginnerState();
    const total = BEGINNER_STEPS.length;
    let html;
    if (st.index >= total) {
        html = `
            <div class="bq-head-row"><span class="bq-head">Beginner Quest</span><button class="bq-close" onclick="closeBeginnerDetail()">×</button></div>
            <div class="bq-title">All beginner quests complete!</div>`;
    } else {
        const step = BEGINNER_STEPS[st.index];
        const done = step.check();
        let extra = '';
        if (step.progress) extra += `<div class="bq-count">${step.progress()}</div>`;
        if (step.pathsDone) {
            extra += step.pathsDone().map(p => `<div class="bq-row bq-sub"><span class="bq-task">${p.name.toUpperCase()}</span><span class="bq-status ${p.done ? 'bq-done' : ''}">${p.done ? 'Cleared' : 'Not cleared'}</span></div>`).join('');
        }
        html = `
            <div class="bq-head-row"><span class="bq-head">Beginner Quest</span><button class="bq-close" onclick="closeBeginnerDetail()">×</button></div>
            <div class="bq-count">${st.index + 1} / ${total}</div>
            <div class="bq-title">${step.title}</div>
            <div class="bq-desc">${step.desc || ''}</div>
            ${extra}
            <div class="bq-row"><span class="bq-task">Status</span><span class="bq-status ${done ? 'bq-done' : ''}">${done ? 'Complete' : 'In Progress'}</span></div>
            <div class="bq-reward">Reward: ${beginnerRewardIcon(step.chest)}</div>
            ${done ? `<button class="bq-claim" onclick="claimBeginnerQuest()">Claim</button>` : ''}`;
    }
    if (force || html !== beginnerDetailHtml) {
        el.innerHTML = html;
        beginnerDetailHtml = html;
    }
}

setInterval(renderBeginnerQuest, 500);
document.addEventListener('DOMContentLoaded', renderBeginnerQuest);
