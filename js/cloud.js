// Cloud save (Supabase). Local save in localStorage still works when the cloud is unreachable.
// Writes are batched: at most one upload per minute, only when the save changed, and on hide/close.
const SUPABASE_URL = 'https://krtzvossvqddhveozcnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydHp2b3NzdnFkZGh2ZW96Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjQ2NjMsImV4cCI6MjEwODE0MDY2M30.s1DTBfhoLjfokEZuiLuZXfIGXJBqcPfz3IteWmAAvUY';
const CLOUD_FLUSH_MS = 60000;

let cloudClient = null;
let cloudUserId = null;
let cloudDirty = false;
let cloudLastPushed = null; // JSON of the last save uploaded (or downloaded)
let cloudFlushTimer = null;
let cloudDisabled = false; // set after a reset so nothing is written back to the cloud

// Sign in (anonymously if new) and sync the save. Reloads once if the cloud save is newer than this browser's.
async function cloudStart() {
    if (typeof supabase === 'undefined' || !supabase.createClient) return;
    try {
        cloudClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        let { data: { session } } = await cloudClient.auth.getSession();
        if (!session) {
            const r = await cloudClient.auth.signInAnonymously();
            if (r.error) throw r.error;
            session = r.data.session;
        }
        cloudUserId = session.user.id;
        const { data, error } = await cloudClient.from('saves').select('data, updated_at').eq('user_id', cloudUserId).maybeSingle();
        if (error) throw error;
        const localAt = Number(localStorage.getItem('ragnatale_save_at')) || 0;
        if (data) {
            const cloudAt = Date.parse(data.updated_at);
            if (cloudAt > localAt + 1000) {
                localStorage.setItem('ragnatale_save', JSON.stringify(data.data));
                localStorage.setItem('ragnatale_save_at', String(cloudAt));
                location.reload();
                return;
            }
        }
        if (localStorage.getItem('ragnatale_save')) { cloudDirty = true; cloudFlush(); }
        cloudFlushTimer = setInterval(cloudFlush, CLOUD_FLUSH_MS);
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') cloudFlush(); });
        window.addEventListener('pagehide', cloudFlush);
    } catch (e) {
        console.warn('Cloud save unavailable, this browser only:', e);
    }
}

// Called after every local save: only marks the save as changed
function cloudSaveSoon() {
    if (!cloudDisabled) cloudDirty = true;
}

// Uploads the save if it changed since the last upload
function cloudFlush() {
    if (!cloudDirty || !cloudClient || !cloudUserId || cloudDisabled) return;
    const json = JSON.stringify(player);
    cloudDirty = false;
    if (json === cloudLastPushed) return;
    cloudLastPushed = json;
    cloudClient.from('saves').upsert({ user_id: cloudUserId, data: player, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) { console.warn('Cloud save failed:', error.message); cloudLastPushed = null; cloudDirty = true; } });
}

// Used by reset: removes the cloud save and stops any pending write
async function cloudDeleteSave() {
    cloudDisabled = true;
    cloudDirty = false;
    clearInterval(cloudFlushTimer);
    if (!cloudClient || !cloudUserId) return;
    try {
        await cloudClient.from('saves').delete().eq('user_id', cloudUserId);
    } catch (e) {
        console.warn('Cloud reset failed:', e);
    }
}
