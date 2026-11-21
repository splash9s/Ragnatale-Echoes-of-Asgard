// Rune Thread: English and Thai text for the Settings page and the town header.
// Keys with data-i18n="key" in index.html are filled in by applyLanguage().
const I18N = {
    en: {
        'set.save': '💾 Save Game',
        'set.feedback': '💬 Send Feedback',
        'set.mail': '✉️ Send Mail',
        'set.lang': '🌐 Language:',
        'set.music': 'Music:',
        'set.sfx': '🔊 Effects:',
        'set.legal': 'Legal & Support:',
        'set.terms': 'Terms',
        'set.privacy': 'Privacy',
        'set.refund': 'Refund',
        'set.contact': 'Contact',
        'set.about': 'About',
        'set.reset': '♻️ Reset Save Data',
        'on': 'On',
        'off': 'Off',
        'lang.name': 'English',
        'town.baselv': 'Base Lv.',
        'town.classlv': 'Class Lv.',
        'town.baseexp': 'Base EXP',
        'town.classexp': 'Class EXP',
        'friend.myid': 'My ID:',
        'friend.copy': 'Copy',
        'friend.add': 'Add Friend',
        'friend.friends': 'Friends',
        'friend.requests': 'Requests',
        'quest.milestones': 'Daily Quest Milestones',
        'quest.completed': 'Completed',
        'quest.m1': '1 Quest',
        'quest.m2': '2 Quests',
        'quest.m3': '3 Quests',
        'quest.claimed': 'Claimed',
        'quest.q_slimes.title': 'Slime Exterminator',
        'quest.q_slimes.desc': 'Defeat {n} monsters during expeditions.',
        'quest.q_crit.title': 'Precision Striker',
        'quest.q_crit.desc': 'Land {n} Critical hits in combat.',
        'quest.q_gold.title': 'Treasure Hunter',
        'quest.q_gold.desc': 'Collect {n} Gold from expeditions.',
        'quest.q_refine.title': 'Refiner',
        'quest.q_refine.desc': 'Refine equipment {n} times.',
        'quest.q_elemref.title': 'Elemental Smith',
        'quest.q_elemref.desc': 'Forge an elemental weapon {n} time.',
        'quest.q_puzzle.title': 'Puzzle Master',
        'quest.q_puzzle.desc': 'Solve {n} pet puzzle.',
        'quest.q_bosslv10.title': 'Boss Hunter Lv. 10',
        'quest.q_bosslv10.desc': 'Defeat the Lv. 10 boss {n} time.',
        'quest.q_plank.title': 'Plank Collector',
        'quest.q_plank.desc': 'Collect {n} Planks.',
        'quest.q_alloy.title': 'Alloy Smelter',
        'quest.q_alloy.desc': 'Smelt {n} Alloy.',
        'quest.q_bar.title': 'Bar Smelter',
        'quest.q_bar.desc': 'Smelt {n} Bar.',
        'quest.q_scrap.title': 'Scrapper',
        'quest.q_scrap.desc': 'Scrap {n} gear.',
        'quest.q_potion.title': 'Potion Buyer',
        'quest.q_potion.desc': 'Buy {n} potions.',
        'quest.q_visit.title': 'Friend Visitor',
        'quest.q_visit.desc': 'Visit {n} friend tents.',
        'exp.cleared': 'Cleared',
        'exp.selected': 'Selected',
        'exp.available': 'Available',
        'mail.gold': 'Gold',
        'mail.diamonds': 'Diamonds',
        'mail.refining': 'Refining Stones',
        'mail.resurrection': 'Resurrection Potion',
        'mail.vipday': 'day VIP',
        'mail.baselv': 'Base LV',
        'mail.classlv': 'Class LV',
        'mail.baseexp': 'Base EXP',
        'mail.classexp': 'Class EXP',
        'mail.title': 'Mail',
        'mail.claimfirst': 'Claim this gift first, then you can delete it.',
    },
    th: {
        'set.save': '💾 บันทึกเกม',
        'set.feedback': '💬 ส่งความคิดเห็น',
        'set.mail': '✉️ ส่งจดหมาย',
        'set.lang': '🌐 ภาษา:',
        'set.music': 'เพลง:',
        'set.sfx': '🔊 เอฟเฟกต์:',
        'set.legal': 'กฎหมายและการสนับสนุน:',
        'set.terms': 'ข้อกำหนด',
        'set.privacy': 'ความเป็นส่วนตัว',
        'set.refund': 'การคืนเงิน',
        'set.contact': 'ติดต่อ',
        'set.about': 'เกี่ยวกับ',
        'set.reset': '♻️ รีเซ็ตข้อมูลเกม',
        'on': 'เปิด',
        'off': 'ปิด',
        'lang.name': 'ไทย',
        'town.baselv': 'Lv. หลัก',
        'town.classlv': 'Lv. อาชีพ',
        'town.baseexp': 'EXP หลัก',
        'town.classexp': 'EXP อาชีพ',
        'friend.myid': 'รหัสของฉัน:',
        'friend.copy': 'คัดลอก',
        'friend.add': 'เพิ่มเพื่อน',
        'friend.friends': 'เพื่อน',
        'friend.requests': 'คำขอ',
        'quest.milestones': 'ความคืบหน้าภารกิจประจำวัน',
        'quest.completed': 'สำเร็จ',
        'quest.m1': '1 ภารกิจ',
        'quest.m2': '2 ภารกิจ',
        'quest.m3': '3 ภารกิจ',
        'quest.claimed': 'รับแล้ว',
        'quest.q_slimes.title': 'กำจัดสไลม์',
        'quest.q_slimes.desc': 'กำจัดมอนสเตอร์ {n} ตัวระหว่างการสำรวจ',
        'quest.q_crit.title': 'นักยิงแม่นยำ',
        'quest.q_crit.desc': 'ทำคริติคอล {n} ครั้งในการต่อสู้',
        'quest.q_gold.title': 'นักล่าสมบัติ',
        'quest.q_gold.desc': 'เก็บทอง {n} จากการสำรวจ',
        'quest.q_refine.title': 'นักปรับปรุงอุปกรณ์',
        'quest.q_refine.desc': 'ปรับปรุงอุปกรณ์ {n} ครั้ง',
        'quest.q_elemref.title': 'ช่างตีธาตุ',
        'quest.q_elemref.desc': 'ใส่หินธาตุให้อาวุธ {n} ครั้ง',
        'quest.q_puzzle.title': 'นักไขปริศนา',
        'quest.q_puzzle.desc': 'ไขปริศนาสัตว์เลี้ยง {n} ครั้ง',
        'quest.q_bosslv10.title': 'ล่าบอส Lv. 10',
        'quest.q_bosslv10.desc': 'ปราบบอส Lv. 10 {n} ครั้ง',
        'quest.q_plank.title': 'นักเก็บไม้กระดาน',
        'quest.q_plank.desc': 'เก็บไม้กระดาน {n} ชิ้น',
        'quest.q_alloy.title': 'นักหลอมโลหะผสม',
        'quest.q_alloy.desc': 'หลอมโลหะผสม {n} ชิ้น',
        'quest.q_bar.title': 'นักหลอมแท่งโลหะ',
        'quest.q_bar.desc': 'หลอมแท่งโลหะ {n} แท่ง',
        'quest.q_scrap.title': 'นักแยกอุปกรณ์',
        'quest.q_scrap.desc': 'แยกอุปกรณ์ {n} ชิ้น',
        'quest.q_potion.title': 'นักซื้อยา',
        'quest.q_potion.desc': 'ซื้อยา {n} ขวด',
        'quest.q_visit.title': 'นักเยี่ยมเพื่อน',
        'quest.q_visit.desc': 'เยี่ยมเต็นท์เพื่อน {n} ครั้ง',
        'exp.cleared': 'ผ่านแล้ว',
        'exp.selected': 'เลือกอยู่',
        'exp.available': 'เปิดให้เล่น',
        'mail.gold': 'ทอง',
        'mail.diamonds': 'เพชร',
        'mail.refining': 'หินปรับปรุง',
        'mail.resurrection': 'ยาฟื้นคืนชีพ',
        'mail.vipday': 'วัน VIP',
        'mail.baselv': 'Lv. หลัก',
        'mail.classlv': 'Lv. อาชีพ',
        'mail.baseexp': 'EXP หลัก',
        'mail.classexp': 'EXP อาชีพ',
        'mail.title': 'จดหมาย',
        'mail.claimfirst': 'รับของขวัญนี้ก่อน แล้วจึงลบได้',
    },
};

// Returns the text for a key in the current language, falling back to English
function tr(key) {
    const lang = (typeof currentLanguage !== 'undefined' && I18N[currentLanguage]) ? currentLanguage : 'en';
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

// Daily quest text: the stored English title/desc is used when there is no translation
function questTitle(q) {
    const k = 'quest.' + q.id + '.title';
    const v = tr(k);
    return v === k ? q.title : v;
}

function questDesc(q) {
    const k = 'quest.' + q.id + '.desc';
    const v = tr(k);
    if (v === k) return q.desc;
    return v.replace('{n}', Number(q.target).toLocaleString());
}

// Map and path names come from game data in English; this turns them into Thai when Thai is on
function localGameName(text) {
    if (currentLanguage !== 'th') return text;
    const paths = { 'Fire Path': 'เส้นทางไฟ', 'Ice Path': 'เส้นทางน้ำแข็ง', 'Earth Path': 'เส้นทางดิน', 'Wind Path': 'เส้นทางลม' };
    if (paths[text]) return paths[text];
    if (String(text).indexOf(' · ') >= 0) return String(text).split(' · ').map(localGameName).join(' · ');
    return String(text)
        .replace(/^Final Map Lv\. (\d+)$/, 'แผนที่สุดท้าย Lv. $1')
        .replace(/^Map Lv\. (\d+)$/, 'แผนที่ Lv. $1');
}

// Event and friend page text that is written in code (not in the dictionary above).
// Matched on whole text pieces; the game re-renders these pages, so the observer translates again.
const DOM_TH = {
    'Daily Quests': 'ภารกิจประจำวัน',
    'Daily Challenge': 'ท้าทายประจำวัน',
    'Gold Frenzy': 'ทองคำพุ่งทะยาน',
    'Wisdom Trail': 'เส้นทางแห่งปัญญา',
    'Warded Tower': 'หอคอยผนึก',
    'Void Tower': 'หอคอยความว่างเปล่า',
    'Void Test Map': 'แผนที่ทดสอบความว่างเปล่า',
    'Boss Gauntlet': 'ด่านบอส',
    '31 stages with bosses on 11, 21 and 31. Level, skills and gear have no effect. Health potions are disabled and only one resurrection can be used per run.': '31 ด่าน มีบอสที่ด่าน 11, 21 และ 31 เลเวล สกิล และอุปกรณ์ไม่มีผล ยาเพิ่ม HP ใช้ไม่ได้ และใช้การฟื้นคืนชีพได้เพียงครั้งเดียวต่อการลง',
    'Cleared today: locked until tomorrow': 'ผ่านแล้ววันนี้ ล็อกจนถึงพรุ่งนี้',
    'Monsters at x1.5 HP and damage. Gold x2, but no EXP. No item drops.': 'มอนสเตอร์มี HP และพลังโจมตี x1.5 ทองคำ x2 แต่ไม่ได้ EXP และไม่มีไอเทมดรอป',
    'Monsters at x1.5 HP and damage. Base and Class EXP x2, but no Gold. No item drops.': 'มอนสเตอร์มี HP และพลังโจมตี x1.5 EXP หลักและ EXP อาชีพ x2 แต่ไม่ได้ทองคำ และไม่มีไอเทมดรอป',
    'Copper Mines': 'เหมืองทองแดง',
    'Silver Vault': 'คลังเงิน',
    "Dragon's Hoard": 'คลังมังกร',
    'Moonlit Grove': 'ป่าใต้แสงจันทร์',
    'Sage Library': 'ห้องสมุดปราชญ์',
    'Starfall Peak': 'ยอดดาวตก',
    'Endless test map. 100x rewards, test only.': 'แผนที่ทดสอบไม่จำกัด รางวัล 100 เท่า ใช้ทดสอบเท่านั้น',
    'Free test map: 1 stage, 6 monsters.': 'แผนที่ทดสอบฟรี: 1 ด่าน มอนสเตอร์ 6 ตัว',
    'A boss on every level 1–99. Choose the boss to fight.': 'มีบอสทุกระดับ 1–99 เลือกบอสที่จะสู้',
    'Boss to fight': 'บอสที่จะสู้',
    'Guest Book': 'สมุดเยี่ยม',
    'Accept': 'ยอมรับ',
    'Cancel Request': 'ยกเลิกคำขอ',
    'Decline': 'ปฏิเสธ',
    'Delete': 'ลบ',
    'Delete Friend': 'ลบเพื่อน',
    'Hero': 'ฮีโร่',
    'Loading friends...': 'กำลังโหลดเพื่อน...',
    'Loading requests...': 'กำลังโหลดคำขอ...',
    'Loading...': 'กำลังโหลด...',
    'No friend requests.': 'ไม่มีคำขอเป็นเพื่อน',
    'No friends yet. Add a player with their name or ID above.': 'ยังไม่มีเพื่อน เพิ่มผู้เล่นด้วยชื่อหรือรหัสด้านบน',
    'No messages yet. Say hello.': 'ยังไม่มีข้อความ ทักทายกันเลย',
    'Send': 'ส่ง',
    'Send Gift': 'ส่งของขวัญ',
    'Sent today': 'ส่งวันนี้แล้ว',
    'Visit Tent': 'เยี่ยมเต็นท์',
    'Yes': 'ใช่',
    'No streak': 'ไม่มีสตรีค',
    'Max friendship level': 'ระดับมิตรภาพสูงสุด',
    'Waiting for them to accept.': 'รอให้ยอมรับ',
    'Wants to be your friend.': 'ต้องการเป็นเพื่อนกับคุณ',
    'Write a message...': 'เขียนข้อความ...',
    'Write a message first.': 'เขียนข้อความก่อน',
    'Type a player name or ID.': 'พิมพ์ชื่อหรือรหัสผู้เล่น',
    'Friendship Lv. ': 'ระดับมิตรภาพ ',
    'Lv. ': 'Lv. ',
    'Success Rate': 'อัตราสำเร็จ',
    'First refine FREE': 'ปรับปรุงครั้งแรกฟรี',
    'Smelt': 'หลอม',
    'Iron Scraps': 'เศษเหล็ก',
    'Ingot': 'อินกอต',
    'Bars': 'แท่งโลหะ',
    'Alloy': 'โลหะผสม',
    'Select gear to refine': 'เลือกอุปกรณ์ที่จะปรับปรุง',
    'weapon': 'อาวุธ',
    'shield': 'โล่',
    'armor': 'เกราะ',
    'garment': 'เสื้อคลุม',
    'footgear': 'รองเท้า',
    'Slot:': 'ช่อง:',
    'Attached': 'แนบมา',
    'Claim': 'รับ',
    'Claimed': 'รับแล้ว',
    'Delete': 'ลบ',
    'No mail.': 'ไม่มีจดหมาย',
    'Rewards': 'รางวัล',
    'REWARDS': 'รางวัล',
    '+0 to +4: refining always succeeds.': '+0 ถึง +4: การปรับปรุงสำเร็จเสมอ',
    'A failed forge never loses the weapon. It only uses up the stone and the Gold.': 'การตีธาตุที่ล้มเหลวจะไม่ทำให้อาวุธหาย ใช้แค่หินและทองไป',
    'A failed refine drops the gear by 1 level (never below +4) and consumes the Gold and the refine material.': 'การปรับปรุงที่ล้มเหลวจะลดระดับอุปกรณ์ลง 1 ระดับ (ไม่ต่ำกว่า +4) และใช้ทองกับวัสดุไป',
    'A forged weapon is named after you: your name in blue, then the element, then the weapon name.': 'อาวุธที่ตีธาตุจะตั้งชื่อตามคุณ: ชื่อคุณเป็นสีน้ำเงิน ตามด้วยธาตุ แล้วชื่ออาวุธ',
    'Costs 1 Blacksmith Rune Stone.': 'ใช้หินรูนช่างตี 1 ก้อน',
    'Each campaign boss drops the Elemental Stone of its element, with a 5% chance per kill.': 'บอสในด่านหลักดรอปหินธาตุของธาตุนั้น โอกาส 5% ต่อการฆ่า',
    'Each forge costs Gold = item level x 100, and Elemental Stones = item level / 10 (rounded up, at least 1).': 'การตีแต่ละครั้งใช้ทอง = เลเวลไอเทม x 100 และหินธาตุ = เลเวลไอเทม / 10 (ปัดขึ้น อย่างน้อย 1)',
    'Each refine costs (target level) × 100 Gold and 1 refine material: Ingot for +1 to +4, Bar for +5 to +7, Alloy for +8 to +10.': 'การปรับปรุงแต่ละครั้งใช้ทอง (ระดับเป้าหมาย) × 100 และวัสดุ 1 ชิ้น: อินกอตสำหรับ +1 ถึง +4, แท่งโลหะสำหรับ +5 ถึง +7, โลหะผสมสำหรับ +8 ถึง +10',
    'Elemental': 'ธาตุ',
    'Elemental Forge Rules': 'กฎการตีธาตุ',
    'Forging succeeds 20% of the time.': 'การตีธาตุสำเร็จ 20%',
    'From +5 on, the success rate drops by 15% per level (minimum 10%).': 'ตั้งแต่ +5 ขึ้นไป อัตราสำเร็จลด 15% ต่อระดับ (ขั้นต่ำ 10%)',
    'Ingot drops from normal monsters (5%), Bar from mini bosses (5%), Alloy from bosses (2%).': 'อินกอตดรอปจากมอนสเตอร์ทั่วไป (5%) แท่งโลหะจากมินิบอส (5%) โลหะผสมจากบอส (2%)',
    'Inherit': 'ถ่ายทอด',
    'Inherit Rules': 'กฎการถ่ายทอด',
    'Maximum refinement is +10.': 'การปรับปรุงสูงสุดคือ +10',
    'Only gear of the same type. Refinement moves from higher to lower only.': 'ใช้ได้กับอุปกรณ์ชนิดเดียวกันเท่านั้น การปรับปรุงย้ายจากระดับสูงไปต่ำเท่านั้น',
    'Pick a weapon and an Elemental Stone, then forge the element onto the weapon.': 'เลือกอาวุธและหินธาตุ แล้วตีธาตุลงบนอาวุธ',
    'Pick the gear to take refinement from (From), then the gear to move it to (To).': 'เลือกอุปกรณ์ที่จะเอาการปรับปรุงออก (จาก) แล้วเลือกอุปกรณ์ที่จะย้ายไป (ไปยัง)',
    'Refine': 'ปรับปรุง',
    'Refine Rules': 'กฎการปรับปรุง',
    'Refinement': 'การปรับปรุง',
    'Return': 'กลับ',
    'Smelting: 20 Iron Scraps make 1 Ingot, 20 Ingots make 1 Bar, 10 Bars make 1 Alloy.': 'การหลอม: เศษเหล็ก 20 ชิ้น = อินกอต 1, อินกอต 20 = แท่งโลหะ 1, แท่งโลหะ 10 = โลหะผสม 1',
    "The target takes the source's level; the source resets to +0.": 'เป้าหมายรับระดับของต้นทาง ต้นทางรีเซ็ตเป็น +0',
    'Weapons no longer roll an element when they drop from monsters.': 'อาวุธจะไม่สุ่มธาตุตอนดรอปจากมอนสเตอร์อีกต่อไป',
    'Friends need the cloud. Sign in to use them.': 'เพื่อนต้องใช้บัญชีออนไลน์ กรุณาเข้าสู่ระบบก่อน',
};


// Stat lines such as "ATK +5", "Fire Res +10%" and "(2 pcs) DEF +5"
const STAT_LABEL_TH = { Atk: 'โจมตี', 'Max HP': 'HP สูงสุด', 'Max armor': 'เกราะสูงสุด', 'Crit damage': 'ดาเมจคริติคอล', 'CRIT rate': 'อัตราคริติคอล', CRIT: 'คริติคอล', Gold: 'ทอง', 'Sell price': 'ราคาขาย', 'Damage taken': 'ดาเมจที่รับ', ATK: 'โจมตี', DEF: 'ป้องกัน', HP: 'HP', FLEE: 'หลบหลีก', HIT: 'HIT', ASPD: 'ASPD', CRIT: 'คริติคอล',
    Block: 'บล็อก', MDEF: 'MDEF', ARMOR: 'เกราะ', 'ATK%': 'โจมตี%', 'Fire Res': 'ต้านทานไฟ', 'Wind Res': 'ต้านทานลม',
    'Earth Res': 'ต้านทานดิน', 'Ice Res': 'ต้านทานน้ำแข็ง' };
function thStatText(s) {
    const m = String(s).match(/^(.+?) ([+-]?\d+%?)$/);
    if (m && STAT_LABEL_TH[m[1]]) return `${STAT_LABEL_TH[m[1]]} ${m[2]}`;
    return s;
}

// One "LABEL +N" stat token from item and skill descriptions
function thStatTok(tok) {
    const m = String(tok).match(/^(.+?) ([+-]?[\d.]+%?)$/);
    if (m && STAT_LABEL_TH[m[1]]) return `${STAT_LABEL_TH[m[1]]} ${m[2]}`;
    return tok;
}
function thHealText(s) {
    return String(s).replace('% of max HP', '% ของ HP สูงสุด');
}

const DOM_TH_PATTERNS = [
    { re: /^(.+)'s Guest Book$/, f: m => `สมุดเยี่ยมของ ${m[1]}` },
    { re: /^Restores (.+) · Qty (\d+)$/, f: m => `ฟื้นฟู ${thHealText(m[1])} · จำนวน ${m[2]}` },
    { re: /^(.+?) · (.+?) · Requires Lv (\d+)$/, f: m => `${thExactPart(m[1])} · ${thExactPart(m[2])} · ต้องการเลเวล ${m[3]}` },
    { re: /^(.+) · (Common|Uncommon|Rare|Epic|Legendary)$/, f: m => `${thExactPart(m[1])} · ${thExactPart(m[2])}` },
    { re: /^, Requires Base Lv\. (\d+)$/, f: m => `, ต้องการเลเวลฐาน ${m[1]}` },
    { re: /^\((\d+) pcs\) (.+)$/, f: m => `(${m[1]} ชิ้น) ${thStatText(m[2])}` },
    { re: /^Smelt (\d+) (.+)$/, f: m => `หลอม ${thExactPart(m[2])} ${m[1]} ชิ้น` },
    { re: /^Sells for (.+)$/, f: m => `ขายได้ ${m[1].replace('Gold', 'ทอง')}` },
    { re: /^(ATK|DEF|HP|FLEE|HIT|ASPD|CRIT|Block|MDEF|ARMOR|ATK%|Fire Res|Wind Res|Earth Res|Ice Res) ([+-]?\d+%?)$/, f: m => thStatText(m[0]) },
    { re: /^Messages can be up to (\d+) characters\.$/, f: m => `ข้อความยาวได้สูงสุด ${m[1]} ตัวอักษร` },
    { re: /^(.+) — Stage (\d+) \/ (\d+)$/, f: m => `${localGameName(m[1])} — ด่านที่ ${m[2]} / ${m[3]}` },
    { re: /^(\d+) \/ (\d+) plays left today$/, f: m => `เหลือ ${m[1]} / ${m[2]} ครั้งวันนี้` },
    { re: /^Unlimited attempts for now · (\d+) \/ 2 friends$/, f: m => `ไม่จำกัดจำนวนครั้งตอนนี้ · ${m[1]} / 2 เพื่อน` },
    { re: /^Success Rate: (.+)$/, f: m => `อัตราสำเร็จ: ${m[1]}` },
    { re: /^Rune Stone: (\d+)$/, f: m => `หินรูน: ${m[1]}` },
    { re: /^Campaign Lv\. (\d+)$/, f: m => `ด่าน Lv. ${m[1]}` },
    { re: /^(\d+) floors in the castle\. Monsters grow stronger on every floor\. Bring two friends\. Each friend can join again 3 days after a run\. You are paid for each floor you clear\.$/, f: m => `มี ${m[1]} ชั้นในปราสาท มอนสเตอร์แข็งแกร่งขึ้นทุกชั้น พาเพื่อนได้ 2 คน เพื่อนแต่ละคนเข้าร่วมได้อีกครั้งหลังผ่านไป 3 วัน คุณได้รับรางวัลทุกชั้นที่ผ่าน` },
    { re: /^([\d,]+) Gold$/, f: m => `${m[1]} ทอง` },
    { re: /^([A-Za-z][A-Za-z% ]*? [+-]?[\d.]+%?(?:, [A-Za-z][A-Za-z% ]*? [+-]?[\d.]+%?)*)$/, f: m => m[1].split(', ').map(tok => thStatTok(tok)).join(', ') },
    { re: /^([+-]?[\d.]+%?) (Gold)$/, f: m => `${m[1]} ทอง` },
    { re: /^Slot: (.+?) \| Success Rate: (.+)$/, f: m => `ช่อง: ${(typeof NAMES_TH !== 'undefined' && NAMES_TH[m[1]]) || m[1]} | อัตราสำเร็จ: ${m[2]}` },
    { re: /^(.+) Elemental Stone: (\d+)$/, f: m => `${(typeof NAMES_TH !== 'undefined' && NAMES_TH[m[1] + ' Elemental Stone']) || m[1]} หินธาตุ: ${m[2]}` },
    { re: /^(.+) x(\d+)$/, f: m => (typeof NAMES_TH !== 'undefined' && NAMES_TH[m[1]]) ? `${NAMES_TH[m[1]]} x${m[2]}` : m[0] },
    { re: /^(Heavy|Light) (.+?)( \+\d+)?$/, f: m => (typeof NAMES_TH !== 'undefined' && NAMES_TH[m[2]]) ? `${NAMES_TH[m[2]]} (${m[1] === 'Heavy' ? 'หนัก' : 'เบา'})${m[3] || ''}` : m[0] },
    { re: /^Top up ([\d,]+) (diamonds|gold) for \$([\d.]+)\.$/, f: m => `เติม ${m[1]} ${m[2] === 'diamonds' ? 'เพชร' : 'ทอง'} ราคา $${m[3]}` },
    { re: /^(★ )?(.+?)( \+(\d+))?$/, f: m => (typeof NAMES_TH !== 'undefined' && NAMES_TH[m[2]]) ? `${m[1] || ''}${NAMES_TH[m[2]]}${m[3] || ''}` : m[0] },];

// Replaces the English text pieces under root with Thai (Thai mode only)
function translateDomIn(root) {
    if (!root || currentLanguage !== 'th') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
        const t = n.nodeValue.trim();
        if (!t) return;
        let out = DOM_TH[t] || (typeof NAMES_TH !== 'undefined' ? NAMES_TH[t] : undefined);
        if (!out) {
            for (const p of DOM_TH_PATTERNS) {
                const m = t.match(p.re);
                if (!m) continue;
                const o = p.f(m);
                if (o && o !== t) { out = o; break; } // a pattern that leaves the text unchanged lets the next one try
            }
        }
        if (out && out !== t) n.nodeValue = n.nodeValue.replace(t, out);
    });
    root.querySelectorAll('[placeholder]').forEach(el => {
        const out = thExact(el.getAttribute('placeholder'));
        if (out !== el.getAttribute('placeholder')) el.setAttribute('placeholder', out);
    });
}

// Rune helpers: Thai name, pick-card description and value text (English when not in Thai or missing)
function thRune(id) { return currentLanguage === 'th' && typeof RUNE_TH !== 'undefined' ? RUNE_TH[id] || null : null; }
function thRuneName(id, en) { const t = thRune(id); return t && t.name ? t.name : en; }
function thRuneDesc(id, en) { const t = thRune(id); return t && t.desc ? t.desc : en; }
function thRuneText(id, v, en) { const t = thRune(id); return t && t.text ? t.text(v) : en; }

// Splits "weapon · Rare" style text into translated parts
function thExactPart(text) {
    const t = String(text).trim();
    return (typeof DOM_TH !== 'undefined' && DOM_TH[t]) || (typeof NAMES_TH !== 'undefined' && NAMES_TH[t]) || t;
}

// Exact lookup for text that scripts set after render (status lines and the like)
function thExact(text) {
    if (currentLanguage !== 'th') return text;
    const t = String(text).trim();
    return (typeof DOM_TH !== 'undefined' && DOM_TH[t]) || (typeof NAMES_TH !== 'undefined' && NAMES_TH[t]) || text;
}

let domObserver = null;
function startDomTranslation() {
    if (domObserver || typeof MutationObserver === 'undefined') return;
    let pending = false;
    domObserver = new MutationObserver(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            ['view-friend', 'view-events', 'view-blacksmith', 'view-quests', 'view-character', 'view-shop', 'view-expeditions', 'view-skills', 'view-vip', 'view-market', 'view-combat'].forEach(id => translateDomIn(document.getElementById(id)));
        });
    });
    ['view-friend', 'view-events', 'view-blacksmith', 'view-quests'].forEach(id => {
        const el = document.getElementById(id);
        if (el) domObserver.observe(el, { childList: true, subtree: true, characterData: true });
    });
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage === 'th' ? 'th' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = key === 'set.lang' ? tr('set.lang') + ' ' + tr('lang.name') : tr(key);
    });
    if (typeof refreshAudioUI === 'function') refreshAudioUI();
    if (typeof renderQuestsView === 'function' && document.getElementById('quests-container')) renderQuestsView();
    if (typeof renderMapGateUI === 'function' && document.getElementById('campaign-map-select')) renderMapGateUI();
    startDomTranslation();
    try {
        if (typeof renderEventsView === 'function' && document.getElementById('events-detail')) renderEventsView();
        if (typeof renderFriendPage === 'function' && document.getElementById('friend-list')) renderFriendPage();
    } catch (e) { console.warn('Language re-render skipped:', e); }
    ['view-friend', 'view-events', 'view-blacksmith', 'view-quests', 'view-character', 'view-shop', 'view-expeditions', 'view-skills', 'view-vip', 'view-market'].forEach(id => translateDomIn(document.getElementById(id)));
}

// Remember the choice on this device only
function loadSavedLanguage() {
    try {
        const v = localStorage.getItem('rune_thread_lang');
        if (v === 'en' || v === 'th') currentLanguage = v;
    } catch (e) { /* storage blocked: keep English */ }
}

function saveLanguage() {
    try { localStorage.setItem('rune_thread_lang', currentLanguage); } catch (e) { /* ignore */ }
}

loadSavedLanguage();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLanguage);
else applyLanguage();

// Combat and town log lines are built from many template strings. thLog() translates the
// bracket tags, common combat phrases and gear/monster names inside each finished line.
const LOG_TH_TAGS = {
    '[Combat]': '[การต่อสู้]', '[Victory]': '[ชัยชนะ]', '[Miss]': '[พลาด]', '[Heal]': '[ฟื้นฟู]',
    '[Poison]': '[พิษ]', '[Stun]': '[สตัน]', '[Stun Burst]': '[สตันพร้อมกัน]', '[Shop]': '[ร้านค้า]',
    '[Inventory]': '[กระเป๋า]', '[Inventory Full]': '[กระเป๋าเต็ม]', '[Mail]': '[จดหมาย]', '[Market]': '[ตลาด]',
    '[System]': '[ระบบ]', '[Stage Cleared]': '[ผ่านด่าน]', '[Plank Drop]': '[ดรอปแผ่นไม้]', '[Monster Drop]': '[ดรอป]',
    '[Mini Boss]': '[มินิบอส]', '[Mini Boss Drop!]': '[มินิบอสดรอป!]', '[Helmet Drop!]': '[หมวกดรอป!]',
    '[Refine Success]': '[ปรับปรุงสำเร็จ]', '[Refine Failed]': '[ปรับปรุงล้มเหลว]', '[Refine Drop]': '[ดรอปจากการปรับปรุง]',
    '[Wave]': '[คลื่นศัตรู]', '[Tower]': '[หอ]', '[Potion]': '[ยา]', '[Rune]': '[รูน]', '[Rune Blessing]': '[พรรูน]',
    '[Resurrection]': '[ฟื้นคืนชีพ]', '[Status]': '[สถานะ]', '[Split]': '[แตกตัว]', '[Splash]': '[กระเด็น]',
    '[Spell]': '[เวท]', '[Ignite]': '[ลุกไหม้]', '[Ice Shield]': '[โล่น้ำแข็ง]', '[Thorn]': '[หนาม]',
    '[Salvage]': '[แยกชิ้นส่วน]', '[Free]': '[ฟรี]', '[Guide]': '[แนะนำ]', '[Support]': '[สนับสนุน]',
    '[Shockwave]': '[คลื่นกระแทก]', '[Overflow]': '[เกินพลัง]', '[Undertow]': '[ดูดกลับ]', '[Void Pull]': '[ดึงความว่าง]',
    '[Shared Pain]': '[แบ่งความเจ็บปวด]', '[Retribution]': '[การตอบโต้]', '[Inherit]': '[ถ่ายทอด]',
    '[Daily Quest Completed!]': '[ภารกิจรายวันสำเร็จ!]', 'Battle started...': 'เริ่มการต่อสู้...',
};
const LOG_TH_PHRASES = [
    [' damage to ', ' ความเสียหายต่อ '], [' damage', ' ความเสียหาย'], [' hits ', ' โจมตี '], [' for ', ' เป็นจำนวน '],
    [' heals ', ' ฟื้นฟู '], [' restores ', ' ฟื้นฟู '], [' stuns ', ' สตัน '], [' stun ', ' สตัน '],
    ['dropped ', 'ดรอป '], ['Defeated ', 'ปราบ '], ['Gained ', 'ได้รับ '], ['Obtained ', 'ได้รับ '],
    [' missed!', ' พลาด!'], [' appears!', ' ปรากฏตัว!'], [' blocks ', ' กัน '], [' of your hit', ' ของการโจมตีคุณ'],
    [' Base EXP', ' Base EXP'], [' Class EXP', ' Class EXP'], [' Gold', ' ทอง'], [' gold', ' ทอง'],
    [' HP', ' HP'], ['Purchased ', 'ซื้อ '], ['Sold ', 'ขาย '], ['Salvaged ', 'แยก '], ['Listed ', 'ประกาศ '],
    ['Claimed rewards from', 'รับรางวัลจาก'], ['is now ', 'ตอนนี้เป็น '], ['reset to', 'รีเซ็ตเป็น'],
    [' splits into ', ' แตกเป็น '], [' slimes!', ' สไลม์!'], ['Sorted by ', 'เรียงตาม '],
    ['Could not fit', 'ใส่ไม่ได้'], [' was discarded.', ' ถูกทิ้ง'], ['was added to your potion slot.', 'ถูกเพิ่มในช่องยาแล้ว'],
    [' and ', ' และ '], ['Acquired ', 'ได้รับ '], ['Attack on ', 'การโจมตี '], ['(Rarity ', '(ความหายาก '], ['Welcome to Haven of Dawn,', 'ยินดีต้อนรับสู่ Haven of Dawn,'], [' falls! The next in line takes the front.', ' ล้มลง! คนถัดไปขึ้นหน้า'],
];
function thLog(msg) {
    if (currentLanguage !== 'th') return msg;
    let s = String(msg);
    Object.keys(LOG_TH_TAGS).forEach(k => { if (s.includes(k)) s = s.split(k).join(LOG_TH_TAGS[k]); });
    if (typeof NAMES_TH !== 'undefined') {
        Object.keys(NAMES_TH).sort((a, b) => b.length - a.length).forEach(k => {
            if (!s.includes(k)) return;
            const re = new RegExp('(?<![A-Za-z])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z])', 'g');
            s = s.replace(re, NAMES_TH[k]);
        });
    }
    LOG_TH_PHRASES.forEach(([en, th]) => { if (s.includes(en)) s = s.split(en).join(th); });
    return s;
}
