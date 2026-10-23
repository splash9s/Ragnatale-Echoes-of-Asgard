// ==========================================
// RAGNATALE - MAPS.JS
// ==========================================

// Mini boss: a tougher version of one map monster
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

// Base maps (shared by campaign paths, events and the daily challenge)
// miniStage: stage with the mini boss (default 7, the stage after the 3rd rune). campaignStages: total stages in a campaign run (boss on the last stage).
// bossSupport: monsters that stand behind the boss on its stage (pos = lineup position, 1 = boss row).
const GAME_DATA = {
    maps: {
        map1: {
            title: "Map Lv. 1", levelReq: 1, campaignStages: 11, miniStage: 7, stageGrowth: 0.07, dropKey: 'map1',
            enemies: [MONSTERS_DATA.slime, MONSTERS_DATA.farbo, MONSTERS_DATA.archerGoblin],
            boss: MONSTERS_DATA.bossGiantMossSlime,
            miniBoss: makeMiniBoss(MONSTERS_DATA.farbo)
        },
        map10: {
            title: "Map Lv. 10", levelReq: 10, campaignStages: 11, miniStage: 7, dropKey: 'map10',
            enemies: [MONSTERS_DATA.caveBat, MONSTERS_DATA.rockGolem, MONSTERS_DATA.sniperKobold],
            boss: MONSTERS_DATA.bossCavernBehemoth,
            miniBoss: makeMiniBoss(MONSTERS_DATA.rockGolem)
        },
        map20: {
            title: "Map Lv. 20", levelReq: 20, campaignStages: 15, miniStage: 7, dropKey: 'map20',
            enemies: [MONSTERS_DATA.desertScorpion, MONSTERS_DATA.sandWarrior, MONSTERS_DATA.windArcher],
            boss: MONSTERS_DATA.bossAncientPharaoh,
            miniBoss: makeMiniBoss(MONSTERS_DATA.desertScorpion)
        },
        map30: {
            title: "Map Lv. 30", levelReq: 30, campaignStages: 16, miniStage: 7, dropKey: 'map30',
            enemies: [MONSTERS_DATA.abyssalImp, MONSTERS_DATA.hellhound, MONSTERS_DATA.demonGunner, MONSTERS_DATA.abyssPriest],
            boss: MONSTERS_DATA.bossLordAbyss,
            miniBoss: makeMiniBoss(MONSTERS_DATA.hellhound),
            bossSupport: [{ pos: 2, role: 'healer' }]
        },
        map40: {
            title: "Map Lv. 40", levelReq: 40, campaignStages: 16, miniStage: 7, dropKey: 'map40',
            enemies: [MONSTERS_DATA.celestialSentinel, MONSTERS_DATA.seraphimEcho, MONSTERS_DATA.heavenlyBallista, MONSTERS_DATA.haloPriest],
            boss: MONSTERS_DATA.bossArchangelCorrupted,
            miniBoss: makeMiniBoss(MONSTERS_DATA.seraphimEcho),
            bossSupport: [{ pos: 2, role: 'healer' }]
        },
        map50: {
            title: "Map Lv. 50", levelReq: 50, campaignStages: 21, miniStage: 7, dropKey: 'map50',
            enemies: [MONSTERS_DATA.worldEnderMinion, MONSTERS_DATA.astralHorror, MONSTERS_DATA.voidSniper, MONSTERS_DATA.starlightMender],
            boss: MONSTERS_DATA.voidColossus,
            miniBoss: makeMiniBoss(MONSTERS_DATA.astralHorror),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map60: {
            title: "Map Lv. 60", levelReq: 60, campaignStages: 21, miniStage: 7, dropKey: 'map60', stageGrowth: 0.10,
            enemies: [MONSTERS_DATA.frostTroll, MONSTERS_DATA.snowWolf, MONSTERS_DATA.iceRaider, MONSTERS_DATA.iceGolem,
                      MONSTERS_DATA.frostArcher, MONSTERS_DATA.iceSpearThrower, MONSTERS_DATA.frostShaman,
                      MONSTERS_DATA.jotunFlameMage, MONSTERS_DATA.jotunStoneMage, MONSTERS_DATA.jotunFrostMage, MONSTERS_DATA.jotunStormMage],
            boss: MONSTERS_DATA.hrymFrostKing,
            miniBoss: makeMiniBoss(MONSTERS_DATA.frostTrollChief),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map70: {
            title: "Map Lv. 70", levelReq: 70, campaignStages: 21, miniStage: 7, dropKey: 'map70', stageGrowth: 0.10,
            enemies: [MONSTERS_DATA.einherjarWarrior, MONSTERS_DATA.raiderSwordsman, MONSTERS_DATA.battleBoar, MONSTERS_DATA.ironShieldGuard,
                      MONSTERS_DATA.valkyrieArcher, MONSTERS_DATA.javelinThrower, MONSTERS_DATA.valkyrieHealer,
                      MONSTERS_DATA.battleFlameMage, MONSTERS_DATA.battleStoneMage, MONSTERS_DATA.battleFrostMage, MONSTERS_DATA.battleStormMage],
            boss: MONSTERS_DATA.brynhildValkyrieQueen,
            miniBoss: makeMiniBoss(MONSTERS_DATA.einherjarChampion),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }]
        },
        map80: {
            title: "Map Lv. 80", levelReq: 80, campaignStages: 26, miniStage: 7, dropKey: 'map80', stageGrowth: 0.10,
            enemies: [MONSTERS_DATA.fireBerserker, MONSTERS_DATA.lavaHound, MONSTERS_DATA.emberBrute, MONSTERS_DATA.magmaGolem,
                      MONSTERS_DATA.flameArcher, MONSTERS_DATA.emberSlinger, MONSTERS_DATA.emberPriest,
                      MONSTERS_DATA.muspelFlameMage, MONSTERS_DATA.muspelStoneMage, MONSTERS_DATA.muspelFrostMage, MONSTERS_DATA.muspelStormMage],
            boss: MONSTERS_DATA.surtrFlameGiant,
            miniBoss: makeMiniBoss(MONSTERS_DATA.lavaBerserkerChief),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        map90: {
            title: "Map Lv. 90", levelReq: 90, campaignStages: 26, miniStage: 7, dropKey: 'map90', stageGrowth: 0.10,
            enemies: [MONSTERS_DATA.draugrWarrior, MONSTERS_DATA.deathHound, MONSTERS_DATA.graveThrall, MONSTERS_DATA.draugrKnight,
                      MONSTERS_DATA.helArcher, MONSTERS_DATA.ghostSpearman, MONSTERS_DATA.soulKeeper,
                      MONSTERS_DATA.helFlameMage, MONSTERS_DATA.helStoneMage, MONSTERS_DATA.helFrostMage, MONSTERS_DATA.helStormMage],
            boss: MONSTERS_DATA.queenHel,
            miniBoss: makeMiniBoss(MONSTERS_DATA.draugrLord),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
        },
        map99: {
            title: "Map Lv. 99", levelReq: 99, campaignStages: 31, miniStage: 7, dropKey: 'map99', stageGrowth: 0.10,
            enemies: [MONSTERS_DATA.duskWolf, MONSTERS_DATA.duskWarrior, MONSTERS_DATA.brokenThrall, MONSTERS_DATA.duskTitan,
                      MONSTERS_DATA.duskArcher, MONSTERS_DATA.duskGunner, MONSTERS_DATA.duskPriest,
                      MONSTERS_DATA.duskFlameMage, MONSTERS_DATA.duskStoneMage, MONSTERS_DATA.duskFrostMage, MONSTERS_DATA.duskStormMage],
            boss: MONSTERS_DATA.bossWorldEater,
            miniBoss: makeMiniBoss(MONSTERS_DATA.brokenEinherjar),
            bossSupport: [{ pos: 2, role: 'range' }, { pos: 3, role: 'healer' }, { pos: 4, role: 'healer' }]
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
            enemies: base.enemies.map(tint),
            boss: tint(base.boss),
            miniBoss: tint(base.miniBoss)
        };
    });
});
