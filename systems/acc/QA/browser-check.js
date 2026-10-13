const fs = require('fs');
const path = require('path');
const playwrightPath = path.resolve(__dirname, '../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright');
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, '..');
const base = process.env.QA_BASE || 'http://127.0.0.1:4192';
const out = path.join(root, 'QA', 'gate-01-screens');
const viewports = [
  ['desktop-native-1505', { width: 1505, height: 1045 }],
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
    visibleH1: [...document.querySelectorAll('h1')].filter((item) => getComputedStyle(item.closest('[data-page]')).display !== 'none').map((item) => item.textContent.trim()),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src')),
    duplicateIds: (() => { const ids = [...document.querySelectorAll('[id]')].map((item) => item.id); return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]; })(),
    unnamedButtons: [...document.querySelectorAll('button')].filter((button) => !((button.getAttribute('aria-label') || button.textContent || '').trim())).length,
    unlabeledFields: [...document.querySelectorAll('input,select,textarea')].filter((field) => {
      if (field.closest('[hidden]')) return false;
      if (field.getAttribute('aria-label') || field.getAttribute('aria-labelledby')) return false;
      if (field.closest('label')) return false;
      return !field.id || !document.querySelector(`label[for="${field.id}"]`);
    }).length,
    roleTargets: [...document.querySelectorAll('[data-role-target]')].map((item) => item.dataset.roleTarget),
    navTargets: [...document.querySelectorAll('[data-page-target]')].map((item) => item.dataset.pageTarget),
    workModes: [...document.querySelectorAll('[data-work-mode]')].map((item) => item.dataset.workMode),
    activePanel: document.querySelector('[data-work-panel]:not([hidden])')?.dataset.workPanel,
    oldModulesVisible: /AI Command Center|What-if Copilot|Workflow Composer|Learning Copilot|Role Intelligence|Automation Studio/i.test(document.body.innerText),
    boundary: document.body.innerText.includes('ausschließlich synthetische Daten') && document.body.innerText.includes('keine Systemanbindung'),
  }));
  if (report.title !== 'AMAVIO Arrival Control Center | Lokale Konzeptdemo') fail(scope, `Titel: ${report.title}`);
  if (report.visibleH1.length !== 1) fail(scope, `sichtbare H1: ${report.visibleH1.join(', ') || 'keine'}`);
  if (report.overflow) fail(scope, 'horizontaler Seitenüberlauf');
  if (report.brokenImages.length) fail(scope, `defekte Bilder: ${report.brokenImages.join(', ')}`);
  if (report.duplicateIds.length) fail(scope, `doppelte IDs: ${report.duplicateIds.join(', ')}`);
  if (report.unnamedButtons) fail(scope, `${report.unnamedButtons} Buttons ohne zugänglichen Namen`);
  if (report.unlabeledFields) fail(scope, `${report.unlabeledFields} Felder ohne Label`);
  if (report.roleTargets.join(',') !== 'admin,employer') fail(scope, `Rollen: ${report.roleTargets.join(',')}`);
  if (report.navTargets.join(',') !== 'today,cases,insights,pilot') fail(scope, `Navigation: ${report.navTargets.join(',')}`);
  if (report.workModes.join(',') !== 'understand,plan,simulate,prepare,history') fail(scope, `Arbeitsmodi: ${report.workModes.join(',')}`);
  if (report.activePanel !== 'plan') fail(scope, `initialer Arbeitsmodus: ${report.activePanel}`);
  if (report.oldModulesVisible) fail(scope, 'historische KI-Modulnamen sichtbar');
  if (!report.boundary) fail(scope, 'Demo- und Datenboundary fehlt');
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const [name, viewport] of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    const response = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    if (!response || response.status() !== 200) fail(name, `HTTP ${response?.status()}`);
    await inspect(page, name);

    if (name === 'desktop-native-1505') {
      if ((await page.locator('[data-plan-step]').count()) !== 5) fail(name, 'fünfstufiger Fallplan fehlt');
      await page.locator('[data-edit-step="0"]').click();
      await page.locator('[data-step-owner]').selectOption({ label: 'AMAVIO Operations' });
      await page.locator('[data-step-due]').fill('Heute, 15:30');
      await page.locator('[data-save-step]').click();
      const step = await page.locator('[data-plan-step="step-1"]').innerText();
      if (!step.includes('AMAVIO Operations') || !step.includes('15:30')) fail(name, 'Planbearbeitung aktualisiert Verantwortung/Frist nicht');

      await page.locator('[data-toggle-reorder]').click();
      await page.locator('[data-move-step="down"][data-step-index="0"]').click();
      if (!(await page.locator('[data-plan-step]').first().innerText()).includes('Schlüsselzeit')) fail(name, 'Planreihenfolge ändert sich nicht');
      await page.locator('[data-summary-panel] [data-save-plan]').click();
      if (!(await page.locator('[data-case-state]').innerText()).includes('Plan lokal')) fail(name, 'Planvormerkung aktualisiert Fallstatus nicht');

      await page.locator('[data-work-mode="simulate"]').click();
      await page.locator('[data-simulation-select]').selectOption('housing_fails');
      await page.locator('[data-run-simulation]').click();
      if (!(await page.locator('[data-simulation-after]').innerText()).includes('Ersatzunterkunft')) fail(name, 'Simulation liefert keine Folgeabhängigkeit');
      if ((await page.locator('[data-affected-flow] div').count()) !== 3) fail(name, 'Simulation zeigt nicht drei Wirkungsfelder');
      await page.locator('[data-keep-scenario]').click();

      await page.locator('[data-work-mode="prepare"]').click();
      await page.locator('[data-document-type="sponsor"]').click();
      const draft = await page.evaluate(() => ({ subject: document.querySelector('[data-draft-subject]').value, body: document.querySelector('[data-draft-body]').value }));
      if (!draft.subject.includes('Entscheidungsbedarf') || !draft.body.includes('nicht versendet')) fail(name, 'Sponsor-Entwurf ist unvollständig');
      await page.locator('[data-save-draft]').click();
      if (!(await page.locator('[data-draft-status]').innerText()).includes('keine Außenwirkung')) fail(name, 'Entwurfsvormerkung verliert Wirkungsgrenze');

      await page.locator('[data-work-mode="understand"]').click();
      await page.locator('[data-run-completeness]').click();
      if (!(await page.locator('[data-completeness-result]').innerText()).includes('2 Angaben fehlen')) fail(name, 'Vollständigkeitsprüfung liefert kein Ergebnis');
      await page.locator('[data-assistant-input]').fill('Wer ist verantwortlich?');
      await page.locator('[data-assistant-input]').press('Enter');
      if (!(await page.locator('[data-assistant-answer]').innerText()).includes('Standortleitung')) fail(name, 'Kontextfrage liefert keine Rollenverantwortung');

      await page.locator('[data-work-mode="history"]').click();
      await page.locator('[data-decision-id="clarify"]').click();
      await page.locator('[data-confirm-decision]').click();
      if ((await page.locator('[data-local-history] li').count()) < 7) fail(name, 'Verlauf bildet die lokale Arbeitsspur nicht ab');

      await page.locator('[data-page-target="cases"]').click();
      await page.locator('[data-case-search]').fill('Neuss');
      if ((await page.locator('[data-table-case]').count()) !== 1) fail(name, 'Fallsuche filtert nicht');
      await page.locator('[data-table-case="A-2247"]').click();
      if (!(await page.locator('[data-case-title]').innerText()).includes('Dokumentübergabe')) fail(name, 'Fallöffnung aus Liste schlägt fehl');

      await page.locator('[data-role-target="employer"]').click();
      await page.locator('[data-employer-lens]').selectOption('budget');
      if (!(await page.locator('[data-case-title]').innerText()).includes('Budgetfreigabe')) fail(name, 'Budgetperspektive öffnet nicht den Budgetfall');
      if ((await page.locator('[data-priority-list] [data-case-id]').count()) !== 1) fail(name, 'Budgetperspektive priorisiert nicht eindeutig');

      await page.locator('[data-page-target="pilot"]').click();
      await page.locator('[data-runtime-state].is-online').waitFor();
      if (!(await page.locator('[data-runtime-state]').innerText()).includes('Backend und Datenbank aktiv')) fail(name, 'Backendstatus wird nicht als aktiv gezeigt');
      if (!(await page.locator('[data-pilot-case-title]').innerText()).includes('Wohnraumfreigabe')) fail(name, 'persistierter synthetischer Fall fehlt');
      await page.locator('[data-run-assistance]').click();
      await page.locator('[data-assistance-result]').waitFor({ state: 'visible' });
      if (!(await page.locator('[data-result-confidence]').innerText()).includes('0,72')) fail(name, 'strukturierte Konfidenz fehlt');
      if ((await page.locator('[data-result-evidence] li').count()) < 3) fail(name, 'Assistenzlauf liefert zu wenig Belege');
      if (!(await page.locator('[data-result-forbidden]').innerText()).includes('keine Nachricht senden')) fail(name, 'verbotene Außenwirkung fehlt');
      await page.locator('[data-review-note]').fill('Synthetische Belege im Browser-QA geprüft; keine Außenwirkung.');
      await page.locator('[data-review-decision="approved"]').click();
      await page.locator('[data-review-state].is-approved').waitFor();
      if (await page.locator('[data-create-preview="message"]').isDisabled()) fail(name, 'Sink-Vorschau bleibt nach Human Gate gesperrt');
      await page.locator('[data-create-preview="message"]').click();
      await page.waitForFunction(() => document.querySelector('[data-effect-status]').textContent.includes('sink_only'));
      if (!(await page.locator('[data-effect-status]').innerText()).includes('keine Außenwirkung')) fail(name, 'Outbox-Sink verliert Wirkungsgrenze');
      if ((await page.locator('[data-audit-list] li').count()) < 3) fail(name, 'Audit Trail bildet Systemlauf nicht ab');
      await page.screenshot({ path: path.join(out, `${name}-product-pilot.png`), fullPage: true });
    }

    if (viewport.width <= 768) {
      await page.locator('[data-menu-button]').click();
      if (!(await page.locator('body').evaluate((body) => body.classList.contains('nav-open')))) fail(name, 'mobile Navigation öffnet nicht');
      await page.locator('[data-page-target="cases"]').click();
      if (await page.locator('body').evaluate((body) => body.classList.contains('nav-open'))) fail(name, 'mobile Navigation schließt nicht');
      await page.locator('[data-table-case="A-2233"]').click();
      await page.locator('[data-work-mode="plan"]').click();
      if ((await page.locator('[data-plan-step]').count()) !== 5) fail(name, 'mobiler Plan unvollständig');
      if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'mobiler Fall erzeugt Seitenüberlauf');
      await page.locator('[data-menu-button]').click();
      await page.locator('[data-page-target="pilot"]').click();
      await page.locator('[data-runtime-state].is-online').waitFor();
      if (await page.locator('body').evaluate((body) => body.classList.contains('nav-open'))) fail(name, 'mobile Navigation schließt vor Produktpilot nicht');
      await page.waitForTimeout(260);
      if (await page.evaluate(() => window.scrollY > 1)) fail(name, 'mobiler Produktpilot öffnet nicht am Seitenanfang');
      if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) fail(name, 'mobiler Produktpilot erzeugt Seitenüberlauf');
      await page.screenshot({ path: path.join(out, `${name}-product-pilot.png`), fullPage: true });
    }

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, `${name}-plan.png`), fullPage: true });
    if (errors.length) fail(name, errors.join(' | '));
    console.log(`${name}: OK`);
    await context.close();
  }

  const reducedContext = await browser.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${base}/`, { waitUntil: 'networkidle' });
  const animation = await reducedPage.locator('[data-work-panel]:not([hidden])').evaluate((element) => getComputedStyle(element).animationName);
  if (animation !== 'none') fail('reduced-motion', `Animation bleibt aktiv: ${animation}`);
  await reducedContext.close();

  const missingContext = await browser.newContext(); const missingPage = await missingContext.newPage();
  const missing = await missingPage.goto(`${base}/nicht-vorhanden`, { waitUntil: 'domcontentloaded' });
  if (!missing || missing.status() !== 404) fail('http', `404 erwartet, erhalten ${missing?.status()}`);
  await missingContext.close(); await browser.close();

  if (failures.length) {
    console.error('\nAMAVIO ACC Calm but Capable V2 – Browser QA: FEHLER');
    failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
  }
  console.log(`\nAMAVIO ACC Productization Gate 01 – Browser QA: OK (${viewports.length} Viewports, fünf Arbeitsmodi, persistierter Produktpilot, Human Gate, Outbox-Sink, Audit Trail und Rollenadaption)`);
})();
