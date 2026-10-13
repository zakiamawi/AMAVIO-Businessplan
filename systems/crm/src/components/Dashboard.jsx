import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Search } from "lucide-react";
import { organizationName, owners } from "../domain/crmDomain";
import { OpportunityTable } from "./OpportunityTable";
import { PipelineRail } from "./PipelineRail";

function formatShortDate(value) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`));
}

export function Dashboard({ data, filtered, query, setQuery, stageFilter, setStageFilter, ownerFilter, setOwnerFilter, openOpportunity, onNavigate, onCreate }) {
  const focus = data.opportunities.find((item) => item.id === "opp-101") ?? data.opportunities[0];
  const openTasks = data.tasks.filter((task) => !task.archivedAt && task.status !== "completed").slice(0, 5);
  const won = data.opportunities.find((item) => !item.archivedAt && item.stageId === "won");
  const urgent = data.opportunities.find((item) => !item.archivedAt && item.priority === "high" && item.stageId === "decision");

  return (
    <div className="dashboard-grid">
      <section className="dashboard-main">
        <div className="dashboard-intro">
          <div className="editorial-title">
            <span className="mobile-date">Aktueller lokaler Stand</span>
            <p className="brand-name">AMAVIO One</p>
            <h1>CRM Cockpit</h1>
            <p>Beziehungen werden steuerbar.</p>
          </div>
          <button className="focus-object" onClick={() => openOpportunity(focus.id)}>
            <span>Aktiver Fokus</span>
            <strong>{organizationName(data, focus.organizationId)}</strong>
            <small>{focus.nextAction}</small>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <section className="pipeline-section" aria-labelledby="pipeline-title">
          <div className="section-heading">
            <h2 id="pipeline-title">Pipeline</h2>
            <button className="text-action" onClick={() => onNavigate("pipeline")}>Alle Chancen <ArrowRight aria-hidden="true" /></button>
          </div>
          <PipelineRail opportunities={data.opportunities} selected={stageFilter} onSelect={setStageFilter} />
        </section>

        <section className="opportunities-section" aria-labelledby="opportunities-title">
          <div className="section-heading">
            <h2 id="opportunities-title">Chancen <span>({filtered.length})</span></h2>
            <button className="mobile-create" onClick={() => onCreate("opportunities")}>+ Neue Chance</button>
          </div>
          <div className="filter-row">
            <label className="inline-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chancen suchen …" aria-label="Chancen suchen" /></label>
            <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} aria-label="Nach Phase filtern">
              <option value="all">Alle Phasen</option>
              <option value="contact">Erstkontakt</option>
              <option value="qualified">Qualifiziert</option>
              <option value="scoping">Leistungsrahmen</option>
              <option value="proposal">Angebot</option>
              <option value="decision">Entscheidung</option>
              <option value="won">Gewonnen</option>
            </select>
            <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} aria-label="Nach Verantwortlichem filtern">
              <option value="all">Alle Verantwortlichen</option>
              {owners.map((owner) => <option value={owner.id} key={owner.id}>{owner.name}</option>)}
            </select>
            <button className="reset-filter" onClick={() => { setStageFilter("all"); setOwnerFilter("all"); setQuery(""); }}>Filter zurücksetzen</button>
          </div>
          <OpportunityTable opportunities={filtered} data={data} onOpen={openOpportunity} />
        </section>
      </section>

      <aside className="context-rail" aria-label="Nächste Schritte und Hinweise">
        <div className="context-heading"><h2>Nächste Schritte</h2><span>Diese Woche</span></div>
        <div className="timeline-list">
          {openTasks.map((task) => {
            const opportunity = data.opportunities.find((item) => item.id === task.opportunityId);
            return (
              <button key={task.id} onClick={() => opportunity && openOpportunity(opportunity.id)}>
                <span>{formatShortDate(task.dueDate)}</span>
                <i />
                <b>{task.title}<small>{organizationName(data, task.organizationId || opportunity?.organizationId)}</small></b>
              </button>
            );
          })}
        </div>
        <button className="text-action context-link" onClick={() => onNavigate("tasks")}>Alle Aufgaben <ArrowRight aria-hidden="true" /></button>

        <div className="important-notes">
          <h2>Wichtige Hinweise</h2>
          {won && (
            <button className="notice confirmed" onClick={() => openOpportunity(won.id)}>
              <CheckCircle2 aria-hidden="true" />
              <span><strong>Pilot gewonnen – Übergabe vorbereiten</strong><small>Die kontrollierte Übergabe an das separate Arrival Control Center ist noch nicht ausgelöst.</small><b>Übergabestatus prüfen <ArrowRight aria-hidden="true" /></b></span>
            </button>
          )}
          {urgent && (
            <button className="notice attention" onClick={() => openOpportunity(urgent.id)}>
              <AlertTriangle aria-hidden="true" />
              <span><strong>Entscheidung in 7 Tagen</strong><small>Unterlagen, Leistungsrahmen und Freigabeweg gemeinsam prüfen.</small><b>Chance prüfen <ArrowRight aria-hidden="true" /></b></span>
            </button>
          )}
        </div>
        <div className="local-status"><Circle aria-hidden="true" /> Synthetische Arbeitsdaten · lokal</div>
      </aside>
    </div>
  );
}
