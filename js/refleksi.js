// ============================================================
//  refleksi.js — Refleksi wajib sebelum skor Sumatif tampil, lalu Pengayaan (jawaban tepat + pembahasan)
// ============================================================
(function () {
  const L = ['A', 'B', 'C', 'D', 'E', 'F'];
  const KES = [['wacana', '📖 Membaca wacana'], ['tabel', '📊 Membaca tabel data'], ['permukaan', '📐 Menghitung luas permukaan'], ['volume', '🧊 Menghitung volume'], ['rumus', '🧮 Memilih rumus yang tepat'], ['waktu', '⏱ Mengatur waktu'], ['lainnya', '❓ Lainnya']];
  const RASA = ['😄', '🙂', '😐', '😟', '😢'], YAKIN = ['Tidak yakin', 'Kurang yakin', 'Ragu-ragu', 'Yakin', 'Sangat yakin'];
  const tabelHtml = (t) => !t ? '' : '<div class="tbl-wrap"><table class="wtable"><thead><tr>' + t.kolom.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + t.baris.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';

  // ---------- formulir refleksi ----------
  function form(host, h, done) {
    const st = { y: 0, k: [], w: '', s: '', r: '', p: '🙂' }, stop = h.alasan === 'pelanggaran', wkt = h.alasan === 'waktu habis';
    host.innerHTML = '<div class="card pad refl"><div class="row gap wrap"><span class="medal sm">🪞</span><div><span class="chip chip-lav">Refleksi · wajib diisi</span><h2 class="h2 mt">Satu langkah lagi sebelum skormu muncul</h2></div></div>' +
      (stop ? '<div class="note warn">Ujianmu dihentikan karena batas pelanggaran tercapai. Jawaban yang sudah kamu isi tetap dinilai.</div>' : wkt ? '<div class="note warn">Waktu habis — jawabanmu sudah dikumpulkan otomatis.</div>' : '<div class="note ok">✅ Jawabanmu sudah terkirim dengan aman.</div>') +
      '<p class="muted">Refleksi membantumu mengenali cara belajarmu sendiri dan membantu guru memberi bimbingan yang tepat. Jawab dengan jujur — tidak ada jawaban yang salah.</p><div class="score-lock"><span>🔒</span><b>Skor menunggu refleksimu</b></div>' +
      '<fieldset class="rq"><legend>1. Seberapa yakin kamu dengan jawabanmu secara keseluruhan?</legend><div class="scale" data-q="y">' + YAKIN.map((t, i) => '<button type="button" data-v="' + (i + 1) + '"><b>' + (i + 1) + '</b><small>' + t + '</small></button>').join('') + '</div></fieldset>' +
      '<fieldset class="rq"><legend>2. Bagian mana yang terasa paling sulit? <small>(boleh lebih dari satu)</small></legend><div class="chips-row wrapchips" data-q="k">' + KES.map(k => '<button type="button" class="chip-btn" data-v="' + k[0] + '">' + k[1] + '</button>').join('') + '</div></fieldset>' +
      '<fieldset class="rq"><legend>3. Apakah waktu yang diberikan cukup?</legend><div class="scale three" data-q="w">' + [['lebih', 'Lebih dari cukup'], ['cukup', 'Cukup'], ['kurang', 'Kurang']].map(t => '<button type="button" data-v="' + t[0] + '"><small>' + t[1] + '</small></button>').join('') + '</div></fieldset>' +
      '<fieldset class="rq"><legend>4. Strategi apa yang kamu pakai saat mengerjakan?</legend><textarea class="input" id="rf-s" rows="2" maxlength="400" placeholder="Contoh: Saya baca wacana dulu, lalu menandai angka penting sebelum menghitung."></textarea><small class="muted" id="rf-sc">0/8 karakter minimum</small></fieldset>' +
      '<fieldset class="rq"><legend>5. Apa yang akan kamu lakukan untuk belajar lebih baik?</legend><textarea class="input" id="rf-r" rows="2" maxlength="400" placeholder="Contoh: Saya akan berlatih soal berbentuk tabel dan mengulang rumus volume kerucut."></textarea><small class="muted" id="rf-rc">0/8 karakter minimum</small></fieldset>' +
      '<fieldset class="rq"><legend>6. Bagaimana perasaanmu setelah ujian?</legend><div class="scale emo" data-q="p">' + RASA.map(r => '<button type="button" data-v="' + r + '" class="' + (r === '🙂' ? 'on' : '') + '">' + r + '</button>').join('') + '</div></fieldset>' +
      '<div id="rf-err" class="err" role="alert"></div><div class="row end"><button class="btn btn-primary fx-btn big glow" id="rf-go" disabled>🎯 Lihat Skorku</button></div></div>';
    const q = (s) => host.querySelector(s), valid = () => st.y > 0 && st.k.length && st.w && st.s.trim().length >= 8 && st.r.trim().length >= 8;
    const upd = () => { q('#rf-go').disabled = !valid(); q('#rf-sc').textContent = Math.min(400, st.s.trim().length) + '/8 karakter minimum'; q('#rf-rc').textContent = Math.min(400, st.r.trim().length) + '/8 karakter minimum'; };
    host.querySelectorAll('[data-q]').forEach(g => g.addEventListener('click', e => {
      const b = e.target.closest('[data-v]'); if (!b) return; const k = g.dataset.q, v = b.dataset.v;
      if (k === 'k') { const i = st.k.indexOf(v); i >= 0 ? st.k.splice(i, 1) : st.k.push(v); b.classList.toggle('on'); }
      else { st[k] = k === 'y' ? +v : v; g.querySelectorAll('[data-v]').forEach(x => x.classList.toggle('on', x === b)); }
      upd();
    }));
    q('#rf-s').addEventListener('input', e => { st.s = e.target.value; upd(); }); q('#rf-r').addEventListener('input', e => { st.r = e.target.value; upd(); });
    q('#rf-go').onclick = async () => {
      const b = q('#rf-go'); b.disabled = true; b.textContent = 'Menyimpan…'; q('#rf-err').textContent = '';
      try { const r = await API.call('asesmen.refleksi', { hasilId: h.id, keyakinan: st.y, kesulitan: st.k, waktuCukup: st.w, strategi: st.s.trim(), rencana: st.r.trim(), perasaan: st.p });
        if (!r.success) throw new Error(r.message); done(r.data); }
      catch (e) { q('#rf-err').textContent = e.message; b.disabled = false; b.textContent = '🎯 Lihat Skorku'; }
    };
    upd(); window.scrollTo(0, 0);
  }

  // ---------- skor + pengayaan ----------
  function tampil(host, d) {
    const h = d.hasil, stop = h.alasan === 'pelanggaran', lulus = h.skor >= h.kkm, P = d.pengayaan, poin = P ? P.reduce((a, x) => a + x.frac * x.bobot, 0) : 0, tot = P ? P.reduce((a, x) => a + x.bobot, 0) : 0;
    const stat = (x) => !x.dipilih.length ? ['—', 'Tidak dijawab', 'chip-gray', 'kosong'] : x.frac === 1 ? ['✓', 'Benar', 'chip-teal', 'benar'] : x.frac > 0 ? ['◐', 'Sebagian benar', 'chip-yel', 'sebagian'] : ['✗', 'Belum tepat', 'chip-coral', 'salah'];
    const nB = P ? P.filter(x => x.frac === 1).length : 0, nS = P ? P.filter(x => x.frac > 0 && x.frac < 1).length : 0, nX = P ? P.length - nB - nS : 0;
    const kartu = (x) => { const s = stat(x), w = x.wacana_id && d.wacana[x.wacana_id];
      return '<article class="card pad pg-item" data-s="' + s[3] + '"><div class="row between wrap gap"><div class="row gap center wrap"><span class="pg-no">' + x.no + '</span><span class="chip chip-gray">' + esc(x.topik) + '</span>' + (x.tipe === 'PGK' ? '<span class="chip chip-lav">Pilihan ganda kompleks</span>' : '') + '</div><span class="chip ' + s[2] + '">' + s[0] + ' ' + s[1] + ' · ' + (Math.round(x.frac * x.bobot * 10) / 10) + '/' + x.bobot + ' poin</span></div>' +
        (w ? '<details class="pg-wac"><summary>📖 Lihat wacana: ' + esc(w.judul) + '</summary><div class="prose">' + w.isi + '</div>' + tabelHtml(w.tabel) + (w.catatan ? '<div class="note">ⓘ ' + esc(w.catatan) + '</div>' : '') + '</details>' : '') +
        '<p class="q-text">' + esc(x.teks) + '</p><div class="opts">' + x.opsi.map((o, i) => { const k = x.kunci.indexOf(i) >= 0, m = x.dipilih.indexOf(i) >= 0; return '<div class="opt pg-opt ' + (k ? 'good' : m ? 'bad' : '') + (m ? ' mine' : '') + '"><span class="ck">' + (k ? '✓' : m ? '✗' : '') + '</span><span class="ol">' + L[i] + '</span><span class="ot">' + esc(o) + '</span>' + (m ? '<em class="tag-me">Jawabanmu</em>' : '') + (k ? '<em class="tag-key">Kunci</em>' : '') + '</div>'; }).join('') + '</div>' +
        '<div class="fb ok pg-pb"><b>💡 Pembahasan</b><p>' + esc(x.pembahasan) + '</p><p class="sm"><b>Jawaban tepat:</b> ' + x.kunci.map(i => L[i]).join(', ') + '</p></div></article>'; };
    host.innerHTML = '<div class="card result center pad"><div class="medal">' + (stop ? '🚨' : lulus ? '🏆' : '⭐') + '</div><h2 class="h2">' + (stop ? 'Hasil Simulasi TKA (ujian dihentikan)' : h.alasan === 'waktu habis' ? 'Hasil Simulasi TKA (waktu habis)' : 'Simulasi TKA selesai!') + '</h2><div class="score-big" data-count="' + h.skor + '">0</div><p class="muted">' + h.benar + ' dari ' + h.total + ' soal benar penuh · waktu ' + U.fmtDur(h.dur) + ' · pelanggaran ' + h.langgar + '</p><span class="chip ' + (h.resmi ? 'chip-teal' : 'chip-lav') + '">' + (h.resmi ? '🔒 Nilai resmi terkunci' : 'Latihan — nilai resmi tidak berubah') + '</span><p class="muted">KKM: ' + h.kkm + ' · ' + (lulus ? 'Selamat, kamu mencapai KKM! 🎉' : 'Terus berlatih — lihat pengayaan di bawah untuk memperbaikinya.') + '</p><div class="row gap center wrap"><button class="btn btn-ghost" data-go="/asesmen">Kembali ke Asesmen</button><button class="btn btn-primary fx-btn" data-go="/nilai">Lihat Nilai Saya</button></div></div>' +
      (P ? '<section class="pengayaan"><div class="sec-head"><div><h2 class="h2">🌱 Pengayaan: Jawaban Tepat & Pembahasan</h2><p class="muted">Poin diperoleh <b>' + (Math.round(poin * 10) / 10) + '</b> dari ' + tot + ' · benar penuh ' + nB + ', sebagian ' + nS + ', belum tepat/kosong ' + nX + '</p></div><div class="chips-row" id="pg-f"><button class="chip-btn on" data-f="all">Semua (' + P.length + ')</button><button class="chip-btn" data-f="salah">Perlu diperbaiki (' + (nS + nX) + ')</button><button class="chip-btn" data-f="benar">Sudah benar (' + nB + ')</button></div></div><div class="note guest">Mulai dari soal yang belum tepat: bandingkan <b>Jawabanmu</b> dengan <b>Kunci</b>, lalu baca pembahasannya langkah demi langkah.</div><div class="pg-list" id="pg-list">' + P.map(kartu).join('') + '</div></section>' : '<div class="note guest mt">Pembahasan sedang dinonaktifkan oleh guru. Skor resmi tetap berlaku.</div>');
    const f = host.querySelector('#pg-f'); if (f) f.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; f.querySelectorAll('.chip-btn').forEach(x => x.classList.toggle('on', x === b)); host.querySelectorAll('.pg-item').forEach(c => { const s = c.dataset.s; c.style.display = b.dataset.f === 'all' || (b.dataset.f === 'benar' ? s === 'benar' : s !== 'benar') ? '' : 'none'; }); });
    FX.scan(host); window.scrollTo(0, 0); if (lulus && !stop) FX.confetti(); Sfx.play(lulus ? 'success' : 'ping');
  }
  // alur penuh: refleksi → skor + pengayaan
  function flow(host, h) { form(host, h, async (data) => { try { await App.refresh(); } catch (e) {} Sfx.play('unlock'); tampil(host, data); }); }
  // buka dari halaman Nilai Saya: bila refleksi belum ada → tampilkan formulir
  async function buka(host, id) {
    host.innerHTML = '<div class="card pad center"><div class="spin"></div></div>';
    try { const r = await API.call('asesmen.hasil', { hasilId: id });
      if (r.success) return tampil(host, r.data);
      if (r.code === 'REFLEKSI') { const row = ((S.data && S.data.hasil) || []).filter(x => x.id === id)[0] || { id, alasan: '' }; return flow(host, row); }
      host.innerHTML = '<div class="card pad center"><p>' + esc(r.message) + '</p><button class="btn btn-primary" data-go="/nilai">Kembali</button></div>';
    } catch (e) { host.innerHTML = '<div class="card pad center"><p>' + esc(e.message) + '</p><button class="btn btn-primary" data-go="/nilai">Kembali</button></div>'; }
  }
  window.Refleksi = { form, tampil, flow, buka };
})();
