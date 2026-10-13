import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "./components/AppShell";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DetailDrawer } from "./components/DetailDrawer";
import { ContactsView, LeadsView, OrganizationsView, PartnersView, PipelineView, TasksView } from "./components/DirectoryViews";
import { AnalyticsView } from "./components/AnalyticsView";
import { EntityFormDialog } from "./components/EntityFormDialog";
import { GlobalSearchDialog } from "./components/GlobalSearchDialog";
import { ImportedRecordDialog } from "./components/ImportedRecordDialog";
import { GrowthWorkspace } from "./components/GrowthWorkspace";
import { FounderDecisionCockpit } from "./components/FounderDecisionCockpit";
import { WorkJournalView } from "./components/WorkJournalView";
import { WorkdayView } from "./components/WorkdayView";
import { organizationName, searchCrm } from "./domain/crmDomain";
import { importedCrmRecordsApi } from "./services/importedCrmRecords";
import { useCrmState } from "./state/useCrmState";

const pageByType = { organizations: "organizations", contacts: "contacts", importedOrganizations: "organizations", importedContacts: "contacts", leads: "leads", opportunities: "pipeline", tasks: "tasks", partnerOrganizations: "partners", partnerContacts: "partners", notes: "worklog", conversations: "worklog", appointments: "worklog", followUps: "worklog", offers: "worklog", decisions: "worklog", documentReferences: "worklog", targetSegments: "growth", researchItems: "growth", outreachDrafts: "growth" };

export default function App() {
  const { data, api, notice, canUndo, persistence } = useCrmState();
  const [page, setPage] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [selection, setSelection] = useState(null);
  const [importedSelection, setImportedSelection] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const searchInputRef = useRef(null);
  const searchReturnFocusRef = useRef(null);

  const localSearchResults = useMemo(() => searchQuery.trim().length >= 2 ? searchCrm(data, searchQuery).slice(0, 24) : [], [data, searchQuery]);
  const importedSearch = useImportedGlobalSearch(searchQuery, searchOpen);
  const searchResults = useMemo(() => [...localSearchResults, ...importedSearch.results], [importedSearch.results, localSearchResults]);
  const closeDetail = useCallback(() => setSelection(null), []);
  const closeImportedDetail = useCallback(() => setImportedSelection(null), []);
  const openSearch = useCallback((trigger) => {
    const visibleTrigger = [...document.querySelectorAll("[data-search-trigger='true']")].find((element) => element.getClientRects().length > 0);
    searchReturnFocusRef.current = trigger?.matches?.("[data-search-trigger='true']") ? trigger : visibleTrigger || null;
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => {
    const returnTarget = searchReturnFocusRef.current;
    setSearchOpen(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => returnTarget?.focus?.()));
  }, []);

  useEffect(() => {
    function shortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        openSearch(document.activeElement);
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, [openSearch]);

  function openEntity(type, id) {
    setImportedSelection(null);
    setSelection({ type, id });
  }

  function openImportedEntity(type, id) {
    setSelection(null);
    setImportedSelection({ type, id });
  }

  function openSearchResult(result) {
    setSearchOpen(false);
    setPage(pageByType[result.type] || "cockpit");
    if (result.type === "importedOrganizations") {
      openImportedEntity("organization", result.id);
      return;
    }
    if (result.type === "importedContacts") {
      openImportedEntity("contact", result.id);
      return;
    }
    setImportedSelection(null);
    setSelection(["targetSegments", "researchItems", "outreachDrafts"].includes(result.type) ? null : { type: result.type, id: result.id });
  }

  function openCreate(kind, context = {}) {
    setFormConfig({ kind, context });
  }

  function saveForm(draft) {
    if (!formConfig) return;
    if (formConfig.record) api.update(formConfig.kind, formConfig.record.id, draft);
    else api.create(formConfig.kind, draft);
    setFormConfig(null);
  }

  function requestArchive(type, entity) {
    setConfirmConfig({
      title: `${archiveTitle(type)} archivieren?`,
      description: "Archivierung ist lokal reversibel; Beziehungen bleiben erhalten.",
      body: `${entityName(type, entity, data)} wird aus den Standardansichten ausgeblendet.`,
      confirmLabel: "Lokal archivieren",
      tone: "danger",
      onConfirm: () => { api.archive(type, entity.id); setSelection(null); },
    });
  }

  function requestReset() {
    setConfirmConfig({
      title: "Synthetischen Demonstrationszustand zurücksetzen?",
      description: "Die vorhandenen v1-, v2- und v3-Speicherstände bleiben unangetastet.",
      body: "Nur der synthetische CRM-Core wird durch die kontrollierten Ausgangsdaten ersetzt. Importierte Organisationen und Kontakte bleiben unverändert.",
      confirmLabel: "Demo zurücksetzen",
      tone: "danger",
      onConfirm: () => { api.resetDemo(); setSelection(null); setPage("today"); setSearchQuery(""); },
    });
  }

  let content = <WorkdayView data={data} openEntity={openEntity} onNavigate={setPage} onSetTaskStatus={api.setTaskStatus} />;
  if (page === "cockpit") content = <FounderDecisionCockpit data={data} openEntity={openEntity} onNavigate={setPage} />;
  if (page === "pipeline") content = <PipelineView data={data} stageFilter={stageFilter} setStageFilter={setStageFilter} ownerFilter={ownerFilter} setOwnerFilter={setOwnerFilter} openOpportunity={(id) => openEntity("opportunities", id)} onCreate={openCreate} />;
  if (page === "organizations") content = <OrganizationsView data={data} onOpen={openEntity} onOpenImported={openImportedEntity} onCreate={openCreate} />;
  if (page === "contacts") content = <ContactsView data={data} onOpen={openEntity} onOpenImported={openImportedEntity} onCreate={openCreate} />;
  if (page === "leads") content = <LeadsView data={data} onOpen={openEntity} onCreate={openCreate} />;
  if (page === "partners") content = <PartnersView data={data} onOpen={openEntity} onCreate={openCreate} />;
  if (page === "tasks") content = <TasksView data={data} onOpen={openEntity} onCreate={openCreate} onSetStatus={api.setTaskStatus} />;
  if (page === "worklog") content = <WorkJournalView data={data} onOpen={openEntity} onCreate={openCreate} onArchiveView={(id) => api.archive("savedViews", id)} onUpdateAgingRules={api.updateAgingRules} />;
  if (page === "growth") content = <GrowthWorkspace data={data} api={api} persistence={persistence} openEntity={openEntity} onNavigate={setPage} />;
  if (page === "data") content = <GrowthWorkspace data={data} api={api} persistence={persistence} workspace="system" openEntity={openEntity} onNavigate={setPage} />;
  if (page === "reports") content = <AnalyticsView data={data} onNavigate={setPage} openEntity={openEntity} />;

  return <AppShell
    page={page}
    onPageChange={setPage}
    searchQuery={searchQuery}
    onSearchQueryChange={setSearchQuery}
    onSearchOpen={openSearch}
    onCreate={openCreate}
    onResetRequest={requestReset}
    notice={notice}
    canUndo={canUndo}
    onUndo={api.undo}
    onNoticeClose={api.clearNotice}
  >
    {content}
    <DetailDrawer
      selection={selection}
      data={data}
      onClose={closeDetail}
      onEdit={(kind, record) => setFormConfig({ kind, record })}
      onArchive={requestArchive}
      onRestore={(kind, record) => api.restore(kind, record.id)}
      onCreateTask={(opportunity) => setFormConfig({ kind: "tasks", context: { opportunityId: opportunity.id, organizationId: opportunity.organizationId } })}
      onCreateActivity={(opportunity) => setFormConfig({ kind: "activities", context: { opportunityId: opportunity.id, organizationId: opportunity.organizationId, contactId: opportunity.primaryContactId } })}
      onCreateRelated={(kind, opportunity) => setFormConfig({ kind, context: { opportunityId: opportunity.id, organizationId: opportunity.organizationId, contactId: opportunity.primaryContactId } })}
      onTransition={api.transitionOpportunity}
      onSetTaskStatus={api.setTaskStatus}
      onConvertLead={api.convertLead}
      onSetHandoffApproval={api.setHandoffApproval}
      onCreatePartnerContact={(partner) => setFormConfig({ kind: "partnerContacts", context: { partnerOrganizationId: partner.id } })}
      onOpenRelated={openEntity}
    />
    <ImportedRecordDialog selection={importedSelection} onClose={closeImportedDetail} />
    <EntityFormDialog config={formConfig} data={data} onClose={() => setFormConfig(null)} onSave={saveForm} />
    <ConfirmDialog config={confirmConfig} onClose={() => setConfirmConfig(null)} />
    <GlobalSearchDialog open={searchOpen} query={searchQuery} onQueryChange={setSearchQuery} results={searchResults} loading={importedSearch.loading} importedError={importedSearch.error} onSelect={openSearchResult} onClose={closeSearch} inputRef={searchInputRef} returnFocusRef={searchReturnFocusRef} />
  </AppShell>;
}

function useImportedGlobalSearch(query, enabled) {
  const [state, setState] = useState({ results: [], loading: false, error: "" });
  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!enabled || normalizedQuery.length < 2) {
      setState({ results: [], loading: false, error: "" });
      return undefined;
    }
    let active = true;
    setState((current) => ({ ...current, loading: true, error: "" }));
    const timer = window.setTimeout(() => {
      importedCrmRecordsApi.search(normalizedQuery, 6)
        .then(({ organizations, contacts }) => {
          if (!active) return;
          const organizationResults = organizations.rows.map((organization) => ({
            type: "importedOrganizations",
            id: organization.id,
            title: organization.name,
            subtitle: `${organization.segment || "Segment offen"} · ${[organization.postalCode, organization.city, organization.state].filter(Boolean).join(" ") || "Standort offen"} · schreibgeschützt`,
          }));
          const contactResults = contacts.rows.map((contact) => ({
            type: "importedContacts",
            id: contact.id,
            title: contact.source_full_name || [contact.first_name, contact.last_name].filter(Boolean).join(" ") || "Kontakt ohne Namen",
            subtitle: `${contact.original_role || contact.target_role || "Funktion offen"} · ${contact.organization_name || "Organisation offen"} · nicht kontaktieren`,
          }));
          setState({ results: [...organizationResults, ...contactResults], loading: false, error: "" });
        })
        .catch((error) => active && setState({ results: [], loading: false, error: error.message }));
    }, 220);
    return () => { active = false; window.clearTimeout(timer); };
  }, [enabled, query]);
  return state;
}

function archiveTitle(type) { return ({ organizations: "Organisation", contacts: "Kontakt", leads: "Lead", opportunities: "Chance", tasks: "Aufgabe", partnerOrganizations: "Partner", partnerContacts: "Partnerkontakt", notes: "Notiz", conversations: "Gespräch", appointments: "Termin", followUps: "Wiedervorlage", offers: "Angebot", decisions: "Entscheidung", documentReferences: "Dokumentreferenz" })[type] || "Datensatz"; }
function entityName(type, entity, data) {
  if (["organizations", "partnerOrganizations"].includes(type)) return entity.displayName;
  if (["contacts", "partnerContacts"].includes(type)) return [entity.firstName, entity.lastName].join(" ");
  if (type === "leads") return entity.title;
  if (type === "opportunities") return `${organizationName(data, entity.organizationId)} · ${entity.title}`;
  if (type === "conversations") return entity.subject;
  if (type === "offers") return `Angebot ${entity.versionLabel}`;
  return entity.title;
}
