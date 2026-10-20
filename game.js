const AVATARS = ["⚔️", "🛡️", "🔮", "🗡️", "🏹"];

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
    gold: 150,
    statPoints: 5,
    jobSp: 0,
    potions: 3,
    stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
    skills: {
        bulwark: { name: "Bulwark Stance", maxLv: 10, desc: "Increases block chance and defense bonus.", level: 0 },
        crushing: { name: "Crushing Impact", maxLv: 10, desc: "Heavy strike dealing bonus physical damage.", level: 0 },
        recovery: { name: "Recovery", maxLv: 10, desc: "Regen 1 HP every 1 sec per level.", level: 0 },
        moneyDrop: { name: "Greed / Money Drop", maxLv: 10, desc: "Increase money drop +1% every level.", level: 0 }
    },
    equipped: {
        weapon: { name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, stats: { atk: 10 }, desc: "Atk +10" },
        shield: { name: "Wooden Buckler", slot: "shield", levelReq: 1, stats: { def: 2, block: 5 }, desc: "DEF +2, Block +5%" },
        armor: { name: "Iron Cuirass", slot: "armor", levelReq: 1, stats: { hp: 50, def: 5 }, desc: "HP +50, DEF +5" },
        garment: { name: "Cotton Cloak", slot: "garment", levelReq: 1, stats: { flee: 2 }, desc: "FLEE +2" },
        footgear: { name: "Leather Boots", slot: "footgear", levelReq: 1, stats: { hp: 20 }, desc: "HP +20" }
    },
    inventory: new Array(30).fill(null),
    runes: {
        critBonus: 0,
        maxHpBonus: 0,
        firstHitBonus: 0,
        alwaysCritFirst: false,
        chainAttackCount: 0,
        randomHitCount: 0
    }
};

let currentMode = 'campaign';
let activeMap = null;
let currentStage = 1;
let maxStages = 11;
let combatInterval = null;
let hpRegenInterval = null;
let monstersList = [];
let isFirstHitOfBattle = true;
let selectedAvatarChoice = "⚔️";
let isBgmPlaying = false;
let currentLanguage = 'en';

function resetMapRunes() {
    player.runes = {
        critBonus: 0,
        maxHpBonus: 0,
        firstHitBonus: 0,
        alwaysCritFirst: false,
        chainAttackCount: 0,
        randomHitCount: 0
    };
}

function toggleBgm() {
    let bgm = document.getElementById('game-bgm');
    let btn = document.getElementById('bgm-toggle-btn');
    if (isBgmPlaying) {
        bgm.pause();
        isBgmPlaying = false;
        btn.innerText = currentLanguage === 'en' ? "Play BGM" : "เล่นเพลง BGM";
        btn.className = "px-2 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-[10px] rounded border border-indigo-700 transition";
    } else {
        bgm.play().then(() => {
            isBgmPlaying = true;
            btn.innerText = currentLanguage === 'en' ? "Pause BGM" : "ปิดเพลง BGM";
            btn.className = "px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-bold text-[10px] rounded border border-indigo-400 transition";
        }).catch(e => console.log("Audio play blocked:", e));
    }
}

function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'th' : 'en';
    applyLanguage();
}

function applyLanguage() {
    let dict = I18N[currentLanguage];
    if (!dict) return;

    const mapping = {
        'i18n-title': dict.gameTitle,
        'i18n-choose-avatar': dict.chooseAvatar,
        'i18n-upload-avatar': dict.uploadAvatar,
        'i18n-enter-name': dict.enterName,
        'i18n-begin-btn': dict.beginJourney,
        'i18n-btn-save': dict.saveGame,
        'i18n-btn-reset': dict.resetSave,
        'i18n-base-exp': dict.baseExp,
        'i18n-job-exp': dict.jobExp,
        'i18n-town-title': dict.townTitle,
        'i18n-town-desc': dict.townDesc,
        'i18n-menu-char': dict.menuChar,
        'i18n-menu-char-desc': dict.menuCharDesc,
        'i18n-menu-forge': dict.menuForge,
        'i18n-menu-forge-desc': dict.menuForgeDesc,
        'i18n-menu-exp': dict.menuExp,
        'i18n-menu-exp-desc': dict.menuExpDesc,
        'i18n-activity-log': dict.activityLog,
        'i18n-exp-title': dict.expTitle,
        'i18n-exp-subtitle': dict.expSubtitle,
        'i18n-btn-back': dict.btnBack,
        'i18n-camp-tag': dict.campTag,
        'i18n-camp-title': dict.campTitle,
        'i18n-camp-desc': dict.campDesc,
        'i18n-btn-camp': dict.btnCamp,
        'i18n-endless-tag': dict.endlessTag,
        'i18n-endless-title': dict.endlessTitle,
        'i18n-endless-desc': dict.endlessDesc,
        'i18n-btn-endless': dict.btnEndless,
        'i18n-char-title': dict.charTitle,
        'i18n-equip-title': dict.equipTitle,
        'i18n-weight-label': dict.weightLabel,
        'i18n-skills-title': dict.skillsTitle,
        'i18n-inv-title': dict.invTitle,
        'i18n-inv-hint': dict.invHint,
        'i18n-stats-title': dict.statsTitle,
        'i18n-stat-pts': dict.statPts,
        'i18n-forge-title': dict.forgeTitle,
        'i18n-consumables-title': dict.consumablesTitle,
        'i18n-potion-name': dict.potionName,
        'i18n-potion-desc': dict.potionDesc,
        'i18n-armory-title': dict.armoryTitle,
        'i18n-btn-retreat': dict.btnRetreat,
        'i18n-lineup-title': dict.lineupTitle,
        'i18n-combat-log': dict.combatLog
    };

    for (let id in mapping) {
        let el = document.getElementById(id);
        if (el) {
            el.innerText = mapping[id];
        }
    }
}

function saveGame() {
    try {
        const saveData = JSON.stringify(player);
        localStorage.setItem('ragnatale_save', saveData);
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
            return true;
        }
    } catch (e) {
        console.error("Failed to load game:", e);
    }
    return false;
}

function manualSaveGame() {
    saveGame();
    showModal("Notice", "Your game progress has been successfully saved!");
}

function resetSaveGame() {
    if (confirm("Are you sure you want to reset all save data?")) {
        localStorage.removeItem('ragnatale_save');
        location.reload();
    }
}

function renderAvatarSelection() {
    let grid = document.getElementById('avatar-selection-grid');
    if(!grid) return;
    grid.innerHTML = '';
    AVATARS.forEach((av) => {
        let isSelected = (av === selectedAvatarChoice);
        let borderClass = isSelected ? 'border-amber-400 bg-amber-500/20' : 'border-slate-700 bg-slate-900';
        grid.innerHTML += `
            <div onclick="selectAvatar('${av}')" class="h-12 rounded-xl border ${borderClass} flex items-center justify-center text-xl cursor-pointer hover:border-amber-400 transition">
                ${av}
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
            if(grid) {
                grid.innerHTML += `<div class="h-12 rounded-xl border border-amber-400 bg-amber-500/20 flex items-center justify-center text-xl overflow-hidden"><img src="${selectedAvatarChoice}" class="w-full h-full object-cover" /></div>`;
            }
        };
        reader.readAsDataURL(file);
    }
}

function startGameWithName() {
    let nameInputEl = document.getElementById('input-player-name');
    let nameInput = nameInputEl ? nameInputEl.value.trim() : "VanguardHero";
    
    if (nameInput) {
        player.name = nameInput;
    }
    player.avatar = selectedAvatarChoice;
    saveGame();

    let headerNameEl = document.getElementById('header-player-name');
    let combatNameEl = document.getElementById('combat-player-name');
    if (headerNameEl) headerNameEl.innerText = player.name;
    if (combatNameEl) combatNameEl.innerText = player.name;

    updateAvatarDisplay();

    let nameSelectModal = document.getElementById('view-name-select');
    if (nameSelectModal) {
        nameSelectModal.classList.add('hidden');
        nameSelectModal.style.display = 'none'; // Force hide to override any display style conflicts
    }

    logMessage(`[System] Welcome to Haven of Dawn, ${player.name}!`, 'winlose');
    updateUI();
}

function updateAvatarDisplay() {
    let container = document.getElementById('header-avatar-container');
    if(!container) return;
    if (player.avatar && player.avatar.startsWith('data:image')) {
        container.innerHTML = `<img src="${player.avatar}" class="w-full h-full object-cover" />`;
    } else {
        container.innerText = player.avatar || "⚔️";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    applyLanguage();

    if (loadGame()) {
        let nameSelect = document.getElementById('view-name-select');
        if(nameSelect) nameSelect.classList.add('hidden');
        document.getElementById('header-player-name').innerText = player.name;
        document.getElementById('combat-player-name').innerText = player.name;
        updateAvatarDisplay();
        logMessage(`[System] Successfully loaded save data for ${player.name}`, 'winlose');
        updateUI();
    } else {
        renderAvatarSelection();
        let nameSelect = document.getElementById('view-name-select');
        if(nameSelect) {
            nameSelect.classList.remove('hidden');
            nameSelect.style.display = 'flex';
        }
    }

    if (hpRegenInterval) clearInterval(hpRegenInterval);
    hpRegenInterval = setInterval(() => {
        if (player.skills.recovery && player.skills.recovery.level > 0) {
            let regenAmount = player.skills.recovery.level;
            let derived = getDerivedStats();
            if (player.hp > 0 && player.hp < derived.maxHp) {
                player.hp = Math.min(derived.maxHp, player.hp + regenAmount);
                updateUI();
            }
        }
    }, 1000);
});

function showModal(title, message, customHTML = '', onCloseCallback = null) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    let area = document.getElementById('modal-content-area');
    area.innerHTML = customHTML;
    let btn = document.getElementById('modal-close-btn');
    if (customHTML) {
        btn.classList.add('hidden');
    } else {
        btn.classList.remove('hidden');
    }
    window.modalCallback = onCloseCallback;
    document.getElementById('game-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('game-modal').classList.add('hidden');
    if (window.modalCallback) {
        let cb = window.modalCallback;
        window.modalCallback = null;
        cb();
    }
}

function getDerivedStats() {
    let maxHp = 100 + (player.stats.vit * 15) + (player.baseLv * 10) + player.runes.maxHpBonus;
    let atk = 10 + (player.stats.str * 2) + Math.floor(player.stats.luk / 3);
    let def = 2 + (player.stats.vit * 1) + player.skills.bulwark.level;
    let hit = 100 + player.baseLv + player.stats.dex;
    let flee = 100 + player.baseLv + player.stats.agi;
    let crit = 1 + Math.floor(player.stats.luk / 3) + player.runes.critBonus;
    let aspd = 130 + Math.floor(player.stats.agi * 0.8) + Math.floor(player.stats.dex * 0.2);

    for (let slot in player.equipped) {
        let item = player.equipped[slot];
        if (item && item.stats) {
            if (item.stats.atk) atk += item.stats.atk;
            if (item.stats.def) def += item.stats.def;
            if (item.stats.hp) maxHp += item.stats.hp;
            if (item.stats.flee) flee += item.stats.flee;
            if (item.stats.crit) crit += item.stats.crit;
            if (item.stats.aspd) aspd += item.stats.aspd;
            if (item.stats.hit) hit += item.stats.hit;
        }
    }

    let maxWeight = 2000 + (player.stats.str * 30);
    let currentWeight = 120 + (player.potions * 15);
    for (let item of player.inventory) {
        if (item) currentWeight += 10;
    }

    return { maxHp, atk, def, hit, flee, crit, aspd, maxWeight, currentWeight };
}

function switchView(viewName) {
    document.getElementById('view-town').classList.add('hidden');
    document.getElementById('view-expeditions').classList.add('hidden');
    document.getElementById('view-character').classList.add('hidden');
    document.getElementById('view-forge').classList.add('hidden');
    document.getElementById('view-combat').classList.add('hidden');

    if(viewName === 'town') document.getElementById('view-town').classList.remove('hidden');
    if(viewName === 'expeditions') document.getElementById('view-expeditions').classList.remove('hidden');
    if(viewName === 'character') document.getElementById('view-character').classList.remove('hidden');
    if(viewName === 'forge') {
        document.getElementById('view-forge').classList.remove('hidden');
        renderShop();
    }
    if(viewName === 'combat') document.getElementById('view-combat').classList.remove('hidden');
    updateUI();
    saveGame();
}

function renderShop() {
    let shopContainer = document.getElementById('shop-items-container');
    if(!shopContainer) return;
    shopContainer.innerHTML = '';
    SHOP_ITEMS.forEach(item => {
        shopContainer.innerHTML += `
            <div class="p-2.5 bg-slate-900/60 rounded border border-slate-800 flex justify-between items-center">
                <div>
                    <span class="font-bold text-amber-300 block">${item.name} (Req. Lv ${item.levelReq})</span>
                    <span class="text-[10px] text-slate-400">${item.desc}</span>
                </div>
                <button onclick="buyShopItem('${item.id}')" class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded">${item.price} Zeny</button>
            </div>
        `;
    });
}

function buyShopItem(itemId) {
    let itemTemplate = SHOP_ITEMS.find(i => i.id === itemId);
    if (!itemTemplate) return;
    if (player.gold < itemTemplate.price) {
        showModal("Purchase Failed", "Insufficient Zeny!");
        return;
    }
    let emptyIdx = player.inventory.findIndex(s => s === null);
    if (emptyIdx === -1) {
        showModal("Purchase Failed", "Inventory is full!");
        return;
    }
    player.gold -= itemTemplate.price;
    player.inventory[emptyIdx] = { ...itemTemplate };
    logMessage(`[Shop] Successfully purchased ${itemTemplate.name}!`, 'drop');
    showModal("Purchase Successful", `You bought ${itemTemplate.name} for ${itemTemplate.price} Zeny!`);
    updateUI();
    saveGame();
}

function updateUI() {
    let derived = getDerivedStats();
    player.hp = Math.min(player.hp, derived.maxHp);

    document.getElementById('header-player-name').innerText = player.name;
    document.getElementById('combat-player-name').innerText = player.name;
    updateAvatarDisplay();
    document.getElementById('header-base-lv').innerText = player.baseLv;
    document.getElementById('header-job-lv').innerText = player.jobLv;
    document.getElementById('header-gold').innerText = `${player.gold} Zeny`;

    let baseExpPct = Math.min(100, Math.floor((player.baseExp / player.baseMaxExp) * 100));
    let jobExpPct = Math.min(100, Math.floor((player.jobExp / player.jobMaxExp) * 100));
    document.getElementById('top-base-exp-text').innerText = `${player.baseExp} / ${player.baseMaxExp} (${baseExpPct}%)`;
    document.getElementById('top-base-exp-bar').style.width = `${baseExpPct}%`;
    document.getElementById('top-job-exp-text').innerText = `${player.jobExp} / ${player.jobMaxExp} (${jobExpPct}%)`;
    document.getElementById('top-job-exp-bar').style.width = `${jobExpPct}%`;

    let eqContainer = document.getElementById('equipment-slots-container');
    eqContainer.innerHTML = '';
    for (let [slot, gear] of Object.entries(player.equipped)) {
        eqContainer.innerHTML += `
            <div class="flex justify-between items-center p-2.5 bg-slate-900/60 rounded border border-slate-800">
                <div>
                    <span class="text-slate-400 capitalize block">${slot}</span>
                    <span class="font-semibold text-slate-200">${gear ? gear.name : 'Empty'}</span>
                </div>
                ${gear ? `<button onclick="unequipItem('\${slot}')" class="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 text-[10px] text-red-300 font-bold rounded">Unequip</button>` : ''}
            </div>
        `;
    }

    let invGrid = document.getElementById('inventory-grid');
    invGrid.innerHTML = '';
    let filledSlots = 0;
    player.inventory.forEach((item, index) => {
        if (item) filledSlots++;
        let itemName = item ? item.name : '';
        let itemColor = item && item.type === 'potion' ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold';
        invGrid.innerHTML += `
            <div onclick="useOrEquipItem(${index})" class="h-14 bg-slate-900/80 border border-slate-700/60 rounded flex flex-col justify-center items-center p-1 text-center cursor-pointer hover:border-amber-500 transition relative group">
                <span class="text-[9px] ${itemColor} truncate w-full">${itemName}</span>
                <span class="text-[8px] text-slate-500 absolute bottom-1 right-1">${index + 1}</span>
            </div>
        `;
    });
    document.getElementById('inventory-count').innerText = `${filledSlots} / 30`;

    document.getElementById('stat-points').innerText = player.statPoints;
    document.getElementById('stat-str').innerText = player.stats.str;
    document.getElementById('stat-agi').innerText = player.stats.agi;
    document.getElementById('stat-vit').innerText = player.stats.vit;
    document.getElementById('stat-int').innerText = player.stats.int;
    document.getElementById('stat-dex').innerText = player.stats.dex;
    document.getElementById('stat-luk').innerText = player.stats.luk;

    document.getElementById('derived-atk').innerText = derived.atk;
    document.getElementById('derived-def').innerText = derived.def;
    document.getElementById('derived-hit').innerText = derived.hit;
    document.getElementById('derived-flee').innerText = derived.flee;
    document.getElementById('derived-crit').innerText = `${derived.crit}%`;
    document.getElementById('derived-aspd').innerText = derived.aspd;

    document.getElementById('weight-text').innerText = `${derived.currentWeight} / ${derived.maxWeight}`;
    document.getElementById('weight-bar').style.width = `${Math.min(100, (derived.currentWeight / derived.maxWeight) * 100)}%`;

    document.getElementById('sp-count').innerText = player.jobSp;
    let skillContainer = document.getElementById('skill-tree-container');
    skillContainer.innerHTML = '';
    for (let [sKey, skillObj] of Object.entries(player.skills)) {
        skillContainer.innerHTML += `
            <div class="flex justify-between items-center bg-slate-900/40 p-2.5 rounded border border-slate-800">
                <div>
                    <h4 class="font-bold text-slate-200">${skillObj.name} (Lv. ${skillObj.level}/${skillObj.maxLv})</h4>
                    <p class="text-[10px] text-slate-400">${skillObj.desc}</p>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="upgradeSkill('${sKey}')" class="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[10px]">+1 SP</button>
                    ${skillObj.level > 0 ? `<button onclick="redoneSkill('\${sKey}')" class="px-2 py-1 bg-red-800 hover:bg-red-700 text-slate-100 font-bold rounded text-[10px]" title="Refund SP">Redone</button>` : ''}
                </div>
            </div>
        `;
    }

    document.getElementById('player-hp-text').innerText = `${player.hp} / ${derived.maxHp} HP`;
    document.getElementById('player-hp-bar').style.width = `${(player.hp / derived.maxHp) * 100}%`;
    document.getElementById('player-potions').innerText = player.potions;

    let lineupContainer = document.getElementById('monsters-lineup-container');
    if (lineupContainer && monstersList.length > 0) {
        lineupContainer.innerHTML = '';
        monstersList.forEach((m, idx) => {
            let isTarget = (idx === 0);
            let borderColor = isTarget ? 'border-amber-500 bg-slate-900/90 shadow-md' : 'border-slate-800 bg-slate-950/40 opacity-70';
            let ordinals = ["1st", "2nd", "3rd", "4th", "5th"];
            let ordText = ordinals[idx] || `${idx + 1}th`;
            let hpPct = Math.max(0, (m.hp / m.maxHp) * 100);
            let rangedBadge = m.isRanged ? '<span class="text-[9px] bg-purple-900/80 text-purple-300 px-1.5 py-0.5 rounded ml-1 font-semibold">Ranged</span>' : '';

            lineupContainer.innerHTML += `
                <div class="p-2.5 rounded-lg border ${borderColor} flex flex-col gap-1.5 transition-all">
                    <div class="flex justify-between items-center text-xs">
                        <span class="font-bold text-red-400">${ordText}: ${m.name} ${rangedBadge} ${isTarget ? '<span class="text-[10px] text-amber-400 ml-1">(Target)</span>' : ''}</span>
                        <span class="font-mono text-[11px]">${Math.max(0, m.hp)} / ${m.maxHp} HP</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                        <div class="bg-red-500 h-full transition-all duration-200" style="width: ${hpPct}%"></div>
                    </div>
                </div>
            `;
        });
    }
}

function addStat(statKey) {
    if (player.statPoints > 0) {
        player.statPoints--;
        player.stats[statKey]++;
        updateUI();
        saveGame();
    }
}

function upgradeSkill(skillKey) {
    let skillObj = player.skills[skillKey];
    if (player.jobSp > 0 && skillObj.level < skillObj.maxLv) {
        player.jobSp--;
        skillObj.level++;
        updateUI();
        saveGame();
    } else {
        alert("Not enough SP or skill is maxed out!");
    }
}

function redoneSkill(skillKey) {
    let skillObj = player.skills[skillKey];
    if (skillObj.level > 0) {
        skillObj.level--;
        player.jobSp++;
        logMessage(`[Skills] Refunded 1 SP from ${skillObj.name}`, 'levelup');
        updateUI();
        saveGame();
    }
}

function addItemToInventory(item) {
    let emptyIdx = player.inventory.findIndex(slot => slot === null);
    if (emptyIdx !== -1) {
        player.inventory[emptyIdx] = item;
        logMessage(`[Inventory] Obtained ${item.name}!`, 'drop');
        updateUI();
        saveGame();
        return true;
    } else {
        logMessage(`[Inventory Full] Could not obtain ${item.name}, inventory is full!`, 'combat');
        return false;
    }
}

function unequipItem(slot) {
    let item = player.equipped[slot];
    if (!item) return;
    let emptyIdx = player.inventory.findIndex(s => s === null);
    if (emptyIdx === -1) {
        alert("Inventory is full! Cannot unequip.");
        return;
    }
    player.inventory[emptyIdx] = { ...item };
    player.equipped[slot] = null;
    logMessage(`[Equipment] Unequipped ${item.name}`, 'drop');
    updateUI();
    saveGame();
}

function useOrEquipItem(index) {
    let item = player.inventory[index];
    if (!item) return;
    
    if (item.type === 'potion') {
        let derived = getDerivedStats();
        if (player.hp >= derived.maxHp) {
            alert("HP is already full!");
            return;
        }
        player.inventory[index] = null;
        player.hp = Math.min(derived.maxHp, player.hp + 50);
        logMessage(`[Item] Used Healing Potion, restored 50 HP`, 'drop');
        updateUI();
        saveGame();
        return;
    }

    if (item.slot) {
        if (player.baseLv < item.levelReq) {
            alert(`Requires Base Level ${item.levelReq} to equip ${item.name}!`);
            return;
        }

        // Prevent equipping 2H weapon if a shield is active unless shield can be stowed
        if (item.slot === 'weapon' && item.name && item.name.includes("(2H)")) {
            if (player.equipped['shield']) {
                let emptyIdx = player.inventory.findIndex(s => s === null);
                if (emptyIdx === -1) {
                    alert("Inventory full! Cannot stow shield to wield 2H weapon.");
                    return;
                }
                player.inventory[emptyIdx] = player.equipped['shield'];
                player.equipped['shield'] = null;
                logMessage(`[Equipment] Stowed shield to wield two-handed weapon`, 'drop');
            }
        }

        // Prevent equipping shield if a 2H weapon is active
        if (item.slot === 'shield') {
            let currentWeapon = player.equipped['weapon'];
            if (currentWeapon && currentWeapon.name && currentWeapon.name.includes("(2H)")) {
                alert("Cannot equip shield while wielding a Two-Handed (2H) weapon!");
                return;
            }
        }

        let currentEquipped = player.equipped[item.slot];
        player.equipped[item.slot] = item;
        player.inventory[index] = currentEquipped || null;
        logMessage(`[Equipment] Equipped ${item.name}`, 'drop');
        updateUI();
        saveGame();
    }
}

function buyPotion() {
    let derived = getDerivedStats();
    if (derived.currentWeight + 15 > derived.maxWeight) {
        alert("Weight limit exceeded!");
        return;
    }
    if (player.gold >= 50) {
        player.gold -= 50;
        player.potions++;
        addItemToInventory({ name: "Healing Potion", type: "potion", desc: "Restores 50 HP" });
        showModal("Purchase Successful", "You purchased a minor healing potion for 50 Zeny!");
        updateUI();
        saveGame();
    } else {
        showModal("Purchase Failed", "Insufficient Zeny!");
    }
}

function logMessage(msg, type = 'combat') {
    ['town-activity-log', 'combat-activity-log'].forEach(id => {
        const box = document.getElementById(id);
        if (box) {
            const div = document.createElement('div');
            div.innerHTML = msg;
            if (type === 'combat') div.className = "text-red-400";
            else if (type === 'winlose') div.className = "text-blue-400 font-bold";
            else if (type === 'drop') div.className = "text-yellow-400 font-bold";
            else if (type === 'levelup') div.className = "text-purple-400 font-bold";
            else div.className = "text-slate-300";
            
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
        }
    });
}

function startExpedition(mode) {
    resetMapRunes(); // Reset map buffs upon starting an expedition
    currentMode = mode;
    let derived = getDerivedStats();
    player.hp = derived.maxHp;
    let nextBtn = document.getElementById('next-stage-btn');
    if(nextBtn) nextBtn.classList.add('hidden');

    if (currentMode === 'campaign') {
        let mapKey = document.getElementById('campaign-map-select').value;
        activeMap = GAME_DATA.maps[mapKey];
        currentStage = 1;
        maxStages = activeMap.maxStages;
        document.getElementById('node-mode-tag').innerText = "Campaign Mode";
        document.getElementById('node-title').innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages}`;
        logMessage(`[Expedition] Entering ${activeMap.title} (Campaign)...`, 'winlose');
    } else {
        activeMap = { 
            title: "Endless Void Tower", 
            dropKey: 'map50',
            maxStages: 999,
            enemies: [...GAME_DATA.maps.map1.enemies, ...GAME_DATA.maps.map20.enemies, ...GAME_DATA.maps.map50.enemies],
            boss: { name: "Void Lord", hp: 15000, maxHp: 15000, atkMin: 950, atkMax: 1250, hit: 500, flee: 450, baseExp: 15000, jobExp: 11000, gold: 20000, isBoss: true, isRanged: false }
        };
        currentStage = 1;
        maxStages = 999;
        document.getElementById('node-mode-tag').innerText = "Endless Mode";
        document.getElementById('node-title').innerText = `Void Tower — Wave ${currentStage}`;
        logMessage(`[Expedition] Entering Endless Void Tower...`, 'winlose');
    }

    switchView('combat');
    spawnStageMonsters();

    if(combatInterval) clearInterval(combatInterval);
    let intervalTime = Math.max(400, 2000 - (derived.aspd * 10));
    combatInterval = setInterval(runCombatTick, intervalTime);
}

function spawnStageMonsters() {
    isFirstHitOfBattle = true;
    monstersList = [];
    
    if (currentMode === 'campaign' && currentStage === maxStages) {
        let bossCopy = { ...activeMap.boss };
        monstersList.push(bossCopy);
    } else {
        let count = Math.floor(Math.random() * 4) + 2;
        let mapDifficultyMultiplier = 1 + ((currentStage - 1) * 0.12);
        if (activeMap.title.includes("Map Lv. 10")) mapDifficultyMultiplier *= 1.5;
        if (activeMap.title.includes("Map Lv. 20")) mapDifficultyMultiplier *= 2.2;
        if (activeMap.title.includes("Map Lv. 30")) mapDifficultyMultiplier *= 3.2;
        if (activeMap.title.includes("Map Lv. 40")) mapDifficultyMultiplier *= 4.5;
        if (activeMap.title.includes("Map Lv. 50")) mapDifficultyMultiplier *= 6.0;

        let mult = currentMode === 'endless' ? 1 + (currentStage * 0.08) : mapDifficultyMultiplier;
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
                isBoss: false
            });
        }
    }
    updateUI();
}

function checkRuneSelectionPrompt(onCompleteCallback) {
    const possibleRunes = [
        { id: 'crit', name: "Permanent Rune of Precision", desc: "Permanent Critical Chance +10%", apply: () => player.runes.critBonus += 10 },
        { id: 'hp', name: "Permanent Rune of Vitality", desc: "Permanent MAX HP +100", apply: () => { player.runes.maxHpBonus += 100; player.hp += 100; } },
        { id: 'firstHit', name: "Permanent Rune of Momentum", desc: "Permanent First hit damage +50", apply: () => player.runes.firstHitBonus += 50 },
        { id: 'alwaysCrit', name: "Permanent Rune of Certainty", desc: "Permanent First hit in every combat always critical", apply: () => player.runes.alwaysCritFirst = true },
        { id: 'chainAttack', name: "Rune of Chain Strike", desc: "Attack damage 10% affects 2nd monster in lineup", apply: () => player.runes.chainAttackCount++ },
        { id: 'randomHit', name: "Rune of Chaos Strike", desc: "Attack hits random enemy in stage lineup", apply: () => player.runes.randomHitCount++ }
    ];

    let shuffled = [...possibleRunes].sort(() => 0.5 - Math.random());
    let choices = shuffled.slice(0, 3);

    let html = `<p class="text-xs text-slate-300 mb-2">Stage Bonus! Choose a temporary combat rune (lasts this map only):</p><div class="flex flex-col gap-2">`;
    choices.forEach((rune, idx) => {
        html += `<button onclick="selectRuneChoice(${idx})" class="p-3 bg-slate-900 hover:bg-amber-600/30 border border-amber-500/40 rounded-xl text-left transition group">
            <span class="font-bold text-amber-300 block text-xs">${rune.name}</span>
            <span class="text-[10px] text-slate-400">${rune.desc}</span>
        </button>`;
    });
    html += `</div>`;

    window.tempRunesList = choices;
    window.tempRuneCallback = onCompleteCallback;

    showModal("Map Rune Awakening", "Choose your temporary map rune power:", html, () => {});
}

window.selectRuneChoice = function(index) {
    let chosen = window.tempRunesList[index];
    chosen.apply();
    logMessage(`[Map Rune Obtained] Activated ${chosen.name}: ${chosen.desc}`, 'levelup');
    closeModal();
    
    if (window.tempRuneCallback) {
        let cb = window.tempRuneCallback;
        window.tempRuneCallback = null;
        cb();
    }
    saveGame();
};

function runCombatTick() {
    let derived = getDerivedStats();
    if (player.hp <= 0 || monstersList.length === 0) return;

    let targetIdx = 0;
    if (player.runes.randomHitCount > 0 && monstersList.length > 1 && Math.random() < 0.5) {
        targetIdx = Math.floor(Math.random() * monstersList.length);
    }
    let targetEnemy = monstersList[targetIdx];

    let hitChance = Math.min(0.95, Math.max(0.2, (derived.hit - targetEnemy.flee + 80) / 100));
    if (Math.random() <= hitChance) {
        let bonusDmg = player.skills.crushing.level * 3;
        if (isFirstHitOfBattle) {
            bonusDmg += player.runes.firstHitBonus;
        }
        let pDmg = derived.atk + bonusDmg;

        let isCrit = false;
        if (isFirstHitOfBattle && player.runes.alwaysCritFirst) {
            isCrit = true;
        } else if (Math.random() * 100 < derived.crit) {
            isCrit = true;
        }

        if (isCrit) {
            pDmg = Math.floor(pDmg * 1.5);
            logMessage(`[Critical!] Attacked ${targetEnemy.name} for critical ${pDmg} damage!`, 'combat');
        } else {
            logMessage(`[Attack] Hit ${targetEnemy.name} for ${pDmg} damage`, 'combat');
        }
        targetEnemy.hp -= pDmg;

        if (player.runes.chainAttackCount > 0 && monstersList.length > 1) {
            let secondIdx = (targetIdx === 0) ? 1 : 0;
            let secondEnemy = monstersList[secondIdx];
            if (secondEnemy) {
                let chainDmg = Math.max(1, Math.floor(pDmg * 0.10 * player.runes.chainAttackCount));
                secondEnemy.hp -= chainDmg;
                logMessage(`[Chain Strike] Rune splashed ${chainDmg} damage to ${secondEnemy.name}!`, 'combat');
            }
        }

        isFirstHitOfBattle = false;
    } else {
        logMessage(`[Miss] Attack on ${targetEnemy.name} missed!`, 'combat');
        isFirstHitOfBattle = false;
    }

    monstersList = monstersList.filter(m => {
        if (m.hp <= 0) {
            let bonusMultiplier = 1 + (player.skills.moneyDrop.level * 0.01);
            let finalGold = Math.floor(m.gold * bonusMultiplier);

            logMessage(`[Victory] Defeated ${m.name}! Gained ${m.baseExp} Base EXP, ${m.jobExp} Job EXP and <span style="color: yellow;">${finalGold} Zeny</span>`, 'winlose');
            player.gold += finalGold;
            player.baseExp += m.baseExp;
            player.jobExp += m.jobExp;
            
            if (player.baseExp >= player.baseMaxExp) {
                player.baseLv++;
                player.baseExp -= player.baseMaxExp;
                player.baseMaxExp = Math.floor(player.baseMaxExp * 1.35);
                player.statPoints += 3;
                logMessage(`[BASE LEVEL UP!] Reached Base Level ${player.baseLv}! Gained 3 Stat Points`, 'levelup');
            }

            if (player.jobExp >= player.jobMaxExp) {
                player.jobLv++;
                player.jobExp -= player.jobMaxExp;
                player.jobMaxExp = Math.floor(player.jobMaxExp * 1.3);
                player.jobSp += 1;
                logMessage(`[JOB LEVEL UP!] Reached Job Level ${player.jobLv}! Gained 1 SP`, 'levelup');
            }

            if (m.isBoss) {
                let poolKey = activeMap.dropKey || 'map1';
                let pool = GEAR_POOL[poolKey] || GEAR_POOL.map1;
                let randomGear = pool[Math.floor(Math.random() * pool.length)];
                let droppedItem = { ...randomGear };
                logMessage(`[Boss Drop!] ${m.name} dropped <span style="color: yellow;">${droppedItem.name}</span>!`, 'drop');
                addItemToInventory(droppedItem);
            }
            return false;
        }
        return true;
    });

    updateUI();

    if (monstersList.length === 0) {
        clearInterval(combatInterval);
        logMessage(`[Stage Cleared] Stage ${currentStage} completed! Click continue to proceed`, 'drop');

        let proceedNext = () => {
            let nextBtn = document.getElementById('next-stage-btn');
            if(nextBtn) nextBtn.classList.add('hidden');
            currentStage++;

            if (currentMode === 'campaign' && currentStage > maxStages) {
                resetMapRunes(); // Clear map runes upon clearing the map
                let poolKey = activeMap.dropKey || 'map1';
                let pool = GEAR_POOL[poolKey] || GEAR_POOL.map1;
                let mapRewardGear = pool[Math.floor(Math.random() * pool.length)];
                addItemToInventory(mapRewardGear);
                
                logMessage(`[Map Cleared] Conquered all stages! Bonus reward: <span style="color: yellow;">${mapRewardGear.name}</span>!`, 'drop');
                showModal("Map Cleared!", `Congratulations! You conquered ${activeMap.title}\n\nReward: <span style="color: yellow; font-weight: bold;">${mapRewardGear.name}</span>`, '', () => {
                    switchView('town');
                });
                return;
            } else {
                if (currentMode === 'endless') {
                    document.getElementById('node-title').innerText = `Void Tower — Wave ${currentStage}`;
                } else {
                    let isBossStage = currentStage === maxStages;
                    document.getElementById('node-title').innerText = `${activeMap.title} — Stage ${currentStage} / ${maxStages} ${isBossStage ? '(Boss)' : ''}`;
                }
                
                let derivedStats = getDerivedStats();
                let intervalTime = Math.max(400, 2000 - (derivedStats.aspd * 10));
                combatInterval = setInterval(runCombatTick, intervalTime);
                
                spawnStageMonsters();
                return;
            }
        };

        if (currentStage % 5 === 0 && currentMode === 'campaign') {
            checkRuneSelectionPrompt(proceedNext);
        } else {
            window.pendingStageProceed = proceedNext;
            let nextBtn = document.getElementById('next-stage-btn');
            if(nextBtn) nextBtn.classList.remove('hidden');
        }
        return;
    }

    let attackingMonsters = monstersList.slice(0, 3);
    attackingMonsters.forEach(activeEnemy => {
        if (player.hp <= 0) return;
        let enemyHitChance = Math.min(0.95, Math.max(0.2, (activeEnemy.hit - derived.flee + 80) / 100));
        if (Math.random() <= enemyHitChance) {
            let eDmg = Math.max(1, Math.floor(Math.random() * (activeEnemy.atkMax - activeEnemy.atkMin + 1)) + activeEnemy.atkMin - derived.def);
            player.hp -= eDmg;
            let tag = activeEnemy.isRanged ? '[Ranged Attack]' : '[Combat]';
            logMessage(`${tag} ${activeEnemy.name} hits you for ${eDmg} damage`, 'combat');
        } else {
            logMessage(`[Dodge] You evaded ${activeEnemy.name}'s attack!`, 'combat');
        }
    });

    if (player.hp < (derived.maxHp * 0.4) && player.potions > 0) {
        player.potions--;
        player.hp = Math.min(derived.maxHp, player.hp + 50);
        logMessage(`[Item] Auto-used minor healing potion! Restored 50 HP`, 'drop');
    }

    if (player.hp <= 0) {
        clearInterval(combatInterval);
        resetMapRunes(); // Clear map runes on death/defeat
        logMessage(`[Defeat] You have been defeated... Returning to town`, 'winlose');
        player.hp = derived.maxHp;
        showModal("Expedition Failed", "Consciousness fades... Returning to town to recover.", '', () => {
            switchView('town');
        });
    }
    updateUI();
}

function proceedToNextStage() {
    if (window.pendingStageProceed) {
        let cb = window.pendingStageProceed;
        window.pendingStageProceed = null;
        cb();
    }
}

function returnToTown() {
    if(combatInterval) clearInterval(combatInterval);
    resetMapRunes(); // Clear map runes upon manual retreat
    let nextBtn = document.getElementById('next-stage-btn');
    if(nextBtn) nextBtn.classList.add('hidden');
    switchView('town');
    logMessage(`[System] Safely returned to Haven of Dawn`, 'winlose');
}