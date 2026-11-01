// ============================================================
//  siswa.js — halaman tamu & siswa: landing, beranda, materi, asesmen, nilai
// ============================================================
(function () {
  const $v = () => document.getElementById('view');
  const NAMA_KAT = { datar: 'Bangun Ruang Sisi Datar', lengkung: 'Bangun Ruang Sisi Lengkung' };
  const guestKey = 'gq_guest_done';
  const guestDone = () => { try { return JSON.parse(sessionStorage.getItem(guestKey) || '{}'); } catch (e) { return {}; } };
  const isGuest = () => S.role !== 'siswa';
  const done = () => isGuest() ? guestDone() : ((S.data && S.data.progres) || {});
  const nDone = (m) => BAGIAN.filter(b => done()[m.id + '.' + b.id]).length;
  const pctM = (m) => Math.round(nDone(m) / BAGIAN.length * 100);
  const terbuka = (m) => isGuest() || (S.data && S.data.kunci.materiTerbuka[m.idx]);
  const selesaiM = (m) => nDone(m) === BAGIAN.length;
  const nextM = () => MATERI.find(m => terbuka(m) && !selesaiM(m)) || MATERI[0];
  const hasilResmi = (j) => ((S.data && S.data.hasil) || []).filter(h => h.jenis === j && h.resmi && h.status !== 'berjalan')[0];
  function xp() {
    const bag = Object.keys(done()).filter(k => k.indexOf('.') > 0).length; let x = bag * 20;
    ['F1', 'F2'].forEach(j => { if (hasilResmi(j)) x += 60 + Math.round(hasilResmi(j).skor / 10); }); if (hasilResmi('SUM')) x += 120 + Math.round(hasilResmi('SUM').skor);
    return { xp: x, lv: Math.floor(x / 150) + 1, sisa: 150 - (x % 150), pct: (x % 150) / 150 * 100 };
  }
  const warna = { coral: 'chip-coral', lav: 'chip-lav', teal: 'chip-teal', yel: 'chip-yel', sky: 'chip-sky' };

  function imgSlider(m, ids, cls) {
    const v = ids || [0, 1, 2];
    return '<div class="slider ' + (cls || '') + '" data-interval="' + (3200 + m.idx * 230) + '">' + v.map((k, i) => '<div class="slide' + (i === 0 ? ' on' : '') + '"><img loading="lazy" src="' + Art.img(m.id, k) + '" alt="' + esc(m.nama) + ' — ' + ['ilustrasi 3D', 'jaring-jaring', 'contoh kehidupan nyata'][k] + '"></div>').join('') + '<div class="dots"></div></div>';
  }
  function materiCard(m) {
    const open = terbuka(m), p = pctM(m), fin = selesaiM(m), prev = MATERI[m.idx - 1];
    const status = !open ? ['Terkunci', 'chip-gray'] : fin ? ['Selesai ✓', 'chip-teal'] : p > 0 ? ['Sedang Berjalan', 'chip-teal'] : ['Terbuka', 'chip-lav'];
    return '<article class="mcard fx-card reveal ' + (open ? '' : 'locked') + '">' + imgSlider(m) + (open ? '' : '<div class="lockbadge">🔒</div>') + '<span class="chip chip-white tag">Modul ' + m.modul + '</span><div class="mc-body"><div class="row gap wrap"><span class="chip ' + status[1] + '">' + status[0] + '</span><span class="chip ' + warna[m.warna] + '">' + (m.kat === 'datar' ? 'Sisi Datar' : 'Sisi Lengkung') + '</span></div><h3 class="h3">' + esc(m.nama) + '</h3><p class="muted sm">' + esc(m.ringkas) + '</p>' +
      (open ? '<div class="row between sm"><span class="muted">Progres</span><b>' + p + '%</b></div><div class="pb"><i style="width:' + p + '%"></i></div>' : '<p class="sm hint">🔒 Selesaikan materi ' + esc(prev ? prev.nama : '') + ' dulu</p>') +
      '<button class="btn ' + (open ? (p > 0 ? 'btn-primary' : 'btn-soft') : 'btn-gray') + ' fx-btn block" ' + (open ? 'data-go="/materi/' + m.id + '"' : 'disabled') + '>' + (open ? (fin ? 'Pelajari Lagi' : p > 0 ? 'Lanjutkan Belajar →' : 'Mulai Belajar ▸') : 'Terkunci') + '</button></div></article>';
  }

  // ---------- LANDING (tamu) ----------
  const SLIDES = [['Jelajahi Bangun Ruang dalam 3D', 'Lipat dan buka jaring-jaring kubus, balok, prisma, limas, tabung, kerucut, dan bola langsung di layarmu.'], ['Susun Jaring-jaring, Naikkan Level', 'Mini game petualangan dan kuis numerasi kontekstual dengan umpan balik di setiap soal.'], ['Siap Menghadapi Simulasi TKA Kelas 9', 'Latihan soal wacana berbasis tabel data, lengkap dengan mode ujian terkunci yang adil.']];
  function landing() {
    $v().innerHTML = '<section class="hero-wrap"><div class="hero card-hero"><div class="hero-txt"><span class="chip chip-white">🧊 Matematika SMP Kelas 9 · Kurikulum Merdeka</span><h1 id="hero-h" class="display">' + SLIDES[0][0] + '</h1><p id="hero-p" class="lead">' + SLIDES[0][1] + '</p><div class="row gap wrap"><button class="btn btn-white fx-btn big glow" data-act="login">🔑 Masuk dengan Kode Login</button><button class="btn btn-glass fx-btn big" data-go="/materi">👀 Coba sebagai Tamu</button></div><div class="row gap wrap trust"><span>✔ Responsif HP & komputer</span><span>✔ Nilai tersimpan aman</span><span>✔ Mode ujian anti-curang</span></div></div>' +
      '<div class="hero-art"><div class="slider hero-slider" data-interval="4200">' + [0, 1, 2].map(i => '<div class="slide' + (i ? '' : ' on') + '"><img src="' + Art.hero(i) + '" alt="' + esc(SLIDES[i][0]) + '"></div>').join('') + '<div class="dots"></div></div><span class="float f1">△</span><span class="float f2">◯</span><span class="float f3">□</span></div></div></section>' +
      '<section class="sec"><div class="grid3">' + [['🧩', 'Jaring-jaring Interaktif', 'Putar, lipat, dan buka bangun ruang 3D seperti memegang benda nyata.'], ['🎮', 'Asesmen Gamifikasi', 'Game petualangan dan kuis 10 soal numerasi dengan penjelasan per soal.'], ['🛡️', 'Simulasi TKA Terkunci', 'Format soal TKA dengan timer, wacana, dan pengawasan layar penuh.']].map(f => '<div class="feat card fx-card reveal"><div class="feat-ic">' + f[0] + '</div><h3 class="h3">' + f[1] + '</h3><p class="muted">' + f[2] + '</p></div>').join('') + '</div></section>' +
      '<section class="sec"><div class="sec-head"><div><h2 class="h2">Jalur Petualangan Geometri</h2><p class="muted">7 bangun ruang · 42 bagian materi · terbuka berurutan</p></div><button class="btn btn-ghost" data-go="/materi">Lihat semua →</button></div><div class="grid-cards">' + MATERI.slice(0, 4).map(materiCard).join('') + '</div></section>' +
      '<section class="sec"><div class="steps-cta card reveal"><div><h2 class="h2">Siap mulai petualangan?</h2><p class="muted">Minta kode login ke gurumu, atau coba dulu materi dan contoh soal tanpa login.</p></div><div class="row gap wrap"><button class="btn btn-primary fx-btn glow" data-act="login">Masuk Sekarang</button><button class="btn btn-ghost" data-go="/pratinjau-soal">Coba Contoh Soal</button></div></div></section>';
    const hs = $('.hero-slider'), hh = $('#hero-h'), hp = $('#hero-p');
    const sync = () => { const i = Array.from(hs.querySelectorAll('.slide')).findIndex(s => s.classList.contains('on')); if (i >= 0 && hh.dataset.i !== String(i)) { hh.dataset.i = i; hh.classList.remove('pop'); void hh.offsetWidth; hh.classList.add('pop'); hh.textContent = SLIDES[i][0]; hp.textContent = SLIDES[i][1]; } };
    const t = setInterval(sync, 300); return () => clearInterval(t);
  }

  // ---------- BERANDA siswa ----------
  function hariIni() { const t = new Date().toDateString(); return Object.keys(done()).filter(k => k.indexOf('.') > 0 && new Date(done()[k]).toDateString() === t).length; }
  function mingguan() { const out = [], now = new Date(); for (let i = 5; i >= 0; i--) { const d = new Date(now - i * 864e5), n = Object.keys(done()).filter(k => k.indexOf('.') > 0 && new Date(done()[k]).toDateString() === d.toDateString()).length; out.push({ l: d.toLocaleDateString('id-ID', { weekday: 'short' }), n }); } return out; }
  function beranda() {
    const me = S.me, x = xp(), cur = nextM(), p = pctM(cur), tgt = Math.min(3, hariIni()), wk = mingguan(), mx = Math.max(3, ...wk.map(w => w.n));
    const f1 = hasilResmi('F1'), f2 = hasilResmi('F2'), sm = hasilResmi('SUM'), kk = S.data.kunci, fs = [f1, f2].filter(Boolean);
    $v().innerHTML = '<section class="card pad greet reveal"><div><h1 class="h1">Halo, ' + esc(me.nama.split(' ')[0]) + '! <span class="wave">👋</span></h1><p class="muted">Siap menjelajah ruang geometri dan menyelesaikan tantangan hari ini?</p></div><div class="row gap wrap"><span class="chip chip-yel big">🔥 <b>' + S.data.streak + '</b> Hari Streak</span><span class="chip chip-lav big">⭐ Lv <b>' + x.lv + '</b> · ' + x.xp + ' XP</span><span class="chip chip-teal big">🎯 Target Harian: <b>' + tgt + '/3</b> bagian</span></div></section>' +
      '<section class="hero-card reveal"><div class="hc-txt"><span class="chip chip-white">● Sedang Aktif · Modul ' + cur.modul + '</span><h2 class="display sm">' + esc(cur.nama) + '</h2><p class="lead">' + esc(cur.ringkas) + '. Mulailah dari bagian yang belum selesai.</p><div class="hc-prog"><div class="row between sm"><b>Progres Pembelajaran</b><b>' + p + '%</b></div><div class="pb light"><i style="width:' + p + '%"></i></div><small>' + nDone(cur) + ' dari 6 bagian tuntas</small></div><div class="row gap wrap"><button class="btn btn-white fx-btn glow" data-go="/materi/' + cur.id + '">Lanjutkan Belajar 🚀</button><button class="btn btn-glass fx-btn" data-go="/materi/' + cur.id + '?b=jaring">🧊 Buka Lab 3D</button></div></div><div class="hc-art"><div class="slider" data-interval="3600">' + [0, 1, 2].map(i => '<div class="slide' + (i ? '' : ' on') + '"><img src="' + Art.img(cur.id, i) + '" alt=""></div>').join('') + '<div class="dots"></div></div></div></section>' +
      '<div class="home-grid"><div class="home-main"><div class="chips-row" id="kat">' + [['all', 'Semua Materi'], ['datar', 'Bangun Sisi Datar'], ['lengkung', 'Bangun Sisi Lengkung']].map((c, i) => '<button class="chip-btn ' + (i ? '' : 'on') + '" data-k="' + c[0] + '">' + c[1] + '</button>').join('') + '<button class="chip-btn" data-go="/asesmen">Asesmen & Kuis</button></div><div class="sec-head tight"><div><h2 class="h2">Jalur Petualangan Geometri</h2><p class="muted sm">Materi terbuka berurutan sesuai progresmu</p></div><span class="chip chip-teal">Total ' + MATERI.length + ' Modul</span></div><div class="grid-cards" id="mgrid">' + MATERI.map(materiCard).join('') + '</div>' +
      '<div class="card pad hub reveal"><div class="sec-head tight"><div><h2 class="h2">⚡ Hub Asesmen Cepat</h2><p class="muted sm">Uji pemahaman spasial lewat simulasi interaktif</p></div><button class="btn btn-ghost sm" data-go="/asesmen">Lihat Semua</button></div><div class="grid3">' +
      [['F1', 'MINI GAME', 'Jaring-jaring 3D', 'Susun jaring-jaring 7 bangun ruang', kk.F1, 'Mainkan', 'chip-teal'], ['F2', 'KUIS NUMERASI', '10 Soal Kontekstual', 'Studi kasus dengan umpan balik tiap soal', kk.F2, 'Kerjakan', 'chip-yel'], ['SUM', 'UJIAN AKHIR', 'Simulasi TKA Geometri', 'Wacana + tabel data, mode terkunci', kk.SUM, 'Mulai', 'chip-lav']].map(a => '<button class="hub-i fx-card ' + (a[4] ? '' : 'locked') + '" ' + (a[4] ? 'data-go="/asesmen/' + a[0].toLowerCase() + '"' : 'data-go="/asesmen"') + '><span class="chip ' + a[6] + '">' + a[1] + '</span><b>' + a[2] + '</b><small>' + a[3] + '</small><em>' + (a[4] ? a[5] + ' →' : '🔒 Terkunci') + '</em></button>').join('') + '</div></div></div>' +
      '<aside class="home-side"><div class="card pad reveal"><div class="row between"><h3 class="h3">Statistik Belajar</h3><span>📈</span></div><div class="grid2 mt"><div class="stat teal"><b data-count="' + MATERI.filter(selesaiM).length + '">0</b><span>Materi Selesai</span></div><div class="stat lav"><b data-count="' + (fs.length ? Math.round(fs.reduce((a, h) => a + h.skor, 0) / fs.length) : 0) + '">0</b><span>Rata-rata Formatif</span></div></div><div class="row between sm mt"><span class="muted">Bagian selesai 6 hari terakhir</span><b>' + wk.reduce((a, w) => a + w.n, 0) + '</b></div><div class="mini-bars">' + wk.map((w, i) => '<div><i style="height:' + Math.max(6, w.n / mx * 100) + '%" class="' + (i === 5 ? 'now' : '') + '" title="' + w.n + ' bagian"></i><span>' + w.l + '</span></div>').join('') + '</div></div>' +
      '<div class="card pad reveal"><h3 class="h3">Perjalanan Saya</h3><div class="row between sm mt"><b>Level ' + x.lv + '</b><span class="muted">' + x.sisa + ' XP ke Lv ' + (x.lv + 1) + '</span></div><div class="pb"><i style="width:' + x.pct + '%"></i></div><ul class="ach"><li class="' + (f1 ? 'on' : '') + '">🧩 Formatif 1 ' + (f1 ? '· ' + f1.skor : '· belum') + '</li><li class="' + (f2 ? 'on' : '') + '">📝 Formatif 2 ' + (f2 ? '· ' + f2.skor : '· belum') + '</li><li class="' + (sm ? 'on' : '') + '">🏆 Simulasi TKA ' + (sm ? '· ' + sm.skor : '· belum') + '</li></ul><button class="btn btn-ghost block" data-go="/nilai">Lihat Nilai Saya</button></div>' +
      '<div class="card pad challenge fx-card reveal"><span class="chip chip-white">💡 TANTANGAN GURU</span><p>“Coba ubah jaring-jaring kubus menjadi 11 pola berbeda di Lab 3D untuk mendapatkan lencana <i>Master Origami Ruang</i>!”</p><button class="btn btn-glass block fx-btn" data-go="/materi/kubus?b=jaring">Ikuti Tantangan</button></div></aside></div>';
    $('#kat').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; $$('#kat .chip-btn').forEach(x => x.classList.toggle('on', x === b)); $('#mgrid').innerHTML = MATERI.filter(m => b.dataset.k === 'all' || m.kat === b.dataset.k).map(materiCard).join(''); FX.scan($('#mgrid')); });
  }

  // ---------- DAFTAR MATERI ----------
  function materiList() {
    const g = isGuest() ? '<div class="note guest">👀 <b>Mode tamu:</b> semua materi terbuka, tetapi progres dan nilai tidak disimpan. <a href="#" data-act="login">Masuk</a> untuk menyimpan kemajuanmu.</div>' : '';
    $v().innerHTML = g + '<div class="sec-head"><div><h1 class="h1">Materi Bangun Ruang</h1><p class="muted">Pilih kategori lalu pelajari setiap bangun melalui 6 bagian.</p></div></div>' + ['datar', 'lengkung'].map(k => '<h2 class="h2 mt">' + NAMA_KAT[k] + '</h2><div class="grid-cards">' + MATERI.filter(m => m.kat === k).map(materiCard).join('') + '</div>').join('');
  }

  // ---------- DETAIL MATERI ----------
  function stepper(m) {
    let i = 0, timer = null; const R = m.rumus, vid = (APP_CONFIG.VIDEO_YOUTUBE || {})[m.id];
    const html = (vid ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(vid) + '" title="Animasi rumus ' + esc(m.nama) + '" loading="lazy" allowfullscreen></iframe></div>' : '') + '<div class="derive card-in"><div class="row between wrap gap"><b>🎬 Animasi Asal-usul Rumus ' + esc(m.nama) + '</b><span class="muted sm" id="dv-n"></span></div><div class="dv-stage"><div class="dv-art"><img src="' + Art.img(m.id, 1) + '" alt=""></div><div class="dv-txt"><h4 id="dv-t"></h4><p id="dv-d"></p><div class="dv-f" id="dv-f"></div></div></div><div class="row gap wrap"><button class="btn btn-ghost sm" id="dv-p">←</button><button class="btn btn-soft sm" id="dv-play">▶ Putar Otomatis</button><button class="btn btn-ghost sm" id="dv-x">→</button></div></div>';
    const bind = () => {
      const show = () => { const s = R.langkah[i]; $('#dv-n').textContent = 'Langkah ' + (i + 1) + ' dari ' + R.langkah.length; $('#dv-t').textContent = s[0]; $('#dv-d').textContent = s[1]; const f = $('#dv-f'); f.textContent = s[2]; f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop'); $('.dv-art').style.setProperty('--k', i); };
      $('#dv-p').onclick = () => { i = (i + R.langkah.length - 1) % R.langkah.length; show(); }; $('#dv-x').onclick = () => { i = (i + 1) % R.langkah.length; show(); };
      $('#dv-play').onclick = (e) => { if (timer) { clearInterval(timer); timer = null; e.target.textContent = '▶ Putar Otomatis'; } else { e.target.textContent = '⏸ Jeda'; timer = setInterval(() => { i = (i + 1) % R.langkah.length; show(); }, 2600); } };
      show(); return () => clearInterval(timer);
    };
    return { html, bind };
  }
  function materiDetail(p, q) {
    const m = MATERI_MAP[p.id]; if (!m) return U.go('/materi');
    if (!terbuka(m)) { U.toast('Selesaikan materi sebelumnya dulu ya.', 'err'); return U.go('/materi'); }
    const tab = BAGIAN.find(b => b.id === q.b) ? q.b : (BAGIAN.find(b => !done()[m.id + '.' + b.id]) || BAGIAN[0]).id, tb = BAGIAN.find(b => b.id === tab), prev = MATERI[m.idx - 1], nxt = MATERI[m.idx + 1];
    const fin = selesaiM(m), doneTab = !!done()[m.id + '.' + tab], cleanups = []; let body = '', after = null;
    const titleMap = { pengertian: 'Mengenal ' + m.nama, ciri: 'Ciri Geometris ' + m.nama, jaring: 'Eksplorasi ' + m.nama + ' & Jaring-jaring', nyata: m.nama + ' di Sekitar Kita', rumus: 'Rumus Luas Permukaan & Volume ' + m.nama, uji: 'Uji Pemahaman Cepat' };
    if (tab === 'pengertian') body = '<div class="card pad split"><div class="prose big">' + m.pengertian + '<div class="facts">' + m.ciri.slice(0, 3).map(c => '<span class="chip chip-teal">' + esc(c[0]) + '</span>').join('') + '</div></div><div>' + imgSlider(m, [0, 1, 2], 'big-s') + '<p class="muted sm center">Geser atau tunggu — ilustrasi berganti otomatis</p></div></div>';
    if (tab === 'ciri') body = '<div class="grid2 gap-l">' + m.ciri.map((c, i) => '<div class="card pad fx-card reveal ciri"><span class="num">' + (i + 1) + '</span><h3 class="h3">' + esc(c[0]) + '</h3><p class="muted">' + esc(c[1]) + '</p></div>').join('') + '</div>';
    if (tab === 'jaring') {
      const pol = m.id === 'kubus' ? [['141', 'Pola 1-4-1 (Umum)'], ['231', 'Pola 2-3-1'], ['222', 'Pola 2-2-2 (Tangga)'], ['33', 'Pola 3-3-0']] : [];
      body = '<div class="card pad lab-card"><div class="row between wrap gap"><div><h3 class="h3"><span class="dot"></span>Laboratorium Jaring-jaring 3D</h3><p class="muted sm">Seret untuk memutar, lalu lipat jaring-jaring menjadi ' + esc(m.nama.toLowerCase()) + '.</p></div>' + (pol.length ? '<div class="chips-row" id="pola">' + pol.map((x, i) => '<button class="chip-btn ' + (i ? '' : 'on') + '" data-p="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>' : '') + '</div><div class="lab-grid"><div class="lab"><div class="lab-top"><span class="chip chip-white" id="lab-mode">Tampilan: Terbuka (Jaring-jaring Datar)</span><span class="chip chip-white" id="lab-rot">Rotasi: 22° / 24°</span></div><div id="lab-host"></div><div class="lab-ctl"><button class="btn btn-ghost sm" id="l-spin">⟳ Putar 360°</button><button class="btn btn-primary fx-btn glow" id="l-fold">Lipat Jadi ' + esc(m.nama) + '</button><button class="btn btn-soft sm" id="l-reset">↺ Reset</button></div></div><aside class="lab-info"><div class="info-card"><h4>Identifikasi Bidang ' + esc(m.nama) + '</h4><ul>' + m.jaring.map(j => '<li>' + j + '</li>').join('') + '</ul></div><div class="info-card teal"><h4>💡 Kunci Ingat</h4><p>' + esc(m.ciri[0][0] + ': ' + m.ciri[0][1]) + '</p></div></aside></div></div>';
      after = () => {
        const host = $('#lab-host'); let ctl = Fold3D.mount(host, m.fold, { pattern: '141', onRot: (a, b) => { const r = $('#lab-rot'); if (r) r.textContent = 'Rotasi: ' + a + '° / ' + b + '°'; } }); cleanups.push(() => ctl.destroy());
        const setLbl = () => { const f = ctl.folded(); $('#l-fold').textContent = f ? 'Buka Jaring-jaring' : 'Lipat Jadi ' + m.nama; $('#lab-mode').textContent = f ? 'Tampilan: Terlipat (Bangun Ruang)' : 'Tampilan: Terbuka (Jaring-jaring Datar)'; };
        $('#l-fold').onclick = () => { const f = ctl.toggle(); $('#l-fold').textContent = f ? 'Buka Jaring-jaring' : 'Lipat Jadi ' + m.nama; $('#lab-mode').textContent = f ? 'Tampilan: Terlipat (Bangun Ruang)' : 'Tampilan: Terbuka (Jaring-jaring Datar)'; };
        $('#l-spin').onclick = () => ctl.spin(); $('#l-reset').onclick = () => { ctl.reset(); setLbl(); $('#l-fold').textContent = 'Lipat Jadi ' + m.nama; $('#lab-mode').textContent = 'Tampilan: Terbuka (Jaring-jaring Datar)'; };
        const pl = $('#pola'); if (pl) pl.onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; $$('#pola .chip-btn').forEach(x => x.classList.toggle('on', x === b)); ctl.pattern(b.dataset.p); setLbl(); };
      };
    }
    if (tab === 'nyata') body = '<div class="sec-head tight"><h3 class="h3">Penerapan Kontekstual</h3><span class="chip chip-teal">Kontekstual</span></div><div class="grid2 gap-l">' + m.nyata.map((n, i) => '<article class="card fx-card nyata reveal"><div class="slider" data-interval="' + (3000 + i * 400) + '">' + [2, 0, 1].map((k, j) => '<div class="slide' + (j ? '' : ' on') + '"><img loading="lazy" src="' + Art.img(m.id, i === 0 ? k : [2, 1, 0][j]) + '" alt=""></div>').join('') + '<div class="dots"></div></div><div class="pad"><span class="chip chip-teal">' + esc(n[0]) + '</span><h3 class="h3">' + esc(n[1]) + '</h3><p class="muted">' + esc(n[2]) + '</p></div></article>').join('') + '</div>';
    if (tab === 'rumus') {
      const R = m.rumus, sp = stepper(m);
      body = '<div class="formula-panel"><span class="chip chip-lav">RUMUS UTAMA ' + esc(m.nama.toUpperCase()) + '</span><h3 class="h2">Luas Permukaan & Volume</h3><div class="grid2 gap-l"><div class="fcard fx-card"><small>' + R.lp[0].toUpperCase() + ' (LP)</small><div class="fm">' + esc(R.lp[1]) + '</div><p>' + esc(R.lp[2]) + '</p></div><div class="fcard fx-card"><small>' + R.v[0].toUpperCase() + ' (V)</small><div class="fm">' + esc(R.v[1]) + '</div><p>' + esc(R.v[2]) + '</p></div></div>' + (R.extra.length ? '<div class="extra">' + R.extra.map(e => '<span><b>' + esc(e[0]) + ':</b> ' + esc(e[1]) + '</span>').join('') + '</div>' : '') + '<div class="note">ⓘ <b>Catatan:</b> ' + esc(R.cat) + '</div></div><div class="card pad mt">' + sp.html + '</div>' +
        '<div class="card pad mt contoh"><span class="chip chip-yel">Contoh Soal Kontekstual</span><p class="q-text mt">' + esc(m.contoh.soal) + '</p><ol class="steps-l">' + m.contoh.langkah.map(l => '<li>' + esc(l) + '</li>').join('') + '</ol><div class="note ok">✅ <b>Jawaban:</b> ' + esc(m.contoh.jawab) + '</div></div>';
      after = () => cleanups.push(sp.bind());
    }
    if (tab === 'uji') {
      body = '<div class="card pad"><div class="row between wrap gap"><div class="row gap center"><span class="icn">✅</span><div><h3 class="h3">Uji Pemahaman Cepat</h3><p class="muted sm">Uji ketajaman visualisasi ' + esc(m.nama.toLowerCase()) + ' Anda secara instan.</p></div></div><span class="chip chip-gray">Latihan · tidak dinilai</span></div><p class="q-text mt">' + esc(m.uji.soal) + '</p><div id="uji-opts" class="opts">' + m.uji.opsi.map((o, i) => '<button type="button" class="opt rb" data-i="' + i + '"><span class="ck"></span><span class="ol">' + 'ABCD'[i] + '</span><span class="ot">' + esc(o) + '</span></button>').join('') + '</div><div id="uji-fb"></div><div class="row end mt"><button class="btn btn-navy fx-btn" id="uji-cek" disabled>✔ Periksa Jawaban</button></div></div>';
      after = () => { let sel = -1; $('#uji-opts').onclick = e => { const b = e.target.closest('.opt'); if (!b || b.disabled) return; sel = +b.dataset.i; $$('#uji-opts .opt').forEach(x => x.classList.toggle('on', x === b)); $('#uji-cek').disabled = false; }; $('#uji-cek').onclick = () => { const ok = sel === m.uji.kunci; $$('#uji-opts .opt').forEach((x, i) => { x.disabled = true; x.classList.toggle('good', i === m.uji.kunci); if (i === sel && !ok) x.classList.add('bad'); }); $('#uji-fb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? '🎉 Benar!' : '🤔 Belum tepat.') + '</b><p>' + esc(m.uji.bahas) + '</p></div>'; $('#uji-cek').disabled = true; if (ok) { const r = $('#uji-cek').getBoundingClientRect(); FX.confetti(r.left, r.top); } }; };
    }
    const pctBab = pctM(m);
    $v().innerHTML = (isGuest() ? '<div class="note guest">👀 Mode tamu — progres tidak disimpan. <a href="#" data-act="login">Masuk</a></div>' : '') +
      '<div class="crumbs"><div><a data-go="/materi">Materi</a> / <span>' + (m.kat === 'datar' ? 'Bangun Ruang Sisi Datar' : 'Bangun Ruang Sisi Lengkung') + '</span> / <b>' + esc(m.nama) + '</b></div><div class="row gap wrap"><span class="chip chip-teal">✓ Progres Bab: ' + pctBab + '%</span><span class="chip chip-gray">Fase D · Kelas 9</span></div></div>' +
      '<nav class="tabs" role="tablist">' + BAGIAN.map(b => '<button role="tab" class="tab ' + (b.id === tab ? 'on' : '') + '" data-go="/materi/' + m.id + '?b=' + b.id + '"><span>' + b.ikon + '</span>' + b.nama + (done()[m.id + '.' + b.id] ? ' <i class="tick">✓</i>' : '') + '</button>').join('') + '</nav>' +
      '<section class="banner reveal"><div><span class="chip chip-white">⬡ MODUL INTERAKTIF SPASIAL</span><h1 class="display sm">' + esc(titleMap[tab]) + '</h1><p>' + (tab === 'jaring' ? 'Pahami dekonstruksi bangun ruang melalui simulator 3D lipat interaktif, lakukan manipulasi rotasi, dan amati transisi lipat.' : 'Bagian ' + (BAGIAN.indexOf(tb) + 1) + ' dari 6 · ' + esc(m.ringkas)) + '</p></div><div class="target"><span class="icn big">' + tb.ikon + '</span><div><small>Target Capaian</small><b>' + (tab === 'jaring' && m.id === 'kubus' ? '11 Pola Net Kubus' : 'Selesaikan bagian ini') + '</b></div></div></section>' +
      '<section class="mt">' + body + '</section>' +
      '<footer class="mfoot card pad"><button class="btn btn-soft" ' + (prev ? 'data-go="/materi/' + prev.id + '"' : 'disabled') + '>← <span class="hm">Materi Sebelumnya</span>' + (prev ? ' (' + esc(prev.nama) + ')' : '') + '</button><span class="sp"></span><button class="btn btn-teal fx-btn" data-act="tandai" data-m="' + m.id + '" data-b="' + tab + '"' + '>' + (doneTab ? '✓ Bagian Selesai' : '✓ Tandai Selesai') + '</button><button class="btn btn-primary fx-btn glow" ' + (nxt && (fin || isGuest()) ? 'data-go="/materi/' + nxt.id + '"' : nxt ? 'disabled title="Selesaikan 6 bagian dulu"' : 'data-go="/asesmen"') + '>' + (nxt ? 'Materi Berikutnya: ' + esc(nxt.nama) + ' →' : 'Ke Asesmen →') + '</button></footer>';
    if (after) after(); FX.scan($v());
    return () => cleanups.forEach(c => { try { c(); } catch (e) {} });
  }
  async function tandai(a) {
    const mid = a.dataset.m, b = a.dataset.b, key = mid + '.' + b, m = MATERI_MAP[mid]; if (done()[key]) { U.toast('Bagian ini sudah selesai ✓'); goNext(m, b); return; }
    if (isGuest()) { const g = guestDone(); g[key] = new Date().toISOString(); sessionStorage.setItem(guestKey, JSON.stringify(g)); U.toast('Mode tamu: progres hanya sementara. Masuk untuk menyimpan.'); goNext(m, b); return; }
    a.disabled = true;
    try { const r = await API.data('progres.tandai', { kunci: key }); S.data.progres = r.progres; S.data.kunci = r.kunci; S.data.streak = r.streak; } catch (e) { U.toast(e.message, 'err'); a.disabled = false; return; }
    const r0 = a.getBoundingClientRect(); FX.confetti(r0.left + 40, r0.top); U.toast('+20 XP · bagian selesai! 🎉');
    if (selesaiM(m)) { setTimeout(() => FX.confetti(), 300); U.toast('Bab ' + m.nama + ' selesai! Materi berikutnya terbuka 🔓'); }
    goNext(m, b);
  }
  function goNext(m, b) { const nx = BAGIAN.find((x, i) => i > BAGIAN.findIndex(y => y.id === b) && !done()[m.id + '.' + x.id]) || BAGIAN.find(x => !done()[m.id + '.' + x.id]); if (nx) U.go('/materi/' + m.id + '?b=' + nx.id); else U.go('/materi/' + m.id + '?b=' + b); }

  // ---------- HUB ASESMEN ----------
  function asesmen() {
    const kk = S.data ? S.data.kunci : { F1: true, F2: true, SUM: true }, g = isGuest(), set = S.set || {};
    const mk = (j, ic, t, d, buka, syarat, rute) => { const h = hasilResmi(j); return '<article class="card pad fx-card as-card reveal ' + (buka ? '' : 'locked') + '"><div class="as-ic">' + ic + '</div><span class="chip ' + (h ? 'chip-teal' : buka ? 'chip-lav' : 'chip-gray') + '">' + (h ? 'Nilai resmi: ' + h.skor : buka ? 'Terbuka' : '🔒 Terkunci') + '</span><h3 class="h3">' + t + '</h3><p class="muted">' + d + '</p><p class="sm hint">' + syarat + '</p><button class="btn ' + (buka ? 'btn-primary' : 'btn-gray') + ' fx-btn block" ' + (buka ? 'data-act="mulai" data-j="' + j + '"' : 'disabled') + '>' + (buka ? (h ? 'Latihan Lagi' : 'Mulai') : 'Terkunci') + '</button></article>'; };
    $v().innerHTML = '<div class="sec-head"><div><h1 class="h1">Asesmen</h1><p class="muted">Percobaan pertama menjadi <b>nilai resmi</b>; percobaan berikutnya tercatat sebagai latihan.</p></div></div>' + (g ? '<div class="note guest">👀 Mode tamu: asesmen terkunci. Coba <a href="#/pratinjau-soal">contoh soal</a> tanpa menyimpan data, atau <a href="#" data-act="login">masuk</a>.</div>' : '') +
      '<div class="grid3">' + mk('F1', '🧩', 'Formatif 1 · Game Jaring-jaring', 'Mini game petualangan 7 level: pilih jaring-jaring yang benar untuk setiap bangun ruang.', !g && kk.F1, 'Syarat: seluruh materi selesai', '') + mk('F2', '📝', 'Formatif 2 · Kuis Numerasi', '10 soal numerasi kontekstual dengan umpan balik dan pembahasan setiap soal.', !g && kk.F2, 'Syarat: seluruh materi selesai', '') + mk('SUM', '🏆', 'Sumatif · Simulasi TKA Kelas 9', 'Soal pilihan ganda, pilihan ganda kompleks, dan wacana bertabel. Mode terkunci layar penuh.', !g && kk.SUM, 'Syarat: Formatif 1 & 2 selesai · ' + (set.DURASI_UJIAN_MENIT || 40) + ' menit', '') + '</div>' +
      '<div class="card pad mt"><h3 class="h3">Alur Belajar</h3><div class="flow"><span class="on">📚 Materi</span><i>→</i><span class="' + (kk.F1 ? 'on' : '') + '">🧩 Formatif 1</span><i>→</i><span class="' + (kk.F2 ? 'on' : '') + '">📝 Formatif 2</span><i>→</i><span class="' + (kk.SUM ? 'on' : '') + '">🏆 Sumatif</span></div></div>';
  }
  async function mulai(a) {
    if (isGuest()) return App.loginModal(); const j = a.dataset.j; a.disabled = true; U.loading(true, 'Menyiapkan asesmen…');
    try { const att = await API.data('asesmen.mulai', { jenis: j }); U.loading(false); window.__att = att; U.go(j === 'F1' ? '/asesmen/f1' : j === 'F2' ? '/asesmen/f2' : '/ujian'); }
    catch (e) { U.loading(false); U.toast(e.message, 'err'); a.disabled = false; }
  }
  async function runAsesmen(j) {
    const att = window.__att; if (!att || att.jenis !== j) { return U.go('/asesmen'); } window.__att = null;
    const host = $v(); host.innerHTML = '<div id="run"></div>'; const h = $('#run');
    if (j === 'F1') return Game.run(h, att); if (j === 'F2') return Ujian.kuisF2(h, att); return Ujian.ujian(h, att);
  }
  function previewSoal() { $v().innerHTML = '<div id="run"></div>'; Ujian.kuisPreview($('#run')); }

  // ---------- NILAI SAYA ----------
  function nilai() {
    const rows = ((S.data && S.data.hasil) || []).filter(h => h.status !== 'berjalan').sort((a, b) => b.mulai.localeCompare(a.mulai)), kkm = Number((S.set || {}).KKM) || 75, N = { F1: 'Formatif 1 · Game Jaring-jaring', F2: 'Formatif 2 · Kuis Numerasi', SUM: 'Sumatif · Simulasi TKA' };
    $v().innerHTML = '<div class="sec-head"><div><h1 class="h1">Nilai Saya</h1><p class="muted">KKM ' + kkm + ' · hanya kamu yang dapat melihat nilai ini.</p></div></div><div class="grid3">' + ['F1', 'F2', 'SUM'].map(j => { const h = hasilResmi(j); return '<div class="card pad nilai-c reveal"><span class="chip chip-gray">' + N[j] + '</span><div class="score-big ' + (h ? (h.skor >= kkm ? 'ok' : 'warn') : '') + '">' + (h ? '<span data-count="' + h.skor + '">0</span>' : '–') + '</div><p class="muted sm">' + (h ? (h.skor >= kkm ? '✔ Mencapai KKM' : '↗ Belum mencapai KKM') + ' · ' + U.fmtWaktu(h.selesai, true) : 'Belum dikerjakan') + '</p></div>'; }).join('') + '</div>' +
      '<div class="card pad mt"><h3 class="h3">Riwayat Percobaan</h3>' + (rows.length ? '<div class="tbl-wrap"><table class="table stack-m"><thead><tr><th>Asesmen</th><th>Percobaan</th><th>Status</th><th>Skor</th><th>Benar</th><th>Pelanggaran</th><th>Selesai</th></tr></thead><tbody>' + rows.map(h => '<tr><td data-l="Asesmen">' + N[h.jenis] + '</td><td data-l="Percobaan">ke-' + h.ke + '</td><td data-l="Status"><span class="chip ' + (h.resmi ? 'chip-teal' : 'chip-lav') + '">' + (h.resmi ? 'Nilai resmi' : 'Latihan') + '</span>' + (h.alasan === 'pelanggaran' ? ' <span class="chip chip-coral">Dihentikan</span>' : '') + '</td><td data-l="Skor"><b>' + h.skor + '</b></td><td data-l="Benar">' + h.benar + '/' + h.total + '</td><td data-l="Pelanggaran">' + (h.jenis === 'SUM' ? h.langgar : '-') + '</td><td data-l="Selesai">' + U.fmtWaktu(h.selesai) + '</td></tr>').join('') + '</tbody></table></div>' : '<p class="muted">Belum ada riwayat. Kerjakan asesmen untuk melihat nilaimu di sini.</p>') + '</div>';
  }

  U.on('tandai', tandai); U.on('mulai', mulai);
  window.Siswa = { landing, beranda, materiList, materiDetail, asesmen, runAsesmen, previewSoal, nilai, xp };
})();
