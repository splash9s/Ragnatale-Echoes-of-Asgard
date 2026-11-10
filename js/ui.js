// ==========================================
// RAGNATALE - UI.JS
// ==========================================

// Avatar set. Each entry has an unlock rule; an entry with no rule is open to everyone.
//   lv:   Base Lv. needed
//   boss: defeat the Map Lv. N boss on all four element paths (fire, water, earth, wind)
const AVATAR_SET = [
    { path: "assets/avatars/man1_q85.webp" },
    { path: "assets/avatars/man2_q85.webp" },
    { path: "assets/avatars/man3_q85.webp", lv: 20 },
    { path: "assets/avatars/woman1_q85.webp" },
    { path: "assets/avatars/woman2_q85.webp" },
    { path: "assets/avatars/woman3_q85.webp" },
    { path: "assets/avatars/woman4_q85.webp", lv: 50 },
    { path: "assets/avatars/cat1_q85.webp", lv: 1 },
    { path: "assets/avatars/cat2_q85.webp", lv: 10 },
    { path: "assets/avatars/cat3_q85.webp", lv: 20 },
    { path: "assets/avatars/cat4_q85.webp", lv: 20 },
    { path: "assets/avatars/cat5_q85.webp", lv: 30 },
    { path: "assets/avatars/bosslv1_q85.webp", boss: 1 },
    { path: "assets/avatars/bosslv10_q85.webp", boss: 10 },
    { path: "assets/avatars/bosslv20_q85.webp", boss: 20 },
    { path: "assets/avatars/bosslv30_q85.webp", boss: 30 },
    { path: "assets/avatars/bosslv40_q85.webp", boss: 40 },
    { path: "assets/avatars/bosslv50_q85.webp", boss: 50 },
    { path: "assets/avatars/bosslv60_q85.webp", boss: 60 },
    { path: "assets/avatars/bosslv70_q85.webp", boss: 70 },
    { path: "assets/avatars/bosslv80_q85.webp", boss: 80 },
    { path: "assets/avatars/bosslv90_q85.webp", boss: 90 },
    { path: "assets/avatars/bosslv99_q85.webp", boss: 99 },
    { path: "assets/avatars/man4_q85.webp", lv: 40 },
    { path: "assets/avatars/man5_q85.webp", lv: 60 },
    { path: "assets/avatars/man6_q85.webp", lv: 80 },
    { path: "assets/avatars/man7_q85.webp", die: 1000 },
    { path: "assets/avatars/woman5_q85.webp", lv: 50 },
    { path: "assets/avatars/woman6_q85.webp", lv: 60 },
    { path: "assets/avatars/cat14_q85.webp" }, // new: no condition yet
    { path: "assets/avatars/dog1_q85.webp", lv: 15 },
    { path: "assets/avatars/dog2_q85.webp", lv: 25 },
    { path: "assets/avatars/dog3_q85.webp", lv: 50 },
    { path: "assets/avatars/money1_q85.webp", spend: 10 },
    { path: "assets/avatars/money2_q85.webp", spend: 100 },
    { path: "assets/avatars/money3_q85.webp", spend: 1000 },
    { path: "assets/avatars/girlmeme_q85.webp" }, // new: no condition yet
];
const AVATARS = AVATAR_SET.map(a => a.path);
// Avatar value is either an emoji or an image path (assets/avatars/... or data:image...)
function avatarMarkup(av, cls) {
    if (av && (av.startsWith("assets/") || av.startsWith("data:image"))) return `<img src="${av}" class="${cls}" />`;
    return `<img src="assets/avatars/slime_q85.webp" class="${cls}" />`;
}
let selectedAvatarChoice = "assets/avatars/man1_q85.webp";
let currentLanguage = 'en';
const SHOP_ARMORY_ITEMS = (typeof SHOP_ITEMS !== 'undefined' ? SHOP_ITEMS : []).slice().sort((a, b) => (a.levelReq || 1) - (b.levelReq || 1));

const GOLD_SHOP_CONSUMABLES = [
    { id: 'potion_minor', name: "Minor Healing Potion", price: 100, type: 'potion', heal: 200, desc: "Restores 200 HP" },
    { id: 'potion_med', name: "Medium Healing Potion", price: 300, type: 'potion', heal: 500, desc: "Restores 500 HP" },
    { id: 'potion_large', name: "Large Healing Potion", price: 2000, type: 'potion', healPct: 20, desc: "Restores 20% of max HP" },
    { id: 'gchest_copper', name: "Copper Chest", price: 2500, type: 'chest', chestType: 'copper', desc: "" },
    { id: 'gchest_silver', name: "Silver Chest", price: 10000, type: 'chest', chestType: 'silver', desc: "" },
    { id: 'gchest_gold', name: "Gold Chest", price: 20000, type: 'chest', chestType: 'gold', desc: "" }
];

// Healing potion numbers come from GOLD_SHOP_CONSUMABLES (matched by name), so potions already in a save heal the current amount.
// Minor and Medium heal a fixed HP; Large heals healPct % of max HP.
function potionTemplateOf(item) {
    if (!item) return null;
    return GOLD_SHOP_CONSUMABLES.find(t => t.type === 'potion' && t.name === item.name) || null;
}
function potionHealAmount(item, maxHp) {
    const t = potionTemplateOf(item) || item || {};
    if (t.healPct) return Math.max(1, Math.round(maxHp * t.healPct / 100));
    return t.heal || 0;
}
function potionHealText(item) {
    const t = potionTemplateOf(item) || item || {};
    return t.healPct ? `${t.healPct}% of max HP` : `${t.heal} HP`;
}

const DIAMOND_SHOP_ITEMS = [
    { id: 'vip_pass', name: "VIP Pass (30 days)", desc: "Auto stage, Get Resurrection Potion everyday.", price: 200, type: 'vip', days: 30, icon: 'assets/shop/diamond/vip31.png' },
    { id: 'vip_7d', name: "VIP Pass (7 days)", desc: "Auto stage, Get Resurrection Potion everyday.", price: 50, type: 'vip', days: 7, icon: 'assets/shop/diamond/vip7.png' },
    { id: 'vip_1d', name: "VIP Pass (1 day)", desc: "Auto stage, Get Resurrection Potion everyday.", price: 10, type: 'vip', days: 1, icon: 'assets/shop/diamond/vip1.png' },
    { id: 'pet_loyal_slime', name: "Support Slime Pet", desc: "ATK +2%, HP +100 (Thank you for your support!)", price: 50, type: 'pet', stats: { hp: 100, atkPct: 2 }, icon: 'assets/shop/diamond/slimebase.png' },
    { id: 'res_potion', name: "Resurrection Potion", price: 1, type: 'resurrection', desc: "Auto-revives you with full HP on death.", icon: 'assets/shop/diamond/resurrectionpotion.png' },
    { id: 'ref_stone_bundle', name: "Refining Stone Bundle (x5)", price: 8, type: 'material', qty: 5, desc: "Gain 5 Refining Stones for upgrading equipment.", icon: 'assets/shop/diamond/refiningstone.png' },
    { id: 'bs_rune_stone', name: "Blacksmith Rune Stone", price: 5, type: 'bs_rune', desc: "If a refine fails, the gear keeps its level. Used up when it saves a gear.", icon: 'assets/shop/diamond/blacksmithrunestone.png' },
    { id: 'exp_2x_1h', name: "2x EXP (1 hour)", price: 10, type: 'boost', boost: 'exp', ms: 60 * 60 * 1000, desc: "Double Base and Class EXP from kills for 1 hour.", icon: 'assets/shop/diamond/expmulti.png' },
    { id: 'gold_2x_1h', name: "2x Gold (1 hour)", price: 10, type: 'boost', boost: 'gold', ms: 60 * 60 * 1000, desc: "Double gold from kills for 1 hour.", icon: 'assets/shop/diamond/goldmulti.png' },
    { id: 'stat_reset', name: "Status Reset Service", price: 10, type: 'service', desc: "", icon: 'assets/shop/diamond/resetstat.png' },
    { id: 'skill_reset', name: "Skill Reset Service", price: 10, type: 'skill_reset', desc: "", icon: 'assets/shop/diamond/resetskill.png' },
    { id: 'dchest_copper', name: "Copper Chest", price: 1, type: 'chest', chestType: 'copper', desc: "", icon: 'assets/shop/diamond/copperchest.png' },
    { id: 'dchest_silver', name: "Silver Chest", price: 3, type: 'chest', chestType: 'silver', desc: "", icon: 'assets/shop/diamond/silverchest.png' },
    { id: 'dchest_gold', name: "Gold Chest", price: 5, type: 'chest', chestType: 'gold', desc: "", icon: 'assets/shop/diamond/goldchest.png' }
];










function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'th' : 'en';
}

function manualSaveGame() {
    saveGame();
    if (typeof cloudFlush === 'function') cloudFlush();
    showModal("Notice", "Your game progress has been successfully saved!");
}

function resetSaveGame() {
    if (confirm("Are you sure you want to reset all save data?")) {
        localStorage.removeItem('ragnatale_save');
        localStorage.removeItem('ragnatale_save_at');
        const done = typeof cloudDeleteSave === 'function' ? cloudDeleteSave() : Promise.resolve();
        done.finally(() => location.reload());
    }
}

// Unlock check for an avatar path. Custom uploads and unknown paths are always open.
function avatarRule(av) { return AVATAR_SET.find(a => a.path === av) || null; }
function isAvatarUnlocked(av) {
    const rule = avatarRule(av);
    if (!rule) return true;
    if (rule.lv && (player.baseLv || 1) < rule.lv) return false;
    if (rule.spend && (player.diamondsSpent || 0) <= rule.spend) return false;
    if (rule.die && (player.deathCount || 0) < rule.die) return false;
    if (rule.boss) return FINAL_PATH_KEYS.every(pk => !!(player.clearedMaps && player.clearedMaps[`${pk}:map${rule.boss}`]));
    return true;
}
function avatarLockText(av) {
    const rule = avatarRule(av);
    if (!rule) return '';
    if (rule.lv) return `Lv. ${rule.lv}`;
    if (rule.boss) return `Boss Lv. ${rule.boss}`;
    if (rule.spend) return `Diamonds bought over ${rule.spend}`;
    if (rule.die) return `Died ${rule.die} times`;
    return '';
}
function avatarLockTitle(av) {
    const rule = avatarRule(av);
    if (!rule) return '';
    if (rule.lv) return `Unlocks at Base Lv. ${rule.lv}`;
    if (rule.boss) return `Defeat the Map Lv. ${rule.boss} boss on all 4 elements`;
    if (rule.spend) return `Buy more than ${rule.spend} diamonds in total`;
    if (rule.die) return `Die ${rule.die} times in total`;
    return '';
}

function renderAvatarSelection() {
    let grid = document.getElementById('avatar-selection-grid');
    if (!grid) return;
    grid.innerHTML = '';
    // Name setup page: only the avatars this player can use
    AVATARS.filter(av => isAvatarUnlocked(av)).forEach((av) => {
        let isSelected = (av === selectedAvatarChoice);
        let borderClass = isSelected ? 'border-amber-400 bg-amber-500/20' : 'border-slate-700 bg-slate-900';
        grid.innerHTML += `
            <div onclick="selectAvatar('${av}')" class="aspect-square rounded-xl border ${borderClass} flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 transition">
                ${avatarMarkup(av, 'w-full h-full object-contain')}
            </div>
        `;
    });
}

function selectAvatar(av) {
    selectedAvatarChoice = av;
    renderAvatarSelection();
}

function handleCustomAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedAvatarChoice = e.target.result;
            let grid = document.getElementById('avatar-selection-grid');
            if (grid) {
                grid.innerHTML += `<div class="h-12 rounded-xl border border-amber-400 bg-amber-500/20 flex items-center justify-center text-xl overflow-hidden"><img src="${selectedAvatarChoice}" class="w-full h-full object-cover" /></div>`;
            }
        };
        reader.readAsDataURL(file);
    }
}

const MAX_NAME_LENGTH = 13;
const START_AVATAR = 'assets/avatars/man1_q85.webp'; // every new Vanguard starts with this avatar

// First play: sign-in page first (unless already signed in), then character selection
async function firstPlayStart() {
    if (await cloudHasSession()) {
        await cloudStart(); // returning from a Gmail sign-in: the saved game (if any) is loaded from the cloud
        showCharacterPage();
        return;
    }
    showSignInPage();
}
function showSignInPage() {
    document.getElementById('view-name-select')?.classList.add('hidden');
    document.getElementById('view-signin')?.classList.remove('hidden');
}
function showCharacterPage() {
    document.getElementById('view-signin')?.classList.add('hidden');
    const modal = document.getElementById('view-name-select');
    if (modal) { modal.classList.remove('hidden'); modal.style.display = ''; }
}
async function signInAnonymous() {
    await cloudSignInAnonymous(); // offline or failed: the game still continues on this browser
    if (cloudClient) await cloudStart();
    showCharacterPage();
}
async function signInWithGmail() {
    const started = await cloudSignInGmail(); // the page leaves for Google and comes back signed in
    if (!started) showCharacterPage();
}

let startNameBusy = false;
async function startGameWithName() {
    if (startNameBusy) return;
    startNameBusy = true;
    try {
        let nameInputEl = document.getElementById('input-player-name');
        let nameInput = nameInputEl ? nameInputEl.value.trim().slice(0, MAX_NAME_LENGTH) : "VanguardHero";

        // Player names are unique: a name another player uses is refused and the name window stays open
        if (nameInput && await cloudNameTaken(nameInput)) {
            showModal('Name taken', `"${nameInput}" is already used by another player. Choose a different name.`);
            return;
        }

        if (nameInput) player.name = nameInput;
        player.avatar = START_AVATAR;
        saveGame();
        if (typeof cloudPushProfile === 'function') cloudPushProfile(); // the friend list shows this name at once

        let nameSelectModal = document.getElementById('view-name-select');
        if (nameSelectModal) {
            nameSelectModal.classList.add('hidden');
            nameSelectModal.style.display = 'none';
        }

        logMessage(`[System] Welcome to Haven of Dawn, ${player.name}!`, 'winlose');
        updateUI();
    } finally {
        startNameBusy = false;
    }
}

// Combat animation: idle frames loop; after a hit, the damage frames play once (4 frames)
// One damage picture, shown for 480ms after a hit
const COMBAT_SLIME_DAMAGE_FRAMES = ['assets/combat/slime/slimedamaged_q85.webp'];
const COMBAT_DAMAGE_FRAME_MS = 360; // monster damaged animation (longer than before so the hit reads clearly)
// Monster red hit flash: shown over every pose (idle, damaged, attack, death) for this long
const COMBAT_HIT_FLASH_MS = 320;
const COMBAT_HIT_FLASH_FILTER = 'brightness(1.8) sepia(1) hue-rotate(-50deg) saturate(5)';
// Death: slime_dead_0001 to 0006 play once (150ms each), then the monster disappears
const COMBAT_SLIME_DEATH_FRAMES = ['assets/combat/slime/slimedead_q85.webp'];
const COMBAT_DEATH_FRAME_MS = 600;
const COMBAT_SLIME_ATTACK_FRAME = 'assets/combat/slime/slimeattack_q85.webp';
const COMBAT_MONSTER_ATTACK_MS = 300; // attack pose shown when a monster attacks
const COMBAT_MONSTER_LUNGE_PX = -40;  // monsters stand to the right of the player, so forward is left
const COMBAT_DEATH_TOTAL_MS = COMBAT_SLIME_DEATH_FRAMES.length * COMBAT_DEATH_FRAME_MS;
// Monsters with their own art, by monster id. Others use the slime frames (colour comes from CSS).
// idle: looping frames. attack: frame shown during the attack lunge. hurt: frames shown on a hit.
// dead: death frames, each shown for deathMs. shift: px offset per frame (keeps the feet on one spot;
// the frame is natural size, so frames with a different width are centred by their bounding box).
const MONSTER_SPRITES = {
    // Each frame is centred by its own canvas width (flex), so shift is only the correction from the feet-point check.
    // shift: { frame path: [dx, dy] px }. Frames without an entry use [0, 0].
    M006: { // Rock Golem
        idle: ['assets/combat/rockgolem/rockgolem_q85.webp'],
        attack: ['assets/combat/rockgolem/rockgolemattack_q85.webp'],
        hurt: ['assets/combat/rockgolem/rockgolemdamaged_q85.webp'],
        dead: ['assets/combat/rockgolem/rockgolemdead_q85.webp'],
        deathMs: 600
    },
    M007: { // Kobold Sniper
        idle: ['assets/combat/koboltsniper/koboltsniper_q85.webp'],
        attack: ['assets/combat/koboltsniper/koboltsniperattack_q85.webp'],
        hurt: ['assets/combat/koboltsniper/koboltsniperdamaged_q85.webp'],
        dead: ['assets/combat/koboltsniper/koboltsniperdead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/koboltsniper/koboltsniperdamaged_q85.webp': [-9, -2], 'assets/combat/koboltsniper/koboltsniperattack_q85.webp': [0, -2], 'assets/combat/koboltsniper/koboltsniperdead_q85.webp': [0, -1] }
    },
    M003: { // Goblin Archer
        idle: ['assets/combat/goblinarcher/goblinarcher_q85.webp'],
        attack: ['assets/combat/goblinarcher/goblinarcherattack_q85.webp'],
        hurt: ['assets/combat/goblinarcher/goblinarcherdamaged_q85.webp'],
        dead: ['assets/combat/goblinarcher/goblinarcherdead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/goblinarcher/goblinarcherattack_q85.webp': [-3, -2], 'assets/combat/goblinarcher/goblinarcherdead_q85.webp': [0, -1] }
    },
    M004: { // Giant Moss Slime (boss, map lv 1): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/giantmossslime/giantmossslime_q85.webp'],
        attack: ['assets/combat/giantmossslime/giantmossslimeattack_q85.webp'],
        hurt: ['assets/combat/giantmossslime/giantmossslimedamaged_q85.webp'],
        dead: ['assets/combat/giantmossslime/giantmossslimedead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/giantmossslime/giantmossslimeattack_q85.webp': [30, 3],
            'assets/combat/giantmossslime/giantmossslimedamaged_q85.webp': [7, 6],
            'assets/combat/giantmossslime/giantmossslimedead_q85.webp': [6, 6]
        }
    },
    M084: { // Hel Stone Mage (earth mage): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/helstonemage/helstonemage_q85.webp'],
        attack: ['assets/combat/helstonemage/helstonemageattack_q85.webp'],
        hurt: ['assets/combat/helstonemage/helstonemagedamaged_q85.webp'],
        dead: ['assets/combat/helstonemage/helstonemagedead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/helstonemage/helstonemageattack_q85.webp': [0, 2],
            'assets/combat/helstonemage/helstonemagedamaged_q85.webp': [-10, 2],
            'assets/combat/helstonemage/helstonemagedead_q85.webp': [0, 1]
        }
    },
    M008: { // Cave Beast (boss, map lv 10): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/cavebeast/cavebeast_q85.webp'],
        attack: ['assets/combat/cavebeast/cavebeastattack_q85.webp'],
        hurt: ['assets/combat/cavebeast/cavebeastdamaged_q85.webp'],
        dead: ['assets/combat/cavebeast/cavebeastdead1_q85.webp', 'assets/combat/cavebeast/cavebeastdead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/cavebeast/cavebeastattack_q85.webp': [0, -3],
            'assets/combat/cavebeast/cavebeastdamaged_q85.webp': [0, 0],
            'assets/combat/cavebeast/cavebeastdead1_q85.webp': [0, 50],
            'assets/combat/cavebeast/cavebeastdead2_q85.webp': [0, 49]
        }
    },
    M012: { // Sand King (boss, map lv 20): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/sandking/sandking_q85.webp'],
        attack: ['assets/combat/sandking/sandkingattack_q85.webp'],
        hurt: ['assets/combat/sandking/sandkingdamaged_q85.webp'],
        dead: ['assets/combat/sandking/sandkingdead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/sandking/sandkingattack_q85.webp': [88.0, 3.2],
            'assets/combat/sandking/sandkingdamaged_q85.webp': [-13.0, -4.5],
            'assets/combat/sandking/sandkingdead_q85.webp': [151.0, 47.5]
        }
    },
    M016: { // Abyss Lord (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/abysslord/abysslord_q85.webp'],
        attack: ['assets/combat/abysslord/abysslordattack1_q85.webp', 'assets/combat/abysslord/abysslordattack2_q85.webp'],
        hurt: ['assets/combat/abysslord/abysslorddamaged_q85.webp'],
        dead: ['assets/combat/abysslord/abysslorddead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/abysslord/abysslordattack1_q85.webp': [-9.0, 6.0],
            'assets/combat/abysslord/abysslordattack2_q85.webp': [-15.0, 9.0],
            'assets/combat/abysslord/abysslorddamaged_q85.webp': [6.0, 11.0],
            'assets/combat/abysslord/abysslorddead_q85.webp': [6.0, 8.0]
        }
    },
    M020: { // Fallen Angel (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/fallenangel/fallenangel_q85.webp'],
        attack: ['assets/combat/fallenangel/fallenangelattack_q85.webp'],
        hurt: ['assets/combat/fallenangel/fallenangeldamaged_q85.webp'],
        dead: ['assets/combat/fallenangel/fallenangeldead1_q85.webp', 'assets/combat/fallenangel/fallenangeldead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/fallenangel/fallenangelattack_q85.webp': [-178.0, -2.0],
            'assets/combat/fallenangel/fallenangeldamaged_q85.webp': [-72.5, 0.0],
            'assets/combat/fallenangel/fallenangeldead1_q85.webp': [-203.0, -2.0],
            'assets/combat/fallenangel/fallenangeldead2_q85.webp': [385.0, 9.0]
        }
    },
    M024: { // Dusk World-Eater (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/worldeater/worldeater_q85.webp'],
        attack: ['assets/combat/worldeater/worldeaterattack_q85.webp'],
        hurt: ['assets/combat/worldeater/worldeaterdamaged_q85.webp'],
        dead: ['assets/combat/worldeater/worldeaterdead1_q85.webp', 'assets/combat/worldeater/worldeaterdead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/worldeater/worldeaterattack_q85.webp': [-95.0, -1.0],
            'assets/combat/worldeater/worldeaterdamaged_q85.webp': [-122.0, 5.0],
            'assets/combat/worldeater/worldeaterdead1_q85.webp': [-202.0, 2.0],
            'assets/combat/worldeater/worldeaterdead2_q85.webp': [-121.0, 12.0]
        }
    },
    M049: { // Hrym, Frost King (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/frostking/frostking_q85.webp'],
        attack: ['assets/combat/frostking/frostkingattack1_q85.webp', 'assets/combat/frostking/frostkingattack2_q85.webp'],
        hurt: ['assets/combat/frostking/frostkingdamaged_q85.webp'],
        dead: ['assets/combat/frostking/frostkingdead1_q85.webp', 'assets/combat/frostking/frostkingdead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/frostking/frostkingattack1_q85.webp': [-37.5, 7.0],
            'assets/combat/frostking/frostkingattack2_q85.webp': [-149.5, 11.0],
            'assets/combat/frostking/frostkingdamaged_q85.webp': [-38.0, 5.0],
            'assets/combat/frostking/frostkingdead1_q85.webp': [-40.5, 15.0],
            'assets/combat/frostking/frostkingdead2_q85.webp': [-31.0, 4.0]
        }
    },
    M062: { // Brynhild (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/valkyrie/valkyrie_q85.webp'],
        attack: ['assets/combat/valkyrie/valkyrieattack_q85.webp'],
        hurt: ['assets/combat/valkyrie/valkyriedamaged_q85.webp'],
        dead: ['assets/combat/valkyrie/valkyriedead1_q85.webp', 'assets/combat/valkyrie/valkyriedead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/valkyrie/valkyrieattack_q85.webp': [-127.5, 15.0],
            'assets/combat/valkyrie/valkyriedamaged_q85.webp': [-80.0, 5.0],
            'assets/combat/valkyrie/valkyriedead1_q85.webp': [-79.5, 15.0],
            'assets/combat/valkyrie/valkyriedead2_q85.webp': [-70.5, 11.0]
        }
    },
    M075: { // Surtr (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/surtr/surtr_q85.webp'],
        attack: ['assets/combat/surtr/surtrattack_q85.webp'],
        hurt: ['assets/combat/surtr/surtrdamaged_q85.webp'],
        dead: ['assets/combat/surtr/surtrdead1_q85.webp', 'assets/combat/surtr/surtrdead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/surtr/surtrattack_q85.webp': [122.0, 0.0],
            'assets/combat/surtr/surtrdamaged_q85.webp': [70.0, 8.0],
            'assets/combat/surtr/surtrdead1_q85.webp': [118.0, 11.0],
            'assets/combat/surtr/surtrdead2_q85.webp': [213.5, 5.0]
        }
    },
    M088: { // Queen Hel (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/queenhel/queenhel_q85.webp'],
        attack: ['assets/combat/queenhel/queenhelattack_q85.webp'],
        hurt: ['assets/combat/queenhel/queenheldamaged_q85.webp'],
        dead: ['assets/combat/queenhel/queenheldead1_q85.webp', 'assets/combat/queenhel/queenheldead2_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/queenhel/queenhelattack_q85.webp': [91.0, 7.0],
            'assets/combat/queenhel/queenheldamaged_q85.webp': [-77.5, -4.0],
            'assets/combat/queenhel/queenheldead1_q85.webp': [-6.5, 2.0],
            'assets/combat/queenhel/queenheldead2_q85.webp': [-79.5, 3.0]
        }
    },
    M104: { // Void Colossus (boss): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/voidcolossus/voidcolossus_q85.webp'],
        attack: ['assets/combat/voidcolossus/voidcolossusattack_q85.webp'],
        hurt: ['assets/combat/voidcolossus/voidcolossusdamaged_q85.webp'],
        dead: ['assets/combat/voidcolossus/voidcolossusdead1_q85.webp', 'assets/combat/voidcolossus/voidcolossusdead2_q85.webp', 'assets/combat/voidcolossus/voidcolossusdead3_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/voidcolossus/voidcolossusattack_q85.webp': [-209.0, 4.0],
            'assets/combat/voidcolossus/voidcolossusdamaged_q85.webp': [-4.5, 2.0],
            'assets/combat/voidcolossus/voidcolossusdead1_q85.webp': [-29.0, 2.0],
            'assets/combat/voidcolossus/voidcolossusdead2_q85.webp': [131.0, 9.0],
            'assets/combat/voidcolossus/voidcolossusdead3_q85.webp': [272.0, -3.0]
        }
    },
    M060: { // Battle Storm Mage (wind mage): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/battlestormmage/battlestormmage_q85.webp'],
        attack: ['assets/combat/battlestormmage/battlestormmageattack_q85.webp'],
        hurt: ['assets/combat/battlestormmage/battlestormmagedamaged_q85.webp'],
        dead: ['assets/combat/battlestormmage/battlestormmagedead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/battlestormmage/battlestormmageattack_q85.webp': [0, 0],
            'assets/combat/battlestormmage/battlestormmagedamaged_q85.webp': [0, 0],
            'assets/combat/battlestormmage/battlestormmagedead_q85.webp': [0, -9]
        }
    },
    M033: { // Halo Warden (wind tank): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/halowarden/halowarden_q85.webp'],
        attack: ['assets/combat/halowarden/halowardenattack_q85.webp'],
        hurt: ['assets/combat/halowarden/halowardendamaged_q85.webp'],
        dead: ['assets/combat/halowarden/halowardendead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/halowarden/halowardenattack_q85.webp': [11, -5],
            'assets/combat/halowarden/halowardendamaged_q85.webp': [-11, -2],
            'assets/combat/halowarden/halowardendead_q85.webp': [27, -3]
        }
    },
    M056: { // Valkyrie Healer (wind healer): natural size; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/valkyriehealer/valkyriehealer_q85.webp'],
        attack: ['assets/combat/valkyriehealer/valkyriehealerattack_q85.webp'],
        hurt: ['assets/combat/valkyriehealer/valkyriehealerdamaged_q85.webp'],
        dead: ['assets/combat/valkyriehealer/valkyriehealerdead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/valkyriehealer/valkyriehealerattack_q85.webp': [17, 4],
            'assets/combat/valkyriehealer/valkyriehealerdamaged_q85.webp': [29, 3],
            'assets/combat/valkyriehealer/valkyriehealerdead_q85.webp': [0, 1]
        }
    },
    M102: { // Halo Priest (floating: no ground shift, each frame is centred and bottom-aligned)
        idle: ['assets/combat/halopriest/halopriest_q85.webp'],
        attack: ['assets/combat/halopriest/halopriestattack_q85.webp'],
        hurt: ['assets/combat/halopriest/halopriestdamaged_q85.webp'],
        dead: ['assets/combat/halopriest/halopriestdead_q85.webp'],
        deathMs: 600
    },
    M025: { // Mossy Boulder
        idle: ['assets/combat/mossyboulder/mossyboulder_q85.webp'],
        attack: ['assets/combat/mossyboulder/mossyboulderattack_q85.webp'],
        hurt: ['assets/combat/mossyboulder/mossyboulderdamaged_q85.webp'],
        dead: ['assets/combat/mossyboulder/mossyboulderdead_q85.webp'],
        deathMs: 600,
        shift: {
            'assets/combat/mossyboulder/mossyboulderattack_q85.webp': [2, -4],
            'assets/combat/mossyboulder/mossyboulderdamaged_q85.webp': [3, 1],
            'assets/combat/mossyboulder/mossyboulderdead_q85.webp': [3, -2]
        }
    },
    M040: { // Ice Golem: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/icegolem/icegolem_q85.webp'],
        attack: ['assets/combat/icegolem/icegolemattack_q85.webp'],
        hurt: ['assets/combat/icegolem/icegolemdamaged_q85.webp'],
        dead: ['assets/combat/icegolem/icegolemdead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/icegolem/icegolemattack_q85.webp': [0, 13], 'assets/combat/icegolem/icegolemdamaged_q85.webp': [9, -5], 'assets/combat/icegolem/icegolemdead_q85.webp': [0, 21] }
    },
    M041: { // Frost Archer: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/frostarcher/frostarcher_q85.webp'],
        attack: ['assets/combat/frostarcher/frostarcherattack_q85.webp'],
        hurt: ['assets/combat/frostarcher/frostarcherdamaged_q85.webp'],
        dead: ['assets/combat/frostarcher/frostarcherdead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/frostarcher/frostarcherattack_q85.webp': [-27, -3], 'assets/combat/frostarcher/frostarcherdamaged_q85.webp': [13, -2], 'assets/combat/frostarcher/frostarcherdead_q85.webp': [0, -1] }
    },
    M043: { // Frost Shaman: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/frostshaman/frostshaman_q85.webp'],
        attack: ['assets/combat/frostshaman/frostshamanattack_q85.webp'],
        hurt: ['assets/combat/frostshaman/frostshamandamaged_q85.webp'],
        dead: ['assets/combat/frostshaman/frostshamandead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/frostshaman/frostshamanattack_q85.webp': [-23, 2], 'assets/combat/frostshaman/frostshamandamaged_q85.webp': [0, -2], 'assets/combat/frostshaman/frostshamandead_q85.webp': [0, -2] }
    },
    M046: { // Jotun Frost Mage: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/jotunfrostmage/jotunfrostmage_q85.webp'],
        attack: ['assets/combat/jotunfrostmage/jotunfrostmageattack_q85.webp'],
        hurt: ['assets/combat/jotunfrostmage/jotunfrostmagedamaged_q85.webp'],
        dead: ['assets/combat/jotunfrostmage/jotunfrostmagedead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/jotunfrostmage/jotunfrostmageattack_q85.webp': [0, 2], 'assets/combat/jotunfrostmage/jotunfrostmagedamaged_q85.webp': [-18, 3], 'assets/combat/jotunfrostmage/jotunfrostmagedead_q85.webp': [0, 0] }
    },
    M067: { // Flame Archer: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/flamearcher/flamearcher_q85.webp'],
        attack: ['assets/combat/flamearcher/flamearcherattack_q85.webp'],
        hurt: ['assets/combat/flamearcher/flamearcherdamaged_q85.webp'],
        dead: ['assets/combat/flamearcher/flamearcherdead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/flamearcher/flamearcherattack_q85.webp': [-6, 4], 'assets/combat/flamearcher/flamearcherdamaged_q85.webp': [0, 5], 'assets/combat/flamearcher/flamearcherdead_q85.webp': [0, 2] }
    },
    M069: { // Ember Priest: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/emberpriest/emberpriest_q85.webp'],
        attack: ['assets/combat/emberpriest/emberpriestattack_q85.webp'],
        hurt: ['assets/combat/emberpriest/emberpriestdamaged_q85.webp'],
        dead: ['assets/combat/emberpriest/emberpriestdead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/emberpriest/emberpriestattack_q85.webp': [0, -1], 'assets/combat/emberpriest/emberpriestdamaged_q85.webp': [25, -4], 'assets/combat/emberpriest/emberpriestdead_q85.webp': [0, -12] }
    },
    M070: { // Muspel Flame Mage: natural size, own art; shift is [dx, dy] px so the feet stay on the same spot
        idle: ['assets/combat/muspelflamemage/muspelflamemage_q85.webp'],
        attack: ['assets/combat/muspelflamemage/muspelflamemageattack_q85.webp'],
        hurt: ['assets/combat/muspelflamemage/muspelflamemagedamaged_q85.webp'],
        dead: ['assets/combat/muspelflamemage/muspelflamemagedead_q85.webp'],
        deathMs: 600,
        shift: { 'assets/combat/muspelflamemage/muspelflamemageattack_q85.webp': [0, 0], 'assets/combat/muspelflamemage/muspelflamemagedamaged_q85.webp': [-11, -6], 'assets/combat/muspelflamemage/muspelflamemagedead_q85.webp': [17, -3] }
    }
};
function monsterSpriteOf(m) { return MONSTER_SPRITES[m.id] || null; }
function monsterDeathFrames(m) { const s = monsterSpriteOf(m); return s ? s.dead : COMBAT_SLIME_DEATH_FRAMES; }
// Bosses (and mini-bosses) stay on screen BOSS_DEATH_STAY_MS after they fall: first the damaged pose, then the death frames.
const BOSS_DEATH_STAY_MS = 3000;
const BOSS_HURT_MS = 600;
function monsterIsBoss(m) { return !!(m && (m.isBoss || m.isMiniBoss)); }
// Only full bosses get the slow-motion death (mini-bosses play the normal death speed, no fade)
function monsterIsSlowDeath(m) { return !!(m && m.isBoss); }
function monsterDeathHurtMs(m) { return monsterIsBoss(m) && monsterHurtFrames(m).length ? BOSS_HURT_MS : 0; }
function monsterDeathMs(m) {
    const s = monsterSpriteOf(m);
    if (monsterIsSlowDeath(m)) return Math.round((BOSS_DEATH_STAY_MS - monsterDeathHurtMs(m)) / Math.max(1, monsterDeathFrames(m).length));
    return s ? s.deathMs : COMBAT_DEATH_FRAME_MS;
}
function monsterDeathTotalMs(m) { return monsterDeathHurtMs(m) + monsterDeathFrames(m).length * monsterDeathMs(m); }
function monsterAttackFrame(m) { const s = monsterSpriteOf(m); return s && s.attack ? s.attack[0] : COMBAT_SLIME_ATTACK_FRAME; }
function monsterHurtFrames(m) { const s = monsterSpriteOf(m); return s ? (s.hurt || []) : COMBAT_SLIME_DAMAGE_FRAMES; }
// Show a monster frame on its card image, applying that frame's feet shift (px)
// Stun effect above the monster's head; the sprite loop shakes it
// Mini boss aura (version 2): rising embers, coloured by the map element
const MINI_EMBER_COLOR = { fire: '#ff2a1a', water: '#4fb8ff', ice: '#4fb8ff', earth: '#0b5d2b', wind: '#ffffff' };
function miniEmbersHTML(m) {
    if (!m.isMiniBoss || m.hp <= 0) return '';
    const el = m.element || (typeof currentPath !== 'undefined' && CAMPAIGN_PATHS[currentPath] ? CAMPAIGN_PATHS[currentPath].element : 'fire');
    const c = MINI_EMBER_COLOR[el] || '#ffd46b';
    const glow = `<span class="mini-aura" style="--ember:${c}"></span>`;
    const embers = [[30, -10, 0], [38, 14, 0.5], [62, -16, 1], [68, 8, 1.5], [50, -4, 0.25]]
        .map(([l, dx, d]) => `<span class="mini-ember" style="left:${l}%; --dx:${dx}px; --ember:${c}; animation-delay:${d}s"></span>`).join('');
    return glow + embers;
}
function stunFxHTML(m) {
    if (!(m.status && m.status.kind === 'stun' && m.hp > 0)) return '';
    return '<img class="stun-fx" src="assets/combat/stun/stuneffect_q85.webp" alt="" style="position:absolute; left:0; top:0; width:102px; height:78px; max-width:none; pointer-events:none; image-rendering:pixelated;">';
}
function setMonsterFrame(img, src) {
    img.src = src;
    const s = MONSTER_SPRITES[img.dataset.sprite];
    const sh = (s && s.shift && s.shift[src]) || [0, 0];
    const [dx, dy] = typeof sh === 'number' ? [sh, 0] : sh;
    img.style.left = dx + 'px';
    img.style.top = dy + 'px';
}
const COMBAT_SLIME_FRAMES = 'assets/combat/slime/slimebase_q85.webp';
// Floating damage number over a combat sprite: bold white normal, bold orange critical
function showCombatNumber(selector, amount, crit) {
    if (!(amount > 0)) return;
    showCombatText(selector, String(Math.round(amount)), crit ? 'crit' : '');
}
// Floating text above the top border of a combat sprite (damage numbers, MISS)
// Speech balloon at the top middle of the combat screen (white box, thick black border, big bold black text)
function showBossBalloon(text) {
    const stage = document.querySelector('#combat-stage .ts-inner');
    if (!stage) return;
    document.getElementById('boss-balloon')?.remove();
    const wrap = document.createElement('div');
    wrap.id = 'boss-balloon';
    wrap.style.cssText = 'position:absolute; left:960px; top:103px; transform:translateX(-50%); z-index:20; pointer-events:none;';
    const box = document.createElement('div');
    box.textContent = text;
    box.style.cssText = 'background:#ffffff; border:7px solid #000; padding:16px 34px; font-size:34px; font-weight:900; color:#000; white-space:nowrap; box-shadow:0 5px 0 #000;';
    wrap.appendChild(box);
    stage.appendChild(wrap);
    setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, 3000);
}
// Red floating notice (replaces browser alert popups). Floats above the anchor element, or the screen centre.
function showFloatNotice(text, anchorSel) {
    let x = window.innerWidth / 2, y = window.innerHeight * 0.4;
    const a = anchorSel ? document.querySelector(anchorSel) : null;
    if (a) { const b = a.getBoundingClientRect(); x = b.left + b.width / 2; y = b.top; }
    const d = document.createElement('div');
    d.className = 'float-notice';
    d.textContent = text;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1400);
}
// Width of the combat stage in design pixels (the .ts-inner box, which is scaled by fitStage)
function earthStageInnerWidth() {
    const inn = document.querySelector('#combat-stage .ts-inner');
    return (inn && parseFloat(inn.style.width)) || 1920;
}
function showCombatText(selector, text, variant) {
    const view = document.getElementById('view-combat');
    if (!view || view.classList.contains('hidden')) return;
    const anchor = document.querySelector(selector);
    const stage = document.querySelector('#combat-stage .ts-inner');
    if (!anchor || !stage) return;
    const sc = parseFloat(stage.style.transform.replace(/[^0-9.]/g, '')) || 1;
    const b = anchor.getBoundingClientRect(), ib = stage.getBoundingClientRect();
    const d = document.createElement('div');
    d.className = 'combat-dmg' + (variant ? ' ' + variant : '');
    d.textContent = text;
    d.style.left = ((b.left + b.width / 2 - ib.left) / sc) + 'px';
    d.style.top = ((b.top - ib.top) / sc) + 'px';
    stage.appendChild(d);
    setTimeout(() => d.remove(), variant === 'crit' ? 1400 : 900); // crit numbers stay 0.5s longer
}

// Green number floating over a healed combat sprite (monster or player)
function showHealNumber(selector, amount) {
    if (amount > 0 && selector) showCombatText(selector, '+' + amount, 'heal');
}
// Green aura over a combat sprite when it is healed (monster or player). Same placement as the damage numbers.
function showHealAura(selector) {
    const view = document.getElementById('view-combat');
    if (!view || view.classList.contains('hidden')) return;
    const anchor = document.querySelector(selector);
    const stage = document.querySelector('#combat-stage .ts-inner');
    if (!anchor || !stage) return;
    const sc = parseFloat(stage.style.transform.replace(/[^0-9.]/g, '')) || 1;
    const b = anchor.getBoundingClientRect(), ib = stage.getBoundingClientRect();
    const size = Math.max(b.width, b.height) / sc * 1.2;
    const cx = (b.left + b.width / 2 - ib.left) / sc, cy = (b.top + b.height / 2 - ib.top) / sc;
    const d = document.createElement('div');
    d.className = 'heal-aura';
    d.style.width = size + 'px';
    d.style.height = size + 'px';
    d.style.left = (cx - size / 2) + 'px';
    d.style.top = (cy - size / 2) + 'px';
    stage.appendChild(d);
    setTimeout(() => d.remove(), 900);
}

// Player battle sprite. Every frame is shown at its exact file size (no scaling).
// fx,fy = the frame's feet point (lowest opaque row of the art, x = mean of the bottom rows), tracked per frame.
// Each frame's feet point is placed at COMBAT_PLAYER_FOOT relative to the anchor.
// That offset is the idle frame's feet point, so the idle pose stays where it was.
const COMBAT_PLAYER_FOOT = { x: 23.5, y: -1 };
const COMBAT_PLAYER_SCALE = 0.5; // the battle hero is drawn at half the frame size
// The pose frames come from js/hero-body.js (combatPose)
// The critical frame to show: a set may have several (picked at random when the attack starts)
function combatCriFrame(attack) {
    const cri = combatPose().CRI;
    if (!Array.isArray(cri)) return cri;
    return cri[attack.criIdx || 0];
}
const COMBAT_PLAYER_ATTACK_MS = 300; // how long the attack pose is shown
const COMBAT_PLAYER_CRIT_MS = 520;   // a critical attack holds its own pose longer
const COMBAT_PLAYER_LUNGE_PX = 40;   // attack lunges forward this far and back
let combatPlayerAttack = { at: 0, crit: false };
// The hero falls over at the end of a battle (the sprite tips, darkens and fades)
const PLAYER_FALL_MS = 1100;
function playPlayerFallAnim() {
    const el = document.getElementById('combat-player-sprite');
    if (!el) return;
    el.classList.remove('player-fall');
    void el.offsetWidth; // restart the fall
    el.classList.add('player-fall');
}
function playPlayerAttackAnim(isCrit) {
    const cri = combatPose().CRI;
    const criCount = Array.isArray(cri) ? cri.length : 1;
    combatPlayerAttack = { at: Date.now(), crit: !!isCrit, criIdx: Math.floor(Math.random() * criCount) };
    const el = document.getElementById('combat-player-sprite');
    if (!el) return;
    el.dataset.lungeAt = String(combatPlayerAttack.at);
    applyPlayerFrame(el, combatPlayerAttack.crit ? combatCriFrame(combatPlayerAttack) : combatPose().ATTACK);
    playPlayerLunge(el, COMBAT_PLAYER_LUNGE_PX);
}
// Player reactions: 'block' when hit, 'dodge' when an attack is evaded. Each shows one frame for a short time (exact file size).
// Place a battle frame so its feet point sits on the player's feet (exact size)
function applyPlayerFrame(img, f, dy = 0) {
    if (!f) return; // still loading
    img.src = f.src;
    const S = COMBAT_PLAYER_SCALE;
    img.style.left = (combatPlayerAnchor.x + COMBAT_PLAYER_FOOT.x - (f.fx !== undefined ? f.fx : f.w / 2) * S) + 'px';
    img.style.top = (combatPlayerAnchor.y + COMBAT_PLAYER_FOOT.y - (f.fy !== undefined ? f.fy : f.h) * S + dy * S) + 'px';
    img.style.width = f.w * S + 'px';
    img.style.height = f.h * S + 'px';
}

// Equipped pet: the pet's idle art stands beside the player's feet, 10px to the left of the player's feet, on the same ground line.
// Each pet name has its art. Only the Support Slime Pet has art so far (the slime's idle frame).
const PET_SPRITES = { 'Support Slime Pet': { src: 'assets/combat/slime/slimebase_q85.webp', w: 87, h: 73, fx: 43.5, fy: 73 } };
const COMBAT_PET_GAP_X = 120;
// Page pets (town and character pages) stand the same way beside the hero's feet
const PAGE_PET_IDS = { 'town-hero': 'town-pet' }; // main page only; the character page shows no pet
// Gap from the hero's feet to the pet's feet on each page
const PAGE_PET_GAP_X = { 'town-hero': 100 };
function petSpriteOf() {
    const pet = player && player.equipped && player.equipped.pet;
    return pet ? (PET_SPRITES[pet.name] || null) : null;
}
function placePetImg(el, spec, feetX, feetY) {
    if (el.getAttribute('src') !== spec.src) el.src = spec.src;
    el.style.display = '';
    el.style.width = spec.w + 'px';
    el.style.height = spec.h + 'px';
    el.style.left = (feetX - spec.fx) + 'px';
    el.style.top = (feetY - spec.fy) + 'px';
}
function syncPetSprite() {
    const spec = petSpriteOf();
    const el = document.getElementById('combat-pet-sprite');
    if (el) {
        if (!spec) el.style.display = 'none';
        else placePetImg(el, spec, combatPlayerAnchor.x + COMBAT_PLAYER_FOOT.x - COMBAT_PET_GAP_X, combatPlayerAnchor.y + COMBAT_PLAYER_FOOT.y);
    }
    syncPagePetSprites(spec);
}
function syncPagePetSprites(spec) {
    const f = combatPose().IDLE;
    Object.keys(PAGE_PET_IDS).forEach(heroId => {
        const pet = document.getElementById(PAGE_PET_IDS[heroId]);
        const hero = document.getElementById(heroId);
        if (!pet) return;
        if (!spec || !hero || hero.style.left === '') { pet.style.display = 'none'; return; }
        // The hero's feet are where its frame's feet point sits on the page
        const feetX = parseFloat(hero.style.left) + f.fx;
        const feetY = parseFloat(hero.style.top) + f.fy;
        placePetImg(pet, spec, feetX - PAGE_PET_GAP_X[heroId], feetY);
    });
}
setInterval(syncPetSprite, 100);
// Monster attack: the card's sprite shows the attack pose and lunges forward at once (same moment as the player's lunge)
function monsterCardImg(m) {
    const idx = monstersList.indexOf(m);
    return idx < 0 ? null : document.querySelector(`#monsters-lineup-container > div:nth-child(${idx + 1}) img`);
}
function lungeEl(el, dx, startedAgoMs) {
    if (!el || !el.animate) return;
    const a = el.animate([
        { transform: 'translateX(0px)' },
        { transform: `translateX(${dx}px)`, offset: 0.5 },
        { transform: 'translateX(0px)' }
    ], { duration: 200, easing: 'ease-in-out' });
    if (startedAgoMs) a.currentTime = startedAgoMs; // a redraw in the middle of the lunge resumes it
}
function startMonsterAttack(m, delayMs = 0) {
    if (delayMs > 0) {
        const requestedAt = Date.now();
        // a hit after the request cancels this pending attack
        setTimeout(() => { if (m.hp > 0 && !(m._hitAt > requestedAt)) startMonsterAttack(m, 0); }, delayMs);
        return;
    }
    m._attackAt = Date.now();
    m._animAt = m._attackAt;
    // (the damaged pose is not cleared here: the newer of hurt/attack wins in the frame loop)
    const el = monsterCardImg(m);
    if (!el) return;
    el.dataset.attackAt = String(m._attackAt);
    el.dataset.lungeAt = String(m._attackAt);
    setMonsterFrame(el, monsterAttackFrame(m));
    lungeEl(el, COMBAT_MONSTER_LUNGE_PX, 0);
}
// Short lunge of the player sprite (dx px out and back, 0.2s)
function playPlayerLunge(el, dx) {
    if (!el || !el.animate) return;
    el.animate([
        { transform: 'translateX(0px)' },
        { transform: `translateX(${dx}px)`, offset: 0.5 },
        { transform: 'translateX(0px)' }
    ], { duration: 200, easing: 'ease-in-out' });
    lungeHat(el, dx);
}
// The hat and the ground shadow move with the body during a lunge (the hat keeps its tilt)
function lungeHat(el, dx) {
    const shadow = document.getElementById('combat-player-shadow');
    if (shadow && shadow.animate) {
        shadow.animate([
            { transform: 'translateX(0px)' },
            { transform: `translateX(${dx}px)`, offset: 0.5 },
            { transform: 'translateX(0px)' }
        ], { duration: 200, easing: 'ease-in-out' });
    }
}
// Place a reaction frame on the player's feet point
function applyPlayerReactFrame(img, f) {
    applyPlayerFrame(img, f);
}
const COMBAT_PLAYER_REACT_MS = 600;
let combatPlayerReact = { at: 0, kind: null };
function playPlayerReactAnim(kind) {
    combatPlayerReact = { at: Date.now(), kind };
    // Show the reaction frame right away (no waiting for the next sprite tick)
    const el = document.getElementById('combat-player-sprite');
    if (el && combatPose().REACT[kind]) applyPlayerReactFrame(el, combatPose().REACT[kind]);
}
// Monster colour by element (CSS filter on the shared slime sprite only). Bosses, mini-bosses and monsters with their own art keep their look.
function monsterTintClass(m) {
    if (m.isMiniBoss) return 'tint-gold'; // mini bosses turn gold (CSS filter)
    if (m.isBoss) return '';
    if (monsterSpriteOf(m)) return ''; // monsters with their own art keep their colours; only the slime art is tinted
    return ({ fire: 'tint-fire', water: 'tint-water', wind: 'tint-wind' })[m.element] || '';
}
// Dodge lunge: the sprite moves 40px back and returns in 0.2s. Web Animations API, so every dodge plays.
function playPlayerDodgeLunge() {
    const el = document.getElementById('combat-player-sprite');
    if (!el || !el.animate) return;
    el.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-40px)', offset: 0.5 },
        { transform: 'translateX(0px)' }
    ], { duration: 200, easing: 'ease-in-out' });
    lungeHat(el, -40);
}
// Game pages: no text highlighting by drag and no right-click menu (typing fields keep both)
document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest || !e.target.closest('input, textarea, [contenteditable]')) e.preventDefault();
});
// Red flash on the player's battle sprite when it takes damage
function flashPlayerHurt() {
    const el = document.getElementById('combat-player-sprite');
    if (!el) return;
    el.classList.remove('player-hurt');
    void el.offsetWidth; // restart the animation
    el.classList.add('player-hurt');
}
// Player and monster positions for the current earth layout (default: the original layout)
let combatShadowLift = 0; // px the player shadow is raised on fire, wind and ice bases
let combatPlayerAnchor = { x: 515.5, y: 871, left: 464, top: 657 }; // x/y = feet centre, left/top = idle sprite
let combatEarthMonsterPos = null; // per-position [left, top] for the current layout, or null for the default
// Default lineup position for each of the 6 slots (same as the CSS nth-child rules)
const LINEUP_DEFAULT_POS = [[914, 784], [1065, 784], [1218, 769], [1358, 721], [1507, 671], [1658, 659]];
setInterval(() => {
    const now = Date.now();
    document.querySelectorAll('img.idle-anim').forEach(img => {
        if (img.id === 'combat-player-sprite') {
            const ae = now - combatPlayerAttack.at;
            if (combatPlayerAttack.at && ae >= 0 && ae < (combatPlayerAttack.crit ? COMBAT_PLAYER_CRIT_MS : COMBAT_PLAYER_ATTACK_MS)) {
                // Attack: the attack pose plays and the sprite lunges forward once per attack
                if (img.dataset.lungeAt !== String(combatPlayerAttack.at)) {
                    img.dataset.lungeAt = String(combatPlayerAttack.at);
                    playPlayerLunge(img, COMBAT_PLAYER_LUNGE_PX);
                }
                applyPlayerFrame(img, combatPlayerAttack.crit ? combatCriFrame(combatPlayerAttack) : combatPose().ATTACK);
                return;
            }
            const re = now - combatPlayerReact.at;
            if (combatPlayerReact.kind && re >= 0 && re < COMBAT_PLAYER_REACT_MS) {
                applyPlayerReactFrame(img, combatPose().REACT[combatPlayerReact.kind]);
                return;
            }
            if (img.style.animation) img.style.animation = ''; // back from the death fall
            applyPlayerFrame(img, combatPose().IDLE);
            return;
        }
        const deathAt = Number(img.dataset.deathAt) || 0;
        if (deathAt) {
            const e = now - deathAt;
            const total = Number(img.dataset.deathTotal) || COMBAT_DEATH_TOTAL_MS;
            const ms = Number(img.dataset.deathMs) || COMBAT_DEATH_FRAME_MS;
            const dead = img.dataset.deathFrames ? img.dataset.deathFrames.split(',') : COMBAT_SLIME_DEATH_FRAMES;
            const hurtMs = Number(img.dataset.deathHurtMs) || 0; // boss: damaged pose first
            if (e >= total) {
                if (img.parentElement) img.parentElement.style.display = 'none';
                return;
            }
            if (e < hurtMs) {
                const hurt = img.dataset.hurtFrames ? img.dataset.hurtFrames.split(',') : [];
                if (hurt.length) setMonsterFrame(img, hurt[Math.min(hurt.length - 1, Math.floor(e / hurtMs * hurt.length))]);
                img.style.filter = e < COMBAT_HIT_FLASH_MS ? COMBAT_HIT_FLASH_FILTER : '';
                return;
            }
            img.style.filter = e < COMBAT_HIT_FLASH_MS ? COMBAT_HIT_FLASH_FILTER : ''; // the killing hit flashes red too
            if (img.dataset.slowDeath === '1') {
                // Boss death in slow motion: the death frames step slowly while the body fades out
                const p = Math.min(1, (e - hurtMs) / Math.max(1, total - hurtMs));
                img.style.opacity = String(1 - 0.75 * p * p);
            }
            setMonsterFrame(img, dead[Math.min(dead.length - 1, Math.floor((e - hurtMs) / ms))]);
            return;
        }
        // Hurt and attack: whichever started later plays and overrides the other (idle is the fallback)
        const hitAt = Number(img.dataset.hitAt) || 0;
        const elapsed = now - hitAt;
        const hurt = img.dataset.hurtFrames ? img.dataset.hurtFrames.split(',') : [];
        const hurtLen = Math.max(1, hurt.length) * COMBAT_DAMAGE_FRAME_MS;
        const hurtOn = hitAt && elapsed >= 0 && elapsed < hurtLen;
        const atkAt = Number(img.dataset.attackAt) || 0;
        const ae = now - atkAt;
        const attackOn = atkAt && ae >= 0 && ae < COMBAT_MONSTER_ATTACK_MS;
        const redFlashOn = hitAt && elapsed >= 0 && elapsed < COMBAT_HIT_FLASH_MS; // same red flash as the player's sprite
        if (attackOn) {
            // Attack pose has priority and plays to the end; the red flash still shows on a hit
            img.style.filter = redFlashOn ? COMBAT_HIT_FLASH_FILTER : '';
            setMonsterFrame(img, img.dataset.attackFrame || COMBAT_SLIME_ATTACK_FRAME);
            return;
        }
        if (hurtOn) {
            if (hurt.length) setMonsterFrame(img, hurt[Math.min(hurt.length - 1, Math.floor(elapsed / COMBAT_DAMAGE_FRAME_MS))]);
            img.style.filter = redFlashOn ? COMBAT_HIT_FLASH_FILTER : '';
            return;
        }
        if (img.style.filter) img.style.filter = '';
        if (img.dataset.stunned === '1') return; // stunned: idle animation stops on its current frame
        const frames = img.dataset.frames.split(',');
        setMonsterFrame(img, frames[Math.floor(now / 500) % frames.length]); // idle: one frame every 500ms
    });
    // Stun effect: centred on the top edge of the monster's sprite, shaking side to side
    document.querySelectorAll('img.stun-fx').forEach(fx => {
        const body = fx.parentElement && fx.parentElement.querySelector('img.idle-anim');
        if (!body) return;
        const fw = fx.offsetWidth || 102, fh = fx.offsetHeight || 78;
        const shake = Math.round(Math.sin(now / 50) * 4);
        fx.style.left = (body.offsetLeft + body.offsetWidth / 2 - fw / 2 + shake) + 'px';
        fx.style.top = (body.offsetTop - fh / 2) + 'px';
    });
    // Player stun effect: the same picture on the top edge of the player's sprite while stunned
    const pfx = document.getElementById('combat-player-stun-fx');
    const psp = document.getElementById('combat-player-sprite');
    if (pfx && psp) {
        const stunned = Date.now() < playerStunUntil;
        pfx.style.display = stunned ? '' : 'none';
        if (stunned) {
            const fw = 102, fh = 78;
            const sl = parseFloat(psp.style.left) || 0, st = parseFloat(psp.style.top) || 0, sw = parseFloat(psp.style.width) || 95;
            const shake = Math.round(Math.sin(now / 50) * 4);
            const hx = heroBodyHeadX('base'); // the head's centre in the frame, scaled to the battle size
            const headX = hx === null ? sw / 2 : hx * COMBAT_PLAYER_SCALE;
            pfx.style.left = (sl + headX - fw / 2 + shake) + 'px';
            pfx.style.top = (st - fh / 2) + 'px';
        }
    }
}, 60);

// Combat page copy of the main page character info: mirror its values (IDs end in -c)
function syncCombatInfo() {
    ['header-player-name', 'header-base-lv', 'header-job-lv', 'top-base-exp-text', 'top-job-exp-text', 'town-gold', 'town-diamonds'].forEach(id => {
        const src = document.getElementById(id), dst = document.getElementById(id + '-c');
        if (src && dst) dst.innerText = src.innerText;
    });
    ['top-base-exp-bar', 'top-job-exp-bar'].forEach(id => {
        const src = document.getElementById(id), dst = document.getElementById(id + '-c');
        if (src && dst) dst.style.width = src.style.width;
    });
    const vip = document.getElementById('header-vip-badge'), vipC = document.getElementById('header-vip-badge-c');
    if (vip && vipC) { vipC.innerText = vip.innerText; vipC.className = vip.className; }
    const av = document.getElementById('header-avatar-container'), avC = document.getElementById('combat-avatar-c');
    if (av && avC) avC.innerHTML = av.innerHTML;
}

function updateAvatarDisplay() {
    let container = document.getElementById('header-avatar-container');
    // The new-avatar alert stays until the player first clicks the avatar (remembered in the save)
    const avatarAlert = document.getElementById('avatar-alert');
    if (avatarAlert) avatarAlert.style.display = player.avatarClicked ? 'none' : 'block'; // inline, so it does not depend on the stylesheet
    if (!container) return;
    container.innerHTML = avatarMarkup(player.avatar, 'w-full h-full object-cover');
}

// Player stat avatar: click to choose a monster avatar (the first click also dismisses the new-avatar alert)
function openAvatarPicker() {
    if (!player.avatarClicked) {
        player.avatarClicked = true;
        saveGame();
        updateAvatarDisplay();
    }
    const options = AVATARS.map(av => {
        // Locked avatars are grey; their requirement shows only when clicked
        if (!isAvatarUnlocked(av)) return `
        <button onclick="showAvatarLockInfo('${av}', this)" class="h-64 w-64 rounded-xl border border-slate-700 bg-slate-900 cursor-pointer overflow-hidden">
            <div class="w-full h-full grayscale opacity-40">${avatarMarkup(av, 'w-full h-full object-cover')}</div>
        </button>`;
        return `
        <button onclick="pickPlayerAvatar('${av}')" class="h-64 w-64 rounded-xl border border-slate-700 bg-slate-900 hover:border-amber-400 cursor-pointer overflow-hidden">
            ${avatarMarkup(av, 'w-full h-full object-cover')}
        </button>`;
    }).join('');
    showModal("Choose Avatar", "", closeCornerHTML() + `<div id="avatar-picker-host" class="relative"><div class="grid grid-cols-2 gap-3 justify-items-center max-h-[70vh] overflow-y-auto p-1">${options}</div></div>`);
    // The picker needs room for two 256px columns
    const box = document.querySelector('#game-modal > div');
    if (box) box.style.maxWidth = '760px';
}
// Locked avatar: a panel slides out on the right of the tile. Clicking outside slides it back.
function showAvatarLockInfo(av, tileEl) {
    closeAvatarLockInfo();
    const host = document.getElementById('avatar-picker-host');
    if (!host || !tileEl) return;
    const panel = document.createElement('div');
    panel.id = 'avatar-lock-panel';
    panel.innerHTML = `<div class="font-bold text-amber-300">Locked</div><div class="mt-1">${avatarLockTitle(av) || 'This avatar is locked.'}</div>`;
    const hostRect = host.getBoundingClientRect();
    const tileRect = tileEl.getBoundingClientRect();
    panel.style.left = (tileRect.right - hostRect.left + 12) + 'px';
    panel.style.top = (tileRect.top - hostRect.top) + 'px';
    host.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('open'));
    // Listen after this click finishes, so the opening click does not close it
    setTimeout(() => document.addEventListener('pointerdown', avatarLockOutsideClick, true), 0);
}
function avatarLockOutsideClick(e) {
    if (e.target.closest && e.target.closest('#avatar-lock-panel')) return;
    closeAvatarLockInfo();
}
function closeAvatarLockInfo() {
    document.removeEventListener('pointerdown', avatarLockOutsideClick, true);
    const panel = document.getElementById('avatar-lock-panel');
    if (!panel) return;
    panel.classList.remove('open'); // slide back
    setTimeout(() => panel.remove(), 250);
}

function pickPlayerAvatar(av) {
    player.avatar = av;
    selectedAvatarChoice = av;
    updateUI();
    saveGame();
    closeModal();
}

// Click a rune window in combat to see the rune's full detail
// Click a rune in the combat rune row: show it as a big rune card with its full detail
function showRuneDetail(index) {
    const r = (player.currentRunRunes || [])[index];
    if (!r) return;
    const def = RUNE_DEFS[r.id];
    const rarity = def ? def.rarity : 1;
    const detail = def ? def.text(runeN(r.id)) : r.desc;
    const html = `<div id="rune-card-view" class="flex flex-col items-center gap-4">
            <div class="rune-pick-card rune-acq-card">
                <img class="rune-pick-art" src="assets/combat/runes/bigr${rarity}_q85.webp" alt="">
                <span class="rune-pick-text">
                    <span class="rune-pick-name">${escapeHtml(r.name)}</span>
                    <span class="rune-pick-desc">${runeHighlightHtml(detail)}</span>
                </span>
            </div>
            <button onclick="closeModal()" class="mx-auto w-40 py-2 border border-slate-700 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition">Close</button>
        </div>`;
    showModal(r.name, '', html);
}

function showModal(title, message, customHTML = '', onCloseCallback = null) {
    let titleEl = document.getElementById('modal-title');
    let msgEl = document.getElementById('modal-message');
    let area = document.getElementById('modal-content-area');
    let btn = document.getElementById('modal-close-btn');
    let modalEl = document.getElementById('game-modal');

    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = message;
    if (area) area.innerHTML = customHTML;
    if (modalEl && modalEl.firstElementChild) { modalEl.firstElementChild.classList.add('relative'); modalEl.firstElementChild.style.maxWidth = ''; }
    if (btn) {
        if (customHTML) btn.classList.add('hidden');
        else btn.classList.remove('hidden');
    }
    window.modalCallback = onCloseCallback;
    if (modalEl) modalEl.classList.remove('hidden');
    // Rune pick: no background blur, no title text
    const isRune = !!document.getElementById('rune-pick-root') || !!document.getElementById('rune-card-view');
    if (titleEl) titleEl.style.display = isRune ? 'none' : '';
    if (modalEl) modalEl.style.backdropFilter = isRune ? 'none' : '';
    fitModalPanel(!!customHTML);
}
// The summary panel is laid out at a fixed design width and scaled to fill the window.
// Plain notifications keep their normal size.
const SUMMARY_PANEL_W = 1000;
function fitModalPanel(isSummary) {
    const panel = document.querySelector('#game-modal > div');
    if (!panel) return;
    if (!isSummary) { panel.style.width = ''; panel.style.maxWidth = ''; panel.style.transform = ''; panel.style.maxHeight = ''; panel.style.overflowY = ''; panel.style.background = ''; return; }
    // Rune pick: a wide panel at true size (three cards side by side), no scaling, half-transparent window
    // Rune card view: a narrow panel around one big rune card
    if (document.getElementById('rune-card-view')) {
        panel.style.width = '380px';
        panel.style.maxWidth = '94vw';
        panel.style.transform = '';
        panel.style.maxHeight = '92vh';
        panel.style.overflowY = 'auto';
        panel.style.background = 'rgba(15, 23, 42, 0.5)';
        return;
    }
    if (document.getElementById('rune-pick-root')) {
        panel.style.width = '1000px';
        panel.style.maxWidth = '94vw';
        panel.style.transform = '';
        panel.style.maxHeight = '92vh';
        panel.style.overflowY = 'auto';
        panel.style.background = 'rgba(15, 23, 42, 0.5)';
        return;
    }
    panel.style.background = '';
    // Scale by width (about 90% of the window), then cap the height and scroll inside the panel if the log is long
    panel.style.width = SUMMARY_PANEL_W + 'px';
    panel.style.maxWidth = 'none';
    const s = Math.min(2.5, (window.innerWidth * 0.9) / SUMMARY_PANEL_W);
    panel.style.transform = `scale(${s})`;
    panel.style.maxHeight = ((window.innerHeight * 0.9) / s) + 'px'; // design px: 90% of the window height when scaled
    panel.style.overflowY = 'auto';
}
window.addEventListener('resize', () => {
    const modalEl = document.getElementById('game-modal');
    if (modalEl && !modalEl.classList.contains('hidden') && document.getElementById('modal-content-area')?.innerHTML) fitModalPanel(true);
});

function closeModal() {
    let modalEl = document.getElementById('game-modal');
    if (modalEl) modalEl.classList.add('hidden');
    if (window.modalCallback) {
        let cb = window.modalCallback;
        window.modalCallback = null;
        cb();
    }
}

// Earth map: each combat picks 1 background, 1 base layer and the foreground
// Battle art per path: each stage picks one background and one base layer; the foreground is fixed
// Flat stage art: one full-stage image per path (no background or foreground layers).
// feet = the player's feet point; monsters = each slot's feet point (sprite bottom on the flat ground). Positions are first-pass placements.
const COMBAT_TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
function flatLayout(feet, monsterFeet) {
    const idle = combatPose().IDLE || { fx: 0, fy: 0 }; // frame still composing
    return {
        player: { x: feet[0], y: feet[1], left: feet[0] - idle.fx, top: feet[1] - idle.fy },
        hud: { left: feet[0] - 102, top: feet[1] + 20 }, // HP and armor below the character
        monsters: monsterFeet.map(([x, y]) => [x - 100, y - 100]) // card: 200px wide, sprite bottom at the card's 100px sprite box
    };
}
function flatArt(name, feet, monsterFeet) {
    return {
        bg: [`assets/combat/flat/${name}_flat_q85.webp`],
        base: [COMBAT_TRANSPARENT],
        fg: null,
        layouts: { [`${name}_flat`]: flatLayout(feet, monsterFeet) }
    };
}
// Earth combat art:
//   '3d'   = Blender 2.5D layers (sky, forest, tilted ground), with depth blur, a slow parallax sway,
//            a pan at stage start and a small zoom on crits
//   'e1'   = hand-painted layers (far mountains, front trees, ground on top) with a blur and light glow
//   'flat' = the old flat Earth image
const EARTH_ART_MODE = '3d';
function earth3dArt() {
    // Feet stand on the tilted walkable surface (it runs from about y 690 at the back to 860 at the front edge)
    const feet = [500, 790], monsterFeet = [[820, 790], [960, 780], [1150, 775], [1350, 775], [1550, 780], [1740, 785]];
    return {
        bg: ['assets/combat/earth3d/sky.webp'],
        base: ['assets/combat/earth3d/base.webp'],
        fg: ['assets/combat/earth3d/forest.webp'],
        layouts: { 'earth3d': flatLayout(feet, monsterFeet) }
    };
}
function earthNewArt() {
    // Player stands 100px lower than on the flat Earth art
    const feet = [500, 750], monsterFeet = [[800, 680], [950, 680], [1150, 670], [1350, 670], [1550, 670], [1750, 650]];
    return {
        bg: ['assets/combat/earth1/e1bg.webp'],
        base: ['assets/combat/earth1/e1base.webp'],
        fg: ['assets/combat/earth1/e1mg.webp'],
        layouts: { 'e1base': flatLayout(feet, monsterFeet) }
    };
}
const COMBAT_ART = {
    earth: EARTH_ART_MODE === '3d' ? earth3dArt() : EARTH_ART_MODE === 'e1' ? earthNewArt() : flatArt('earth', [500, 650], [[800, 680], [950, 680], [1150, 670], [1350, 670], [1550, 670], [1750, 650]]),
    fire: flatArt('fire', [500, 650], [[800, 650], [950, 650], [1150, 670], [1350, 670], [1550, 620], [1700, 620]]),
    wind: flatArt('wind', [500, 625], [[800, 620], [950, 630], [1150, 620], [1350, 630], [1550, 620], [1700, 615]]),
    water: flatArt('ice', [480, 670], [[800, 660], [950, 650], [1150, 660], [1350, 620], [1550, 630], [1700, 650]]),
    final: flatArt('yggdrasil', [460, 600], [[800, 598], [950, 598], [1150, 592], [1350, 580], [1550, 580], [1700, 570]])
};
// Each stage picks a new background, base layer and foreground.
// New images are loaded and decoded first, then all of them swap in the same step (no fade).
let earthLayerToken = 0;
function preloadCombatImage(src) {
    const img = new Image();
    img.src = src;
    return img.decode ? img.decode().catch(() => {}) : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
}
// Move the monster cards already on screen to the current layout (no waiting for the next redraw)
function applyCombatEarthPositions() {
    // Shadow: the character's right foot (71.5,188 in the 95x193 art) sits on the shadow's dark spot (78,29 in the 102x41 shadow).
    const shadow = document.getElementById('combat-player-shadow');
    if (shadow) {
        shadow.style.left = (combatPlayerAnchor.x - 54.5) + 'px';
        shadow.style.top = (combatPlayerAnchor.y - 34 - combatShadowLift) + 'px';
    }
    document.querySelectorAll('#monsters-lineup-container > div').forEach(card => {
        const pos = Number(card.dataset.pos);
        const p = (combatEarthMonsterPos && combatEarthMonsterPos[pos]) || (card.dataset.slot === '' ? null : LINEUP_DEFAULT_POS[pos]);
        card.style.left = p ? p[0] + 'px' : '';
        card.style.top = p ? p[1] + 'px' : '';
    });
}
async function changeEarthLayers() {
    const bg = document.getElementById('earth-bg'), base = document.getElementById('earth-base'), fg = document.getElementById('earth-fg');
    if (!bg || !base || !fg) { document.getElementById('view-combat')?.classList.remove('art-loading'); return; }
    const token = ++earthLayerToken;
    const hud = document.getElementById('combat-hp-under');
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const artKey = (typeof currentPath !== 'undefined' && COMBAT_ART[currentPath]) ? currentPath : 'earth';
    const art = COMBAT_ART[artKey];
    const fgList = Array.isArray(art.fg) ? art.fg : [art.fg]; // a null entry means no foreground
    const nextBg = pick(art.bg), nextBase = pick(art.base), nextFg = pick(fgList) || null;
    await Promise.all([nextBg, nextBase, nextFg].filter(Boolean).map(preloadCombatImage));
    if (token !== earthLayerToken) return; // a newer stage has started
    bg.src = nextBg;
    base.src = nextBase;
    // No foreground: keep a valid 1x1 transparent image (an empty src fires an error) and hide it
    fg.src = nextFg || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    fg.style.display = nextFg ? '' : 'none';
    // New Earth art: the front trees sit between the far mountains and the ground, and the far mountains get a live blur
    const is3d = nextBase.includes('/earth3d/');
    const isNewEarth = is3d || nextBase.includes('/earth1/');
    base.style.zIndex = isNewEarth ? '2' : '';
    fg.style.zIndex = isNewEarth ? '1' : '';
    bg.style.filter = is3d ? 'blur(2.5px)' : isNewEarth ? 'blur(3px)' : '';
    fg.style.filter = is3d ? 'blur(1px)' : '';
    const light = document.getElementById('earth-light');
    if (light) light.style.display = isNewEarth ? '' : 'none';
    // 3D art is rendered 128x72px larger than the screen, so the far layers have room to drift
    [bg, base, fg].forEach(el => {
        el.style.left = is3d ? '-64px' : '0px';
        el.style.top = is3d ? '-36px' : '0px';
        el.style.width = is3d ? (earthStageInnerWidth() + 128) + 'px' : '1920px';
        el.style.height = is3d ? '1152px' : '1080px';
    });
    // Parallax: the ground (with the fighters on it) stays still; the forest and sky drift against it, the sky more
    bg.classList.toggle('earth3d-far', is3d);
    fg.classList.toggle('earth3d-mid', is3d);
    if (is3d) [bg, fg].forEach(el => { el.classList.remove('earth3d-pan'); void el.offsetWidth; el.classList.add('earth3d-pan'); });
    else [bg, fg].forEach(el => el.classList.remove('earth3d-pan'));
    const layoutKey = Object.keys(art.layouts).find(k => nextBase.includes(k) || nextBg.includes(k));
    const layout = layoutKey ? art.layouts[layoutKey] : null;
    combatPlayerAnchor = layout ? layout.player : { x: 515.5, y: 871, left: 464, top: 657 };
    combatShadowLift = /(windbase|icebase|firebase)/.test(nextBase) ? 50 : 0;
    combatEarthMonsterPos = layout ? layout.monsters : null;
    if (hud) {
        const h = layout && layout.hud ? layout.hud : { left: 413, top: 896 };
        hud.style.left = h.left + 'px';
        hud.style.top = h.top + 'px';
    }
    applyCombatEarthPositions();
    document.getElementById('view-combat')?.classList.remove('art-loading'); // first layers are in place
}

// Town and character page heroes: the base frame, with its feet where the base body's feet were before
const HERO_PAGE_ORIGIN = { 'town-hero': { left: 0, top: 0 }, 'char-hero': { left: 350, top: 527 } };
const HERO_PAGE_FEET = { x: 71.5, y: 189 };
const HERO_PAGE_SCALE = 0.5; // main and character page heroes are half the battle size
const SHADOW_BASE = { 'town-shadow': { left: 906, top: 716 }, 'char-shadow': { left: 339, top: 684 } };
function switchView(viewName) {
    if (viewName !== 'combat') restoreAfterCombat();
    syncHeroSprites(); // town and character hero art follow the current gear on every page change
    // The Diamond Cash Shop is a tab on the Shop page now
    if (viewName === 'diamond') {
        currentShopTab = 'diamond';
        viewName = 'shop';
    }
    let views = ['view-town', 'view-expeditions', 'view-events', 'view-skills', 'view-library', 'view-setting', 'view-character', 'view-shop', 'view-blacksmith', 'view-diamond', 'view-quests', 'view-combat', 'view-friend'];
    views.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    // Music: town theme everywhere except combat (combat sets its own track when a stage starts)
    if (viewName !== 'combat') setMusicTrack('town');
    // Refresh badges on every screen change, so the character page shows current point alerts
    if (typeof updateTownAlerts === 'function') updateTownAlerts();
    // Header (gold/diamond) only on non-town screens; town shows the full info panel.
    document.getElementById('app-header')?.classList.toggle('hidden', ['town', 'expeditions', 'events', 'diamond', 'quests', 'setting', 'shop', 'blacksmith', 'character', 'skills', 'combat', 'friend'].includes(viewName));
    if (viewName === 'expeditions' && window.closeCampaignPanel) window.closeCampaignPanel();
    // Transparent html/body background on art screens (see .art-mode in index.html)
    const artViews = ['expeditions', 'events', 'diamond', 'quests', 'setting', 'shop', 'blacksmith', 'character', 'skills', 'combat', 'friend'];
    document.documentElement.classList.toggle('art-mode', artViews.includes(viewName));
    document.body.classList.toggle('art-mode', artViews.includes(viewName));

    if (viewName === 'town') document.getElementById('view-town')?.classList.remove('hidden');
    if (viewName === 'expeditions') {
        document.getElementById('view-expeditions')?.classList.remove('hidden');
        renderMapGateUI();
    }
    if (viewName === 'character') document.getElementById('view-character')?.classList.remove('hidden');
    if (viewName === 'friend') {
        document.getElementById('view-friend')?.classList.remove('hidden');
        openFriendPage();
    }
    if (viewName === 'skills') {
        document.getElementById('view-skills')?.classList.remove('hidden');
        renderSkillPage();
        skillFocusHub();
    }
    if (viewName === 'setting') { document.getElementById('view-setting')?.classList.remove('hidden'); refreshAudioUI(); }
    if (viewName === 'library') {
        document.getElementById('view-library')?.classList.remove('hidden');
        renderLibraryView();
    }
    if (viewName === 'events') {
        document.getElementById('view-events')?.classList.remove('hidden');
        renderEventsView();
        switchEventsTab(currentEventsTab);
    }
    if (viewName === 'shop') {
        document.getElementById('view-shop')?.classList.remove('hidden');
        switchShopTab(currentShopTab);
    }
    if (viewName === 'blacksmith') {
        document.getElementById('view-blacksmith')?.classList.remove('hidden');
        renderRefiningUI();
    }
    if (viewName === 'quests') {
        document.getElementById('view-quests')?.classList.remove('hidden');
        renderMailBox();
        syncServerMail(); // friend gifts that arrived while playing
    }
    if (viewName === 'combat') {
        const combatView = document.getElementById('view-combat');
        if (combatView) { combatView.classList.remove('hidden'); combatView.classList.add('art-loading'); }
        changeEarthLayers();
    }

    updateUI();
    saveGame();
}

function getMapPrereqTitle(mapKey) {
    const prereq = getPrereqMapKey(mapKey);
    return prereq ? GAME_DATA.maps[prereq].title : '';
}

let campaignPathChoice = 'fire';

function renderMapGateUI() {
    updateFinalMapButton();
    if (window.updateExpoNodes) window.updateExpoNodes();
    const selectEl = document.getElementById('campaign-map-select');
    const listEl = document.getElementById('campaign-map-list');
    const pathEl = document.getElementById('campaign-path-list');
    if (!selectEl) return;
    if (typeof GAME_DATA === 'undefined' || !GAME_DATA.paths) {
        if (listEl) listEl.innerHTML = '<span class="col-span-2 text-xs text-red-400">Map data not loaded. Check that monsters.js and maps.js are included in index.html.</span>';
        return;
    }

    const prev = selectEl.value || '';
    let [pk, mk] = prev.split(':');
    if (!GAME_DATA.paths[pk]) pk = campaignPathChoice;
    campaignPathChoice = pk;
    const order = getMapOrder();

    if (pathEl) {
        pathEl.innerHTML = Object.keys(GAME_DATA.paths).map(k => {
            const p = GAME_DATA.paths[k];
            const on = k === pk;
            return `<button onclick="selectCampaignPath('${k}')" class="p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${on ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-amber-400'}">${p.icon} ${p.name}</button>`;
        }).join('');
    }

    selectEl.innerHTML = order.map(m => `<option value="${pk}:${m}">${GAME_DATA.paths[pk].maps[m].title}</option>`).join('');
    const unlockedKeys = order.filter(m => isMapUnlocked(`${pk}:${m}`));
    const current = (mk && isMapUnlocked(`${pk}:${mk}`)) ? mk : unlockedKeys[unlockedKeys.length - 1];
    selectEl.value = `${pk}:${current}`;

    if (!listEl) return;
    listEl.innerHTML = order.map(m => {
        const key = `${pk}:${m}`;
        const unlocked = isMapUnlocked(key);
        const cleared = !!(player.clearedMaps && player.clearedMaps[key]);
        const selected = m === current;
        let cls, sub, diamond = false;
        if (!unlocked) {
            cls = 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed';
            sub = `🔒 Clear ${getMapPrereqTitle(m)}`;
            diamond = true;
        } else if (selected) {
            cls = 'bg-amber-500/20 border-amber-400 text-amber-300 cursor-pointer';
            sub = cleared ? '✔ Cleared · Selected' : 'Selected';
        } else {
            cls = 'bg-slate-950 border-slate-700 text-slate-200 hover:border-amber-400 cursor-pointer';
            sub = cleared ? '✔ Cleared' : 'Available';
        }
        const bg = '';
        return `<button ${unlocked ? '' : 'disabled'} onclick="selectCampaignMap('${key}')" class="relative overflow-hidden p-3 rounded-xl border text-left text-xs transition ${cls}">
            ${bg}<span class="relative block font-bold">${GAME_DATA.paths[pk].maps[m].title}</span>
            <span class="relative block text-[10px] mt-0.5">${sub}</span>
        </button>`;
    }).join('');
}

function selectCampaignPath(pathKey) {
    campaignPathChoice = pathKey;
    const selectEl = document.getElementById('campaign-map-select');
    if (selectEl) selectEl.value = `${pathKey}:map1`;
    renderMapGateUI();
}

function selectCampaignMap(key) {
    if (!isMapUnlocked(key)) return;
    const selectEl = document.getElementById('campaign-map-select');
    if (selectEl) selectEl.value = key;
    renderMapGateUI();
}

function selectCampaignMap(key) {
    if (!isMapUnlocked(key)) return;
    const selectEl = document.getElementById('campaign-map-select');
    if (selectEl) selectEl.value = key;
    renderMapGateUI();
}

function slotLabel(slot) {
    const f = INVENTORY_FILTERS.find(x => x.key === slot);
    return f ? f.label : (slot || 'Gear');
}

function updateFinalMapButton() {
    const b = document.getElementById('final-map-btn');
    if (!b) return;
    const ok = isFinalMapUnlocked();
    b.disabled = !ok;
    b.innerText = ok ? 'World-Eater' : '🔒 World-Eater';
    b.className = ok
        ? 'py-3 bg-rose-600 hover:bg-rose-500 text-slate-100 font-bold rounded-xl text-xs transition cursor-pointer shadow'
        : 'py-3 bg-slate-800 text-slate-500 font-bold rounded-xl text-xs border border-slate-700 cursor-not-allowed';
}

// ---- Armory shop filters (gear type, level, sort) ----
let armoryFilter = { slot: 'all', level: 'all', sort: 'level-asc' };
function setArmoryFilter(key, val) {
    armoryFilter[key] = val;
    renderShop();
}
function renderArmoryFilterBar(slots, levels) {
    const bar = document.getElementById('armory-filter-bar');
    if (!bar) return;
    const sel = 'px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400';
    const sorts = [['level-asc', 'Level ↑'], ['level-desc', 'Level ↓'], ['price-asc', 'Price ↑'], ['price-desc', 'Price ↓']];
    bar.innerHTML = `
        <select class="${sel}" onchange="setArmoryFilter('slot', this.value)">
            <option value="all">All gear types</option>
            ${slots.map(s => `<option value="${s}" ${armoryFilter.slot === s ? 'selected' : ''}>${slotLabel(s)}</option>`).join('')}
        </select>
        <select class="${sel}" onchange="setArmoryFilter('level', this.value)">
            <option value="all">All levels</option>
            ${levels.map(l => `<option value="${l}" ${armoryFilter.level === String(l) ? 'selected' : ''}>Lv ${l}</option>`).join('')}
        </select>
        <select class="${sel}" onchange="setArmoryFilter('sort', this.value)">
            ${sorts.map(([v, t]) => `<option value="${v}" ${armoryFilter.sort === v ? 'selected' : ''}>${t}</option>`).join('')}
        </select>`;
}

// ---------- DAILY FREE REWARDS (refresh every day) ----------
const DAILY_FREE_ITEMS = {
    gold: { name: "Free 3000 Gold", desc: "Daily free gift. Refreshes every day.", reward: { gold: 3000 } },
    diamond: { name: "Free 1 Diamond", desc: "Daily free gift. Refreshes every day.", reward: { diamonds: 1 } }
};

function todayKey() {
    return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
}

function isDailyFreeClaimed(key) {
    return !!(player.dailyFree && player.dailyFree[key] === todayKey());
}

function claimDailyFree(key) {
    const item = DAILY_FREE_ITEMS[key];
    if (!item || isDailyFreeClaimed(key)) return;
    if (!player.dailyFree) player.dailyFree = {};
    player.dailyFree[key] = todayKey();
    if (item.reward.gold) player.gold += item.reward.gold;
    if (item.reward.diamonds) player.diamonds += item.reward.diamonds;
    logMessage(`[Free] Received ${item.name}!`, 'levelup');
    showModal("Free Reward", '', rewardPopupHTML('You received:', rewardCellHTML(item), '<div class="text-slate-400 text-xs">Come back tomorrow for another.</div>'));
    updateUI();
    renderShop();
    renderDiamondShop();
    saveGame();
}

function dailyFreeCardHTML(key) {
    const item = DAILY_FREE_ITEMS[key];
    // Unclaimed: red card with a Claim button. Claimed today: grey card, button disabled.
    if (isDailyFreeClaimed(key)) {
        return `
        <div class="free-reward-claimed p-3 rounded border flex justify-between items-center">
            <div>
                <span class="font-bold block text-xs">${item.name}</span>
                <span class="text-[10px]">${item.desc}</span>
            </div>
            <button disabled class="px-3 py-1.5 font-bold rounded-lg text-xs">Claimed today</button>
        </div>
    `;
    }
    return `
        <div class="free-reward-card p-3 rounded border flex justify-between items-center">
            <div>
                <span class="font-bold block text-xs">${item.name}</span>
                <span class="text-[10px]">${item.desc}</span>
            </div>
            <button onclick="claimDailyFree('${key}')" class="px-3 py-1.5 bg-white hover:bg-red-100 text-red-700 font-bold rounded-lg cursor-pointer text-xs transition">Claim</button>
        </div>
    `;
}

// ---------- SHOP PAGE TABS (Diamond default, Shop second) ----------
let currentShopTab = 'diamond';

function isFreeGoldAvailable() { return !isDailyFreeClaimed('gold'); }
function isFreeDiamondAvailable() { return !isDailyFreeClaimed('diamond'); }

// Balance on the shop row: diamonds on the Diamond tab, gold on the Shop tab
function updateShopBalance() {
    const label = document.getElementById('shop-balance-label');
    const value = document.getElementById('shop-balance-value');
    if (!label || !value) return;
    if (currentShopTab === 'diamond') {
        label.innerHTML = `<img src="assets/icons/diamondiconsmall_q85.webp" alt="" style="width:16px;height:16px;display:inline-block;vertical-align:-3px"> Balance:`;
        value.innerText = player.diamonds;
    } else {
        label.innerText = '💰 Cash Balance:';
        value.innerText = player.gold;
    }
}

// Tab buttons: Diamond keeps the diamond item colour, turns red with white text while the free diamond is unclaimed
function updateShopTabButtons() {
    const btnDiamond = document.getElementById('shop-tab-btn-diamond');
    const btnShop = document.getElementById('shop-tab-btn-shop');
    const isDiamond = currentShopTab === 'diamond';
    const RED = 'background-color: #dc2626; color: #ffffff;';
    const diamondBase = 'background-color: rgba(190, 178, 214, .45); color: #2a1a0e;';
    const shopBase = 'background-color: rgba(214, 190, 140, .5); color: #2a1a0e;';
    const active = 'border: 2px solid #c9a227';
    const inactive = 'border: 1px solid #a593c4';
    const inactiveShop = 'border: 1px solid #b8945a';
    if (btnDiamond) {
        const colors = diamondBase; // original background; the alert badge shows the free reward
        btnDiamond.setAttribute('style', `${colors} ${isDiamond ? active : inactive}`);
    }
    if (btnShop) {
        const colors = shopBase; // original background; the alert badge shows the free reward
        btnShop.setAttribute('style', `${colors} ${!isDiamond ? active : inactiveShop}`);
    }
}

function switchShopTab(tabName) {
    if (tabName !== 'diamond' && tabName !== 'shop') tabName = 'diamond';
    currentShopTab = tabName;
    const isDiamond = tabName === 'diamond';
    document.getElementById('shop-diamond-section')?.classList.toggle('hidden', !isDiamond);
    document.getElementById('shop-gold-section')?.classList.toggle('hidden', isDiamond);
    // The gear shop (right window) always shows
    renderShop();
    if (isDiamond) renderDiamondShop();
    updateShopTabButtons();
    updateShopBalance();
}

// Town alerts: quests not complete (Events button); free gold or free diamond unclaimed (Shop button); unclaimed mail (Mail button)
// Floating red text at the click position (used for purchase errors)
function floatNoticeAt(text, ev) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    if (ev && (ev.clientX || ev.clientY)) { x = ev.clientX; y = ev.clientY; }
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:fixed; left:${x}px; top:${y}px; transform:translate(-50%,-50%); color:#f87171; font-weight:bold; font-size:24px; text-shadow:0 2px 4px #000; pointer-events:none; z-index:9999; white-space:nowrap; transition:transform 1s ease-out, opacity 1s ease-out;`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = 'translate(-50%,-150%)'; el.style.opacity = '0'; }));
    setTimeout(() => el.remove(), 1100);
}

// Small green note at the click position that fades out by itself (used for successful purchases)
function floatSuccessAt(text, ev) {
    ev = ev || window.event;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    if (ev && (ev.clientX || ev.clientY)) { x = ev.clientX; y = ev.clientY; }
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:fixed; left:${x}px; top:${y}px; transform:translate(-50%,-50%); color:#86efac; font-weight:800; font-size:22px; text-shadow:0 2px 4px #000; pointer-events:none; z-index:9999; white-space:nowrap; transition:transform 1.8s ease-out 0.4s, opacity 0.6s ease-in 1.4s;`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = 'translate(-50%,-220%)'; el.style.opacity = '0'; }));
    setTimeout(() => el.remove(), 2200);
}

function updateTownAlerts() {
    const questOpen = (player.dailyQuests || []).some(q => !q.completed);
    const shopFree = isFreeGoldAvailable() || isFreeDiamondAvailable();
    const ev = document.getElementById('alert-events');
    const sh = document.getElementById('alert-shop');
    const ml = document.getElementById('alert-mail');
    const mailOpen = (player.mailBox || []).some(m => !m.claimed);
    if (ev) ev.style.display = questOpen ? 'block' : 'none';
    if (sh) sh.style.display = shopFree ? 'block' : 'none';
    if (ml) ml.style.display = mailOpen ? 'block' : 'none';
    // Friend button: an unclaimed friend gift in the mailbox (claiming it clears the alert)
    const fa = document.getElementById('alert-friend');
    const friendGiftOpen = (player.mailBox || []).some(m => !m.claimed && m.title === 'Friend Gift');
    if (fa) fa.style.display = friendGiftOpen ? 'block' : 'none';
    // Tab badges: Diamond tab (free diamond unclaimed), Shop tab (free gold unclaimed), Events > Daily Quests (quest open)
    const tabDia = document.getElementById('alert-tab-diamond');
    const tabShop = document.getElementById('alert-tab-shop');
    const tabQuest = document.getElementById('alert-tab-quests');
    if (tabDia) tabDia.style.display = isFreeDiamondAvailable() ? 'block' : 'none';
    if (tabShop) tabShop.style.display = isFreeGoldAvailable() ? 'block' : 'none';
    if (tabQuest) tabQuest.style.display = questOpen ? 'block' : 'none';
    // Stat and skill points waiting to be spent: Character button, stat points and skill points
    const statPts = (player.statPoints || 0) > 0, skillPts = (player.jobSp || 0) > 0;
    const setAlert = (id, on, disp = 'block') => { const el = document.getElementById(id); if (el) el.style.display = on ? disp : 'none'; };
    setAlert('alert-char', statPts || skillPts);
    setAlert('alert-stat-pts', statPts, 'inline-block');
    setAlert('alert-char-stats', statPts); // STATS tab on the character page
    setAlert('alert-char-skills', skillPts); // SKILLS button on the character page
    setAlert('alert-skill-sp', skillPts);
}

// Refresh everything on the shop row and the town alerts
// Daily quests start over each new day (progress, completion and milestone claims)
function ensureDailyQuestsToday() {
    const today = todayKey();
    if (!player.dailyQuestsDate) { player.dailyQuestsDate = today; return; } // older saves: keep today's progress
    if (player.dailyQuestsDate === today) return;
    player.dailyQuestsDate = today;
    (player.dailyQuests || []).forEach(q => { q.current = 0; q.completed = false; });
    player.questMilestoneClaimed = { 1: false, 2: false, 3: false };
    if (document.getElementById('quests-container')) renderQuestsView(); // redraw so milestones show reset
}

function refreshShopAndAlerts() {
    ensureDailyQuestsToday();
    updateShopTabButtons();
    updateShopBalance();
    updateTownAlerts();
}

// ---------- EVENTS PAGE TABS ----------
let currentEventsTab = 'quests'; // Events page opens on Daily Quests

function switchEventsTab(tabName) {
    if (tabName !== 'events' && tabName !== 'quests') tabName = 'events';
    currentEventsTab = tabName;
    const eventsPane = document.getElementById('events-tab-events');
    const questsPane = document.getElementById('events-tab-quests');
    const btnEvents = document.getElementById('events-tab-btn-events');
    const btnQuests = document.getElementById('events-tab-btn-quests');
    if (eventsPane) eventsPane.classList.toggle('hidden', tabName !== 'events');
    if (questsPane) questsPane.classList.toggle('hidden', tabName !== 'quests');
    // Active tab gets an amber border; inactive tab keeps the parchment background
    const active = 'border: 2px solid #c9a227';
    const inactive = 'border: 1px solid #b8945a';
    if (btnEvents) btnEvents.setAttribute('style', `background-color: rgba(214, 190, 140, .5); color: #2a1a0e; ${tabName === 'events' ? active : inactive}`);
    if (tabName === 'quests') renderQuestsView();
    updateQuestTabButton();
}

// Daily Quests tab turns red with white text while any daily quest is not complete
function updateQuestTabButton() {
    const btnQuests = document.getElementById('events-tab-btn-quests');
    if (!btnQuests) return;
    const active = currentEventsTab === 'quests' ? 'border: 2px solid #c9a227' : 'border: 1px solid #b8945a';
    // Open quests show the alert graphic (tab badge in the markup), not a red button
    const colors = 'background-color: rgba(214, 190, 140, .5); color: #2a1a0e;';
    btnQuests.setAttribute('style', `${colors} ${active}`);
}

function renderShop() {
    let consumablesContainer = document.getElementById('shop-consumables-container');
    if (consumablesContainer) {
        consumablesContainer.innerHTML = dailyFreeCardHTML('gold');
        GOLD_SHOP_CONSUMABLES.forEach(item => {
            consumablesContainer.innerHTML += `
                <div class="p-3 bg-slate-950/60 rounded border border-slate-800 flex justify-between items-center gap-3">
                    <div class="flex items-center gap-3 flex-1">
                        ${itemIconHTML(item, 48)}
                        <div>
                        <span class="font-bold text-amber-300 block text-xs">${item.name}</span>
                        <span class="text-[10px] text-slate-400">${item.desc} — Price: ${item.price} Gold</span>
                        </div>
                    </div>
                    <button onclick="buyGoldConsumable('${item.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer text-xs transition">Buy</button>
                </div>
            `;
        });
    }

    let armoryContainer = document.getElementById('shop-items-container');
    if (armoryContainer) {
        const pool = typeof SHOP_ARMORY_ITEMS !== 'undefined' ? SHOP_ARMORY_ITEMS : [];
        const slots = [...new Set(pool.map(i => i.slot).filter(Boolean))];
        const levels = [...new Set(pool.map(i => i.levelReq || 1))].sort((a, b) => a - b);
        renderArmoryFilterBar(slots, levels);

        const lvOf = it => it.levelReq || 1;
        const priceOf = it => it.price || 300;
        let rows = pool.map((item, idx) => ({ item, idx }))
            .filter(({ item }) => armoryFilter.slot === 'all' || item.slot === armoryFilter.slot)
            .filter(({ item }) => armoryFilter.level === 'all' || String(lvOf(item)) === armoryFilter.level);
        rows.sort((a, b) => {
            switch (armoryFilter.sort) {
                case 'level-desc': return lvOf(b.item) - lvOf(a.item);
                case 'price-asc': return priceOf(a.item) - priceOf(b.item);
                case 'price-desc': return priceOf(b.item) - priceOf(a.item);
                default: return lvOf(a.item) - lvOf(b.item);
            }
        });

        armoryContainer.innerHTML = rows.length ? '' : '<p class="text-xs" style="color:#3b2716">No items match these filters.</p>';
        // idx is the item's index in SHOP_ARMORY_ITEMS, which buyArmoryItem() expects
        rows.forEach(({ item, idx }) => {
            const price = priceOf(item);
            armoryContainer.innerHTML += `
                <div class="p-3 bg-slate-950/60 rounded border border-slate-800 flex justify-between items-center">
                    <div onclick="showArmoryItemDetail(${idx})" class="cursor-pointer flex-1 flex items-center gap-3">
                        ${itemIconHTML(item, 48)}
                        <div>
                        <span class="font-bold text-amber-300 block text-xs">${shopGearLabel(item).base}</span>
                        <span class="text-[10px] text-slate-400">[${shopGearLabel(item).tag}] LV${lvOf(item)}: ${price} Gold</span>
                        </div>
                    </div>
                    <button onclick="buyArmoryItem(${idx})" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer text-xs transition">Buy</button>
                </div>
            `;
        });
    }
}

function buyGoldConsumable(itemId) {
    let item = GOLD_SHOP_CONSUMABLES.find(i => i.id === itemId);
    if (!item) return;

    if (player.gold < item.price) {
        floatNoticeAt("Not enough Gold", window.event);
        return;
    }
    if (!placeItemInInventory({ ...item, qty: 1 })) {
        showModal("Purchase Failed", "Inventory is full!");
        return;
    }

    player.gold -= item.price;
    logMessage(`[Shop] Purchased ${item.name}!`, 'drop');
    markBeginnerFlag('potion');
    floatSuccessAt("Purchased!");
    updateUI();
    saveGame();
}

function shopGearLabel(item) {
    const m = (item.name || '').match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    const base = m ? m[1] : (item.name || '');
    const noun = base.split(' ').slice(-1)[0];
    const tag = m ? `${m[2]} ${noun}` : (item.slot ? item.slot.charAt(0).toUpperCase() + item.slot.slice(1) : 'Gear');
    return { base, tag };
}

function showArmoryItemDetail(itemIndex) {
    const template = SHOP_ARMORY_ITEMS[itemIndex];
    if (!template) return;
    const price = template.price || 300;
    const title = shopGearLabel(template).base;

    // Same layout as the character page gear detail, shown in the equipment window; rarity and buffs are rolled when bought
    let body = '<div class="char-detail-2x flex flex-col gap-2 text-left text-xs">';
    body += `<div class="flex justify-between items-center">
        <span class="${(player.baseLv || 1) >= (template.levelReq || 1) ? 'text-emerald-400' : 'text-red-400'} font-bold text-[11px]">Requires Base Lv. ${template.levelReq || 1}</span>
        <span class="text-[10px] text-slate-400 capitalize">Shop · ${template.slot || 'Gear'}</span></div>`;
    if (template.stats && Object.keys(template.stats).length) {
        body += `<div class="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">` +
            Object.entries(template.stats).map(([k, v]) => `<span class="text-slate-200">${formatStatLine(k, v)}</span>`).join('') +
            `</div>`;
    }
    body += `<span class="text-[11px] text-amber-200">Price: ${price} Gold</span>`;
    body += '</div>';

    const btn = 'flex-1 py-2 font-bold rounded-xl text-xs transition cursor-pointer';
    const actions = `<div class="flex flex-col gap-2 mt-2"><div class="flex gap-2">`
        + `<button onclick="buyArmoryFromDetail(${itemIndex})" class="${btn} bg-amber-600 hover:bg-amber-500 text-slate-950">Buy ${price} Gold</button>`
        + `</div></div>`;
    const panel = document.getElementById('shop-detail-panel');
    if (!panel) return;
    panel.innerHTML = `
        <button id="inv-detail-close" onclick="closeShopDetail()" class="absolute top-3 right-3 px-3 py-1 rounded-lg font-bold text-sm">✕</button>
        <div class="flex items-center gap-4 pr-12 pb-3 mb-3" style="border-bottom:2px solid #b8945a;">
            <span class="flex items-center justify-center" style="width:86px;height:86px;flex:none;">${itemIconHTML(template, 86)}</span>
            <div class="flex flex-col gap-2"><span class="font-black" style="font-size:28px;line-height:1.15;">${title}</span></div>
        </div>
        ${body}${actions}`;
    panel.style.display = 'block';
}
function closeShopDetail() {
    const panel = document.getElementById('shop-detail-panel');
    if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
}
// Buy from the shop detail panel: close it first, then buy
function buyArmoryFromDetail(itemIndex) {
    closeShopDetail();
    buyArmoryItem(itemIndex);
}

function buyArmoryItem(itemIndex) {
    let template = SHOP_ARMORY_ITEMS[itemIndex];
    if (!template) return;
    let price = template.price || 300;

    if (player.gold < price) {
        floatNoticeAt("Not enough Gold", window.event);
        return;
    }
    if (!Array.isArray(player.inventory)) player.inventory = new Array(BAG_SLOTS).fill(null);
    let emptyIdx = player.inventory.findIndex(s => s === null);
    if (emptyIdx === -1) {
        showModal("Purchase Failed", "Inventory is full!");
        return;
    }

    player.gold -= price;
    let gearItem = generatePoEItem(template, 1, 0);
    gearItem.buffs = [];
    gearItem.debuffs = [];
    addItemToInventory(gearItem);
    logMessage(`[Shop] Purchased ${gearItem.name}!`, 'drop');
    floatSuccessAt("Purchased!");
    updateUI();
    saveGame();
}

function renderDiamondShop() {
    let container = document.getElementById('diamond-shop-items-container');
    updateShopBalance();
    
    if (!container) return;
    container.innerHTML = dailyFreeCardHTML('diamond');

    DIAMOND_SHOP_ITEMS.forEach(item => {
        container.innerHTML += `
            <div class="p-3 bg-slate-900/80 rounded-xl border border-purple-500/40 flex justify-between items-center">
                <div class="flex items-center gap-3 min-w-0">
                    ${item.icon ? `<img src="${item.icon}" alt="" style="width:56px;height:56px;object-fit:contain;flex:0 0 auto;">` : ''}
                    <div class="min-w-0">
                        <span class="font-bold text-purple-300 block text-xs">${item.name}</span>
                        <span class="text-[10px] text-slate-400 block">${item.desc}</span>
                    </div>
                </div>
                <button onclick="buyDiamondItem('${item.id}')" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold rounded-lg cursor-pointer text-xs transition shadow"><img src="assets/icons/diamondiconsmall_q85.webp" alt="" style="width:16px;height:16px;display:inline-block;vertical-align:-3px"> ${item.price}</button>
            </div>
        `;
    });
}

// Timed boosts (real time): player.boosts[kind] = timestamp when the boost ends
function boostLeftMs(kind) { return Math.max(0, ((player.boosts || {})[kind] || 0) - Date.now()); }
function boostActive(kind) { return boostLeftMs(kind) > 0; }
function startBoost(kind, ms) {
    if (!player.boosts) player.boosts = {};
    player.boosts[kind] = Math.max(Date.now(), player.boosts[kind] || 0) + ms; // buying again adds time
}

function buyDiamondItem(itemId) {
    let item = DIAMOND_SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    if (item.type === 'vip' && isVipActive()) {
        showModal("VIP Active", `You already have a VIP Pass until ${new Date(player.vipUntil).toLocaleDateString()}. You can buy another after it expires.`);
        return;
    }

    if (player.diamonds < item.price) {
        floatNoticeAt("Not enough Diamonds", window.event);
        return;
    }
    if (item.type === 'chest' && countFreeCapacity({ name: item.name, type: 'chest', qty: 1 }) < 1) {
        showModal("Purchase Failed", "Inventory is full!");
        return;
    }

    player.diamonds -= item.price;
    player.diamondsSpent = (player.diamondsSpent || 0) + item.price; // total diamonds spent in the shop (avatar unlocks)
    if (item.type === 'resurrection') {
        player.resurrectionPotions = (player.resurrectionPotions || 0) + 1;
        floatSuccessAt("Purchased!");
    } else if (item.type === 'material') {
        player.refiningStones = (player.refiningStones || 0) + 5;
        floatSuccessAt("Purchased!");
    } else if (item.type === 'bs_rune') {
        player.blacksmithRuneStones = (player.blacksmithRuneStones || 0) + 1;
        floatSuccessAt("Purchased!");
    } else if (item.type === 'service') {
        let totalSpent = (player.stats.str - 1) + (player.stats.agi - 1) + (player.stats.vit - 1) + (player.stats.int - 1) + (player.stats.dex - 1) + (player.stats.luk - 1);
        player.statPoints += totalSpent;
        player.stats = { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 };
        showModal("Stat Reset Successful", `Attributes reset and ${totalSpent} Stat Points refunded!`);
    } else if (item.type === 'skill_reset') {
        let refunded = 0;
        for (let key in player.skills) {
            refunded += player.skills[key].level || 0;
            player.skills[key].level = 0;
        }
        player.jobSp += refunded;
        showModal("Skill Reset Successful", `All skills reset and ${refunded} Class SP refunded!`);
    } else if (item.type === 'chest') {
        placeItemInInventory({ name: item.name, type: 'chest', chestType: item.chestType, desc: item.desc, qty: 1 });
        floatSuccessAt("Purchased!");
    } else if (item.type === 'vip') {
        player.vipUntil = Date.now() + item.days * 24 * 60 * 60 * 1000;
        grantVipDailyMail();
        showModal("VIP Activated", `${item.name} active. Check your mailbox for today's Resurrection Potion.`);
    } else if (item.type === 'boost') {
        startBoost(item.boost, item.ms);
        showModal("Boost Active", `${item.name} started. It lasts 1 hour from now.`);
    } else if (item.type === 'pet') {
        addItemToInventory({ name: item.name, type: 'pet', slot: 'pet', qty: 1, stats: item.stats, desc: item.desc });
        floatSuccessAt("Purchased!");
    }

    updateUI();
    renderDiamondShop();
    saveGame();
}

// Blacksmith: pick an equipped gear from the list to load it into the gear slot, then refine it
let blacksmithSelectedSlot = null;
let blacksmithRuneOn = false;
// Refine success: +0 to +4 always succeed; from +5 the rate drops 15% per level (minimum 10%)
function refineSuccessRate(lv) {
    return lv >= 5 ? Math.max(10, 100 - ((lv - 4) * 15)) : 100;
}
function blacksmithToggleRune() {
    if (!blacksmithRuneOn && (player.blacksmithRuneStones || 0) < 1) {
        showModal("No Rune Stone", "You have no Blacksmith Rune Stone. Buy one in the Diamond shop for 5 Diamonds.");
        return;
    }
    blacksmithRuneOn = !blacksmithRuneOn;
    renderRefiningUI();
}
function blacksmithSelect(slot) {
    blacksmithSelectedSlot = slot;
    renderRefiningUI();
}
function blacksmithCancel() {
    blacksmithSelectedSlot = null;
    renderRefiningUI();
}
function blacksmithRefineSelected() {
    if (!blacksmithSelectedSlot) return;
    refineEquipment(blacksmithSelectedSlot);
}
function renderRuneSlot() {
    const runeEl = document.getElementById('blacksmith-rune-slot');
    const balEl = document.getElementById('bs-rune-balance');
    const count = player.blacksmithRuneStones || 0;
    if (count < 1) blacksmithRuneOn = false;
    if (runeEl) {
        runeEl.innerHTML = `<img src="assets/shop/diamond/blacksmithrunestone.png" alt="" style="width:36px;height:36px;object-fit:contain;"><span style="font-size:12px; font-weight:900; color:${blacksmithRuneOn ? '#86efac' : '#fca5a5'};">${blacksmithRuneOn ? 'ON' : 'OFF'}</span>`;
    }
    if (balEl) balEl.innerHTML = `<img src="assets/shop/diamond/blacksmithrunestone.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;"> Rune Stone: ${count}`;
}
function renderBlacksmithSlot() {
    const slotEl = document.getElementById('blacksmith-gear-slot');
    const refineBtn = document.getElementById('bs-refine');
    renderRuneSlot();
    if (!slotEl) return;
    const gear = blacksmithSelectedSlot ? player.equipped[blacksmithSelectedSlot] : null;
    if (!gear) {
        slotEl.innerHTML = '<span style="opacity:.6">Empty</span>';
        if (refineBtn) { refineBtn.disabled = true; refineBtn.style.opacity = '.5'; refineBtn.innerHTML = 'Refine'; }
        const rateEl0 = document.getElementById('bs-success-rate');
        if (rateEl0) rateEl0.textContent = '';
        return;
    }
    const lv = gear.refineLevel || 0;
    slotEl.innerHTML = `${itemIconHTML(gear, 60)}<span>${lv > 0 ? '+' + lv : ''}</span>`;
    const isMax = lv >= 10;
    const cost = (lv + 1) * 100;
    const rateEl = document.getElementById('bs-success-rate');
    if (rateEl) rateEl.textContent = isMax ? 'MAX LEVEL' : `Success: ${refineSuccessRate(lv)}%`;
    if (refineBtn) {
        refineBtn.disabled = isMax;
        refineBtn.style.opacity = isMax ? '.5' : '1';
        refineBtn.innerHTML = isMax ? 'MAX LEVEL' : `Refine<br>${cost} Gold`;
    }
}

function renderRefiningUI() {
    let container = document.getElementById('refining-slots-container');
    if (!container) return;
    let scraps = getScrapCount();
    if (blacksmithSelectedSlot && !player.equipped[blacksmithSelectedSlot]) blacksmithSelectedSlot = null;

    container.innerHTML = `
        <div class="p-3 bg-slate-950 rounded-xl border border-amber-500/30 mb-3 flex flex-col gap-2">
            <div class="flex justify-between items-center text-xs">
                <span class="inline-flex items-center gap-1.5"><img src="assets/items/mat_scrap.png" alt="" style="width:20px;height:20px;object-fit:contain;"> Iron Scraps: <strong class="text-slate-200">${scraps} / 100</strong></span>
                <button onclick="smeltRefiningStone()" class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer">Smelt 1 Refining Stone</button>
            </div>
            <span class="text-[10px] text-slate-400">Combine 100 Iron Scraps to forge 1 Refining Stone.</span>
            <span class="text-xs text-amber-200 inline-flex items-center gap-1.5"><img src="assets/shop/diamond/refiningstone.png" alt="" style="width:20px;height:20px;object-fit:contain;"> Available Refining Stones: <strong class="text-amber-400">${player.refiningStones || 0}</strong></span>
        </div>
        <div class="text-[10px] text-slate-400 mb-1">Select gear to refine:</div>
    `;

    let any = false;
    for (let [slot, gear] of Object.entries(player.equipped)) {
        if (!gear || slot === 'pet' || slot === 'potionSlot') continue;
        any = true;
        let currentRefine = gear.refineLevel || 0;
        let isMax = currentRefine >= 10;
        let successRate = refineSuccessRate(currentRefine);
        let costGold = (currentRefine + 1) * 100;
        let selected = blacksmithSelectedSlot === slot;
        container.innerHTML += `
            <div onclick="blacksmithSelect('${slot}')" class="p-3 rounded border cursor-pointer flex justify-between items-center gap-3 ${selected ? 'bg-amber-900/60 border-amber-400' : 'bg-slate-900/80 border-slate-700 hover:border-amber-600'}">
                <div>
                    <span class="font-bold text-amber-300 text-xs inline-flex items-center gap-2">${itemIconHTML(gear, 36)} ${gear.name} ${currentRefine > 0 ? '+' + currentRefine : ''}</span>
                    <span class="text-[10px] text-slate-400 block capitalize">Slot: ${slot} | Success Rate: ${isMax ? 'MAX' : successRate + '%'}</span>
                </div>
                <span class="text-[10px] text-slate-300 whitespace-nowrap">${isMax ? 'MAX LEVEL' : costGold + ' Gold + 1 Stone'}</span>
            </div>
        `;
    }
    if (!any) container.innerHTML += '<div class="text-xs text-slate-400">No equipped gear to refine.</div>';
    renderBlacksmithSlot();
}

function refineEquipment(slot) {
    let gear = player.equipped[slot];
    if (!gear) return;
    // Gear without a valid level counts as +0; the level is never below +0
    gear.refineLevel = Math.max(0, Math.floor(Number(gear.refineLevel) || 0));
    if (gear.refineLevel >= 10) return;

    let current = gear.refineLevel;
    let costGold = (current + 1) * 100;
    if (player.gold < costGold || (player.refiningStones || 0) < 1) {
        showFloatNotice(`Refining needs ${costGold} Gold and 1 Refining Stone.`);
        return;
    }

    player.gold -= costGold;
    player.refiningStones = Math.max(0, (player.refiningStones || 0) - 1);

    let successRate = refineSuccessRate(current);
    if (Math.random() * 100 <= successRate) {
        gear.refineLevel = current + 1;
        logMessage(`[Refine Success] Upgraded ${gear.name} to +${gear.refineLevel}!`, 'levelup');
        showModal("Refinement Successful!", `Your ${gear.name} was upgraded to +${gear.refineLevel}!`);
    } else {
        if (blacksmithRuneOn && (player.blacksmithRuneStones || 0) > 0) {
            // Rune Stone on: the failed refine keeps the level and uses one stone
            player.blacksmithRuneStones -= 1;
            if (player.blacksmithRuneStones <= 0) blacksmithRuneOn = false;
            gear.refineLevel = current;
            logMessage(`[Refine Failed] Rune Stone protected ${gear.name} at +${current}.`, 'combat');
            showModal("Refinement Failed", `The upgrade failed, but the Blacksmith Rune Stone kept your ${gear.name} at +${current}.`);
        } else {
            // Failure drops the refine level by 1 (never below +0)
            gear.refineLevel = Math.max(Math.min(current, 4), current - 1);
            logMessage(`[Refine Failed] Upgrade failed. ${gear.name} dropped to +${gear.refineLevel}.`, 'combat');
            showModal("Refinement Failed", `The upgrade process failed. Your ${gear.name} dropped to +${gear.refineLevel}.`);
        }
    }

    updateUI();
    renderRefiningUI();
    saveGame();
}

function smeltRefiningStone() {
    if (!player.materials) player.materials = { ironScraps: 0 };
    let scraps = getScrapCount();

    if (scraps < 100) {
        showModal("Smelting Failed", "You need at least 100 Iron Scraps to smelt a Refining Stone!");
        return;
    }

    removeScraps(100);
    player.refiningStones = (player.refiningStones || 0) + 1;

    logMessage(`[Forge] Successfully smelted 1x Refining Stone from 100 Iron Scraps!`, 'levelup');
    showModal("Smelting Successful", "Forged 1x Refining Stone from 100 Iron Scraps!");
    updateUI();
    renderRefiningUI();
    saveGame();
}

const MAX_STACK = 99;

function stackLimit(item) {
    if (!isStackable(item)) return 1;
    if (item.type === 'potion' || /Potion/.test(item.name || '')) return 5;
    if (item.type === 'material') return 50;
    if (item.type === 'chest') return 20;
    return MAX_STACK;
}

function isStackable(item) {
    return !!item && (item.type === 'potion' || item.type === 'material' || item.type === 'chest' || item.stackable === true || /Potion/.test(item.name || ''));
}

function countFreeCapacity(newItem) {
    const limit = stackLimit(newItem);
    const stackable = isStackable(newItem);
    let cap = 0;
    for (const s of player.inventory) {
        if (s === null) cap += limit;
        else if (stackable && s.name === newItem.name && isStackable(s)) cap += Math.max(0, stackLimit(s) - (s.qty || 1));
    }
    return cap;
}

// Places an item into the bag, merging into existing stacks first. All-or-nothing.
function placeItemInInventory(newItem) {
    if (!Array.isArray(player.inventory)) player.inventory = new Array(BAG_SLOTS).fill(null);
    let qty = newItem.qty || 1;
    if (countFreeCapacity(newItem) < qty) return false;

    const stackable = isStackable(newItem);
    const limit = stackLimit(newItem);
    if (stackable) {
        for (const s of player.inventory) {
            if (qty <= 0) break;
            if (s && s.name === newItem.name && isStackable(s)) {
                const add = Math.min(stackLimit(s) - (s.qty || 1), qty);
                if (add > 0) { s.qty = (s.qty || 1) + add; qty -= add; }
            }
        }
    }
    while (qty > 0) {
        const idx = player.inventory.findIndex(x => x === null);
        if (idx === -1) break;
        const put = Math.min(limit, qty);
        player.inventory[idx] = { ...newItem, qty: put };
        qty -= put;
    }
    return true;
}

function addItemToInventory(newItem) {
    if (stageSummary) stageSummary.items.push({ name: newItem.name, rarity: newItem.rarity });
    if (!placeItemInInventory(newItem)) {
        logMessage(`[Inventory Full] ${newItem.name} was discarded.`, 'combat');
        return false;
    }
    const q = newItem.qty || 1;
    logMessage(`[Inventory] Obtained ${newItem.name}${q > 1 ? ' x' + q : ''}!`, 'drop');
    updateUI();
    saveGame();
    return true;
}

const SCRAP_ITEM = { name: "Iron Scraps", type: 'material', price: 2, desc: "Salvaged metal. 100 make a Refining Stone." };

function getScrapCount() {
    return (player.inventory || []).reduce((n, s) => n + (s && s.name === SCRAP_ITEM.name ? (s.qty || 1) : 0), 0);
}

function addScraps(n) {
    return placeItemInInventory({ ...SCRAP_ITEM, qty: n });
}

function removeScraps(n) {
    let left = n;
    for (let i = 0; i < player.inventory.length && left > 0; i++) {
        const s = player.inventory[i];
        if (s && s.name === SCRAP_ITEM.name) {
            const take = Math.min(left, s.qty || 1);
            s.qty = (s.qty || 1) - take;
            left -= take;
            if (s.qty <= 0) player.inventory[i] = null;
        }
    }
}

// Splits any stack larger than its limit (e.g. from older saves)
function normalizeInventoryStacks() {
    if (!Array.isArray(player.inventory)) return;
    for (let i = 0; i < player.inventory.length; i++) {
        const s = player.inventory[i];
        if (!s || !isStackable(s)) continue;
        const limit = stackLimit(s);
        if ((s.qty || 1) <= limit) continue;
        const overflow = (s.qty || 1) - limit;
        s.qty = limit;
        if (!placeItemInInventory({ ...s, qty: overflow })) {
            logMessage(`[Inventory] Could not fit ${overflow} extra ${s.name}`, 'combat');
        }
    }
}

// Sort the bag by item type. Empty slots stay at the end.
const TYPE_RANK = { weapon: 1, shield: 2, hat: 3, armor: 4, garment: 5, footgear: 6, ring: 7, pet: 8 };
function itemTypeRank(item) {
    if (item.slot) return TYPE_RANK[item.slot] || 50;
    if (item.type === 'potion' || /Potion/.test(item.name || '')) return 60;
    return 70;
}

// Inventory drag and drop: drag an item onto another cell to swap them (same stackable items merge)
let invDragFrom = null;
function invDragStart(e, index) {
    if (!player.inventory[index]) { e.preventDefault(); return; }
    invDragFrom = index;
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(index)); } catch (_) {}
}
function invDragOver(e) {
    if (invDragFrom === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}
function invDrop(e, to) {
    e.preventDefault();
    const from = invDragFrom;
    invDragFrom = null;
    if (from === null || from === to || !Array.isArray(player.inventory)) return;
    const a = player.inventory[from];
    const b = player.inventory[to];
    if (!a) return;
    if (b && a.name === b.name && isStackable(a) && isStackable(b)) {
        const lim = stackLimit(a);
        const total = (a.qty || 1) + (b.qty || 1);
        if (total <= lim) {
            player.inventory[to] = { ...b, qty: total };
            player.inventory[from] = null;
        } else {
            player.inventory[to] = { ...b, qty: lim };
            player.inventory[from] = { ...a, qty: total - lim };
        }
    } else {
        player.inventory[from] = b || null;
        player.inventory[to] = a;
    }
    updateUI();
    saveGame();
}
function invDragEnd() { invDragFrom = null; }
// Drag an inventory item onto a gear slot to equip it (rings go to the slot dropped on; potions go to the potion slot)
function eqDragOver(e) {
    if (invDragFrom === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}
function eqDrop(e, slot) {
    e.preventDefault();
    const from = invDragFrom;
    invDragFrom = null;
    if (from === null) return;
    const item = player.inventory[from];
    if (!item) return;
    if (slot === 'potionSlot') {
        if (item.type === 'potion') useInventoryPotion(from);
        else logMessage(`[Equipment] ${item.name} cannot go in the potion slot`, 'winlose');
        return;
    }
    const fits = item.slot === slot || (item.slot === 'ring' && (slot === 'ringLeft' || slot === 'ringRight'));
    if (!fits) {
        logMessage(`[Equipment] ${item.name} cannot be equipped in this slot`, 'winlose');
        return;
    }
    if (executeEquipItem(from, slot)) closeInvDetail();
}


function sortInventory(key) {
    const [field, dir] = String(key || 'type_asc').split('_');
    const sign = dir === 'desc' ? -1 : 1;
    const valueOf = {
        type: it => itemTypeRank(it),
        level: it => it.levelReq || 0,
        rarity: it => it.rarity || 0
    }[field] || (() => 0);
    const items = player.inventory.filter(Boolean);
    items.sort((a, b) =>
        ((b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)) ||
        ((valueOf(a) - valueOf(b)) * sign) ||
        a.name.localeCompare(b.name));
    player.inventory = [...items, ...new Array(BAG_SLOTS - items.length).fill(null)];
    logMessage(`[Inventory] Sorted by ${field} (${dir === 'desc' ? 'high to low' : 'low to high'}). Favorites first.`, 'drop');
    updateUI();
    saveGame();
}

function unequipPotionSlot() {
    const ps = player.equipped.potionSlot;
    if (!ps || !ps.name) return;
    if ((ps.qty || 0) > 0) {
        if (!placeItemInInventory({ ...ps, qty: ps.qty })) {
            showFloatNotice("Inventory is full! Make room before unequipping potions.");
            return;
        }
        logMessage(`[Potion] Unequipped ${ps.name} x${ps.qty}`, 'drop');
    }
    player.equipped.potionSlot = { name: "", type: "potion", heal: 0, qty: 0, desc: "" };
    updateUI();
    saveGame();
}

function unequipItem(slotName) {
    if (slotName === 'potionSlot') { unequipPotionSlot(); return; }
    let item = player.equipped[slotName];
    if (!item) return;

    if (!Array.isArray(player.inventory)) player.inventory = new Array(BAG_SLOTS).fill(null);
    let emptyIdx = player.inventory.findIndex(s => s === null);
    if (emptyIdx === -1) {
        showFloatNotice("Inventory is full!");
        return;
    }

    player.inventory[emptyIdx] = { ...item };
    player.equipped[slotName] = null;
    logMessage(`[Equipment] Unequipped ${item.name}`, 'drop');
    updateUI();
    saveGame();
}

const STAT_LABELS = { atk: 'ATK', def: 'DEF', hp: 'HP', flee: 'FLEE', hit: 'HIT', aspd: 'ASPD', crit: 'CRIT', block: 'Block', mdef: 'MDEF', armor: 'ARMOR', atkPct: 'ATK%' };

function formatStatLine(key, val) {
    const pct = key === 'crit' || key === 'block' || key === 'atkPct' || key.startsWith('res_');
    const label = key.startsWith('res_') ? `${ELEMENTS[key.slice(4)] ? ELEMENTS[key.slice(4)].name : key} Res` : (STAT_LABELS[key] || key.toUpperCase());
    return `${label} ${val >= 0 ? '+' : ''}${val}${pct ? '%' : ''}`;
}

// Class icon for a monster role (melee, tank, range, healer, mage)
const ROLE_ICONS = { melee: '⚔️', tank: '🛡️', range: '🏹', healer: '💚', mage: '🔮' };
function roleIconOf(m) {
    if (!m) return '';
    const r = typeof roleOf === 'function' ? roleOf(m) : (m.role || 'melee');
    return ROLE_ICONS[r] || '';
}

function elemTagHTML(m) {
    if (!m) return '';
    const role = roleIconOf(m);
    const e = m.element && ELEMENTS[m.element] ? ELEMENTS[m.element] : null;
    if (!role && !e) return '';
    const parts = [role, e ? e.icon : '', e ? e.name : ''].filter(Boolean).join(' ');
    return `<span class="${e ? e.color : 'text-slate-300'} text-[10px] font-bold">${parts}</span>`;
}

function elemIconText(item) {
    return (item && item.element && ELEMENTS[item.element]) ? ` ${ELEMENTS[item.element].icon}` : '';
}

// Inventory picture: gear by slot, consumables by type
const ITEM_SLOT_EMOJI = { weapon: '⚔️', shield: '🛡️', armor: '🥋', garment: '🧣', footgear: '👢', hat: '🎩', ring: '💍', pet: '🐾' };
const ITEM_TYPE_EMOJI = { potion: '🧪', chest: '🎁', material: '🪨', pet: '🐾', resurrection: '✨', vip: '👑', service: '🛠️', skill_reset: '📜' };
// Inventory icons (PNG, transparent) for consumables and materials; other items keep the emoji
const ITEM_ICON_RULES = [
    [/Support Slime Pet/, 'assets/shop/diamond/slimebase.png'],
    [/Minor Healing Potion/, 'potion_minor'],
    [/Medium Healing Potion/, 'potion_med'],
    [/Large Healing Potion/, 'potion_large'],
    [/Resurrection Potion/, 'potion_res'],
    [/Copper Chest/, 'assets/shop/diamond/copperchest.png'],
    [/Silver Chest/, 'assets/shop/diamond/silverchest.png'],
    [/Gold Chest/, 'assets/shop/diamond/goldchest.png'],
    [/Refining Stone/, 'mat_refining'],
    [/Iron Scraps/, 'mat_scrap'],
    [/Skill Reset/, 'scroll_skillreset'],
    [/Worn Iron Sword/, 'gear_sword'],
    [/Leather Boots/, 'gear_boots'],
    [/Apprentice Ring/, 'gear_ring'],
    [/Wooden Buckler/, 'gear_buckler'],
    [/Iron Cuirass/, 'gear_cuirass'],
    [/Mossbloom Cap/, 'gear_mossbloomcap'],
    [/Cotton Cloak/, 'gear_cloak'],
    // Level 10 gear icons
    [/Iron Ring/, 'gear_lv10_ring'],
    [/Steel Broadsword/, 'gear_lv10_sword'],
    [/Iron Vanguard Shield/, 'gear_lv10_shield'],
    [/Steel Plate Armor/, 'gear_lv10_armor'],
    [/Chain Mail Mantle/, 'gear_lv10_cloak'],
    [/Armored Greaves/, 'gear_lv10_boots'],
    [/Iron Helm/, 'gear_lv10_helm'],
    [/Magma Horn Helm/, 'gear_lv10_boss'],
    // Level 20 gear icons
    [/Ring of Swiftness/, 'gear_lv20_ring'],
    [/Commander Blade/, 'gear_lv20_sword'],
    [/Royal Aegis/, 'gear_lv20_shield'],
    [/Mithril Cuirass/, 'gear_lv20_armor'],
    [/Valkyrie Cloak/, 'gear_lv20_cloak'],
    [/Knight Striders/, 'gear_lv20_boots'],
    [/Knight Helm/, 'gear_lv20_helm'],
    [/Pharaoh's Gold Crown/, 'gear_lv20_boss'],
    // Level 30 gear icons
    [/Eagle Ring/, 'gear_lv30_ring'],
    [/Excalibur Fragment/, 'gear_lv30_sword'],
    [/Shield of Asgard/, 'gear_lv30_shield'],
    [/Divine Armor of Valhalla/, 'gear_lv30_armor'],
    [/Winged Shroud/, 'gear_lv30_cloak'],
    [/Boots of Swift Retribution/, 'gear_lv30_boots'],
    [/Winged Helm/, 'gear_lv30_helm'],
    [/Abyssal Coral Crown/, 'gear_lv30_boss'],
    // Level 40 gear icons
    [/Titan Ring/, 'gear_lv40_ring'],
    [/Solar Blade/, 'gear_lv40_sword'],
    [/Aegis of Light/, 'gear_lv40_shield'],
    [/Solar Plate/, 'gear_lv40_armor'],
    [/Solar Mantle/, 'gear_lv40_cloak'],
    [/Solar Greaves/, 'gear_lv40_boots'],
    [/Solar Crown/, 'gear_lv40_helm'],
    [/Cracked Halo Crown/, 'gear_lv40_boss'],
    // Level 50 gear icons
    [/Ring of Odin/, 'gear_lv50_ring'],
    [/Blade of Asgard/, 'gear_lv50_sword'],
    [/Ultimate Aegis/, 'gear_lv50_shield'],
    [/Armor of the Gods/, 'gear_lv50_armor'],
    [/Shroud of Eternity/, 'gear_lv50_cloak'],
    [/Striders of Odin/, 'gear_lv50_boots'],
    [/Helm of Odin/, 'gear_lv50_helm'],
    [/Worldshell Helm/, 'gear_lv50_boss'],
    // Level 60 gear icons
    [/Ring of Jotun Frost/, 'gear_lv60_ring'],
    [/Jotun Ice Sword/, 'gear_lv60_sword'],
    [/Jotun Rime Shield/, 'gear_lv60_shield'],
    [/Jotun Fur Armor/, 'gear_lv60_armor'],
    [/Jotun Snow Cloak/, 'gear_lv60_cloak'],
    [/Jotun Ice Striders/, 'gear_lv60_boots'],
    [/Jotun Helm/, 'gear_lv60_helm'],
    [/Icicle Crown of Hrym/, 'gear_lv60_boss'],
    // Level 70 gear icons
    [/Ring of the Valkyrie/, 'gear_lv70_ring'],
    [/Einherjar Blade/, 'gear_lv70_sword'],
    [/Valkyrie Bulwark/, 'gear_lv70_shield'],
    [/Valkyrie Plate/, 'gear_lv70_armor'],
    [/Valkyrie Wing Mantle/, 'gear_lv70_cloak'],
    [/Valkyrie Greaves/, 'gear_lv70_boots'],
    [/^Valkyrie Helm$/, 'gear_lv70_helm'],
    [/Black Feather Valkyrie Helm/, 'gear_lv70_boss'],
    // Level 80 gear icons
    [/Ring of Muspel Ember/, 'gear_lv80_ring'],
    [/Muspel Flame Blade/, 'gear_lv80_sword'],
    [/Muspel Ember Shield/, 'gear_lv80_shield'],
    [/Muspel Forged Plate/, 'gear_lv80_armor'],
    [/Muspel Ash Cloak/, 'gear_lv80_cloak'],
    [/Muspel Ember Boots/, 'gear_lv80_boots'],
    [/Muspel Crown/, 'gear_lv80_helm'],
    [/Burning Stone Crown/, 'gear_lv80_boss'],
    // Level 90 gear icons
    [/Ring of Hel/, 'gear_lv90_ring'],
    [/Hel Bone Blade/, 'gear_lv90_sword'],
    [/Hel Grave Shield/, 'gear_lv90_shield'],
    [/Hel Death Plate/, 'gear_lv90_armor'],
    [/Hel Shroud/, 'gear_lv90_cloak'],
    [/Hel Walkers/, 'gear_lv90_boots'],
    [/Hel Helm/, 'gear_lv90_helm'],
    [/Hel's Bone Crown/, 'gear_lv90_boss'],
    // Level 99 gear icons
    [/Dusk Oath Ring/, 'gear_lv99_ring'],
    [/Dusk Reaper Blade/, 'gear_lv99_sword'],
    [/Dusk Ward Shield/, 'gear_lv99_shield'],
    [/Dusk Titan Plate/, 'gear_lv99_armor'],
    [/Dusk Veil Cloak/, 'gear_lv99_cloak'],
    [/Dusk Walkers/, 'gear_lv99_boots'],
    [/Dusk Crown/, 'gear_lv99_helm'],
    [/Starlight Void Crown/, 'gear_lv99_boss']
];
function itemIconHTML(item, size = 70) {
    const rule = item && item.name ? ITEM_ICON_RULES.find(r => r[0].test(item.name)) : null;
    if (rule) {
        const src = rule[1].includes('/') ? rule[1] : `assets/items/${rule[1]}.png`; // full path, or an items-folder name
        return `<img src="${src}" alt="" style="width:${size}px;height:${size}px;object-fit:contain;" />`;
    }
    return `<span style="font-size:${Math.round(size * 0.63)}px;line-height:1;">${itemEmoji(item)}</span>`;
}
function itemEmoji(item) {
    if (!item) return '';
    if (item.slot && ITEM_SLOT_EMOJI[item.slot]) return ITEM_SLOT_EMOJI[item.slot];
    if (item.type && ITEM_TYPE_EMOJI[item.type]) return ITEM_TYPE_EMOJI[item.type];
    return '📦';
}

function elementDetailHTML(el) {
    const e = ELEMENTS[el];
    if (!e) return '';
    const weakKey = Object.keys(ELEMENTS).find(k => ELEMENTS[k].beats === el);
    return `<span class="text-cyan-300">${e.icon} ${e.name} element: strong vs ${ELEMENTS[e.beats].name}, weak vs ${ELEMENTS[weakKey].name}</span>`;
}

function buffsDetailHTML(buffs, debuffs) {
    const up = (buffs || []).map(b => {
        const tier = RARITY_INFO[b.tier] || RARITY_INFO[1];
        return `<div class="${tier.text}">• ${b.desc} <span class="text-[9px] opacity-70">[Tier ${b.tier} ${tier.name}]</span></div>`;
    }).join('');
    const down = (debuffs || []).map(d => `<div class="text-red-400">▾ ${d.desc}</div>`).join('');
    if (!up && !down) return '<span class="text-slate-500">No buffs</span>';
    return up + down;
}

function setInfoHTML(setKey, activeOnly = false) {
    const def = SET_DATA[setKey];
    if (!def) return '';
    const have = getSetBonuses().counts[setKey] || 0;
    const reached = def.bonuses.filter(bn => have >= bn.pieces);
    const best = reached[reached.length - 1];
    if (activeOnly && !best) return '';
    const rows = def.bonuses.filter(bn => !activeOnly || bn === best).map(bn => {
        const on = bn === best;
        const sub = !on && have >= bn.pieces ? ' (replaced)' : '';
        // Active tier is green; tiers not reached (or replaced by a higher tier) are red
        return `<div class="${on ? 'font-semibold stat-better' : 'stat-worse'}">(${bn.pieces} pcs) ${bn.desc}${sub}</div>`;
    }).join('');
    return `<div class="p-2 rounded-lg border ${have > 0 ? 'border-amber-500/40' : 'border-slate-800'} bg-slate-950/60 flex flex-col gap-1 text-[10px]">
        <span class="font-bold ${have > 0 ? 'text-amber-300' : 'text-slate-400'}">${def.name}: ${have} / ${def.pieces} equipped</span>${rows}</div>`;
}

function renderSetBonusPanel() {
    const c = document.getElementById('set-bonus-panel');
    if (!c) return;
    const html = Object.keys(SET_DATA).map(k => setInfoHTML(k, true)).filter(Boolean).join('');
    c.innerHTML = html || '<span class="text-[10px] text-slate-500">No set bonus active.</span>';
}

// Total value per stat for an item: base + buffs + debuffs
function effectiveStats(item) {
    const m = {};
    if (!item) return m;
    for (const k in (item.stats || {})) m[k] = (m[k] || 0) + item.stats[k];
    (item.buffs || []).forEach(b => { m[b.stat] = (m[b.stat] || 0) + b.value; });
    (item.debuffs || []).forEach(d => { m[d.stat] = (m[d.stat] || 0) + d.value; });
    return m;
}

function gearCardHTML(item, label) {
    if (!item || !item.name) {
        return `<div class="flex-1 min-w-0 p-2 rounded-lg border border-dashed border-slate-700 text-slate-500 text-[10px] text-center flex flex-col justify-center gap-1">
            <span class="uppercase tracking-wider">${label}</span><span>Nothing equipped</span></div>`;
    }
    const r = RARITY_INFO[item.rarity] || RARITY_INFO[1];
    const stats = Object.entries(item.stats || {}).map(([k, v]) => `<div class="text-slate-200">${formatStatLine(k, v)}</div>`).join('') || '<div class="text-slate-500">No base stats</div>';
    const buffs = (item.buffs || []).map(b => `<div class="${(RARITY_INFO[b.tier] || RARITY_INFO[1]).text}">• ${b.desc}</div>`).join('');
    const debuffs = (item.debuffs || []).map(d => `<div class="text-red-400">▾ ${d.desc}</div>`).join('');
    // Selected and Equipped cards each have their own background colour
    const bg = label === 'Selected' ? 'bg-sky-900/50 border border-sky-600/60' : 'bg-amber-900/40 border border-amber-700/60';
    return `<div class="flex-1 min-w-0 p-2 rounded-lg ${bg} flex flex-col gap-1 text-[10px]">
        <span class="text-[9px] uppercase tracking-wider text-slate-500">${label}</span>
        <span class="font-bold ${r.text} break-words">${item.name}${item.refineLevel > 0 ? ' +' + item.refineLevel : ''}</span>
        <span class="${r.text}">${r.name} · R${item.rarity}</span>
        ${item.element && ELEMENTS[item.element] ? `<span class="text-cyan-300">${ELEMENTS[item.element].icon} ${ELEMENTS[item.element].name}</span>` : ''}
        ${stats}${buffs}${debuffs}
    </div>`;
}

function compareHTML(selected, equipped) {
    const s = effectiveStats(selected);
    const e = effectiveStats(equipped);
    const keys = new Set([...Object.keys(s), ...Object.keys(e)]);
    const rows = [...keys].map(k => {
        const d = (s[k] || 0) - (e[k] || 0);
        if (!d) return '';
        // Inline colour so the better/worse colour never depends on the style build: green = better, red = worse
        return `<div class="font-bold ${d > 0 ? 'stat-better' : 'stat-worse'}">${STAT_LABELS[k] || k.toUpperCase()} ${d > 0 ? '+' : ''}${d}</div>`;
    }).join('');
    return `<div class="flex flex-col gap-2">
        <div class="flex gap-2 items-stretch">${gearCardHTML(selected, 'Selected')}${gearCardHTML(equipped, 'Equipped')}</div>
        ${rows ? `<div class="pt-2 border-t border-slate-700 text-[10px] flex flex-col gap-0.5"><span class="text-slate-400">Change if equip:</span>${rows}</div>` : ''}
    </div>`;
}

// Close button in the top-right corner of gear detail windows, same graphic as the character page return button
function closeCornerHTML() {
    return `<button onclick="closeModal()" class="gear-close absolute top-3 right-3 p-0 border-0 bg-transparent cursor-pointer" style="width:66px;height:67px;">`
        + `<img class="ret-normal" src="assets/cha/button/returnbuttonsmall_q85.webp" alt="Close" style="width:66px;height:67px;">`
        + `<img class="ret-press" src="assets/cha/button/returnbuttonpresssmall_q85.webp" alt="" style="display:none;width:66px;height:67px;">`
        + `</button>`;
}

// Equipment: only the header, requirements, set info and the comparison window (no duplicate stat list)
function closeInvDetail() {
    const panel = document.getElementById('inv-detail-panel');
    if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
    window.invDetailIndex = null;
}
// Rarity tag (R1..R5 in the rarity color) and the base level requirement (green when met, red when not)
function reqLevelHTML(item, levelReq) {
    const rarity = RARITY_INFO[item.rarity];
    const req = levelReq || 1;
    const ok = (player.baseLv || 1) >= req;
    return `<span class="${rarity ? rarity.text : 'text-slate-300'} font-bold text-[11px]">R${item.rarity}</span>` +
        `<span class="${ok ? 'text-emerald-400' : 'text-red-400'} font-bold text-[11px]">, Requires Base Lv. ${req}</span>`;
}
function showItemDetail(index) {
    const item = player.inventory[index];
    if (!item) { closeInvDetail(); return; }
    window.invDetailIndex = index;
    const isEquip = !!item.slot;
    const isPotion = item.type === 'potion';
    const rarity = RARITY_INFO[item.rarity];
    const kind = isEquip ? item.slot : (isPotion ? 'Consumable' : 'Item');
    const title = (item.favorite ? '★ ' : '') + item.name + (item.refineLevel > 0 ? ` +${item.refineLevel}` : '');

    let body = '<div class="char-detail-2x flex flex-col gap-2 text-left text-xs">';
    body += `<div class="flex justify-between items-center">
        <span>${rarity ? reqLevelHTML(item, isEquip ? item.levelReq : 0) : ''}</span>
        <span class="text-[10px] text-slate-400 capitalize">${item.favorite ? '<span class="text-yellow-300 font-bold">★ Favorite</span> · ' : ''}${kind}</span></div>`;
    if (isEquip && item.element) body += `<span class="text-[11px]">${elementDetailHTML(item.element)}</span>`;
    if (!isEquip && !isPotion && item.desc) body += `<p class="text-[11px] text-slate-400">${item.desc}</p>`;
    if (isPotion) body += `<span class="text-[11px] text-emerald-300">Restores ${potionHealText(item)} · Qty ${item.qty || 1}</span>`;
    if (item.setName) body += setInfoHTML(item.setName);
    if (isEquip && item.slot !== 'pet') {
        body += compareHTML(item, player.equipped[item.slot === 'ring' ? 'ringLeft' : item.slot]);
    } else if (isEquip && item.stats) {
        body += `<div class="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">` +
            Object.entries(item.stats).map(([k, v]) => `<span class="text-slate-200">${formatStatLine(k, v)}</span>`).join('') + `</div>`;
    }
    body += '</div>';

    const btn = 'flex-1 py-2 font-bold rounded-xl text-xs transition cursor-pointer';
    let actions = '<div class="flex flex-col gap-2 mt-2"><div class="flex gap-2">';
    if (item.type === 'chest') actions += `<button onclick="openChestFromDetail(${index})" class="${btn} bg-purple-600 hover:bg-purple-500 text-slate-100">Open</button>`;
    if (isEquip) actions += `<button onclick="equipFromDetail(${index})" class="${btn} bg-amber-600 hover:bg-amber-500 text-slate-950">Equip</button>`;
    if (isPotion) actions += `<button onclick="usePotionFromDetail(${index})" class="${btn} bg-emerald-600 hover:bg-emerald-500 text-slate-950">Equip</button>`;
    if (isEquip && item.slot !== 'pet' && !item.favorite) actions += `<button onclick="salvageFromDetail(${index})" class="${btn} bg-red-600 hover:bg-red-500 text-slate-100">Salvage</button>`;
    if (item.slot !== 'pet' && !item.favorite) actions += `<button onclick="sellFromDetail(${index})" class="${btn} bg-amber-700 hover:bg-amber-600 text-amber-100">Sell ${getSellPrice(item)} Gold</button>`;
    actions += '</div>';
    actions += '</div>';

    const favBtn = isGearItem(item) && item.slot !== 'pet'
        ? `<button onclick="toggleFavorite(${index})" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300 font-bold text-xs">${item.favorite ? '★ Unfavorite' : '☆ Favorite'}</button>`
        : '';
    const panel = document.getElementById('inv-detail-panel');
    if (!panel) return;
    panel.innerHTML = `
        <button id="inv-detail-close" onclick="closeInvDetail()" class="absolute top-3 right-3 px-3 py-1 rounded-lg font-bold text-sm">✕</button>
        <div class="flex items-center gap-4 pr-12 pb-3 mb-3" style="border-bottom:2px solid #b8945a;">
            <span class="flex items-center justify-center" style="width:86px;height:86px;flex:none;">${itemIconHTML(item)}</span>
            <div class="flex flex-col gap-2"><span class="font-black" style="font-size:28px;line-height:1.15;">${title}</span>${favBtn}</div>
        </div>
        ${body}${actions}`;
    panel.style.display = 'block';
}

function equipFromDetail(index) { if (executeEquipItem(index)) closeInvDetail(); }
function usePotionFromDetail(index) { if (useInventoryPotion(index)) closeInvDetail(); }
function salvageFromDetail(index) { salvageEquipmentItem(index); closeInvDetail(); }
function sellFromDetail(index) { if (sellInventoryItem(index)) closeInvDetail(); }

function useOrEquipItem(index) { showItemDetail(index); }

function showEquippedDetail(slot) {
    const item = player.equipped[slot];
    if (!item || !item.name) return;
    const isPotion = slot === 'potionSlot';
    const rarity = RARITY_INFO[item.rarity];
    const title = (item.favorite ? '★ ' : '') + item.name + (item.refineLevel > 0 ? ` +${item.refineLevel}` : '');

    let body = '<div class="char-detail-2x flex flex-col gap-2 text-left text-xs">';
    body += `<div class="flex justify-between items-center">
        <span>${rarity ? reqLevelHTML(item, item.levelReq) : ''}</span>
        <span class="text-[10px] text-slate-400 capitalize">${item.favorite ? '<span class="text-yellow-300 font-bold">★ Favorite</span> · ' : ''}Equipped · ${slot}</span></div>`;
    if (item.desc && !isPotion) body += `<p class="text-[11px] text-slate-400">${item.desc}</p>`;
    if (item.element) body += `<span class="text-[11px]">${elementDetailHTML(item.element)}</span>`;
    if (item.stats && Object.keys(item.stats).length) {
        body += `<div class="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">` +
            Object.entries(item.stats).map(([k, v]) => `<span class="text-slate-200">${formatStatLine(k, v)}</span>`).join('') +
            `</div>`;
    }
    if (!isPotion && slot !== 'pet') {
        body += `<div class="p-2 rounded-lg bg-slate-950/60 border border-purple-500/30 flex flex-col gap-1">
            <span class="text-[10px] font-bold text-purple-300 uppercase">Buffs</span>${buffsDetailHTML(item.buffs, item.debuffs)}</div>`;
    }
    if (item.setName) body += setInfoHTML(item.setName);
    if (isPotion) body += `<span class="text-[11px] text-emerald-300">Restores ${potionHealText(item)} · Qty ${item.qty || 1}</span>`;
    body += '</div>';

    const btn = 'flex-1 py-2 font-bold rounded-xl text-xs transition cursor-pointer';
    let actions = '<div class="flex flex-col gap-2 mt-2"><div class="flex gap-2">';
    if (!isPotion) actions += `<button onclick="unequipFromDetail('${slot}')" class="${btn} bg-red-600/60 hover:bg-red-600 text-red-100">Unequip</button>`;
    actions += '</div>';

    const favBtn = !isPotion && slot !== 'pet'
        ? `<button onclick="toggleEquippedFavorite('${slot}')" class="absolute top-3 left-3 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300 font-bold text-xs">${item.favorite ? '★ Unfavorite' : '☆ Favorite'}</button>`
        : '';
    showModal(title, '', closeCornerHTML() + favBtn + body + actions);
}

function unequipFromDetail(slot) {
    unequipItem(slot);
    if (!player.equipped[slot]) closeModal();
}

function useInventoryPotion(index) {
    const item = player.inventory[index];
    if (!item || item.type !== 'potion') return false;
    const MAX_SLOT = typeof MAX_POTION_SLOT !== 'undefined' ? MAX_POTION_SLOT : 5;

    // A different potion is equipped: return it to the inventory first
    const old = player.equipped.potionSlot;
    if (old && old.name !== item.name && (old.qty || 0) > 0) {
        if (!placeItemInInventory({ ...old, qty: old.qty })) {
            showFloatNotice("Inventory is full! Make room before swapping potions.", "#potion-slot-box");
            return false;
        }
        logMessage(`[Potion] Returned ${old.name} x${old.qty} to inventory`, 'drop');
        player.equipped.potionSlot = { name: "", type: "potion", heal: 0, qty: 0, desc: "" };
    }

    const slot = player.equipped.potionSlot;
    const current = (slot && slot.name === item.name) ? (slot.qty || 0) : 0;
    const space = MAX_SLOT - current;
    if (space <= 0) {
        showFloatNotice("Potion slot is full", "#potion-slot-box");
        return false;
    }
    const moveQty = Math.min(space, item.qty || 1);
    if (slot && slot.name === item.name) {
        slot.qty = current + moveQty;
    } else {
        player.equipped.potionSlot = { ...item, qty: moveQty };
    }
    item.qty = (item.qty || 1) - moveQty;
    if (item.qty <= 0) player.inventory[index] = null;
    updateUI();
    saveGame();
    return true;
}

function getItemBasePrice(item) {
    if (item.price) return item.price;
    const pools = [
        ...(typeof SHOP_ITEMS !== 'undefined' ? SHOP_ITEMS : []),
        ...(typeof GOLD_SHOP_CONSUMABLES !== 'undefined' ? GOLD_SHOP_CONSUMABLES : [])
    ];
    const found = pools.find(p => p.name === item.name);
    if (found) return found.price;
    return Math.max(20, (item.levelReq || 1) * 12); // fallback for drops not in the shop
}

// Sell value = half of the item's shop price (per unit, times quantity for stacks)
function getSellPrice(item) {
    const unit = Math.floor(getItemBasePrice(item) / 2 * (1 + skillBonus('sellPct') / 100));
    return unit * (item.qty || 1);
}

// ---- Confirm dialog helpers ----
// Stats the item carries (base + buffs + debuffs), as plain text for confirm()
function confirmStatText(item) {
    const entries = Object.entries(effectiveStats(item)).filter(([, v]) => v !== 0);
    return entries.length ? entries.map(([k, v]) => formatStatLine(k, v)).join(', ') : 'no stats';
}
function confirmRarityText(item) {
    const r = RARITY_INFO[item.rarity] || RARITY_INFO[1];
    return `R${item.rarity} ${r.name}`;
}
// One line per item for bulk confirms (first 8, then a count of the rest)
function confirmItemList(targets) {
    const shown = targets.slice(0, 8).map(({ it }) => `• ${it.name} (${confirmRarityText(it)}) — ${confirmStatText(it)}`);
    if (targets.length > 8) shown.push(`…and ${targets.length - 8} more`);
    return shown.join('\n');
}

function sellInventoryItem(index) {
    const item = player.inventory[index];
    if (!item) return false;
    if (item.favorite) { showFloatNotice("Favorite items cannot be sold. Unmark it first."); return false; }
    if (item.slot && (item.levelReq || 1) >= 99) { showFloatNotice("Level 99 gear cannot be sold to the shop."); return false; }
    const total = getSellPrice(item);
    const qtyText = (item.qty || 1) > 1 ? ` x${item.qty}` : '';
    const sellMsg = `Sell ${item.name}${qtyText}?\n\nYou get: ${total} Gold\nRarity: ${confirmRarityText(item)} · Lv ${item.levelReq || 1}\nStats lost: ${confirmStatText(item)}\n\nThis cannot be undone.`;
    if (!confirm(sellMsg)) return false;
    player.gold += total;
    player.inventory[index] = null;
    logMessage(`[Shop] Sold ${item.name}${qtyText} for ${total} Gold`, 'drop');
    updateUI();
    saveGame();
    return true;
}

// Two-handed weapons (knuckles, and older saved two-handed swords named "(2H)") take the shield slot
function isTwoHanded(item) {
    return !!(item && item.slot === 'weapon' && (item.twoHanded || /\(2H\)/.test(item.name || '')));
}
function syncHeroSprites() {
    const f = combatPose().IDLE;
    if (!f) return; // still loading
    ['town-hero', 'char-hero'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getAttribute('src') !== f.src) el.src = f.src;
        el.style.width = f.w * HERO_PAGE_SCALE + 'px';
        el.style.height = f.h * HERO_PAGE_SCALE + 'px';
        // The Tailwind base style caps every img at its parent's size: lift the cap so the size stays true
        el.style.maxWidth = 'none';
        el.style.maxHeight = 'none';
        const o = HERO_PAGE_ORIGIN[id];
        el.style.left = (o.left + HERO_PAGE_FEET.x - f.fx * HERO_PAGE_SCALE) + 'px';
        el.style.top = (o.top + HERO_PAGE_FEET.y - f.fy * HERO_PAGE_SCALE) + 'px';
    });
    document.querySelectorAll('img.hero-thumb').forEach(el => { if (el.getAttribute('src') !== f.src) el.src = f.src; });
    ['town-shadow', 'char-shadow'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = '';
        el.style.left = SHADOW_BASE[id].left + 'px';
        el.style.top = SHADOW_BASE[id].top + 'px';
    });
}
function executeEquipItem(index, targetSlot) {
    let item = player.inventory[index];
    if (!item) return false;
    if (player.baseLv < (item.levelReq || 1)) {
        showModal("Cannot Equip", `This gear requires Base Level ${item.levelReq || 1}. Your Base Level is ${player.baseLv}.`);
        return false;
    }
    const slotKey = targetSlot || (item.slot === 'ring' ? (!player.equipped.ringLeft ? 'ringLeft' : (!player.equipped.ringRight ? 'ringRight' : 'ringLeft')) : item.slot);
    // Two-handed weapons take the shield slot: a shield cannot be worn with one, so equipping one moves the shield to the bag
    if (slotKey === 'shield' && isTwoHanded(player.equipped.weapon)) {
        showFloatNotice("A two-handed weapon is equipped. Unequip it first.");
        return false;
    }
    if (slotKey === 'weapon' && isTwoHanded(item) && player.equipped.shield) {
        const free = player.inventory.findIndex((s, i) => s === null && i !== index);
        if (free === -1) {
            showFloatNotice("Inventory is full! Make room for your shield first.");
            return false;
        }
        player.inventory[free] = { ...player.equipped.shield };
        player.equipped.shield = null;
        logMessage(`[Equipment] Shield moved to bag (two-handed weapon)`, 'drop');
    }
    let currentEquipped = player.equipped[slotKey];
    player.equipped[slotKey] = item;
    player.inventory[index] = currentEquipped ? { ...currentEquipped } : null;
    logMessage(`[Equipment] Equipped ${item.name}`, 'drop');
    updateUI();
    saveGame();
    return true;
}

function salvageScrapGain(item) {
    return Math.min(5, Math.max(1, Math.floor((item.levelReq || 1) / 5) + 1));
}

function salvageEquipmentItem(index) {
    let item = player.inventory[index];
    if (!item || !item.slot) return;
    if (item.favorite) { showFloatNotice("Favorite items cannot be salvaged. Unmark it first."); return; }
    let scrapGain = salvageScrapGain(item);
    const salvageMsg = `Salvage ${item.name}?\n\nYou get: ${scrapGain} Iron Scrap\nRarity: ${confirmRarityText(item)} · Lv ${item.levelReq || 1}\nStats lost: ${confirmStatText(item)}\n\nThis cannot be undone.`;
    if (item.rarity >= 3 && !confirm(salvageMsg)) return;

    player.inventory[index] = null;
    if (!addScraps(scrapGain)) {
        player.inventory[index] = item;
        showFloatNotice("Inventory is full! Cannot salvage.");
        return;
    }
    logMessage(`[Salvage] Salvaged ${item.name} for ${scrapGain} Iron Scrap(s)`, 'drop');
    updateUI();
    saveGame();
}

// Bag equipment that Salvage All / Sell All may touch: not favorites, not pets
function bulkEquipTargets() {
    return player.inventory.map((it, i) => ({ it, i })).filter(({ it }) => it && it.slot && it.slot !== 'pet' && !it.favorite);
}

function salvageAllEquipment() {
    const targets = bulkEquipTargets();
    if (targets.length === 0) { showFloatNotice("No equipment to salvage."); return; }
    const gain = targets.reduce((n, { it }) => n + salvageScrapGain(it), 0);
    if (!confirm(`Salvage ${targets.length} equipment item(s)?\n\nYou get: ${gain} Iron Scrap\n\n${confirmItemList(targets)}\n\nFavorites are kept. This cannot be undone.`)) return;
    targets.forEach(({ i }) => { player.inventory[i] = null; });
    if (!addScraps(gain)) {
        targets.forEach(({ it, i }) => { player.inventory[i] = it; });
        showFloatNotice("Inventory is full! Cannot salvage.");
        return;
    }
    logMessage(`[Salvage] Salvaged ${targets.length} item(s) for ${gain} Iron Scrap(s)`, 'drop');
    updateUI();
    saveGame();
}

function sellAllEquipment() {
    const targets = bulkEquipTargets().filter(({ it }) => (it.levelReq || 1) < 99);
    if (targets.length === 0) { showFloatNotice("No equipment to sell."); return; }
    const total = targets.reduce((n, { it }) => n + getSellPrice(it), 0);
    if (!confirm(`Sell ${targets.length} equipment item(s)?\n\nYou get: ${total} Gold\n\n${confirmItemList(targets)}\n\nFavorites and Lv 99 gear are kept. This cannot be undone.`)) return;
    targets.forEach(({ i }) => { player.inventory[i] = null; });
    player.gold += total;
    logMessage(`[Shop] Sold ${targets.length} item(s) for ${total} Gold`, 'drop');
    updateUI();
    saveGame();
}

function manualDrinkPotion() {
    if (currentMode === 'daily') {
        showFloatNotice("Health potions are disabled in the Daily Challenge.");
        return;
    }
    let derived = getDerivedStats();
    let potionSlot = player.equipped.potionSlot;
    if (!potionSlot || (potionSlot.qty || 0) <= 0) {
        showFloatNotice("No potions equipped!", "#potion-slot-box");
        return;
    }
    let healAmt = potionHealAmount(potionSlot, derived.maxHp) || 50;
    potionSlot.qty--;
    if (potionSlot.qty <= 0) player.equipped.potionSlot = { name: "", type: "potion", heal: 0, qty: 0, desc: "" };
    healPlayer(healAmt, 'Potion');
    checkStageClearAfterHeal();
    updateUI();
    saveGame();
}

const STAT_FULL_NAMES = { str: 'STR', agi: 'AGI', vit: 'VIT', int: 'INT', dex: 'DEX', luk: 'LUK' };

// Points are queued with +, then spent together after one confirmation.
let pendingAlloc = { stats: {}, skills: {} };

function pendingStatTotal() { return Object.values(pendingAlloc.stats).reduce((a, b) => a + b, 0); }
function pendingSkillTotal() { return Object.values(pendingAlloc.skills).reduce((a, b) => a + b, 0); }

const SKILL_BUILDS = [
    { key: 'gold', name: 'Freyr (Gold Build)', color: 'text-amber-300', border: 'border-amber-500/40', desc: 'Coins, loot and selling' },
    { key: 'exp', name: 'Odin (EXP Build)', color: 'text-sky-300', border: 'border-sky-500/40', desc: 'Faster Base and Class levels' },
    { key: 'attack', name: 'Thor (Attack Build)', color: 'text-rose-300', border: 'border-rose-500/40', desc: 'Damage and critical hits' },
    { key: 'defense', name: 'Tyr (Defense Build)', color: 'text-emerald-300', border: 'border-emerald-500/40', desc: 'Survive longer' }
];
const SKILL_BUILD_MAX_SP = 30;

// Character overview: the builds you have invested in
function renderCharacterSkills() {
    const root = document.getElementById('skill-tree-container');
    if (!root) return;
    const html = SKILL_BUILDS.map(b => {
        const owned = Object.entries(player.skills).filter(([, s]) => s.build === b.key && s.level > 0);
        const invested = owned.reduce((a, [, s]) => a + s.level, 0);
        if (invested <= 0) return '';
        const lines = owned.map(([, s]) => `<li>${s.name} Lv. ${s.level}/${s.maxLv}: ${s.desc}</li>`).join('');
        return `<div class="p-2 rounded-lg border ${b.border} bg-slate-950/60">
            <div class="flex justify-between text-xs"><span class="font-bold ${b.color}">${b.name}</span><span class="text-slate-400">${invested}/${SKILL_BUILD_MAX_SP} SP</span></div>
            <ul class="text-[10px] text-slate-300 list-disc pl-4 mt-1 flex flex-col gap-0.5">${lines}</ul>
        </div>`;
    }).join('');
    root.innerHTML = html || '<span class="text-[10px] text-slate-500">No skill points invested yet.</span>';
}

// Dedicated Skills page: skill nodes placed on the star map (04_psd/pageskill/skilllayout.png marker positions, map 4000x2233).
// Each build chain runs along its node list; a node needs the one before it (req) at the required level.
const SKILL_MAP = { w: 4000, h: 2233, minS: 0.3, maxS: 1.6 };
// Center hub node: always on (upgraded look), not clickable. Every build chain starts from a node next to it.
const SKILL_HUB = [2003, 1106];
const SKILL_DEFAULT_ZOOM = 1.5;
// Map positions (layout markers, 4000x2233). Each chain runs in order; a node needs the one before it.
const SKILL_NODE_POS = {
    gold:    [[1601, 1116], [1199, 1116], [650, 1116], [374, 1122], [563, 849], [389, 1427]],
    exp:     [[2003, 1428], [2003, 1779], [2237, 1646], [2192, 1899], [2003, 1994], [1823, 1994]],
    attack:  [[2003, 818], [2003, 530], [2222, 416], [2124, 274], [1922, 274], [1807, 327]],
    defense: [[2405, 1106], [2756, 1106], [3200, 1106], [3658, 948], [3769, 1247], [3370, 1358]]
};
const SKILL_NODE_SIZE = { normal: [120, 122], locked: [110, 112] };
let skillView = null;

function skillApplyView() {
    if (!skillView) return;
    const vp = document.getElementById('skill-viewport');
    if (!vp) return;
    const vw = vp.offsetWidth, vh = vp.offsetHeight;
    const sw = SKILL_MAP.w * skillView.s, sh = SKILL_MAP.h * skillView.s;
    skillView.x = sw >= vw ? Math.min(0, Math.max(vw - sw, skillView.x)) : (vw - sw) / 2;
    skillView.y = sh >= vh ? Math.min(0, Math.max(vh - sh, skillView.y)) : (vh - sh) / 2;
    const world = document.getElementById('skill-world');
    if (world) world.style.transform = `translate(${skillView.x}px, ${skillView.y}px) scale(${skillView.s})`;
}

function skillZoomAt(px, py, factor) {
    if (!skillView) return;
    const vp = document.getElementById('skill-viewport');
    // Max zoom out: the background still covers the whole view
    const coverS = vp && vp.offsetWidth ? Math.max(vp.offsetWidth / SKILL_MAP.w, vp.offsetHeight / SKILL_MAP.h) : SKILL_MAP.minS;
    const ns = Math.min(SKILL_MAP.maxS, Math.max(coverS, skillView.s * factor));
    const wx = (px - skillView.x) / skillView.s, wy = (py - skillView.y) / skillView.s;
    skillView.s = ns;
    skillView.x = px - wx * ns;
    skillView.y = py - wy * ns;
    skillApplyView();
}

function skillZoomStep(factor) {
    const vp = document.getElementById('skill-viewport');
    if (!vp || !skillView) return;
    skillZoomAt(vp.offsetWidth / 2, vp.offsetHeight / 2, factor);
}

// Attach pan and zoom once
function skillEnsureView() {
    const vp = document.getElementById('skill-viewport');
    if (!vp || vp.dataset.ready || !vp.offsetWidth) return;
    vp.dataset.ready = '1';
    skillView = { s: 1, x: 0, y: 0, drag: null, suppressClick: false };
    const local = (e) => {
        const r = vp.getBoundingClientRect();
        const k = r.width / vp.offsetWidth || 1;
        return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    };
    vp.addEventListener('wheel', (e) => {
        e.preventDefault();
        const p = local(e);
        skillZoomAt(p.x, p.y, e.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });
    vp.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        const p = local(e);
        skillView.drag = { ox: p.x - skillView.x, oy: p.y - skillView.y, sx: p.x, sy: p.y, moved: false, id: e.pointerId };
    });
    vp.addEventListener('pointermove', (e) => {
        const d = skillView && skillView.drag;
        if (!d) return;
        const p = local(e);
        if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) > 5) {
            d.moved = true;
            vp.classList.add('dragging');
            try { vp.setPointerCapture(d.id); } catch (err) {}
        }
        if (d.moved) {
            skillView.x = p.x - d.ox;
            skillView.y = p.y - d.oy;
            skillApplyView();
        }
    });
    const endDrag = () => {
        const d = skillView && skillView.drag;
        if (!d) return;
        skillView.suppressClick = d.moved;
        skillView.drag = null;
        vp.classList.remove('dragging');
        setTimeout(() => { if (skillView) skillView.suppressClick = false; }, 0);
    };
    vp.addEventListener('pointerup', endDrag);
    vp.addEventListener('pointercancel', endDrag);
}

// Default camera: fill the view, centered on the middle (hub) node
function skillFocusHub() {
    skillCloseDetail();
    const vp = document.getElementById('skill-viewport');
    if (!vp || !skillView || !vp.offsetWidth) return;
    const vw = vp.offsetWidth, vh = vp.offsetHeight;
    const s0 = SKILL_DEFAULT_ZOOM; // close enough to show the hub and about one node each way
    skillView.s = s0;
    skillView.x = vw / 2 - SKILL_HUB[0] * s0;
    skillView.y = vh / 2 - SKILL_HUB[1] * s0;
    skillApplyView();
}

function skillNodeClick(e, skillKey) {
    if (skillView && skillView.suppressClick) return;
    skillOpenDetail(skillKey);
}

// Skill detail panel: slides out from the right; closes when clicking outside it and outside the nodes
let skillDetailKey = null;
function skillOpenDetail(k) {
    skillDetailKey = k;
    renderSkillDetail();
    document.getElementById('skill-detail')?.classList.add('open');
}
function skillCloseDetail() {
    skillDetailKey = null;
    document.getElementById('skill-detail')?.classList.remove('open');
}
document.addEventListener('pointerdown', (e) => {
    if (!skillDetailKey) return;
    const tgt = e.target && e.target.closest ? e.target : null;
    if (tgt && (tgt.closest('#skill-detail') || tgt.closest('.skill-node'))) return;
    skillCloseDetail();
}, true);

function renderSkillDetail() {
    const el = document.getElementById('skill-detail');
    if (!el || !skillDetailKey) return;
    const k = skillDetailKey;
    const s = player.skills[k];
    if (!s) return;
    const build = SKILL_BUILDS.find(b => b.key === s.build);
    const prev = s.req ? player.skills[s.req] : null;
    const prevLevel = prev ? prev.level + (pendingAlloc.skills[s.req] || 0) : 0;
    const locked = !!prev && prevLevel < s.reqLv;
    const lvl = s.level + (pendingAlloc.skills[k] || 0);
    const spLeft = player.jobSp - pendingSkillTotal();
    const canUp = !locked && lvl < s.maxLv && spLeft > 0;
    const reason = locked ? `Requires ${prev.name} Lv. ${s.reqLv}`
        : lvl >= s.maxLv ? 'Max level'
        : spLeft <= 0 ? 'No skill points available' : '';
    el.innerHTML = `
        <div class="flex justify-between items-start gap-3">
            <div>
                <h3 class="text-2xl font-bold mt-1">${s.name}</h3>
            </div>
            <button onclick="skillCloseDetail()" class="px-3 py-1 rounded-lg font-bold cursor-pointer" style="background:#3b2716; color:#fff;">&#10005;</button>
        </div>
        <p class="mt-4 text-lg">${s.desc}</p>
        <div class="mt-5 text-base flex flex-col gap-2">
            <div class="flex justify-between"><span>Level</span><strong>${lvl} / ${s.maxLv}</strong></div>
            <div class="flex justify-between"><span>Requires</span><strong>${prev ? `${prev.name} Lv. ${s.reqLv}` : 'None (start)'}</strong></div>
            <div class="flex justify-between"><span>Skill points left</span><strong>${spLeft}</strong></div>
        </div>
        <button onclick="upgradeSkill('${k}'); renderSkillDetail();" ${canUp ? '' : 'disabled'} class="mt-6 w-full py-3 rounded-xl font-bold text-lg cursor-pointer disabled:opacity-40" style="background:#b45309; color:#fff8e7;">+1 SP</button>
        ${reason ? `<p class="mt-2 text-sm text-center">${reason}</p>` : ''}`;
}

function renderSkillPage() {
    const nodes = document.getElementById('skill-nodes');
    if (!nodes) return;
    const spEl = document.getElementById('skill-page-sp');
    const spLeft = player.jobSp - pendingSkillTotal();
    if (spEl) spEl.innerText = spLeft;

    const mapSlot = document.getElementById('skill-map-slot');
    if (mapSlot && !mapSlot.firstChild) {
        mapSlot.innerHTML = '<img class="skill-map" src="assets/pages/skill/skillmap_q85.webp" alt="">';
    }

    // Node centers per skill key, and lit state of each link (parent -> child)
    const centers = {};
    const links = [];
    let nodesHtml = '';
    const hubLevel = 1; // hub is always on
    SKILL_BUILDS.forEach(b => {
        const chain = Object.entries(player.skills).filter(([, s]) => s.build === b.key);
        const pos = SKILL_NODE_POS[b.key] || [];
        let parentPos = SKILL_HUB;
        let parentOn = hubLevel > 0;
        chain.forEach(([k, s], i) => {
            const p = pos[i];
            if (!p) return;
            const prev = s.req ? player.skills[s.req] : null;
            const prevLevel = prev ? prev.level + (pendingAlloc.skills[s.req] || 0) : 0;
            const locked = !!prev && prevLevel < s.reqLv;
            const lvl = s.level + (pendingAlloc.skills[k] || 0);
            const maxed = lvl >= s.maxLv;
            const clickable = true;
            const isLocked = locked;
            const img = lvl > 0 ? 'assets/pages/skill/skillbuttonup.gif'
                : (isLocked ? 'assets/pages/skill/skillbuttonlock_q85.webp' : 'assets/pages/skill/skillbutton_q85.webp');
            const [w, h] = isLocked ? SKILL_NODE_SIZE.locked : SKILL_NODE_SIZE.normal;
            const title = locked && prev ? `Needs ${prev.name} Lv. ${s.reqLv}` : s.desc;
            centers[k] = p;
            links.push({ a: parentPos, b: p, lit: lvl > 0 && parentOn });
            nodesHtml += `<div class="skill-node ${locked ? 'is-off' : ''}" title="${title}" style="left:${p[0] - w / 2}px; top:${p[1] - h / 2}px; width:${w}px; height:${h}px;" onclick="skillNodeClick(event,'${k}')">
                <img src="${img}" alt="" style="width:${w}px; height:${h}px;">
                <div class="skill-node-label">${s.name}<br>Lv ${lvl}/${s.maxLv}</div>
            </div>`;
            parentPos = p;
            parentOn = lvl > 0;
        });
    });

    // Center hub: upgraded look, not clickable
    const hubHtml = `<div class="skill-node is-hub" style="left:${SKILL_HUB[0] - 60}px; top:${SKILL_HUB[1] - 61}px; width:120px; height:122px;"><img src="assets/pages/skill/skillbuttonup.gif" alt=""></div>`;

    // Light paths between linked nodes; lit when the node at the far end is upgraded
    const lines = links.map(l => `<line x1="${l.a[0]}" y1="${l.a[1]}" x2="${l.b[0]}" y2="${l.b[1]}" class="${l.lit ? 'skill-path-lit' : 'skill-path'}"/>`).join('');
    const svg = `<svg id="skill-paths" width="4000" height="2233" viewBox="0 0 4000 2233"><defs><filter id="skill-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${lines}</svg>`;

    nodes.innerHTML = svg + hubHtml + nodesHtml;
    skillEnsureView();
    skillApplyView();
    renderSkillDetail();
}

const STAT_MAX = 99; // each base stat can be raised up to this
function addStat(statKey) {
    if (player.statPoints - pendingStatTotal() <= 0) return;
    if ((player.stats[statKey] || 0) + (pendingAlloc.stats[statKey] || 0) >= STAT_MAX) return;
    pendingAlloc.stats[statKey] = (pendingAlloc.stats[statKey] || 0) + 1;
    updateUI();
}

function confirmPendingStats() {
    const total = pendingStatTotal();
    if (total <= 0) return;
    const parts = Object.entries(pendingAlloc.stats).filter(([, n]) => n > 0).map(([k, n]) => `${STAT_FULL_NAMES[k]} +${n}`).join(', ');
    confirmAction('Confirm Stat Points', `Spend ${total} stat point${total > 1 ? 's' : ''}: ${parts}?`, () => {
        const t = pendingStatTotal();
        if (t <= 0 || t > player.statPoints) { pendingAlloc.stats = {}; updateUI(); return; }
        for (const k in pendingAlloc.stats) player.stats[k] += pendingAlloc.stats[k];
        player.statPoints -= t;
        markBeginnerFlag('stat');
        pendingAlloc.stats = {};
        updateUI();
        saveGame();
    });
}

function resetPendingStats() { pendingAlloc.stats = {}; updateUI(); }

function upgradeSkill(skillKey) {
    const s = player.skills[skillKey];
    if (!s) return;
    if (s.req) {
        const parent = player.skills[s.req];
        if (parent.level + (pendingAlloc.skills[s.req] || 0) < s.reqLv) {
            showFloatNotice(`Requires ${parent.name} Lv. ${s.reqLv}!`);
            return;
        }
    }
    if (s.level + (pendingAlloc.skills[skillKey] || 0) >= s.maxLv) return;
    if (player.jobSp - pendingSkillTotal() <= 0) return;
    pendingAlloc.skills[skillKey] = (pendingAlloc.skills[skillKey] || 0) + 1;
    updateUI();
}

function confirmPendingSkills() {
    const total = pendingSkillTotal();
    if (total <= 0) return;
    const parts = Object.entries(pendingAlloc.skills).filter(([, n]) => n > 0).map(([k, n]) => `${player.skills[k].name} +${n}`).join(', ');
    confirmAction('Confirm Skill Points', `Spend ${total} SP: ${parts}?`, () => {
        const t = pendingSkillTotal();
        if (t <= 0 || t > player.jobSp) { pendingAlloc.skills = {}; updateUI(); return; }
        for (const k in pendingAlloc.skills) player.skills[k].level += pendingAlloc.skills[k];
        player.jobSp -= t;
        markBeginnerFlag('skill');
        pendingAlloc.skills = {};
        updateUI();
        saveGame();
    });
}

function resetPendingSkills() { pendingAlloc.skills = {}; updateUI(); }

function renderPendingBars() {
    const sBar = document.getElementById('stat-pending-bar');
    if (sBar) {
        const total = pendingStatTotal();
        if (total > 0) {
            const parts = Object.entries(pendingAlloc.stats).filter(([, n]) => n > 0).map(([k, n]) => `${STAT_FULL_NAMES[k]} +${n}`).join(', ');
            sBar.innerHTML = `<div class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 flex flex-col gap-2 text-[10px]">
                <span class="text-amber-200">Pending: ${parts} (${total} pt)</span>
                <div class="flex gap-2">
                    <button onclick="resetPendingStats()" class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg cursor-pointer">Reset</button>
                    <button onclick="confirmPendingStats()" class="flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer">Confirm ${total} pt</button>
                </div></div>`;
        } else {
            sBar.innerHTML = '';
        }
    }
    const kBar = document.getElementById('skill-pending-bar');
    if (kBar) {
        const total = pendingSkillTotal();
        if (total > 0) {
            const parts = Object.entries(pendingAlloc.skills).filter(([, n]) => n > 0).map(([k, n]) => `${player.skills[k].name} +${n}`).join(', ');
            kBar.innerHTML = `<div class="p-2 rounded-lg bg-purple-500/10 border border-purple-500/40 flex flex-col gap-2 text-[10px]">
                <div class="flex gap-2">
                    <button onclick="resetPendingSkills()" class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg cursor-pointer">Reset</button>
                    <button onclick="confirmPendingSkills()" class="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold rounded-lg cursor-pointer">Confirm ${total} SP</button>
                </div></div>`;
        } else {
            kBar.innerHTML = '';
        }
    }
}

function confirmAction(title, message, onConfirm) {
    window.pendingConfirmAction = onConfirm;
    showModal(title, '', `
        <p class="text-xs text-slate-300 mb-4">${message}</p>
        <div class="flex gap-2">
            <button onclick="closeModal()" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition">Cancel</button>
            <button onclick="runConfirmedAction()" class="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition">Confirm</button>
        </div>`);
}

function runConfirmedAction() {
    const fn = window.pendingConfirmAction;
    window.pendingConfirmAction = null;
    closeModal();
    if (fn) fn();
}

// Minimize / expand the player panel in combat (HP bar stays visible)
function toggleCombatPlayerPanel() {
    const body = document.getElementById('combat-player-body');
    const btn = document.getElementById('combat-player-toggle');
    if (!body) return;
    const hidden = body.classList.toggle('hidden');
    if (btn) btn.innerText = hidden ? '▸ Expand' : '▾ Minimize';
}

// Mail & Quests Rendering Functions
// Server mail being claimed right now (not saved: a page reload simply tries again)
const mailClaimBusy = new Set();

async function claimMail(mailId) {
    if (!player.mailBox) return;
    let mail = player.mailBox.find(m => m.id === mailId);
    if (!mail || mail.claimed || mailClaimBusy.has(mailId)) return;
    // Potions need bag room before anything is claimed; the mail stays unclaimed if it does not fit
    const potionRewards = Object.entries(mail.rewards.potions || {}).filter(([, q]) => q > 0);
    for (const [id, q] of potionRewards) {
        const template = GOLD_SHOP_CONSUMABLES.find(i => i.id === id && i.type === 'potion');
        if (template && countFreeCapacity(template) < q) {
            showModal('Inventory Full', 'Make room in your bag to claim this mail.');
            return;
        }
    }
    // Server mail (friend gifts): the server marks it claimed and returns the rewards it stored
    if (mail.serverId) {
        mailClaimBusy.add(mailId);
        const res = await claimServerMail(mail.serverId);
        mailClaimBusy.delete(mailId);
        if (res.error) {
            showModal('Mail Error', res.error + ' The mail is kept.');
            return;
        }
        mail.rewards = res.rewards;
        if (!res.rewards || Object.keys(res.rewards).length === 0) logMessage(`[Mail] "${mail.title}" was already claimed on another device`, 'drop');
    }
    // A gear reward needs a free bag slot; keep the mail unclaimed if the bag is full
    // Build the gear first: if it cannot be made, the mail stays unclaimed
    const gear = mail.rewards.gear ? makeMailGear(mail.rewards.gear.slot, mail.rewards.gear.lv) : null;
    if (mail.rewards.gear && !gear) {
        showModal('Mail Error', 'This gear reward cannot be created. The mail is kept.');
        return;
    }
    const bossHelm = mail.rewards.bossHelm ? makeBossHelmItem(mail.rewards.bossHelm) : null;
    if (mail.rewards.bossHelm && !bossHelm) {
        showModal('Mail Error', 'This boss helm reward cannot be created. The mail is kept.');
        return;
    }
    if ((gear || bossHelm) && Array.isArray(player.inventory) && !player.inventory.some(s => s === null)) {
        showModal('Inventory Full', 'Make room in your bag to claim this mail.');
        return;
    }

    mail.claimed = true;
    if (mail.rewards.gold) player.gold += mail.rewards.gold;
    if (mail.rewards.diamonds) player.diamonds += mail.rewards.diamonds;
    if (mail.rewards.refiningStones) player.refiningStones += mail.rewards.refiningStones;
    if (mail.rewards.resurrection) player.resurrectionPotions = (player.resurrectionPotions || 0) + mail.rewards.resurrection;
    // LV rewards: each level is granted through checkLevelUps (stat points and SP as usual), capped at the max levels
    for (let i = 0; i < (mail.rewards.baseLv || 0) && player.baseLv < MAX_BASE_LV; i++) {
        player.baseExp = player.baseMaxExp;
        checkLevelUps();
    }
    for (let i = 0; i < (mail.rewards.classLv || 0) && player.jobLv < MAX_CLASS_LV; i++) {
        player.jobExp = player.jobMaxExp;
        checkLevelUps();
    }
    if (mail.rewards.baseExp || mail.rewards.classExp) {
        player.baseExp += mail.rewards.baseExp || 0;
        player.jobExp += mail.rewards.classExp || 0;
        checkLevelUps();
    }
    if (gear) addItemToInventory(gear);
    if (bossHelm) addItemToInventory(bossHelm);
    if (mail.rewards.chest) openChest(mail.rewards.chest);
    // Potions (friend gifts, rewards): they stack in the bag like shop potions
    for (const [id, q] of Object.entries(mail.rewards.potions || {})) {
        const template = GOLD_SHOP_CONSUMABLES.find(i => i.id === id && i.type === 'potion');
        if (template && q > 0) addItemToInventory({ ...template, qty: q });
    }

    logMessage(`[Mail] Claimed rewards from "${mail.title}"`, 'drop');
    renderMailBox();
    updateUI();
    saveGame();
}

// The boss helm of a level (the same item a campaign boss drops), rolled at R5 like mail gear. Returns null if the level has none.
function makeBossHelmItem(lv) {
    const template = (HELMET_DROP_POOL[lv] || [])[0];
    return template ? generatePoEItem(template, 5, 1) : null;
}

// Random R5 gear for a mail reward: a drop template of that slot at exactly that level. Returns null if none exists.
function makeMailGear(slot, lv) {
    const cands = [];
    Object.values(GEAR_POOL).forEach(list => list.forEach(i => { if (i.slot === slot && (i.levelReq || 1) === lv) cands.push(i); }));
    if (cands.length === 0) return null;
    const template = cands[Math.floor(Math.random() * cands.length)];
    return generatePoEItem(template, 5);
}

// Short reward summary shown under a mail's message
function mailRewardText(r) {
    const parts = [];
    if (r.gold) parts.push(`${r.gold} Gold`);
    if (r.diamonds) parts.push(`${r.diamonds} Diamonds`);
    if (r.refiningStones) parts.push(`${r.refiningStones} Refining Stones`);
    if (r.resurrection) parts.push(`${r.resurrection} Resurrection Potion`);
    for (const [id, q] of Object.entries(r.potions || {})) {
        if (q > 0) parts.push(`${q} ${(GOLD_SHOP_CONSUMABLES.find(i => i.id === id) || { name: id }).name}`);
    }
    if (r.baseLv) parts.push(`${r.baseLv} Base LV`);
    if (r.classLv) parts.push(`${r.classLv} Class LV`);
    if (r.baseExp) parts.push(`${r.baseExp} Base EXP`); // mails sent before the LV rewards
    if (r.classExp) parts.push(`${r.classExp} Class EXP`);
    if (r.chest) parts.push(`${r.chest[0].toUpperCase() + r.chest.slice(1)} Chest`);
    if (r.gear) parts.push(`${(MAIL_GEAR_SLOTS.find(s => s[0] === r.gear.slot) || [0, r.gear.slot])[1]} Lv ${r.gear.lv} (R5)`);
    if (r.bossHelm) parts.push(`${(HELMET_DROP_POOL[r.bossHelm] || [{ name: 'Boss Helm' }])[0].name} (R5)`);
    return parts.join(', ');
}

// Gear slots that have drop templates (GEAR_POOL), with the levels each slot has
const MAIL_GEAR_SLOTS = [['weapon', 'Weapon'], ['shield', 'Shield'], ['armor', 'Armor'], ['garment', 'Garment'], ['footgear', 'Boots'], ['ring', 'Ring']];
function mailGearLevels(slot) {
    const lv = new Set();
    Object.values(GEAR_POOL).forEach(list => list.forEach(i => { if (i.slot === slot) lv.add(i.levelReq || 1); }));
    return [...lv].sort((a, b) => a - b);
}
// Fills the level dropdown with the levels that exist for the chosen slot
function refreshMailGearLevels() {
    const slot = document.getElementById('mail-gear-slot')?.value;
    const sel = document.getElementById('mail-gear-lv');
    if (!sel) return;
    const levels = slot ? mailGearLevels(slot) : [];
    sel.innerHTML = levels.length ? levels.map(l => `<option value="${l}">Lv ${l}</option>`).join('') : '<option value="">-</option>';
}

// In-game mail sender (for testing): writes a mail into the player's own mailbox
function openSendMailForm() {
    const opt = (v, l) => `<option value="${v}">${l}</option>`;
    const field = 'px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-100 w-full';
    showModal('Send Mail', '', `
        <div class="flex flex-col gap-2 text-left text-sm">
            <label>Title <input id="mail-title" value="Test Mail" class="${field}"></label>
            <label>Sender <input id="mail-sender" value="Game Master" class="${field}"></label>
            <label>Message <textarea id="mail-message" rows="2" class="${field}">A gift for you.</textarea></label>
            <div class="grid grid-cols-3 gap-2">
                <label>Gold <input id="mail-gold" type="number" min="0" value="0" class="${field}"></label>
                <label>Diamonds <input id="mail-diamonds" type="number" min="0" value="0" class="${field}"></label>
                <label>Resurrection <input id="mail-res" type="number" min="0" value="0" class="${field}"></label>
            </div>
            <label>Chest <select id="mail-chest" class="${field}">${opt('', 'None')}${opt('copper', 'Copper')}${opt('silver', 'Silver')}${opt('gold', 'Gold')}</select></label>
            <div class="grid grid-cols-2 gap-2">
                <label>Base LV <input id="mail-base-lv" type="number" min="0" value="0" class="${field}"></label>
                <label>Class LV <input id="mail-class-lv" type="number" min="0" value="0" class="${field}"></label>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <label>Gear (R5) <select id="mail-gear-slot" onchange="refreshMailGearLevels()" class="${field}">${opt('', 'None')}${MAIL_GEAR_SLOTS.map(([v, l]) => opt(v, l)).join('')}</select></label>
                <label>Gear Lv <select id="mail-gear-lv" class="${field}"><option value="">-</option></select></label>
            </div>
            <label>Boss Helm (R5) <select id="mail-boss-helm" class="${field}">${opt('', 'None')}${Object.keys(HELMET_DROP_POOL).map(lv => opt(lv, `Lv ${lv} ${HELMET_DROP_POOL[lv][0].name}`)).join('')}</select></label>
            <button onclick="sendPlayerMail()" class="mt-2 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer">Send to Mailbox</button>
        </div>`);
}

function sendPlayerMail() {
    const val = id => document.getElementById(id)?.value ?? '';
    const num = id => Math.max(0, Math.floor(Number(val(id)) || 0));
    const rewards = {};
    if (num('mail-gold')) rewards.gold = num('mail-gold');
    if (num('mail-diamonds')) rewards.diamonds = num('mail-diamonds');
    if (num('mail-res')) rewards.resurrection = num('mail-res');
    if (val('mail-chest')) rewards.chest = val('mail-chest');
    if (num('mail-base-lv')) rewards.baseLv = num('mail-base-lv');
    if (num('mail-class-lv')) rewards.classLv = num('mail-class-lv');
    if (val('mail-gear-slot') && val('mail-gear-lv')) rewards.gear = { slot: val('mail-gear-slot'), lv: Number(val('mail-gear-lv')) };
    if (val('mail-boss-helm')) rewards.bossHelm = Number(val('mail-boss-helm'));
    if (!player.mailBox || player.mailBox.length === 0) player.mailBox = createWelcomeMail();
    player.mailBox.unshift({
        id: Date.now(),
        title: val('mail-title').trim() || 'Mail',
        sender: val('mail-sender').trim() || 'System',
        message: val('mail-message'),
        rewards,
        claimed: false,
        sentAt: Date.now()
    });
    closeModal();
    logMessage('[Mail] Sent a mail to your mailbox', 'drop');
    renderMailBox();
    updateUI();
    saveGame();
}

// Sent time shown on a mail: sentAt if stored, else the id when it is a timestamp (VIP mails), else blank (welcome mail)
function mailTimeText(m) {
    const t = m.sentAt || (m.id > 1e12 ? m.id : 0);
    if (!t) return '';
    return new Date(t).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Deletes a mail. An unclaimed mail with rewards asks first, so the rewards are not lost by accident.
function deleteMail(mailId) {
    const mail = (player.mailBox || []).find(m => m.id === mailId);
    if (!mail) return;
    // Server mail stays on the server until it is claimed, so deleting it first would bring it back on the next sync
    if (mail.serverId && !mail.claimed) {
        showModal('Mail', 'Claim this gift first, then you can delete it.');
        return;
    }
    const remove = () => {
        player.mailBox = player.mailBox.filter(m => m.id !== mailId);
        renderMailBox();
        updateUI();
        saveGame();
    };
    if (!mail.claimed && mailRewardText(mail.rewards || {})) {
        confirmAction('Delete Mail', 'This mail has rewards you have not claimed. Delete it anyway?', remove);
    } else {
        remove();
    }
}
function renderMailBox() {
    let container = document.getElementById('mailbox-container');
    if (!container) return;
    container.innerHTML = '';

    if (!Array.isArray(player.mailBox)) player.mailBox = createWelcomeMail();
    if (player.mailBox.length === 0) {
        container.innerHTML = '<p class="text-xs text-center" style="color:#3b2716">No mail.</p>';
        return;
    }

    player.mailBox.forEach(m => {
        container.innerHTML += `
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                    <span class="font-bold text-amber-400 block">${m.title}</span>
                    <span class="text-[10px] text-slate-400 block">${m.message}</span>
                    ${mailRewardText(m.rewards || {}) ? `<span class="text-[10px] text-emerald-300 block">Rewards: ${mailRewardText(m.rewards || {})}</span>` : ''}
                    <span class="text-[9px] text-purple-300 block mt-1">From: ${m.sender}</span>
                    ${mailTimeText(m) ? `<span class="text-[9px] text-slate-400 block">${mailTimeText(m)}</span>` : ''}
                </div>
                <div class="flex flex-col gap-1 items-end">
                ${!m.claimed ? `
                    <button onclick="claimMail(${m.id})" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer transition">Claim</button>
                ` : `<span class="text-[10px] text-emerald-400 font-bold">Claimed</span>`}
                <button onclick="deleteMail(${m.id})" class="px-3 py-1 bg-slate-800 hover:bg-red-700 text-slate-200 font-bold rounded-lg cursor-pointer transition text-[10px]">Delete</button>
                </div>
            </div>
        `;
    });
}

function claimQuestMilestone(count) {
    if (player.questMilestoneClaimed[count]) return;
    player.questMilestoneClaimed[count] = true;
    let chestType = count === 1 ? 'copper' : (count === 2 ? 'silver' : 'gold');
    openChest(chestType);
    renderQuestsView();
}

// Chest rewards: a stack of healing potions (count inclusive), then armory gear with a rarity roll per item
const CHEST_REWARDS = {
    copper: { potion: 'potion_minor', potionMin: 3, potionMax: 5, rarities: [2], items: 1 },
    silver: { potion: 'potion_med',   potionMin: 3, potionMax: 5, rarities: [3, 4], items: 1 },
    gold:   { potion: 'potion_large', potionMin: 3, potionMax: 5, rarities: [3, 4, 5], items: 2 }
};

// Reward popups show item icons (gold shows the coin icon and amount)
const REWARD_SLOT_BG = "background-image:url('assets/pages/character/inventoryslot2.png'); background-size:100% 100%;";
function rewardCellHTML(item) {
    return `<div title="${item.name}" class="flex items-center justify-center" style="width:96px;height:92px;${REWARD_SLOT_BG}">${itemIconHTML(item)}</div>`;
}
function rewardPopupHTML(title, cells, extra = '') {
    return `<div class="flex flex-col items-center gap-3 text-center">
        <div class="text-slate-300 text-sm">${title}</div>
        <div class="flex flex-wrap justify-center items-center gap-3">${cells}</div>
        ${extra}
        <button onclick="closeModal()" class="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl">Confirm</button>
    </div>`;
}
function potionCellHTML(item, qty) {
    return `<div title="${item.name}" class="flex items-center justify-center relative" style="width:96px;height:92px;${REWARD_SLOT_BG}">${itemIconHTML(item)}<span class="absolute bottom-1 right-2 text-xs font-bold text-amber-200">x${qty}</span></div>`;
}
function goldCellHTML(amount) {
    return `<div class="flex flex-col items-center gap-1"><img src="assets/icons/goldiconsmall_q85.webp" alt="" style="width:64px;height:64px;object-fit:contain;"><span class="text-amber-300 font-bold text-sm">${amount} Gold</span></div>`;
}

function openChest(chestType) {
    const cfg = CHEST_REWARDS[chestType] || CHEST_REWARDS.copper;
    const potionTemplate = GOLD_SHOP_CONSUMABLES.find(i => i.id === cfg.potion);
    const potionQty = cfg.potionMin + Math.floor(Math.random() * (cfg.potionMax - cfg.potionMin + 1));
    const rewardCells = [];
    if (potionTemplate) {
        addItemToInventory({ ...potionTemplate, qty: potionQty });
        rewardCells.push(potionCellHTML(potionTemplate, potionQty));
    }

    const pool = typeof SHOP_ARMORY_ITEMS !== 'undefined' ? SHOP_ARMORY_ITEMS : [];
    if (pool.length > 0) {
        for (let i = 0; i < cfg.items; i++) {
            const rarity = cfg.rarities[Math.floor(Math.random() * cfg.rarities.length)];
            const template = pool[Math.floor(Math.random() * pool.length)];
            const gear = generatePoEItem(template, rarity, 1);
            addItemToInventory(gear);
            rewardCells.push(rewardCellHTML(gear));
        }
    }

    const showRewards = () => showModal("Chest Opened!", '', rewardPopupHTML('You received:', rewardCells.join('')));
    if (CHEST_OPEN_FRAMES[chestType]) playChestOpen(chestType, showRewards);
    else showRewards();
    updateUI();
    saveGame();
}

// Chest opening animation for copper, silver and gold (total 3.0 s each). Frame 2 holds with a shake; the final frame gets a light burst.
function chestFrames(type) {
    return [
        { src: `assets/chest/${type}/${type}c0_q85.webp`, ms: 500 },
        { src: `assets/chest/${type}/${type}c1_q85.webp`, ms: 1000, shake: true },
        { src: `assets/chest/${type}/${type}c2_q85.webp`, ms: 400 },
        { src: `assets/chest/${type}/${type}c3_q85.webp`, ms: 400 },
        { src: `assets/chest/${type}/${type}c4_q85.webp`, ms: 700, burst: true }
    ];
}
const CHEST_OPEN_FRAMES = { copper: chestFrames('copper'), silver: chestFrames('silver'), gold: chestFrames('gold') };
function playChestOpen(chestType, onDone) {
    const frames = CHEST_OPEN_FRAMES[chestType] || CHEST_OPEN_FRAMES.copper;
    const overlay = document.createElement('div');
    overlay.id = 'chest-open-overlay';
    const img = document.createElement('img');
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    let i = 0;
    const showFrame = () => {
        const f = frames[i];
        img.src = f.src;
        img.classList.toggle('chest-shake', !!f.shake);
        if (f.burst) {
            const burst = document.createElement('div');
            burst.className = 'chest-burst';
            overlay.appendChild(burst);
        }
        setTimeout(() => {
            i++;
            if (i < frames.length) showFrame();
            else {
                overlay.remove();
                if (onDone) onDone();
            }
        }, f.ms);
    };
    showFrame();
}

function renderQuestsView() {
    let container = document.getElementById('quests-container');
    if (!container) return;
    container.innerHTML = '';

    if (!player.dailyQuests || player.dailyQuests.length === 0) {
        player.dailyQuests = [
            { id: 'q_slimes', title: "Slime Exterminator", desc: "Defeat 45 monsters during expeditions.", target: 45, current: 0, rewardChest: "copper", completed: false },
            { id: 'q_crit', title: "Precision Striker", desc: "Land 175 Critical hits in combat.", target: 175, current: 0, rewardChest: "silver", completed: false },
            { id: 'q_gold', title: "Treasure Hunter", desc: "Collect 30,000 Gold from expeditions.", target: 30000, current: 0, rewardChest: "gold", completed: false }
        ];
    }

    let completedCount = player.dailyQuests.filter(q => q.completed).length;

    container.innerHTML = `
        <div class="p-3 bg-slate-950 rounded-xl border border-amber-500/30 mb-3 flex flex-col gap-2">
            <span class="text-xs font-bold text-amber-300">Daily Quest Milestones (${completedCount} / 3 Completed)</span>
            <div class="grid grid-cols-3 gap-2 mt-1">
                <button onclick="claimQuestMilestone(1)" ${completedCount < 1 || player.questMilestoneClaimed[1] ? 'disabled' : ''} class="p-2 bg-slate-900 border border-amber-500/40 rounded text-center text-[10px] cursor-pointer disabled:opacity-50">
                    <span class="block font-bold text-amber-400">1 Quest</span>
                    <img src="assets/chest/copper/coppercsmall_q85.webp" alt="Copper Chest" class="block mx-auto" style="width:90px; height:72px;">
                    ${player.questMilestoneClaimed[1] ? '<span class="text-emerald-400 block">Claimed</span>' : ''}
                </button>
                <button onclick="claimQuestMilestone(2)" ${completedCount < 2 || player.questMilestoneClaimed[2] ? 'disabled' : ''} class="p-2 bg-slate-900 border-slate-500/40 rounded text-center text-[10px] cursor-pointer disabled:opacity-50">
                    <span class="block font-bold text-slate-300">2 Quests</span>
                    <img src="assets/chest/silver/silvercsmall_q85.webp" alt="Silver Chest" class="block mx-auto" style="width:90px; height:72px;">
                    ${player.questMilestoneClaimed[2] ? '<span class="text-emerald-400 block">Claimed</span>' : ''}
                </button>
                <button onclick="claimQuestMilestone(3)" ${completedCount < 3 || player.questMilestoneClaimed[3] ? 'disabled' : ''} class="p-2 bg-slate-900 border-purple-500/40 rounded text-center text-[10px] cursor-pointer disabled:opacity-50">
                    <span class="block font-bold text-purple-300">3 Quests</span>
                    <img src="assets/chest/gold/goldcsmall_q85.webp" alt="Gold Chest" class="block mx-auto" style="width:90px; height:72px;">
                    ${player.questMilestoneClaimed[3] ? '<span class="text-emerald-400 block">Claimed</span>' : ''}
                </button>
            </div>
        </div>
    `;

    player.dailyQuests.forEach(q => {
        let pct = Math.min(100, Math.floor((q.current / q.target) * 100));
        container.innerHTML += `
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-1.5 text-xs">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-200">${q.title}</span>
                    <span class="font-mono text-[10px] ${q.completed ? 'text-emerald-400' : 'text-amber-400'}">${q.current} / ${q.target}</span>
                </div>
                <span class="text-[10px] text-slate-400">${q.desc}</span>
                <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div class="bg-amber-500 h-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    });
}

// ---------- INVENTORY FILTER + ELEMENT STATS ----------
const INVENTORY_FILTERS = [
    { key: 'all', label: 'All' }, { key: 'weapon', label: 'Weapon' }, { key: 'shield', label: 'Shield' },
    { key: 'hat', label: 'Hat' }, { key: 'midHead', label: 'Mid Head' }, { key: 'mouth', label: 'Mouth' },
    { key: 'armor', label: 'Armor' }, { key: 'garment', label: 'Garment' }, { key: 'footgear', label: 'Boots' },
    { key: 'ring', label: 'Ring' }, { key: 'pet', label: 'Pet' }, { key: 'potion', label: 'Potion' }
];
let inventoryFilter = 'all';

function itemMatchesFilter(item) {
    if (inventoryFilter === 'all') return true;
    if (!item) return false;
    if (inventoryFilter === 'potion') return item.type === 'potion';
    return item.slot === inventoryFilter;
}

function setInventoryFilter(key) {
    inventoryFilter = key;
    updateUI();
}

function renderInventoryFilters() {
    const el = document.getElementById('inventory-filter');
    if (!el) return;
    // Built once; later refreshes only update the selected value, so an open dropdown is not reset
    let sel = document.getElementById('inventory-gear-filter');
    if (!sel) {
        sel = document.createElement('select');
        sel.id = 'inventory-gear-filter';
        sel.className = 'px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded cursor-pointer transition border border-slate-700';
        sel.innerHTML = INVENTORY_FILTERS.map(f => `<option value="${f.key}">${f.label}</option>`).join('');
        sel.onchange = () => setInventoryFilter(sel.value);
        el.appendChild(sel);
    }
    if (sel.value !== inventoryFilter) sel.value = inventoryFilter;
}

// Element resistance: positive = takes less damage from that element, negative = weakness
function elementResText(v) {
    const val = Math.round(v || 0);
    const cls = val > 0 ? 'text-emerald-300' : (val < 0 ? 'text-red-300' : 'text-slate-400');
    return { text: `${val > 0 ? '+' : ''}${val}%`, cls };
}

function renderElementStats() {
    const derived = getDerivedStats();
    const res = derived.elemRes || {};
    ELEMENT_KEYS.forEach(k => {
        const r = elementResText(res[k]);
        const combatEl = document.getElementById(`combat-res-${k}`);
        if (combatEl) { combatEl.innerText = r.text; combatEl.className = `font-bold ${r.cls}`; }
    });
    const el = document.getElementById('char-element-stats');
    if (!el) return;
    el.innerHTML = `<h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Element Resistance</h4>` +
        ELEMENT_KEYS.map(k => {
            const e = ELEMENTS[k];
            const r = elementResText(res[k]);
            return `<div class="flex justify-between items-center px-2 py-1.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs"><span class="${e.color}">${e.icon} ${e.name}</span><strong class="font-mono ${r.cls}">${r.text}</strong></div>`;
        }).join('');
}

function updateUI() {
    syncHeroSprites();
    if (typeof updateQuestTabButton === 'function') updateQuestTabButton();
    if (typeof refreshShopAndAlerts === 'function') refreshShopAndAlerts();
    renderInventoryFilters();
    renderElementStats();
    let derived = getDerivedStats();
    player.hp = Math.min(player.hp, derived.maxHp);

    let el = document.getElementById('header-player-name');
    if (el) el.innerText = (player.name || '').slice(0, MAX_NAME_LENGTH);
    el = document.getElementById('combat-player-name');
    if (el) el.innerText = (player.name || '').slice(0, MAX_NAME_LENGTH);
    const vipBadge = document.getElementById('header-vip-badge');
    if (vipBadge) {
        if (isVipActive()) {
            const daysLeft = Math.ceil((player.vipUntil - Date.now()) / (24 * 60 * 60 * 1000));
            vipBadge.innerText = `VIP · ${daysLeft}d`;
            vipBadge.classList.remove('hidden');
        } else {
            vipBadge.innerText = '';
            vipBadge.classList.add('hidden');
        }
    }
    updateAvatarDisplay();

    el = document.getElementById('header-base-lv');
    if (el) el.innerText = player.baseLv;
    el = document.getElementById('header-job-lv');
    if (el) el.innerText = player.jobLv;
    el = document.getElementById('header-gold');
    if (el) el.innerText = `${player.gold} Gold`;
    el = document.getElementById('header-diamonds');
    if (el) el.innerText = player.diamonds;
    el = document.getElementById('town-gold');
    if (el) el.innerText = `${player.gold} Gold`;
    el = document.getElementById('town-diamonds');
    if (el) el.innerText = player.diamonds;

    let baseExpPct = Math.min(100, Math.floor((player.baseExp / player.baseMaxExp) * 100));
    let jobExpPct = Math.min(100, Math.floor((player.jobExp / player.jobMaxExp) * 100));
    
    el = document.getElementById('top-base-exp-text');
    if (el) el.innerText = `${player.baseExp} / ${player.baseMaxExp} (${baseExpPct}%)`;
    el = document.getElementById('top-base-exp-bar');
    if (el) el.style.width = `${baseExpPct}%`;
    el = document.getElementById('top-job-exp-text');
    if (el) el.innerText = `${player.jobExp} / ${player.jobMaxExp} (${jobExpPct}%)`;
    el = document.getElementById('top-job-exp-bar');
    if (el) el.style.width = `${jobExpPct}%`;

    syncCombatInfo();

    let eqContainer = document.getElementById('equipment-slots-container');
    if (eqContainer) {
        // One graphic per slot, no text. Equipped gear shows its own picture (item.img) when it has one.
        const EQUIP_SLOTS = [
            { slot: 'hat', img: 'headslot.png', x: 79, y: 245 },
            { slot: 'midHead', img: 'middleheadslot.png', x: 445, y: 245 },
            { slot: 'mouth', img: 'lowerheadslot.png', x: 79, y: 351 },
            { slot: 'armor', img: 'armorslot.png', x: 445, y: 351 },
            { slot: 'weapon', img: 'weaponslot.png', x: 79, y: 458 },  // right hand (mock: left column)
            { slot: 'shield', img: 'shieldslot.png', x: 445, y: 458 }, // left hand (mock: right column)
            { slot: 'garment', img: 'garmentslot.png', x: 79, y: 565 },
            { slot: 'footgear', img: 'footslot.png', x: 445, y: 565 },
            { slot: 'ringLeft', img: 'ring.png', x: 79, y: 672 },
            { slot: 'ringRight', img: 'ring.png', x: 445, y: 672 },
            { slot: 'pet', img: 'petslot.png', x: 156, y: 779 },
            { slot: 'potionSlot', img: 'potionslot.png', x: 368, y: 779 },
        ];
        // Only these slots show the equipped item's picture: hat, middle head, lower head (mouth), left hand (shield) and right hand (weapon). Other slots keep their default graphic.
        const VISUAL_EQUIP_SLOTS = ['hat', 'midHead', 'mouth', 'shield', 'weapon'];
        const eqSlot = ({ slot, img, x, y }) => {
            const gear = player.equipped[slot];
            const has = !!(gear && gear.name && (slot !== 'potionSlot' || gear.qty > 0));
            const base = `assets/pages/character/slots/${img.replace(/\.png$/, '_q85.webp')}`;
            const useVisual = has && gear.img && VISUAL_EQUIP_SLOTS.includes(slot);
            // Equipped gear sits on the inventory slot frame; empty slots keep their own frame
            const src = useVisual ? gear.img : (has ? 'assets/pages/character/inventoryslot2.png' : base);
            // Equipped gear shows its item icon on top of the slot frame (visual slots keep their own picture)
            const iconLayer = has && !useVisual
                ? `<div style="position:absolute; left:0; top:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; transform:scale(.8); pointer-events:none;">${itemIconHTML(gear)}</div>`
                : '';
            return `<div ${slot === 'potionSlot' ? 'id="potion-slot-box"' : ''} ondragover="eqDragOver(event)" ondrop="eqDrop(event, '${slot}')" ${has ? `onclick="showEquippedDetail('${slot}')"` : ''} class="absolute w-[77px] h-[77px] ${has ? 'cursor-pointer hover:brightness-110' : 'opacity-50'}" style="left:${x}px; top:${y}px;">
                <img src="${src}" alt="" class="w-full h-full" style="object-fit:${has && !useVisual ? 'fill' : 'contain'};" onerror="this.onerror=null;this.src='${base}'">
                ${iconLayer}
                ${slot === 'potionSlot' && has && gear.qty > 1 ? `<span class="absolute bottom-0 right-0.5 text-[10px] font-black leading-tight pointer-events-none" style="color:#fff !important; text-shadow:0 1px 2px #000, 0 0 3px #000;">x${gear.qty}</span>` : ''}
            </div>`;
        };
        eqContainer.innerHTML = EQUIP_SLOTS.map(eqSlot).join('');
    }

    let invGrid = document.getElementById('inventory-grid');
    if (invGrid) {
        invGrid.innerHTML = '';
        if (!Array.isArray(player.inventory)) player.inventory = new Array(BAG_SLOTS).fill(null);
        while (player.inventory.length < BAG_SLOTS) player.inventory.push(null);
        let filledSlots = 0;
        player.inventory.forEach((item, index) => {
            if (item) filledSlots++;
            if (!itemMatchesFilter(item)) return;
            let itemName = item ? item.name : '';
            let refText = item && item.refineLevel > 0 ? ` +${item.refineLevel}` : '';
            let rInfo = item ? RARITY_INFO[item.rarity] : null;
            let rarityColor = rInfo ? `${rInfo.border} ${rInfo.text}` : 'border-slate-700 text-slate-200';
            invGrid.innerHTML += `
                <div onclick="event.stopPropagation(); showItemDetail(${index})" draggable="${item ? 'true' : 'false'}" ondragstart="invDragStart(event, ${index})" ondragover="invDragOver(event)" ondrop="invDrop(event, ${index})" ondragend="invDragEnd()" class="w-[108px] h-[104px] flex flex-col justify-center items-center p-1 text-center cursor-pointer hover:brightness-110 transition relative group ${rInfo ? rInfo.text : 'text-slate-200'}" style="background-image:url('assets/pages/character/inventoryslot2.png'); background-size:100% 100%;">
                    <span class="flex items-center justify-center" style="width:70px;height:70px;">${itemIconHTML(item)}</span>
                    ${isGearItem(item) && item.favorite ? `<span title="Favorite" class="absolute top-0 right-0.5 text-[11px] leading-none px-0.5 text-yellow-300 pointer-events-none">★</span>` : ''}
                    ${item && item.qty > 1 ? `<span class="absolute bottom-1 right-1.5 text-[9px] font-black leading-tight pointer-events-none" style="color:#fff !important; text-shadow:0 1px 2px #000, 0 0 3px #000;">x${item.qty}</span>` : ''}
                </div>
            `;
        });
        // Closed cells after the open bag slots, shown with the grey slot graphic (not usable)
        const INVENTORY_CELLS = BAG_SLOTS; // every cell is an open slot
        for (let i = BAG_SLOTS; i < INVENTORY_CELLS; i++) {
            invGrid.innerHTML += `<div class="w-[77px] h-[79px]" style="width:77px; height:79px; background-image:url('assets/pages/character/inventoryslotgrey_q85.webp'); background-size:100% 100%;"></div>`;
        }
        let invCountEl = document.getElementById('inventory-count');
        if (invCountEl) invCountEl.innerText = `${filledSlots} / ${BAG_SLOTS} slots`;
    }

    el = document.getElementById('stat-points');
    if (el) el.innerText = player.statPoints - pendingStatTotal();
    ['str', 'agi', 'vit', 'int', 'dex', 'luk'].forEach(s => {
        let statEl = document.getElementById(`stat-${s}`);
        const pend = pendingAlloc.stats[s] || 0;
        if (statEl) statEl.innerText = pend ? `${player.stats[s]} (+${pend})` : player.stats[s];
    });
    renderPendingBars();

    const derivedValues = {
        'armor': derived.maxArmor,
        'atk': derived.atk,
        'def': derived.def,
        'hit': derived.hit,
        'flee': derived.flee,
        'crit': `${Math.round(derived.crit * 10) / 10}%`,
        'aspd': derived.aspd,
        'movement-speed': `${derived.movementSpeed} m/s`
    };
    for (const k in derivedValues) {
        ['derived-', 'combat-derived-'].forEach(prefix => {
            const mapEl = document.getElementById(prefix + k);
            if (mapEl) mapEl.innerText = derivedValues[k];
        });
    }

    el = document.getElementById('weight-text');
    el = document.getElementById('sp-count');
    if (el) el.innerText = player.jobSp - pendingSkillTotal();

    renderCharacterSkills();
    renderSkillPage();
    let skillContainer = null;
    if (skillContainer) {
        skillContainer.innerHTML = '';
        for (let [sKey, skillObj] of Object.entries(player.skills)) {
            let isLocked = skillObj.req && (player.skills[skillObj.req].level + (pendingAlloc.skills[skillObj.req] || 0)) < 1;
            skillContainer.innerHTML += `
                <div class="flex justify-between items-center bg-slate-900/40 p-2.5 rounded border ${isLocked ? 'border-slate-800 opacity-50' : 'border-slate-700'}">
                    <div>
                        <h4 class="font-bold text-slate-200 text-xs">${skillObj.name} (Lv. ${skillObj.level + (pendingAlloc.skills[sKey] || 0)}/${skillObj.maxLv})</h4>
                        <p class="text-[10px] text-slate-400">${skillObj.desc} ${isLocked ? `<span class="text-red-400 block">Requires ${player.skills[skillObj.req].name} Lv. 1</span>` : ''}</p>
                    </div>
                    <button onclick="upgradeSkill('${sKey}')" ${isLocked ? 'disabled' : ''} class="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer disabled:opacity-50">+1 SP</button>
                </div>
            `;
        }
    }

    el = document.getElementById('player-hp-text');
    if (el) el.innerText = `${player.hp} / ${derived.maxHp} HP`;
    player._prevHpNum = player.hp;
    const armorNow = Math.max(0, player.armor || 0);
    el = document.getElementById('player-armor-text');
    if (el) el.innerText = `${armorNow} / ${derived.maxArmor}`;
    el = document.getElementById('player-resurrection-state');
    if (el) el.innerText = player.resurrectionOn === false ? 'OFF' : 'ON';
    el = document.getElementById('player-armor-bar');
    if (el) el.style.width = `${derived.maxArmor > 0 ? (armorNow / derived.maxArmor) * 100 : 0}%`;

    // Rune progress: stages left until the next rune pick (combat only)
    const runeWrap = document.getElementById('combat-rune-progress');
    if (runeWrap) {
        const info = (document.getElementById('view-combat') && !document.getElementById('view-combat').classList.contains('hidden') && currentStage >= 1) ? runeProgressInfo() : null;
        runeWrap.style.display = info ? '' : 'none';
        if (info) {
            const t = document.getElementById('combat-rune-progress-text');
            if (t) t.innerText = ''; // countdown text removed (the bar still shows progress)
            const b = document.getElementById('combat-rune-progress-bar');
            if (b) b.style.width = `${info.pct}%`;
        }
    }

    // Character page bars
    el = document.getElementById('char-hp-text');
    if (el) el.innerText = `${player.hp} / ${derived.maxHp} HP`;
    el = document.getElementById('char-hp-bar');
    if (el) el.style.width = `${Math.max(0, Math.min(100, (player.hp / derived.maxHp) * 100))}%`;
    el = document.getElementById('char-armor-text');
    if (el) el.innerText = `${armorNow} / ${derived.maxArmor}`;
    el = document.getElementById('char-armor-bar');
    if (el) el.style.width = `${derived.maxArmor > 0 ? (armorNow / derived.maxArmor) * 100 : 0}%`;
    el = document.getElementById('player-hp-bar');
    if (el) el.style.width = `${(player.hp / derived.maxHp) * 100}%`;

    renderSetBonusPanel();

    el = document.getElementById('player-potions');
    const potionSlot = player.equipped.potionSlot;
    const hasPotion = !!(potionSlot && potionSlot.qty > 0);
    if (el) el.innerText = hasPotion ? `${potionSlot.name} x${potionSlot.qty}` : 'None';
    // Combat slot graphics: no potion shows nopotion.png, resurrection ON shows the pressed elixir graphic
    const potionBtn = document.getElementById('combat-potion-btn');
    if (potionBtn) {
        potionBtn.classList.toggle('no-potion', !hasPotion);
        potionBtn.disabled = !hasPotion; // clicking the empty slot does nothing
    }
    const elixirBtn = document.getElementById('combat-elixir-btn');
    if (elixirBtn) {
        elixirBtn.classList.toggle('on', player.resurrectionOn !== false);
        elixirBtn.classList.toggle('off', player.resurrectionOn === false);
    }
    el = document.getElementById('player-resurrection');
    if (el) el.innerText = `${player.resurrectionPotions || 0} left`;

    el = document.getElementById('combat-rune-list');
    if (el) {
        // One window per rune picked this run (blank windows when empty)
        const runes = player.currentRunRunes || [];
        const windowCount = Math.max(8, runes.length);
        el.innerHTML = Array.from({ length: windowCount }, (_, i) => {
            const r = runes[i];
            if (!r) return '<div class="combat-rune-slot"></div>';
            // Window shows the rune's rarity picture (r1 to r5)
            const rarity = Math.min(5, Math.max(1, RUNE_DEFS[r.id] ? RUNE_DEFS[r.id].rarity : 1));
            return `<div class="combat-rune-slot" onclick="showRuneDetail(${i})"><img src="assets/combat/runes/r${rarity}_q85.webp" alt="" style="width:100%; height:100%; object-fit:contain; pointer-events:none;"></div>`;
        }).join('');
    }

    // Render Monsters Lineup during Combat
    let lineupContainer = document.getElementById('monsters-lineup-container');
    if (lineupContainer && typeof monstersList !== 'undefined') {
        lineupContainer.innerHTML = '';
        let targetIdx = monstersList.findIndex(m => m.hp > 0);
        monstersList.forEach((m, idx) => {
            if (m._prevHp !== undefined && m.hp < m._prevHp) {
                m._hitAt = Date.now();
                m._flashAt = m._hitAt; // red hit flash (CSS) has its own timestamp
                const dmgNum = m._prevHp - m.hp, dmgCrit = !!m.lastHitCrit;
                m.lastHitCrit = false;
                setTimeout(() => showCombatNumber(`#monsters-lineup-container > div:nth-child(${idx + 1}) img`, dmgNum, dmgCrit), 0);
                if (m.hp <= 0) {
                    m._deathAt = Date.now();
                    if (typeof playSound === 'function') playSound('sound/slime_dead.mp3');
                }
            }
            const goneAt = m._deathAt ? Date.now() - m._deathAt >= monsterDeathTotalMs(m) : false;
            if (m._attackAt && Date.now() - m._attackAt < 200) {
                const ago = Date.now() - m._attackAt;
                setTimeout(() => lungeEl(monsterCardImg(m), COMBAT_MONSTER_LUNGE_PX, ago), 0);
            }
            if (m._prevHp !== undefined && m.hp > m._prevHp) {
                const healSel = `#monsters-lineup-container > div:nth-child(${idx + 1}) img`;
                setTimeout(() => { showHealAura(healSel); showHealNumber(healSel, m.hp - m._prevHp); }, 0);
            }
            m._prevHp = m.hp;
            let isDead = m.hp <= 0;
            let isTarget = !isDead && idx === targetIdx;
            let borderColor = isDead ? 'border-slate-800 bg-slate-950/40 opacity-50' : (isTarget ? 'border-amber-500 bg-slate-900/90 shadow-md' : 'border-slate-800 bg-slate-950/40 opacity-70');
            let hpPct = Math.max(0, (m.hp / m.maxHp) * 100);
            let tag = isDead ? '<span class="text-[10px] text-slate-400">(Defeated)</span>' : (isTarget ? '<span class="text-[10px] text-amber-400">(Target)</span>' : '');

            // Card: sprite on top, then the name and HP box below it (no role or element)
            // Position: a fixed lineup slot (boss stages) or the monster's place in the list
            const hasSlot = typeof m.lineupSlot === 'number';
            const posIdx = hasSlot ? m.lineupSlot : idx;
            const p = (combatEarthMonsterPos && combatEarthMonsterPos[posIdx]) || (hasSlot ? LINEUP_DEFAULT_POS[posIdx] : null);
            let cardStyle = goneAt ? 'display:none' : '';
            if (p) cardStyle += `${cardStyle ? '; ' : ''}left:${p[0]}px; top:${p[1]}px`;
            lineupContainer.innerHTML += `
                <div class="flex flex-col items-center gap-1" data-pos="${posIdx}" data-slot="${hasSlot ? 'y' : ''}"${cardStyle ? ` style="${cardStyle}"` : ''}>
                    <div style="height:100px; display:flex; align-items:flex-end; justify-content:center; position:relative;">${miniEmbersHTML(m)}${(() => { const sp = monsterSpriteOf(m); const idle = sp ? sp.idle.join(',') : COMBAT_SLIME_FRAMES; const dead = monsterDeathFrames(m); return `<img class="idle-anim monster-idle ${monsterTintClass(m)}" data-stunned="${m.status && m.status.kind === 'stun' ? '1' : ''}" data-sprite="${m.id}" data-frames="${idle}" data-hit-at="${m._hitAt || 0}" data-flash-at="${m._flashAt || 0}" data-death-at="${m._deathAt || 0}" data-attack-at="${m._attackAt || 0}" data-lunge-at="${m._animAt || 0}" data-attack-frame="${monsterAttackFrame(m)}" data-hurt-frames="${monsterHurtFrames(m).join(',')}" data-death-frames="${dead.join(',')}" data-death-ms="${monsterDeathMs(m)}" data-death-hurt-ms="${monsterDeathHurtMs(m)}" data-death-total="${monsterDeathTotalMs(m)}" data-slow-death="${monsterIsSlowDeath(m) ? 1 : 0}" src="${idle.split(',')[0]}" alt="" style="image-rendering:pixelated; pointer-events:none; position:relative; max-width:none; height:auto; flex-shrink:0; animation-delay:-${((idx * 0.37) % 1.8).toFixed(2)}s;${m._hitAt && Date.now() - m._hitAt < COMBAT_HIT_FLASH_MS ? ' filter:' + COMBAT_HIT_FLASH_FILTER + ';' : ''}">`; })()}${stunFxHTML(m)}</div>
                    <div class="w-[200px] p-2.5 rounded-lg border ${borderColor} flex flex-col gap-1.5 transition-all">
                        <div class="flex justify-between items-center gap-2 text-xs">
                            <span class="font-bold text-red-400 truncate">${m.name}</span>
                            <span class="inline-flex items-center justify-center min-w-[84px] h-6 px-2 rounded-full bg-slate-950/70 border border-slate-700">
                                <span class="font-mono text-[11px] text-slate-100">${Math.max(0, m.hp)} / ${m.maxHp}</span>
                            </span>
                        </div>
                        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                            <div class="bg-red-500 h-full transition-all duration-200" style="width: ${hpPct}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// Battle log: collapse / expand. The button label always shows the action it will do.
function toggleBattleLog(btn) {
    const box = btn.closest('.combat-box');
    if (!box) return;
    const collapsed = box.classList.toggle('minimized');
    btn.textContent = collapsed ? '▸ Expand' : '▾ Minimize';
    if (!collapsed) {
        const log = document.getElementById('combat-activity-log');
        if (log) log.scrollTop = log.scrollHeight;
    }
}

function logMessage(msg, type = 'combat') {
    recordStageLog(msg, type);
    ['town-activity-log', 'combat-activity-log'].forEach(id => {
        const box = document.getElementById(id);
        if (box) {
            const div = document.createElement('div');
            div.innerHTML = msg;
            div.className = type === 'combat' ? "text-red-400" : (type === 'winlose' ? "text-blue-400 font-bold" : (type === 'drop' ? "text-yellow-400 font-bold" : (type === 'levelup' ? "text-purple-400 font-bold" : "text-slate-300")));
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
        }
    });
}

// ---------- EVENTS VIEW ----------
function renderEventsView() {
    const st = getEventState();

    const dEl = document.getElementById('event-daily');
    if (dEl) {
        const can = eventCanPlay('daily');
        const left = Math.max(0, EVENT_LIMIT - st.plays.daily);
        const status = st.dailyCleared ? 'Cleared today: locked until tomorrow' : `${left} / ${EVENT_LIMIT} plays left today`;
        dEl.innerHTML = `
            <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40 uppercase">Daily</span>
                <h3 class="text-sm font-bold text-slate-200 mt-2">Daily Challenge</h3>
                <p class="text-[10px] text-slate-400 mt-1">31 stages with bosses on 11, 21 and 31. Level, skills and gear have no effect. Health potions are disabled and only one resurrection can be used per run.</p>
                <span class="text-[10px] font-mono text-cyan-300 mt-2 block">${status}</span>
            </div>
            <button ${can ? '' : 'disabled'} onclick="startEvent('daily')" class="py-3 font-bold rounded-xl text-xs transition mt-4 ${can ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 cursor-pointer shadow' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}">${can ? 'Start Daily Challenge' : 'Locked'}</button>`;
    }

    ['gold', 'xp'].forEach(kind => {
        const el = document.getElementById(`event-${kind}`);
        if (!el) return;
        const cfg = EVENT_CONFIG[kind];
        const can = eventCanPlay(kind);
        const left = Math.max(0, EVENT_LIMIT - st.plays[kind]);
        const tone = kind === 'gold' ? 'amber' : 'emerald';
        const buttons = EVENT_MAPS[kind].map(m => `
            <button ${can ? '' : 'disabled'} onclick="startEvent('${kind}','${m.mapKey}')" class="p-3 rounded-xl border text-left text-xs transition ${can ? `bg-slate-950 border-slate-700 hover:border-${tone}-400 text-slate-200 cursor-pointer` : 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'}">
                <span class="block font-bold">${m.label}</span>
                <span class="block text-[10px] mt-0.5">${m.sub} · HP & damage x1.5 · ${kind === 'gold' ? 'Gold' : 'EXP'} x2 · No item drops</span>
            </button>`).join('');
        el.innerHTML = `
            <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-${tone}-500/20 text-${tone}-300 rounded border border-${tone}-500/40 uppercase">Event</span>
                <h3 class="text-sm font-bold text-slate-200 mt-2">${cfg.name}</h3>
                <p class="text-[10px] text-slate-400 mt-1">${cfg.desc}</p>
                <span class="text-[10px] font-mono text-${tone}-300 mt-2 block">${left} / ${EVENT_LIMIT} plays left today</span>
            </div>
            <div class="flex flex-col gap-2">${buttons}</div>`;
    });
}


// ---------- FAVORITES ----------
// Gear tier: score = rarity + buff count (1..9). D 1-2, C 3-4, B 5-6, A 7, S 8-9.
function gearTierScore(item) {
    return (item.rarity || 1) + ((item.buffs || []).length);
}
function gearTier(item) {
    const s = gearTierScore(item);
    if (s <= 2) return 'D';
    if (s <= 4) return 'C';
    if (s <= 6) return 'B';
    if (s === 7) return 'A';
    return 'S';
}
function isGearItem(item) {
    return !!(item && item.slot && item.slot !== 'potion' && item.type !== 'chest' && item.type !== 'material');
}

function toggleFavorite(index) {
    const item = player.inventory[index];
    if (!item || !item.slot) return;
    item.favorite = !item.favorite;
    updateUI();
    saveGame();
    showItemDetail(index);
}

function toggleEquippedFavorite(slot) {
    const gear = player.equipped[slot];
    if (!gear || !gear.slot) return;
    gear.favorite = !gear.favorite;
    updateUI();
    saveGame();
    showEquippedDetail(slot);
}


function openChestFromDetail(index) {
    const item = player.inventory[index];
    if (!item || item.type !== 'chest') return;
    closeInvDetail();
    if ((item.qty || 1) > 1) item.qty--;
    else player.inventory[index] = null;
    openChest(item.chestType);
}


// ---------- LIBRARY ----------
function renderLibraryView() {
    renderLibraryRules();
    const runesEl = document.getElementById('library-runes');
    const monstersEl = document.getElementById('library-monsters');
    if (runesEl && typeof RUNE_DEFS !== 'undefined') {
        const runeIds = Object.keys(RUNE_DEFS).sort((a, b) => (RUNE_DEFS[a].rarity - RUNE_DEFS[b].rarity) || RUNE_DEFS[a].name.localeCompare(RUNE_DEFS[b].name));
        runesEl.innerHTML = runeIds.map(id => {
            const r = RUNE_DEFS[id];
            const rar = RARITY_INFO[r.rarity] || RARITY_INFO[1];
            const kind = (r.flag || r.once ? 'One-time per run' : 'Stackable (picks add up)') + (r.disabled ? ' · Not active yet' : '');
            return `<div class="p-3 rounded-xl bg-slate-950 border ${rar.border} flex flex-col gap-1">
                <div class="flex justify-between items-center"><span class="font-bold text-xs ${rar.text}">✨ ${r.name}</span><span class="text-[9px] uppercase ${rar.text}">${rar.name} · R${r.rarity}</span></div>
                <span class="text-[10px] text-slate-300">${r.desc}</span>
                <span class="text-[9px] text-slate-500">${kind}</span></div>`;
        }).join('');
    }
    if (monstersEl && typeof MONSTERS_DATA !== 'undefined' && typeof MONSTER_CURVE !== 'undefined') {
        // Normal monsters (animated pool) and their strength by map level (from the level curve in data/maps.js)
        const roleName = r => r.charAt(0).toUpperCase() + r.slice(1);
        const list = (typeof ANIMATED_POOL !== 'undefined' ? ANIMATED_POOL : []).map(m => {
            const role = curveRoleOf(m);
            const el = m.element && ELEMENTS[m.element] ? `${ELEMENTS[m.element].icon} ${ELEMENTS[m.element].name}` : 'None';
            return `<tr class="border-t border-slate-800 text-slate-200"><td class="py-1.5 pr-2">${m.name}</td><td class="pr-2">${ROLE_ICONS[role] || ''} ${roleName(role)}</td><td>${el}</td></tr>`;
        }).join('');
        const cell = s => `<td class="pr-2 font-mono">${s.maxHp} / ${s.atkMin}-${s.atkMax}</td>`;
        const curveRows = MONSTER_CURVE.map(([L]) => {
            const at = role => levelScaled({ role }, L);
            const boss = typeof makeBoss === 'function' ? makeBoss(curveBoss({}, L)) : curveBoss({}, L);
            return `<tr class="border-t border-slate-800 text-slate-200"><td class="py-1.5 pr-2 font-bold">Lv ${L}</td>${cell(at('melee'))}${cell(at('tank'))}${cell(at('range'))}${cell(at('mage'))}${cell(at('healer'))}<td class="pr-2 font-mono">${at('healer').heal}</td>${cell(boss)}</tr>`;
        }).join('');
        monstersEl.innerHTML = `<div class="overflow-x-auto"><table class="w-full text-[10px] text-left">
            <thead><tr class="text-slate-400 uppercase"><th class="pb-1 pr-2">Name</th><th class="pr-2">Role</th><th>Element</th></tr></thead>
            <tbody>${list}</tbody></table></div>
            <p class="text-[10px] text-slate-400 mt-3 mb-1 font-bold uppercase">Strength by map level (HP / ATK)</p>
            <div class="overflow-x-auto"><table class="w-full text-[10px] text-left">
            <thead><tr class="text-slate-400 uppercase"><th class="pb-1 pr-2">Map</th><th class="pr-2">Melee</th><th class="pr-2">Tank</th><th class="pr-2">Range</th><th class="pr-2">Mage</th><th class="pr-2">Healer</th><th class="pr-2">Heal</th><th>Boss</th></tr></thead>
            <tbody>${curveRows}</tbody></table></div>
            <p class="text-[10px] text-slate-500 mt-2">Every monster on a map has the map's level; its stats come from its role. Tanks have 20% armor. Mini bosses have 3x HP and 1.5x ATK. Campaign monsters take the element of their path. A player within 5 levels of the map can clear it.</p>`;
    }
}

// ---------- LIBRARY: RULES, ELEMENTS, DROPS, CHESTS ----------
// Rune name color follows the rune's rarity
function runeRarityClass(id) {
    const d = RUNE_DEFS[id];
    return d ? (RARITY_INFO[d.rarity] || RARITY_INFO[1]).text : 'text-purple-300';
}

function renderLibraryRules() {
    const el = document.getElementById('library-rules');
    if (!el || typeof ELEMENTS === 'undefined') return;
    const elementRows = ELEMENT_KEYS.map(k => {
        const e = ELEMENTS[k];
        const b = ELEMENTS[e.beats];
        return `<li><span class="${e.color}">${e.icon} ${e.name}</span> beats <span class="${b.color}">${b.icon} ${b.name}</span> (x${ELEMENT_ADVANTAGE} damage). Hitting it with ${b.name} deals x${ELEMENT_DISADVANTAGE}.</li>`;
    }).join('');
    const rarityRows = [1, 2, 3, 4, 5].map(r => {
        const info = RARITY_INFO[r];
        const w = BUFF_COUNT_WEIGHTS[r];
        const total = w.reduce((a, b) => a + b, 0);
        const chances = w.map((x, n) => `${n}: ${Math.round(x / total * 100)}%`).join(' · ');
        return `<li><span class="${info.text} font-bold">${info.name}</span> (Rarity ${r}): ${chances}</li>`;
    }).join('');
    el.innerHTML = `
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Gear Rarity</h3>
            <ul class="list-disc pl-4 text-[10px] text-slate-300 flex flex-col gap-1">${rarityRows}</ul>
            <p class="text-[10px] text-slate-500 mt-2">Chance of each number of bonus stats (0 to 4) an item rolls. Debuffs (element resistance penalties, 0 to 2) are rolled separately and are not counted here.</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Element System</h3>
            <ul class="list-disc pl-4 text-[10px] text-slate-300 flex flex-col gap-1">${elementRows}</ul>
            <p class="text-[10px] text-slate-500 mt-2">Weapons can roll one element. Campaign monsters take the element of their path (Fire, Water, Earth or Wind). Event and daily monsters keep their own base element.</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Monster Status</h3>
            <ul class="list-disc pl-4 text-[10px] text-slate-300 flex flex-col gap-1">
                <li><span class="text-sky-300">Freeze</span>: cannot attack or dodge for 2 seconds, and takes the water element.</li>
                <li><span class="text-lime-300">Rock</span>: cannot attack or dodge for 2 seconds, and takes the earth element.</li>
                <li><span class="text-yellow-400">Stun</span>: cannot attack for 2 seconds (from the Stun Touch, Ranged Stun and Stun Burst runes).</li>
                <li><span class="text-orange-400">Ignite</span> and <span class="text-lime-400">Poison</span>: damage over time while afflicted.</li>
                <li><span class="text-amber-300">Boss</span>: about 25% stronger, uses special skills, enrages in later turns.</li>
                <li><span class="text-amber-200">Mini Boss</span>: appears on stage 7 of campaign and event maps (after the 3rd rune), has 3x HP.</li>
            </ul>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Monster Drop Rates</h3>
            <table class="w-full text-[10px] text-left text-slate-300">
                <tr class="border-b border-slate-800"><td class="py-1">Normal monster</td><td class="font-mono text-right">1%</td></tr>
                <tr class="border-b border-slate-800"><td class="py-1">Mini Boss</td><td class="font-mono text-right">50%</td></tr>
                <tr><td class="py-1">Boss (Champion)</td><td class="font-mono text-right">100%</td></tr>
            </table>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Chests</h3>
            <table class="w-full text-[10px] text-left text-slate-300">
                <tr class="border-b border-slate-800"><td class="py-1">Copper Chest</td><td>3-5 Minor Healing Potion + 1 armory item (Rarity 2)</td></tr>
                <tr class="border-b border-slate-800"><td class="py-1">Silver Chest</td><td>3-5 Medium Healing Potion + 1 armory item (Rarity 3 or 4, 50/50)</td></tr>
                <tr><td class="py-1">Gold Chest</td><td>3-5 Large Healing Potion + 2 armory items (Rarity 3, 4 or 5, equal chance)</td></tr>
            </table>
            <p class="text-[10px] text-slate-500 mt-2">Gold shop: Copper 1000, Silver 4000, Gold 8000 Gold. Diamond shop: Copper 1, Silver 3, Gold 5 Diamond.</p>
        </div>`;
}

// Character page: stats window slides in from the left edge / minimizes to the left tab
function toggleCharStats(open) {
    const view = document.getElementById('view-character');
    if (!view) return;
    view.classList.toggle('stats-hidden', !open);
}
