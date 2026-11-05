// ============================================================
//  derive.js — animasi "Penemuan Rumus" langkah demi langkah + narasi suara (Web Speech API)
// ============================================================
(function () {
  const A = 0.866, B = 0.5, f1 = (n) => Math.round(n * 10) / 10, PC = ['#7DEDE0', '#B8A9F5', '#FFD66B', '#FF9A98', '#8CC8EE'];
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), c = v => Math.max(0, Math.min(255, Math.round(v * k))); return 'rgb(' + c(n >> 16) + ',' + c((n >> 8) & 255) + ',' + c(n & 255) + ')'; };
  const poly = (pts, fill, op) => '<polygon points="' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ') + '" fill="' + fill + '" stroke="rgba(31,42,68,.45)" stroke-width="1" stroke-linejoin="round"' + (op ? ' fill-opacity="' + op + '"' : '') + '/>';
  const txt = (x, y, t, sz, c, anchor) => '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" font-family="Epilogue,sans-serif" font-weight="800" font-size="' + (sz || 14) + '" fill="' + (c || '#1F2A44') + '">' + t + '</text>';

  // ---------- suara ----------
  const UC = [[/²/g, ' kuadrat'], [/³/g, ' pangkat tiga'], [/×/g, ' kali '], [/÷/g, ' dibagi '], [/=/g, ' sama dengan '], [/\+/g, ' tambah '], [/π/g, ' pi '], [/√/g, ' akar '], [/½/g, ' setengah '], [/⅓/g, ' sepertiga '], [/⅔/g, ' dua pertiga '], [/⁴⁄₃/g, ' empat per tiga '], [/≈/g, ' kira-kira '], [/\bcm\b/g, 'sentimeter'], [/→/g, ' '], [/\s+/g, ' ']];
  const ucap = (t) => UC.reduce((s, r) => s.replace(r[0], r[1]), String(t));
  const Voice = {
    synth: window.speechSynthesis || null, voice: null, hasId: false, rate: 0.95, on: localStorage.getItem('gq_voice') !== 'off',
    init() { if (!this.synth) return; const pick = () => { const vs = this.synth.getVoices(); this.voice = vs.find(v => /^id[-_]/i.test(v.lang) || v.lang === 'id') || vs.find(v => /indones/i.test(v.name)) || null; this.hasId = !!this.voice; }; pick(); this.synth.onvoiceschanged = pick; },
    speak(text, end) { if (!this.synth) { if (end) end(); return; } this.cancel(); const u = new SpeechSynthesisUtterance(ucap(text)); u.lang = 'id-ID'; if (this.voice) u.voice = this.voice; u.rate = this.rate; u.pitch = 1; let done = false; const fin = () => { if (!done) { done = true; if (end) end(); } }; u.onend = fin; u.onerror = fin; this.synth.speak(u); this._guard = setTimeout(fin, Math.max(6000, text.length * 120)); },
    cancel() { clearTimeout(this._guard); if (this.synth) this.synth.cancel(); }
  };
  Voice.init();

  // ---------- visual SVG ----------
  function blocks(D, show, mask) {
    const X = D[0], Z = D[1], Y = D[2], k = Math.min(44, 290 / ((X + Z) * A), 215 / ((X + Z) * B + Y)), ox = 200 - (X - Z) * A * k / 2, oy = 138 - ((X + Z) * B * k - Y * k) / 2;
    const P = (x, y, z) => [ox + (x - z) * A * k, oy + (x + z) * B * k - y * k]; let s = '', idx = 0, n = 0;
    for (let y = 0; y < Y; y++) for (let sum = 0; sum <= X + Z - 2; sum++) for (let x = 0; x < X; x++) { const z = sum - x; if (z < 0 || z >= Z) continue; if (x >= show[0] || z >= show[1] || y >= show[2]) continue; n++;
      const col = mask ? (x >= z ? '#2EC4B6' : '#E85D5D') : PC[y % PC.length];
      s += '<g class="cb" style="animation-delay:' + Math.min(900, idx++ * 16) + 'ms">' + poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], shade(col, 1.08)) + poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], shade(col, 0.88)) + poly([P(x + 1, y, z), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z)], shade(col, 0.7)) + '</g>'; }
    return { svg: s, n };
  }
  function stair(n, L) {
    const k = 30, ox = 200, oy = 196, P = (x, y, z) => [ox + (x - z) * A * k, oy + (x + z) * B * k - y * k - (n * B * k)]; let s = '', idx = 0, tot = 0;
    for (let l = 0; l < Math.min(L, n); l++) { const m = n - l, sh = l * 0.5; for (let sum = 0; sum <= 2 * m - 2; sum++) for (let x = 0; x < m; x++) { const z = sum - x; if (z < 0 || z >= m) continue; tot++; const X = x + sh, Z = z + sh, col = PC[l % PC.length];
      s += '<g class="cb" style="animation-delay:' + Math.min(1000, idx++ * 9) + 'ms">' + poly([P(X, l + 1, Z), P(X + 1, l + 1, Z), P(X + 1, l + 1, Z + 1), P(X, l + 1, Z + 1)], shade(col, 1.08)) + poly([P(X, l, Z + 1), P(X + 1, l, Z + 1), P(X + 1, l + 1, Z + 1), P(X, l + 1, Z + 1)], shade(col, 0.88)) + poly([P(X + 1, l, Z), P(X + 1, l, Z + 1), P(X + 1, l + 1, Z + 1), P(X + 1, l + 1, Z)], shade(col, 0.7)) + '</g>'; } }
    return { svg: s, n: tot };
  }
  function discs(n, done) {
    const rx = 74, ry = 24, th = Math.min(16, 170 / n), base = 255; let s = '';
    for (let i = 0; i < n; i++) { const y = base - i * th, c = PC[i % PC.length]; s += '<g class="cb" style="animation-delay:' + i * 70 + 'ms"><path d="M' + (200 - rx) + ' ' + y + 'v' + -th + 'a' + rx + ' ' + ry + ' 0 0 0 ' + 2 * rx + ' 0v' + th + 'a' + rx + ' ' + ry + ' 0 0 1 ' + -2 * rx + ' 0z" fill="' + shade(c, 0.85) + '" stroke="rgba(31,42,68,.35)"/><ellipse cx="200" cy="' + (y - th) + '" rx="' + rx + '" ry="' + ry + '" fill="' + shade(c, 1.08) + '" stroke="rgba(31,42,68,.35)"/></g>'; }
    const top = base - n * th; if (n > 1) s += '<g stroke="#E85D5D" stroke-width="2.5" fill="none"><path d="M' + (200 + rx + 14) + ' ' + (base) + 'V' + (top) + '"/><path d="M' + (200 + rx + 8) + ' ' + base + 'h12M' + (200 + rx + 8) + ' ' + top + 'h12"/></g>' + txt(200 + rx + 28, (base + top) / 2 + 5, 't', 18, '#E85D5D', 'start');
    s += '<path d="M200 ' + (base - th) + 'h' + rx + '" stroke="#E85D5D" stroke-width="2.5" stroke-dasharray="4 3" transform="translate(0,' + (n === 1 ? -0 : 0) + ')" opacity="' + (n === 1 ? 1 : 0) + '"/>' + (n === 1 ? txt(200 + rx / 2, base - th - 6, 'r', 16, '#E85D5D') : '');
    return s;
  }
  function pour(cn, fl, n, prev) {
    const lvl = n / 3; let s = '', W = 130, Hh = 150, cx = 270, cy = 70;
    const wat = (op) => '<g class="wat" style="transform-origin:50% 100%;transform-box:fill-box;transform:scaleY(' + op + ')"><rect x="' + (cx - W / 2 + 3) + '" y="' + (cy + 3) + '" width="' + (W - 6) + '" height="' + (Hh - 6) + '" fill="#6DB4E0" fill-opacity=".75"/><rect x="' + (cx - W / 2 + 3) + '" y="' + (cy + 3) + '" width="' + (W - 6) + '" height="5" fill="#fff" fill-opacity=".6"/></g>';
    if (cn === 'box') { s += '<defs><clipPath id="cp"><rect x="' + (cx - W / 2) + '" y="' + cy + '" width="' + W + '" height="' + Hh + '" rx="6"/></clipPath></defs><g clip-path="url(#cp)">' + wat(prev) + '</g><rect x="' + (cx - W / 2) + '" y="' + cy + '" width="' + W + '" height="' + Hh + '" rx="6" fill="none" stroke="#1F2A44" stroke-width="3"/>'; }
    else { const rx = W / 2, ry = 20; s += '<defs><clipPath id="cp"><path d="M' + (cx - rx) + ' ' + cy + 'V' + (cy + Hh) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + (cy + Hh) + 'V' + cy + 'Z"/></clipPath></defs><g clip-path="url(#cp)">' + wat(prev) + '</g><path d="M' + (cx - rx) + ' ' + cy + 'V' + (cy + Hh) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + (cy + Hh) + 'V' + cy + '" fill="none" stroke="#1F2A44" stroke-width="3"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" fill-opacity=".5" stroke="#1F2A44" stroke-width="3"/>'; }
    if (n === 0) { // tampilkan bangun di dalam wadah
      if (fl === 'pyr') s += poly([[cx - W / 2, cy + Hh], [cx + W / 2, cy + Hh], [cx + W / 2 - 22, cy + Hh - 20], [cx, cy + 4]], '#FFD66B', 0.85) + poly([[cx - W / 2, cy + Hh], [cx, cy + 4], [cx - W / 2 + 22, cy + Hh - 20]], '#E8A92B', 0.85);
      else if (fl === 'cone') s += '<path d="M' + (cx - W / 2) + ' ' + (cy + Hh) + 'A' + W / 2 + ' 20 0 0 0 ' + (cx + W / 2) + ' ' + (cy + Hh) + 'L' + cx + ' ' + (cy) + 'Z" fill="#E85D5D" fill-opacity=".8" stroke="#B93A3F" stroke-width="2"/>';
      else s += '<circle cx="' + cx + '" cy="' + (cy + Hh / 2) + '" r="' + W / 2 + '" fill="#B8A9F5" fill-opacity=".85" stroke="#6C5CC4" stroke-width="2"/>';
    }
    // wadah kecil (limas / kerucut / bola) berisi air penuh
    const sx = 85, sy = 215; let sm = '';
    if (fl === 'pyr') sm = poly([[sx - 52, sy], [sx + 52, sy], [sx + 36, sy - 16], [sx, sy - 100]], '#6DB4E0', 0.9) + poly([[sx - 52, sy], [sx, sy - 100], [sx - 36, sy - 16]], '#4A98CE', 0.9);
    else if (fl === 'cone') sm = '<path d="M' + (sx - 52) + ' ' + sy + 'A52 16 0 0 0 ' + (sx + 52) + ' ' + sy + 'L' + sx + ' ' + (sy - 120) + 'Z" fill="#6DB4E0" stroke="#1F2A44" stroke-width="2.5"/>';
    else sm = '<circle cx="' + sx + '" cy="' + (sy - 52) + '" r="54" fill="#6DB4E0" stroke="#1F2A44" stroke-width="2.5"/>';
    s += '<g class="jug">' + sm + '</g>';
    if (n > 0) s += '<path d="M135 130Q180 60 215 100" fill="none" stroke="#E85D5D" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#ar)"/><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E85D5D"/></marker></defs>' + '<g><circle cx="150" cy="70" r="22" fill="#E85D5D"/>' + txt(150, 77, n + '×', 17, '#fff') + '</g>';
    s += txt(cx, cy + Hh + 28, n ? 'terisi ' + (n === 3 ? 'penuh' : n + '/3') : (cn === 'box' ? 'Prisma / balok' : 'Tabung'), 14, '#5B6580');
    return s;
  }
  function sph(m) {
    let s = '';
    if (m === 'box') { const cx = 200, r = 74, hh = 148; s += '<defs><radialGradient id="sg" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E8E2FF"/><stop offset=".6" stop-color="#B8A9F5"/><stop offset="1" stop-color="#6C5CC4"/></radialGradient></defs><path d="M' + (cx - r) + ' 60V208A' + r + ' 22 0 0 0 ' + (cx + r) + ' 208V60" fill="#FF9A98" fill-opacity=".35" stroke="#1F2A44" stroke-width="3"/><ellipse cx="' + cx + '" cy="60" rx="' + r + '" ry="22" fill="#fff" fill-opacity=".5" stroke="#1F2A44" stroke-width="3"/><circle cx="' + cx + '" cy="134" r="' + r + '" fill="url(#sg)" fill-opacity=".9"/><path d="M' + (cx + r + 16) + ' 60V208" stroke="#E85D5D" stroke-width="2.5"/>' + txt(cx + r + 36, 138, '2r', 18, '#E85D5D', 'start') + '<path d="M' + cx + ' 134H' + (cx + r) + '" stroke="#fff" stroke-width="3"/>' + txt(cx + r / 2, 126, 'r', 16, '#fff') + txt(cx - r - 14, 134, 'selimut', 13, '#E85D5D', 'end'); }
    else if (m === 'peel') { s += '<defs><radialGradient id="og" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#FFC58A"/><stop offset=".6" stop-color="#F28C28"/><stop offset="1" stop-color="#C45F0D"/></radialGradient></defs><circle cx="76" cy="150" r="46" fill="url(#og)"/><path d="M130 150h26" stroke="#1F2A44" stroke-width="3" marker-end="url(#ar2)"/><defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1F2A44"/></marker></defs>'; [[218, 96], [312, 96], [218, 196], [312, 196]].forEach((c, i) => { s += '<g class="cb" style="animation-delay:' + i * 160 + 'ms"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="44" fill="url(#og)" stroke="#C45F0D" stroke-width="2"/>' + txt(c[0], c[1] + 5, 'πr²', 16, '#fff') + '</g>'; }); }
    else s += '<circle cx="200" cy="150" r="80" fill="#B8A9F5"/>';
    return s;
  }

  // ---------- panel langkah ----------
  function mount(host, m, key) {
    const steps = TURUNAN[m.id][key], judul = key === 'lp' ? 'Penemuan Rumus Luas Permukaan ' + m.nama : 'Penemuan Rumus Volume ' + m.nama, st = { i: 0, play: false, timer: null, ctl: null, an: null, kind: null, prevLvl: 0 };
    host.innerHTML = '<div class="dv"><div class="row between wrap gap"><div><span class="chip ' + (key === 'lp' ? 'chip-coral' : 'chip-teal') + '">' + (key === 'lp' ? '📐 Luas Permukaan' : '🧊 Volume') + '</span><h3 class="h3 mt">' + esc(judul) + '</h3></div><span class="muted sm" id="dv-n"></span></div>' +
      '<div class="dv-grid"><div class="dv-stage"><div class="dv-host"></div><div class="dv-cap"></div></div><div class="dv-side"><ol class="dv-list">' + steps.map((s, i) => '<li><button data-i="' + i + '"><b>' + (i + 1) + '</b><span>' + esc(s.t) + '</span></button></li>').join('') + '</ol></div></div>' +
      '<div class="dv-now"><h4 class="dv-t"></h4><p class="dv-d"></p><div class="dv-f"></div></div>' +
      '<div class="dv-ctl"><button class="btn btn-ghost sm" data-c="prev">◀ Sebelumnya</button><button class="btn btn-primary sm fx-btn" data-c="play">▶ Putar dengan Suara</button><button class="btn btn-ghost sm" data-c="next">Berikutnya ▶</button><button class="btn btn-soft sm" data-c="say">🔈 Dengarkan langkah ini</button><label class="chk"><input type="checkbox" data-c="voice" ' + (Voice.on ? 'checked' : '') + '> 🔊 Narasi suara</label><label class="chk">Kecepatan <select class="input" data-c="rate" style="width:auto"><option value="0.8">Pelan</option><option value="0.95" selected>Normal</option><option value="1.15">Cepat</option></select></label></div><p class="muted sm dv-note"></p></div>';
    const $h = host.querySelector('.dv-host'), q = (s) => host.querySelector(s);
    if (!Voice.synth) { q('.dv-note').textContent = 'Peramban ini belum mendukung suara narasi; langkah tetap berjalan otomatis dan bisa dibaca.'; q('[data-c=voice]').disabled = true; q('[data-c=say]').disabled = true; }
    else if (!Voice.hasId) setTimeout(() => { if (!Voice.hasId && q('.dv-note')) q('.dv-note').textContent = 'Catatan: suara bahasa Indonesia belum ditemukan di perangkat ini; narasi memakai suara bawaan. Anda dapat menambah suara Indonesia di pengaturan teks-ke-suara perangkat.'; }, 800);
    const clearStage = () => { if (st.ctl) { st.ctl.destroy(); st.ctl = null; } if (st.an) { st.an.destroy(); st.an = null; } st.kind = null; };
    function visual(sp, first) {
      const cap = sp.cap;
      if (sp.s === '3d') {
        if (st.kind !== '3d') { clearStage(); $h.innerHTML = ''; st.ctl = Fold3D.mount($h, m.fold, { pattern: (m.id === 'kubus' || m.id === 'balok') ? '141e' : undefined, folded: !!sp.fold }); st.kind = '3d'; st.ctl.highlight(sp.hi); }
        else { st.ctl.highlight(sp.hi); if (st.ctl.folded() !== !!sp.fold) st.ctl.fold(sp.fold); }
        return;
      }
      clearStage(); st.kind = sp.s;
      if (sp.s === 'anat') { $h.innerHTML = ''; st.an = Anatomy.mount($h, m.fold, { bare: true, sel: sp.sel }); return; }
      let body = '', extra = '';
      if (sp.s === 'blk') { const r = blocks(sp.D, sp.show, sp.mask); body = r.svg; extra = r.n; }
      else if (sp.s === 'stair') { const r = stair(sp.n, sp.L); body = r.svg; extra = r.n; }
      else if (sp.s === 'disc') body = discs(sp.n, sp.done);
      else if (sp.s === 'pour') body = pour(sp.c, sp.f, sp.n, st.prevLvl);
      else if (sp.s === 'sph') body = sph(sp.m);
      $h.innerHTML = '<svg viewBox="0 0 400 300" role="img" aria-label="Animasi penemuan rumus">' + body + (extra ? '<g>' + '<rect x="12" y="12" rx="12" width="' + (String(extra).length * 10 + 140) + '" height="30" fill="#1F2A44"/>' + txt(24, 32, 'Jumlah kubus: ' + extra, 14, '#fff', 'start') + '</g>' : '') + '</svg>';
      if (sp.s === 'pour') { const g = $h.querySelector('.wat'); const to = sp.n / 3; if (g) setTimeout(() => { g.style.transition = 'transform 1.1s ease'; g.style.transform = 'scaleY(' + to + ')'; }, 60); st.prevLvl = to; }
    }
    function show(i, auto) {
      st.i = Math.max(0, Math.min(steps.length - 1, i)); const s = steps[st.i];
      q('#dv-n').textContent = 'Langkah ' + (st.i + 1) + ' dari ' + steps.length; q('.dv-t').textContent = (st.i + 1) + '. ' + s.t; q('.dv-d').textContent = s.d; const fe = q('.dv-f'); fe.textContent = s.f; fe.classList.remove('pop'); void fe.offsetWidth; fe.classList.add('pop');
      q('.dv-cap').textContent = s.c || ''; q('.dv-cap').style.display = s.c ? '' : 'none';
      host.querySelectorAll('.dv-list button').forEach((b, k) => { b.classList.toggle('on', k === st.i); b.classList.toggle('done', k < st.i); }); const cur = host.querySelector('.dv-list button.on'); if (cur && cur.scrollIntoView && auto) cur.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      visual(s.v); if (window.Sfx) Sfx.play('step', st.i);
    }
    function stop() { st.play = false; clearTimeout(st.timer); Voice.cancel(); const b = q('[data-c=play]'); if (b) b.textContent = '▶ Putar dengan Suara'; }
    function advance() { if (!st.play) return; if (st.i >= steps.length - 1) { stop(); if (window.Sfx) Sfx.play('success'); return; } show(st.i + 1, true); narrate(); }
    function narrate() {
      if (!st.play) return; const s = steps[st.i];
      if (Voice.on && Voice.synth) Voice.speak(s.d, () => { if (st.play) st.timer = setTimeout(advance, 900); });
      else st.timer = setTimeout(advance, 3500 + s.d.length * 55);
    }
    host.addEventListener('click', e => {
      const b = e.target.closest('[data-i]'); if (b) { show(+b.dataset.i); if (st.play) { Voice.cancel(); clearTimeout(st.timer); narrate(); } return; }
      const c = e.target.closest('[data-c]'); if (!c) return; const a = c.dataset.c;
      if (a === 'prev' || a === 'next') { show(st.i + (a === 'next' ? 1 : -1)); if (st.play) { Voice.cancel(); clearTimeout(st.timer); narrate(); } }
      if (a === 'play') { if (st.play) stop(); else { if (window.__dvStop) window.__dvStop(); st.play = true; window.__dvStop = stop; c.textContent = '⏸ Jeda'; if (st.i >= steps.length - 1) show(0); narrate(); } }
      if (a === 'say') { if (window.__dvStop && window.__dvStop !== stop) window.__dvStop(); Voice.speak(steps[st.i].d); }
    });
    host.addEventListener('change', e => { const c = e.target.dataset.c; if (c === 'voice') { Voice.on = e.target.checked; localStorage.setItem('gq_voice', Voice.on ? 'on' : 'off'); if (!Voice.on) Voice.cancel(); } if (c === 'rate') Voice.rate = +e.target.value; });
    show(0);
    return { destroy() { stop(); clearStage(); if (window.__dvStop === stop) window.__dvStop = null; } };
  }
  window.Derive = { mount, Voice, ucap };
})();
