const fs = require('fs');
const path = require('path');
const os = require('os');
const playwrightPath = path.resolve(__dirname, '../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright');
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'QA', 'gate-01-5-screens');
const viewports = [
  ['desktop-native-1505', { width: 1505, height: 1000 }],
  ['desktop-1280', { width: 1280, height: 800 }],
  ['desktop-1024', { width: 1024, height: 900 }],
  ['tablet-768', { width: 768, height: 900 }],
  ['mobile-390', { width: 390, height: 844 }],
  ['mobile-360', { width: 360, height: 800 }],
];
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function inspect(page, scope) {
  const report = await page.evaluate(() => ({
    title: document.title,
    visibleH1: [...document.querySelectorAll('h1')].filter((item) => item.offsetParent !== null).map((item) => item.textContent.trim()),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    overflowSize: `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
    overflowElements: [...document.querySelectorAll('body *')].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
    }).slice(0, 8).map((element) => `${element.tagName.toLowerCase()}.${String(element.className || '').replace(/\s+/g, '.').slice(0, 80)}@${Math.round(element.getBoundingClientRect().left)}-${Math.round(element.getBoundingClientRect().right)}`),
    brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src')),
    duplicateIds: (() => { const ids = [...document.querySelectorAll('[id]')].map((item) => item.id); return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]; })(),
    unnamedButtons: [...document.querySelectorAll('button')].filter((button) => button.offsetParent !== null && !((button.getAttribute('aria-label') || button.textContent || '').trim())).length,
    unlabeledFields: [...document.querySelectorAll('input,select,textarea')].filter((field) => {
      if (field.offsetParent === null) return false;
      if (field.getAttribute('aria-label') || field.getAttribute('aria-labelledby')) return false;
      if (field.closest('label')) return false;
      return !field.id || !document.querySelector(`label[for="${field.id}"]`);
    }).length,
    navTargets: [...document.querySelectorAll('[data-page-target]')].map((item) => item.dataset.pageTarget),
    opsModes: [...document.querySelectorAll('[data-ops-mode]')].map((item) => item.dataset.opsMode),
    boundary: document.body.innerText.includes('ausschließlich synthetische Daten') && document.body.innerText.includes('keine Außenwirkung'),
    resetLabel: document.querySelector('[data-reset-demo]')?.textContent.trim(),
  }));
  if (report.title !== 'AMAVIO Arrival Control Center | Lokale Konzeptdemo') fail(scope, `Titel: ${report.title}`);
  if (report.visibleH1.length !== 1 || report.visibleH1[0] !== 'Fälle') fail(scope, `sichtbare H1: ${report.visibleH1.join(', ') || 'keine'}`);
  if (report.overflow) fail(scope, `horizontaler Seitenüberlauf ${report.overflowSize}: ${report.overflowElements.join(', ')}`);
  if (report.brokenImages.length) fail(scope, `defekte Bilder: ${report.brokenImages.join(', ')}`);
  if (report.duplicateIds.length) fail(scope, `doppelte IDs: ${report.duplicateIds.join(', ')}`);
  if (report.unnamedButtons) fail(scope, `${report.unnamedButtons} Buttons ohne zugänglichen Namen`);
  if (report.unlabeledFields) fail(scope, `${report.unlabeledFields} sichtbare Felder ohne Label`);
  if (report.navTargets.join(',') !== 'today,cases,operations,evaluation') fail(scope, `Navigation: ${report.navTargets.join(',')}`);
  if (report.opsModes.join(',') !== 'overview,evidence,exceptions,simulation,products,history') fail(scope, `Arbeitsmodi: ${report.opsModes.join(',')}`);
  if (!report.boundary) fail(scope, 'synthetische No-Effect-Grenze fehlt');
  if (report.resetLabel !== 'Ansicht zurücksetzen') fail(scope, `missverständliche Reset-Aktion: ${report.resetLabel || 'fehlt'}`);
}

(async () => {
  const { createApplication } = await import('../backend/server.mjs');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'amavio-acc-gate15-browser-'));
  const application = createApplication({ databasePath: path.join(directory, 'browser.sqlite'), providerMode: 'local' });
  await new Promise((resolve) => application.server.listen(0, '127.0.0.1', resolve));
  const address = application.server.address();
  const base = `http://127.0.0.1:${address.port}`;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const [name, viewport] of viewports) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      const externalRequests = [];
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
      page.on('request', (request) => { if (!request.url().startsWith(base)) externalRequests.push(request.url()); });
      const response = await page.goto(`${base}/?page=operations`, { waitUntil: 'networkidle' });
      if (!response || response.status() !== 200) fail(name, `HTTP ${response?.status()}`);
      await page.locator('[data-ops-runtime]').filter({ hasText: 'aktiv' }).waitFor();
      await inspect(page, name);
      if ((await page.locator('[data-ops-case-id]').count()) !== 4) fail(name, 'vier mandantengebundene Fälle fehlen');
      if ((await page.locator('.ops-milestone-row').count()) !== 5) fail(name, 'fünfstufiger kritischer Pfad fehlt');
      if ((await page.locator('.ops-rule-row').count()) !== 10) fail(name, 'zehn lokale Fachregeln fehlen');
      if (externalRequests.length) fail(name, `unerwartete externe Requests: ${externalRequests.join(', ')}`);

      if (name === 'desktop-native-1505') {
        await page.locator('[data-ops-mode="evidence"]').click();
        if ((await page.locator('.ops-evidence-card').count()) !== 3) fail(name, 'Evidenzakte enthält nicht drei Belege');
        if (!(await page.locator('.ops-evidence-card.is-conflicting').innerText()).includes('Widersprüchlich')) fail(name, 'Evidenzkonflikt wird nicht sichtbar');

        await page.locator('[data-ops-mode="exceptions"]').focus();
        await page.keyboard.press('Enter');
        if (!(await page.locator('[data-ops-panel="exceptions"]').isVisible())) fail(name, 'Arbeitsmodus ist nicht per Tastatur aktivierbar');
        if ((await page.locator('.ops-rule-row.is-triggered').count()) < 4) fail(name, 'Regelspur zeigt zu wenige ausgelöste Regeln');

        await page.locator('[data-ops-mode="simulation"]').click();
        await page.locator('[data-ops-arrival-date]').fill('2026-09-16');
        await page.locator('[data-ops-simulation-form] button').click();
        await page.locator('[data-ops-simulation-result]').waitFor({ state: 'visible' });
        if (!(await page.locator('[data-ops-sim-before]').innerText()).includes('13.09.2026')) fail(name, 'Simulation verliert Originaldatum');
        if ((await page.locator('.ops-delta-row').count()) !== 5) fail(name, 'Simulation zeigt nicht fünf Folgefristen');
        const beforeApply = await page.locator('[data-ops-case-meta]').innerText();
        if (!beforeApply.includes('13.09.2026') || !beforeApply.includes('Version 1')) fail(name, 'Simulation mutiert Originalfall vor Human Gate');
        await page.locator('[data-ops-simulation-note]').fill('Synthetische Folgefristen geprüft; lokale Übernahme freigegeben.');
        await page.locator('[data-ops-apply-simulation]').click();
        await page.waitForFunction(() => document.querySelector('[data-ops-case-meta]').textContent.includes('Version 2'));
        const afterApply = await page.locator('[data-ops-case-meta]').innerText();
        if (!afterApply.includes('16.09.2026')) fail(name, 'Human Gate übernimmt simuliertes Datum nicht');
        if (!(await page.locator('[data-ops-case-id="SYN-CASE-001"]').innerText()).includes('16.09.2026')) fail(name, 'Fallindex und kanonischer Fall laufen nach Übernahme auseinander');

        await page.locator('[data-ops-mode="products"]').click();
        await page.locator('[data-ops-product-form] button').click();
        await page.locator('.ops-product-card').first().waitFor();
        const product = await page.locator('.ops-product-card').first().innerText();
        if (!product.includes('sink_only') || !product.includes('Quellenreferenzen')) fail(name, 'Arbeitsprodukt verliert Quellen- oder Wirkungsstatus');

        await page.locator('[data-ops-capability="explain_conflict"]').click();
        await page.locator('[data-ops-capability-output]').filter({ hasText: 'Widerspruch' }).waitFor();
        const capability = await page.locator('[data-ops-capability-output]').innerText();
        if (!capability.includes('Widerspruch') || !capability.includes('SYN-CASE-001-EVD-2')) fail(name, 'lokale Capability ist nicht belegt');

        await page.locator('[data-page-target="evaluation"]').click();
        await page.locator('[data-run-evaluation]').click();
        await page.locator('.evaluation-result-row').first().waitFor();
        if ((await page.locator('.evaluation-result-row').count()) !== 24) fail(name, '24 Evaluationsszenarien fehlen');
        if (!(await page.locator('[data-evaluation-summary]').innerText()).includes('vollständig grün')) fail(name, 'Evaluation ist nicht vollständig grün');
        if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'Evaluation erzeugt horizontalen Überlauf');
        await page.evaluate(() => {
          window.scrollTo(0, 0);
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        });
        await page.screenshot({ path: path.join(out, `${name}-evaluation.png`), fullPage: true });
        await page.locator('[data-page-target="operations"]').click();
      }

      if (viewport.width <= 768) {
        await page.locator('[data-menu-button]').click();
        if (!(await page.locator('body').evaluate((body) => body.classList.contains('nav-open')))) fail(name, 'mobile Navigation öffnet nicht');
        await page.locator('[data-page-target="evaluation"]').click();
        if (await page.locator('body').evaluate((body) => body.classList.contains('nav-open'))) fail(name, 'mobile Navigation schließt nicht');
        if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'mobile Evaluation erzeugt Überlauf');
        await page.locator('[data-menu-button]').click();
        await page.locator('[data-page-target="operations"]').click();
        await page.locator('[data-ops-mode="evidence"]').click();
        if (!(await page.locator('[data-ops-panel="evidence"]').isVisible())) fail(name, 'mobiler Evidenzmodus öffnet nicht');
        if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'mobile Arbeitsfläche erzeugt Überlauf');
      }

      await page.locator('[data-ops-mode="overview"]').click();
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        document.querySelector('[data-ops-toast]')?.classList.remove('is-visible');
      });
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(out, `${name}-operations.png`), fullPage: true });
      if (errors.length) fail(name, errors.join(' | '));
      console.log(`${name}: OK`);
      await context.close();
    }

    const reducedContext = await browser.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto(`${base}/?page=operations`, { waitUntil: 'networkidle' });
    const animation = await reducedPage.locator('[data-ops-panel]:not([hidden])').evaluate((element) => getComputedStyle(element).animationName);
    if (animation !== 'none') fail('reduced-motion', `Animation bleibt aktiv: ${animation}`);
    await reducedContext.close();

    const missingContext = await browser.newContext();
    const missingPage = await missingContext.newPage();
    const missing = await missingPage.goto(`${base}/nicht-vorhanden`, { waitUntil: 'domcontentloaded' });
    if (!missing || missing.status() !== 404) fail('http', `404 erwartet, erhalten ${missing?.status()}`);
    await missingContext.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => application.server.close(resolve));
  }

  if (failures.length) {
    console.error('\nAMAVIO ACC Productization Gate 02A – Browser QA: FEHLER');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log(`\nAMAVIO ACC Productization Gate 02A – Browser QA: OK (${viewports.length} Viewports, Fallarbeit, Evidenz, Regeln, Simulation, Human Gate, Arbeitsprodukt, Evaluation, Accessibility-Basis und keine externen Requests)`);
})();
