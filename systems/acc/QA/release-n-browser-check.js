const fs = require("fs");
const os = require("os");
const path = require("path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-n-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function ready(page) {
  await page.waitForFunction(() => document.body.dataset.runtime === "ready");
  await page.waitForFunction(() => document.querySelector("[data-runtime-status]")?.textContent?.includes("Lokales System bereit"));
}
async function noOverflow(page, scope) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) fail(scope, `horizontaler Überlauf ${overflow}px`);
}
async function noVisibleSponsor(page, scope) {
  const text = await page.locator("main .page:not([hidden])").innerText();
  if (/\bSponsor\b/i.test(text)) fail(scope, `unverständlicher Rollenbegriff sichtbar: ${text.match(/.{0,25}\bSponsor\b.{0,25}/i)?.[0]}`);
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 1050 }, { width: 820, height: 1050 }, { width: 390, height: 844 }]) {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), `amavio-release-n-${viewport.width}-`));
      const application = createApplication({ databasePath: path.join(directory, "browser.sqlite"), providerMode: "local" });
      await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
      const base = `http://127.0.0.1:${application.server.address().port}`;
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      const external = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("request", (request) => { if (!request.url().startsWith(base)) external.push(request.url()); });
      const scope = String(viewport.width);
      try {
        await page.goto(`${base}/?page=collaboration&role=employer&lens=sponsor&opsCase=SYN-CASE-001`, { waitUntil: "networkidle" });
        await ready(page);
        await page.locator("[data-employer-area-title]").filter({ hasText: "Gesamtsteuerung" }).waitFor();
        await page.locator("[data-collab-role-label]").filter({ hasText: "Arbeitgeber · Gesamtsteuerung" }).waitFor();
        const navText = await page.locator(".main-nav").innerText();
        if (!navText.includes("Aufgaben & Entscheidungen") || !navText.includes("Ankunftsprogramme")) fail(`${scope}-navigation`, navText);
        if (!(await page.locator(".employer-scope-map").isVisible())) fail(`${scope}-task-room`, "Auftrag des Arbeitsbereichs fehlt");
        if (!(await page.locator(".employer-case-context").isVisible())) fail(`${scope}-task-room`, "fachliche Aufgabeneinordnung fehlt");
        await noVisibleSponsor(page, `${scope}-task-room`);
        await noOverflow(page, `${scope}-task-room`);
        await page.screenshot({ path: path.join(out, `${scope}-01-gesamtsteuerung.png`), fullPage: true });

        for (const [lens, label] of [["hr", "Personal & Onboarding"], ["location", "Standort & Übergabe"], ["budget", "Budget & Freigaben"]]) {
          await page.locator("[data-employer-lens]").selectOption(lens);
          await page.waitForURL((url) => url.searchParams.get("lens") === lens);
          await page.locator("[data-employer-area-title]").filter({ hasText: label }).waitFor();
          if ((await page.locator("[data-profile-role]").textContent()).trim() !== label) fail(`${scope}-${lens}`, "Profil und Arbeitsbereich stimmen nicht überein");
        }
        await page.screenshot({ path: path.join(out, `${scope}-02-budget-aufgabe.png`), fullPage: true });

        if (viewport.width <= 860) {
          await page.locator("[data-menu-button]").click();
          await page.waitForFunction(() => document.body.classList.contains("nav-open"));
        }
        await page.locator('.main-nav [data-page-target="programs"]').click();
        await page.waitForURL((url) => url.searchParams.get("page") === "programs" && url.searchParams.get("role") === "employer");
        await page.locator("[data-program-title]").filter({ hasText: "Ankunftsprogramme" }).waitFor();
        await page.locator("[data-program-area-title]").filter({ hasText: "Budget & Freigaben" }).waitFor();
        if (!(await page.locator(".program-employer-focus").isVisible())) fail(`${scope}-programs`, "fachlicher Arbeitgeberbeitrag zum Programm fehlt");
        if (!(await page.locator("[data-program-decisions]").isVisible())) fail(`${scope}-programs`, "Aufgaben und Entscheidungen fehlen");
        await noVisibleSponsor(page, `${scope}-programs`);
        await noOverflow(page, `${scope}-programs`);
        await page.screenshot({ path: path.join(out, `${scope}-03-ankunftsprogramme.png`), fullPage: true });

        const health = await page.evaluate(() => window.AMAVIO_RUNTIME.getState().health);
        if (health.release !== "N" || health.employerWorkspace !== true || health.providerCalls !== 0 || health.externalEffects !== false) fail(scope, `Health-Vertrag: ${JSON.stringify(health)}`);
        if (external.length) fail(`${scope}-network`, external.join(", "));
        if (errors.length) fail(`${scope}-console`, errors.join(" | "));
      } finally {
        await context.close();
        await new Promise((resolve) => application.server.close(resolve));
      }
    }
  } finally { await browser.close(); }

  if (failures.length) {
    console.error("AMAVIO ACC Release N – Browser QA: FEHLER");
    failures.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log("AMAVIO ACC Release N – Browser QA: OK (verständliche Arbeitgeberbereiche, tiefe Aufgaben- und Programmarbeit, Desktop/Tablet/Mobil, keine externen Requests)");
})();
