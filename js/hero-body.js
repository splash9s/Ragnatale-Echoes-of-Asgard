// Generated from tools/body-animation/index.html (POSES, GEAR, LAYER_ORDER). Art: assets/body/.
const HERO_BODY_POSES = {
 base: {
  label: 'base',
  parts: [
   {
    id: 'leg',
    name: 'Leg',
    src: 'assets/body/base/dbaseleg.png',
    x: 192,
    y: 258,
    sc: 1
   },
   {
    id: 'armor',
    name: 'Armor',
    src: 'assets/body/base/dbasearmor.png',
    x: 170,
    y: 145,
    sc: 1
   },
   {
    id: 'head',
    name: 'Head',
    src: 'assets/body/base/dbasehead.png',
    x: 216,
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
    x: 353,
    y: 235,
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
    y: 123,
    sc: 1
   },
   {
    id: 'head',
    name: 'Head',
    src: 'assets/body/attack/dattackhead.png',
    x: 309,
    y: 52,
    sc: 1
   },
   {
    id: 'lefthand',
    name: 'Left hand',
    src: 'assets/body/attack/dattacklefthand.png',
    x: 160,
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
    y: 253,
    sc: 1
   },
   {
    id: 'armor',
    name: 'Armor',
    src: 'assets/body/block/dblockarmor.png',
    x: 188,
    y: 108,
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
    x: 388,
    y: 223,
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
    x: 97,
    y: 244,
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
    y: 51,
    sc: 1
   },
   {
    id: 'lefthand',
    name: 'Left hand',
    src: 'assets/body/critical/dcriticallefthand.png',
    x: 222,
    y: 66,
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
    y: 46,
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
    y: 34,
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
    y: 17,
    sc: 1
   },
   bosslv40: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv40.png',
    x: 320,
    y: 50,
    sc: 1
   },
   bosslv50: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv50.png',
    x: 323,
    y: 31,
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
    y: 1,
    sc: 1
   },
   bosslv80: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv80.png',
    x: 322,
    y: 31,
    sc: 1
   },
   bosslv90: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv90.png',
    x: 318,
    y: 50,
    sc: 1
   },
   bosslv99: {
    src: 'assets/body/gear/helmet/boss/ssattackbosslv99.png',
    x: 298,
    y: 11,
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
    x: 296,
    y: 11,
    sc: 1
   }
  },
  wear: {
   lv0: {
    src: 'assets/body/gear/wear/ssattackarmorlv0.png',
    x: 189,
    y: 116,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/wear/ssattackarmorlv1.png',
    x: 157,
    y: 133,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/wear/ssattackarmorlv10.png',
    x: 190,
    y: 126,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/wear/ssattackarmorlv20.png',
    x: 190,
    y: 136,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/wear/ssattackarmorlv30.png',
    x: 188,
    y: 123,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/wear/ssattackarmorlv40.png',
    x: 193,
    y: 121,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/wear/ssattackarmorlv50.png',
    x: 194,
    y: 98,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/wear/ssattackarmorlv60.png',
    x: 194,
    y: 121,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/wear/ssattackarmorlv70.png',
    x: 167,
    y: 125,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/wear/ssattackarmorlv80.png',
    x: 161,
    y: 119,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/wear/ssattackarmorlv90.png',
    x: 167,
    y: 123,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/wear/ssattackarmorlv99.png',
    x: 144,
    y: 110,
    sc: 1
   }
  },
  sword: {
   lv1: {
    src: 'assets/body/gear/attack/ssattackswordlv1.png',
    x: 27,
    y: 192,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/attack/ssattackswordlv10.png',
    x: 146,
    y: 173,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/attack/ssattackswordlv20.png',
    x: 27,
    y: 196,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/attack/ssattackswordlv30.png',
    x: 34,
    y: 178,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/attack/ssattackswordlv40.png',
    x: 31,
    y: 163,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/attack/ssattackswordlv50.png',
    x: 31,
    y: 164,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/attack/ssattackswordlv60.png',
    x: 31,
    y: 161,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/attack/ssattackswordlv70.png',
    x: 31,
    y: 164,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/attack/ssattackswordlv80.png',
    x: 18,
    y: 168,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/attack/ssattackswordlv90.png',
    x: 28,
    y: 187,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/attack/ssattackswordlv99.png',
    x: 31,
    y: 167,
    sc: 1
   }
  },
  shield: {
   lv1: {
    src: 'assets/body/gear/shield/ssattackshieldlv1.png',
    x: 418,
    y: 153,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 408,
    y: 139,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/shield/ssattackshieldlv20.png',
    x: 401,
    y: 151,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/shield/ssattackshieldlv30.png',
    x: 409,
    y: 159,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/shield/ssattackshieldlv40.png',
    x: 407,
    y: 154,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/shield/ssattackshieldlv50.png',
    x: 401,
    y: 159,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/shield/ssattackshieldlv60.png',
    x: 406,
    y: 159,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/shield/ssattackshieldlv70.png',
    x: 380,
    y: 159,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/shield/ssattackshieldlv80.png',
    x: 399,
    y: 159,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/shield/ssattackshieldlv90.png',
    x: 400,
    y: 159,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/shield/ssattackshieldlv99.png',
    x: 376,
    y: 142,
    sc: 1
   }
  },
  foot: {
   lv0: {
    src: 'assets/body/gear/foot/ssattackfootlv0.png',
    x: 172,
    y: 249,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/foot/ssattackfootlv10.png',
    x: 171,
    y: 250,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/foot/ssattackfootlv1.png',
    x: 171,
    y: 253,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/foot/ssattackfootlv20.png',
    x: 171,
    y: 250,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/foot/ssattackfootlv30.png',
    x: 171,
    y: 253,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/foot/ssattackfootlv40.png',
    x: 171,
    y: 253,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/foot/ssattackfootlv50.png',
    x: 171,
    y: 253,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/foot/ssattackfootlv60.png',
    x: 171,
    y: 247,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/foot/ssattackfootlv70.png',
    x: 171,
    y: 250,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/foot/ssattackfootlv80.png',
    x: 164,
    y: 253,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/foot/ssattackfootlv90.png',
    x: 161,
    y: 253,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/foot/ssattackfootlv99.png',
    x: 155,
    y: 231,
    sc: 1
   },
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
    x: 195,
    y: 14,
    sc: 1
   },
   shoplv30: {
    src: 'assets/body/gear/helmet/shop/ssbaseshoplv30.png',
    x: 196,
    y: 8,
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
    x: 201,
    y: 13,
    sc: 1
   }
  },
  wear: {
   lv0: {
    src: 'assets/body/gear/wear/ssbasearmorlv0.png',
    x: 164,
    y: 132,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/wear/ssbasearmorlv1.png',
    x: 149,
    y: 142,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/wear/ssbasearmorlv10.png',
    x: 165,
    y: 147,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/wear/ssbasearmorlv20.png',
    x: 146,
    y: 151,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/wear/ssbasearmorlv30.png',
    x: 170,
    y: 142,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/wear/ssbasearmorlv40.png',
    x: 168,
    y: 138,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/wear/ssbasearmorlv50.png',
    x: 163,
    y: 122,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/wear/ssbasearmorlv60.png',
    x: 168,
    y: 135,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/wear/ssbasearmorlv70.png',
    x: 146,
    y: 136,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/wear/ssbasearmorlv80.png',
    x: 142,
    y: 144,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/wear/ssbasearmorlv90.png',
    x: 148,
    y: 134,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/wear/ssbasearmorlv99.png',
    x: 130,
    y: 122,
    sc: 1
   }
  },
  sword: {
   lv1: {
    src: 'assets/body/gear/base/ssbaseswordlv1.png',
    x: 42,
    y: 148,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/base/ssbasesword.png',
    x: 18,
    y: 241,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/base/ssbaseswordlv20.png',
    x: 34,
    y: 145,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/base/ssbaseswordlv30.png',
    x: 37,
    y: 139,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/base/ssbaseswordlv40.png',
    x: 34,
    y: 146,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/base/ssbaseswordlv50.png',
    x: 40,
    y: 136,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/base/ssbaseswordlv60.png',
    x: 40,
    y: 136,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/base/ssbaseswordlv70.png',
    x: 40,
    y: 136,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/base/ssbaseswordlv80.png',
    x: 32,
    y: 126,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/base/ssbaseswordlv90.png',
    x: 40,
    y: 136,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/base/ssbaseswordlv99.png',
    x: 40,
    y: 136,
    sc: 1
   }
  },
  shield: {
   lv1: {
    src: 'assets/body/gear/shield/ssbaseshieldlv1.png',
    x: 326,
    y: 155,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 352,
    y: 145,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/shield/ssbaseshieldlv20.png',
    x: 325,
    y: 138,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/shield/ssbaseshieldlv30.png',
    x: 317,
    y: 150,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/shield/ssbaseshieldlv40.png',
    x: 317,
    y: 150,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/shield/ssbaseshieldlv50.png',
    x: 319,
    y: 149,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/shield/ssbaseshieldlv60.png',
    x: 318,
    y: 149,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/shield/ssbaseshieldlv70.png',
    x: 312,
    y: 149,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/shield/ssbaseshieldlv80.png',
    x: 310,
    y: 149,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/shield/ssbaseshieldlv90.png',
    x: 317,
    y: 149,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/shield/ssbaseshieldlv99.png',
    x: 303,
    y: 130,
    sc: 1
   }
  },
  foot: {
   lv0: {
    src: 'assets/body/gear/foot/ssbasefootlv0.png',
    x: 192,
    y: 253,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/foot/ssbasefootlv10.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/foot/ssbasefootlv1.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/foot/ssbasefootlv20.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/foot/ssbasefootlv30.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/foot/ssbasefootlv40.png',
    x: 187,
    y: 255,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/foot/ssbasefootlv50.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/foot/ssbasefootlv60.png',
    x: 190,
    y: 248,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/foot/ssbasefootlv70.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/foot/ssbasefootlv80.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/foot/ssbasefootlv90.png',
    x: 190,
    y: 256,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/foot/ssbasefootlv99.png',
    x: 172,
    y: 240,
    sc: 1
   },
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
    y: 15,
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
    x: 238,
    y: -1,
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
    y: 35,
    sc: 1
   },
   shoplv99: {
    src: 'assets/body/gear/helmet/shop/ssblockshoplv99.png',
    x: 238,
    y: 13,
    sc: 1
   }
  },
  wear: {
   lv0: {
    src: 'assets/body/gear/wear/ssblockarmorlv0.png',
    x: 160,
    y: 127,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/wear/ssblockarmorlv1.png',
    x: 165,
    y: 139,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/wear/ssblockarmorlv10.png',
    x: 165,
    y: 134,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/wear/ssblockarmorlv20.png',
    x: 153,
    y: 139,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/wear/ssblockarmorlv30.png',
    x: 168,
    y: 132,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/wear/ssblockarmorlv40.png',
    x: 170,
    y: 129,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/wear/ssblockarmorlv50.png',
    x: 168,
    y: 116,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/wear/ssblockarmorlv60.png',
    x: 168,
    y: 116,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/wear/ssblockarmorlv70.png',
    x: 153,
    y: 132,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/wear/ssblockarmorlv80.png',
    x: 155,
    y: 121,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/wear/ssblockarmorlv90.png',
    x: 151,
    y: 129,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/wear/ssblockarmorlv99.png',
    x: 137,
    y: 119,
    sc: 1
   }
  },
  sword: {
   lv1: {
    src: 'assets/body/gear/block/ssblockswordlv1.png',
    x: 36,
    y: 215,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/block/ssblocksword.png',
    x: 120,
    y: 212,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/block/ssblockswordlv20.png',
    x: 27,
    y: 215,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/block/ssblockswordlv30.png',
    x: 34,
    y: 218,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/block/ssblockswordlv40.png',
    x: 31,
    y: 177,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/block/ssblockswordlv50.png',
    x: 34,
    y: 174,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/block/ssblockswordlv60.png',
    x: 34,
    y: 177,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/block/ssblockswordlv70.png',
    x: 34,
    y: 177,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/block/ssblockswordlv80.png',
    x: 25,
    y: 180,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/block/ssblockswordlv90.png',
    x: 28,
    y: 212,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/block/ssblockswordlv99.png',
    x: 37,
    y: 177,
    sc: 1
   }
  },
  shield: {
   lv1: {
    src: 'assets/body/gear/shield/ssblockshieldlv1.png',
    x: 338,
    y: 142,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 363,
    y: 138,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/shield/ssblockshieldlv20.png',
    x: 345,
    y: 136,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/shield/ssblockshieldlv30.png',
    x: 340,
    y: 143,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/shield/ssblockshieldlv40.png',
    x: 339,
    y: 143,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/shield/ssblockshieldlv50.png',
    x: 338,
    y: 144,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/shield/ssblockshieldlv60.png',
    x: 338,
    y: 144,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/shield/ssblockshieldlv70.png',
    x: 338,
    y: 144,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/shield/ssblockshieldlv80.png',
    x: 338,
    y: 144,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/shield/ssblockshieldlv90.png',
    x: 338,
    y: 144,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/shield/ssblockshieldlv99.png',
    x: 322,
    y: 128,
    sc: 1
   }
  },
  foot: {
   lv0: {
    src: 'assets/body/gear/foot/ssblockfootlv0.png',
    x: 158,
    y: 250,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/foot/ssblockfootlv10.png',
    x: 162,
    y: 263,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/foot/ssblockfootlv1.png',
    x: 162,
    y: 261,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/foot/ssblockfootlv20.png',
    x: 162,
    y: 268,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/foot/ssblockfootlv30.png',
    x: 160,
    y: 262,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/foot/ssblockfootlv40.png',
    x: 162,
    y: 262,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/foot/ssblockfootlv50.png',
    x: 162,
    y: 268,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/foot/ssblockfootlv60.png',
    x: 162,
    y: 268,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/foot/ssblockfootlv70.png',
    x: 162,
    y: 268,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/foot/ssblockfootlv80.png',
    x: 162,
    y: 268,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/foot/ssblockfootlv90.png',
    x: 162,
    y: 268,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/foot/ssblockfootlv99.png',
    x: 146,
    y: 237,
    sc: 1
   },
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
    y: 31,
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
    y: 26,
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
    y: 7,
    sc: 1
   },
   bosslv40: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv40.png',
    x: 267,
    y: 46,
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
    y: 14,
    sc: 1
   },
   bosslv90: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv90.png',
    x: 266,
    y: 43,
    sc: 1
   },
   bosslv99: {
    src: 'assets/body/gear/helmet/boss/sscriticalbosslv99.png',
    x: 251,
    y: 11,
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
    y: 37,
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
    y: 26,
    sc: 1
   },
   shoplv90: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv90.png',
    x: 264,
    y: 38,
    sc: 1
   },
   shoplv99: {
    src: 'assets/body/gear/helmet/shop/sscriticalshoplv99.png',
    x: 252,
    y: 17,
    sc: 1
   }
  },
  wear: {
   lv0: {
    src: 'assets/body/gear/wear/sscriticalarmorlv0.png',
    x: 203,
    y: 85,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/wear/sscriticalarmorlv1.png',
    x: 215,
    y: 56,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/wear/sscriticalarmorlv10.png',
    x: 202,
    y: 70,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/wear/sscriticalarmorlv20.png',
    x: 209,
    y: 84,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/wear/sscriticalarmorlv30.png',
    x: 212,
    y: 93,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/wear/sscriticalarmorlv40.png',
    x: 206,
    y: 95,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/wear/sscriticalarmorlv50.png',
    x: 203,
    y: 92,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/wear/sscriticalarmorlv60.png',
    x: 205,
    y: 88,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/wear/sscriticalarmorlv70.png',
    x: 209,
    y: 60,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/wear/sscriticalarmorlv80.png',
    x: 205,
    y: 53,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/wear/sscriticalarmorlv90.png',
    x: 211,
    y: 53,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/wear/sscriticalarmorlv99.png',
    x: 192,
    y: 45,
    sc: 1
   }
  },
  sword: {
   lv1: {
    src: 'assets/body/gear/critical/sscriticalswordlv1.png',
    x: 87,
    y: 55,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/critical/sscriticalsword.png',
    x: 25,
    y: 65,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/critical/sscriticalswordlv20.png',
    x: 85,
    y: 48,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/critical/sscriticalswordlv30.png',
    x: 89,
    y: 57,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/critical/sscriticalswordlv40.png',
    x: 92,
    y: 60,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/critical/sscriticalswordlv50.png',
    x: 92,
    y: 52,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/critical/sscriticalswordlv60.png',
    x: 85,
    y: 53,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/critical/sscriticalswordlv70.png',
    x: 89,
    y: 54,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/critical/sscriticalswordlv80.png',
    x: 54,
    y: 53,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/critical/sscriticalswordlv90.png',
    x: 89,
    y: 53,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/critical/sscriticalswordlv99.png',
    x: 86,
    y: 56,
    sc: 1
   }
  },
  shield: {
   lv1: {
    src: 'assets/body/gear/shield/sscriticalshieldlv1.png',
    x: 343,
    y: 148,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/shield/ssshield.png',
    x: 361,
    y: 137,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/shield/sscriticalshieldlv20.png',
    x: 354,
    y: 140,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/shield/sscriticalshieldlv30.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/shield/sscriticalshieldlv40.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/shield/sscriticalshieldlv50.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/shield/sscriticalshieldlv60.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/shield/sscriticalshieldlv70.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/shield/sscriticalshieldlv80.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/shield/sscriticalshieldlv90.png',
    x: 352,
    y: 150,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/shield/sscriticalshieldlv99.png',
    x: 336,
    y: 132,
    sc: 1
   }
  },
  foot: {
   lv0: {
    src: 'assets/body/gear/foot/sscriticalfootlv0.png',
    x: 159,
    y: 243,
    sc: 1
   },
   lv10: {
    src: 'assets/body/gear/foot/sscriticalfootlv10.png',
    x: 144,
    y: 268,
    sc: 1
   },
   lv1: {
    src: 'assets/body/gear/foot/sscriticalfootlv1.png',
    x: 159,
    y: 256,
    sc: 1
   },
   lv20: {
    src: 'assets/body/gear/foot/sscriticalfootlv20.png',
    x: 161,
    y: 259,
    sc: 1
   },
   lv30: {
    src: 'assets/body/gear/foot/sscriticalfootlv30.png',
    x: 155,
    y: 261,
    sc: 1
   },
   lv40: {
    src: 'assets/body/gear/foot/sscriticalfootlv40.png',
    x: 160,
    y: 254,
    sc: 1
   },
   lv50: {
    src: 'assets/body/gear/foot/sscriticalfootlv50.png',
    x: 161,
    y: 256,
    sc: 1
   },
   lv60: {
    src: 'assets/body/gear/foot/sscriticalfootlv60.png',
    x: 161,
    y: 256,
    sc: 1
   },
   lv70: {
    src: 'assets/body/gear/foot/sscriticalfootlv70.png',
    x: 161,
    y: 256,
    sc: 1
   },
   lv80: {
    src: 'assets/body/gear/foot/sscriticalfootlv80.png',
    x: 161,
    y: 256,
    sc: 1
   },
   lv90: {
    src: 'assets/body/gear/foot/sscriticalfootlv90.png',
    x: 161,
    y: 256,
    sc: 1
   },
   lv99: {
    src: 'assets/body/gear/foot/sscriticalfootlv99.png',
    x: 145,
    y: 240,
    sc: 1
   },
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
  'shield',
 ],
 attack: [
  'leg',
  'foot',
  'garment',
  'armor',
  'wear',
  'head',
  'helmet',
  'shield',
  'sword',
  'lefthand',
  'righthand',
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
  'shield',
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
  'shield',
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
 'assets/body/gear/garment/sscriticalmanteaulv10.png',
 'assets/body/gear/wear/ssattackarmorlv0.png',
 'assets/body/gear/wear/ssbasearmorlv0.png',
 'assets/body/gear/wear/ssblockarmorlv0.png',
 'assets/body/gear/wear/sscriticalarmorlv0.png',
 'assets/body/gear/foot/ssattackfootlv0.png',
 'assets/body/gear/foot/ssbasefootlv0.png',
 'assets/body/gear/foot/ssblockfootlv0.png',
 'assets/body/gear/foot/sscriticalfootlv0.png',
 'assets/body/gear/shield/ssattackshieldlv1.png',
 'assets/body/gear/shield/ssbaseshieldlv1.png',
 'assets/body/gear/shield/ssblockshieldlv1.png',
 'assets/body/gear/shield/sscriticalshieldlv1.png',
 'assets/body/gear/shield/ssattackshieldlv20.png',
 'assets/body/gear/shield/ssbaseshieldlv20.png',
 'assets/body/gear/shield/ssblockshieldlv20.png',
 'assets/body/gear/shield/sscriticalshieldlv20.png',
 'assets/body/gear/shield/ssattackshieldlv30.png',
 'assets/body/gear/shield/ssbaseshieldlv30.png',
 'assets/body/gear/shield/ssblockshieldlv30.png',
 'assets/body/gear/shield/sscriticalshieldlv30.png',
 'assets/body/gear/shield/ssattackshieldlv40.png',
 'assets/body/gear/shield/ssbaseshieldlv40.png',
 'assets/body/gear/shield/ssblockshieldlv40.png',
 'assets/body/gear/shield/sscriticalshieldlv40.png',
 'assets/body/gear/shield/ssattackshieldlv50.png',
 'assets/body/gear/shield/ssbaseshieldlv50.png',
 'assets/body/gear/shield/ssblockshieldlv50.png',
 'assets/body/gear/shield/sscriticalshieldlv50.png',
 'assets/body/gear/wear/ssattackarmorlv20.png',
 'assets/body/gear/wear/ssbasearmorlv20.png',
 'assets/body/gear/wear/ssblockarmorlv20.png',
 'assets/body/gear/wear/sscriticalarmorlv20.png',
 'assets/body/gear/wear/ssattackarmorlv30.png',
 'assets/body/gear/wear/ssbasearmorlv30.png',
 'assets/body/gear/wear/ssblockarmorlv30.png',
 'assets/body/gear/wear/sscriticalarmorlv30.png',
 'assets/body/gear/wear/ssattackarmorlv40.png',
 'assets/body/gear/wear/ssbasearmorlv40.png',
 'assets/body/gear/wear/ssblockarmorlv40.png',
 'assets/body/gear/wear/sscriticalarmorlv40.png',
 'assets/body/gear/wear/ssattackarmorlv50.png',
 'assets/body/gear/wear/ssbasearmorlv50.png',
 'assets/body/gear/wear/ssblockarmorlv50.png',
 'assets/body/gear/wear/sscriticalarmorlv50.png',
 'assets/body/gear/wear/ssattackarmorlv1.png',
 'assets/body/gear/wear/ssbasearmorlv1.png',
 'assets/body/gear/wear/ssblockarmorlv1.png',
 'assets/body/gear/wear/sscriticalarmorlv1.png',
 'assets/body/gear/foot/ssbasefootlv1.png',
 'assets/body/gear/foot/ssattackfootlv1.png',
 'assets/body/gear/foot/ssblockfootlv1.png',
 'assets/body/gear/foot/sscriticalfootlv1.png',
 'assets/body/gear/foot/ssbasefootlv20.png',
 'assets/body/gear/foot/ssattackfootlv20.png',
 'assets/body/gear/foot/ssblockfootlv20.png',
 'assets/body/gear/foot/sscriticalfootlv20.png',
 'assets/body/gear/foot/ssbasefootlv30.png',
 'assets/body/gear/foot/ssattackfootlv30.png',
 'assets/body/gear/foot/ssblockfootlv30.png',
 'assets/body/gear/foot/sscriticalfootlv30.png',
 'assets/body/gear/foot/ssbasefootlv40.png',
 'assets/body/gear/foot/ssattackfootlv40.png',
 'assets/body/gear/foot/ssblockfootlv40.png',
 'assets/body/gear/foot/sscriticalfootlv40.png',
 'assets/body/gear/foot/ssbasefootlv50.png',
 'assets/body/gear/foot/ssattackfootlv50.png',
 'assets/body/gear/foot/ssblockfootlv50.png',
 'assets/body/gear/foot/sscriticalfootlv50.png',
 'assets/body/gear/attack/ssattackswordlv1.png',
 'assets/body/gear/base/ssbaseswordlv1.png',
 'assets/body/gear/block/ssblockswordlv1.png',
 'assets/body/gear/critical/sscriticalswordlv1.png',
 'assets/body/gear/attack/ssattackswordlv20.png',
 'assets/body/gear/base/ssbaseswordlv20.png',
 'assets/body/gear/block/ssblockswordlv20.png',
 'assets/body/gear/critical/sscriticalswordlv20.png',
 'assets/body/gear/attack/ssattackswordlv30.png',
 'assets/body/gear/base/ssbaseswordlv30.png',
 'assets/body/gear/block/ssblockswordlv30.png',
 'assets/body/gear/critical/sscriticalswordlv30.png',
 'assets/body/gear/attack/ssattackswordlv40.png',
 'assets/body/gear/base/ssbaseswordlv40.png',
 'assets/body/gear/block/ssblockswordlv40.png',
 'assets/body/gear/critical/sscriticalswordlv40.png',
 'assets/body/gear/attack/ssattackswordlv50.png',
 'assets/body/gear/base/ssbaseswordlv50.png',
 'assets/body/gear/block/ssblockswordlv50.png',
 'assets/body/gear/critical/sscriticalswordlv50.png',
 'assets/body/gear/wear/ssattackarmorlv60.png',
 'assets/body/gear/foot/ssattackfootlv60.png',
 'assets/body/gear/shield/ssattackshieldlv60.png',
 'assets/body/gear/attack/ssattackswordlv60.png',
 'assets/body/gear/wear/ssbasearmorlv60.png',
 'assets/body/gear/foot/ssbasefootlv60.png',
 'assets/body/gear/shield/ssbaseshieldlv60.png',
 'assets/body/gear/base/ssbaseswordlv60.png',
 'assets/body/gear/wear/ssblockarmorlv60.png',
 'assets/body/gear/foot/ssblockfootlv60.png',
 'assets/body/gear/shield/ssblockshieldlv60.png',
 'assets/body/gear/block/ssblockswordlv60.png',
 'assets/body/gear/wear/sscriticalarmorlv60.png',
 'assets/body/gear/foot/sscriticalfootlv60.png',
 'assets/body/gear/shield/sscriticalshieldlv60.png',
 'assets/body/gear/critical/sscriticalswordlv60.png',
 'assets/body/gear/wear/ssattackarmorlv70.png',
 'assets/body/gear/foot/ssattackfootlv70.png',
 'assets/body/gear/shield/ssattackshieldlv70.png',
 'assets/body/gear/attack/ssattackswordlv70.png',
 'assets/body/gear/wear/ssbasearmorlv70.png',
 'assets/body/gear/foot/ssbasefootlv70.png',
 'assets/body/gear/shield/ssbaseshieldlv70.png',
 'assets/body/gear/base/ssbaseswordlv70.png',
 'assets/body/gear/wear/ssblockarmorlv70.png',
 'assets/body/gear/foot/ssblockfootlv70.png',
 'assets/body/gear/shield/ssblockshieldlv70.png',
 'assets/body/gear/block/ssblockswordlv70.png',
 'assets/body/gear/wear/sscriticalarmorlv70.png',
 'assets/body/gear/foot/sscriticalfootlv70.png',
 'assets/body/gear/shield/sscriticalshieldlv70.png',
 'assets/body/gear/critical/sscriticalswordlv70.png',
 'assets/body/gear/wear/ssattackarmorlv80.png',
 'assets/body/gear/foot/ssattackfootlv80.png',
 'assets/body/gear/shield/ssattackshieldlv80.png',
 'assets/body/gear/attack/ssattackswordlv80.png',
 'assets/body/gear/wear/ssbasearmorlv80.png',
 'assets/body/gear/foot/ssbasefootlv80.png',
 'assets/body/gear/shield/ssbaseshieldlv80.png',
 'assets/body/gear/base/ssbaseswordlv80.png',
 'assets/body/gear/wear/ssblockarmorlv80.png',
 'assets/body/gear/foot/ssblockfootlv80.png',
 'assets/body/gear/shield/ssblockshieldlv80.png',
 'assets/body/gear/block/ssblockswordlv80.png',
 'assets/body/gear/wear/sscriticalarmorlv80.png',
 'assets/body/gear/foot/sscriticalfootlv80.png',
 'assets/body/gear/shield/sscriticalshieldlv80.png',
 'assets/body/gear/critical/sscriticalswordlv80.png',
 'assets/body/gear/wear/ssattackarmorlv90.png',
 'assets/body/gear/foot/ssattackfootlv90.png',
 'assets/body/gear/shield/ssattackshieldlv90.png',
 'assets/body/gear/attack/ssattackswordlv90.png',
 'assets/body/gear/wear/ssbasearmorlv90.png',
 'assets/body/gear/foot/ssbasefootlv90.png',
 'assets/body/gear/shield/ssbaseshieldlv90.png',
 'assets/body/gear/base/ssbaseswordlv90.png',
 'assets/body/gear/wear/ssblockarmorlv90.png',
 'assets/body/gear/foot/ssblockfootlv90.png',
 'assets/body/gear/shield/ssblockshieldlv90.png',
 'assets/body/gear/block/ssblockswordlv90.png',
 'assets/body/gear/wear/sscriticalarmorlv90.png',
 'assets/body/gear/foot/sscriticalfootlv90.png',
 'assets/body/gear/shield/sscriticalshieldlv90.png',
 'assets/body/gear/critical/sscriticalswordlv90.png',
 'assets/body/gear/wear/ssattackarmorlv99.png',
 'assets/body/gear/foot/ssattackfootlv99.png',
 'assets/body/gear/shield/ssattackshieldlv99.png',
 'assets/body/gear/attack/ssattackswordlv99.png',
 'assets/body/gear/wear/ssbasearmorlv99.png',
 'assets/body/gear/foot/ssbasefootlv99.png',
 'assets/body/gear/shield/ssbaseshieldlv99.png',
 'assets/body/gear/base/ssbaseswordlv99.png',
 'assets/body/gear/wear/ssblockarmorlv99.png',
 'assets/body/gear/foot/ssblockfootlv99.png',
 'assets/body/gear/shield/ssblockshieldlv99.png',
 'assets/body/gear/block/ssblockswordlv99.png',
 'assets/body/gear/wear/sscriticalarmorlv99.png',
 'assets/body/gear/foot/sscriticalfootlv99.png',
 'assets/body/gear/shield/sscriticalshieldlv99.png',
 'assets/body/gear/critical/sscriticalswordlv99.png'
];
// Set 2 poses (generated from tools/body-animation): attack02 and critical02 follow attack and critical,
// fall is the dead pose. Art is WebP in assets/body/.
Object.assign(HERO_BODY_POSES, {"attack02": {"label": "attack02", "parts": [{"id": "leg", "name": "Leg", "src": "assets/body/attack02/dattack02leg.webp", "x": 65.7, "y": 224, "sc": 1}, {"id": "armor", "name": "Armor", "src": "assets/body/attack02/dattack02armor.webp", "x": 104.7, "y": 110, "sc": 1}, {"id": "head", "name": "Head", "src": "assets/body/attack02/dattack02head.webp", "x": 182.2, "y": 35, "sc": 1}]}, "fall": {"label": "fall", "parts": [{"id": "leg", "name": "Leg", "src": "assets/body/fall/dfallleg.webp", "x": 228.7, "y": 187, "sc": 1}, {"id": "armor", "name": "Armor", "src": "assets/body/fall/dfallarmor.webp", "x": 112.7, "y": 75, "sc": 1}, {"id": "head", "name": "Head", "src": "assets/body/fall/dfallhead.webp", "x": 106.7, "y": 76, "sc": 1}]}, "critical02": {"label": "critical02", "parts": [{"id": "leg", "name": "Leg", "src": "assets/body/critical02/dcritical02leg.webp", "x": 14.7, "y": 242.5, "sc": 1}, {"id": "armor", "name": "Armor", "src": "assets/body/critical02/dcritical02armor.webp", "x": 62.7, "y": 137.5, "sc": 1}, {"id": "head", "name": "Head", "src": "assets/body/critical02/dcritical02head.webp", "x": 142.2, "y": 51, "sc": 1}]}});
Object.assign(HERO_BODY_GEAR, {"attack02": {"helmet": {"bosslv1": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv1_boss_attack02.webp", "x": 180.2, "y": 5.5, "sc": 1}, "bosslv10": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv10_hatbosslv10_attack02.webp", "x": 170.2, "y": -7.5, "sc": 1}, "shoplv10": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv10_shophelmet_attack02.webp", "x": 171.7, "y": 18.5, "sc": 1}, "bosslv20": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv20_boss_attack02.webp", "x": 174.7, "y": -7.5, "sc": 1}, "shoplv20": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv20_shop_attack02.webp", "x": 179.7, "y": 1.5, "sc": 1}, "bosslv30": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv30_boss_attack02.webp", "x": 172.2, "y": 1.5, "sc": 1}, "shoplv30": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv30_shop_attack02.webp", "x": 160.2, "y": -7.5, "sc": 1}, "bosslv40": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv40_boss_attack02.webp", "x": 178.7, "y": 20.5, "sc": 1}, "shoplv40": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv40_shop_attack02.webp", "x": 181.2, "y": 2.5, "sc": 1}, "bosslv50": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv50_boss_attack02.webp", "x": 172.2, "y": 8.5, "sc": 1}, "shoplv50": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv50_shop_attack02.webp", "x": 168.2, "y": 13.5, "sc": 1}, "bosslv60": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv60_boss_attack02.webp", "x": 179.7, "y": -7.5, "sc": 1}, "shoplv60": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv60_shop_attack02.webp", "x": 169.7, "y": -7.5, "sc": 1}, "bosslv70": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv70_boss_attack02.webp", "x": 160.2, "y": -7.5, "sc": 1}, "shoplv70": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv70_shop_attack02.webp", "x": 167.2, "y": -7.5, "sc": 1}, "bosslv80": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv80_boss_attack02.webp", "x": 170.2, "y": -7.5, "sc": 1}, "shoplv80": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv80_shop_attack02.webp", "x": 183.2, "y": -2, "sc": 1}, "bosslv90": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv90_boss_attack02.webp", "x": 183.2, "y": 10, "sc": 1}, "shoplv90": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv90_shop_attack02.webp", "x": 182.2, "y": 25.5, "sc": 1}, "bosslv99": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv99_boss_attack02.webp", "x": 183.2, "y": 15.5, "sc": 1}, "shoplv99": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv99_shop_attack02.webp", "x": 181.2, "y": 13.5, "sc": 1}}, "wear": {"lv0": {"src": "assets/body/gear/wear/set2/set2_lv0_attack02.webp", "x": 104.7, "y": 110, "sc": 1}, "lv1": {"src": "assets/body/gear/wear/set2/set2_lv1_attack02.webp", "x": 107.7, "y": 112, "sc": 1}, "lv10": {"src": "assets/body/gear/wear/set2/set2_lv10_attack02.webp", "x": 107.7, "y": 117, "sc": 1}, "lv20": {"src": "assets/body/gear/wear/set2/set2_lv20_attack02.webp", "x": 108.2, "y": 117, "sc": 1}, "lv30": {"src": "assets/body/gear/wear/set2/set2_lv30_attack02.webp", "x": 105.2, "y": 111, "sc": 1}, "lv40": {"src": "assets/body/gear/wear/set2/set2_lv40_attack02.webp", "x": 107.7, "y": 116.5, "sc": 1}, "lv50": {"src": "assets/body/gear/wear/set2/set2_lv50_attack02.webp", "x": 109.2, "y": 82, "sc": 1}, "lv60": {"src": "assets/body/gear/wear/set2/set2_lv60_attack02.webp", "x": 105.7, "y": 102, "sc": 1}, "lv70": {"src": "assets/body/gear/wear/set2/set2_lv70_attack02.webp", "x": 106.2, "y": 112.5, "sc": 1}, "lv80": {"src": "assets/body/gear/wear/set2/set2_lv80_attack02.webp", "x": 107.7, "y": 103.5, "sc": 1}, "lv90": {"src": "assets/body/gear/wear/set2/set2_lv90_attack02.webp", "x": 107.7, "y": 110.5, "sc": 1}, "lv99": {"src": "assets/body/gear/wear/set2/set2_lv99_attack02.webp", "x": 105.7, "y": 110.5, "sc": 1}}, "sword": {"lv1": {"src": "assets/body/gear/sword/set2/sword_set2_lv1_attack02.webp", "x": 298.7, "y": 114, "sc": 1}, "lv10": {"src": "assets/body/gear/sword/set2/sword_set2_lv10_attack02.webp", "x": 274.2, "y": 113, "sc": 1}, "lv20": {"src": "assets/body/gear/sword/set2/sword_set2_lv20_attack02.webp", "x": 279.2, "y": 103, "sc": 1}, "lv30": {"src": "assets/body/gear/sword/set2/sword_set2_lv30_attack02.webp", "x": 282.2, "y": 113, "sc": 1}, "lv40": {"src": "assets/body/gear/sword/set2/sword_set2_lv40_attack02.webp", "x": 281.7, "y": 113, "sc": 1}, "lv50": {"src": "assets/body/gear/sword/set2/sword_set2_lv50_attack02.webp", "x": 279.2, "y": 113, "sc": 1}, "lv60": {"src": "assets/body/gear/sword/set2/sword_set2_lv60_attack02.webp", "x": 301.2, "y": 116.5, "sc": 1}, "lv70": {"src": "assets/body/gear/sword/set2/sword_set2_lv70_attack02.webp", "x": 276.7, "y": 113.5, "sc": 1}, "lv80": {"src": "assets/body/gear/sword/set2/sword_set2_lv80_attack02.webp", "x": 277.2, "y": 105.5, "sc": 1}, "lv90": {"src": "assets/body/gear/sword/set2/sword_set2_lv90_attack02.webp", "x": 276.7, "y": 113, "sc": 1}, "lv99": {"src": "assets/body/gear/sword/set2/sword_set2_lv99_attack02.webp", "x": 281.7, "y": 113.5, "sc": 1}}, "shield": {"lv1": {"src": "assets/body/gear/shield/set2/shield_set2_lv1_attack02.webp", "x": 57.7, "y": 111, "sc": 1}, "lv10": {"src": "assets/body/gear/shield/set2/shield_set2_lv10_attack02.webp", "x": 78.2, "y": 104, "sc": 1}, "lv20": {"src": "assets/body/gear/shield/set2/shield_set2_lv20_attack02.webp", "x": 80.7, "y": 104, "sc": 1}, "lv30": {"src": "assets/body/gear/shield/set2/shield_set2_lv30_attack02.webp", "x": 61.2, "y": 117, "sc": 1}, "lv40": {"src": "assets/body/gear/shield/set2/shield_set2_lv40_attack02.webp", "x": 57.7, "y": 109.5, "sc": 1}, "lv50": {"src": "assets/body/gear/shield/set2/shield_set2_lv50_attack02.webp", "x": 58.2, "y": 111, "sc": 1}, "lv60": {"src": "assets/body/gear/shield/set2/shield_set2_lv60_attack02.webp", "x": 57.7, "y": 111, "sc": 1}, "lv70": {"src": "assets/body/gear/shield/set2/shield_set2_lv70_attack02.webp", "x": 74.7, "y": 85, "sc": 1}, "lv80": {"src": "assets/body/gear/shield/set2/shield_set2_lv80_attack02.webp", "x": 58.2, "y": 111, "sc": 1}, "lv90": {"src": "assets/body/gear/shield/set2/shield_set2_lv90_attack02.webp", "x": 74.7, "y": 104, "sc": 1}, "lv99": {"src": "assets/body/gear/shield/set2/shield_set2_lv99_attack02.webp", "x": 78.7, "y": 98, "sc": 1}}, "foot": {"lv0": {"src": "assets/body/gear/foot/set2/foot_set2_lv0_attack02.webp", "x": 65.7, "y": 224, "sc": 1}, "lv1": {"src": "assets/body/gear/foot/set2/foot_set2_lv1_attack02.webp", "x": 63.2, "y": 225, "sc": 1}, "lv10": {"src": "assets/body/gear/foot/set2/foot_set2_lv10_attack02.webp", "x": 67.2, "y": 219, "sc": 1}, "lv20": {"src": "assets/body/gear/foot/set2/foot_set2_lv20_attack02.webp", "x": 66.2, "y": 225, "sc": 1}, "lv40": {"src": "assets/body/gear/foot/set2/foot_set2_lv40_attack02.webp", "x": 65.7, "y": 216, "sc": 1}, "lv50": {"src": "assets/body/gear/foot/set2/foot_set2_lv50_attack02.webp", "x": 63.2, "y": 219, "sc": 1}, "lv60": {"src": "assets/body/gear/foot/set2/foot_set2_lv60_attack02.webp", "x": 66.2, "y": 222, "sc": 1}, "lv70": {"src": "assets/body/gear/foot/set2/foot_set2_lv70_attack02.webp", "x": 66.7, "y": 221, "sc": 1}, "lv80": {"src": "assets/body/gear/foot/set2/foot_set2_lv80_attack02.webp", "x": 55.2, "y": 219, "sc": 1}, "lv90": {"src": "assets/body/gear/foot/set2/foot_set2_lv90_attack02.webp", "x": 66.7, "y": 222, "sc": 1}, "lv99": {"src": "assets/body/gear/foot/set2/foot_set2_lv99_attack02.webp", "x": 66.7, "y": 218, "sc": 1}, "lv30": {"src": "assets/body/gear/foot/set2/foot_set2_lv30_attack02.webp", "x": 67.2, "y": 222, "sc": 1}}, "garment": {}}, "fall": {"helmet": {"bosslv1": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv1_boss_fall.webp", "x": 83.7, "y": 54.5, "sc": 1}, "bosslv10": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv10_hatbosslv10_fall.webp", "x": 60.2, "y": 39.5, "sc": 1}, "shoplv10": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv10_shophelmet_fall.webp", "x": 94.2, "y": 77.5, "sc": 1}, "bosslv20": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv20_boss_fall.webp", "x": 52.2, "y": 36.5, "sc": 1}, "shoplv20": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv20_shop_fall.webp", "x": 74.7, "y": 40.5, "sc": 1}, "bosslv30": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv30_boss_fall.webp", "x": 74.7, "y": 43.5, "sc": 1}, "shoplv30": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv30_shop_fall.webp", "x": 34.2, "y": 40.5, "sc": 1}, "bosslv40": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv40_boss_fall.webp", "x": 85.2, "y": 72.5, "sc": 1}, "shoplv40": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv40_shop_fall.webp", "x": 73.2, "y": 54.5, "sc": 1}, "bosslv50": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv50_boss_fall.webp", "x": 83.2, "y": 58.5, "sc": 1}, "shoplv50": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv50_shop_fall.webp", "x": 86.7, "y": 75.5, "sc": 1}, "bosslv60": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv60_boss_fall.webp", "x": 48.2, "y": 42.5, "sc": 1}, "shoplv60": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv60_shop_fall.webp", "x": 42.2, "y": 24.5, "sc": 1}, "bosslv70": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv70_boss_fall.webp", "x": 24.7, "y": 30.5, "sc": 1}, "shoplv70": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv70_shop_fall.webp", "x": 40.2, "y": 30.5, "sc": 1}, "bosslv80": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv80_boss_fall.webp", "x": 58.2, "y": 43.5, "sc": 1}, "shoplv80": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv80_shop_fall.webp", "x": 67.2, "y": 48, "sc": 1}, "bosslv90": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv90_boss_fall.webp", "x": 81.7, "y": 52, "sc": 1}, "shoplv90": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv90_shop_fall.webp", "x": 101.2, "y": 81.5, "sc": 1}, "bosslv99": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv99_boss_fall.webp", "x": 72.2, "y": 55.5, "sc": 1}, "shoplv99": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv99_shop_fall.webp", "x": 74.7, "y": 57.5, "sc": 1}}, "wear": {"lv0": {"src": "assets/body/gear/wear/set2/set2_lv0_fall.webp", "x": 112.7, "y": 75, "sc": 1}, "lv1": {"src": "assets/body/gear/wear/set2/set2_lv1_fall.webp", "x": 124.7, "y": 75, "sc": 1}, "lv10": {"src": "assets/body/gear/wear/set2/set2_lv10_fall.webp", "x": 123.7, "y": 76, "sc": 1}, "lv20": {"src": "assets/body/gear/wear/set2/set2_lv20_fall.webp", "x": 123.7, "y": 158, "sc": 1}, "lv30": {"src": "assets/body/gear/wear/set2/set2_lv30_fall.webp", "x": 120.7, "y": 76, "sc": 1}, "lv40": {"src": "assets/body/gear/wear/set2/set2_lv40_fall.webp", "x": 120.7, "y": 74.5, "sc": 1}, "lv50": {"src": "assets/body/gear/wear/set2/set2_lv50_fall.webp", "x": 102.7, "y": 76, "sc": 1}, "lv60": {"src": "assets/body/gear/wear/set2/set2_lv60_fall.webp", "x": 121.7, "y": 76, "sc": 1}, "lv70": {"src": "assets/body/gear/wear/set2/set2_lv70_fall.webp", "x": 117.7, "y": 75.5, "sc": 1}, "lv80": {"src": "assets/body/gear/wear/set2/set2_lv80_fall.webp", "x": 119.7, "y": 76.5, "sc": 1}, "lv90": {"src": "assets/body/gear/wear/set2/set2_lv90_fall.webp", "x": 118.7, "y": 75.5, "sc": 1}, "lv99": {"src": "assets/body/gear/wear/set2/set2_lv99_fall.webp", "x": 120.7, "y": 74.5, "sc": 1}}, "sword": {}, "shield": {}, "foot": {"lv0": {"src": "assets/body/gear/foot/set2/foot_set2_lv0_fall.webp", "x": 228.7, "y": 187, "sc": 1}, "lv1": {"src": "assets/body/gear/foot/set2/foot_set2_lv1_fall.webp", "x": 232.7, "y": 184, "sc": 1}, "lv10": {"src": "assets/body/gear/foot/set2/foot_set2_lv10_fall.webp", "x": 228.7, "y": 185, "sc": 1}, "lv20": {"src": "assets/body/gear/foot/set2/foot_set2_lv20_fall.webp", "x": 231.7, "y": 185, "sc": 1}, "lv40": {"src": "assets/body/gear/foot/set2/foot_set2_lv40_fall.webp", "x": 232.7, "y": 188, "sc": 1}, "lv50": {"src": "assets/body/gear/foot/set2/foot_set2_lv50_fall.webp", "x": 228.7, "y": 188, "sc": 1}, "lv60": {"src": "assets/body/gear/foot/set2/foot_set2_lv60_fall.webp", "x": 229.7, "y": 185, "sc": 1}, "lv70": {"src": "assets/body/gear/foot/set2/foot_set2_lv70_fall.webp", "x": 229.7, "y": 188, "sc": 1}, "lv80": {"src": "assets/body/gear/foot/set2/foot_set2_lv80_fall.webp", "x": 225.7, "y": 184, "sc": 1}, "lv90": {"src": "assets/body/gear/foot/set2/foot_set2_lv90_fall.webp", "x": 229.7, "y": 188, "sc": 1}, "lv99": {"src": "assets/body/gear/foot/set2/foot_set2_lv99_fall.webp", "x": 231.7, "y": 185, "sc": 1}, "lv30": {"src": "assets/body/gear/foot/set2/foot_set2_lv30_fall.webp", "x": 231.7, "y": 185, "sc": 1}}, "garment": {}}, "critical02": {"helmet": {"bosslv1": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv1_boss_critical02.webp", "x": 143.2, "y": 34, "sc": 1}, "bosslv10": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv10_hatbosslv10_critical02.webp", "x": 148.2, "y": 28, "sc": 1}, "shoplv10": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv10_shophelmet_critical02.webp", "x": 131.7, "y": 51.5, "sc": 1}, "bosslv20": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv20_boss_critical02.webp", "x": 136.7, "y": 24, "sc": 1}, "shoplv20": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv20_shop_critical02.webp", "x": 138.7, "y": 33, "sc": 1}, "bosslv30": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv30_boss_critical02.webp", "x": 142.2, "y": 20, "sc": 1}, "shoplv30": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv30_shop_critical02.webp", "x": 129.2, "y": 14, "sc": 1}, "bosslv40": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv40_boss_critical02.webp", "x": 141.7, "y": 53, "sc": 1}, "shoplv40": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv40_shop_critical02.webp", "x": 142.2, "y": 31, "sc": 1}, "bosslv50": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv50_boss_critical02.webp", "x": 138.2, "y": 40, "sc": 1}, "shoplv50": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv50_shop_critical02.webp", "x": 130.2, "y": 45, "sc": 1}, "bosslv60": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv60_boss_critical02.webp", "x": 146.7, "y": 17, "sc": 1}, "shoplv60": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv60_shop_critical02.webp", "x": 134.7, "y": 15.5, "sc": 1}, "bosslv70": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv70_boss_critical02.webp", "x": 127.2, "y": 5, "sc": 1}, "shoplv70": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv70_shop_critical02.webp", "x": 123.2, "y": 5, "sc": 1}, "bosslv80": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv80_boss_critical02.webp", "x": 129.2, "y": 10, "sc": 1}, "shoplv80": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv80_shop_critical02.webp", "x": 144.2, "y": 31, "sc": 1}, "bosslv90": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv90_boss_critical02.webp", "x": 144.2, "y": 44, "sc": 1}, "shoplv90": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv90_shop_critical02.webp", "x": 139.2, "y": 57, "sc": 1}, "bosslv99": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv99_boss_critical02.webp", "x": 142.2, "y": 39, "sc": 1}, "shoplv99": {"src": "assets/body/gear/helmet/set2/helmet_set2_lv99_shop_critical02.webp", "x": 136.2, "y": 39, "sc": 1}}, "wear": {"lv0": {"src": "assets/body/gear/wear/set2/set2_lv0_critical02.webp", "x": 62.7, "y": 137.5, "sc": 1}, "lv1": {"src": "assets/body/gear/wear/set2/set2_lv1_critical02.webp", "x": 74.7, "y": 140, "sc": 1}, "lv10": {"src": "assets/body/gear/wear/set2/set2_lv10_critical02.webp", "x": 82.7, "y": 151, "sc": 1}, "lv20": {"src": "assets/body/gear/wear/set2/set2_lv20_critical02.webp", "x": 79.2, "y": 143, "sc": 1}, "lv30": {"src": "assets/body/gear/wear/set2/set2_lv30_critical02.webp", "x": 85, "y": 145, "sc": 1}, "lv40": {"src": "assets/body/gear/wear/set2/set2_lv40_critical02.webp", "x": 71.7, "y": 150.5, "sc": 1}, "lv50": {"src": "assets/body/gear/wear/set2/set2_lv50_critical02.webp", "x": 71.2, "y": 116, "sc": 1}, "lv60": {"src": "assets/body/gear/wear/set2/set2_lv60_critical02.webp", "x": 75.7, "y": 135, "sc": 1}, "lv70": {"src": "assets/body/gear/wear/set2/set2_lv70_critical02.webp", "x": 93.2, "y": 141.5, "sc": 1}, "lv80": {"src": "assets/body/gear/wear/set2/set2_lv80_critical02.webp", "x": 72.7, "y": 146.5, "sc": 1}, "lv90": {"src": "assets/body/gear/wear/set2/set2_lv90_critical02.webp", "x": 74.7, "y": 151.5, "sc": 1}, "lv99": {"src": "assets/body/gear/wear/set2/set2_lv99_critical02.webp", "x": 66.7, "y": 138.5, "sc": 1}}, "sword": {"lv1": {"src": "assets/body/gear/sword/set2/sword_set2_lv1_critical02.webp", "x": 210.7, "y": 210.5, "sc": 1}, "lv10": {"src": "assets/body/gear/sword/set2/sword_set2_lv10_critical02.webp", "x": 193.2, "y": 210, "sc": 1}, "lv20": {"src": "assets/body/gear/sword/set2/sword_set2_lv20_critical02.webp", "x": 195.2, "y": 199, "sc": 1}, "lv30": {"src": "assets/body/gear/sword/set2/sword_set2_lv30_critical02.webp", "x": 202.2, "y": 205, "sc": 1}, "lv40": {"src": "assets/body/gear/sword/set2/sword_set2_lv40_critical02.webp", "x": 193.7, "y": 210.5, "sc": 1}, "lv50": {"src": "assets/body/gear/sword/set2/sword_set2_lv50_critical02.webp", "x": 189.2, "y": 203.5, "sc": 1}, "lv60": {"src": "assets/body/gear/sword/set2/sword_set2_lv60_critical02.webp", "x": 196.2, "y": 206.5, "sc": 1}, "lv70": {"src": "assets/body/gear/sword/set2/sword_set2_lv70_critical02.webp", "x": 188.7, "y": 205.5, "sc": 1}, "lv80": {"src": "assets/body/gear/sword/set2/sword_set2_lv80_critical02.webp", "x": 210.2, "y": 195.5, "sc": 1}, "lv90": {"src": "assets/body/gear/sword/set2/sword_set2_lv90_critical02.webp", "x": 186.7, "y": 205.5, "sc": 1}, "lv99": {"src": "assets/body/gear/sword/set2/sword_set2_lv99_critical02.webp", "x": 197.7, "y": 208.5, "sc": 1}}, "shield": {"lv1": {"src": "assets/body/gear/shield/set2/shield_set2_lv1_critical02.webp", "x": 62.7, "y": 168.5, "sc": 1}, "lv10": {"src": "assets/body/gear/shield/set2/shield_set2_lv10_critical02.webp", "x": 63.2, "y": 131, "sc": 1}, "lv20": {"src": "assets/body/gear/shield/set2/shield_set2_lv20_critical02.webp", "x": 62.7, "y": 129, "sc": 1}, "lv30": {"src": "assets/body/gear/shield/set2/shield_set2_lv30_critical02.webp", "x": 151.2, "y": 123.5, "sc": 1}, "lv40": {"src": "assets/body/gear/shield/set2/shield_set2_lv40_critical02.webp", "x": 60.7, "y": 141.5, "sc": 1}, "lv50": {"src": "assets/body/gear/shield/set2/shield_set2_lv50_critical02.webp", "x": 63.2, "y": 156, "sc": 1}, "lv60": {"src": "assets/body/gear/shield/set2/shield_set2_lv60_critical02.webp", "x": 63.7, "y": 142.5, "sc": 1}, "lv70": {"src": "assets/body/gear/shield/set2/shield_set2_lv70_critical02.webp", "x": 56.7, "y": 123.5, "sc": 1}, "lv80": {"src": "assets/body/gear/shield/set2/shield_set2_lv80_critical02.webp", "x": 63.2, "y": 149.5, "sc": 1}, "lv90": {"src": "assets/body/gear/shield/set2/shield_set2_lv90_critical02.webp", "x": 59.7, "y": 126, "sc": 1}, "lv99": {"src": "assets/body/gear/shield/set2/shield_set2_lv99_critical02.webp", "x": 51, "y": 121, "sc": 1}}, "foot": {"lv0": {"src": "assets/body/gear/foot/set2/foot_set2_lv0_critical02.webp", "x": 14.7, "y": 242.5, "sc": 1}, "lv1": {"src": "assets/body/gear/foot/set2/foot_set2_lv1_critical02.webp", "x": 15.2, "y": 245.5, "sc": 1}, "lv10": {"src": "assets/body/gear/foot/set2/foot_set2_lv10_critical02.webp", "x": 15.2, "y": 240.5, "sc": 1}, "lv20": {"src": "assets/body/gear/foot/set2/foot_set2_lv20_critical02.webp", "x": 18.2, "y": 246, "sc": 1}, "lv40": {"src": "assets/body/gear/foot/set2/foot_set2_lv40_critical02.webp", "x": 14.7, "y": 234.5, "sc": 1}, "lv50": {"src": "assets/body/gear/foot/set2/foot_set2_lv50_critical02.webp", "x": 17.2, "y": 244, "sc": 1}, "lv60": {"src": "assets/body/gear/foot/set2/foot_set2_lv60_critical02.webp", "x": 19.2, "y": 238.5, "sc": 1}, "lv70": {"src": "assets/body/gear/foot/set2/foot_set2_lv70_critical02.webp", "x": 28.7, "y": 238.5, "sc": 1}, "lv80": {"src": "assets/body/gear/foot/set2/foot_set2_lv80_critical02.webp", "x": 13.2, "y": 245, "sc": 1}, "lv90": {"src": "assets/body/gear/foot/set2/foot_set2_lv90_critical02.webp", "x": 15.7, "y": 249.5, "sc": 1}, "lv99": {"src": "assets/body/gear/foot/set2/foot_set2_lv99_critical02.webp", "x": 18.7, "y": 240.5, "sc": 1}, "lv30": {"src": "assets/body/gear/foot/set2/foot_set2_lv30_critical02.webp", "x": 19.2, "y": 238, "sc": 1}}, "garment": {}}});
Object.assign(HERO_BODY_ORDER, {"attack02": ["shield", "leg", "foot", "head", "helmet", "armor", "wear", "sword"], "fall": ["leg", "foot", "armor", "wear", "head", "helmet"], "critical02": ["shield", "leg", "foot", "armor", "wear", "head", "helmet", "sword"]});
HERO_BODY_SRCS.push(...["assets/body/attack02/dattack02armor.webp", "assets/body/attack02/dattack02head.webp", "assets/body/attack02/dattack02leg.webp", "assets/body/critical02/dcritical02armor.webp", "assets/body/critical02/dcritical02head.webp", "assets/body/critical02/dcritical02leg.webp", "assets/body/fall/dfallarmor.webp", "assets/body/fall/dfallhead.webp", "assets/body/fall/dfallleg.webp", "assets/body/gear/foot/set2/foot_set2_lv0_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv0_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv0_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv10_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv10_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv10_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv1_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv1_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv1_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv20_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv20_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv20_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv30_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv30_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv30_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv40_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv40_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv40_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv50_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv50_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv50_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv60_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv60_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv60_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv70_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv70_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv70_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv80_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv80_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv80_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv90_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv90_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv90_fall.webp", "assets/body/gear/foot/set2/foot_set2_lv99_attack02.webp", "assets/body/gear/foot/set2/foot_set2_lv99_critical02.webp", "assets/body/gear/foot/set2/foot_set2_lv99_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv10_hatbosslv10_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv10_hatbosslv10_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv10_hatbosslv10_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv10_shophelmet_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv10_shophelmet_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv10_shophelmet_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv1_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv1_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv1_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv20_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv20_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv20_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv20_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv20_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv20_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv30_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv30_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv30_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv30_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv30_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv30_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv40_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv40_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv40_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv40_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv40_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv40_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv50_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv50_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv50_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv50_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv50_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv50_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv60_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv60_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv60_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv60_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv60_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv60_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv70_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv70_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv70_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv70_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv70_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv70_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv80_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv80_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv80_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv80_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv80_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv80_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv90_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv90_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv90_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv90_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv90_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv90_shop_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv99_boss_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv99_boss_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv99_boss_fall.webp", "assets/body/gear/helmet/set2/helmet_set2_lv99_shop_attack02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv99_shop_critical02.webp", "assets/body/gear/helmet/set2/helmet_set2_lv99_shop_fall.webp", "assets/body/gear/shield/set2/shield_set2_lv10_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv10_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv1_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv1_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv20_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv20_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv30_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv30_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv40_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv40_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv50_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv50_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv60_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv60_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv70_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv70_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv80_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv80_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv90_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv90_critical02.webp", "assets/body/gear/shield/set2/shield_set2_lv99_attack02.webp", "assets/body/gear/shield/set2/shield_set2_lv99_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv10_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv10_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv1_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv1_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv20_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv20_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv30_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv30_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv40_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv40_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv50_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv50_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv60_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv60_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv70_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv70_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv80_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv80_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv90_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv90_critical02.webp", "assets/body/gear/sword/set2/sword_set2_lv99_attack02.webp", "assets/body/gear/sword/set2/sword_set2_lv99_critical02.webp", "assets/body/gear/wear/set2/set2_lv0_attack02.webp", "assets/body/gear/wear/set2/set2_lv0_critical02.webp", "assets/body/gear/wear/set2/set2_lv0_fall.webp", "assets/body/gear/wear/set2/set2_lv10_attack02.webp", "assets/body/gear/wear/set2/set2_lv10_critical02.webp", "assets/body/gear/wear/set2/set2_lv10_fall.webp", "assets/body/gear/wear/set2/set2_lv1_attack02.webp", "assets/body/gear/wear/set2/set2_lv1_critical02.webp", "assets/body/gear/wear/set2/set2_lv1_fall.webp", "assets/body/gear/wear/set2/set2_lv20_attack02.webp", "assets/body/gear/wear/set2/set2_lv20_critical02.webp", "assets/body/gear/wear/set2/set2_lv20_fall.webp", "assets/body/gear/wear/set2/set2_lv30_attack02.webp", "assets/body/gear/wear/set2/set2_lv30_critical02.webp", "assets/body/gear/wear/set2/set2_lv30_fall.webp", "assets/body/gear/wear/set2/set2_lv40_attack02.webp", "assets/body/gear/wear/set2/set2_lv40_critical02.webp", "assets/body/gear/wear/set2/set2_lv40_fall.webp", "assets/body/gear/wear/set2/set2_lv50_attack02.webp", "assets/body/gear/wear/set2/set2_lv50_critical02.webp", "assets/body/gear/wear/set2/set2_lv50_fall.webp", "assets/body/gear/wear/set2/set2_lv60_attack02.webp", "assets/body/gear/wear/set2/set2_lv60_critical02.webp", "assets/body/gear/wear/set2/set2_lv60_fall.webp", "assets/body/gear/wear/set2/set2_lv70_attack02.webp", "assets/body/gear/wear/set2/set2_lv70_critical02.webp", "assets/body/gear/wear/set2/set2_lv70_fall.webp", "assets/body/gear/wear/set2/set2_lv80_attack02.webp", "assets/body/gear/wear/set2/set2_lv80_critical02.webp", "assets/body/gear/wear/set2/set2_lv80_fall.webp", "assets/body/gear/wear/set2/set2_lv90_attack02.webp", "assets/body/gear/wear/set2/set2_lv90_critical02.webp", "assets/body/gear/wear/set2/set2_lv90_fall.webp", "assets/body/gear/wear/set2/set2_lv99_attack02.webp", "assets/body/gear/wear/set2/set2_lv99_critical02.webp", "assets/body/gear/wear/set2/set2_lv99_fall.webp"]);

// The hero is drawn from the body animation tool's parts: base (idle), attack, block and critical poses.
// Worn gear is layered with the same rules as the tool. Each pose and gear set is composed once into a frame
// (cached), and the frame's feet point is the bottom of its leg and boot pixels, as the battle frames use.
// Positions and layer order come from the tool; the art is in assets/body/.
const HERO_BODY_SLOTS = ['helmet', 'wear', 'sword', 'shield', 'foot', 'garment'];
const HERO_BODY_SLOT_HIDES = { helmet: ['head'], wear: ['armor'], sword: ['lefthand'], foot: ['leg'] };
// Body parts that are never drawn
const HERO_BODY_ALWAYS_HIDDEN = ['righthand'];

// One Image per file, started when this script loads
const heroBodyImgs = {};
function heroBodyImage(src) {
    if (!heroBodyImgs[src]) {
        const img = new Image();
        img.src = (typeof HERO_ART !== 'undefined' && HERO_ART[src]) || src; // data URL on file:// pages
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
// The shield art of the highest tier at or below the shield's level (lv1, lv10, lv20 ... lv50)
function heroBodyShieldTier(levelReq) {
    for (const t of [99, 90, 80, 70, 60, 50, 40, 30, 20, 10]) if (levelReq >= t) return 'lv' + t;
    return 'lv1';
}
// The armor art of the highest tier at or below the armor's level (lv0 below level 10, then lv10 ... lv50)
function heroBodyArmorTier(levelReq) {
    for (const t of [99, 90, 80, 70, 60, 50, 40, 30, 20, 10]) if (levelReq >= t) return 'lv' + t;
    return 'lv1';
}
// The boots art of the highest tier at or below the boots' level (lv1 below level 10, then lv10 ... lv50)
function heroBodyFootTier(levelReq) {
    for (const t of [99, 90, 80, 70, 60, 50, 40, 30, 20, 10]) if (levelReq >= t) return 'lv' + t;
    return 'lv1';
}
// The sword art of the highest tier at or below the weapon's level (lv1 below level 10, then lv10 ... lv50)
function heroBodySwordTier(levelReq) {
    for (const t of [99, 90, 80, 70, 60, 50, 40, 30, 20, 10]) if (levelReq >= t) return 'lv' + t;
    return 'lv1';
}
function heroBodyLoadout() {
    const e = (typeof player !== 'undefined' && player.equipped) || {};
    return {
        helmet: heroBodyHelmet(e.hat),
        wear: e.armor ? heroBodyArmorTier(e.armor.levelReq || 1) : 'lv0',
        sword: e.weapon ? heroBodySwordTier(e.weapon.levelReq || 1) : null, // lv1 art below level 10
        shield: e.shield ? heroBodyShieldTier(e.shield.levelReq || 1) : null,
        foot: e.footgear ? heroBodyFootTier(e.footgear.levelReq || 1) : 'lv0', // lv0 when no boots are worn
        garment: null, // the cloak (manteau) is not drawn on the hero
    };
}

// The draw list for a pose, as the tool builds it: worn gear in its layer, hidden parts left out
function heroBodyItems(pose, loadout) {
    const P = HERO_BODY_POSES[pose];
    const hidden = new Set(HERO_BODY_ALWAYS_HIDDEN);
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
        // the fallen body lies on the ground: its lowest pixel of any layer is the ground point
        if (pose === 'fall' || d.id === 'leg' || d.id === 'foot') fctx.drawImage(d.img, d.x - minX, d.y - minY, d.w, d.h);
    }
    const feet = heroBodyFeet(fctx, W, H);
    // Torso centre x (armor gear, else the body's armor part): keeps the body in place when the pose changes
    const torso = drawn.find(d => d.id === 'wear') || drawn.find(d => d.id === 'armor');
    const tx = torso ? torso.x - minX + torso.w / 2 : W / 2;
    const frame = { src: canvas.toDataURL('image/png'), w: W, h: H, fx: feet.x, fy: feet.y, tx };
    heroBodyCache[key] = frame;
    return frame;
}

// X of the head's centre inside the composed frame (frame pixels, before the battle scale).
// The helmet when one is worn, otherwise the head. Used to put the stun picture over the head.
function heroBodyHeadX(pose, loadout) {
    loadout = loadout || heroBodyLoadout();
    const items = heroBodyItems(pose, loadout);
    if (!items.length) return null;
    const minX = Math.min(...items.map(i => i.x));
    const head = items.find(i => i.id === 'helmet') || items.find(i => i.id === 'head');
    if (!head) return null;
    const img = heroBodyImage(head.src);
    if (!heroBodyLoaded(img)) return null;
    return head.x + img.naturalWidth * (head.sc || 1) / 2 - minX;
}

// The battle hero's frames for the current gear. Dodge shows the block frame with the lunge back.
// An attack shows attack then attack02; a critical shows critical then critical02. A defeat shows the fall (dead) pose.
function combatPose() {
    const L = heroBodyLoadout();
    const block = heroBodyFrame('block', L);
    const attack = heroBodyFrame('attack', L), cri = heroBodyFrame('critical', L);
    return {
        IDLE: heroBodyFrame('base', L),
        ATTACK: attack,
        ATTACK2: heroBodyFrame('attack02', L) || attack,
        CRI: cri,
        CRI2: heroBodyFrame('critical02', L) || cri,
        DEAD: heroBodyFrame('fall', L),
        REACT: { block, dodge: block },
    };
}

// Keeps the town, character and class-select heroes in step once their art has loaded
setInterval(() => { if (typeof syncHeroSprites === 'function') syncHeroSprites(); }, 500);
