// ============================================================
//  export.js — unduh Excel (.xlsx), PDF, dan CSV tanpa pustaka luar
// ============================================================
(function () {
  const enc = new TextEncoder();
  const crcT = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc = (b) => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const u16 = (n) => [n & 255, (n >> 8) & 255], u32 = (n) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];
  function zip(files) {                                    // ZIP tanpa kompresi (method 0)
    const parts = [], cen = []; let off = 0;
    files.forEach(f => {
      const nm = enc.encode(f.name), d = enc.encode(f.data), c = crc(d);
      const h = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(c), u32(d.length), u32(d.length), u16(nm.length), u16(0));
      parts.push(new Uint8Array(h), nm, d);
      cen.push({ nm, c, len: d.length, off }); off += h.length + nm.length + d.length;
    });
    let cs = 0; const cparts = [];
    cen.forEach(e => { const h = new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(e.c), u32(e.len), u32(e.len), u16(e.nm.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(e.off))); cparts.push(h, e.nm); cs += h.length + e.nm.length; });
    const end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(cen.length), u16(cen.length), u32(cs), u32(off), u16(0)));
    return new Blob(parts.concat(cparts, [end]), { type: 'application/zip' });
  }
  const x = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const colL = (i) => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
  function xlsx(name, cols, rows) {
    const all = [cols.map(c => c.label)].concat(rows.map(r => cols.map(c => c.x ? c.x(r) : r[c.k])));
    const sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>' + cols.map((c, i) => '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (c.w || 18) + '" customWidth="1"/>').join('') + '</cols><sheetData>' +
      all.map((r, ri) => '<row r="' + (ri + 1) + '">' + r.map((v, ci) => { const ref = colL(ci) + (ri + 1); return (typeof v === 'number' && isFinite(v)) ? '<c r="' + ref + '"' + (ri === 0 ? '' : '') + '><v>' + v + '</v></c>' : '<c r="' + ref + '" t="inlineStr"' + (ri === 0 ? ' s="1"' : '') + '><is><t xml:space="preserve">' + x(v) + '</t></is></c>'; }).join('') + '</row>').join('') + '</sheetData></worksheet>';
    const styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2A44"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf xfId="0"/><xf xfId="0" fontId="1" fillId="2" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    const nm = x(String(name).slice(0, 28).replace(/[\\\/\?\*\[\]:]/g, ' '));
    return zip([
      { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + nm + '" sheetId="1" r:id="rId1"/></sheets></workbook>' },
      { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', data: styles }, { name: 'xl/worksheets/sheet1.xml', data: sheet }
    ]);
  }
  // ---------- PDF sederhana (A4 lanskap, Helvetica) ----------
  const WIN = { '–': '-', '—': '-', '’': "'", '‘': "'", '“': '"', '”': '"', '…': '...', '•': '-', '√': 'akar', 'π': 'pi', '≈': '~' };
  const pdfTxt = (s) => String(s == null ? '' : s).replace(/[–—’‘“”…•√π≈]/g, c => WIN[c]).replace(/[^\x20-\x7E\xA0-\xFF]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  function pdf(title, sub, cols, rows) {
    const PW = 842, PH = 595, M = 30, RH = 17, tot = cols.reduce((a, c) => a + (c.w || 18), 0), scale = (PW - 2 * M) / tot;
    const widths = cols.map(c => (c.w || 18) * scale), per = Math.floor((PH - M - 78 - 20) / RH);
    const pages = []; for (let i = 0; i < Math.max(1, rows.length); i += per) pages.push(rows.slice(i, i + per));
    const objs = [], add = (s) => objs.push(s) && objs.length;
    add('<< /Type /Catalog /Pages 2 0 R >>'); add(''); add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'); add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const kids = [];
    const cut = (s, w, fs) => { s = pdfTxt(s); const max = Math.floor(w / (fs * 0.5)); return s.length > max ? s.slice(0, Math.max(1, max - 2)) + '..' : s; };
    pages.forEach((pr, pi) => {
      let c = 'BT /F2 15 Tf 1 0 0 1 ' + M + ' ' + (PH - 36) + ' Tm (' + pdfTxt(title) + ') Tj ET\nBT /F1 9 Tf 0.4 0.45 0.55 rg 1 0 0 1 ' + M + ' ' + (PH - 51) + ' Tm (' + pdfTxt(sub) + ') Tj ET\n';
      let y = PH - 78; c += '0.12 0.16 0.27 rg ' + M + ' ' + (y - 5) + ' ' + (PW - 2 * M) + ' ' + RH + ' re f\n'; let xx = M;
      cols.forEach((col, i) => { c += 'BT /F2 8.5 Tf 1 1 1 rg 1 0 0 1 ' + (xx + 4) + ' ' + (y - 0.5) + ' Tm (' + cut(col.label, widths[i] - 6, 8.5) + ') Tj ET\n'; xx += widths[i]; }); y -= RH;
      pr.forEach((r, ri) => { if (ri % 2) c += '0.96 0.97 0.99 rg ' + M + ' ' + (y - 5) + ' ' + (PW - 2 * M) + ' ' + RH + ' re f\n'; xx = M; cols.forEach((col, i) => { const v = col.x ? col.x(r) : r[col.k]; c += 'BT /F1 8.5 Tf 0.12 0.16 0.27 rg 1 0 0 1 ' + (xx + 4) + ' ' + (y - 0.5) + ' Tm (' + cut(v, widths[i] - 6, 8.5) + ') Tj ET\n'; xx += widths[i]; }); y -= RH; });
      c += 'BT /F1 8 Tf 0.4 0.45 0.55 rg 1 0 0 1 ' + M + ' 18 Tm (GeoQuest 3D - dicetak ' + pdfTxt(new Date().toLocaleString('id-ID')) + ') Tj 1 0 0 1 ' + (PW - M - 60) + ' 18 Tm (Hal. ' + (pi + 1) + '/' + pages.length + ') Tj ET\n';
      const cn = add('<< /Length ' + c.length + ' >>\nstream\n' + c + 'endstream'), pn = add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + cn + ' 0 R >>'); kids.push(pn + ' 0 R');
    });
    objs[1] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + kids.length + ' >>';
    let out = '%PDF-1.4\n', offs = []; objs.forEach((o, i) => { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    const xr = out.length; out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') + 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF';
    const b = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) b[i] = out.charCodeAt(i) & 255;
    return new Blob([b], { type: 'application/pdf' });
  }
  function csv(cols, rows) { const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; return new Blob(['\ufeff' + [cols.map(c => q(c.label)).join(',')].concat(rows.map(r => cols.map(c => q(c.x ? c.x(r) : r[c.k])).join(','))).join('\r\n')], { type: 'text/csv;charset=utf-8' }); }
  function save(blob, filename) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  const stamp = () => new Date().toISOString().slice(0, 10);
  window.Export = {
    xlsx: (name, cols, rows) => save(xlsx(name, cols, rows), name.replace(/\s+/g, '_') + '_' + stamp() + '.xlsx'),
    pdf: (name, sub, cols, rows) => save(pdf(name, sub, cols, rows), name.replace(/\s+/g, '_') + '_' + stamp() + '.pdf'),
    csv: (name, cols, rows) => save(csv(cols, rows), name.replace(/\s+/g, '_') + '_' + stamp() + '.csv'),
    _xlsxBlob: xlsx, _pdfBlob: pdf
  };
})();
