// ============================================================
//  api.js — klien REST ke Google Apps Script (gas-pro-api + gas-scale-turbo)
// ============================================================
(function () {
  const CFG = window.APP_CONFIG || {};
  const READ = /^(app\.boot|siswa\.boot|preview\.soal|guru\.(dashboard|rekap|pelanggaran|log|live|siswa\.list|soal\.list|pengaturan))$/;
  const inflight = {}; let writeEpoch = 0; const perf = [];
  const urlOk = () => CFG.GAS_URL && !/GANTI|XXXX/.test(CFG.GAS_URL);

  const API = {
    ok: urlOk,
    get token() { return S.token || localStorage.getItem('gq_token') || ''; },
    async post(action, data, opts) {
      opts = opts || {}; const t0 = performance.now();
      if (!urlOk()) throw Object.assign(new Error('Konfigurasi belum lengkap: isi GAS_URL di js/config.js.'), { config: true });
      let res, json;
      try {
        res = await fetch(CFG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, token: API.token, data: data || {} }), keepalive: !!opts.keepalive });
        json = await res.json();
      } catch (err) { throw Object.assign(new Error('Tidak dapat terhubung ke server. Periksa koneksi internet.'), { offline: true }); }
      perf.push({ action, total: Math.round(performance.now() - t0), server: json.ms, cached: !!json.cached });
      if (perf.length > 60) perf.shift();
      if (!json.success && (json.code === 'AUTH')) { App.logout(true, json.message); throw Object.assign(new Error(json.message), { auth: true }); }
      return json;
    },
    // pemanggilan umum: baca di-dedupe selama in-flight, tulis menaikkan epoch
    async call(action, data, opts) {
      if (!READ.test(action)) { writeEpoch++; return API.post(action, data, opts); }
      const k = writeEpoch + '|' + action + '|' + JSON.stringify(data || {});
      if (inflight[k]) return inflight[k];
      const p = API.post(action, data, opts); inflight[k] = p;
      const done = () => { delete inflight[k]; }; p.then(done, done); return p;
    },
    // ambil data, lempar bila gagal
    async data(action, data, opts) {
      const r = await API.call(action, data, opts);
      if (!r.success) throw new Error(r.message || 'Permintaan gagal.');
      return r.data;
    },
    // SWR: tampilkan cache lokal dulu, lalu segarkan
    async swr(action, data, maxAgeMs, render) {
      const key = 'gq_swr_' + (S.me ? S.me.id : 'x') + '_' + action + JSON.stringify(data || {});
      let hit = null; try { hit = JSON.parse(localStorage.getItem(key)); } catch (e) {}
      if (hit && render) render(hit.d, true);
      if (hit && Date.now() - hit.t < (maxAgeMs || 0)) return hit.d;
      const d = await API.data(action, data);
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (e) {}
      if (render) render(d, false); return d;
    },
    warm(scope) { if (!urlOk()) return; const k = 'gq_warm_' + scope; if (Date.now() - Number(sessionStorage.getItem(k) || 0) < 240000) return; sessionStorage.setItem(k, Date.now()); fetch(CFG.GAS_URL + '?w=' + scope, { mode: 'no-cors' }).catch(() => {}); },
    perf() { console.table(perf); return perf; }
  };

  // ---------- Log aktivitas: dikumpulkan lalu dikirim per batch ----------
  const Track = {
    buf: [], cur: null, timer: null,
    page(path) {
      if (S.role !== 'siswa') return; const now = Date.now();
      if (Track.cur) Track.push(Track.cur.a, Track.cur.h, Math.round((now - Track.cur.t) / 1000));
      Track.cur = { t: now, a: Track.label(path), h: path };
    },
    label(p) { const m = { '/beranda': 'Beranda', '/materi': 'Daftar materi', '/asesmen': 'Hub asesmen', '/nilai': 'Nilai saya' }; if (m[p]) return m[p]; if (/^\/materi\//.test(p)) return 'Belajar materi ' + p.split('/')[2]; return p; },
    push(a, h, d) { Track.buf.push({ t: Date.now(), a, h, d }); if (Track.buf.length >= 25) Track.flush(); },
    async flush(keep) {
      if (S.role !== 'siswa' || !Track.buf.length) return;
      if (Track.cur) { const now = Date.now(); Track.buf.push({ t: now, a: Track.cur.a, h: Track.cur.h, d: Math.round((now - Track.cur.t) / 1000) }); Track.cur.t = now; }
      const ev = Track.buf.splice(0, 50);
      try { await API.post('log.batch', { events: ev }, { keepalive: !!keep }); } catch (e) { Track.buf = ev.concat(Track.buf).slice(0, 100); }
    },
    start() { clearInterval(Track.timer); Track.timer = setInterval(() => { if (document.visibilityState === 'visible') Track.flush(); }, 45000); },
    stop() { clearInterval(Track.timer); Track.buf = []; Track.cur = null; }
  };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Track.flush(true); });
  window.addEventListener('pagehide', () => Track.flush(true));
  window.API = API; window.Track = Track;
})();
