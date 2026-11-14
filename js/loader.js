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
    "assets/avatars/abyssalimp_q85.webp",
    "assets/avatars/cavebat_q85.webp",
    "assets/avatars/farbo_q85.webp",
    "assets/avatars/leafspritemage_q85.webp",
    "assets/avatars/monster1_q85.webp",
    "assets/avatars/monster2_q85.webp",
    "assets/avatars/monster3_q85.webp",
    "assets/avatars/monster4_q85.webp",
    "assets/avatars/monster5_q85.webp",
    "assets/avatars/monster6_q85.webp",
    "assets/avatars/monster7_q85.webp",
    "assets/avatars/monster8_q85.webp",
    "assets/avatars/mossyboulder_q85.webp",
    "assets/avatars/slime_q85.webp",
    "assets/avatars/snowwolf_q85.webp",
    "assets/avatars/starlightmender_q85.webp",
    "assets/avatars/man1_q85.webp",
    "assets/avatars/man2_q85.webp",
    "assets/avatars/man3_q85.webp",
    "assets/avatars/woman1_q85.webp",
    "assets/avatars/woman2_q85.webp",
    "assets/avatars/woman3_q85.webp",
    "assets/avatars/woman4_q85.webp",
    "assets/avatars/cat1_q85.webp",
    "assets/avatars/cat2_q85.webp",
    "assets/avatars/cat3_q85.webp",
    "assets/avatars/cat4_q85.webp",
    "assets/avatars/cat5_q85.webp",
    "assets/avatars/bosslv1_q85.webp",
    "assets/avatars/bosslv10_q85.webp",
    "assets/avatars/bosslv20_q85.webp",
    "assets/avatars/bosslv30_q85.webp",
    "assets/avatars/bosslv40_q85.webp",
    "assets/avatars/bosslv50_q85.webp",
    "assets/avatars/bosslv60_q85.webp",
    "assets/avatars/bosslv70_q85.webp",
    "assets/avatars/bosslv80_q85.webp",
    "assets/avatars/bosslv90_q85.webp",
    "assets/avatars/bosslv99_q85.webp",
    "assets/avatars/man4_q85.webp",
    "assets/avatars/man5_q85.webp",
    "assets/avatars/man6_q85.webp",
    "assets/avatars/man7_q85.webp",
    "assets/avatars/woman5_q85.webp",
    "assets/avatars/woman6_q85.webp",
    "assets/avatars/cat14_q85.webp",
    "assets/avatars/dog1_q85.webp",
    "assets/avatars/dog2_q85.webp",
    "assets/avatars/dog3_q85.webp",
    "assets/avatars/money1_q85.webp",
    "assets/avatars/money2_q85.webp",
    "assets/avatars/money3_q85.webp",
    "assets/avatars/girlmeme_q85.webp",
    "assets/combat/rockgolem/rockgolem_q85.webp",
    "assets/combat/rockgolem/rockgolemattack_q85.webp",
    "assets/combat/rockgolem/rockgolemdamaged_q85.webp",
    "assets/combat/rockgolem/rockgolemdead_q85.webp",
    "assets/combat/mossyboulder/mossyboulder_q85.webp",
    "assets/combat/mossyboulder/mossyboulderattack_q85.webp",
    "assets/combat/mossyboulder/mossyboulderdamaged_q85.webp",
    "assets/combat/mossyboulder/mossyboulderdead_q85.webp",
    "assets/combat/goblinarcher/goblinarcher_q85.webp",
    "assets/combat/goblinarcher/goblinarcherattack_q85.webp",
    "assets/combat/goblinarcher/goblinarcherdamaged_q85.webp",
    "assets/combat/goblinarcher/goblinarcherdead_q85.webp",
    "assets/combat/icegolem/icegolem_q85.webp",
    "assets/combat/icegolem/icegolemattack_q85.webp",
    "assets/combat/icegolem/icegolemdamaged_q85.webp",
    "assets/combat/icegolem/icegolemdead_q85.webp",
    "assets/combat/frostarcher/frostarcher_q85.webp",
    "assets/combat/frostarcher/frostarcherattack_q85.webp",
    "assets/combat/frostarcher/frostarcherdamaged_q85.webp",
    "assets/combat/frostarcher/frostarcherdead_q85.webp",
    "assets/combat/frostshaman/frostshaman_q85.webp",
    "assets/combat/frostshaman/frostshamanattack_q85.webp",
    "assets/combat/frostshaman/frostshamandamaged_q85.webp",
    "assets/combat/frostshaman/frostshamandead_q85.webp",
    "assets/combat/jotunfrostmage/jotunfrostmage_q85.webp",
    "assets/combat/jotunfrostmage/jotunfrostmageattack_q85.webp",
    "assets/combat/jotunfrostmage/jotunfrostmagedamaged_q85.webp",
    "assets/combat/jotunfrostmage/jotunfrostmagedead_q85.webp",
    "assets/combat/flamearcher/flamearcher_q85.webp",
    "assets/combat/flamearcher/flamearcherattack_q85.webp",
    "assets/combat/flamearcher/flamearcherdamaged_q85.webp",
    "assets/combat/flamearcher/flamearcherdead_q85.webp",
    "assets/combat/emberpriest/emberpriest_q85.webp",
    "assets/combat/emberpriest/emberpriestattack_q85.webp",
    "assets/combat/emberpriest/emberpriestdamaged_q85.webp",
    "assets/combat/emberpriest/emberpriestdead_q85.webp",
    "assets/combat/muspelflamemage/muspelflamemage_q85.webp",
    "assets/combat/muspelflamemage/muspelflamemageattack_q85.webp",
    "assets/combat/muspelflamemage/muspelflamemagedamaged_q85.webp",
    "assets/combat/muspelflamemage/muspelflamemagedead_q85.webp",
    "assets/combat/battlestormmage/battlestormmage_q85.webp",
    "assets/combat/battlestormmage/battlestormmageattack_q85.webp",
    "assets/combat/battlestormmage/battlestormmagedamaged_q85.webp",
    "assets/combat/battlestormmage/battlestormmagedead_q85.webp",
    "assets/combat/halowarden/halowarden_q85.webp",
    "assets/combat/halowarden/halowardenattack_q85.webp",
    "assets/combat/halowarden/halowardendamaged_q85.webp",
    "assets/combat/halowarden/halowardendead_q85.webp",
    "assets/combat/valkyriehealer/valkyriehealer_q85.webp",
    "assets/combat/valkyriehealer/valkyriehealerattack_q85.webp",
    "assets/combat/valkyriehealer/valkyriehealerdamaged_q85.webp",
    "assets/combat/valkyriehealer/valkyriehealerdead_q85.webp",
    "assets/combat/cavebeast/cavebeast_q85.webp",
    "assets/combat/cavebeast/cavebeastattack0_q85.webp",
    "assets/combat/cavebeast/cavebeastattack_q85.webp",
    "assets/combat/cavebeast/cavebeastdamaged_q85.webp",
    "assets/combat/cavebeast/cavebeastdead1_q85.webp",
    "assets/combat/cavebeast/cavebeastdead2_q85.webp",
    "assets/combat/sandking/sandking_q85.webp",
    "assets/combat/sandking/sandkingattack_q85.webp",
    "assets/combat/sandking/sandkingdamaged_q85.webp",
    "assets/combat/sandking/sandkingdead_q85.webp",
    "assets/combat/abysslord/abysslord_q85.webp",
    "assets/combat/abysslord/abysslordattack1_q85.webp",
    "assets/combat/abysslord/abysslordattack2_q85.webp",
    "assets/combat/abysslord/abysslorddamaged_q85.webp",
    "assets/combat/abysslord/abysslorddead_q85.webp",
    "assets/combat/fallenangel/fallenangel_q85.webp",
    "assets/combat/fallenangel/fallenangelattack_q85.webp",
    "assets/combat/fallenangel/fallenangeldamaged_q85.webp",
    "assets/combat/fallenangel/fallenangeldead1_q85.webp",
    "assets/combat/fallenangel/fallenangeldead2_q85.webp",
    "assets/combat/worldeater/worldeater_q85.webp",
    "assets/combat/worldeater/worldeaterattack_q85.webp",
    "assets/combat/worldeater/worldeaterdamaged_q85.webp",
    "assets/combat/worldeater/worldeaterdead1_q85.webp",
    "assets/combat/worldeater/worldeaterdead2_q85.webp",
    "assets/combat/frostking/frostking_q85.webp",
    "assets/combat/frostking/frostkingattack1_q85.webp",
    "assets/combat/frostking/frostkingattack2_q85.webp",
    "assets/combat/frostking/frostkingdamaged_q85.webp",
    "assets/combat/frostking/frostkingdead1_q85.webp",
    "assets/combat/frostking/frostkingdead2_q85.webp",
    "assets/combat/valkyrie/valkyrie_q85.webp",
    "assets/combat/valkyrie/valkyrieattack_q85.webp",
    "assets/combat/valkyrie/valkyriedamaged_q85.webp",
    "assets/combat/valkyrie/valkyriedead1_q85.webp",
    "assets/combat/valkyrie/valkyriedead2_q85.webp",
    "assets/combat/surtr/surtr_q85.webp",
    "assets/combat/surtr/surtrattack_q85.webp",
    "assets/combat/surtr/surtrdamaged_q85.webp",
    "assets/combat/surtr/surtrdead1_q85.webp",
    "assets/combat/surtr/surtrdead2_q85.webp",
    "assets/combat/queenhel/queenhel_q85.webp",
    "assets/combat/queenhel/queenhelattack_q85.webp",
    "assets/combat/queenhel/queenheldamaged_q85.webp",
    "assets/combat/queenhel/queenheldead1_q85.webp",
    "assets/combat/queenhel/queenheldead2_q85.webp",
    "assets/combat/voidcolossus/voidcolossus_q85.webp",
    "assets/combat/voidcolossus/voidcolossusattack_q85.webp",
    "assets/combat/voidcolossus/voidcolossusdamaged_q85.webp",
    "assets/combat/voidcolossus/voidcolossusdead1_q85.webp",
    "assets/combat/voidcolossus/voidcolossusdead2_q85.webp",
    "assets/combat/voidcolossus/voidcolossusdead3_q85.webp",
    "assets/combat/giantmossslime/giantmossslime_q85.webp",
    "assets/combat/giantmossslime/giantmossslimeattack0_q85.webp",
    "assets/combat/giantmossslime/giantmossslimeattack1_q85.webp",
    "assets/combat/giantmossslime/giantmossslimedamaged_q85.webp",
    "assets/combat/giantmossslime/giantmossslimedead_q85.webp",
    "assets/combat/helstonemage/helstonemage_q85.webp",
    "assets/combat/helstonemage/helstonemageattack_q85.webp",
    "assets/combat/helstonemage/helstonemagedamaged_q85.webp",
    "assets/combat/helstonemage/helstonemagedead_q85.webp",
    "assets/combat/halopriest/halopriest_q85.webp",
    "assets/combat/halopriest/halopriestattack_q85.webp",
    "assets/combat/halopriest/halopriestdamaged_q85.webp",
    "assets/combat/halopriest/halopriestdead_q85.webp",
    "assets/combat/koboltsniper/koboltsniper_q85.webp",
    "assets/combat/koboltsniper/koboltsniperattack_q85.webp",
    "assets/combat/koboltsniper/koboltsniperdamaged_q85.webp",
    "assets/combat/koboltsniper/koboltsniperdead_q85.webp",
    "assets/combat/characterinfo_q85.webp",
    "assets/combat/earthbase1_q85.webp",
    "assets/combat/earthbg1_q85.webp",
    "assets/combat/earthbg2_q85.webp",
    "assets/combat/earthbase2_q85.webp",
    "assets/combat/earthbase3_q85.webp",
    "assets/combat/earthfg1_q85.webp",
    "assets/combat/earth1/e1bg.webp",
    "assets/combat/earth1/e1base.webp",
    "assets/combat/earth1/e1mg.webp",
    "assets/combat/earth3d/sky.webp",
    "assets/combat/earth3d/forest.webp",
    "assets/combat/earth3d/base.webp",
    "assets/combat/elixirslot_q85.webp",
    "assets/combat/elixirslotpress_q85.webp",
    "assets/combat/pause_sign.png",
    "assets/combat/pause_sign_press.png",
    "assets/combat/auto_sign.png",
    "assets/combat/auto_sign_press.png",
    "assets/combat/nopotion_q85.webp",
    "assets/combat/potionslot_q85.webp",
    "assets/combat/potionslotpress_q85.webp",
    "assets/combat/runes/r1_q85.webp",
    "assets/combat/runes/r2_q85.webp",
    "assets/combat/runes/r3_q85.webp",
    "assets/combat/runes/r4_q85.webp",
    "assets/combat/runes/r5_q85.webp",
    "assets/compaign/compaign_q85.webp",
    "assets/compaign/mapselect02_q85.webp",
    "assets/compaign/mapbutton_q85.webp",
    "assets/compaign/mapbuttonoff_q85.webp",
    "assets/cha/button/returnbuttonsmall_q85.webp",
    "assets/cha/button/returnbuttonpresssmall_q85.webp",
    "assets/compaign/returnbutton_q85.webp",
    "assets/compaign/returnbuttonpress_q85.webp",
    "assets/compaign/smallretunbutton_q85.webp",
    "assets/compaign/smallretunbuttonpress_q85.webp",
    "assets/page01/articanbutton_q85.webp",
    "assets/page01/articanbuttonpress_q85.webp",
    "assets/page01/bgmain_q85.webp",
    "assets/page01/mainbg_q85.webp",
    "assets/page01/mainbg03_q85.webp",
    "assets/page01/cart/c1_q85.webp",
    "assets/page01/cart/c2_q85.webp",
    "assets/page01/cart/c3_q85.webp",
    "assets/page01/cart/c4_q85.webp",
    "assets/page01/cart/c5_q85.webp",
    "assets/page01/cart/c6_q85.webp",
    "assets/page01/cat/c1_q85.webp",
    "assets/page01/cat/c2_q85.webp",
    "assets/page01/cat/c3_q85.webp",
    "assets/page01/cat/c4_q85.webp",
    "assets/page01/cat/c5_q85.webp",
    "assets/page01/cat/c6_q85.webp",
    "assets/page01/cat/lick1_q85.webp",
    "assets/page01/cat/lick2_q85.webp",
    "assets/page01/cat/lick3_q85.webp",
    "assets/page01/cat/lick4_q85.webp",
    "assets/page01/smith/k1_q85.webp",
    "assets/page01/smith/k2_q85.webp",
    "assets/page01/smith/k3_q85.webp",
    "assets/page01/smith/k4_q85.webp",
    "assets/page01/smith/k5_q85.webp",
    "assets/page01/smith/k6_q85.webp",
    "assets/page01/smith/k7_q85.webp",
    "assets/page01/smith/k8_q85.webp",
    "assets/page01/smith/k9_q85.webp",
    "assets/page01/straw/s1_q85.webp",
    "assets/page01/straw/s2_q85.webp",
    "assets/page01/straw/s3_q85.webp",
    "assets/page01/straw/s4_q85.webp",
    "assets/page01/straw/s5_q85.webp",
    "assets/page01/straw/s6_q85.webp",
    "assets/page01/straw/s7_q85.webp",
    "assets/page01/straw/s8_q85.webp",
    "assets/cha/shadowclean_q85.webp",
    "assets/page01/mainfg02_v2_q85.webp",
    "assets/cha/chashadow_q85.webp",
    "assets/page01/cha_idle_0001_q85.webp",
    "assets/page01/characterbutton_q85.webp",
    "assets/page01/characterbuttonpress_q85.webp",
    "assets/page01/characterinfo_q85.webp",
    "assets/page01/diamondbutton_q85.webp",
    "assets/page01/diamondbuttonpress_q85.webp",
    "assets/page01/eventsbutton_q85.webp",
    "assets/page01/eventsbuttonpress_q85.webp",
    "assets/page01/expedition_v3_q85.webp",
    "assets/page01/expedition_v3press_q85.webp",
    "assets/page01/mailbutton_q85.webp",
    "assets/page01/mailbuttonpress_q85.webp",
    "assets/page01/friendbutton_q85.webp",
    "assets/page01/friendbuttonpress_q85.webp",
    "assets/pages/friend/bg_q85.webp",
    "assets/page01/setting_q85.webp",
    "assets/page01/settingpress_q85.webp",
    "assets/page01/shadow2_q85.webp",
    "assets/page01/shadow_clean_q85.webp",
    "assets/page01/shoppagebutton_q85.webp",
    "assets/page01/shoppagebuttonpress_q85.webp",
    "assets/pages/artisan/bg_q85.webp",
    "assets/pages/artisan/window_q85.webp",
    "assets/pages/character/bg_q85.webp",
    "assets/pages/character/cha_idle_q85.webp",
    "assets/pages/character/idle_q85.webp",
    "assets/pages/character/inventoryslot_q85.webp",
    "assets/pages/character/inventoryslot2.png",
    "assets/pages/character/shadow_q85.webp",
    "assets/pages/character/shadow_clean_q85.webp",
    "assets/pages/character/slots/armorslot_q85.webp",
    "assets/pages/character/slots/footslot_q85.webp",
    "assets/pages/character/slots/garmentslot_q85.webp",
    "assets/pages/character/slots/headslot_q85.webp",
    "assets/pages/character/slots/lowerheadslot_q85.webp",
    "assets/pages/character/slots/middleheadslot_q85.webp",
    "assets/pages/character/slots/petslot_q85.webp",
    "assets/pages/character/slots/potionslot_q85.webp",
    "assets/pages/character/slots/ring_q85.webp",
    "assets/pages/character/slots/shieldslot_q85.webp",
    "assets/pages/character/slots/weaponslot_q85.webp",
    "assets/pages/character/window_q85.webp",
    "assets/pages/diamond/bg_q85.webp",
    "assets/pages/diamond/layout_q85.webp",
    "assets/pages/events/bg_q85.webp",
    "assets/pages/events/layout_q85.webp",
    "assets/pages/frame/c_q85.webp",
    "assets/pages/mail/bg_q85.webp",
    "assets/pages/mail/layout_q85.webp",
    "assets/pages/setting/bg_q85.webp",
    "assets/pages/setting/layout_q85.webp",
    "assets/pages/skill/bg_q85.webp",
    "assets/pages/skill/window_q85.webp"
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

// Only the art the town needs is loaded before the game starts (main page, hero, cart, shared buttons).
// Everything else loads in the background after the game has started.
const CRITICAL_IMAGE_PREFIXES = ['assets/page01/', 'assets/cha/', 'assets/icons/', 'assets/page/'];
function isCriticalImage(src) {
    return CRITICAL_IMAGE_PREFIXES.some(prefix => src.startsWith(prefix));
}

// First visit (no local save): only the sign-in and character select art loads before the page opens.
// The town art loads while the player is on those screens (loadTownArtInBackground).
function isFirstVisit() {
    try { return !localStorage.getItem('ragnatale_save'); } catch (e) { return false; }
}
const FIRST_SCREEN_PREFIXES = ['assets/compaign/']; // sign-in and character select backgrounds (map select art)
function isFirstScreenImage(src) {
    return FIRST_SCREEN_PREFIXES.some(prefix => src.startsWith(prefix));
}

// Resolves when the town art is ready; fast players wait on it (waitForTownArt) before the town opens
let townArtResolve;
window.townAssetsReady = new Promise(resolve => { townArtResolve = resolve; });

function runPreload() {
    const firstVisit = isFirstVisit();
    const critical = LOADING_IMAGES.filter(firstVisit ? isFirstScreenImage : isCriticalImage);
    const total = critical.length;
    let done = 0;
    return Promise.all(critical.map(src =>
        preloadImage(src).then(() => {
            done++;
            setLoading((done / total) * 100, `Loading images: ${src} (${done} / ${total})`);
        })
    )).then(() => {
        if (firstVisit) return; // the town art and hero art load in loadTownArtInBackground
        townArtResolve();
        return loadHeroArtBands(HERO_ART_EARLY_BANDS); // the hero's early gear art is needed on the town page
    });
}

// First visit: the town art loads while the sign-in page is open
function loadTownArtInBackground() {
    const town = LOADING_IMAGES.filter(isCriticalImage);
    let next = 0;
    const worker = () => {
        if (next >= town.length) return Promise.resolve();
        const src = town[next++];
        return preloadImage(src).then(worker, worker);
    };
    return Promise.all([worker(), worker(), worker()])
        .then(() => loadHeroArtBands(HERO_ART_EARLY_BANDS))
        .then(() => townArtResolve(), () => townArtResolve());
}

// Called before the town opens: if the town art is still loading, the loading screen waits for it
window.waitForTownArt = async function () {
    let ready = false;
    window.townAssetsReady.then(() => { ready = true; });
    await Promise.resolve();
    if (ready) return;
    const screen = document.getElementById('loading-screen');
    if (screen) { screen.style.display = ''; screen.style.opacity = '1'; }
    setLoading(0, 'Preparing town...');
    await window.townAssetsReady;
    hideLoading();
};

// Loads the rest of the images and all sounds in the background, a few at a time, with no progress bar.
// A file that is not loaded yet still loads when its page opens, so nothing waits on this.
function preloadRest() {
    const rest = LOADING_IMAGES.filter(src => !isCriticalImage(src))
        .map(src => () => preloadImage(src))
        .concat(LOADING_SOUNDS.map(src => () => preloadSound(src)));
    let next = 0;
    const worker = () => {
        if (next >= rest.length) return Promise.resolve();
        const job = rest[next++];
        return job().then(worker, worker);
    };
    for (let k = 0; k < 3; k++) worker();
}

function hideLoading() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    screen.style.opacity = '0';
    setTimeout(() => { screen.style.display = 'none'; }, 400);
}

window.addEventListener('load', () => {
    setLoading(0, 'Starting Rune Thread...');
    // The loading screen always goes away, even if the preload or the game start fails
    const start = () => {
        try { if (typeof startGame === 'function') startGame(); }
        catch (err) { console.error('Start failed:', err); }
        hideLoading();
    };
    const firstVisit = isFirstVisit();
    runPreload()
        .then(() => setLoading(100, 'Preparing town...'))
        .catch(err => console.log('Preload failed:', err))
        .then(start)
        .then(() => (firstVisit ? loadTownArtInBackground() : null))
        .then(preloadRest)
        .then(() => loadHeroArtBands(HERO_ART_LATER_BANDS)); // higher gear art, in level order, after the game starts
});

// Phone browsers (Chrome): go full screen on a touch, since Chrome does not do it by itself.
// Only touches start it (desktop clicks are ignored), and only while the page is not already full screen.
(function () {
    const el = document.documentElement;
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!request) return; // not supported (e.g. iPhone Safari): nothing to do
    document.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        if (document.fullscreenElement || document.webkitFullscreenElement) return;
        try {
            const r = request.call(el);
            if (r && r.catch) r.catch(() => {}); // refused (no gesture, or disabled): ignore
        } catch (err) { /* ignore */ }
    }, { passive: true });
})();
