const fs = require('fs');
const path = require('path');
const os = require('os');
const playwrightPath = path.resolve(__dirname, '../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright');
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, '..');
const screenshotDirectory = path.join(root, 'QA', 'usability-screens');
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function inspect(page, scope) {
  const report = await page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].filter((item) => item.offsetParent !== null).map((item) => item.textContent.trim()),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    duplicateIds: (() => { const ids=[...document.querySelectorAll('[id]')].map((item)=>item.id); return [...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))]; })(),
    unnamedButtons: [...document.querySelectorAll('button')].filter((item)=>item.offsetParent!==null && !(item.textContent||item.getAttribute('aria-label')||'').trim()).length,
    unlabeledFields: [...document.querySelectorAll('input,select,textarea')].filter((field)=>field.offsetParent!==null && !field.closest('label') && !field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')).length,
    boundary: document.body.innerText.includes('Ausschließlich synthetische Fälle') && document.body.innerText.includes('keine Aufzeichnung') && document.body.innerText.includes('keine Außenwirkung'),
    brand: {
      bodyBackground:getComputedStyle(document.body).backgroundColor,
      headerBackground:getComputedStyle(document.querySelector('.topbar')).backgroundColor,
      bodyFont:getComputedStyle(document.body).fontFamily,
      titleFont:getComputedStyle(document.querySelector('h1')).fontFamily,
      logoWidth:Math.round(document.querySelector('.brand img').getBoundingClientRect().width),
      panelRadius:getComputedStyle(document.querySelector('.panel')).borderRadius,
      panelShadow:getComputedStyle(document.querySelector('.panel')).boxShadow,
    },
  }));
  if (report.title !== 'AMAVIO ACC | Moderierter synthetischer Usability-Test') fail(scope, `Titel: ${report.title}`);
  if (report.h1.length !== 1 || report.h1[0] !== 'Beobachten, nicht verkaufen.') fail(scope, `H1: ${report.h1.join(', ')}`);
  if (report.overflow) fail(scope, 'horizontaler Überlauf');
  if (report.duplicateIds.length) fail(scope, `doppelte IDs: ${report.duplicateIds.join(', ')}`);
  if (report.unnamedButtons) fail(scope, `${report.unnamedButtons} unbenannte Buttons`);
  if (report.unlabeledFields) fail(scope, `${report.unlabeledFields} Felder ohne Label`);
  if (!report.boundary) fail(scope, 'synthetische Testgrenze fehlt');
  if (report.brand.bodyBackground !== 'rgb(247, 244, 236)') fail(scope, `Cream fehlt: ${report.brand.bodyBackground}`);
  if (report.brand.headerBackground !== 'rgb(8, 21, 39)') fail(scope, `Stage Navy fehlt: ${report.brand.headerBackground}`);
  if (!report.brand.bodyFont.includes('Geist')) fail(scope, `Geist fehlt: ${report.brand.bodyFont}`);
  if (!report.brand.titleFont.includes('Fraunces')) fail(scope, `Fraunces fehlt: ${report.brand.titleFont}`);
  if (scope === 'desktop' && report.brand.logoWidth !== 180) fail(scope, `Logo nicht 180 px: ${report.brand.logoWidth}`);
  if (report.brand.panelRadius !== '8px') fail(scope, `Brandradius: ${report.brand.panelRadius}`);
  if (report.brand.panelShadow !== 'none') fail(scope, `unerlaubter Panel-Schatten: ${report.brand.panelShadow}`);
}

(async () => {
  const { createApplication } = await import('../backend/server.mjs');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'amavio-usability-'));
  const application = createApplication({ databasePath:path.join(directory,'usability.sqlite'), providerMode:'local' });
  await new Promise((resolve)=>application.server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${application.server.address().port}`;
  fs.mkdirSync(screenshotDirectory,{ recursive:true });
  const browser=await chromium.launch({ headless:true });
  try {
    for (const [name,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]) {
      const context=await browser.newContext({ viewport, acceptDownloads:true });
      const page=await context.newPage(); const errors=[]; const external=[];
      page.on('pageerror',(error)=>errors.push(error.message));
      page.on('console',(message)=>{ if(message.type()==='error') errors.push(message.text()); });
      page.on('request',(request)=>{ if(!request.url().startsWith(base)) external.push(request.url()); });
      const response=await page.goto(`${base}/usability/index.html`,{ waitUntil:'networkidle' });
      if (!response || response.status()!==200) fail(name,`HTTP ${response?.status()}`);
      await inspect(page,name);
      await page.screenshot({ path:path.join(screenshotDirectory,`${name}-brandbook-start.png`), fullPage:true });
      await page.locator('[data-start-session]').click();
      if (!(await page.locator('[data-setup-message]').innerText()).includes('vier Scope-Grenzen')) fail(name,'Scope Guard greift nicht');
      for (const checkbox of await page.locator('[data-scope]').all()) await checkbox.check();
      await page.locator('[data-mode]').selectOption('internal_rehearsal');
      await page.locator('[data-start-session]').click();
      if (!(await page.locator('[data-test-workspace]').isVisible())) fail(name,'Testarbeitsfläche startet nicht');
      if ((await page.locator('[data-task-index]').count())!==6) fail(name,'sechs Aufgaben fehlen');

      if (name==='desktop') {
        for (let index=0; index<6; index+=1) {
          await page.locator('[data-field="outcome"]').selectOption('success');
          await page.locator('[data-field="ease"]').selectOption(String(6-index%2));
          await page.locator('[data-field="observation"]').fill(`Synthetische Probelaufbeobachtung ${index+1}`);
          await page.locator('[data-save-next]').click();
        }
        if (!(await page.locator('[data-summary]').isVisible())) fail(name,'Auswertung öffnet nicht');
        if (!(await page.locator('[data-metrics]').innerText()).includes('100%')) fail(name,'Erfolgsquote nicht berechnet');
        const downloadPromise=page.waitForEvent('download');
        await page.locator('[data-export-json]').click();
        const download=await downloadPromise; const file=await download.createReadStream(); let body='';
        for await (const chunk of file) body+=chunk.toString();
        const exported=JSON.parse(body);
        if (!exported.syntheticOnly || exported.externalEffect!==false || exported.records.length!==6) fail(name,'Exportgrenze oder Schema fehlerhaft');
        await page.reload({ waitUntil:'networkidle' });
        if (!(await page.locator('[data-test-workspace]').isVisible())) fail(name,'lokale Session persistiert nicht');
        await page.screenshot({ path:path.join(screenshotDirectory,'desktop-brandbook-session.png'), fullPage:true });
      }
      if (external.length) fail(name,`externe Requests: ${external.join(', ')}`);
      if (errors.length) fail(name,`Browserfehler: ${errors.join(' | ')}`);
      if (await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1)) fail(name,'Überlauf nach Interaktion');
      console.log(`${name}: OK`); await context.close();
    }
  } finally { await browser.close(); await new Promise((resolve)=>application.server.close(resolve)); }
  if (failures.length) { console.error('\nAMAVIO Usability Testinstrument – Browser QA: FEHLER'); failures.forEach((item)=>console.error(`- ${item}`)); process.exit(1); }
  console.log('\nAMAVIO Usability Testinstrument – Browser QA: OK (Desktop, Mobile, Scope Guard, 6 Aufgaben, lokale Persistenz, Auswertung, Export und keine externen Requests)');
})();
