// ==========================================
// RAGNATALE - LOADER
// Shows the loading screen, preloads images and sounds with a progress bar, then starts the game.
// ==========================================

const LOADING_SOUNDS = [
    'sound/bgm.wav',
    'sound/critical.wav',
    'sound/hit.wav',
    'sound/lvup.wav',
    'sound/mvp.wav',
    'sound/slime_dead.mp3'
];

const LOADING_IMAGES = [
    "assets/avatars/abyssalimp.png",
    "assets/avatars/cavebat.png",
    "assets/avatars/farbo.png",
    "assets/avatars/leafspritemage.png",
    "assets/avatars/monster1.png",
    "assets/avatars/monster2.png",
    "assets/avatars/monster3.png",
    "assets/avatars/monster4.png",
    "assets/avatars/monster5.png",
    "assets/avatars/monster6.png",
    "assets/avatars/monster7.png",
    "assets/avatars/monster8.png",
    "assets/avatars/mossyboulder.png",
    "assets/avatars/slime.png",
    "assets/avatars/snowwolf.png",
    "assets/avatars/starlightmender.png",
    "assets/combat/cha/cha_idle_0001.png",
    "assets/combat/cha/cha_idle_0002.png",
    "assets/combat/cha/cha_idle_0003.png",
    "assets/combat/cha/cha_idle_0004.png",
    "assets/combat/cha/cha_idle_0005.png",
    "assets/combat/cha/cha_idle_0006.png",
    "assets/combat/cha/cha_idle_0007.png",
    "assets/combat/cha/cha_idle_0008.png",
    "assets/combat/cha/cha_idle_0009.png",
    "assets/combat/cha/cha_idle_0010.png",
    "assets/combat/cha/cha_idle_0011.png",
    "assets/combat/cha/cha_idle_0012.png",
    "assets/combat/chabattle/chabattle_idle_0001.png",
    "assets/combat/chabattle/chabattle_idle_0002.png",
    "assets/combat/chabattle/chabattle_idle_0003.png",
    "assets/combat/chabattle/chabattle_idle_0004.png",
    "assets/combat/chabattle/chabattle_idle_0005.png",
    "assets/combat/chabattle/chabattle_idle_0006.png",
    "assets/combat/chabattle/chabattle_idle_0007.png",
    "assets/combat/chabattle/chabattle_idle_0008.png",
    "assets/combat/chabattle/chabattle_idle_0009.png",
    "assets/combat/chabattle/chabattle_idle_0010.png",
    "assets/combat/chabattle/chabattle_idle_0011.png",
    "assets/combat/chabattle/chabattle_idle_0012.png",
    "assets/combat/characterinfo.png",
    "assets/combat/earthbase1.png",
    "assets/combat/earthbg1.png",
    "assets/combat/earthbg2_q85.jpg",
    "assets/combat/earthbase2_q85.webp",
    "assets/combat/earthbase3_q85.webp",
    "assets/combat/earthfg1.png",
    "assets/combat/elixirslot.png",
    "assets/combat/elixirslotpress.png",
    "assets/combat/nopotion.png",
    "assets/combat/player/cri_0001.png",
    "assets/combat/player/cri_0002.png",
    "assets/combat/player/hit_0001.png",
    "assets/combat/player/hit_0002.png",
    "assets/combat/potionslot.png",
    "assets/combat/potionslotpress.png",
    "assets/combat/runes/r1.png",
    "assets/combat/runes/r2.png",
    "assets/combat/runes/r3.png",
    "assets/combat/runes/r4.png",
    "assets/combat/runes/r5.png",
    "assets/combat/slime/slime_0001.png",
    "assets/combat/slime/slime_0002.png",
    "assets/combat/slime/slime_0003.png",
    "assets/combat/slime/slime_0004.png",
    "assets/combat/slime/slime_0005.png",
    "assets/combat/slime/slime_0006.png",
    "assets/combat/slime/slime_0007.png",
    "assets/combat/slime/slime_0008.png",
    "assets/combat/slime/slime_0009.png",
    "assets/combat/slime/slime_0010.png",
    "assets/combat/slime/slime_0011.png",
    "assets/combat/slime/slime_0012.png",
    "assets/combat/slime/slime_damage_0001.png",
    "assets/combat/slime/slime_dead_0001.png",
    "assets/combat/slime/slime_dead_0002.png",
    "assets/combat/slime/slime_dead_0003.png",
    "assets/combat/slime/slime_dead_0004.png",
    "assets/combat/slime/slime_dead_0005.png",
    "assets/combat/slime/slime_dead_0006.png",
    "assets/compaign/compaign.png",
    "assets/compaign/mapbutton.png",
    "assets/compaign/mapbuttonoff.png",
    "assets/compaign/returnbutton.png",
    "assets/compaign/returnbuttonpress.png",
    "assets/compaign/smallretunbutton.png",
    "assets/compaign/smallretunbuttonpress.png",
    "assets/page01/articanbutton.png",
    "assets/page01/articanbuttonpress.png",
    "assets/page01/bgmain.png",
    "assets/page01/cha_idle_0001.png",
    "assets/page01/cha_idle_0002.png",
    "assets/page01/cha_idle_0003.png",
    "assets/page01/cha_idle_0004.png",
    "assets/page01/cha_idle_0005.png",
    "assets/page01/cha_idle_0006.png",
    "assets/page01/cha_idle_0007.png",
    "assets/page01/cha_idle_0008.png",
    "assets/page01/cha_idle_0009.png",
    "assets/page01/cha_idle_0010.png",
    "assets/page01/cha_idle_0011.png",
    "assets/page01/cha_idle_0012.png",
    "assets/page01/characterbutton.png",
    "assets/page01/characterbuttonpress.png",
    "assets/page01/characterinfo.png",
    "assets/page01/diamondbutton.png",
    "assets/page01/diamondbuttonpress.png",
    "assets/page01/eventsbutton.png",
    "assets/page01/eventsbuttonpress.png",
    "assets/page01/expeditionbutton.png",
    "assets/page01/expeditionbuttonpress.png",
    "assets/page01/idle2_breathing_sheet.png_0001.png",
    "assets/page01/idle_breathing_sheet.png_0001.png",
    "assets/page01/idle_breathing_sheet.png_0002.png",
    "assets/page01/idle_breathing_sheet.png_0003.png",
    "assets/page01/idle_breathing_sheet.png_0004.png",
    "assets/page01/idle_breathing_sheet.png_0005.png",
    "assets/page01/idle_breathing_sheet.png_0006.png",
    "assets/page01/idle_breathing_sheet.png_0007.png",
    "assets/page01/idle_breathing_sheet.png_0008.png",
    "assets/page01/mailbutton.png",
    "assets/page01/mailbuttonpress.png",
    "assets/page01/setting.png",
    "assets/page01/settingpress.png",
    "assets/page01/shadow2.png",
    "assets/page01/shadow_clean.png",
    "assets/page01/shoppagebutton.png",
    "assets/page01/shoppagebuttonpress.png",
    "assets/pages/artisan/bg.png",
    "assets/pages/artisan/window.png",
    "assets/pages/character/bg.png",
    "assets/pages/character/cha_idle.png",
    "assets/pages/character/idle.png",
    "assets/pages/character/inventoryslot.png",
    "assets/pages/character/shadow.png",
    "assets/pages/character/shadow_clean.png",
    "assets/pages/character/slots/armorslot.png",
    "assets/pages/character/slots/footslot.png",
    "assets/pages/character/slots/garmentslot.png",
    "assets/pages/character/slots/headslot.png",
    "assets/pages/character/slots/lowerheadslot.png",
    "assets/pages/character/slots/middleheadslot.png",
    "assets/pages/character/slots/petslot.png",
    "assets/pages/character/slots/potionslot.png",
    "assets/pages/character/slots/ring.png",
    "assets/pages/character/slots/shieldslot.png",
    "assets/pages/character/slots/weaponslot.png",
    "assets/pages/character/window.png",
    "assets/pages/diamond/bg.png",
    "assets/pages/diamond/layout.png",
    "assets/pages/events/bg.png",
    "assets/pages/events/layout.png",
    "assets/pages/frame/c.png",
    "assets/pages/mail/bg.jpg",
    "assets/pages/mail/layout.png",
    "assets/pages/setting/bg.jpg",
    "assets/pages/setting/layout.png",
    "assets/pages/skill/bg.png",
    "assets/pages/skill/window.png"
];

function setLoading(percent, text) {
    const fill = document.getElementById('loading-bar-fill');
    const pct = document.getElementById('loading-percent');
    const label = document.getElementById('loading-text');
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    if (fill) fill.style.width = value + '%';
    if (pct) pct.innerText = value + '%';
    if (label && text) label.innerText = text;
}

function preloadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // a missing image should not block the game
        img.src = src;
    });
}

function preloadSound(src) {
    return fetch(src).then(r => r.blob()).catch(() => {}); // cached by the browser for later playback
}

function runPreload() {
    const groups = [
        { label: 'Loading images', items: LOADING_IMAGES, load: preloadImage },
        { label: 'Loading sounds', items: LOADING_SOUNDS, load: preloadSound }
    ];
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    let done = 0;
    let chain = Promise.resolve();
    groups.forEach(g => {
        chain = chain.then(() => Promise.all(g.items.map(src =>
            g.load(src).then(() => {
                done++;
                setLoading((done / total) * 100, `${g.label}: ${src} (${done} / ${total})`);
            })
        )));
    });
    return chain;
}

function hideLoading() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    screen.style.opacity = '0';
    setTimeout(() => { screen.style.display = 'none'; }, 400);
}

window.addEventListener('load', () => {
    setLoading(0, 'Starting Ragnatale...');
    runPreload()
        .then(() => {
            setLoading(100, 'Preparing town...');
            if (typeof startGame === 'function') startGame();
            hideLoading();
        })
        .catch(err => {
            console.log('Preload failed:', err);
            if (typeof startGame === 'function') startGame();
            hideLoading();
        });
});
