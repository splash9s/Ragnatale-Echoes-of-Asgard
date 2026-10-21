// ==========================================
// RAGNATALE - PLAYER.JS
// ==========================================

const MAX_POTION_SLOT = 5;

let player = {
    name: "Hero",
    avatar: "⚔️",
    baseLv: 1,
    baseExp: 0,
    baseMaxExp: 50,
    jobLv: 1,
    jobExp: 0,
    jobMaxExp: 40,
    hp: 120,
    gold: 1000,
    diamonds: 1000, 
    statPoints: 5,
    jobSp: 0,
    potions: 3,
    resurrectionPotions: 1, 
    refiningStones: 5, 
    baseMovementSpeed: 3,
    unlockedMaxMapLevel: 1,
    clearedMaps: {},
    stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
    materials: { ironScraps: 0 },
    mailBox: createWelcomeMail(),
    dailyQuests: [
        { id: 'q_porings', title: "Poring Exterminator", desc: "Defeat 15 monsters during expeditions.", target: 15, current: 0, rewardChest: "copper", completed: false },
        { id: 'q_crit', title: "Precision Striker", desc: "Land 25 Critical hits in combat.", target: 25, current: 0, rewardChest: "silver", completed: false },
        { id: 'q_gold', title: "Treasure Hunter", desc: "Collect 2,000 Zeny from expeditions.", target: 2000, current: 0, rewardChest: "gold", completed: false }
    ],
    questMilestoneClaimed: { 1: false, 2: false, 3: false },
    skills: {
        swordsmanship: { name: "Swordsmanship", maxLv: 10, desc: "Increases physical Attack power.", level: 0, req: null },
        ironDefense: { name: "Iron Defense", maxLv: 10, desc: "Increases physical Defense.", level: 0, req: "swordsmanship" },
        vitalStrike: { name: "Vital Strike", maxLv: 10, desc: "Grants critical hit rate and heavy impact.", level: 0, req: "swordsmanship" },
        parry: { name: "Parry Master", maxLv: 10, desc: "Grants chance to completely block enemy attacks.", level: 0, req: "ironDefense" }
    },
    equipped: {
        weapon: { name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, refineLevel: 0, rarity: 1, stats: { atk: 10 }, buffs: [], setName: null, desc: "Atk +10" },
        shield: { name: "Wooden Buckler", slot: "shield", levelReq: 1, refineLevel: 0, rarity: 1, stats: { def: 2, block: 5 }, buffs: [], setName: null, desc: "DEF +2, Block +5%" },
        armor: { name: "Iron Cuirass", slot: "armor", levelReq: 1, refineLevel: 0, rarity: 1, stats: { hp: 50, def: 5 }, buffs: [], setName: null, desc: "HP +50, DEF +5" },
        garment: { name: "Cotton Cloak", slot: "garment", levelReq: 1, refineLevel: 0, rarity: 1, stats: { flee: 2 }, buffs: [], setName: null, desc: "FLEE +2" },
        footgear: { name: "Leather Boots", slot: "footgear", levelReq: 1, refineLevel: 0, rarity: 1, stats: { hp: 20 }, buffs: [], setName: null, desc: "HP +20" },
        pet: null,
        potionSlot: { name: "Minor Healing Potion", type: "potion", heal: 50, qty: 3, desc: "Restores 50 HP" }
    },
    inventory: new Array(40).fill(null),
    runes: { critBonus: 0, maxHpBonus: 0, firstHitBonus: 0, alwaysCritFirst: false, chainAttackCount: 0, randomHitCount: 0, resurrectionUsed: false }
};

// ---------- ELEMENTS ----------
// Fire > Wind > Earth > Water > Fire  (key beats value)
const ELEMENTS = {
    fire:  { name: "Fire",  icon: "🔥",  beats: "wind", color: "text-orange-400" },
    wind:  { name: "Wind",  icon: "🌪️", beats: "earth", color: "text-teal-300" },
    earth: { name: "Earth", icon: "🪨",  beats: "water", color: "text-amber-600" },
    water: { name: "Water", icon: "💧",  beats: "fire", color: "text-sky-400" }
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
    { key: 'crit', name: "Sharpened",  min: 1,  max: 5 },
    { key: 'flee', name: "Agile",      min: 1,  max: 6 },
    { key: 'hit',  name: "Keen",       min: 1,  max: 6 },
    { key: 'aspd', name: "Swift",      min: 1,  max: 4 }
];
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

function rollItemRarity(minRarity = 1) {
    let r = Math.random();
    let base = r < 0.6 ? 1 : r < 0.85 ? 2 : r < 0.95 ? 3 : r < 0.99 ? 4 : 5;
    return Math.max(minRarity, base);
}

function rollBossDropRarity() {
    let r = Math.random();
    return r < 0.6 ? 3 : r < 0.9 ? 4 : 5;
}

// Generates an equipment item with PoE-style rolls:
// - rarity 1..5 (item rarity), 0..4 buffs (weighted by rarity, at least minBuffs)
// - each buff rolls its own tier 1..5 and an independent potency roll
// - weapons have a 40% chance of one element


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
        def.bonuses.forEach(bn => {
            if (counts[setKey] >= bn.pieces) {
                total.active.push({ setKey, setName: def.name, pieces: bn.pieces, desc: bn.desc });
                if (bn.stats) for (const k in bn.stats) total.stats[k] = (total.stats[k] || 0) + bn.stats[k];
                total.goldBonus += bn.goldBonus || 0;
            }
        });
    }
    return total;
}

function createWelcomeMail() {
    return [
        { id: 1, title: "Welcome Adventurer!", sender: "High Council", message: "Welcome to Ragnatale! Test reward: 1 Gold Chest.", rewards: { chest: 'gold' }, claimed: false }
    ];
}

function resetMapRunes() {
    player.runes = { critBonus: 0, maxHpBonus: 0, firstHitBonus: 0, alwaysCritFirst: false, chainAttackCount: 0, randomHitCount: 0, resurrectionUsed: false };
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
        buffs.push({ stat: b.key, value, tier, desc: `${b.name}: +${value} ${b.key.toUpperCase()}` });
    }

    let element = baseTemplate.element || null;
    if (!element && baseTemplate.slot === 'weapon' && Math.random() < 0.4) {
        element = ELEMENT_KEYS[Math.floor(Math.random() * ELEMENT_KEYS.length)];
    }

    return { ...baseTemplate, element, rarity, refineLevel: 0, buffs, qty: 1 };
}

function getDerivedStats() {
    let maxHp = 100 + (player.stats.vit * 15) + (player.baseLv * 10) + player.runes.maxHpBonus;
    let atk = 10 + (player.stats.str * 2) + Math.floor(player.stats.luk / 3) + (player.skills.swordsmanship?.level * 3 || 0);
    let def = 2 + (player.stats.vit * 1) + (player.skills.ironDefense?.level * 2 || 0);
    let hit = 100 + player.baseLv + player.stats.dex;
    let flee = 100 + player.baseLv + player.stats.agi;
    let crit = 1 + Math.floor(player.stats.luk / 3) + player.runes.critBonus + (player.skills.vitalStrike?.level * 1.5 || 0);
    let aspd = 130 + Math.floor(player.stats.agi * 0.8) + Math.floor(player.stats.dex * 0.2);
    let movementSpeed = player.baseMovementSpeed || 3;

    // Equipment: base stats, refine, rolled buffs
    const extra = { atk: 0, def: 0, hp: 0, flee: 0, hit: 0, crit: 0, aspd: 0 };
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
    }

    // Set bonuses
    const setBonus = getSetBonuses();
    for (const k in setBonus.stats) if (k in extra) extra[k] += setBonus.stats[k];

    atk += extra.atk;
    def += extra.def;
    maxHp += extra.hp;
    flee += extra.flee;
    hit += extra.hit;
    crit += extra.crit;
    aspd += extra.aspd;

    let maxWeight = 2000 + (player.stats.str * 30);
    let currentWeight = 120 + ((player.equipped.potionSlot?.qty || 0) * 15) + ((player.resurrectionPotions || 0) * 10) + ((player.refiningStones || 0) * 2);
    for (let item of player.inventory) {
        if (item) currentWeight += 10;
    }

    return { maxHp, atk, def, hit, flee, crit, aspd, movementSpeed, maxWeight, currentWeight, goldMultiplier: 1 + setBonus.goldBonus };
}

function saveGame() {
    try {
        localStorage.setItem('ragnatale_save', JSON.stringify(player));
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
            if (!Array.isArray(player.mailBox) || !player.mailBox.some(m => m.rewards && m.rewards.chest)) {
                player.mailBox = createWelcomeMail();
            }
            if (!player.dailyQuests) player.dailyQuests = [];
            if (!player.questMilestoneClaimed) player.questMilestoneClaimed = { 1: false, 2: false, 3: false };
            if (!player.materials) player.materials = { ironScraps: 0 };
            if (!player.clearedMaps) {
                player.clearedMaps = {};
                if (typeof GAME_DATA !== 'undefined') {
                    Object.entries(GAME_DATA.maps).forEach(([k, m]) => {
                        if (m.levelReq + 10 <= (player.unlockedMaxMapLevel || 1)) player.clearedMaps[k] = true;
                    });
                }
            }
            if (!player.equipped.potionSlot) {
                player.equipped.potionSlot = { name: "Minor Healing Potion", type: "potion", heal: 50, qty: 3, desc: "Restores 50 HP" };
            }
            if (!Array.isArray(player.inventory) || player.inventory.length < 40) {
                let oldInv = Array.isArray(player.inventory) ? player.inventory : [];
                player.inventory = new Array(40).fill(null);
                oldInv.forEach((it, idx) => { if (idx < 40) player.inventory[idx] = it; });
            }
            return true;
        }
    } catch (e) {
        console.error("Failed to load game:", e);
    }
    return false;
}