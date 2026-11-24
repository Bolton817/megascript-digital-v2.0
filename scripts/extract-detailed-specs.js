const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
  const buffer = fs.readFileSync('MegaScript_Digital_TDD.pdf');
  const parser = new PDFParse({ data: buffer });
  await parser.load();
  const res = await parser.getText();

  const targetSheets = [
    'SHEET 020', 'SHEET 021', 'SHEET 022', 'SHEET 023', 'SHEET 024',
    'SHEET 025', 'SHEET 026', 'SHEET 027', 'SHEET 028', 'SHEET 029',
    'SHEET 030', 'SHEET 031',
    'STAGE 02', 'STAGE 03', 'STAGE 07', 'STAGE 09', 'STAGE 10', 'STAGE 11', 'STAGE 21',
    'SHEET 167', 'SHEET 168', 'SHEET 172', 'SHEET 174', 'SHEET 175', 'SHEET 176', 'SHEET 186'
  ];

  const found = {};
  for (let i = 0; i < res.pages.length; i++) {
    const text = res.pages[i].text.toUpperCase();
    const pageNum = i + 1;
    for (const s of targetSheets) {
      if (text.includes(s)) {
        if (!found[s]) found[s] = [];
        found[s].push(pageNum);
      }
    }
  }

  console.log('Found sheets:', JSON.stringify(found, null, 2));

  // Dump pages 31 to 45 (Sheets 020 to 034)
  let designDump = '';
  for (let p = 31; p <= 45; p++) {
    designDump += `\n\n==================== PAGE ${p} ====================\n\n` + res.pages[p-1].text;
  }
  fs.writeFileSync('scratch/design-specs-020-034.txt', designDump, 'utf8');

  // Dump Stage sheets
  const stagePages = [167, 168, 172, 174, 175, 176, 186];
  // Wait, let's find the exact page for Stage 02, Stage 03, etc.
  let stageDump = '';
  for (const s of ['STAGE 02', 'STAGE 03', 'STAGE 07', 'STAGE 21']) {
    const pagesForStage = found[s] || [];
    for (const p of pagesForStage) {
      stageDump += `\n\n==================== ${s} (PAGE ${p}) ====================\n\n` + res.pages[p-1].text;
    }
  }
  fs.writeFileSync('scratch/stage-specs.txt', stageDump, 'utf8');
  console.log('Saved design specs and stage specs to scratch/');
}

main().catch(console.error);
