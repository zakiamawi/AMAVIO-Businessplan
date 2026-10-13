import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSeedState } from "../data/seed";
import { isSyntheticState, STORAGE_KEY } from "../domain/crmDomain";
import { migrateToR38 } from "../domain/migrations";
import { appendUndoAudit, approveOutreachDraft, archiveRecord, convertLeadToOpportunity, convertResearchToLead, createReadinessTask, createRecord, recordG1RestoreDrill, restoreRecord, runG1Controls, setHandoffApproval, setTaskStatus, suppressContact, transitionOpportunity, updateAgingRules, updateCostGuardrails, updateRecord } from "../domain/stateEngine";
import { applyServerImport, createServerBackup, downloadJson, listServerBackups, loadServerState, previewServerImport, restoreServerBackup, runServerRestoreDrill, saveServerState } from "../services/localPersistence";

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("amavio-one-crm-r3-7-g1-entry-gate-closure-v6") || localStorage.getItem("amavio-one-crm-r3-6-workspaces-analytics-g1-v5") || localStorage.getItem("amavio-one-crm-r3-5-operational-readiness-v5") || localStorage.getItem("amavio-one-crm-r3-4-founder-decision-v5") || localStorage.getItem("amavio-one-crm-r3-3-owner-growth-v5") || localStorage.getItem("amavio-one-crm-r3-2-local-core-v4");
    if (!stored) return { data: createSeedState(), loadNotice: null };
    const parsed = migrateToR38(JSON.parse(stored));
    if (!isSyntheticState(parsed)) throw new Error("Der gespeicherte Zustand entspricht nicht dem aktuellen lokalen Datenvertrag.");
    return { data: parsed, loadNotice: null };
  } catch (error) {
    return { data: createSeedState(), loadNotice: `Lokaler Speicher konnte nicht übernommen werden: ${error.message}` };
  }
}

export function useCrmState() {
  const initial = useMemo(loadState, []);
  const [data, setData] = useState(initial.data);
  const [notice, setNotice] = useState(initial.loadNotice ? { type: "error", message: initial.loadNotice } : null);
  const [undoEntry, setUndoEntry] = useState(null);
  const [persistence, setPersistence] = useState({ mode: "browser-fallback", status: "connecting", label: "Lokaler Browser-Fallback", lastSavedAt: null });
  const [serverReady, setServerReady] = useState(false);
  const noticeTimer = useRef(null);
  const syncTimer = useRef(null);

  const announce = useCallback((type, message) => {
    clearTimeout(noticeTimer.current);
    setNotice({ type, message });
    noticeTimer.current = setTimeout(() => setNotice(null), 6000);
  }, []);

  useEffect(() => () => { clearTimeout(noticeTimer.current); clearTimeout(syncTimer.current); }, []);

  useEffect(() => {
    let active = true;
    loadServerState().then(({ state }) => {
      if (!active) return;
      if (!isSyntheticState(state)) throw new Error("SQLite-Zustand entspricht nicht dem synthetischen v7-Datenvertrag.");
      setData(state);
      setServerReady(true);
      setPersistence({ mode: "sqlite", status: "ready", label: "Lokale SQLite-Datenbank", lastSavedAt: state.meta.updatedAt || null });
    }).catch(() => {
      if (!active) return;
      setPersistence({ mode: "browser-fallback", status: "ready", label: "Lokaler Browser-Fallback", lastSavedAt: null });
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      announce("error", `Lokale Speicherung fehlgeschlagen: ${error.message}`);
    }
    if (serverReady) {
      clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        setPersistence((current) => ({ ...current, status: "saving" }));
        saveServerState(data).then(({ updatedAt }) => setPersistence((current) => ({ ...current, status: "ready", lastSavedAt: updatedAt })))
          .catch((error) => { setPersistence((current) => ({ ...current, status: "error" })); announce("error", `SQLite-Speicherung fehlgeschlagen: ${error.message}`); });
      }, 220);
    }
  }, [announce, data, serverReady]);

  const run = useCallback((label, operation) => {
    let output;
    setData((current) => {
      try {
        output = operation(current);
        setUndoEntry({ label, previous: current });
        announce("success", label);
        return output.state;
      } catch (error) {
        announce("error", error.message || "Lokale Änderung nicht möglich.");
        output = { error };
        return current;
      }
    });
    return output;
  }, [announce]);

  const api = useMemo(() => ({
    create(entityType, draft) {
      const label = ({ organizations: "Organisation", contacts: "Kontakt", leads: "Lead", opportunities: "Chance", tasks: "Aufgabe", partnerOrganizations: "Partner", partnerContacts: "Partnerkontakt", activities: "Aktivität", notes: "Notiz", conversations: "Gespräch", appointments: "Termin", followUps: "Wiedervorlage", offers: "Angebot", decisions: "Entscheidung", documentReferences: "Dokumentreferenz", savedViews: "Ansicht", targetSegments: "Zielsegment", researchItems: "Rechercheeintrag", outreachDrafts: "Outreach-Entwurf", suppressionEntries: "Kontaktsperre" })[entityType] || "Datensatz";
      return run(`${label} lokal angelegt`, (current) => createRecord(current, entityType, draft));
    },
    update(entityType, id, patch) {
      return run("Änderungen lokal gespeichert", (current) => updateRecord(current, entityType, id, patch));
    },
    archive(entityType, id) {
      return run("Datensatz lokal archiviert", (current) => archiveRecord(current, entityType, id));
    },
    restore(entityType, id) {
      return run("Datensatz lokal wiederhergestellt", (current) => restoreRecord(current, entityType, id));
    },
    transitionOpportunity(id, toStage, lossReason) {
      return run("Pipelinephase lokal aktualisiert", (current) => transitionOpportunity(current, id, toStage, lossReason));
    },
    setTaskStatus(id, status) {
      return run(status === "completed" ? "Aufgabe abgeschlossen" : "Aufgabenstatus aktualisiert", (current) => setTaskStatus(current, id, status));
    },
    convertLead(id) {
      return run("Qualifizierter Lead lokal in Chance konvertiert", (current) => convertLeadToOpportunity(current, id));
    },
    convertResearch(id) {
      return run("Recherche lokal als Lead übernommen", (current) => convertResearchToLead(current, id));
    },
    approveOutreach(id) {
      return run("Outreach-Entwurf lokal freigegeben; Versand bleibt gesperrt", (current) => approveOutreachDraft(current, id));
    },
    suppressContact(id, reason) {
      return run("Kontakt lokal gesperrt", (current) => suppressContact(current, id, reason));
    },
    createReadinessTask(signal) {
      return run("Operativer Prüfpunkt als lokale Aufgabe angelegt", (current) => createReadinessTask(current, signal));
    },
    setHandoffApproval(opportunityId, approvalType, approved) {
      return run("Lokaler Handoff-Prüfmarker aktualisiert", (current) => setHandoffApproval(current, opportunityId, approvalType, approved));
    },
    updateAgingRules(patch) {
      return run("Lokale Alterungsregeln gespeichert", (current) => updateAgingRules(current, patch));
    },
    updateCostGuardrails(patch) {
      return run("Kosten- und Kontingentgrenzen gespeichert", (current) => updateCostGuardrails(current, patch));
    },
    runG1Controls() {
      return run("G1-Kontrollsuite lokal-synthetisch abgeschlossen; reale Daten bleiben gesperrt", (current) => runG1Controls(current));
    },
    async runRestoreDrill() {
      if (!serverReady) throw new Error("Für die isolierte Restore-Probe bitte das CRM mit npm start öffnen.");
      const result = await runServerRestoreDrill();
      run("Isolierte Wiederherstellungsprobe bestanden; Live-Zustand unverändert", (current) => recordG1RestoreDrill(current, result));
      return result;
    },
    async createBackup() {
      if (!serverReady) throw new Error("Für eine versionierte Sicherung bitte das CRM mit npm start öffnen.");
      const result = await createServerBackup();
      announce("success", "SQLite-Sicherung und lokaler JSON-Export wurden erstellt.");
      return result;
    },
    async listBackups() {
      if (!serverReady) return { backups: [] };
      return listServerBackups();
    },
    async restoreBackup(id) {
      if (!serverReady) throw new Error("SQLite-Server ist nicht aktiv.");
      const result = await restoreServerBackup(id);
      setData(result.state);
      announce("success", "Lokale Sicherung wurde wiederhergestellt.");
      return result;
    },
    async previewImport(imported) {
      const state = migrateToR38(imported);
      if (!isSyntheticState(state)) throw new Error("Nur freigegebene synthetische v7-Zustände dürfen importiert werden.");
      return serverReady ? previewServerImport(state) : { valid: true, syntheticOnly: true, state };
    },
    async applyImport(imported) {
      const state = migrateToR38(imported);
      if (!isSyntheticState(state)) throw new Error("Nur freigegebene synthetische v7-Zustände dürfen importiert werden.");
      const preview = serverReady ? await previewServerImport(state) : { valid: true, syntheticOnly: true, state };
      const result = serverReady ? await applyServerImport(preview.state) : { state: preview.state };
      setUndoEntry({ label: "Synthetischen Import anwenden", previous: data });
      setData(result.state);
      announce("success", "Synthetischer Import wurde lokal übernommen.");
      return result;
    },
    exportState() {
      downloadJson(`amavio-crm-r3-8-g1-assurance-synthetisch-${new Date().toISOString().slice(0, 10)}.json`, data);
      announce("success", "Synthetischer JSON-Export wurde bereitgestellt.");
    },
    resetDemo() {
      const previous = data;
      setData(createSeedState());
      setUndoEntry({ label: "Demonstrationszustand zurückgesetzt", previous });
      announce("success", "Synthetischer Demonstrationszustand wurde zurückgesetzt.");
    },
    undo() {
      if (!undoEntry) return;
      setData(appendUndoAudit(undoEntry.previous, undoEntry.label));
      announce("success", `Rückgängig: ${undoEntry.label}`);
      setUndoEntry(null);
    },
    clearNotice() { setNotice(null); },
  }), [announce, data, run, serverReady, undoEntry]);

  return { data, api, notice, canUndo: Boolean(undoEntry), persistence };
}
