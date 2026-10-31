// ==========================================
// RAGNATALE - COMBAT.JS
// ==========================================

let currentMode = 'campaign';
let activeMap = null;
let currentStage = 1;
let maxStages = 11;
let combatInterval = null;
let combatSessionId = 0; // changes whenever the player leaves combat; stale timers check it and stop
let combatPaused = false;
let runeRefreshLeft = 0;
const RUNE_REFRESH_MAX = 3;
let stageSummary = null;
let lastHitBy = null;
let monstersList = [];
let isFirstHitOfBattle = true;
// Monsters start their first attack of a map this long after the player's first attack
const COMBAT_OPENER_MONSTER_DELAY_MS = 500;
const COMBAT_MONSTER_STAGGER_MS = 150; // each monster further back in the lineup starts its attack animation this much later
let monsterOpenerRound = false; // true from entering a map until the first monster turn ends
let battlePlayerHits = 0;
let battleFirstDamageTaken = false;
let stageRuneUses = { fullHeal: 0, fullArmor: 0 };
let attackCount = 0;
let critStreak = 0;
let dodgeStreak = 0;
let monsterHitStreak = 0;
let stageClearing = false;
let currentEvent = null; // 'gold' | 'xp' while in an event
let currentPath = null; // campaign path key while in campaign

// Skills have no effect in the Daily Challenge
function skillLvl(name) {
    if (currentMode === 'daily') return 0;
    return player.skills[name]?.level || 0;
}

const DAILY_TOTAL_STAGES = 31;
const DAILY_BOSS_STAGES = [11, 21, 31];
const BOSS_HP_MULT = 2.5; // 2x the old 1.25
const BOSS_ATK_MULT = 2.4; // 2x the old 1.2

// Helper to play audio effects safely
function playSound(path) {
    try {
        const audio = new Audio(path);
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Audio play prevented:", e));
    } catch (err) {
        console.log("Audio error:", err);
    }
}

function runeN(key) {
    return (player.runes && player.runes[key]) || 0;
}

// ---------- MAP PROGRESSION ----------
// Maps are ordered by level. Each map unlocks only after the previous one is cleared.
function getMapOrder() {
    if (typeof GAME_DATA === 'undefined') return [];
    return typeof CAMPAIGN_MAP_KEYS !== 'undefined' ? [...CAMPAIGN_MAP_KEYS] : [];
}

function getPrereqMapKey(key) {
    const order = getMapOrder();
    const idx = order.indexOf(key);
    return idx > 0 ? order[idx - 1] : null;
}

// key = "path:map". Map 1 of every path is open. Other maps unlock after the previous map of that path is cleared.
function isMapUnlocked(key) {
    const [pk, mk] = String(key).split(':');
    if (!GAME_DATA.paths || !GAME_DATA.paths[pk]) return false;
    const order = getMapOrder();
    const idx = order.indexOf(mk);
    if (idx === -1) return false;
    if (idx === 0) return true;
    return !!(player.clearedMaps && player.clearedMaps[`${pk}:${order[idx - 1]}`]);
}

// ---------- RUNES ----------
// rarity 1..5 changes how often a rune is offered. flag = one-time rune.
const RUNE_RARITY_WEIGHT = { 1: 33, 2: 27, 3: 20, 4: 13, 5: 7 };

const RUNE_DEFS = {
    critBonus: { name: "Berserk Rune", rarity: 1, add: 10, desc: "+10% Critical Rate", text: v => `+${v}% Critical Rate` },
    dodge: { name: "Dodge Rune", rarity: 1, add: 10, desc: "+10 FLEE (raises dodge chance)", text: v => `+${v} FLEE (raises dodge chance)` },
    zeroArmor: { name: "Zero Armor Rune", rarity: 2, flag: true, desc: "No armor equipped: +10 FLEE. Armor equipped: incoming damage reduced 10%", text: () => "No armor: +10 FLEE | With armor: incoming damage -10%" },
    swiftRun: { name: "Swift Feet Rune", rarity: 1, add: 10, desc: "Stage walk time reduced to 1 second", text: () => "Stage walk time reduced to 1 second" },
    focus: { name: "Focus Rune", rarity: 1, add: 10, desc: "Missed attacks restore 10% HP", text: v => `Missed attacks restore ${v}% HP` },
    maxHpBonus: { name: "Vitality Rune", rarity: 3, add: 50, desc: "+50% Max HP", text: v => `+${v}% Max HP` },
    firstHitBonus: { name: "Stunning Strike Rune", rarity: 2, add: 50, desc: "+50% Bonus Damage on First Hit", text: v => `+${v}% Bonus Damage on First Hit` },
    randomHitCount: { name: "Chaos Rune", rarity: 2, add: 1, once: true, desc: "Attacks have a 50% chance to strike random targets", text: () => "Attacks have a 50% chance to strike random targets" },
    thorn: { name: "Thorn Rune", rarity: 1, add: 10, desc: "Reflect 10% of melee damage taken", text: v => `Reflect ${v}% of melee damage taken` },
    critHeal: { name: "Critical Heal Rune", rarity: 2, add: 5, desc: "Critical hits restore 5% HP", text: v => `Critical hits restore ${v}% HP` },
    lifeline: { name: "Lifeline Rune", rarity: 4, add: 20, once: true, desc: "First damage each battle restores 20% max HP", text: v => `First damage each battle restores ${v}% max HP` },
    fortify: { name: "Fortify Rune", rarity: 2, add: 5, once: true, desc: "Every 3rd attack restores 5% armor", text: v => `Every 3rd attack restores ${v}% armor` },
    evasion: { name: "Evasion Rune", rarity: 2, add: 5, desc: "Dodging restores 5% HP", text: v => `Dodging restores ${v}% HP` },
    alwaysCritFirst: { name: "Assassination Rune", rarity: 3, flag: true, desc: "First hit of every battle is always a Critical Hit", text: () => "First hit of every battle is always a Critical Hit" },
    vampire: { name: "Vampire Rune", rarity: 4, add: 20, desc: "Heal 20% of damage dealt", text: v => `Heal ${v}% of damage dealt` },
    divineLight: { name: "Divine Light Rune", rarity: 3, add: 100, once: true, desc: "Every 3rd attack deals +100% ATK bonus damage", text: v => `Every 3rd attack deals +${v}% ATK bonus damage` },
    momentum: { name: "Momentum Rune", rarity: 3, add: 10, once: true, desc: "3 critical hits in a row restore 10% HP", text: v => `3 critical hits in a row restore ${v}% HP` },
    retribution: { name: "Retribution Rune", rarity: 3, add: 5, once: true, desc: "Healing deals 5% of heal damage to a random monster", text: v => `Healing deals ${v}% of heal damage to a random monster` },
    killBlast: { name: "Shockwave Rune", rarity: 4, add: 20, once: true, desc: "Killing an enemy deals 20% ATK to all other enemies", text: v => `Killing an enemy deals ${v}% ATK to all other enemies` },
    elementIgnore: { name: "Void Rune", rarity: 5, flag: true, desc: "Ignore monster elements", text: () => "Ignore monster elements" },
    bulwark: { name: "Bulwark Rune", rarity: 3, add: 1, desc: "Instantly fully restore armor when picked", text: v => `Instantly fully restore armor when picked (x${v})`, onApply: () => { player.armor = getDerivedStats().maxArmor; } },
    lastStand: { name: "Last Stand Rune", rarity: 3, add: 1, desc: "Instantly fully restore HP when picked", text: v => `Instantly fully restore HP when picked (x${v})`, onApply: () => { player.hp = getDerivedStats().maxHp; } },
    angelOfDeath: { name: "Angel of Death Rune", rarity: 5, flag: true, desc: "Once per run, when you die, restore full HP", text: () => "Once per run: revive at full HP" },
    hawkEye: { name: "Hawk Eye Rune", rarity: 2, add: 1, once: true, desc: "Attacks never miss", text: () => "Attacks never miss" },
    ironGuard: { name: "Iron Guard Rune", rarity: 2, add: 5, once: true, desc: "Critical hits restore 5% armor", text: v => `Critical hits restore ${v}% armor` },
    overflow: { name: "Overflow Rune", rarity: 2, add: 100, once: true, desc: "The part of a heal above full HP deals that amount as damage to a random monster", text: () => "The part of a heal above full HP deals that amount as damage to a random monster" },
    relentless: { name: "Relentless Rune", rarity: 5, flag: true, desc: "Every attack is a Critical Hit", text: () => "Every attack is a Critical Hit" },
    bloodlust: { name: "Bloodlust Rune", rarity: 2, add: 10, once: true, desc: "Every kill increases max HP by 10", text: v => `Every kill increases max HP by ${v}` },
    shadowStep: { name: "Shadow Step Rune", rarity: 4, add: 0.5, once: true, desc: "Every kill increases FLEE by 0.5", text: v => `Every kill increases FLEE by ${v}` },
    reaper: { name: "Reaper Rune", rarity: 2, add: 10, once: true, desc: "Killing an enemy restores 10% HP", text: v => `Killing an enemy restores ${v}% HP` },
    fortitude: { name: "Fortitude Rune", rarity: 2, add: 1, once: true, desc: "Critical hits have a 20% chance to increase max HP by 1%", text: v => `Critical hits have a 20% chance to increase max HP by ${v}%` },
    glassCannon: { name: "Glass Cannon Rune", rarity: 2, add: 20, once: true, desc: "Max armor becomes 0, +20% Critical Rate", text: v => `Max armor becomes 0, +${v}% Critical Rate` },
    runeScholar: { name: "Scholar Rune", rarity: 1, flag: true, desc: "+5% max HP for each owned rune", text: () => "+5% max HP for each owned rune" },
    runeMastery: { name: "Mastery Rune", rarity: 3, flag: true, desc: "+20% damage for each owned rune", text: () => "+20% damage for each owned rune" },
    powerSurge: { name: "Power Surge Rune", rarity: 3, add: 50, once: true, desc: "Damage +50%", text: v => `Damage +${v}%` },
    giantSlayer: { name: "Giant Slayer Rune", rarity: 3, add: 25, once: true, desc: "Damage to boss and mini boss +25%", text: v => `Damage to boss and mini boss +${v}%` },
    monsterHunter: { name: "Monster Hunter Rune", rarity: 2, add: 50, once: true, desc: "Damage to normal monsters +50%", text: v => `Damage to normal monsters +${v}%` },
    ironFortress: { name: "Iron Fortress Rune", rarity: 5, flag: true, desc: "While armor is above 0, damage +200%", text: () => "While armor is above 0, damage +200%" },
    patientStrike: { name: "Patient Strike Rune", rarity: 1, flag: true, desc: "After a miss, your next attack deals 300% more damage", text: () => "After a miss, your next attack deals 300% more damage" },
    twinEvasion: { name: "Twin Evasion Rune", rarity: 1, add: 5, once: true, desc: "Dodging twice in a row restores 5% HP", text: v => `Dodging twice in a row restores ${v}% HP` },
    tripleDodge: { name: "Triple Dodge Rune", rarity: 5, flag: true, desc: "Dodging 3 times in a row fully heals you", text: () => "Dodging 3 times in a row fully heals you" },
    lastResort: { name: "Last Resort Rune", rarity: 1, flag: true, desc: "Taking 10 hits in a row fully heals you", text: () => "Taking 10 hits in a row fully heals you" },
    counterStrike: { name: "Counter Strike Rune", rarity: 2, add: 125, once: true, desc: "Dodging deals 125% ATK damage to the attacker", text: v => `Dodging deals ${v}% ATK damage to the attacker` },
    evasiveGuard: { name: "Evasive Guard Rune", rarity: 1, add: 10, once: true, desc: "Dodging restores 10% armor", text: v => `Dodging restores ${v}% armor` },
    shieldRecovery: { name: "Shield Recovery Rune", rarity: 1, add: 20, once: true, desc: "Missing restores 20% armor", text: v => `Missing restores ${v}% armor` },
    riposte: { name: "Riposte Rune", rarity: 1, flag: true, desc: "Your next attack after a dodge is always a Critical Hit", text: () => "Your next attack after a dodge is always a Critical Hit" },
    surgeFocus: { name: "Surge Focus Rune", rarity: 4, add: 40, once: true, desc: "After a critical hit, your next attack gets +40% Critical Rate", text: v => `After a critical hit, your next attack gets +${v}% Critical Rate` },
    fireBolt: { name: "Fire Bolt Rune", rarity: 1, add: 10, desc: "Hits have a chance to fire a bolt 4 times in a row, 50% ATK each", text: v => `${v}% chance on hit to fire a bolt 4 times in a row, 50% ATK each` },
    coldBolt: { name: "Cold Bolt Rune", rarity: 1, add: 10, desc: "Hits have a chance to fire a cold bolt 4 times in a row, 50% ATK each", text: v => `${v}% chance on hit to fire a cold bolt 4 times in a row, 50% ATK each` },
    thunderBolt: { name: "Thunder Bolt Rune", rarity: 1, add: 10, desc: "Hits have a chance to call a thunder bolt 4 times in a row, 50% ATK each", text: v => `${v}% chance on hit to call a thunder bolt 4 times in a row, 50% ATK each` },
    rockBolt: { name: "Rock Bolt Rune", rarity: 1, add: 10, desc: "Hits have a chance to call a rock bolt 4 times in a row, 50% ATK each", text: v => `${v}% chance on hit to call a rock bolt 4 times in a row, 50% ATK each` },
    archerFriendlyFire: { name: "Friendly Fire Rune", rarity: 2, add: 50, once: true, disabled: true, desc: "Archers have a 50% chance to hit allies in front", text: () => "Archers have a 50% chance to hit allies in front" },
    autoPotion: { name: "Auto Potion Rune", rarity: 1, flag: true, disabled: true, desc: "Automatically drinks a health potion below 25% HP", text: () => "Automatically drinks a health potion below 25% HP" },
    potionDamage: { name: "Alchemist's Fury Rune", rarity: 2, add: 50, once: true, disabled: true, desc: "Using a potion gives +50% damage for 5 seconds", text: () => "Using a potion gives +50% damage for 5 seconds" },
    potionStun: { name: "Stun Brew Rune", rarity: 2, flag: true, disabled: true, desc: "Using a potion stuns the nearest enemy for 5 seconds", text: () => "Using a potion stuns the nearest enemy for 5 seconds" },
    killStun: { name: "Stun Burst Rune", rarity: 3, flag: true, desc: "Killing an enemy stuns all enemies for 2 seconds", text: () => "Killing an enemy stuns all enemies for 2 seconds" },
    freezeTouch: { name: "Freeze Touch Rune", rarity: 1, flag: true, desc: "Hits have a 10% chance to freeze the enemy for 2 seconds (it cannot attack or dodge, and becomes water element)", text: () => "Hits have a 10% chance to freeze the enemy for 2 seconds (it cannot attack or dodge, and becomes water element)" },
    rockCurse: { name: "Rock Curse Rune", rarity: 1, flag: true, desc: "Hits have a 10% chance to turn the enemy to rock for 2 seconds (it cannot attack or dodge, and becomes earth element)", text: () => "Hits have a 10% chance to turn the enemy to rock for 2 seconds (it cannot attack or dodge, and becomes earth element)" },
    splash: { name: "Splash Rune", rarity: 3, flag: true, desc: "Hits have a 20% chance to deal 20% damage to the enemy behind", text: () => "Hits have a 20% chance to deal 20% damage to the enemy behind" },
    stunTouch: { name: "Stun Touch Rune", rarity: 1, flag: true, desc: "Hits have a 10% chance to stun the enemy for 2 seconds (it cannot attack)", text: () => "Hits have a 10% chance to stun the enemy for 2 seconds (it cannot attack)" },
    rangeStun: { name: "Ranged Stun Rune", rarity: 2, flag: true, desc: "Hits have a 20% chance to stun a random ranged, mage or healer enemy for 2 seconds", text: () => "Hits have a 20% chance to stun a random ranged, mage or healer enemy for 2 seconds" },
    critSplash: { name: "Critical Splash Rune", rarity: 2, flag: true, desc: "Critical hits deal 20% of their damage to a random enemy", text: () => "Critical hits deal 20% of their damage to a random enemy" },
    chainStrike: { name: "Chain Strike Rune", rarity: 2, add: 1, disabled: true, desc: "First attack also hits the next enemy", text: () => "First attack also hits the next enemy" },
    sharedDamage: { name: "Shared Pain Rune", rarity: 3, flag: true, desc: "Each attack splits damage among all enemies", text: () => "Each attack splits damage among all enemies" },
    phantomVeil: { name: "Phantom Veil Rune", rarity: 2, flag: true, disabled: true, desc: "Always dodge the first attack from an enemy", text: () => "Always dodge the first attack from an enemy" }
};

function getRuneOwnedCount(id) {
    return (player.currentRunRunes || []).filter(r => r.id === id).length;
}

function isRuneOffered(id) {
    const def = RUNE_DEFS[id];
    if (!def) return false;
    if (def.disabled) return false;
    if (def.flag || def.once) return getRuneOwnedCount(id) === 0;
    return true;
}

function applyRune(id) {
    const def = RUNE_DEFS[id];
    if (def.flag) player.runes[id] = true;
    else player.runes[id] = (player.runes[id] || 0) + def.add;
    if (stageSummary) {
        stageSummary.runes.push({ rarity: def.rarity, text: `${def.name}: ${typeof def.text === 'function' ? def.text(def.add) : def.desc}` });
    }
    if (def.onApply) def.onApply();
}

// Weighted pick of n runes (no duplicates) from the pool, weighted by rune rarity
function pickWeightedRunes(pool, n) {
    const chosen = [];
    const rest = [...pool];
    while (chosen.length < n && rest.length > 0) {
        const total = rest.reduce((s, id) => s + RUNE_RARITY_WEIGHT[RUNE_DEFS[id].rarity], 0);
        let r = Math.random() * total;
        let idx = 0;
        for (; idx < rest.length; idx++) {
            r -= RUNE_RARITY_WEIGHT[RUNE_DEFS[rest[idx]].rarity];
            if (r < 0) break;
        }
        if (idx >= rest.length) idx = rest.length - 1;
        chosen.push(rest.splice(idx, 1)[0]);
    }
    return chosen;
}

function checkRuneSelectionPrompt(onCompleteCallback) {
    const pool = Object.keys(RUNE_DEFS).filter(isRuneOffered);
    if (pool.length === 0) {
        if (onCompleteCallback) onCompleteCallback();
        return;
    }
    window.runeCallback = onCompleteCallback;
    showRuneChoices(true);
}

// Shows three random runes. Each map allows 3 refreshes of the offer.
// Each offered rune is one tier higher than the rolled one, when a rune of that tier is available
function upgradeRuneChoice(id, pool, taken) {
    const r = RUNE_DEFS[id].rarity;
    if (r >= 5) return id;
    const cands = pool.filter(x => RUNE_DEFS[x].rarity === r + 1 && !taken.includes(x));
    if (cands.length === 0) return id;
    return cands[Math.floor(Math.random() * cands.length)];
}

function showRuneChoices(isNew) {
    const pool = Object.keys(RUNE_DEFS).filter(isRuneOffered);
    const choices = pickWeightedRunes(pool, 3).reduce((acc, id) => { acc.push(upgradeRuneChoice(id, pool, acc)); return acc; }, []);
    let html = `<div class="flex flex-col gap-2">`;
    choices.forEach(id => {
        const r = RUNE_DEFS[id];
        const rar = RARITY_INFO[r.rarity] || RARITY_INFO[1];
        const n = getRuneOwnedCount(id);
        const owned = (!r.flag && n > 0) ? ` <span class="text-amber-400 font-bold">(owned x${n})</span>` : '';
        html += `
            <button onclick="selectRuneChoice('${id}', window.runeCallback)" class="p-3 bg-slate-950 hover:bg-slate-800 border ${rar.border} rounded-xl text-left transition cursor-pointer flex flex-col gap-1">
                <span class="font-bold ${rar.text} text-xs">✨ ${r.name}${owned}</span>
                <span class="text-[9px] uppercase tracking-wider ${rar.text}">${rar.name} · Rarity ${r.rarity}</span>
                <span class="text-[10px] text-slate-300">${r.desc}</span>
            </button>`;
    });
    const canRefresh = runeRefreshLeft > 0;
    html += `</div><button onclick="refreshRuneChoices()" ${canRefresh ? '' : 'disabled'} class="mt-3 w-full py-2 border border-slate-700 rounded-xl text-xs font-bold ${canRefresh ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer' : 'bg-slate-900 text-slate-600 cursor-not-allowed'} transition">↻ Refresh ${runeRefreshLeft}/${RUNE_REFRESH_MAX}</button>`;
    if (isNew) {
        showModal("Rune Blessing", "", html);
    } else {
        const area = document.getElementById('modal-content-area');
        if (area) area.innerHTML = html;
    }
}

function refreshRuneChoices() {
    if (runeRefreshLeft <= 0) return;
    runeRefreshLeft--;
    showRuneChoices(false);
}

function selectRuneChoice(runeId, callback) {
    if (!isRuneOffered(runeId)) return;
    const def = RUNE_DEFS[runeId];
    applyRune(runeId);
    if (!player.currentRunRunes) player.currentRunRunes = [];
    player.currentRunRunes.push({ id: runeId, name: def.name, desc: def.desc });
    logMessage(`[Rune Blessing] Acquired ${def.name}: ${def.desc}`, 'levelup');

    closeModal();
    updateUI();
    saveGame();
    if (callback) callback();
}

// ---------- EXPEDITION SETUP ----------
function startExpedition(mode, opts = {}) {
    if (mode === 'campaign' && opts.final && !isFinalMapUnlocked()) {
        showModal("World-Eater", "Locked.");
        return;
    }
    if (mode === 'campaign' && !opts.final) {
        const selectEl = document.getElementById('campaign-map-select');
        const mapKey = selectEl ? selectEl.value : 'fire:map1';
        const [cpk, cmk] = mapKey.split(':');
        const mapObj = (typeof GAME_DATA !== 'undefined' && GAME_DATA.paths && GAME_DATA.paths[cpk]) ? GAME_DATA.paths[cpk].maps[cmk] : null;
        if (!mapObj) {
            showModal("Map Error", "Map data is not loaded. Check that monsters.js and maps.js are included in index.html.");
            return;
        }
        if (!isMapUnlocked(mapKey)) {
            showModal("Map Locked", "Clear the previous map first to unlock this expedition!");
            return;
        }
    }
    if ((mode === 'daily' || mode === 'event') && typeof GAME_DATA === 'undefined') {
        showModal("Map Error", "Map data is not loaded. Check that monsters.js and maps.js are included in index.html.");
        return;
    }

    resetMapRunes();
    player.currentRunRunes = [];
    player.angelUsedThisRun = false;
    currentMode = mode;
    currentEvent = mode === 'event' ? opts.kind : null;
    currentPath = null;
    attackCount = 0;
    stageClearing = false;
    const derived = getDerivedStats();
    player.hp = derived.maxHp;
    player.armor = derived.maxArmor;

    const nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    const tagEl = document.getElementById('node-mode-tag');
    const titleEl = document.getElementById('node-title');

    if (mode === 'campaign' && opts.final) {
        currentPath = 'final';
        activeMap = GAME_DATA.maps.finalMap;
        currentStage = 1;
        maxStages = activeMap.campaignStages;
        if (tagEl) tagEl.innerText = "Final Map";
        if (titleEl) titleEl.innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages}`;
        logMessage(`[Expedition] Entering ${activeMap.title}. The World-Eater awaits.`, 'winlose');
    } else if (mode === 'campaign') {
        const [cpk2, cmk2] = document.getElementById('campaign-map-select').value.split(':');
        currentPath = cpk2;
        activeMap = GAME_DATA.paths[cpk2].maps[cmk2];
        currentStage = 1;
        maxStages = activeMap.maxStages || 11;
        if (tagEl) tagEl.innerText = "Campaign Mode";
        if (titleEl) titleEl.innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages}`;
        logMessage(`[Expedition] Entering ${activeMap.title} (Campaign)...`, 'winlose');
    } else if (mode === 'event') {
        const cfg = EVENT_CONFIG[opts.kind];
        activeMap = buildEventMap(opts.kind, opts.mapKey);
        currentStage = 1;
        maxStages = activeMap.maxStages;
        if (tagEl) tagEl.innerText = cfg.name;
        if (titleEl) titleEl.innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages}`;
        logMessage(`[Event] ${cfg.name}: entering ${activeMap.title}.`, 'winlose');
    } else if (mode === 'daily') {
        activeMap = { title: "Daily Challenge", dropKey: 'map1', maxStages: DAILY_TOTAL_STAGES, enemies: [], boss: null };
        currentStage = 1;
        maxStages = DAILY_TOTAL_STAGES;
        if (tagEl) tagEl.innerText = "Daily Challenge";
        if (titleEl) titleEl.innerText = `Daily Challenge — Stage ${currentStage} / ${maxStages}`;
        logMessage(`[Daily] Daily Challenge started. Your level, skills and gear have no effect here.`, 'winlose');
    } else {
        activeMap = {
            title: "Endless Void Tower (Test)",
            dropKey: 'map50',
            maxStages: 999,
            enemies: (typeof GAME_DATA !== 'undefined' && GAME_DATA.maps?.map1?.enemies) ? [...GAME_DATA.maps.map1.enemies] : [{ name: "Shadow Slime", hp: 80, maxHp: 80, atkMin: 12, atkMax: 18, hit: 110, flee: 100, baseExp: 50, jobExp: 35, gold: 80 }],
            boss: { name: "Void Lord", hp: 1500, maxHp: 1500, atkMin: 50, atkMax: 80, hit: 150, flee: 130, baseExp: 500, jobExp: 400, gold: 1000, isBoss: true }
        };
        currentStage = 1;
        maxStages = 999;
        if (tagEl) tagEl.innerText = "Endless Mode (Test: 100x rewards)";
        if (titleEl) titleEl.innerText = `Void Tower — Wave ${currentStage}`;
        logMessage(`[Expedition] Entering Endless Void Tower...`, 'winlose');
    }

    switchView('combat');
    player.inCombat = true;
    stageSummary = newStageSummary(currentStage);
    runeRefreshLeft = RUNE_REFRESH_MAX;
    combatPaused = false;
    updatePauseButton();
    monsterOpenerRound = true;
    spawnStageMonsters();

    if (combatInterval) clearInterval(combatInterval); combatRunId++;
    combatInterval = setInterval(runCombatTick, Math.max(400, 2000 - (derived.aspd * 10)));
}

// ---------- STAGE / BOSS ----------
function isMiniBossStage() {
    return (currentMode === 'campaign' || currentMode === 'event') && !!(activeMap && activeMap.miniBoss) && currentStage === ((activeMap && activeMap.miniStage) || 7) && currentStage !== maxStages;
}

// Rune offers on campaign and event maps: after stages 1, 3, 6, 10, 15, 20, 25, 30, then every 5th stage
const CAMPAIGN_RUNE_STAGES = [1, 3, 6, 10, 15, 20, 25, 30];
function isRuneStage(stage) {
    return CAMPAIGN_RUNE_STAGES.includes(stage) || (stage > 30 && stage % 5 === 0);
}

// True when clearing this stage opens a rune pick in the current mode
function isRuneDueAfter(stage) {
    if (currentMode === 'daily') return stage % 5 === 0;
    if (currentMode === 'endless') return stage % 4 === 0;
    return (currentMode === 'campaign' || currentMode === 'event') && isRuneStage(stage);
}

// Progress toward the next rune pick. Computed from the current stage, so it resets every map.
function runeProgressInfo() {
    let next = null;
    for (let s = currentStage; s < maxStages && s <= currentStage + 500; s++) {
        if (isRuneDueAfter(s)) { next = s; break; }
    }
    if (next === null) return null;
    let prev = 0;
    for (let s = currentStage - 1; s >= 1; s--) {
        if (isRuneDueAfter(s)) { prev = s; break; }
    }
    const gap = next - prev;
    const remaining = next - currentStage + 1;
    return { remaining, pct: Math.max(0, Math.min(100, Math.round((1 - remaining / gap) * 100))) };
}

// Resurrection Potion auto-use on/off (default on)
function toggleResurrectionUse() {
    if (player.resurrectionOn === false && (player.resurrectionPotions || 0) <= 0) {
        // Nothing to revive with: stay off and say why
        logMessage('[Resurrection] No Resurrection Potion left. Buy one in the shop or get one from mail.', 'winlose');
        showCombatText('#combat-elixir-btn', 'NO POTION', 'miss');
        updateUI();
        return;
    }
    player.resurrectionOn = player.resurrectionOn === false;
    updateUI();
}

// ---------- FINAL MAP (Lv 110) ----------
// Unlocked after Map Lv. 99 is cleared on all four paths. 25 stages: odd stages are monsters, even stages are bosses, stage 25 is the final boss.
const FINAL_PATH_KEYS = ['fire', 'water', 'earth', 'wind'];
const FINAL_BOSS_MULT = 1.2;
const FINAL_STAGE_LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100];
const FINAL_LEVEL_MAPS = { 1: 'map1', 10: 'map10', 20: 'map20', 30: 'map30', 40: 'map40', 50: 'map50', 60: 'map60', 70: 'map70', 80: 'map80', 90: 'map90', 100: 'map99' };

function isFinalMapUnlocked() {
    return FINAL_PATH_KEYS.every(pk => !!(player.clearedMaps && player.clearedMaps[`${pk}:map99`]));
}

function finalStageLevel(stage) {
    const idx = Math.min(Math.floor((stage - 1) / 2), FINAL_STAGE_LEVELS.length - 1);
    return FINAL_STAGE_LEVELS[idx];
}

function finalMonsterPool(level) {
    const m = GAME_DATA.maps[FINAL_LEVEL_MAPS[level]];
    return m.enemies;
}

// Monster strength across the 25 final stages: grows by 4% per stage (stage 25 = x1.96)
function finalStageMult(stage) {
    return 1; // no stage scaling in campaign; the final map's level comes from its map pool
}

function spawnFinalStage() {
    const mult = finalStageMult(currentStage);
    if (currentStage === maxStages) {
        const boss = makeBoss(MONSTERS_DATA.bossWorldEater);
        const up = v => Math.floor(v * FINAL_BOSS_MULT);
        const finalBoss = { ...boss, hp: up(boss.hp), maxHp: up(boss.maxHp), atkMin: up(boss.atkMin), atkMax: up(boss.atkMax), isFinalBoss: true };
        const escorts = [
            makeUnit(levelScaled(BASE_15.haloPriest, 100), mult),
            makeUnit(levelScaled(BASE_15.frostArcher, 100), mult),
            { ...makeUnit(levelScaled(BASE_15.jotunFrostMage, 100), mult), element: 'water' },
            { ...makeUnit(levelScaled(BASE_15.helStoneMage, 100), mult), element: 'earth' }
        ];
        monstersList = [finalBoss, ...escorts];
        logMessage(`[Final Boss] ${finalBoss.name} appears with its escort!`, 'winlose');
        return;
    }
    const level = finalStageLevel(currentStage);
    if (currentStage % 2 === 0) {
        const boss = makeBoss(GAME_DATA.maps[FINAL_LEVEL_MAPS[level]].boss);
        monstersList = [boss];
        logMessage(`[Boss] ${boss.name} (Lv ${level}) appears!`, 'winlose');
        return;
    }
    const pool = finalMonsterPool(level);
    const [lo, hi] = campaignCountRange();
    const count = randomInRange(lo, hi);
    monstersList = [];
    for (let i = 0; i < count; i++) monstersList.push(makeUnit(levelScaled(pool[Math.floor(Math.random() * pool.length)], level), mult));
}

function isBossStage() {
    if (activeMap && activeMap.finalMap) return currentStage % 2 === 0 || currentStage === maxStages;
    if (currentMode === 'campaign' || currentMode === 'event') return !!(activeMap && activeMap.boss) && currentStage === maxStages;
    if (currentMode === 'daily') return DAILY_BOSS_STAGES.includes(currentStage);
    return false;
}

function getBossTemplate() {
    if (currentMode === 'campaign' || currentMode === 'event') return activeMap.boss;
    const key = ['map1', 'map10', 'map20'][Math.floor(currentStage / 10) - 1];
    return GAME_DATA.maps[key].boss;
}

function getDailyEnemyPool() {
    const key = ['map1', 'map10', 'map20', 'map30'][Math.min(3, Math.floor((currentStage - 1) / 10))];
    const lv = GAME_DATA.maps[key].levelReq;
    return GAME_DATA.maps[key].enemies.map(t => levelScaled(t, lv));
}

// Bosses are stronger than their template and use the boss skills in monsterAct()
function makeBoss(t) {
    return {
        ...t,
        ...combatHitFlee(t),
        hp: Math.floor(t.hp * BOSS_HP_MULT),
        maxHp: Math.floor(t.maxHp * BOSS_HP_MULT),
        atkMin: Math.floor(t.atkMin * BOSS_ATK_MULT),
        atkMax: Math.floor(t.atkMax * BOSS_ATK_MULT),
        isBoss: true, rewarded: false, ailments: {}, attackCount: 0, enraged: false
    };
}

function spawnStageMonsters() {
    isFirstHitOfBattle = true;
    battlePlayerHits = 0;
    battleFirstDamageTaken = false;
    critStreak = 0;
    stageRuneUses = { fullHeal: 0, fullArmor: 0 };
    playerDebuffs = { curseUntil: 0, frost: 0, stun: 0 };
    playerStunUntil = 0;
    playerTimedDebuffs = {};
    playerAspdToggle = false;
    combatPlayerDeath.at = 0;
    const derived = getDerivedStats();
    monstersList = [];
    const dailyScale = currentMode === 'daily' ? 0.7 : 1;
    const scaled = (m) => ({
        ...m,
        hp: Math.floor(m.hp * dailyScale),
        maxHp: Math.floor(m.maxHp * dailyScale),
        atkMin: Math.floor(m.atkMin * dailyScale),
        atkMax: Math.floor(m.atkMax * dailyScale),
        hit: Math.floor(m.hit * dailyScale),
        flee: Math.floor(m.flee * dailyScale)
    });

    if (activeMap && activeMap.finalMap) {
        spawnFinalStage();
    } else if (isMiniBossStage()) {
        const mini = { ...activeMap.miniBoss, ...combatHitFlee(activeMap.miniBoss), rewarded: false, ailments: {}, isMiniBoss: true, lineupSlot: BOSS_LINEUP_SLOT };
        monstersList.push(mini);
        logMessage(`[Mini Boss] ${mini.name} appears!`, 'winlose');
    } else if (isBossStage()) {
        const boss = makeBoss(getBossTemplate());
        monstersList.push(dailyScale === 1 ? boss : scaled(boss));
        monstersList[0].lineupSlot = BOSS_LINEUP_SLOT; // boss stands in the 3rd lineup slot
        if (currentMode === 'campaign' || currentMode === 'event') addBossSupport(monstersList[0]);
        logMessage(`[Boss] ${boss.name} appears! Skills: Enrage (below 35% HP, +50% ATK), Heavy Strike (every 4th attack, x2 damage), Regeneration (1.5% HP per turn).`, 'winlose');
    } else if ((currentMode === 'campaign' || currentMode === 'event') && activeMap && activeMap.enemies && activeMap.enemies.length > 0) {
        spawnWaveFromSet(dailyScale, scaled);
    } else {
        const pool = currentMode === 'daily' ? getDailyEnemyPool() : (activeMap && activeMap.enemies) || [];
        if (pool.length > 0) {
            const count = Math.min(activeMap && activeMap.levelReq === 1 ? 3 : 6, Math.floor(Math.random() * 5) + 2);
            const mult = currentMode === 'endless' ? Math.pow(1.5, currentStage - 1) : stageMultiplier();
            for (let i = 0; i < count; i++) {
                const picked = pool[Math.floor(Math.random() * pool.length)];
                const template = currentMode === 'daily' ? picked : levelScaled(picked, activeMap && activeMap.levelReq);
                const base = {
                    ...template,
                    hp: Math.floor(template.hp * mult),
                    maxHp: Math.floor(template.maxHp * mult),
                    atkMin: Math.floor(template.atkMin * mult * tankDamageMult(template)),
                    atkMax: Math.floor(template.atkMax * mult * tankDamageMult(template)),
                    hit: combatHitFlee(template).hit,
                    flee: combatHitFlee(template).flee,
                    isBoss: false,
                    rewarded: false,
                    ailments: {}
                };
                monstersList.push(dailyScale === 1 ? base : scaled(base));
            }
        }
    }
    // Map Lv. 1 (campaign): monsters deal 4x damage, except mages (normal damage)
    if (currentMode === 'campaign' && activeMap && activeMap.levelReq === 1) {
        monstersList.forEach(m => { if (roleOf(m) !== 'mage') { m.atkMin = Math.max(1, Math.round(m.atkMin * 4)); m.atkMax = Math.max(1, Math.round(m.atkMax * 4)); } });
    }
    updateUI();
}

// ---------- WAVES, ROLES AND SUPPORT ----------
// Player debuffs caused by enemy spells: curseUntil = time (ms) the curse ends; frost = turns left
let playerDebuffs = { curseUntil: 0, frost: 0, stun: 0 };
// Player stun from tank attacks: the time (ms) until which the player cannot attack
let playerStunUntil = 0;
// Timed debuffs on the player from boss skills: { atk | hit | flee | aspd: { until, pct } }
let playerTimedDebuffs = {};
let playerAspdToggle = false; // Devour: every other player attack tick is skipped while ASPD is down
let combatRunId = 0; // delayed boss effects from an earlier fight do nothing
const BOSS_UNIQUE_SKILL = { M008: 'magmaRoar', M012: 'sandstorm', M016: 'undertow', M020: 'ashFeathers', M024: 'devour', M049: 'iceShield', M062: 'lightningSpear', M075: 'swordSweep', M088: 'raiseDead', M104: 'voidPull' };
function applyPlayerDebuff(kind, pct, ms) { playerTimedDebuffs[kind] = { until: Date.now() + ms, pct }; }
function playerDebuffPct(kind) { const d = playerTimedDebuffs[kind]; return d && Date.now() < d.until ? d.pct : 0; }

const SPELL_DEFS = {
    fireBolt:    { label: "Fire Bolt",    mult: 1.2 },
    rockBolt:   { label: "Rock Bolt",   mult: 1.0 },
    rockCurse:  { label: "Rock Curse",  mult: 0.6 },
    iceBolt:     { label: "Ice Bolt",     mult: 1.0 },
    freezeTouch:  { label: "Freeze Touch",  mult: 0.6 },
    thunderBolt: { label: "Thunder Bolt", mult: 1.3 }
};
// Mage type -> spells it can use (one is picked when the mage spawns)
const MAGE_SPELLS = {
    fire:  ['fireBolt'],
    earth: ['rockBolt', 'rockCurse'],
    ice:   ['iceBolt', 'freezeTouch'],
    wind:  ['thunderBolt']
};

function roleOf(m) {
    return m.role || (m.isRanged ? 'range' : 'melee');
}

// Picks a monster of the wanted role. Falls back to a close role if the map has none of it.
function pickUnit(pool, role) {
    const fallback = { melee: ['melee', 'tank'], tank: ['tank', 'melee'], range: ['range'], healer: ['healer', 'range'], mage: ['mage', 'range', 'melee'] };
    for (const r of (fallback[role] || [role])) {
        const list = pool.filter(m => roleOf(m) === r);
        if (list.length > 0) return list[Math.floor(Math.random() * list.length)];
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

// Campaign monsters do not scale within a map. Each map gets one flat power multiplier:
// the average of its old stage curve (HP/ATK) and hit/flee curve (2% per stage).
function mapPower() {
    if (!activeMap || activeMap.finalMap || !activeMap.campaignStages) return { hp: 1, hitFlee: 1 };
    const n = activeMap.campaignStages;
    const g = activeMap.stageGrowth || STAGE_GROWTH;
    let hpSum = 0, hfSum = 0;
    for (let s = 1; s <= n; s++) {
        hpSum += 1 + (s - 1) * g;
        hfSum += 1 + (s - 1) * 0.02;
    }
    return { hp: hpSum / n, hitFlee: hfSum / n };
}

// Monster hit and flee are based on the map level, like the player's (player hit = 100 + level + DEX, flee = 40 + level + AGI).
// Monster hit = level × 3 + MON_HIT_BASE, monster flee = level + MON_FLEE_BASE. Monster hit chance floor is 35%.
const MON_HIT_BASE = 40;
const MON_FLEE_BASE = 60;

// Campaign and event monsters use their level. Final map uses its stage level. Void keeps its stage scaling. Daily keeps hand-set values.
function combatHitFlee(t) {
    if (currentMode === 'endless') {
        const f = 1 + currentStage * 0.02;
        return { hit: Math.floor(t.hit * f), flee: Math.floor(t.flee * f) };
    }
    if (activeMap && (currentMode === 'campaign' || currentMode === 'event')) {
        const lv = activeMap.finalMap ? finalStageLevel(currentStage) : (activeMap.levelReq || 1);
        return { hit: lv * 3 + MON_HIT_BASE, flee: lv + MON_FLEE_BASE };
    }
    return { hit: t.hit, flee: t.flee };
}

function stageMultiplier() {
    return mapPower().hp;
}

// A fresh copy of a template for this stage
// Tank monsters deal 70% damage
function tankDamageMult(t) {
    return roleOf(t) === 'tank' ? 0.7 : 1;
}

function makeUnit(t, mult) {
    const unit = {
        ...t,
        hp: Math.floor(t.hp * mult),
        maxHp: Math.floor(t.maxHp * mult),
        atkMin: Math.floor(t.atkMin * mult * tankDamageMult(t)),
        atkMax: Math.floor(t.atkMax * mult * tankDamageMult(t)),
        hit: combatHitFlee(t).hit,
        flee: combatHitFlee(t).flee,
        isBoss: false, rewarded: false, ailments: {}
    };
    if (roleOf(t) === 'mage') {
        const options = MAGE_SPELLS[t.mageType] || ['fireBolt'];
        unit.spell = options[Math.floor(Math.random() * options.length)];
    }
    return unit;
}

// Monster count per campaign stage. First half of the map: by level band. Second half: 4-6.
// Lv 1-20: 1-3 | Lv 30-40: 2-3 | Lv 50-80: 3 | Lv 90-110: 4. Boss and mini boss stages are not affected.
function campaignCountRange() {
    const lv = activeMap.levelReq || 1;
    if (lv <= 1) return [1, 3]; // level 1 maps never have more than 3 monsters at once
    const firstHalf = currentStage <= Math.floor(maxStages / 2);
    if (!firstHalf) return [4, 6];
    if (lv <= 20) return [1, 3];
    if (lv <= 40) return [2, 3];
    if (lv <= 80) return [3, 3];
    return [4, 4];
}

function randomInRange(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// Normal stage: pick one wave set at random and fill each slot with a monster of that role
function spawnWaveFromSet(dailyScale, scaled) {
    const [lo, hi] = campaignCountRange();
    const n = randomInRange(lo, hi);
    const base = WAVE_SETS[Math.floor(Math.random() * WAVE_SETS.length)];
    const set = [];
    while (set.length < n) set.push(...base);
    set.length = n;
    const pool = activeMap.enemies;
    const mult = stageMultiplier();
    set.forEach(role => {
        const unit = makeUnit(levelScaled(pickUnit(pool, role), activeMap.levelReq), mult);
        monstersList.push(dailyScale === 1 ? unit : scaled(unit));
    });
    logMessage(`[Wave] ${monstersList.length} enemies come forward!`, 'combat');
}

// Boss stage: the boss stands in the 3rd lineup position, and support monsters fill the other positions
// Lineup slots 1-6 (index 0-5). Range and mage go to slot 6, tank to slot 5 (or the next free slot).
const BOSS_LINEUP_SLOT = 2; // boss (and mini-boss) stand in the 3rd lineup position (index 2)
function addBossSupport(boss) {
    const mult = stageMultiplier();
    const used = [];
    used[BOSS_LINEUP_SLOT] = true; // reserved for the boss, so the support units fill the other slots
    const freeSlot = wanted => {
        if (!used[wanted]) return wanted;
        for (let i = 0; i < 6; i++) if (!used[i]) return i;
        return wanted;
    };
    const supports = [];
    ((activeMap && activeMap.bossSupport) || []).forEach(s => {
        const unit = makeUnit(levelScaled(pickUnit(activeMap.enemies, s.role), activeMap.levelReq), mult);
        let want = s.pos - 1;
        if (s.role === 'range' || s.role === 'mage') want = 5;
        else if (s.role === 'tank') want = 4;
        const at = freeSlot(want);
        used[at] = true;
        unit.lineupSlot = at;
        supports.push(unit);
    });
    boss.lineupSlot = BOSS_LINEUP_SLOT;
    monstersList = [boss, ...supports.filter(Boolean)];
    const names = monstersList.slice(1).map(m => m.name).join(', ');
    if (names) logMessage(`[Support] ${names} stand behind ${boss.name}.`, 'winlose');
}

// Curse and frost wear off one turn at a time
function tickPlayerDebuffs() {
    if (playerDebuffs.frost > 0) playerDebuffs.frost--;
}

// ---------- ENEMY STATUS: FREEZE (water) and ROCK (earth) ----------
const STATUS_MS = 2000;
const MAX_BASE_LV = 99;
const MAX_CLASS_LV = 50;
const VOID_TEST_MULT = 100; // Void Tower is a test mode: 100x EXP, gold, and item chance
const STATUS_DEFS = {
    freeze: { label: "Freeze", element: 'water' },
    rock:   { label: "Rock",   element: 'earth' },
    stun:   { label: "Stun",   element: null }
};
// Freeze or rock: the enemy cannot attack or dodge, and takes the status element, for 2 seconds
function applyEnemyStatus(m, kind) {
    if (!m || m.hp <= 0) return;
    if (!m.status) m.baseElement = m.element;
    m.status = { kind, ms: STATUS_MS };
    m.element = STATUS_DEFS[kind].element;
    const change = kind === 'freeze' ? 'is frozen' : 'turns to rock';
    logMessage(`[${STATUS_DEFS[kind].label}] ${m.name} ${change}! It cannot attack or dodge for 2 seconds.`, 'drop');
}
function combatTickMs(derived) {
    return Math.max(400, 2000 - (derived.aspd * 10));
}
function tickEnemyStatuses(tickMs) {
    monstersList.forEach(m => {
        if (!m.status || m.hp <= 0) return;
        m.status.ms -= tickMs;
        if (m.status.ms <= 0) {
            m.element = m.baseElement || m.element;
            m.status = null;
            logMessage(`[Status] ${m.name} is no longer affected.`, 'combat');
        }
    });
}

// Stuns a monster for 2 seconds (it cannot attack) and shows the STUNNED text. Returns true if applied.
function applyStunStatus(m) {
    if (!m || m.hp <= 0 || m.status) return false;
    m.status = { kind: 'stun', ms: STATUS_MS };
    const i = monstersList.indexOf(m);
    if (i >= 0) showCombatText(`#monsters-lineup-container > div:nth-child(${i + 1}) img`, 'STUNNED', 'stun');
    return true;
}
function getAliveMonsters() {
    return monstersList.filter(m => m.hp > 0);
}

function updateQuestProgress(type, amount) {
    if (!player.dailyQuests) return;
    player.dailyQuests.forEach(q => {
        if (!q.completed) {
            if ((type === 'slimes' && q.id === 'q_slimes') ||
                (type === 'crit' && q.id === 'q_crit') ||
                (type === 'gold' && q.id === 'q_gold')) {
                q.current = Math.min(q.target, q.current + amount);
                if (q.current >= q.target) {
                    q.completed = true;
                    logMessage(`[Daily Quest Completed!] ${q.title} finished! Claim your chest reward in Quests tab.`, 'levelup');
                }
            }
        }
    });
}

function awardKill(m) {
    m.rewarded = true;
    player.runes.killCount = (player.runes.killCount || 0) + 1;
    if (runeN('reaper') > 0) healPlayer(Math.floor(getDerivedStats().maxHp * runeN('reaper') / 100), 'Reaper');
    const isEvent = currentMode === 'event';
    const isVoidTest = currentMode === 'endless';
    const derived = getDerivedStats();
    let finalGold = Math.floor(((m.gold / 4) * (1 + (skillBonus('goldPct') + ((m.isBoss || m.isMiniBoss) ? skillBonus('bossGoldPct') : 0)) / 100)) * derived.goldMultiplier);
    let baseExpGain = Math.max(1, Math.floor(m.baseExp / 3));
    let jobExpGain = Math.max(1, Math.floor(m.jobExp / 3));
    if (isEvent && currentEvent === 'gold') { finalGold *= 2; baseExpGain = 0; jobExpGain = 0; }
    if (isEvent && currentEvent === 'xp') { baseExpGain *= 2; jobExpGain *= 2; finalGold = 0; }
    const bossKill = !!(m.isBoss || m.isMiniBoss);
    const bossExp = bossKill ? skillBonus('bossExpPct') : 0;
    baseExpGain = Math.floor(baseExpGain * (1 + (skillBonus('baseExpPct') + skillBonus('allExpPct') + bossExp) / 100));
    jobExpGain = Math.floor(jobExpGain * (1 + (skillBonus('classExpPct') + skillBonus('allExpPct') + bossExp) / 100));
    if (isVoidTest) { baseExpGain *= VOID_TEST_MULT; jobExpGain *= VOID_TEST_MULT; finalGold *= VOID_TEST_MULT; }
    if (player.baseLv >= MAX_BASE_LV) baseExpGain = 0;
    if (player.jobLv >= MAX_CLASS_LV) jobExpGain = 0;

    if (stageSummary) { stageSummary.gold += finalGold; stageSummary.baseExp += baseExpGain; stageSummary.jobExp += jobExpGain; }
    logMessage(`[Victory] Defeated ${m.name}! Gained ${baseExpGain} Base EXP, ${jobExpGain} Class EXP and <span style="color: yellow;">${finalGold} Gold</span>`, 'winlose');
    player.gold += finalGold;
    if (m.isFinalBoss) { player.diamonds += 100; logMessage(`[Final Boss] Defeated! Reward: 100 Diamond`, 'drop'); }
    player.baseExp += baseExpGain;
    player.jobExp += jobExpGain;

    updateQuestProgress('slimes', 1);
    updateQuestProgress('gold', finalGold);

    if (player.baseLv < MAX_BASE_LV && player.baseExp >= player.baseMaxExp) {
        player.baseLv++;
        player.baseExp -= player.baseMaxExp;
        player.baseMaxExp = Math.floor(player.baseMaxExp * 1.35);
        player.statPoints += 3;
        logMessage(`[BASE LEVEL UP!] Reached Base Level ${player.baseLv}! Gained 3 Stat Points`, 'levelup');
        playSound('sound/lvup.mp3');
    }

    if (player.jobLv < MAX_CLASS_LV && player.jobExp >= player.jobMaxExp) {
        player.jobLv++;
        player.jobExp -= player.jobMaxExp;
        player.jobMaxExp = Math.floor(player.jobMaxExp * 1.3);
        player.jobSp += 1;
        logMessage(`[CLASS LEVEL UP!] Reached Class Level ${player.jobLv}! Gained 1 SP`, 'levelup');
    }

    // Events give no item drops
    if (isEvent) return;

    const pool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
    const itemChance = isVoidTest ? 1 : 0.01;
    if (!m.isBoss && !m.isMiniBoss && pool.length > 0 && Math.random() < itemChance) {
        const template = pool[Math.floor(Math.random() * pool.length)];
        const droppedItem = generatePoEItem(template);
        logMessage(`[Monster Drop] ${m.name} dropped <span style="color: yellow;">${droppedItem.name} (Rarity ${droppedItem.rarity})</span>!`, 'drop');
        addItemToInventory(droppedItem);
    }
    if (m.isMiniBoss && pool.length > 0 && Math.random() < (isVoidTest ? 1 : 0.5)) {
        const template = pool[Math.floor(Math.random() * pool.length)];
        const droppedItem = generatePoEItem(template, rollMiniBossDropRarity(), 1);
        logMessage(`[Mini Boss Drop!] ${m.name} dropped <span style="color: yellow;">${droppedItem.name} (Rarity ${droppedItem.rarity})</span>!`, 'drop');
        addItemToInventory(droppedItem);
    }
    for (let bd = 0; bd < (m.isFinalBoss ? 2 : 1); bd++) if (m.isBoss && pool.length > 0) {
        const template = pool[Math.floor(Math.random() * pool.length)];
        const droppedItem = generatePoEItem(template, rollBossDropRarity(), 1);
        logMessage(`[Boss Drop!] ${m.name} dropped <span style="color: yellow;">${droppedItem.name} (Rarity ${droppedItem.rarity})</span>!`, 'drop');
        addItemToInventory(droppedItem);
    }
}

// ---------- HEALING / DAMAGE HELPERS ----------
function healPlayer(amount, source) {
    if (amount <= 0 || player.hp <= 0) return;
    const maxHp = getDerivedStats().maxHp;
    const before = player.hp;
    player.hp = Math.min(maxHp, player.hp + amount);
    const gained = player.hp - before;
    if (gained > 0) showHealAura('#combat-player-sprite');
    const over = amount - Math.max(0, gained); // only the part of the heal above full HP
    if (over > 0 && runeN('overflow') > 0) {
        const alive = getAliveMonsters();
        if (alive.length > 0) {
            const dmg = Math.floor(over * runeN('overflow') / 100);
            const t = alive[Math.floor(Math.random() * alive.length)];
            t.hp -= dmg;
            logMessage(`[Overflow] ${dmg} overheal damage to ${t.name}`, 'drop');
        }
    }
    if (gained <= 0) return;
    logMessage(`[Heal] ${source} restores ${gained} HP`, 'drop');
    triggerRetribution(gained, source);
}

// Retribution: every heal strikes a random monster for the rune's damage
function triggerRetribution(amount, source) {
    const dmg = Math.floor((amount || 0) * runeN('retribution') / 100);
    if (dmg <= 0) return;
    const alive = getAliveMonsters();
    if (alive.length === 0) return;
    const target = alive[Math.floor(Math.random() * alive.length)];
    target.hp -= dmg;
    logMessage(`[Retribution] ${source} heal strikes ${target.name} for ${dmg} damage`, 'drop');
}

// Called after a heal made outside the combat tick (manual potion)
function checkStageClearAfterHeal() {
    monstersList.forEach(m => { if (m.hp <= 0 && !m.rewarded) awardKill(m); });
    updateUI();
    if (monstersList.length > 0 && getAliveMonsters().length === 0) onStageCleared();
}

// Called by manual potion use: Retribution rune strikes a random monster


// Tank hits: 10% chance to stun the player. 1 second at VIT 1, shorter with VIT, and 0 (no stun) at VIT 70.
function tankStunPlayer(m) {
    if (Math.random() >= 0.10) return;
    const vit = Math.max(1, player.stats.vit);
    const ms = Math.round(1000 * Math.max(0, 1 - vit / 70));
    if (ms <= 0) return;
    playerStunUntil = Math.max(playerStunUntil, Date.now() + ms);
    setTimeout(() => showCombatText('#combat-player-sprite', 'STUNNED', 'stun'), 0);
    logMessage(`[Stun] ${m.name} stuns you for ${(ms / 1000).toFixed(2)} seconds!`, 'winlose');
    if (typeof showBossBalloon === 'function') showBossBalloon('Stunned!');
}
function onPlayerDodged(m, source) {
    setTimeout(() => showCombatText('#combat-player-sprite', 'DODGE', 'miss'), 0);
    playPlayerReactAnim('dodge');
    playPlayerDodgeLunge();
    logMessage(`[Dodge] You evaded ${m.name}'s attack! (${source})`, 'combat');
    monsterHitStreak = 0;
    dodgeStreak++;
    const maxHp = getDerivedStats().maxHp;
    if (runeN('evasion') > 0) healPlayer(Math.floor(maxHp * runeN('evasion') / 100), 'Evasion');
    if (runeN('evasiveGuard') > 0) {
        const d = getDerivedStats();
        player.armor = Math.min(d.maxArmor, player.armor + Math.floor(d.maxArmor * runeN('evasiveGuard') / 100));
    }
    if (runeN('twinEvasion') > 0 && dodgeStreak === 2) healPlayer(Math.floor(maxHp * runeN('twinEvasion') / 100), 'Twin Evasion');
    if (runeN('tripleDodge') > 0 && dodgeStreak >= 3) {
        dodgeStreak = 0;
        player.hp = maxHp;
        logMessage('[Triple Dodge] 3 dodges in a row, fully healed!', 'drop');
    }
    if (runeN('counterStrike') > 0) {
        const cdmg = Math.floor(getDerivedStats().atk * runeN('counterStrike') / 100);
        m.hp -= cdmg;
        logMessage(`[Counter Strike] ${cdmg} damage to ${m.name}`, 'drop');
    }
    if (runeN('riposte') > 0) player.runes.riposteReady = true;
}

// Armor absorbs damage first, the rest goes to HP
// Armor absorbs damage first, the rest goes to HP
function takePlayerDamage(dmg, m, ignoreArmor = false) {
    playPlayerReactAnim('block');
    flashPlayerHurt();
    lastHitBy = m.name;
    dmg = Math.floor(dmg * (1 - skillBonus('dmgReducePct') / 100));
    // Element resistance from gear: a negative value means extra damage from that element
    const incomingRes = m && m.element ? (getDerivedStats().elemRes[m.element] || 0) : 0;
    dmg = Math.floor(dmg * (1 - incomingRes / 100));
    let remaining = dmg;
    let absorbed = 0;
    if (player.armor > 0 && !ignoreArmor) {
        absorbed = Math.min(player.armor, remaining);
        player.armor -= absorbed;
        remaining -= absorbed;
    }
    if (remaining > 0) player.hp -= remaining;
    logMessage(`[Combat] ${m.name} hits you for ${dmg} damage${absorbed ? ` (${absorbed} absorbed by armor)` : ''}`, 'combat');
    // Damage number on the player's sprite: the damage taken (armor-absorbed damage included)
    showCombatText('#combat-player-sprite', String(Math.max(0, Math.round(dmg))), ''); // shows 0 when fully blocked

    if (!battleFirstDamageTaken) {
        battleFirstDamageTaken = true;
        if (runeN('lifeline') > 0) healPlayer(Math.floor(getDerivedStats().maxHp * runeN('lifeline') / 100), 'Lifeline');
    }
}

// ---------- BOSS SKILLS ----------
function bossTurnStart(m) {
    if (m.hp <= 0) return;
    const regen = Math.floor(m.maxHp * 0.015);
    if (m.hp < m.maxHp) {
        m.hp = Math.min(m.maxHp, m.hp + regen);
        logMessage(`[Boss Skill] ${m.name} regenerates ${regen} HP`, 'combat');
    }
    if (!m.enraged && m.hp <= m.maxHp * 0.35) {
        m.enraged = true;
        logMessage(`[Boss Skill] ${m.name} enrages! ATK +50%`, 'winlose');
        if (typeof showBossBalloon === 'function') showBossBalloon('Enraged!');
    }
}

// Boss unique skills: one per boss (BOSS_UNIQUE_SKILL). Each one shows a speech box when it triggers.
function bossDebuffPlayer(m, kind, pct, ms, skillName, label) {
    applyPlayerDebuff(kind, pct, ms);
    logMessage(`[Boss Skill] ${m.name} uses ${skillName}! ${label} for ${ms / 1000} seconds`, 'winlose');
    if (typeof showBossBalloon === 'function') showBossBalloon(`${skillName}! ${label} (${ms / 1000}s)`);
}
function bossSkillOnAttack(m) {
    const n = m.attackCount;
    switch (BOSS_UNIQUE_SKILL[m.id]) {
        case 'sandstorm': if (n % 5 === 0) bossDebuffPlayer(m, 'hit', 30, 5000, 'Sandstorm', 'HIT -30%'); break;
        case 'ashFeathers': if (n % 5 === 0) bossDebuffPlayer(m, 'flee', 30, 5000, 'Ash Feathers', 'FLEE -30%'); break;
        case 'devour': if (n % 5 === 0) bossDebuffPlayer(m, 'aspd', 50, 5000, 'Devour', 'ASPD -50%'); break;
        case 'undertow':
            if (n % 5 === 0) {
                m.undertowUntil = Date.now() + 5000;
                logMessage(`[Boss Skill] ${m.name} uses Undertow! It heals from its hits for 5 seconds`, 'winlose');
                if (typeof showBossBalloon === 'function') showBossBalloon('Undertow! Heals on hit (5s)');
            }
            break;
        case 'voidPull': if (n % 4 === 0) voidPullPlayer(m); break;
        case 'raiseDead': if (n % 6 === 0) raiseFallenMonster(m); break;
    }
}
function bossIceShieldTick(m) {
    if (BOSS_UNIQUE_SKILL[m.id] !== 'iceShield' || m.hp <= 0) return;
    if (Date.now() - (m._shieldAt || 0) >= 5000) {
        m._shieldAt = Date.now();
        m.iceShieldReady = true; // the next hit on this boss is reduced by 20%
        logMessage(`[Boss Skill] ${m.name} raises an Ice Shield`, 'winlose');
        if (typeof showBossBalloon === 'function') showBossBalloon('Ice Shield! Blocks 20% of the next hit');
    }
}
function voidPullPlayer(m) {
    const runId = combatRunId;
    logMessage(`[Boss Skill] ${m.name} uses Void Pull! You lose 5% of max HP each second for 3 seconds`, 'winlose');
    if (typeof showBossBalloon === 'function') showBossBalloon('Void Pull! -5% HP per second (3s)');
    for (let i = 1; i <= 3; i++) {
        setTimeout(() => {
            if (runId !== combatRunId || player.hp <= 0) return;
            const d = Math.max(1, Math.floor(getDerivedStats().maxHp * 0.05));
            player.hp -= d;
            showCombatText('#combat-player-sprite', String(d), '');
            logMessage(`[Void Pull] ${m.name} drains ${d} HP`, 'combat');
        }, i * 1000);
    }
}
function raiseFallenMonster(m) {
    const fallen = monstersList.filter(x => x !== m && x.hp <= 0 && !x.isBoss && !x.isMiniBoss);
    if (!fallen.length) return;
    const t = fallen[Math.floor(Math.random() * fallen.length)];
    t.hp = Math.max(1, Math.floor(t.maxHp * 0.3));
    t._deathAt = 0;
    t.status = null;
    logMessage(`[Boss Skill] ${m.name} uses Raise Dead! ${t.name} rises again at 30% HP`, 'winlose');
    if (typeof showBossBalloon === 'function') showBossBalloon(`Raise Dead! ${t.name} rises`);
}
function stunPlayerFor(ms, m, label) {
    playerStunUntil = Math.max(playerStunUntil, Date.now() + ms);
    setTimeout(() => showCombatText('#combat-player-sprite', 'STUNNED', 'stun'), 0);
    logMessage(`[Stun] ${m.name}'s ${label} stuns you for ${(ms / 1000).toFixed(1)} seconds!`, 'winlose');
    if (typeof showBossBalloon === 'function') showBossBalloon(`${label}! Stunned (${(ms / 1000).toFixed(1)}s)`);
}

function monsterAct(m, derived, position = 0) {
    if (player.hp <= 0 || m.hp <= 0) return;
    if (m.isBoss) { bossTurnStart(m); bossIceShieldTick(m); }
    if (m.status) {
        logMessage(`[${STATUS_DEFS[m.status.kind].label}] ${m.name} cannot attack!`, 'winlose');
        return;
    }
    if (m.isBoss) m.attackCount = (m.attackCount || 0) + 1;
    if (m.isBoss) bossSkillOnAttack(m);

    // Healers restore the most wounded ally by a flat amount instead of attacking
    if (roleOf(m) === 'healer' && m.heal) {
        const hurtAllies = getAliveMonsters().filter(x => x !== m && x.hp < x.maxHp).sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
        const wounded = hurtAllies[0] || (m.hp < m.maxHp ? m : null); // no hurt ally: heal self
        if (wounded) {
            startMonsterAttack(m, (monsterOpenerRound ? COMBAT_OPENER_MONSTER_DELAY_MS : 0) + position * COMBAT_MONSTER_STAGGER_MS); // healing plays the attack animation
            const amount = Math.min(m.heal, wounded.maxHp - wounded.hp);
            wounded.hp += amount;
            logMessage(`[Heal] ${m.name} heals ${wounded.name} for ${amount} HP`, 'combat');
            return;
        }
    }
    // Melee and tank units only strike when they are the first monster facing the player
    if (!m.isBoss && (roleOf(m) === 'melee' || roleOf(m) === 'tank') && position >= 1) return;

    startMonsterAttack(m, (monsterOpenerRound ? COMBAT_OPENER_MONSTER_DELAY_MS : 0) + position * COMBAT_MONSTER_STAGGER_MS); // same moment as the player's attack, except the first round of a map
    const hitChance = Math.min(0.95, Math.max(0.35, (m.hit - derived.flee + 50) / 100));
    if (Math.random() <= hitChance) {
        let eDmg = Math.max(1, Math.floor((Math.floor(Math.random() * (m.atkMax - m.atkMin + 1)) + m.atkMin) * 100 / (100 + derived.def)));
        if (m.isBoss && m.enraged) eDmg = Math.floor(eDmg * 1.5);
        if (m.isBoss && m.attackCount % 4 === 0) {
            eDmg = Math.floor(eDmg * 2);
            logMessage(`[Boss Skill] ${m.name} uses Heavy Strike!`, 'winlose');
            if (typeof showBossBalloon === 'function') showBossBalloon('Heavy Strike!');
        }
        let ignoreArmor = false;
        if (m.isBoss && BOSS_UNIQUE_SKILL[m.id] === 'magmaRoar' && m.attackCount % 5 === 0) {
            eDmg = Math.floor(eDmg * 2);
            bossDebuffPlayer(m, 'atk', 25, 5000, 'Magma Roar', 'ATK -25%');
        }
        if (m.isBoss && BOSS_UNIQUE_SKILL[m.id] === 'lightningSpear') {
            ignoreArmor = true; // the spear goes through armor
            if (Math.random() < 0.2) stunPlayerFor(1500, m, 'Lightning Spear');
        }
        if (m.spell) {
            const def = SPELL_DEFS[m.spell];
            eDmg = Math.floor(eDmg * def.mult);
            logMessage(`[Spell] ${m.name} casts ${def.label} for ${eDmg} damage`, 'combat');
            if (m.spell === 'rockCurse') { playerDebuffs.curseUntil = Date.now() + 3000; logMessage('[Curse] Your attacks are weaker for 3 seconds', 'winlose'); if (typeof showBossBalloon === 'function') showBossBalloon('Curse! ATK -20% (3 seconds)'); }
            if (m.spell === 'freezeTouch') { playerDebuffs.frost = 3; logMessage('[Freeze] Your aim is worse for 3 turns', 'winlose'); if (typeof showBossBalloon === 'function') showBossBalloon('Freeze! HIT -20 (3 turns)'); }
        }
        if (player.runes.zeroArmor && derived.maxArmor > 0) eDmg = Math.floor(eDmg * 0.9);
        takePlayerDamage(eDmg, m, ignoreArmor);
        if (roleOf(m) === 'tank') tankStunPlayer(m);
        if (m.isBoss && BOSS_UNIQUE_SKILL[m.id] === 'swordSweep' && m.attackCount % 3 === 0 && player.hp > 0) {
            logMessage(`[Boss Skill] ${m.name} uses Sword Sweep! It strikes twice`, 'winlose');
            if (typeof showBossBalloon === 'function') showBossBalloon('Sword Sweep! Second strike');
            takePlayerDamage(eDmg, m);
        }
        if (m.isBoss && m.undertowUntil > Date.now() && m.hp > 0) {
            const heal = Math.floor(eDmg * 0.3);
            m.hp = Math.min(m.maxHp, m.hp + heal);
            logMessage(`[Undertow] ${m.name} heals ${heal} HP`, 'combat');
        }
        dodgeStreak = 0;
        monsterHitStreak++;
        if (runeN('lastResort') > 0 && monsterHitStreak >= 10) {
            monsterHitStreak = 0;
            player.hp = getDerivedStats().maxHp;
            logMessage('[Last Resort] You took 10 hits in a row and are fully healed!', 'drop');
        }
        if (!m.isRanged && runeN('thorn') > 0 && m.hp > 0) {
            const reflect = Math.floor(eDmg * runeN('thorn') / 100);
            if (reflect > 0) {
                m.hp -= reflect;
                logMessage(`[Thorn] Reflects ${reflect} damage to ${m.name}`, 'drop');
            }
        }
    } else {
        onPlayerDodged(m, 'Evade');
    }
}

// ---------- MAIN LOOP ----------
function runCombatTick() {
    if (combatPaused) {
        if (isVipActive()) return;
        combatPaused = false;
        updatePauseButton();
    }
    const derived = getDerivedStats();
    let alive = getAliveMonsters();
    if (alive.length === 0) {
        monstersList.forEach(m => { if (m.hp <= 0 && !m.rewarded) awardKill(m); });
        if (monstersList.length > 0) onStageCleared();
        return;
    }
    if (player.hp <= 0) return;

    attackCount++;
    tickEnemyStatuses(combatTickMs(derived));

    // ---- Player attack ----
    let targetEnemy = alive[0];
    if (runeN('randomHitCount') > 0 && alive.length > 1 && Math.random() < 0.5) {
        targetEnemy = alive[Math.floor(Math.random() * alive.length)];
    }

    if (runeN('fortify') > 0 && attackCount % 3 === 0) {
        const fortAmt = Math.floor(derived.maxArmor * runeN('fortify') / 100);
        player.armor = Math.min(derived.maxArmor, player.armor + fortAmt);
        logMessage(`[Rune] Fortify restores ${fortAmt} armor`, 'drop');
    }

    if (targetEnemy.ailments.poison) {
        const pDmg = 10;
        targetEnemy.hp -= pDmg;
        logMessage(`[Poison] ${targetEnemy.name} takes ${pDmg} poison damage.`, 'combat');
    }
    if (targetEnemy.ailments.ignite) {
        const iDmg = 15;
        targetEnemy.hp -= iDmg;
        logMessage(`[Ignite] ${targetEnemy.name} burns for ${iDmg} fire damage.`, 'combat');
    }

    const stunned = Date.now() < playerStunUntil;
    const aspdSkip = playerDebuffPct('aspd') > 0 && (playerAspdToggle = !playerAspdToggle); // Devour: every other tick
    const attackBlocked = stunned || aspdSkip;
    if (stunned) logMessage('[Stun] You are stunned and cannot attack!', 'winlose');
    const hitChance = Math.min(0.95, Math.max(0.2, (derived.hit - (playerDebuffs.frost > 0 ? 20 : 0) - targetEnemy.flee + 50) / 100));
    if (!attackBlocked && (runeN('hawkEye') > 0 || !!targetEnemy.status || Math.random() <= hitChance)) {
        const bonusDmg = (isFirstHitOfBattle ? Math.floor(derived.atk * runeN('firstHitBonus') / 100) : 0);
        const elemMult = player.runes.elementIgnore ? 1 : getElementMultiplier(player.equipped.weapon?.element, targetEnemy.element);
        if (elemMult !== 1 && !player.runes.elementIgnore) {
            logMessage(`[Element] ${elemMult > 1 ? 'Advantage' : 'Resisted'} x${elemMult} vs ${targetEnemy.name}`, elemMult > 1 ? 'drop' : 'combat');
        }
        let pDmg = Math.floor((derived.atk + bonusDmg) * elemMult);
        if (Date.now() < playerDebuffs.curseUntil) pDmg = Math.floor(pDmg * 0.8);
        if (targetEnemy.armor) pDmg = Math.floor(pDmg * (1 - targetEnemy.armor / 100));
        if (runeN('powerSurge') > 0) pDmg = Math.floor(pDmg * (1 + runeN('powerSurge') / 100));
        if (runeN('runeMastery') > 0) pDmg = Math.floor(pDmg * (1 + 0.2 * (player.currentRunRunes || []).length));
        if (targetEnemy.isBoss || targetEnemy.isMiniBoss) pDmg = Math.floor(pDmg * (1 + skillBonus('bossDmgPct') / 100));
        if (targetEnemy.iceShieldReady) {
            pDmg = Math.floor(pDmg * 0.8);
            targetEnemy.iceShieldReady = false;
            logMessage(`[Ice Shield] ${targetEnemy.name} blocks 20% of your hit`, 'winlose');
            if (typeof showBossBalloon === 'function') showBossBalloon('Ice Shield blocks 20%!');
        }
        if (targetEnemy.hp > 0 && targetEnemy.hp <= targetEnemy.maxHp * 0.5) pDmg = Math.floor(pDmg * (1 + skillBonus('lowHpDmgPct') / 100));
        if (runeN('giantSlayer') > 0 && (targetEnemy.isBoss || targetEnemy.isMiniBoss)) pDmg = Math.floor(pDmg * (1 + runeN('giantSlayer') / 100));
        if (runeN('monsterHunter') > 0 && !targetEnemy.isBoss && !targetEnemy.isMiniBoss) pDmg = Math.floor(pDmg * (1 + runeN('monsterHunter') / 100));
        if (runeN('ironFortress') > 0 && player.armor > 0) pDmg = Math.floor(pDmg * 3);
        if (player.runes.patientReady) { pDmg = pDmg * 4; player.runes.patientReady = false; }
        if (attackCount % 3 === 0 && runeN('divineLight') > 0) {
            const extra = Math.floor(derived.atk * runeN('divineLight') / 100);
            pDmg += extra;
            logMessage(`[Divine Light] +${extra} bonus damage`, 'levelup');
        }

        const riposteCrit = !!player.runes.riposteReady;
        player.runes.riposteReady = false;
        const surgeBonus = player.runes.surgeReady ? runeN('surgeFocus') : 0;
        player.runes.surgeReady = false;
        const isCrit = (isFirstHitOfBattle && player.runes.alwaysCritFirst) || runeN('relentless') > 0 || riposteCrit || (Math.random() * 100 < derived.crit + surgeBonus);
        playPlayerAttackAnim(isCrit);
        targetEnemy.lastHitCrit = !!isCrit;
        if (isCrit) {
            pDmg = Math.floor(pDmg * (1.5 + (skillBonus('critDmgPct') + setStat('critDmgPct')) / 100));
            updateQuestProgress('crit', 1);
            playSound('sound/critical.mp3');
            logMessage(`[Critical!] Attacked ${targetEnemy.name} for critical ${pDmg} damage!`, 'combat');
            critStreak++;
            if (runeN('critSplash') > 0) {
                const pool = getAliveMonsters();
                if (pool.length) {
                    const pick = pool[Math.floor(Math.random() * pool.length)];
                    const splash = Math.max(1, Math.floor(pDmg * 0.2));
                    pick.hp -= splash;
                    logMessage(`[Critical Splash] ${splash} damage to ${pick.name}`, 'drop');
                }
            }
            if (runeN('ironGuard') > 0) player.armor = Math.min(derived.maxArmor, player.armor + Math.floor(derived.maxArmor * runeN('ironGuard') / 100));
            if (runeN('fortitude') > 0 && Math.random() < 0.2) player.runes.fortitudeStacks = (player.runes.fortitudeStacks || 0) + 1;
            player.runes.surgeReady = runeN('surgeFocus') > 0;
            if (runeN('critHeal') > 0) healPlayer(Math.floor(getDerivedStats().maxHp * runeN('critHeal') / 100), 'Critical Heal');
            if (critStreak >= 3) {
                critStreak = 0;
                if (runeN('momentum') > 0) healPlayer(Math.floor(getDerivedStats().maxHp * runeN('momentum') / 100), 'Momentum');
            }
        } else {
            critStreak = 0;
            playSound('sound/hit.mp3');
            logMessage(`[Attack] Hit ${targetEnemy.name} for ${pDmg} damage`, 'combat');
        }
        if (runeN('sharedDamage') > 0 && alive.length > 1) {
            const share = Math.max(1, Math.floor(pDmg / alive.length));
            alive.forEach(e => { e.hp -= share; });
            logMessage(`[Shared Pain] Damage split: ${share} to each of ${alive.length} enemies`, 'drop');
        } else {
            targetEnemy.hp -= pDmg;
        }
        if (runeN('splash') > 0 && Math.random() < 0.2) {
            const idx = monstersList.indexOf(targetEnemy);
            const behind = monstersList.slice(idx + 1).find(e => e.hp > 0);
            if (behind) {
                const splashDmg = Math.max(1, Math.floor(pDmg * 0.2));
                behind.hp -= splashDmg;
                logMessage(`[Splash] ${splashDmg} damage to ${behind.name} behind ${targetEnemy.name}`, 'drop');
            }
        }
        battlePlayerHits++;
        if (targetEnemy.hp > 0 && runeN('freezeTouch') > 0 && Math.random() < 0.10) applyEnemyStatus(targetEnemy, 'freeze');
        if (targetEnemy.hp > 0 && runeN('rockCurse') > 0 && Math.random() < 0.10) applyEnemyStatus(targetEnemy, 'rock');
        if (targetEnemy.hp > 0 && runeN('stunTouch') > 0 && Math.random() < 0.10) applyStunStatus(targetEnemy);
        if (runeN('rangeStun') > 0 && Math.random() < 0.20) {
            const casters = getAliveMonsters().filter(m => ['range', 'mage', 'healer'].includes(roleOf(m)) && !m.status);
            if (casters.length) applyStunStatus(casters[Math.floor(Math.random() * casters.length)]);
        }
        ['fireBolt', 'coldBolt', 'thunderBolt', 'rockBolt'].forEach(id => {
            const ch = runeN(id);
            if (ch > 0 && Math.random() * 100 < ch) {
                for (let b = 0; b < 4; b++) {
                    if (targetEnemy.hp <= 0) break;
                    const bolt = Math.floor(derived.atk * 0.5);
                    targetEnemy.hp -= bolt;
                    logMessage(`[Bolt] ${RUNE_DEFS[id].name} hits ${targetEnemy.name} for ${bolt} damage`, 'drop');
                }
            }
        });
        if (runeN('vampire') > 0) healPlayer(Math.floor(pDmg * runeN('vampire') / 100), 'Vampire');
    } else {
        critStreak = 0;
        if (!attackBlocked) playPlayerAttackAnim(false); // the swing plays on a miss too
        if (!attackBlocked) {
            const di = monstersList.indexOf(targetEnemy);
            if (di >= 0) setTimeout(() => showCombatText(`#monsters-lineup-container > div:nth-child(${di + 1}) img`, 'DODGE', 'miss'), 0);
        }
        logMessage(`[Miss] Attack on ${targetEnemy.name} missed!`, 'combat');
        if (runeN('focus') > 0) healPlayer(Math.floor(getDerivedStats().maxHp * runeN('focus') / 100), 'Focus');
        if (runeN('shieldRecovery') > 0) player.armor = Math.min(derived.maxArmor, player.armor + Math.floor(derived.maxArmor * runeN('shieldRecovery') / 100));
        if (runeN('patientStrike') > 0) player.runes.patientReady = true;
    }
    isFirstHitOfBattle = false;

    // ---- Kills ----
    // Split on death (Lv. 1 Giant Moss Slime): once dead, spawn slimes that keep the fight going
    monstersList.forEach(m => {
        if (m.hp > 0 || !m.splitOnDeath || m.splitDone) return;
        m.splitDone = true;
        logMessage(`[Split] ${m.name} splits into ${m.splitOnDeath} slimes!`, 'winlose');
        if (typeof showBossBalloon === 'function') showBossBalloon('Divide and Slime!');
        for (let i = 0; i < m.splitOnDeath; i++) {
            const slime = makeUnit(levelScaled(BASE_15.slime, activeMap.levelReq), stageMultiplier());
            monstersList.push({ ...slime, element: m.element, isBoss: false, isMiniBoss: false, rewarded: false });
        }
    });
    const newlyDead = monstersList.filter(m => m.hp <= 0 && !m.rewarded);
    if (runeN('killBlast') > 0 && newlyDead.length > 0) {
        const blast = Math.floor(derived.atk * runeN('killBlast') / 100) * newlyDead.length;
        getAliveMonsters().forEach(m => { m.hp -= blast; });
        logMessage(`[Shockwave] ${blast} damage to all monsters`, 'drop');
    }
    if (runeN('killStun') > 0 && newlyDead.length > 0) {
        getAliveMonsters().forEach(applyStunStatus);
        logMessage(`[Stun Burst] All enemies are stunned for 2 seconds!`, 'drop');
    }
    monstersList.forEach(m => { if (m.hp <= 0 && !m.rewarded) awardKill(m); });
    updateUI();

    alive = getAliveMonsters();
    if (alive.length === 0) {
        onStageCleared();
        return;
    }

    // ---- Monster turn (every living monster attacks) ----
    tickPlayerDebuffs();
    alive.forEach((m, i) => monsterAct(m, derived, i));
    monsterOpenerRound = false;

    monstersList.forEach(m => { if (m.hp <= 0 && !m.rewarded) awardKill(m); });
    if (getAliveMonsters().length === 0) {
        onStageCleared();
        return;
    }

    if (player.hp <= 0) {
        if (player.runes.angelOfDeath && !player.angelUsedThisRun) {
            player.angelUsedThisRun = true;
            player.hp = derived.maxHp;
            logMessage(`[Angel of Death] You rise again with full HP!`, 'levelup');
            updateUI();
            return;
        }
        if ((player.resurrectionPotions || 0) > 0 && !player.runes.resurrectionUsed && player.resurrectionOn !== false) {
            player.resurrectionPotions--;
            player.runes.resurrectionUsed = true;
            player.hp = derived.maxHp;
            logMessage(`[Resurrection] Resurrection Potion activated, restoring full HP! (${player.resurrectionPotions} left)`, 'winlose');
            updateUI();
            return;
        }

        clearInterval(combatInterval); combatRunId++;
        if (typeof resetMapRunes === 'function') resetMapRunes();
        logMessage(`[Defeat] You have been defeated... Returning to town`, 'winlose');
        startPlayerDeathAnim(); // the fall plays first
        setTimeout(() => { // the result waits 3 seconds
            player.hp = getDerivedStats().maxHp;
            updateUI();
            showModal("Expedition Failed", '', buildMapSummaryHTML('lose'), () => switchView('expeditions'));
        }, 3000);
    }
    updateUI();
}

// Time between stages: faster movement means a shorter run (3 m/s = 2 seconds)
// Time between stages: faster movement means a shorter walk. VIP skips the walk.
function stageDelay() {
    if (isVipActive()) return 300;
    if (runeN('swiftRun') > 0) return 1000;
    const mv = getDerivedStats().movementSpeed || 3;
    return Math.max(400, Math.round(6000 / mv));
}

function onStageCleared() {
    if (stageClearing) return;
    stageClearing = true;
    clearInterval(combatInterval); combatRunId++;
    logMessage(`[Stage Cleared] Stage ${currentStage} completed!`, 'drop');
    const sid = combatSessionId;

    // A boss stays on screen for its damaged and death animations (BOSS_DEATH_STAY_MS); the stage waits for that
    const bossStayLeft = monstersList.reduce((t, x) => (monsterIsBoss(x) && x.hp <= 0)
        ? Math.max(t, (x._deathAt || Date.now()) + BOSS_DEATH_STAY_MS - Date.now()) : t, 0);
    setTimeout(() => {
        if (sid !== combatSessionId) return; // player left combat before the stage ended
        const proceedNext = () => {
            if (sid !== combatSessionId) return;
            stageClearing = false;
            const nextBtn = document.getElementById('next-stage-btn');
            if (nextBtn) nextBtn.classList.add('hidden');
            currentStage++;

            if (currentMode === 'event' && currentStage > maxStages) {
                if (typeof resetMapRunes === 'function') resetMapRunes();
                logMessage(`[Event] ${activeMap.title} cleared!`, 'levelup');
                showModal("Event Cleared!", '', buildMapSummaryHTML('win', 'Return to Events'), () => switchView('events'));
                playSound('sound/mvp.mp3');
                updateUI();
                saveGame();
                return;
            }

            if (currentMode === 'campaign' && currentStage > maxStages) {
                if (typeof resetMapRunes === 'function') resetMapRunes();
                if (!player.clearedMaps) player.clearedMaps = {};
                const clearKey = `${currentPath}:${activeMap.dropKey}`;
                const firstClear = !player.clearedMaps[clearKey];
                player.clearedMaps[clearKey] = true;
                if (firstClear) {
                    const diamondBonus = 1;
                    player.diamonds += diamondBonus;
                    logMessage(`[First Clear] ${activeMap.title} cleared for the first time: +${diamondBonus} Diamond!`, 'levelup');
                }
                const pool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
                const template = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : { name: "Explorer's Blade", slot: "weapon", levelReq: 1, stats: { atk: 15 } };
                const reward = generatePoEItem(template, 3, 1);
                addItemToInventory(reward);

                showModal("Map Cleared!", '', buildMapSummaryHTML('win'), () => switchView('expeditions'));
                playSound('sound/mvp.mp3');
                return;
            }

            if (currentMode === 'daily' && currentStage > maxStages) {
                logMessage(`[Daily] Daily Challenge cleared! Gold chest awarded`, 'levelup');
                getEventState().dailyCleared = true;
                updateUI();
                saveGame();
                playSound('sound/mvp.mp3');
                openChest('gold');
                switchView('town');
                return;
            }

            const titleEl = document.getElementById('node-title');
            if (currentMode === 'endless') {
                if (titleEl) titleEl.innerText = `Void Tower — Wave ${currentStage}`;
            } else {
                if (titleEl) titleEl.innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages} ${isBossStage() ? '(Boss)' : ''}`;
            }

            // Layers and positions swap first; the stage's monsters and ticks start after that
            changeEarthLayers().then(() => {
                if (sid !== combatSessionId) return; // left combat while the next stage loaded
                combatInterval = setInterval(runCombatTick, Math.max(400, 2000 - (getDerivedStats().aspd * 10)));
                spawnStageMonsters();
            });
        };

        if (isRuneDueAfter(currentStage) && currentStage < maxStages) {
            checkRuneSelectionPrompt(proceedNext);
        } else {
            window.pendingStageProceed = proceedNext;
            if (isVipActive()) {
                proceedToNextStage();
                return;
            }
            const nextBtn = document.getElementById('next-stage-btn');
            if (nextBtn) nextBtn.classList.remove('hidden');
        }
    }, Math.max(stageDelay(), bossStayLeft));
}

function proceedToNextStage() {
    if (window.pendingStageProceed) {
        const cb = window.pendingStageProceed;
        window.pendingStageProceed = null;
        cb();
    }
}

function returnToTown() {
    clearInterval(combatInterval); combatRunId++;
    combatPaused = false;
    updatePauseButton();
    if (typeof resetMapRunes === 'function') resetMapRunes();
    const nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    switchView('town');
    logMessage(`[System] Safely returned to Haven of Dawn`, 'winlose');
}

// ---------- STAGE RESULT / PAUSE ----------
function newStageSummary(stage) {
    return { stage, gold: 0, baseExp: 0, jobExp: 0, items: [], runes: [], log: [] };
}

function recordStageLog(msg, type) {
    if (stageSummary) stageSummary.log.push({ msg, type });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function logClassFor(type) {
    return type === 'combat' ? "text-red-400" : (type === 'winlose' ? "text-blue-400 font-bold" : (type === 'drop' ? "text-yellow-400 font-bold" : (type === 'levelup' ? "text-purple-400 font-bold" : "text-slate-300")));
}

function buildMapSummaryHTML(kind, returnLabel = 'Return to Expedition Gates') {
    const s = stageSummary || newStageSummary(currentStage);
    const label = escapeHtml(kind === 'win' && activeMap ? activeMap.title : (document.getElementById('node-title')?.innerText || `Stage ${s.stage}`));
    const fmt = n => Number(n).toLocaleString();
    const card = (title, value, cls) => `<div class="bg-slate-950 border border-slate-800 rounded-xl p-2 text-center min-w-0"><div class="text-[10px] text-slate-500 uppercase">${title}</div><div class="text-sm font-bold font-mono truncate ${cls}">${value}</div></div>`;
    const section = (title, count, body, open = true) => `<details ${open ? 'open' : ''} class="bg-slate-950 border border-slate-800 rounded-xl p-3"><summary class="cursor-pointer text-xs font-bold text-slate-300 select-none">${title} <span class="text-slate-500">(${count})</span></summary><div class="mt-2 text-[11px] text-slate-300 flex flex-col gap-1">${body}</div></details>`;
    const itemBody = s.items.length ? s.items.map(i => `<div><span class="${(RARITY_INFO[i.rarity] || RARITY_INFO[1]).text}">${escapeHtml(i.name)}</span> <span class="text-slate-500">(Rarity ${i.rarity})</span></div>`).join('') : '<div class="text-slate-500">No item dropped</div>';
    const runeBody = s.runes.length ? s.runes.map(r => `<div class="${(RARITY_INFO[r.rarity] || RARITY_INFO[1]).text}">${escapeHtml(r.text)}</div>`).join('') : '<div class="text-slate-500">No rune picked</div>';
    const logBody = s.log.length ? `<div class="max-h-48 overflow-y-auto font-mono text-[10px] flex flex-col gap-0.5">${s.log.map(l => `<div class="${logClassFor(l.type)}">${l.msg}</div>`).join('')}</div>` : '<div class="text-slate-500">No log</div>';
    const statCards = (kind === 'win')
        ? card('Gold', `+${fmt(s.gold)}`, 'text-yellow-300') + card('Items', s.items.length, 'text-amber-300') + card('Base EXP', `+${fmt(s.baseExp)}`, 'text-blue-300') + card('Job EXP', `+${fmt(s.jobExp)}`, 'text-purple-300')
        : card('Killed by', escapeHtml(lastHitBy || 'Unknown'), 'text-red-300') + card('Stage Died', `Stage ${currentStage}${currentMode !== 'endless' && maxStages < 999 ? ' / ' + maxStages : ''}`, 'text-slate-200') + card('Base EXP', `+${fmt(s.baseExp)}`, 'text-blue-300') + card('Job EXP', `+${fmt(s.jobExp)}`, 'text-purple-300') + card('Gold', `+${fmt(s.gold)}`, 'text-yellow-300');
    const title = kind === 'win'
        ? `<h3 class="font-bold text-sm text-emerald-300">Map Cleared</h3>`
        : `<h3 class="font-bold text-sm text-red-300">Defeated</h3>`;
    const sections = kind === 'win'
        ? section('Item Drop', s.items.length, itemBody) + section('Rune Picked', s.runes.length, runeBody) + section('Fight Log', s.log.length, logBody, false)
        : section('Fight Log', s.log.length, logBody, false) + section('Item Drop', s.items.length, itemBody) + section('Rune Picked', s.runes.length, runeBody);
    const footer = `<button onclick="closeModal()" class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer">${escapeHtml(returnLabel)}</button>`;
    return `<div class="flex flex-col gap-3 text-left">${title}<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${statCards}</div><div class="flex flex-col gap-2">${sections}</div>${footer}</div>`;
}

function toggleCombatPause() {
    if (!isVipActive()) return;
    combatPaused = !combatPaused;
    updatePauseButton();
    logMessage(combatPaused ? '[System] Combat paused' : '[System] Combat resumed', 'winlose');
}

function updatePauseButton() {
    const btn = document.getElementById('combat-pause-btn');
    if (!btn) return;
    btn.classList.toggle('hidden', !isVipActive());
    btn.innerText = combatPaused ? 'Resume' : 'Pause';
    btn.classList.toggle('bg-amber-600', combatPaused);
    btn.classList.toggle('text-slate-950', combatPaused);
}

// ---------- EVENTS ----------
// Each event allows 3 plays per day (per event). Daily Challenge also locks once cleared that day.
const EVENT_LIMIT = 3;
const EVENT_CONFIG = {
    gold: { name: "Gold Frenzy", desc: "Monsters at x1.5 HP and damage. Gold x2, but no EXP. No item drops." },
    xp: { name: "Wisdom Trial", desc: "Monsters at x1.5 HP and damage. Base and Class EXP x2, but no Gold. No item drops." }
};
const EVENT_MAPS = {
    gold: [
        { mapKey: 'map10', label: 'Map 1', sub: 'Campaign Lv. 10' },
        { mapKey: 'map30', label: 'Map 2', sub: 'Campaign Lv. 30' },
        { mapKey: 'map50', label: 'Map 3', sub: 'Campaign Lv. 50' }
    ],
    xp: [
        { mapKey: 'map10', label: 'Map 1', sub: 'Campaign Lv. 10' },
        { mapKey: 'map30', label: 'Map 2', sub: 'Campaign Lv. 30' },
        { mapKey: 'map50', label: 'Map 3', sub: 'Campaign Lv. 50' }
    ]
};

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Resets the play counters when the date changes
function getEventState() {
    if (!player.events || player.events.date !== todayKey()) {
        player.events = { date: todayKey(), plays: { daily: 0, gold: 0, xp: 0 }, dailyCleared: false };
    }
    return player.events;
}

function eventCanPlay(kind) {
    const st = getEventState();
    if (kind === 'daily' && st.dailyCleared) return false;
    return st.plays[kind] < EVENT_LIMIT;
}

// Campaign-style map with the event modifiers applied to every enemy
function buildEventMap(kind, mapKey) {
    const base = GAME_DATA.maps[mapKey];
    const scale = t => ({
        ...t,
        hp: Math.floor(t.hp * 1.5),
        maxHp: Math.floor(t.maxHp * 1.5),
        atkMin: Math.floor(t.atkMin * 1.5),
        atkMax: Math.floor(t.atkMax * 1.5)
    });
    return {
        title: `${EVENT_CONFIG[kind].name} — ${base.title}`,
        dropKey: base.dropKey,
        levelReq: base.levelReq,
        maxStages: base.campaignStages || 11,
        miniStage: base.miniStage,
        bossSupport: base.bossSupport,
        enemies: base.enemies.map(scale),
        boss: base.boss ? scale(base.boss) : null,
        miniBoss: base.miniBoss ? scale(base.miniBoss) : null
    };
}

function startEvent(kind, mapKey) {
    if (kind === 'daily') {
        if (!eventCanPlay('daily')) {
            showModal("Daily Challenge", getEventState().dailyCleared ? "Already cleared today. Come back tomorrow." : `No plays left today (${EVENT_LIMIT} per day).`);
            return;
        }
        getEventState().plays.daily++;
        saveGame();
        startExpedition('daily');
        return;
    }
    if (!eventCanPlay(kind)) {
        showModal(EVENT_CONFIG[kind].name, `No plays left today (${EVENT_LIMIT} per day).`);
        return;
    }
    getEventState().plays[kind]++;
    saveGame();
    startExpedition('event', { kind, mapKey });
}


// Leaving combat restores HP and armor
function restoreAfterCombat() {
    combatSessionId++;
    if (!player.inCombat) return;
    player.inCombat = false;
    if (combatInterval) clearInterval(combatInterval); combatRunId++;
    const d = getDerivedStats();
    player.hp = d.maxHp;
    player.armor = d.maxArmor;
}

// ---------- VIP ----------
function isVipActive() {
    return (player.vipUntil || 0) > Date.now();
}

// VIP gives one Resurrection Potion by mail each day
function grantVipDailyMail() {
    if (!isVipActive()) return false;
    if (player.vipLastMail === todayKey()) return false;
    player.vipLastMail = todayKey();
    if (!player.mailBox) player.mailBox = [];
    player.mailBox.unshift({ id: Date.now(), title: "VIP Daily Reward", sender: "VIP Office", message: "Your VIP Pass grants 1 Resurrection Potion today.", rewards: { resurrection: 1 }, claimed: false });
    return true;
}
