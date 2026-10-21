const GAME_DATA = {
    maps: {
        map1: {
            title: "Map Lv. 1",
            levelReq: 1,
            maxStages: 11,
            dropKey: 'map1',
            released: true,
            enemies: [
                MONSTERS_DATA.poring,
                MONSTERS_DATA.fabre,
                MONSTERS_DATA.archerGoblin
            ],
            boss: MONSTERS_DATA.bossGiantMossPoring
        },
        map10: {
            title: "Map Lv. 10",
            levelReq: 10,
            maxStages: 12,
            dropKey: 'map10',
            released: true,
            enemies: [
                MONSTERS_DATA.caveBat,
                MONSTERS_DATA.rockGolem,
                MONSTERS_DATA.sniperKobold
            ],
            boss: MONSTERS_DATA.bossCavernBehemoth
        },
        map20: {
            title: "Map Lv. 20",
            levelReq: 20,
            maxStages: 14,
            dropKey: 'map20',
            released: true,
            enemies: [
                MONSTERS_DATA.desertScorpion,
                MONSTERS_DATA.sandWarrior,
                MONSTERS_DATA.windArcher
            ],
            boss: MONSTERS_DATA.bossAncientPharaoh
        },
        map30: {
            title: "Map Lv. 30",
            levelReq: 30,
            maxStages: 15,
            dropKey: 'map30',
            released: false,
            enemies: [
                MONSTERS_DATA.abyssalImp,
                MONSTERS_DATA.hellhound,
                MONSTERS_DATA.demonGunner
            ],
            boss: MONSTERS_DATA.bossLordAbyss
        },
        map40: {
            title: "Map Lv. 40",
            levelReq: 40,
            maxStages: 18,
            dropKey: 'map40',
            released: false,
            enemies: [
                MONSTERS_DATA.celestialSentinel,
                MONSTERS_DATA.seraphimEcho,
                MONSTERS_DATA.heavenlyBallista
            ],
            boss: MONSTERS_DATA.bossArchangelCorrupted
        },
        map50: {
            title: "Map Lv. 50",
            levelReq: 50,
            maxStages: 20,
            dropKey: 'map50',
            released: false,
            enemies: [
                MONSTERS_DATA.worldEnderMinion,
                MONSTERS_DATA.astralHorror,
                MONSTERS_DATA.voidSniper
            ],
            boss: MONSTERS_DATA.bossWorldEater
        }
    }
};