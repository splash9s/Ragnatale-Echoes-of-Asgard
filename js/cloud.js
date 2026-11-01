// Cloud save (Supabase). Local save in localStorage still works when the cloud is unreachable.
const SUPABASE_URL = 'https://krtzvossvqddhveozcnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydHp2b3NzdnFkZGh2ZW96Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjQ2NjMsImV4cCI6MjEwODE0MDY2M30.s1DTBfhoLjfokEZuiLuZXfIGXJBqcPfz3IteWmAAvUY';

let cloudClient = null;
let cloudUserId = null;
let cloudSaveTimer = null;
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
        if (localStorage.getItem('ragnatale_save')) cloudSaveNow();
    } catch (e) {
        console.warn('Cloud save unavailable, this browser only:', e);
    }
}

function cloudSaveNow() {
    if (!cloudClient || !cloudUserId || cloudDisabled) return;
    cloudClient.from('saves').upsert({ user_id: cloudUserId, data: player, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.warn('Cloud save failed:', error.message); });
}

// Called after every local save; writes to the cloud 2 seconds after the last change
function cloudSaveSoon() {
    if (cloudDisabled) return;
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(cloudSaveNow, 2000);
}

// Used by reset: removes the cloud save and stops any pending write
async function cloudDeleteSave() {
    cloudDisabled = true;
    clearTimeout(cloudSaveTimer);
    if (!cloudClient || !cloudUserId) return;
    try {
        await cloudClient.from('saves').delete().eq('user_id', cloudUserId);
    } catch (e) {
        console.warn('Cloud reset failed:', e);
    }
}
