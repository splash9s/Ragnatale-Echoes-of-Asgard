const RING_ITEMS = [
    { id: "ring_1", name: "Apprentice Ring", slot: "ring", levelReq: 1, price: 60, stats: { atk: 2 }, desc: "ATK +2" },
    { id: "ring_10", name: "Iron Ring", slot: "ring", levelReq: 10, price: 200, stats: { def: 2, hp: 20 }, desc: "DEF +2, HP +20" },
    { id: "ring_20", name: "Ring of Swiftness", slot: "ring", levelReq: 20, price: 500, stats: { aspd: 3 }, desc: "ASPD +3" },
    { id: "ring_30", name: "Eagle Ring", slot: "ring", levelReq: 30, price: 1200, stats: { hit: 5, crit: 1 }, desc: "HIT +5, CRIT +1" },
    { id: "ring_40", name: "Titan Ring", slot: "ring", levelReq: 40, price: 2500, stats: { hp: 150, atk: 10 }, desc: "HP +150, ATK +10" },
    { id: "ring_50", name: "Ring of Odin", slot: "ring", levelReq: 50, price: 5000, stats: { atk: 20, def: 8, crit: 2 }, desc: "ATK +20, DEF +8, CRIT +2" }
];

const SHOP_ITEMS = [
    { id: "w1", name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, price: 50, stats: { atk: 10 }, desc: "Atk +10" },
    { id: "s1", name: "Wooden Buckler", slot: "shield", levelReq: 1, price: 40, stats: { def: 2, block: 5 }, desc: "DEF +2, Block +5%" },
    { id: "a1", name: "Iron Cuirass", slot: "armor", levelReq: 1, price: 60, stats: { hp: 50, def: 5 }, desc: "HP +50, DEF +5" },
    { id: "g1", name: "Cotton Cloak", slot: "garment", levelReq: 1, price: 30, stats: { flee: 2 }, desc: "FLEE +2" },
    { id: "f1", name: "Leather Boots", slot: "footgear", levelReq: 1, price: 30, stats: { hp: 20 }, desc: "HP +20" },
    { id: "d1", name: "Rookie Dagger", slot: "weapon", levelReq: 1, price: 45, stats: { atk: 8, crit: 1 }, desc: "Atk +8, CRIT +1%" },
    { id: "th1", name: "Two-Handed Claymore (2H)", slot: "weapon", levelReq: 1, price: 90, stats: { atk: 16 }, desc: "Atk +16 (Takes Shield slot)" },

    { id: "w10", name: "Steel Broadsword (1H)", slot: "weapon", levelReq: 10, price: 150, stats: { atk: 25 }, desc: "Atk +25" },
    { id: "s10", name: "Iron Vanguard Shield", slot: "shield", levelReq: 10, price: 120, stats: { def: 6, block: 10 }, desc: "DEF +6, Block +10%" },
    { id: "a10", name: "Steel Plate Armor", slot: "armor", levelReq: 10, price: 180, stats: { hp: 120, def: 12 }, desc: "HP +120, DEF +12" },
    { id: "g10", name: "Chain Mail Mantle", slot: "garment", levelReq: 10, price: 100, stats: { flee: 6, def: 2 }, desc: "FLEE +6, DEF +2" },
    { id: "f10", name: "Armored Greaves", slot: "footgear", levelReq: 10, price: 100, stats: { hp: 50, def: 3 }, desc: "HP +50, DEF +3" },
    { id: "d10", name: "Assassin Main Gauche", slot: "weapon", levelReq: 10, price: 140, stats: { atk: 20, crit: 3 }, desc: "Atk +20, CRIT +3%" },
    { id: "th10", name: "Bastard Sword (2H)", slot: "weapon", levelReq: 10, price: 280, stats: { atk: 38 }, desc: "Atk +38 (Takes Shield slot)" },

    { id: "w20", name: "Commander Blade (1H)", slot: "weapon", levelReq: 20, price: 400, stats: { atk: 50, crit: 2 }, desc: "Atk +50, CRIT +2%" },
    { id: "s20", name: "Royal Aegis", slot: "shield", levelReq: 20, price: 350, stats: { def: 12, block: 15 }, desc: "DEF +12, Block +15%" },
    { id: "a20", name: "Mithril Cuirass", slot: "armor", levelReq: 20, price: 500, stats: { hp: 250, def: 22 }, desc: "HP +250, DEF +22" },
    { id: "g20", name: "Valkyrie Cloak", slot: "garment", levelReq: 20, price: 300, stats: { flee: 12, mdef: 5 }, desc: "FLEE +12, MDEF +5" },
    { id: "f20", name: "Knight Striders", slot: "footgear", levelReq: 20, price: 300, stats: { hp: 100, aspd: 5 }, desc: "HP +100, ASPD +5" },
    { id: "d20", name: "Katar Kris", slot: "weapon", levelReq: 20, price: 380, stats: { atk: 45, crit: 4 }, desc: "Atk +45, CRIT +4%" },
    { id: "th20", name: "Zweihander (2H)", slot: "weapon", levelReq: 20, price: 750, stats: { atk: 75 }, desc: "Atk +75 (Takes Shield slot)" },

    { id: "w30", name: "Excalibur Fragment (1H)", slot: "weapon", levelReq: 30, price: 1000, stats: { atk: 90, crit: 4 }, desc: "Atk +90, CRIT +4%" },
    { id: "s30", name: "Shield of Asgard", slot: "shield", levelReq: 30, price: 900, stats: { def: 20, block: 25 }, desc: "DEF +20, Block +25%" },
    { id: "a30", name: "Divine Armor of Valhalla", slot: "armor", levelReq: 30, price: 1300, stats: { hp: 500, def: 40 }, desc: "HP +500, DEF +40" },
    { id: "g30", name: "Winged Shroud", slot: "garment", levelReq: 30, price: 800, stats: { flee: 25, def: 10 }, desc: "FLEE +25, DEF +10" },
    { id: "f30", name: "Boots of Swift Retribution", slot: "footgear", levelReq: 30, price: 800, stats: { hp: 200, aspd: 12 }, desc: "HP +200, ASPD +12" },
    { id: "d30", name: "Main Gauche of Shadows", slot: "weapon", levelReq: 30, price: 950, stats: { atk: 82, crit: 7 }, desc: "Atk +82, CRIT +7%" },
    { id: "th30", name: "Dusk Greatsword (2H)", slot: "weapon", levelReq: 30, price: 2000, stats: { atk: 140, crit: 2 }, desc: "Atk +140, CRIT +2% (Takes Shield slot)" },

    { id: "w40", name: "Solar Blade (1H)", slot: "weapon", levelReq: 40, price: 2500, stats: { atk: 140, crit: 6 }, desc: "Atk +140, CRIT +6%" },
    { id: "s40", name: "Aegis of Light", slot: "shield", levelReq: 40, price: 2200, stats: { def: 32, block: 30 }, desc: "DEF +32, Block +30%" },
    { id: "a40", name: "Solar Plate", slot: "armor", levelReq: 40, price: 3000, stats: { hp: 850, def: 60 }, desc: "HP +850, DEF +60" },
    { id: "g40", name: "Solar Mantle", slot: "garment", levelReq: 40, price: 1800, stats: { flee: 35, def: 15 }, desc: "FLEE +35, DEF +15" },
    { id: "f40", name: "Solar Greaves", slot: "footgear", levelReq: 40, price: 1800, stats: { hp: 350, aspd: 18 }, desc: "HP +350, ASPD +18" },
    { id: "d40", name: "Solar Kris", slot: "weapon", levelReq: 40, price: 2400, stats: { atk: 130, crit: 9 }, desc: "Atk +130, CRIT +9%" },
    { id: "th40", name: "Solar Greatsword (2H)", slot: "weapon", levelReq: 40, price: 4500, stats: { atk: 220, crit: 4 }, desc: "Atk +220, CRIT +4% (Takes Shield slot)" },

    { id: "w50", name: "Blade of Asgard (1H)", slot: "weapon", levelReq: 50, price: 5000, stats: { atk: 210, crit: 7 }, desc: "Atk +210, CRIT +7%" },
    { id: "s50", name: "Ultimate Aegis", slot: "shield", levelReq: 50, price: 4500, stats: { def: 50, block: 40 }, desc: "DEF +50, Block +40%" },
    { id: "a50", name: "Armor of the Gods", slot: "armor", levelReq: 50, price: 6500, stats: { hp: 1500, def: 90 }, desc: "HP +1500, DEF +90" },
    { id: "g50", name: "Shroud of Eternity", slot: "garment", levelReq: 50, price: 3800, stats: { flee: 50, def: 25 }, desc: "FLEE +50, DEF +25" },
    { id: "f50", name: "Striders of Odin", slot: "footgear", levelReq: 50, price: 3800, stats: { hp: 600, aspd: 25 }, desc: "HP +600, ASPD +25" },
    { id: "d50", name: "Katar of Destruction", slot: "weapon", levelReq: 50, price: 4800, stats: { atk: 195, crit: 13 }, desc: "Atk +195, CRIT +13%" },
    { id: "th50", name: "Dusk World-Ender (2H)", slot: "weapon", levelReq: 50, price: 9500, stats: { atk: 330, crit: 6 }, desc: "Atk +330, CRIT +6% (Takes Shield slot)" }
];

SHOP_ITEMS.push(...RING_ITEMS);

const GEAR_POOL = {
    map1: [
        { id: "G001", name: "Worn Iron Sword (1H)", slot: "weapon", levelReq: 1, stats: { atk: 10 }, desc: "Atk +10" },
        { id: "G002", name: "Wooden Buckler", slot: "shield", levelReq: 1, stats: { def: 2, block: 5 }, desc: "DEF +2, Block +5%" },
        { id: "G003", name: "Iron Cuirass", slot: "armor", levelReq: 1, stats: { hp: 50, def: 5 }, desc: "HP +50, DEF +5" },
        { id: "G004", name: "Cotton Cloak", slot: "garment", levelReq: 1, stats: { flee: 2 }, desc: "FLEE +2" },
        { id: "G005", name: "Leather Boots", slot: "footgear", levelReq: 1, stats: { hp: 20 }, desc: "HP +20" }
    ],
    map10: [
        { id: "G006", name: "Steel Broadsword (1H)", slot: "weapon", levelReq: 10, stats: { atk: 25 }, desc: "Atk +25" },
        { id: "G007", name: "Iron Vanguard Shield", slot: "shield", levelReq: 10, stats: { def: 6, block: 10 }, desc: "DEF +6, Block +10%" },
        { id: "G008", name: "Steel Plate Armor", slot: "armor", levelReq: 10, stats: { hp: 120, def: 12 }, desc: "HP +120, DEF +12" },
        { id: "G009", name: "Chain Mail Mantle", slot: "garment", levelReq: 10, stats: { flee: 6, def: 2 }, desc: "FLEE +6, DEF +2" },
        { id: "G010", name: "Armored Greaves", slot: "footgear", levelReq: 10, stats: { hp: 50, def: 3 }, desc: "HP +50, DEF +3" }
    ],
    map20: [
        { id: "G011", name: "Commander Blade (1H)", slot: "weapon", levelReq: 20, stats: { atk: 50, crit: 2 }, desc: "Atk +50, CRIT +2%" },
        { id: "G012", name: "Royal Aegis", slot: "shield", levelReq: 20, stats: { def: 12, block: 15 }, desc: "DEF +12, Block +15%" },
        { id: "G013", name: "Mithril Cuirass", slot: "armor", levelReq: 20, stats: { hp: 250, def: 22 }, desc: "HP +250, DEF +22" },
        { id: "G014", name: "Valkyrie Cloak", slot: "garment", levelReq: 20, stats: { flee: 12, mdef: 5 }, desc: "FLEE +12, MDEF +5" },
        { id: "G015", name: "Knight Striders", slot: "footgear", levelReq: 20, stats: { hp: 100, aspd: 5 }, desc: "HP +100, ASPD +5" }
    ],
    map30: [
        { id: "G016", name: "Excalibur Fragment (1H)", slot: "weapon", levelReq: 30, stats: { atk: 90, crit: 4 }, desc: "Atk +90, CRIT +4%" },
        { id: "G017", name: "Shield of Asgard", slot: "shield", levelReq: 30, stats: { def: 20, block: 25 }, desc: "DEF +20, Block +25%" },
        { id: "G018", name: "Divine Armor of Valhalla", slot: "armor", levelReq: 30, stats: { hp: 500, def: 40 }, desc: "HP +500, DEF +40" },
        { id: "G019", name: "Winged Shroud", slot: "garment", levelReq: 30, stats: { flee: 25, def: 10 }, desc: "FLEE +25, DEF +10" },
        { id: "G020", name: "Boots of Swift Retribution", slot: "footgear", levelReq: 30, stats: { hp: 200, aspd: 12 }, desc: "HP +200, ASPD +12" }
    ],
    map40: [
        { id: "G021", name: "Solar Blade (1H)", slot: "weapon", levelReq: 40, stats: { atk: 140, crit: 6 }, desc: "Atk +140, CRIT +6%" },
        { id: "G022", name: "Aegis of Light", slot: "shield", levelReq: 40, stats: { def: 32, block: 30 }, desc: "DEF +32, Block +30%" },
        { id: "G023", name: "Solar Plate", slot: "armor", levelReq: 40, stats: { hp: 850, def: 60 }, desc: "HP +850, DEF +60" },
        { id: "G024", name: "Solar Mantle", slot: "garment", levelReq: 40, stats: { flee: 35, def: 15 }, desc: "FLEE +35, DEF +15" },
        { id: "G025", name: "Solar Greaves", slot: "footgear", levelReq: 40, stats: { hp: 350, aspd: 18 }, desc: "HP +350, ASPD +18" }
    ],
    map50: [
        { id: "G026", name: "Blade of Asgard (1H)", slot: "weapon", levelReq: 50, stats: { atk: 210, crit: 7 }, desc: "Atk +210, CRIT +7%" },
        { id: "G027", name: "Ultimate Aegis", slot: "shield", levelReq: 50, stats: { def: 50, block: 40 }, desc: "DEF +50, Block +40%" },
        { id: "G028", name: "Armor of the Gods", slot: "armor", levelReq: 50, stats: { hp: 1500, def: 90 }, desc: "HP +1500, DEF +90" },
        { id: "G029", name: "Shroud of Eternity", slot: "garment", levelReq: 50, stats: { flee: 50, def: 25 }, desc: "FLEE +50, DEF +25" },
        { id: "G030", name: "Striders of Odin", slot: "footgear", levelReq: 50, price: 3800, stats: { hp: 600, aspd: 25 }, desc: "HP +600, ASPD +25" }
    ],
    map60: [
        { id: "G031", name: "Jotun Ice Axe (1H)", slot: "weapon", levelReq: 60, stats: { atk: 270, crit: 8 }, desc: "Atk +270, CRIT +8%" },
        { id: "G032", name: "Jotun Rime Shield", slot: "shield", levelReq: 60, stats: { def: 65, block: 45 }, desc: "DEF +65, Block +45%" },
        { id: "G033", name: "Jotun Fur Armor", slot: "armor", levelReq: 60, stats: { hp: 1900, def: 115 }, desc: "HP +1900, DEF +115" },
        { id: "G034", name: "Jotun Snow Cloak", slot: "garment", levelReq: 60, stats: { flee: 65, def: 30 }, desc: "FLEE +65, DEF +30" },
        { id: "G035", name: "Jotun Ice Striders", slot: "footgear", levelReq: 60, stats: { hp: 800, aspd: 30 }, desc: "HP +800, ASPD +30" }
    ],
    map70: [
        { id: "G036", name: "Einherjar Blade (1H)", slot: "weapon", levelReq: 70, stats: { atk: 340, crit: 9 }, desc: "Atk +340, CRIT +9%" },
        { id: "G037", name: "Valkyrie Bulwark", slot: "shield", levelReq: 70, stats: { def: 80, block: 50 }, desc: "DEF +80, Block +50%" },
        { id: "G038", name: "Valkyrie Plate", slot: "armor", levelReq: 70, stats: { hp: 2400, def: 140 }, desc: "HP +2400, DEF +140" },
        { id: "G039", name: "Valkyrie Wing Mantle", slot: "garment", levelReq: 70, stats: { flee: 80, def: 38 }, desc: "FLEE +80, DEF +38" },
        { id: "G040", name: "Valkyrie Greaves", slot: "footgear", levelReq: 70, stats: { hp: 1000, aspd: 35 }, desc: "HP +1000, ASPD +35" }
    ],
    map80: [
        { id: "G041", name: "Muspel Flame Blade (1H)", slot: "weapon", levelReq: 80, stats: { atk: 420, crit: 10 }, desc: "Atk +420, CRIT +10%" },
        { id: "G042", name: "Muspel Ember Shield", slot: "shield", levelReq: 80, stats: { def: 100, block: 55 }, desc: "DEF +100, Block +55%" },
        { id: "G043", name: "Muspel Forged Plate", slot: "armor", levelReq: 80, stats: { hp: 3000, def: 170 }, desc: "HP +3000, DEF +170" },
        { id: "G044", name: "Muspel Ash Cloak", slot: "garment", levelReq: 80, stats: { flee: 95, def: 45 }, desc: "FLEE +95, DEF +45" },
        { id: "G045", name: "Muspel Ember Boots", slot: "footgear", levelReq: 80, stats: { hp: 1250, aspd: 40 }, desc: "HP +1250, ASPD +40" }
    ],
    map90: [
        { id: "G046", name: "Hel Bone Blade (1H)", slot: "weapon", levelReq: 90, stats: { atk: 520, crit: 12 }, desc: "Atk +520, CRIT +12%" },
        { id: "G047", name: "Hel Grave Shield", slot: "shield", levelReq: 90, stats: { def: 125, block: 60 }, desc: "DEF +125, Block +60%" },
        { id: "G048", name: "Hel Death Plate", slot: "armor", levelReq: 90, stats: { hp: 3800, def: 210 }, desc: "HP +3800, DEF +210" },
        { id: "G049", name: "Hel Shroud", slot: "garment", levelReq: 90, stats: { flee: 115, def: 55 }, desc: "FLEE +115, DEF +55" },
        { id: "G050", name: "Hel Walkers", slot: "footgear", levelReq: 90, stats: { hp: 1550, aspd: 45 }, desc: "HP +1550, ASPD +45" }
    ],
    map99: [
        { id: "G051", name: "Dusk Reaper Blade (1H)", slot: "weapon", levelReq: 99, stats: { atk: 680, crit: 14 }, desc: "Atk +680, CRIT +14%" },
        { id: "G052", name: "Dusk Ward Shield", slot: "shield", levelReq: 99, stats: { def: 160, block: 65 }, desc: "DEF +160, Block +65%" },
        { id: "G053", name: "Dusk Titan Plate", slot: "armor", levelReq: 99, stats: { hp: 5000, def: 260 }, desc: "HP +5000, DEF +260" },
        { id: "G054", name: "Dusk Veil Cloak", slot: "garment", levelReq: 99, stats: { flee: 140, def: 65 }, desc: "FLEE +140, DEF +65" },
        { id: "G055", name: "Dusk Walkers", slot: "footgear", levelReq: 99, stats: { hp: 1900, aspd: 50 }, desc: "HP +1900, ASPD +50" }
    ]
};

// High-level rings (Lv 60-99). Drop only, not sold in the shop.
const HIGH_RING_ITEMS = [
    { id: "ring_60", name: "Ring of Jotun Frost", slot: "ring", levelReq: 60, stats: { atk: 40, def: 15, crit: 3 }, desc: "ATK +40, DEF +15, CRIT +3" },
    { id: "ring_70", name: "Ring of the Valkyrie", slot: "ring", levelReq: 70, stats: { hp: 800, atk: 50, aspd: 10 }, desc: "HP +800, ATK +50, ASPD +10" },
    { id: "ring_80", name: "Ring of Muspel Ember", slot: "ring", levelReq: 80, stats: { atk: 60, def: 25, crit: 4, hit: 10 }, desc: "ATK +60, DEF +25, CRIT +4, HIT +10" },
    { id: "ring_90", name: "Ring of Hel", slot: "ring", levelReq: 90, stats: { hp: 1200, def: 35, flee: 15, aspd: 10 }, desc: "HP +1200, DEF +35, FLEE +15, ASPD +10" },
    { id: "ring_99", name: "Dusk Oath Ring", slot: "ring", levelReq: 99, stats: { hp: 1500, atk: 90, def: 45, crit: 6, aspd: 15 }, desc: "HP +1500, ATK +90, DEF +45, CRIT +6, ASPD +15" }
];

// ---------- HATS (new gear slot) ----------
// One hat per gear tier. Tiers 1-50 are also sold in the shop.
const HAT_BY_LEVEL = {
    1:  { name: "Cloth Cap", stats: { hp: 15, def: 1 }, price: 25 },
    10: { name: "Iron Helm", stats: { hp: 60, def: 4 }, price: 90 },
    20: { name: "Knight Helm", stats: { hp: 120, def: 8 }, price: 280 },
    30: { name: "Winged Helm", stats: { hp: 250, def: 12, flee: 5 }, price: 750 },
    40: { name: "Solar Crown", stats: { hp: 420, def: 18, flee: 8 }, price: 1700 },
    50: { name: "Helm of Odin", stats: { hp: 700, def: 25, flee: 10 }, price: 3500 },
    60: { name: "Jotun Helm", stats: { hp: 1000, def: 35, flee: 15 }, price: 7000 },
    70: { name: "Valkyrie Helm", stats: { hp: 1300, def: 45, flee: 20 }, price: 14000 },
    80: { name: "Muspel Crown", stats: { hp: 1600, def: 55, flee: 25 }, price: 28000 },
    90: { name: "Hel Helm", stats: { hp: 2000, def: 65, flee: 30 }, price: 55000 },
    99: { name: "Dusk Crown", stats: { hp: 2500, def: 80, flee: 40 }, price: 110000 }
};

// Only these slots can carry a set piece
const SET_SLOTS = ['armor', 'garment', 'footgear', 'hat'];

// ---------- ITEM SETS ----------
// Set buffs are percentages or flat values. Only the highest reached tier applies (4 pieces replaces 2 pieces).
const SET_DATA = {
    warrior: {
        name: "Warrior Set", pieces: 4,
        bonuses: [
            { pieces: 2, desc: "ATK +3%", stats: { atkPct: 3 } },
            { pieces: 4, desc: "ATK +10%", stats: { atkPct: 10 } }
        ]
    },
    merchant: {
        name: "Merchant Set", pieces: 4,
        bonuses: [
            { pieces: 2, desc: "+5% Gold", goldBonus: 0.05 },
            { pieces: 4, desc: "+10% Gold", goldBonus: 0.10 }
        ]
    },
    ember: {
        name: "Ember Warden Set", pieces: 4,
        bonuses: [
            { pieces: 2, desc: "ASPD +2", stats: { aspd: 2 } },
            { pieces: 4, desc: "ASPD +4", stats: { aspd: 4 } }
        ]
    },
    tide: {
        name: "Tide Walker Set", pieces: 4,
        bonuses: [
            { pieces: 2, desc: "Max HP +5%", stats: { hpPct: 5 } },
            { pieces: 4, desc: "Max HP +15%", stats: { hpPct: 15 } }
        ]
    },
    stoneheart: {
        name: "Stoneheart Set", pieces: 4,
        bonuses: [
            { pieces: 2, desc: "DEF +5%", stats: { defPct: 5 } },
            { pieces: 4, desc: "DEF +10%, Max HP +5%", stats: { defPct: 10, hpPct: 5 } }
        ]
    },
    windrunner: {
        name: "Windrunner Set", pieces: 4,
        bonuses: [
            { pieces: 2, desc: "CRIT +3", stats: { crit: 3 } },
            { pieces: 4, desc: "CRIT +5, Crit damage +10%", stats: { crit: 5, critDmgPct: 10 } }
        ]
    }
};

// Piece names per set, one per set slot. Set pieces appear at every gear tier.
const SET_PIECE_NAMES = {
    warrior:    { armor: "Warrior Plate", garment: "Warrior Mantle", footgear: "Warrior Greaves", hat: "Warrior Helm" },
    merchant:   { armor: "Merchant Vest", garment: "Merchant Cloak", footgear: "Merchant Sandals", hat: "Merchant Hat" },
    ember:      { armor: "Ember Warden Plate", garment: "Ember Warden Cloak", footgear: "Ember Warden Boots", hat: "Ember Warden Hood" },
    tide:       { armor: "Tide Walker Coat", garment: "Tide Walker Cloak", footgear: "Tide Walker Boots", hat: "Tide Walker Cap" },
    stoneheart: { armor: "Stoneheart Mail", garment: "Stoneheart Cape", footgear: "Stoneheart Greaves", hat: "Stoneheart Helm" },
    windrunner: { armor: "Windrunner Harness", garment: "Windrunner Cloak", footgear: "Windrunner Boots", hat: "Windrunner Hood" },
};

const STAT_TEXT = { atk: 'ATK', def: 'DEF', hp: 'HP', flee: 'FLEE', hit: 'HIT', aspd: 'ASPD', crit: 'CRIT', block: 'Block', armor: 'Armor' };
function statText(stats) {
    return Object.keys(stats).map(k => `${STAT_TEXT[k] || k} +${stats[k]}`).join(', ');
}

// Shop: only these four helmets are sold
const SHOP_HAT_LEVELS = [1, 10, 30, 50];
Object.keys(HAT_BY_LEVEL).forEach(lv => {
    const h = HAT_BY_LEVEL[lv];
    if (!h.price || !SHOP_HAT_LEVELS.includes(Number(lv))) return;
    SHOP_ITEMS.push({ id: `hat${lv}`, name: h.name, slot: "hat", levelReq: Number(lv), price: h.price, stats: h.stats, desc: statText(h.stats) });
});


// Shop source per level: the base gear and rings of that level (the shop reads this, not the drop pools).
const GEAR_SHOP_SOURCE = {};
// Drop pools: each map drops gear of its own level only.
// Weapon and shield (base), the level's rings, and for armor, garment and footgear a Heavy and a Light version:
//   Heavy = +Armor (the base item's DEF), Light = +HP (the base item's HP; garment uses the armor's HP).
// Drop-only pieces get their set buff when they drop (see rollSetForDrop in combat.js).
const HEAVY_LIGHT_SLOTS = ['armor', 'garment', 'footgear'];
Object.keys(GEAR_POOL).forEach(k => {
    const lv = parseInt(k.replace('map', ''), 10);
    const base = GEAR_POOL[k].filter(i => !i.setName);
    const rings = [...RING_ITEMS, ...HIGH_RING_ITEMS].filter(r => r.levelReq === lv);
    GEAR_SHOP_SOURCE[k] = [...base, ...rings];
    const armorBase = base.find(i => i.slot === 'armor');
    const drops = base.filter(i => i.slot === 'weapon' || i.slot === 'shield');
    drops.push(...rings);
    HEAVY_LIGHT_SLOTS.forEach(slot => {
        const b = base.find(i => i.slot === slot);
        if (!b) return;
        const heavyArmor = b.stats.def || b.stats.mdef || 1;
        const lightHp = slot === 'garment' ? ((armorBase && armorBase.stats.hp) || 0) : (b.stats.hp || 0);
        drops.push({ id: `heavy_${slot}_${lv}`, name: `Heavy ${b.name}`, slot, levelReq: lv, dropOnly: true, stats: { armor: heavyArmor }, desc: statText({ armor: heavyArmor }) });
        drops.push({ id: `light_${slot}_${lv}`, name: `Light ${b.name}`, slot, levelReq: lv, dropOnly: true, stats: { hp: lightHp }, desc: statText({ hp: lightHp }) });
    });
    GEAR_POOL[k] = drops;
});

// Helmets (hat slot) drop only from campaign bosses. Per helmet level: the base helm.
const HELMET_DROP_POOL = {};
Object.keys(HAT_BY_LEVEL).forEach(lv => {
    const L = Number(lv), h = HAT_BY_LEVEL[lv];
    HELMET_DROP_POOL[lv] = [{ id: `hat${lv}`, name: h.name, slot: "hat", levelReq: L, stats: h.stats, desc: statText(h.stats) }];
});
// Boss helmet chance by the boss's map level: 1-30 5%, 40-60 2.5%, 70-99 1.5%
function bossHelmetChance(levelReq) {
    if (levelReq <= 30) return 0.05;
    if (levelReq <= 60) return 0.025;
    return 0.015;
}
// The helmet tier a boss drops: the highest helmet level at or below the map level (final map uses 99)
function bossHelmetLevel(levelReq) {
    const levels = Object.keys(HELMET_DROP_POOL).map(Number).filter(l => l <= levelReq);
    return levels.length ? Math.max(...levels) : 1;
}

// Shop: gear for tiers 60-90 (hats are added above). Each tier costs 2x the one before,
// starting from the Lv 50 shop price of each slot.
const SHOP_TIER50_PRICE = { weapon: 5000, shield: 4500, armor: 6500, garment: 3800, footgear: 3800, ring: 5000 };
[60, 70, 80, 90].forEach(lv => {
    const mult = Math.pow(2, (lv - 50) / 10);
    (GEAR_SHOP_SOURCE[`map${lv}`] || []).forEach(i => {
        if (SHOP_TIER50_PRICE[i.slot] === undefined) return;
        SHOP_ITEMS.push({ id: `shop_${i.id}`, name: i.name, slot: i.slot, levelReq: lv, price: Math.round(SHOP_TIER50_PRICE[i.slot] * mult), stats: i.stats, desc: statText(i.stats) });
    });
});
