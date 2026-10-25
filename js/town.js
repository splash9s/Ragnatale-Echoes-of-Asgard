// ==========================================
// TOWN (HAVEN OF DAWN) ART PAGE
// Scales the 1920x1080 art stage to fit the window, handles press states,
// runs the hero idle loop, and opens the existing screens from the buttons.
// ==========================================

(function () {
    const stage = document.getElementById('town-stage');
    const inner = stage ? stage.querySelector('.ts-inner') : null;
    if (!stage || !inner) return;

    // Scale the stage to the width of the Haven view
    // Fit the whole 1920x1080 art inside the window (contain), centered.
    // Each stage declares its design size in data-w / data-h (default 1920x1080).
    function fitStage(st) {
        const inn = st.querySelector('.ts-inner');
        const W = Number(st.dataset.w) || 1920, H = Number(st.dataset.h) || 1080;
        const s = Math.min(window.innerWidth / W, window.innerHeight / H);
        if (!inn || !s) return;
        inn.style.transform = `scale(${s})`;
        st.style.width = (W * s) + 'px';
        st.style.height = (H * s) + 'px';
    }
    function fitTown() {
        document.querySelectorAll('.town-stage').forEach(fitStage);
    }
    window.addEventListener('resize', fitTown);
    fitTown();

    // Replace a missing image with a labeled placeholder box
    window.townSwap = function (img, name) {
        const box = document.createElement('div');
        box.className = 'missing';
        box.textContent = name;
        img.replaceWith(box);
    };

    // Button actions. Mail opens the Quests & Mail screen. Setting opens the Setting page.
    const TOWN_ACTIONS = {
        events:     () => switchView('events'),
        diamond:    () => switchView('diamond'),
        mail:       () => switchView('quests'),
        setting:    () => switchView('setting'),
        character:  () => switchView('character'),
        artisan:    () => switchView('forge'),
        expedition: () => switchView('expeditions'),
    };

    inner.querySelectorAll('.ui[data-action]').forEach(el => {
        const img = el.querySelector('img');
        if (!img) return;
        const normal = img.getAttribute('src');
        const pressed = normal.replace(/\.png$/, 'press.png');
        // Show the press image while the pointer is down
        // Hover shows the press image too (mouse over), click/tap shows it while held
        el.addEventListener('pointerenter', () => { img.src = pressed; });
        el.addEventListener('pointerdown', () => { img.src = pressed; });
        el.addEventListener('pointerup', () => { img.src = normal; });
        el.addEventListener('pointerleave', () => { img.src = normal; });
        el.addEventListener('pointercancel', () => { img.src = normal; });
        el.addEventListener('click', () => {
            const fn = TOWN_ACTIONS[el.dataset.action];
            if (fn) fn();
        });
    });

    // Hero idle loop: 8 frames at 4 fps
    const frames = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `assets/page01/idle_breathing_sheet.png_000${n}.png`);
    const hero = document.getElementById('town-hero');
    let i = 0;
    if (hero) setInterval(() => {
        i = (i + 1) % frames.length;
        hero.src = frames[i];
    }, 250);

    // ---- Campaign map (Expedition Gates) ----
    window.openCampaignPath = function (path) {
        if (typeof selectCampaignPath === 'function') selectCampaignPath(path);
        document.getElementById('campaign-panel')?.classList.remove('hidden');
    };
    window.closeCampaignPanel = function () {
        document.getElementById('campaign-panel')?.classList.add('hidden');
    };
    window.onFinalNode = function () {
        if (typeof isFinalMapUnlocked === 'function' && !isFinalMapUnlocked()) {
            alert('Clear the Fire, Water, Earth and Wind paths first.');
            return;
        }
        startExpedition('campaign', { final: true });
    };
    window.updateExpoNodes = function () {
        const f = document.getElementById('expo-node-final');
        if (f && typeof isFinalMapUnlocked === 'function') f.classList.toggle('locked', !isFinalMapUnlocked());
    };
    // Return buttons: show the press image while the mouse is over them
    document.querySelectorAll('img[src$="returnbutton.png"]').forEach(img => {
        const normal = img.getAttribute('src');
        const pressed = normal.replace(/returnbutton\.png$/, 'returnbuttonpress.png');
        const host = img.parentElement;
        host.addEventListener('pointerenter', () => { img.src = pressed; });
        host.addEventListener('pointerleave', () => { img.src = normal; });
    });
})();
