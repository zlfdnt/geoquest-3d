// ============================================================
//  anatomy.js — "Ciri Geometris" interaktif: model 3D bangun ruang yang bisa diputar, dengan
//  titik sudut, rusuk, sisi, diagonal bidang, diagonal ruang, tinggi, jari-jari, dst. ditandai langsung.
// ============================================================
(function () {
  const P = { teal: '#2EC4B6', lav: '#B8A9F5', coral: '#E85D5D', yel: '#FFD66B', sky: '#6DB4E0', mint: '#5FCDB6', navy: '#1F2A44', amber: '#FFAA2C' };
  const GR = ['teal', 'lav', 'coral', 'yel', 'sky', 'mint'];
  const circ = (n, r, y) => Array.from({ length: n }, (_, i) => [r * Math.cos(2 * Math.PI * i / n), y, r * Math.sin(2 * Math.PI * i / n)]);
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const LBL = 'ABCDEFGHIJKL';

  // ---------- definisi tiap bangun ----------
  function box(p, l, t) {      // p=lebar(x), l=dalam(z), t=tinggi(y)
    const x = p / 2, z = l / 2, y = t / 2, V = [[-x, -y, z], [x, -y, z], [x, -y, -z], [-x, -y, -z], [-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]];
    const F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]], cube = p === l && l === t;
    const dim = (n) => cube ? 's' : n;
    return { V, F, fc: ['teal', 'teal', 'coral', 'coral', 'lav', 'lav'], names: 'ABCDEFGH'.split(''), feats: [
      { id: 'v', label: 'Titik sudut', count: 8, color: 'coral', txt: 'Titik sudut adalah titik pertemuan tiga rusuk. ' + (cube ? 'Kubus' : 'Balok') + ' memiliki 8 titik sudut (A sampai H).', items: [{ t: 'pts', ids: [0, 1, 2, 3, 4, 5, 6, 7] }] },
      { id: 'e', label: 'Rusuk', count: 12, color: 'navy', txt: cube ? 'Rusuk adalah garis pertemuan dua sisi. Kubus punya 12 rusuk yang semuanya sama panjang (s).' : 'Rusuk adalah garis pertemuan dua sisi. Balok punya 12 rusuk: 4 rusuk panjang (p), 4 rusuk lebar (l), dan 4 rusuk tinggi (t).', items: [{ t: 'edges', list: 'all' }, { t: 'seg', a: 0, b: 1, label: dim('p'), color: 'coral', off: [0, -14] }, { t: 'seg', a: 1, b: 2, label: dim('l'), color: 'teal', off: [14, 6] }, { t: 'seg', a: 1, b: 5, label: dim('t'), color: 'lav', off: [14, 0] }] },
      { id: 'f', label: 'Sisi (bidang)', count: 6, color: 'teal', txt: cube ? 'Sisi adalah bidang pembatas. Kubus punya 6 sisi berbentuk persegi yang kongruen (3 pasang berhadapan).' : 'Sisi adalah bidang pembatas. Balok punya 6 sisi persegi panjang: 3 pasang yang berhadapan dan sama besar.', items: [{ t: 'faces', list: 'all' }] },
      { id: 'db', label: 'Diagonal bidang', count: 12, color: 'teal', txt: 'Diagonal bidang menghubungkan dua titik sudut berhadapan pada satu sisi. Tiap sisi punya 2 diagonal, jadi ada 12. ' + (cube ? 'Panjangnya s√2.' : 'Pada sisi alas panjangnya √(p² + l²).'), formula: cube ? 'AC = s√2' : 'AC = √(p² + l²)', items: [0, 1, 2, 3, 4, 5].flatMap(fi => [[F[fi][0], F[fi][2]], [F[fi][1], F[fi][3]]]).map((d, i) => ({ t: 'seg', a: d[0], b: d[1], color: 'teal', dash: 1, label: i === 0 ? 'AC' : '' })) },
      { id: 'dr', label: 'Diagonal ruang', count: 4, color: 'coral', txt: 'Diagonal ruang menghubungkan dua titik sudut yang berhadapan melalui bagian dalam bangun. Ada 4 diagonal ruang yang sama panjang: AG, BH, CE, dan DF.', formula: cube ? 'AG = s√3' : 'AG = √(p² + l² + t²)', items: [[0, 6], [1, 7], [2, 4], [3, 5]].map((d, i) => ({ t: 'seg', a: d[0], b: d[1], color: 'coral', w: 3, label: i === 0 ? (cube ? 's√3' : '√(p²+l²+t²)') : '' })) },
      { id: 'bd', label: 'Bidang diagonal', count: 6, color: 'lav', txt: 'Bidang diagonal adalah bidang yang melalui dua rusuk berhadapan. Contoh: bidang ACGE berbentuk persegi panjang. Ada 6 bidang diagonal.', items: [{ t: 'poly', ids: [0, 2, 6, 4], color: 'lav' }, { t: 'pts', ids: [0, 2, 6, 4] }] }
    ] };
  }
  function prisma() {
    const a = 1.7, h = a * 0.866, t = 1.9, y = t / 2, c = h / 3, A = [-a / 2, -y, c], B = [a / 2, -y, c], C = [0, -y, c - h], up = (q) => [q[0], y, q[2]];
    const V = [A, B, C, up(A), up(B), up(C)], F = [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]], M = mid(A, B);
    return { V, F, fc: ['yel', 'yel', 'teal', 'mint', 'lav'], names: 'ABCDEF'.split(''), feats: [
      { id: 'v', label: 'Titik sudut', count: 6, color: 'coral', txt: 'Prisma segitiga memiliki 6 titik sudut: 3 di alas dan 3 di atas.', items: [{ t: 'pts', ids: [0, 1, 2, 3, 4, 5] }] },
      { id: 'e', label: 'Rusuk', count: 9, color: 'navy', txt: 'Ada 9 rusuk: 3 rusuk alas, 3 rusuk atas, dan 3 rusuk tegak yang sama panjang dengan tinggi prisma.', items: [{ t: 'edges', list: 'all' }] },
      { id: 'f', label: 'Sisi (bidang)', count: 5, color: 'teal', txt: 'Ada 5 sisi: 2 segitiga (alas dan atas) yang kongruen dan 3 persegi panjang sebagai sisi tegak (selimut).', items: [{ t: 'faces', list: 'all' }] },
      { id: 'db', label: 'Diagonal bidang', count: 6, color: 'teal', txt: 'Diagonal bidang hanya ada pada sisi tegak yang berbentuk persegi panjang: 2 diagonal pada tiap sisi tegak, total 6.', items: [[0, 4], [1, 3], [1, 5], [2, 4], [2, 3], [0, 5]].map((d, i) => ({ t: 'seg', a: d[0], b: d[1], color: 'teal', dash: 1, label: i === 0 ? 'diagonal bidang' : '' })) },
      { id: 'dr', label: 'Diagonal ruang', count: 0, color: 'coral', txt: 'Prisma segitiga tidak memiliki diagonal ruang, karena setiap dua titik sudutnya selalu berada pada satu bidang (sisi) yang sama.', items: [] },
      { id: 'tp', label: 'Tinggi prisma', count: 1, color: 'coral', txt: 'Tinggi prisma (t) adalah jarak tegak lurus antara bidang alas dan bidang atas, sama dengan panjang rusuk tegak.', formula: 'V = L alas × t', items: [{ t: 'seg', a: [0, -y, c - h / 3 * 2 + h / 3], b: [0, y, c - h / 3 * 2 + h / 3], color: 'coral', w: 3.5, label: 't', off: [12, 0] }, { t: 'pts', ids: [[0, -y, c - h / 3 * 2 + h / 3], [0, y, c - h / 3 * 2 + h / 3]], plain: 1 }] },
      { id: 'ta', label: 'Tinggi segitiga alas', count: 1, color: 'lav', txt: 'Tinggi segitiga alas ditarik dari satu titik sudut tegak lurus ke sisi di hadapannya. Untuk segitiga sama sisi: ½ a√3.', formula: 'L alas = ½ × a × t alas', items: [{ t: 'poly', ids: [0, 1, 2], color: 'yel' }, { t: 'seg', a: 2, b: M, color: 'lav', w: 3.5, label: 't alas', off: [-16, 6] }, { t: 'seg', a: 0, b: 1, color: 'navy', label: 'a', off: [0, 14] }] }
    ] };
  }
  function limas() {
    const a = 1.9, hh = 1.9, y = -hh / 2, h = a / 2, V = [[-h, y, h], [h, y, h], [h, y, -h], [-h, y, -h], [0, hh / 2, 0]], F = [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]], O = [0, y, 0], Mx = mid(V[0], V[1]);
    return { V, F, fc: ['teal', 'yel', 'coral', 'lav', 'mint'], names: 'ABCDT'.split(''), feats: [
      { id: 'v', label: 'Titik sudut', count: 5, color: 'coral', txt: 'Limas segiempat memiliki 5 titik sudut: 4 di alas (A–D) dan 1 titik puncak (T).', items: [{ t: 'pts', ids: [0, 1, 2, 3, 4] }] },
      { id: 'e', label: 'Rusuk', count: 8, color: 'navy', txt: 'Ada 8 rusuk: 4 rusuk alas dan 4 rusuk tegak yang bertemu di titik puncak.', items: [{ t: 'edges', list: 'all' }] },
      { id: 'f', label: 'Sisi (bidang)', count: 5, color: 'teal', txt: 'Ada 5 sisi: 1 alas berbentuk persegi dan 4 sisi tegak berbentuk segitiga sama kaki.', items: [{ t: 'faces', list: 'all' }] },
      { id: 'db', label: 'Diagonal bidang', count: 2, color: 'teal', txt: 'Pada alas persegi terdapat 2 diagonal bidang (AC dan BD) yang berpotongan di pusat alas. Panjangnya a√2.', formula: 'AC = a√2', items: [{ t: 'seg', a: 0, b: 2, color: 'teal', w: 3, label: 'AC' }, { t: 'seg', a: 1, b: 3, color: 'teal', w: 3, label: 'BD' }] },
      { id: 'dr', label: 'Diagonal ruang', count: 0, color: 'coral', txt: 'Limas tidak memiliki diagonal ruang: setiap pasang titik sudutnya berada pada satu sisi yang sama.', items: [] },
      { id: 'tl', label: 'Tinggi limas', count: 1, color: 'coral', txt: 'Tinggi limas (t) adalah jarak tegak lurus dari titik puncak T ke bidang alas, tepat di pusat alas.', formula: 'V = ⅓ × L alas × t', items: [{ t: 'seg', a: 4, b: O, color: 'coral', w: 3.5, label: 't', off: [10, 0] }, { t: 'pts', ids: [O], names: ['O'] }] },
      { id: 'ts', label: 'Tinggi sisi tegak', count: 1, color: 'lav', txt: 'Tinggi sisi tegak (s) ditarik dari puncak T tegak lurus ke tengah rusuk alas. Hubungannya: s² = t² + (½a)². Segitiga siku-siku T–O–M ditandai.', formula: 's = √(t² + (½a)²)', items: [{ t: 'poly', ids: [4, O, Mx], color: 'lav' }, { t: 'seg', a: 4, b: Mx, color: 'lav', w: 3.5, label: 's', off: [14, -4] }, { t: 'seg', a: O, b: Mx, color: 'navy', w: 2.5, label: '½a', off: [0, 14] }, { t: 'seg', a: 4, b: O, color: 'coral', w: 2.5, label: 't', off: [-12, 0] }, { t: 'pts', ids: [O, Mx], names: ['O', 'M'] }] }
    ] };
  }
  function tabung() {
    const n = 40, r = 1, y = 1.1, top = circ(n, r, y), bot = circ(n, r, -y), c1 = [0, y, 0], c0 = [0, -y, 0];
    return { curved: 'cyl', n, r, y, top, bot, feats: [
      { id: 'v', label: 'Titik sudut', count: 0, color: 'coral', txt: 'Tabung tidak memiliki titik sudut, karena tidak ada titik tempat rusuk-rusuk lurus saling bertemu.', items: [] },
      { id: 'e', label: 'Rusuk lengkung', count: 2, color: 'navy', txt: 'Tabung memiliki 2 rusuk lengkung berbentuk lingkaran, yaitu pertemuan selimut dengan alas dan tutup.', items: [{ t: 'curve', pts: top.concat([top[0]]), color: 'coral', w: 3.5 }, { t: 'curve', pts: bot.concat([bot[0]]), color: 'coral', w: 3.5 }] },
      { id: 'f', label: 'Sisi (bidang)', count: 3, color: 'teal', txt: 'Tabung memiliki 3 sisi: alas dan tutup (lingkaran yang kongruen) serta selimut yang melengkung.', items: [{ t: 'cylfaces' }] },
      { id: 'r', label: 'Jari-jari (r)', count: 1, color: 'coral', txt: 'Jari-jari adalah jarak dari pusat lingkaran ke tepinya. Diameter d = 2r.', formula: 'd = 2r', items: [{ t: 'seg', a: c1, b: top[0], color: 'coral', w: 3.5, label: 'r', off: [0, -10] }, { t: 'seg', a: top[n / 2], b: top[0], color: 'lav', w: 2, dash: 1, label: 'd = 2r', off: [0, 14] }, { t: 'pts', ids: [c1], names: ['O'] }] },
      { id: 't', label: 'Tinggi (t)', count: 1, color: 'lav', txt: 'Tinggi tabung adalah jarak antara bidang alas dan tutup, diukur lewat sumbu yang menghubungkan kedua pusat lingkaran.', formula: 'V = πr²t', items: [{ t: 'seg', a: c1, b: c0, color: 'lav', w: 3.5, label: 't', off: [12, 0] }, { t: 'pts', ids: [c1, c0], names: ['O₁', 'O₂'] }] },
      { id: 'gp', label: 'Garis pelukis', count: 1, color: 'teal', txt: 'Garis pelukis adalah garis pada selimut yang menghubungkan titik pada tutup dengan titik pada alas secara tegak lurus. Pada tabung panjangnya sama dengan tinggi.', items: [{ t: 'seg', a: top[8], b: bot[8], color: 'teal', w: 3.5, label: 't' }] },
      { id: 'dr', label: 'Diagonal ruang', count: 1, color: 'coral', txt: 'Diagonal ruang tabung menghubungkan titik di tepi tutup dengan titik di tepi alas yang berseberangan. Panjangnya √(d² + t²).', formula: '√(d² + t²)', items: [{ t: 'seg', a: top[0], b: bot[n / 2], color: 'coral', w: 3, label: '√(d²+t²)' }] }
    ] };
  }
  function kerucut() {
    const n = 40, r = 1, y = -0.95, hh = 1.9, base = circ(n, r, y), T = [0, hh + y, 0], O = [0, y, 0];
    return { curved: 'cone', n, r, y, base, T, feats: [
      { id: 'v', label: 'Titik puncak', count: 1, color: 'coral', txt: 'Kerucut tidak punya titik sudut biasa, tetapi memiliki 1 titik puncak (T), tempat semua garis pelukis bertemu.', items: [{ t: 'pts', ids: [T], names: ['T'] }] },
      { id: 'e', label: 'Rusuk lengkung', count: 1, color: 'navy', txt: 'Kerucut memiliki 1 rusuk lengkung berupa lingkaran, yaitu pertemuan alas dengan selimut.', items: [{ t: 'curve', pts: base.concat([base[0]]), color: 'coral', w: 3.5 }] },
      { id: 'f', label: 'Sisi (bidang)', count: 2, color: 'teal', txt: 'Kerucut memiliki 2 sisi: alas berbentuk lingkaran dan selimut yang melengkung menuju puncak.', items: [{ t: 'conefaces' }] },
      { id: 'r', label: 'Jari-jari (r)', count: 1, color: 'coral', txt: 'Jari-jari alas (r) adalah jarak dari pusat alas ke tepinya; diameter d = 2r.', formula: 'd = 2r', items: [{ t: 'seg', a: O, b: base[0], color: 'coral', w: 3.5, label: 'r', off: [0, 14] }, { t: 'seg', a: base[n / 2], b: base[0], color: 'lav', dash: 1, w: 2, label: 'd = 2r', off: [0, 28] }, { t: 'pts', ids: [O], names: ['O'] }] },
      { id: 't', label: 'Tinggi (t)', count: 1, color: 'lav', txt: 'Tinggi kerucut adalah jarak dari titik puncak T tegak lurus ke pusat alas O.', formula: 'V = ⅓πr²t', items: [{ t: 'seg', a: T, b: O, color: 'lav', w: 3.5, label: 't', off: [12, 0] }, { t: 'pts', ids: [T, O], names: ['T', 'O'] }] },
      { id: 'gp', label: 'Garis pelukis (s)', count: 1, color: 'teal', txt: 'Garis pelukis (s) menghubungkan puncak dengan titik pada tepi alas. Segitiga T–O–tepi siku-siku di O sehingga s² = r² + t².', formula: 's = √(r² + t²)', items: [{ t: 'poly', ids: [T, O, base[0]], color: 'teal' }, { t: 'seg', a: T, b: base[0], color: 'teal', w: 3.5, label: 's', off: [14, -4] }, { t: 'seg', a: T, b: O, color: 'lav', w: 2.5, label: 't', off: [-12, 0] }, { t: 'seg', a: O, b: base[0], color: 'coral', w: 2.5, label: 'r', off: [0, 14] }] }
    ] };
  }
  function bola() {
    const n = 60, eq = Array.from({ length: n + 1 }, (_, i) => [Math.cos(2 * Math.PI * i / n), 0, Math.sin(2 * Math.PI * i / n)]), lat = Array.from({ length: n + 1 }, (_, i) => [0.6 * Math.cos(2 * Math.PI * i / n), 0.8, 0.6 * Math.sin(2 * Math.PI * i / n)]), O = [0, 0, 0], Pp = [1, 0, 0], Q = [-1, 0, 0];
    return { curved: 'sph', eq, feats: [
      { id: 'v', label: 'Titik sudut', count: 0, color: 'coral', txt: 'Bola tidak memiliki titik sudut maupun rusuk; permukaannya mulus.', items: [] },
      { id: 'f', label: 'Sisi lengkung', count: 1, color: 'teal', txt: 'Bola hanya memiliki 1 sisi lengkung: kumpulan semua titik yang berjarak sama (r) dari titik pusat.', items: [{ t: 'sphface' }] },
      { id: 'o', label: 'Titik pusat (O)', count: 1, color: 'coral', txt: 'Titik pusat adalah titik yang jaraknya sama ke semua titik pada permukaan bola.', items: [{ t: 'pts', ids: [O], names: ['O'] }] },
      { id: 'r', label: 'Jari-jari (r)', count: 1, color: 'coral', txt: 'Jari-jari adalah ruas garis dari titik pusat ke titik pada permukaan bola.', formula: 'LP = 4πr²', items: [{ t: 'seg', a: O, b: Pp, color: 'coral', w: 3.5, label: 'r', off: [0, -10] }, { t: 'pts', ids: [O, Pp], names: ['O', 'P'] }] },
      { id: 'd', label: 'Diameter (d)', count: 1, color: 'lav', txt: 'Diameter adalah ruas garis yang melalui pusat dan menghubungkan dua titik pada permukaan; d = 2r.', formula: 'd = 2r', items: [{ t: 'seg', a: Q, b: Pp, color: 'lav', w: 3.5, label: 'd = 2r', off: [0, 14] }, { t: 'pts', ids: [Q, O, Pp], names: ['Q', 'O', 'P'] }] },
      { id: 'lb', label: 'Lingkaran besar', count: 1, color: 'teal', txt: 'Lingkaran besar adalah irisan bola dengan bidang yang melalui pusat. Jari-jarinya sama dengan jari-jari bola dan membagi bola menjadi dua belahan.', items: [{ t: 'curve', pts: eq, color: 'teal', w: 3.5 }] },
      { id: 'lk', label: 'Lingkaran kecil', count: 1, color: 'yel', txt: 'Lingkaran kecil adalah irisan bola dengan bidang yang tidak melalui pusat; jari-jarinya lebih kecil dari r.', items: [{ t: 'curve', pts: lat, color: 'amber', w: 3.5 }] }
    ] };
  }
  const MODELS = { kubus: () => box(2, 2, 2), balok: () => box(2.6, 1.6, 1.3), prisma, limas, tabung, kerucut, bola };

  // ---------- renderer ----------
  function mount(host, kind, opt) {
    opt = opt || {}; const M = MODELS[kind](), st = { rx: 22, ry: -32, sel: opt.sel || M.feats[0].id, auto: !opt.bare, drag: null }, S = kind === 'bola' ? 78 : kind === 'balok' ? 66 : 68;
    host.innerHTML = '<div class="anat' + (opt.bare ? ' bare' : '') + '"><div class="anat-view"><svg viewBox="0 0 440 340" role="img" aria-label="Model 3D ' + kind + ' interaktif"></svg><div class="anat-tip">⟳ Seret untuk memutar</div></div>' + (opt.bare ? '' : '<aside class="anat-side"><div class="chips-row wrapchips" id="an-chips">' +
      M.feats.map((f, i) => '<button class="chip-btn ' + (i ? '' : 'on') + '" data-p="' + f.id + '" data-pola="' + i + '">' + f.label + ' <b class="cnt">' + f.count + '</b></button>').join('') + '</div><div class="info-card" id="an-info"></div><div class="row gap wrap"><button class="btn btn-soft sm" id="an-auto">⏸ Hentikan putaran</button><button class="btn btn-ghost sm" id="an-reset">↺ Posisi awal</button></div></aside>') + '</div>';
    const svg = host.querySelector('svg'), info = host.querySelector('#an-info') || document.createElement('div');
    const rot = (p) => { const cy = Math.cos(st.ry * Math.PI / 180), sy = Math.sin(st.ry * Math.PI / 180), cx = Math.cos(st.rx * Math.PI / 180), sx = Math.sin(st.rx * Math.PI / 180); const X = p[0] * cy + p[2] * sy, Z = -p[0] * sy + p[2] * cy, Y = p[1] * cx - Z * sx, Z2 = p[1] * sx + Z * cx; return [X, Y, Z2]; };
    const pr = (q) => [220 + q[0] * S, 170 - q[1] * S], ptf = (r) => typeof r === 'number' ? M.V[r] : r;
    const hex = (c, k) => { const n = parseInt((P[c] || c).slice(1), 16), f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')'; };
    const lbl = (x, y, t, c) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="middle" class="al" fill="' + (P[c] || c || P.navy) + '">' + t + '</text>';
    const f = () => M.feats.find(x => x.id === st.sel);
    function draw() {
      const ft = f(), it = ft.items; let o = '', R, faces = [], edges = [];
      const has = (t) => it.some(x => x.t === t), hf = it.find(x => x.t === 'faces');
      if (M.V) {
        R = M.V.map(rot); const cen = R.reduce((a, q) => [a[0] + q[0], a[1] + q[1], a[2] + q[2]], [0, 0, 0]).map(x => x / R.length);
        faces = M.F.map((idx, i) => { const q = idx.map(k => R[k]), c = q.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], [0, 0, 0]).map(x => x / q.length), u = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], v = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]; let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const out = [c[0] - cen[0], c[1] - cen[1], c[2] - cen[2]]; if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) n = n.map(x => -x); const l = Math.hypot(n[0], n[1], n[2]); return { i, idx, front: n[2] / l > 0, nz: Math.abs(n[2] / l), z: c[2] }; }).sort((a, b) => a.z - b.z);
        const adj = {}; faces.forEach(fc => fc.idx.forEach((k, j) => { const k2 = fc.idx[(j + 1) % fc.idx.length], key = Math.min(k, k2) + '-' + Math.max(k, k2); (adj[key] = adj[key] || []).push(fc); }));
        edges = Object.keys(adj).map(k => ({ a: +k.split('-')[0], b: +k.split('-')[1], vis: adj[k].some(x => x.front) }));
        faces.forEach(fc => { const base = hf ? (hf.list === 'all' || hf.list.indexOf(fc.i) >= 0 ? M.fc[fc.i] : 'wht') : (ft.id === 'f' ? M.fc[fc.i] : 'sky'); const strong = !!hf; o += '<polygon points="' + fc.idx.map(k => pr(R[k]).map(v => v.toFixed(1)).join(',')).join(' ') + '" fill="' + hex(base, 0.82 + 0.18 * fc.nz) + '" fill-opacity="' + (strong ? (fc.front ? 0.86 : 0.35) : (fc.front ? 0.34 : 0.1)) + '" stroke="none"/>'; });
        const eAll = it.some(x => x.t === 'edges');
        edges.filter(e => !e.vis).forEach(e => { o += '<line x1="' + pr(R[e.a])[0] + '" y1="' + pr(R[e.a])[1] + '" x2="' + pr(R[e.b])[0] + '" y2="' + pr(R[e.b])[1] + '" stroke="#9AA6BD" stroke-width="1.3" stroke-dasharray="4 4" opacity=".75"/>'; });
        edges.filter(e => e.vis).forEach(e => { o += '<line x1="' + pr(R[e.a])[0] + '" y1="' + pr(R[e.a])[1] + '" x2="' + pr(R[e.b])[0] + '" y2="' + pr(R[e.b])[1] + '" stroke="' + (eAll ? P.navy : '#44506E') + '" stroke-width="' + (eAll ? 3 : 1.8) + '" stroke-linecap="round"/>'; });
      } else o += curvedBody(ft);
      it.forEach(x => { o += overlay(x); });
      // titik sudut kecil & label standar
      if (M.V && !it.some(x => x.t === 'pts')) M.V.forEach((p, i) => { const q = pr(R[i]); o += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="#44506E"/>'; });
      svg.innerHTML = o;
      function overlay(x) {
        const rr = (r) => rot(ptf(r)); let s = '';
        if (x.t === 'pts') x.ids.forEach((id, k) => { const q = pr(rr(id)), nm = x.names ? x.names[k] : (M.names && typeof id === 'number' ? M.names[id] : ''); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (x.plain ? 4 : 7) + '" fill="' + P.coral + '" stroke="#fff" stroke-width="2.2"/>' + (nm ? lbl(q[0] + 10, q[1] - 9, nm, 'navy') : ''); });
        if (x.t === 'seg') { const a = pr(rr(x.a)), b = pr(rr(x.b)); s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (P[x.color] || x.color) + '" stroke-width="' + (x.w || 2.5) + '" stroke-linecap="round"' + (x.dash ? ' stroke-dasharray="6 5"' : '') + '/>'; if (x.label) { const m = [(a[0] + b[0]) / 2 + (x.off ? x.off[0] : 0), (a[1] + b[1]) / 2 + (x.off ? x.off[1] : -8)]; s += lbl(m[0], m[1], x.label, x.color); } }
        if (x.t === 'poly') s += '<polygon points="' + x.ids.map(id => pr(rr(id)).map(v => v.toFixed(1)).join(',')).join(' ') + '" fill="' + (P[x.color] || x.color) + '" fill-opacity=".38" stroke="' + (P[x.color] || x.color) + '" stroke-width="2.2"/>';
        if (x.t === 'curve') s += '<polyline fill="none" points="' + x.pts.map(p => pr(rot(p)).map(v => v.toFixed(1)).join(',')).join(' ') + '" stroke="' + (P[x.color] || x.color) + '" stroke-width="' + (x.w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
        return s;
      }
    }
    function curvedBody(ft) {
      let s = ''; const strong = ft.items.some(x => x.t === 'cylfaces' || x.t === 'conefaces' || x.t === 'sphface'), ef = ft.items.some(x => x.t === 'curve');
      if (M.curved === 'sph') { const bright = strong; s += '<defs><radialGradient id="spg" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E8E2FF"/><stop offset=".6" stop-color="' + (bright ? '#8E7CE0' : '#B8A9F5') + '"/><stop offset="1" stop-color="#6C5CC4"/></radialGradient></defs><circle cx="220" cy="170" r="' + S + '" fill="url(#spg)" fill-opacity="' + (bright ? 0.95 : 0.55) + '" stroke="#6C5CC4" stroke-width="2"/>'; for (let m = 0; m < 6; m++) s += seg3(Array.from({ length: 41 }, (_, i) => [Math.cos(Math.PI * m / 6) * Math.cos(2 * Math.PI * i / 40), Math.sin(2 * Math.PI * i / 40), Math.sin(Math.PI * m / 6) * Math.cos(2 * Math.PI * i / 40)]), '#fff', 0.35); return s; }
      const n = M.n, top = M.curved === 'cyl' ? M.top : null, bot = M.curved === 'cyl' ? M.bot : M.base, apex = M.T, Rb = bot.map(rot), Rt = top ? top.map(rot) : null, Ra = apex ? rot(apex) : null;
      const topFront = M.curved === 'cyl' ? rot([0, 1, 0])[2] > 0 : false, baseFront = rot([0, -1, 0])[2] > 0, quads = [];
      for (let i = 0; i < n; i++) { const j = (i + 1) % n, a = (i + 0.5) / n * 2 * Math.PI, nz = rot([Math.cos(a), 0, Math.sin(a)]); const nn = M.curved === 'cone' ? rot([Math.cos(a) * 1.9, 1, Math.sin(a) * 1.9]) : nz; quads.push({ i, j, nz: nn[2], z: M.curved === 'cyl' ? (Rb[i][2] + Rb[j][2] + Rt[i][2] + Rt[j][2]) / 4 : (Rb[i][2] + Rb[j][2] + Ra[2]) / 3 }); }
      const fill = (c, k, op) => hex(c, k);
      const drawCap = (R, c) => '<polygon points="' + R.map(q => pr(q).map(v => v.toFixed(1)).join(',')).join(' ') + '" fill="' + hex(c, 1) + '" fill-opacity="' + (strong ? 0.88 : 0.4) + '" stroke="#44506E" stroke-width="1.6"/>';
      if (M.curved === 'cyl') { if (!topFront) s += drawCap(Rt, 'lav'); if (baseFront) s += drawCap(Rb, 'lav'); } else if (!baseFront) s += drawCap(Rb, 'lav');
      quads.sort((a, b) => a.z - b.z).forEach(q => { const pts = M.curved === 'cyl' ? [Rb[q.i], Rb[q.j], Rt[q.j], Rt[q.i]] : [Rb[q.i], Rb[q.j], Ra]; const front = q.nz > 0; s += '<polygon points="' + pts.map(p => pr(p).map(v => v.toFixed(1)).join(',')).join(' ') + '" fill="' + hex(M.curved === 'cone' ? 'coral' : 'sky', 0.78 + 0.22 * Math.abs(q.nz)) + '" fill-opacity="' + (strong ? (front ? 0.9 : 0.4) : (front ? 0.5 : 0.18)) + '" stroke="' + hex(M.curved === 'cone' ? 'coral' : 'sky', 0.9) + '" stroke-opacity=".25" stroke-width=".6"/>'; });
      if (M.curved === 'cyl') { if (topFront) s += drawCap(Rt, 'lav'); if (!baseFront) { } } if (baseFront) s += drawCap(Rb, M.curved === 'cyl' ? 'lav' : 'lav');
      const rim = (R, capFront) => { for (let i = 0; i < n; i++) { const j = (i + 1) % n, vis = capFront || (R[i][2] + R[j][2]) / 2 > 0, a = pr(R[i]), b = pr(R[j]); s += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + (vis ? '#44506E' : '#9AA6BD') + '" stroke-width="' + (vis ? (ef ? 1.6 : 2) : 1.2) + '"' + (vis ? '' : ' stroke-dasharray="4 4"') + '/>'; } };
      if (M.curved === 'cyl') { rim(Rt, topFront); rim(Rb, baseFront); const sil = (R0, R1) => { let lo = 0, hi = 0; for (let i = 0; i < n; i++) { if (R0[i][0] < R0[lo][0]) lo = i; if (R0[i][0] > R0[hi][0]) hi = i; } [lo, hi].forEach(k => { const a = pr(R0[k]), b = pr(R1[k]); s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#44506E" stroke-width="2"/>'; }); }; sil(Rb, Rt); }
      else { rim(Rb, baseFront); let lo = 0, hi = 0; for (let i = 0; i < n; i++) { if (Rb[i][0] < Rb[lo][0]) lo = i; if (Rb[i][0] > Rb[hi][0]) hi = i; } [lo, hi].forEach(k => { const a = pr(Rb[k]), b = pr(Ra); s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#44506E" stroke-width="2"/>'; }); }
      return s;
    }
    const seg3 = (pts, c, op) => '<polyline fill="none" stroke="' + c + '" stroke-opacity="' + op + '" stroke-width="1.2" points="' + pts.map(p => pr(rot(p)).map(v => v.toFixed(1)).join(',')).join(' ') + '"/>';
    function showInfo() { const ft = f(); info.innerHTML = '<h4><span class="dotc" style="background:' + P[ft.color] + '"></span>' + ft.label + ' · <b>' + ft.count + '</b></h4><p>' + ft.txt + '</p>' + (ft.formula ? '<div class="dv-f">' + ft.formula + '</div>' : '') + (ft.count === 0 ? '<p class="muted sm">Fitur ini tidak ada pada ' + kind + '.</p>' : ''); host.querySelectorAll('#an-chips .chip-btn').forEach(b => b.classList.toggle('on', b.dataset.p === st.sel)); }
    if (!opt.bare) host.querySelector('#an-chips').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; st.sel = b.dataset.p; showInfo(); draw(); };
    const view = host.querySelector('.anat-view'); view.addEventListener('pointerdown', e => { st.drag = { x: e.clientX, y: e.clientY }; st.auto = false; view.setPointerCapture(e.pointerId); const ab = host.querySelector('#an-auto'); if (ab) ab.textContent = '▶ Putar otomatis'; });
    view.addEventListener('pointermove', e => { if (!st.drag) return; st.ry += (e.clientX - st.drag.x) * 0.7; st.rx = Math.max(-80, Math.min(80, st.rx + (e.clientY - st.drag.y) * 0.5)); st.drag = { x: e.clientX, y: e.clientY }; draw(); });
    view.addEventListener('pointerup', () => st.drag = null); view.addEventListener('pointercancel', () => st.drag = null);
    if (!opt.bare) host.querySelector('#an-auto').onclick = (e) => { st.auto = !st.auto; e.target.textContent = st.auto ? '⏸ Hentikan putaran' : '▶ Putar otomatis'; };
    if (!opt.bare) host.querySelector('#an-reset').onclick = () => { st.rx = 22; st.ry = -32; draw(); };
    let raf, t0 = 0; (function loop(t) { raf = requestAnimationFrame(loop); if (st.auto && !st.drag && t - t0 > 40) { t0 = t; st.ry += 0.7; draw(); } })(0);
    showInfo(); draw();
    return { destroy() { cancelAnimationFrame(raf); }, select(id) { st.sel = id; showInfo(); draw(); } };
  }
  window.Anatomy = { mount };
})();
