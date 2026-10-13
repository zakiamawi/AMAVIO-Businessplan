import { ArrowRight, CircleAlert, CircleCheck, Clock3, Target } from "lucide-react";
import { useMemo } from "react";
import { buildAnalytics, formatMoney } from "../domain/analytics";
import { demoToday } from "../domain/decisionIntelligence";

export function FounderDecisionCockpit({ data, openEntity, onNavigate }) {
  const analytics = useMemo(() => buildAnalytics(data, "30"), [data]);
  const totalReadiness = Math.max(1, analytics.readinessMix.reduce((sum, item) => sum + item.count, 0));
  const readinessGradient = donutGradient(analytics.readinessMix, totalReadiness);

  return <div className="steering-cockpit">
    <header className="cockpit-hero">
      <div><span className="workspace-kicker">Unternehmenssteuerung</span><h1>Geschäftslage im Blick</h1><p>Wo Bewegung entsteht, Risiken wachsen und Entscheidungen reif werden.</p></div>
      <div className="workday-date"><strong>{formatLongDate(demoToday(data))}</strong><span>Weniger offen lassen.<br />Mehr bewirken.</span></div>
    </header>

    <section className="cockpit-metrics" aria-label="Geschäftslage">
      <Metric label="Aktive Chancen" value={analytics.metrics.active} detail={`${analytics.pipeline.filter((item) => item.count).length} aktive Phasen`} />
      <Metric label="Sichtbares Potenzial" value={formatMoney(analytics.metrics.potential)} detail="ungewichtet" />
      <Metric label="Entscheidungsreif" value={analytics.metrics.decisionReady} detail="hohe Datenreife" />
      <Metric label="Überfällige Schritte" value={analytics.metrics.overdue} detail="benötigen Aufmerksamkeit" attention={analytics.metrics.overdue > 0} />
    </section>

    <div className="cockpit-primary-grid">
      <section className="cockpit-module pipeline-situation" aria-labelledby="pipeline-situation-title">
        <div className="cockpit-module-head"><div><span>Bestand nach Phase</span><h2 id="pipeline-situation-title">Pipeline-Lage</h2></div><button onClick={() => onNavigate("pipeline")}>Zur Detail-Pipeline <ArrowRight aria-hidden="true" /></button></div>
        <div className="stage-flow" aria-label={analytics.pipeline.map((item) => `${item.label}: ${item.count} Chancen`).join(", ")}>
          {analytics.pipeline.map((item) => <button key={item.id} onClick={() => onNavigate("pipeline")}><span>{item.label}</span><strong>{item.count}</strong><small>{formatMoney(item.amount)}</small></button>)}
        </div>
        <footer><span>Gesamt</span><strong>{analytics.metrics.active + analytics.metrics.won}</strong><b>{formatMoney(analytics.pipeline.reduce((sum, item) => sum + item.amount, 0))}</b></footer>
      </section>

      <section className="cockpit-module readiness-overview" aria-labelledby="readiness-overview-title">
        <div className="cockpit-module-head"><div><span>Aktive Chancen</span><h2 id="readiness-overview-title">Entscheidungsreife</h2></div></div>
        <div className="readiness-visual">
          <div className="donut" style={{ background: readinessGradient }} role="img" aria-label={analytics.readinessMix.map((item) => `${item.label}: ${item.count}`).join(", ")}><span><strong>{totalReadiness}</strong><small>Chancen</small></span></div>
          <dl>{analytics.readinessMix.map((item) => <div key={item.id}><dt><i className={item.id} />{item.label}</dt><dd>{item.count}</dd></div>)}</dl>
        </div>
      </section>
    </div>

    <div className="cockpit-secondary-grid">
      <section className="cockpit-module movement-aging" aria-labelledby="movement-aging-title">
        <div className="cockpit-module-head"><div><span>Seit letzter Aktivität</span><h2 id="movement-aging-title">Bewegung & Alterung</h2></div><button onClick={() => onNavigate("reports")}>Alle Analysen <ArrowRight aria-hidden="true" /></button></div>
        <div className="aging-distribution">{analytics.aging.map((item) => <div key={item.id}><span><strong>{item.label}</strong><small>{item.count} Chancen</small></span><i><b style={{ width: `${analytics.metrics.active ? Math.max(item.count ? 4 : 0, (item.count / analytics.metrics.active) * 100) : 0}%` }} /></i></div>)}</div>
      </section>

      <section className="cockpit-module relationship-coverage" aria-labelledby="relationship-coverage-title">
        <div className="cockpit-module-head"><div><span>Aktive Chancen</span><h2 id="relationship-coverage-title">Beziehungsabdeckung</h2></div></div>
        <div className="coverage-ledger">{analytics.roleCoverage.map((item) => <div key={item.id}><span><strong>{item.label}</strong><small>{item.count} von {item.total}</small></span><i><b style={{ width: `${item.percent}%` }} /></i><em>{item.percent}%</em></div>)}</div>
      </section>

      <section className="cockpit-module confidence-overview" aria-labelledby="confidence-overview-title">
        <div className="cockpit-module-head"><div><span>Qualität des Arbeitsstands</span><h2 id="confidence-overview-title">Datenvertrauen</h2></div></div>
        <div className="confidence-summary">
          <div className="confidence-score"><strong>{analytics.completeness}%</strong><span>Entscheidungskriterien belegt</span></div>
          <ul><li><CircleCheck aria-hidden="true" /> Herkunftsfelder vorhanden</li><li><Clock3 aria-hidden="true" /> Aktualität sichtbar</li><li><CircleAlert aria-hidden="true" /> Dubletten bleiben prüfbar</li></ul>
        </div>
      </section>
    </div>

    <section className="cockpit-decisions" aria-labelledby="cockpit-decisions-title">
      <div className="cockpit-module-head"><div><span>Drei Themen mit dem größten Hebel</span><h2 id="cockpit-decisions-title">Nächste Managemententscheidungen</h2></div></div>
      <div>{analytics.decisions.map((item, index) => <button key={item.id} onClick={() => openEntity("opportunities", item.id)}><span>{String(index + 1).padStart(2, "0")}</span><Target aria-hidden="true" /><strong>{item.organization}</strong><p>{item.title}</p><small>{item.reason}</small><ArrowRight aria-hidden="true" /></button>)}</div>
    </section>
  </div>;
}

function Metric({ label, value, detail, attention = false }) { return <div className={attention ? "attention" : ""}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function formatLongDate(value) { return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
function donutGradient(items, total) { const colors = { high: "#0e5b49", medium: "#c99a3d", low: "#cf726d" }; let start = 0; return `conic-gradient(${items.map((item) => { const end = start + ((item.count / total) * 100); const segment = `${colors[item.id]} ${start}% ${end}%`; start = end; return segment; }).join(", ")})`; }
