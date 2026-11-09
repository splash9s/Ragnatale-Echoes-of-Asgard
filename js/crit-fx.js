// ==========================================
// CRITICAL HIT EFFECT
// When the player lands a critical hit: a slash animation over the monster that was hit,
// a small screen shake, a blue vignette and a flash across the combat screen.
// Called from the monster hit code in ui.js (only for critical hits).
// ==========================================

// Slash frames in play order. Width/height are the frames' own pixel sizes.
const CRIT_SLASH_FRAMES = [
    { src: 'assets/combat/crit/slash20_q85.webp', w: 235, h: 275 },
    { src: 'assets/combat/crit/slash21_q85.webp', w: 730, h: 521 },
    { src: 'assets/combat/crit/slash22_q85.webp', w: 715, h: 508 },
    { src: 'assets/combat/crit/slash23_q85.webp', w: 695, h: 498 },
    { src: 'assets/combat/crit/slash24_q85.webp', w: 690, h: 496 },
    { src: 'assets/combat/crit/slash25_q85.webp', w: 664, h: 482 },
];
const CRIT_SLASH_FRAME_MS = 80;  // time each frame stays on screen
const CRIT_SLASH_SCALE = 0.6;    // frames are drawn at this fraction of their own size (design px)

let critSlashTimer = null;

// Restarts a CSS animation class even when it is already playing
function restartFxClass(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // force a reflow so the animation starts again
    el.classList.add(cls);
}

// The shine, vignette and flash layer over the whole combat screen (created once)
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

// selector: the monster image that was hit (same selector the damage numbers use)
function playCritFx(selector) {
    const view = document.getElementById('view-combat');
    if (!view || view.classList.contains('hidden')) return;
    const stage = document.getElementById('combat-stage');
    const inner = stage ? stage.querySelector('.ts-inner') : null;
    const anchor = document.querySelector(selector);
    if (!stage || !inner || !anchor) return;

    // Screen effects
    restartFxClass(stage, 'crit-shake');
    restartFxClass(critFxLayer(stage), 'crit-on');

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
        const fr = CRIT_SLASH_FRAMES[f];
        const w = fr.w * CRIT_SLASH_SCALE, h = fr.h * CRIT_SLASH_SCALE;
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
        if (f >= CRIT_SLASH_FRAMES.length) {
            clearInterval(critSlashTimer);
            img.style.display = 'none';
            return;
        }
        show();
    }, CRIT_SLASH_FRAME_MS);
}
