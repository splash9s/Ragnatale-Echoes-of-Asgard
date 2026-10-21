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
let lastPotionDrinkTime = 0;

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

// ---------- MAP PROGRESSION ----------
// Maps are ordered by level. Each map unlocks only after the previous one is cleared.
function getMapOrder() {
    if (typeof GAME_DATA === 'undefined') return [];
    return Object.keys(GAME_DATA.maps)
        .filter(k => GAME_DATA.maps[k].released !== false)
        .sort((a, b) => GAME_DATA.maps[a].levelReq - GAME_DATA.maps[b].levelReq);
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

function startExpedition(mode) {
    if (mode === 'campaign') {
        let selectEl = document.getElementById('campaign-map-select');
        let mapKey = selectEl ? selectEl.value : 'map1';
        let mapObj = typeof GAME_DATA !== 'undefined' ? GAME_DATA.maps[mapKey] : null;
        if (typeof GAME_DATA === 'undefined' || !mapObj) {
            showModal("Map Error", "Map data is not loaded. Check that monsters.js and maps.js are included in index.html.");
            return;
        }
        if (!isMapUnlocked(mapKey)) {
            showModal("Map Locked", "Clear the previous map first to unlock this expedition!");
            return;
        }
    }

    if (typeof resetMapRunes === 'function') resetMapRunes();
    player.currentRunRunes = [];
    currentMode = mode;
    let derived = getDerivedStats();
    player.hp = derived.maxHp;

    let nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) nextBtn.classList.add('hidden');

    if (currentMode === 'campaign') {
        let selectEl = document.getElementById('campaign-map-select');
        let mapKey = selectEl ? selectEl.value : 'map1';
        activeMap = GAME_DATA.maps[mapKey];
        currentStage = 1;
        maxStages = activeMap.maxStages || 11;

        let tagEl = document.getElementById('node-mode-tag');
        if (tagEl) tagEl.innerText = "Campaign Mode";
        let titleEl = document.getElementById('node-title');
        if (titleEl) titleEl.innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages}`;
        logMessage(`[Expedition] Entering ${activeMap.title} (Campaign)...`, 'winlose');
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

        let tagEl = document.getElementById('node-mode-tag');
        if (tagEl) tagEl.innerText = "Endless Mode";
        let titleEl = document.getElementById('node-title');
        if (titleEl) titleEl.innerText = `Void Tower — Wave ${currentStage}`;
        logMessage(`[Expedition] Entering Endless Void Tower...`, 'winlose');
    }

    switchView('combat');
    spawnStageMonsters();

    if (combatInterval) clearInterval(combatInterval);
    let intervalTime = Math.max(400, 2000 - (derived.aspd * 10));
    combatInterval = setInterval(runCombatTick, intervalTime);
}

function spawnStageMonsters() {
    isFirstHitOfBattle = true;
    monstersList = [];

    if (currentMode === 'campaign' && currentStage === maxStages && activeMap.boss) {
        monstersList.push({ ...activeMap.boss, rewarded: false, ailments: {} });
    } else if (activeMap && activeMap.enemies && activeMap.enemies.length > 0) {
        let count = Math.floor(Math.random() * 3) + 1;
        let mult = currentMode === 'endless' ? 1 + (currentStage * 0.08) : 1 + ((currentStage - 1) * 0.12);
        for (let i = 0; i < count; i++) {
            let template = activeMap.enemies[Math.floor(Math.random() * activeMap.enemies.length)];
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
    let derived = getDerivedStats();
    let finalGold = Math.floor(((m.gold / 4) * (1 + (player.skills.moneyDrop?.level * 0.01 || 0))) * derived.goldMultiplier);
    
    logMessage(`[Victory] Defeated ${m.name}! Gained ${m.baseExp} Base EXP, ${m.jobExp} Job EXP and <span style="color: yellow;">${finalGold} Zeny</span>`, 'winlose');
    player.gold += finalGold;
    player.baseExp += m.baseExp;
    player.jobExp += m.jobExp;

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
	
    if (!m.isBoss && Math.random() < 0.05) {
        let dropPool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
        if (dropPool.length > 0) {
            let template = dropPool[Math.floor(Math.random() * dropPool.length)];
            let droppedItem = generatePoEItem(template);
            logMessage(`[Monster Drop] ${m.name} dropped <span style="color: yellow;">${droppedItem.name} (Rarity ${droppedItem.rarity})</span>!`, 'drop');
            addItemToInventory(droppedItem);
        }
    }
    if (m.isBoss) {
        let pool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
        if (pool.length > 0) {
            let template = pool[Math.floor(Math.random() * pool.length)];
            let droppedItem = generatePoEItem(template, rollBossDropRarity(), 1);
            logMessage(`[Boss Drop!] ${m.name} dropped <span style="color: yellow;">${droppedItem.name} (Rarity ${droppedItem.rarity})</span>!`, 'drop');
            addItemToInventory(droppedItem);
        }
    }
}

function runCombatTick() {
    let derived = getDerivedStats();
    let alive = getAliveMonsters();
    if (player.hp <= 0 || alive.length === 0) return;

    let targetEnemy = alive[0];
    if (player.runes.randomHitCount > 0 && alive.length > 1 && Math.random() < 0.5) {
        targetEnemy = alive[Math.floor(Math.random() * alive.length)];
    }

    if (targetEnemy.ailments.poison) {
        let pDmg = 10;
        targetEnemy.hp -= pDmg;
        logMessage(`[Poison] ${targetEnemy.name} takes ${pDmg} poison damage.`, 'combat');
    }
    if (targetEnemy.ailments.ignite) {
        let iDmg = 15;
        targetEnemy.hp -= iDmg;
        logMessage(`[Ignite] ${targetEnemy.name} burns for ${iDmg} fire damage.`, 'combat');
    }

    let hitChance = Math.min(0.95, Math.max(0.2, (derived.hit - targetEnemy.flee + 80) / 100));
    if (Math.random() <= hitChance) {
        let bonusDmg = (player.skills.crushing?.level || 0) * 3 + (isFirstHitOfBattle ? player.runes.firstHitBonus : 0);
        let elemMult = getElementMultiplier(player.equipped.weapon?.element, targetEnemy.element);
        if (elemMult !== 1) {
            logMessage(`[Element] ${elemMult > 1 ? 'Advantage' : 'Resisted'} x${elemMult} vs ${targetEnemy.name}`, elemMult > 1 ? 'drop' : 'combat');
        }
        let pDmg = Math.floor((derived.atk + bonusDmg) * elemMult);

        let isCrit = (isFirstHitOfBattle && player.runes.alwaysCritFirst) || (Math.random() * 100 < derived.crit);
        if (isCrit) {
            pDmg = Math.floor(pDmg * 1.5);
            updateQuestProgress('crit', 1);
			playSound('sound/critical.wav');
            logMessage(`[Critical!] Attacked ${targetEnemy.name} for critical ${pDmg} damage!`, 'combat');
            if (Math.random() < 0.3) {
                targetEnemy.ailments.ignite = true;
                logMessage(`[Ignite] Your critical strike set ${targetEnemy.name} ablaze!`, 'drop');
            }
        } else {
			playSound('sound/hit.wav');
            logMessage(`[Attack] Hit ${targetEnemy.name} for ${pDmg} damage`, 'combat');
            if (Math.random() < 0.15) {
                targetEnemy.ailments.poison = true;
                logMessage(`[Poison] You poisoned ${targetEnemy.name}!`, 'drop');
            }
        }
        targetEnemy.hp -= pDmg;
    } else {
        logMessage(`[Miss] Attack on ${targetEnemy.name} missed!`, 'combat');
    }
    isFirstHitOfBattle = false;

    monstersList.forEach(m => {
        if (m.hp <= 0 && !m.rewarded) awardKill(m);
    });
    updateUI();

    alive = getAliveMonsters();
    if (alive.length === 0) {
        onStageCleared();
        return;
    }

    alive.slice(0, 3).forEach(activeEnemy => {
        if (player.hp <= 0) return;
        if (activeEnemy.ailments?.frozen && Math.random() < 0.5) {
            logMessage(`[Freeze] ${activeEnemy.name} is frozen and cannot attack!`, 'winlose');
            return;
        }

        if (Math.random() <= Math.min(0.95, Math.max(0.2, (activeEnemy.hit - derived.flee + 80) / 100))) {
            let eDmg = Math.max(1, Math.floor(Math.random() * (activeEnemy.atkMax - activeEnemy.atkMin + 1)) + activeEnemy.atkMin - derived.def);
            player.hp -= eDmg;
            logMessage(`[Combat] ${activeEnemy.name} hits you for ${eDmg} damage`, 'combat');
        } else {
            logMessage(`[Dodge] You evaded ${activeEnemy.name}'s attack!`, 'combat');
        }
    });

    let now = Date.now();
    let pSlot = player.equipped.potionSlot;
    if (player.hp < (derived.maxHp * 0.4) && (now - lastPotionDrinkTime >= 3000) && pSlot && (pSlot.qty || 0) > 0) {
        let healAmt = pSlot.heal || 50;
        player.hp = Math.min(derived.maxHp, player.hp + healAmt);
        pSlot.qty--;
        lastPotionDrinkTime = now;
        logMessage(`[Item] Auto-used ${pSlot.name}! Restored ${healAmt} HP`, 'drop');
    }

    if (player.hp <= 0) {
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

function onStageCleared() {
    clearInterval(combatInterval);
    logMessage(`[Stage Cleared] Stage ${currentStage} completed!`, 'drop');

    setTimeout(() => {
        let proceedNext = () => {
            let nextBtn = document.getElementById('next-stage-btn');
            if (nextBtn) nextBtn.classList.add('hidden');
            currentStage++;

            if (currentMode === 'campaign' && currentStage > maxStages) {
                if (typeof resetMapRunes === 'function') resetMapRunes();
                if (!player.clearedMaps) player.clearedMaps = {};
                player.clearedMaps[activeMap.dropKey] = true;
                let pool = typeof GEAR_POOL !== 'undefined' ? (GEAR_POOL[activeMap.dropKey || 'map1'] || GEAR_POOL.map1) : [];
                let template = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : { name: "Explorer's Blade", slot: "weapon", levelReq: 1, stats: { atk: 15 } };
                let reward = generatePoEItem(template, 3, 1);
                addItemToInventory(reward);

                showModal("Map Cleared!", `Conquered ${activeMap.title}!\n\nReward: ${reward.name}`, '', () => switchView('town'));
				playSound('mvp.wav');
                return;
            }

            let titleEl = document.getElementById('node-title');
            if (currentMode === 'endless') {
                if (titleEl) titleEl.innerText = `Void Tower — Wave ${currentStage}`;
            } else {
                if (titleEl) titleEl.innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages} ${currentStage === maxStages ? '(Boss)' : ''}`;
            }

            combatInterval = setInterval(runCombatTick, Math.max(400, 2000 - (getDerivedStats().aspd * 10)));
            spawnStageMonsters();
        };

        if (currentMode === 'campaign' && currentStage % 5 === 0) {
            checkRuneSelectionPrompt(proceedNext);
        } else {
            window.pendingStageProceed = proceedNext;
            let nextBtn = document.getElementById('next-stage-btn');
            if (nextBtn) nextBtn.classList.remove('hidden');
        }
    }, 2000);
}

const RUNE_INFO = {
    critBonus: { name: "Berserk Rune", desc: "+15% Critical Rate" },
    maxHpBonus: { name: "Vitality Rune", desc: "+200 Max HP" },
    firstHitBonus: { name: "Stunning Strike Rune", desc: "+50 Bonus Damage on First Hit" },
    alwaysCritFirst: { name: "Assassination Rune", desc: "First hit of every battle is always a Critical Hit" },
    randomHitCount: { name: "Chaos Rune", desc: "Attacks have a 50% chance to strike random targets" }
};

function checkRuneSelectionPrompt(onCompleteCallback) {
    const availableRunes = [
        { id: 'critBonus', name: "Berserk Rune", desc: "+15% Critical Rate", apply: () => { player.runes.critBonus += 15; } },
        { id: 'maxHpBonus', name: "Vitality Rune", desc: "+200 Max HP", apply: () => { player.runes.maxHpBonus += 200; player.hp = Math.min(getDerivedStats().maxHp, player.hp + 200); } },
        { id: 'firstHitBonus', name: "Stunning Strike Rune", desc: "+50 Bonus Damage on First Hit", apply: () => { player.runes.firstHitBonus += 50; } },
        { id: 'alwaysCritFirst', name: "Assassination Rune", desc: "First hit of every battle is always a Critical Hit", apply: () => { player.runes.alwaysCritFirst = true; } },
        { id: 'randomHitCount', name: "Chaos Rune", desc: "Attacks have a 50% chance to strike random targets", apply: () => { player.runes.randomHitCount += 1; } }
    ];

    let shuffled = [...availableRunes].sort(() => 0.5 - Math.random());
    let choices = shuffled.slice(0, 3);

    let html = `<p class="text-xs text-slate-300 mb-2">Stage ${currentStage} cleared! Select a mystical Rune blessing for this expedition:</p><div class="flex flex-col gap-2">`;
    choices.forEach((r) => {
        html += `
            <button onclick="selectRuneChoice('${r.id}', window.runeCallback)" class="p-3 bg-slate-950 hover:bg-slate-800 border border-amber-500/40 rounded-xl text-left transition cursor-pointer flex flex-col gap-0.5">
                <span class="font-bold text-amber-400 text-xs">✨ ${r.name}</span>
                <span class="text-[10px] text-slate-300">${r.desc}</span>
            </button>
        `;
    });
    html += `</div>`;

    window.runeCallback = onCompleteCallback;
    showModal("Choose a Rune Blessing", "", html);
}

function selectRuneChoice(runeId, callback) {
    const availableRunes = [
        { id: 'critBonus', apply: () => { player.runes.critBonus += 15; } },
        { id: 'maxHpBonus', apply: () => { player.runes.maxHpBonus += 200; player.hp = Math.min(getDerivedStats().maxHp, player.hp + 200); } },
        { id: 'firstHitBonus', apply: () => { player.runes.firstHitBonus += 50; } },
        { id: 'alwaysCritFirst', apply: () => { player.runes.alwaysCritFirst = true; } },
        { id: 'randomHitCount', apply: () => { player.runes.randomHitCount += 1; } }
    ];

    let r = availableRunes.find(item => item.id === runeId);
    if (r) r.apply();

    const info = RUNE_INFO[runeId] || { name: runeId, desc: '' };
    if (!player.currentRunRunes) player.currentRunRunes = [];
    player.currentRunRunes.push({ id: runeId, name: info.name, desc: info.desc });
    logMessage(`[Rune Blessing] Acquired ${info.name}: ${info.desc}`, 'levelup');
    closeModal();
    if (callback) callback();
}

function proceedToNextStage() {
    if (window.pendingStageProceed) {
        let cb = window.pendingStageProceed;
        window.pendingStageProceed = null;
        cb();
    }
}

function returnToTown() {
    clearInterval(combatInterval);
    if (typeof resetMapRunes === 'function') resetMapRunes();
    let nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    switchView('town');
    logMessage(`[System] Safely returned to Haven of Dawn`, 'winlose');
}