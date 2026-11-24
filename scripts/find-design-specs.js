const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
  const buffer = fs.readFileSync('MegaScript_Digital_TDD.pdf');
  const parser = new PDFParse({ data: buffer });
  await parser.load();
  const res = await parser.getText();

  // Look for Section 3 / Design System or Specification 020
  // Search for "020" or "Design System" or "Design Tokens"
  for (let i = 0; i < res.pages.length; i++) {
    const text = res.pages[i].text;
    const pageNum = i + 1;
    if (
      text.includes('020') ||
      text.includes('021') ||
      text.includes('030') ||
      text.includes('031') ||
      text.toLowerCase().includes('design system') ||
      text.toLowerCase().includes('color tokens') ||
      text.toLowerCase().includes('colour palette')
    ) {
      // Find matching lines
      const lines = text.split('\n').filter(l => 
        l.toLowerCase().includes('design') || 
        l.toLowerCase().includes('color') || 
        l.toLowerCase().includes('colour') || 
        l.toLowerCase().includes('spec') ||
        l.toLowerCase().includes('sheet')
      );
      console.log(`Page ${pageNum}:`, lines.slice(0, 3).join(' | '));
    }
  }
}

main().catch(console.error);
