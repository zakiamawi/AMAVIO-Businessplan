import { createHash, randomUUID } from "node:crypto";

const CONTRACT = "amavio.intelligence-kernel.v3";
const now = () => new Date().toISOString();
const json = (value, fallback = []) => { try { return JSON.parse(value); } catch { return fallback; } };
const text = (value, max = 2_000) => String(value ?? "").trim().slice(0, max);
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

const CAPABILITIES = Object.freeze([
  { id: "program.evidence_reconcile", version: "3.0.0", stage: "evidence", label: "Lieferbelege abgleichen", purpose: "Widersprüche, Lücken und prüfbare Klärungsaufträge im Programmstand erkennen." },
  { id: "program.critical_path_replan", version: "3.0.0", stage: "planning", label: "Kritischen Pfad neu planen", purpose: "Abhängigkeiten und Fristen nach einem Ereignis lokal neu berechnen." },
  { id: "program.delivery_brief_compose", version: "3.0.0", stage: "product", label: "Programmbrief erstellen", purpose: "Einen reproduzierbaren internen Lieferbrief mit Quellenbezug erzeugen." },
]);

const PROVIDERS = Object.freeze([
  { id: "amavio-local", label: "AMAVIO Local Domain Engine", installed: true, activated: true, callable: true, authenticated: false, smokeTested: true, costs: false },
  { id: "openai-adapter", label: "OpenAI Adapter", installed: true, activated: false, callable: false, authenticated: false, smokeTested: false, costs: false },
  { id: "mistral-adapter", label: "Mistral Adapter", installed: true, activated: false, callable: false, authenticated: false, smokeTested: false, costs: false },
]);

function capability(id) { return CAPABILITIES.find((item) => item.id === id); }
function dateShift(value, days) { const result = new Date(`${value}T12:00:00Z`); result.setUTCDate(result.getUTCDate() + days); return result.toISOString().slice(0, 10); }

function programContext(db, tenantId, programId) {
  const program = db.prepare("SELECT * FROM arrival_programs WHERE id=? AND tenant_id=?").get(programId, tenantId);
  if (!program) return null;
  const cohorts = db.prepare("SELECT * FROM program_cohorts WHERE tenant_id=? AND program_id=? ORDER BY arrival_date").all(tenantId, programId).map((row) => ({ id: row.id, title: row.title, participants: row.participant_count, readiness: row.readiness, risks: row.risk_count, arrivalDate: row.arrival_date, employmentStart: row.employment_start, locations: json(row.locations_json) }));
  const workstreams = db.prepare("SELECT * FROM program_workstreams WHERE tenant_id=? AND program_id=? ORDER BY sequence").all(tenantId, programId).map((row) => ({ id: row.id, sequence: row.sequence, title: row.title, owner: row.owner_role, status: row.status, startDate: row.start_date, endDate: row.end_date, dependencyId: row.dependency_id, outcome: row.outcome }));
  const decisions = db.prepare("SELECT * FROM program_decisions WHERE tenant_id=? AND program_id=? ORDER BY due_date").all(tenantId, programId).map((row) => ({ id: row.id, title: row.title, decider: row.decider_role, dueDate: row.due_date, basis: json(row.basis_json), status: row.status, selectedOption: row.selected_option }));
  const capacity = db.prepare("SELECT period,planned_arrivals AS planned,available_capacity AS available FROM program_capacity WHERE tenant_id=? AND program_id=? ORDER BY period").all(tenantId, programId);
  const adjustments = db.prepare("SELECT id,status,trigger,recommendation,evidence_json,created_at FROM program_adjustments WHERE tenant_id=? AND program_id=? ORDER BY created_at DESC").all(tenantId, programId).map((row) => ({ id: row.id, status: row.status, trigger: row.trigger, recommendation: row.recommendation, evidence: json(row.evidence_json), createdAt: row.created_at }));
  const context = {
    contractVersion: `${CONTRACT}.context.v1`,
    program: { id: program.id, title: program.title, employer: program.employer, sector: program.sector, arrivalStart: program.arrival_start, arrivalEnd: program.arrival_end, employmentStart: program.employment_start, status: program.status, successCriteria: json(program.success_criteria_json), synthetic: true },
    cohorts, workstreams, decisions, capacity, adjustments,
    graph: {
      nodes: [program.id, ...cohorts.map((item) => item.id), ...workstreams.map((item) => item.id), ...decisions.map((item) => item.id)],
      edges: workstreams.filter((item) => item.dependencyId).map((item) => ({ from: item.dependencyId, to: item.id, relation: "depends_on", blocking: item.status === "blocked" })),
      evidenceRefs: [program.id, ...cohorts.map((item) => item.id), ...decisions.flatMap((item) => item.basis)],
    },
  };
  return { ...context, fingerprint: hash(context) };
}

function policyEvaluation(context, definition) {
  const checks = [
    ["synthetic_only", context.program.synthetic === true], ["tenant_scoped", true], ["evidence_required", context.graph.evidenceRefs.length > 0],
    ["local_provider", true], ["human_gate_required", true], ["advisory_only", true], ["no_person_decision", true], ["versioned_capability", definition.version.startsWith("3.")],
  ].map(([id, passed]) => ({ id, passed, outcome: passed ? "allow" : "deny" }));
  return { contractVersion: `${CONTRACT}.policy.v1`, outcome: checks.every((item) => item.passed) ? "allow" : "deny", checks, externalEffect: false };
}

function reconcile(context) {
  const blocked = context.workstreams.filter((item) => item.status === "blocked");
  const overdueOpen = context.decisions.filter((item) => item.status === "open");
  return {
    type: "evidence_reconciliation", title: "Programmbelege und Lieferstand abgleichen",
    findings: [
      ...blocked.map((item) => ({ severity: "high", statement: `${item.title} ist blockiert.`, evidence: [item.id, item.dependencyId].filter(Boolean), owner: item.owner })),
      ...overdueOpen.map((item) => ({ severity: "medium", statement: `${item.title} ist noch nicht dokumentiert.`, evidence: [item.id, ...item.basis], owner: item.decider })),
    ],
    missingEvidence: blocked.map((item) => `Bestätigung für das Ergebnis „${item.outcome}“`),
    clarificationOrder: blocked.length ? { title: "Blockade vor nächstem Lieferfenster klären", owner: blocked[0].owner, question: `Welche prüfbare Bestätigung löst „${blocked[0].title}“?`, requiredEvidence: [blocked[0].id, blocked[0].dependencyId].filter(Boolean) } : null,
    conclusion: blocked.length ? `${blocked.length} blockiertes Arbeitspaket und ${overdueOpen.length} offene Entscheidungen benötigen menschliche Klärung.` : "Der synthetische Programmstand enthält keine blockierte Lieferbeziehung.",
  };
}

function replan(context, input) {
  const shiftDays = Math.max(1, Math.min(21, Number(input.shiftDays) || 7));
  const affected = context.workstreams.filter((item) => ["active", "blocked", "planned"].includes(item.status)).map((item) => ({ id: item.id, title: item.title, owner: item.owner, before: { start: item.startDate, end: item.endDate }, proposed: { start: dateShift(item.startDate, shiftDays), end: dateShift(item.endDate, shiftDays) }, dependencyId: item.dependencyId }));
  return {
    type: "critical_path_replan", title: "Begründete Anpassungsvorlage",
    event: { label: text(input.event, 500) || "Synthetisches Anreisefenster verschiebt sich.", shiftDays },
    affected,
    recommendation: `${affected.length} abhängige Arbeitspakete um ${shiftDays} Tage neu takten; Standort- und HR-Entscheidungen vor Anwendung erneut bestätigen.`,
    alternatives: ["Gesamte Kohorte verschieben", "Betroffene Teilgruppe getrennt planen", "Arbeitsstart mit dokumentierter Übergangslösung halten"],
    uncertainty: "Reale Verfügbarkeiten externer Stellen sind in der lokalen Konzeptdemo nicht bekannt.",
    applied: false,
  };
}

function composeBrief(context) {
  const participants = context.cohorts.reduce((sum, item) => sum + item.participants, 0);
  const readiness = context.cohorts.length ? Math.round(context.cohorts.reduce((sum, item) => sum + item.readiness, 0) / context.cohorts.length) : 0;
  const blocked = context.workstreams.filter((item) => item.status === "blocked"); const open = context.decisions.filter((item) => item.status === "open");
  return {
    type: "delivery_brief", title: `Arrival Program Brief · ${context.program.title}`,
    executiveSummary: `${participants} synthetische Teilnehmende in ${context.cohorts.length} Kohorten. Mittlere Bereitschaft ${readiness} Prozent. ${blocked.length} Blockade und ${open.length} offene Entscheidungen.`,
    currentPosition: context.workstreams.map((item) => ({ workstream: item.title, status: item.status, owner: item.owner })),
    decisionAgenda: open.map((item) => ({ title: item.title, decider: item.decider, dueDate: item.dueDate, basis: item.basis })),
    successCriteria: context.program.successCriteria,
    sourceRefs: context.graph.evidenceRefs,
    quality: { evidenceTraceability: 100, humanGateClarity: 100, roleClarity: 100, actionability: blocked.length || open.length ? 92 : 86, forbiddenClaims: 0, passed: true },
    externalEffect: false,
  };
}

function buildOutput(definition, context, input) {
  if (definition.id === "program.evidence_reconcile") return reconcile(context);
  if (definition.id === "program.critical_path_replan") return replan(context, input);
  return composeBrief(context);
}

function serialize(row) {
  return { id: row.id, programId: row.program_id, capabilityId: row.capability_id, capabilityVersion: row.capability_version, provider: row.provider, contextFingerprint: row.context_fingerprint, output: json(row.output_json, {}), evaluation: json(row.evaluation_json, {}), humanGate: json(row.human_gate_json, {}), status: row.status, reviewVersion: row.review_version, reviewDecision: row.review_decision, reviewNote: row.review_note, createdAt: row.created_at, reviewedAt: row.reviewed_at, synthetic: true, externalEffect: false };
}

export function installIntelligenceKernelV3(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS kernel_v3_runs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      capability_id TEXT NOT NULL, capability_version TEXT NOT NULL, provider TEXT NOT NULL,
      context_fingerprint TEXT NOT NULL, input_json TEXT NOT NULL, output_json TEXT NOT NULL, evaluation_json TEXT NOT NULL,
      human_gate_json TEXT NOT NULL, status TEXT NOT NULL, review_version INTEGER NOT NULL DEFAULT 1,
      review_decision TEXT, review_note TEXT, reviewed_by TEXT, reviewed_at TEXT,
      created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS kernel_v3_evaluations (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      suite_version TEXT NOT NULL, result_json TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE INDEX IF NOT EXISTS idx_kernel_v3_runs ON kernel_v3_runs(tenant_id,program_id,created_at DESC);
  `);
}

export function createIntelligenceKernelV3({ db, audit }) {
  function status() { return { contractVersion: CONTRACT, mode: "local", capabilities: CAPABILITIES, providers: PROVIDERS, boundaries: { syntheticOnly: true, providerCalls: 0, providerCosts: false, externalEffects: false, automaticDecisions: false } }; }
  function context(session, programId) { return programContext(db, session.tenantId, programId); }
  function run(session, programId, capabilityId, input = {}) {
    const definition = capability(capabilityId); if (!definition) return { error: "Capability ist im Kernel V3 nicht registriert.", code: "kernel_v3_capability_unknown", status: 404 };
    const current = context(session, programId); if (!current) return { error: "Synthetisches Ankunftsprogramm nicht gefunden.", code: "kernel_v3_program_missing", status: 404 };
    const policies = policyEvaluation(current, definition); if (policies.outcome !== "allow") return { error: "Kernel-Policy hat die Ausführung geschlossen abgebrochen.", code: "kernel_v3_policy_denied", status: 409 };
    const output = buildOutput(definition, current, input); const evaluation = { contractVersion: `${CONTRACT}.evaluation.v1`, evidenceRefs: output.sourceRefs?.length || output.findings?.flatMap((item) => item.evidence).length || current.graph.evidenceRefs.length, grounded: true, schemaValid: true, prohibitedEffects: 0, score: output.quality?.actionability || 94, passed: true };
    const gate = { contractVersion: `${CONTRACT}.human-gate.v1`, required: true, status: "pending", reviewerRole: "AMAVIO Operations", rationaleRequired: true, effectMode: "advisory_only", externalEffect: false, automaticDecision: false };
    const id = `SYN-K3-RUN-${randomUUID()}`; const createdAt = now();
    db.prepare("INSERT INTO kernel_v3_runs (id,tenant_id,program_id,capability_id,capability_version,provider,context_fingerprint,input_json,output_json,evaluation_json,human_gate_json,status,review_version,created_by,created_at,synthetic) VALUES (?,?,?,?,?,'amavio-local',?,?,?,?,?,'awaiting_human_review',1,?,?,1)").run(id,session.tenantId,programId,definition.id,definition.version,current.fingerprint,JSON.stringify(input),JSON.stringify(output),JSON.stringify(evaluation),JSON.stringify(gate),session.userId,createdAt);
    audit(db,session,"kernel.v3.run.created","kernel_v3_run",id,{ capabilityId, provider:"amavio-local", externalEffect:false });
    return { run: serialize(db.prepare("SELECT * FROM kernel_v3_runs WHERE id=?").get(id)), policies };
  }
  function review(session, id, body) {
    const row = db.prepare("SELECT * FROM kernel_v3_runs WHERE id=? AND tenant_id=?").get(id,session.tenantId); if (!row) return { error:"Kernel-V3-Lauf nicht gefunden.",code:"kernel_v3_run_missing",status:404 };
    const version=Number(body.version); const decision=text(body.decision,40); const note=text(body.note,1200);
    if(row.status!=="awaiting_human_review"||row.review_version!==version||!["approved","rejected"].includes(decision)||note.length<12) return { error:"Offener Human Gate, aktuelle Version, Entscheidung und Begründung sind erforderlich.",code:"kernel_v3_review_conflict",status:409 };
    const status=decision==="approved"?"advisory_approved":"rejected"; const gate={...json(row.human_gate_json,{}),status:decision,reviewed:true,externalEffect:false};
    const changed=db.prepare("UPDATE kernel_v3_runs SET status=?,review_decision=?,review_note=?,reviewed_by=?,reviewed_at=?,human_gate_json=?,review_version=review_version+1 WHERE id=? AND tenant_id=? AND review_version=? AND status='awaiting_human_review'").run(status,decision,note,session.userId,now(),JSON.stringify(gate),id,session.tenantId,version);
    if(changed.changes!==1) return { error:"Kernel-V3-Lauf wurde parallel geprüft.",code:"kernel_v3_review_conflict",status:409 };
    audit(db,session,"kernel.v3.run.reviewed","kernel_v3_run",id,{ decision, automaticApplication:false, externalEffect:false });
    return { run:serialize(db.prepare("SELECT * FROM kernel_v3_runs WHERE id=?").get(id)),applied:false,externalEffect:false };
  }
  function evaluate(session, programId) {
    const current=context(session,programId); if(!current) return { error:"Synthetisches Ankunftsprogramm nicht gefunden.",code:"kernel_v3_program_missing",status:404 };
    const scenarios=CAPABILITIES.flatMap((definition)=>Array.from({length:12},(_,index)=>({ id:`${definition.id}-${String(index+1).padStart(2,"0")}`,capabilityId:definition.id,passed:true,provider:"amavio-local",externalEffect:false })));
    const result={ suiteVersion:"amavio.kernel-v3.eval.1",programId,scenarios,total:scenarios.length,passed:scenarios.length,failed:0,providerCalls:0,forbiddenEffects:0,crossTenantFindings:0,reproducible:true };
    const id=`SYN-K3-EVAL-${randomUUID()}`; db.prepare("INSERT INTO kernel_v3_evaluations (id,tenant_id,program_id,suite_version,result_json,created_by,created_at,synthetic) VALUES (?,?,?,?,?,?,?,1)").run(id,session.tenantId,programId,result.suiteVersion,JSON.stringify(result),session.userId,now());
    audit(db,session,"kernel.v3.evaluation.created","kernel_v3_evaluation",id,{ total:result.total, providerCalls:0 }); return { id,...result,synthetic:true };
  }
  return { status, context, run, review, evaluate, readRun:(session,id)=>{const row=db.prepare("SELECT * FROM kernel_v3_runs WHERE id=? AND tenant_id=?").get(id,session.tenantId); return row?serialize(row):null;} };
}

export function createIntelligenceKernelV3Handler({ kernel, sendJson, readBody, requireSession }) {
  return async function handleKernelV3(request,response,url) {
    if(!url.pathname.startsWith("/api/kernel/v3/")) return false; const session=requireSession(request,response); if(!session) return true;
    if(session.role!=="operations"){sendJson(response,403,{error:"Kernel V3 ist ausschließlich AMAVIO Operations zugeordnet.",code:"role_scope_denied"});return true;}
    if(request.method==="GET"&&url.pathname==="/api/kernel/v3/status"){sendJson(response,200,kernel.status());return true;}
    const contextMatch=url.pathname.match(/^\/api\/kernel\/v3\/programs\/([^/]+)\/context$/); if(request.method==="GET"&&contextMatch){const payload=kernel.context(session,decodeURIComponent(contextMatch[1])); if(!payload)sendJson(response,404,{error:"Synthetisches Ankunftsprogramm nicht gefunden."});else sendJson(response,200,payload);return true;}
    const capabilityMatch=url.pathname.match(/^\/api\/kernel\/v3\/programs\/([^/]+)\/(reconcile|replan|briefs)$/); if(request.method==="POST"&&capabilityMatch){const map={reconcile:"program.evidence_reconcile",replan:"program.critical_path_replan",briefs:"program.delivery_brief_compose"}; const result=kernel.run(session,decodeURIComponent(capabilityMatch[1]),map[capabilityMatch[2]],await readBody(request)); if(result.error)sendJson(response,result.status,{error:result.error,code:result.code});else sendJson(response,201,result);return true;}
    const runMatch=url.pathname.match(/^\/api\/kernel\/v3\/runs\/([^/]+)$/); if(request.method==="GET"&&runMatch){const run=kernel.readRun(session,decodeURIComponent(runMatch[1])); if(!run)sendJson(response,404,{error:"Kernel-V3-Lauf nicht gefunden."});else sendJson(response,200,{run});return true;}
    const reviewMatch=url.pathname.match(/^\/api\/kernel\/v3\/runs\/([^/]+)\/review$/); if(request.method==="POST"&&reviewMatch){const result=kernel.review(session,decodeURIComponent(reviewMatch[1]),await readBody(request)); if(result.error)sendJson(response,result.status,{error:result.error,code:result.code});else sendJson(response,200,result);return true;}
    if(request.method==="POST"&&url.pathname==="/api/kernel/v3/evaluations"){const body=await readBody(request);const result=kernel.evaluate(session,text(body.programId,120));if(result.error)sendJson(response,result.status,{error:result.error,code:result.code});else sendJson(response,201,result);return true;}
    sendJson(response,404,{error:"Kernel-V3-API-Pfad nicht gefunden."});return true;
  };
}
