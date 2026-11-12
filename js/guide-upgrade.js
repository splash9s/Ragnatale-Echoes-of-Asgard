// ==========================================
// FIRST-TIME UPGRADE GUIDE
// Starts after the first map is cleared (player.clearedMaps has an entry) and while there are stat or skill
// points to spend. Shows where to raise stats and learn skills: everything on the screen is shaded and
// unclickable except one target that blinks, with a tip (same look as the intro guide).
// Steps:
//   1) Character button on the main page
//   2) STATS tab on the character page (while it is closed)
//   3) SKILLS button on the character page
// Opening the Skills page ends the guide for good (player.guide.upgrade).
// ==========================================

const GUIDE_UPGRADE_STEPS = [
    {
        text: 'Your first map is cleared! Tap Character to spend your points',
        visible: () => guideViewVisible('view-town'),
        target: () => document.querySelector('#view-town .ui[data-action="character"]')
    },
    {
        text: 'Tap STATS to raise your stats',
        visible: () => guideViewVisible('view-character') && document.getElementById('view-character')?.classList.contains('stats-hidden'),
        target: () => document.getElementById('char-stats-tab')
    },
    {
        text: 'Tap SKILLS to learn your job skills',
        visible: () => guideViewVisible('view-character'),
        target: () => document.querySelector('#view-character .char-skills-btn')
    }
];

function guideUpgradeWanted() {
    if (typeof player === 'undefined' || !player) return false;
    if (player.guide && player.guide.upgrade) return false;
    if (!Object.keys(player.clearedMaps || {}).length) return false;
    return (player.statPoints || 0) > 0 || (player.jobSp || 0) > 0;
}

let guideUpStepIndex = -1;
let guideUpDrawn = null; // key of the last drawn frame, to skip redraws

function guideUpClear() {
    ['guide-up-shade-top', 'guide-up-shade-bottom', 'guide-up-shade-left', 'guide-up-shade-right', 'guide-up-ring', 'guide-up-tip']
        .forEach(id => document.getElementById(id)?.remove());
    guideUpStepIndex = -1;
    guideUpDrawn = null;
}

function guideUpEnsureNodes() {
    if (document.getElementById('guide-up-ring')) return;
    const mk = (id, css) => {
        const d = document.createElement('div');
        d.id = id;
        d.style.cssText = css;
        document.body.appendChild(d);
        return d;
    };
    const shade = 'position:fixed; background:rgba(2,6,15,.72); z-index:45; pointer-events:auto; cursor:not-allowed;';
    mk('guide-up-shade-top', shade);
    mk('guide-up-shade-bottom', shade);
    mk('guide-up-shade-left', shade);
    mk('guide-up-shade-right', shade);
    mk('guide-up-ring', 'position:fixed; z-index:46; pointer-events:none; border:3px solid #fbbf24; border-radius:10px; animation: guideUpRingBlink 1s steps(2, end) infinite;');
    mk('guide-up-tip', 'position:fixed; z-index:47; pointer-events:none; transform:translate(-50%, -100%); white-space:nowrap; background:#0f172a; border:1px solid #fbbf24; color:#fde68a; padding:6px 10px; border-radius:10px; font-size:14px;');
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
    const el = step.target();
    if (!el || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') { guideUpClear(); return; }

    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) { guideUpClear(); return; }
    const key = [idx, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join('|');
    if (guideUpDrawn === key) return;
    guideUpDrawn = key;
    guideUpStepIndex = idx;

    guideUpEnsureNodes();
    const vw = window.innerWidth, vh = window.innerHeight;
    const l = Math.max(0, r.left - 6), t = Math.max(0, r.top - 6);
    const rr = Math.min(vw, r.right + 6), bb = Math.min(vh, r.bottom + 6);
    const place = (id, x, y, w, h) => {
        const d = document.getElementById(id);
        if (!d) return;
        d.style.left = x + 'px'; d.style.top = y + 'px';
        d.style.width = Math.max(0, w) + 'px'; d.style.height = Math.max(0, h) + 'px';
    };
    place('guide-up-shade-top', 0, 0, vw, t);
    place('guide-up-shade-bottom', 0, bb, vw, vh - bb);
    place('guide-up-shade-left', 0, t, l, bb - t);
    place('guide-up-shade-right', rr, t, vw - rr, bb - t);
    place('guide-up-ring', l, t, rr - l, bb - t);

    const tip = document.getElementById('guide-up-tip');
    tip.textContent = step.text;
    tip.style.left = ((l + rr) / 2) + 'px';
    tip.style.top = (t - 10) + 'px';
}

// Re-check on a short timer, so it follows the screen and the scaled stage
setInterval(() => { try { guideUpTick(); } catch (e) { /* guide must never break the game */ } }, 250);
window.addEventListener('resize', () => { guideUpDrawn = null; });
