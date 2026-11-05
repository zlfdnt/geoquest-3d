// ============================================================
//  core.js — helper DOM, state, router, toast, modal
// ============================================================
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const S = { role: 'tamu', me: null, token: '', boot: null, set: {}, data: null, route: null };
  const num = (v) => { const n = Number(v); return isFinite(n) ? n : 0; };
  const pad = (n) => String(n).padStart(2, '0');
  const fmtWaktu = (iso, tglSaja) => {
    if (!iso) return '-'; const d = new Date(iso); if (isNaN(d)) return '-';
    const w = new Date(d.getTime() + (7 * 60 - -d.getTimezoneOffset() ) * 60000 * 0); // tampilkan WIB
    const o = { timeZone: 'Asia/Jakarta', hour12: false };
    const tgl = d.toLocaleDateString('id-ID', Object.assign({ day: '2-digit', month: 'short', year: 'numeric' }, { timeZone: 'Asia/Jakarta' }));
    if (tglSaja) return tgl;
    return tgl + ' ' + d.toLocaleTimeString('id-ID', Object.assign({ hour: '2-digit', minute: '2-digit', second: '2-digit' }, o)).replace(/\./g, ':');
  };
  const jam = (iso) => { const d = new Date(iso); return isNaN(d) ? '-' : d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':') + ' WIB'; };
  const fmtDur = (s) => { s = Math.round(num(s)); if (s < 60) return s + ' dtk'; const m = Math.floor(s / 60); return m < 60 ? m + ' mnt ' + pad(s % 60) + ' dtk' : Math.floor(m / 60) + ' j ' + pad(m % 60) + ' mnt'; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

  // ---------- toast ----------
  function toast(msg, type) {
    let box = $('#toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (type || 'ok'); t.textContent = msg; box.appendChild(t); if (window.Sfx) Sfx.play(type === 'err' ? 'wrong' : 'ping');
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, type === 'err' ? 5000 : 3000);
  }

  // ---------- modal ----------
  function modal(html, opt) {
    opt = opt || {}; closeModal();
    const b = document.createElement('div'); b.className = 'modal-back'; b.id = 'modal';
    b.innerHTML = '<div class="modal ' + (opt.cls || '') + '" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(b); requestAnimationFrame(() => b.classList.add('in')); if (window.Sfx && !opt.cls) Sfx.play('pop');
    if (!opt.locked) b.addEventListener('pointerdown', e => { if (e.target === b) closeModal(); });
    const f = $('[autofocus]', b); if (f) f.focus();
    return b;
  }
  function closeModal() { const m = $('#modal'); if (m) m.remove(); }
  function confirmBox(title, text, okLabel) {
    return new Promise(res => {
      const m = modal('<h3 class="h3">' + esc(title) + '</h3><p class="muted">' + esc(text) + '</p><div class="row end gap"><button class="btn btn-ghost" data-r="0">Batal</button><button class="btn btn-primary fx-btn" data-r="1" autofocus>' + esc(okLabel || 'Ya, lanjut') + '</button></div>');
      m.addEventListener('click', e => { const r = e.target.closest('[data-r]'); if (r) { closeModal(); res(r.dataset.r === '1'); } });
    });
  }
  function loading(on, txt) {
    let l = $('#loading');
    if (!on) { if (l) l.remove(); return; }
    if (!l) { l = document.createElement('div'); l.id = 'loading'; document.body.appendChild(l); }
    l.innerHTML = '<div class="spin"></div><p>' + esc(txt || 'Memuat…') + '</p>';
  }

  // ---------- router (hash) ----------
  const routes = [];
  function route(pattern, fn, opt) { const keys = []; const re = new RegExp('^' + pattern.replace(/:([a-z]+)/g, (_, k) => { keys.push(k); return '([^/?]+)'; }) + '$'); routes.push({ re, keys, fn, opt: opt || {} }); }
  function parseHash() { const h = location.hash.replace(/^#/, '') || '/'; const [path, qs] = h.split('?'); const q = {}; (qs || '').split('&').forEach(p => { if (p) { const [k, v] = p.split('='); q[decodeURIComponent(k)] = decodeURIComponent(v || ''); } }); return { path, q }; }
  let cleanup = null;
  async function render() {
    const { path, q } = parseHash();
    if (S.lockPath && path !== S.lockPath) { history.replaceState(null, '', '#' + S.lockPath); return; }   // ujian berjalan: tidak boleh pindah halaman
    for (const r of routes) {
      const m = path.match(r.re); if (!m) continue;
      const p = {}; r.keys.forEach((k, i) => p[k] = decodeURIComponent(m[i + 1]));
      if (r.opt.role && r.opt.role.indexOf(S.role) < 0) { go(S.role === 'guru' ? '/guru' : S.role === 'siswa' ? '/beranda' : '/'); return; }
      if (typeof cleanup === 'function') { try { cleanup(); } catch (e) {} cleanup = null; }
      S.route = { path, q, p };
      document.body.dataset.page = r.opt.page || '';
      const res = await r.fn(p, q);
      if (typeof res === 'function') cleanup = res;
      window.scrollTo(0, 0); if (window.FX) FX.scan(document);
      if (window.Track) Track.page(path);
      return;
    }
    go('/');
  }
  function go(p) { if (('#' + p) === location.hash) render(); else location.hash = p; }
  window.addEventListener('hashchange', render);

  // delegasi klik: data-go, data-act
  const acts = {};
  function on(name, fn) { acts[name] = fn; }
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g && !g.disabled) { e.preventDefault(); go(g.dataset.go); return; }
    const a = e.target.closest('[data-act]'); if (a && acts[a.dataset.act] && !a.disabled) { e.preventDefault(); acts[a.dataset.act](a, e); }
  });

  window.$ = $; window.$$ = $$; window.esc = esc; window.S = S;
  window.U = { num, pad, fmtWaktu, jam, fmtDur, clamp, rp, toast, modal, closeModal, confirmBox, loading, route, render, go, on, parseHash };
})();
