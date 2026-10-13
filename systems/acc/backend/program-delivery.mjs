import { randomUUID } from "node:crypto";

const text = (value, max = 2_000) => String(value ?? "").trim().slice(0, max);
const json = (value, fallback = []) => { try { return JSON.parse(value); } catch { return fallback; } };
const now = () => new Date().toISOString();
const roleGroup = (session) => session?.role === "operations" ? "operations" : String(session?.role || "").startsWith("employer_") ? "employer" : "unknown";
const roleMatches = (session, owner = "") => {
  if (session?.role === "operations") return true;
  const value = String(owner).toLowerCase();
  if (session?.role === "employer_sponsor") return /sponsor|geschäft/.test(value);
  if (session?.role === "employer_hr") return /hr|personal/.test(value);
  if (session?.role === "employer_location") return /standort|betrieb|pate/.test(value);
  if (session?.role === "employer_budget") return /budget|controlling|finanz/.test(value);
  return false;
};

function programRow(row) {
  return {
    id: row.id, title: row.title, employer: row.employer, sector: row.sector,
    arrivalWindow: { start: row.arrival_start, end: row.arrival_end }, employmentStart: row.employment_start,
    status: row.status, successCriteria: json(row.success_criteria_json), version: row.version,
    synthetic: true, externalEffect: false,
  };
}

function loadProgram(db, tenantId, id, session) {
  const row = db.prepare("SELECT * FROM arrival_programs WHERE id=? AND tenant_id=?").get(id, tenantId);
  if (!row) return null;
  const employer = roleGroup(session) === "employer";
  const workstreams = db.prepare("SELECT * FROM program_workstreams WHERE tenant_id=? AND program_id=? ORDER BY sequence").all(tenantId, id).map((item) => ({
    id: item.id, sequence: item.sequence, title: item.title, ownerRole: item.owner_role,
    status: item.status, startDate: item.start_date, endDate: item.end_date,
    dependencyId: item.dependency_id, outcome: item.outcome, synthetic: true,
  }));
  const decisions = db.prepare("SELECT * FROM program_decisions WHERE tenant_id=? AND program_id=? ORDER BY due_date,id").all(tenantId, id)
    .filter((item) => !employer || roleMatches(session, item.decider_role))
    .map((item) => ({ id: item.id, title: item.title, question: item.question, deciderRole: item.decider_role, dueDate: item.due_date, basis: json(item.basis_json), status: item.status, selectedOption: item.selected_option, rationale: item.rationale, version: item.version, canReview: item.status === "open" && roleMatches(session, item.decider_role) }));
  const capacity = db.prepare("SELECT period,planned_arrivals AS planned,available_capacity AS available FROM program_capacity WHERE tenant_id=? AND program_id=? ORDER BY period").all(tenantId, id);
  const cohorts = db.prepare("SELECT * FROM program_cohorts WHERE tenant_id=? AND program_id=? ORDER BY arrival_date").all(tenantId, id).map((item) => ({ id: item.id, title: item.title, profession: item.profession, participantCount: item.participant_count, locations: json(item.locations_json), arrivalDate: item.arrival_date, employmentStart: item.employment_start, readiness: item.readiness, riskCount: item.risk_count }));
  const outcomes = db.prepare("SELECT * FROM program_outcomes WHERE tenant_id=? AND program_id=? ORDER BY created_at DESC").all(tenantId, id).filter((item) => !employer || item.created_role === session.role).map((item) => ({ id: item.id, rating: item.rating, strengths: item.strengths, challenges: item.challenges, currentNeed: item.current_need, status: item.status, createdRole: item.created_role, createdAt: item.created_at }));
  const adjustments = employer ? [] : db.prepare("SELECT * FROM program_adjustments WHERE tenant_id=? AND program_id=? ORDER BY created_at DESC").all(tenantId, id).map((item) => ({ id: item.id, trigger: item.trigger, affected: json(item.affected_json), recommendation: item.recommendation, alternatives: json(item.alternatives_json), impact: item.impact, uncertainties: json(item.uncertainties_json), evidence: json(item.evidence_json), status: item.status, version: item.version, createdAt: item.created_at }));
  return {
    program: programRow(row), cohorts, workstreams, decisions, capacity, outcomes, adjustments,
    sharedStatus: {
      completed: workstreams.filter((item) => item.status === "completed").length,
      active: workstreams.filter((item) => item.status === "active").length,
      blocked: workstreams.filter((item) => item.status === "blocked").length,
      openDecisions: decisions.filter((item) => item.status === "open").length,
    },
    access: employer
      ? { roleGroup: "employer", projection: "program_shared", internalPlanningHidden: true, allowed: ["program.read", "assigned_decision.review", "outcome.submit"] }
      : { roleGroup: "operations", projection: "program_internal", internalPlanningHidden: false, allowed: ["program.read", "simulation.create", "adjustment.review", "work_product.create"] },
    boundaries: { syntheticOnly: true, externalEffects: false, automaticDecision: false, providerCalls: 0 },
  };
}

export function installProgramDelivery(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS arrival_programs (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), title TEXT NOT NULL, employer TEXT NOT NULL,
      sector TEXT NOT NULL, arrival_start TEXT NOT NULL, arrival_end TEXT NOT NULL, employment_start TEXT NOT NULL,
      status TEXT NOT NULL, success_criteria_json TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_cohorts (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      title TEXT NOT NULL, profession TEXT NOT NULL, participant_count INTEGER NOT NULL, locations_json TEXT NOT NULL,
      arrival_date TEXT NOT NULL, employment_start TEXT NOT NULL, readiness INTEGER NOT NULL, risk_count INTEGER NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_workstreams (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      sequence INTEGER NOT NULL, title TEXT NOT NULL, owner_role TEXT NOT NULL, status TEXT NOT NULL,
      start_date TEXT NOT NULL, end_date TEXT NOT NULL, dependency_id TEXT, outcome TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_decisions (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      title TEXT NOT NULL, question TEXT NOT NULL, decider_role TEXT NOT NULL, due_date TEXT NOT NULL,
      basis_json TEXT NOT NULL, status TEXT NOT NULL, selected_option TEXT, rationale TEXT,
      reviewed_by TEXT, reviewed_at TEXT, version INTEGER NOT NULL DEFAULT 1, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_capacity (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      period TEXT NOT NULL, planned_arrivals INTEGER NOT NULL, available_capacity INTEGER NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_adjustments (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      trigger TEXT NOT NULL, affected_json TEXT NOT NULL, recommendation TEXT NOT NULL, alternatives_json TEXT NOT NULL,
      impact TEXT NOT NULL, uncertainties_json TEXT NOT NULL, evidence_json TEXT NOT NULL,
      status TEXT NOT NULL, review_note TEXT, reviewed_by TEXT, reviewed_at TEXT, version INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_outcomes (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      rating TEXT NOT NULL, strengths TEXT NOT NULL, challenges TEXT NOT NULL, current_need TEXT NOT NULL,
      status TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id), created_role TEXT NOT NULL, created_at TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE TABLE IF NOT EXISTS program_work_products (
      id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), program_id TEXT NOT NULL REFERENCES arrival_programs(id),
      type TEXT NOT NULL, title TEXT NOT NULL, content_json TEXT NOT NULL, status TEXT NOT NULL,
      created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK (synthetic=1)
    );
    CREATE INDEX IF NOT EXISTS idx_programs_tenant ON arrival_programs(tenant_id,status);
    CREATE INDEX IF NOT EXISTS idx_program_workstreams ON program_workstreams(tenant_id,program_id,sequence);
    CREATE INDEX IF NOT EXISTS idx_program_decisions ON program_decisions(tenant_id,program_id,status);
  `);

  const program = db.prepare("INSERT OR IGNORE INTO arrival_programs (id,tenant_id,title,employer,sector,arrival_start,arrival_end,employment_start,status,success_criteria_json,version,synthetic) VALUES (?,?,?,?,?,?,?,?,?,?,1,1)");
  program.run("SYN-PROG-001", "SYN-TENANT-001", "Pflegekohorte Rheinland · September", "Klinikverbund Rheinland", "Pflege", "2026-09-01", "2026-09-30", "2026-10-01", "delivery_active", JSON.stringify(["Arbeitsstart planmäßig", "Arbeitgeberentscheidungen fristgerecht", "vollständige Übergabeevidenz"]));
  program.run("SYN-PROG-002", "SYN-TENANT-001", "Medizintechnik Süd · Oktober", "Industriegruppe Südwest", "Medizintechnik", "2026-10-12", "2026-10-30", "2026-11-02", "planning", JSON.stringify(["Anreiseplan bestätigt", "Standortübergabe benannt"]));
  program.run("SYN-PROG-003", "SYN-TENANT-001", "Erzieherinnen Bayern · November", "Städtischer Trägerverbund", "Pädagogik", "2026-11-03", "2026-11-24", "2026-12-01", "intake", JSON.stringify(["Bedarf bestätigt", "Kohortenplan freigegeben"]));
  program.run("SYN-PROG-900", "SYN-TENANT-002", "Technik Westhafen · Oktober", "Westhafen Industriewerke", "Technik", "2026-10-01", "2026-10-20", "2026-10-26", "planning", JSON.stringify(["Standortstart planmäßig"]));

  const cohort = db.prepare("INSERT OR IGNORE INTO program_cohorts (id,tenant_id,program_id,title,profession,participant_count,locations_json,arrival_date,employment_start,readiness,risk_count,synthetic) VALUES (?,?,?,?,?,?,?,?,?,?,?,1)");
  cohort.run("SYN-COHORT-001", "SYN-TENANT-001", "SYN-PROG-001", "Pflegekohorte September", "Pflegefachkräfte", 12, JSON.stringify(["Düsseldorf", "Köln", "Solingen"]), "2026-09-13", "2026-10-01", 74, 3);
  cohort.run("SYN-COHORT-002", "SYN-TENANT-001", "SYN-PROG-001", "Nachlauf September", "Pflegefachkräfte", 4, JSON.stringify(["Düsseldorf"]), "2026-09-28", "2026-10-12", 61, 2);
  cohort.run("SYN-COHORT-003", "SYN-TENANT-001", "SYN-PROG-002", "Technik Oktober", "Medizintechnik", 8, JSON.stringify(["Stuttgart"]), "2026-10-20", "2026-11-02", 42, 1);

  const workstream = db.prepare("INSERT OR IGNORE INTO program_workstreams (id,tenant_id,program_id,sequence,title,owner_role,status,start_date,end_date,dependency_id,outcome,synthetic) VALUES (?,?,?,?,?,?,?,?,?,?,?,1)");
  const streams = [
    ["SYN-WS-001",1,"Bedarf und Programmrahmen","Arbeitgeber Sponsor","completed","2026-07-01","2026-07-12",null,"Bedarf und Erfolgskriterien bestätigt"],
    ["SYN-WS-002",2,"Kohorten- und Standortplanung","AMAVIO Operations","completed","2026-07-13","2026-08-02","SYN-WS-001","Kohorten, Standorte und Termine verbunden"],
    ["SYN-WS-003",3,"Visa und Einreise","AMAVIO Operations","active","2026-08-03","2026-09-12","SYN-WS-002","Einreisegrundlagen dokumentiert"],
    ["SYN-WS-004",4,"Unterkunft und Übergabe","Arbeitgeber Standort","blocked","2026-08-15","2026-09-13","SYN-WS-002","Unterkunft und Übergabe bestätigt"],
    ["SYN-WS-005",5,"Betriebliches Onboarding","Arbeitgeber HR","active","2026-08-20","2026-10-01","SYN-WS-002","Paten und Arbeitsstart vorbereitet"],
    ["SYN-WS-006",6,"Ankunft und Orientierung","AMAVIO Operations","planned","2026-09-13","2026-09-30","SYN-WS-003","Ankunftsphase abgeschlossen"],
    ["SYN-WS-007",7,"Outcome und Stabilisierung","Gemeinsam","planned","2026-10-01","2026-12-15","SYN-WS-006","Arbeitsstart und Stabilisierung bewertet"],
  ];
  streams.forEach((item) => workstream.run(item[0],"SYN-TENANT-001","SYN-PROG-001",...item.slice(1)));

  const decision = db.prepare("INSERT OR IGNORE INTO program_decisions (id,tenant_id,program_id,title,question,decider_role,due_date,basis_json,status,version,synthetic) VALUES (?,?,?,?,?,?,?,?,?,1,1)");
  decision.run("SYN-PROG-DEC-001","SYN-TENANT-001","SYN-PROG-001","Standortverteilung bestätigen","Wie werden die zwölf synthetischen Pflegefachkräfte auf Düsseldorf, Köln und Solingen verteilt?","Arbeitgeber Sponsor","2026-09-10",JSON.stringify(["Kohortenplan", "Standortkapazität", "Arbeitsstarttermine"]),"open");
  decision.run("SYN-PROG-DEC-002","SYN-TENANT-001","SYN-PROG-001","Paten im Betrieb benennen","Welche synthetischen Paten übernehmen die betriebliche Übergabe?","Arbeitgeber HR","2026-09-15",JSON.stringify(["Rollenprofil", "Schichtplan", "Onboardingplan"]),"open");
  decision.run("SYN-PROG-DEC-003","SYN-TENANT-001","SYN-PROG-001","Zusatzbedarf einordnen","Bleibt der synthetische Zusatzbedarf innerhalb des freigegebenen Rahmens?","Arbeitgeber Budget","2026-09-16",JSON.stringify(["Bedarfsnotiz", "Kostenrahmen"]),"open");

  const capacity = db.prepare("INSERT OR IGNORE INTO program_capacity (id,tenant_id,program_id,period,planned_arrivals,available_capacity,synthetic) VALUES (?,?,?,?,?,?,1)");
  [["SEP-1","2026-09",16,18],["OCT-1","2026-10",8,12],["NOV-1","2026-11",4,10],["DEC-1","2026-12",2,8]].forEach((item) => capacity.run(item[0],"SYN-TENANT-001","SYN-PROG-001",item[1],item[2],item[3]));
}

export function createProgramDeliveryHandler({ db, sendJson, readBody, requireSession, audit }) {
  return async function handleProgramDelivery(request, response, url) {
    if (!url.pathname.startsWith("/api/programs/v1/")) return false;
    const session = requireSession(request, response); if (!session) return true;
    const group = roleGroup(session);

    if (request.method === "GET" && url.pathname === "/api/programs/v1/bootstrap") {
      const programs = db.prepare("SELECT * FROM arrival_programs WHERE tenant_id=? ORDER BY CASE status WHEN 'delivery_active' THEN 1 WHEN 'planning' THEN 2 ELSE 3 END,title").all(session.tenantId).map(programRow);
      const selected = programs[0] ? loadProgram(db, session.tenantId, programs[0].id, session) : null;
      sendJson(response, 200, { programs, selected, access: { role: session.role, roleGroup: group }, boundaries: { syntheticOnly: true, providerCalls: 0, externalEffects: false } }); return true;
    }

    const detailMatch = url.pathname.match(/^\/api\/programs\/v1\/programs\/([^/]+)$/);
    if (request.method === "GET" && detailMatch) {
      const detail = loadProgram(db, session.tenantId, decodeURIComponent(detailMatch[1]), session);
      if (!detail) { sendJson(response, 404, { error: "Synthetisches Ankunftsprogramm im aktiven Mandanten nicht gefunden." }); return true; }
      sendJson(response, 200, detail); return true;
    }

    const decisionMatch = url.pathname.match(/^\/api\/programs\/v1\/decisions\/([^/]+)\/review$/);
    if (request.method === "POST" && decisionMatch) {
      if (group !== "employer") { sendJson(response, 403, { error: "Nur die zugeordnete Arbeitgeberrolle kann diese Programmentscheidung dokumentieren.", code: "employer_role_required" }); return true; }
      const id = decodeURIComponent(decisionMatch[1]);
      const row = db.prepare("SELECT * FROM program_decisions WHERE id=? AND tenant_id=?").get(id, session.tenantId);
      if (!row) { sendJson(response, 404, { error: "Programmentscheidung nicht gefunden." }); return true; }
      if (!roleMatches(session, row.decider_role)) { sendJson(response, 403, { error: "Diese Entscheidung ist einer anderen Arbeitgeberrolle zugeordnet.", code: "role_scope_denied" }); return true; }
      const body = await readBody(request); const version = Number(body.version); const option = text(body.option, 240); const rationale = text(body.rationale, 1_200);
      if (row.status !== "open" || version !== row.version || !option || rationale.length < 12) { sendJson(response, 409, { error: "Offene Entscheidung, aktuelle Version, Option und Begründung sind erforderlich.", code: "program_decision_conflict" }); return true; }
      const changed = db.prepare("UPDATE program_decisions SET status='reviewed',selected_option=?,rationale=?,reviewed_by=?,reviewed_at=?,version=version+1 WHERE id=? AND tenant_id=? AND version=? AND status='open'").run(option,rationale,session.userId,now(),id,session.tenantId,version);
      if (changed.changes !== 1) { sendJson(response, 409, { error: "Programmentscheidung wurde parallel bearbeitet.", code: "program_decision_conflict" }); return true; }
      audit(db,session,"program.decision.reviewed","program_decision",id,{ externalEffect:false, synthetic:true });
      sendJson(response,200,{ decision: loadProgram(db,session.tenantId,row.program_id,session).decisions.find((item)=>item.id===id), externalEffect:false }); return true;
    }

    const simulationMatch = url.pathname.match(/^\/api\/programs\/v1\/programs\/([^/]+)\/simulations$/);
    if (request.method === "POST" && simulationMatch) {
      if (group !== "operations") { sendJson(response,403,{ error:"Programmsimulation ist ausschließlich AMAVIO Operations zugeordnet.", code:"role_scope_denied" }); return true; }
      const programId = decodeURIComponent(simulationMatch[1]); const detail = loadProgram(db,session.tenantId,programId,session);
      if (!detail) { sendJson(response,404,{ error:"Ankunftsprogramm nicht gefunden." }); return true; }
      const body = await readBody(request); const shiftDays = Math.max(1,Math.min(21,Number(body.shiftDays)||7)); const trigger = text(body.trigger,500)||`Synthetisches Anreisefenster verschiebt sich um ${shiftDays} Tage.`;
      const id = `SYN-PROG-ADJ-${randomUUID()}`; const createdAt = now();
      const affected = detail.workstreams.filter((item)=>["active","blocked","planned"].includes(item.status)).map((item)=>({ id:item.id,title:item.title,owner:item.ownerRole,shiftDays }));
      const alternatives = ["Kohorte geschlossen verschieben", "Betroffene Teilgruppe neu planen", "Arbeitsstart mit dokumentierter Übergangslösung halten"];
      db.prepare("INSERT INTO program_adjustments (id,tenant_id,program_id,trigger,affected_json,recommendation,alternatives_json,impact,uncertainties_json,evidence_json,status,version,created_by,created_at,synthetic) VALUES (?,?,?,?,?,?,?,?,?,?, 'awaiting_human_review',1,?,?,1)").run(id,session.tenantId,programId,trigger,JSON.stringify(affected),`Kritischen Pfad für ${affected.length} Arbeitspakete lokal um ${shiftDays} Tage neu takten und Arbeitgeberfreigaben erneut prüfen.`,JSON.stringify(alternatives),"Arbeitsstarts bleiben nur stabil, wenn Standort- und HR-Übergaben vor dem neuen Anreisefenster bestätigt werden.",JSON.stringify(["Tatsächliche Verfügbarkeit externer Stellen ist in der Konzeptdemo nicht bekannt."]),JSON.stringify([programId,...detail.cohorts.map((item)=>item.id)]),session.userId,createdAt);
      audit(db,session,"program.simulation.created","program_adjustment",id,{ shiftDays, externalEffect:false });
      sendJson(response,201,{ adjustment: loadProgram(db,session.tenantId,programId,session).adjustments.find((item)=>item.id===id), applied:false, externalEffect:false }); return true;
    }

    const adjustmentMatch = url.pathname.match(/^\/api\/programs\/v1\/adjustments\/([^/]+)\/review$/);
    if (request.method === "POST" && adjustmentMatch) {
      if (group !== "operations") { sendJson(response,403,{ error:"Nur AMAVIO Operations kann eine Anpassungsvorlage fachlich prüfen.", code:"role_scope_denied" }); return true; }
      const id = decodeURIComponent(adjustmentMatch[1]); const row = db.prepare("SELECT * FROM program_adjustments WHERE id=? AND tenant_id=?").get(id,session.tenantId);
      if (!row) { sendJson(response,404,{ error:"Anpassungsvorlage nicht gefunden." }); return true; }
      const body = await readBody(request); const version=Number(body.version); const note=text(body.note,1200);
      if (row.status!=="awaiting_human_review"||version!==row.version||note.length<12) { sendJson(response,409,{ error:"Offene Vorlage, aktuelle Version und Prüfnotiz sind erforderlich.", code:"program_adjustment_conflict" }); return true; }
      db.prepare("UPDATE program_adjustments SET status='advisory_approved',review_note=?,reviewed_by=?,reviewed_at=?,version=version+1 WHERE id=? AND tenant_id=? AND version=? AND status='awaiting_human_review'").run(note,session.userId,now(),id,session.tenantId,version);
      audit(db,session,"program.adjustment.reviewed","program_adjustment",id,{ automaticApplication:false, externalEffect:false });
      sendJson(response,200,{ adjustment: loadProgram(db,session.tenantId,row.program_id,session).adjustments.find((item)=>item.id===id), applied:false, externalEffect:false }); return true;
    }

    const outcomeMatch = url.pathname.match(/^\/api\/programs\/v1\/programs\/([^/]+)\/outcomes$/);
    if (request.method === "POST" && outcomeMatch) {
      if (group!=="employer") { sendJson(response,403,{ error:"Outcome-Rückmeldungen sind Arbeitgeberrollen zugeordnet.", code:"employer_role_required" }); return true; }
      const programId=decodeURIComponent(outcomeMatch[1]); if (!loadProgram(db,session.tenantId,programId,session)) { sendJson(response,404,{ error:"Ankunftsprogramm nicht gefunden." }); return true; }
      const body=await readBody(request); const rating=text(body.rating,80); const strengths=text(body.strengths,1200); const challenges=text(body.challenges,1200); const currentNeed=text(body.currentNeed,1200);
      if (!rating||strengths.length<8||challenges.length<8||currentNeed.length<8) { sendJson(response,400,{ error:"Bewertung, Stärken, Herausforderungen und aktueller Bedarf sind erforderlich.", code:"invalid_program_outcome" }); return true; }
      const id=`SYN-PROG-OUT-${randomUUID()}`; db.prepare("INSERT INTO program_outcomes (id,tenant_id,program_id,rating,strengths,challenges,current_need,status,created_by,created_role,created_at,synthetic) VALUES (?,?,?,?,?,?,?,'submitted',?,?,?,1)").run(id,session.tenantId,programId,rating,strengths,challenges,currentNeed,session.userId,session.role,now());
      audit(db,session,"program.outcome.submitted","program_outcome",id,{ externalEffect:false, synthetic:true });
      sendJson(response,201,{ outcome: loadProgram(db,session.tenantId,programId,session).outcomes.find((item)=>item.id===id), externalEffect:false }); return true;
    }

    const productMatch = url.pathname.match(/^\/api\/programs\/v1\/programs\/([^/]+)\/work-products$/);
    if (request.method === "POST" && productMatch) {
      if (group!=="operations") { sendJson(response,403,{ error:"Programmarbeitsprodukte sind ausschließlich AMAVIO Operations zugeordnet.", code:"role_scope_denied" }); return true; }
      const programId=decodeURIComponent(productMatch[1]); const detail=loadProgram(db,session.tenantId,programId,session); if(!detail){ sendJson(response,404,{ error:"Ankunftsprogramm nicht gefunden." }); return true; }
      const body=await readBody(request); const type=text(body.type,80)||"weekly_arrival_status"; const id=`SYN-PROG-DOC-${randomUUID()}`; const createdAt=now();
      const content={ title:type==="outcome_service_review"?"Outcome & Service Review":"Wöchentlicher Arrival Status", program:detail.program.title, cohortCount:detail.cohorts.length, participantCount:detail.cohorts.reduce((sum,item)=>sum+item.participantCount,0), workstreams:detail.workstreams.map(({title,status,ownerRole})=>({title,status,ownerRole})), openDecisions:detail.decisions.filter((item)=>item.status==="open").map(({title,dueDate,deciderRole})=>({title,dueDate,deciderRole})), evidence:[detail.program.id,...detail.cohorts.map((item)=>item.id)], externalEffect:false };
      db.prepare("INSERT INTO program_work_products (id,tenant_id,program_id,type,title,content_json,status,created_by,created_at,synthetic) VALUES (?,?,?,?,?,?,'draft',?,?,1)").run(id,session.tenantId,programId,type,content.title,JSON.stringify(content),session.userId,createdAt);
      audit(db,session,"program.work_product.created","program_work_product",id,{ type, externalEffect:false });
      sendJson(response,201,{ workProduct:{ id,type,title:content.title,content,status:"draft",createdAt,synthetic:true }, externalEffect:false }); return true;
    }

    const productRead = url.pathname.match(/^\/api\/programs\/v1\/work-products\/([^/]+)$/);
    if (request.method === "GET" && productRead) {
      if(group!=="operations"){ sendJson(response,403,{ error:"Internes Programmarbeitsprodukt nicht freigegeben.", code:"role_scope_denied" }); return true; }
      const row=db.prepare("SELECT * FROM program_work_products WHERE id=? AND tenant_id=?").get(decodeURIComponent(productRead[1]),session.tenantId); if(!row){ sendJson(response,404,{ error:"Programmarbeitsprodukt nicht gefunden." }); return true; }
      sendJson(response,200,{ workProduct:{ id:row.id,type:row.type,title:row.title,content:json(row.content_json,{}),status:row.status,createdAt:row.created_at,synthetic:true } }); return true;
    }

    sendJson(response,404,{ error:"Program-Delivery-API-Pfad nicht gefunden." }); return true;
  };
}
