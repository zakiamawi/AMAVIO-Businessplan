import { ArrowRight, Search } from "lucide-react";
import { AccessibleDialog } from "./AccessibleDialog";

export function GlobalSearchDialog({ open, query, onQueryChange, results, loading, importedError, onSelect, onClose, inputRef, returnFocusRef }) {
  const normalizedQuery = query.trim();
  const queryReady = normalizedQuery.length >= 2;
  return <AccessibleDialog open={open} title="CRM durchsuchen" description="Organisationen, Kontakte, Leads, Chancen, Aufgaben, Partner und Arbeitsjournal – lokal und gemeinsam durchsuchbar." onClose={onClose} size="search" initialFocusRef={inputRef} returnFocusRef={returnFocusRef}>
    <div className="search-dialog-field"><Search aria-hidden="true" /><input ref={inputRef} value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Suchbegriff eingeben …" aria-label="Alle CRM-Objekte durchsuchen" /></div>
    <div className="search-results" aria-live="polite">
      {!normalizedQuery ? <div className="empty-state compact"><strong>Bereit für die globale Suche.</strong><span>Mit ⌘ K oder Strg K öffnen, mit Escape schließen.</span></div> : null}
      {normalizedQuery && !queryReady ? <div className="empty-state compact"><strong>Noch ein Zeichen.</strong><span>Ab zwei Zeichen werden lokale und importierte CRM-Einträge gemeinsam geprüft.</span></div> : null}
      {queryReady && loading ? <div className="search-progress" role="status">Importierte Organisationen und Kontakte werden ergänzt …</div> : null}
      {queryReady && importedError ? <div className="search-progress is-error" role="alert">Lokale Einträge sind verfügbar. Importierte Organisationen und Kontakte konnten gerade nicht durchsucht werden.</div> : null}
      {queryReady && !loading && !results.length ? <div className="empty-state compact"><strong>Keine passenden Datensätze.</strong><span>Der Suchbegriff wurde in allen angekündigten Objektarten geprüft.</span></div> : null}
      {results.map((result) => <button key={`${result.type}-${result.id}`} onClick={() => onSelect(result)}><span><small>{typeLabel(result.type)}</small><strong>{result.title}</strong><em>{result.subtitle}</em></span><ArrowRight aria-hidden="true" /></button>)}
    </div>
  </AccessibleDialog>;
}

function typeLabel(type) {
  return ({ organizations: "Organisation", contacts: "Kontakt", importedOrganizations: "Importierte Organisation", importedContacts: "Importierter Kontakt", leads: "Lead", opportunities: "Chance", tasks: "Aufgabe", partnerOrganizations: "Partner", partnerContacts: "Partnerkontakt", notes: "Notiz", conversations: "Gespräch", appointments: "Termin", followUps: "Wiedervorlage", offers: "Angebot", decisions: "Entscheidung", documentReferences: "Dokumentreferenz" })[type] || type;
}
