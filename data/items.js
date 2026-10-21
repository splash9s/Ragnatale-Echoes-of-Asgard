const SHOP_ITEMS = [
    { id: "w1", name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, price: 50, stats: { atk: 10 }, desc: "Atk +10" },
    { id: "s1", name: "Wooden Buckler", slot: "shield", levelReq: 1, price: 40, stats: { def: 2, block: 5 }, desc: "DEF +2, Block +5%" },
    { id: "a1", name: "Iron Cuirass", slot: "armor", levelReq: 1, price: 60, stats: { hp: 50, def: 5 }, desc: "HP +50, DEF +5" },
    { id: "g1", name: "Cotton Cloak", slot: "garment", levelReq: 1, price: 30, stats: { flee: 2 }, desc: "FLEE +2" },
    { id: "f1", name: "Leather Boots", slot: "footgear", levelReq: 1, price: 30, stats: { hp: 20 }, desc: "HP +20" },
    { id: "d1", name: "Rookie Dagger", slot: "weapon", levelReq: 1, price: 45, stats: { atk: 8, crit: 3 }, desc: "Atk +8, CRIT +3%" },
    { id: "sp1", name: "Training Spear", slot: "weapon", levelReq: 1, price: 50, stats: { atk: 11, hit: 5 }, desc: "Atk +11, HIT +5" },
    { id: "m1", name: "Acolyte Mace", slot: "weapon", levelReq: 1, price: 45, stats: { atk: 9, def: 2 }, desc: "Atk +9, DEF +2" },
    { id: "th1", name: "Two-Handed Claymore (2H)", slot: "weapon", levelReq: 1, price: 90, stats: { atk: 16 }, desc: "Atk +16 (Takes Shield slot)" },

    { id: "w10", name: "Steel Broadsword (1H)", slot: "weapon", levelReq: 10, price: 150, stats: { atk: 25 }, desc: "Atk +25" },
    { id: "s10", name: "Iron Vanguard Shield", slot: "shield", levelReq: 10, price: 120, stats: { def: 6, block: 10 }, desc: "DEF +6, Block +10%" },
    { id: "a10", name: "Steel Plate Armor", slot: "armor", levelReq: 10, price: 180, stats: { hp: 120, def: 12 }, desc: "HP +120, DEF +12" },
    { id: "g10", name: "Chain Mail Mantle", slot: "garment", levelReq: 10, price: 100, stats: { flee: 6, def: 2 }, desc: "FLEE +6, DEF +2" },
    { id: "f10", name: "Armored Greaves", slot: "footgear", levelReq: 10, price: 100, stats: { hp: 50, def: 3 }, desc: "HP +50, DEF +3" },
    { id: "d10", name: "Assassin Main Gauche", slot: "weapon", levelReq: 10, price: 140, stats: { atk: 20, crit: 7 }, desc: "Atk +20, CRIT +7%" },
    { id: "sp10", name: "Pike Spear", slot: "weapon", levelReq: 10, price: 160, stats: { atk: 28, hit: 10 }, desc: "Atk +28, HIT +10" },
    { id: "m10", name: "War Mace", slot: "weapon", levelReq: 10, price: 145, stats: { atk: 24, def: 5 }, desc: "Atk +24, DEF +5" },
    { id: "th10", name: "Bastard Sword (2H)", slot: "weapon", levelReq: 10, price: 280, stats: { atk: 38 }, desc: "Atk +38 (Takes Shield slot)" },

    { id: "w20", name: "Commander Blade (1H)", slot: "weapon", levelReq: 20, price: 400, stats: { atk: 50, crit: 5 }, desc: "Atk +50, CRIT +5%" },
    { id: "s20", name: "Royal Aegis", slot: "shield", levelReq: 20, price: 350, stats: { def: 12, block: 15 }, desc: "DEF +12, Block +15%" },
    { id: "a20", name: "Mithril Cuirass", slot: "armor", levelReq: 20, price: 500, stats: { hp: 250, def: 22 }, desc: "HP +250, DEF +22" },
    { id: "g20", name: "Valkyrie Cloak", slot: "garment", levelReq: 20, price: 300, stats: { flee: 12, mdef: 5 }, desc: "FLEE +12, MDEF +5" },
    { id: "f20", name: "Knight Striders", slot: "footgear", levelReq: 20, price: 300, stats: { hp: 100, aspd: 5 }, desc: "HP +100, ASPD +5" },
    { id: "d20", name: "Katar Kris", slot: "weapon", levelReq: 20, price: 380, stats: { atk: 45, crit: 12 }, desc: "Atk +45, CRIT +12%" },
    { id: "sp20", name: "Glaive Spear", slot: "weapon", levelReq: 20, price: 420, stats: { atk: 55, hit: 15 }, desc: "Atk +55, HIT +15" },
    { id: "m20", name: "Morning Star", slot: "weapon", levelReq: 20, price: 390, stats: { atk: 48, def: 10 }, desc: "Atk +48, DEF +10" },
    { id: "th20", name: "Zweihander (2H)", slot: "weapon", levelReq: 20, price: 750, stats: { atk: 75 }, desc: "Atk +75 (Takes Shield slot)" },

    { id: "w30", name: "Excalibur Fragment (1H)", slot: "weapon", levelReq: 30, price: 1000, stats: { atk: 90, crit: 10 }, desc: "Atk +90, CRIT +10%" },
    { id: "s30", name: "Shield of Asgard", slot: "shield", levelReq: 30, price: 900, stats: { def: 20, block: 25 }, desc: "DEF +20, Block +25%" },
    { id: "a30", name: "Divine Armor of Valhalla", slot: "armor", levelReq: 30, price: 1300, stats: { hp: 500, def: 40 }, desc: "HP +500, DEF +40" },
    { id: "g30", name: "Winged Shroud", slot: "garment", levelReq: 30, price: 800, stats: { flee: 25, def: 10 }, desc: "FLEE +25, DEF +10" },
    { id: "f30", name: "Boots of Swift Retribution", slot: "footgear", levelReq: 30, price: 800, stats: { hp: 200, aspd: 12 }, desc: "HP +200, ASPD +12" },
    { id: "d30", name: "Main Gauche of Shadows", slot: "weapon", levelReq: 30, price: 950, stats: { atk: 82, crit: 20 }, desc: "Atk +82, CRIT +20%" },
    { id: "sp30", name: "Gungnir Vanguard", slot: "weapon", levelReq: 30, price: 1050, stats: { atk: 98, hit: 25 }, desc: "Atk +98, HIT +25" },
    { id: "m30", name: "Mjolnir Prototype", slot: "weapon", levelReq: 30, price: 1000, stats: { atk: 95, def: 20 }, desc: "Atk +95, DEF +20" },
    { id: "th30", name: "Ragnarok Greatsword (2H)", slot: "weapon", levelReq: 30, price: 2000, stats: { atk: 140, crit: 5 }, desc: "Atk +140, CRIT +5% (Takes Shield slot)" },

    { id: "w40", name: "Solar Blade (1H)", slot: "weapon", levelReq: 40, price: 2500, stats: { atk: 140, crit: 15 }, desc: "Atk +140, CRIT +15%" },
    { id: "s40", name: "Aegis of Light", slot: "shield", levelReq: 40, price: 2200, stats: { def: 32, block: 30 }, desc: "DEF +32, Block +30%" },
    { id: "a40", name: "Solar Plate", slot: "armor", levelReq: 40, price: 3000, stats: { hp: 850, def: 60 }, desc: "HP +850, DEF +60" },
    { id: "g40", name: "Solar Mantle", slot: "garment", levelReq: 40, price: 1800, stats: { flee: 35, def: 15 }, desc: "FLEE +35, DEF +15" },
    { id: "f40", name: "Solar Greaves", slot: "footgear", levelReq: 40, price: 1800, stats: { hp: 350, aspd: 18 }, desc: "HP +350, ASPD +18" },
    { id: "d40", name: "Solar Kris", slot: "weapon", levelReq: 40, price: 2400, stats: { atk: 130, crit: 25 }, desc: "Atk +130, CRIT +25%" },
    { id: "sp40", name: "Solar Spear", slot: "weapon", levelReq: 40, price: 2600, stats: { atk: 150, hit: 35 }, desc: "Atk +150, HIT +35" },
    { id: "m40", name: "Solar Mace", slot: "weapon", levelReq: 40, price: 2450, stats: { atk: 145, def: 30 }, desc: "Atk +145, DEF +30" },
    { id: "th40", name: "Solar Greatsword (2H)", slot: "weapon", levelReq: 40, price: 4500, stats: { atk: 220, crit: 10 }, desc: "Atk +220, CRIT +10% (Takes Shield slot)" },

    { id: "w50", name: "Blade of Asgard (1H)", slot: "weapon", levelReq: 50, price: 5000, stats: { atk: 210, crit: 20 }, desc: "Atk +210, CRIT +20%" },
    { id: "s50", name: "Ultimate Aegis", slot: "shield", levelReq: 50, price: 4500, stats: { def: 50, block: 40 }, desc: "DEF +50, Block +40%" },
    { id: "a50", name: "Armor of the Gods", slot: "armor", levelReq: 50, price: 6500, stats: { hp: 1500, def: 90 }, desc: "HP +1500, DEF +90" },
    { id: "g50", name: "Shroud of Eternity", slot: "garment", levelReq: 50, price: 3800, stats: { flee: 50, def: 25 }, desc: "FLEE +50, DEF +25" },
    { id: "f50", name: "Striders of Odin", slot: "footgear", levelReq: 50, price: 3800, stats: { hp: 600, aspd: 25 }, desc: "HP +600, ASPD +25" },
    { id: "d50", name: "Katar of Destruction", slot: "weapon", levelReq: 50, price: 4800, stats: { atk: 195, crit: 35 }, desc: "Atk +195, CRIT +35%" },
    { id: "sp50", name: "Gungnir Prime", slot: "weapon", levelReq: 50, price: 5200, stats: { atk: 225, hit: 50 }, desc: "Atk +225, HIT +50" },
    { id: "m50", name: "Mjolnir Awakened", slot: "weapon", levelReq: 50, price: 5000, stats: { atk: 220, def: 45 }, desc: "Atk +220, DEF +45" },
    { id: "th50", name: "Ragnarok World-Ender (2H)", slot: "weapon", levelReq: 50, price: 9500, stats: { atk: 330, crit: 15 }, desc: "Atk +330, CRIT +15% (Takes Shield slot)" }
];

const GEAR_POOL = {
    map1: [
        { name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, stats: { atk: 10 }, desc: "Atk +10" },
        { name: "Wooden Buckler", slot: "shield", levelReq: 1, stats: { def: 2, block: 5 }, desc: "DEF +2, Block +5%" },
        { name: "Iron Cuirass", slot: "armor", levelReq: 1, stats: { hp: 50, def: 5 }, desc: "HP +50, DEF +5" },
        { name: "Cotton Cloak", slot: "garment", levelReq: 1, stats: { flee: 2 }, desc: "FLEE +2" },
        { name: "Leather Boots", slot: "footgear", levelReq: 1, stats: { hp: 20 }, desc: "HP +20" }
    ],
    map10: [
        { name: "Steel Broadsword (1H)", slot: "weapon", levelReq: 10, stats: { atk: 25 }, desc: "Atk +25" },
        { name: "Iron Vanguard Shield", slot: "shield", levelReq: 10, stats: { def: 6, block: 10 }, desc: "DEF +6, Block +10%" },
        { name: "Steel Plate Armor", slot: "armor", levelReq: 10, stats: { hp: 120, def: 12 }, desc: "HP +120, DEF +12" },
        { name: "Chain Mail Mantle", slot: "garment", levelReq: 10, stats: { flee: 6, def: 2 }, desc: "FLEE +6, DEF +2" },
        { name: "Armored Greaves", slot: "footgear", levelReq: 10, stats: { hp: 50, def: 3 }, desc: "HP +50, DEF +3" }
    ],
    map20: [
        { name: "Commander Blade (1H)", slot: "weapon", levelReq: 20, stats: { atk: 50, crit: 5 }, desc: "Atk +50, CRIT +5%" },
        { name: "Royal Aegis", slot: "shield", levelReq: 20, stats: { def: 12, block: 15 }, desc: "DEF +12, Block +15%" },
        { name: "Mithril Cuirass", slot: "armor", levelReq: 20, stats: { hp: 250, def: 22 }, desc: "HP +250, DEF +22" },
        { name: "Valkyrie Cloak", slot: "garment", levelReq: 20, stats: { flee: 12, mdef: 5 }, desc: "FLEE +12, MDEF +5" },
        { name: "Knight Striders", slot: "footgear", levelReq: 20, stats: { hp: 100, aspd: 5 }, desc: "HP +100, ASPD +5" }
    ],
    map30: [
        { name: "Excalibur Fragment (1H)", slot: "weapon", levelReq: 30, stats: { atk: 90, crit: 10 }, desc: "Atk +90, CRIT +10%" },
        { name: "Shield of Asgard", slot: "shield", levelReq: 30, stats: { def: 20, block: 25 }, desc: "DEF +20, Block +25%" },
        { name: "Divine Armor of Valhalla", slot: "armor", levelReq: 30, stats: { hp: 500, def: 40 }, desc: "HP +500, DEF +40" },
        { name: "Winged Shroud", slot: "garment", levelReq: 30, stats: { flee: 25, def: 10 }, desc: "FLEE +25, DEF +10" },
        { name: "Boots of Swift Retribution", slot: "footgear", levelReq: 30, stats: { hp: 200, aspd: 12 }, desc: "HP +200, ASPD +12" }
    ],
    map40: [
        { name: "Solar Blade (1H)", slot: "weapon", levelReq: 40, stats: { atk: 140, crit: 15 }, desc: "Atk +140, CRIT +15%" },
        { name: "Aegis of Light", slot: "shield", levelReq: 40, stats: { def: 32, block: 30 }, desc: "DEF +32, Block +30%" },
        { name: "Solar Plate", slot: "armor", levelReq: 40, stats: { hp: 850, def: 60 }, desc: "HP +850, DEF +60" },
        { name: "Solar Mantle", slot: "garment", levelReq: 40, stats: { flee: 35, def: 15 }, desc: "FLEE +35, DEF +15" },
        { name: "Solar Greaves", slot: "footgear", levelReq: 40, stats: { hp: 350, aspd: 18 }, desc: "HP +350, ASPD +18" }
    ],
    map50: [
        { name: "Blade of Asgard (1H)", slot: "weapon", levelReq: 50, stats: { atk: 210, crit: 20 }, desc: "Atk +210, CRIT +20%" },
        { name: "Ultimate Aegis", slot: "shield", levelReq: 50, stats: { def: 50, block: 40 }, desc: "DEF +50, Block +40%" },
        { name: "Armor of the Gods", slot: "armor", levelReq: 50, stats: { hp: 1500, def: 90 }, desc: "HP +1500, DEF +90" },
        { name: "Shroud of Eternity", slot: "garment", levelReq: 50, stats: { flee: 50, def: 25 }, desc: "FLEE +50, DEF +25" },
        { name: "Striders of Odin", slot: "footgear", levelReq: 50, price: 3800, stats: { hp: 600, aspd: 25 }, desc: "HP +600, ASPD +25" }
    ]
};

// ---------- ITEM SETS ----------
const SET_DATA = {
    warrior: {
        name: "Warrior Set", pieces: 5,
        bonuses: [
            { pieces: 2, desc: "ATK +10", stats: { atk: 10 } },
            { pieces: 4, desc: "ATK +40, DEF +10, Max HP +200", stats: { atk: 40, def: 10, hp: 200 } }
        ]
    },
    beach: {
        name: "Beach Adventurer Set", pieces: 3,
        bonuses: [
            { pieces: 2, desc: "+5% Gold", goldBonus: 0.05 },
            { pieces: 3, desc: "+5% more Gold, FLEE +3", goldBonus: 0.05, stats: { flee: 3 } }
        ]
    }
};

// Set pieces dropped from expeditions / chests
GEAR_POOL.map1.push(
    { name: "Beach Shirt", slot: "armor", levelReq: 1, setName: "beach", stats: { hp: 40 }, desc: "HP +40" },
    { name: "Beach Sandals", slot: "footgear", levelReq: 1, setName: "beach", stats: { flee: 2 }, desc: "FLEE +2" },
    { name: "Beach Sarong", slot: "garment", levelReq: 1, setName: "beach", stats: { def: 1 }, desc: "DEF +1" }
);
GEAR_POOL.map10.push(
    { name: "Warrior Blade (1H)", slot: "weapon", levelReq: 10, setName: "warrior", stats: { atk: 22 }, desc: "Atk +22" },
    { name: "Warrior Bulwark", slot: "shield", levelReq: 10, setName: "warrior", stats: { def: 5, block: 8 }, desc: "DEF +5, Block +8%" },
    { name: "Warrior Plate", slot: "armor", levelReq: 10, setName: "warrior", stats: { hp: 100, def: 8 }, desc: "HP +100, DEF +8" },
    { name: "Warrior Mantle", slot: "garment", levelReq: 10, setName: "warrior", stats: { flee: 4, def: 2 }, desc: "FLEE +4, DEF +2" },
    { name: "Warrior Greaves", slot: "footgear", levelReq: 10, setName: "warrior", stats: { hp: 40, def: 2 }, desc: "HP +40, DEF +2" }
);
