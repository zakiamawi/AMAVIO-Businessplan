const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const cssFiles = ['assets/calm-capable-v2.css', 'assets/gate-01-5.css', 'assets/release-g.css', 'assets/release-i.css', 'assets/release-j.css', 'assets/release-j-focus.css', 'assets/runtime-integrity.css', 'assets/release-j5.css', 'assets/release-k.css', 'assets/release-l.css', 'assets/release-l1.css', 'assets/release-l2.css', 'assets/release-m.css', 'assets/release-n.css', 'usability/styles.css', 'usability-program/styles.css'];
const jsFiles = ['assets/runtime-integrity.js', 'assets/calm-capable-v2.js', 'assets/release-g.js', 'assets/release-i.js', 'assets/release-j.js', 'assets/release-j-focus.js', 'assets/release-j5.js', 'assets/release-k.js', 'assets/release-l.js', 'assets/release-m.js', 'assets/release-n.js', 'usability/app.js', 'usability-program/app.js'];
const backend = read('backend/server.mjs');
const operationsTwin = read('backend/operations-twin.mjs');
const operationalLearning = read('backend/operational-learning.mjs');
const gate15 = read('backend/gate-01-5.mjs');
const providers = read('backend/provider-adapters.mjs');
const roleContract = read('backend/role-contract.mjs');
const collaboration = read('backend/collaboration.mjs');
const programDelivery = read('backend/program-delivery.mjs');
const kernelV3 = read('backend/intelligence-kernel-v3.mjs');
const kernelFiles = [
  'backend/intelligence-kernel.mjs', 'backend/kernel/contracts.mjs', 'backend/kernel/evidence-graph.mjs',
  'backend/kernel/policy-engine.mjs', 'backend/kernel/capability-registry.mjs',
  'backend/kernel/evaluation-harness.mjs', 'backend/kernel/human-gate.mjs',
  'backend/intelligence-kernel-v2.mjs', 'backend/kernel/artifact-store.mjs',
  'backend/kernel/evidence-reconciliation.mjs', 'backend/kernel/critical-path-replanning.mjs',
  'backend/kernel/readiness-brief-composer.mjs', 'backend/kernel/vertical-capability-evaluation.mjs',
];
const kernelSource = kernelFiles.map(read).join('\n');
const activeSource = [html, ...cssFiles.map(read), ...jsFiles.map(read), backend, operationsTwin, operationalLearning, collaboration, programDelivery, kernelV3, gate15, providers, roleContract, kernelSource].join('\n');
const failures = [];
const requireHtml = (value) => { if (!html.toLocaleLowerCase('de-DE').includes(value.toLocaleLowerCase('de-DE'))) failures.push(`Pflichttext fehlt: ${value}`); };
const requireBackend = (value) => { if (!backend.includes(value)) failures.push(`Backend-Grenze fehlt: ${value}`); };
const requireGate15 = (value) => { if (!gate15.includes(value) && !providers.includes(value)) failures.push(`Gate-01.5-Grenze fehlt: ${value}`); };
const requireKernel = (value) => { if (!kernelSource.includes(value)) failures.push(`Kernel-Vertrag fehlt: ${value}`); };
const requireRoleContract = (value) => { if (!roleContract.includes(value)) failures.push(`Release-H-Rollenvertrag fehlt: ${value}`); };
const forbid = (pattern, label) => { if (pattern.test(activeSource)) failures.push(`Gesperrte Fundstelle: ${label}`); };

if (!/<html\s+lang="de"/i.test(html)) failures.push('lang="de" fehlt');
if (!/<main\s+id="main-content"/i.test(html)) failures.push('Main-Landmark fehlt');
if (!/href="#main-content"/i.test(html)) failures.push('Skip-Link fehlt');
if (!/name="robots"\s+content="noindex,nofollow,noarchive"/i.test(html)) failures.push('noindex-Schutz fehlt');

[
  'Lokale Konzeptdemo', 'ausschließlich synthetische Daten', 'keine Systemanbindung',
  'AMAVIO Operations', 'Arbeitgeber', 'Heute', 'Fälle', 'Fallsteuerung', 'Aufgaben &amp; Entscheidungen', 'Evaluation',
  'Operations Twin', 'Entscheidungsraum', 'Ereignisstrom', 'Kritischer Pfad', 'Rollenübergaben',
  'Evidenz', 'Verantwortung', 'Simulation', 'Entscheidung',
  'Arrival Readiness Brief', 'Nächste Verantwortung', 'Human Gate', 'Wirkungsgrenze', 'Keine Außenwirkung',
  'Offenes Ergebnis klären', 'Lernschleife', 'Rückmeldung auswählen', 'Soll und Ist vergleichen',
  'Nächste Anpassung festhalten', 'Qualitätsprüfung', 'Verbesserung verlässlich prüfen', '24 synthetischen Prüffälle',
  'Lokale Demo wird vorbereitet', 'System wird geprüft', 'Lokale Arbeitsumgebung', 'Geschützter Demorahmen',
  'Aufgaben &amp; Entscheidungen', 'Auftrag &amp; Grundlage', 'Beitrag erfassen', 'An AMAVIO übergeben',
  'Operative Fallsteuerung', 'Arbeitgeberübergabe', 'Eingegangene Beiträge', 'Ankunftsprogramme steuern', 'Gemeinsamer Ablauf- und Lieferplan', 'Kritischen Pfad neu planen', 'Planungsentscheidung', 'Lieferbelege abgleichen', 'Programmbrief erstellen',
  'Productization Gate 01', 'Ein echter, kontrollierter Systemlauf', 'Persistentes Backend und Datenbank',
  'Synthetischer Entwicklungsraum', 'Menschliche Prüfung', 'Keine Außenwirkung',
  'Produktive Registrierung', 'Externer KI-Anbieter', 'Realer Versand oder Buchung',
].forEach(requireHtml);

[
  'PRAGMA foreign_keys = ON', 'CHECK (synthetic = 1)', 'review_decision', "status = 'sink_only'",
  'Fall im aktiven Mandanten nicht gefunden', 'Eine positive menschliche Prüfung',
  'Externer KI-Provider ist bis zur separaten Founder-', 'externalEffect: false',
].forEach(requireBackend);

[
  'CREATE TABLE IF NOT EXISTS case_operations', 'CREATE TABLE IF NOT EXISTS evidence_items',
  'CREATE TABLE IF NOT EXISTS simulation_runs', 'CREATE TABLE IF NOT EXISTS work_products',
  'buildEvaluationCases', 'amavio-domain-engine-v1.5', 'provider_gate_closed',
  'https://api.openai.com/v1/responses', 'https://api.mistral.ai/v1/chat/completions',
  'syntheticOnlyApproved', 'externalEffects: false',
].forEach(requireGate15);

[
  'amavio.intelligence-kernel.v1', 'amavio.evidence-graph.v1', 'amavio.policy-decision.v1',
  'amavio.human-gate.v1', 'case.orchestrate', 'evidence.resolve_conflict',
  'simulation.explain_impact', 'brief.compose', 'advisory_only', 'awaiting_human_review',
  'externalEffect: false', 'automaticDecision: false', 'providerCosts: false',
  'amavio.intelligence-kernel.v2', 'amavio.evidence-reconciliation.v1',
  'amavio.critical-path-replan.v1', 'amavio.arrival-readiness-brief.v1',
  'kernel_artifacts', 'approved_evidence_reconciliation', 'approved_critical_path_replan',
].forEach(requireKernel);

[
  'operations', 'employer_sponsor', 'employer_hr', 'employer_location', 'employer_budget',
  'projectPortfolio', 'projectCaseDetail', 'authorizeRequest', 'role_scope_denied',
  'simulation.create', 'kernel.read', 'decision.review',
].forEach(requireRoleContract);

forbid(/\bsk-[A-Za-z0-9_-]{12,}\b|api[_-]?key\s*[:=]\s*["'][^"']+/i, 'eingebettetes Secret oder API-Key');
forbid(/data-role-target="(?:arbeitnehmer|fachkraft|partner|housing)"/i, 'externe App-Rolle im ACC');
if (/produktive Plattform|fertiges SaaS|KI-Matching|KI-Risikoprognose|automatisierte Personenentscheidung/i.test(html)) failures.push('Gesperrte Fundstelle: überzogener Produkt- oder KI-Claim');
const operationsSource = html.match(/<section class="page operations-page[\s\S]*?<section class="page evaluation-page/)?.[0] || '';
if (/AMAVIO Intelligence Kernel|KI-Chat|KI-Copilot|AI Command Center/i.test(operationsSource)) failures.push('Kernel wird als sichtbares KI-Modul inszeniert');

const roleTargets = [...html.matchAll(/data-role-target="([^"]+)"/g)].map((match) => match[1]);
if (roleTargets.join(',') !== 'admin,employer') failures.push(`aktive Rollen unerwartet: ${roleTargets.join(',')}`);
const navTargets = [...html.matchAll(/data-page-target="([^"]+)"/g)].map((match) => match[1]);
if (navTargets.join(',') !== 'today,cases,twin,twin-decisions,operations,planning,collaboration,programs,evaluation,learning,learning-quality') failures.push(`Navigation unerwartet: ${navTargets.join(',')}`);
const learningSurface = html.match(/<section class="page learning-page learning-focus-page"[\s\S]*?<section class="page learning-page learning-focus-page learning-quality-page"/)?.[0] || '';
const qualitySurface = html.match(/<section class="page learning-page learning-focus-page learning-quality-page"[\s\S]*?<section class="page" data-page="cases"/)?.[0] || '';
if (/SYN-|fingerprint|fixture|Technische Prüfdaten|Interne Notiz|Belegreferenzen/i.test(learningSurface + qualitySurface)) failures.push('Lern- oder Qualitätsoberfläche enthält technische Innendaten');
const workModes = [...html.matchAll(/data-work-mode="([^"]+)"/g)].map((match) => match[1]);
if (workModes.join(',') !== 'understand,plan,simulate,prepare,history') failures.push(`Arbeitsmodi unerwartet: ${workModes.join(',')}`);
const opsModes = [...html.matchAll(/data-ops-mode="([^"]+)"/g)].map((match) => match[1]);
if (opsModes.join(',') !== 'evidence,responsibility,simulation,decision,products') failures.push(`Release-G-Fallreise unerwartet: ${opsModes.join(',')}`);

for (const file of jsFiles) {
  try { new vm.Script(read(file), { filename: file }); }
  catch (error) { failures.push(`JavaScript ungültig (${file}): ${error.message}`); }
}
for (const file of cssFiles) {
  let depth = 0;
  for (const character of read(file)) { if (character === '{') depth += 1; if (character === '}') depth -= 1; if (depth < 0) break; }
  if (depth !== 0) failures.push(`CSS-Klammerbilanz (${file}): ${depth}`);
}

for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const target = match[1]; if (!target || target.startsWith('#')) continue;
  const local = target.split('#')[0].split('?')[0];
  if (!fs.existsSync(path.resolve(root, local))) failures.push(`lokales Ziel fehlt: ${local}`);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) failures.push(`doppelte IDs: ${duplicateIds.join(', ')}`);

[
  'README.md', 'BACKLOG.md', 'CHANGELOG.md', 'CALM_CAPABLE_V2_SPEC_20261003.md',
  'architecture/ACC_PRODUCTIZATION_GATE_01_20261007.md',
  'architecture/ACC_API_CONTRACT_V1_20261007.yaml',
  'architecture/FOUNDER_DECISIONS_GATE_02_20261007.md',
  'architecture/ACC_PRODUCTIZATION_GATE_01_5_OPERATIONAL_DEPTH_PLAN_20261007.md',
  'QA/ACC_PRODUCTIZATION_GATE_01_QA_20261007.md', 'QA/backend.test.mjs', 'QA/gate-01-5.test.mjs',
  'QA/usability-browser-check.js', 'usability/index.html', 'usability/styles.css', 'usability/app.js',
  'QA/brandbook-usability-check.js', 'QA/ACC_MODERATED_USABILITY_BRANDBOOK_QA_20261007.md',
  'usability/USABILITY_MODERATION_GUIDE_20261007.md', 'usability/USABILITY_OBSERVATION_SCHEMA_20261007.md',
  'usability/FOUNDER_GATE_WAVE_1_SCOPE_20261007.md',
  'QA/ACC_GATE_01_5_ACCEPTANCE_MATRIX_20261007.md',
  'RELEASE_G_OPERATIONAL_ORCHESTRATION_SPEC_20261007.md',
  'QA/ACC_RELEASE_G_QA_20261007.md', 'QA/release-g-brandbook-check.js', 'QA/release-g-browser-check.js',
  'design/ACC_RELEASE_G_DESKTOP_CONCEPT_20261007.png', 'design/ACC_RELEASE_G_MOBILE_CONCEPT_20261007.png',
  'assets/release-g.css', 'assets/release-g.js',
  'architecture/ADR-003_AMAVIO_INTELLIGENCE_KERNEL_V1_20261007.md',
  'architecture/AMAVIO_INTELLIGENCE_KERNEL_SYSTEM_DESIGN_V1_20261007.md',
  'architecture/AMAVIO_INTELLIGENCE_KERNEL_API_CONTRACT_V1_20261007.yaml',
  'QA/ACC_INTELLIGENCE_KERNEL_V1_QA_20261007.md', 'QA/intelligence-kernel.test.mjs',
  'QA/ACC_INTELLIGENCE_KERNEL_ROUTE_MATRIX_V1_20261007.md',
  'architecture/ADR-004_AMAVIO_INTELLIGENCE_KERNEL_V2_VERTICAL_CAPABILITIES_20261008.md',
  'architecture/AMAVIO_INTELLIGENCE_KERNEL_SYSTEM_DESIGN_V2_20261008.md',
  'architecture/AMAVIO_INTELLIGENCE_KERNEL_API_CONTRACT_V2_20261008.yaml',
  'QA/ACC_INTELLIGENCE_KERNEL_V2_QA_20261008.md', 'QA/intelligence-kernel-v2.test.mjs',
  'QA/ACC_INTELLIGENCE_KERNEL_ROUTE_MATRIX_V2_20261008.md',
  'architecture/ADR-005_RELEASE_H_ROLE_CONTRACT_VIEW_PROJECTION_20261008.md',
  'architecture/AMAVIO_ACC_ROLE_CONTRACT_V1_20261008.md',
  'QA/ACC_RELEASE_H_ROLE_MATRIX_20261008.md', 'QA/ACC_RELEASE_H_QA_20261008.md',
  'QA/release-h-role-contract.test.mjs', 'QA/release-h-browser-check.js', 'backend/role-contract.mjs',
  'backend/operations-twin.mjs', 'assets/release-i.css', 'assets/release-i.js',
  'QA/operations-twin.test.mjs', 'QA/release-i-browser-check.js',
  'design/ACC_RELEASE_I_OPERATIONS_TWIN_CONCEPT_20261008.png',
  'architecture/ADR-006_RELEASE_I_OPERATIONS_TWIN_20261008.md',
  'architecture/AMAVIO_OPERATIONS_TWIN_SYSTEM_DESIGN_V1_20261008.md',
  'QA/ACC_RELEASE_I_ROUTE_MATRIX_20261008.md', 'QA/ACC_RELEASE_I_QA_20261008.md',
  'QA/ACC_RELEASE_I_COVERAGE_20261008.json',
  'backend/operational-learning.mjs', 'assets/release-j.css', 'assets/release-j.js', 'assets/release-j-focus.css', 'assets/release-j-focus.js',
  'QA/operational-learning.test.mjs', 'QA/release-j-browser-check.js',
  'design/ACC_RELEASE_J_OPERATIONAL_LEARNING_CONCEPT_20261008.png',
  'design/ACC_RELEASE_J_VERSION_COMPARE_CONCEPT_20261008.png',
  'architecture/ADR-007_RELEASE_J_OPERATIONAL_LEARNING_20261008.md',
  'architecture/AMAVIO_OPERATIONAL_LEARNING_SYSTEM_DESIGN_V1_20261008.md',
  'QA/ACC_RELEASE_J_ROUTE_MATRIX_20261008.md', 'QA/ACC_RELEASE_J_QA_20261008.md',
  'QA/ACC_RELEASE_J_COVERAGE_20261008.json',
  'QA/ACC_RELEASE_J2_OPERATOR_FOCUS_QA_20261008.md',
  'QA/ACC_RELEASE_J3_GUIDED_LEARNING_QA_20261008.md',
  'QA/ACC_RELEASE_J4_RUNTIME_NAVIGATION_QA_20261009.md', 'QA/ACC_RELEASE_J4_1_RUNTIME_CLARITY_QA_20261010.md', 'QA/runtime-integrity-browser-check.js',
  'backend/collaboration.mjs', 'assets/release-j5.css', 'assets/release-j5.js', 'QA/collaboration.test.mjs', 'QA/release-j5-browser-check.js', 'QA/release-j5-brandbook-check.js',
  'backend/program-delivery.mjs', 'assets/release-k.css', 'assets/release-k.js', 'QA/program-delivery.test.mjs', 'QA/release-k-browser-check.js', 'QA/release-k-brandbook-check.js',
  'backend/intelligence-kernel-v3.mjs', 'assets/release-l.css', 'assets/release-l.js', 'QA/intelligence-kernel-v3.test.mjs', 'QA/release-l-browser-check.js', 'QA/release-l-brandbook-check.js',
  'architecture/AMAVIO_INTELLIGENCE_KERNEL_V3_20261012.md', 'QA/ACC_RELEASE_L_QA_20261012.md',
  'usability-program/index.html', 'usability-program/styles.css', 'usability-program/app.js', 'usability-program/MODERATION_GUIDE_20261012.md', 'usability-program/OBSERVATION_SCHEMA_20261012.json', 'QA/program-usability-browser-check.js', 'QA/ACC_PROGRAM_USABILITY_REHEARSAL_20261012.md',
  'archive/20261008_release_j_operator_focus_baseline/index.html',
  'archive/20261008_release_j3_guided_learning_baseline/index.html',
  'archive/20261009_release_j4_runtime_navigation_baseline/index.html',
  'archive/20261010_release_j4_1_runtime_clarity_baseline/index.html',
  'assets/runtime-integrity.css', 'assets/runtime-integrity.js',
  ...kernelFiles,
  'backend/server.mjs', 'backend/gate-01-5.mjs', 'backend/provider-adapters.mjs', 'package.json',
  'archive/20261003_product_design_reset_v1_baseline/index.html',
  'assets/brand/amavio-logo-light.svg', 'assets/fonts/fonts.css',
].forEach((required) => { if (!fs.existsSync(path.join(root, required))) failures.push(`Paketdatei fehlt: ${required}`); });

const backendCheck = spawnSync(process.execPath, ['--check', path.join(root, 'backend/server.mjs')], { encoding: 'utf8' });
if (backendCheck.status !== 0) failures.push(`Backend-Syntax ungültig: ${backendCheck.stderr.trim()}`);
for (const file of kernelFiles) {
  const check = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (check.status !== 0) failures.push(`Kernel-Syntax ungültig (${file}): ${check.stderr.trim()}`);
}
const roleContractCheck = spawnSync(process.execPath, ['--check', path.join(root, 'backend/role-contract.mjs')], { encoding: 'utf8' });
if (roleContractCheck.status !== 0) failures.push(`Release-H-Rollenvertrag ungültig: ${roleContractCheck.stderr.trim()}`);
const operationsTwinCheck = spawnSync(process.execPath, ['--check', path.join(root, 'backend/operations-twin.mjs')], { encoding: 'utf8' });
if (operationsTwinCheck.status !== 0) failures.push(`Release-I-Operations-Twin ungültig: ${operationsTwinCheck.stderr.trim()}`);
const operationalLearningCheck = spawnSync(process.execPath, ['--check', path.join(root, 'backend/operational-learning.mjs')], { encoding: 'utf8' });
if (operationalLearningCheck.status !== 0) failures.push(`Release-J-Lernschleife ungültig: ${operationalLearningCheck.stderr.trim()}`);
const collaborationCheck = spawnSync(process.execPath, ['--check', path.join(root, 'backend/collaboration.mjs')], { encoding: 'utf8' });
if (collaborationCheck.status !== 0) failures.push(`Release-J.5-Collaboration ungültig: ${collaborationCheck.stderr.trim()}`);
const programDeliveryCheck = spawnSync(process.execPath, ['--check', path.join(root, 'backend/program-delivery.mjs')], { encoding: 'utf8' });
if (programDeliveryCheck.status !== 0) failures.push(`Release-K-Program-Delivery ungültig: ${programDeliveryCheck.stderr.trim()}`);
const kernelV3Check = spawnSync(process.execPath, ['--check', path.join(root, 'backend/intelligence-kernel-v3.mjs')], { encoding: 'utf8' });
if (kernelV3Check.status !== 0) failures.push(`Release-L-Kernel-V3 ungültig: ${kernelV3Check.stderr.trim()}`);

if (failures.length) {
  console.error('AMAVIO ACC Productization Gate 02A – Static QA: FEHLER');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`AMAVIO ACC Release L – Static QA: OK (${opsModes.length} interne Fallstufen, getrennte Programmprojektionen, Kernel-V3-Vertrag, moderierte Teststrecke und keine sichtbaren Innendaten)`);
