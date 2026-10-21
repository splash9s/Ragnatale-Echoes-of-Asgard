const MONSTERS_DATA = {
    // Map 1 Monsters
    poring: { name: "Poring", element: 'water', hp: 35, maxHp: 35, atkMin: 4, atkMax: 6, hit: 75, flee: 75, baseExp: 15, jobExp: 10, gold: 15, isRanged: false, skills: [] },
    fabre: { name: "Fabre", element: 'earth', hp: 45, maxHp: 45, atkMin: 6, atkMax: 9, hit: 80, flee: 80, baseExp: 20, jobExp: 15, gold: 25, isRanged: false, skills: [] },
    archerGoblin: { name: "Archer Goblin (Ranged)", element: 'wind', hp: 30, maxHp: 30, atkMin: 5, atkMax: 8, hit: 85, flee: 70, baseExp: 25, jobExp: 18, gold: 30, isRanged: true, skills: [{ name: "Quick Shot", desc: "Fires a swift arrow." }] },
    bossGiantMossPoring: { name: "Giant Moss Poring (Boss)", element: 'earth', hp: 150, maxHp: 150, atkMin: 12, atkMax: 16, hit: 85, flee: 70, baseExp: 80, jobExp: 50, gold: 80, isBoss: true, isRanged: false, skills: [] },

    // Map 10 Monsters
    caveBat: { name: "Cave Bat", element: 'wind', hp: 85, maxHp: 85, atkMin: 14, atkMax: 20, hit: 105, flee: 115, baseExp: 35, jobExp: 25, gold: 45, isRanged: false, skills: [] },
    rockGolem: { name: "Rock Golem", element: 'earth', hp: 140, maxHp: 140, atkMin: 22, atkMax: 30, hit: 100, flee: 80, baseExp: 50, jobExp: 35, gold: 60, isRanged: false, skills: [] },
    sniperKobold: { name: "Ranged Sniper Kobold", element: 'fire', hp: 75, maxHp: 75, atkMin: 18, atkMax: 26, hit: 115, flee: 100, baseExp: 55, jobExp: 40, gold: 70, isRanged: true, skills: [] },
    bossCavernBehemoth: { name: "Cavern Behemoth (Boss)", element: 'fire', hp: 450, maxHp: 450, atkMin: 35, atkMax: 48, hit: 120, flee: 90, baseExp: 220, jobExp: 150, gold: 250, isBoss: true, isRanged: false, skills: [] },

    // Map 20 Monsters
    desertScorpion: { name: "Desert Scorpion", element: 'earth', hp: 220, maxHp: 220, atkMin: 40, atkMax: 55, hit: 140, flee: 130, baseExp: 90, jobExp: 65, gold: 120, isRanged: false, skills: [] },
    sandWarrior: { name: "Sand Warrior", element: 'fire', hp: 300, maxHp: 300, atkMin: 55, atkMax: 70, hit: 150, flee: 110, baseExp: 130, jobExp: 95, gold: 180, isRanged: false, skills: [] },
    windArcher: { name: "Wind Archer", element: 'wind', hp: 190, maxHp: 190, atkMin: 48, atkMax: 65, hit: 160, flee: 140, baseExp: 140, jobExp: 100, gold: 190, isRanged: true, skills: [] },
    bossAncientPharaoh: { name: "Ancient Pharaoh (Boss)", element: 'earth', hp: 1100, maxHp: 1100, atkMin: 85, atkMax: 110, hit: 170, flee: 130, baseExp: 600, jobExp: 400, gold: 750, isBoss: true, isRanged: false, skills: [] },

    // Map 30 Monsters
    abyssalImp: { name: "Abyssal Imp", element: 'fire', hp: 450, maxHp: 450, atkMin: 90, atkMax: 120, hit: 190, flee: 180, baseExp: 240, jobExp: 180, gold: 350, isRanged: false, skills: [] },
    hellhound: { name: "Hellhound", element: 'fire', hp: 600, maxHp: 600, atkMin: 120, atkMax: 155, hit: 210, flee: 160, baseExp: 320, jobExp: 240, gold: 480, isRanged: false, skills: [] },
    demonGunner: { name: "Demon Gunner", element: 'water', hp: 420, maxHp: 420, atkMin: 110, atkMax: 145, hit: 220, flee: 190, baseExp: 350, jobExp: 260, gold: 500, isRanged: true, skills: [] },
    bossLordAbyss: { name: "Lord of the Abyss (Boss)", element: 'water', hp: 2600, maxHp: 2600, atkMin: 190, atkMax: 240, hit: 240, flee: 190, baseExp: 1500, jobExp: 1000, gold: 2000, isBoss: true, isRanged: false, skills: [] },

    // Map 40 Monsters
    celestialSentinel: { name: "Celestial Sentinel", element: 'wind', hp: 950, maxHp: 950, atkMin: 210, atkMax: 270, hit: 270, flee: 250, baseExp: 650, jobExp: 480, gold: 900, isRanged: false, skills: [] },
    seraphimEcho: { name: "Seraphim Echo", element: 'water', hp: 1200, maxHp: 1200, atkMin: 260, atkMax: 330, hit: 300, flee: 280, baseExp: 850, jobExp: 620, gold: 1200, isRanged: false, skills: [] },
    heavenlyBallista: { name: "Heavenly Ballista", element: 'earth', hp: 850, maxHp: 850, atkMin: 240, atkMax: 310, hit: 310, flee: 270, baseExp: 900, jobExp: 680, gold: 1300, isRanged: true, skills: [] },
    bossArchangelCorrupted: { name: "Archangel Corrupted (Boss)", element: 'wind', hp: 5500, maxHp: 5500, atkMin: 400, atkMax: 500, hit: 340, flee: 270, baseExp: 4000, jobExp: 2800, gold: 5000, isBoss: true, isRanged: false, skills: [] },

    // Map 50 Monsters
    worldEnderMinion: { name: "World Ender Minion", element: 'fire', hp: 2000, maxHp: 2000, atkMin: 450, atkMax: 580, hit: 380, flee: 350, baseExp: 1600, jobExp: 1200, gold: 2500, isRanged: false, skills: [] },
    astralHorror: { name: "Astral Horror", element: 'water', hp: 2800, maxHp: 2800, atkMin: 580, atkMax: 720, hit: 430, flee: 390, baseExp: 2400, jobExp: 1800, gold: 3800, isRanged: false, skills: [] },
    voidSniper: { name: "Void Sniper", element: 'wind', hp: 1900, maxHp: 1900, atkMin: 520, atkMax: 680, hit: 450, flee: 400, baseExp: 2600, jobExp: 1950, gold: 4000, isRanged: true, skills: [] },
    bossWorldEater: { name: "Ragnarok World-Eater (Boss)", element: 'earth', hp: 12000, maxHp: 12000, atkMin: 850, atkMax: 1100, hit: 480, flee: 410, baseExp: 10000, jobExp: 7500, gold: 15000, isBoss: true, isRanged: false, skills: [] }
};