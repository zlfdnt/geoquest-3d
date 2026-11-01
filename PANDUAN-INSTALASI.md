# Panduan Instalasi GeoQuest 3D

Aplikasi terdiri dari **dua bagian** yang dipasang terpisah:

| Bagian | Isi | Dipasang di |
|---|---|---|
| **Backend** | `Kode.gs` + `appsscript.json` (file terpisah, bukan di dalam ZIP) | Google Apps Script (akun Google guru) |
| **Frontend** | ZIP ini: `index.html`, `css/`, `js/` | GitHub Pages |

Urutan pemasangan: **Backend dulu → salin URL-nya → isi `js/config.js` → deploy Frontend.**

---

## A. Pasang Backend (Google Apps Script) — ±10 menit

1. Buka <https://script.google.com> → **Proyek baru** → ubah nama menjadi `GeoQuest 3D API`.
2. Hapus isi `Code.gs`, lalu **tempel seluruh isi `Kode.gs`**. (Boleh ganti nama file menjadi `Kode`.)
3. Menu **Project Settings (⚙)** → centang **Show "appsscript.json" manifest file in editor**. Kembali ke Editor, buka `appsscript.json`, **tempel isi file `appsscript.json`** yang disediakan.
4. Pilih fungsi **`setupAppEnvironment`** di menu atas → **Run**. Setujui izin Google (Lanjutan → Buka proyek → Izinkan).
5. Buka **Execution log**. Catat dua hal berikut — **hanya tampil sekali**:
   - `Kode guru : GURU-XXXXXX` → kode masuk guru.
   - Daftar **siswa contoh** + kode login (`GQ-XXXXX`). Ganti/hapus sebelum dipakai sungguhan.
   - Hilang kode guru? Jalankan fungsi `resetKodeGuru` untuk membuat yang baru.
6. **Deploy → New deployment → ⚙ Web app**
   - *Execute as*: **Me** · *Who has access*: **Anyone** → **Deploy**.
   - Salin **Web app URL** yang berakhiran `/exec`.
7. Setup otomatis sudah membuat: folder Drive, spreadsheet database (9 sheet), rahasia sesi di *Script Properties*, soal contoh (10 soal Formatif 2 + 14 soal Sumatif dengan 3 wacana), dan pemicu `keepWarm` tiap 5 menit.

> **Update kode di kemudian hari:** Deploy → **Manage deployments** → ✏ → **Version: New version** → Deploy. URL `/exec` tetap sama.

## B. Pasang Frontend (GitHub Pages) — ±10 menit

**1. Isi URL backend.** Ekstrak ZIP. Buka `js/config.js` dan ganti `GAS_URL` dengan URL `/exec` dari langkah A6. **Lakukan ini SEBELUM push pertama.**

**2. Pastikan Anda berada di folder yang benar.** Folder hasil ekstraksi ZIP *adalah* folder yang di-`git init` (jangan masuk lebih dalam, jangan naik satu level). Buka terminal di folder itu lalu cek:

```
dir          (Windows)        ls -la     (Mac/Linux)
```
Baris teratas harus menampilkan **`index.html`**, folder **`css`** dan **`js`**. Jika yang terlihat justru folder lain (mis. `frontend`), Anda satu level terlalu tinggi — `cd` ke folder yang berisi `index.html` dulu.

**3. Buat repository** di github.com → **+ → New repository** → nama bebas (mis. `geoquest-3d`) → **Public** → *jangan* centang README/.gitignore/license → Create.

**4. Push lewat terminal** (jangan memakai "Upload files" di web GitHub — struktur folder akan rusak):
```
git init
git add .
git commit -m "GeoQuest 3D"
git branch -M main
git remote add origin https://github.com/USERNAME/geoquest-3d.git
git push -u origin main
```
Saat diminta password, gunakan **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens → centang `repo`).

**5. Aktifkan Pages:** repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch **main** · folder **/ (root)** → Save. Dalam 1–2 menit situs tersedia di `https://USERNAME.github.io/geoquest-3d/`.

**Redeploy setelah mengubah file:** `git add . && git commit -m "update" && git push`.

## C. Pemakaian pertama

1. Buka situs → **Masuk** → pakai **kode guru**.
2. **Pengaturan Ujian**: isi nama sekolah, **nomor WhatsApp** (untuk tombol WhatsApp mengambang), durasi, KKM, batas pelanggaran.
3. **Kelola Siswa → Impor Daftar**: tempel `Nama;Kelas` per baris → unduh daftar kode (Excel/PDF) → bagikan ke siswa. Nonaktifkan/hapus siswa contoh.
4. Ganti kode guru (kartu *Ganti Kode Guru*).
5. Untuk memindahkan data dari aplikasi lama: **Pengaturan → Impor Data (Migrasi)** — jalankan *Simulasi (Dry-run)* dulu; aman diulang.

## D. Rangkuman fitur & keamanan

- **Siswa**: materi 7 bangun × 6 bagian (terbuka berurutan, dikunci server) · Lab Jaring-jaring 3D (kubus: 4 pola; balok, prisma, limas, tabung: animasi lipat 3D) · Formatif 1 (game 7 level) · Formatif 2 (10 soal + pembahasan per soal) · Sumatif TKA (14 soal PG/PGK/wacana-tabel, timer, mode terkunci) · Nilai Saya.
- **Anti-kecurangan** (hanya Sumatif): layar penuh wajib, deteksi pindah tab/aplikasi, screenshot (PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5), salin-tempel; alarm; maks. 3 pelanggaran (pengaturan) lalu ujian berakhir otomatis; pelanggaran dikirim ke server & tercatat; jawaban aman bila koneksi putus.
- **Nilai resmi** = percobaan pertama yang selesai; percobaan berikutnya = latihan.
- **Guru**: dashboard (kartu, grafik batang/lingkaran/garis/distribusi), rekap nilai, pelanggaran & log (filter kelas/jenis/status/tanggal, cari nama, urut kolom), unduh **Excel & PDF** sesuai filter aktif, bank soal, pengaturan, kelola siswa, migrasi.
- **Keamanan**: kunci jawaban & kode guru hanya di server; token sesi HMAC; rahasia di *Script Properties* (tidak di kode/Sheets/frontend); hak akses & kunci progres diperiksa di server; batas percobaan login; allowlist pengaturan.
- **Performa**: cache berlapis & berversi (CacheService, chunk), pemuatan awal lewat 1 request, log aktivitas dikirim per batch, pemantauan guru berinterval adaptif, `keepWarm` mencegah *cold start*.
- **Interaktif**: kartu & tombol berkilau (spotlight mengikuti kursor, kilau berjalan, riak), animasi muncul/hitung naik/konfeti, **slideshow otomatis** pada hero & setiap kartu materi (3 gambar), **tombol WhatsApp mengambang**, dan **kursor “+” presisi dengan partikel hidup** (aktif di komputer; dimatikan saat ujian & mengikuti *reduced motion*).

## E. Batasan yang perlu diketahui

- Aplikasi web **tidak dapat mengunci perangkat** sepenuhnya. Untuk ujian di kelas, pakai Chromebook mode kiosk / **Guided Access (iPhone)** dan pengawasan guru.
- **iPhone/iPad Safari tidak mendukung layar penuh web** → deteksi pindah tab/aplikasi tetap aktif, tetapi layar penuh tidak bisa dipaksa.
- **Screenshot lewat tombol fisik HP tidak dapat dideteksi** browser. Pelanggaran yang tercatat: keyboard komputer & berpindah aplikasi.
- **Video YouTube animasi rumus**: isi ID video di `js/config.js` → `VIDEO_YOUTUBE`. Selama kosong, aplikasi menampilkan animasi turunan rumus bawaan.
- **Gambar**: ilustrasi dibuat otomatis (SVG). Untuk gambar sendiri (Google Drive), isi `GAMBAR` di `js/config.js` dengan URL gambar publik.
- Batas Apps Script: ±6 menit/eksekusi dan kuota harian — untuk satu sekolah umumnya cukup; panggil `cekPerforma()` bila ragu. Matikan trigger `keepWarm` dengan menjalankan `matikanKeepWarm()` jika kuota trigger dibutuhkan.
- Penyimpangan dari referensi desain: **papan peringkat antarsiswa tidak ditampilkan** (PRD: siswa hanya melihat datanya sendiri); rumus tampil sebagai teks Unicode (s², π, √) — bukan LaTeX mentah seperti pada tangkapan layar referensi.

## F. Pemecahan masalah

| Gejala | Penyebab | Solusi |
|---|---|---|
| Layar “Hampir siap!” | `GAS_URL` belum diisi | Isi `js/config.js`, commit & push |
| 404 di GitHub Pages | `index.html` tidak di root repo | Lihat B2; ulangi dari folder yang benar |
| Halaman tanpa gaya (CSS/JS 404) | Upload via web GitHub merusak folder | Push lewat terminal |
| “Tidak dapat terhubung ke server” | URL salah / deploy belum *Anyone* | Deploy ulang (A6), cek URL berakhiran `/exec` |
| Perubahan kode backend tidak berlaku | Belum buat *New version* | Manage deployments → New version |
| “Sesi berakhir” berulang | Rahasia sesi dirotasi / kode guru diganti | Masuk kembali |
| Kode login tidak dikenali | Salah ketik / siswa nonaktif | Periksa di Pengaturan → Kelola Siswa |
| Lupa kode guru | — | Jalankan `resetKodeGuru` di editor Apps Script |

## G. Daftar uji (sesuai PRD §9)

Alur progres → nilai pertama terkunci & latihan → layar penuh/pindah tab/screenshot/salin-tempel sampai pelanggaran ke-3 → koneksi putus saat ujian → tampilan HP kecil/besar/tablet/komputer (Android & iPhone) → dashboard (filter, cari, grafik, unduh) → beban pengguna bersamaan → mode tamu tidak menyimpan data. Semua butir kecuali pengujian di perangkat fisik dan beban nyata sudah diuji otomatis; **lakukan uji di perangkat sekolah sebelum produksi**.
