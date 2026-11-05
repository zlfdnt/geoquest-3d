// ============================================================
//  art.js — ilustrasi vektor bergaya 3D (SVG, dibuat lewat kode: tanpa file gambar)
// ============================================================
(function () {
  const P = {
    coral: ['#FFB0AD', '#E85D5D', '#B93A3F'], teal: ['#8DF2E6', '#2EC4B6', '#1B8F84'], lav: ['#E0D8FF', '#B8A9F5', '#8A79DB'],
    yel: ['#FFEBB5', '#FFD66B', '#E8A92B'], navy: ['#5A6C9A', '#2D3B63', '#1F2A44'], mint: ['#D9FFF6', '#9FEBD9', '#5FCDB6'], sky: ['#E2F3FF', '#A8D8F5', '#6DB4E0'], wht: ['#FFFFFF', '#F1F4FA', '#D5DCEA']
  };
  const A = 0.866, B = 0.5;
  const f = (n) => Math.round(n * 10) / 10;
  const pts = (arr) => arr.map(p => f(p[0]) + ',' + f(p[1])).join(' ');
  const poly = (arr, fill, extra) => '<polygon points="' + pts(arr) + '" fill="' + fill + '" ' + (extra || 'stroke="#fff" stroke-opacity=".55" stroke-width="1.5" stroke-linejoin="round"') + '/>';
  const shadow = (cx, cy, rx) => '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + rx * 0.28 + '" fill="#1F2A44" opacity=".13"/>';

  // balok isometrik; (0,0) = titik depan-bawah
  function box(w, d, h, c) {
    const F = [0, 0], R = [w * A, -w * B], L = [-d * A, -d * B], K = [R[0] + L[0], R[1] + L[1]];
    const up = (p) => [p[0], p[1] - h];
    return poly([L, F, up(F), up(L)], c[1]) + poly([F, R, up(R), up(F)], c[2]) + poly([up(L), up(F), up(R), up(K)], c[0]);
  }
  function pyramid(w, h, c) {
    const F = [0, 0], R = [w * A, -w * B], L = [-w * A, -w * B], K = [0, -w], apex = [0, -w * B - h];
    return poly([L, F, apex], c[1]) + poly([F, R, apex], c[2]) + poly([R, K, apex], c[0], 'stroke="#fff" stroke-opacity=".3" stroke-width="1"');
  }
  function prism(w, h, d, c) {                             // prisma segitiga (tenda), proyeksi miring
    const F0 = [-w / 2, 0], F1 = [w / 2, 0], F2 = [0, -h], o = [d * 0.7, -d * 0.45];
    const m = (p) => [p[0] + o[0], p[1] + o[1]];
    return poly([F0, F2, m(F2), m(F0)], c[0]) + poly([F1, m(F1), m(F2), F2], c[1]) + poly([F0, F1, F2], c[2]);
  }
  function cyl(rx, h, c, id) {
    const ry = rx * 0.34;
    return '<defs><linearGradient id="cy' + id + '" x1="0" x2="1"><stop offset="0" stop-color="' + c[2] + '"/><stop offset=".35" stop-color="' + c[1] + '"/><stop offset=".7" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs>' +
      '<path d="M' + -rx + ' ' + -h + 'V0A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' 0V' + -h + 'Z" fill="url(#cy' + id + ')"/><ellipse cx="0" cy="' + -h + '" rx="' + rx + '" ry="' + ry + '" fill="' + c[0] + '" stroke="#fff" stroke-opacity=".6"/>';
  }
  function cone(rx, h, c, id) {
    const ry = rx * 0.34;
    return '<defs><linearGradient id="co' + id + '" x1="0" x2="1"><stop offset="0" stop-color="' + c[2] + '"/><stop offset=".45" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs>' +
      '<path d="M' + -rx + ' 0A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' 0L0 ' + -h + 'Z" fill="url(#co' + id + ')"/>';
  }
  function sphere(r, c, id) {
    return '<defs><radialGradient id="sp' + id + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></radialGradient></defs><circle r="' + r + '" fill="url(#sp' + id + ')"/><ellipse cx="' + -r * 0.35 + '" cy="' + -r * 0.45 + '" rx="' + r * 0.22 + '" ry="' + r * 0.13 + '" fill="#fff" opacity=".55" transform="rotate(-35 ' + -r * 0.35 + ' ' + -r * 0.45 + ')"/>';
  }
  const g = (x, y, inner, k, rot) => '<g transform="translate(' + x + ',' + y + ') scale(' + (k || 1) + ')' + (rot ? ' rotate(' + rot + ')' : '') + '">' + inner + '</g>';
  const wrap = (inner, bg) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bg[0] + '"/><stop offset="1" stop-color="' + bg[1] + '"/></linearGradient></defs><rect width="400" height="300" fill="url(#bg)"/>' +
    '<circle cx="330" cy="50" r="70" fill="#fff" opacity=".35"/><circle cx="60" cy="260" r="90" fill="#fff" opacity=".25"/><circle cx="355" cy="238" r="9" fill="#fff" opacity=".7"/><circle cx="40" cy="70" r="6" fill="#fff" opacity=".7"/>' + inner + '</svg>';
  const uri = (svg) => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  let uid = 0;

  // ---------- jaring-jaring (net) sebagai SVG mini ----------
  const sq = (x, y, w, h, c) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
  const tri = (a, b, c2, fill) => poly([a, b, c2], fill, 'stroke="#fff" stroke-width="2" stroke-linejoin="round"');
  function net(kind, cx, cy, k) {
    const cs = [P.teal[1], P.lav[1], P.yel[1], P.coral[1], P.mint[2], P.sky[2]]; let o = '';
    if (kind === 'kubus') { const s = 44, x0 = -2 * s, y0 = -1.5 * s; [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]].forEach((p, i) => o += sq(x0 + p[0] * s, y0 + p[1] * s, s, s, cs[i])); }
    else if (kind === 'balok') { const u = 22; [[1, 0, 3, 1], [0, 1, 1, 2], [1, 1, 3, 2], [4, 1, 1, 2], [1, 3, 3, 1], [1, 4, 3, 2]].forEach((p, i) => o += sq(-2.5 * u + p[0] * u * 1.0, -3 * u + p[1] * u, p[2] * u, p[3] * u, cs[i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2])); }
    else if (kind === 'prisma') { const w = 46, h = 70, t = 40, x0 = -1.5 * w, y0 = -h / 2; for (let i = 0; i < 3; i++) o += sq(x0 + i * w, y0, w, h, cs[i]); o += tri([x0 + w, y0], [x0 + 2 * w, y0], [x0 + 1.5 * w, y0 - t], cs[3]) + tri([x0 + w, y0 + h], [x0 + 2 * w, y0 + h], [x0 + 1.5 * w, y0 + h + t], cs[3]); }
    else if (kind === 'limas') { const s = 52, t = 50; o += sq(-s / 2, -s / 2, s, s, cs[0]) + tri([-s / 2, -s / 2], [s / 2, -s / 2], [0, -s / 2 - t], cs[1]) + tri([-s / 2, s / 2], [s / 2, s / 2], [0, s / 2 + t], cs[2]) + tri([-s / 2, -s / 2], [-s / 2, s / 2], [-s / 2 - t, 0], cs[3]) + tri([s / 2, -s / 2], [s / 2, s / 2], [s / 2 + t, 0], cs[4]); }
    else if (kind === 'tabung') { const r = 24, w = r * 2 * Math.PI, h = 56; o += sq(-w / 2, -h / 2, w, h, cs[1]) + '<circle cx="' + (-w / 4) + '" cy="' + (-h / 2 - r) + '" r="' + r + '" fill="' + cs[0] + '" stroke="#fff" stroke-width="2"/><circle cx="' + (w / 4) + '" cy="' + (h / 2 + r) + '" r="' + r + '" fill="' + cs[0] + '" stroke="#fff" stroke-width="2"/>'; }
    else if (kind === 'kerucut') { const R = 78, a = 100 * Math.PI / 180, x1 = R * Math.sin(a / 2), y1 = R * Math.cos(a / 2); o += '<path d="M0,-40 L' + -x1 + ',' + (y1 - 40) + ' A' + R + ' ' + R + ' 0 0 0 ' + x1 + ',' + (y1 - 40) + ' Z" fill="' + cs[1] + '" stroke="#fff" stroke-width="2" transform="translate(0,-6)"/><circle cx="0" cy="62" r="22" fill="' + cs[0] + '" stroke="#fff" stroke-width="2"/>'; }
    else { for (let i = 0; i < 6; i++) o += '<path d="M0,-52 Q' + (14) + ',0 0,52 Q' + (-14) + ',0 0,-52Z" fill="' + cs[i] + '" stroke="#fff" stroke-width="1.5" transform="translate(' + (-85 + i * 34) + ',0)"/>'; }
    return g(cx, cy, o, k || 1);
  }
  const NET_BG = [P.wht[0], '#EAF6FF'];

  // ---------- objek kehidupan nyata ----------
  function nyata(kind) {
    let o = '';
    if (kind === 'kubus') {
      o = shadow(200, 232, 90) + g(200, 205, box(105, 105, 105, P.wht)) + g(200, 205, '<g fill="' + P.coral[1] + '"><circle cx="-34" cy="-112" r="6"/><circle cx="0" cy="-124" r="6"/><circle cx="34" cy="-112" r="6"/><circle cx="0" cy="-150" r="6"/><circle cx="-62" cy="-72" r="6"/><circle cx="-62" cy="-30" r="6" transform="translate(0,6)"/><circle cx="62" cy="-72" r="6"/><circle cx="62" cy="-34" r="6"/><circle cx="48" cy="-52" r="6"/><circle cx="-48" cy="-50" r="6"/></g>');
    } else if (kind === 'balok') {
      o = shadow(200, 232, 105) + g(200, 205, box(130, 90, 70, P.coral) + '<polygon points="-12,-66 -12,-14 12,-14 12,-66" fill="' + P.yel[1] + '" opacity=".95" transform="translate(40,-24) skewY(30)"/>' + '<path d="M-40,-70 q-20,-30 0,-34 q20,6 0,34 q20,-28 40,-22 q4,20 -40,22z" fill="' + P.yel[1] + '" transform="translate(-30,0)"/>');
    } else if (kind === 'prisma') {
      o = shadow(200, 236, 130) + g(180, 225, prism(160, 110, 100, P.teal)) + '<path d="M110 225 L160 150" stroke="' + P.navy[2] + '" stroke-width="3" opacity=".35"/><circle cx="330" cy="70" r="26" fill="' + P.yel[1] + '"/>';
    } else if (kind === 'limas') {
      o = '<circle cx="320" cy="60" r="28" fill="' + P.yel[1] + '"/><path d="M0 235 Q120 205 200 232 T400 228 V300 H0Z" fill="#F6DFA6"/>' + g(200, 232, pyramid(120, 135, P.yel).replace(/#FFEBB5/g, '#F5D58A')) ;
    } else if (kind === 'tabung') {
      o = shadow(200, 236, 80) + g(200, 232, cyl(62, 140, P.sky, ++uid) + '<rect x="-62" y="-95" width="124" height="46" fill="' + P.coral[1] + '" opacity=".9"/><text y="-64" text-anchor="middle" font-family="Epilogue,sans-serif" font-weight="800" font-size="20" fill="#fff">SUSU</text>');
    } else if (kind === 'kerucut') {
      o = shadow(200, 252, 60) + g(200, 250, cone(48, 140, P.yel, ++uid).replace(/<path d="M-48 0A48 16.3 0 0 0 48 0L0 -140Z"/, '<path d="M-48 -140A48 16.3 0 0 1 48 -140L0 0Z"') ) ;
      o = shadow(200, 252, 55) + '<path d="M150 150 L200 252 L250 150Z" fill="#E8B461"/><path d="M165 168 L235 168 M175 192 L225 192 M185 216 L215 216 M165 150 L200 252 M200 150 L235 168" stroke="#C98F3C" stroke-width="2" fill="none" opacity=".7"/><g transform="translate(200,128)">' + sphere(56, P.coral, ++uid) + '</g><circle cx="200" cy="64" r="9" fill="' + P.coral[2] + '"/>';
    } else {
      o = shadow(200, 245, 80) + g(200, 170, sphere(76, ['#FFC58A', '#F28C28', '#C45F0D'], ++uid) + '<g fill="none" stroke="#3B2A1A" stroke-width="3"><path d="M-76 0H76"/><path d="M0 -76V76"/><path d="M-54 -54Q-20 0 -54 54"/><path d="M54 -54Q20 0 54 54"/></g>');
    }
    return wrap(o, kind === 'limas' ? ['#FFF3D6', '#FFE2A8'] : kind === 'prisma' ? ['#E3FFF8', '#BDEFE6'] : ['#FFF1EF', '#FFD9D6']);
  }
  // ---------- solid utama ----------
  function solid(kind) {
    let o;
    const sh = shadow(200, 240, 100);
    if (kind === 'kubus') o = sh + g(200, 215, box(110, 110, 110, P.coral));
    else if (kind === 'balok') o = sh + g(205, 215, box(150, 80, 80, P.lav));
    else if (kind === 'prisma') o = sh + g(190, 222, prism(150, 120, 100, P.teal));
    else if (kind === 'limas') o = sh + g(200, 225, pyramid(115, 150, P.yel));
    else if (kind === 'tabung') o = sh + g(200, 235, cyl(66, 140, P.sky, ++uid));
    else if (kind === 'kerucut') o = sh + g(200, 235, cone(70, 165, P.coral, ++uid));
    else o = sh + g(200, 160, sphere(88, P.lav, ++uid));
    return wrap(o, { kubus: ['#FFF1EF', '#FFD0CD'], balok: ['#F4F0FF', '#DCD3FF'], prisma: ['#E3FFF8', '#B8EEE3'], limas: ['#FFF8E1', '#FFE3A0'], tabung: ['#EAF6FF', '#BFE2F8'], kerucut: ['#FFF1EF', '#FFCFCB'], bola: ['#F4F0FF', '#D6CCFF'] }[kind]);
  }
  function jaring(kind) { return wrap(net(kind, 200, 150, kind === 'tabung' ? 0.85 : kind === 'balok' ? 1.05 : 1.1), NET_BG); }

  const KINDS = ['kubus', 'balok', 'prisma', 'limas', 'tabung', 'kerucut', 'bola'];
  const cache = {};
  function img(kind, v) {
    const key = kind + v; if (cache[key]) return cache[key];
    const cust = (window.APP_CONFIG.GAMBAR || {})[kind];
    if (cust && cust[v]) return (cache[key] = cust[v]);
    return (cache[key] = uri(v === 0 ? solid(kind) : v === 1 ? jaring(kind) : nyata(kind)));
  }
  // ---------- slide hero ----------
  function hero(i) {
    let o;
    if (i === 0) o = shadow(200, 250, 150) + g(120, 215, box(80, 80, 80, P.coral)) + g(250, 238, cyl(52, 105, P.sky, ++uid)) + g(330, 140, sphere(46, P.lav, ++uid)) + g(205, 120, pyramid(70, 80, P.yel), 0.9);
    else if (i === 1) o = net('kubus', 120, 160, 0.95) + '<path d="M205 150 H255" stroke="#1F2A44" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 9"/><path d="M248 140 l14 10 l-14 10" fill="none" stroke="#1F2A44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' + shadow(325, 215, 55) + g(325, 200, box(70, 70, 70, P.teal));
    else o = '<rect x="70" y="40" width="260" height="190" rx="18" fill="#1F2A44"/><rect x="82" y="86" width="120" height="132" rx="10" fill="#fff"/><rect x="212" y="86" width="106" height="132" rx="10" fill="#fff"/><rect x="92" y="98" width="70" height="8" rx="4" fill="' + P.lav[1] + '"/><rect x="92" y="116" width="100" height="6" rx="3" fill="#D5DCEA"/><rect x="92" y="130" width="90" height="6" rx="3" fill="#D5DCEA"/><rect x="92" y="150" width="100" height="50" rx="6" fill="#EAF6FF"/><g fill="' + P.teal[1] + '"><circle cx="228" cy="108" r="9"/><circle cx="228" cy="138" r="9"/></g><g fill="#D5DCEA"><rect x="244" y="102" width="62" height="12" rx="6"/><rect x="244" y="132" width="62" height="12" rx="6"/><rect x="244" y="162" width="62" height="12" rx="6"/></g><circle cx="228" cy="168" r="9" fill="' + P.coral[1] + '"/><rect x="262" y="52" width="56" height="24" rx="12" fill="#FFD66B"/><text x="290" y="69" text-anchor="middle" font-family="Epilogue,sans-serif" font-weight="800" font-size="13" fill="#1F2A44">34:17</text><circle cx="98" cy="64" r="8" fill="' + P.teal[1] + '"/>';
    return uri(wrap(o, [['#FFF1EF', '#FFD0CD'], ['#E3FFF8', '#BFEFE6'], ['#F4F0FF', '#D6CCFF']][i]));
  }
  window.Art = { P, KINDS, img, hero, poly, sq, tri, g, wrap, uri, net, solid: (k) => uri(solid(k)), prim: { box, pyramid, prism, cyl, cone, sphere, shadow } };
})();
