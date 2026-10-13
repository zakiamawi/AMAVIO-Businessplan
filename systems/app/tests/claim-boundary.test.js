import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

function sourceFiles(folder) {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name)
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(js|jsx|css)$/.test(name) ? [path] : []
  })
}

const corpus = sourceFiles(fileURLToPath(new URL('../src', import.meta.url))).map((path) => readFileSync(path, 'utf8')).join('\n')

test('no productive architecture or automated-decision claim is introduced', () => {
  const forbidden = [
    /produktive Authentifizierung/i,
    /Backend verbunden/i,
    /Datenbank verbunden/i,
    /automatisch(?:e|er|en)? Entscheidung/i,
    /KI entscheidet/i,
    /garantiert(?:e|er|en)? (?:Wohnung|Ankunft|Ergebnis|Retention)/i,
    /erfolgreich gebucht/i,
  ]
  for (const pattern of forbidden) assert.doesNotMatch(corpus, pattern)
})

test('synthetic and non-effect boundaries are visible in the App', () => {
  assert.match(corpus, /keine echten Personen, Fälle oder externen Systemwirkungen/)
  assert.match(corpus, /Keine reale Einreichung, Buchung, Freigabe oder Nachricht/)
  assert.match(corpus, /Arbeitgeber- und Operationssteuerung bleibt vollständig im getrennten Arrival Control Center/)
})
