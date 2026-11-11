// ==========================================
// FIRST-TIME MAIN PAGE GUIDE
// Shown once per account (player.guide.intro). Everything on the screen is shaded and unclickable
// except one target that blinks. Steps:
//   1) Expedition button on the main page
//   2) Earth Path on the Expedition Gates
//   3) Start Campaign (Earth Lv. 1 is selected by the Earth Path)
// The admin account (window.isOwnerAccount) is not shaded or locked, but the blink still shows.
// Starting any campaign expedition ends the guide.
// ==========================================

const GUIDE_INTRO_STEPS = [
    {
        text: 'Tap Expedition to start your adventure',
        visible: () => guideViewVisible('view-town'),
        target: () => document.querySelector('#view-town .ui[data-action="expedition"]')
    },
    {
        text: 'Tap the Earth Path',
        visible: () => guideViewVisible('view-expeditions') && guideCampaignPanelHidden(),
        target: () => document.getElementById('expo-node-earth')
    },
    {
        text: 'Earth Lv. 1 is selected. Tap Start Campaign',
        visible: () => guideViewVisible('view-expeditions') && !guideCampaignPanelHidden(),
        target: () => document.querySelector('#campaign-panel button[onclick="startExpedition(\'campaign\')"]')
    }
];

function guideViewVisible(id) {
    const el = document.getElementById(id);
    return !!el && !el.classList.contains('hidden');
}
function guideCampaignPanelHidden() {
    const p = document.getElementById('campaign-panel');
    return !p || p.classList.contains('hidden');
}

let guideIntroStepIndex = -1;
let guideIntroDrawn = null; // { rect, admin } of the last drawn frame, to skip redraws

function guideIntroPending() {
    if (typeof player === 'undefined' || !player) return false;
    return !guideFlag('intro');
}

// Ends the guide for good (called when the first campaign expedition starts, or when the account already has cleared maps)
function guideIntroDone() {
    if (!guideFlag('intro')) markGuide('intro');
    guideIntroClear();
}

function guideIntroClear() {
    ['guide-intro-shade-top', 'guide-intro-shade-bottom', 'guide-intro-shade-left', 'guide-intro-shade-right', 'guide-intro-ring', 'guide-intro-tip']
        .forEach(id => document.getElementById(id)?.remove());
    guideIntroStepIndex = -1;
    guideIntroDrawn = null;
}

function guideIntroEnsureNodes() {
    if (document.getElementById('guide-intro-ring')) return;
    const mk = (id, css) => {
        const d = document.createElement('div');
        d.id = id;
        d.style.cssText = css;
        document.body.appendChild(d);
        return d;
    };
    const shade = 'position:fixed; background:rgba(2,6,15,.72); z-index:45; pointer-events:auto; cursor:not-allowed;';
    mk('guide-intro-shade-top', shade);
    mk('guide-intro-shade-bottom', shade);
    mk('guide-intro-shade-left', shade);
    mk('guide-intro-shade-right', shade);
    mk('guide-intro-ring', 'position:fixed; z-index:46; pointer-events:none; border:3px solid #fbbf24; border-radius:10px; animation: guideRingBlink 1s steps(2, end) infinite;');
    mk('guide-intro-tip', 'position:fixed; z-index:47; pointer-events:none; transform:translate(-50%, -100%); white-space:nowrap; background:#0f172a; border:1px solid #fbbf24; color:#fde68a; padding:6px 10px; border-radius:10px; font-size:14px; font-weight:600;');
    if (!document.getElementById('guide-intro-style')) {
        const st = document.createElement('style');
        st.id = 'guide-intro-style';
        st.textContent = '@keyframes guideRingBlink { 0%, 100% { box-shadow: 0 0 18px 4px #fbbf24; } 50% { box-shadow: 0 0 2px 0 #fbbf24; } }';
        document.head.appendChild(st);
    }
}

function guideIntroTick() {
    if (!guideIntroPending()) { guideIntroClear(); return; }
    // Players who already cleared a map do not need the intro
    if (Object.keys(player.clearedMaps || {}).length) { guideIntroDone(); return; }
    // Hide the guide while a modal or combat is up
    if (!document.getElementById('game-modal')?.classList.contains('hidden') || guideViewVisible('view-combat')) { guideIntroClear(); return; }

    const idx = GUIDE_INTRO_STEPS.findIndex(s => s.visible());
    if (idx < 0) { guideIntroClear(); return; }
    const step = GUIDE_INTRO_STEPS[idx];
    const el = step.target();
    if (!el) { guideIntroClear(); return; }

    const r = el.getBoundingClientRect();
    const admin = window.isOwnerAccount === true;
    const key = [idx, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height), admin].join('|');
    if (guideIntroDrawn === key) return;
    guideIntroDrawn = key;
    guideIntroStepIndex = idx;

    guideIntroEnsureNodes();
    const vw = window.innerWidth, vh = window.innerHeight;
    const l = Math.max(0, r.left - 6), t = Math.max(0, r.top - 6);
    const rr = Math.min(vw, r.right + 6), bb = Math.min(vh, r.bottom + 6);
    const place = (id, x, y, w, h, show) => {
        const d = document.getElementById(id);
        if (!d) return;
        d.style.display = show ? '' : 'none';
        d.style.left = x + 'px'; d.style.top = y + 'px';
        d.style.width = Math.max(0, w) + 'px'; d.style.height = Math.max(0, h) + 'px';
    };
    // Admin: no shade, the target stays clickable everywhere
    place('guide-intro-shade-top', 0, 0, vw, t, !admin);
    place('guide-intro-shade-bottom', 0, bb, vw, vh - bb, !admin);
    place('guide-intro-shade-left', 0, t, l, bb - t, !admin);
    place('guide-intro-shade-right', rr, t, vw - rr, bb - t, !admin);
    place('guide-intro-ring', l, t, rr - l, bb - t, true);

    const tip = document.getElementById('guide-intro-tip');
    tip.textContent = step.text;
    tip.style.left = ((l + rr) / 2) + 'px';
    tip.style.top = (t - 10) + 'px';
}

// Re-check the guide on a short timer, so it follows the screen and the scaled stage
setInterval(() => { try { guideIntroTick(); } catch (e) { /* guide must never break the game */ } }, 250);
window.addEventListener('resize', () => { guideIntroDrawn = null; });
