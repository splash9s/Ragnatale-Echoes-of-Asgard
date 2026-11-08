// Generated from tools/body-animation/index.html (POSES, GEAR, LAYER_ORDER). Art: assets/body/.
const HERO_BODY_POSES = {
 base: {
  label: 'base',
  parts: [
   {
    id: 'leg',
    name: 'Leg',
    src: 'assets/body/base/dbaseleg.png',
    x: 196,
    y: 263,
    sc: 1
   },
   {
    id: 'armor',
    name: 'Armor',
    src: 'assets/body/base/dbasearmor.png',
    x: 167,
    y: 127,
    sc: 1
   },
   {
    id: 'head',
    name: 'Head',
    src: 'assets/body/base/dbasehead.png',
    x: 223,
    y: 40,
    sc: 1
   },
   {
    id: 'lefthand',
    name: 'Left hand',
    src: 'assets/body/base/dbaselefthand.png',
    x: 157,
    y: 245,
    sc: 0.95
   },
   {
    id: 'righthand',
    name: 'Right hand',
    src: 'assets/body/base/dbaserighthand.png',
    x: 342,
    y: 209,
    sc: 1.05
   }
  ]
 },
 attack: {
  label: 'attack',
  parts: [
   {
    id: 'leg',
    name: 'Leg',
    src: 'assets/body/attack/dattackleg.png',
    x: 114,
    y: 196,
    sc: 0.975
   },
   {
    id: 'armor',
    name: 'Armor',
    src: 'assets/body/attack/dattackarmor.png',
    x: 190,
    y: 116,
    sc: 1
   },
   {
    id: 'head',
    name: 'Head',
    src: 'assets/body/attack/dattackhead.png',
    x: 312,
    y: 36,
    sc: 1
   },
   {
    id: 'lefthand',
    name: 'Left hand',
    src: 'assets/body/attack/dattacklefthand.png',
    x: 165,
    y: 181,
    sc: 0.975
   },
   {
    id: 'righthand',
    name: 'Right hand',
    src: 'assets/body/attack/dattackrighthand.png',
    x: 408,
    y: 235,
    sc: 1
   }
  ]
 },
 block: {
  label: 'block',
  parts: [
   {
    id: 'leg',
    name: 'Leg',
    src: 'assets/body/block/dblockleg.png',
    x: 164,
    y: 276,
    sc: 1
   },
   {
    id: 'armor',
    name: 'Armor',
    src: 'assets/body/block/dblockarmor.png',
    x: 168,
    y: 119,
    sc: 1
   },
   {
    id: 'head',
    name: 'Head',
    src: 'assets/body/block/dblockhead.png',
    x: 258,
    y: 34,
    sc: 1
   },
   {
    id: 'lefthand',
    name: 'Left hand',
    src: 'assets/body/block/dblocklefthand.png',
    x: 148,
    y: 220,
    sc: 1
   },
   {
    id: 'righthand',
    name: 'Right hand',
    src: 'assets/body/block/dblockrighthand.png',
    x: 385,
    y: 211,
    sc: 1
   }
  ]
 },
 critical: {
  label: 'critical',
  parts: [
   {
    id: 'leg',
    name: 'Leg',
    src: 'assets/body/critical/dcriticalleg.png',
    x: 91,
    y: 236,
    sc: 1
   },
   {
    id: 'armor',
    name: 'Armor',
    src: 'assets/body/critical/dcriticalarmor.png',
    x: 216,
    y: 86,
    sc: 1
   },
   {
    id: 'head',
    name: 'Head',
    src: 'assets/body/critical/dcriticalhead.png',
    x: 273,
    y: 39,
    sc: 1
   },
   {
    id: 'lefthand',
    name: 'Left hand',
    src: 'assets/body/critical/dcriticallefthand.png',
    x: 222,
    y: 51,
    sc: 0.8
   },
   {
    id: 'righthand',
    name: 'Right hand',
    src: 'assets/body/critical/dcriticalrighthand.png',
    x: 393,
    y: 207,
    sc: 1
   }
  ]
 }
};
const HERO_BODY_GEAR = {
 attack: {
  helmet: {
   shoplv10: {
    src: 'assets/body/gear/helmet/hatssattacklv10.png',
    x: 319,
    y: 42,
    sc: 1
   },
   bosslv1: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv1.png',
    x: 308,
    y: 21,
    sc: 1
   },
   bosslv10: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv10.png',
    x: 298,
    y: 28,
    sc: 1
   },
   bosslv20: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv20.png',
    x: 288,
    y: 24,
    sc: 1
   },
   shoplv20: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv20.png',
    x: 314,
    y: 30,
    sc: 1
   },
   bosslv30: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv30.png',
    x: 317,
    y: 11,
    sc: 1
   },
   bosslv40: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv40.png',
    x: 320,
    y: 39,
    sc: 1
   },
   bosslv50: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv50.png',
    x: 323,
    y: 22,
    sc: 1
   },
   bosslv60: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv60.png',
    x: 318,
    y: 16,
    sc: 1
   },
   bosslv70: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv70.png',
    x: 303,
    y: -11,
    sc: 1
   },
   bosslv80: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv80.png',
    x: 322,
    y: 24,
    sc: 1
   },
   bosslv90: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv90.png',
    x: 318,
    y: 38,
    sc: 1
   },
   bosslv99: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv99.png',
    x: 316,
    y: 24,
    sc: 1
   },
   shoplv30: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv30.png',
    x: 312,
    y: 5,
    sc: 1
   },
   shoplv40: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv40.png',
    x: 312,
    y: 34,
    sc: 1
   },
   shoplv50: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv50.png',
    x: 310,
    y: 38,
    sc: 1
   },
   shoplv60: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv60.png',
    x: 300,
    y: 2,
    sc: 1
   },
   shoplv70: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv70.png',
    x: 299,
    y: 2,
    sc: 1
   },
   shoplv80: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv80.png',
    x: 310,
    y: 24,
    sc: 1
   },
   shoplv90: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv90.png',
    x: 312,
    y: 34,
    sc: 1
   },
   shoplv99: {
    src: 'assets/body/gear/helmet/shop/ssattackshoplv99.png',
    x: 314,
    y: 31,
    sc: 1
   }
  },
  wear: {
   lv10: {
    src: 'assets/body/gear/wear/ssattackarmorlv10.png',
    x: 190,
    y: 123,
    sc: 1
   }
  },
  sword: {
   lv10: {
    src: 'assets/body/gear/attack/ssattackswordlv10.png',
    x: 146,
    y: 170,
    sc: 1
   }
  },
  shield: {
   lv10: {
    src: 'assets/body/gear/attack/ssattackshield.png',
    x: 415,
    y: 154,
    sc: 1
   }
  },
  foot: {
   lv10: {
    src: 'assets/body/gear/foot/ssattackfootlv10.png',
    x: 171,
    y: 253,
    sc: 1
   }
  },
  garment: {
   lv10: {
    src: 'assets/body/gear/garment/ssattackmanteaulv10.png',
    x: 193,
    y: 123,
    sc: 1
   }
  }
 },
 base: {
  helmet: {
   shoplv10: {
    src: 'assets/body/gear/helmet/hatbaseattacklv10.png',
    x: 220,
    y: 40,
    sc: 1
   },
   bosslv1: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv1.png',
    x: 212,
    y: 31,
    sc: 1
   },
   bosslv10: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv10.png',
    x: 200,
    y: 22,
    sc: 1
   },
   bosslv20: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv20.png',
    x: 197,
    y: 36,
    sc: 1
   },
   shoplv20: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv20.png',
    x: 214,
    y: 26,
    sc: 1
   },
   bosslv30: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv30.png',
    x: 214,
    y: 20,
    sc: 1
   },
   bosslv40: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv40.png',
    x: 221,
    y: 43,
    sc: 1
   },
   bosslv50: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv50.png',
    x: 222,
    y: 36,
    sc: 1
   },
   bosslv60: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv60.png',
    x: 219,
    y: 18,
    sc: 1
   },
   bosslv70: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv70.png',
    x: 179,
    y: 9,
    sc: 1
   },
   bosslv80: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv80.png',
    x: 210,
    y: 26,
    sc: 1
   },
   bosslv90: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv90.png',
    x: 215,
    y: 38,
    sc: 1
   },
   bosslv99: {
    src: 'assets/body/gear/helmet/boss/ssbasebosslv99.png',
    x: 213,
    y: 20,
    sc: 1
   },
   shoplv30: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv30.png',
    x: 193,
    y: 9,
    sc: 1
   },
   shoplv40: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv40.png',
    x: 215,
    y: 28,
    sc: 1
   },
   shoplv50: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv50.png',
    x: 216,
    y: 30,
    sc: 1
   },
   shoplv60: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv60.png',
    x: 186,
    y: 11,
    sc: 1
   },
   shoplv70: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv70.png',
    x: 198,
    y: 15,
    sc: 1
   },
   shoplv80: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv80.png',
    x: 217,
    y: 24,
    sc: 1
   },
   shoplv90: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv90.png',
    x: 224,
    y: 31,
    sc: 1
   },
   shoplv99: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv99.png',
    x: 218,
    y: 27,
    sc: 1
   }
  },
  wear: {
   lv10: {
    src: 'assets/body/gear/wear/ssbasearmorlv10.png',
    x: 172,
    y: 129,
    sc: 1
   }
  },
  sword: {
   lv10: {
    src: 'assets/body/gear/base/ssbasesword.png',
    x: 25,
    y: 241,
    sc: 1
   }
  },
  shield: {
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 321,
    y: 139,
    sc: 1
   }
  },
  foot: {
   lv10: {
    src: 'assets/body/gear/foot/ssbasefootlv10.png',
    x: 196,
    y: 260,
    sc: 1
   }
  },
  garment: {
   lv10: {
    src: 'assets/body/gear/garment/ssbasemanteaulv10.png',
    x: 168,
    y: 128,
    sc: 1
   }
  }
 },
 block: {
  helmet: {
   shoplv10: {
    src: 'assets/body/gear/helmet/hatssblocklv10.png',
    x: 264,
    y: 37,
    sc: 1
   },
   bosslv1: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv1.png',
    x: 253,
    y: 18,
    sc: 1
   },
   bosslv10: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv10.png',
    x: 240,
    y: 17,
    sc: 1
   },
   bosslv20: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv20.png',
    x: 253,
    y: 26,
    sc: 1
   },
   shoplv20: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv20.png',
    x: 253,
    y: 18,
    sc: 1
   },
   bosslv30: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv30.png',
    x: 247,
    y: 7,
    sc: 1
   },
   bosslv40: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv40.png',
    x: 254,
    y: 36,
    sc: 1
   },
   bosslv50: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv50.png',
    x: 254,
    y: 24,
    sc: 1
   },
   bosslv60: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv60.png',
    x: 254,
    y: 4,
    sc: 1
   },
   bosslv70: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv70.png',
    x: 225,
    y: -1,
    sc: 1
   },
   bosslv80: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv80.png',
    x: 247,
    y: 12,
    sc: 1
   },
   bosslv90: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv90.png',
    x: 255,
    y: 34,
    sc: 1
   },
   bosslv99: {
    src: 'assets/body/gear/helmet/boss/ssblockbosslv99.png',
    x: 255,
    y: 18,
    sc: 1
   },
   shoplv30: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv30.png',
    x: 239,
    y: 12,
    sc: 1
   },
   shoplv40: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv40.png',
    x: 253,
    y: 23,
    sc: 1
   },
   shoplv50: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv50.png',
    x: 251,
    y: 34,
    sc: 1
   },
   shoplv60: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv60.png',
    x: 234,
    y: -1,
    sc: 1
   },
   shoplv70: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv70.png',
    x: 237,
    y: 15,
    sc: 1
   },
   shoplv80: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv80.png',
    x: 256,
    y: 21,
    sc: 1
   },
   shoplv90: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv90.png',
    x: 250,
    y: 22,
    sc: 1
   },
   shoplv99: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv99.png',
    x: 255,
    y: 30,
    sc: 1
   }
  },
  wear: {
   lv10: {
    src: 'assets/body/gear/wear/ssblockarmorlv10.png',
    x: 165,
    y: 126,
    sc: 1
   }
  },
  sword: {
   lv10: {
    src: 'assets/body/gear/block/ssblocksword.png',
    x: 127,
    y: 219,
    sc: 1
   }
  },
  shield: {
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 363,
    y: 138,
    sc: 1
   }
  },
  foot: {
   lv10: {
    src: 'assets/body/gear/foot/ssblockfootlv10.png',
    x: 162,
    y: 275,
    sc: 1
   }
  },
  garment: {
   lv10: {
    src: 'assets/body/gear/garment/ssblockmanteaulv10.png',
    x: 163,
    y: 120,
    sc: 1
   }
  }
 },
 critical: {
  helmet: {
   shoplv10: {
    src: 'assets/body/gear/helmet/hatsscriticallv10.png',
    x: 272,
    y: 47,
    sc: 1
   },
   bosslv1: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv1.png',
    x: 270,
    y: 24,
    sc: 1
   },
   bosslv10: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv10.png',
    x: 252,
    y: 13,
    sc: 1
   },
   bosslv20: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv20.png',
    x: 266,
    y: 20,
    sc: 1
   },
   shoplv20: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv20.png',
    x: 260,
    y: 22,
    sc: 1
   },
   bosslv30: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv30.png',
    x: 265,
    y: -2,
    sc: 1
   },
   bosslv40: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv40.png',
    x: 267,
    y: 38,
    sc: 1
   },
   bosslv50: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv50.png',
    x: 263,
    y: 18,
    sc: 1
   },
   bosslv60: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv60.png',
    x: 265,
    y: 4,
    sc: 1
   },
   bosslv70: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv70.png',
    x: 243,
    y: -14,
    sc: 1
   },
   bosslv80: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv80.png',
    x: 269,
    y: 3,
    sc: 1
   },
   bosslv90: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv90.png',
    x: 266,
    y: 36,
    sc: 1
   },
   bosslv99: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv99.png',
    x: 269,
    y: 21,
    sc: 1
   },
   shoplv30: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv30.png',
    x: 255,
    y: -11,
    sc: 1
   },
   shoplv40: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv40.png',
    x: 268,
    y: 28,
    sc: 1
   },
   shoplv50: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv50.png',
    x: 260,
    y: 27,
    sc: 1
   },
   shoplv60: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv60.png',
    x: 261,
    y: -6,
    sc: 1
   },
   shoplv70: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv70.png',
    x: 256,
    y: 5,
    sc: 1
   },
   shoplv80: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv80.png',
    x: 270,
    y: 18,
    sc: 1
   },
   shoplv90: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv90.png',
    x: 270,
    y: 24,
    sc: 1
   },
   shoplv99: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv99.png',
    x: 270,
    y: 27,
    sc: 1
   }
  },
  wear: {
   lv10: {
    src: 'assets/body/gear/wear/sscriticalarmorlv10.png',
    x: 219,
    y: 72,
    sc: 1
   }
  },
  sword: {
   lv10: {
    src: 'assets/body/gear/critical/sscriticalsword.png',
    x: 30,
    y: 61,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/critical/sscriticalsword_lv1.png',
    x: 65,
    y: 38,
    sc: 1
   }
  },
  shield: {
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 361,
    y: 137,
    sc: 1
   }
  },
  foot: {
   lv10: {
    src: 'assets/body/gear/foot/sscriticalfootlv10.png',
    x: 144,
    y: 270,
    sc: 1
   }
  },
  garment: {
   lv10: {
    src: 'assets/body/gear/garment/sscriticalmanteaulv10.png',
    x: 166,
    y: 132,
    sc: 1
   }
  }
 }
};
const HERO_BODY_ORDER = {
 base: [
  'garment',
  'leg',
  'foot',
  'armor',
  'wear',
  'head',
  'helmet',
  'sword',
  'lefthand',
  'righthand',
  'shield'
 ],
 attack: [
  'shield',
  'leg',
  'foot',
  'garment',
  'armor',
  'wear',
  'head',
  'helmet',
  'sword',
  'lefthand',
  'righthand'
 ],
 block: [
  'garment',
  'leg',
  'foot',
  'armor',
  'wear',
  'head',
  'helmet',
  'sword',
  'lefthand',
  'righthand',
  'shield'
 ],
 critical: [
  'garment',
  'foot',
  'leg',
  'armor',
  'wear',
  'head',
  'sword',
  'helmet',
  'lefthand',
  'righthand',
  'shield'
 ]
};
const HERO_BODY_SRCS = [
 'assets/body/base/dbaseleg.png',
 'assets/body/base/dbasearmor.png',
 'assets/body/base/dbasehead.png',
 'assets/body/base/dbaselefthand.png',
 'assets/body/base/dbaserighthand.png',
 'assets/body/attack/dattackleg.png',
 'assets/body/attack/dattackarmor.png',
 'assets/body/attack/dattackhead.png',
 'assets/body/attack/dattacklefthand.png',
 'assets/body/attack/dattackrighthand.png',
 'assets/body/block/dblockleg.png',
 'assets/body/block/dblockarmor.png',
 'assets/body/block/dblockhead.png',
 'assets/body/block/dblocklefthand.png',
 'assets/body/block/dblockrighthand.png',
 'assets/body/critical/dcriticalleg.png',
 'assets/body/critical/dcriticalarmor.png',
 'assets/body/critical/dcriticalhead.png',
 'assets/body/critical/dcriticallefthand.png',
 'assets/body/critical/dcriticalrighthand.png',
 'assets/body/gear/helmet/hatssattacklv10.png',
 'assets/body/gear/helmet/boss/ssattackbosslv1.png',
 'assets/body/gear/helmet/boss/ssattackbosslv10.png',
 'assets/body/gear/helmet/boss/ssattackbosslv20.png',
 'assets/body/gear/helmet/shop/ssattackshoplv20.png',
 'assets/body/gear/helmet/boss/ssattackbosslv30.png',
 'assets/body/gear/helmet/boss/ssattackbosslv40.png',
 'assets/body/gear/helmet/boss/ssattackbosslv50.png',
 'assets/body/gear/helmet/boss/ssattackbosslv60.png',
 'assets/body/gear/helmet/boss/ssattackbosslv70.png',
 'assets/body/gear/helmet/boss/ssattackbosslv80.png',
 'assets/body/gear/helmet/boss/ssattackbosslv90.png',
 'assets/body/gear/helmet/boss/ssattackbosslv99.png',
 'assets/body/gear/helmet/shop/ssattackshoplv30.png',
 'assets/body/gear/helmet/shop/ssattackshoplv40.png',
 'assets/body/gear/helmet/shop/ssattackshoplv50.png',
 'assets/body/gear/helmet/shop/ssattackshoplv60.png',
 'assets/body/gear/helmet/shop/ssattackshoplv70.png',
 'assets/body/gear/helmet/shop/ssattackshoplv80.png',
 'assets/body/gear/helmet/shop/ssattackshoplv90.png',
 'assets/body/gear/helmet/shop/ssattackshoplv99.png',
 'assets/body/gear/wear/ssattackarmorlv10.png',
 'assets/body/gear/attack/ssattackswordlv10.png',
 'assets/body/gear/attack/ssattackshield.png',
 'assets/body/gear/foot/ssattackfootlv10.png',
 'assets/body/gear/garment/ssattackmanteaulv10.png',
 'assets/body/gear/helmet/hatbaseattacklv10.png',
 'assets/body/gear/helmet/boss/ssbasebosslv1.png',
 'assets/body/gear/helmet/boss/ssbasebosslv10.png',
 'assets/body/gear/helmet/boss/ssbasebosslv20.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv20.png',
 'assets/body/gear/helmet/boss/ssbasebosslv30.png',
 'assets/body/gear/helmet/boss/ssbasebosslv40.png',
 'assets/body/gear/helmet/boss/ssbasebosslv50.png',
 'assets/body/gear/helmet/boss/ssbasebosslv60.png',
 'assets/body/gear/helmet/boss/ssbasebosslv70.png',
 'assets/body/gear/helmet/boss/ssbasebosslv80.png',
 'assets/body/gear/helmet/boss/ssbasebosslv90.png',
 'assets/body/gear/helmet/boss/ssbasebosslv99.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv30.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv40.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv50.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv60.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv70.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv80.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv90.png',
 'assets/body/gear/helmet/shop/ssbaseshoplv99.png',
 'assets/body/gear/wear/ssbasearmorlv10.png',
 'assets/body/gear/base/ssbasesword.png',
 'assets/body/gear/shield/ssshield.png',
 'assets/body/gear/foot/ssbasefootlv10.png',
 'assets/body/gear/garment/ssbasemanteaulv10.png',
 'assets/body/gear/helmet/hatssblocklv10.png',
 'assets/body/gear/helmet/boss/ssblockbosslv1.png',
 'assets/body/gear/helmet/boss/ssblockbosslv10.png',
 'assets/body/gear/helmet/boss/ssblockbosslv20.png',
 'assets/body/gear/helmet/shop/ssblockshoplv20.png',
 'assets/body/gear/helmet/boss/ssblockbosslv30.png',
 'assets/body/gear/helmet/boss/ssblockbosslv40.png',
 'assets/body/gear/helmet/boss/ssblockbosslv50.png',
 'assets/body/gear/helmet/boss/ssblockbosslv60.png',
 'assets/body/gear/helmet/boss/ssblockbosslv70.png',
 'assets/body/gear/helmet/boss/ssblockbosslv80.png',
 'assets/body/gear/helmet/boss/ssblockbosslv90.png',
 'assets/body/gear/helmet/boss/ssblockbosslv99.png',
 'assets/body/gear/helmet/shop/ssblockshoplv30.png',
 'assets/body/gear/helmet/shop/ssblockshoplv40.png',
 'assets/body/gear/helmet/shop/ssblockshoplv50.png',
 'assets/body/gear/helmet/shop/ssblockshoplv60.png',
 'assets/body/gear/helmet/shop/ssblockshoplv70.png',
 'assets/body/gear/helmet/shop/ssblockshoplv80.png',
 'assets/body/gear/helmet/shop/ssblockshoplv90.png',
 'assets/body/gear/helmet/shop/ssblockshoplv99.png',
 'assets/body/gear/wear/ssblockarmorlv10.png',
 'assets/body/gear/block/ssblocksword.png',
 'assets/body/gear/foot/ssblockfootlv10.png',
 'assets/body/gear/garment/ssblockmanteaulv10.png',
 'assets/body/gear/helmet/hatsscriticallv10.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv1.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv10.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv20.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv20.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv30.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv40.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv50.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv60.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv70.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv80.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv90.png',
 'assets/body/gear/helmet/boss/sscriticalbosslv99.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv30.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv40.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv50.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv60.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv70.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv80.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv90.png',
 'assets/body/gear/helmet/shop/sscriticalshoplv99.png',
 'assets/body/gear/wear/sscriticalarmorlv10.png',
 'assets/body/gear/critical/sscriticalsword.png',
 'assets/body/gear/critical/sscriticalsword_lv1.png',
 'assets/body/gear/foot/sscriticalfootlv10.png',
 'assets/body/gear/garment/sscriticalmanteaulv10.png'
];
// The hero is drawn from the body animation tool's parts: base (idle), attack, block and critical poses.
// Worn gear is layered with the same rules as the tool. Each pose and gear set is composed once into a frame
// (cached), and the frame's feet point is the bottom of its leg and boot pixels, as the battle frames use.
// Positions and layer order come from the tool; the art is in assets/body/.
const HERO_BODY_SLOTS = ['helmet', 'wear', 'sword', 'shield', 'foot', 'garment'];
const HERO_BODY_SLOT_HIDES = { helmet: ['head'], wear: ['armor'], sword: ['lefthand'], foot: ['leg'] };

// One Image per file, started when this script loads
const heroBodyImgs = {};
function heroBodyImage(src) {
    if (!heroBodyImgs[src]) {
        const img = new Image();
        img.src = src;
        heroBodyImgs[src] = img;
    }
    return heroBodyImgs[src];
}
HERO_BODY_SRCS.forEach(heroBodyImage);
function heroBodyLoaded(img) { return img.complete && img.naturalWidth > 0; }

// The gear option worn in each slot. The tool has one sword, shield, armor, boots and cloak (lv10 art).
function heroBodyHelmet(hat) {
    if (!hat) return null;
    let key = null;
    for (const lv in HAT_BY_LEVEL) if (HAT_BY_LEVEL[lv].name === hat.name) key = 'shoplv' + lv;
    for (const lv in BOSS_HELMETS) if (BOSS_HELMETS[lv].name === hat.name) key = 'bosslv' + lv;
    return key && HERO_BODY_GEAR.attack.helmet[key] ? key : null;
}
function heroBodyLoadout() {
    const e = (typeof player !== 'undefined' && player.equipped) || {};
    return {
        helmet: heroBodyHelmet(e.hat),
        wear: e.armor ? 'lv10' : null,
        sword: e.weapon ? 'lv10' : null,
        shield: e.shield ? 'lv10' : null,
        foot: e.footgear ? 'lv10' : null,
        garment: e.garment ? 'lv10' : null,
    };
}

// The draw list for a pose, as the tool builds it: worn gear in its layer, hidden parts left out
function heroBodyItems(pose, loadout) {
    const P = HERO_BODY_POSES[pose];
    const hidden = new Set();
    for (const slot of HERO_BODY_SLOTS) {
        const opt = loadout[slot];
        if (opt && HERO_BODY_GEAR[pose][slot] && HERO_BODY_GEAR[pose][slot][opt]) {
            for (const pid of HERO_BODY_SLOT_HIDES[slot] || []) hidden.add(pid);
        }
    }
    const items = [];
    for (const id of HERO_BODY_ORDER[pose]) {
        if (HERO_BODY_SLOTS.includes(id)) {
            const opt = loadout[id];
            const g = opt && HERO_BODY_GEAR[pose][id] && HERO_BODY_GEAR[pose][id][opt];
            if (g) items.push({ id, ...g });
            continue;
        }
        if (hidden.has(id)) continue;
        const part = P.parts.find(p => p.id === id);
        if (part) items.push(part);
    }
    return items;
}

// Lowest opaque row of the feet layer: x = mean of its opaque pixels, y = the bottom edge of that row
function heroBodyFeet(ctx, W, H) {
    const data = ctx.getImageData(0, 0, W, H).data;
    for (let y = H - 1; y >= 0; y--) {
        let sum = 0, n = 0;
        for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 0) { sum += x; n++; }
        if (n) return { x: sum / n, y: y + 1 };
    }
    return { x: W / 2, y: H };
}

const heroBodyCache = {};
// A composed frame { src, w, h, fx, fy } for a pose and gear set, or null while its art is still loading
function heroBodyFrame(pose, loadout) {
    loadout = loadout || heroBodyLoadout();
    const key = pose + '|' + HERO_BODY_SLOTS.map(s => loadout[s] || '-').join(',');
    if (heroBodyCache[key]) return heroBodyCache[key];
    const drawn = [];
    for (const it of heroBodyItems(pose, loadout)) {
        const img = heroBodyImage(it.src);
        if (!heroBodyLoaded(img)) return null;
        const sc = it.sc || 1;
        drawn.push({ id: it.id, img, x: it.x, y: it.y, w: img.naturalWidth * sc, h: img.naturalHeight * sc });
    }
    if (!drawn.length) return null;
    const minX = Math.min(...drawn.map(d => d.x)), minY = Math.min(...drawn.map(d => d.y));
    const maxX = Math.max(...drawn.map(d => d.x + d.w)), maxY = Math.max(...drawn.map(d => d.y + d.h));
    const W = Math.ceil(maxX - minX), H = Math.ceil(maxY - minY);
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const feetCanvas = document.createElement('canvas');
    feetCanvas.width = W; feetCanvas.height = H;
    const ctx = canvas.getContext('2d');
    const fctx = feetCanvas.getContext('2d');
    for (const d of drawn) {
        ctx.drawImage(d.img, d.x - minX, d.y - minY, d.w, d.h);
        if (d.id === 'leg' || d.id === 'foot') fctx.drawImage(d.img, d.x - minX, d.y - minY, d.w, d.h);
    }
    const feet = heroBodyFeet(fctx, W, H);
    const frame = { src: canvas.toDataURL('image/png'), w: W, h: H, fx: feet.x, fy: feet.y };
    heroBodyCache[key] = frame;
    return frame;
}

// The battle hero's frames for the current gear. Dodge and dead use the base frame (the tool has no art for them).
function combatPose() {
    const L = heroBodyLoadout();
    const base = heroBodyFrame('base', L);
    return {
        IDLE: base,
        ATTACK: heroBodyFrame('attack', L),
        CRI: heroBodyFrame('critical', L),
        REACT: { block: heroBodyFrame('block', L), dodge: base },
    };
}

// Keeps the town, character and class-select heroes in step once their art has loaded
setInterval(() => { if (typeof syncHeroSprites === 'function') syncHeroSprites(); }, 500);
