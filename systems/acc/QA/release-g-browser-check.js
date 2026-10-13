const fs = require('fs');
const path = require('path');
const os = require('os');
const playwrightPath = path.resolve(__dirname, '../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright');
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'QA', 'kernel-v2-screens');
const viewports = [
  ['desktop-1505', { width: 1505, height: 1000 }],
  ['desktop-1280', { width: 1280, height: 800 }],
  ['desktop-1024', { width: 1024, height: 900 }],
  ['tablet-768', { width: 768, height: 900 }],
  ['mobile-390', { width: 390, height: 844 }],
  ['mobile-360', { width: 360, height: 800 }],
];
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function inspect(page, scope, viewport) {
  const report = await page.evaluate(() => {
    const panel = document.querySelector('.journey-panel-head');
    const caseTitle = document.querySelector('[data-ops-case-title]');
    const logo = document.querySelector('.brand img');
    const runtime = document.querySelector('.ops-runtime');
    return {
      title: document.title,
      h1: [...document.querySelectorAll('h1')].filter((item) => !item.closest('[hidden]')).map((item) => item.textContent.trim()),
      main: Boolean(document.querySelector('main#main-content')),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      overflowSize: `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
      overflowElements: [...document.querySelectorAll('body *')].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
      }).slice(0, 8).map((element) => `${element.tagName.toLowerCase()}.${String(element.className || '').replace(/\s+/g, '.').slice(0, 70)}@${Math.round(element.getBoundingClientRect().left)}-${Math.round(element.getBoundingClientRect().right)}`),
      brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src')),
      duplicateIds: (() => { const ids = [...document.querySelectorAll('[id]')].map((item) => item.id); return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]; })(),
      unnamedButtons: [...document.querySelectorAll('button')].filter((button) => button.offsetParent !== null && !((button.getAttribute('aria-label') || button.textContent || '').trim())).length,
      unlabeledFields: [...document.querySelectorAll('input,select,textarea')].filter((field) => {
        if (field.offsetParent === null) return false;
        if (field.getAttribute('aria-label') || field.getAttribute('aria-labelledby') || field.closest('label')) return false;
        return !field.id || !document.querySelector(`label[for="${field.id}"]`);
      }).length,
      navTargets: [...document.querySelectorAll('.main-nav [data-page-target]')].map((item) => item.dataset.pageTarget),
      opsModes: [...document.querySelectorAll('[data-ops-mode]')].map((item) => item.dataset.opsMode),
      boundary: /synthetisch/i.test(document.body.innerText) && /keine Außenwirkung/i.test(document.body.innerText),
      resetLabel: document.querySelector('[data-reset-demo]')?.textContent.trim(),
      bodyFont: getComputedStyle(document.body).fontFamily,
      titleFont: caseTitle ? getComputedStyle(caseTitle).fontFamily : '',
      logoWidth: logo?.getBoundingClientRect().width || 0,
      runtimeBackground: runtime ? getComputedStyle(runtime).backgroundColor : '',
      panelBackground: panel ? getComputedStyle(panel).backgroundColor : '',
      panelRadius: panel ? parseFloat(getComputedStyle(panel).borderTopLeftRadius) : 99,
      panelShadow: panel ? getComputedStyle(panel).boxShadow : 'unknown',
      kernelContract: document.querySelector('.release-g-context')?.dataset.kernelContract || '',
      visibleKernelBranding: /AMAVIO Intelligence Kernel|KI-Chat|KI-Copilot|AI Command Center/i.test(document.querySelector('.operations-page')?.innerText || ''),
    };
  });
  if (report.title !== 'AMAVIO Arrival Control Center | Lokale Konzeptdemo') fail(scope, `Titel: ${report.title}`);
  if (!report.main) fail(scope, 'Main-Landmark fehlt');
  if (report.h1.length !== 1 || report.h1[0] !== 'Fallarbeit') fail(scope, `semantische H1: ${report.h1.join(', ') || 'keine'}`);
  if (report.overflow) fail(scope, `horizontaler Seitenüberlauf ${report.overflowSize}: ${report.overflowElements.join(', ')}`);
  if (report.brokenImages.length) fail(scope, `defekte Bilder: ${report.brokenImages.join(', ')}`);
  if (report.duplicateIds.length) fail(scope, `doppelte IDs: ${report.duplicateIds.join(', ')}`);
  if (report.unnamedButtons) fail(scope, `${report.unnamedButtons} Buttons ohne zugänglichen Namen`);
  if (report.unlabeledFields) fail(scope, `${report.unlabeledFields} sichtbare Felder ohne Label`);
  if (report.navTargets.join(',') !== 'today,cases,twin,twin-decisions,operations,planning,collaboration,programs,evaluation,learning,learning-quality') fail(scope, `Navigation: ${report.navTargets.join(',')}`);
  if (report.opsModes.join(',') !== 'evidence,responsibility,simulation,decision,products') fail(scope, `Fallreise: ${report.opsModes.join(',')}`);
  if (!report.boundary) fail(scope, 'synthetische No-Effect-Grenze fehlt');
  if (report.resetLabel !== 'Ansicht zurücksetzen') fail(scope, `Reset-Aktion: ${report.resetLabel || 'fehlt'}`);
  if (!/Geist/i.test(report.bodyFont)) fail(scope, `Body-Schrift ist nicht Geist: ${report.bodyFont}`);
  if (!/Fraunces/i.test(report.titleFont)) fail(scope, `Falltitel ist nicht Fraunces: ${report.titleFont}`);
  if (viewport.width > 680 && report.logoWidth < 150) fail(scope, `Logo kleiner als 150 px: ${report.logoWidth}`);
  if (report.runtimeBackground !== 'rgb(8, 21, 39)') fail(scope, `Runtime nicht Stage Navy: ${report.runtimeBackground}`);
  if (report.panelBackground !== 'rgb(247, 244, 236)') fail(scope, `Stufenkopf nicht Cream: ${report.panelBackground}`);
  if (report.panelRadius > 8) fail(scope, `Panel-Radius zu groß: ${report.panelRadius}`);
  if (report.panelShadow !== 'none') fail(scope, `Panel-Schatten vorhanden: ${report.panelShadow}`);
  if (report.kernelContract !== 'amavio.intelligence-kernel.v1') fail(scope, `Kernel-Kontext nicht integriert: ${report.kernelContract || 'fehlt'}`);
  if (report.visibleKernelBranding) fail(scope, 'Kernel wird als sichtbares KI-Modul inszeniert');
}

(async () => {
  const { createApplication } = await import('../backend/server.mjs');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'amavio-acc-release-g-browser-'));
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
      await page.locator('[data-ops-runtime]').filter({ hasText: 'aktiv' }).waitFor({ state: 'attached' });
      await inspect(page, name, viewport);
      if ((await page.locator('[data-ops-case-id]').count()) !== 5) fail(name, 'fünf mandantengebundene Fälle fehlen');
      if ((await page.locator('.ops-evidence-card').count()) !== 3) fail(name, 'Evidenzakte enthält nicht drei Belege');
      if ((await page.locator('.ops-milestone-row').count()) !== 5) fail(name, 'fünfstufiger kritischer Pfad fehlt');
      if ((await page.locator('.ops-rule-row').count()) !== 10) fail(name, 'zehn lokale Fachregeln fehlen');
      if (externalRequests.length) fail(name, `unerwartete externe Requests: ${externalRequests.join(', ')}`);

      if (name === 'desktop-1505') {
        const kernelStatus = await page.evaluate(async () => {
          const response = await fetch('/api/kernel/v1/status', { headers: { 'x-demo-session': 'demo-session-alpha' } });
          return { status: response.status, body: await response.json() };
        });
        if (kernelStatus.status !== 200 || kernelStatus.body.contractVersion !== 'amavio.intelligence-kernel.v1') fail(name, 'Kernel-Statusvertrag fehlt');
        if (kernelStatus.body.providerStatus.networkCallsThisRun !== 0) fail(name, 'Kernel meldet unerwartete Provideraufrufe');
        if (kernelStatus.body.boundaries.externalEffects !== false || kernelStatus.body.boundaries.providerCosts !== false) fail(name, 'Kernel-Wirkungs- oder Kostengrenze verletzt');
        const kernelV2Status = await page.evaluate(async () => {
          const response = await fetch('/api/kernel/v2/status', { headers: { 'x-demo-session': 'demo-session-alpha' } });
          return { status: response.status, body: await response.json() };
        });
        if (kernelV2Status.status !== 200 || kernelV2Status.body.capabilities.length !== 3) fail(name, 'Kernel-V2-Capability-Vertrag fehlt');
        if (kernelV2Status.body.boundaries.externalCalls !== false || kernelV2Status.body.boundaries.automaticApply !== false) fail(name, 'Kernel-V2-Ausführungsgrenze verletzt');
        if (!(await page.locator('[data-ops-panel="evidence"]').isVisible())) fail(name, 'Fallreise startet nicht in Evidenz');
        if (!(await page.locator('.ops-evidence-card.is-conflicting').innerText()).includes('Widersprüchlich')) fail(name, 'Evidenzkonflikt wird nicht sichtbar');
        await page.locator('[data-ops-panel="evidence"] .l2-proof > summary').click();
        await page.locator('[data-v2-create-reconciliation]').click();
        await page.locator('[data-v2-reconciliation-output] .kernel-review').waitFor();
        const reconciliationText = await page.locator('[data-v2-reconciliation-output]').innerText();
        if (!reconciliationText.includes('Prüfbarer Klärungsauftrag') || !reconciliationText.includes('Quellen')) fail(name, 'Evidence Reconciliation erzeugt keinen prüfbaren Klärungsauftrag');
        await page.locator('[data-v2-reconciliation-output] textarea').fill('Quellenvergleich, Pflichtbelege und Klärungskriterien synthetisch geprüft.');
        await page.locator('[data-v2-reconciliation-output] [data-v2-review-artifact]').click();
        await page.locator('[data-v2-reconciliation-output].is-approved').waitFor();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(out, 'desktop-1505-evidence.png'), fullPage: true });

        await page.locator('[data-ops-next="responsibility"]').click();
        if (!(await page.locator('[data-ops-panel="responsibility"]').isVisible())) fail(name, 'Verantwortungsstufe öffnet nicht');
        const responsibility = await page.locator('[data-responsibility-summary]').innerText();
        if (!responsibility.includes('AMAVIO Operations') || !responsibility.includes('Adressabweichung')) fail(name, `nächste Verantwortung fehlt: ${responsibility}`);

        await page.locator('[data-ops-mode="simulation"]').focus();
        await page.keyboard.press('Enter');
        if (!(await page.locator('[data-ops-panel="simulation"]').isVisible())) fail(name, 'Stufe ist nicht per Tastatur aktivierbar');
        await page.locator('[data-ops-arrival-date]').fill('2026-09-16');
        await page.locator('[data-ops-simulation-form] button').click();
        await page.locator('[data-ops-simulation-result]').waitFor({ state: 'visible' });
        if (!(await page.locator('[data-ops-sim-before]').innerText()).includes('13.09.2026')) fail(name, 'Simulation verliert Originaldatum');
        if ((await page.locator('.ops-delta-row').count()) !== 5) fail(name, 'Simulation zeigt nicht fünf Folgefristen');
        await page.locator('[data-ops-panel="simulation"] .l2-proof > summary').click();
        await page.locator('[data-v2-create-replan]').click();
        await page.locator('[data-v2-replan-output] .kernel-review').waitFor();
        const replanText = await page.locator('[data-v2-replan-output]').innerText();
        if (!replanText.includes('Anpassungsvorlage') || !replanText.includes('Originalfall unverändert')) fail(name, 'Critical-Path Replanning ist nicht begründet oder isoliert');
        await page.locator('[data-v2-replan-output] textarea').fill('Neu berechnete Fristen und harte Abhängigkeiten synthetisch geprüft.');
        await page.locator('[data-v2-replan-output] [data-v2-review-artifact]').click();
        await page.locator('[data-v2-replan-output].is-approved').waitFor();
        const beforeApply = await page.locator('[data-ops-case-meta]').innerText();
        if (!beforeApply.includes('13.09.2026') || !beforeApply.includes('Version 1')) fail(name, 'Simulation mutiert Originalfall vor Human Gate');
        await page.locator('[data-ops-simulation-note]').fill('Synthetische Folgefristen geprüft; lokale Übernahme freigegeben.');
        await page.locator('[data-ops-apply-simulation]').click();
        await page.waitForFunction(() => document.querySelector('[data-ops-case-meta]').textContent.includes('Version 2'));
        const afterApply = await page.locator('[data-ops-case-meta]').innerText();
        if (!afterApply.includes('16.09.2026')) fail(name, 'Human Gate übernimmt simuliertes Datum nicht');

        await page.locator('[data-ops-mode="decision"]').click();
        await page.locator('[data-ops-decision-note]').fill('Synthetische Terminvariante fachlich geprüft; interne Entscheidung dokumentiert.');
        await page.locator('[data-ops-decision-form] button').click();
        await page.locator('[data-ops-panel="products"]').waitFor({ state: 'visible' });
        if (!(await page.locator('[data-context-human-gate]').innerText()).includes('Dokumentiert')) fail(name, 'Human-Gate-Kontext wird nicht aktualisiert');

        await page.locator('[data-ops-product-form] button').click();
        await page.locator('[data-v2-brief-output] .product-header').waitFor();
        const product = await page.locator('[data-v2-brief-output]').innerText();
        if (!product.includes('nicht versendet') || !product.includes('Quellen') || !/100\s*\/100/.test(product)) fail(name, 'Arrival Readiness Brief verliert Quellen-, Rubrik- oder Wirkungsstatus');
        if (!(await page.locator('[data-context-product-status]').innerText()).includes('Entwurf erstellt')) fail(name, 'Kontextleiste übernimmt Briefstatus nicht');
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(out, 'desktop-1505-product.png'), fullPage: true });

        await page.evaluate(() => document.querySelector('[data-page-target="evaluation"]').click());
        await page.locator('[data-run-evaluation]').click();
        await page.locator('.evaluation-result-row').first().waitFor();
        if ((await page.locator('.evaluation-result-row').count()) !== 24) fail(name, '24 Evaluationsszenarien fehlen');
        if (!(await page.locator('[data-evaluation-summary]').innerText()).includes('vollständig grün')) fail(name, 'Evaluation ist nicht vollständig grün');
        if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'Evaluation erzeugt horizontalen Überlauf');
        await page.evaluate(() => document.querySelector('[data-page-target="operations"]').click());
      }

      if (viewport.width <= 768) {
        await page.locator('[data-menu-button]').click();
        if (!(await page.locator('body').evaluate((body) => body.classList.contains('nav-open')))) fail(name, 'mobile Navigation öffnet nicht');
        await page.locator('[data-page-target="learning-quality"]').click();
        if (await page.locator('body').evaluate((body) => body.classList.contains('nav-open'))) fail(name, 'mobile Navigation schließt nicht');
        await page.goto(`${base}/?page=operations`, { waitUntil: 'networkidle' });
        await page.locator('[data-ops-runtime]').filter({ hasText: 'aktiv' }).waitFor({ state: 'attached' });
        await page.locator('[data-ops-mode="responsibility"]').click();
        if (!(await page.locator('[data-ops-panel="responsibility"]').isVisible())) fail(name, 'mobile Verantwortungsstufe öffnet nicht');
        if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'mobile Arbeitsfläche erzeugt Überlauf');
      }

      await page.locator('[data-ops-mode="evidence"]').click();
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        document.querySelector('[data-ops-toast]')?.classList.remove('is-visible');
      });
      await page.waitForTimeout(180);
      await page.screenshot({ path: path.join(out, `${name}-operations.png`), fullPage: true });
      if (errors.length) fail(name, errors.join(' | '));
      console.log(`${name}: geprüft`);
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
    console.error('\nAMAVIO ACC Intelligence Kernel V2 – Browser QA: FEHLER');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log(`\nAMAVIO ACC Intelligence Kernel V2 – Browser QA: OK (${viewports.length} Viewports, Evidence Reconciliation, Critical-Path Replanning, Brief-Rubrik, Human Gates, Accessibility-Basis, null Providerkosten und keine externen Requests)`);
})();
