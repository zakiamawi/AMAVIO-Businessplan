import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const external = readFileSync(new URL('../src/components/ExternalApp.jsx', import.meta.url), 'utf8')
const dialog = readFileSync(new URL('../src/components/FocusDialog.jsx', import.meta.url), 'utf8')
const statePanel = readFileSync(new URL('../src/components/StatePanel.jsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('the App exposes skip link main landmark and focusable H1', () => {
  assert.match(external, /<SkipLink/)
  assert.match(external, /<main id="main-content"[^>]*tabIndex="-1"/)
  assert.match(external, /<h1 id="page-title" ref=\{headingRef\} tabIndex="-1"/)
  assert.match(external, /\.focus\(\{ preventScroll: true \}\)/)
})

test('dialog has modal semantics focus trap escape and return focus', () => {
  assert.match(dialog, /role="dialog"/)
  assert.match(dialog, /aria-modal="true"/)
  assert.match(dialog, /event\.key === 'Escape'/)
  assert.match(dialog, /event\.key !== 'Tab'/)
  assert.match(dialog, /returnTarget\.isConnected/)
  assert.match(dialog, /returnTarget\.focus\(\{ preventScroll: true \}\)/)
  assert.match(external, /returnFocusRef=\{dialogTriggerRef\}/)
})

test('status changes use explicit live regions and non-colour cues', () => {
  assert.match(statePanel, /aria-live=\{urgent \? 'assertive' : 'polite'\}/)
  assert.match(statePanel, /aria-atomic="true"/)
  assert.match(css, /border-left: 5px solid/)
  assert.match(css, /@media \(forced-colors: active\)/)
})

test('touch target reflow and reduced-motion baselines exist', () => {
  assert.match(css, /--touch: 44px/)
  assert.match(css, /min-height: 48px/)
  assert.match(css, /@media \(max-width: 480px\)/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.doesNotMatch(css, /overflow-x:\s*auto[^}]*mobile-route-nav/)
})

test('focus indication uses the Brandbook gold focus token', () => {
  assert.match(css, /--focus: #c6a35a/)
  assert.match(css, /:focus-visible \{ outline: 3px solid var\(--focus\); outline-offset: 3px; \}/)
})
