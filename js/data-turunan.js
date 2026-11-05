// ============================================================
//  data-turunan.js — penemuan rumus langkah demi langkah (Luas Permukaan & Volume), 7 bangun ruang.
//  Tiap langkah: judul, narasi (juga dibacakan suara), rumus yang tampil, dan visual animasi.
// ============================================================
(function () {
  const S = (t, d, f, v, c) => ({ t, d, f, v, c });
  const F = (fold, hi) => ({ s: '3d', fold, hi: hi || null });
  const BL = (D, show, mask) => ({ s: 'blk', D, show, mask: mask || 0 });
  const PO = (c, f, n) => ({ s: 'pour', c, f, n });
  window.TURUNAN = {
    kubus: {
      lp: [
        S('Kenali kubus dan tujuan kita', 'Perhatikan sebuah kubus dengan panjang rusuk s. Luas permukaan adalah jumlah luas seluruh bidang yang membungkus kubus, mirip kertas kado yang menutupi semua bagian luar sebuah kotak. Tujuan kita: menemukan rumusnya sendiri, bukan menghafal.', 'Luas permukaan = jumlah luas semua sisi', F(1), 'Kubus dengan rusuk s'),
        S('Buka kubus menjadi jaring-jaring', 'Sekarang kubus kita buka dan kita rebahkan menjadi jaring-jaring. Karena tidak ada bagian yang menumpuk atau hilang, luas jaring-jaring sama persis dengan luas permukaan kubus. Dengan begitu kita cukup menghitung luas bidang-bidang yang datar.', 'Luas permukaan = luas jaring-jaring', F(0), 'Jaring-jaring kubus: 6 bidang datar'),
        S('Hitung luas satu sisi', 'Perhatikan satu sisi saja, misalnya sisi alas. Bentuknya persegi dengan panjang sisi s. Luas persegi adalah sisi kali sisi, jadi luas satu sisi kubus adalah s kali s, yaitu s kuadrat.', 'L satu sisi = s × s = s²', F(0, ['Alas']), 'Sisi alas: persegi s × s'),
        S('Semua sisi kongruen', 'Kubus memiliki enam sisi, dan semuanya persegi yang kongruen, artinya ukurannya sama persis. Karena itu, alas, atas, kiri, kanan, depan, dan belakang masing-masing berluas s kuadrat.', 'Alas = Atas = Kiri = Kanan = Depan = Belakang = s²', F(0, 'all'), 'Enam persegi yang sama besar'),
        S('Jumlahkan keenam sisi', 'Sekarang jumlahkan luas keenam sisi. Kita menjumlahkan s kuadrat sebanyak enam kali. Penjumlahan berulang dengan bilangan yang sama dapat kita singkat menjadi perkalian.', 'LP = s² + s² + s² + s² + s² + s²', F(0, 'all'), '6 sisi × s²'),
        S('Rumus luas permukaan kubus', 'Enam kali s kuadrat. Itulah rumus luas permukaan kubus. Sebagai contoh, jika rusuknya lima sentimeter, maka luas permukaannya enam kali dua puluh lima, yaitu seratus lima puluh sentimeter persegi.', 'LP = 6 × s²   (s = 5 cm → 6 × 25 = 150 cm²)', F(1, 'all'), 'LP = 6s²'),
        S('Kubus tanpa tutup', 'Bagaimana jika kubus tidak bertutup, seperti kardus terbuka? Maka tutupnya tidak dihitung, sehingga hanya lima sisi yang dijumlahkan. Rumusnya menjadi lima kali s kuadrat.', 'LP tanpa tutup = 5 × s²', F(0, ['Alas', 'Kiri', 'Kanan', 'Belakang', 'Depan']), 'Hanya 5 sisi yang dihitung')
      ],
      vol: [
        S('Satuan volume', 'Volume adalah banyaknya ruang yang ditempati sebuah bangun. Kita mengukurnya dengan kubus satuan, yaitu kubus kecil berrusuk satu satuan yang volumenya satu satuan kubik. Semakin banyak kubus satuan yang muat, semakin besar volumenya.', '1 kubus satuan = 1 satuan³', BL([3, 3, 3], [1, 1, 1]), '1 kubus satuan'),
        S('Satu baris kubus satuan', 'Misalkan rusuk kubus besar adalah tiga satuan. Sepanjang satu rusuk, kita dapat menderetkan tiga kubus satuan. Jadi satu baris berisi s kubus satuan, yaitu tiga.', '1 baris = s kubus = 3', BL([3, 3, 3], [3, 1, 1]), '1 baris = 3 kubus'),
        S('Satu lapisan alas', 'Baris-baris itu kita susun berdampingan sebanyak s baris, sehingga terbentuk satu lapisan alas. Satu lapisan berisi s kali s kubus satuan, yaitu tiga kali tiga sama dengan sembilan kubus.', '1 lapis = s × s = 3 × 3 = 9 kubus', BL([3, 3, 3], [3, 3, 1]), '1 lapisan = 9 kubus'),
        S('Tumpuk lapisan setinggi rusuk', 'Lapisan alas kita tumpuk ke atas setinggi rusuk kubus. Karena tinggi kubus sama dengan s, jumlah lapisannya juga s, yaitu tiga lapisan.', 'banyak lapisan = s = 3', BL([3, 3, 3], [3, 3, 3]), '3 lapisan ditumpuk'),
        S('Hitung seluruh kubus satuan', 'Banyak seluruh kubus satuan adalah sembilan kubus per lapisan dikali tiga lapisan, yaitu dua puluh tujuh kubus. Karena setiap kubus satuan bervolume satu, volume kubus besar adalah dua puluh tujuh satuan kubik.', '9 × 3 = 27 kubus → V = 27 satuan³', BL([3, 3, 3], [3, 3, 3]), 'Total 27 kubus satuan'),
        S('Rumus volume kubus', 'Banyak kubus tiap lapisan adalah s kali s, dikalikan banyak lapisan yaitu s. Hasilnya s kali s kali s, atau s pangkat tiga. Itulah sebabnya satuan volume berpangkat tiga, misalnya sentimeter kubik.', 'V = s × s × s = s³', BL([3, 3, 3], [3, 3, 3]), 'V = s³')
      ]
    },
    balok: {
      lp: [
        S('Kenali balok', 'Sebuah balok memiliki panjang p, lebar l, dan tinggi t. Berbeda dengan kubus, sisi-sisinya belum tentu persegi, melainkan persegi panjang. Kita akan menemukan luas permukaannya dengan cara yang sama: membuka balok menjadi jaring-jaring.', 'Balok: panjang p, lebar l, tinggi t', F(1), 'Balok p × l × t'),
        S('Buka menjadi jaring-jaring', 'Balok dibuka menjadi jaring-jaring yang terdiri atas enam persegi panjang. Luas permukaan balok sama dengan jumlah luas keenam persegi panjang tersebut.', 'LP = jumlah luas 6 persegi panjang', F(0), 'Enam persegi panjang'),
        S('Pasangan alas dan atas', 'Sisi alas berbentuk persegi panjang dengan panjang p dan lebar l, sehingga luasnya p kali l. Sisi atas berhadapan dan kongruen dengan alas, jadi luasnya juga p kali l. Kedua sisi ini bersama-sama berluas dua kali p kali l.', 'Alas + Atas = 2 × (p × l) = 2pl', F(0, ['Alas', 'Atas']), 'Alas dan atas: p × l'),
        S('Pasangan depan dan belakang', 'Sisi depan berukuran panjang p dan tinggi t, luasnya p kali t. Sisi belakang kongruen dengan sisi depan. Jadi pasangan ini berluas dua kali p kali t.', 'Depan + Belakang = 2 × (p × t) = 2pt', F(0, ['Depan', 'Belakang']), 'Depan dan belakang: p × t'),
        S('Pasangan kiri dan kanan', 'Sisi kiri berukuran lebar l dan tinggi t, luasnya l kali t. Sisi kanan kongruen dengannya. Pasangan ini berluas dua kali l kali t.', 'Kiri + Kanan = 2 × (l × t) = 2lt', F(0, ['Kiri', 'Kanan']), 'Kiri dan kanan: l × t'),
        S('Jumlahkan ketiga pasangan', 'Luas permukaan adalah jumlah dari tiga pasangan tadi: dua p l, ditambah dua p t, ditambah dua l t. Karena semuanya memuat angka dua, kita bisa mengeluarkan faktor dua di depan kurung.', 'LP = 2pl + 2pt + 2lt = 2(pl + pt + lt)', F(0, 'all'), 'LP = 2(pl + pt + lt)'),
        S('Contoh dengan angka', 'Misalkan p enam, l empat, dan t tiga sentimeter. Maka p l sama dengan dua puluh empat, p t sama dengan delapan belas, dan l t sama dengan dua belas. Jumlahnya lima puluh empat, dikali dua menjadi seratus delapan sentimeter persegi.', 'LP = 2(24 + 18 + 12) = 2 × 54 = 108 cm²', F(1, 'all'), 'p = 6, l = 4, t = 3'),
        S('Balok tanpa tutup', 'Untuk akuarium tanpa tutup, sisi atas tidak dihitung. Tersisa satu p l, dua p t, dan dua l t, sehingga rumusnya menjadi p l ditambah dua p t ditambah dua l t.', 'LP tanpa tutup = pl + 2pt + 2lt', F(0, ['Alas', 'Depan', 'Belakang', 'Kiri', 'Kanan']), 'Tanpa sisi atas')
      ],
      vol: [
        S('Kubus satuan sebagai alat ukur', 'Sama seperti pada kubus, volume balok kita ukur dengan kubus satuan. Misalkan balok berukuran panjang empat, lebar tiga, dan tinggi dua satuan. Kita akan menghitung berapa kubus satuan yang memenuhi balok itu.', '1 kubus satuan = 1 satuan³', BL([4, 3, 2], [1, 1, 1]), 'Kubus satuan'),
        S('Satu baris sepanjang p', 'Sepanjang rusuk panjang, kita dapat menderetkan empat kubus satuan. Banyak kubus dalam satu baris sama dengan panjang p.', '1 baris = p = 4 kubus', BL([4, 3, 2], [4, 1, 1]), '1 baris = 4 kubus'),
        S('Satu lapisan alas p × l', 'Baris-baris itu disusun berdampingan sebanyak lebar l, yaitu tiga baris. Satu lapisan berisi p kali l kubus satuan, yaitu empat kali tiga sama dengan dua belas kubus. Ini tidak lain adalah luas alas balok.', '1 lapis = p × l = 4 × 3 = 12 kubus', BL([4, 3, 2], [4, 3, 1]), '1 lapisan = 12 kubus'),
        S('Tumpuk setinggi t', 'Lapisan alas kita tumpuk sebanyak tinggi t, yaitu dua lapisan. Setiap lapisan menambah dua belas kubus satuan.', 'banyak lapisan = t = 2', BL([4, 3, 2], [4, 3, 2]), '2 lapisan'),
        S('Hitung seluruh kubus', 'Banyak seluruh kubus satuan adalah dua belas dikali dua, yaitu dua puluh empat kubus. Jadi volume balok itu dua puluh empat satuan kubik.', '12 × 2 = 24 kubus → V = 24 satuan³', BL([4, 3, 2], [4, 3, 2]), 'Total 24 kubus'),
        S('Rumus volume balok', 'Banyak kubus tiap lapisan adalah p kali l, dan banyak lapisan adalah t. Maka volume balok adalah p kali l kali t. Perhatikan bahwa p kali l adalah luas alas, sehingga volume juga dapat ditulis luas alas kali tinggi.', 'V = p × l × t = luas alas × tinggi', BL([4, 3, 2], [4, 3, 2]), 'V = p × l × t'),
        S('Satuan dan konversi', 'Jika ukuran dalam sentimeter, volume dalam sentimeter kubik. Satu liter sama dengan seribu sentimeter kubik. Akuarium berukuran seratus kali empat puluh kali lima puluh sentimeter memuat dua ratus ribu sentimeter kubik, atau dua ratus liter.', '100 × 40 × 50 = 200.000 cm³ = 200 liter', BL([4, 3, 2], [4, 3, 2]), '1 liter = 1.000 cm³')
      ]
    },
    prisma: {
      lp: [
        S('Kenali prisma segitiga', 'Prisma segitiga memiliki dua alas berbentuk segitiga yang sejajar dan kongruen, serta tiga sisi tegak berbentuk persegi panjang. Jarak antara kedua alas disebut tinggi prisma, kita tulis t.', 'Prisma: alas segitiga, tinggi prisma t', F(1), 'Prisma segitiga'),
        S('Buka menjadi jaring-jaring', 'Kita buka prisma menjadi jaring-jaring: ada dua segitiga dan tiga persegi panjang. Luas permukaan prisma sama dengan jumlah luas kelima bidang ini.', 'LP = 2 segitiga + 3 persegi panjang', F(0), '5 bidang datar'),
        S('Luas dua alas', 'Alas dan atas adalah dua segitiga yang kongruen. Luas satu segitiga adalah setengah kali alas kali tinggi segitiga. Karena ada dua, luas keduanya adalah dua kali luas alas.', 'Alas + Atas = 2 × L alas', F(0, ['Alas', 'Atas']), 'Dua segitiga kongruen'),
        S('Selimut: persegi panjang berderet', 'Tiga sisi tegak berderet membentuk satu persegi panjang besar. Tinggi persegi panjang ini sama dengan tinggi prisma t, sedangkan panjangnya adalah gabungan sisi-sisi alas, yaitu keliling alas.', 'panjang selimut = keliling alas; lebar = t', F(0, ['Sisi 1', 'Sisi 2', 'Sisi 3']), 'Selimut = persegi panjang besar'),
        S('Luas selimut', 'Luas persegi panjang adalah panjang kali lebar. Maka luas selimut prisma sama dengan keliling alas dikali tinggi prisma. Ini berlaku untuk semua prisma, apa pun bentuk alasnya.', 'L selimut = K alas × t', F(1, ['Sisi 1', 'Sisi 2', 'Sisi 3']), 'K alas × t'),
        S('Jumlahkan', 'Luas permukaan adalah luas dua alas ditambah luas selimut. Jadi dua kali luas alas, ditambah keliling alas kali tinggi prisma.', 'LP = 2 × L alas + K alas × t', F(1, 'all'), 'LP = 2·L alas + K alas·t'),
        S('Contoh angka', 'Alas segitiga siku-siku dengan sisi tiga, empat, dan lima sentimeter, serta tinggi prisma sepuluh. Luas alas setengah kali tiga kali empat sama dengan enam, dan keliling alasnya dua belas. Maka luas permukaan dua kali enam ditambah dua belas kali sepuluh, yaitu seratus tiga puluh dua sentimeter persegi.', 'LP = 2 × 6 + 12 × 10 = 132 cm²', F(0, 'all'), 'Alas 3-4-5, t = 10')
      ],
      vol: [
        S('Mulai dari balok', 'Kita mulai dari sesuatu yang sudah kita kuasai: sebuah balok dengan alas persegi panjang p kali l dan tinggi t. Volumenya adalah p kali l kali t.', 'V balok = p × l × t', BL([4, 4, 3], [4, 4, 3]), 'Balok p × l × t'),
        S('Belah balok secara diagonal', 'Sekarang balok kita belah sepanjang diagonal alasnya. Hasilnya dua prisma segitiga yang kongruen, yang ditandai dengan dua warna berbeda.', 'Balok = 2 prisma segitiga yang kongruen', BL([4, 4, 3], [4, 4, 3], 1), 'Dua prisma segitiga kongruen'),
        S('Setengah volume balok', 'Karena kedua prisma sama besar, volume satu prisma adalah setengah dari volume balok.', 'V prisma = ½ × p × l × t', BL([4, 4, 3], [4, 4, 3], 1), 'V prisma = ½ V balok'),
        S('Kenali luas alas segitiga', 'Perhatikan alas prisma yang berupa segitiga siku-siku dengan sisi tegak p dan l. Luasnya adalah setengah kali p kali l. Jadi setengah p l tidak lain adalah luas alas prisma.', 'L alas = ½ × p × l', BL([4, 4, 3], [4, 4, 3], 1), 'Alas segitiga: ½ p l'),
        S('Rumus volume prisma', 'Dengan mengganti setengah p l menjadi luas alas, volume prisma adalah luas alas dikali tinggi. Hubungan ini sama dengan balok: lapisan alas ditumpuk setinggi t.', 'V prisma = L alas × t', BL([4, 4, 3], [4, 4, 3], 1), 'V = L alas × t'),
        S('Berlaku untuk semua prisma', 'Alas berbentuk segi banyak apa pun dapat dibagi menjadi segitiga-segitiga, sehingga rumus luas alas kali tinggi tetap berlaku. Contoh: luas alas dua belas sentimeter persegi dan tinggi tujuh sentimeter, maka volumenya delapan puluh empat sentimeter kubik.', 'V = 12 × 7 = 84 cm³', BL([4, 4, 3], [4, 4, 3], 1), 'Luas alas × tinggi')
      ]
    },
    limas: {
      lp: [
        S('Kenali limas segiempat', 'Limas segiempat beraturan memiliki alas persegi dengan sisi a, dan empat sisi tegak berbentuk segitiga sama kaki yang bertemu di satu titik puncak. Garis dari puncak yang tegak lurus ke tengah sisi alas disebut tinggi sisi tegak, kita tulis s.', 'Alas persegi a; tinggi sisi tegak s', F(1), 'Limas segiempat'),
        S('Buka menjadi jaring-jaring', 'Kita buka limas menjadi jaring-jaring: satu persegi di tengah dan empat segitiga di sekelilingnya. Luas permukaan limas adalah jumlah luas kelima bidang itu.', 'LP = L alas + 4 × L sisi tegak', F(0), '1 persegi + 4 segitiga'),
        S('Luas alas', 'Alas berbentuk persegi dengan sisi a, sehingga luasnya a kali a, yaitu a kuadrat.', 'L alas = a × a = a²', F(0, ['Alas']), 'Alas: a²'),
        S('Luas satu sisi tegak', 'Satu sisi tegak adalah segitiga dengan alas a, yaitu sisi persegi, dan tinggi s. Luas segitiga adalah setengah kali alas kali tinggi, jadi setengah kali a kali s.', 'L sisi tegak = ½ × a × s', F(0, ['Sisi tegak']), 'Segitiga: ½ a s'),
        S('Empat sisi tegak', 'Keempat sisi tegak kongruen, sehingga luas totalnya empat kali setengah a s. Empat dikali setengah sama dengan dua, jadi luas semua sisi tegak adalah dua a s.', '4 × ½ a s = 2as', F(0, ['Sisi tegak']), '4 segitiga sama besar'),
        S('Jumlahkan', 'Luas permukaan limas adalah luas alas ditambah luas seluruh sisi tegak: a kuadrat ditambah dua a s.', 'LP = a² + 2as', F(1, 'all'), 'LP = a² + 2as'),
        S('Mencari tinggi sisi tegak', 'Jika yang diketahui adalah tinggi limas t, kita cari s dengan teorema Pythagoras. Segitiga siku-siku dibentuk oleh tinggi limas, setengah sisi alas, dan tinggi sisi tegak. Jadi s adalah akar dari t kuadrat ditambah setengah a kuadrat.', 's = √(t² + (½a)²)', { s: 'anat', sel: 'ts' }, 'Segitiga siku-siku T–O–M'),
        S('Contoh angka', 'Limas beralas persegi sisi sepuluh sentimeter dengan tinggi dua belas. Maka s sama dengan akar dari dua belas kuadrat ditambah lima kuadrat, yaitu akar seratus enam puluh sembilan, sama dengan tiga belas. Luas permukaan seratus ditambah dua kali sepuluh kali tiga belas, yaitu tiga ratus enam puluh sentimeter persegi.', 's = 13 → LP = 100 + 2 × 10 × 13 = 360 cm²', F(0, 'all'), 'a = 10, t = 12')
      ],
      vol: [
        S('Bandingkan limas dan prisma', 'Perhatikan sebuah limas yang berada tepat di dalam sebuah prisma dengan alas dan tinggi yang sama. Pertanyaannya: berapa bagian dari prisma yang diisi oleh limas?', 'Limas dan prisma: alas sama, tinggi sama', PO('box', 'pyr', 0), 'Limas dalam prisma'),
        S('Tuang air limas, kali pertama', 'Kita isi limas penuh dengan air, lalu menuangkannya ke dalam prisma. Setelah satu kali tuang, air hanya menempati sepertiga bagian dari prisma.', 'tuang 1× → ⅓ prisma', PO('box', 'pyr', 1), 'Tuang ke-1: ⅓ penuh'),
        S('Tuang kali kedua', 'Kita ulangi: limas diisi penuh lalu dituang lagi. Setelah dua kali tuang, air mencapai dua pertiga tinggi prisma.', 'tuang 2× → ⅔ prisma', PO('box', 'pyr', 2), 'Tuang ke-2: ⅔ penuh'),
        S('Tuang kali ketiga: prisma penuh', 'Pada tuangan ketiga prisma tepat penuh. Artinya tiga limas sama dengan satu prisma yang beralas dan setinggi sama.', 'tuang 3× → prisma penuh: 3 × V limas = V prisma', PO('box', 'pyr', 3), '3 limas = 1 prisma'),
        S('Gambaran lapisan', 'Ada cara lain melihatnya. Bayangkan limas tersusun dari lapisan-lapisan persegi yang makin kecil. Jumlah kubus tiap lapisan adalah lima kuadrat, empat kuadrat, tiga kuadrat, dua kuadrat, dan satu kuadrat. Semakin tipis lapisannya, perbandingan terhadap kubus pembungkus semakin mendekati sepertiga.', '25 + 16 + 9 + 4 + 1 = 55 dari 125 → mendekati ⅓', { s: 'stair', n: 5, L: 5 }, 'Lapisan persegi mengecil'),
        S('Rumus volume limas', 'Karena volume prisma adalah luas alas kali tinggi, volume limas adalah sepertiganya. Contoh: alas persegi sisi enam dan tinggi sembilan memberi sepertiga kali tiga puluh enam kali sembilan, yaitu seratus delapan sentimeter kubik.', 'V limas = ⅓ × L alas × t   (⅓ × 36 × 9 = 108 cm³)', PO('box', 'pyr', 3), 'V = ⅓ · L alas · t')
      ]
    },
    tabung: {
      lp: [
        S('Kenali tabung', 'Tabung memiliki dua lingkaran yang sejajar dan kongruen sebagai alas dan tutup, ditambah selimut yang melengkung. Jari-jari lingkaran kita tulis r dan tinggi tabung t.', 'Tabung: jari-jari r, tinggi t', F(1), 'Tabung r dan t'),
        S('Buka menjadi jaring-jaring', 'Selimut tabung kita iris tegak lurus lalu dibentangkan. Hasilnya adalah sebuah persegi panjang, dan dua lingkaran di atas dan di bawahnya.', 'LP = 2 lingkaran + 1 persegi panjang', F(0), '2 lingkaran + 1 persegi panjang'),
        S('Luas alas dan tutup', 'Luas lingkaran adalah pi kali jari-jari kuadrat. Karena ada dua lingkaran, yaitu alas dan tutup, luas keduanya adalah dua pi r kuadrat.', 'Alas + Tutup = 2 × πr²', F(0, ['Alas', 'Tutup']), 'Dua lingkaran: 2πr²'),
        S('Selimut menjadi persegi panjang', 'Selimut yang dibentangkan berbentuk persegi panjang. Lebarnya sama dengan tinggi tabung, t. Panjangnya sama dengan keliling lingkaran alas, karena selimut dahulu melingkar tepat mengelilingi alas.', 'panjang = keliling alas = 2πr; lebar = t', F(0, ['Selimut']), 'Selimut: 2πr × t'),
        S('Gulung kembali', 'Perhatikan saat selimut digulung kembali: tepi panjang persegi panjang bertemu tepat mengelilingi lingkaran. Inilah alasan mengapa panjang selimut sama dengan keliling alas.', 'tepi panjang = keliling lingkaran', F(1, ['Selimut']), 'Selimut digulung'),
        S('Luas selimut', 'Luas persegi panjang adalah panjang kali lebar. Jadi luas selimut tabung sama dengan dua pi r dikali t.', 'L selimut = 2πr × t = 2πrt', F(0, ['Selimut']), 'L selimut = 2πrt'),
        S('Jumlahkan semuanya', 'Luas permukaan adalah luas alas dan tutup ditambah luas selimut: dua pi r kuadrat ditambah dua pi r t.', 'LP = 2πr² + 2πrt', F(0, 'all'), 'LP = 2πr² + 2πrt'),
        S('Faktorkan dan beri contoh', 'Kedua suku memuat dua pi r, sehingga dapat difaktorkan menjadi dua pi r kali r ditambah t. Contoh: jari-jari tujuh dan tinggi dua puluh memberi dua kali dua puluh dua per tujuh kali tujuh kali dua puluh tujuh, yaitu seribu seratus delapan puluh delapan sentimeter persegi. Jika tanpa tutup, rumusnya pi r kuadrat ditambah dua pi r t.', 'LP = 2πr(r + t) = 1.188 cm²   (r = 7, t = 20)', F(1, 'all'), 'Tanpa tutup: πr² + 2πrt')
      ],
      vol: [
        S('Mulai dari satu lapisan', 'Kita mulai dari lapisan tipis berbentuk lingkaran berjari-jari r. Luas lapisan ini adalah pi r kuadrat, sama dengan luas alas tabung.', 'L alas = πr²', { s: 'disc', n: 1 }, '1 lapisan tipis'),
        S('Tumpuk dua lapisan', 'Jika dua lapisan ditumpuk, volumenya menjadi dua kali volume satu lapisan. Semakin banyak lapisan, semakin besar volumenya.', 'volume ∝ banyak lapisan', { s: 'disc', n: 3 }, 'Lapisan ditumpuk'),
        S('Tumpuk hingga setinggi t', 'Kita terus menumpuk lapisan-lapisan tipis sampai mencapai tinggi t. Susunan lapisan ini membentuk tabung yang utuh.', 'tinggi tumpukan = t', { s: 'disc', n: 12, done: 1 }, 'Tabung tersusun dari lapisan'),
        S('Gagasan: seperti prisma', 'Prisma bervolume luas alas kali tinggi. Tabung dapat dipandang sebagai prisma yang alasnya segi banyak sangat banyak sehingga mendekati lingkaran. Karena itu rumus yang sama berlaku: luas alas dikali tinggi.', 'V = luas alas × tinggi', { s: 'anat', sel: 't' }, 'Mirip prisma'),
        S('Rumus volume tabung', 'Luas alas adalah pi r kuadrat dan tingginya t, maka volume tabung adalah pi r kuadrat kali t.', 'V = πr² × t = πr²t', { s: 'disc', n: 12, done: 1 }, 'V = πr²t'),
        S('Contoh angka', 'Kaleng berjari-jari tujuh sentimeter dan tinggi sepuluh sentimeter. Volumenya dua puluh dua per tujuh kali tujuh kali tujuh kali sepuluh, yaitu seribu lima ratus empat puluh sentimeter kubik.', 'V = 22/7 × 7 × 7 × 10 = 1.540 cm³', { s: 'disc', n: 12, done: 1 }, 'r = 7, t = 10')
      ]
    },
    kerucut: {
      lp: [
        S('Kenali kerucut', 'Kerucut memiliki alas berbentuk lingkaran berjari-jari r, tinggi t, dan satu titik puncak. Garis dari puncak ke tepi alas disebut garis pelukis, kita tulis s.', 'Kerucut: r, t, dan garis pelukis s', F(1), 'Kerucut'),
        S('Buka menjadi jaring-jaring', 'Kerucut kita buka menjadi jaring-jaring: sebuah lingkaran sebagai alas dan sebuah juring lingkaran sebagai selimut.', 'LP = lingkaran alas + juring selimut', F(0), 'Lingkaran + juring'),
        S('Luas alas', 'Alasnya lingkaran berjari-jari r sehingga luasnya pi r kuadrat.', 'L alas = πr²', F(0, ['Alas']), 'Alas: πr²'),
        S('Selimut adalah juring', 'Selimut berbentuk juring dengan jari-jari sama dengan garis pelukis s. Panjang busur juring ini sama dengan keliling alas, yaitu dua pi r, karena busur itu melingkari alas ketika kerucut ditutup.', 'jari-jari juring = s; panjang busur = 2πr', F(0, ['Selimut']), 'Juring: jari-jari s, busur 2πr'),
        S('Luas juring', 'Lingkaran penuh berjari-jari s memiliki keliling dua pi s dan luas pi s kuadrat. Juring kita hanya sebagian dari lingkaran itu, dengan panjang busur dua pi r. Bagiannya adalah dua pi r per dua pi s, yaitu r per s. Jadi luas juring sama dengan r per s kali pi s kuadrat, yaitu pi r s.', 'L selimut = (2πr / 2πs) × πs² = πrs', F(0, ['Selimut']), 'Bagian dari lingkaran besar'),
        S('Jumlahkan', 'Luas permukaan adalah luas alas ditambah luas selimut: pi r kuadrat ditambah pi r s. Karena keduanya memuat pi r, dapat ditulis pi r kali r ditambah s.', 'LP = πr² + πrs = πr(r + s)', F(1, 'all'), 'LP = πr(r + s)'),
        S('Mencari garis pelukis', 'Jika s belum diketahui, gunakan Pythagoras. Tinggi t, jari-jari r, dan garis pelukis s membentuk segitiga siku-siku dengan s sebagai sisi miring. Jadi s kuadrat sama dengan r kuadrat ditambah t kuadrat.', 's² = r² + t²', { s: 'anat', sel: 'gp' }, 'Segitiga siku-siku'),
        S('Contoh angka', 'Jari-jari tujuh dan tinggi dua puluh empat sentimeter. Maka s sama dengan akar dari tujuh kuadrat ditambah dua puluh empat kuadrat, yaitu dua puluh lima. Luas permukaan dua puluh dua per tujuh kali tujuh kali tiga puluh dua, yaitu tujuh ratus empat sentimeter persegi.', 's = 25 → LP = 22/7 × 7 × (7 + 25) = 704 cm²', F(0, 'all'), 'r = 7, t = 24')
      ],
      vol: [
        S('Bandingkan kerucut dan tabung', 'Kita bandingkan sebuah kerucut dan sebuah tabung yang berjari-jari dan setinggi sama. Berapa bagian tabung yang dapat diisi oleh kerucut?', 'Kerucut dan tabung: r sama, t sama', PO('cyl', 'cone', 0), 'Kerucut dan tabung'),
        S('Tuang kali pertama', 'Kita isi kerucut penuh dengan air, lalu menuangkannya ke tabung. Air hanya menempati sepertiga tinggi tabung.', 'tuang 1× → ⅓ tabung', PO('cyl', 'cone', 1), 'Tuang ke-1: ⅓'),
        S('Tuang kali kedua', 'Satu kali lagi kita isi dan tuang. Sekarang air mencapai dua pertiga tinggi tabung.', 'tuang 2× → ⅔ tabung', PO('cyl', 'cone', 2), 'Tuang ke-2: ⅔'),
        S('Tuang kali ketiga', 'Pada tuangan ketiga tabung tepat penuh. Berarti tiga kerucut sama dengan satu tabung.', 'tuang 3× → penuh: 3 × V kerucut = V tabung', PO('cyl', 'cone', 3), '3 kerucut = 1 tabung'),
        S('Kesimpulan', 'Volume kerucut adalah sepertiga dari volume tabung yang berjari-jari dan setinggi sama. Karena volume tabung pi r kuadrat t, volume kerucut adalah sepertiga pi r kuadrat t.', 'V kerucut = ⅓ × πr²t', PO('cyl', 'cone', 3), 'V = ⅓πr²t'),
        S('Contoh angka', 'Kerucut berjari-jari tujuh dan tinggi dua puluh empat sentimeter. Volumenya sepertiga kali dua puluh dua per tujuh kali empat puluh sembilan kali dua puluh empat, yaitu seribu dua ratus tiga puluh dua sentimeter kubik.', 'V = ⅓ × 22/7 × 49 × 24 = 1.232 cm³', PO('cyl', 'cone', 3), 'r = 7, t = 24')
      ]
    },
    bola: {
      lp: [
        S('Kenali bola', 'Bola adalah kumpulan semua titik yang berjarak sama, yaitu r, dari titik pusat. Berbeda dengan bangun lain, permukaan bola melengkung di semua bagian sehingga tidak bisa dibuka menjadi jaring-jaring datar yang sempurna.', 'Bola: jari-jari r', { s: 'anat', sel: 'r' }, 'Bola dengan jari-jari r'),
        S('Bola di dalam tabung', 'Archimedes membayangkan bola yang tepat muat di dalam sebuah tabung. Jari-jari tabung sama dengan r, dan tingginya sama dengan diameter bola, yaitu dua r.', 'tabung pembungkus: jari-jari r, tinggi 2r', { s: 'sph', m: 'box' }, 'Bola dalam tabung'),
        S('Luas selimut tabung pembungkus', 'Luas selimut tabung adalah keliling alas dikali tinggi. Keliling alasnya dua pi r dan tingginya dua r, sehingga luas selimut tabung pembungkus adalah empat pi r kuadrat.', 'L selimut = 2πr × 2r = 4πr²', { s: 'sph', m: 'box' }, '2πr × 2r'),
        S('Penemuan Archimedes', 'Archimedes membuktikan bahwa luas permukaan bola sama persis dengan luas selimut tabung pembungkusnya, tidak termasuk tutupnya.', 'LP bola = L selimut tabung pembungkus', { s: 'sph', m: 'box' }, 'Sama besar'),
        S('Cara lain: kupas jeruk', 'Cara lain yang mudah dibayangkan: kupas kulit sebuah jeruk bulat berjari-jari r, lalu tekan sampai rata. Kulit itu ternyata dapat menutupi tepat empat lingkaran berjari-jari r.', 'kulit jeruk ≈ 4 lingkaran berjari-jari r', { s: 'sph', m: 'peel' }, 'Kulit = 4 lingkaran'),
        S('Rumus luas permukaan bola', 'Luas satu lingkaran adalah pi r kuadrat, jadi empat lingkaran berluas empat pi r kuadrat. Contoh: pelampung berjari-jari dua puluh satu sentimeter berluas permukaan empat kali dua puluh dua per tujuh kali dua puluh satu kali dua puluh satu, yaitu lima ribu lima ratus empat puluh empat sentimeter persegi.', 'LP = 4πr²   (r = 21 → 5.544 cm²)', { s: 'sph', m: 'peel' }, 'LP = 4πr²')
      ],
      vol: [
        S('Tiga bangun Archimedes', 'Archimedes membandingkan tiga bangun: sebuah tabung dengan jari-jari r dan tinggi dua r, bola berjari-jari r, dan kerucut berjari-jari r dengan tinggi dua r. Ketiganya muat dalam ukuran yang sama.', 'tabung (r, 2r) · bola (r) · kerucut (r, 2r)', PO('cyl', 'sph', 0), 'Tabung, bola, kerucut'),
        S('Volume tabung dan kerucut', 'Volume tabung adalah pi r kuadrat kali dua r, yaitu dua pi r pangkat tiga. Volume kerucut sepertiganya, yaitu dua per tiga pi r pangkat tiga.', 'V tabung = 2πr³ ; V kerucut = ⅔πr³', PO('cyl', 'sph', 0), 'V tabung = 2πr³'),
        S('Tuang bola ke dalam tabung', 'Dalam percobaan pengisian, air dalam bola ketika dituang ke tabung mengisi tepat dua pertiga tinggi tabung. Artinya volume bola adalah dua pertiga dari volume tabung pembungkusnya.', 'V bola = ⅔ × V tabung', PO('cyl', 'sph', 2), 'Bola mengisi ⅔ tabung'),
        S('Hitung volume bola', 'Dua pertiga dikali dua pi r pangkat tiga sama dengan empat per tiga pi r pangkat tiga. Itulah rumus volume bola.', 'V = ⅔ × 2πr³ = ⁴⁄₃πr³', PO('cyl', 'sph', 2), 'V = ⁴⁄₃πr³'),
        S('Contoh angka', 'Pelampung berjari-jari dua puluh satu sentimeter. Volumenya empat per tiga kali dua puluh dua per tujuh kali dua puluh satu pangkat tiga, yaitu tiga puluh delapan ribu delapan ratus delapan sentimeter kubik.', 'V = ⁴⁄₃ × 22/7 × 21³ = 38.808 cm³', PO('cyl', 'sph', 2), 'r = 21')
      ]
    }
  };
})();
