import * as fs from "fs";
const { PDFParse } = require("pdf-parse");

async function main() {
  const buffer = fs.readFileSync("MegaScript_Digital_TDD.pdf");
  const parser = new PDFParse({ data: buffer });
  await parser.load();
  const res = await parser.getText();
  console.log(`Total Pages parsed: ${res.total}`);

  if (!fs.existsSync("scratch")) {
    fs.mkdirSync("scratch");
  }

  // Page 1
  console.log("=== Page 1 ===");
  console.log(res.pages[0]?.text);

  // Search for Specifications 020 to 031 and Sheets
  const searchTerms = [
    "Specification 020",
    "Specification 021",
    "Specification 022",
    "Specification 023",
    "Specification 024",
    "Specification 025",
    "Specification 026",
    "Specification 027",
    "Specification 028",
    "Specification 029",
    "Specification 030",
    "Specification 031",
    "Sheet 167",
    "Sheet 168",
    "Sheet 172",
    "Sheet 186",
  ];

  const results: Record<string, number[]> = {};
  for (const term of searchTerms) {
    results[term] = [];
    res.pages.forEach((pageObj: any, idx: number) => {
      if (pageObj.text?.toLowerCase().includes(term.toLowerCase())) {
        results[term].push(idx + 1);
      }
    });
  }
  console.log("Search matches (1-based page numbers):", JSON.stringify(results, null, 2));

  const matchedPageNumbers = new Set<number>();
  // Also include pages 20 through 45 (Specifications 020 to 031 usually correspond to pages 25-45)
  for (let p = 25; p <= 45; p++) {
    matchedPageNumbers.add(p);
  }
  // Include Sheet 167, 168, 172, 186
  [1, 2, 3, 4, 5, 167, 168, 172, 174, 175, 176, 186].forEach((p) => matchedPageNumbers.add(p));

  Object.values(results).forEach((arr) => arr.forEach((p) => matchedPageNumbers.add(p)));

  let dump = "";
  const sortedPages = Array.from(matchedPageNumbers).sort((a, b) => a - b);
  for (const p of sortedPages) {
    if (res.pages[p - 1]) {
      dump += `\n\n==================== PAGE ${p} ====================\n\n`;
      dump += res.pages[p - 1].text;
    }
  }

  fs.writeFileSync("scratch/tdd-design-specs.txt", dump, "utf8");
  console.log(`Saved ${sortedPages.length} relevant pages to scratch/tdd-design-specs.txt`);
}

main().catch(console.error);
