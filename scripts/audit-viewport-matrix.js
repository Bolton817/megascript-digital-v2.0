const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9399;
const outputDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\733eb1b7-6911-447c-bb2f-48a05f03c137';

const viewports = [
  { name: '320px-narrow-mobile', width: 320, height: 568, mobile: true, deviceScaleFactor: 2 },
  { name: '375px-standard-mobile', width: 375, height: 812, mobile: true, deviceScaleFactor: 2 },
  { name: '430px-large-mobile', width: 430, height: 932, mobile: true, deviceScaleFactor: 3 },
  { name: '768px-tablet-portrait', width: 768, height: 1024, mobile: true, deviceScaleFactor: 2 },
  { name: '1024px-desktop-breakpoint', width: 1024, height: 768, mobile: false, deviceScaleFactor: 1 },
  { name: '1440px-wide-desktop', width: 1440, height: 900, mobile: false, deviceScaleFactor: 1 },
];

async function main() {
  console.log('======================================================');
  console.log('  Stage 22: Multi-Device Viewport QA Audit Matrix     ');
  console.log('======================================================\n');

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    'http://localhost:3000'
  ]);

  function getJson(p) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}${p}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  try {
    await delay(2500);
    const pages = await getJson('/json');
    const wsUrl = pages[0].webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise((resolve) => ws.onopen = resolve);

    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Initial page navigation to http://localhost:3000...');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await delay(3000);

    // Accept cookie consent to prevent banners from altering measurements
    await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const acceptBtn = buttons.find(b => b.textContent.includes('Accept All'));
        if (acceptBtn) acceptBtn.click();
      })()`
    });
    await delay(800);

    let allPassed = true;
    const auditResults = [];

    for (const vp of viewports) {
      console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height}, mobile=${vp.mobile})...`);

      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.deviceScaleFactor,
        mobile: vp.mobile,
      });
      await delay(800);

      // Evaluate document overflow
      const metrics = await send('Runtime.evaluate', {
        expression: `JSON.stringify((() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const innerWidth = window.innerWidth;
          const hasOverflow = scrollWidth > innerWidth;

          // Identify offending elements if overflow detected
          let offender = null;
          if (hasOverflow) {
            const allElements = Array.from(document.querySelectorAll('*'));
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > innerWidth + 1) {
                offender = el.tagName + (el.className ? '.' + String(el.className).slice(0, 30) : '') + ' (right=' + rect.right + ')';
                break;
              }
            }
          }

          return {
            scrollWidth,
            clientWidth,
            innerWidth,
            hasOverflow,
            offender
          };
        })())`
      });

      const res = JSON.parse(metrics.result.value);
      const status = !res.hasOverflow ? 'PASS' : 'FAIL';
      console.log(`  [${status}] Horizontal Overflow: scrollWidth=${res.scrollWidth}px, innerWidth=${res.innerWidth}px`);
      if (res.hasOverflow) {
        console.error(`         Offending element: ${res.offender}`);
        allPassed = false;
      }

      // Capture visual snapshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `stage22-viewport-${vp.name}.png`;
      fs.writeFileSync(path.join(outputDir, filename), Buffer.from(shot.data, 'base64'));
      console.log(`         Captured visual snapshot: ${filename}`);

      auditResults.push({
        viewport: vp.name,
        resolution: `${vp.width}x${vp.height}`,
        scrollWidth: res.scrollWidth,
        innerWidth: res.innerWidth,
        overflow: res.hasOverflow,
        status: !res.hasOverflow ? 'PASSED' : 'FAILED',
      });
    }

    ws.close();
    chrome.kill();

    console.log('\n======================================================');
    console.log('             VIEWPORT AUDIT SUMMARY TABLE             ');
    console.log('======================================================');
    console.table(auditResults);
    console.log(`Total Viewports Audited: ${auditResults.length}`);
    console.log(`Status: ${allPassed ? 'ALL VIEWPORTS COMPLIANT (ZERO OVERFLOW)' : 'FAILURES DETECTED'}`);
    console.log('======================================================\n');

    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    chrome.kill();
    console.error('Audit script error:', err);
    process.exit(1);
  }
}

main();
