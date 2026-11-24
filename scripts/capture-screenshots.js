const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(process.cwd(), 'scratch', 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const targets = [
  { name: 'home-desktop', url: 'http://localhost:3000/', width: 1440, height: 900 },
  { name: 'home-mobile', url: 'http://localhost:3000/', width: 375, height: 812 },
  { name: 'service-page', url: 'http://localhost:3000/services/website-development-seo', width: 1440, height: 900 },
  { name: 'product-page', url: 'http://localhost:3000/products/fortress', width: 1440, height: 900 },
  { name: 'about-page', url: 'http://localhost:3000/about', width: 1440, height: 900 },
  { name: 'portfolio-index', url: 'http://localhost:3000/portfolio', width: 1440, height: 900 },
  { name: 'blog-index', url: 'http://localhost:3000/blog', width: 1440, height: 900 },
  { name: 'portfolio-detail', url: 'http://localhost:3000/portfolio/lucky-house-safaris', width: 1440, height: 900 },
];

for (const t of targets) {
  const outPath = path.join(outputDir, `${t.name}.png`);
  console.log(`Capturing ${t.name} from ${t.url} (${t.width}x${t.height})...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=5000 --window-size=${t.width},${t.height} --screenshot="${outPath}" "${t.url}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Saved screenshot to: ${outPath}`);
  } catch (err) {
    console.error(`Failed to capture ${t.name}:`, err.message);
  }
}

console.log('Finished capturing all target screenshots.');
