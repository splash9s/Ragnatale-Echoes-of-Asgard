// ==========================================
// RAGNATALE - MAPS.JS
// ==========================================

// Level scaling: each base monster has stats for its home level (lv). On a map of level L its
// HP, attack and rewards grow by LEVEL_GROWTH per level (fitted from the normal monsters: about 4% per level).
const LEVEL_GROWTH = 1.0405;
// Spawn tweaks applied to every monster that enters a fight: range monsters hit for 1.2x, healers heal for 0.6x
function spawnTweak(t) {
    let out = t;
    if (t.role === 'range') out = { ...out, atkMin: Math.max(1, Math.round(out.atkMin * 1.2)), atkMax: Math.max(1, Math.round(out.atkMax * 1.2)) };
    if (t.heal) out = { ...out, heal: Math.max(1, Math.round(out.heal * 0.6)) };
    return out;
}
// Map Lv. 10 monsters are tougher: +50% HP and +50% ATK (bosses are not affected)
const LV10_HP_ATK_MULT = 1.5;
function levelScaled(t, level) {
    const d = (level || 1) - (t.lv || 1);
    let out = t;
    if (d !== 0) {
        const f = Math.pow(LEVEL_GROWTH, d);
        const r = v => Math.max(1, Math.round(v * f));
        out = {
            ...t,
            hp: r(t.hp), maxHp: r(t.maxHp),
            atkMin: r(t.atkMin), atkMax: r(t.atkMax),
            ...(t.heal ? { heal: r(t.heal) } : {}),
            baseExp: r(t.baseExp), jobExp: r(t.jobExp), gold: r(t.gold)
        };
    }
    if ((level || 1) === 10) {
        const m = v => Math.max(1, Math.round(v * LV10_HP_ATK_MULT));
        out = { ...out, hp: m(out.hp), maxHp: m(out.maxHp), atkMin: m(out.atkMin), atkMax: m(out.atkMax) };
    }
    return spawnTweak(out);
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

// Base maps (shared by campaign paths, events and the daily challenge)
// miniStage: stage with the mini boss (default 7, the stage after the 3rd rune). campaignStages: total stages in a campaign run (boss on the last stage).
// bossSupport: monsters that stand behind the boss on its stage (pos = lineup position, 1 = boss row).
const GAME_DATA = {
    maps: {
        map1: {
            title: "Map Lv. 1", levelReq: 1, campaignStages: 11, miniStage: 7, stageGrowth: 0.07, dropKey: 'map1',
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.bossGiantMossSlime,
            miniBoss: makeMiniBoss(BASE_15.mossyBoulder, 1)
        },
        map10: {
            title: "Map Lv. 10", levelReq: 10, campaignStages: 11, miniStage: 7, stageGrowth: 0.08, dropKey: 'map10',
            enemies: [...BASE_LIST],
            boss: MONSTERS_DATA.bossCavernBehemoth,
            miniBoss: makeMiniBoss(BASE_15.rockGolem, 10)
        },
        map20: {
            title: "Map Lv. 20", levelReq: 20, campaignStages: 15, miniStage: 7, dropKey: 'map20',
            enemies: [...BASE_LIST],
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
            boss: MONSTERS_DATA.voidColossus,
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
            boss: MONSTERS_DATA.brynhildValkyrieQueen,
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
            enemies: PATH_ROSTERS[pk].map(tint),
            boss: tint(base.boss),
            miniBoss: tint(base.miniBoss)
        };
    });
});
