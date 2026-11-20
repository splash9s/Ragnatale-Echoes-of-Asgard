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
    'Friends need the cloud. Sign in to use them.': 'เพื่อนต้องใช้บัญชีออนไลน์ กรุณาเข้าสู่ระบบก่อน',
};

const DOM_TH_PATTERNS = [
    { re: /^(\d+) \/ (\d+) plays left today$/, f: m => `เหลือ ${m[1]} / ${m[2]} ครั้งวันนี้` },
    { re: /^Unlimited attempts for now · (\d+) \/ 2 friends$/, f: m => `ไม่จำกัดจำนวนครั้งตอนนี้ · ${m[1]} / 2 เพื่อน` },
    { re: /^Campaign Lv\. (\d+)$/, f: m => `ด่าน Lv. ${m[1]}` },
    { re: /^(\d+) floors in the castle\. Monsters grow stronger on every floor\. Bring two friends\. Each friend can join again 3 days after a run\. You are paid for each floor you clear\.$/, f: m => `มี ${m[1]} ชั้นในปราสาท มอนสเตอร์แข็งแกร่งขึ้นทุกชั้น พาเพื่อนได้ 2 คน เพื่อนแต่ละคนเข้าร่วมได้อีกครั้งหลังผ่านไป 3 วัน คุณได้รับรางวัลทุกชั้นที่ผ่าน` },
];

// Replaces the English text pieces under root with Thai (Thai mode only)
function translateDomIn(root) {
    if (!root || currentLanguage !== 'th') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
        const t = n.nodeValue.trim();
        if (!t) return;
        let out = DOM_TH[t];
        if (!out) {
            for (const p of DOM_TH_PATTERNS) {
                const m = t.match(p.re);
                if (m) { out = p.f(m); break; }
            }
        }
        if (out && out !== t) n.nodeValue = n.nodeValue.replace(t, out);
    });
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
            ['view-friend', 'view-events'].forEach(id => translateDomIn(document.getElementById(id)));
        });
    });
    ['view-friend', 'view-events'].forEach(id => {
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
    ['view-friend', 'view-events'].forEach(id => translateDomIn(document.getElementById(id)));
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
