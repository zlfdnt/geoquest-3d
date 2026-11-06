// ============================================================
//  fold3d.js — Laboratorium Jaring-jaring 3D (CSS 3D, tanpa pustaka)
//  Mesin poligon-engsel: tiap bidang = poligon yang direkatkan pada satu rusuk bidang induk,
//  lalu dilipat mengelilingi rusuk itu. Dipakai untuk semua varian jaring-jaring.
// ============================================================
(function () {
  const COL = { teal: ['#7DEDE0', '#2EC4B6'], lav: ['#E3DCFF', '#B8A9F5'], coral: ['#FFC9C6', '#F58A87'], yel: ['#FFE9AE', '#FFD66B'], sky: ['#CFEAFB', '#8CC8EE'], mint: ['#CFF7EC', '#8FE3CE'] };
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const RECT = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]], TRI = (w, h, ax) => [[0, 0], [w, 0], [w * (ax == null ? 0.5 : ax), h]];
  const nd = (n, v, o) => Object.assign({ n: n || '', v, c: [], k: 0, m: 0, at: 0, ang: 90, col: 'teal', shape: 'poly' }, o || {});
  const att = (p, k, ch) => { ch.k = k; p.c.push(ch); return ch; };
  const I = () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  const mul = (A, B) => ({ a: A.a * B.a + A.c * B.b, b: A.b * B.a + A.d * B.b, c: A.a * B.c + A.c * B.d, d: A.b * B.c + A.d * B.d, e: A.a * B.e + A.c * B.f + A.e, f: A.b * B.e + A.d * B.f + A.f });
  const TT = (x, y) => ({ a: 1, b: 0, c: 0, d: 1, e: x, f: y }), RR = (deg) => { const c = Math.cos(deg * D2R), s = Math.sin(deg * D2R); return { a: c, b: s, c: -s, d: c, e: 0, f: 0 }; };
  const ap = (M, p) => [M.a * p[0] + M.c * p[1] + M.e, M.b * p[0] + M.d * p[1] + M.f];

  // ---------- jaring-jaring kubus/balok dari denah kotak (11 pola) ----------
  const NETS = [
    ['1-4-1 · A', ['#...', '####', '#...'], '141a'], ['1-4-1 · B', ['#...', '####', '.#..'], '141b'], ['1-4-1 · C', ['#...', '####', '..#.'], '141c'], ['1-4-1 · D', ['#...', '####', '...#'], '141d'], ['1-4-1 · E', ['.#..', '####', '.#..'], '141e'], ['1-4-1 · F', ['.#..', '####', '..#.'], '141f'],
    ['2-3-1 · A', ['##..', '.###', '.#..'], '231a'], ['2-3-1 · B', ['##..', '.###', '..#.'], '231b'], ['2-3-1 · C', ['##..', '.###', '...#'], '231c'], ['2-2-2 (Tangga)', ['##...', '.##..', '..##.'], '222'], ['3-3', ['###..', '..###'], '33']
  ];
  const NAMA_SISI = { '0,0,-1': 'Alas', '0,0,1': 'Atas', '-1,0,0': 'Kiri', '1,0,0': 'Kanan', '0,-1,0': 'Belakang', '0,1,0': 'Depan' }, PAIR = { Alas: 'teal', Atas: 'teal', Kiri: 'lav', Kanan: 'lav', Belakang: 'coral', Depan: 'coral' };
  function gridTree(rows, dims) {
    const cells = {}; rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (ch === '#') cells[x + ',' + y] = { x, y }; }));
    const keys = Object.keys(cells), nb = (c) => [[0, -1, 0], [1, 0, 1], [0, 1, 2], [-1, 0, 3]].map(d => ({ k: d[2], key: (c.x + d[0]) + ',' + (c.y + d[1]) })).filter(o => cells[o.key]);
    const rootKey = keys.slice().sort((a, b) => nb(cells[b]).length - nb(cells[a]).length)[0], seen = {}, vec = (x, y, z) => [x, y, z], neg = (v) => v.map(x => -x);
    const D = dims, axisDim = (v) => D[v.findIndex(x => Math.abs(x) > 0.5)];
    function make(key, frame, kIn) {
      seen[key] = 1; const out = neg(frame.ez), name = NAMA_SISI[out.map(Math.round).join(',')], w = axisDim(frame.ex), h = axisDim(frame.ey);
      const n = nd(name, RECT(w, h), { col: PAIR[name], m: kIn === undefined ? 0 : (kIn + 2) % 4, lbl: 1 });
      nb(cells[key]).forEach(o => { if (seen[o.key]) return; const P = frame; let f; if (o.k === 1) f = { ex: P.ez, ey: P.ey, ez: neg(P.ex) }; else if (o.k === 3) f = { ex: neg(P.ez), ey: P.ey, ez: P.ex }; else if (o.k === 2) f = { ex: P.ex, ey: P.ez, ez: neg(P.ey) }; else f = { ex: P.ex, ey: neg(P.ez), ez: P.ey }; att(n, o.k, make(o.key, f, o.k)); });
      return n;
    }
    return make(rootKey, { ex: vec(1, 0, 0), ey: vec(0, 1, 0), ez: vec(0, 0, 1) });
  }
  const boxTree = (rows, dims, zc, zoom) => ({ root: gridTree(rows, dims), zc, zoom });

  function variants(kind) {
    if (kind === 'kubus') return NETS.map(n => ({ id: n[2], label: n[0], make: () => boxTree(n[1], [70, 70, 70], 35, 1.9) }));
    if (kind === 'balok') return NETS.map(n => ({ id: n[2], label: n[0], make: () => boxTree(n[1], [112, 70, 46], 23, 1.6) }));
    if (kind === 'prisma') {
      const a = 84, ht = a * 0.866, t = 100;
      const mk = (ti, bi) => () => { const root = nd('Sisi 2', RECT(a, t), { col: 'teal', lbl: 1 }), rects = [att(root, 3, nd('Sisi 1', RECT(a, t), { col: 'mint', m: 1, ang: 120, lbl: 1 })), root, att(root, 1, nd('Sisi 3', RECT(a, t), { col: 'mint', m: 3, ang: 120, lbl: 1 }))]; att(rects[ti], 0, nd('Alas', TRI(a, ht), { col: 'yel', lbl: 1 })); att(rects[bi], 2, nd('Atas', TRI(a, ht), { col: 'yel', lbl: 1 })); return { root, zc: ht / 3, zoom: 1.7 }; };
      return [{ id: 'p11', label: 'Segitiga di tengah', make: mk(1, 1) }, { id: 'p02', label: 'Segitiga di ujung (silang)', make: mk(0, 2) }, { id: 'p20', label: 'Segitiga di ujung (balik)', make: mk(2, 0) }, { id: 'p01', label: 'Segitiga bertangga', make: mk(0, 1) }, { id: 'p22', label: 'Segitiga sisi kanan', make: mk(2, 2) }];
    }
    if (kind === 'limas') {
      const a = 92, h = 84, s = Math.sqrt(h * h + a * a / 4), pb = 180 - Math.atan2(h, a / 2) * R2D, nu = Math.acos((a * a / 4) / (h * h + a * a / 4)) * R2D, cols = ['yel', 'lav', 'coral', 'mint'];
      const T = (i) => nd('Sisi tegak', TRI(a, s), { col: cols[i], ang: pb, lbl: 1 }), base = () => nd('Alas', RECT(a, a), { col: 'teal', lbl: 1 });
      return [
        { id: 'l4', label: 'Silang (4 sisi tegak)', make: () => { const r = base(); [0, 1, 2, 3].forEach(k => att(r, k, T(k))); return { root: r, zc: h / 3, zoom: 1.7 }; } },
        { id: 'l31', label: '3 + 1 menempel segitiga', make: () => { const r = base(), top = att(r, 0, T(0)); att(r, 3, T(1)); att(r, 2, T(2)); const x = att(top, 2, T(3)); x.m = 1; x.ang = nu; return { root: r, zc: h / 3, zoom: 1.7 }; } },
        { id: 'l22', label: 'Segitiga berantai', make: () => { const r = base(); att(r, 0, T(0)); att(r, 1, T(1)); const left = att(r, 3, T(2)), x = att(left, 1, T(3)); x.m = 2; x.ang = nu; return { root: r, zc: h / 3, zoom: 1.7 }; } }
      ];
    }
    if (kind === 'tabung') {
      const r = 30, t = 92, n = 20, w = 2 * Math.PI * r / n + 0.4;
      const mk = (ti, bi) => () => { const root = nd('Selimut', RECT(w, t), { col: 'sky', strip: 1 }), chain = [root]; for (let i = 1; i < n; i++) chain.push(att(chain[i - 1], 1, nd('Selimut', RECT(w, t), { col: 'sky', strip: 1, m: 3, ang: 360 / n }))); [[ti, 0, 'Alas'], [bi, 2, 'Tutup']].forEach(c => { const cap = att(chain[c[0]], c[1], nd(c[2], RECT(2 * r, 2 * r), { col: 'lav', shape: 'circ', m: c[1] === 0 ? 0 : 0, at: (w - 2 * r) / 2, lbl: 1 })); }); return { root, zc: r, zoom: 1.8 }; };
      return [{ id: 't00', label: 'Lingkaran di ujung kiri', make: mk(0, 0) }, { id: 'tmm', label: 'Lingkaran di tengah', make: mk(10, 10) }, { id: 't0e', label: 'Lingkaran berseberangan', make: mk(0, n - 1) }, { id: 'tqq', label: 'Lingkaran di sela', make: mk(5, 15) }];
    }
    if (kind === 'kerucut') {
      const s = 76, r = 30, n = 24, al = (2 * Math.PI * r / s) / n, rho = s * Math.sin(al / 2) / Math.sin(Math.PI / n), h = Math.sqrt(s * s - rho * rho);
      const V = (i) => ({ x: rho * Math.cos(2 * Math.PI * i / n), y: rho * Math.sin(2 * Math.PI * i / n) }), n0 = ((p, q) => { const c = [p.y * 0 - 0 * q.y, 0, 0]; return c; });
      const nor = (i) => { const A = [V(i).x, V(i).y, -h], B = [V(i + 1).x, V(i + 1).y, -h], c = [A[1] * B[2] - A[2] * B[1], A[2] * B[0] - A[0] * B[2], A[0] * B[1] - A[1] * B[0]], l = Math.hypot(c[0], c[1], c[2]); return c.map(x => x / l); };
      const n1 = nor(0), n2 = nor(1), nu = Math.acos(Math.max(-1, Math.min(1, n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2]))) * R2D, capAng = 180 - Math.atan2(h, rho * Math.cos(Math.PI / n)) * R2D, chord = 2 * s * Math.sin(al / 2);
      const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return a.map(x => x / l); }, dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const f1 = nm([rho, 0, -h]), a1 = nm([rho * Math.cos(2 * Math.PI / n), rho * Math.sin(2 * Math.PI / n), -h]), f3 = nm(cr(f1, a1)), f2 = cr(f3, f1), BA = [0, 0, -h], cc = [dt(BA, f1), dt(BA, f2), Math.abs(dt(BA, f3))], rz = 90 - Math.atan2(cc[1], cc[0]) * R2D;
      const mk = (ci) => () => { const sl = () => [[0, 0], [s, 0], [s * Math.cos(al), s * Math.sin(al)]], root = nd('Selimut', sl(), { col: 'coral', strip: 1 }), chain = [root]; for (let i = 1; i < n; i++) chain.push(att(chain[i - 1], 2, nd('Selimut', sl(), { col: i % 2 ? 'coral' : 'yel', strip: 1, m: 0, ang: nu }))); chain[0].col = 'yel'; att(chain[ci], 1, nd('Alas', RECT(2 * rho, 2 * rho), { col: 'lav', shape: 'circ', m: 0, at: (chord - 2 * rho) / 2, ang: capAng, lbl: 1 })); return { root, zc: cc[2] / 2, zoom: 1.6, fc: [cc[0] / 2, cc[1] / 2], rz }; };
      return [{ id: 'k0', label: 'Lingkaran di ujung juring', make: mk(0) }, { id: 'k12', label: 'Lingkaran di tengah juring', make: mk(12) }, { id: 'k23', label: 'Lingkaran di ujung lain', make: mk(n - 1) }];
    }
    return [{ id: 'b6', label: 'Gores 6' }, { id: 'b8', label: 'Gores 8' }, { id: 'b12', label: 'Gores 12' }];
  }

  // ---------- persiapan geometri ----------
  function prep(node, parent) {
    const xs = node.v.map(p => p[0]), ys = node.v.map(p => p[1]); node.W = Math.max.apply(null, xs); node.H = Math.max.apply(null, ys);
    node.cx = xs.reduce((a, b) => a + b, 0) / xs.length; node.cy = ys.reduce((a, b) => a + b, 0) / ys.length;
    if (!parent) { node.flat = I(); node.d = 0; }
    else {
      const P = parent.v, k = node.k, A = P[k], B = P[(k + 1) % P.length], L = Math.hypot(A[0] - B[0], A[1] - B[1]), e = [(A[0] - B[0]) / L, (A[1] - B[1]) / L];
      const C0 = node.v[node.m], C1 = node.v[(node.m + 1) % node.v.length], H0 = [B[0] + e[0] * node.at, B[1] + e[1] * node.at];
      node.ph = Math.atan2(e[1], e[0]) * R2D; node.ac = Math.atan2(C1[1] - C0[1], C1[0] - C0[0]) * R2D; node.H0 = H0; node.C0 = C0;
      node.flat = mul(parent.flat, mul(TT(H0[0], H0[1]), mul(RR(node.ph), mul(RR(-node.ac), TT(-C0[0], -C0[1])))));
      node.d = parent.d + 1;
    }
    node.c.forEach(k => prep(k, node));
  }
  const walk = (n, f) => { f(n); n.c.forEach(k => walk(k, f)); };
  function build(node, parentEl, dm) {
    const el = document.createElement('div'); el.className = 'face' + (node.strip ? ' strip' : ''); const c = COL[node.col] || COL.teal;
    el.style.cssText = 'left:0;top:0;width:' + node.W + 'px;height:' + node.H + 'px;';
    const sh = document.createElement('div'); sh.className = 'sh'; sh.style.cssText = 'background:linear-gradient(135deg,' + c[0] + ',' + c[1] + ');' + (node.shape === 'circ' ? 'border-radius:50%;' : node.v.length === 4 ? '' : 'clip-path:polygon(' + node.v.map(p => p[0].toFixed(2) + 'px ' + p[1].toFixed(2) + 'px').join(',') + ');'); el.appendChild(sh);
    if (node.lbl && node.n) { const ang = -Math.atan2(node.flat.b, node.flat.a) * R2D, st = 'left:' + node.cx + 'px;top:' + node.cy + 'px;'; el.insertAdjacentHTML('beforeend', '<span class="lb" style="' + st + 'transform:translate(-50%,-50%) rotate(' + ang + 'deg)">' + node.n + '</span><span class="lb bk" style="' + st + 'transform:translate(-50%,-50%) rotateY(180deg) rotate(' + -ang + 'deg)">' + node.n + '</span>'); }
    node.el = el; dm.max = Math.max(dm.max, node.d); (parentEl || dm.scene).appendChild(el); node.c.forEach(k => build(k, el, dm));
  }
  const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function mount3d(host, kind, opt) {
    const view = document.createElement('div'); view.className = 'lab-view'; view.innerHTML = '<div class="scene-wrap"><div class="scene"></div></div>'; host.appendChild(view);
    const scene = view.querySelector('.scene'), wrap = view.querySelector('.scene-wrap'), vars = variants(kind), st = { f: opt.folded ? 1 : 0, rx: -24, ry: -22, anim: null, T: null, dm: null, bb: null, sc: 1, id: null };
    const ctl = { st, variants: vars };
    function load(id) {
      cancelAnimationFrame(st.anim); const v = vars.find(x => x.id === id) || vars[0]; st.id = v.id; scene.innerHTML = ''; st.T = v.make(); st.dm = { max: 0, scene }; prep(st.T.root, null);
      build(st.T.root, null, st.dm); const b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }; walk(st.T.root, n => n.v.forEach(p => { const q = ap(n.flat, p); b.x0 = Math.min(b.x0, q[0]); b.y0 = Math.min(b.y0, q[1]); b.x1 = Math.max(b.x1, q[0]); b.y1 = Math.max(b.y1, q[1]); })); st.bb = b; fit(); draw();
    }
    function fit() { const W = view.clientWidth || 420, H = view.clientHeight || 300, bw = st.bb.x1 - st.bb.x0, bh = st.bb.y1 - st.bb.y0; st.sc = Math.min(1.25, (W - 36) / bw, (H - 36) / bh); st.cx = (st.bb.x0 + st.bb.x1) / 2; st.cy = (st.bb.y0 + st.bb.y1) / 2; const fc = st.T.fc || [st.T.root.cx, st.T.root.cy]; st.fx = fc[0]; st.fy = fc[1]; }
    function draw() {
      const stag = Math.min(0.1, 0.55 / Math.max(1, st.dm.max)), span = 1 - st.dm.max * stag;
      walk(st.T.root, n => {
        if (!n.parentless && n !== st.T.root) { const p = ease(Math.max(0, Math.min(1, (st.f - n.d * stag) / span))); n.el.style.transform = 'translate(' + n.H0[0] + 'px,' + n.H0[1] + 'px) rotate(' + n.ph + 'deg) rotateX(' + (n.ang * p) + 'deg) rotate(' + (-n.ac) + 'deg) translate(' + (-n.C0[0]) + 'px,' + (-n.C0[1]) + 'px)'; }
        else { const e = ease(st.f); n.el.style.transform = 'translate(' + (-(st.cx + (st.fx - st.cx) * e)) + 'px,' + (-(st.cy + (st.fy - st.cy) * e)) + 'px)'; }
        if (n.hi !== undefined) n.el.classList.toggle('hi', !!n.hi);
      });
      scene.style.setProperty('--lf', String(Math.max(0, 1 - 1.4 * ease(st.f))));
      scene.style.transform = 'scale(' + (st.sc * (1 + ((st.T.zoom || 1.6) - 1) * ease(st.f))) + ') rotateX(' + st.rx + 'deg) rotateY(' + st.ry + 'deg) rotateZ(' + ((st.T.rz || 0) * ease(st.f)) + 'deg) translateZ(' + (-st.T.zc * ease(st.f)) + 'px)';
      if (opt.onRot) opt.onRot(Math.round(((st.ry % 360) + 360) % 360), Math.round(-st.rx));
    }
    function to(target, ms, done) { cancelAnimationFrame(st.anim); const f0 = st.f, t0 = performance.now(); ms = ms || 1800; (function step(t) { const k = Math.min(1, (t - t0) / ms); st.f = f0 + (target - f0) * k; draw(); if (k < 1) st.anim = requestAnimationFrame(step); else { st.f = target; draw(); if (done) done(); } })(t0); }
    ctl.toggle = () => { const tgt = st.f < 0.5 ? 1 : 0; to(tgt); return tgt === 1; };
    ctl.fold = (v, ms) => to(v ? 1 : 0, ms); ctl.pattern = (id) => { st.f = 0; load(id); }; ctl.folded = () => st.f > 0.5;
    ctl.spin = () => { const r0 = st.ry, t0 = performance.now(); (function step(t) { const k = Math.min(1, (t - t0) / 1600); st.ry = r0 + 360 * ease(k); draw(); if (k < 1) requestAnimationFrame(step); })(t0); };
    ctl.reset = () => { st.rx = -24; st.ry = -22; to(0, 900); };
    ctl.highlight = (names) => { walk(st.T.root, n => { n.hi = names === 'all' ? !!n.n : !!names && names.indexOf(n.n) >= 0; }); draw(); };
    ctl.faceNames = () => { const o = []; walk(st.T.root, n => { if (n.lbl) o.push(n.n); }); return o; };
    let drag = null;
    view.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; view.setPointerCapture(e.pointerId); view.classList.add('grab'); });
    view.addEventListener('pointermove', e => { if (!drag) return; st.ry += (e.clientX - drag.x) * 0.6; st.rx = Math.max(-80, Math.min(10, st.rx - (e.clientY - drag.y) * 0.5)); drag = { x: e.clientX, y: e.clientY }; draw(); });
    const up = () => { drag = null; view.classList.remove('grab'); }; view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
    const ro = window.ResizeObserver ? new ResizeObserver(() => { if (st.T) { fit(); draw(); } }) : null; if (ro) ro.observe(view);
    ctl.destroy = () => { cancelAnimationFrame(st.anim); if (ro) ro.disconnect(); }; ctl.tree = () => st.T; ctl.view = view;
    load(opt.pattern); return ctl;
  }
  // ---------- bola: jaring-jaring gores yang benar-benar dilipat menjadi bola (morfing kanvas 3D) ----------
  function mountSphere(host, opt) {
    const view = document.createElement('div'); view.className = 'lab-view lab-sphere'; const cv = document.createElement('canvas'); view.appendChild(cv); host.appendChild(view);
    const ctx2 = cv.getContext('2d'), vars = variants('bola'), st = { f: opt.folded ? 1 : 0, rx: -14, ry: -12, N: 6, anim: null, quads: [], W: 420, H: 350 }, ctl = { st, variants: vars };
    const COLS = ['#2EC4B6', '#B8A9F5', '#FFD66B', '#F58A87', '#8FE3CE', '#8CC8EE'], KF = 0.5, K = 14;
    const hex = (c, k) => { const n = parseInt(c.slice(1), 16), f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')'; };
    function build(N) {
      st.N = N; st.quads = []; const w = Math.PI / N;
      for (let i = 0; i < N; i++) { const lc = (i + 0.5) * 2 * Math.PI / N - Math.PI;
        for (let sd = 0; sd < 2; sd++) { const l0 = sd ? lc : lc - w, l1 = sd ? lc + w : lc;
          for (let j = 0; j < K; j++) { const pa = -Math.PI / 2 + Math.PI * j / K, pb = -Math.PI / 2 + Math.PI * (j + 1) / K;
            st.quads.push({ g: i, c: [[pa, l0], [pa, l1], [pb, l1], [pb, l0]].map(q => { const ph = q[0], la = q[1]; return { f: [(lc + (la - lc) * Math.cos(ph)) * KF, ph * KF, 0], s: [Math.cos(ph) * Math.sin(la), Math.sin(ph), Math.cos(ph) * Math.cos(la)] }; }) }); } } }
    }
    const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    function size() { const r = view.getBoundingClientRect(), d = window.devicePixelRatio || 1; st.W = r.width || 420; st.H = r.height || 350; cv.width = st.W * d; cv.height = st.H * d; cv.style.width = st.W + 'px'; cv.style.height = st.H + 'px'; ctx2.setTransform(d, 0, 0, d, 0, 0); }
    function draw() {
      ctx2.clearRect(0, 0, st.W, st.H); const N = st.N, stg = Math.min(0.05, 0.3 / N), span = 1 - (N - 1) * stg, e = ease(st.f);
      const cy = Math.cos(st.ry * Math.PI / 180), sy = Math.sin(st.ry * Math.PI / 180), cx = Math.cos(st.rx * Math.PI / 180), sx = Math.sin(st.rx * Math.PI / 180);
      const scF = Math.min((st.W - 70) / (2 * Math.PI * KF * 0.95), (st.H - 100) / (Math.PI * KF * 1.15)), scS = Math.min(st.W, st.H) * 0.36, sc = scF + (scS - scF) * e, ox = st.W / 2, oy = st.H / 2;
      const out = st.quads.map(q => { const pg = ease(Math.max(0, Math.min(1, (st.f - q.g * stg) / span))), P = q.c.map(v => { const x = v.f[0] + (v.s[0] - v.f[0]) * pg, y = v.f[1] + (v.s[1] - v.f[1]) * pg, z = v.f[2] + (v.s[2] - v.f[2]) * pg; const X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cx - Z * sx, Z2 = y * sx + Z * cx; return [X, Y, Z2]; });
        const a = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], b = [P[3][0] - P[0][0], P[3][1] - P[0][1], P[3][2] - P[0][2]], n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], l = Math.hypot(n[0], n[1], n[2]) || 1;
        return { g: q.g, P, z: (P[0][2] + P[1][2] + P[2][2] + P[3][2]) / 4, nz: n[2] / l }; }).sort((a, b) => a.z - b.z);
      out.forEach(q => { const back = q.nz < 0, k = 0.78 + 0.22 * Math.abs(q.nz); ctx2.beginPath(); q.P.forEach((p, i) => { const X = ox + p[0] * sc, Y = oy - p[1] * sc; i ? ctx2.lineTo(X, Y) : ctx2.moveTo(X, Y); }); ctx2.closePath(); ctx2.fillStyle = hex(COLS[q.g % 6], back ? k * 0.86 : k * 1.06); ctx2.fill(); ctx2.strokeStyle = hex(COLS[q.g % 6], 0.9); ctx2.lineWidth = 0.7; ctx2.stroke(); });
      if (opt.onRot) opt.onRot(Math.round(((st.ry % 360) + 360) % 360), Math.round(-st.rx));
      // kapsi proses
      ctx2.fillStyle = 'rgba(31,42,68,.82)'; const msg = st.f < 0.03 ? N + ' gores terbentang datar (pendekatan jaring-jaring bola)' : st.f > 0.97 ? 'Gores-gores menutup menjadi bola' : 'Gores-gores melengkung dan saling menutup…'; ctx2.font = '700 12px sans-serif'; const tw = ctx2.measureText(msg).width + 24; ctx2.beginPath(); if (ctx2.roundRect) ctx2.roundRect((st.W - tw) / 2, st.H - 34, tw, 24, 12); else ctx2.rect((st.W - tw) / 2, st.H - 34, tw, 24); ctx2.fill(); ctx2.fillStyle = '#fff'; ctx2.textAlign = 'center'; ctx2.fillText(msg, st.W / 2, st.H - 18);
    }
    function to(target, ms) { cancelAnimationFrame(st.anim); const f0 = st.f, t0 = performance.now(); ms = ms || 2600; (function step(t) { const k = Math.min(1, (t - t0) / ms); st.f = f0 + (target - f0) * k; draw(); if (k < 1) st.anim = requestAnimationFrame(step); else { st.f = target; draw(); } })(t0); }
    ctl.toggle = () => { const tgt = st.f < 0.5 ? 1 : 0; to(tgt); return tgt === 1; }; ctl.fold = (v, ms) => to(v ? 1 : 0, ms); ctl.folded = () => st.f > 0.5;
    ctl.pattern = (id) => { st.f = 0; build(+String(id || 'b6').slice(1)); draw(); };
    ctl.spin = () => { const r0 = st.ry, t0 = performance.now(); (function step(t) { const k = Math.min(1, (t - t0) / 1600); st.ry = r0 + 360 * ease(k); draw(); if (k < 1) requestAnimationFrame(step); })(t0); };
    ctl.reset = () => { st.rx = -14; st.ry = -12; to(0, 1100); }; ctl.highlight = () => {};
    let drag = null; view.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; view.setPointerCapture(e.pointerId); view.classList.add('grab'); });
    view.addEventListener('pointermove', e => { if (!drag) return; st.ry += (e.clientX - drag.x) * 0.6; st.rx = Math.max(-80, Math.min(10, st.rx - (e.clientY - drag.y) * 0.5)); drag = { x: e.clientX, y: e.clientY }; draw(); });
    const up = () => { drag = null; view.classList.remove('grab'); }; view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
    const ro = window.ResizeObserver ? new ResizeObserver(() => { size(); draw(); }) : null; if (ro) ro.observe(view);
    ctl.destroy = () => { cancelAnimationFrame(st.anim); if (ro) ro.disconnect(); };
    size(); build(+String(opt.pattern || 'b6').slice(1)); draw(); return ctl;
  }
  window.Fold3D = { variants, mount: (host, kind, opt) => kind === 'bola' ? mountSphere(host, opt || {}) : mount3d(host, kind, opt || {}) };
})();
