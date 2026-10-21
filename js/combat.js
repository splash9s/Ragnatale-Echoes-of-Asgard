// ==========================================
// RAGNATALE - COMBAT.JS
// ==========================================

let currentMode = 'campaign';
let activeMap = null;
let currentStage = 1;
let maxStages = 11;
let combatInterval = null;
let monstersList = [];
let isFirstHitOfBattle = true;
let battlePlayerHits = 0;
let battleFirstDamageTaken = false;
let stageRuneUses = { fullHeal: 0, fullArmor: 0 };
let attackCount = 0;
let critStreak = 0;
let stageClearing = false;
let currentEvent = null; // 'gold' | 'xp' while in an event

// Skills have no effect in the Daily Challenge
function skillLvl(name) {
    if (currentMode === 'daily') return 0;
    return player.skills[name]?.level || 0;
}

const DAILY_TOTAL_STAGES = 31;
const DAILY_BOSS_STAGES = [11, 21, 31];
const BOSS_HP_MULT = 1.25;
const BOSS_ATK_MULT = 1.2;

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
    return Object.keys(GAME_DATA.maps).sort((a, b) => GAME_DATA.maps[a].levelReq - GAME_DATA.maps[b].levelReq);
}

function getPrereqMapKey(key) {
    const order = getMapOrder();
    const idx = order.indexOf(key);
    return idx > 0 ? order[idx - 1] : null;
}

function isMapUnlocked(key) {
    const order = getMapOrder();
    const idx = order.indexOf(key);
    if (idx === -1) return false;
    if (idx === 0) return true; // first campaign map: no condition
    return !!(player.clearedMaps && player.clearedMaps[order[idx - 1]]);
}

// ---------- RUNES ----------
// rarity 1..5 changes how often a rune is offered. flag = one-time rune.
const RUNE_RARITY_WEIGHT = { 1: 40, 2: 25, 3: 18, 4: 12, 5: 5 };

const RUNE_DEFS = {
    critBonus: { name: "Berserk Rune", rarity: 1, add: 15, desc: "+15% Critical Rate", text: v => `+${v}% Critical Rate` },
    dodge: { name: "Dodge Rune", rarity: 1, add: 10, desc: "+10% Dodge chance", text: v => `+${v}% Dodge chance` },
    swiftRun: { name: "Swift Feet Rune", rarity: 1, add: 1, desc: "Run faster: +1 movement speed (shorter gap between stages)", text: v => `+${v} movement speed (shorter gap between stages)` },
    focus: { name: "Focus Rune", rarity: 1, add: 30, desc: "Missed attacks restore 30 HP", text: v => `Missed attacks restore ${v} HP` },
    maxHpBonus: { name: "Vitality Rune", rarity: 2, add: 200, desc: "+200 Max HP", text: v => `+${v} Max HP`,
        onApply: () => { player.hp = Math.min(getDerivedStats().maxHp, player.hp + 200); } },
    firstHitBonus: { name: "Stunning Strike Rune", rarity: 2, add: 50, desc: "+50 Bonus Damage on First Hit", text: v => `+${v} Bonus Damage on First Hit` },
    randomHitCount: { name: "Chaos Rune", rarity: 2, add: 1, desc: "Attacks have a 50% chance to strike random targets", text: v => `50% chance to strike random targets (x${v})` },
    thorn: { name: "Thorn Rune", rarity: 2, add: 10, desc: "Reflect 10% of melee damage taken", text: v => `Reflect ${v}% of melee damage taken` },
    critHeal: { name: "Critical Heal Rune", rarity: 2, add: 40, desc: "Critical hits restore 40 HP", text: v => `Critical hits restore ${v} HP` },
    lifeline: { name: "Lifeline Rune", rarity: 2, add: 100, desc: "First damage each battle restores 100 HP", text: v => `First damage each battle restores ${v} HP` },
    fortify: { name: "Fortify Rune", rarity: 2, add: 20, desc: "Every 3rd attack restores 20 armor", text: v => `Every 3rd attack restores ${v} armor` },
    evasion: { name: "Evasion Rune", rarity: 2, add: 40, desc: "Dodging restores 40 HP", text: v => `Dodging restores ${v} HP` },
    alwaysCritFirst: { name: "Assassination Rune", rarity: 3, flag: true, desc: "First hit of every battle is always a Critical Hit", text: () => "First hit of every battle is Critical" },
    vampire: { name: "Vampire Rune", rarity: 3, add: 5, desc: "Heal 5% of damage dealt", text: v => `Heal ${v}% of damage dealt` },
    divineLight: { name: "Divine Light Rune", rarity: 3, add: 100, desc: "Every 3rd attack deals +100% ATK bonus damage", text: v => `Every 3rd attack deals +${v}% ATK bonus damage` },
    momentum: { name: "Momentum Rune", rarity: 3, add: 80, desc: "2 critical hits in a row restore 80 HP", text: v => `2 critical hits in a row restore ${v} HP` },
    retribution: { name: "Retribution Rune", rarity: 3, add: 60, desc: "Healing deals 60 damage to a random monster", text: v => `Healing deals ${v} damage to a random monster` },
    backlineBreaker: { name: "Backline Breaker Rune", rarity: 3, flag: true, desc: "Every 2nd attack hits the 2nd monster for double damage", text: () => "Every 2nd attack hits the 2nd monster for double damage" },
    killBlast: { name: "Shockwave Rune", rarity: 4, add: 50, desc: "Killing a monster deals 50% ATK to all others", text: v => `Killing a monster deals ${v}% ATK to all others` },
    elementIgnore: { name: "Void Rune", rarity: 4, flag: true, desc: "Ignore monster elements", text: () => "Ignore monster elements" },
    bulwark: { name: "Bulwark Rune", rarity: 4, add: 1, desc: "Instantly fully restore armor when picked", text: v => `Instantly fully restore armor when picked (x${v})`, onApply: () => { player.armor = getDerivedStats().maxArmor; } },
    lastStand: { name: "Last Stand Rune", rarity: 5, add: 1, desc: "Instantly fully restore HP when picked", text: v => `Instantly fully restore HP when picked (x${v})`, onApply: () => { player.hp = getDerivedStats().maxHp; } },
    angelOfDeath: { name: "Angel of Death Rune", rarity: 5, flag: true, desc: "Once per run, when you die, restore full HP", text: () => "Once per run: revive at full HP on death" }
};

function getRuneOwnedCount(id) {
    return (player.currentRunRunes || []).filter(r => r.id === id).length;
}

function isRuneOffered(id) {
    const def = RUNE_DEFS[id];
    if (!def) return false;
    return def.flag ? getRuneOwnedCount(id) === 0 : true;
}

function applyRune(id) {
    const def = RUNE_DEFS[id];
    if (def.flag) player.runes[id] = true;
    else player.runes[id] = (player.runes[id] || 0) + def.add;
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
    const choices = pickWeightedRunes(pool, 3);

    let html = `<p class="text-xs text-slate-300 mb-2">Stage ${currentStage} cleared! Select a mystical Rune blessing for this expedition:</p><div class="flex flex-col gap-2">`;
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
    html += `</div>`;
    window.runeCallback = onCompleteCallback;
    showModal("Choose a Rune Blessing", "", html);
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
    if (mode === 'campaign') {
        const selectEl = document.getElementById('campaign-map-select');
        const mapKey = selectEl ? selectEl.value : 'map1';
        const mapObj = typeof GAME_DATA !== 'undefined' ? GAME_DATA.maps[mapKey] : null;
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
    attackCount = 0;
    stageClearing = false;
    const derived = getDerivedStats();
    player.hp = derived.maxHp;
    player.armor = derived.maxArmor;

    const nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    const tagEl = document.getElementById('node-mode-tag');
    const titleEl = document.getElementById('node-title');

    if (mode === 'campaign') {
        const mapKey = document.getElementById('campaign-map-select').value;
        activeMap = GAME_DATA.maps[mapKey];
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
            title: "Endless Void Tower",
            dropKey: 'map50',
            maxStages: 999,
            enemies: (typeof GAME_DATA !== 'undefined' && GAME_DATA.maps?.map1?.enemies) ? [...GAME_DATA.maps.map1.enemies] : [{ name: "Shadow Poring", hp: 80, maxHp: 80, atkMin: 12, atkMax: 18, hit: 110, flee: 100, baseExp: 50, jobExp: 35, gold: 80 }],
            boss: { name: "Void Lord", hp: 1500, maxHp: 1500, atkMin: 50, atkMax: 80, hit: 150, flee: 130, baseExp: 500, jobExp: 400, gold: 1000, isBoss: true }
        };
        currentStage = 1;
        maxStages = 999;
        if (tagEl) tagEl.innerText = "Endless Mode";
        if (titleEl) titleEl.innerText = `Void Tower — Wave ${currentStage}`;
        logMessage(`[Expedition] Entering Endless Void Tower...`, 'winlose');
    }

    switchView('combat');
    spawnStageMonsters();

    if (combatInterval) clearInterval(combatInterval);
    combatInterval = setInterval(runCombatTick, Math.max(400, 2000 - (derived.aspd * 10)));
}

// ---------- STAGE / BOSS ----------
function isBossStage() {
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
    return GAME_DATA.maps[key].enemies;
}

// Bosses are stronger than their template and use the boss skills in monsterAct()
function makeBoss(t) {
    return {
        ...t,
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
    const derived = getDerivedStats();
    player.armor = derived.maxArmor;
    monstersList = [];

    if (isBossStage()) {
        const boss = makeBoss(getBossTemplate());
        monstersList.push(boss);
        logMessage(`[Boss] ${boss.name} appears! Skills: Enrage (below 35% HP, +50% ATK), Heavy Strike (every 4th attack, x2 damage), Regeneration (1.5% HP per turn).`, 'winlose');
    } else {
        const pool = currentMode === 'daily' ? getDailyEnemyPool() : (activeMap && activeMap.enemies) || [];
        if (pool.length > 0) {
            const count = Math.floor(Math.random() * 3) + 1;
            const mult = currentMode === 'endless' ? 1 + (currentStage * 0.08) : 1 + ((currentStage - 1) * 0.12);
            for (let i = 0; i < count; i++) {
                const template = pool[Math.floor(Math.random() * pool.length)];
                monstersList.push({
                    ...template,
                    hp: Math.floor(template.hp * mult),
                    maxHp: Math.floor(template.maxHp * mult),
                    atkMin: Math.floor(template.atkMin * mult),
                    atkMax: Math.floor(template.atkMax * mult),
                    hit: Math.floor(template.hit * (1 + (currentStage * 0.02))),
                    flee: Math.floor(template.flee * (1 + (currentStage * 0.02))),
                    isBoss: false,
                    rewarded: false,
                    ailments: {}
                });
            }
        }
    }
    updateUI();
}

function getAliveMonsters() {
    return monstersList.filter(m => m.hp > 0);
}

function updateQuestProgress(type, amount) {
    if (!player.dailyQuests) return;
    player.dailyQuests.forEach(q => {
        if (!q.completed) {
            if ((type === 'porings' && q.id === 'q_porings') ||
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
    const isEvent = currentMode === 'event';
    const derived = getDerivedStats();
    let finalGold = Math.floor(((m.gold / 4) * (1 + (skillLvl('moneyDrop') * 0.01))) * derived.goldMultiplier);
    let baseExpGain = m.baseExp;
    let jobExpGain = m.jobExp;
    if (isEvent && currentEvent === 'gold') finalGold *= 2;
    if (isEvent && currentEvent === 'xp') { baseExpGain *= 2; jobExpGain *= 2; }

    logMessage(`[Victory] Defeated ${m.name}! Gained ${baseExpGain} Base EXP, ${jobExpGain} Job EXP and <span style="color: yellow;">${finalGold} Zeny</span>`, 'winlose');
    player.gold += finalGold;
    player.baseExp += baseExpGain;
    player.jobExp += jobExpGain;

    updateQuestProgress('porings', 1);
    updateQuestProgress('gold', finalGold);

    if (player.baseExp >= player.baseMaxExp) {
        player.baseLv++;
        player.baseExp -= player.baseMaxExp;
        player.baseMaxExp = Math.floor(player.baseMaxExp * 1.35);
        player.statPoints += 3;
        logMessage(`[BASE LEVEL UP!] Reached Base Level ${player.baseLv}! Gained 3 Stat Points`, 'levelup');
        playSound('sound/lvup.wav');
    }

    if (player.jobExp >= player.jobMaxExp) {
        player.jobLv++;
        player.jobExp -= player.jobMaxExp;
        player.jobMaxExp = Math.floor(player.jobMaxExp * 1.3);
        player.jobSp += 1;
        logMessage(`[JOB LEVEL UP!] Reached Job Level ${player.jobLv}! Gained 1 SP`, 'levelup');
    }

    // Events give no item drops
    if (isEvent) return;

    const pool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
    if (!m.isBoss && pool.length > 0 && Math.random() < 0.05) {
        const template = pool[Math.floor(Math.random() * pool.length)];
        const droppedItem = generatePoEItem(template);
        logMessage(`[Monster Drop] ${m.name} dropped <span style="color: yellow;">${droppedItem.name} (Rarity ${droppedItem.rarity})</span>!`, 'drop');
        addItemToInventory(droppedItem);
    }
    if (m.isBoss && pool.length > 0) {
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
    if (gained <= 0) return;
    logMessage(`[Heal] ${source} restores ${gained} HP`, 'drop');
    triggerRetribution(gained, source);
}

// Retribution: every heal strikes a random monster for the rune's damage
function triggerRetribution(amount, source) {
    const dmg = runeN('retribution');
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


function onPlayerDodged(m, source) {
    logMessage(`[Dodge] You evaded ${m.name}'s attack! (${source})`, 'combat');
    if (runeN('evasion') > 0) healPlayer(runeN('evasion'), 'Evasion');
}

// Armor absorbs damage first, the rest goes to HP
// Armor absorbs damage first, the rest goes to HP
function takePlayerDamage(dmg, m) {
    let remaining = dmg;
    let absorbed = 0;
    if (player.armor > 0) {
        absorbed = Math.min(player.armor, remaining);
        player.armor -= absorbed;
        remaining -= absorbed;
    }
    if (remaining > 0) player.hp -= remaining;
    logMessage(`[Combat] ${m.name} hits you for ${dmg} damage${absorbed ? ` (${absorbed} absorbed by armor)` : ''}`, 'combat');

    if (!battleFirstDamageTaken) {
        battleFirstDamageTaken = true;
        if (runeN('lifeline') > 0) healPlayer(runeN('lifeline'), 'Lifeline');
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
    }
}

function monsterAct(m, derived) {
    if (player.hp <= 0 || m.hp <= 0) return;
    if (m.isBoss) bossTurnStart(m);
    if (m.ailments?.frozen && Math.random() < 0.5) {
        logMessage(`[Freeze] ${m.name} is frozen and cannot attack!`, 'winlose');
        return;
    }
    if (m.isBoss) m.attackCount = (m.attackCount || 0) + 1;

    const hitChance = Math.min(0.95, Math.max(0.2, (m.hit - derived.flee + 80) / 100));
    if (Math.random() <= hitChance) {
        if (runeN('dodge') > 0 && Math.random() * 100 < runeN('dodge')) {
            onPlayerDodged(m, 'Dodge Rune');
            return;
        }
        let eDmg = Math.max(1, Math.floor(Math.random() * (m.atkMax - m.atkMin + 1)) + m.atkMin - derived.def);
        if (m.isBoss && m.enraged) eDmg = Math.floor(eDmg * 1.5);
        if (m.isBoss && m.attackCount % 4 === 0) {
            eDmg = Math.floor(eDmg * 2);
            logMessage(`[Boss Skill] ${m.name} uses Heavy Strike!`, 'winlose');
        }
        takePlayerDamage(eDmg, m);
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
    const derived = getDerivedStats();
    let alive = getAliveMonsters();
    if (alive.length === 0) {
        monstersList.forEach(m => { if (m.hp <= 0 && !m.rewarded) awardKill(m); });
        if (monstersList.length > 0) onStageCleared();
        return;
    }
    if (player.hp <= 0) return;

    attackCount++;

    // ---- Player attack ----
    let targetEnemy = alive[0];
    if (runeN('randomHitCount') > 0 && alive.length > 1 && Math.random() < 0.5) {
        targetEnemy = alive[Math.floor(Math.random() * alive.length)];
    }

    if (runeN('fortify') > 0 && attackCount % 3 === 0) {
        player.armor = Math.min(derived.maxArmor, player.armor + runeN('fortify'));
        logMessage(`[Rune] Fortify restores ${runeN('fortify')} armor`, 'drop');
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

    const hitChance = Math.min(0.95, Math.max(0.2, (derived.hit - targetEnemy.flee + 80) / 100));
    if (Math.random() <= hitChance) {
        const bonusDmg = skillLvl('crushing') * 3 + (isFirstHitOfBattle ? runeN('firstHitBonus') : 0);
        const elemMult = player.runes.elementIgnore ? 1 : getElementMultiplier(player.equipped.weapon?.element, targetEnemy.element);
        if (elemMult !== 1 && !player.runes.elementIgnore) {
            logMessage(`[Element] ${elemMult > 1 ? 'Advantage' : 'Resisted'} x${elemMult} vs ${targetEnemy.name}`, elemMult > 1 ? 'drop' : 'combat');
        }
        let pDmg = Math.floor((derived.atk + bonusDmg) * elemMult);
        if (player.runes.backlineBreaker && alive.indexOf(targetEnemy) > 0) {
            pDmg *= 2;
            logMessage(`[Backline Breaker] Double damage to ${targetEnemy.name} behind the front line!`, 'drop');
        }
        if (attackCount % 3 === 0 && runeN('divineLight') > 0) {
            const extra = Math.floor(derived.atk * runeN('divineLight') / 100);
            pDmg += extra;
            logMessage(`[Divine Light] +${extra} bonus damage`, 'levelup');
        }

        const isCrit = (isFirstHitOfBattle && player.runes.alwaysCritFirst) || (Math.random() * 100 < derived.crit);
        if (isCrit) {
            pDmg = Math.floor(pDmg * 1.5);
            updateQuestProgress('crit', 1);
            playSound('sound/critical.wav');
            logMessage(`[Critical!] Attacked ${targetEnemy.name} for critical ${pDmg} damage!`, 'combat');
            if (Math.random() < 0.3) {
                targetEnemy.ailments.ignite = true;
                logMessage(`[Ignite] Your critical strike set ${targetEnemy.name} ablaze!`, 'drop');
            }
            critStreak++;
            if (runeN('critHeal') > 0) healPlayer(runeN('critHeal'), 'Critical Heal');
            if (critStreak >= 2) {
                critStreak = 0;
                if (runeN('momentum') > 0) healPlayer(runeN('momentum'), 'Momentum');
            }
        } else {
            critStreak = 0;
            playSound('sound/hit.wav');
            logMessage(`[Attack] Hit ${targetEnemy.name} for ${pDmg} damage`, 'combat');
            if (Math.random() < 0.15) {
                targetEnemy.ailments.poison = true;
                logMessage(`[Poison] You poisoned ${targetEnemy.name}!`, 'drop');
            }
        }
        targetEnemy.hp -= pDmg;
        battlePlayerHits++;
        if (runeN('vampire') > 0) healPlayer(Math.floor(pDmg * runeN('vampire') / 100), 'Vampire');
    } else {
        critStreak = 0;
        logMessage(`[Miss] Attack on ${targetEnemy.name} missed!`, 'combat');
        if (runeN('focus') > 0) healPlayer(runeN('focus'), 'Focus');
    }
    isFirstHitOfBattle = false;

    // ---- Kills ----
    const newlyDead = monstersList.filter(m => m.hp <= 0 && !m.rewarded);
    if (runeN('killBlast') > 0 && newlyDead.length > 0) {
        const blast = Math.floor(derived.atk * runeN('killBlast') / 100);
        getAliveMonsters().forEach(m => { m.hp -= blast; });
        logMessage(`[Shockwave] ${blast} damage to all monsters`, 'drop');
    }
    monstersList.forEach(m => { if (m.hp <= 0 && !m.rewarded) awardKill(m); });
    updateUI();

    alive = getAliveMonsters();
    if (alive.length === 0) {
        onStageCleared();
        return;
    }

    // ---- Monster turn (front three attack) ----
    alive.slice(0, 3).forEach(m => monsterAct(m, derived));

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
        if ((player.resurrectionPotions || 0) > 0 && !player.runes.resurrectionUsed) {
            player.resurrectionPotions--;
            player.runes.resurrectionUsed = true;
            player.hp = derived.maxHp;
            logMessage(`[Resurrection] Resurrection Potion activated, restoring full HP! (${player.resurrectionPotions} left)`, 'winlose');
            updateUI();
            return;
        }

        clearInterval(combatInterval);
        if (typeof resetMapRunes === 'function') resetMapRunes();
        logMessage(`[Defeat] You have been defeated... Returning to town`, 'winlose');
        player.hp = derived.maxHp;
        showModal("Expedition Failed", "Consciousness fades... Returning to town.", '', () => switchView('town'));
    }
    updateUI();
}

// Time between stages: faster movement means a shorter run (3 m/s = 2 seconds)
function stageDelay() {
    const mv = getDerivedStats().movementSpeed || 3;
    return Math.max(400, Math.round(6000 / mv));
}

function onStageCleared() {
    if (stageClearing) return;
    stageClearing = true;
    clearInterval(combatInterval);
    logMessage(`[Stage Cleared] Stage ${currentStage} completed!`, 'drop');

    setTimeout(() => {
        const proceedNext = () => {
            stageClearing = false;
            const nextBtn = document.getElementById('next-stage-btn');
            if (nextBtn) nextBtn.classList.add('hidden');
            currentStage++;

            if (currentMode === 'event' && currentStage > maxStages) {
                if (typeof resetMapRunes === 'function') resetMapRunes();
                logMessage(`[Event] ${activeMap.title} cleared!`, 'levelup');
                showModal("Event Cleared!", `${activeMap.title} cleared!`, '', () => switchView('events'));
                playSound('mvp.wav');
                updateUI();
                saveGame();
                return;
            }

            if (currentMode === 'campaign' && currentStage > maxStages) {
                if (typeof resetMapRunes === 'function') resetMapRunes();
                if (!player.clearedMaps) player.clearedMaps = {};
                player.clearedMaps[activeMap.dropKey] = true;
                const pool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
                const template = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : { name: "Explorer's Blade", slot: "weapon", levelReq: 1, stats: { atk: 15 } };
                const reward = generatePoEItem(template, 3, 1);
                addItemToInventory(reward);

                showModal("Map Cleared!", `Conquered ${activeMap.title}!\n\nReward: ${reward.name}`, '', () => switchView('town'));
                playSound('mvp.wav');
                return;
            }

            if (currentMode === 'daily' && currentStage > maxStages) {
                logMessage(`[Daily] Daily Challenge cleared! Gold chest awarded`, 'levelup');
                getEventState().dailyCleared = true;
                updateUI();
                saveGame();
                playSound('mvp.wav');
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

            combatInterval = setInterval(runCombatTick, Math.max(400, 2000 - (getDerivedStats().aspd * 10)));
            spawnStageMonsters();
        };

        if ((currentMode === 'campaign' || currentMode === 'daily' || currentMode === 'event') && currentStage % 5 === 0) {
            checkRuneSelectionPrompt(proceedNext);
        } else {
            window.pendingStageProceed = proceedNext;
            const nextBtn = document.getElementById('next-stage-btn');
            if (nextBtn) nextBtn.classList.remove('hidden');
        }
    }, stageDelay());
}

function proceedToNextStage() {
    if (window.pendingStageProceed) {
        const cb = window.pendingStageProceed;
        window.pendingStageProceed = null;
        cb();
    }
}

function returnToTown() {
    clearInterval(combatInterval);
    if (typeof resetMapRunes === 'function') resetMapRunes();
    const nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    switchView('town');
    logMessage(`[System] Safely returned to Haven of Dawn`, 'winlose');
}

// ---------- EVENTS ----------
// Each event allows 3 plays per day (per event). Daily Challenge also locks once cleared that day.
const EVENT_LIMIT = 3;
const EVENT_CONFIG = {
    gold: { name: "Gold Rush", desc: "Campaign maps with monsters at x1.5 HP and damage. Zeny x2. No item drops." },
    xp: { name: "XP Farm", desc: "Campaign maps with monsters at x1.5 HP and damage. Base and Job EXP x2. No item drops." }
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
        maxStages: base.maxStages,
        enemies: base.enemies.map(scale),
        boss: base.boss ? scale(base.boss) : null
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
