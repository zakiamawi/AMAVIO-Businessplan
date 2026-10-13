import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const external = readFileSync(new URL('../src/components/ExternalApp.jsx', import.meta.url), 'utf8')
const routes = readFileSync(new URL('../src/data/routes.js', import.meta.url), 'utf8')
const vite = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')
const primitives = readFileSync(new URL('../src/components/Primitives.jsx', import.meta.url), 'utf8')

test('the active build has one App entry point and no ACC client', () => {
  assert.equal(existsSync(new URL('../acc.html', import.meta.url)), false)
  assert.doesNotMatch(vite, /acc\.html|acc-main/)
  assert.match(external, /externalRoles/)
})

test('only the three external roles exist in the active route contract', () => {
  assert.match(routes, /professional/)
  assert.match(routes, /housing/)
  assert.match(routes, /partner/)
  assert.doesNotMatch(routes, /export const accRoles|export const accRoutes|E-01|O-01/)
  assert.doesNotMatch(external, /accRoles|accRoutes|operationsCases|employerCases/)
})

test('the App offers no free role switch', () => {
  assert.doesNotMatch(external, /setRole|selectRole|role-switch/i)
})

test('the active interface uses authoritative logo assets instead of a text wordmark', () => {
  assert.match(primitives, /amavio-logo-primary\.svg/)
  assert.match(primitives, /amavio-logo-light\.svg/)
  assert.doesNotMatch(primitives, />AMAVIO\s*<b>/)
})
