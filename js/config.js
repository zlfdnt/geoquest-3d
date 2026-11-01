// ============================================================
//  GeoQuest 3D — konfigurasi frontend (SATU-SATUNYA nilai yang perlu Anda isi)
//  Hanya URL /exec yang boleh ada di sini. Jangan taruh token/rahasia apa pun.
// ============================================================
window.APP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycbwSbShGTzd2AboFTmoNwavluOsmAxOibkBi9JbuqcqIjzX2zrnO7E2qZ4Xh4bI5aQdF/exec',

  // Opsional: nomor WhatsApp cadangan (format 62812xxxx). Nomor utama diatur guru di Dashboard › Pengaturan.
  WA_NOMOR: '',

  // Opsional: ID video YouTube animasi rumus per bangun (kosongkan bila belum ada;
  // aplikasi otomatis menampilkan animasi turunan rumus bawaan).
  VIDEO_YOUTUBE: { kubus: '', balok: '', prisma: '', limas: '', tabung: '', kerucut: '', bola: '' },

  // Opsional: ganti ilustrasi bawaan dengan gambar dari Google Drive/URL sendiri.
  // Contoh: GAMBAR: { kubus: ['https://.../k1.jpg', 'https://.../k2.jpg'] }
  GAMBAR: {}
};
