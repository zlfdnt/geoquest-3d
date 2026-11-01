// ============================================================
//  fx.js — kursor "+" presisi + partikel hidup, slideshow otomatis, kilau/spotlight kartu,
//          riak tombol, animasi muncul, hitung naik, konfeti, tombol WhatsApp mengambang
// ============================================================
(function () {
  const fine = matchMedia('(pointer:fine)').matches && matchMedia('(hover:hover)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COL = ['#E85D5D', '#2EC4B6', '#B8A9F5', '#FFD66B', '#FF8F8F', '#7DEDE0'];
  const sprites = {};
  function sprite(c) {
    if (sprites[c]) return sprites[c];
    const s = document.createElement('canvas'); s.width = s.height = 48; const x = s.getContext('2d');
    const g = x.createRadialGradient(24, 24, 0, 24, 24, 24); g.addColorStop(0, '#fff'); g.addColorStop(0.18, c); g.addColorStop(0.5, c + '88'); g.addColorStop(1, c + '00');
    x.fillStyle = g; x.fillRect(0, 0, 48, 48); return (sprites[c] = s);
  }
  const FX = { exam: false };
  let cv, ctx, W = 0, H = 0, dpr = 1, cur, mx = -100, my = -100, lx = -100, ly = -100, running = false, inside = false, last = 0;
  const parts = [], conf = [], ff = [];
  const rnd = (a, b) => a + Math.random() * (b - a);

  function resize() { dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; if (!cv) return; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function spawn(x, y, vx, vy, n) {
    for (let i = 0; i < n && parts.length < 160; i++) {
      const plus = Math.random() < 0.28;
      parts.push({ x: x + rnd(-3, 3), y: y + rnd(-3, 3), vx: vx * 0.12 + rnd(-0.7, 0.7), vy: vy * 0.12 + rnd(-0.9, 0.3), life: 1, dec: rnd(0.012, 0.028), s: rnd(0.35, 0.8), c: COL[(Math.random() * COL.length) | 0], plus, rot: rnd(0, 6.28), vr: rnd(-0.1, 0.1) });
    }
  }
  function burst(x, y) { for (let i = 0; i < 18 && parts.length < 200; i++) { const a = (i / 18) * 6.283 + rnd(-0.2, 0.2), v = rnd(1.6, 4.2); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, dec: rnd(0.02, 0.035), s: rnd(0.4, 0.85), c: COL[(Math.random() * COL.length) | 0], plus: i % 3 === 0, rot: 0, vr: rnd(-0.15, 0.15) }); } kick(); }
  function loop(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    const fly = inside && !FX.exam && fine && !reduce;
    if (fly) {
      ff.forEach((f, i) => {
        const a = t * 0.0011 * (0.6 + i * 0.17) + i * 1.9, r = 20 + i * 7;
        f.vx += (mx + Math.cos(a) * r - f.x) * 0.012; f.vy += (my + Math.sin(a * 1.2) * r - f.y) * 0.012; f.vx *= 0.88; f.vy *= 0.88; f.x += f.vx; f.y += f.vy;
        ctx.globalAlpha = 0.55 + 0.4 * Math.sin(t * 0.006 + i * 2); const z = 14 + 6 * Math.sin(t * 0.004 + i); ctx.drawImage(sprite(COL[i % COL.length]), f.x - z / 2, f.y - z / 2, z, z);
      });
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.035; p.vx *= 0.985; p.life -= p.dec; p.rot += p.vr;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life * 1.4);
      if (p.plus) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; const l = 7 * p.s * p.life + 2; ctx.fillRect(-l, -0.9, l * 2, 1.8); ctx.fillRect(-0.9, -l, 1.8, l * 2); ctx.restore(); }
      else { const z = 26 * p.s * (0.4 + p.life * 0.6); ctx.drawImage(sprite(p.c), p.x - z / 2, p.y - z / 2, z, z); }
    }
    for (let i = conf.length - 1; i >= 0; i--) {
      const p = conf[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.16; p.vx *= 0.99; p.rot += p.vr; p.life -= 0.006;
      if (p.life <= 0 || p.y > H + 20) { conf.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 2); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (!fly && !parts.length && !conf.length) { running = false; ctx.clearRect(0, 0, W, H); return; }
    requestAnimationFrame(loop);
  }
  function kick() { if (!running && !document.hidden) { running = true; requestAnimationFrame(loop); } }

  function initCursor() {
    cv = document.createElement('canvas'); cv.id = 'fx-canvas'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv); ctx = cv.getContext('2d'); resize();
    window.addEventListener('resize', resize);
    if (!fine) return;
    cur = document.createElement('div'); cur.id = 'fx-cursor'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<i></i><i></i>'; document.body.appendChild(cur);
    document.documentElement.classList.add('has-cursor');
    for (let i = 0; i < 6; i++) ff.push({ x: -100, y: -100, vx: 0, vy: 0 });
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY; cur.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!inside) { inside = true; cur.classList.add('on'); ff.forEach(f => { f.x = mx; f.y = my; }); }
      const dx = mx - lx, dy = my - ly, sp = Math.hypot(dx, dy); lx = mx; ly = my;
      if (!FX.exam && !reduce && sp > 1.5) spawn(mx, my, dx, dy, Math.min(3, 1 + (sp / 18) | 0));
      const t = e.target.closest ? e.target : null;
      cur.classList.toggle('hov', !!(t && t.closest('a,button,[data-go],[data-act],.fx-card,label,select,summary,[role=button],.q-nav button,.opt')));
      cur.classList.toggle('txt', !!(t && t.closest('input:not([type=checkbox]):not([type=radio]),textarea')));
      kick();
    }, { passive: true });
    document.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { cur.classList.add('dn'); if (!FX.exam && !reduce) burst(e.clientX, e.clientY); } });
    document.addEventListener('pointerup', () => cur.classList.remove('dn'));
    document.documentElement.addEventListener('mouseleave', () => { inside = false; cur.classList.remove('on'); });
    document.documentElement.addEventListener('mouseenter', () => { inside = true; cur.classList.add('on'); kick(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  }
  FX.setExam = (on) => { FX.exam = !!on; document.documentElement.classList.toggle('exam-mode', !!on); if (!on) kick(); };
  FX.confetti = (x, y) => {
    if (reduce) return; x = x == null ? W / 2 : x; y = y == null ? H * 0.35 : y;
    for (let i = 0; i < 90; i++) { const a = rnd(-3.4, -0.1), v = rnd(4, 11); conf.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, w: rnd(5, 10), h: rnd(3, 6), rot: rnd(0, 6), vr: rnd(-0.3, 0.3), c: COL[(Math.random() * COL.length) | 0] }); }
    kick();
  };

  // ---------- slideshow otomatis ----------
  function slider(el) {
    const slides = Array.from(el.querySelectorAll(':scope > .slide')); if (slides.length < 2) return;
    let i = Math.max(0, slides.findIndex(s => s.classList.contains('on'))), timer = null, vis = true, hold = false;
    const dots = el.querySelector(':scope > .dots');
    if (dots && !dots.children.length) dots.innerHTML = slides.map((_, k) => '<button type="button" aria-label="Slide ' + (k + 1) + '"></button>').join('');
    const show = (n) => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle('on', k === i)); if (dots) Array.from(dots.children).forEach((d, k) => d.classList.toggle('on', k === i)); };
    const arm = () => { clearInterval(timer); if (reduce) return; timer = setInterval(() => { if (!hold && vis && !document.hidden) show(i + 1); }, Number(el.dataset.interval) || 3800); };
    show(i); setTimeout(arm, Math.random() * 1200);
    el.addEventListener('pointerenter', () => hold = true); el.addEventListener('pointerleave', () => hold = false);
    if (dots) dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); show(Array.from(dots.children).indexOf(b)); arm(); } });
    let sx = null; el.addEventListener('pointerdown', e => { sx = e.clientX; }); el.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 40) { show(i + (e.clientX < sx ? 1 : -1)); arm(); } sx = null; });
    if ('IntersectionObserver' in window) new IntersectionObserver(en => { vis = en[0].isIntersecting; }).observe(el);
  }
  // ---------- animasi muncul + hitung naik ----------
  let io = null;
  function countUp(el) {
    const to = parseFloat(el.dataset.count), dec = (String(el.dataset.count).split('.')[1] || '').length, t0 = performance.now(), d = 900;
    if (reduce || !isFinite(to)) { el.textContent = to.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }); return; }
    (function step(t) { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = (to * e).toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  FX.scan = function (root) {
    root = root || document;
    root.querySelectorAll('.slider:not([data-init])').forEach(s => { s.dataset.init = 1; slider(s); });
    if (!io && 'IntersectionObserver' in window) io = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); if (x.target.dataset.count !== undefined) countUp(x.target); io.unobserve(x.target); } }), { threshold: 0.12 });
    root.querySelectorAll('.reveal:not(.in),[data-count]:not([data-cd])').forEach((el, k) => { if (el.dataset.count !== undefined) el.dataset.cd = 1; el.style.transitionDelay = (Math.min(k, 8) * 45) + 'ms'; if (io) io.observe(el); else { el.classList.add('in'); if (el.dataset.count !== undefined) countUp(el); } });
  };
  // spotlight kartu + riak tombol (delegasi)
  document.addEventListener('pointermove', e => { const c = e.target.closest && e.target.closest('.fx-card,.fx-btn'); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); } }, { passive: true });
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest && e.target.closest('.fx-btn'); if (!b || reduce) return;
    const r = b.getBoundingClientRect(), s = document.createElement('span'), d = Math.max(r.width, r.height) * 2;
    s.className = 'ripple'; s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px'; b.appendChild(s); setTimeout(() => s.remove(), 650);
  });
  // ---------- WhatsApp mengambang ----------
  FX.whatsapp = function (nomor, pesan) {
    let a = document.getElementById('wa-fab');
    if (!a) {
      a = document.createElement('a'); a.id = 'wa-fab'; a.className = 'wa-fab'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Chat WhatsApp dengan guru');
      a.innerHTML = '<span class="wa-ring"></span><span class="wa-ring r2"></span><svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="#fff" d="M16.04 4C9.4 4 4 9.38 4 16.01c0 2.12.55 4.19 1.6 6.01L4 28l6.14-1.57a12 12 0 0 0 5.9 1.5h.01C22.68 27.93 28 22.55 28 15.92 28 12.72 26.75 9.7 24.5 7.45A11.9 11.9 0 0 0 16.04 4Zm0 21.9h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.64.93.97-3.55-.24-.37a9.9 9.9 0 0 1-1.52-5.31c0-5.47 4.46-9.92 9.94-9.92 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7.02c0 5.47-4.46 9.9-9.95 9.9Zm5.45-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg><b class="wa-tip">Chat Guru</b>';
      document.body.appendChild(a); setTimeout(() => a.classList.add('in'), 700);
    }
    const n = String(nomor || (window.APP_CONFIG && APP_CONFIG.WA_NOMOR) || '').replace(/\D/g, '');
    a.href = 'https://wa.me/' + n + '?text=' + encodeURIComponent(pesan || 'Halo, saya mau bertanya tentang GeoQuest 3D.');
    return a;
  };
  FX.hideWA = (hide) => { const a = document.getElementById('wa-fab'); if (a) a.classList.toggle('gone', !!hide); };

  document.addEventListener('DOMContentLoaded', () => { initCursor(); FX.scan(document); });
  window.FX = FX;
})();
