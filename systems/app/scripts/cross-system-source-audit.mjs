import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const accPath = resolve(process.env.AMAVIO_ACC_REFERENCE_PATH || '../../10_Control_Center/20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working')
const crmPath = resolve(process.env.AMAVIO_CRM_REFERENCE_PATH || '../../09_Unternehmenssystem/07_AMAVIO_One_CRM/20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working')
const evidenceDir = resolve('QA')
const jsonPath = resolve(evidenceDir, 'CROSS_SYSTEM_SOURCE_AUDIT_20261010.json')
const markdownPath = resolve(evidenceDir, 'CROSS_SYSTEM_SOURCE_AUDIT_20261010.md')

const sourceSets = [
  {
    product: 'acc',
    path: accPath,
    release: 'J.5 Dual-Sided Workflow',
    files: [
      'README.md',
      'APP_ACC_INTERFACE_BOUNDARY_20260930.md',
      'architecture/ADR-008_RELEASE_J5_DUAL_SIDED_WORKFLOW_20261010.md',
      'architecture/AMAVIO_ACC_ROLE_CONTRACT_V1_20261008.md',
      'backend/collaboration.mjs',
      'QA/ACC_RELEASE_J5_DUAL_SIDED_WORKFLOW_QA_20261010.md',
    ],
  },
  {
    product: 'crm',
    path: crmPath,
    release: 'R3.4 Founder Decision',
    files: [
      'README.md',
      'CRM_CANONICAL_DOMAIN_MODEL.md',
      'CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md',
      'CRM_ACC_HANDOFF_CONTRACT_DRAFT.md',
      'CRM_PRODUCT_OWNER_DECISIONS.md',
      'CRM_R3_4_PRODUCT_EXPERIENCE_AND_AI_MASTER_PROMPT_20261010.md',
      'package.json',
    ],
  },
]

for (const sourceSet of sourceSets) {
  if (!existsSync(sourceSet.path)) throw new Error(`${sourceSet.product.toUpperCase()} reference path is unavailable: ${sourceSet.path}`)
}

const observations = []
for (const sourceSet of sourceSets) {
  const sources = []
  for (const relativePath of sourceSet.files) {
    const absolutePath = resolve(sourceSet.path, relativePath)
    const sourceText = await readFile(absolutePath, 'utf8')
    sources.push({
      relativePath,
      sha256: createHash('sha256').update(sourceText).digest('hex'),
      sourceText,
    })
  }
  observations.push({ ...sourceSet, sources })
}

const acc = observations.find(({ product }) => product === 'acc')
const crm = observations.find(({ product }) => product === 'crm')
const accCorpus = acc.sources.map(({ sourceText }) => sourceText).join('\n')
const crmCorpus = crm.sources.map(({ sourceText }) => sourceText).join('\n')

const checks = {
  accJ5DualSidedWorkflowObserved: /Release J\.5|Dual-Sided Workflow/i.test(accCorpus),
  accInternalContributionFlowObserved: /employer_contributions|Arbeitgeberaufgabe.*Operations-Prüfung/i.test(accCorpus),
  accAppInterfaceStillNotImplemented: /keine App-\/ACC-Verbindung|nicht implementiert, nicht integriert/i.test(accCorpus),
  crmR34Observed: /0\.3\.0-r3-4-founder-decision|R3\.4/i.test(crmCorpus),
  crmAccIntegrationBlocked: /ACC-Integration vollständig gesperrt/i.test(crmCorpus),
  crmDirectAppRelationshipBlocked: /PO-CRM-015[\s\S]{0,180}Sperre vollständig bestätigt/i.test(crmCorpus),
  crmAccMarkerPayloadFree: /approved_marker[\s\S]{0,220}keinen Payload und keine ACC-ID/i.test(crmCorpus),
  threeProductsRemainSeparate: /CRM, App und Arrival Control Center bleiben getrennte Produkte und getrennte Codebasen/i.test(crmCorpus),
}

const failedChecks = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)
const status = failedChecks.length ? 'SOURCE_CONTRADICTION_OR_MISSING_EVIDENCE' : 'SOURCE_BOUNDARIES_ALIGNED'
const report = {
  generatedAt: new Date().toISOString(),
  auditType: 'read_only_app_acc_crm_source_alignment',
  status,
  modifiedExternalProducts: false,
  sources: observations.map(({ product, path, release, sources }) => ({
    product,
    path,
    release,
    files: sources.map(({ relativePath, sha256 }) => ({ relativePath, sha256 })),
  })),
  checks,
  failedChecks,
  conclusion: failedChecks.length
    ? 'The cross-system contract package must not be accepted until the failed source checks are resolved.'
    : 'The App package reflects the observed ACC J.5 and CRM R3.4 boundaries without changing or merging either product.',
}

const checkRows = Object.entries(checks).map(([check, passed]) => `| \`${check}\` | ${passed ? 'PASS' : 'FAIL'} |`).join('\n')
const markdown = `# Cross-System Source Audit – App, ACC und CRM\n\n**Stand:** 10. Oktober 2026  \n**Modus:** read-only; ACC und CRM wurden nicht verändert  \n**Ergebnis:** **${status}**\n\n## Geprüfte aktuelle Arbeitsstände\n\n- App-Ausgang: \`2.4.3-r2-contract-closure.1\`;\n- ACC: \`20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working\`;\n- CRM: \`20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working\`.\n\n## Quellenprüfungen\n\n| Prüfung | Ergebnis |\n|---|---|\n${checkRows}\n\n## Feststellung\n\nACC J.5 besitzt einen eigenständigen Arbeitgeber-/Operations-Beitragsprozess. Er ist kein App-Transport. Das CRM R3.4 besitzt einen payloadfreien lokalen ACC-Review-Marker. Er ist keine ACC-Integration und begründet keinen App-Bezug. App, ACC und CRM bleiben eigenständige Produkte, Rollenmodelle, Oberflächen, Codebasen und Datenspeicher.\n\nDie vollständigen SHA-256-Quellnachweise stehen in \`QA/CROSS_SYSTEM_SOURCE_AUDIT_20261010.json\`.\n`

await mkdir(evidenceDir, { recursive: true })
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
await writeFile(markdownPath, markdown, 'utf8')

console.log(`Cross-system source audit: ${status}; ${failedChecks.length} failed checks.`)
if (failedChecks.length) process.exitCode = 1
