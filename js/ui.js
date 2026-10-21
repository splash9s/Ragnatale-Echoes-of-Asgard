// ==========================================
// RAGNATALE - UI.JS
// ==========================================

const AVATARS = ["⚔️", "🛡️", "🔮", "🗡️", "🏹"];
let selectedAvatarChoice = "⚔️";
let currentLanguage = 'en';
let currentForgeSubTab = 'gold';
const SHOP_ARMORY_ITEMS = typeof SHOP_ITEMS !== 'undefined' ? SHOP_ITEMS : [];

const GOLD_SHOP_CONSUMABLES = [
    { id: 'potion_minor', name: "Minor Healing Potion", price: 50, type: 'potion', heal: 50, desc: "Restores 50 HP" },
    { id: 'potion_med', name: "Medium Healing Potion", price: 150, type: 'potion', heal: 150, desc: "Restores 150 HP" },
    { id: 'potion_large', name: "Large Healing Potion", price: 400, type: 'potion', heal: 400, desc: "Restores 400 HP" },
    { id: 'gchest_copper', name: "Copper Chest", price: 1000, type: 'chest', chestType: 'copper', desc: "Opens for 1-500 Gold and 1 armory item (Rarity 1)." },
    { id: 'gchest_silver', name: "Silver Chest", price: 4000, type: 'chest', chestType: 'silver', desc: "Opens for 501-1000 Gold and 1 armory item (Rarity 2-3)." },
    { id: 'gchest_gold', name: "Gold Chest", price: 8000, type: 'chest', chestType: 'gold', desc: "Opens for 1501-2000 Gold and 2 armory items (Rarity 3-4)." }
];

const DIAMOND_SHOP_ITEMS = [
    { id: 'vip_pass', name: "VIP Pass (30 days)", desc: "Auto next stage, no walking between stages, 1 Resurrection Potion by mail every day.", price: 150, type: 'vip' },
    { id: 'pet_loyal_poring', name: "Loyal Poring Pet", desc: "ATK +2%, HP +50", price: 50, type: 'pet', stats: { hp: 50, atkPct: 2 } },
    { id: 'res_potion', name: "Resurrection Potion", price: 3, type: 'resurrection', desc: "Auto-revives you with full HP on death." },
    { id: 'ref_stone_bundle', name: "Refining Stone Bundle (x5)", price: 8, type: 'material', qty: 5, desc: "Gain 5 Refining Stones for upgrading equipment." },
    { id: 'stat_reset', name: "Stat Reset Service", price: 10, type: 'service', desc: "Resets all attributes to 1 and refunds all spent stat points." },
    { id: 'skill_reset', name: "Skill Reset Service", price: 10, type: 'skill_reset', desc: "Resets all skill levels and refunds all spent Job SP." },
    { id: 'dchest_copper', name: "Copper Chest", price: 1, type: 'chest', chestType: 'copper', desc: "Opens for 1-500 Gold and 1 armory item (Rarity 1)." },
    { id: 'dchest_silver', name: "Silver Chest", price: 3, type: 'chest', chestType: 'silver', desc: "Opens for 501-1000 Gold and 1 armory item (Rarity 2-3)." },
    { id: 'dchest_gold', name: "Gold Chest", price: 5, type: 'chest', chestType: 'gold', desc: "Opens for 1501-2000 Gold and 2 armory items (Rarity 3-4)." }
];










function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'th' : 'en';
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
    if (!grid) return;
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
            if (grid) {
                grid.innerHTML += `<div class="h-12 rounded-xl border border-amber-400 bg-amber-500/20 flex items-center justify-center text-xl overflow-hidden"><img src="${selectedAvatarChoice}" class="w-full h-full object-cover" /></div>`;
            }
        };
        reader.readAsDataURL(file);
    }
}

function startGameWithName() {
    let nameInputEl = document.getElementById('input-player-name');
    let nameInput = nameInputEl ? nameInputEl.value.trim() : "VanguardHero";
    
    if (nameInput) player.name = nameInput;
    player.avatar = selectedAvatarChoice;
    saveGame();

    let nameSelectModal = document.getElementById('view-name-select');
    if (nameSelectModal) {
        nameSelectModal.classList.add('hidden');
        nameSelectModal.style.display = 'none';
    }

    logMessage(`[System] Welcome to Haven of Dawn, ${player.name}!`, 'winlose');
    updateUI();
}

function updateAvatarDisplay() {
    let container = document.getElementById('header-avatar-container');
    if (!container) return;
    if (player.avatar && player.avatar.startsWith('data:image')) {
        container.innerHTML = `<img src="${player.avatar}" class="w-full h-full object-cover" />`;
    } else {
        container.innerText = player.avatar || "⚔️";
    }
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
    if (btn) {
        if (customHTML) btn.classList.add('hidden');
        else btn.classList.remove('hidden');
    }
    window.modalCallback = onCloseCallback;
    if (modalEl) modalEl.classList.remove('hidden');
}

function closeModal() {
    let modalEl = document.getElementById('game-modal');
    if (modalEl) modalEl.classList.add('hidden');
    if (window.modalCallback) {
        let cb = window.modalCallback;
        window.modalCallback = null;
        cb();
    }
}

function switchView(viewName) {
    if (viewName !== 'combat') restoreAfterCombat();
    let views = ['view-town', 'view-expeditions', 'view-events', 'view-library', 'view-character', 'view-forge', 'view-diamond', 'view-quests', 'view-combat'];
    views.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    if (viewName === 'town') document.getElementById('view-town')?.classList.remove('hidden');
    if (viewName === 'expeditions') {
        document.getElementById('view-expeditions')?.classList.remove('hidden');
        renderMapGateUI();
    }
    if (viewName === 'character') document.getElementById('view-character')?.classList.remove('hidden');
    if (viewName === 'library') {
        document.getElementById('view-library')?.classList.remove('hidden');
        renderLibraryView();
    }
    if (viewName === 'events') {
        document.getElementById('view-events')?.classList.remove('hidden');
        renderEventsView();
    }
    if (viewName === 'forge') {
        document.getElementById('view-forge')?.classList.remove('hidden');
        switchForgeSubTab(currentForgeSubTab);
    }
    if (viewName === 'diamond') {
        document.getElementById('view-diamond')?.classList.remove('hidden');
        renderDiamondShop();
    }
    if (viewName === 'quests') {
        document.getElementById('view-quests')?.classList.remove('hidden');
        renderQuestsView();
        renderMailBox();
    }
    if (viewName === 'combat') document.getElementById('view-combat')?.classList.remove('hidden');

    updateUI();
    saveGame();
}

function switchForgeSubTab(tabName) {
    if (tabName !== 'gold' && tabName !== 'refine') tabName = 'gold';
    currentForgeSubTab = tabName;
    let goldSection = document.getElementById('forge-gold-section');
    let refineSection = document.getElementById('forge-refine-section');
    let btnGold = document.getElementById('forge-tab-btn-gold');
    let btnRefine = document.getElementById('forge-tab-btn-refine');

    if (goldSection) goldSection.classList.add('hidden');
    if (refineSection) refineSection.classList.add('hidden');
    const inactive = "px-3 py-1.5 bg-slate-900 text-slate-400 rounded text-xs font-bold hover:bg-slate-800 transition cursor-pointer";
    if (btnGold) btnGold.className = inactive;
    if (btnRefine) btnRefine.className = inactive;

    if (tabName === 'gold') {
        if (goldSection) goldSection.classList.remove('hidden');
        if (btnGold) btnGold.className = "px-3 py-1.5 bg-amber-600 text-slate-950 rounded text-xs font-bold transition cursor-pointer";
        renderShop();
    } else {
        if (refineSection) refineSection.classList.remove('hidden');
        if (btnRefine) btnRefine.className = "px-3 py-1.5 bg-amber-500 text-slate-950 rounded text-xs font-bold transition cursor-pointer";
        renderRefiningUI();
    }
}

function getMapPrereqTitle(mapKey) {
    const prereq = getPrereqMapKey(mapKey);
    return prereq ? GAME_DATA.maps[prereq].title : '';
}

let campaignPathChoice = 'fire';

function renderMapGateUI() {
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
        let cls, sub;
        if (!unlocked) {
            cls = 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed';
            sub = `🔒 Clear ${getMapPrereqTitle(m)} first`;
        } else if (selected) {
            cls = 'bg-amber-500/20 border-amber-400 text-amber-300 cursor-pointer';
            sub = cleared ? '✔ Cleared · Selected' : 'Selected';
        } else {
            cls = 'bg-slate-950 border-slate-700 text-slate-200 hover:border-amber-400 cursor-pointer';
            sub = cleared ? '✔ Cleared' : 'Available';
        }
        return `<button ${unlocked ? '' : 'disabled'} onclick="selectCampaignMap('${key}')" class="p-3 rounded-xl border text-left text-xs transition ${cls}">
            <span class="block font-bold">${GAME_DATA.paths[pk].maps[m].title}</span>
            <span class="block text-[10px] mt-0.5">${sub}</span>
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

function renderShop() {
    let consumablesContainer = document.getElementById('shop-consumables-container');
    if (consumablesContainer) {
        consumablesContainer.innerHTML = '';
        GOLD_SHOP_CONSUMABLES.forEach(item => {
            consumablesContainer.innerHTML += `
                <div class="p-3 bg-slate-950/60 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-amber-300 block text-xs">${item.name}</span>
                        <span class="text-[10px] text-slate-400">${item.desc} — Price: ${item.price} Gold</span>
                    </div>
                    <button onclick="buyGoldConsumable('${item.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer text-xs transition">Buy</button>
                </div>
            `;
        });
    }

    let armoryContainer = document.getElementById('shop-items-container');
    if (armoryContainer) {
        armoryContainer.innerHTML = '';
        let shopPool = typeof SHOP_ARMORY_ITEMS !== 'undefined' ? SHOP_ARMORY_ITEMS : [];
        shopPool.forEach((item, idx) => {
            let price = item.price || 300;
            armoryContainer.innerHTML += `
                <div class="p-3 bg-slate-950/60 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-amber-300 block text-xs">${item.name} (Req. Lv ${item.levelReq || 1})</span>
                        <span class="text-[10px] text-slate-400">${item.desc} — Price: ${price} Gold</span>
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
        showModal("Purchase Failed", "Insufficient Gold!");
        return;
    }
    if (!placeItemInInventory({ ...item, qty: 1 })) {
        showModal("Purchase Failed", "Inventory is full!");
        return;
    }

    player.gold -= item.price;
    logMessage(`[Shop] Purchased ${item.name}!`, 'drop');
    showModal("Purchase Successful", `You successfully purchased 1x ${item.name}!`);
    updateUI();
    saveGame();
}

function buyArmoryItem(itemIndex) {
    let template = SHOP_ARMORY_ITEMS[itemIndex];
    if (!template) return;
    let price = template.price || 300;

    if (player.gold < price) {
        showModal("Purchase Failed", "Insufficient Gold!");
        return;
    }
    if (!Array.isArray(player.inventory)) player.inventory = new Array(40).fill(null);
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
    showModal("Purchase Successful", `You purchased ${gearItem.name}!`);
    updateUI();
    saveGame();
}

function renderDiamondShop() {
    let container = document.getElementById('diamond-shop-items-container');
    let balanceEl = document.getElementById('diamond-shop-balance');
    if (balanceEl) balanceEl.innerText = player.diamonds;
    
    if (!container) return;
    container.innerHTML = '';

    DIAMOND_SHOP_ITEMS.forEach(item => {
        container.innerHTML += `
            <div class="p-3 bg-slate-900/80 rounded-xl border border-purple-500/40 flex justify-between items-center">
                <div>
                    <span class="font-bold text-purple-300 block text-xs">${item.name}</span>
                    <span class="text-[10px] text-slate-400 block">${item.desc}</span>
                </div>
                <button onclick="buyDiamondItem('${item.id}')" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold rounded-lg cursor-pointer text-xs transition shadow">💎 ${item.price}</button>
            </div>
        `;
    });
}

function buyDiamondItem(itemId) {
    let item = DIAMOND_SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (player.diamonds < item.price) {
        showModal("Purchase Failed", "Insufficient Diamonds!");
        return;
    }
    if (item.type === 'chest' && countFreeCapacity({ name: item.name, type: 'chest', qty: 1 }) < 1) {
        showModal("Purchase Failed", "Inventory is full!");
        return;
    }

    player.diamonds -= item.price;
    if (item.type === 'resurrection') {
        player.resurrectionPotions = (player.resurrectionPotions || 0) + 1;
        showModal("Purchase Successful", "You bought a Resurrection Potion!");
    } else if (item.type === 'material') {
        player.refiningStones = (player.refiningStones || 0) + 5;
        showModal("Purchase Successful", "You bought 5 Refining Stones!");
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
        showModal("Skill Reset Successful", `All skills reset and ${refunded} Job SP refunded!`);
    } else if (item.type === 'chest') {
        placeItemInInventory({ name: item.name, type: 'chest', chestType: item.chestType, desc: item.desc, qty: 1 });
        showModal("Purchase Successful", `You bought a ${item.name}! Open it from your inventory.`);
    } else if (item.type === 'vip') {
        player.vipUntil = Math.max(Date.now(), player.vipUntil || 0) + 30 * 24 * 60 * 60 * 1000;
        grantVipDailyMail();
        showModal("VIP Activated", "VIP Pass active for 30 days. Check your mailbox for today's Resurrection Potion.");
    } else if (item.type === 'pet') {
        addItemToInventory({ name: item.name, type: 'pet', slot: 'pet', qty: 1, stats: item.stats, desc: item.desc });
        showModal("Purchase Successful", `You adopted a ${item.name}!`);
    }

    updateUI();
    renderDiamondShop();
    saveGame();
}

function renderRefiningUI() {
    let container = document.getElementById('refining-slots-container');
    if (!container) return;
    let scraps = getScrapCount();

    container.innerHTML = `
        <div class="p-3 bg-slate-950 rounded-xl border border-amber-500/30 mb-3 flex flex-col gap-2">
            <div class="flex justify-between items-center text-xs">
                <span>🔩 Iron Scraps: <strong class="text-slate-200">${scraps} / 100</strong></span>
                <button onclick="smeltRefiningStone()" class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer">Smelt 1 Refining Stone</button>
            </div>
            <span class="text-[10px] text-slate-400">Combine 100 Iron Scraps to forge 1 Refining Stone.</span>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-amber-500/20 text-xs text-amber-200 mb-2 flex justify-between items-center">
            <span>🔨 Available Refining Stones: <strong class="text-amber-400">${player.refiningStones || 0}</strong></span>
        </div>
    `;

    for (let [slot, gear] of Object.entries(player.equipped)) {
        if (!gear || slot === 'pet' || slot === 'potionSlot') continue;
        let currentRefine = gear.refineLevel || 0;
        let isMax = currentRefine >= 10;
        let successRate = currentRefine >= 4 ? Math.max(10, 100 - ((currentRefine - 3) * 15)) : 100;
        let costGold = (currentRefine + 1) * 100;

        container.innerHTML += `
            <div class="p-3 bg-slate-900/80 rounded border border-slate-700 flex flex-col gap-2">
                <div class="flex justify-between items-center gap-3">
                    <div>
                        <span class="font-bold text-amber-300 text-xs">${gear.name} ${currentRefine > 0 ? '+' + currentRefine : ''}</span>
                        <span class="text-[10px] text-slate-400 block capitalize">Slot: ${slot} | Success Rate: ${isMax ? 'MAX' : successRate + '%'}</span>
                    </div>
                    ${!isMax ? `
                        <button onclick="refineEquipment('${slot}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded cursor-pointer text-xs transition whitespace-nowrap">
                            Refine: ${costGold} Gold + 1 Stone
                        </button>
                    ` : '<span class="text-xs text-emerald-400 font-bold">MAX LEVEL</span>'}
                </div>
            </div>
        `;
    }
}

function refineEquipment(slot) {
    let gear = player.equipped[slot];
    if (!gear || gear.refineLevel >= 10) return;

    let costGold = (gear.refineLevel + 1) * 100;
    if (player.gold < costGold || (player.refiningStones || 0) < 1) {
        alert(`Refining needs ${costGold} Gold and 1 Refining Stone.`);
        return;
    }

    player.gold -= costGold;
    player.refiningStones -= 1;

    let successRate = gear.refineLevel >= 4 ? Math.max(10, 100 - ((gear.refineLevel - 3) * 15)) : 100;
    if (Math.random() * 100 <= successRate) {
        gear.refineLevel++;
        logMessage(`[Refine Success] Upgraded ${gear.name} to +${gear.refineLevel}!`, 'levelup');
        showModal("Refinement Successful!", `Your ${gear.name} was upgraded to +${gear.refineLevel}!`);
    } else {
        logMessage(`[Refine Failed] Upgrade failed. Materials consumed.`, 'combat');
        showModal("Refinement Failed", `The upgrade process failed.`);
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
    if (!Array.isArray(player.inventory)) player.inventory = new Array(40).fill(null);
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
    if (!placeItemInInventory(newItem)) {
        logMessage(`[Inventory Full] Could not obtain ${newItem.name}!`, 'combat');
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
const TYPE_RANK = { weapon: 1, shield: 2, armor: 3, garment: 4, footgear: 5, pet: 6 };
function itemTypeRank(item) {
    if (item.slot) return TYPE_RANK[item.slot] || 50;
    if (item.type === 'potion' || /Potion/.test(item.name || '')) return 60;
    return 70;
}

function sortInventory(dir) {
    const sign = dir === 'desc' ? -1 : 1;
    const items = player.inventory.filter(Boolean);
    items.sort((a, b) => ((itemTypeRank(a) - itemTypeRank(b)) || a.name.localeCompare(b.name)) * sign);
    player.inventory = [...items, ...new Array(player.inventory.length - items.length).fill(null)];
    logMessage(`[Inventory] Sorted by type (${dir === 'desc' ? 'descending' : 'ascending'})`, 'drop');
    updateUI();
    saveGame();
}

function unequipPotionSlot() {
    const ps = player.equipped.potionSlot;
    if (!ps || !ps.name || (ps.qty || 0) <= 0) return;
    if (!placeItemInInventory({ ...ps, qty: ps.qty })) {
        alert("Inventory is full! Make room before unequipping potions.");
        return;
    }
    logMessage(`[Potion] Unequipped ${ps.name} x${ps.qty}`, 'drop');
    player.equipped.potionSlot = { name: "", type: "potion", heal: 0, qty: 0, desc: "" };
    updateUI();
    saveGame();
}

function unequipItem(slotName) {
    if (slotName === 'potionSlot') { unequipPotionSlot(); return; }
    let item = player.equipped[slotName];
    if (!item) return;

    if (!Array.isArray(player.inventory)) player.inventory = new Array(40).fill(null);
    let emptyIdx = player.inventory.findIndex(s => s === null);
    if (emptyIdx === -1) {
        alert("Inventory is full!");
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
    const pct = key === 'crit' || key === 'block' || key === 'atkPct';
    return `${STAT_LABELS[key] || key.toUpperCase()} ${val >= 0 ? '+' : ''}${val}${pct ? '%' : ''}`;
}

function elemTagHTML(m) {
    if (!m || !m.element || !ELEMENTS[m.element]) return '';
    const e = ELEMENTS[m.element];
    return `<span class="${e.color} text-[10px] font-bold">${e.icon} ${e.name}</span>`;
}

function elemIconText(item) {
    return (item && item.element && ELEMENTS[item.element]) ? ` ${ELEMENTS[item.element].icon}` : '';
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

function setInfoHTML(setKey) {
    const def = SET_DATA[setKey];
    if (!def) return '';
    const have = getSetBonuses().counts[setKey] || 0;
    const rows = def.bonuses.map(bn => {
        const on = have >= bn.pieces;
        return `<div class="${on ? 'text-emerald-300' : 'text-slate-500'}">(${bn.pieces} pcs) ${bn.desc}</div>`;
    }).join('');
    return `<div class="p-2 rounded-lg border border-amber-500/30 bg-slate-950/60 flex flex-col gap-1 text-[10px]">
        <span class="font-bold text-amber-300">${def.name}: ${have} / ${def.pieces} equipped</span>${rows}</div>`;
}

function renderSetBonusPanel() {
    const c = document.getElementById('set-bonus-panel');
    if (!c) return;
    const counts = getSetBonuses().counts;
    let html = '';
    Object.keys(SET_DATA).forEach(k => { if (counts[k]) html += setInfoHTML(k); });
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
    return `<div class="flex-1 min-w-0 p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-1 text-[10px]">
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
        return `<div class="${d > 0 ? 'text-emerald-300' : 'text-red-300'}">${STAT_LABELS[k] || k.toUpperCase()} ${d > 0 ? '+' : ''}${d}</div>`;
    }).join('');
    return `<div class="flex flex-col gap-2">
        <span class="text-[10px] font-bold text-amber-300 uppercase">Compare with equipped</span>
        <div class="flex gap-2 items-stretch">${gearCardHTML(selected, 'Selected')}${gearCardHTML(equipped, 'Equipped')}</div>
        ${rows ? `<div class="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[10px] flex flex-col gap-0.5"><span class="text-slate-400">Change if you equip it (total stats):</span>${rows}</div>` : ''}
    </div>`;
}

// Equipment: only the header, requirements, set info and the comparison window (no duplicate stat list)
function showItemDetail(index) {
    const item = player.inventory[index];
    if (!item) return;
    const isEquip = !!item.slot;
    const isPotion = item.type === 'potion';
    const rarity = RARITY_INFO[item.rarity];
    const kind = isEquip ? item.slot : (isPotion ? 'Consumable' : 'Item');
    const title = (item.favorite ? '★ ' : '') + item.name + (item.refineLevel > 0 ? ` +${item.refineLevel}` : '');

    let body = '<div class="flex flex-col gap-2 text-left text-xs">';
    body += `<div class="flex justify-between items-center">
        <span class="${rarity ? rarity.text : 'text-slate-300'} font-bold text-[11px]">${rarity ? rarity.name + ' (Rarity ' + item.rarity + ')' : kind}</span>
        <span class="text-[10px] text-slate-400 capitalize">${item.favorite ? '★ Favorite · ' : ''}${kind}</span></div>`;
    if (isEquip && item.levelReq) body += `<span class="text-[10px] text-slate-400">Requires Base Lv. ${item.levelReq}</span>`;
    if (isEquip && item.element) body += `<span class="text-[11px]">${elementDetailHTML(item.element)}</span>`;
    if (!isEquip && item.desc) body += `<p class="text-[11px] text-slate-400">${item.desc}</p>`;
    if (isPotion) body += `<span class="text-[11px] text-emerald-300">Restores ${item.heal} HP · Qty ${item.qty || 1}</span>`;
    if (item.setName) body += setInfoHTML(item.setName);
    if (isEquip && item.slot !== 'pet') {
        body += compareHTML(item, player.equipped[item.slot]);
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
    if (isEquip) actions += `<button onclick="toggleFavorite(${index})" class="${btn} bg-slate-800 hover:bg-slate-700 text-amber-300">${item.favorite ? '★ Unfavorite' : '☆ Favorite'}</button>`;
    if (isEquip && item.slot !== 'pet' && !item.favorite) actions += `<button onclick="salvageFromDetail(${index})" class="${btn} bg-red-600 hover:bg-red-500 text-slate-100">Salvage</button>`;
    if (item.slot !== 'pet' && !item.favorite) actions += `<button onclick="sellFromDetail(${index})" class="${btn} bg-amber-700 hover:bg-amber-600 text-amber-100">Sell ${getSellPrice(item)} Gold</button>`;
    actions += '</div>';
    actions += `<button onclick="closeModal()" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer">Close</button></div>`;

    showModal(title, '', body + actions);
}

function equipFromDetail(index) { if (executeEquipItem(index)) closeModal(); }
function usePotionFromDetail(index) { if (useInventoryPotion(index)) closeModal(); }
function salvageFromDetail(index) { salvageEquipmentItem(index); closeModal(); }
function sellFromDetail(index) { if (sellInventoryItem(index)) closeModal(); }

function useOrEquipItem(index) { showItemDetail(index); }

function showEquippedDetail(slot) {
    const item = player.equipped[slot];
    if (!item || !item.name) return;
    const isPotion = slot === 'potionSlot';
    const rarity = RARITY_INFO[item.rarity];
    const title = (item.favorite ? '★ ' : '') + item.name + (item.refineLevel > 0 ? ` +${item.refineLevel}` : '');

    let body = '<div class="flex flex-col gap-2 text-left text-xs">';
    body += `<div class="flex justify-between items-center">
        <span class="${rarity ? rarity.text : 'text-slate-300'} font-bold text-[11px]">${rarity ? rarity.name + ' (Rarity ' + item.rarity + ')' : (isPotion ? 'Consumable' : 'Equipped')}</span>
        <span class="text-[10px] text-slate-400 capitalize">${item.favorite ? '★ Favorite · ' : ''}Equipped · ${slot}</span></div>`;
    if (item.desc) body += `<p class="text-[11px] text-slate-400">${item.desc}</p>`;
    if (item.levelReq) body += `<span class="text-[10px] text-slate-400">Requires Base Lv. ${item.levelReq}</span>`;
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
    if (isPotion) body += `<span class="text-[11px] text-emerald-300">Restores ${item.heal} HP · Qty ${item.qty || 1}</span>`;
    body += '</div>';

    const btn = 'flex-1 py-2 font-bold rounded-xl text-xs transition cursor-pointer';
    let actions = '<div class="flex flex-col gap-2 mt-2"><div class="flex gap-2">';
    if (!isPotion) actions += `<button onclick="unequipFromDetail('${slot}')" class="${btn} bg-red-600/60 hover:bg-red-600 text-red-100">Unequip</button>`;
    if (!isPotion) actions += `<button onclick="toggleEquippedFavorite('${slot}')" class="${btn} bg-slate-800 hover:bg-slate-700 text-amber-300">${item.favorite ? '★ Unfavorite' : '☆ Favorite'}</button>`;
    actions += `</div><button onclick="closeModal()" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer">Close</button></div>`;

    showModal(title, '', body + actions);
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
            alert("Inventory is full! Make room before swapping potions.");
            return false;
        }
        logMessage(`[Potion] Returned ${old.name} x${old.qty} to inventory`, 'drop');
        player.equipped.potionSlot = { name: "", type: "potion", heal: 0, qty: 0, desc: "" };
    }

    const slot = player.equipped.potionSlot;
    const current = (slot && slot.name === item.name) ? (slot.qty || 0) : 0;
    const space = MAX_SLOT - current;
    if (space <= 0) {
        alert(`Potion Slot is full.`);
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
    const unit = Math.floor(getItemBasePrice(item) / 2);
    return unit * (item.qty || 1);
}

function sellInventoryItem(index) {
    const item = player.inventory[index];
    if (!item) return false;
    if (item.favorite) { alert("Favorite items cannot be sold. Unmark it first."); return false; }
    const total = getSellPrice(item);
    const qtyText = (item.qty || 1) > 1 ? ` x${item.qty}` : '';
    if (!confirm(`Sell ${item.name}${qtyText} for ${total} Gold?`)) return false;
    player.gold += total;
    player.inventory[index] = null;
    logMessage(`[Shop] Sold ${item.name}${qtyText} for ${total} Gold`, 'drop');
    updateUI();
    saveGame();
    return true;
}

function executeEquipItem(index) {
    let item = player.inventory[index];
    if (!item) return false;
    if (player.baseLv < (item.levelReq || 1)) {
        alert(`Requires Base Level ${item.levelReq || 1}!`);
        return false;
    }
    let currentEquipped = player.equipped[item.slot];
    player.equipped[item.slot] = item;
    player.inventory[index] = currentEquipped ? { ...currentEquipped } : null;
    logMessage(`[Equipment] Equipped ${item.name}`, 'drop');
    updateUI();
    saveGame();
    return true;
}

function salvageEquipmentItem(index) {
    let item = player.inventory[index];
    if (!item || !item.slot) return;
    if (item.favorite) { alert("Favorite items cannot be salvaged. Unmark it first."); return; }
    let scrapGain = Math.min(5, Math.max(1, Math.floor((item.levelReq || 1) / 5) + 1));

    player.inventory[index] = null;
    if (!addScraps(scrapGain)) {
        player.inventory[index] = item;
        alert("Inventory is full! Cannot salvage.");
        return;
    }
    logMessage(`[Salvage] Salvaged ${item.name} for ${scrapGain} Iron Scrap(s)`, 'drop');
    updateUI();
    saveGame();
}

function manualDrinkPotion() {
    if (currentMode === 'daily') {
        alert("Health potions are disabled in the Daily Challenge.");
        return;
    }
    let derived = getDerivedStats();
    let potionSlot = player.equipped.potionSlot;
    if (!potionSlot || (potionSlot.qty || 0) <= 0) {
        alert("No potions equipped!");
        return;
    }
    let healAmt = potionSlot.heal || 50;
    potionSlot.qty--;
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

function addStat(statKey) {
    if (player.statPoints - pendingStatTotal() <= 0) return;
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
        if (parent.level + (pendingAlloc.skills[s.req] || 0) < 1) {
            alert(`Requires unlocking prerequisite skill: ${parent.name}!`);
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
            sBar.innerHTML = '<span class="text-[10px] text-slate-500">Allocate with +, then confirm the batch.</span>';
        }
    }
    const kBar = document.getElementById('skill-pending-bar');
    if (kBar) {
        const total = pendingSkillTotal();
        if (total > 0) {
            const parts = Object.entries(pendingAlloc.skills).filter(([, n]) => n > 0).map(([k, n]) => `${player.skills[k].name} +${n}`).join(', ');
            kBar.innerHTML = `<div class="p-2 rounded-lg bg-purple-500/10 border border-purple-500/40 flex flex-col gap-2 text-[10px]">
                <span class="text-purple-200">Pending: ${parts} (${total} SP)</span>
                <div class="flex gap-2">
                    <button onclick="resetPendingSkills()" class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg cursor-pointer">Reset</button>
                    <button onclick="confirmPendingSkills()" class="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold rounded-lg cursor-pointer">Confirm ${total} SP</button>
                </div></div>`;
        } else {
            kBar.innerHTML = '<span class="text-[10px] text-slate-500">Allocate with +1 SP, then confirm the batch.</span>';
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
function claimMail(mailId) {
    if (!player.mailBox) return;
    let mail = player.mailBox.find(m => m.id === mailId);
    if (!mail || mail.claimed) return;

    mail.claimed = true;
    if (mail.rewards.gold) player.gold += mail.rewards.gold;
    if (mail.rewards.diamonds) player.diamonds += mail.rewards.diamonds;
    if (mail.rewards.refiningStones) player.refiningStones += mail.rewards.refiningStones;
    if (mail.rewards.resurrection) player.resurrectionPotions = (player.resurrectionPotions || 0) + mail.rewards.resurrection;
    if (mail.rewards.chest) openChest(mail.rewards.chest);

    logMessage(`[Mail] Claimed rewards from "${mail.title}"`, 'drop');
    renderMailBox();
    updateUI();
    saveGame();
}

function renderMailBox() {
    let container = document.getElementById('mailbox-container');
    if (!container) return;
    container.innerHTML = '';

    if (!player.mailBox || player.mailBox.length === 0) player.mailBox = createWelcomeMail();

    player.mailBox.forEach(m => {
        container.innerHTML += `
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                    <span class="font-bold text-amber-400 block">${m.title}</span>
                    <span class="text-[10px] text-slate-400 block">${m.message}</span>
                    <span class="text-[9px] text-purple-300 block mt-1">From: ${m.sender}</span>
                </div>
                ${!m.claimed ? `
                    <button onclick="claimMail(${m.id})" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer transition">Claim</button>
                ` : `<span class="text-[10px] text-emerald-400 font-bold">Claimed</span>`}
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

// Chest rewards: gold range (inclusive), rarity roll per item, and item count
const CHEST_REWARDS = {
    copper: { goldMin: 1, goldMax: 500, rarities: [1], items: 1 },
    silver: { goldMin: 501, goldMax: 1000, rarities: [2, 3], items: 1 },
    gold:   { goldMin: 1501, goldMax: 2000, rarities: [3, 4], items: 2 }
};

function openChest(chestType) {
    const cfg = CHEST_REWARDS[chestType] || CHEST_REWARDS.copper;
    const goldReward = cfg.goldMin + Math.floor(Math.random() * (cfg.goldMax - cfg.goldMin + 1));
    player.gold += goldReward;
    const rewardNames = [`${goldReward} Gold`];

    const pool = typeof SHOP_ARMORY_ITEMS !== 'undefined' ? SHOP_ARMORY_ITEMS : [];
    if (pool.length > 0) {
        for (let i = 0; i < cfg.items; i++) {
            const rarity = cfg.rarities[Math.floor(Math.random() * cfg.rarities.length)];
            const template = pool[Math.floor(Math.random() * pool.length)];
            const gear = generatePoEItem(template, rarity, 1);
            addItemToInventory(gear);
            rewardNames.push(`${gear.name} (Rarity ${gear.rarity})`);
        }
    }

    showModal("Chest Opened!", `You received:\n• ` + rewardNames.join('\n• '));
    updateUI();
    saveGame();
}

function renderQuestsView() {
    let container = document.getElementById('quests-container');
    if (!container) return;
    container.innerHTML = '';

    if (!player.dailyQuests || player.dailyQuests.length === 0) {
        player.dailyQuests = [
            { id: 'q_porings', title: "Poring Exterminator", desc: "Defeat 45 monsters during expeditions.", target: 45, current: 0, rewardChest: "copper", completed: false },
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
                    <span class="text-slate-300">Copper Chest</span>
                    ${player.questMilestoneClaimed[1] ? '<span class="text-emerald-400 block">Claimed</span>' : ''}
                </button>
                <button onclick="claimQuestMilestone(2)" ${completedCount < 2 || player.questMilestoneClaimed[2] ? 'disabled' : ''} class="p-2 bg-slate-900 border-slate-500/40 rounded text-center text-[10px] cursor-pointer disabled:opacity-50">
                    <span class="block font-bold text-slate-300">2 Quests</span>
                    <span class="text-slate-300">Silver Chest</span>
                    ${player.questMilestoneClaimed[2] ? '<span class="text-emerald-400 block">Claimed</span>' : ''}
                </button>
                <button onclick="claimQuestMilestone(3)" ${completedCount < 3 || player.questMilestoneClaimed[3] ? 'disabled' : ''} class="p-2 bg-slate-900 border-purple-500/40 rounded text-center text-[10px] cursor-pointer disabled:opacity-50">
                    <span class="block font-bold text-purple-300">3 Quests</span>
                    <span class="text-slate-300">Gold Chest</span>
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

function updateUI() {
    let derived = getDerivedStats();
    player.hp = Math.min(player.hp, derived.maxHp);

    let el = document.getElementById('header-player-name');
    if (el) el.innerText = player.name;
    el = document.getElementById('combat-player-name');
    if (el) el.innerText = player.name;
    updateAvatarDisplay();

    el = document.getElementById('header-base-lv');
    if (el) el.innerText = player.baseLv;
    el = document.getElementById('header-job-lv');
    if (el) el.innerText = player.jobLv;
    el = document.getElementById('header-gold');
    if (el) el.innerText = `${player.gold} Gold`;
    el = document.getElementById('header-diamonds');
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

    let eqContainer = document.getElementById('equipment-slots-container');
    if (eqContainer) {
        eqContainer.innerHTML = '';
        for (let [slot, gear] of Object.entries(player.equipped)) {
            let refText = gear && gear.refineLevel > 0 ? ` +${gear.refineLevel}` : '';
            let qtyText = gear && gear.qty > 0 ? ` (x${gear.qty})` : '';
            let slotDisplayName = slot === 'potionSlot' ? 'Potion Slot' : slot;
            eqContainer.innerHTML += `
                <div ${gear && gear.name ? `onclick="showEquippedDetail('${slot}')"` : ''} class="flex justify-between items-center p-2.5 bg-slate-900/60 rounded border border-slate-800 ${gear && gear.name ? 'cursor-pointer hover:border-amber-500 transition' : ''}">
                    <div>
                        <span class="text-slate-400 capitalize block text-[10px]">${slotDisplayName}</span>
                        <span class="font-semibold text-slate-200 text-xs">${gear && gear.name ? gear.name + refText + qtyText + elemIconText(gear) : 'Empty'}</span>
                    </div>
                    ${gear && gear.name ? `<button onclick="event.stopPropagation(); unequipItem('${slot}')" class="px-2.5 py-1 bg-red-600/40 hover:bg-red-600 text-[10px] text-red-200 font-bold rounded transition cursor-pointer">Unequip</button>` : ''}
                </div>
            `;
        }
    }

    let invGrid = document.getElementById('inventory-grid');
    if (invGrid) {
        invGrid.innerHTML = '';
        if (!Array.isArray(player.inventory)) player.inventory = new Array(40).fill(null);
        let filledSlots = 0;
        player.inventory.forEach((item, index) => {
            if (item) filledSlots++;
            let itemName = item ? item.name : '';
            let refText = item && item.refineLevel > 0 ? ` +${item.refineLevel}` : '';
            let rInfo = item ? RARITY_INFO[item.rarity] : null;
            let rarityColor = rInfo ? `${rInfo.border} ${rInfo.text}` : 'border-slate-700 text-slate-200';
            
            invGrid.innerHTML += `
                <div onclick="showItemDetail(${index})" class="h-14 bg-slate-900/80 border ${rarityColor} rounded flex flex-col justify-center items-center p-1 text-center cursor-pointer hover:border-amber-500 transition relative group">
                    <span class="text-[9px] font-bold truncate w-full px-1">${itemName + refText}${elemIconText(item)}</span>
                    ${item && item.favorite ? '<span class="absolute top-0.5 right-1 text-[11px] text-amber-300 leading-none">★</span>' : ''}
                    ${item && item.qty > 1 ? `<span class="absolute bottom-1 right-1 text-[9px] font-mono font-bold text-amber-300 bg-slate-950/80 px-1 rounded">x${item.qty}</span>` : ''}
                </div>
            `;
        });
        let invCountEl = document.getElementById('inventory-count');
        let scrapsCount = player.materials?.ironScraps || 0;
        if (invCountEl) invCountEl.innerText = `${filledSlots} / 40 slots`;
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
    if (el) el.innerText = `${derived.currentWeight} / ${derived.maxWeight}`;
    el = document.getElementById('sp-count');
    if (el) el.innerText = player.jobSp - pendingSkillTotal();

    let skillContainer = document.getElementById('skill-tree-container');
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
    const armorNow = Math.max(0, player.armor || 0);
    el = document.getElementById('player-armor-text');
    if (el) el.innerText = `${armorNow} / ${derived.maxArmor}`;
    el = document.getElementById('player-armor-bar');
    if (el) el.style.width = `${derived.maxArmor > 0 ? (armorNow / derived.maxArmor) * 100 : 0}%`;

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
    if (el) {
        const ps = player.equipped.potionSlot;
        el.innerText = (ps && ps.qty > 0) ? `${ps.name} x${ps.qty}` : 'None';
    }
    el = document.getElementById('player-resurrection');
    if (el) el.innerText = `${player.resurrectionPotions || 0} left`;

    el = document.getElementById('combat-rune-list');
    if (el) {
        const runes = player.currentRunRunes || [];
        if (runes.length === 0) {
            el.innerHTML = '<span class="text-slate-500">No runes acquired yet this run.</span>';
        } else {
            const grouped = {};
            runes.forEach(r => {
                if (!grouped[r.id]) grouped[r.id] = { ...r, count: 0 };
                grouped[r.id].count++;
            });
            el.innerHTML = Object.values(grouped).map(r =>
                `<div class="text-purple-300">✦ ${r.name}${r.count > 1 ? ' <span class="text-amber-300 font-bold">x' + r.count + '</span>' : ''} <span class="text-slate-400">— ${RUNE_DEFS[r.id] ? RUNE_DEFS[r.id].text(runeN(r.id)) : r.desc}</span></div>`
            ).join('');
        }
    }

    // Render Monsters Lineup during Combat
    let lineupContainer = document.getElementById('monsters-lineup-container');
    if (lineupContainer && typeof monstersList !== 'undefined') {
        lineupContainer.innerHTML = '';
        let targetIdx = monstersList.findIndex(m => m.hp > 0);
        monstersList.forEach((m, idx) => {
            let isDead = m.hp <= 0;
            let isTarget = !isDead && idx === targetIdx;
            let borderColor = isDead ? 'border-slate-800 bg-slate-950/40 opacity-50' : (isTarget ? 'border-amber-500 bg-slate-900/90 shadow-md' : 'border-slate-800 bg-slate-950/40 opacity-70');
            let hpPct = Math.max(0, (m.hp / m.maxHp) * 100);
            let tag = isDead ? '<span class="text-[10px] text-slate-400">(Defeated)</span>' : (isTarget ? '<span class="text-[10px] text-amber-400">(Target)</span>' : '');

            lineupContainer.innerHTML += `
                <div class="p-2.5 rounded-lg border ${borderColor} flex flex-col gap-1.5 transition-all">
                    <div class="flex justify-between items-center text-xs">
                        <span class="flex items-center gap-1.5 flex-wrap"><span class="font-bold text-red-400">${['1st','2nd','3rd','4th','5th'][idx] || (idx+1)+'th'}: ${m.name}</span>${elemTagHTML(m)} ${tag}</span>
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

function logMessage(msg, type = 'combat') {
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
            <button ${can ? '' : 'disabled'} onclick="startEvent('daily')" class="py-3 font-bold rounded-xl text-xs transition mt-auto ${can ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 cursor-pointer shadow' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}">${can ? 'Start Daily Challenge' : 'Locked'}</button>`;
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
        runesEl.innerHTML = Object.keys(RUNE_DEFS).map(id => {
            const r = RUNE_DEFS[id];
            const rar = RARITY_INFO[r.rarity] || RARITY_INFO[1];
            const kind = r.flag ? 'One-time per run' : 'Stackable (picks add up)';
            return `<div class="p-3 rounded-xl bg-slate-950 border ${rar.border} flex flex-col gap-1">
                <div class="flex justify-between items-center"><span class="font-bold text-xs ${rar.text}">✨ ${r.name}</span><span class="text-[9px] uppercase ${rar.text}">${rar.name} · R${r.rarity}</span></div>
                <span class="text-[10px] text-slate-300">${r.desc}</span>
                <span class="text-[9px] text-slate-500">${kind}</span></div>`;
        }).join('');
    }
    if (monstersEl && typeof MONSTERS_DATA !== 'undefined') {
        const rows = Object.values(MONSTERS_DATA).map(m => {
            const el = m.element && ELEMENTS[m.element] ? `${ELEMENTS[m.element].icon} ${ELEMENTS[m.element].name}` : 'None';
            const type = m.isBoss ? 'Boss' : (m.isRanged ? 'Ranged' : 'Melee');
            return `<tr class="border-t border-slate-800 ${m.isBoss ? 'text-amber-300' : 'text-slate-200'}">
                <td class="py-1.5 pr-2">${m.name}</td><td class="pr-2">${type}</td><td class="pr-2">${el}</td>
                <td class="pr-2 font-mono">${m.maxHp}</td><td class="pr-2 font-mono">${m.atkMin}-${m.atkMax}</td>
                <td class="pr-2 font-mono">${m.hit}</td><td class="font-mono">${m.flee}</td></tr>`;
        }).join('');
        monstersEl.innerHTML = `<div class="overflow-x-auto"><table class="w-full text-[10px] text-left">
            <thead><tr class="text-slate-400 uppercase"><th class="pb-1 pr-2">Name</th><th class="pr-2">Type</th><th class="pr-2">Element</th><th class="pr-2">HP</th><th class="pr-2">ATK</th><th class="pr-2">HIT</th><th>FLEE</th></tr></thead>
            <tbody>${rows}</tbody></table></div>
            <p class="text-[10px] text-slate-500 mt-2">Campaign monsters take the element of their path. Bosses are about 25% stronger and mini bosses have 3x HP.</p>`;
    }
}

// ---------- LIBRARY: RULES, ELEMENTS, DROPS, CHESTS ----------
function renderLibraryRules() {
    const el = document.getElementById('library-rules');
    if (!el || typeof ELEMENTS === 'undefined') return;
    const elementRows = ELEMENT_KEYS.map(k => {
        const e = ELEMENTS[k];
        const b = ELEMENTS[e.beats];
        return `<li><span class="${e.color}">${e.icon} ${e.name}</span> beats <span class="${b.color}">${b.icon} ${b.name}</span> (x${ELEMENT_ADVANTAGE} damage). Hitting it with ${b.name} deals x${ELEMENT_DISADVANTAGE}.</li>`;
    }).join('');
    el.innerHTML = `
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Element System</h3>
            <ul class="list-disc pl-4 text-[10px] text-slate-300 flex flex-col gap-1">${elementRows}</ul>
            <p class="text-[10px] text-slate-500 mt-2">Weapons can roll one element. Campaign monsters take the element of their path (Fire, Water, Earth or Wind). Event and daily monsters keep their own base element.</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Monster Status</h3>
            <ul class="list-disc pl-4 text-[10px] text-slate-300 flex flex-col gap-1">
                <li><span class="text-sky-300">Frozen</span>: 50% chance to skip its attack.</li>
                <li><span class="text-orange-400">Ignite</span> and <span class="text-lime-400">Poison</span>: damage over time while afflicted.</li>
                <li><span class="text-amber-300">Boss</span>: about 25% stronger, uses special skills, enrages in later turns.</li>
                <li><span class="text-amber-200">Mini Boss</span>: appears on stage 9 of campaign and event maps, has 3x HP.</li>
            </ul>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Monster Drop Rates</h3>
            <table class="w-full text-[10px] text-left text-slate-300">
                <tr class="border-b border-slate-800"><td class="py-1">Normal monster</td><td class="font-mono text-right">5%</td></tr>
                <tr class="border-b border-slate-800"><td class="py-1">Mini Boss</td><td class="font-mono text-right">50%</td></tr>
                <tr><td class="py-1">Boss (MVP)</td><td class="font-mono text-right">100%</td></tr>
            </table>
        </div>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h3 class="font-bold text-xs text-amber-400 mb-2">Chests</h3>
            <table class="w-full text-[10px] text-left text-slate-300">
                <tr class="border-b border-slate-800"><td class="py-1">Copper Chest</td><td>500 Gold + armory item (Rarity 1)</td></tr>
                <tr class="border-b border-slate-800"><td class="py-1">Silver Chest</td><td>1000 Gold + armory item (Rarity 2)</td></tr>
                <tr><td class="py-1">Gold Chest</td><td>1500 Gold + armory item (Rarity 3)</td></tr>
            </table>
            <p class="text-[10px] text-slate-500 mt-2">Gold shop: Copper 1000, Silver 4000, Gold 8000 Gold. Diamond shop: Copper 1, Silver 3, Gold 5 Diamond.</p>
        </div>`;
}
