import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "QA", "Screenshots");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const result = { generatedAt: new Date().toISOString(), checks: [] };

async function capture(name, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4360/", { waitUntil: "networkidle" });
  const bodyFits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: false });
  const visible = {
    title: viewport.width <= 760
      ? await page.getByText("Aktiver Fokus", { exact: true }).isVisible()
      : await page.getByRole("heading", { name: "CRM Cockpit", exact: true }).isVisible(),
    pipeline: await page.getByRole("heading", { name: "Pipeline", exact: true }).first().isVisible(),
    synthetic: await page.getByText("Synthetische Arbeitsdaten · lokal", { exact: true }).first().isVisible(),
  };
  result.checks.push({ name, viewport, bodyFits, errors, visible });
  await page.close();
}

await capture("AMAVIO_ONE_CRM_DESKTOP_RENDER_1600x1000", { width: 1600, height: 1000 });
await capture("AMAVIO_ONE_CRM_MOBILE_RENDER_430x932", { width: 430, height: 932 });
await browser.close();
await writeFile(path.join(root, "QA", "CRM_BROWSER_RESULT_20261008.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");

for (const check of result.checks) {
  if (!check.bodyFits || check.errors.length || Object.values(check.visible).some((value) => !value)) {
    console.error(JSON.stringify(check, null, 2));
    process.exitCode = 1;
  }
}

if (!process.exitCode) console.log("AMAVIO One CRM browser capture: OK");
