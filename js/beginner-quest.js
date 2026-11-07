// ==========================================
// BEGINNER QUEST LADDER
// One step at a time, shown on the main page under the Settings button.
// Each step is done when its check passes; the reward is claimed from the panel.
// Progress lives in player.beginnerQuest = { index, flags }.
// ==========================================

const BEGINNER_REWARD = { gold: 1000, diamonds: 5 };

// Flags are set where the action happens (shop purchase, stat point, skill point)
function markBeginnerFlag(key) {
    const st = beginnerState();
    st.flags[key] = true;
}

function beginnerState() {
    if (!player.beginnerQuest) player.beginnerQuest = { index: 0, flags: {} };
    if (!player.beginnerQuest.flags) player.beginnerQuest.flags = {};
    return player.beginnerQuest;
}

function beginnerLevelStep(target) {
    return {
        id: `lv${target}`,
        title: `Reach level ${target}`,
        progress: () => `Base Lv. ${Math.min(player.baseLv || 1, target)} / ${target}`,
        check: () => (player.baseLv || 1) >= target
    };
}

function beginnerAnyGear(test) {
    const worn = Object.values(player.equipped || {}).filter(Boolean);
    const bag = (player.inventory || []).filter(Boolean);
    return [...worn, ...bag].some(test);
}

const BEGINNER_STEPS = [
    {
        id: 'expedition', title: 'Finish First Expedition',
        check: () => Object.keys(player.clearedMaps || {}).length > 0
    },
    {
        id: 'potion', title: 'Buy 1 Potion',
        check: () => !!beginnerState().flags.potion
    },
    {
        id: 'stat', title: 'Use 1 stat point',
        check: () => !!beginnerState().flags.stat
    },
    {
        id: 'skill', title: 'Use 1 skill point',
        check: () => !!beginnerState().flags.skill
    },
    {
        id: 'helmet', title: 'Wear helmet',
        check: () => !!(player.equipped && player.equipped.hat)
    },
    beginnerLevelStep(10),
    {
        id: 'refine4', title: 'Refine item to +4',
        check: () => beginnerAnyGear(g => (g.refineLevel || 0) >= 4)
    },
    {
        id: 'lv1paths', title: 'Clear LV 1 of all path',
        check: () => {
            const paths = Object.keys((typeof GAME_DATA !== 'undefined' && GAME_DATA.paths) || {});
            return paths.length > 0 && paths.every(pk => !!(player.clearedMaps || {})[`${pk}:map1`]);
        }
    },
    beginnerLevelStep(20),
    beginnerLevelStep(30),
    beginnerLevelStep(40),
    beginnerLevelStep(50),
    beginnerLevelStep(60),
    beginnerLevelStep(70),
    beginnerLevelStep(80),
    beginnerLevelStep(90),
    beginnerLevelStep(99)
];

function claimBeginnerQuest() {
    const st = beginnerState();
    const step = BEGINNER_STEPS[st.index];
    if (!step || !step.check()) return;
    player.gold += BEGINNER_REWARD.gold;
    player.diamonds += BEGINNER_REWARD.diamonds;
    st.index += 1;
    if (typeof saveGame === 'function') saveGame();
    if (typeof updateUI === 'function') updateUI();
    if (typeof floatSuccessAt === 'function') floatSuccessAt('Reward claimed!');
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
            <div class="bq-title">All beginner quests complete!</div>
            <div class="bq-count">${total} / ${total} done</div>`;
    } else {
        const step = BEGINNER_STEPS[st.index];
        const done = step.check();
        const progress = step.progress ? step.progress() : (done ? 'Complete' : 'In progress');
        html = `
            <div class="bq-head">Beginner Quest</div>
            <div class="bq-count">${st.index} / ${total} done</div>
            <div class="bq-title">${step.title}</div>
            <div class="bq-progress ${done ? 'bq-done' : ''}">${progress}</div>
            <button class="bq-claim ${done ? '' : 'bq-disabled'}" ${done ? '' : 'disabled'} onclick="claimBeginnerQuest()">${done ? 'Claim' : 'Not yet'}</button>
            <div class="bq-reward">Reward: ${BEGINNER_REWARD.gold} Gold, ${BEGINNER_REWARD.diamonds} 💎</div>`;
    }
    if (html !== beginnerLastHtml) {
        el.innerHTML = html;
        beginnerLastHtml = html;
    }
}

setInterval(renderBeginnerQuest, 500);
document.addEventListener('DOMContentLoaded', renderBeginnerQuest);
