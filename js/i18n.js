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

function applyLanguage() {
    document.documentElement.lang = currentLanguage === 'th' ? 'th' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = key === 'set.lang' ? tr('set.lang') + ' ' + tr('lang.name') : tr(key);
    });
    if (typeof refreshAudioUI === 'function') refreshAudioUI();
    if (typeof renderQuestsView === 'function' && document.getElementById('quests-container')) renderQuestsView();
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
