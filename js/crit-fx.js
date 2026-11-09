// ==========================================
// HIT EFFECTS: slash over the monster that was hit.
// Critical hit: crit slash frames, plus a small screen shake and a blue vignette and flash.
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

// The vignette and flash layer over the whole combat screen (created once)
function critFxLayer(stage) {
    let fx = stage.querySelector('.crit-fx-layer');
    if (!fx) {
        fx = document.createElement('div');
        fx.className = 'crit-fx-layer';
        fx.innerHTML = '<div class="crit-vignette"></div><div class="crit-flash"></div>';
        stage.appendChild(fx);
    }
    return fx;
}

// Plays a slash frame sequence over the monster at selector.
// screenFx: also shake the screen and show the vignette and flash (critical hits only)
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

// Critical hit: crit slash with screen shake, vignette and flash
function playCritFx(selector) {
    playSlashFx(selector, CRIT_SLASH_FRAMES, CRIT_SLASH_FRAME_MS, CRIT_SLASH_SCALE, true);
}

// Normal hit: atkslay slash only
function playAtkFx(selector) {
    playSlashFx(selector, ATK_SLASH_FRAMES, ATK_SLASH_FRAME_MS, ATK_SLASH_SCALE, false);
}
