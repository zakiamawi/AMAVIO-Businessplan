import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { evaluateAccPeerProfile } from '../server/readiness-policy.mjs'

const defaultAccPath = resolve('../../10_Control_Center/20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working')
const accPath = resolve(process.env.AMAVIO_ACC_REFERENCE_PATH || defaultAccPath)
const evidenceDir = resolve('QA')
const jsonPath = resolve(evidenceDir, 'APP_ACC_COMPATIBILITY_AUDIT_20261010.json')
const markdownPath = resolve(evidenceDir, 'APP_ACC_COMPATIBILITY_AUDIT_20261010.md')

const referenceFiles = [
  'README.md',
  'APP_ACC_INTERFACE_BOUNDARY_20260930.md',
  'architecture/ADR-008_RELEASE_J5_DUAL_SIDED_WORKFLOW_20261010.md',
  'architecture/AMAVIO_ACC_ROLE_CONTRACT_V1_20261008.md',
  'QA/ACC_RELEASE_J5_DUAL_SIDED_WORKFLOW_QA_20261010.md',
  'backend/server.mjs',
  'backend/collaboration.mjs',
  'QA/collaboration.test.mjs',
]

if (!existsSync(accPath)) throw new Error(`ACC reference path is unavailable: ${accPath}`)

const sources = []
for (const relativePath of referenceFiles) {
  const absolutePath = resolve(accPath, relativePath)
  const sourceText = await readFile(absolutePath, 'utf8')
  sources.push({
    relativePath,
    sha256: createHash('sha256').update(sourceText).digest('hex'),
    sourceText,
  })
}

const corpus = sources.map((source) => source.sourceText).join('\n')
const capabilityChecks = {
  versioned_message_envelope: /1\.1\.0-local-r2-foundation|amavio-one\.app-acc-interface|versioned_message_envelope/i.test(corpus),
  correlation_id: /correlationId|correlation_id|Korrelations-ID/i.test(corpus),
  idempotency_key: /idempotenz|idempotency-key|idempotency_key/i.test(corpus),
  expected_revision: /expectedRevision|expected_revision|optimistische.*Version|Versionsprüfung/i.test(corpus),
  app_to_acc_consumer: /\/api\/v1\/integration\/acc\/messages/.test(corpus),
  acc_to_app_sender: /\/api\/v1\/integration\/acc\/outbox/.test(corpus),
  negative_rights_enforcement: /role_scope_denied|Negativrecht|verbotene Arbeitgeberaufrufe/i.test(corpus),
  role_minimised_projection: /rollenbezogenes View Model|minimierte Teilansichten|Rollenprojektion/i.test(corpus),
  audit_trace: /Audit Trail|Auditspur|audit/i.test(corpus),
  replay_and_reconciliation_behavior: /message.{0,40}reconciliation|reconciliation.{0,40}message|app.{0,40}replay/i.test(corpus),
}

const peerProfile = {
  release: 'J.5',
  interfaceContractVersion: corpus.includes('1.1.0-local-r2-foundation') ? '1.1.0-local-r2-foundation' : null,
  syntheticOnly: /syntheticOnly\s*[:=]\s*true|ausschließlich lokale, synthetische|lokal, synthetisch/i.test(corpus),
  externalEffects: /externalEffects?\s*[:=]\s*false|Null-Außenwirkung|keine externen Requests|keine Außenwirkung/i.test(corpus) ? false : null,
  capabilities: Object.entries(capabilityChecks).filter(([, present]) => present).map(([name]) => name),
}

const assessment = evaluateAccPeerProfile(peerProfile)
const report = {
  generatedAt: new Date().toISOString(),
  auditType: 'read_only_cross_codebase_contract_audit',
  appRelease: '2.4.4-cross-system-alignment.1',
  appInterfaceContractVersion: '1.1.0-local-r2-foundation',
  accReference: {
    release: 'J.5',
    path: accPath,
    modified: false,
    sources: sources.map(({ relativePath, sha256 }) => ({ relativePath, sha256 })),
  },
  sharedFoundationsObserved: {
    syntheticOnly: peerProfile.syntheticOnly,
    externalEffects: peerProfile.externalEffects,
    sqlitePersistence: /SQLite/i.test(corpus),
    humanGate: /Human Gate|Human-Gate/i.test(corpus),
    idempotency: capabilityChecks.idempotency_key,
    auditTrace: capabilityChecks.audit_trace,
    separateRoleProjections: capabilityChecks.role_minimised_projection,
  },
  capabilityChecks,
  peerProfile,
  assessment,
  conclusion: assessment.compatible
    ? 'Synthetic contract compatibility is proven for the observed profiles; this is still not production approval.'
    : 'The products share foundations but live App–ACC compatibility is not yet proven. No transport or release claim is permitted.',
}

const rows = Object.entries(capabilityChecks).map(([capability, present]) => `| \`${capability}\` | ${present ? 'observed' : 'missing'} |`).join('\n')
const missing = assessment.missingCapabilities.map((value) => `\`${value}\``).join(', ')
const markdown = `# App–ACC Compatibility Audit\n\n**Stand:** 10. Oktober 2026  \n**Audit:** read-only, keine Änderung der ACC-Codebasis  \n**ACC-Referenz:** J.5 Dual-Sided Workflow  \n**Ergebnis:** **${assessment.status}**\n\n## Beobachtete gemeinsame Grundlage\n\n- ausschließlich synthetischer Betrieb: ${peerProfile.syntheticOnly ? 'ja' : 'nicht belegt'};\n- externe Wirkung: ${peerProfile.externalEffects === false ? 'ausgeschlossen' : 'nicht belegt'};\n- SQLite-Persistenz: ${/SQLite/i.test(corpus) ? 'belegt' : 'nicht belegt'};\n- Human Gate: ${/Human Gate|Human-Gate/i.test(corpus) ? 'belegt' : 'nicht belegt'};\n- Idempotenz: ${capabilityChecks.idempotency_key ? 'belegt' : 'nicht belegt'};\n- rollenbezogene Projektion: ${capabilityChecks.role_minimised_projection ? 'belegt' : 'nicht belegt'};\n- ACC-interner Arbeitgeber-/Operations-Beitragsprozess: ${/employer_contributions|Arbeitgeberaufgabe.*Operations-Prüfung/i.test(corpus) ? 'belegt' : 'nicht belegt'}.\n\n## Vertragsfähigkeiten\n\n| Fähigkeit | ACC J.5 |\n|---|---|\n${rows}\n\n## Harte Feststellung\n\nDas ACC J.5 besitzt nun einen lokal persistierten, rollengetrennten Arbeitgeber-/Operations-Beitragsprozess mit Idempotenz, serverseitigen Rollenprüfungen und Null-Außenwirkung. Dieser Prozess ist jedoch ACC-intern: Das ACC deklariert den App-Schnittstellenvertrag \`1.1.0-local-r2-foundation\` weiterhin nicht. App-Inbound- und App-Outbox-Routen sind im geprüften ACC-Stand nicht vorhanden. Deshalb sind die Produkte **nicht live-kompatibel** und bleiben technisch unverbunden.\n\nFehlende Fähigkeiten: ${missing}.\n\n## Nächste Freigabebedingung\n\nEin gemeinsamer Consumer-driven Contract-Test muss in beiden getrennten Codebasen denselben Envelope, dieselbe Objekt-/Statusübersetzung, Negativrechte, Replay-, Revisions- und Reconciliation-Fälle bestätigen. Erst danach darf ein Transportdesign entschieden werden.\n`

await mkdir(evidenceDir, { recursive: true })
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
await writeFile(markdownPath, markdown, 'utf8')

console.log(`App–ACC compatibility audit: ${assessment.status}; ${assessment.missingCapabilities.length} required capabilities missing.`)
if (assessment.compatible) console.log('Compatibility is synthetic-contract only and does not authorise a live connection.')
