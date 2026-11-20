// ============================================================
//  data-pengerjaan.js — "Pengerjaan": baris-baris hitungan yang MUNCUL satu per satu di layar
//  saat narasi dibacakan (bukan hanya didengar). Penanda: {atas|bawah} = pecahan, ~~x~~ = dicoret,
//  "teks // catatan" = catatan kecil di samping baris.
// ============================================================
(function () {
  const W = {
    kubus: {
      lp: [
        ['Luas permukaan = jumlah luas semua sisi', 'Kubus punya 6 sisi // enam bidang persegi'],
        ['Buka kubus → jaring-jaring', 'Luas permukaan = luas jaring-jaring // tidak ada bagian yang hilang atau menumpuk'],
        ['Sisi alas = persegi dengan sisi s', 'L = sisi × sisi', 'L = s × s', 'L = s² // luas SATU sisi'],
        ['Alas = Atas = Kiri = Kanan = Depan = Belakang', 'Masing-masing luasnya s² // keenam persegi kongruen'],
        ['LP = s² + s² + s² + s² + s² + s²', 'LP = 6 × s² // penjumlahan berulang → perkalian'],
        ['LP = 6 × s²', 'Contoh s = 5 cm:', 'LP = 6 × 5²', 'LP = 6 × 25', 'LP = 150 cm²'],
        ['Kubus tanpa tutup → hanya 5 sisi', 'LP = 5 × s²', 'Contoh s = 10 cm: LP = 5 × 100 = 500 cm²']
      ],
      vol: [
        ['1 kubus satuan = 1 × 1 × 1 = 1 satuan³'],
        ['s = 3 → 1 baris berisi 3 kubus', '1 baris = s kubus'],
        ['1 lapis = kubus per baris × banyak baris', '= 3 × 3', '= 9 kubus // s × s'],
        ['Tinggi kubus = rusuknya = s = 3', 'banyak lapis = 3'],
        ['V = kubus per lapis × banyak lapis', 'V = 9 × 3', 'V = 27 satuan³'],
        ['V = (s × s) × s', 'V = s × s × s', 'V = s³', 'Cek: 3³ = 27 ✓']
      ]
    },
    balok: {
      lp: [
        ['Balok: panjang p, lebar l, tinggi t', 'Enam sisi persegi panjang // 3 pasang kongruen'],
        ['LP = jumlah luas 6 persegi panjang'],
        ['Alas: p × l', 'Atas: p × l // kongruen dengan alas', 'Alas + Atas = 2 × (p × l) = 2pl'],
        ['Depan: p × t', 'Belakang: p × t', 'Depan + Belakang = 2pt'],
        ['Kiri: l × t', 'Kanan: l × t', 'Kiri + Kanan = 2lt'],
        ['LP = 2pl + 2pt + 2lt', 'LP = 2(pl + pt + lt) // faktor 2 dikeluarkan'],
        ['p = 6, l = 4, t = 3', 'pl = 6 × 4 = 24', 'pt = 6 × 3 = 18', 'lt = 4 × 3 = 12', 'LP = 2 × (24 + 18 + 12)', 'LP = 2 × 54', 'LP = 108 cm²'],
        ['Tanpa sisi atas:', 'LP = pl + 2pt + 2lt // tutup tidak dihitung', 'Contoh: 24 + 36 + 24 = 84 cm²']
      ],
      vol: [
        ['1 kubus satuan = 1 satuan³'],
        ['p = 4 → 1 baris = 4 kubus'],
        ['1 lapis = p × l', '= 4 × 3', '= 12 kubus // luas alas'],
        ['banyak lapis = t = 2'],
        ['V = 12 × 2', 'V = 24 satuan³'],
        ['V = (p × l) × t', 'V = p × l × t', 'V = luas alas × tinggi'],
        ['V = 100 × 40 × 50', 'V = 200.000 cm³', '1 liter = 1.000 cm³', 'V = {200.000|1.000} = 200 liter']
      ]
    },
    prisma: {
      lp: [
        ['Prisma segitiga: 2 alas segitiga', '+ 3 sisi tegak persegi panjang'],
        ['LP = 2 segitiga + 3 persegi panjang'],
        ['L segitiga = ½ × a × t segitiga', 'Alas + Atas = 2 × L alas'],
        ['3 persegi panjang berderet', 'lebar = t // tinggi prisma', 'panjang = a + b + c = keliling alas'],
        ['L selimut = panjang × lebar', 'L selimut = keliling alas × t'],
        ['LP = 2 × L alas + L selimut', 'LP = 2 × L alas + keliling alas × t'],
        ['L alas = ½ × 3 × 4 = 6', 'K alas = 3 + 4 + 5 = 12', 'LP = 2 × 6 + 12 × 10', 'LP = 12 + 120', 'LP = 132 cm²']
      ],
      vol: [
        ['V balok = p × l × t'],
        ['Balok dibelah diagonal alas', '→ 2 prisma segitiga kongruen'],
        ['V prisma = ½ × V balok', 'V prisma = ½ × p × l × t'],
        ['L alas segitiga = ½ × p × l', '→ ½ p l adalah luas alas prisma'],
        ['V prisma = (½ × p × l) × t', 'V prisma = L alas × t'],
        ['L alas = 12, t = 7', 'V = 12 × 7', 'V = 84 cm³']
      ]
    },
    limas: {
      lp: [
        ['Alas persegi bersisi a', 's = tinggi sisi tegak'],
        ['LP = L alas + 4 × L sisi tegak'],
        ['L alas = a × a', 'L alas = a²'],
        ['L sisi tegak = ½ × alas × tinggi', 'L sisi tegak = ½ × a × s'],
        ['4 × (½ × a × s)', '= (4 × ½) × a × s', '= 2 × a × s', '= 2as'],
        ['LP = a² + 2as'],
        ['s² = t² + (½ a)²', 's = √(t² + (½ a)²)', 'Contoh a = 10, t = 12:', 's = √(12² + 5²)', 's = √(144 + 25) = √169 = 13'],
        ['s = 13', 'LP = a² + 2as', 'LP = 10² + 2 × 10 × 13', 'LP = 100 + 260', 'LP = 360 cm²']
      ],
      vol: [
        ['Limas dan prisma: alas sama, tinggi sama'],
        ['1 limas penuh air → prisma terisi ⅓'],
        ['2 limas → prisma terisi ⅔'],
        ['3 limas → prisma penuh', '3 × V limas = V prisma'],
        ['25 + 16 + 9 + 4 + 1 = 55', '{55|125} = 0,44 // mendekati ⅓ bila lapisan makin tipis'],
        ['3 × V limas = L alas × t', 'V limas = ⅓ × L alas × t', 'Contoh: alas 6 × 6, t = 9', 'V = ⅓ × 36 × 9', 'V = ⅓ × 324', 'V = 108 cm³']
      ]
    },
    tabung: {
      lp: [
        ['Tabung: alas & tutup = lingkaran', 'selimut = bidang melengkung'],
        ['LP = 2 lingkaran + 1 persegi panjang'],
        ['L lingkaran = π × r × r = πr²', 'Alas + Tutup = 2 × πr² = 2πr²'],
        ['lebar = t', 'panjang = keliling alas = 2πr', 'L selimut = panjang × lebar'],
        ['Selimut digulung → tepi panjang melingkari alas', 'panjang = keliling alas = 2πr ✓'],
        ['L selimut = 2πr × t', 'L selimut = 2πrt'],
        ['LP = 2πr² + 2πrt'],
        ['LP = 2πr² + 2πrt', 'LP = 2πr (r + t) // faktor 2πr dikeluarkan', 'Contoh r = 7, t = 20:', 'LP = 2 × 22/7 × 7 × (7 + 20)', 'LP = 44 × 27', 'LP = 1.188 cm²']
      ],
      vol: [
        ['L alas = π × r × r = πr²'],
        ['2 lapis = 2 × πr² × tebal lapis'],
        ['tumpukan setinggi t', 'V = luas alas × tinggi'],
        ['V prisma = L alas × t', 'Tabung ≈ prisma beralas segi banyak', 'V tabung = L alas × t'],
        ['V = πr² × t', 'V = πr²t'],
        ['r = 7, t = 10', 'V = 22/7 × 7 × 7 × 10', 'V = 22 × 7 × 10', 'V = 1.540 cm³']
      ]
    },
    kerucut: {
      lp: [
        ['Kerucut: jari-jari r, tinggi t', 'Garis pelukis = s'],
        ['Luas permukaan = luas jaring-jaring'],
        ['Jaring-jaring: 1 lingkaran + 1 juring', 'LP = L lingkaran alas + L juring selimut'],
        ['L alas = π × r × r', 'L alas = πr²'],
        ['Juring = potongan lingkaran', 'Dibatasi 2 jari-jari + 1 busur', 'Jari-jari juring = s // bagian dari lingkaran besar berjari-jari s'],
        ['Pusat juring → puncak kerucut', 'Titik di busur → titik di tepi alas', 'Semua titik busur berjarak sama dari pusat', '→ jari-jari juring = s = garis pelukis'],
        ['Busur menempel pada tepi alas', 'Busur melingkari alas 1 putaran penuh', '→ panjang busur = panjang tepi alas'],
        ['Tepi alas = keliling lingkaran alas', 'Keliling = 2 × π × r = 2πr', 'Panjang busur = keliling alas', 'Panjang busur = 2πr'],
        ['Lingkaran penuh jari-jari s → keliling = 2πs', 'Busur juring = 2πr', 'Bagian juring = {busur|keliling penuh}', 'Bagian juring = 2πr / 2πs'],
        ['Bagian juring = 2πr / 2πs', 'Coret yang sama: {~~2π~~r|~~2π~~s}', 'Bagian juring = r / s', 'Contoh r = 7, s = 25: 7/25 = 28% // sekitar 28% lingkaran penuh'],
        ['Lingkaran penuh berjari-jari s', 'L = π × s × s', 'L = πs²'],
        ['L juring = bagian × L lingkaran penuh', 'L juring = r / s × πs²', 'L juring = r / s × π × s × s', 'L juring = {r × π × ~~s~~ × s|~~s~~} // satu s di atas & satu s di bawah saling menghapus', 'L juring = π × r × s = πrs'],
        ['Juring diiris tipis → disusun jadi segitiga', 'alas ≈ busur = 2πr', 'tinggi ≈ jari-jari = s', 'L = ½ × alas × tinggi', 'L = ½ × 2πr × s', 'L = (½ × 2) × π × r × s', 'L = 1 × πrs = πrs // sama dengan cara pertama ✓'],
        ['LP = L alas + L selimut', 'LP = πr² + πrs', 'LP = πr (r + s) // faktor πr dikeluarkan'],
        ['s² = r² + t²', 's = √(r² + t²)', 'Contoh r = 7, t = 24:', 's = √(7² + 24²)', 's = √(49 + 576) = √625 = 25'],
        ['r = 7, t = 24, s = 25', 'L alas = π × 7 × 7 = 22/7 × 49 = 154', 'L selimut = π × r × s = 22/7 × 7 × 25 = 550', 'LP = 154 + 550', 'LP = 704 cm²']
      ],
      vol: [
        ['Kerucut & tabung: r sama, t sama'],
        ['1 kerucut → tabung terisi ⅓'],
        ['2 kerucut → tabung terisi ⅔'],
        ['3 kerucut → tabung penuh', '3 × V kerucut = V tabung'],
        ['V kerucut = ⅓ × V tabung', 'V kerucut = ⅓ × πr²t // sepertiga, BUKAN dua pertiga'],
        ['r = 7, t = 24', 'V = ⅓ × 22/7 × 7 × 7 × 24', 'V = ⅓ × 154 × 24', 'V = 154 × 8', 'V = 1.232 cm³']
      ]
    },
    bola: {
      lp: [
        ['Bola: semua titik berjarak r dari pusat', 'Tidak punya jaring-jaring datar yang sempurna'],
        ['Tabung pembungkus: jari-jari r', 'tinggi = 2r // sama dengan diameter bola'],
        ['L selimut tabung = keliling alas × tinggi', '= 2πr × 2r', '= 4πr²'],
        ['LP bola = L selimut tabung pembungkus', 'LP bola = 4πr²'],
        ['Kulit jeruk ≈ 4 lingkaran berjari-jari r', 'L 1 lingkaran = πr²'],
        ['LP = 4 × πr²', 'LP = 4πr²', 'Contoh r = 21:', 'LP = 4 × 22/7 × 21 × 21', 'LP = 4 × 22 × 63', 'LP = 5.544 cm²']
      ],
      vol: [
        ['Tabung: r dan t = 2r', 'Kerucut: r dan t = 2r', 'Bola: r'],
        ['V tabung = πr² × t', 'V tabung = πr² × 2r', 'V tabung = 2πr³'],
        ['V kerucut = ⅓ × V tabung // sepertiga milik KERUCUT', '3 kerucut = 1 tabung'],
        ['V kerucut = ⅓ × 2πr³', 'V kerucut = ⅔πr³', '⅔ di sini = hasil ⅓ × 2 // BUKAN faktor kerucut', 'Faktor kerucut tetap ⅓ ✓'],
        ['Isi 1 bola → tabung terisi ⅔', 'V bola = ⅔ × V tabung // ⅔ milik BOLA'],
        ['2 kerucut → tabung terisi ⅔ (sama dengan 1 bola)', 'V bola = 2 × V kerucut'],
        ['Kerucut = ⅓ tabung', 'Bola = ⅔ tabung', '⅓ + ⅓ = ⅔ → 2 kerucut = 1 bola'],
        ['V bola = ⅔ × V tabung', 'V bola = ⅔ × 2πr³', 'V bola = ⁴⁄₃πr³', 'Cek: 2 × ⅔πr³ = ⁴⁄₃πr³ ✓'],
        ['Pada tinggi h: irisan belahan bola = π(r² − h²)', 'Pada tinggi h: cincin = πr² − πh² = π(r² − h²)', 'Luas irisan sama → volume sama', '½ bola = πr² × r − ⅓ × πr² × r', '½ bola = πr³ − ⅓πr³ = ⅔πr³', 'bola = 2 × ⅔πr³ = ⁴⁄₃πr³'],
        ['r = 21', 'V = ⁴⁄₃ × 22/7 × 21³', 'V = ⁴⁄₃ × 22/7 × 9.261', 'V = 38.808 cm³'],
        ['Kerucut: V = ⅓πr²t', 'Bola: V = ⁴⁄₃πr³', '⅔ = perbandingan bola : tabung pembungkus']
      ]
    }
  };
  Object.keys(W).forEach(k => ['lp', 'vol'].forEach(sec => { const steps = (window.TURUNAN[k] || {})[sec] || []; W[k][sec].forEach((lines, i) => { if (steps[i]) steps[i].k = lines; }); }));
})();
