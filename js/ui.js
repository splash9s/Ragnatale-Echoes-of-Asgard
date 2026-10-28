// ==========================================
// RAGNATALE - UI.JS
// ==========================================

const AVATARS = ["assets/avatars/abyssalimp.png", "assets/avatars/cavebat.png", "assets/avatars/farbo.png", "assets/avatars/leafspritemage.png", "assets/avatars/mossyboulder.png", "assets/avatars/slime.png", "assets/avatars/snowwolf.png", "assets/avatars/starlightmender.png"];
// Avatar value is either an emoji or an image path (assets/avatars/... or data:image...)
function avatarMarkup(av, cls) {
    if (av && (av.startsWith("assets/") || av.startsWith("data:image"))) return `<img src="${av}" class="${cls}" />`;
    return `<img src="assets/avatars/slime.png" class="${cls}" />`;
}
let selectedAvatarChoice = "assets/avatars/slime.png";
let currentLanguage = 'en';
const SHOP_ARMORY_ITEMS = (typeof SHOP_ITEMS !== 'undefined' ? SHOP_ITEMS : []).slice().sort((a, b) => (a.levelReq || 1) - (b.levelReq || 1));

const GOLD_SHOP_CONSUMABLES = [
    { id: 'potion_minor', name: "Minor Healing Potion", price: 50, type: 'potion', heal: 50, desc: "Restores 50 HP" },
    { id: 'potion_med', name: "Medium Healing Potion", price: 150, type: 'potion', heal: 150, desc: "Restores 150 HP" },
    { id: 'potion_large', name: "Large Healing Potion", price: 400, type: 'potion', heal: 400, desc: "Restores 400 HP" },
    { id: 'gchest_copper', name: "Copper Chest", price: 1000, type: 'chest', chestType: 'copper', desc: "Opens for 1-500 Gold and 1 armory item (Rarity 1)." },
    { id: 'gchest_silver', name: "Silver Chest", price: 4000, type: 'chest', chestType: 'silver', desc: "Opens for 501-1000 Gold and 1 armory item (Rarity 2-3)." },
    { id: 'gchest_gold', name: "Gold Chest", price: 8000, type: 'chest', chestType: 'gold', desc: "Opens for 1501-2000 Gold and 2 armory items (Rarity 3-4)." }
];

const DIAMOND_SHOP_ITEMS = [
    { id: 'vip_pass', name: "VIP Pass (30 days)", desc: "Auto next stage, no walking between stages, 1 Resurrection Potion by mail every day.", price: 200, type: 'vip', days: 30 },
    { id: 'vip_7d', name: "VIP Pass (7 days)", desc: "Auto next stage, no walking between stages, 1 Resurrection Potion by mail every day.", price: 50, type: 'vip', days: 7 },
    { id: 'vip_1d', name: "VIP Pass (1 day)", desc: "Auto next stage, no walking between stages, 1 Resurrection Potion by mail every day.", price: 10, type: 'vip', days: 1 },
    { id: 'pet_loyal_slime', name: "Loyal Slime Pet", desc: "ATK +2%, HP +50", price: 50, type: 'pet', stats: { hp: 50, atkPct: 2 } },
    { id: 'res_potion', name: "Resurrection Potion", price: 3, type: 'resurrection', desc: "Auto-revives you with full HP on death." },
    { id: 'ref_stone_bundle', name: "Refining Stone Bundle (x5)", price: 8, type: 'material', qty: 5, desc: "Gain 5 Refining Stones for upgrading equipment." },
    { id: 'stat_reset', name: "Stat Reset Service", price: 10, type: 'service', desc: "Resets all attributes to 1 and refunds all spent stat points." },
    { id: 'skill_reset', name: "Skill Reset Service", price: 10, type: 'skill_reset', desc: "Resets all skill levels and refunds all spent Class SP." },
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

// Combat animation: idle frames loop; after a hit, the damage frames play once (4 frames)
// One damage picture, shown for 480ms after a hit
const COMBAT_SLIME_DAMAGE_FRAMES = ['assets/combat/slime/slime_dead_0002.png'];
const COMBAT_DAMAGE_FRAME_MS = 480;
// Death: slime_dead_0001 to 0006 play once (150ms each), then the monster disappears
const COMBAT_SLIME_DEATH_FRAMES = Array.from({ length: 6 }, (_, i) => `assets/combat/slime/slime_dead_${String(i + 1).padStart(4, '0')}.png`);
const COMBAT_DEATH_FRAME_MS = 150;
const COMBAT_DEATH_TOTAL_MS = COMBAT_SLIME_DEATH_FRAMES.length * COMBAT_DEATH_FRAME_MS;
const COMBAT_SLIME_FRAMES = Array.from({ length: 12 }, (_, i) => `assets/combat/slime/slime_${String(i + 1).padStart(4, '0')}.png`).join(',');
const COMBAT_CHA_FRAMES = Array.from({ length: 12 }, (_, i) => `assets/combat/cha/cha_idle_${String(i + 1).padStart(4, '0')}.png`).join(',');
// Floating damage number over a combat sprite (white normal, red critical)
function showCombatNumber(selector, amount, crit) {
    const view = document.getElementById('view-combat');
    if (!view || view.classList.contains('hidden') || !(amount > 0)) return;
    const anchor = document.querySelector(selector);
    const stage = document.querySelector('#combat-stage .ts-inner');
    if (!anchor || !stage) return;
    const sc = parseFloat(stage.style.transform.replace(/[^0-9.]/g, '')) || 1;
    const b = anchor.getBoundingClientRect(), ib = stage.getBoundingClientRect();
    const d = document.createElement('div');
    d.className = 'combat-dmg' + (crit ? ' crit' : '');
    d.textContent = Math.round(amount);
    d.style.left = ((b.left + b.width / 2 - ib.left) / sc) + 'px';
    d.style.top = ((b.top - ib.top) / sc) + 'px';
    stage.appendChild(d);
    setTimeout(() => d.remove(), 900);
}

// Player attack: the battle sprite plays the hit frames, or the uppercut frames on a critical hit, then returns to idle
const COMBAT_PLAYER_HIT_FRAMES = ['assets/combat/player/hit_0001.png', 'assets/combat/player/hit_0002.png'];
const COMBAT_PLAYER_CRI_FRAMES = ['assets/combat/player/cri_0001.png', 'assets/combat/player/cri_0002.png'];
const COMBAT_PLAYER_ATTACK_FRAME_MS = 150;
const COMBAT_PLAYER_HIT_SIZES = [[200, 214], [200, 214]]; // width, height of each hit frame
const COMBAT_PLAYER_CRI_SIZES = [[138, 199], [120, 231]]; // width, height of each critical frame
let combatPlayerAttack = { at: 0, crit: false };
function playPlayerAttackAnim(isCrit) {
    combatPlayerAttack = { at: Date.now(), crit: !!isCrit };
}
setInterval(() => {
    const now = Date.now();
    document.querySelectorAll('img.idle-anim').forEach(img => {
        if (img.id === 'combat-player-sprite') {
            const frames = combatPlayerAttack.crit ? COMBAT_PLAYER_CRI_FRAMES : COMBAT_PLAYER_HIT_FRAMES;
            const e = now - combatPlayerAttack.at;
            if (combatPlayerAttack.at && e >= 0 && e < frames.length * COMBAT_PLAYER_ATTACK_FRAME_MS) {
                const idx = Math.floor(e / COMBAT_PLAYER_ATTACK_FRAME_MS);
                img.src = frames[idx];
                // Attack frames keep their own size, bottom-centred on the idle sprite
                const [w, h] = (combatPlayerAttack.crit ? COMBAT_PLAYER_CRI_SIZES : COMBAT_PLAYER_HIT_SIZES)[idx];
                img.style.left = (515.5 - w / 2) + 'px';
                img.style.top = (871 - h) + 'px';
                img.style.width = w + 'px';
                img.style.height = h + 'px';
                return;
            }
            img.style.left = '464px';
            img.style.top = '657px';
            img.style.width = '103px';
            img.style.height = '214px';
        }
        const deathAt = Number(img.dataset.deathAt) || 0;
        if (deathAt) {
            const e = now - deathAt;
            if (e < COMBAT_DEATH_TOTAL_MS) img.src = COMBAT_SLIME_DEATH_FRAMES[Math.floor(e / COMBAT_DEATH_FRAME_MS)];
            else if (img.parentElement) img.parentElement.style.display = 'none';
            return;
        }
        const hitAt = Number(img.dataset.hitAt) || 0;
        const elapsed = now - hitAt;
        if (hitAt && elapsed >= 0 && elapsed < COMBAT_SLIME_DAMAGE_FRAMES.length * COMBAT_DAMAGE_FRAME_MS) {
            img.src = COMBAT_SLIME_DAMAGE_FRAMES[Math.floor(elapsed / COMBAT_DAMAGE_FRAME_MS)];
            return;
        }
        const frames = img.dataset.frames.split(',');
        img.src = frames[Math.floor(now / 250) % frames.length]; // idle: one frame every 250ms
    });
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
    if (!container) return;
    container.innerHTML = avatarMarkup(player.avatar, 'w-full h-full object-cover');
}

// Player stat avatar: click to choose a monster avatar
function openAvatarPicker() {
    const options = AVATARS.map(av => `
        <button onclick="pickPlayerAvatar('${av}')" class="h-16 w-16 rounded-xl border border-slate-700 bg-slate-900 hover:border-amber-400 cursor-pointer overflow-hidden">
            ${avatarMarkup(av, 'w-full h-full object-cover')}
        </button>`).join('');
    showModal("Choose Avatar", "", `<div class="grid grid-cols-4 gap-3 justify-items-center">${options}</div>`);
}
function pickPlayerAvatar(av) {
    player.avatar = av;
    selectedAvatarChoice = av;
    updateUI();
    saveGame();
    closeModal();
}

// Click a rune window in combat to see the rune's full detail
function showRuneDetail(index) {
    const r = (player.currentRunRunes || [])[index];
    if (!r) return;
    const def = RUNE_DEFS[r.id];
    showModal(r.name, def ? def.text(runeN(r.id)) : r.desc);
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
    let views = ['view-town', 'view-expeditions', 'view-events', 'view-skills', 'view-library', 'view-setting', 'view-character', 'view-shop', 'view-blacksmith', 'view-diamond', 'view-quests', 'view-combat'];
    views.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    // Header (gold/diamond) only on non-town screens; town shows the full info panel.
    document.getElementById('app-header')?.classList.toggle('hidden', ['town', 'expeditions', 'events', 'diamond', 'quests', 'setting', 'shop', 'blacksmith', 'character', 'skills', 'combat'].includes(viewName));
    if (viewName === 'expeditions' && window.closeCampaignPanel) window.closeCampaignPanel();
    // Transparent html/body background on art screens (see .art-mode in index.html)
    const artViews = ['expeditions', 'events', 'diamond', 'quests', 'setting', 'shop', 'blacksmith', 'character', 'skills', 'combat'];
    document.documentElement.classList.toggle('art-mode', artViews.includes(viewName));
    document.body.classList.toggle('art-mode', artViews.includes(viewName));

    if (viewName === 'town') document.getElementById('view-town')?.classList.remove('hidden');
    if (viewName === 'expeditions') {
        document.getElementById('view-expeditions')?.classList.remove('hidden');
        renderMapGateUI();
    }
    if (viewName === 'character') document.getElementById('view-character')?.classList.remove('hidden');
    if (viewName === 'skills') {
        document.getElementById('view-skills')?.classList.remove('hidden');
        renderSkillPage();
    }
    if (viewName === 'setting') document.getElementById('view-setting')?.classList.remove('hidden');
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
        renderShop();
    }
    if (viewName === 'blacksmith') {
        document.getElementById('view-blacksmith')?.classList.remove('hidden');
        renderRefiningUI();
    }
    if (viewName === 'diamond') {
        document.getElementById('view-diamond')?.classList.remove('hidden');
        renderDiamondShop();
    }
    if (viewName === 'quests') {
        document.getElementById('view-quests')?.classList.remove('hidden');
        renderMailBox();
    }
    if (viewName === 'combat') document.getElementById('view-combat')?.classList.remove('hidden');

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
    showModal("Free Reward", `You received ${item.name}. Come back tomorrow for another.`);
    updateUI();
    renderShop();
    renderDiamondShop();
    saveGame();
}

function dailyFreeCardHTML(key, buttonClass) {
    const item = DAILY_FREE_ITEMS[key];
    const claimed = isDailyFreeClaimed(key);
    return `
        <div class="p-3 bg-slate-950/60 rounded border border-slate-800 flex justify-between items-center">
            <div>
                <span class="font-bold text-amber-300 block text-xs">${item.name}</span>
                <span class="text-[10px] text-slate-400">${item.desc}</span>
            </div>
            <button onclick="claimDailyFree('${key}')" ${claimed ? 'disabled' : ''} class="px-3 py-1.5 ${buttonClass} font-bold rounded-lg cursor-pointer text-xs transition disabled:opacity-50">${claimed ? 'Claimed today' : 'Claim'}</button>
        </div>
    `;
}

// ---------- EVENTS PAGE TABS ----------
let currentEventsTab = 'events';

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
    if (btnQuests) btnQuests.setAttribute('style', `background-color: rgba(214, 190, 140, .5); color: #2a1a0e; ${tabName === 'quests' ? active : inactive}`);
    if (tabName === 'quests') renderQuestsView();
}

function renderShop() {
    let consumablesContainer = document.getElementById('shop-consumables-container');
    if (consumablesContainer) {
        consumablesContainer.innerHTML = dailyFreeCardHTML('gold', 'bg-amber-600 hover:bg-amber-500 text-slate-950');
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
                    <div>
                        <span class="font-bold text-amber-300 block text-xs">${item.name} <span class="text-slate-400 font-normal">[${slotLabel(item.slot)}]</span> (Req. Lv ${lvOf(item)})</span>
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
    showModal("Purchase Successful", `You purchased ${gearItem.name}!`);
    updateUI();
    saveGame();
}

function renderDiamondShop() {
    let container = document.getElementById('diamond-shop-items-container');
    let balanceEl = document.getElementById('diamond-shop-balance');
    if (balanceEl) balanceEl.innerText = player.diamonds;
    
    if (!container) return;
    container.innerHTML = dailyFreeCardHTML('diamond', 'bg-purple-600 hover:bg-purple-500 text-slate-950');

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
    if (item.type === 'vip' && isVipActive()) {
        showModal("VIP Active", `You already have a VIP Pass until ${new Date(player.vipUntil).toLocaleDateString()}. You can buy another after it expires.`);
        return;
    }

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
        showModal("Skill Reset Successful", `All skills reset and ${refunded} Class SP refunded!`);
    } else if (item.type === 'chest') {
        placeItemInInventory({ name: item.name, type: 'chest', chestType: item.chestType, desc: item.desc, qty: 1 });
        showModal("Purchase Successful", `You bought a ${item.name}! Open it from your inventory.`);
    } else if (item.type === 'vip') {
        player.vipUntil = Date.now() + item.days * 24 * 60 * 60 * 1000;
        grantVipDailyMail();
        showModal("VIP Activated", `${item.name} active. Check your mailbox for today's Resurrection Potion.`);
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
    if (!gear) return;
    // Gear without a valid level counts as +0; the level is never below +0
    gear.refineLevel = Math.max(0, Math.floor(Number(gear.refineLevel) || 0));
    if (gear.refineLevel >= 10) return;

    let current = gear.refineLevel;
    let costGold = (current + 1) * 100;
    if (player.gold < costGold || (player.refiningStones || 0) < 1) {
        alert(`Refining needs ${costGold} Gold and 1 Refining Stone.`);
        return;
    }

    player.gold -= costGold;
    player.refiningStones = Math.max(0, (player.refiningStones || 0) - 1);

    let successRate = current >= 4 ? Math.max(10, 100 - ((current - 3) * 15)) : 100;
    if (Math.random() * 100 <= successRate) {
        gear.refineLevel = current + 1;
        logMessage(`[Refine Success] Upgraded ${gear.name} to +${gear.refineLevel}!`, 'levelup');
        showModal("Refinement Successful!", `Your ${gear.name} was upgraded to +${gear.refineLevel}!`);
    } else {
        // Failure keeps the current level; only the gold and stone are lost
        gear.refineLevel = current;
        logMessage(`[Refine Failed] Upgrade failed. Materials consumed.`, 'combat');
        showModal("Refinement Failed", `The upgrade process failed. Your ${gear.name} stays at +${current}.`);
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
            alert("Inventory is full! Make room before unequipping potions.");
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
        return `<div class="${on ? 'text-emerald-300 font-semibold' : 'text-slate-500'}">(${bn.pieces} pcs) ${bn.desc}${sub}</div>`;
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
    if (isGearItem(item) && item.slot !== 'pet') body += `<span class="text-[11px] text-amber-200">Gear Tier ${gearTier(item)} (Rarity ${item.rarity} + ${(item.buffs || []).length} buffs = ${gearTierScore(item)})</span>`;
    if (isEquip && item.element) body += `<span class="text-[11px]">${elementDetailHTML(item.element)}</span>`;
    if (!isEquip && item.desc) body += `<p class="text-[11px] text-slate-400">${item.desc}</p>`;
    if (isPotion) body += `<span class="text-[11px] text-emerald-300">Restores ${item.heal} HP · Qty ${item.qty || 1}</span>`;
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
    if (item.favorite) { alert("Favorite items cannot be sold. Unmark it first."); return false; }
    if (item.slot && (item.levelReq || 1) >= 99) { alert("Level 99 gear cannot be sold to the shop."); return false; }
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

function executeEquipItem(index) {
    let item = player.inventory[index];
    if (!item) return false;
    if (player.baseLv < (item.levelReq || 1)) {
        alert(`Requires Base Level ${item.levelReq || 1}!`);
        return false;
    }
    const slotKey = item.slot === 'ring' ? (!player.equipped.ringLeft ? 'ringLeft' : (!player.equipped.ringRight ? 'ringRight' : 'ringLeft')) : item.slot;
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
    if (item.favorite) { alert("Favorite items cannot be salvaged. Unmark it first."); return; }
    let scrapGain = salvageScrapGain(item);
    const salvageMsg = `Salvage ${item.name}?\n\nYou get: ${scrapGain} Iron Scrap\nRarity: ${confirmRarityText(item)} · Lv ${item.levelReq || 1}\nStats lost: ${confirmStatText(item)}\n\nThis cannot be undone.`;
    if (item.rarity >= 3 && !confirm(salvageMsg)) return;

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

// Bag equipment that Salvage All / Sell All may touch: not favorites, not pets
function bulkEquipTargets() {
    return player.inventory.map((it, i) => ({ it, i })).filter(({ it }) => it && it.slot && it.slot !== 'pet' && !it.favorite);
}

function salvageAllEquipment() {
    const targets = bulkEquipTargets();
    if (targets.length === 0) { alert("No equipment to salvage."); return; }
    const gain = targets.reduce((n, { it }) => n + salvageScrapGain(it), 0);
    if (!confirm(`Salvage ${targets.length} equipment item(s)?\n\nYou get: ${gain} Iron Scrap\n\n${confirmItemList(targets)}\n\nFavorites are kept. This cannot be undone.`)) return;
    targets.forEach(({ i }) => { player.inventory[i] = null; });
    if (!addScraps(gain)) {
        targets.forEach(({ it, i }) => { player.inventory[i] = it; });
        alert("Inventory is full! Cannot salvage.");
        return;
    }
    logMessage(`[Salvage] Salvaged ${targets.length} item(s) for ${gain} Iron Scrap(s)`, 'drop');
    updateUI();
    saveGame();
}

function sellAllEquipment() {
    const targets = bulkEquipTargets().filter(({ it }) => (it.levelReq || 1) < 99);
    if (targets.length === 0) { alert("No equipment to sell."); return; }
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

// Dedicated Skills page: four build chains, each skill gated by the one before it
function renderSkillPage() {
    const root = document.getElementById('skill-build-columns');
    if (!root) return;
    const spEl = document.getElementById('skill-page-sp');
    const spLeft = player.jobSp - pendingSkillTotal();
    if (spEl) spEl.innerText = spLeft;
    root.innerHTML = SKILL_BUILDS.map(b => {
        const skills = Object.entries(player.skills).filter(([, s]) => s.build === b.key);
        const invested = skills.reduce((a, [k, s]) => a + s.level + (pendingAlloc.skills[k] || 0), 0);
        const cards = skills.map(([k, s]) => {
            const prev = s.req ? player.skills[s.req] : null;
            const prevLevel = prev ? prev.level + (pendingAlloc.skills[s.req] || 0) : 0;
            const locked = !!prev && prevLevel < s.reqLv;
            const lvl = s.level + (pendingAlloc.skills[k] || 0);
            const gate = prev
                ? `<div class="text-[9px] text-slate-500 text-center">▼ needs ${prev.name} Lv. ${s.reqLv}</div>`
                : '<div class="text-[9px] text-slate-500 text-center">▼ start</div>';
            const disabled = locked || lvl >= s.maxLv || spLeft <= 0;
            return `${gate}<div class="p-2 rounded-lg border ${locked ? 'border-slate-800' : b.border + ' bg-slate-950/60'} flex flex-col gap-1">
                <div class="flex justify-between items-center gap-2"><span class="font-bold text-xs ${b.color}">${s.name}</span><span class="text-[10px] text-slate-300">Lv. ${lvl}/${s.maxLv}</span></div>
                <p class="text-[10px] text-slate-400">${s.desc}</p>
                <button onclick="upgradeSkill('${k}')" ${disabled ? 'disabled' : ''} class="self-end px-2 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer disabled:opacity-40">+1 SP</button>
            </div>`;
        }).join('');
        return `<div class="flex flex-col gap-2 min-w-0">
            <div class="p-2 rounded-xl border ${b.border} bg-slate-950/60 flex items-baseline gap-2"><h3 class="font-bold text-sm ${b.color}">${b.name.replace(/\s*\(.*\)$/, '')}</h3><p class="text-[10px] text-slate-400">${invested}/${SKILL_BUILD_MAX_SP} SP</p></div>
            ${cards}
        </div>`;
    }).join('');
}

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
        if (parent.level + (pendingAlloc.skills[s.req] || 0) < s.reqLv) {
            alert(`Requires ${parent.name} Lv. ${s.reqLv}!`);
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
    el.innerHTML = INVENTORY_FILTERS.map(f => {
        const active = f.key === inventoryFilter;
        return `<button onclick="setInventoryFilter('${f.key}')" class="px-2 py-1 text-[10px] font-bold rounded border transition cursor-pointer ${active ? 'bg-amber-600 border-amber-500 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}">${f.label}</button>`;
    }).join('');
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
    renderInventoryFilters();
    renderElementStats();
    let derived = getDerivedStats();
    player.hp = Math.min(player.hp, derived.maxHp);

    let el = document.getElementById('header-player-name');
    if (el) el.innerText = player.name;
    el = document.getElementById('combat-player-name');
    if (el) el.innerText = player.name;
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
            { slot: 'hat', img: 'headslot.png', x: 0, y: 126 },
            { slot: 'midHead', img: 'middleheadslot.png', x: 370, y: 126 },
            { slot: 'mouth', img: 'lowerheadslot.png', x: 0, y: 234 },
            { slot: 'armor', img: 'armorslot.png', x: 370, y: 234 },
            { slot: 'weapon', img: 'weaponslot.png', x: 0, y: 342 },
            { slot: 'shield', img: 'shieldslot.png', x: 370, y: 342 },
            { slot: 'garment', img: 'garmentslot.png', x: 0, y: 450 },
            { slot: 'footgear', img: 'footslot.png', x: 370, y: 450 },
            { slot: 'ringLeft', img: 'ring.png', x: 0, y: 558 },
            { slot: 'ringRight', img: 'ring.png', x: 370, y: 558 },
            { slot: 'pet', img: 'petslot.png', x: 78, y: 666 },
            { slot: 'potionSlot', img: 'potionslot.png', x: 292, y: 666 },
        ];
        const eqSlot = ({ slot, img, x, y }) => {
            const gear = player.equipped[slot];
            const has = !!(gear && gear.name && (slot !== 'potionSlot' || gear.qty > 0));
            const base = `assets/pages/character/slots/${img}`;
            const src = has && gear.img ? gear.img : base;
            return `<div ${has ? `onclick="showEquippedDetail('${slot}')"` : ''} class="absolute w-[77px] h-[77px] ${has ? 'cursor-pointer hover:brightness-110' : 'opacity-50'}" style="left:${x}px; top:${y}px;">
                <img src="${src}" alt="" class="w-full h-full object-contain" onerror="this.onerror=null;this.src='${base}'">
            </div>`;
        };
        eqContainer.innerHTML = EQUIP_SLOTS.map(eqSlot).join('');
    }

    let invGrid = document.getElementById('inventory-grid');
    if (invGrid) {
        invGrid.innerHTML = '';
        if (!Array.isArray(player.inventory)) player.inventory = new Array(BAG_SLOTS).fill(null);
        let filledSlots = 0;
        player.inventory.forEach((item, index) => {
            if (item) filledSlots++;
            if (!itemMatchesFilter(item)) return;
            let itemName = item ? item.name : '';
            let refText = item && item.refineLevel > 0 ? ` +${item.refineLevel}` : '';
            let rInfo = item ? RARITY_INFO[item.rarity] : null;
            let rarityColor = rInfo ? `${rInfo.border} ${rInfo.text}` : 'border-slate-700 text-slate-200';
            invGrid.innerHTML += `
                <div onclick="showItemDetail(${index})" class="w-[77px] h-[79px] flex flex-col justify-center items-center p-1 text-center cursor-pointer hover:brightness-110 transition relative group ${rInfo ? rInfo.text : 'text-slate-200'}" style="background-image:url('assets/pages/character/inventoryslot.png'); background-size:100% 100%;">
                    <span class="text-base leading-none">${itemEmoji(item)}</span>
                    <span class="text-[9px] font-bold truncate w-full px-1">${itemName + refText}${elemIconText(item)}</span>
                    ${isGearItem(item) ? `<button onclick="event.stopPropagation(); toggleFavorite(${index})" title="Favorite" class="absolute top-0 right-0.5 text-[11px] leading-none px-0.5 ${item.favorite ? 'text-amber-300' : 'text-slate-600 hover:text-amber-300'}">${item.favorite ? '★' : '☆'}</button>` : ''}
                    ${item && item.qty > 1 ? `<span class="absolute bottom-1 right-1 text-[9px] font-mono font-bold text-amber-300 bg-slate-950/80 px-1 rounded">x${item.qty}</span>` : ''}
                </div>
            `;
        });
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
    if (player._prevHpNum !== undefined && player.hp < player._prevHpNum) {
        const playerDmg = player._prevHpNum - player.hp;
        setTimeout(() => showCombatNumber('#combat-player-sprite', playerDmg, false), 0);
    }
    player._prevHpNum = player.hp;
    const armorNow = Math.max(0, player.armor || 0);
    el = document.getElementById('player-armor-text');
    if (el) el.innerText = `${armorNow} / ${derived.maxArmor}`;
    el = document.getElementById('player-resurrection-state');
    if (el) el.innerText = player.resurrectionOn !== false ? 'ON' : 'OFF';
    el = document.getElementById('player-armor-bar');
    if (el) el.style.width = `${derived.maxArmor > 0 ? (armorNow / derived.maxArmor) * 100 : 0}%`;

    // Rune progress: stages left until the next rune pick (combat only)
    const runeWrap = document.getElementById('combat-rune-progress');
    if (runeWrap) {
        const info = (document.getElementById('view-combat') && !document.getElementById('view-combat').classList.contains('hidden') && currentStage >= 1) ? runeProgressInfo() : null;
        runeWrap.style.display = info ? '' : 'none';
        if (info) {
            const t = document.getElementById('combat-rune-progress-text');
            if (t) t.innerText = info.remaining === 1 ? 'Rune after this stage' : `Rune in ${info.remaining} stages`;
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
    if (elixirBtn) elixirBtn.classList.toggle('on', player.resurrectionOn !== false);
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
            return `<div class="combat-rune-slot" onclick="showRuneDetail(${i})"><img src="assets/combat/runes/r${rarity}.png" alt="" style="width:100%; height:100%; object-fit:contain; pointer-events:none;"></div>`;
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
                const dmgNum = m._prevHp - m.hp, dmgCrit = !!m.lastHitCrit;
                m.lastHitCrit = false;
                setTimeout(() => showCombatNumber(`#monsters-lineup-container > div:nth-child(${idx + 1}) img`, dmgNum, dmgCrit), 0);
                if (m.hp <= 0) {
                    m._deathAt = Date.now();
                    if (typeof playSound === 'function') playSound('sound/slime_dead.mp3');
                }
            }
            const goneAt = m._deathAt ? Date.now() - m._deathAt >= COMBAT_DEATH_TOTAL_MS : false;
            m._prevHp = m.hp;
            let isDead = m.hp <= 0;
            let isTarget = !isDead && idx === targetIdx;
            let borderColor = isDead ? 'border-slate-800 bg-slate-950/40 opacity-50' : (isTarget ? 'border-amber-500 bg-slate-900/90 shadow-md' : 'border-slate-800 bg-slate-950/40 opacity-70');
            let hpPct = Math.max(0, (m.hp / m.maxHp) * 100);
            let tag = isDead ? '<span class="text-[10px] text-slate-400">(Defeated)</span>' : (isTarget ? '<span class="text-[10px] text-amber-400">(Target)</span>' : '');

            // Card: sprite on top, then the name and HP box below it (no role or element)
            lineupContainer.innerHTML += `
                <div class="flex flex-col items-center gap-1"${goneAt ? ' style="display:none"' : ''}>
                    <img class="idle-anim" data-frames="${COMBAT_SLIME_FRAMES}" data-hit-at="${m._hitAt || 0}" data-death-at="${m._deathAt || 0}" src="${COMBAT_SLIME_FRAMES.split(',')[0]}" alt="" style="width:110px; height:110px; image-rendering:pixelated; pointer-events:none;">
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
    if (monstersEl && typeof MONSTERS_DATA !== 'undefined') {
        const rows = Object.values(MONSTERS_DATA).map(m => {
            const el = (ROLE_ICONS[m.role || (m.isRanged ? 'range' : 'melee')] || '') + ' ' + (m.element && ELEMENTS[m.element] ? `${ELEMENTS[m.element].icon} ${ELEMENTS[m.element].name}` : 'None');
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
                <tr class="border-b border-slate-800"><td class="py-1">Copper Chest</td><td>500 Gold + armory item (Rarity 1)</td></tr>
                <tr class="border-b border-slate-800"><td class="py-1">Silver Chest</td><td>1000 Gold + armory item (Rarity 2)</td></tr>
                <tr><td class="py-1">Gold Chest</td><td>1500 Gold + armory item (Rarity 3)</td></tr>
            </table>
            <p class="text-[10px] text-slate-500 mt-2">Gold shop: Copper 1000, Silver 4000, Gold 8000 Gold. Diamond shop: Copper 1, Silver 3, Gold 5 Diamond.</p>
        </div>`;
}
