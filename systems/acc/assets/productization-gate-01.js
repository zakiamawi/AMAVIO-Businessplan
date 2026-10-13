(function () {
  "use strict";

  const q = (selector, root) => (root || document).querySelector(selector);
  const qa = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const sessionHeaders = { "content-type": "application/json", "x-demo-session": "demo-session-alpha" };
  const state = { runId: null, caseId: null, review: null };

  async function request(path, options) {
    const method = String(options?.method || "GET").toUpperCase();
    const mutationHeaders = method === "GET" || method === "HEAD" ? {} : { "idempotency-key": `ui-${crypto.randomUUID()}` };
    const response = await fetch(path, { ...options, headers: { ...sessionHeaders, ...mutationHeaders, ...(options?.headers || {}) } });
    const payload = await response.json().catch(() => ({ error: "Ungültige Serverantwort" }));
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return payload;
  }

  function setRuntime(online, text) {
    const runtime = q("[data-runtime-state]");
    runtime.classList.toggle("is-online", online);
    runtime.classList.toggle("is-offline", !online);
    runtime.lastChild.textContent = ` ${text}`;
    qa("[data-capability]").forEach((item) => {
      item.textContent = online ? "✓" : "×";
      item.classList.toggle("is-ready", online);
    });
  }

  function setFlow(step) {
    const order = ["case", "assist", "review", "effect"];
    const current = order.indexOf(step);
    qa("[data-flow-step]").forEach((item) => {
      const index = order.indexOf(item.dataset.flowStep);
      item.classList.toggle("is-current", index === current);
      item.classList.toggle("is-complete", index < current);
      if (index < current) item.querySelector("span").textContent = "✓";
    });
  }

  function renderBootstrap(payload) {
    const { tenant, case: pilotCase, provider } = payload;
    state.caseId = pilotCase.id;
    q("[data-pilot-case-title]").textContent = pilotCase.title;
    const facts = q("[data-pilot-facts]").querySelectorAll("dd");
    [tenant.name, pilotCase.id, pilotCase.arrivalDate, pilotCase.status].forEach((value, index) => { facts[index].textContent = value; });
    q("[data-pilot-evidence]").innerHTML = "";
    pilotCase.evidence.forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.label}: ${entry.value}`;
      q("[data-pilot-evidence]").appendChild(item);
    });
    q("[data-provider-chip]").textContent = provider.label;
    q("[data-provider-chip]").classList.toggle("is-external", provider.mode === "external");
    setRuntime(true, "Backend und Datenbank aktiv");
    setFlow("assist");
  }

  function renderResult(run) {
    const output = run.output;
    state.runId = run.id;
    state.review = run.reviewDecision || null;
    q("[data-assistance-result]").hidden = false;
    q("[data-result-summary]").textContent = output.summary;
    q("[data-result-confidence]").textContent = `Konfidenz: ${output.confidence}`;
    q("[data-result-recommendation]").textContent = output.recommendation;
    q("[data-result-evidence]").innerHTML = "";
    output.evidence.forEach((entry) => { const item = document.createElement("li"); item.textContent = entry; q("[data-result-evidence]").appendChild(item); });
    q("[data-result-uncertainty]").textContent = output.uncertainty;
    q("[data-result-forbidden]").textContent = output.forbiddenActions.join(" · ");
    q("[data-assistance-status]").textContent = `Lauf ${run.id} persistent gespeichert · Anbieter: ${run.provider}`;
    q("[data-review-note]").disabled = false;
    q("[data-review-note]").value = "Belege und Empfehlung wurden geprüft; keine Außenwirkung freigegeben.";
    qa("[data-review-decision]").forEach((button) => { button.disabled = false; });
    setReviewState(run.reviewDecision);
    setFlow(run.reviewDecision ? "effect" : "review");
  }

  function setReviewState(decision) {
    const badge = q("[data-review-state]");
    badge.className = "review-state";
    if (decision === "approved") { badge.textContent = "Menschlich geprüft"; badge.classList.add("is-approved"); }
    else if (decision === "rejected") { badge.textContent = "Zurückgewiesen"; badge.classList.add("is-rejected"); }
    else { badge.textContent = "Prüfung offen"; badge.classList.add("is-open"); }
    const approved = decision === "approved";
    qa("[data-create-preview]").forEach((button) => { button.disabled = !approved; });
    q("[data-effect-status]").textContent = approved
      ? "Menschlich geprüft · nur wirkungslose Vorschauen sind freigeschaltet."
      : "Freigabe erforderlich · kein Versand · keine Buchung.";
  }

  function renderAudit(events) {
    const list = q("[data-audit-list]");
    list.innerHTML = "";
    if (!events.length) { const item = document.createElement("li"); item.textContent = "Noch keine Ereignisse."; list.appendChild(item); return; }
    events.slice(0, 8).forEach((event) => {
      const item = document.createElement("li");
      const time = document.createElement("time");
      time.dateTime = event.createdAt;
      time.textContent = new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(event.createdAt));
      item.append(time, document.createTextNode(`${event.label} · ${event.entityType} ${event.entityId}`));
      list.appendChild(item);
    });
  }

  async function refreshAudit() {
    try { const payload = await request("/api/v1/audit"); renderAudit(payload.events); }
    catch (error) { q("[data-audit-list]").innerHTML = `<li>Audit nicht verfügbar: ${String(error.message).replace(/[<>]/g, "")}</li>`; }
  }

  q("[data-assistance-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = q("[data-run-assistance]");
    const objective = q("[data-pilot-objective]").value.trim();
    if (!objective || !state.caseId) return;
    button.disabled = true;
    q("[data-assistance-status]").textContent = "Strukturierter Lauf wird erzeugt und gespeichert …";
    try {
      const payload = await request("/api/v1/assistant/runs", { method: "POST", body: JSON.stringify({ caseId: state.caseId, objective }) });
      renderResult(payload.run);
      await refreshAudit();
    } catch (error) {
      q("[data-assistance-status]").textContent = `Lauf fehlgeschlagen: ${error.message}`;
    } finally { button.disabled = false; }
  });

  qa("[data-review-decision]").forEach((button) => button.addEventListener("click", async () => {
    if (!state.runId) return;
    qa("[data-review-decision]").forEach((item) => { item.disabled = true; });
    try {
      const payload = await request(`/api/v1/assistant/runs/${encodeURIComponent(state.runId)}/review`, {
        method: "POST",
        body: JSON.stringify({ decision: button.dataset.reviewDecision, note: q("[data-review-note]").value.trim() }),
      });
      state.review = payload.run.reviewDecision;
      setReviewState(state.review);
      setFlow("effect");
      await refreshAudit();
    } catch (error) {
      q("[data-effect-status]").textContent = `Prüfung konnte nicht gespeichert werden: ${error.message}`;
    } finally { qa("[data-review-decision]").forEach((item) => { item.disabled = false; }); }
  }));

  qa("[data-create-preview]").forEach((button) => button.addEventListener("click", async () => {
    if (!state.runId || state.review !== "approved") return;
    button.disabled = true;
    const kind = button.dataset.createPreview;
    try {
      const payload = await request(`/api/v1/${kind === "message" ? "outbox" : "bookings"}/preview`, {
        method: "POST",
        body: JSON.stringify({ caseId: state.caseId, runId: state.runId }),
      });
      q("[data-effect-status]").textContent = `${payload.label} ${payload.id} gespeichert · Status: ${payload.status} · keine Außenwirkung.`;
      await refreshAudit();
    } catch (error) { q("[data-effect-status]").textContent = `Vorschau fehlgeschlagen: ${error.message}`; }
    finally { button.disabled = false; }
  }));

  q("[data-refresh-audit]").addEventListener("click", refreshAudit);

  (async function bootstrap() {
    try {
      const payload = await request("/api/v1/bootstrap");
      renderBootstrap(payload);
      renderAudit(payload.auditEvents || []);
      if (payload.latestRun) renderResult(payload.latestRun);
    } catch (error) {
      setRuntime(false, "Backend nicht gestartet");
      q("[data-assistance-status]").textContent = "Starten Sie den lokalen Gate-01-Server; die bisherige Konzeptdemo bleibt nutzbar.";
      q("[data-audit-list]").innerHTML = `<li>Keine Serververbindung · ${String(error.message).replace(/[<>]/g, "")}</li>`;
    }
  }());
}());
