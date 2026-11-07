// ==========================================
// RAGNATALE - MAPS.JS
// ==========================================

// Level scaling: each base monster has stats for its home level (lv). On a map of level L its
// HP, attack and rewards grow by LEVEL_GROWTH per level (fitted from the normal monsters: about 4% per level).
const LEVEL_GROWTH = 1.0405;
// Spawn tweaks applied to every monster that enters a fight: range monsters hit for 1.2x, healers heal for 0.6x
function spawnTweak(t, level) {
    let out = t;
    if (t.role === 'range' && (level || 1) !== 1) out = { ...out, atkMin: Math.max(1, Math.round(out.atkMin * 1.2)), atkMax: Math.max(1, Math.round(out.atkMax * 1.2)) };
    if (t.heal) out = { ...out, heal: Math.max(1, Math.round(out.heal * 0.6)) };
    return out;
}
// Map Lv. 10 monsters are tougher: +50% HP and +50% ATK (bosses are not affected)
const LV10_HP_ATK_MULT = 1.5;
// A monster from a higher level keeps at least this share of its HP and ATK on a lower map (lv 60-99 monsters on lv 20-50 maps)
const LEVEL_DOWN_FLOOR = 0.6;
function levelScaled(t, level) {
    const d = (level || 1) - (t.lv || 1);
    let out = t;
    if (d !== 0) {
        const raw = Math.pow(LEVEL_GROWTH, d);
        const f = Math.max(LEVEL_DOWN_FLOOR, raw); // HP and ATK are floored
        const r = v => Math.max(1, Math.round(v * f));
        const rr = v => Math.max(1, Math.round(v * raw)); // rewards keep the unfloored curve
        out = {
            ...t,
            hp: r(t.hp), maxHp: r(t.maxHp),
            atkMin: r(t.atkMin), atkMax: r(t.atkMax),
            ...(t.heal ? { heal: r(t.heal) } : {}),
            baseExp: rr(t.baseExp), jobExp: rr(t.jobExp), gold: rr(t.gold)
        };
    }
    if ((level || 1) === 10) {
        const m = v => Math.max(1, Math.round(v * LV10_HP_ATK_MULT));
        out = { ...out, hp: m(out.hp), maxHp: m(out.maxHp), atkMin: m(out.atkMin), atkMax: m(out.atkMax) };
    }
    // Lv. 1 healers heal half as much
    if ((level || 1) === 1 && out.heal) out = { ...out, heal: Math.max(1, Math.round(out.heal * 0.5)) };
    return spawnTweak(out, level);
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
// Low maps use only low-level monsters: the lv 60-99 monsters would be floored to 0.6x and dominate them.
// Lv. 1 map: lv 1 monsters only. Lv. 10 map: lv 1-10 monsters. No healer is that low, so healer waves use the range fallback (see pickUnit).
const LEAF_MAGE_LV1 = { ...MONSTERS_DATA.leafSpriteMage, role: 'mage', lv: 1 };
// Earth lv1 mage: Hel Stone Mage with the same lv1 mage stats (only the element and art differ)
const HEL_STONE_MAGE_LV1 = { ...MONSTERS_DATA.helStoneMage, hp: LEAF_MAGE_LV1.hp, maxHp: LEAF_MAGE_LV1.maxHp, atkMin: LEAF_MAGE_LV1.atkMin, atkMax: LEAF_MAGE_LV1.atkMax, hit: LEAF_MAGE_LV1.hit, flee: LEAF_MAGE_LV1.flee, baseExp: LEAF_MAGE_LV1.baseExp, jobExp: LEAF_MAGE_LV1.jobExp, gold: LEAF_MAGE_LV1.gold, role: 'mage', lv: 1 };
const LV1_MAP_ENEMIES = [BASE_15.slime, BASE_15.mossyBoulder, BASE_15.archerGoblin, LEAF_MAGE_LV1];
// Lv 20 mage: Bat Witch stats at lv 20 (48 HP, below the lv 20 tanks). The lv 60-99 mages were far too strong for this map.
const LV20_MAGE = { ...MONSTERS_DATA.batWitch, role: 'mage', lv: 20 };
const EARTH_LV20_MAGE = { ...LV20_MAGE, element: 'earth' }; // earth path roster: same stats, earth element
const LV10_MAP_ENEMIES = [...LV1_MAP_ENEMIES, BASE_15.rockGolem, BASE_15.sniperKobold];

// Base maps (shared by campaign paths, events and the daily challenge)
// miniStage: stage with the mini boss (default 7, the stage after the 3rd rune). campaignStages: total stages in a campaign run (boss on the last stage).
// bossSupport: monsters that stand behind the boss on its stage (pos = lineup position, 1 = boss row).
const GAME_DATA = {
    maps: {
        map1: {
            title: "Map Lv. 1", levelReq: 1, campaignStages: 11, miniStage: 7, stageGrowth: 0.07, dropKey: 'map1',
            enemies: [...LV1_MAP_ENEMIES],
            boss: MONSTERS_DATA.bossGiantMossSlime,
            miniBoss: makeMiniBoss(BASE_15.mossyBoulder, 1)
        },
        map10: {
            title: "Map Lv. 10", levelReq: 10, campaignStages: 11, miniStage: 7, stageGrowth: 0.08, dropKey: 'map10',
            enemies: [...LV10_MAP_ENEMIES],
            boss: { ...MONSTERS_DATA.bossCavernBehemoth, bossHpMult: 1.5 }, // Lv 10 boss: 1.5x base HP (other bosses use BOSS_HP_MULT)
            miniBoss: makeMiniBoss(BASE_15.rockGolem, 10)
        },
        map20: {
            title: "Map Lv. 20", levelReq: 20, campaignStages: 15, miniStage: 7, dropKey: 'map20',
            enemies: [...BASE_LIST.filter(m => m.role !== 'mage'), LV20_MAGE], // lv 20 mage replaces the lv 60-99 mages
            boss: MONSTERS_DATA.bossAncientPharaoh,
            miniBoss: makeMiniBoss(BASE_15.sniperKobold, 20)
        },
        map30: {
            title: "Map Lv. 30", levelReq: 30, campaignStages: 16, miniStage: 7, dropKey: 'map30',
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.bossLordAbyss,
            miniBoss: makeMiniBoss(BASE_15.jotunFrostMage, 30),
            bossSupport: [{ pos: 2, role: 'healer' }]
        },
        map40: {
            title: "Map Lv. 40", levelReq: 40, campaignStages: 16, miniStage: 7, dropKey: 'map40',
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.bossArchangelCorrupted,
            miniBoss: makeMiniBoss(BASE_15.haloPriest, 40),
            bossSupport: [{ pos: 2, role: 'healer' }]
        },
        map50: {
            title: "Map Lv. 50", levelReq: 50, campaignStages: 21, miniStage: 7, dropKey: 'map50',
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.bossWorldEater,
            miniBoss: makeMiniBoss(BASE_15.duskStormMage, 50),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map60: {
            title: "Map Lv. 60", levelReq: 60, campaignStages: 21, miniStage: 7, dropKey: 'map60', stageGrowth: 0.10,
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.hrymFrostKing,
            miniBoss: makeMiniBoss(BASE_15.frostTroll, 60),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map70: {
            title: "Map Lv. 70", levelReq: 70, campaignStages: 21, miniStage: 7, dropKey: 'map70', stageGrowth: 0.10,
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.brynhildValkyrieQueen,
            miniBoss: makeMiniBoss(BASE_15.draugrKnight, 70),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map80: {
            title: "Map Lv. 80", levelReq: 80, campaignStages: 26, miniStage: 7, dropKey: 'map80', stageGrowth: 0.10,
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.surtrFlameGiant,
            miniBoss: makeMiniBoss(BASE_15.frostArcher, 80),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        map90: {
            title: "Map Lv. 90", levelReq: 90, campaignStages: 26, miniStage: 7, dropKey: 'map90', stageGrowth: 0.10,
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.queenHel,
            miniBoss: makeMiniBoss(BASE_15.helStoneMage, 90),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        map99: {
            title: "Map Lv. 99", levelReq: 99, campaignStages: 31, miniStage: 7, dropKey: 'map99', stageGrowth: 0.10,
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.voidColossus,
            miniBoss: makeMiniBoss(BASE_15.iceRaider, 99),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        finalMap: {
            title: "Final Map Lv. 110", levelReq: 110, campaignStages: 25, miniStage: 0, dropKey: 'map99', finalMap: true, stageGrowth: 0,
            enemies: [], boss: MONSTERS_DATA.bossWorldEater, miniBoss: null, bossSupport: []
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
        EARTH_LV20_MAGE
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
