// ==========================================
// DEVELOPER DASHBOARD
// Loaded only when the server says the signed-in account is the owner (cloud.js: cloudCheckAdmin).
// All data comes from the admin_* functions in supabase/admin.sql, which refuse everyone else.
// Styles are inline so the panel does not depend on the page's stylesheet.
// ==========================================
(function () {
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const when = s => s ? new Date(s).toLocaleString() : '';
    const box = 'background:#1a1410;border:1px solid #6b5230;border-radius:8px;padding:10px;';
    const th = 'text-align:left;padding:4px 8px;border-bottom:1px solid #6b5230;color:#f5c451;';
    const td = 'padding:4px 8px;border-bottom:1px solid #332614;';

    let panel = null;

    function stat(label, value) {
        return `<div style="${box}"><div style="font-size:12px;color:#c9b48a;">${esc(label)}</div><div style="font-size:22px;font-weight:700;">${esc(value)}</div></div>`;
    }
    function grid(items) {
        return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;">${items.join('')}</div>`;
    }
    function section(title, html) {
        return `<h3 style="color:#f5c451;margin:16px 0 8px;font-size:16px;">${esc(title)}</h3>${html}`;
    }
    function kv(obj) {
        return Object.keys(obj || {}).map(k => `${k}: ${obj[k]}`).join(' · ') || 'none';
    }

    async function fetchAll() {
        const [ov, users, sus] = await Promise.all([
            cloudClient.rpc('admin_overview'),
            cloudClient.rpc('admin_users', { p_limit: 50 }),
            cloudClient.rpc('admin_suspicious', { p_limit: 50 }),
        ]);
        const errs = [ov, users, sus].filter(r => r.error).map(r => r.error.message);
        return { ov: ov.data || {}, users: users.data || [], sus: sus.data || [], errs };
    }

    function render(d) {
        const o = d.ov;
        const p = o.playtime || {};
        const dp = o.days_played || {};
        const html = [
            section('Players', grid([
                stat('Players', o.players), stat('Saves', o.saves),
                stat('Active 24h', o.active_24h), stat('Active 7 days', o.active_7d),
                stat('Anonymous', (o.by_login || {}).anonymous || 0), stat('Google', (o.by_login || {}).google || 0),
            ])),
            section('Playtime (total per player)', grid([
                stat('Under 10 min', p.under_10_min), stat('Over 10 min', p.over_10_min),
                stat('Under 1 hour', p.under_1_hour), stat('Over 5 hours', p.over_5_hours),
            ])),
            section('Days played (different days)', grid([
                stat('1 day', dp.day_1), stat('2 days', dp.day_2), stat('3 days', dp.day_3),
                stat('4 days', dp.day_4), stat('5 days', dp.day_5), stat('6 days', dp.day_6),
                stat('7 days or more', dp.day_7_plus),
            ])),
            section('Suspicious activity', grid([
                stat('Last 24 hours', o.suspicious_24h),
            ]) + `<div style="font-size:12px;margin-top:6px;color:#c9b48a;">Last 7 days by kind: ${esc(kv(o.suspicious_by_kind))}</div>`),
            section('Recent suspicious events', `<div style="overflow:auto;max-height:260px;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
                <tr><th style="${th}">When</th><th style="${th}">Kind</th><th style="${th}">Player</th><th style="${th}">Detail</th></tr>
                ${d.sus.length ? d.sus.map(e => `<tr><td style="${td}">${esc(when(e.at))}</td><td style="${td}">${esc(e.kind)}</td><td style="${td}">${esc(e.name)}</td><td style="${td}">${esc(e.detail ? JSON.stringify(e.detail) : '')}</td></tr>`).join('') : `<tr><td style="${td}" colspan="4">No events</td></tr>`}
            </table></div>`),
            section('Recent players (latest 50)', `<div style="overflow:auto;max-height:320px;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
                <tr><th style="${th}">Name</th><th style="${th}">Login</th><th style="${th}">Minutes</th><th style="${th}">Days</th><th style="${th}">First seen</th><th style="${th}">Last seen</th></tr>
                ${d.users.length ? d.users.map(u => `<tr><td style="${td}">${esc(u.name)}</td><td style="${td}">${esc(u.login)}</td><td style="${td}">${esc(u.play_minutes)}</td><td style="${td}">${esc(u.days)}</td><td style="${td}">${esc(when(u.first_seen))}</td><td style="${td}">${esc(when(u.last_seen))}</td></tr>`).join('') : `<tr><td style="${td}" colspan="6">No players yet</td></tr>`}
            </table></div>`),
        ].join('');
        const body = panel.querySelector('#dev-body');
        body.innerHTML = (d.errs.length ? `<div style="color:#ff8a8a;margin-bottom:8px;">${esc(d.errs.join(' | '))}</div>` : '') + html;
    }

    async function refresh() {
        const body = panel.querySelector('#dev-body');
        body.innerHTML = '<div style="padding:20px;">Loading…</div>';
        try { render(await fetchAll()); }
        catch (e) { body.innerHTML = `<div style="color:#ff8a8a;">${esc(e.message || e)}</div>`; }
    }

    function open() {
        if (panel) { panel.style.display = 'flex'; refresh(); return; }
        panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.85);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:20px;box-sizing:border-box;';
        panel.innerHTML = `<div style="width:min(1100px,100%);background:#120d09;color:#f5ecd6;border:2px solid #f5c451;border-radius:10px;padding:16px;font-family:sans-serif;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <h2 style="margin:0;color:#f5c451;font-size:20px;">Developer dashboard</h2>
                <div style="display:flex;gap:8px;">
                    <button id="dev-refresh" style="padding:6px 12px;cursor:pointer;">Refresh</button>
                    <button id="dev-close" style="padding:6px 12px;cursor:pointer;">Close</button>
                </div>
            </div>
            <div id="dev-body" style="margin-top:8px;"></div>
        </div>`;
        document.body.appendChild(panel);
        panel.querySelector('#dev-close').onclick = () => { panel.style.display = 'none'; };
        panel.querySelector('#dev-refresh').onclick = refresh;
        refresh();
    }

    const btn = document.createElement('button');
    btn.textContent = 'DEV';
    btn.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;padding:6px 10px;background:#222;color:#f5c451;border:1px solid #f5c451;border-radius:6px;font:700 12px sans-serif;cursor:pointer;';
    btn.onclick = open;
    document.body.appendChild(btn);
})();
