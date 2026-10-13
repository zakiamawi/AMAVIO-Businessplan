import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const external = readFileSync(new URL('../src/components/ExternalApp.jsx', import.meta.url), 'utf8')

test('the active App uses the approved AMAVIO One palette', () => {
  for (const token of ['#081527', '#0b1f3a', '#10253d', '#f7f4ec', '#ffffff', '#222222', '#c6a35a', '#7d6130']) assert.match(css.toLowerCase(), new RegExp(token))
  for (const forbidden of ['#007a78', '#031212', '#dff4ea', 'linear-gradient', 'radial-gradient']) assert.doesNotMatch(css.toLowerCase(), new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})

test('authoritative logo assets are bundled locally', () => {
  assert.equal(existsSync(new URL('../public/assets/brand/amavio-logo-primary.svg', import.meta.url)), true)
  assert.equal(existsSync(new URL('../public/assets/brand/amavio-logo-light.svg', import.meta.url)), true)
  assert.equal(existsSync(new URL('../public/assets/brand/amavio-signet.svg', import.meta.url)), true)
})

test('the layout avoids generic role switching and dashboard KPI copy', () => {
  assert.doesNotMatch(external, /KPI|Dashboard|Score|setRole|selectRole/i)
  assert.match(external, /priority-layout/)
  assert.match(external, /ArrivalProcessPanel/)
  assert.match(external, /Employer and operations control remains entirely in the separate Arrival Control Center/)
})
