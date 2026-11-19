// ==========================================
// FIRST ELEMENTAL FORGE GUIDE
// Starts at character level 20 (player.baseLv) once the player is back on the main page with a weapon equipped.
// Everything on the screen is shaded except the one target of the current step (same look as the other guides).
// Workflow (each step waits for the one before it):
//   1) Blacksmith button on the main page
//   2) ELEMENTAL tab on the Blacksmith page
//   3) Tap the weapon to forge
//   4) Pick an element stone (any element other than the weapon's own)
//   5) Forge. The first forge is FREE (no Gold, no stone) and always succeeds.
// The guide ends for good (player.guide.elemGuide) after the first forge.
// ==========================================

const GUIDE_ELEM_LEVEL = 20;

function guideElemWeapon() { return player && player.equipped ? player.equipped.weapon : null; }
function guideElemWanted() {
    if (typeof player === 'undefined' || !player) return false;
    if (guideFlag('elemGuide') || guideFlag('elemForged')) return false;
    if ((player.baseLv || 1) < GUIDE_ELEM_LEVEL) return false;
    return !!guideElemWeapon();
}
function guideElemBlacksmith() { return guideViewVisible('view-blacksmith'); }
function guideElemMode() { return typeof blacksmithMode !== 'undefined' && blacksmithMode === 'elemental'; }
function guideElemWeaponPicked() { return typeof blacksmithSelectedSlot !== 'undefined' && blacksmithSelectedSlot === 'weapon'; }
function guideElemStonePicked() { return typeof blacksmithForgeEl !== 'undefined' && !!blacksmithForgeEl; }
// The first element stone to pick: any element other than the weapon's own
function guideElemPickTarget() {
    const w = guideElemWeapon();
    const k = ELEMENT_KEYS.find(x => x !== (w && w.element));
    return k ? document.querySelector(`#refining-slots-container [onclick="blacksmithSelectElement('${k}')"]`) : null;
}

const GUIDE_ELEM_STEPS = [
    {
        text: 'Level 20! Tap the Blacksmith to make your weapon elemental',
        visible: () => guideViewVisible('view-town'),
        targets: () => [document.querySelector('#view-town .ui[data-action="blacksmith"]')]
    },
    {
        text: 'Tap ELEMENTAL to open the elemental forge',
        visible: () => guideElemBlacksmith() && !guideElemMode(),
        targets: () => [document.getElementById('bs-tab-elemental')]
    },
    {
        text: 'Tap your weapon to forge it',
        visible: () => guideElemBlacksmith() && guideElemMode() && !guideElemWeaponPicked(),
        targets: () => [document.querySelector('#refining-slots-container [onclick="blacksmithSelect(\'weapon\')"]')]
    },
    {
        text: 'Pick an element stone. Your first forge is FREE and always succeeds',
        visible: () => guideElemBlacksmith() && guideElemMode() && guideElemWeaponPicked() && !guideElemStonePicked(),
        targets: () => [guideElemPickTarget()]
    },
    {
        text: 'Tap Forge. The first forge costs nothing',
        visible: () => guideElemBlacksmith() && guideElemMode() && guideElemWeaponPicked() && guideElemStonePicked(),
        targets: () => [document.getElementById('bs-refine')]
    }
];

let guideElemDrawn = null;

function guideElemClear() {
    document.getElementById('guide-el-shade')?.remove();
    document.getElementById('guide-el-rings')?.remove();
    document.getElementById('guide-el-tip')?.remove();
    guideElemDrawn = null;
}

function guideElemEnsureNodes() {
    if (document.getElementById('guide-el-shade')) return;
    const shade = document.createElement('div');
    shade.id = 'guide-el-shade';
    shade.style.cssText = 'position:fixed; left:0; top:0; background:rgba(2,6,15,.72); z-index:45; pointer-events:auto; cursor:not-allowed;';
    document.body.appendChild(shade);
    const rings = document.createElement('div');
    rings.id = 'guide-el-rings';
    rings.style.cssText = 'position:fixed; left:0; top:0; z-index:46; pointer-events:none;';
    document.body.appendChild(rings);
    const tip = document.createElement('div');
    tip.id = 'guide-el-tip';
    tip.style.cssText = 'position:fixed; z-index:47; pointer-events:none; transform:translate(-50%, -100%); white-space:nowrap; background:#0f172a; border:1px solid #fbbf24; color:#fde68a; padding:6px 10px; border-radius:8px; font-size:14px; font-weight:700;';
    document.body.appendChild(tip);
    if (!document.getElementById('guide-el-style')) {
        const st = document.createElement('style');
        st.id = 'guide-el-style';
        st.textContent = '@keyframes guideElRingBlink { 0%, 100% { box-shadow: 0 0 18px 4px #fbbf24; } 50% { box-shadow: 0 0 2px 0 #fbbf24; } }';
        document.head.appendChild(st);
    }
}

function guideElemTick() {
    if (!player) return;
    if (guideFlag('elemGuide')) { guideElemClear(); return; }
    // The first forge ends the guide for good (the free forge is then used up)
    if (guideFlag('elemForged')) { markGuide('elemGuide'); guideElemClear(); return; }
    if (!guideElemWanted()) { guideElemClear(); return; }
    if (!document.getElementById('game-modal')?.classList.contains('hidden') || guideViewVisible('view-combat')) { guideElemClear(); return; }
    // Do not stack on top of the upgrade guide
    if (typeof guideUpgradeWanted === 'function' && guideUpgradeWanted()) { guideElemClear(); return; }

    const idx = GUIDE_ELEM_STEPS.findIndex(s => s.visible());
    if (idx < 0) { guideElemClear(); return; }
    const step = GUIDE_ELEM_STEPS[idx];

    const rects = step.targets().filter(el => {
        if (!el) return false;
        if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }).map(el => {
        const r = el.getBoundingClientRect();
        return { l: Math.max(0, r.left - 6), t: Math.max(0, r.top - 6), r: Math.min(window.innerWidth, r.right + 6), b: Math.min(window.innerHeight, r.bottom + 6) };
    });
    if (!rects.length) { guideElemClear(); return; }

    const key = [idx, ...rects.map(q => [q.l, q.t, q.r, q.b].map(Math.round).join(','))].join('|');
    if (guideElemDrawn === key) return;
    guideElemDrawn = key;

    guideElemEnsureNodes();
    const vw = window.innerWidth, vh = window.innerHeight;
    let d = `M0 0H${vw}V${vh}H0Z`;
    rects.forEach(q => { d += ` M${q.l} ${q.t}H${q.r}V${q.b}H${q.l}Z`; });
    const shade = document.getElementById('guide-el-shade');
    shade.style.left = '0px'; shade.style.top = '0px';
    shade.style.width = vw + 'px'; shade.style.height = vh + 'px';
    shade.style.clipPath = `path(evenodd, "${d}")`;

    const rings = document.getElementById('guide-el-rings');
    rings.innerHTML = rects.map(q =>
        `<div style="position:fixed; left:${q.l}px; top:${q.t}px; width:${q.r - q.l}px; height:${q.b - q.t}px; border:3px solid #fbbf24; border-radius:10px; animation: guideElRingBlink 1s steps(2, end) infinite;"></div>`
    ).join('');

    const L = Math.min(...rects.map(q => q.l)), R = Math.max(...rects.map(q => q.r)), T = Math.min(...rects.map(q => q.t));
    const tip = document.getElementById('guide-el-tip');
    tip.textContent = step.text;
    tip.style.left = Math.max(12, (L + R) / 2) + 'px';
    tip.style.top = Math.max(12, T - 10) + 'px';
}

setInterval(() => { try { guideElemTick(); } catch (e) { /* guide must never break the game */ } }, 250);
window.addEventListener('resize', () => { guideElemDrawn = null; });
