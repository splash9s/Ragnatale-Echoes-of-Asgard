// ==========================================
// RAGNATALE - MAPS.JS
// ==========================================

// ---------- MONSTER STRENGTH CURVE ----------
// Every regular monster on a map has the map's level. Its HP, ATK, armor, heal, hit and flee come from
// the level curve and its role; the template keeps only its look, name, element, spells and rewards.
// The curve was fitted with a run simulator (reference player: 40% STR, 30% VIT, 15% AGI, 15% DEX,
// best shop gear for the level, no runes or skills, 5 potions, 10% HP back after each stage):
//   player at map level L      -> clears about 99-100% of runs
//   player at L - 5            -> clears about 40-60% of runs (runes and better gear push this up)
//   player at L - 10           -> usually fails
// MONSTER_CURVE: [level, unit HP, unit ATK]. Unit = a melee monster at that level. Levels between
// anchors are interpolated geometrically; below 1 or above 99 the nearest anchor is used.
const MONSTER_CURVE = [
    [1, 106, 8], [10, 145, 4.3], [20, 272, 8], [30, 448, 13.5], [40, 693, 35], [50, 1028, 52],
    [60, 1430, 111], [70, 1806, 205], [80, 2206, 414], [90, 2436, 434], [99, 2441, 1405]
];
// Role profile: multipliers on the unit. heal = HP restored per turn as a share of the unit HP.
const ROLE_CURVE = {
    melee:  { hp: 1.00, atk: 1.00, armor: 0 },
    tank:   { hp: 1.80, atk: 0.70, armor: 20 },
    range:  { hp: 0.70, atk: 0.85, armor: 0 },
    mage:   { hp: 0.60, atk: 0.85, armor: 0 },
    healer: { hp: 0.80, atk: 0.50, armor: 0, heal: 0.04 }
};
// Boss template before makeBoss() (which then applies BOSS_HP_MULT and BOSS_ATK_MULT)
const BOSS_CURVE = { hp: 3.0, atk: 0.60 };
const CURVE_ATK_SPREAD = 0.13; // ATK range is unit ATK -13% to +13%
const MONSTER_ATK_MULT = 1; // all monster and boss damage (x1 = original; 2.0 was too hard, 1.5 not tested)

function curveUnit(level) {
    const L = Math.max(MONSTER_CURVE[0][0], Math.min(MONSTER_CURVE[MONSTER_CURVE.length - 1][0], level || 1));
    for (let i = 0; i < MONSTER_CURVE.length - 1; i++) {
        const [l0, h0, a0] = MONSTER_CURVE[i], [l1, h1, a1] = MONSTER_CURVE[i + 1];
        if (L >= l0 && L <= l1) {
            const f = (L - l0) / (l1 - l0);
            return { hp: h0 * Math.pow(h1 / h0, f), atk: a0 * Math.pow(a1 / a0, f) };
        }
    }
    const last = MONSTER_CURVE[MONSTER_CURVE.length - 1];
    return { hp: last[1], atk: last[2] };
}
function curveRoleOf(t) { return t.role || (t.isRanged ? 'range' : 'melee'); }
function curveAtkRange(atk) {
    atk *= MONSTER_ATK_MULT;
    return { atkMin: Math.max(1, Math.floor(atk * (1 - CURVE_ATK_SPREAD))), atkMax: Math.max(1, Math.ceil(atk * (1 + CURVE_ATK_SPREAD))) };
}
// Monster hit and flee follow the map level (same as combatHitFlee in combat.js)
function curveHitFlee(level) { const L = level || 1; return { hit: L * 3 + 40, flee: L + 60 }; }

// Rewards keep growing by LEVEL_GROWTH per level from the template's home level (lv), as before.
const LEVEL_GROWTH = 1.0405;
// Regular monsters (tank, melee, range, mage, healer) have 40% less HP. Bosses are not affected (curveBoss).
const MONSTER_HP_CUT = 0.6;
function levelScaled(t, level) {
    const L = level || 1;
    const role = curveRoleOf(t);
    const prof = ROLE_CURVE[role] || ROLE_CURVE.melee;
    const u = curveUnit(L);
    const pm = t.powerMult || 1; // events: x1.5 HP and ATK
    const hp = Math.max(1, Math.round(u.hp * prof.hp * pm * MONSTER_HP_CUT));
    const rr = v => Math.max(1, Math.round((v || 0) * Math.pow(LEVEL_GROWTH, L - (t.lv || 1))));
    const out = {
        ...t,
        hp, maxHp: hp,
        ...curveAtkRange(u.atk * prof.atk * pm),
        armor: prof.armor,
        ...curveHitFlee(L),
        baseExp: rr(t.baseExp), jobExp: rr(t.jobExp), gold: rr(t.gold)
    };
    if (role === 'healer') out.heal = Math.max(1, Math.round(u.hp * prof.heal * pm));
    else delete out.heal;
    return out;
}
// Boss on the curve: same unit, boss profile. makeBoss() adds the boss HP/ATK multipliers and skills.
function curveBoss(t, level) {
    const u = curveUnit(level);
    const hp = Math.max(1, Math.round(u.hp * BOSS_CURVE.hp));
    return { ...t, hp, maxHp: hp, ...curveAtkRange(u.atk * BOSS_CURVE.atk), armor: 0, ...curveHitFlee(level), curveLevel: level };
}

// Mini boss: a tougher version of one base monster, scaled to the map level
function makeMiniBoss(t, level) {
    const s = levelScaled(t, level);
    return {
        ...s,
        name: `${t.name} [Mini Boss]`,
        hp: s.hp * 3,
        maxHp: s.maxHp * 3,
        atkMin: Math.floor(s.atkMin * 1.5),
        atkMax: Math.floor(s.atkMax * 1.5),
        baseExp: s.baseExp * 3,
        jobExp: s.jobExp * 3,
        gold: s.gold * 3,
        isMiniBoss: true
    };
}

// Wave sets: each normal stage picks one set at random.
// Each entry is one monster slot, from the front (position 1) to the back.
const WAVE_SETS = [
    ['melee', 'melee', 'melee', 'melee', 'melee', 'melee'],
    ['melee', 'melee', 'melee', 'melee'],
    ['melee', 'melee', 'melee'],
    ['melee', 'melee', 'healer'],
    ['melee', 'range', 'range', 'range'],
    ['tank', 'range', 'range', 'range'],
    ['tank', 'range', 'healer'],
    ['melee', 'melee', 'melee', 'healer', 'healer'],
    ['range', 'range', 'range', 'range', 'range'],
    ['tank', 'tank', 'tank', 'healer'],
    ['tank', 'tank', 'tank', 'range'],
    ['tank', 'tank', 'tank'],
    ['melee', 'melee', 'melee', 'melee', 'healer'],
    ['melee', 'melee', 'melee', 'healer'],
    ['tank', 'mage', 'healer'],
    ['tank', 'mage'],
    ['mage', 'mage', 'mage', 'mage'],
    ['tank', 'mage', 'mage'],
    ['melee', 'melee', 'melee', 'melee', 'mage'],
    ['melee', 'melee', 'melee', 'mage', 'healer']
];

// The 15 base monsters (3 per role). Every normal map uses these; the map level scales their stats.
// lv = home level (the monster's own level). Rock Golem is a tank.
const BASE_15 = {
    slime:          { ...MONSTERS_DATA.slime,          role: 'melee',  lv: 1 },
    frostTroll:     { ...MONSTERS_DATA.frostTroll,     role: 'melee',  lv: 60 },
    iceRaider:      { ...MONSTERS_DATA.iceRaider,      role: 'melee',  lv: 60 },
    mossyBoulder:   { ...MONSTERS_DATA.mossyBoulder,   role: 'tank',   lv: 1 },
    draugrKnight:   { ...MONSTERS_DATA.draugrKnight,   role: 'tank',   lv: 90 },
    rockGolem:      { ...MONSTERS_DATA.rockGolem,      role: 'tank',   lv: 10 },
    sniperKobold:   { ...MONSTERS_DATA.sniperKobold,   role: 'range',  lv: 10 },
    archerGoblin:   { ...MONSTERS_DATA.archerGoblin,   role: 'range',  lv: 1 },
    frostArcher:    { ...MONSTERS_DATA.frostArcher,    role: 'range',  lv: 60 },
    jotunFrostMage: { ...MONSTERS_DATA.jotunFrostMage, role: 'mage',   lv: 60 },
    helStoneMage:   { ...MONSTERS_DATA.helStoneMage,   role: 'mage',   lv: 90 },
    duskStormMage:  { ...MONSTERS_DATA.duskStormMage,  role: 'mage',   lv: 99 },
    frostShaman:    { ...MONSTERS_DATA.frostShaman,    role: 'healer', lv: 60 },
    duskPriest:     { ...MONSTERS_DATA.duskPriest,     role: 'healer', lv: 99 },
    haloPriest:     { ...MONSTERS_DATA.haloPriest,     role: 'healer', lv: 40 }
};
const BASE_LIST = Object.values(BASE_15);
// Animated monsters only (art in MONSTER_SPRITES; Slime uses the default slime art). Stats come from the
// level curve, so any of them can appear on any map; lv only sets where their rewards start.
const ANIMATED_POOL = [
    BASE_15.slime,
    BASE_15.mossyBoulder, BASE_15.rockGolem,
    { ...MONSTERS_DATA.haloWarden, role: 'tank', lv: 60 },
    { ...MONSTERS_DATA.iceGolem, role: 'tank', lv: 90 },
    BASE_15.archerGoblin, BASE_15.sniperKobold, BASE_15.frostArcher,
    { ...MONSTERS_DATA.flameArcher, role: 'range', lv: 70 },
    BASE_15.jotunFrostMage, BASE_15.helStoneMage,
    { ...MONSTERS_DATA.muspelFlameMage, role: 'mage', lv: 70 },
    { ...MONSTERS_DATA.battleStormMage, role: 'mage', lv: 60 },
    BASE_15.haloPriest, BASE_15.frostShaman,
    { ...MONSTERS_DATA.valkyrieHealer, role: 'healer', lv: 60 },
    { ...MONSTERS_DATA.emberPriest, role: 'healer', lv: 90 }
];
const animatedOf = id => ANIMATED_POOL.find(m => m.id === id);
// Lv. 1 map: lv 1 monsters only. Lv. 10 map: lv 1-10 monsters. No healer is that low, so healer waves use the range fallback (see pickUnit).
const LEAF_MAGE_LV1 = { ...MONSTERS_DATA.leafSpriteMage, role: 'mage', lv: 1 };
// Earth lv1 mage: Hel Stone Mage with the same lv1 mage stats (only the element and art differ)
const HEL_STONE_MAGE_LV1 = { ...MONSTERS_DATA.helStoneMage, hp: LEAF_MAGE_LV1.hp, maxHp: LEAF_MAGE_LV1.maxHp, atkMin: LEAF_MAGE_LV1.atkMin, atkMax: LEAF_MAGE_LV1.atkMax, hit: LEAF_MAGE_LV1.hit, flee: LEAF_MAGE_LV1.flee, baseExp: LEAF_MAGE_LV1.baseExp, jobExp: LEAF_MAGE_LV1.jobExp, gold: LEAF_MAGE_LV1.gold, role: 'mage', lv: 1 };
// Lv 1 mage: Hel Stone Mage art (animated) with the Leaf Sprite Mage's lv 1 rewards
const LV1_MAP_ENEMIES = [BASE_15.slime, BASE_15.mossyBoulder, BASE_15.archerGoblin, HEL_STONE_MAGE_LV1];
const LV10_MAP_ENEMIES = [...LV1_MAP_ENEMIES, BASE_15.rockGolem, BASE_15.sniperKobold];

// Base maps (shared by campaign paths, events and the daily challenge)
// miniStage: stage with the mini boss (default 7, the stage after the 3rd rune). campaignStages: total stages in a campaign run (boss on the last stage).
// bossSupport: monsters that stand behind the boss on its stage (pos = lineup position, 1 = boss row).
const GAME_DATA = {
    maps: {
        map1: {
            title: "Map Lv. 1", levelReq: 1, campaignStages: 11, miniStage: 7, stageGrowth: 0.07, dropKey: 'map1',
            enemies: [...LV1_MAP_ENEMIES],
            boss: curveBoss(MONSTERS_DATA.bossGiantMossSlime, 1),
            miniBoss: makeMiniBoss(BASE_15.mossyBoulder, 1)
        },
        map10: {
            title: "Map Lv. 10", levelReq: 10, campaignStages: 11, miniStage: 7, stageGrowth: 0.08, dropKey: 'map10',
            enemies: [...LV10_MAP_ENEMIES],
            boss: curveBoss(MONSTERS_DATA.bossCavernBehemoth, 10),
            miniBoss: makeMiniBoss(BASE_15.rockGolem, 10)
        },
        map20: {
            title: "Map Lv. 20", levelReq: 20, campaignStages: 15, miniStage: 7, dropKey: 'map20',
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.bossAncientPharaoh, 20),
            miniBoss: makeMiniBoss(BASE_15.sniperKobold, 20)
        },
        map30: {
            title: "Map Lv. 30", levelReq: 30, campaignStages: 16, miniStage: 7, dropKey: 'map30',
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.bossLordAbyss, 30),
            miniBoss: makeMiniBoss(BASE_15.jotunFrostMage, 30),
            bossSupport: [{ pos: 2, role: 'healer' }]
        },
        map40: {
            title: "Map Lv. 40", levelReq: 40, campaignStages: 16, miniStage: 7, dropKey: 'map40',
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.bossArchangelCorrupted, 40),
            miniBoss: makeMiniBoss(BASE_15.haloPriest, 40),
            bossSupport: [{ pos: 2, role: 'healer' }]
        },
        map50: {
            title: "Map Lv. 50", levelReq: 50, campaignStages: 21, miniStage: 7, dropKey: 'map50',
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.bossWorldEater, 50),
            miniBoss: makeMiniBoss(animatedOf('M060'), 50),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map60: {
            title: "Map Lv. 60", levelReq: 60, campaignStages: 21, miniStage: 7, dropKey: 'map60', stageGrowth: 0.10,
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.hrymFrostKing, 60),
            miniBoss: makeMiniBoss(animatedOf('M040'), 60),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map70: {
            title: "Map Lv. 70", levelReq: 70, campaignStages: 21, miniStage: 7, dropKey: 'map70', stageGrowth: 0.10,
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.brynhildValkyrieQueen, 70),
            miniBoss: makeMiniBoss(animatedOf('M033'), 70),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map80: {
            title: "Map Lv. 80", levelReq: 80, campaignStages: 26, miniStage: 7, dropKey: 'map80', stageGrowth: 0.10,
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.surtrFlameGiant, 80),
            miniBoss: makeMiniBoss(BASE_15.frostArcher, 80),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        map90: {
            title: "Map Lv. 90", levelReq: 90, campaignStages: 26, miniStage: 7, dropKey: 'map90', stageGrowth: 0.10,
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.queenHel, 90),
            miniBoss: makeMiniBoss(BASE_15.helStoneMage, 90),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        map99: {
            title: "Map Lv. 99", levelReq: 99, campaignStages: 31, miniStage: 7, dropKey: 'map99', stageGrowth: 0.10,
            enemies: [...ANIMATED_POOL],
            boss: curveBoss(MONSTERS_DATA.voidColossus, 99),
            miniBoss: makeMiniBoss(animatedOf('M067'), 99),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        finalMap: {
            title: "Final Map Lv. 110", levelReq: 110, campaignStages: 25, miniStage: 0, dropKey: 'map99', finalMap: true, stageGrowth: 0,
            enemies: [], boss: curveBoss(MONSTERS_DATA.bossWorldEater, 110), miniBoss: null, bossSupport: []
        }
    },
    paths: {}
};

// Stage growth: one curve for every map (enemy HP/ATK per stage = 1 + (stage-1) * STAGE_GROWTH)
const STAGE_GROWTH = 0.10;

// Campaign paths: each path has its own element and its own progress through the maps
const CAMPAIGN_MAP_KEYS = ['map1', 'map10', 'map20', 'map30', 'map40', 'map50', 'map60', 'map70', 'map80', 'map90', 'map99'];
const CAMPAIGN_STAGES = 11; // Fallback only. Every map sets campaignStages on its own.

const CAMPAIGN_PATHS = {
    fire:  { name: "Fire Path",  element: 'fire',  icon: "🔥" },
    water: { name: "Water Path", element: 'water', icon: "💧" },
    earth: { name: "Earth Path", element: 'earth', icon: "🪨" },
    wind:  { name: "Wind Path",  element: 'wind',  icon: "🌪️" }
};

// Each element path has its own roster: one melee, one tank, one range, one healer and one mage.
// Monsters are taken from MONSTERS_DATA and get the path's element (set below). lv = the monster's home level.
const PATH_ROSTERS = {
    earth: [
        { ...MONSTERS_DATA.slime,        role: 'melee',  lv: 1 },
        { ...MONSTERS_DATA.mossyBoulder, role: 'tank',   lv: 1 },
        { ...MONSTERS_DATA.archerGoblin, role: 'range',  lv: 1 },
        { ...MONSTERS_DATA.haloPriest,   role: 'healer', lv: 40 },
        { ...MONSTERS_DATA.helStoneMage, role: 'mage',   lv: 90 }
    ],
    fire: [
        { ...MONSTERS_DATA.slime,            role: 'melee',  lv: 1 },
        { ...MONSTERS_DATA.rockGolem,        role: 'tank',   lv: 10 },
        { ...MONSTERS_DATA.flameArcher,      role: 'range',  lv: 70 },
        { ...MONSTERS_DATA.emberPriest,      role: 'healer', lv: 90 },
        { ...MONSTERS_DATA.muspelFlameMage,  role: 'mage',   lv: 70 }
    ],
    water: [
        { ...MONSTERS_DATA.slime,        role: 'melee',  lv: 1 },
        { ...MONSTERS_DATA.iceGolem,     role: 'tank',   lv: 90 },
        { ...MONSTERS_DATA.frostArcher,  role: 'range',  lv: 60 },
        { ...MONSTERS_DATA.frostShaman,  role: 'healer', lv: 60 },
        { ...MONSTERS_DATA.jotunFrostMage, role: 'mage', lv: 60 }
    ],
    wind: [
        { ...MONSTERS_DATA.slime,            role: 'melee',  lv: 1 },
        { ...MONSTERS_DATA.haloWarden,       role: 'tank',   lv: 60 },
        { ...MONSTERS_DATA.sniperKobold,     role: 'range',  lv: 10 },
        { ...MONSTERS_DATA.valkyrieHealer,   role: 'healer', lv: 60 },
        { ...MONSTERS_DATA.battleStormMage,  role: 'mage',   lv: 60 }
    ]
};

// Non-earth paths are balanced to the Earth roster: each slot uses the same level as its Earth monster,
// and its HP, ATK, heal and rewards are scaled so the fight is as tough as the Earth one at every map level.
function balanceToEarth(t, e) {
    const atk = m => (m.atkMin + m.atkMax) / 2;
    const hpK = e.maxHp / t.maxHp;
    const atkK = atk(e) / atk(t);
    const sc = (v, k) => Math.max(1, Math.round(v * k));
    const out = {
        ...t, lv: e.lv,
        hp: sc(t.hp, hpK), maxHp: sc(t.maxHp, hpK),
        atkMin: sc(t.atkMin, atkK), atkMax: sc(t.atkMax, atkK),
        baseExp: sc(t.baseExp, hpK), jobExp: sc(t.jobExp, hpK), gold: sc(t.gold, hpK)
    };
    if (t.heal && e.heal) out.heal = e.heal;
    return out;
}
['fire', 'water', 'wind'].forEach(pk => {
    PATH_ROSTERS[pk] = PATH_ROSTERS[pk].map((t, i) => balanceToEarth(t, PATH_ROSTERS.earth[i]));
});

// Every monster, mini boss and boss on a path takes that path's element
Object.keys(CAMPAIGN_PATHS).forEach(pk => {
    const path = CAMPAIGN_PATHS[pk];
    const tint = t => (t ? { ...t, element: path.element } : t);
    GAME_DATA.paths[pk] = { ...path, maps: {} };
    CAMPAIGN_MAP_KEYS.forEach(mk => {
        const base = GAME_DATA.maps[mk];
        GAME_DATA.paths[pk].maps[mk] = {
            ...base,
            maxStages: base.campaignStages || CAMPAIGN_STAGES,
            title: `${path.name} · ${base.title}`,
            // Lv. 1 and Lv. 10 path maps use the same low-level roster as the normal maps (element tinted); higher maps use the path roster
            enemies: (base.levelReq < 20 ? base.enemies.map(t => (pk === 'earth' && t.id === LEAF_MAGE_LV1.id ? HEL_STONE_MAGE_LV1 : t)) : PATH_ROSTERS[pk]).map(tint),
            boss: tint(base.boss),
            miniBoss: tint(base.miniBoss)
        };
    });
});
