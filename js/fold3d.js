// ============================================================
//  fold3d.js — Laboratorium Jaring-jaring 3D (CSS 3D, tanpa pustaka)
//  Pohon "engsel": tiap bidang menempel pada tepi bidang induk lalu dilipat ke arah penonton.
// ============================================================
(function () {
  const COL = { teal: ['#7DEDE0', '#2EC4B6'], lav: ['#E3DCFF', '#B8A9F5'], coral: ['#FFC9C6', '#F58A87'], yel: ['#FFE9AE', '#FFD66B'], sky: ['#CFEAFB', '#8CC8EE'], mint: ['#CFF7EC', '#8FE3CE'] };
  const N = (n, w, h, e, o) => Object.assign({ n, w, h, e, c: [] }, o || {});
  const add = (p, ...k) => { p.c.push(...k); return p; };
  const cube = (pat) => {
    const s = 70, f = (n, e, col) => N(n, s, s, e, { col }), A = () => f('Alas', null, 'teal'), T = (e) => f('Atas', e, 'teal'), Ki = (e) => f('Kiri', e, 'lav'), Ka = (e) => f('Kanan', e, 'lav'), Be = (e) => f('Belakang', e, 'coral'), De = (e) => f('Depan', e, 'coral');
    if (pat === '231') return add(A(), add(Ka('r'), T('r')), add(Be('t'), Ki('l')), De('b'));
    if (pat === '222') return add(A(), add(Ka('r'), add(De('b'), T('r'))), add(Be('t'), Ki('l')));
    if (pat === '33') return add(A(), add(Ka('r'), T('r')), add(Be('t'), add(Ki('l'), De('l'))));
    return add(A(), Ki('l'), add(Ka('r'), T('r')), Be('t'), De('b'));
  };
  function tree(kind, pat) {
    if (kind === 'kubus') return { root: cube(pat), zc: 35, ang: 90, zoom: 1.9 };
    if (kind === 'balok') { const p = 112, l = 70, t = 46; return { root: add(N('Alas', p, l, null, { col: 'teal' }), N('Kiri', t, l, 'l', { col: 'lav' }), add(N('Kanan', t, l, 'r', { col: 'lav' }), N('Atas', p, l, 'r', { col: 'teal' })), N('Belakang', p, t, 't', { col: 'coral' }), N('Depan', p, t, 'b', { col: 'coral' })), zc: t / 2, zoom: 1.6 }; }
    if (kind === 'prisma') { const a = 84, ht = a * 0.866, t = 100; return { root: add(N('Sisi 1', a, t, null, { col: 'teal' }), N('Sisi 2', a, t, 'l', { col: 'mint', ang: 120 }), N('Sisi 3', a, t, 'r', { col: 'mint', ang: 120 }), N('Alas', a, ht, 't', { col: 'yel', shape: 'triU' }), N('Atas', a, ht, 'b', { col: 'yel', shape: 'triD' })), zc: ht / 3, zoom: 1.7 }; }
    if (kind === 'limas') { const a = 92, h = 84, s = Math.sqrt(h * h + (a / 2) * (a / 2)), ph = 180 - Math.atan2(h, a / 2) * 180 / Math.PI; return { root: add(N('Alas', a, a, null, { col: 'teal' }), N('', a, s, 't', { col: 'yel', shape: 'triU', ang: ph }), N('', a, s, 'b', { col: 'coral', shape: 'triD', ang: ph }), N('', s, a, 'l', { col: 'lav', shape: 'triL', ang: ph }), N('', s, a, 'r', { col: 'mint', shape: 'triR', ang: ph })), zc: h / 3, zoom: 1.7 }; }
    // tabung: selimut dirangkai dari n strip sempit (rantai engsel) + 2 lingkaran penutup
    const r = 30, t = 92, n = 20, w = 2 * Math.PI * r / n, root = N('', w + 0.6, t, null, { col: 'sky', strip: 1 }); let cur = root;
    for (let i = 1; i < n; i++) { const c = N('', w + 0.6, t, 'r', { col: 'sky', strip: 1, ang: 360 / n }); cur.c.push(c); cur = c; }
    add(root, N('Alas', 2 * r, 2 * r, 't', { col: 'lav', shape: 'circ', center: 1, lbl: 1 }), N('Tutup', 2 * r, 2 * r, 'b', { col: 'lav', shape: 'circ', center: 1, lbl: 1 }));
    return { root, zc: r, chain: 1, zoom: 2.3 };
  }
  const CLIP = { triU: 'polygon(50% 0,0 100%,100% 100%)', triD: 'polygon(0 0,100% 0,50% 100%)', triL: 'polygon(0 50%,100% 0,100% 100%)', triR: 'polygon(0 0,100% 50%,0 100%)' };
  function build(node, parent, depthMap, d, defAng) {
    const el = document.createElement('div'); el.className = 'face' + (node.strip ? ' strip' : '');
    const c = COL[node.col] || COL.teal; el.style.cssText = 'width:' + node.w + 'px;height:' + node.h + 'px;background:linear-gradient(135deg,' + c[0] + ',' + c[1] + ');' + (CLIP[node.shape] ? 'clip-path:' + CLIP[node.shape] + ';' : '') + (node.shape === 'circ' ? 'border-radius:50%;' : '');
    if (node.n && !node.strip) el.innerHTML = '<span class="lb">' + node.n + '</span><span class="lb bk">' + node.n + '</span>';
    const pw = parent ? parent.w : 0, ph = parent ? parent.h : 0;
    let o = '50% 50%';
    if (node.e === 'r') { el.style.left = pw + 'px'; el.style.top = (node.center ? (ph - node.h) / 2 : 0) + 'px'; o = '0 50%'; }
    else if (node.e === 'l') { el.style.left = -node.w + 'px'; el.style.top = '0px'; o = '100% 50%'; }
    else if (node.e === 'b') { el.style.top = ph + 'px'; el.style.left = ((pw - node.w) / 2) + 'px'; o = '50% 0'; }
    else if (node.e === 't') { el.style.top = -node.h + 'px'; el.style.left = ((pw - node.w) / 2) + 'px'; o = '50% 100%'; }
    el.style.transformOrigin = o; node.el = el; node.d = d; depthMap.max = Math.max(depthMap.max, d);
    if (parent) parent.el.appendChild(el);
    node.c.forEach(k => build(k, node, depthMap, d + 1));
    return el;
  }
  function bbox(n, x, y, b) {
    b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x + n.w); b.y1 = Math.max(b.y1, y + n.h);
    n.c.forEach(k => { const e = k.e; let kx, ky; if (e === 'r') { kx = x + n.w; ky = k.center ? y + (n.h - k.h) / 2 : y; } else if (e === 'l') { kx = x - k.w; ky = y; } else if (e === 'b') { kx = x + (n.w - k.w) / 2; ky = y + n.h; } else { kx = x + (n.w - k.w) / 2; ky = y - k.h; } bbox(k, kx, ky, b); });
    return b;
  }
  const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const tf = (e, a) => e === 'r' ? 'rotateY(' + -a + 'deg)' : e === 'l' ? 'rotateY(' + a + 'deg)' : e === 'b' ? 'rotateX(' + a + 'deg)' : e === 't' ? 'rotateX(' + -a + 'deg)' : '';

  function mount(host, kind, opt) {
    opt = opt || {};
    const view = document.createElement('div'); view.className = 'lab-view'; view.innerHTML = '<div class="scene-wrap"><div class="scene"></div></div>'; host.appendChild(view);
    const scene = view.querySelector('.scene'), wrap = view.querySelector('.scene-wrap');
    const st = { f: opt.folded ? 1 : 0, rx: -24, ry: -22, kind, anim: null, T: null, dm: null, bb: null, sc: 1 };
    const ctl = { st };
    function load(pat) {
      cancelAnimationFrame(st.anim); scene.innerHTML = ''; st.T = tree(kind, pat); st.dm = { max: 0 };
      const root = build(st.T.root, null, st.dm, 0); root.style.left = '0'; root.style.top = '0'; scene.appendChild(root);
      st.bb = bbox(st.T.root, 0, 0, { x0: 0, y0: 0, x1: 0, y1: 0 });
      st.T.root.el.style.position = 'absolute'; fit(); draw();
    }
    function fit() {
      const W = view.clientWidth || 420, Hh = view.clientHeight || 300, bw = st.bb.x1 - st.bb.x0, bh = st.bb.y1 - st.bb.y0;
      st.sc = Math.min(1.25, (W - 40) / bw, (Hh - 40) / (bh + 20)); wrap.style.setProperty('--sc', st.sc);
      const cx = (st.bb.x0 + st.bb.x1) / 2, cy = (st.bb.y0 + st.bb.y1) / 2;
      st.T.root.el.style.left = -cx + 'px'; st.T.root.el.style.top = -cy + 'px';
    }
    function draw() {
      const stag = Math.min(0.1, 0.55 / Math.max(1, st.dm.max)), span = 1 - st.dm.max * stag;
      (function walk(n) {
        if (n.e) { const p = ease(Math.max(0, Math.min(1, (st.f - n.d * stag) / span))); n.el.style.transform = tf(n.e, (n.ang || st.T.ang || 90) * p); }
        n.c.forEach(walk);
      })(st.T.root);
      scene.style.setProperty('--lf', String(Math.max(0, 1 - 1.4 * ease(st.f))));
      scene.style.transform = 'scale(' + (st.sc * (1 + ((st.T.zoom || 1.5) - 1) * ease(st.f))) + ') rotateX(' + st.rx + 'deg) rotateY(' + st.ry + 'deg) translateZ(' + (-st.T.zc * ease(st.f)) + 'px)';
      if (opt.onRot) opt.onRot(Math.round(((st.ry % 360) + 360) % 360), Math.round(-st.rx));
    }
    function to(target, ms, done) {
      cancelAnimationFrame(st.anim); const f0 = st.f, t0 = performance.now(); ms = ms || 1700;
      (function step(t) { const k = Math.min(1, (t - t0) / ms); st.f = f0 + (target - f0) * k; draw(); if (k < 1) st.anim = requestAnimationFrame(step); else { st.f = target; draw(); if (done) done(); } })(t0);
    }
    ctl.toggle = () => { const tgt = st.f < 0.5 ? 1 : 0; to(tgt); return tgt === 1; };
    ctl.fold = (v) => to(v ? 1 : 0); ctl.pattern = (p) => { st.f = 0; load(p); }; ctl.folded = () => st.f > 0.5;
    ctl.spin = () => { const r0 = st.ry, t0 = performance.now(); (function step(t) { const k = Math.min(1, (t - t0) / 1600); st.ry = r0 + 360 * ease(k); draw(); if (k < 1) requestAnimationFrame(step); })(t0); };
    ctl.reset = () => { st.rx = -24; st.ry = -22; to(0, 900); };
    let drag = null;
    view.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; view.setPointerCapture(e.pointerId); view.classList.add('grab'); });
    view.addEventListener('pointermove', e => { if (!drag) return; st.ry += (e.clientX - drag.x) * 0.6; st.rx = Math.max(-80, Math.min(10, st.rx - (e.clientY - drag.y) * 0.5)); drag = { x: e.clientX, y: e.clientY }; draw(); });
    const up = () => { drag = null; view.classList.remove('grab'); }; view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
    const ro = window.ResizeObserver ? new ResizeObserver(() => { if (st.T) { fit(); draw(); } }) : null; if (ro) ro.observe(view);
    ctl.destroy = () => { cancelAnimationFrame(st.anim); if (ro) ro.disconnect(); };
    load(opt.pattern); return ctl;
  }

  // Kerucut & bola: tampilan 2D beranimasi (jaring-jaring ⇄ bangun)
  function mount2d(host, kind, opt) {
    const v = document.createElement('div'); v.className = 'lab-view lab2d';
    v.innerHTML = '<img class="l2-net" alt="Jaring-jaring ' + kind + '" src="' + Art.img(kind, 1) + '"><img class="l2-solid" alt="Bangun ' + kind + '" src="' + Art.img(kind, 0) + '">'; host.appendChild(v);
    let folded = !!opt.folded, rot = 0; const set = () => { v.classList.toggle('folded', folded); v.style.setProperty('--rot', rot + 'deg'); if (opt.onRot) opt.onRot(((rot % 360) + 360) % 360, 24); };
    set(); return { toggle() { folded = !folded; set(); return folded; }, fold(x) { folded = !!x; set(); }, folded: () => folded, spin() { rot += 360; set(); }, reset() { folded = false; rot = 0; set(); }, pattern() {}, destroy() {}, st: {} };
  }
  window.Fold3D = { mount: (host, kind, opt) => (kind === 'kerucut' || kind === 'bola') ? mount2d(host, kind, opt || {}) : mount(host, kind, opt) };
})();
