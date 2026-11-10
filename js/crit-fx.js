// ==========================================
// HIT EFFECTS: slash over the monster that was hit.
// Critical hit: crit slash frames, plus a small screen shake and a blue flash.
// Normal hit: atkslay frames over the monster only.
// Called from the monster hit code in combat.js.
// ==========================================

// Crit slash frames in play order. Width/height are the frames' own pixel sizes.
const CRIT_SLASH_FRAMES = [
    { src: 'assets/combat/crit/slash20_q85.webp', w: 235, h: 275 },
    { src: 'assets/combat/crit/slash21_q85.webp', w: 730, h: 521 },
    { src: 'assets/combat/crit/slash22_q85.webp', w: 715, h: 508 },
    { src: 'assets/combat/crit/slash23_q85.webp', w: 695, h: 498 },
    { src: 'assets/combat/crit/slash24_q85.webp', w: 690, h: 496 },
    { src: 'assets/combat/crit/slash25_q85.webp', w: 664, h: 482 },
];
const CRIT_SLASH_FRAME_MS = 80;  // time each crit frame stays on screen
const CRIT_SLASH_SCALE = 0.6;    // frames are drawn at this fraction of their own size (design px)
const SLASH_LIGHT_SIZE = 1100;   // diameter (design px) of the light a critical slash gives off

// Normal attack slash frames (atkslay1-5)
const ATK_SLASH_FRAMES = [
    { src: 'assets/combat/atk/atkslay1_q85.webp', w: 800, h: 597 },
    { src: 'assets/combat/atk/atkslay2_q85.webp', w: 800, h: 597 },
    { src: 'assets/combat/atk/atkslay3_q85.webp', w: 800, h: 597 },
    { src: 'assets/combat/atk/atkslay4_q85.webp', w: 800, h: 597 },
    { src: 'assets/combat/atk/atkslay5_q85.webp', w: 800, h: 597 },
];
const ATK_SLASH_FRAME_MS = 60;
const ATK_SLASH_SCALE = 0.4;

let critSlashTimer = null;

// Restarts a CSS animation class even when it is already playing
function restartFxClass(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // force a reflow so the animation starts again
    el.classList.add(cls);
}

// The flash layer over the whole combat screen (created once)
function critFxLayer(stage) {
    let fx = stage.querySelector('.crit-fx-layer');
    if (!fx) {
        fx = document.createElement('div');
        fx.className = 'crit-fx-layer';
        fx.innerHTML = '<div class="crit-flash"></div><div class="heavy-vignette"></div>';
        stage.appendChild(fx);
    }
    return fx;
}

// Plays a slash frame sequence over the monster at selector.
// screenFx: also shake the screen and show the flash (critical hits only)
function playSlashFx(selector, frames, frameMs, scale, screenFx) {
    const view = document.getElementById('view-combat');
    if (!view || view.classList.contains('hidden')) return;
    const stage = document.getElementById('combat-stage');
    const inner = stage ? stage.querySelector('.ts-inner') : null;
    const anchor = document.querySelector(selector);
    if (!stage || !inner || !anchor) return;

    if (screenFx) {
        restartFxClass(stage, 'crit-shake');
        restartFxClass(critFxLayer(stage), 'crit-on');
    }

    // Slash over the monster, in the stage's design coordinates
    const ib = inner.getBoundingClientRect();
    const sc = (ib.width / inner.offsetWidth) || 1; // real on-screen scale of the stage
    const b = anchor.getBoundingClientRect();
    const cx = (b.left + b.width / 2 - ib.left) / sc;
    const cy = (b.top + b.height / 2 - ib.top) / sc;
    if (screenFx) {
        // A light source at the monster: it lights the scene around it for a moment
        let light = inner.querySelector('.slash-light');
        if (!light) {
            light = document.createElement('div');
            light.className = 'slash-light';
            inner.appendChild(light);
        }
        light.style.left = (cx - SLASH_LIGHT_SIZE / 2) + 'px';
        light.style.top = (cy - SLASH_LIGHT_SIZE / 2) + 'px';
        restartFxClass(light, 'lit');
    }
    let img = inner.querySelector('.crit-slash');
    if (!img) {
        img = document.createElement('img');
        img.className = 'crit-slash';
        img.alt = '';
        inner.appendChild(img);
    }
    clearInterval(critSlashTimer);
    let f = 0;
    const show = () => {
        const fr = frames[f];
        const w = fr.w * scale, h = fr.h * scale;
        img.src = fr.src;
        img.style.width = w + 'px';
        img.style.height = h + 'px';
        img.style.left = (cx - w / 2) + 'px';
        img.style.top = (cy - h / 2) + 'px';
        img.style.display = '';
        restartFxClass(img, 'slash-lit'); // lighting pulse on every frame
    };
    show();
    critSlashTimer = setInterval(() => {
        f++;
        if (f >= frames.length) {
            clearInterval(critSlashTimer);
            img.style.display = 'none';
            return;
        }
        show();
    }, frameMs);
}

// Critical hit: crit slash with screen shake and flash
function playCritFx(selector) {
    playSlashFx(selector, CRIT_SLASH_FRAMES, CRIT_SLASH_FRAME_MS, CRIT_SLASH_SCALE, true);
    // 3D Earth art: a quick camera push-in on crits
    const stage = document.getElementById('combat-stage');
    if (stage && document.getElementById('earth-bg')?.classList.contains('earth3d-far')) restartFxClass(stage, 'cam-punch');
}

// Boss Heavy Strike: dark vignette and a screen shake
function playHeavyFx() {
    const stage = document.getElementById('combat-stage');
    if (!stage || document.getElementById('view-combat')?.classList.contains('hidden')) return;
    restartFxClass(stage, 'heavy-shake');
    restartFxClass(critFxLayer(stage), 'heavy-on');
}

// Normal hit: atkslay slash only
function playAtkFx(selector) {
    playSlashFx(selector, ATK_SLASH_FRAMES, ATK_SLASH_FRAME_MS, ATK_SLASH_SCALE, false);
}
