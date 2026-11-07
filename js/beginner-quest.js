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
    { id: 'expedition', title: 'Finish First Expedition', chest: 'copper',
      check: () => Object.keys(player.clearedMaps || {}).length > 0 },
    { id: 'potion', title: 'Buy 1 Potion', chest: 'copper',
      check: () => !!beginnerState().flags.potion },
    { id: 'stat', title: 'Use 1 stat point', chest: 'copper',
      check: () => !!beginnerState().flags.stat },
    { id: 'skill', title: 'Use 1 skill point', chest: 'copper',
      check: () => !!beginnerState().flags.skill },
    { id: 'helmet', title: 'Wear helmet', chest: 'copper',
      check: () => !!(player.equipped && player.equipped.hat) },
    beginnerLevelStep(10, 'copper'),
    { id: 'refine4', title: 'Refine item to +4', chest: 'copper',
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
            <div class="bq-count">${st.index} / ${total} done</div>
            <div class="bq-row"><span class="bq-task">- ${step.title}</span><span class="bq-status ${done ? 'bq-done' : ''}">${status}</span></div>
            ${progress ? `<div class="bq-count">${progress}</div>` : ''}
            <button class="bq-claim ${done ? '' : 'bq-disabled'}" ${done ? '' : 'disabled'} onclick="claimBeginnerQuest()">${done ? 'Claim' : 'Not yet'}</button>
            <div class="bq-reward">Reward: ${BEGINNER_CHEST_NAMES[step.chest]}</div>`;
    }
    if (html !== beginnerLastHtml) {
        el.innerHTML = html;
        beginnerLastHtml = html;
    }
}

setInterval(renderBeginnerQuest, 500);
document.addEventListener('DOMContentLoaded', renderBeginnerQuest);
