// Left-to-right glint over combat sprites (hero, monsters, dropped items) for a 3D look.
// Each glint is a div placed over the sprite's box and clipped to the sprite's own shape (CSS mask),
// so only the sprite itself shines. Currently enabled on the earth path only (SHINE_PATHS).
(function () {
    const SHINE_PATHS = ['earth'];
    const overlays = new Map(); // source img -> glint div

    function shineActive() {
        const view = document.getElementById('view-combat');
        return !!view && !view.classList.contains('hidden') &&
            typeof currentPath !== 'undefined' && SHINE_PATHS.includes(currentPath);
    }

    function shineTargets() {
        const list = [];
        const hero = document.getElementById('combat-player-sprite');
        if (hero) list.push(hero);
        document.querySelectorAll('#monsters-lineup-container img.monster-idle').forEach(el => list.push(el));
        document.querySelectorAll('#combat-stage .ground-drop img').forEach(el => list.push(el));
        return list;
    }

    function glintFor(src, stage) {
        let g = overlays.get(src);
        if (!g) {
            g = document.createElement('div');
            g.className = 'shine-glint';
            stage.appendChild(g);
            overlays.set(src, g);
        }
        return g;
    }

    function tick() {
        requestAnimationFrame(tick);
        const stage = document.querySelector('#combat-stage .ts-inner');
        const live = new Set();
        if (stage && shineActive()) {
            const ib = stage.getBoundingClientRect();
            const sc = (stage.offsetWidth ? ib.width / stage.offsetWidth : 1) || 1;
            shineTargets().forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.width < 2 || r.height < 2) return; // hidden or not drawn
                const url = 'url("' + (el.currentSrc || el.src) + '")';
                live.add(el);
                const g = glintFor(el, stage);
                g.style.display = 'block'; // the class starts hidden; show it explicitly
                g.style.left = ((r.left - ib.left) / sc) + 'px';
                g.style.top = ((r.top - ib.top) / sc) + 'px';
                g.style.width = (r.width / sc) + 'px';
                g.style.height = (r.height / sc) + 'px';
                if (g.dataset.mask !== url) {
                    g.dataset.mask = url;
                    g.style.webkitMaskImage = url;
                    g.style.maskImage = url;
                }
            });
        }
        // Hide glints whose sprite is gone or the stage is not on an active path
        overlays.forEach((g, el) => {
            if (!live.has(el)) {
                if (!el.isConnected) { g.remove(); overlays.delete(el); }
                else g.style.display = 'none';
            }
        });
    }

    // Clear every glint when the combat view leaves (stale overlays would otherwise linger)
    window.addEventListener('pagehide', () => overlays.forEach(g => g.remove()));
    requestAnimationFrame(tick);
})();
