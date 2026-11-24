const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        getFiles(full, files);
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = [...getFiles('components'), ...getFiles('app')];
const varUsage = [];
const missingVars = new Set();
const definedVars = [
  '--background', '--foreground', '--surface', '--surface-subtle',
  '--surface-elevated', '--surface-border', '--primary', '--primary-hover',
  '--primary-foreground', '--primary-subtle', '--accent', '--accent-hover',
  '--accent-foreground', '--accent-subtle', '--success', '--success-subtle',
  '--warning', '--warning-subtle', '--destructive', '--destructive-subtle',
  '--muted', '--muted-foreground', '--border', '--ring'
];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/\[var\(--[a-zA-Z0-9_-]+\)\]/g);
  if (matches) {
    varUsage.push({ file, count: matches.length, samples: [...new Set(matches)] });
    for (const m of matches) {
      const varName = m.replace('[var(', '').replace(')]', '');
      if (!definedVars.includes(varName)) {
        missingVars.add(varName);
      }
    }
  }
}

console.log('=== FILES USING RAW [var(--...)] ===');
console.log(`Total files with raw [var(--...)]: ${varUsage.length}`);
varUsage.forEach(u => {
  console.log(`${u.file} (${u.count} uses): ${u.samples.slice(0, 6).join(', ')}`);
});

console.log('\n=== UNDEFINED VARIABLES USED IN CODE (DO NOT EXIST IN globals.css) ===');
console.log(Array.from(missingVars));
