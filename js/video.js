// ============================================================
//  video.js — video YouTube yang diputar DI DALAM halaman (iframe ter-sandbox: tidak bisa membuka
//  YouTube di tab baru maupun mengalihkan halaman). Tampil sebagai "poster" dulu agar halaman ringan.
// ============================================================
(function () {
  const BAWAAN = {
    bola: [{ id: '1nwOAR8BYp0', judul: 'Video: Rumus Volume Bola' }],
    limas: [{ id: 'YCynCiGGb9M', judul: 'Video: Rumus Volume Limas' }],
    kerucut: [{ id: 'scpP86WYuAo', judul: 'Video: Rumus Volume Kerucut' }]
  };
  const ERR = { 2: 'ID video tidak valid.', 5: 'Video tidak dapat diputar di peramban ini.', 100: 'Video tidak ditemukan atau bersifat privat.', 101: 'Pemilik video tidak mengizinkan video diputar di situs lain.', 150: 'Pemilik video tidak mengizinkan video diputar di situs lain.', 153: 'Video belum dapat dimuat (periksa koneksi atau alamat situs).' };
  function daftar(m) {
    const cfg = (window.APP_CONFIG.VIDEO_YOUTUBE || {})[m.id];
    if (cfg) return typeof cfg === 'string' ? [{ id: cfg, judul: 'Video Pembelajaran ' + m.nama }] : cfg;
    return BAWAAN[m.id] || [];
  }
  const ok = (id) => /^[A-Za-z0-9_-]{6,20}$/.test(id);
  function html(m) {
    return daftar(m).filter(v => ok(v.id)).map(v => '<div class="card pad mt vid-card"><span class="chip chip-coral">🎬 Video Pembelajaran</span><h3 class="h3 mt">' + esc(v.judul) + '</h3><p class="muted sm">Video diputar langsung di halaman ini — kamu tetap berada di GeoQuest 3D. Tonton dulu, lalu coba contoh soal di bawahnya.</p>' +
      '<div class="yt" data-id="' + v.id + '" data-t="' + esc(v.judul) + '"><div class="yt-poster"><img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()"></div><button type="button" class="yt-play" data-act="yt" aria-label="Putar ' + esc(v.judul) + '"><span>▶</span><b>Putar Video</b></button></div><p class="yt-note sm"></p></div>').join('');
  }
  function play(btn) {
    const box = btn.closest('.yt'); if (!box || box.dataset.on) return; box.dataset.on = 1;
    const id = box.dataset.id, f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&hl=id&enablejsapi=1&origin=' + encodeURIComponent(location.origin);
    f.title = box.dataset.t; f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');      // tanpa allow-popups / allow-top-navigation → tidak bisa keluar ke YouTube
    f.addEventListener('load', () => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: id, channel: 'widget' }), '*'); } catch (e) {} });
    box.innerHTML = ''; box.appendChild(f); box.classList.add('playing');
  }
  window.addEventListener('message', (e) => {
    if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
    let d = e.data; if (typeof d === 'string') { try { d = JSON.parse(d); } catch (x) { return; } }
    if (!d || d.event !== 'onError' && !(d.event === 'infoDelivery' && d.info && d.info.errorCode)) return;
    const code = d.event === 'onError' ? d.info : d.info.errorCode, box = Array.from(document.querySelectorAll('.yt iframe')).find(f => f.contentWindow === e.source);
    const note = box && box.closest('.vid-card').querySelector('.yt-note'); if (note) note.textContent = '⚠ ' + (ERR[code] || 'Video tidak dapat diputar.') + ' Beri tahu gurumu agar videonya diganti.';
  });
  U.on('yt', play);
  window.Video = { html, daftar, BAWAAN };
})();
