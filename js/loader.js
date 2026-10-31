// ==========================================
// RAGNATALE - LOADER
// Shows the loading screen, preloads images and sounds with a progress bar, then starts the game.
// ==========================================

const LOADING_SOUNDS = [
    'sound/bgm.mp3',
    'sound/critical.mp3',
    'sound/hit.mp3',
    'sound/lvup.mp3',
    'sound/mvp.mp3',
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
    "assets/combat/rockgolem/rockgolem.png",
    "assets/combat/rockgolem/rockgolemattack.png",
    "assets/combat/rockgolem/rockgolemdamaged.png",
    "assets/combat/rockgolem/rockgolemdead.png",
    "assets/combat/mossyboulder/mossyboulder.png",
    "assets/combat/mossyboulder/mossyboulderattack.png",
    "assets/combat/mossyboulder/mossyboulderdamaged.png",
    "assets/combat/mossyboulder/mossyboulderdead.png",
    "assets/combat/goblinarcher/goblinarcher.png",
    "assets/combat/goblinarcher/goblinarcherattack.png",
    "assets/combat/goblinarcher/goblinarcherdamaged.png",
    "assets/combat/goblinarcher/goblinarcherdead.png",
    "assets/combat/icegolem/icegolem.png",
    "assets/combat/icegolem/icegolemattack.png",
    "assets/combat/icegolem/icegolemdamaged.png",
    "assets/combat/icegolem/icegolemdead.png",
    "assets/combat/frostarcher/frostarcher.png",
    "assets/combat/frostarcher/frostarcherattack.png",
    "assets/combat/frostarcher/frostarcherdamaged.png",
    "assets/combat/frostarcher/frostarcherdead.png",
    "assets/combat/frostshaman/frostshaman.png",
    "assets/combat/frostshaman/frostshamanattack.png",
    "assets/combat/frostshaman/frostshamandamaged.png",
    "assets/combat/frostshaman/frostshamandead.png",
    "assets/combat/jotunfrostmage/jotunfrostmage.png",
    "assets/combat/jotunfrostmage/jotunfrostmageattack.png",
    "assets/combat/jotunfrostmage/jotunfrostmagedamaged.png",
    "assets/combat/jotunfrostmage/jotunfrostmagedead.png",
    "assets/combat/flamearcher/flamearcher.png",
    "assets/combat/flamearcher/flamearcherattack.png",
    "assets/combat/flamearcher/flamearcherdamaged.png",
    "assets/combat/flamearcher/flamearcherdead.png",
    "assets/combat/emberpriest/emberpriest.png",
    "assets/combat/emberpriest/emberpriestattack.png",
    "assets/combat/emberpriest/emberpriestdamaged.png",
    "assets/combat/emberpriest/emberpriestdead.png",
    "assets/combat/muspelflamemage/muspelflamemage.png",
    "assets/combat/muspelflamemage/muspelflamemageattack.png",
    "assets/combat/muspelflamemage/muspelflamemagedamaged.png",
    "assets/combat/muspelflamemage/muspelflamemagedead.png",
    "assets/combat/battlestormmage/battlestormmage.png",
    "assets/combat/battlestormmage/battlestormmageattack.png",
    "assets/combat/battlestormmage/battlestormmagedamaged.png",
    "assets/combat/battlestormmage/battlestormmagedead.png",
    "assets/combat/halowarden/halowarden.png",
    "assets/combat/halowarden/halowardenattack.png",
    "assets/combat/halowarden/halowardendamaged.png",
    "assets/combat/halowarden/halowardendead.png",
    "assets/combat/valkyriehealer/valkyriehealer.png",
    "assets/combat/valkyriehealer/valkyriehealerattack.png",
    "assets/combat/valkyriehealer/valkyriehealerdamaged.png",
    "assets/combat/valkyriehealer/valkyriehealerdead.png",
    "assets/combat/cavebeast/cavebeast.png",
    "assets/combat/cavebeast/cavebeastattack.png",
    "assets/combat/cavebeast/cavebeastdamaged.png",
    "assets/combat/cavebeast/cavebeastdead1.png",
    "assets/combat/cavebeast/cavebeastdead2.png",
    "assets/combat/giantmossslime/giantmossslime.png",
    "assets/combat/giantmossslime/giantmossslimeattack.png",
    "assets/combat/giantmossslime/giantmossslimedamaged.png",
    "assets/combat/giantmossslime/giantmossslimedead.png",
    "assets/combat/helstonemage/helstonemage.png",
    "assets/combat/helstonemage/helstonemageattack.png",
    "assets/combat/helstonemage/helstonemagedamaged.png",
    "assets/combat/helstonemage/helstonemagedead.png",
    "assets/combat/halopriest/halopriest.png",
    "assets/combat/halopriest/halopriestattack.png",
    "assets/combat/halopriest/halopriestdamaged.png",
    "assets/combat/halopriest/halopriestdead.png",
    "assets/combat/koboltsniper/koboltsniper.png",
    "assets/combat/koboltsniper/koboltsniperattack.png",
    "assets/combat/koboltsniper/koboltsniperdamaged.png",
    "assets/combat/koboltsniper/koboltsniperdead.png",
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
    "assets/combat/potionslot.png",
    "assets/combat/potionslotpress.png",
    "assets/combat/runes/r1.png",
    "assets/combat/runes/r2.png",
    "assets/combat/runes/r3.png",
    "assets/combat/runes/r4.png",
    "assets/combat/runes/r5.png",
    "assets/compaign/compaign.png",
    "assets/compaign/compaign2.png",
    "assets/compaign/mapbutton.png",
    "assets/compaign/mapbuttonoff.png",
    "assets/compaign/returnbutton.png",
    "assets/compaign/returnbuttonpress.png",
    "assets/compaign/smallretunbutton.png",
    "assets/compaign/smallretunbuttonpress.png",
    "assets/page01/articanbutton.png",
    "assets/page01/articanbuttonpress.png",
    "assets/page01/bgmain.png",
    "assets/page01/mainbg.png",
    "assets/cha/chabase.png",
    "assets/cha/chashadow.png",
    "assets/page01/cha_idle_0001.png",
    "assets/page01/characterbutton.png",
    "assets/page01/characterbuttonpress.png",
    "assets/page01/characterinfo.png",
    "assets/page01/diamondbutton.png",
    "assets/page01/diamondbuttonpress.png",
    "assets/page01/eventsbutton.png",
    "assets/page01/eventsbuttonpress.png",
    "assets/page01/expeditionbutton.png",
    "assets/page01/expeditionbuttonpress.png",
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
