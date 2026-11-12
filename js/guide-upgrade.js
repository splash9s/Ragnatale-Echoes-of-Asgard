// ==========================================
// FIRST-TIME UPGRADE GUIDE
// Starts after the first map is cleared (player.clearedMaps has an entry) and while there are stat or skill
// points to spend. Everything on the screen is shaded and unclickable except the one target of the current step,
// which blinks, with a tip (same look as the intro guide).
// Workflow (each step waits for the one before it):
//   1) Character button on the main page
//   2) STATS tab on the character page
//   3) Close button of the stat panel
//   4) SKILLS button on the character page
//   5) Close button of the skills page (back to the town)
// Progress is kept in player.guide: upStats (stat panel was opened), upSkills (skills page was opened).
// The guide ends for good (player.guide.upgrade) once the skills page is closed after step 4.
// ==========================================

const GUIDE_UPGRADE_STEPS = [
    {
        text: 'Your first map is cleared! Tap Character to spend your points',
        visible: () => guideViewVisible('view-town'),
        targets: () => [document.querySelector('#view-town .ui[data-action="character"]')]
    },
    {
        text: 'Tap STATS to raise your stats',
        visible: () => guideUpCharPage() && guideUpStatsHidden() && !guideFlag('upStats'),
        targets: () => [document.getElementById('char-stats-tab')]
    },
    {
        text: 'Tap Close to leave the stats',
        visible: () => guideUpCharPage() && !guideUpStatsHidden(),
        targets: () => [document.querySelector('#view-character .char-stats-close')]
    },
    {
        text: 'Tap SKILLS to learn your job skills',
        visible: () => guideUpCharPage() && guideUpStatsHidden() && guideFlag('upStats') && !guideFlag('upSkills'),
        targets: () => [document.querySelector('#view-character .char-skills-btn')]
    },
    {
        text: 'Tap the return button to leave the skills',
        visible: () => guideViewVisible('view-skills'),
        targets: () => [document.querySelector('#view-skills .char-return')]
    }
];

function guideUpCharPage() { return guideViewVisible('view-character'); }
function guideUpStatsHidden() { return !!document.getElementById('view-character')?.classList.contains('stats-hidden'); }

function guideUpgradeWanted() {
    if (typeof player === 'undefined' || !player) return false;
    if (player.guide && player.guide.upgrade) return false;
    if (!Object.keys(player.clearedMaps || {}).length) return false;
    // Points are only needed to start; once the stat step has begun the guide runs to the end
    if (guideFlag('upStats')) return true;
    return (player.statPoints || 0) > 0 || (player.jobSp || 0) > 0;
}

let guideUpDrawn = null; // key of the last drawn frame, to skip redraws

function guideUpClear() {
    document.getElementById('guide-up-shade')?.remove();
    document.getElementById('guide-up-rings')?.remove();
    document.getElementById('guide-up-tip')?.remove();
    guideUpDrawn = null;
}

function guideUpEnsureNodes() {
    if (document.getElementById('guide-up-shade')) return;
    const shade = document.createElement('div');
    shade.id = 'guide-up-shade';
    // Covers the whole screen; the clip path cuts a hole for the target, so clicks there reach the game
    shade.style.cssText = 'position:fixed; left:0; top:0; background:rgba(2,6,15,.72); z-index:45; pointer-events:auto; cursor:not-allowed;';
    document.body.appendChild(shade);
    const rings = document.createElement('div');
    rings.id = 'guide-up-rings';
    rings.style.cssText = 'position:fixed; left:0; top:0; z-index:46; pointer-events:none;';
    document.body.appendChild(rings);
    const tip = document.createElement('div');
    tip.id = 'guide-up-tip';
    tip.style.cssText = 'position:fixed; z-index:47; pointer-events:none; transform:translate(-50%, -100%); white-space:nowrap; background:#0f172a; border:1px solid #fbbf24; color:#fde68a; padding:6px 10px; border-radius:10px; font-size:14px;';
    document.body.appendChild(tip);
    if (!document.getElementById('guide-up-style')) {
        const st = document.createElement('style');
        st.id = 'guide-up-style';
        st.textContent = '@keyframes guideUpRingBlink { 0%, 100% { box-shadow: 0 0 18px 4px #fbbf24; } 50% { box-shadow: 0 0 2px 0 #fbbf24; } }';
        document.head.appendChild(st);
    }
}

function guideUpTick() {
    if (!player) return;
    if (player.guide && player.guide.upgrade) { guideUpClear(); return; }

    // Progress: the stat panel and the skills page were seen open
    if (guideUpCharPage() && !guideUpStatsHidden() && !guideFlag('upStats')) markGuide('upStats');
    if (guideViewVisible('view-skills') && !guideFlag('upSkills')) markGuide('upSkills');
    // Skills page closed after it was opened: the whole guide is done
    if (guideFlag('upSkills') && !guideViewVisible('view-skills')) { markGuide('upgrade'); guideUpClear(); return; }

    if (!guideUpgradeWanted()) { guideUpClear(); return; }
    if (!document.getElementById('game-modal')?.classList.contains('hidden') || guideViewVisible('view-combat')) { guideUpClear(); return; }

    const idx = GUIDE_UPGRADE_STEPS.findIndex(s => s.visible());
    if (idx < 0) { guideUpClear(); return; }
    const step = GUIDE_UPGRADE_STEPS[idx];

    // Only a target that is really on screen counts
    const rects = step.targets().filter(el => {
        if (!el) return false;
        if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }).map(el => {
        const r = el.getBoundingClientRect();
        return { l: Math.max(0, r.left - 6), t: Math.max(0, r.top - 6), r: Math.min(window.innerWidth, r.right + 6), b: Math.min(window.innerHeight, r.bottom + 6) };
    });
    if (!rects.length) { guideUpClear(); return; }

    const key = [idx, ...rects.map(q => [q.l, q.t, q.r, q.b].map(Math.round).join(','))].join('|');
    if (guideUpDrawn === key) return;
    guideUpDrawn = key;

    guideUpEnsureNodes();
    const vw = window.innerWidth, vh = window.innerHeight;

    // One shade with a hole for the target (evenodd: outer screen rectangle minus the target rectangle)
    let d = `M0 0H${vw}V${vh}H0Z`;
    rects.forEach(q => { d += ` M${q.l} ${q.t}H${q.r}V${q.b}H${q.l}Z`; });
    const shade = document.getElementById('guide-up-shade');
    shade.style.left = '0px'; shade.style.top = '0px';
    shade.style.width = vw + 'px'; shade.style.height = vh + 'px';
    shade.style.clipPath = `path(evenodd, "${d}")`;

    // A blinking ring around the target
    const rings = document.getElementById('guide-up-rings');
    rings.innerHTML = rects.map(q =>
        `<div style="position:fixed; left:${q.l}px; top:${q.t}px; width:${q.r - q.l}px; height:${q.b - q.t}px; border:3px solid #fbbf24; border-radius:10px; animation: guideUpRingBlink 1s steps(2, end) infinite;"></div>`
    ).join('');

    // Tip above the target
    const L = Math.min(...rects.map(q => q.l)), R = Math.max(...rects.map(q => q.r)), T = Math.min(...rects.map(q => q.t));
    const tip = document.getElementById('guide-up-tip');
    tip.textContent = step.text;
    tip.style.left = Math.max(12, (L + R) / 2) + 'px';
    tip.style.top = Math.max(12, T - 10) + 'px';
}

// Re-check on a short timer, so it follows the screen and the scaled stage
setInterval(() => { try { guideUpTick(); } catch (e) { /* guide must never break the game */ } }, 250);
window.addEventListener('resize', () => { guideUpDrawn = null; });
