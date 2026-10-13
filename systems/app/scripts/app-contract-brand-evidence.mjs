import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium, firefox, webkit } from 'playwright'

const baseUrl = process.env.APP_BASE_URL || 'http://127.0.0.1:4350'
const evidenceDir = join(process.cwd(), 'QA')
const screenshotDir = join(evidenceDir, 'Screenshots', 'V2_4_R2_Foundation')
const resultPath = join(evidenceDir, 'V2_4_R2_BROWSER_RESULT_20261010.json')
const matrixPath = join(evidenceDir, 'V2_4_R2_ROLE_MATRIX_20261010.csv')

const roles = [
  { id: 'professional', route: 'P-01', de: 'Fachkraft', en: 'Professional' },
  { id: 'housing', route: 'H-01', de: 'Wohnanbieter', en: 'Housing provider' },
  { id: 'partner', route: 'L-01', de: 'Lokaler Partner', en: 'Local partner' },
]
const viewports = {
  desktop: { width: 1440, height: 1024 },
  intermediate: { width: 1180, height: 820 },
  mobile: { width: 390, height: 844 },
}
const engines = [
  {
    name: 'Chromium',
    launcher: chromium,
    executablePath: join(homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
  },
  {
    name: 'WebKit',
    launcher: webkit,
    executablePath: join(homedir(), 'Library/Caches/ms-playwright/webkit-2359/pw_run.sh'),
  },
  {
    name: 'Firefox',
    launcher: firefox,
  },
]

function roleUrl(role, lang) {
  const state = role.id === 'professional' ? 'WAITING' : 'NORMAL'
  return `${baseUrl}/?role=${role.id}&route=${role.route}&state=${state}&lang=${lang}`
}

async function inspect(page, engine, role, lang, viewportName) {
  const expectedRole = role[lang]
  const result = await page.evaluate(({ expectedRole, lang, viewportName }) => {
    const visibleButtons = [...document.querySelectorAll('button')].filter((button) => {
      const rect = button.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })
    const shortTargets = visibleButtons.filter((button) => {
      const rect = button.getBoundingClientRect()
      return viewportName === 'mobile' && (rect.width < 44 || rect.height < 44)
    })
    const text = document.body.innerText
    const logo = document.querySelector('.brand-mark img')
    const phaseRail = document.querySelector('.arrival-phase-rail')
    const trustBoundary = (document.querySelector('.trust-boundary')?.textContent || '').trim()
    const forbidden = ['Arrival Cases', 'Kostenfreigaben', 'Operationslast', 'AMAVIO Operations']
    return {
      title: document.title,
      roleVisible: text.includes(expectedRole),
      boundaryVisible: lang === 'de'
        ? text.includes('Lokale synthetische Zielprojektion')
        : text.includes('Local synthetic target projection'),
      logoLoaded: Boolean(logo?.complete && logo.naturalWidth > 0),
      trustBoundary,
      trustBoundaryLocalized: lang === 'de'
        ? trustBoundary.startsWith('Ausgeschlossen:')
        : trustBoundary.startsWith('Excluded:') && !/\bkein(?:e|en|er|es)?\b/i.test(trustBoundary),
      phaseCount: phaseRail?.querySelectorAll(':scope > li').length || 0,
      mainCount: document.querySelectorAll('main').length,
      h1Count: document.querySelectorAll('h1').length,
      dialogCount: document.querySelectorAll('[role="dialog"]').length,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      unnamedButtons: visibleButtons.filter((button) => !(button.getAttribute('aria-label') || button.textContent || '').trim()).length,
      shortTargets: shortTargets.length,
      accTerms: forbidden.filter((term) => text.includes(term)),
      activeAccEntry: Boolean(document.querySelector('a[href*="acc.html"], button[data-role="operations"], button[data-role="employer"]')),
      runtimeConnected: document.querySelector('.r2-runtime')?.getAttribute('data-runtime-status') === 'connected',
    }
  }, { expectedRole, lang, viewportName })

  const failures = []
  if (!result.title.startsWith('AMAVIO One')) failures.push(`title:${result.title}`)
  if (!result.roleVisible) failures.push('role-label')
  if (!result.boundaryVisible) failures.push('synthetic-boundary')
  if (!result.logoLoaded) failures.push('brand-logo')
  if (!result.trustBoundaryLocalized) failures.push(`trust-boundary-language:${result.trustBoundary}`)
  if (result.phaseCount !== 7) failures.push(`phases:${result.phaseCount}`)
  if (result.mainCount !== 1) failures.push(`main:${result.mainCount}`)
  if (result.h1Count !== 1) failures.push(`h1:${result.h1Count}`)
  if (result.dialogCount !== 0) failures.push(`dialog:${result.dialogCount}`)
  if (result.horizontalOverflow) failures.push('horizontal-overflow')
  if (result.unnamedButtons) failures.push(`unnamed-buttons:${result.unnamedButtons}`)
  if (result.shortTargets) failures.push(`short-touch-targets:${result.shortTargets}`)
  if (result.accTerms.length) failures.push(`acc-terms:${result.accTerms.join('|')}`)
  if (result.activeAccEntry) failures.push('active-acc-entry')
  if (!result.runtimeConnected) failures.push('r2-runtime-not-connected')

  return {
    engine,
    role: role.id,
    lang,
    viewport: viewportName,
    result: failures.length ? 'FAIL' : 'PASS',
    failures,
  }
}

async function verifyDialog(page) {
  const trigger = page.locator('.state-panel .button.primary')
  await trigger.focus()
  await trigger.click()
  const dialog = page.locator('[role="dialog"]')
  await dialog.waitFor({ state: 'visible' })
  const initialFocus = await page.evaluate(() => document.activeElement?.hasAttribute('data-initial-focus'))
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'detached' })
  await page.evaluate(() => new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))))
  const focusReturned = await trigger.evaluate((node) => document.activeElement === node)
  return { opened: true, initialFocus, escapeClosed: true, focusReturned }
}

async function verifyNavigation(page) {
  const previousRoute = new URL(page.url()).searchParams.get('route')
  const next = page.locator('.mobile-route-nav > button').nth(1)
  await next.click()
  const currentRoute = new URL(page.url()).searchParams.get('route')
  return { previousRoute, currentRoute, changed: Boolean(currentRoute && currentRoute !== previousRoute) }
}

async function verifyAssistance(page) {
  await page.locator('.process-details summary').click()
  const trigger = page.getByRole('button', { name: /Nächsten Schritt erklären|Explain next step/ })
  await trigger.click()
  const result = page.locator('.assistance-result')
  await result.waitFor({ state: 'visible' })
  const text = await result.innerText()
  return {
    visible: true,
    noDecisionBoundary: /keine Entscheidung|does not .*make a decision/i.test(text),
    text,
  }
}

await mkdir(screenshotDir, { recursive: true })
const matrix = []
const consoleErrors = []
const engineFailures = []
let dialogInteraction = null
let mobileNavigation = null
let assistanceInteraction = null

for (const engine of engines) {
  let browser
  try {
    browser = await engine.launcher.launch({ headless: true, ...(engine.executablePath ? { executablePath: engine.executablePath } : {}) })
    const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' })
    const page = await context.newPage()
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(`${engine.name}: ${message.text()}`)
    })
    page.on('pageerror', (error) => consoleErrors.push(`${engine.name}: ${error.message}`))

    for (const role of roles) {
      for (const lang of ['de', 'en']) {
        for (const [viewportName, viewport] of Object.entries(viewports)) {
          await page.setViewportSize(viewport)
          await page.goto(roleUrl(role, lang), { waitUntil: 'networkidle' })
          matrix.push(await inspect(page, engine.name, role, lang, viewportName))
        }
      }
    }

    if (engine.name === 'Chromium') {
      await page.setViewportSize(viewports.desktop)
      await page.goto(roleUrl(roles[0], 'de'), { waitUntil: 'networkidle' })
      dialogInteraction = await verifyDialog(page)
      assistanceInteraction = await verifyAssistance(page)
      await page.screenshot({ path: join(screenshotDir, 'Desktop_Professional_DE_Viewport.png') })
      await page.screenshot({ path: join(screenshotDir, 'Desktop_Professional_DE_Full.png'), fullPage: true })

      await page.setViewportSize(viewports.mobile)
      await page.goto(roleUrl(roles[1], 'de'), { waitUntil: 'networkidle' })
      mobileNavigation = await verifyNavigation(page)
      await page.screenshot({ path: join(screenshotDir, 'Mobile_Housing_DE_Viewport.png') })
      await page.screenshot({ path: join(screenshotDir, 'Mobile_Housing_DE_Full.png'), fullPage: true })

      await page.setViewportSize(viewports.desktop)
      await page.goto(roleUrl(roles[2], 'en'), { waitUntil: 'networkidle' })
      await page.screenshot({ path: join(screenshotDir, 'Desktop_Partner_EN_Viewport.png') })
    }
    await context.close()
  } catch (error) {
    engineFailures.push(`${engine.name}: ${error.message}`)
  } finally {
    await browser?.close()
  }
}

const failures = [
  ...engineFailures,
  ...consoleErrors.map((error) => `console:${error}`),
  ...matrix.filter((row) => row.result === 'FAIL').map((row) => `${row.engine}:${row.role}:${row.lang}:${row.viewport}:${row.failures.join('|')}`),
  ...(!dialogInteraction?.initialFocus ? ['dialog-initial-focus'] : []),
  ...(!dialogInteraction?.focusReturned ? ['dialog-focus-return'] : []),
  ...(!mobileNavigation?.changed ? ['mobile-navigation'] : []),
  ...(!assistanceInteraction?.noDecisionBoundary ? ['assistance-decision-boundary'] : []),
]

const headers = ['engine', 'role', 'lang', 'viewport', 'result', 'failures']
const csv = [
  headers.join(','),
  ...matrix.map((row) => headers.map((header) => header === 'failures' ? `"${row.failures.join(';')}"` : row[header]).join(',')),
].join('\n') + '\n'

await writeFile(matrixPath, csv, 'utf8')
await writeFile(resultPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  baseUrl,
  engines: engines.map((engine) => engine.name),
  roles: roles.map((role) => role.id),
  languages: ['de', 'en'],
  viewports,
  matrixChecks: matrix.length,
  dialogInteraction,
  mobileNavigation,
  assistanceInteraction,
  consoleErrors,
  failures,
  result: failures.length ? 'FAIL' : 'PASS',
}, null, 2) + '\n', 'utf8')

console.log(`AMAVIO One App browser evidence: ${matrix.length}/${engines.length * roles.length * 2 * Object.keys(viewports).length} matrix checks executed, ${failures.length} failures.`)
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
}
