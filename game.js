// ==========================================
// RAGNATALE - GAME.JS (BOOTSTRAP ENTRY POINT)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    applyLanguage();

let isBgmPlaying = false;


function toggleBGM() {
    const bgm = document.getElementById('game-bgm');
    const btn = document.getElementById('bgm-toggle-btn');
    if (!bgm) return;

    if (isBgmPlaying) {
        bgm.pause();
        isBgmPlaying = false;
        if (btn) btn.innerText = "🎵 Off";
    } else {
        bgm.volume = 0.4;
        bgm.play().then(() => {
            isBgmPlaying = true;
            if (btn) btn.innerText = "🎵 On";
        }).catch(e => {
            console.log("Audio play failed:", e);
            alert("Please interact with the page first or check that bgm.wav exists.");
        });
    }
}
	
    if (loadGame()) {
        let nameSelect = document.getElementById('view-name-select');
        if (nameSelect) {
            nameSelect.classList.add('hidden');
            nameSelect.style.display = 'none';
        }
        let headerNameEl = document.getElementById('header-player-name');
        let combatNameEl = document.getElementById('combat-player-name');
        if (headerNameEl) headerNameEl.innerText = player.name;
        if (combatNameEl) combatNameEl.innerText = player.name;
        updateAvatarDisplay();
        logMessage(`[System] Successfully loaded save data for ${player.name}`, 'winlose');
        updateUI();
    } else {
        renderAvatarSelection();
        let nameSelect = document.getElementById('view-name-select');
        if (nameSelect) {
            nameSelect.classList.remove('hidden');
            nameSelect.style.display = 'flex';
        }
    }

    if (hpRegenInterval) clearInterval(hpRegenInterval);
    hpRegenInterval = setInterval(() => {
        if (player.skills.recovery && player.skills.recovery.level > 0) {
            let regenAmount = player.skills.recovery.level;
            let derived = getDerivedStats();
            if (player.hp > 0 && player.hp < derived.maxHp) {
                player.hp = Math.min(derived.maxHp, player.hp + regenAmount);
                updateUI();
            }
        }
    }, 1000);
});