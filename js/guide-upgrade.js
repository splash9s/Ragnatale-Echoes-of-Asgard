// ==========================================
// FIRST-TIME UPGRADE GUIDE
// Starts after the first map is cleared (player.clearedMaps has an entry) and while there are stat or skill
// points to spend. Everything on the screen is shaded and unclickable except the target(s) of the current step,
// which blink, with a tip (same look as the intro guide).
// Steps:
//   1) Character button on the main page
//   2) On the character page: STATS tab (raise stats) or SKILLS button (learn skills). Both stay clickable.
// Opening the Skills page ends the guide for good (player.guide.upgrade).
// ==========================================

const GUIDE_UPGRADE_STEPS = [
    {
        text: 'Your first map is cleared! Tap Character to spend your points',
        visible: () => guideViewVisible('view-town'),
        targets: () => [document.querySelector('#view-town .ui[data-action="character"]')]
    },
    {
        text: 'Tap STATS to raise your stats, or SKILLS to learn your job skills',
        visible: () => guideViewVisible('view-character'),
        targets: () => [document.getElementById('char-stats-tab'), document.querySelector('#view-character .char-skills-btn')]
    }
];

function guideUpgradeWanted() {
    if (typeof player === 'undefined' || !player) return false;
    if (player.guide && player.guide.upgrade) return false;
    if (!Object.keys(player.clearedMaps || {}).length) return false;
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
    // Covers the whole screen; the clip path cuts holes for the targets, so clicks there reach the game
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
    if (!guideUpgradeWanted()) {
        // The Skills page was reached (or the points are spent): the guide is over
        if (player && !(player.guide && player.guide.upgrade) && guideViewVisible('view-skills')) markGuide('upgrade');
        guideUpClear();
        return;
    }
    if (!document.getElementById('game-modal')?.classList.contains('hidden') || guideViewVisible('view-combat')) { guideUpClear(); return; }

    const idx = GUIDE_UPGRADE_STEPS.findIndex(s => s.visible());
    if (idx < 0) { guideUpClear(); return; }
    const step = GUIDE_UPGRADE_STEPS[idx];

    // Only targets that are really on screen count
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

    // One shade with a hole per target (evenodd: outer screen rectangle minus each target rectangle)
    let d = `M0 0H${vw}V${vh}H0Z`;
    rects.forEach(q => { d += ` M${q.l} ${q.t}H${q.r}V${q.b}H${q.l}Z`; });
    const shade = document.getElementById('guide-up-shade');
    shade.style.left = '0px'; shade.style.top = '0px';
    shade.style.width = vw + 'px'; shade.style.height = vh + 'px';
    shade.style.clipPath = `path(evenodd, "${d}")`;

    // A blinking ring around each target
    const rings = document.getElementById('guide-up-rings');
    rings.innerHTML = rects.map(q =>
        `<div style="position:fixed; left:${q.l}px; top:${q.t}px; width:${q.r - q.l}px; height:${q.b - q.t}px; border:3px solid #fbbf24; border-radius:10px; animation: guideUpRingBlink 1s steps(2, end) infinite;"></div>`
    ).join('');

    // Tip above all targets together
    const L = Math.min(...rects.map(q => q.l)), R = Math.max(...rects.map(q => q.r)), T = Math.min(...rects.map(q => q.t));
    const tip = document.getElementById('guide-up-tip');
    tip.textContent = step.text;
    tip.style.left = Math.max(12, (L + R) / 2) + 'px';
    tip.style.top = Math.max(12, T - 10) + 'px';
}

// Re-check on a short timer, so it follows the screen and the scaled stage
setInterval(() => { try { guideUpTick(); } catch (e) { /* guide must never break the game */ } }, 250);
window.addEventListener('resize', () => { guideUpDrawn = null; });
