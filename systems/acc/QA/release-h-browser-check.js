const fs = require("fs");
const path = require("path");
const os = require("os");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-h-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function assertRole(page, expected) {
  await page.waitForFunction((label) => document.querySelector("[data-ops-role-label]")?.textContent.trim() === label, expected.label);
  const report = await page.evaluate(() => ({
    label: document.querySelector("[data-ops-role-label]")?.textContent.trim(),
    title: document.querySelector("[data-ops-role-title]")?.textContent.trim(),
    cases: document.querySelectorAll("[data-ops-case-id]").length,
    journey: [...document.querySelectorAll("[data-ops-mode] b")].map((item) => item.textContent.trim()),
    kernelVisible: [...document.querySelectorAll(".kernel-workbench")].some((item) => item.offsetParent !== null),
    evidenceActions: document.querySelectorAll("[data-ops-review-evidence]").length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    consoleBoundary: document.body.innerText.includes("Lokale synthetische Sitzung · serverseitig begrenzt"),
  }));
  if (report.label !== expected.label) fail(expected.key, `Rollenlabel ${report.label}`);
  if (report.title !== expected.title) fail(expected.key, `Scope ${report.title}`);
  if (report.cases !== expected.cases) fail(expected.key, `Fallzahl ${report.cases} statt ${expected.cases}`);
  if (report.journey.join("|") !== expected.journey.join("|")) fail(expected.key, `Journey ${report.journey.join("|")}`);
  if (report.kernelVisible !== expected.kernelVisible) fail(expected.key, `sichtbare interne Kernel-Arbeitsfläche: ${report.kernelVisible}`);
  if (expected.evidenceActions !== undefined && report.evidenceActions !== expected.evidenceActions) fail(expected.key, `Evidenzaktionen ${report.evidenceActions}`);
  if (report.overflow) fail(expected.key, "horizontaler Seitenüberlauf");
  if (!report.consoleBoundary) fail(expected.key, "serverseitige Rollenkennzeichnung fehlt");
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-h-browser-"));
  const application = createApplication({ databasePath: path.join(directory, "browser.sqlite"), providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${application.server.address().port}`;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      const externalRequests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("request", (request) => { if (!request.url().startsWith(base)) externalRequests.push(request.url()); });
      await page.goto(`${base}/?page=operations`, { waitUntil: "networkidle" });

      await assertRole(page, { key: `operations-${viewport.width}`, label: "AMAVIO Operations", title: "Vollständige operative Fallsteuerung", cases: 5, journey: ["Evidenz", "Verantwortung", "Simulation", "Entscheidung", "Arbeitsprodukt"], kernelVisible: true, evidenceActions: 6 });

      await page.locator('[data-role-target="employer"]').click();
      await assertRole(page, { key: `sponsor-${viewport.width}`, label: "Arbeitgeber · Sponsor", title: "Entscheidungs- und Eskalationssicht", cases: 5, journey: ["Statusgrundlage", "Sponsor-Verantwortung", "Auswirkungen", "Entscheidung", "Freigegebener Status"], kernelVisible: false, evidenceActions: 0 });
      await page.locator('[data-ops-mode="decision"]').click();
      if (!(await page.locator("[data-ops-decision-form]").isVisible())) fail(`sponsor-${viewport.width}`, "zugewiesene Sponsorentscheidung fehlt");

      await page.locator("[data-employer-lens]").selectOption("hr");
      await assertRole(page, { key: `hr-${viewport.width}`, label: "Arbeitgeber · HR Operations", title: "HR-Aufgaben und Arbeitgeberbelege", cases: 1, journey: ["Arbeitgeberbelege", "HR-Aufgaben", "Terminbezug", "Rückfragen", "Status"], kernelVisible: false, evidenceActions: 2 });
      await page.locator('[data-ops-mode="responsibility"]').click();
      if ((await page.locator("[data-ops-complete-task]").count()) !== 1) fail(`hr-${viewport.width}`, "HR-Aufgabe ist nicht exklusiv bearbeitbar");

      await page.locator("[data-employer-lens]").selectOption("location");
      await assertRole(page, { key: `location-${viewport.width}`, label: "Arbeitgeber · Standort", title: "Standort- und Übergabeverantwortung", cases: 2, journey: ["Standortangaben", "Übergaben", "Termine", "Bestätigung", "Status"], kernelVisible: false, evidenceActions: 6 });

      await page.locator("[data-employer-lens]").selectOption("budget");
      await assertRole(page, { key: `budget-${viewport.width}`, label: "Arbeitgeber · Budget", title: "Kostenprüfung und Budgetfreigabe", cases: 1, journey: ["Kostengrundlage", "Budgetaufgabe", "Auswirkung", "Freigabe", "Beschluss"], kernelVisible: false, evidenceActions: 4 });
      await page.locator('[data-ops-mode="decision"]').click();
      if (!(await page.locator("[data-ops-decision-form]").isVisible())) fail(`budget-${viewport.width}`, "zugewiesene Budgetentscheidung fehlt");

      const denied = await page.evaluate(async () => {
        const response = await fetch("/api/kernel/v2/status", { headers: { "x-demo-session": "demo-session-employer-budget" } });
        return { status: response.status, body: await response.json() };
      });
      if (denied.status !== 403 || denied.body.code !== "role_scope_denied") fail(`budget-${viewport.width}`, "direkter Kernel-Zugriff wird nicht serverseitig abgewiesen");

      await page.locator('[data-role-target="admin"]').click();
      await assertRole(page, { key: `back-to-operations-${viewport.width}`, label: "AMAVIO Operations", title: "Vollständige operative Fallsteuerung", cases: 5, journey: ["Evidenz", "Verantwortung", "Simulation", "Entscheidung", "Arbeitsprodukt"], kernelVisible: true, evidenceActions: 6 });
      await page.screenshot({ path: path.join(out, `${viewport.width}-role-contract.png`), fullPage: true });

      if (externalRequests.length) fail(`network-${viewport.width}`, `externe Requests: ${externalRequests.join(", ")}`);
      const unexpectedErrors = errors.filter((message) => !message.includes("status of 403"));
      if (unexpectedErrors.length) fail(`runtime-${viewport.width}`, unexpectedErrors.join(" | "));
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => application.server.close(resolve));
  }

  if (failures.length) {
    console.error("\nAMAVIO ACC Release H – Browser QA: FEHLER");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log("\nAMAVIO ACC Release H – Browser QA: OK (Operations + 4 Arbeitgeberrollen, Desktop + Mobile, serverseitige Negativprobe, keine externen Requests)");
})();
