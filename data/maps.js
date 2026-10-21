// ==========================================
// RAGNATALE - MAPS.JS
// ==========================================

// Mini boss: a tougher version of one map monster, appears on stage 9 of campaign and event maps
function makeMiniBoss(t) {
    return {
        ...t,
        name: `${t.name} [Mini Boss]`,
        hp: t.hp * 3,
        maxHp: t.maxHp * 3,
        atkMin: Math.floor(t.atkMin * 1.5),
        atkMax: Math.floor(t.atkMax * 1.5),
        baseExp: t.baseExp * 3,
        jobExp: t.jobExp * 3,
        gold: t.gold * 3,
        isMiniBoss: true
    };
}

// Base maps (shared by campaign paths, events and the daily challenge)
const GAME_DATA = {
    maps: {
        map1: {
            title: "Map Lv. 1", levelReq: 1, maxStages: 17, stageGrowth: 0.07, dropKey: 'map1',
            enemies: [MONSTERS_DATA.poring, MONSTERS_DATA.fabre, MONSTERS_DATA.archerGoblin],
            boss: MONSTERS_DATA.bossGiantMossPoring,
            miniBoss: makeMiniBoss(MONSTERS_DATA.fabre)
        },
        map10: {
            title: "Map Lv. 10", levelReq: 10, maxStages: 17, dropKey: 'map10',
            enemies: [MONSTERS_DATA.caveBat, MONSTERS_DATA.rockGolem, MONSTERS_DATA.sniperKobold],
            boss: MONSTERS_DATA.bossCavernBehemoth,
            miniBoss: makeMiniBoss(MONSTERS_DATA.rockGolem)
        },
        map20: {
            title: "Map Lv. 20", levelReq: 20, maxStages: 17, dropKey: 'map20',
            enemies: [MONSTERS_DATA.desertScorpion, MONSTERS_DATA.sandWarrior, MONSTERS_DATA.windArcher],
            boss: MONSTERS_DATA.bossAncientPharaoh,
            miniBoss: makeMiniBoss(MONSTERS_DATA.desertScorpion)
        },
        map30: {
            title: "Map Lv. 30", levelReq: 30, maxStages: 17, dropKey: 'map30',
            enemies: [MONSTERS_DATA.abyssalImp, MONSTERS_DATA.hellhound, MONSTERS_DATA.demonGunner],
            boss: MONSTERS_DATA.bossLordAbyss,
            miniBoss: makeMiniBoss(MONSTERS_DATA.hellhound)
        },
        map40: {
            title: "Map Lv. 40", levelReq: 40, maxStages: 17, dropKey: 'map40',
            enemies: [MONSTERS_DATA.celestialSentinel, MONSTERS_DATA.seraphimEcho, MONSTERS_DATA.heavenlyBallista],
            boss: MONSTERS_DATA.bossArchangelCorrupted,
            miniBoss: makeMiniBoss(MONSTERS_DATA.seraphimEcho)
        },
        map50: {
            title: "Map Lv. 50", levelReq: 50, maxStages: 17, dropKey: 'map50',
            enemies: [MONSTERS_DATA.worldEnderMinion, MONSTERS_DATA.astralHorror, MONSTERS_DATA.voidSniper],
            boss: MONSTERS_DATA.bossWorldEater,
            miniBoss: makeMiniBoss(MONSTERS_DATA.astralHorror)
        }
    },
    paths: {}
};

// Campaign paths: each path has its own element and its own progress through the 6 maps
// Campaign maps per path: Lv 1 to Lv 50, 13 stages each (mini boss stage 9, MVP stage 13)
const CAMPAIGN_MAP_KEYS = ['map1', 'map10', 'map20', 'map30', 'map40', 'map50'];
const CAMPAIGN_STAGES = 13;

const CAMPAIGN_PATHS = {
    fire:  { name: "Fire Path",  element: 'fire',  icon: "🔥" },
    water: { name: "Water Path", element: 'water', icon: "💧" },
    earth: { name: "Earth Path", element: 'earth', icon: "🪨" },
    wind:  { name: "Wind Path",  element: 'wind',  icon: "🌪️" }
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
            maxStages: CAMPAIGN_STAGES,
            title: `${path.name} · ${base.title}`,
            enemies: base.enemies.map(tint),
            boss: tint(base.boss),
            miniBoss: tint(base.miniBoss)
        };
    });
});
