// ==========================================
// RUNE THREAD - PLAYER.JS
// ==========================================

const MAX_POTION_SLOT = 5;
const ASPD_CAP = 150; // max ASPD (attack interval = 2000 - ASPD x 10 ms, so 150 = 500 ms)
const BAG_MAX_SLOTS = 63;   // the bag grid is 9 x 7 cells at most (the array length)
const BAG_BASE_SLOTS = 45;  // a new bag: 9 x 5
const BAG_EXPAND_STEP = 9;  // each Bag Expansion adds one row of 9
// Open bag slots for this player: base + expansions, never beyond the grid
function bagSlotCount() { return Math.min(BAG_MAX_SLOTS, BAG_BASE_SLOTS + BAG_EXPAND_STEP * ((typeof player !== 'undefined' && player.bagExpansions) || 0)); }

// Daily quest pool. Each day three different types are picked at random; each gets a random tier.
// Easier tiers give a copper chest, harder ones a gold chest.
const DAILY_QUEST_POOL = {
    slimes:   { id: 'q_slimes', title: "Slime Exterminator", tpl: "Defeat {n} monsters during expeditions.", tiers: [{ t: 30, c: 'copper' }, { t: 45, c: 'silver' }, { t: 60, c: 'gold' }] },
    crit:     { id: 'q_crit', title: "Precision Striker", tpl: "Land {n} Critical hits in combat.", tiers: [{ t: 40, c: 'copper' }, { t: 60, c: 'silver' }, { t: 80, c: 'gold' }] },
    gold:     { id: 'q_gold', title: "Treasure Hunter", tpl: "Collect {n} Gold from expeditions.", tiers: [{ t: 5000, c: 'copper' }, { t: 10000, c: 'silver' }, { t: 15000, c: 'gold' }] },
    refine:   { id: 'q_refine', title: "Refiner", tpl: "Refine equipment {n} times.", tiers: [{ t: 5, c: 'copper' }, { t: 10, c: 'silver' }, { t: 15, c: 'gold' }] },
    elemref:  { id: 'q_elemref', title: "Elemental Smith", tpl: "Forge an elemental weapon {n} time.", tiers: [{ t: 1, c: 'silver' }] },
    puzzle:   { id: 'q_puzzle', title: "Puzzle Master", tpl: "Solve {n} pet puzzle.", tiers: [{ t: 1, c: 'silver' }] },
    plank:    { id: 'q_plank', title: "Plank Collector", tpl: "Collect {n} Planks.", tiers: [{ t: 20, c: 'copper' }] },
    alloy:    { id: 'q_alloy', title: "Alloy Smelter", tpl: "Smelt {n} Alloy.", tiers: [{ t: 1, c: 'silver' }] },
    bar:      { id: 'q_bar', title: "Bar Smelter", tpl: "Smelt {n} Bar.", tiers: [{ t: 1, c: 'copper' }] },
    scrap:    { id: 'q_scrap', title: "Scrapper", tpl: "Scrap {n} gear.", tiers: [{ t: 10, c: 'copper' }] },
    potion:   { id: 'q_potion', title: "Potion Buyer", tpl: "Buy {n} potions.", tiers: [{ t: 5, c: 'copper' }] },
    visit:    { id: 'q_visit', title: "Friend Visitor", tpl: "Visit {n} friend tents.", tiers: [{ t: 5, c: 'copper' }] },
    bosslv10: { id: 'q_bosslv10', title: "Boss Hunter Lv. 10", tpl: "Defeat the Lv. 10 boss {n} time.", tiers: [{ t: 1, c: 'gold' }] },
};

// Picks today's three quests: three different types, each at a random tier
function rollDailyQuests() {
    const types = Object.keys(DAILY_QUEST_POOL).sort(() => Math.random() - 0.5).slice(0, 3);
    return types.map(type => {
        const def = DAILY_QUEST_POOL[type];
        const tier = def.tiers[Math.floor(Math.random() * def.tiers.length)];
        return {
            id: def.id, v: 2, title: def.title,
            desc: def.tpl.replace('{n}', tier.t.toLocaleString()),
            target: tier.t, current: 0, rewardChest: tier.c, completed: false,
        };
    });
}

let player = {
    name: "Hero",
    avatar: "assets/avatars/man1_q85.webp",
    baseLv: 1,
    baseExp: 0,
    baseMaxExp: 50,
    jobLv: 1,
    jobExp: 0,
    jobMaxExp: 40,
    hp: 120,
    gold: 0,
    diamonds: 0, diamondsSpent: 0, deathCount: 0, strawHits: 0, 
    statPoints: 5,
    jobSp: 0,
    potions: 3,
    resurrectionPotions: 1, resurrectionOn: true, 
    refiningStones: 5,
    elementStones: { fire: 0, wind: 0, earth: 0, water: 0 },
    baseMovementSpeed: 3,
    unlockedMaxMapLevel: 1,
    clearedMaps: {},
    stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
    materials: { ironScraps: 0 },
    mailBox: createWelcomeMail(),
    dailyQuests: rollDailyQuests(),
    questMilestoneClaimed: { 1: false, 2: false, 3: false },
    dailyFree: {},
    skills: defaultSkills(),
    equipped: {
        weapon: { name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, refineLevel: 0, rarity: 1, stats: { atk: 10 }, buffs: [], setName: null, desc: "Atk +10" },
        hat: null,
        midHead: null,
        mouth: null,
        shield: { name: "Wooden Buckler", slot: "shield", levelReq: 1, refineLevel: 0, rarity: 1, stats: { def: 2 }, buffs: [], setName: null, desc: "DEF +2" },
        armor: { name: "Iron Cuirass", slot: "armor", levelReq: 1, refineLevel: 0, rarity: 1, stats: { hp: 50, def: 5 }, buffs: [], setName: null, desc: "HP +50, DEF +5" },
        garment: { name: "Cotton Cloak", slot: "garment", levelReq: 1, refineLevel: 0, rarity: 1, stats: { flee: 2 }, buffs: [], setName: null, desc: "FLEE +2" },
        footgear: { name: "Leather Boots", slot: "footgear", levelReq: 1, refineLevel: 0, rarity: 1, stats: { hp: 20 }, buffs: [], setName: null, desc: "HP +20" },
        ringLeft: null,
        ringRight: null,
        pet: null,
        potionSlot: { name: "Minor Healing Potion", type: "potion", heal: 50, qty: 3, desc: "Restores 50 HP" }
    },
    inventory: new Array(BAG_MAX_SLOTS).fill(null),
    runes: { critBonus: 0, maxHpBonus: 0, firstHitBonus: 0, alwaysCritFirst: false, chainAttackCount: 0, randomHitCount: 0, resurrectionUsed: false }
};


// ---------- SKILLS: 4 passive builds (Freyr Gold, Odin EXP, Thor Attack, Tyr Defense), 6 skills each, 5 levels per skill ----------
// Each skill unlocks when the one before it reaches reqLv (1, 3, or 5).
function defaultSkills() {
    return {
        coinSense: { name: "Freyr's Gold", build: "gold", desc: "Gold from all kills +1% per level.", effect: "goldPct", perLv: 1, maxLv: 5, level: 0, req: null, reqLv: 0 },
        treasureEye: { name: "Golden Boar Sight", build: "gold", desc: "Gold from boss and mini boss +1% per level.", effect: "bossGoldPct", perLv: 1, maxLv: 5, level: 0, req: "coinSense", reqLv: 1 },
        luckyFind: { name: "Bounty of the Vanir", build: "gold", desc: "Gold from all kills +1% per level.", effect: "goldPct", perLv: 1, maxLv: 5, level: 0, req: "treasureEye", reqLv: 3 },
        hoarder: { name: "Fafnir's Hoard", build: "gold", desc: "Gold from all kills +1% per level.", effect: "goldPct", perLv: 1, maxLv: 5, level: 0, req: "luckyFind", reqLv: 1 },
        scrapper: { name: "Forge of Sindri", build: "gold", desc: "Sell price +5% per level.", effect: "sellPct", perLv: 5, maxLv: 5, level: 0, req: "hoarder", reqLv: 5 },
        midasTouch: { name: "Brisingamen's Touch", build: "gold", desc: "Gold from all kills +2% per level.", effect: "goldPct", perLv: 2, maxLv: 5, level: 0, req: "scrapper", reqLv: 3 },
        studious: { name: "Ravens' Wisdom", build: "exp", desc: "Base EXP +1% per level.", effect: "baseExpPct", perLv: 1, maxLv: 5, level: 0, req: null, reqLv: 0 },
        disciple: { name: "Mimir's Disciple", build: "exp", desc: "Class EXP +1% per level.", effect: "classExpPct", perLv: 1, maxLv: 5, level: 0, req: "studious", reqLv: 3 },
        bossScholar: { name: "Mimir's Lesson", build: "exp", desc: "Boss and mini boss EXP +2% per level.", effect: "bossExpPct", perLv: 2, maxLv: 5, level: 0, req: "disciple", reqLv: 1 },
        focus: { name: "All-Seeing Eye", build: "exp", desc: "Base EXP +2% per level.", effect: "baseExpPct", perLv: 2, maxLv: 5, level: 0, req: "bossScholar", reqLv: 5 },
        quickStudy: { name: "Runic Insight", build: "exp", desc: "Class EXP +2% per level.", effect: "classExpPct", perLv: 2, maxLv: 5, level: 0, req: "focus", reqLv: 3 },
        ascension: { name: "Ascent to Valhalla", build: "exp", desc: "Base and Class EXP +2% per level.", effect: "allExpPct", perLv: 2, maxLv: 5, level: 0, req: "quickStudy", reqLv: 1 },
        sharpEdge: { name: "Mjolnir's Edge", build: "attack", desc: "ATK +1% per level.", effect: "atkPct", perLv: 1, maxLv: 5, level: 0, req: null, reqLv: 0 },
        swiftHands: { name: "Storm Gauntlets", build: "attack", desc: "ASPD +2 per level.", effect: "aspd", perLv: 2, maxLv: 5, level: 0, req: "sharpEdge", reqLv: 1 },
        crushingBlow: { name: "Hammer Blow", build: "attack", desc: "Critical damage +2% per level.", effect: "critDmgPct", perLv: 2, maxLv: 5, level: 0, req: "swiftHands", reqLv: 5 },
        precision: { name: "Thunder Aim", build: "attack", desc: "CRIT rate +2 per level.", effect: "critPct", perLv: 2, maxLv: 5, level: 0, req: "crushingBlow", reqLv: 1 },
        slayerEye: { name: "Giant's Bane", build: "attack", desc: "Damage to boss and mini boss +2% per level.", effect: "bossDmgPct", perLv: 2, maxLv: 5, level: 0, req: "precision", reqLv: 3 },
        executioner: { name: "Ragnarok Strike", build: "attack", desc: "Damage to enemies below 50% HP +2% per level.", effect: "lowHpDmgPct", perLv: 2, maxLv: 5, level: 0, req: "slayerEye", reqLv: 3 },
        ironSkin: { name: "Shieldwall", build: "defense", desc: "Max HP +1% per level.", effect: "hpPct", perLv: 1, maxLv: 5, level: 0, req: null, reqLv: 0 },
        hardened: { name: "Tyr's Resolve", build: "defense", desc: "DEF +1% per level.", effect: "defPct", perLv: 1, maxLv: 5, level: 0, req: "ironSkin", reqLv: 3 },
        evasion: { name: "Valkyrie's Swiftness", build: "defense", desc: "FLEE +1 per level.", effect: "fleePct", perLv: 1, maxLv: 5, level: 0, req: "hardened", reqLv: 1 },
        secondWind: { name: "Breath of Ymir", build: "defense", desc: "Max armor +1% per level.", effect: "armorPct", perLv: 1, maxLv: 5, level: 0, req: "evasion", reqLv: 3 },
        thickHide: { name: "Fenrir's Hide", build: "defense", desc: "Max HP +2% per level.", effect: "hpPct", perLv: 2, maxLv: 5, level: 0, req: "secondWind", reqLv: 5 },
        fortress: { name: "Asgard's Bulwark", build: "defense", desc: "Damage taken -2% per level.", effect: "dmgReducePct", perLv: 2, maxLv: 5, level: 0, req: "thickHide", reqLv: 1 },
    };
}

// Sum of all skill levels x per-level value for one effect (0 in Daily Challenge)
function skillBonus(effect) {
    if (typeof currentMode !== 'undefined' && currentMode === 'daily') return 0;
    let total = 0;
    Object.values(player.skills || {}).forEach(s => { if (s.effect === effect) total += (s.level || 0) * s.perLv; });
    return total;
}

// Keeps levels of skills that still exist; older skills are refunded as SP
function migrateSkills() {
    const defs = defaultSkills();
    const old = player.skills || {};
    let refund = 0;
    Object.keys(old).forEach(k => { if (!defs[k]) refund += old[k].level || 0; });
    Object.keys(defs).forEach(k => { if (old[k]) defs[k].level = Math.min(defs[k].maxLv, old[k].level || 0); });
    player.skills = defs;
    if (refund > 0) player.jobSp = (player.jobSp || 0) + refund;
}

// ---------- ELEMENTS ----------
// Fire > Wind > Earth > Water > Fire  (key beats value)
// Element icons: in-game pictures from graphic/cha/page/elementingame.png (assets/icons/element_*.webp)
const ELEMENT_ICON = (k) => `<img class="el-ico" src="assets/icons/element_${k}_q85.webp" alt="">`;
const ELEMENTS = {
    fire:  { name: "Fire",  icon: ELEMENT_ICON('fire'),  beats: "wind", color: "text-orange-400" },
    wind:  { name: "Wind",  icon: ELEMENT_ICON('wind'),  beats: "earth", color: "text-teal-300" },
    earth: { name: "Earth", icon: ELEMENT_ICON('earth'), beats: "water", color: "text-amber-600" },
    water: { name: "Ice",   icon: ELEMENT_ICON('water'), beats: "fire", color: "text-sky-400" }
};
const ELEMENT_KEYS = Object.keys(ELEMENTS);
const ELEMENT_ADVANTAGE = 1.25;
const ELEMENT_DISADVANTAGE = 0.75;

// ---------- RARITY ----------
const RARITY_INFO = {
    1: { name: "Common",    text: "text-slate-300",   border: "border-slate-600" },
    2: { name: "Uncommon",  text: "text-emerald-300", border: "border-emerald-500" },
    3: { name: "Rare",      text: "text-blue-300",    border: "border-blue-400" },
    4: { name: "Epic",      text: "text-purple-300",  border: "border-purple-400" },
    5: { name: "Legendary", text: "text-amber-300",   border: "border-amber-400" }
};

// ---------- BUFFS ----------
const BUFF_POOL = [
    { key: 'atk',  name: "Fierce",     min: 2,  max: 12 },
    { key: 'def',  name: "Sturdy",     min: 1,  max: 8 },
    { key: 'hp',   name: "Healthy",    min: 15, max: 80 },
    { key: 'crit', name: "Sharpened",  min: 1,  max: 2 },
    { key: 'flee', name: "Agile",      min: 1,  max: 6 },
    { key: 'hit',  name: "Keen",       min: 1,  max: 6 },
    { key: 'aspd', name: "Swift", min: 1, max: 4 },
    { key: 'armor', name: "Guarded", min: 10, max: 60 },
    // Element resistance buffs (the positive side of the element debuffs)
    ...Object.keys(ELEMENTS).map(el => ({ key: 'res_' + el, element: el, name: ELEMENTS[el].name + " Ward", min: 1, max: 5 }))
];
// Debuffs: 0..2 per item, always negative. Each one is an element resistance penalty (e.g. -5% Fire Resistance).
const DEBUFF_POOL = Object.keys(ELEMENTS).map(el => ({ key: 'res_' + el, element: el, name: ELEMENTS[el].name, min: 1, max: 5 }));
// Buff count (0..4) weights per item rarity 1..5
const BUFF_COUNT_WEIGHTS = {
    1: [50, 35, 12, 3, 0],
    2: [30, 40, 22, 7, 1],
    3: [15, 30, 35, 15, 5],
    4: [5, 20, 35, 28, 12],
    5: [0, 10, 30, 35, 25]
};

function weightedPick(weights) {
    let r = Math.random() * 100, acc = 0;
    for (let i = 0; i < weights.length; i++) {
        acc += weights[i];
        if (r < acc) return i;
    }
    return weights.length - 1;
}

// Gear rarity weights R1..R5 by drop source (each row sums to 100)
const NORMAL_RARITY_WEIGHTS = [50, 30, 15, 4, 1];
const MINI_BOSS_RARITY_WEIGHTS = [15, 25, 30, 20, 10];
const BOSS_RARITY_WEIGHTS = [5, 20, 25, 30, 20];
function rollWeightedRarity(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        if (r < weights[i]) return i + 1;
        r -= weights[i];
    }
    return weights.length;
}

function rollItemRarity(minRarity = 1) {
    return Math.max(minRarity, rollWeightedRarity(NORMAL_RARITY_WEIGHTS));
}

function rollMiniBossDropRarity() {
    return rollWeightedRarity(MINI_BOSS_RARITY_WEIGHTS);
}

function rollBossDropRarity() {
    return rollWeightedRarity(BOSS_RARITY_WEIGHTS);
}

// Generates an equipment item with PoE-style rolls:
// - rarity 1..5 (item rarity), 0..4 buffs (weighted by rarity, at least minBuffs)
// - each buff rolls its own tier 1..5 and an independent potency roll
// - weapons no longer roll an element from drops (elements are forged at the Blacksmith's Elemental forge)


// attackEl / defEl: element key or null. Returns damage multiplier.
function getElementMultiplier(attackEl, defEl) {
    if (!attackEl || !defEl || !ELEMENTS[attackEl] || !ELEMENTS[defEl]) return 1;
    if (ELEMENTS[attackEl].beats === defEl) return ELEMENT_ADVANTAGE;
    if (ELEMENTS[defEl].beats === attackEl) return ELEMENT_DISADVANTAGE;
    return 1;
}

// Counts equipped set pieces and sums every bonus that is active
function getSetBonuses() {
    const counts = {};
    for (const slot in player.equipped) {
        const it = player.equipped[slot];
        if (it && it.setName) counts[it.setName] = (counts[it.setName] || 0) + 1;
    }
    const total = { stats: {}, goldBonus: 0, active: [], counts };
    for (const setKey in counts) {
        const def = (typeof SET_DATA !== 'undefined') ? SET_DATA[setKey] : null;
        if (!def) continue;
        // Only the highest reached tier applies; a 4-piece bonus replaces the 2-piece bonus
        let best = null;
        def.bonuses.forEach(bn => { if (counts[setKey] >= bn.pieces) best = bn; });
        if (!best) continue;
        total.active.push({ setKey, setName: def.name, pieces: best.pieces, desc: best.desc });
        if (best.stats) for (const k in best.stats) total.stats[k] = (total.stats[k] || 0) + best.stats[k];
        total.goldBonus += best.goldBonus || 0;
    }
    return total;
}

// Set bonus value for a stat key (flat or percent), used outside derived stats
function setStat(key) {
    return getSetBonuses().stats[key] || 0;
}

// Older saves: add the hat slot, move Beach set to Merchant set, and clear set tags on slots that cannot carry one
function migrateGear() {
    if (!player.equipped) return;
    if (!('hat' in player.equipped)) player.equipped.hat = null;
    if (!('midHead' in player.equipped)) player.equipped.midHead = null;
    if (!('mouth' in player.equipped)) player.equipped.mouth = null;
    const fix = it => {
        if (!it || !it.setName) return;
        if (it.setName === 'beach') it.setName = 'merchant';
        if (!SET_SLOTS.includes(it.slot)) it.setName = null;
    };
    // Forged weapons: rebuild the name so older saves pick up the current name colours
    const refreshForged = it => {
        if (it && it.baseName && it.element && ELEMENTS[it.element] && typeof forgedWeaponName === 'function') it.name = forgedWeaponName(it, it.element);
    };
    for (const k in player.equipped) { fix(player.equipped[k]); refreshForged(player.equipped[k]); }
    if (Array.isArray(player.inventory)) player.inventory.forEach(it => { fix(it); refreshForged(it); });
}

function createWelcomeMail() {
    return [
        { id: 1, title: "Welcome Adventurer!", sender: "High Council", message: "Welcome to Rune Thread! Reward: 100,000 Gold, 1,000 Diamond and 1 day VIP.", rewards: { gold: 100000, diamonds: 1000, vipDays: 1 }, claimed: false }
    ];
}

function defaultRunes() {
    return {
        critBonus: 0, maxHpBonus: 0, firstHitBonus: 0, alwaysCritFirst: false, chainAttackCount: 0,
        randomHitCount: 0, resurrectionUsed: false,
        dodge: 0, swiftRun: 0, focus: 0, thorn: 0, critHeal: 0, lifeline: 0, fortify: 0, evasion: 0,
        vampire: 0, babyVampire: 0, tenfold: false, instantKill: false, divineLight: 0, momentum: 0, armorFirstHit: 0,
        killBlast: 0, elementIgnore: false, bulwark: 0, lastStand: 0, angelOfDeath: false
    };
}

function resetMapRunes() {
    player.runes = defaultRunes();
    if (typeof stasisAtkPct !== 'undefined') stasisAtkPct = 0; // Stasis Rune bonus ends with the map run
}

function generatePoEItem(baseTemplate, forcedRarity = null, minBuffs = 0) {
    const rarity = forcedRarity || rollItemRarity();
    const buffCount = Math.min(4, Math.max(minBuffs, weightedPick(BUFF_COUNT_WEIGHTS[rarity])));

    const shuffled = [...BUFF_POOL].sort(() => 0.5 - Math.random());
    const buffs = [];
    for (let i = 0; i < buffCount; i++) {
        const b = shuffled[i];
        const tier = weightedPick([50, 30, 12, 6, 2]) + 1;
        const roll = Math.floor(b.min + Math.random() * (b.max - b.min + 1));
        const value = Math.max(1, Math.round(roll * (0.8 + 0.1 * tier)));
        const desc = b.element ? `+${value}% ${ELEMENTS[b.element].name} Resistance` : `${b.name}: +${value} ${b.key.toUpperCase()}`;
        buffs.push({ stat: b.key, value, tier, desc });
    }

    const debuffCount = weightedPick([60, 30, 10]); // 0..2
    const dShuffled = [...DEBUFF_POOL].sort(() => 0.5 - Math.random());
    const debuffs = [];
    for (let i = 0; i < debuffCount; i++) {
        const d = dShuffled[i];
        const roll = Math.floor(d.min + Math.random() * (d.max - d.min + 1));
        debuffs.push({ stat: d.key, value: -roll, desc: `-${roll}% ${d.name} Resistance` });
    }

    const element = baseTemplate.element || null;

    return { ...baseTemplate, element, rarity, refineLevel: 0, buffs, debuffs, qty: 1 };
}

// Snapshot of the counters the Max HP runes use, taken at the start of each stage
function maxHpCounts() {
    return {
        vit: runeN('maxHpBonus') / 50,
        fort: runeN('fortitudeStacks'),
        kill: runeN('killCount'),
        runes: (player.currentRunRunes || []).length
    };
}

// Extra Max HP gained in the current stage, as a fraction of the Max HP at the stage start
function stageMaxHpAdd() {
    const st = player.mhpStart;
    if (!st) return 0;
    let add = 0; // Vitality now adds a flat amount (see getDerivedStats), not a % of stage-start Max HP
    add += (runeN('fortitude') / 100) * (runeN('fortitudeStacks') - st.fort);      // Fortitude: per proc
    add += (runeN('bloodlust') / 100) * (runeN('killCount') - st.kill);            // Bloodlust: per kill
    if (runeN('runeScholar') > 0) add += 0.05 * ((player.currentRunRunes || []).length - st.runes); // Scholar: per rune picked
    return add;
}

function getDerivedStats() {
    // Daily Challenge: an empty run. Level, base stats, skills and gear have no effect; runes picked in the run still apply.
    const daily = typeof currentMode !== 'undefined' && currentMode === 'daily';
    const rn = k => player.runes[k] || 0;
    const lvl = daily ? 1 : player.baseLv;
    const ST = daily ? { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 } : player.stats;
    const skl = name => daily ? 0 : (player.skills[name]?.level || 0);

    // Max HP runes (Vitality, Fortitude, Bloodlust, Scholar) add a % of the Max HP at the start of the stage
    const baseMaxHp = 100 + (ST.vit * 15) + (lvl * 10);
    let maxHp = Math.floor(baseMaxHp * (player.mhpCarry || 1) * (1 + stageMaxHpAdd())) + runeN('vitalityFlat');
    let atk = 10 + (ST.str * 2) + Math.floor(ST.luk / 3) + (!daily && player.baseLv === 1 ? 5 : 0); // base level 1: +5 ATK
    let def = 2 + (ST.vit * 1);
    let hit = 100 + lvl + ST.dex;
    let flee = Math.floor(40 * 0.5) + lvl + ST.agi + rn('shadowStep') * rn('killCount');
    let crit = 1 + Math.floor(ST.luk / 3) + rn('critBonus') + rn('glassCannon') + skillBonus('critPct');
    let aspd = Math.floor(130 * 0.6 * 0.7 * 0.7) + Math.floor(ST.agi * 0.8) + Math.floor(ST.dex * 0.2);
    let movementSpeed = (player.baseMovementSpeed || 3);

    const extra = { atk: 0, def: 0, hp: 0, flee: 0, hit: 0, crit: 0, aspd: 0, armor: 0, atkPct: 0, hpPct: 0, defPct: 0, res_fire: 0, res_wind: 0, res_earth: 0, res_water: 0 };
    let goldMultiplier = 1;

    if (!daily) {
        for (let slot in player.equipped) {
            const item = player.equipped[slot];
            if (!item) continue;
            const refBonus = item.refineLevel || 0;
            if (item.stats) {
                for (const k in item.stats) if (k in extra) extra[k] += item.stats[k];
                if (item.stats.atk) extra.atk += refBonus * 3;
                if (item.stats.def) extra.def += refBonus;
                if (item.stats.hp) extra.hp += refBonus * 10;
            }
            (item.buffs || []).forEach(b => { if (b.stat in extra) extra[b.stat] += b.value; });
            (item.debuffs || []).forEach(d => { if (d.stat in extra) extra[d.stat] += d.value; });
        }
        const setBonus = getSetBonuses();
        for (const k in setBonus.stats) if (k in extra) extra[k] += setBonus.stats[k];
        goldMultiplier = 1 + setBonus.goldBonus;
    }

    atk += extra.atk;
    extra.atkPct += skillBonus('atkPct');
    extra.atkPct += (typeof stasisAtkPct === 'number' ? stasisAtkPct : 0); // Stasis Rune: +15% ATK per stage, for the whole map
    atk = Math.floor(atk * (1 + extra.atkPct / 100));
    // Mastery Rune: +20% ATK for each rune you own, live (shown on the character page and used by every hit)
    if (runeN('runeMastery') > 0) atk = Math.floor(atk * (1 + 0.2 * (player.currentRunRunes || []).length));
    def = Math.floor(def * (1 + (skillBonus('defPct') + extra.defPct) / 100));
    def += extra.def;
    maxHp = Math.floor(maxHp * (1 + (skillBonus('hpPct') + extra.hpPct) / 100));
    maxHp += extra.hp;
    flee += skillBonus('fleePct') + extra.flee + rn('dodge');
    hit += extra.hit;
    crit += extra.crit;
    aspd += skillBonus('aspd') + extra.aspd;
    aspd = Math.min(ASPD_CAP, aspd); // ASPD cap: 150 = one attack every 0.5 s
    // Armor comes only from items (default 0)
    const maxArmor = Math.max(0, Math.floor(extra.armor * (1 + skillBonus('armorPct') / 100)));


    // Timed boss debuffs (ATK, HIT, FLEE) lower the values used in combat and shown in the stats
    if (typeof playerDebuffPct === 'function') {
        atk = Math.floor(atk * (1 - playerDebuffPct('atk') / 100));
        hit = Math.floor(hit * (1 - playerDebuffPct('hit') / 100));
        flee = Math.floor(flee * (1 - playerDebuffPct('flee') / 100));
    }
    const elemRes = { fire: extra.res_fire, wind: extra.res_wind, earth: extra.res_earth, water: extra.res_water };
    const finalMaxArmor = rn('glassCannon') > 0 ? 0 : maxArmor;
    if (player.runes.zeroArmor && finalMaxArmor === 0) flee += 10;
    const matk = 10 + (ST.int * 2); // magic attack: WIS (the int stat) x2, as STR x2 gives ATK
    return { maxHp, maxArmor: finalMaxArmor, atk, matk, def, hit, flee, crit, aspd, movementSpeed, goldMultiplier, elemRes };
}

// True while a friend's tent is open (js/friends.js sets window.friendVisit). Defined here because player.js loads first.
function friendTentVisiting() { return !!window.friendVisit; }
function saveGame() {
    if (friendTentVisiting()) return; // a friend's tent is open: `player` is their copy, so never write it to this save
    try {
        localStorage.setItem('ragnatale_save', JSON.stringify(player));
        localStorage.setItem('ragnatale_save_at', String(Date.now()));
        if (typeof cloudSaveSoon === 'function') cloudSaveSoon();
    } catch (e) {
        console.error("Failed to save game:", e);
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem('ragnatale_save');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            player = Object.assign(player, parsed);
            migrateSkills();
            migrateGear();
            if (typeof baseExpNeed === 'function') player.baseMaxExp = baseExpNeed(player.baseLv || 1);
            if (typeof jobExpNeed === 'function') player.jobMaxExp = jobExpNeed(player.jobLv || 1);
            if (!Array.isArray(player.mailBox)) {
                player.mailBox = createWelcomeMail();
            }
            if (!player.dailyQuests) player.dailyQuests = [];
            // Quests from before the daily pool (no v: 2 marker): roll a fresh set once
            if (!player.dailyQuests.length || !player.dailyQuests.every(q => q.v === 2)) {
                player.dailyQuests = rollDailyQuests();
                player.dailyQuestsDate = null;
            }
            if (!player.questMilestoneClaimed) player.questMilestoneClaimed = { 1: false, 2: false, 3: false };
            if (typeof ensureDailyQuestsToday === 'function') ensureDailyQuestsToday();
            if (!player.materials) player.materials = { ironScraps: 0 };
            player.elementStones = { fire: 0, wind: 0, earth: 0, water: 0, ...(player.elementStones || {}) };
            if (!player.beginnerQuest) player.beginnerQuest = { index: 0, flags: {} };
            if (!player.guide) player.guide = { lowHp: false, death: false };
            player.runes = { ...defaultRunes(), ...(player.runes || {}) };
            if (!player.clearedMaps) {
                player.clearedMaps = {};
                if (typeof GAME_DATA !== 'undefined') {
                    Object.entries(GAME_DATA.maps).forEach(([k, m]) => {
                        if (m.levelReq + 10 <= (player.unlockedMaxMapLevel || 1)) Object.keys(GAME_DATA.paths || {}).forEach(pk => { player.clearedMaps[`${pk}:${k}`] = true; });
                    });
                }
            }
            if (!('ringLeft' in player.equipped)) player.equipped.ringLeft = null;
            if (!('ringRight' in player.equipped)) player.equipped.ringRight = null;
            if (!player.equipped.potionSlot) {
                player.equipped.potionSlot = { name: "Minor Healing Potion", type: "potion", heal: 50, qty: 3, desc: "Restores 50 HP" };
            }
            // The bag has bagSlotCount() open slots. Items in slots past that move to the mailbox, so nothing is lost.
            // The stash was removed: any old stash items move into free open bag slots.
            const oldBag = Array.isArray(player.inventory) ? player.inventory : [];
            const oldStash = Array.isArray(player.stash) ? player.stash : [];
            const openSlots = bagSlotCount();
            player.inventory = new Array(BAG_MAX_SLOTS).fill(null);
            const overflow = [];
            oldBag.forEach((it, i) => { if (!it) return; if (i < openSlots) player.inventory[i] = it; else overflow.push(it); });
            oldStash.filter(Boolean).forEach(it => {
                const idx = player.inventory.slice(0, openSlots).findIndex(s => s === null);
                if (idx !== -1) player.inventory[idx] = it;
                else overflow.push(it);
            });
            if (overflow.length) {
                if (!Array.isArray(player.mailBox)) player.mailBox = [];
                player.mailBox.unshift({ id: Date.now(), title: "Bag Overflow", sender: "Bag Office", message: `Your bag now has ${openSlots} slots. Items that did not fit were sent here.`, rewards: { items: overflow }, claimed: false, sentAt: Date.now() });
            }
            delete player.stash;
            // Old saves kept scraps as a counter: move them into the bag as stacks
            if (player.materials && player.materials.ironScraps > 0 && typeof addScraps === 'function') {
                let left = player.materials.ironScraps;
                while (left > 0 && addScraps(Math.min(left, 50))) left -= Math.min(left, 50);
                player.materials.ironScraps = left;
            }
            // Refine materials used to be counters: move them into the bag as stacks
            if (player.refineOres && typeof placeItemInInventory === 'function') {
                [1, 2, 3].forEach(t => { let n = player.refineOres[t] || 0; while (n > 0) { const k = Math.min(n, 99); placeItemInInventory({ ...REFINE_MATERIAL_ITEMS[t], qty: k }); n -= k; } });
                delete player.refineOres;
            }
            if (typeof normalizeInventoryStacks === 'function') normalizeInventoryStacks();
            if (typeof grantVipDailyMail === 'function') grantVipDailyMail();
            return true;
        }
    } catch (e) {
        console.error("Failed to load game:", e);
    }
    return false;
}