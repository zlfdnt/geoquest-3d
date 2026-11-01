// ============================================================
//  app.js — boot, login, kerangka halaman (topbar/footer), pendaftaran rute
// ============================================================
(function () {
  const App = {};
  const NAV_S = [['/beranda', 'Beranda', '🏠'], ['/materi', 'Materi', '📖'], ['/asesmen', 'Asesmen', '❓'], ['/nilai', 'Nilai Saya', '📈']];
  const NAV_T = [['/', 'Beranda', '🏠'], ['/materi', 'Materi', '📖'], ['/asesmen', 'Asesmen', '❓'], ['/pratinjau-soal', 'Pratinjau', '👀']];

  function store(token, role, me) { S.token = token; S.role = role; S.me = me; localStorage.setItem('gq_token', token); localStorage.setItem('gq_role', role); localStorage.setItem('gq_me', JSON.stringify(me)); }
  App.applySettings = (s) => { S.set = Object.assign(S.set || {}, s); FX.whatsapp(S.set.WA_NOMOR || APP_CONFIG.WA_NOMOR, S.set.WA_PESAN); const f = $('#foot-s'); if (f) f.textContent = S.set.NAMA_SEKOLAH || ''; };
  App.logout = function (silent, msg) {
    try { if (window.Track) Track.stop(); if (window.Guru) Guru.stop(); } catch (e) {}
    ['gq_token', 'gq_role', 'gq_me'].forEach(k => localStorage.removeItem(k)); sessionStorage.clear(); S.token = ''; S.role = 'tamu'; S.me = null; S.data = null; S.lockPath = null;
    if (msg) sessionStorage.setItem('gq_msg', msg); location.hash = '/'; location.reload();
  };
  App.refresh = async function () { if (S.role !== 'siswa') return; const d = await API.data('siswa.boot', {}); S.data = d; S.me = d.me; App.applySettings(d.pengaturan); chrome(); return d; };

  function chrome() {
    const tb = $('#topbar'), ft = $('#foot'), sis = S.role === 'siswa', gur = S.role === 'guru', nav = sis ? NAV_S : NAV_T, x = sis && S.data ? Siswa.xp() : null;
    document.body.dataset.role = S.role;
    tb.innerHTML = '<div class="tb-in"><a class="brand" data-go="' + (gur ? '/guru' : sis ? '/beranda' : '/') + '"><span class="logo">🧊</span><b>GeoQuest 3D</b></a>' + (gur ? '' : '<nav class="pillnav" aria-label="Menu utama">' + nav.map(n => '<a data-go="' + n[0] + '" data-p="' + n[0] + '">' + n[1] + '</a>').join('') + '</nav>') + '<div class="tb-r">' + (sis ? '<span class="chip chip-yel">Lv ' + x.lv + '</span>' : '') + (gur ? '<span class="chip chip-teal">Mode Guru</span>' : '') + (sis || gur ? '<div class="usr"><div class="who"><b>' + esc(S.me.nama) + '</b><small>' + (sis ? 'Kelas ' + esc(S.me.kelas) : 'Guru') + '</small></div><button class="avatar" data-act="menu" aria-label="Menu pengguna">' + esc(S.me.nama.slice(0, 1)) + '</button></div>' : '<button class="btn btn-primary fx-btn glow" data-act="login">🔑 Masuk</button>') + '</div></div>';
    ft.innerHTML = '<div class="ft-in"><b>GeoQuest 3D · Bangun Ruang Kelas 9</b><nav><a data-go="/materi">Materi 3D</a><a data-go="/pratinjau-soal">Contoh Soal</a><a data-act="login">Portal Guru</a></nav><small>© ' + new Date().getFullYear() + ' GeoQuest 3D · <span id="foot-s">' + esc((S.set || {}).NAMA_SEKOLAH || '') + '</span> · Selaras Kurikulum Merdeka</small></div>';
    let mb = $('#mobnav'); if (mb) mb.remove();
    if (sis) { mb = document.createElement('nav'); mb.id = 'mobnav'; mb.setAttribute('aria-label', 'Menu bawah'); mb.innerHTML = NAV_S.map(n => '<a data-go="' + n[0] + '" data-p="' + n[0] + '"><span>' + n[2] + '</span>' + n[1] + '</a>').join(''); document.body.appendChild(mb); }
    markNav();
  }
  function markNav() { const p = (U.parseHash().path || '/'); $$('[data-p]').forEach(a => a.classList.toggle('on', p === a.dataset.p || (a.dataset.p !== '/' && p.indexOf(a.dataset.p) === 0))); }
  window.addEventListener('hashchange', markNav);

  U.on('login', () => App.loginModal());
  U.on('logout', async () => { if (await U.confirmBox('Keluar dari aplikasi?', 'Progres dan nilaimu sudah tersimpan di server.', 'Keluar')) App.logout(); });
  U.on('menu', (a) => { const old = $('#umenu'); if (old) return old.remove(); const m = document.createElement('div'); m.id = 'umenu'; m.innerHTML = (S.role === 'siswa' ? '<a data-go="/nilai">📈 Nilai Saya</a>' : '<a data-go="/guru/pengaturan">⚙ Pengaturan</a>') + '<a data-act="logout">⎋ Keluar</a>'; a.parentNode.appendChild(m); setTimeout(() => document.addEventListener('click', function f() { m.remove(); document.removeEventListener('click', f); }, { once: true }), 0); });

  App.loginModal = function () {
    const m = U.modal('<div class="login"><div class="login-art"><img src="' + Art.hero(0) + '" alt=""></div><div><h3 class="h2">Masuk ke GeoQuest 3D</h3><p class="muted">Masukkan <b>kode login</b> dari gurumu. Guru memakai kode khusus guru.</p><form id="lf" autocomplete="off"><label class="fl"><span>Kode login</span><input class="input big" id="lk" placeholder="mis. GQ-AB123" autocapitalize="characters" autocomplete="off" spellcheck="false" autofocus></label><div id="le" class="err" role="alert"></div><button class="btn btn-primary fx-btn block big glow" id="lb" type="submit">Masuk →</button></form><p class="muted sm center">Belum punya kode? <a href="#" data-act="tamu">Coba sebagai tamu</a></p></div></div>', { cls: 'wide' });
    $('#lf', m).addEventListener('submit', async e => {
      e.preventDefault(); const k = $('#lk').value.trim(); if (!k) return; const b = $('#lb'); b.disabled = true; b.textContent = 'Memeriksa…'; $('#le').textContent = '';
      try { const r = await API.post('auth.login', { kode: k }); if (!r.success) { $('#le').textContent = r.message; b.disabled = false; b.textContent = 'Masuk →'; return; } store(r.data.token, r.data.me.role, r.data.me); U.closeModal(); await start(true); }
      catch (err) { $('#le').textContent = err.message; b.disabled = false; b.textContent = 'Masuk →'; }
    });
  };
  U.on('tamu', () => { U.closeModal(); U.go('/materi'); });

  function configScreen() {
    document.getElementById('view').innerHTML = '<div class="card pad center setup"><div class="medal">🛠️</div><h1 class="h1">Hampir siap!</h1><p class="muted">Frontend sudah berjalan, tetapi alamat backend belum diisi. Buka <code>js/config.js</code> lalu ganti <code>GAS_URL</code> dengan URL Web App (…/exec) hasil deploy Google Apps Script.</p><p class="muted sm">Panduan lengkap ada di <b>PANDUAN-INSTALASI.md</b>.</p></div>';
  }
  async function start(afterLogin) {
    if (S.role === 'siswa') { try { await App.refresh(); } catch (e) { if (e.auth) return; throw e; } Track.start(); }
    else if (S.role === 'guru') { try { const g = await API.data('guru.pengaturan', {}); App.applySettings(g.pengaturan); } catch (e) { if (e.auth) return; } }
    chrome(); if (afterLogin) { const g = S.role === 'guru' ? '/guru' : '/beranda'; if (location.hash === '#' + g) U.render(); else U.go(g); U.toast('Selamat datang, ' + S.me.nama + '! 👋'); } else U.render();
  }
  async function boot() {
    document.body.classList.add('booting');
    const msg = sessionStorage.getItem('gq_msg'); if (msg) { sessionStorage.removeItem('gq_msg'); setTimeout(() => U.toast(msg, 'err'), 400); }
    FX.whatsapp(APP_CONFIG.WA_NOMOR, '');
    const t = localStorage.getItem('gq_token'), r = localStorage.getItem('gq_role');
    if (t && r) { S.token = t; S.role = r; try { S.me = JSON.parse(localStorage.getItem('gq_me')); } catch (e) {} }
    if (!API.ok()) { chrome(); configScreen(); document.body.classList.remove('booting'); return; }
    API.warm('boot');
    try { const b = await API.data('app.boot', {}); S.boot = b; App.applySettings(b.pengaturan); } catch (e) { chrome(); document.getElementById('view').innerHTML = '<div class="card pad center"><div class="medal">📡</div><h2 class="h2">Tidak dapat terhubung</h2><p class="muted">' + esc(e.message) + '</p><button class="btn btn-primary" onclick="location.reload()">Coba Lagi</button></div>'; document.body.classList.remove('booting'); return; }
    await start(false); document.body.classList.remove('booting');
  }

  // ---------- rute ----------
  const SIS = { role: ['siswa'] }, ANY = { role: ['tamu', 'siswa'] }, GR = { role: ['guru'] };
  U.route('/', async () => { if (S.role === 'siswa') return U.go('/beranda'); if (S.role === 'guru') return U.go('/guru'); return Siswa.landing(); });
  U.route('/beranda', () => Siswa.beranda(), SIS);
  U.route('/materi', () => Siswa.materiList(), { role: ['tamu', 'siswa'] });
  U.route('/materi/:id', (p, q) => Siswa.materiDetail(p, q), { role: ['tamu', 'siswa'] });
  U.route('/asesmen', () => Siswa.asesmen(), ANY);
  U.route('/asesmen/f1', () => Siswa.runAsesmen('F1'), SIS);
  U.route('/asesmen/f2', () => Siswa.runAsesmen('F2'), SIS);
  U.route('/ujian', () => Siswa.runAsesmen('SUM'), SIS);
  U.route('/pratinjau-soal', () => Siswa.previewSoal(), ANY);
  U.route('/nilai', () => Siswa.nilai(), SIS);
  U.route('/guru', () => Guru.dashboard(), GR);
  U.route('/guru/rekap', () => Guru.rekap(), GR);
  U.route('/guru/pelanggaran', () => Guru.pelanggaran(), GR);
  U.route('/guru/bank-soal', () => Guru.bankSoal(), GR);
  U.route('/guru/pengaturan', () => Guru.pengaturan(), GR);

  window.App = App; window.addEventListener('DOMContentLoaded', boot);
})();
