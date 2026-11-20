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
    },
};

// Returns the text for a key in the current language, falling back to English
function tr(key) {
    const lang = (typeof currentLanguage !== 'undefined' && I18N[currentLanguage]) ? currentLanguage : 'en';
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage === 'th' ? 'th' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = key === 'set.lang' ? tr('set.lang') + ' ' + tr('lang.name') : tr(key);
    });
    if (typeof refreshAudioUI === 'function') refreshAudioUI();
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
