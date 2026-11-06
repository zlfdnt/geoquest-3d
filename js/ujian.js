// ============================================================
//  ujian.js — Kuis Formatif 2 (umpan balik per soal) & Simulasi TKA Sumatif (mode terkunci)
// ============================================================
(function () {
  const L = ['A', 'B', 'C', 'D', 'E', 'F'];
  const JENIS = { keluar_layar_penuh: ['Keluar dari layar penuh', '🖥️'], pindah_tab: ['Berpindah tab/aplikasi', '🔀'], screenshot: ['Mencoba mengambil screenshot', '📸'], copy_paste: ['Mencoba menyalin/menempel teks soal', '📋'] };
  const PRIO = { keluar_layar_penuh: 3, screenshot: 2, copy_paste: 2, pindah_tab: 1 };
  const tabelHtml = (t) => !t ? '' : '<div class="tbl-wrap"><table class="wtable"><thead><tr>' + t.kolom.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + t.baris.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const wacanaHtml = (w, no) => !w ? '' : '<div class="wacana"><div class="row between wrap gap"><span class="chip chip-lav">📖 ' + esc(w.judul) + '</span><span class="muted sm">' + esc(w.tema || '') + '</span></div><div class="prose">' + w.isi + '</div>' + tabelHtml(w.tabel) + (w.catatan ? '<div class="note">ⓘ ' + esc(w.catatan) + '</div>' : '') + '</div>';
  const opsiHtml = (q, val, locked, fb) => '<div class="opts" role="' + (q.tipe === 'PGK' ? 'group' : 'radiogroup') + '">' + q.opsi.map((o, i) => {
    const on = q.tipe === 'PGK' ? Array.isArray(val) && val.indexOf(i) >= 0 : val === i, cls = ['opt', on ? 'on' : '', q.tipe === 'PGK' ? 'cb' : 'rb'];
    if (fb) { if (fb.kunci.indexOf(i) >= 0) cls.push('good'); else if (on) cls.push('bad'); }
    return '<button type="button" class="' + cls.join(' ') + '" data-i="' + i + '"' + (locked ? ' disabled' : '') + ' role="' + (q.tipe === 'PGK' ? 'checkbox' : 'radio') + '" aria-checked="' + on + '"><span class="ck"></span><span class="ol">' + L[i] + '</span><span class="ot">' + esc(o) + '</span></button>';
  }).join('') + '</div>';
  const setVal = (q, cur, i) => { if (q.tipe === 'PGK') { const a = Array.isArray(cur) ? cur.slice() : []; const k = a.indexOf(i); k >= 0 ? a.splice(k, 1) : a.push(i); a.sort(); return a.length ? a : undefined; } return i; };
  const hasVal = (v) => v !== undefined && v !== null && !(Array.isArray(v) && !v.length);

  // ===================== KUIS (Formatif 2 & pratinjau tamu) =====================
  function kuis(host, cfg) {
    const soal = cfg.soal, st = { i: 0, jaw: {}, fb: {}, busy: false };
    function view() {
      const q = soal[st.i], fb = st.fb[q.id], w = q.wacana_id && cfg.wacana[q.wacana_id];
      host.innerHTML = '<div class="kuis"><div class="card pad"><div class="row between wrap gap"><div><span class="chip ' + (cfg.badgeCls || 'chip-teal') + '">' + esc(cfg.badge) + '</span><h2 class="h2 mt">' + esc(cfg.judul) + '</h2></div><span class="chip chip-navy">Soal <b>' + (st.i + 1) + '</b>/' + soal.length + '</span></div><div class="pb mt"><i style="width:' + ((st.i + (fb ? 1 : 0)) / soal.length * 100) + '%"></i></div></div>' +
        '<div class="card pad mt">' + (w ? wacanaHtml(w) : '') + '<div class="row between wrap gap"><span class="chip chip-teal">' + esc(q.topik) + '</span><span class="muted sm">Bobot ' + q.bobot + ' poin</span></div><p class="q-text mt">' + esc(q.teks) + '</p>' + (q.tipe === 'PGK' ? '<span class="chip chip-lav">Pilih lebih dari satu jawaban</span>' : '') + opsiHtml(q, st.jaw[q.id], !!fb, fb) +
        (fb ? '<div class="fb ' + (fb.benar ? 'ok' : 'no') + '"><b>' + (fb.benar ? '✅ Benar!' : '❌ Belum tepat.') + '</b><p>' + esc(fb.pembahasan) + '</p></div>' : '') +
        '<div class="row between mt gap"><button class="btn btn-ghost" id="k-prev"' + (st.i ? '' : ' disabled') + '>← Sebelumnya</button>' + (!fb ? '<button class="btn btn-primary fx-btn" id="k-cek"' + (hasVal(st.jaw[q.id]) ? '' : ' disabled') + '>Periksa Jawaban</button>' : '<button class="btn btn-primary fx-btn" id="k-next">' + (st.i === soal.length - 1 ? 'Selesai 🏁' : 'Berikutnya →') + '</button>') + '</div></div></div>';
      host.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => { st.jaw[q.id] = setVal(q, st.jaw[q.id], +b.dataset.i); view(); }));
      const $c = host.querySelector('#k-cek'); if ($c) $c.onclick = async () => { $c.disabled = true; try { st.fb[q.id] = await cfg.check(q, st.jaw[q.id]); st.jaw[q.id] = st.fb[q.id].dipilih !== undefined ? st.fb[q.id].dipilih : st.jaw[q.id]; } catch (e) { U.toast(e.message, 'err'); $c.disabled = false; return; } Sfx.play(st.fb[q.id].benar ? 'correct' : 'wrong'); if (st.fb[q.id].benar) { const r = $c.getBoundingClientRect(); FX.confetti(r.left + r.width / 2, r.top); } view(); };
      const $n = host.querySelector('#k-next'); if ($n) $n.onclick = () => st.i === soal.length - 1 ? done() : (st.i++, view());
      const $p = host.querySelector('#k-prev'); if ($p) $p.onclick = () => { st.i--; view(); };
      FX.scan(host);
    }
    async function done() {
      host.innerHTML = '<div class="card center pad"><div class="spin"></div><p>Menghitung nilai…</p></div>';
      let h; try { h = await cfg.finish(st.jaw, st.fb); } catch (e) { host.innerHTML = '<div class="card center pad"><p>' + esc(e.message) + '</p><button class="btn btn-primary" id="k-retry">Coba kirim lagi</button></div>'; host.querySelector('#k-retry').onclick = done; return; }
      host.innerHTML = '<div class="card result center pad"><div class="medal">' + (h.skor >= (h.kkm || 75) ? '🏆' : '⭐') + '</div><h2 class="h2">' + esc(cfg.selesaiJudul) + '</h2><div class="score-big" data-count="' + h.skor + '">0</div><p class="muted">' + h.benar + ' dari ' + h.total + ' soal benar</p>' + (h.resmi !== undefined ? '<span class="chip ' + (h.resmi ? 'chip-teal' : 'chip-lav') + '">' + (h.resmi ? 'Nilai resmi terkunci' : 'Latihan — nilai resmi tidak berubah') + '</span>' : '<span class="chip chip-lav">Mode pratinjau — hasil tidak disimpan</span>') +
        '<div class="review">' + soal.map((q, k) => '<span class="rv ' + (st.fb[q.id] && st.fb[q.id].benar ? 'ok' : 'no') + '">' + (k + 1) + '</span>').join('') + '</div><div class="row gap center wrap">' + cfg.akhir + '</div></div>';
      FX.scan(host); if (h.skor >= (h.kkm || 75)) FX.confetti();
    }
    view();
  }
  async function kuisF2(host, att) {
    if (att.draft && att.draft.jawaban) { /* jawaban pertama tersimpan server; lanjutkan dari awal tampilan */ }
    kuis(host, { soal: att.soal, wacana: att.wacana, judul: 'Kuis Numerasi Bangun Ruang', badge: att.resmiNanti ? 'Formatif 2 · Nilai resmi' : 'Formatif 2 · Latihan', check: (q, a) => API.data('asesmen.jawab', { attemptId: att.attemptId, soalId: q.id, jawaban: a }),
      finish: async (jaw) => { const h = await API.data('asesmen.kumpul', { attemptId: att.attemptId, jawaban: jaw }); await App.refresh(); return h; }, selesaiJudul: 'Kuis Numerasi selesai!', akhir: '<button class="btn btn-ghost" data-go="/asesmen">Kembali ke Asesmen</button><button class="btn btn-primary fx-btn" data-act="mulai" data-j="F2">Latihan lagi</button>' });
  }
  async function kuisPreview(host) {
    host.innerHTML = '<div class="card center pad"><div class="spin"></div></div>';
    const d = await API.data('preview.soal', {}); const hasil = {};
    kuis(host, { soal: d.soal, wacana: d.wacana, judul: 'Contoh Soal Asesmen', badge: 'Mode Tamu · Pratinjau', badgeCls: 'chip-lav', check: async (q, a) => { const r = await API.data('preview.cek', { soalId: q.id, jawaban: a }); hasil[q.id] = r.benar; return r; },
      finish: async (jaw, fb) => { const b = d.soal.filter(q => fb[q.id] && fb[q.id].benar).length; return { skor: Math.round(b / d.soal.length * 100), benar: b, total: d.soal.length }; }, selesaiJudul: 'Pratinjau selesai!', akhir: '<button class="btn btn-ghost" data-go="/materi">Jelajahi Materi</button><button class="btn btn-primary fx-btn" data-act="login">Masuk untuk Simpan Nilai</button>' });
  }

  // ===================== UJIAN SUMATIF (mode terkunci) =====================
  function ujian(host, att) {
    const soal = att.soal, wac = att.wacana, batas = att.batas, set = S.set || {};
    const st = { cur: 0, jaw: Object.assign({}, att.draft && att.draft.jawaban), ragu: Object.assign({}, att.draft && att.draft.ragu), tab: 'soal', lang: att.pelanggaran || 0, started: false, finished: false, modalOpen: false, endAt: 0, dirty: false, resumeAt: 0, submitting: false };
    const docEl = document.documentElement, fsOK = !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen), fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
    const qKey = 'gq_vq_' + att.attemptId; let actx = null, tick = null, saveT = null, autoT = null, retryT = null, pend = null, pendT = null;

    // ---------- layar pembuka ----------
    function intro() {
      FX.hideWA(true);
      host.innerHTML = '<div class="card pad intro"><span class="chip chip-navy">🔒 Mode Terkunci</span><h2 class="h2 mt">Simulasi TKA Matematika Kelas 9</h2><p class="muted">' + soal.length + ' soal · ' + Math.round(att.durasi / 60) + ' menit · ' + (att.resmiNanti ? 'percobaan pertama = <b>nilai resmi</b>' : 'percobaan latihan (nilai resmi tidak berubah)') + '</p><ul class="rules"><li>🖥️ Ujian berjalan di <b>layar penuh</b>. Keluar dari layar penuh dihitung pelanggaran.</li><li>🔀 Berpindah tab atau aplikasi, mencoba <b>screenshot</b>, atau <b>menyalin teks soal</b> juga dihitung pelanggaran dan membunyikan alarm.</li><li>⚠️ Maksimal <b>' + batas + ' pelanggaran</b>. Pelanggaran ke-' + batas + ' mengakhiri ujian otomatis dan jawabanmu dikumpulkan.</li><li>📶 Jika koneksi terputus, jawaban disimpan di perangkat dan dikirim ulang saat tersambung.</li>' + (fsOK ? '' : '<li>📱 Perangkat ini tidak mendukung layar penuh web. Aktifkan <b>Akses Terpandu (Guided Access)</b> atau mode kiosk atas arahan guru.</li>') + '</ul>' +
        (st.lang ? '<div class="note warn">Kamu melanjutkan ujian yang sedang berjalan. Pelanggaran sebelumnya: <b>' + st.lang + '/' + batas + '</b>.</div>' : '') + '<div class="row gap mt wrap"><button class="btn btn-ghost" data-go="/asesmen">Batal</button><button class="btn btn-primary fx-btn big" id="u-start">' + (att.sisaDetik < att.durasi ? 'Lanjutkan Ujian' : 'Mulai Ujian') + ' →</button></div></div>';
      host.querySelector('#u-start').onclick = start;
    }
    async function start() {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
      if (fsOK) { try { await (docEl.requestFullscreen ? docEl.requestFullscreen({ navigationUI: 'hide' }) : docEl.webkitRequestFullscreen()); } catch (e) { U.toast('Izinkan layar penuh untuk memulai ujian.', 'err'); return; } }
      S.lockPath = (location.hash || '').replace(/^#/, '').split('?')[0]; st.started = true; st.endAt = performance.now() + att.sisaDetik * 1000; FX.setExam(true); document.body.classList.add('in-exam');
      attach(); render(); tick = setInterval(tickFn, 250); autoT = setInterval(save, 20000); retryT = setInterval(flushQ, 8000); flushQ();
    }

    // ---------- tampilan ujian ----------
    function counts() { let a = 0, r = 0; soal.forEach(q => { if (hasVal(st.jaw[q.id])) a++; if (st.ragu[q.id]) r++; }); return { a, r, k: soal.length - a }; }
    function render() {
      const q = soal[st.cur], w = q.wacana_id && wac[q.wacana_id], c = counts();
      host.innerHTML = '<div class="exam"><header class="ex-head"><div class="ex-title"><span class="ex-ic">🧮</span><div><h1>TKA SIMULASI • MATEMATIKA KELAS 9</h1><p><span>' + esc(set.NAMA_SEKOLAH || 'SMP') + '</span> • <b class="gold" id="x-ans">Terjawab ' + c.a + '/' + soal.length + ' Soal</b> • <span class="grn">● Layar Penuh ' + (fsOK ? 'Aktif' : 'Tidak tersedia') + ' • Mode Terkunci</span></p></div></div><div class="ex-right"><span class="pill-dark" id="x-lang">🛡 Pelanggaran: ' + st.lang + '/' + batas + '</span><span class="timer" id="x-time">--:--</span></div></header>' +
        '<div class="integrity">🛡️ <span>Sistem Integritas Aktif: pindah tab atau keluar layar penuh akan tercatat otomatis. Toleransi pelanggaran: <b id="x-tol">' + st.lang + '/' + batas + '</b></span><a href="#" id="x-rules">Cek Aturan</a></div>' +
        (w ? '<div class="ex-tabs"><button data-t="wacana" class="' + (st.tab === 'wacana' ? 'on' : '') + '">📖 Wacana</button><button data-t="soal" class="' + (st.tab === 'soal' ? 'on' : '') + '">❓ Soal No. ' + (st.cur + 1) + '</button></div>' : '') +
        '<main class="ex-main ' + (w ? 'two' : 'one') + ' tab-' + st.tab + '">' + (w ? '<section class="card pad ex-wac">' + wacanaHtml(w) + '</section>' : '') + '<section class="card pad ex-q"><div class="row between wrap gap"><div class="row gap center"><h2 class="h2 nm">Soal ' + (st.cur + 1) + '</h2><span class="chip chip-gray">' + esc(q.topik) + '</span></div><b class="bobot">Bobot: ' + q.bobot + ' Poin</b></div><div class="pb"><i style="width:' + ((st.cur + 1) / soal.length * 100) + '%"></i></div><p class="q-text">' + esc(q.teks) + '</p>' + (q.tipe === 'PGK' ? '<span class="chip chip-lav">Pilih lebih dari satu jawaban (Pilihan Ganda Kompleks)</span>' : '') + opsiHtml(q, st.jaw[q.id], false) + (w ? '<button class="btn btn-ghost sm only-m" data-t="wacana">👁 Buka teks wacana dan tabel data</button>' : '') + '</section></main>' +
        '<section class="card pad ex-nav"><div class="row between wrap gap"><span class="muted sm">👆 Kamu boleh mengerjakan soal yang mana saja lebih dulu — ketuk nomor soal.</span><span class="legend"><i class="d-ok"></i>Terjawab <i class="d-rg"></i>Ragu-ragu <i class="d-ac"></i>Aktif <i class="d-no"></i>Belum</span></div><div class="q-nav">' + soal.map((s, i) => '<button data-n="' + i + '" class="' + (i === st.cur ? 'act' : '') + (st.ragu[s.id] ? ' rg' : hasVal(st.jaw[s.id]) ? ' ok' : '') + '" aria-label="Soal ' + (i + 1) + '">' + (i + 1) + '</button>').join('') + '</div></section>' +
        '<footer class="ex-act"><button class="btn btn-soft" id="x-prev"' + (st.cur ? '' : ' disabled') + '><span>← <span class="hm">Sebelumnya</span></span></button><label class="ragu' + (st.ragu[q.id] ? ' on' : '') + '"><input type="checkbox" id="x-rg"' + (st.ragu[q.id] ? ' checked' : '') + '><span>Ragu-ragu</span></label><span class="sp"></span><button class="btn btn-primary fx-btn" id="x-next"' + (st.cur === soal.length - 1 ? ' disabled' : '') + '>Selanjutnya →</button><button class="btn btn-navy fx-btn" id="x-sub"><span>🔒 Kumpulkan <span class="hm">Ujian </span>(<span id="x-kos">' + c.k + '</span> belum dijawab)</span></button></footer></div>';
      bind(q); tickFn();
    }
    function bind(q) {
      host.querySelectorAll('.opt').forEach(b => b.onclick = () => { const v = setVal(q, st.jaw[q.id], +b.dataset.i); if (v === undefined) delete st.jaw[q.id]; else st.jaw[q.id] = v; st.dirty = true; sched(); render(); });
      host.querySelectorAll('.q-nav button').forEach(b => b.onclick = () => { st.cur = +b.dataset.n; st.tab = 'soal'; render(); });
      host.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { st.tab = b.dataset.t; render(); });
      host.querySelector('#x-prev').onclick = () => { st.cur--; st.tab = 'soal'; render(); };
      host.querySelector('#x-next').onclick = () => { st.cur++; st.tab = 'soal'; render(); };
      host.querySelector('#x-rg').onchange = (e) => { if (e.target.checked) st.ragu[q.id] = 1; else delete st.ragu[q.id]; st.dirty = true; sched(); render(); };
      host.querySelector('#x-sub').onclick = confirmSubmit;
      host.querySelector('#x-rules').onclick = (e) => { e.preventDefault(); rulesModal(); };
    }
    function tickFn() {
      const e = host.querySelector('#x-time'); if (!e || !st.started) return;
      const s = Math.max(0, Math.ceil((st.endAt - performance.now()) / 1000)); e.textContent = U.pad(Math.floor(s / 60)) + ':' + U.pad(s % 60);
      e.classList.toggle('urgent', s < 300);
      if (s <= 0 && !st.finished && !st.submitting) final('waktu habis');
    }
    function rulesModal() { U.modal('<h3 class="h3">Aturan Ujian</h3><ul class="rules"><li>Tetap di layar penuh dan jangan berpindah tab/aplikasi.</li><li>Dilarang screenshot dan menyalin teks soal.</li><li>Maksimal ' + batas + ' pelanggaran; ke-' + batas + ' mengakhiri ujian.</li><li>Jawabanmu tersimpan otomatis.</li></ul><div class="row end"><button class="btn btn-primary" onclick="U.closeModal()">Mengerti</button></div>'); }

    // ---------- simpan otomatis ----------
    function sched() { clearTimeout(saveT); saveT = setTimeout(save, 2500); }
    async function save() {
      if (!st.dirty || st.finished) return; st.dirty = false;
      try { localStorage.setItem('gq_draft_' + att.attemptId, JSON.stringify({ jaw: st.jaw, ragu: st.ragu })); } catch (e) {}
      try { const r = await API.post('ujian.simpan', { attemptId: att.attemptId, jawaban: st.jaw, ragu: st.ragu }); if (r.success && r.data.selesai && r.data.hasil) result(r.data.hasil); else if (r.success && typeof r.data.sisaDetik === 'number') st.endAt = performance.now() + r.data.sisaDetik * 1000; } catch (e) { st.dirty = true; }
    }

    // ---------- anti kecurangan ----------
    const L2 = {};
    function attach() {
      L2.fs = () => { if (fsOK && st.started && !st.finished && !fsEl()) incident('keluar_layar_penuh'); };
      L2.vis = () => { if (document.hidden) incident('pindah_tab'); };
      L2.blur = () => { if (!document.hidden) setTimeout(() => { if (!document.hasFocus() && !st.modalOpen) incident('pindah_tab'); }, 120); };
      L2.key = (e) => {
        const k = (e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
        if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && ['3', '4', '5', 's'].indexOf(k) >= 0) || (e.key === 'Meta' && false)) { e.preventDefault(); incident('screenshot'); try { navigator.clipboard.writeText(' ').catch(function () {}); } catch (x) {} }
        else if (mod && ['c', 'x', 'v', 'a'].indexOf(k) >= 0) { e.preventDefault(); incident('copy_paste'); }
        else if (mod && ['p', 's', 'u'].indexOf(k) >= 0 || e.key === 'F12' || (mod && e.shiftKey && ['i', 'j', 'c'].indexOf(k) >= 0)) { e.preventDefault(); if (k === 'p') incident('screenshot'); }
      };
      L2.keyup = (e) => { if (e.key === 'PrintScreen') incident('screenshot'); };
      L2.clip = (e) => { e.preventDefault(); incident('copy_paste'); };
      L2.stop = (e) => e.preventDefault();
      L2.unload = (e) => { if (!st.finished) { e.preventDefault(); e.returnValue = ''; } };
      document.addEventListener('fullscreenchange', L2.fs); document.addEventListener('webkitfullscreenchange', L2.fs); document.addEventListener('visibilitychange', L2.vis); window.addEventListener('blur', L2.blur);
      document.addEventListener('keydown', L2.key, true); document.addEventListener('keyup', L2.keyup, true); ['copy', 'cut', 'paste'].forEach(t => document.addEventListener(t, L2.clip, true));
      document.addEventListener('contextmenu', L2.stop); document.addEventListener('dragstart', L2.stop); window.addEventListener('beforeunload', L2.unload); window.addEventListener('online', flushQ);
    }
    function detach() {
      document.removeEventListener('fullscreenchange', L2.fs); document.removeEventListener('webkitfullscreenchange', L2.fs); document.removeEventListener('visibilitychange', L2.vis); window.removeEventListener('blur', L2.blur);
      document.removeEventListener('keydown', L2.key, true); document.removeEventListener('keyup', L2.keyup, true); ['copy', 'cut', 'paste'].forEach(t => document.removeEventListener(t, L2.clip, true));
      document.removeEventListener('contextmenu', L2.stop); document.removeEventListener('dragstart', L2.stop); window.removeEventListener('beforeunload', L2.unload); window.removeEventListener('online', flushQ);
    }
    function incident(type) {                                  // gabungkan kejadian beruntun (mis. keluar layar penuh + blur) menjadi satu pelanggaran
      if (!st.started || st.finished || st.modalOpen || st.submitting || Date.now() < st.resumeAt) return;
      if (pend) { if (PRIO[type] > PRIO[pend]) pend = type; return; }
      pend = type; pendT = setTimeout(() => { const t = pend; pend = null; commit(t); }, 600);
    }
    function alarm() {
      try { navigator.vibrate && navigator.vibrate([250, 120, 250, 120, 400]); } catch (e) {}
      if (!actx) return; try {
        actx.resume(); const t0 = actx.currentTime;
        for (let i = 0; i < 6; i++) { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.value = i % 2 ? 660 : 920; g.gain.setValueAtTime(0.0001, t0 + i * 0.22); g.gain.exponentialRampToValueAtTime(0.22, t0 + i * 0.22 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.22 + 0.2); o.connect(g); g.connect(actx.destination); o.start(t0 + i * 0.22); o.stop(t0 + i * 0.22 + 0.21); }
      } catch (e) {}
    }
    function queue(item) { let q = []; try { q = JSON.parse(localStorage.getItem(qKey) || '[]'); } catch (e) {} q.push(item); localStorage.setItem(qKey, JSON.stringify(q)); }
    async function commit(jenis) {
      st.lang++; const uid = att.attemptId + '-' + st.lang + '-' + Date.now().toString(36); st.modalOpen = true; alarm(); const sisa = batas - st.lang;
      const last = st.lang >= batas; if (document.getElementById('x-lang')) { document.getElementById('x-lang').textContent = '🛡 Pelanggaran: ' + st.lang + '/' + batas; document.getElementById('x-tol').textContent = st.lang + '/' + batas; }
      showViolation(jenis, st.lang, sisa, last);
      const item = { uid, jenis, jawaban: st.jaw };
      try { const r = await API.post('ujian.langgar', Object.assign({ attemptId: att.attemptId }, item)); if (r.success) { if (r.data.berakhir) { result(r.data.hasil); return; } st.lang = r.data.nomor; } else throw new Error(r.message); } catch (e) { queue(item); if (last) { endOffline(); } }
    }
    function showViolation(jenis, n, sisa, last) {
      const j = JENIS[jenis] || JENIS.pindah_tab;
      U.modal('<div class="vio"><div class="vio-head"><span class="vio-ic">🚨</span><div><h3>PELANGGARAN TERDETEKSI</h3><p>' + j[1] + ' ' + j[0] + '</p></div></div><div class="vio-body"><div class="strike">Pelanggaran <b>' + n + '</b> dari <b>' + batas + '</b></div><div class="dots-s">' + Array.from({ length: batas }, (_, i) => '<i class="' + (i < n ? 'on' : '') + '"></i>').join('') + '</div>' +
        (last ? '<p><b>Batas pelanggaran tercapai.</b> Ujian diakhiri otomatis dan jawabanmu sedang dikumpulkan…</p><div class="spin sm"></div>' : '<p>Sisa toleransi: <b>' + sisa + ' kali lagi</b>. Pelanggaran ke-' + batas + ' akan mengakhiri ujianmu.</p><button class="btn btn-primary fx-btn big" id="v-back" autofocus>' + (fsOK ? '🖥️ Kembali ke Layar Penuh' : 'Kembali ke Ujian') + '</button>') + '</div></div>', { locked: true, cls: 'modal-vio' });
      const b = document.getElementById('v-back'); if (b) b.onclick = async () => { if (fsOK && !fsEl()) { try { await (docEl.requestFullscreen ? docEl.requestFullscreen({ navigationUI: 'hide' }) : docEl.webkitRequestFullscreen()); } catch (e) { U.toast('Ketuk lagi untuk masuk layar penuh.', 'err'); return; } } U.closeModal(); st.modalOpen = false; st.resumeAt = Date.now() + 900; };
    }
    async function flushQ() {
      let q = []; try { q = JSON.parse(localStorage.getItem(qKey) || '[]'); } catch (e) {} if (!q.length) { retryOffline(); return; }
      const rest = []; for (const it of q) { try { const r = await API.post('ujian.langgar', Object.assign({ attemptId: att.attemptId }, it)); if (r.success && r.data.berakhir && !st.finished) { localStorage.setItem(qKey, JSON.stringify(rest)); result(r.data.hasil); return; } if (!r.success) rest.push(it); } catch (e) { rest.push(it); } }
      localStorage.setItem(qKey, JSON.stringify(rest));
    }
    function endOffline() {
      st.finished = true; stopAll(); U.closeModal(); host.innerHTML = '<div class="card pad center"><div class="medal">📡</div><h2 class="h2">Ujian dihentikan</h2><p class="muted">Batas pelanggaran tercapai, tetapi koneksi internet terputus. Jawabanmu aman di perangkat ini dan akan dikirim otomatis saat tersambung kembali. <b>Jangan tutup halaman ini.</b></p><div class="spin"></div></div>';
      const t = setInterval(async () => { await flushQ(); if (!JSON.parse(localStorage.getItem(qKey) || '[]').length) { clearInterval(t); try { const h = await API.data('asesmen.kumpul', { attemptId: att.attemptId, jawaban: st.jaw, alasan: 'pelanggaran' }); result(h); } catch (e) {} } }, 6000);
    }
    function retryOffline() { const p = localStorage.getItem('gq_pending_' + att.attemptId); if (p && !st.submitting && !st.finished) final('selesai', true); }

    // ---------- pengumpulan ----------
    function confirmSubmit() {
      const c = counts(); if (c.k) { /* tetap boleh */ }
      const m = U.modal('<h3 class="h3">Kumpulkan ujian sekarang?</h3><div class="sum"><div><b>' + c.a + '</b><span>Terjawab</span></div><div><b>' + c.r + '</b><span>Ragu-ragu</span></div><div><b class="' + (c.k ? 'bad' : '') + '">' + c.k + '</b><span>Belum dijawab</span></div></div><p class="muted">Setelah dikumpulkan, jawaban tidak dapat diubah.</p><div class="row end gap"><button class="btn btn-ghost" data-r="0">Kembali Periksa</button><button class="btn btn-navy fx-btn" data-r="1" autofocus>Ya, Kumpulkan</button></div>');
      m.addEventListener('click', e => { const r = e.target.closest('[data-r]'); if (r) { U.closeModal(); if (r.dataset.r === '1') final('selesai'); } });
    }
    async function final(alasan, fromPending) {
      if (st.submitting || st.finished) return; st.submitting = true; clearTimeout(saveT); U.closeModal();
      const pl = fromPending ? JSON.parse(localStorage.getItem('gq_pending_' + att.attemptId)) : { attemptId: att.attemptId, jawaban: st.jaw, alasan };
      localStorage.setItem('gq_pending_' + att.attemptId, JSON.stringify(pl));
      U.modal('<div class="center"><div class="spin"></div><p>Mengumpulkan jawaban…</p></div>', { locked: true });
      for (let n = 0; n < 40; n++) { try { const h = await API.data('asesmen.kumpul', pl); localStorage.removeItem('gq_pending_' + att.attemptId); result(h); return; } catch (e) { U.closeModal(); U.modal('<div class="center"><div class="spin"></div><p>Koneksi bermasalah — mencoba lagi… (jawabanmu aman di perangkat)</p></div>', { locked: true }); await new Promise(r => setTimeout(r, 4000)); } }
    }
    function stopAll() { S.lockPath = null; clearInterval(tick); clearInterval(autoT); clearInterval(retryT); clearTimeout(saveT); clearTimeout(pendT); detach(); document.body.classList.remove('in-exam'); FX.setExam(false); FX.hideWA(false); if (fsEl()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} } }
    async function result(h) {
      if (st.finished && host.querySelector('.result')) return; st.finished = true; stopAll(); U.closeModal(); localStorage.removeItem(qKey); localStorage.removeItem('gq_draft_' + att.attemptId);
      await App.refresh().catch(() => {});
      if (h.perluRefleksi) { Refleksi.flow(host, h); return; }
      const stop = h.alasan === 'pelanggaran', lulus = h.skor >= h.kkm;
      host.innerHTML = '<div class="card result center pad"><div class="medal">' + (stop ? '🚨' : lulus ? '🏆' : '⭐') + '</div><h2 class="h2">' + (stop ? 'Ujian dihentikan karena pelanggaran' : h.alasan === 'waktu habis' ? 'Waktu habis — jawaban dikumpulkan' : 'Simulasi TKA selesai!') + '</h2><div class="score-big" data-count="' + h.skor + '">0</div><p class="muted">' + h.benar + ' dari ' + h.total + ' soal benar penuh · waktu ' + U.fmtDur(h.dur) + ' · pelanggaran ' + h.langgar + '/' + batas + '</p><span class="chip ' + (h.resmi ? 'chip-teal' : 'chip-lav') + '">' + (h.resmi ? '🔒 Nilai resmi terkunci' : 'Latihan — nilai resmi tidak berubah') + '</span>' + (stop ? '<p class="muted">Jawaban yang sudah kamu isi tetap dikumpulkan dan dinilai.</p>' : '') + '<p class="muted">KKM: ' + h.kkm + ' · ' + (lulus ? 'Selamat, kamu mencapai KKM! 🎉' : 'Terus berlatih, kamu pasti bisa!') + '</p><div class="row gap center wrap"><button class="btn btn-ghost" data-go="/asesmen">Kembali ke Asesmen</button><button class="btn btn-primary fx-btn" data-go="/nilai">Lihat Nilai Saya</button></div></div>';
      FX.scan(host); if (lulus && !stop) FX.confetti();
    }
    // pulihkan draf lokal bila lebih baru dari server (mis. koneksi putus)
    try { const d = JSON.parse(localStorage.getItem('gq_draft_' + att.attemptId) || 'null'); if (d) { st.jaw = Object.assign({}, d.jaw, st.jaw); st.ragu = Object.assign({}, d.ragu, st.ragu); } } catch (e) {}
    intro();
    return () => { if (!st.finished) { stopAll(); } };
  }
  window.Ujian = { ujian, kuisF2, kuisPreview };
})();
