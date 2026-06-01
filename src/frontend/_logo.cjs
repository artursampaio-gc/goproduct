const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  try {
    const pw = page.locator('input[type="password"]').first();
    await pw.waitFor({ timeout: 15000 });
    await page.locator('input:not([type="password"]):not([type="checkbox"]):not([type="hidden"])').first().fill('admin');
    await pw.fill('inventree');
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/auth/login') && r.request().method() === 'POST', { timeout: 15000 }).catch(() => null),
      page.getByRole('button', { name: /log ?in|sign in|entrar/i }).click().catch(() => pw.press('Enter'))
    ]);
  } catch (e) { console.log('login err', e.message); }
  await page.waitForTimeout(5000);
  console.log('URL:', page.url());
  const info = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const img = imgs.find((i) => (i.getAttribute('src') || '').includes('goproduct')) || imgs.find((i) => (i.alt || '').includes('GoProduct')) || imgs[0];
    if (!img) return 'no img found; total imgs=' + imgs.length;
    const r = img.getBoundingClientRect();
    const chain = [];
    let p = img.parentElement;
    for (let i = 0; i < 5 && p; i++) {
      const cs = getComputedStyle(p);
      const pr = p.getBoundingClientRect();
      chain.push(`${p.tagName}.${(typeof p.className === 'string' ? p.className : '').slice(0, 24)} w=${Math.round(pr.width)} h=${Math.round(pr.height)} overflow=${cs.overflow} display=${cs.display}`);
      p = p.parentElement;
    }
    return { src: (img.getAttribute('src') || '').slice(-40), natW: img.naturalWidth, natH: img.naturalHeight, attrH: img.getAttribute('height'), clientW: img.clientWidth, clientH: img.clientHeight, rectW: Math.round(r.width), rectH: Math.round(r.height), chain };
  });
  console.log('IMG INFO:', JSON.stringify(info, null, 2));
  await page.screenshot({ path: '_logo_nav.png', clip: { x: 0, y: 0, width: 760, height: 72 } }).catch((e) => console.log('shot err', e.message));
  await browser.close();
})();
