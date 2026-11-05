// ============================================================
//  game.js — Asesmen Formatif 1: "Petualangan Jaring-jaring" (mini game 7 level)
//  Kunci jawaban ada di server; umpan balik tiap level diminta lewat asesmen.jawab
// ============================================================
(function () {
  const P = Art.P, C = [P.teal[1], P.lav[1], P.yel[1], P.coral[1], P.mint[2], P.sky[2]];
  const svg = (inner) => '<svg viewBox="0 0 160 130" role="img">' + inner + '</svg>';
  const grid = (rows, cell) => { let o = '', w = rows[0].length * cell, h = rows.length * cell, x0 = (160 - w) / 2, y0 = (130 - h) / 2, k = 0; rows.forEach((r, j) => r.split('').forEach((ch, i) => { if (ch === '#') o += Art.sq(x0 + i * cell, y0 + j * cell, cell, cell, C[(k++) % 6]); })); return svg(o); };
  const rects = (list, u, ox, oy) => svg(list.map((r, i) => Art.sq(ox + r[0] * u, oy + r[1] * u, r[2] * u, r[3] * u, C[i % 3])).join(''));
  const T = (a, b, c, i) => Art.tri(a, b, c, C[i]);
  const prismNet = (n, tris) => { let o = ''; const w = 30, h = 48, x0 = (160 - 30 * n) / 2, y0 = 40; for (let i = 0; i < n; i++) o += Art.sq(x0 + i * w, y0, w, h, C[i % 3]); const mx = x0 + w; if (tris >= 1) o += T([mx, y0], [mx + w, y0], [mx + w / 2, y0 - 26], 3); if (tris >= 2) o += T([mx, y0 + h], [mx + w, y0 + h], [mx + w / 2, y0 + h + 26], 3); return svg(o); };
  const limasNet = (mode) => { let o = ''; const s = 34, t = 30, x = 63, y = 48; if (mode !== 'none') o += Art.sq(x, y, s, s, C[0]); o += T([x, y], [x + s, y], [x + s / 2, y - t], 1); o += T([x, y + s], [x + s, y + s], [x + s / 2, y + s + t], 2); o += T([x, y], [x, y + s], [x - t, y + s / 2], 3); if (mode === 'ok') o += T([x + s, y], [x + s, y + s], [x + s + t, y + s / 2], 4); if (mode === 'none') o += T([x + s, y], [x + s, y + s], [x + s + t, y + s / 2], 4) + T([x, y + s], [x + s, y + s], [x + s / 2, y + s + t], 5); return svg(o); };
  const cylNet = (n) => { let o = Art.sq(22, 50, 116, 38, C[1]); const cs = [[44, 30], [116, 108], [80, 30]].slice(0, n); cs.forEach((c, i) => o += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="19" fill="' + C[0] + '" stroke="#fff" stroke-width="2"/>'); return svg(o); };
  const coneNet = (m) => { let o = '<circle cx="46" cy="65" r="22" fill="' + C[0] + '" stroke="#fff" stroke-width="2"/>'; if (m === 'tri') o += Art.tri([80, 100], [140, 100], [110, 28], C[1]); else if (m === 'rect') o += Art.sq(82, 40, 60, 50, C[1]); else o += '<path d="M138,95 L78,95 A60 60 0 0 1 108,43 Z" fill="' + C[1] + '" stroke="#fff" stroke-width="2" transform="translate(0,2)"/>'; return svg(o); };
  const txt = (t, ic) => '<div class="txtopt"><b>' + ic + '</b><span>' + t + '</span></div>';
  const LV = [
    { k: 'kubus', q: 'Manakah jaring-jaring yang bisa dilipat menjadi sebuah KUBUS?', o: [grid(['##', '##', '##'], 30), grid(['.#..', '####', '.#..'], 28), grid(['####', '#...', '#...'], 30)] },
    { k: 'balok', q: 'Manakah jaring-jaring BALOK yang benar (ukuran sisinya berpasangan)?', o: [rects([[1, 0, 3, 1], [0, 1, 1, 2], [1, 1, 3, 2], [4, 1, 1, 2], [1, 3, 3, 1], [1, 4, 3, 2]], 17, 34, 6), rects([[1, 0, 3, 1], [0, 1, 1, 2], [1, 1, 3, 2], [4, 1, 1, 1], [1, 3, 3, 1], [1, 4, 3, 2]], 17, 34, 6), rects([[1, 0, 3, 1], [0, 1, 1, 2], [1, 1, 3, 2], [4, 1, 1, 2], [1, 3, 3, 1]], 17, 34, 14)] },
    { k: 'prisma', q: 'Pilih jaring-jaring PRISMA SEGITIGA yang lengkap!', o: [prismNet(4, 2), prismNet(3, 1), prismNet(3, 2)] },
    { k: 'limas', q: 'Jaring-jaring manakah yang dapat membentuk LIMAS SEGIEMPAT?', o: [limasNet('three'), limasNet('ok'), limasNet('none')] },
    { k: 'tabung', q: 'Pilih jaring-jaring TABUNG yang benar!', o: [cylNet(2), cylNet(1), cylNet(3)] },
    { k: 'kerucut', q: 'Manakah jaring-jaring KERUCUT?', o: [coneNet('tri'), coneNet('rect'), coneNet('sector')] },
    { k: 'bola', q: 'Manakah pernyataan yang benar tentang jaring-jaring BOLA?', o: [txt('Dua lingkaran besar yang disusun berdampingan', '◯◯'), txt('Bola tidak punya jaring-jaring datar yang sempurna', '🌐'), txt('Satu lingkaran penuh sudah cukup', '⭕')] }
  ];
  const L = ['A', 'B', 'C'];

  function run(host, att) {
    const st = { i: 0, ans: [], res: [], t0: Date.now(), busy: false };
    let timer = setInterval(() => { const e = host.querySelector('#g-time'); if (e) { const s = Math.floor((Date.now() - st.t0) / 1000); e.textContent = U.pad(Math.floor(s / 60)) + ':' + U.pad(s % 60); } }, 1000);
    function view() {
      const lv = LV[st.i];
      host.innerHTML = '<div class="game card"><div class="game-top"><div><span class="chip chip-lav">' + (att.resmiNanti ? 'Nilai resmi' : 'Latihan') + '</span><h2 class="h2">Petualangan Jaring-jaring</h2></div><div class="chip chip-navy">⏱ <b id="g-time">00:00</b></div></div>' +
        '<div class="steps">' + LV.map((l, k) => '<i class="' + (k < st.i ? (st.res[k] && st.res[k].benar ? 'ok' : 'no') : k === st.i ? 'cur' : '') + '"></i>').join('') + '</div>' +
        '<div class="game-body"><div class="game-solid fx-card"><img src="' + Art.img(lv.k, 0) + '" alt=""><b>Level ' + (st.i + 1) + ' · ' + lv.k.charAt(0).toUpperCase() + lv.k.slice(1) + '</b></div><div><p class="q-text">' + lv.q + '</p><div class="g-opts">' +
        lv.o.map((o, k) => '<button class="g-opt fx-card" data-k="' + k + '"><span class="g-l">' + L[k] + '</span>' + o + '</button>').join('') + '</div><div id="g-fb"></div></div></div></div>';
      host.querySelectorAll('.g-opt').forEach(b => b.addEventListener('click', () => pick(+b.dataset.k)));
    }
    async function pick(k) {
      if (st.busy) return; st.busy = true; const btns = host.querySelectorAll('.g-opt'); btns.forEach(b => b.disabled = true);
      let r; try { r = await API.data('asesmen.jawab', { attemptId: att.attemptId, level: st.i, jawaban: k }); } catch (e) { U.toast(e.message, 'err'); btns.forEach(b => b.disabled = false); st.busy = false; return; }
      st.ans[st.i] = k; st.res[st.i] = r;
      btns.forEach((b, j) => { b.classList.toggle('good', j === r.kunci[0]); if (j === k && !r.benar) b.classList.add('bad'); });
      Sfx.play(r.benar ? 'correct' : 'wrong'); if (r.benar) { const b = btns[k].getBoundingClientRect(); FX.confetti(b.left + b.width / 2, b.top); }
      host.querySelector('#g-fb').innerHTML = '<div class="fb ' + (r.benar ? 'ok' : 'no') + '"><b>' + (r.benar ? '🎉 Tepat sekali!' : '🤔 Belum tepat.') + '</b><p>' + esc(r.pembahasan) + '</p><button class="btn btn-primary fx-btn" id="g-next">' + (st.i === LV.length - 1 ? 'Lihat Hasil 🏁' : 'Level Berikutnya →') + '</button></div>';
      host.querySelector('#g-next').addEventListener('click', next); host.querySelector('#g-fb').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); st.busy = false;
    }
    async function next() { if (st.i < LV.length - 1) { st.i++; view(); return; } finish(); }
    async function finish() {
      clearInterval(timer); host.innerHTML = '<div class="card center pad"><div class="spin"></div><p>Menghitung nilai…</p></div>';
      let h; try { h = await API.data('asesmen.kumpul', { attemptId: att.attemptId, jawaban: st.ans }); } catch (e) { host.innerHTML = '<div class="card center pad"><p>' + esc(e.message) + '</p><button class="btn btn-primary" id="g-retry">Coba kirim lagi</button></div>'; host.querySelector('#g-retry').onclick = finish; return; }
      await App.refresh();
      host.innerHTML = '<div class="card result center pad"><div class="medal">' + (h.skor >= h.kkm ? '🏆' : '⭐') + '</div><h2 class="h2">Asesmen Formatif 1 selesai!</h2><div class="score-big" data-count="' + h.skor + '">0</div><p class="muted">' + h.benar + ' dari ' + h.total + ' level benar · ' + U.fmtDur(h.dur) + '</p><span class="chip ' + (h.resmi ? 'chip-teal' : 'chip-lav') + '">' + (h.resmi ? 'Nilai resmi terkunci' : 'Latihan — nilai resmi tidak berubah') + '</span>' +
        '<div class="review">' + LV.map((l, k) => '<span class="rv ' + (st.res[k] && st.res[k].benar ? 'ok' : 'no') + '">' + (k + 1) + ' ' + l.k + '</span>').join('') + '</div><div class="row gap center"><button class="btn btn-ghost" data-go="/asesmen">Kembali ke Asesmen</button><button class="btn btn-primary fx-btn" data-act="mulai" data-j="F1">Main lagi (latihan)</button></div></div>';
      FX.scan(host); if (h.skor >= h.kkm) FX.confetti();
    }
    view(); return () => clearInterval(timer);
  }
  window.Game = { run };
})();
