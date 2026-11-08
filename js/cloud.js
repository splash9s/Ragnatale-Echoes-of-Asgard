// Cloud save (Supabase). Local save in localStorage still works when the cloud is unreachable.
// Writes happen only on manual save and when the page is closed or hidden (never on a timer).
const SUPABASE_URL = 'https://krtzvossvqddhveozcnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydHp2b3NzdnFkZGh2ZW96Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjQ2NjMsImV4cCI6MjEwODE0MDY2M30.s1DTBfhoLjfokEZuiLuZXfIGXJBqcPfz3IteWmAAvUY';

let cloudClient = null;
let cloudUserId = null;
let cloudDirty = false;
let cloudLastPushed = null; // JSON of the last save uploaded (or downloaded)
let cloudDisabled = false; // set after a reset so nothing is written back to the cloud
let cloudListening = false; // the save-on-hide listeners are added once

// Creates the Supabase client once (null when the library did not load)
function cloudInitClient() {
    if (cloudClient) return cloudClient;
    if (typeof supabase === 'undefined' || !supabase.createClient) return null;
    cloudClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return cloudClient;
}

// Sync the save for a signed-in player. Reloads once if the cloud save is newer than this browser's.
// A browser with no save and no session is a first play: the sign-in page signs the player in first.
async function cloudStart() {
    if (!cloudInitClient()) return;
    try {
        let { data: { session } } = await cloudClient.auth.getSession();
        if (!session) {
            if (!localStorage.getItem('ragnatale_save')) return; // first play: waiting for the sign-in page
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
        cloudPushProfile();
        if (typeof player !== 'undefined') syncServerMail();
        if (!cloudListening) {
            cloudListening = true;
            document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') cloudFlush(); });
            window.addEventListener('pagehide', cloudFlush);
        }
    } catch (e) {
        console.warn('Cloud save unavailable, this browser only:', e);
    }
}

// First-play sign-in helpers. Each returns false when the cloud is unavailable; the game then continues on this browser only.
async function cloudHasSession() {
    if (!cloudInitClient()) return false;
    try {
        const { data: { session } } = await cloudClient.auth.getSession();
        return !!session;
    } catch (e) { return false; }
}
// Cloudflare Turnstile site key (public). Supabase checks the token against the secret key set in its dashboard.
const TURNSTILE_SITE_KEY = '0x4AAAAAAF4dLDqdgb20d9iY';
let turnstileWidgetId = null;
let turnstileResolve = null;

// Gets a fresh CAPTCHA token from the widget on the sign-in page. Resolves null if it is unavailable or times out.
function cloudCaptchaToken() {
    return new Promise(resolve => {
        const box = document.getElementById('turnstile-box');
        if (!window.turnstile || !box) { resolve(null); return; }
        const finish = (token) => {
            const r = turnstileResolve;
            turnstileResolve = null;
            if (r) r(token);
        };
        turnstileResolve = resolve;
        setTimeout(() => finish(null), 60000);
        if (turnstileWidgetId === null) {
            turnstileWidgetId = turnstile.render(box, {
                sitekey: TURNSTILE_SITE_KEY,
                callback: (token) => finish(token),
                'error-callback': () => finish(null),
                'expired-callback': () => finish(null),
            });
        } else {
            turnstile.reset(turnstileWidgetId);
        }
    });
}

async function cloudSignInAnonymous() {
    if (!cloudInitClient()) return false;
    try {
        const captchaToken = await cloudCaptchaToken();
        if (!captchaToken) throw new Error('CAPTCHA was not completed');
        const r = await cloudClient.auth.signInAnonymously({ options: { captchaToken } });
        if (r.error) throw r.error;
        return true;
    } catch (e) {
        console.warn('Anonymous sign-in failed, this browser only:', e);
        return false;
    }
}
async function cloudSignInGmail() {
    if (!cloudInitClient()) return false;
    try {
        // Google sends the browser back to this page, already signed in
        const { error } = await cloudClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
        if (error) throw error;
        return true;
    } catch (e) {
        console.warn('Gmail sign-in failed, this browser only:', e);
        return false;
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
    cloudPushProfile();
    cloudClient.from('saves').upsert({ user_id: cloudUserId, data: player, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) { console.warn('Cloud save failed:', error.message); cloudLastPushed = null; cloudDirty = true; } });
}

// ---- Friends, player IDs and server mail (needs supabase/friends.sql) ----

// The public card other players see: name, base level and avatar (the friend ID is made by the server)
function cloudPushProfile() {
    if (!cloudClient || !cloudUserId || cloudDisabled || typeof player === 'undefined') return;
    const av = player.avatar || '';
    const avatar = av.startsWith('assets/') || (av.startsWith('data:image') && av.length < 20000) ? av : '';
    cloudClient.from('profiles')
        .upsert({ user_id: cloudUserId, name: String(player.name || 'Hero').slice(0, 20), base_lv: player.baseLv || 1, avatar }, { onConflict: 'user_id' })
        .then(({ error }) => { if (error) console.warn('Profile save failed:', error.message); });
}

// Calls a friends function on the server. Resolves to { data } or { error } with a message the player can read.
async function friendRpc(fn, args) {
    if (!cloudInitClient() || !cloudUserId) return { error: 'Friends need the cloud. Sign in to use them.' };
    try {
        const { data, error } = await cloudClient.rpc(fn, args || {});
        if (error) {
            if (/Could not find the function|does not exist/i.test(error.message || '')) return { error: 'Friends are not set up on the server yet.' };
            return { error: error.message || 'Friends are not available right now.' };
        }
        return { data };
    } catch (e) {
        console.warn('Friends unavailable:', e);
        return { error: 'Friends are not available right now.' };
    }
}

const friendApi = {
    list: () => friendRpc('list_friends'),
    add: (query) => friendRpc('add_friend', { p_query: query }),
    remove: (userId) => friendRpc('remove_friend', { p_friend: userId }),
    sendGift: (userId) => friendRpc('send_friend_gift', { p_friend: userId }),
    restoreStreak: (userId) => friendRpc('restore_friend_streak', { p_friend: userId }),
};

// Copies unclaimed server mail (friend gifts) into the mailbox once. Negative ids keep them apart from local mail.
async function syncServerMail() {
    if (!cloudInitClient() || !cloudUserId || cloudDisabled) return false;
    try {
        const { data, error } = await cloudClient.from('mail')
            .select('id, title, sender, message, rewards, sent_at')
            .eq('recipient_id', cloudUserId).is('claimed_at', null)
            .order('sent_at', { ascending: true }).limit(100);
        if (error) throw error;
        if (!Array.isArray(player.mailBox)) player.mailBox = [];
        let added = 0;
        for (const row of data || []) {
            const id = -Number(row.id);
            if (player.mailBox.some(m => m.id === id)) continue;
            player.mailBox.unshift({ id, serverId: Number(row.id), title: row.title, sender: row.sender, message: row.message, rewards: row.rewards || {}, claimed: false, sentAt: Date.parse(row.sent_at) || Date.now() });
            added++;
        }
        if (added) {
            if (typeof renderMailBox === 'function') renderMailBox();
            if (typeof updateTownAlerts === 'function') updateTownAlerts();
        }
        return added > 0;
    } catch (e) {
        console.warn('Mail sync unavailable:', e);
        return false;
    }
}

// Marks a server mail as claimed and returns the rewards the server stored for it.
// Resolves to { rewards } or { error }. A mail already claimed on another device gives empty rewards.
async function claimServerMail(serverId) {
    if (!cloudInitClient() || !cloudUserId) return { error: 'Mail needs the cloud. Sign in to claim it.' };
    try {
        const { data, error } = await cloudClient.rpc('claim_mail', { p_id: serverId });
        if (error) {
            if (/not claimable/i.test(error.message || '')) return { rewards: {} };
            return { error: error.message || 'Could not claim this mail right now.' };
        }
        return { rewards: data || {} };
    } catch (e) {
        console.warn('Claim unavailable:', e);
        return { error: 'Could not claim this mail right now.' };
    }
}

// Used by reset: removes the cloud save, signs this browser out and stops any pending write.
// Signing out makes the next start show the sign-in page again.
async function cloudDeleteSave() {
    cloudDisabled = true;
    cloudDirty = false;
    if (!cloudClient) return;
    try {
        if (cloudUserId) await cloudClient.from('saves').delete().eq('user_id', cloudUserId);
        await cloudClient.auth.signOut({ scope: 'local' });
    } catch (e) {
        console.warn('Cloud reset failed:', e);
    }
}
