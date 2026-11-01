// ============================================================
//  charts.js — grafik SVG ringan (batang, lingkaran, garis) tanpa pustaka luar
// ============================================================
(function () {
  const C = { teal: '#2EC4B6', tealD: '#1B8F84', lav: '#B8A9F5', lavD: '#7B6AD0', coral: '#E85D5D', coralD: '#B93A3F', yel: '#FFD66B', navy: '#1F2A44', grid: '#E6EAF2', txt: '#5B6580' };
  const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('id-ID');
  function bar(el, o) {
    const W = 520, H = 250, pl = 34, pb = 38, pt = 26, n = o.values.length, bw = Math.min(70, (W - pl - 10) / n * 0.55), step = (W - pl - 10) / n, max = o.max || 100;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Diagram batang') + '">';
    [0, 25, 50, 75, 100].forEach(g => { const y = pt + (H - pt - pb) * (1 - g / 100); s += '<line x1="' + pl + '" x2="' + (W - 6) + '" y1="' + y + '" y2="' + y + '" stroke="' + C.grid + '"/><text x="' + (pl - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="' + C.txt + '">' + Math.round(max * g / 100) + '</text>'; });
    if (o.target) { const y = pt + (H - pt - pb) * (1 - o.target / max); s += '<line x1="' + pl + '" x2="' + (W - 6) + '" y1="' + y + '" y2="' + y + '" stroke="' + C.coral + '" stroke-dasharray="5 4"/><text x="' + (W - 8) + '" y="' + (y - 5) + '" text-anchor="end" font-size="11" fill="' + C.coralD + '" font-weight="700">KKM ' + o.target + '</text>'; }
    o.values.forEach((v, i) => {
      const h = (H - pt - pb) * Math.min(1, v / max), x = pl + step * i + (step - bw) / 2, y = H - pb - h;
      s += '<g class="bar" style="animation-delay:' + i * 90 + 'ms"><rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.max(0, h) + '" rx="8" fill="' + o.colors[i % o.colors.length] + '"/><text x="' + (x + bw / 2) + '" y="' + (y - 6) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + C.navy + '">' + (o.fmt ? o.fmt(v) : f1(v)) + '</text></g><text x="' + (x + bw / 2) + '" y="' + (H - 16) + '" text-anchor="middle" font-size="11.5" font-weight="600" fill="' + C.txt + '">' + o.labels[i] + '</text>';
    });
    el.innerHTML = s + '</svg>';
  }
  function donut(el, o) {
    const R = 62, r = 46, cx = 80, cy = 80, tot = o.items.reduce((a, b) => a + b.value, 0) || 1; let a0 = -Math.PI / 2, s = '<svg viewBox="0 0 160 160" role="img" aria-label="' + (o.label || 'Diagram lingkaran') + '">';
    if (!o.items.some(i => i.value)) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + r) / 2 + '" fill="none" stroke="' + C.grid + '" stroke-width="' + (R - r) + '"/>';
    o.items.forEach((it, i) => {
      if (!it.value) return; const a1 = a0 + it.value / tot * Math.PI * 2 - (o.items.filter(x => x.value).length > 1 ? 0.03 : 0), big = a1 - a0 > Math.PI ? 1 : 0;
      const p = (rad, a) => (cx + rad * Math.cos(a)).toFixed(2) + ' ' + (cy + rad * Math.sin(a)).toFixed(2);
      s += '<path class="seg" style="animation-delay:' + i * 120 + 'ms" d="M' + p(R, a0) + 'A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + p(R, a1) + 'L' + p(r, a1) + 'A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + p(r, a0) + 'Z" fill="' + it.color + '"/>'; a0 = a1 + 0.03;
    });
    s += '<text x="80" y="82" text-anchor="middle" font-family="Epilogue,sans-serif" font-size="26" font-weight="800" fill="' + C.navy + '">' + o.center[0] + '</text><text x="80" y="99" text-anchor="middle" font-size="10.5" fill="' + C.txt + '">' + o.center[1] + '</text></svg>';
    el.innerHTML = s;
  }
  function line(el, o) {
    const W = 520, H = 210, pl = 30, pb = 30, pt = 14, n = o.values.length, max = Math.max(4, Math.max.apply(null, o.values)), sx = (W - pl - 14) / Math.max(1, n - 1), y = v => pt + (H - pt - pb) * (1 - v / max), x = i => pl + sx * i;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Grafik garis') + '">';
    [0, 0.5, 1].forEach(g => { const yy = pt + (H - pt - pb) * (1 - g); s += '<line x1="' + pl + '" x2="' + (W - 8) + '" y1="' + yy + '" y2="' + yy + '" stroke="' + C.grid + '"/><text x="' + (pl - 5) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="10.5" fill="' + C.txt + '">' + Math.round(max * g) + '</text>'; });
    const d = o.values.map((v, i) => (i ? 'L' : 'M') + x(i) + ' ' + y(v)).join('');
    s += '<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C.lav + '" stop-opacity=".55"/><stop offset="1" stop-color="' + C.lav + '" stop-opacity="0"/></linearGradient></defs><path d="' + d + 'L' + x(n - 1) + ' ' + (H - pb) + 'L' + x(0) + ' ' + (H - pb) + 'Z" fill="url(#lg)"/><path class="ln" d="' + d + '" fill="none" stroke="' + C.lavD + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>';
    o.values.forEach((v, i) => { s += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3.6" fill="#fff" stroke="' + C.lavD + '" stroke-width="2"><title>' + o.labels[i] + ': ' + v + '</title></circle>'; if (i % 2 === 0 || n < 8) s += '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="10" fill="' + C.txt + '">' + o.labels[i] + '</text>'; });
    el.innerHTML = s + '</svg>';
  }
  window.Charts = { C, bar, donut, line };
})();
