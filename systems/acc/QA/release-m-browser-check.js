const fs = require("fs");
const os = require("os");
const path = require("path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-m-screens");
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

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 1050 }, { width: 820, height: 1050 }, { width: 390, height: 844 }]) {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), `amavio-release-m-${viewport.width}-`));
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
        await page.goto(`${base}/?page=operations&opsCase=SYN-CASE-001&opsMode=responsibility`, { waitUntil: "networkidle" });
        await ready(page);
        await page.locator('[data-ops-panel="responsibility"]:not([hidden]) [data-execution-orders] .execution-order').nth(3).waitFor();
        if ((await page.locator("[data-execution-orders] .execution-order").count()) !== 4) fail(scope, "vierstufiger Ausführungsweg fehlt");
        if ((await page.locator("[data-execution-order-form]").count()) !== 1) fail(scope, "Start zeigt nicht genau einen ausführbaren AMAVIO-Auftrag");
        if (await page.locator(".ops-tasks").isVisible()) fail(scope, "alter Aufgabenblock konkurriert mit dem Ausführungsweg");
        await noOverflow(page, `${scope}-operations-start`);
        await page.screenshot({ path: path.join(out, `${scope}-01-operations-path.png`), fullPage: true });

        await page.locator("[data-execution-order-form] button").click();
        await page.locator('[data-execution-progress]').filter({ hasText: "1 von 4" }).waitFor();
        if ((await page.locator("[data-execution-order-form]").count()) !== 0) fail(scope, "AMAVIO kann Arbeitgeberauftrag direkt ausführen");

        await page.locator('[data-role-target="employer"]').click();
        await page.waitForURL((url) => url.searchParams.get("page") === "collaboration" && url.searchParams.get("role") === "employer");
        await page.locator("[data-employer-lens]").selectOption("location");
        await page.waitForURL((url) => url.searchParams.get("lens") === "location");
        await page.locator("[data-execution-employer]:not([hidden]) [data-execution-handoff-form]").waitFor();
        if (await page.locator("[data-collab-form]").isVisible()) fail(scope, "generisches Beitragsformular konkurriert mit der konkreten Rollenübergabe");
        await noOverflow(page, `${scope}-employer-handoff`);
        await page.screenshot({ path: path.join(out, `${scope}-02-employer-handoff.png`), fullPage: true });
        await page.locator('[data-execution-handoff-form] button[data-decision="acknowledged"]').click();
        await page.locator("[data-execution-employer]").filter({ hasText: "Bestätigt" }).waitFor();

        await page.locator('[data-role-target="admin"]').click();
        await page.waitForURL((url) => url.searchParams.get("page") === "operations" && !url.searchParams.has("role"));
        await page.locator('[data-ops-mode="responsibility"]').click();
        await page.locator('[data-execution-order-form="SYN-EXEC-WO-003"] button').waitFor();
        await page.locator('[data-execution-order-form="SYN-EXEC-WO-003"] button').click();
        await page.locator('[data-ops-mode="decision"]').click();
        await page.locator("[data-execution-decision-form]").waitFor();
        await page.screenshot({ path: path.join(out, `${scope}-03-human-decision.png`), fullPage: true });
        await page.locator("[data-execution-decision-form] button").click();
        await page.locator("[data-execution-decision]").filter({ hasText: "Menschlich dokumentiert" }).waitFor();
        await page.locator('[data-ops-mode="products"]').click();
        await page.locator("[data-execution-result]").filter({ hasText: "Lokal entschieden" }).waitFor();
        await noOverflow(page, `${scope}-result`);
        await page.screenshot({ path: path.join(out, `${scope}-04-operational-result.png`), fullPage: true });

        await page.locator('.main-nav [data-page-target="programs"]').evaluate((button) => button.click());
        await page.waitForURL((url) => url.searchParams.get("page") === "programs");
        await page.locator("[data-execution-program-impact]").filter({ hasText: "Beratend" }).waitFor();
        await noOverflow(page, `${scope}-program-impact`);
        await page.screenshot({ path: path.join(out, `${scope}-05-program-impact.png`), fullPage: true });

        const health = await page.evaluate(() => window.AMAVIO_RUNTIME.getState().health);
        if (!["M", "N"].includes(health.release) || health.providerCalls !== 0 || health.externalEffects !== false || health.operationalExecutionLoop !== true) fail(scope, `Health-Vertrag: ${JSON.stringify(health)}`);
        if (external.length) fail(`${scope}-network`, external.join(", "));
        if (errors.length) fail(`${scope}-console`, errors.join(" | "));
      } finally {
        await context.close();
        await new Promise((resolve) => application.server.close(resolve));
      }
    }
  } finally { await browser.close(); }

  if (failures.length) {
    console.error("AMAVIO ACC Release M – Browser QA: FEHLER");
    failures.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log("AMAVIO ACC Release M – Browser QA: OK (4-stufige Ausführung, Arbeitgeber-Übergabe, Human Gate, Ergebnis, beratende Programmfolge, Desktop/Tablet/Mobil, keine externen Requests)");
})();
