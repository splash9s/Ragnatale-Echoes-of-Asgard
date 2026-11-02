// Background music and sound effects, with on/off toggles and volume (0-100).
// Settings are stored in player.audio so they save with the game.
const MUSIC_TRACKS = { town: 'sound/bgm_town.mp3', battle: 'sound/bgm_battle.mp3', boss: 'sound/bgm_boss.mp3' };
const AUDIO_DEFAULTS = { musicOn: true, musicVol: 20, sfxOn: true, sfxVol: 20 };
let musicEl = null;
let musicTrack = null; // key of the track currently loaded

function audioSettings() {
    if (!player.audio) player.audio = {};
    Object.keys(AUDIO_DEFAULTS).forEach(k => { if (player.audio[k] === undefined) player.audio[k] = AUDIO_DEFAULTS[k]; });
    return player.audio;
}
function musicVolumeNow() { const a = audioSettings(); return a.musicOn ? a.musicVol / 100 : 0; }
function sfxVolumeNow() { const a = audioSettings(); return a.sfxOn ? a.sfxVol / 100 : 0; }

function getMusicEl() {
    if (!musicEl) { musicEl = new Audio(); musicEl.loop = true; musicEl.preload = 'auto'; }
    return musicEl;
}

// Switches the background music to 'town', 'battle' or 'boss'. The same track keeps playing.
function setMusicTrack(key) {
    if (!MUSIC_TRACKS[key]) return;
    const el = getMusicEl();
    if (musicTrack !== key) {
        musicTrack = key;
        el.src = MUSIC_TRACKS[key];
    }
    el.volume = musicVolumeNow();
    if (audioSettings().musicOn) el.play().catch(() => {}); // blocked until the first click or key press (see initAudio)
}

// Browsers block autoplay until the player interacts with the page, so music resumes on the first click or key press
function initAudio() {
    const resume = () => {
        if (!audioSettings().musicOn || !musicTrack) return;
        const el = getMusicEl();
        if (el.paused) el.play().catch(() => {});
    };
    document.addEventListener('pointerdown', resume);
    document.addEventListener('keydown', resume);
    refreshAudioUI();
}

function toggleMusicOn() {
    const a = audioSettings();
    a.musicOn = !a.musicOn;
    const el = getMusicEl();
    if (a.musicOn) setMusicTrack(musicTrack || 'town');
    else el.pause();
    refreshAudioUI();
    saveGame();
}
function setMusicVolume(v) {
    audioSettings().musicVol = Number(v);
    getMusicEl().volume = musicVolumeNow();
    refreshAudioUI();
}
function toggleSfxOn() {
    audioSettings().sfxOn = !audioSettings().sfxOn;
    refreshAudioUI();
    saveGame();
}
function setSfxVolume(v) {
    audioSettings().sfxVol = Number(v);
    refreshAudioUI();
}
function saveAudioSettings() { saveGame(); }
// Plays one effect at the chosen volume, so the player can hear the level they set
function previewSfx() { if (sfxVolumeNow() > 0 && typeof playSound === 'function') playSound('sound/hit.mp3'); }

// Keeps the Settings page controls in step with the saved values
function refreshAudioUI() {
    const a = audioSettings();
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && el.value !== String(val)) el.value = val; };
    setText('music-toggle-btn', a.musicOn ? '🎵 Music: On' : '🎵 Music: Off');
    setVal('music-volume', a.musicVol);
    setText('music-volume-text', a.musicVol);
    setText('sfx-toggle-btn', a.sfxOn ? '🔊 Effects: On' : '🔊 Effects: Off');
    setVal('sfx-volume', a.sfxVol);
    setText('sfx-volume-text', a.sfxVol);
}
