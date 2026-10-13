import { ArrowRight, BarChart3, Eye, EyeOff, LockKeyhole, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { buildAnalytics, formatMoney } from "../domain/analytics";

const periodLabels = { "30": "30 Tage", quarter: "Quartal", all: "Gesamt" };

export function AnalyticsView({ data, onNavigate, openEntity }) {
  const [period, setPeriod] = useState("30");
  const [mode, setMode] = useState("internal");
  const analytics = useMemo(() => buildAnalytics(data, period), [data, period]);
  const statusTotal = Math.max(1, analytics.statusMix.reduce((sum, item) => sum + item.count, 0));
  const maxPipelineAmount = Math.max(1, ...analytics.pipeline.map((item) => item.amount));

  return <div className={`analytics-view mode-${mode}`}>
    <header className="analytics-hero">
      <div><span className="workspace-kicker">Vertrieb & Beziehungen</span><h1>Auswertungen</h1><p>Entwicklung verstehen. Entscheidungen begründen.</p></div>
      <div className="analytics-controls">
        <div className="segmented" aria-label="Auswertungszeitraum">{Object.entries(periodLabels).map(([id, label]) => <button key={id} className={period === id ? "active" : ""} onClick={() => setPeriod(id)} aria-pressed={period === id}>{label}</button>)}</div>
        <div className="segmented report-mode" aria-label="Berichtsmodus"><button className={mode === "internal" ? "active" : ""} onClick={() => setMode("internal")} aria-pressed={mode === "internal"}><EyeOff aria-hidden="true" /> Interne Analyse</button><button className={mode === "share" ? "active" : ""} onClick={() => setMode("share")} aria-pressed={mode === "share"}><Eye aria-hidden="true" /> Berichtsansicht</button></div>
      </div>
    </header>

    <section className="analytics-metrics" aria-label="Kennzahlen">
      <Metric label="Aktive Chancen" value={analytics.metrics.active} detail={`${analytics.metrics.decisionReady} entscheidungsreif`} />
      <Metric label="Sichtbares Potenzial" value={formatMoney(analytics.metrics.potential)} detail="keine Umsatzprognose" />
      <Metric label="Gewonnen" value={analytics.metrics.won} detail="aktuell dokumentiert" />
      <Metric label="Offene Aufgaben" value={analytics.metrics.openTasks} detail={`${analytics.metrics.overdue} überfällige Schritte`} attention={analytics.metrics.overdue > 0} />
    </section>

    <div className="analytics-main-grid">
      <section className="analytics-module pipeline-analysis" aria-labelledby="pipeline-analysis-title">
        <AnalyticsHead eyebrow="Anzahl und Potenzial je Phase" title="Pipeline-Verteilung" id="pipeline-analysis-title" action={<button onClick={() => onNavigate("pipeline")}>Alle Phasen <ArrowRight aria-hidden="true" /></button>} />
        <div className="pipeline-analysis-flow">{analytics.pipeline.map((item) => <button key={item.id} onClick={() => onNavigate("pipeline")}><span>{item.label}</span><strong>{item.count}</strong><small>{formatMoney(item.amount)}</small><i><b style={{ width: `${Math.max(item.amount ? 5 : 0, (item.amount / maxPipelineAmount) * 100)}%` }} /></i></button>)}</div>
      </section>

      <section className="analytics-module activity-development" aria-labelledby="activity-development-title">
        <AnalyticsHead eyebrow={`${periodLabels[period]} · dokumentierte Ereignisse`} title="Aktivitätsentwicklung" id="activity-development-title" />
        <div className="activity-chart" role="img" aria-label={analytics.activityTrend.map((item) => `${formatShortDate(item.date)}: ${item.count} Ereignisse`).join(", ") || "Keine Ereignisse im gewählten Zeitraum"}>
          {analytics.activityTrend.length ? analytics.activityTrend.map((item) => <div key={item.date}><span>{item.count}</span><i><b style={{ height: `${Math.max(8, item.percent)}%` }} /></i><small>{formatShortDate(item.date)}</small></div>) : <p>Keine datierten Ereignisse im gewählten Zeitraum.</p>}
        </div>
      </section>
    </div>

    <div className="analytics-detail-grid">
      <section className="analytics-module status-analysis" aria-labelledby="status-analysis-title">
        <AnalyticsHead eyebrow="Chancen nach Status" title="Statusmix" id="status-analysis-title" />
        <div className="status-donut-wrap"><div className="donut status-donut" style={{ background: statusGradient(analytics.statusMix, statusTotal) }} role="img" aria-label={analytics.statusMix.map((item) => `${item.label}: ${item.count}`).join(", ")}><span><strong>{statusTotal}</strong><small>Chancen</small></span></div><dl>{analytics.statusMix.map((item) => <div key={item.id}><dt><i className={item.id} />{item.label}</dt><dd>{item.count}</dd></div>)}</dl></div>
      </section>

      <section className="analytics-module source-analysis" aria-labelledby="source-analysis-title">
        <AnalyticsHead eyebrow="Aktive Chancen" title="Quellen" id="source-analysis-title" />
        <div className="ranked-bars">{analytics.sources.map((item) => <div key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.percent}%` }} /></i><strong>{item.count}</strong></div>)}</div>
      </section>

      <section className="analytics-module aging-analysis" aria-labelledby="aging-analysis-title">
        <AnalyticsHead eyebrow="Tage seit letzter Aktivität" title="Aktivität & Alterung" id="aging-analysis-title" />
        <div className="ranked-bars aging-bars">{analytics.aging.map((item) => <div key={item.id}><span>{item.label}</span><i><b className={item.id} style={{ width: `${analytics.metrics.active ? Math.max(item.count ? 5 : 0, (item.count / analytics.metrics.active) * 100) : 0}%` }} /></i><strong>{item.count}</strong></div>)}</div>
      </section>

      <section className="analytics-module quality-analysis" aria-labelledby="quality-analysis-title">
        <AnalyticsHead eyebrow="Entscheidungsrelevante Felder" title="Datenqualität" id="quality-analysis-title" />
        <div className="quality-gauge" role="img" aria-label={`${analytics.completeness} Prozent der Entscheidungskriterien belegt`} style={{ "--quality": `${analytics.completeness * 3.6}deg` }}><span><strong>{analytics.completeness}%</strong><small>belegt</small></span></div>
      </section>
    </div>

    {mode === "internal" ? <section className="management-brief" aria-labelledby="management-brief-title">
      <div className="analytics-module-head"><div><span>Nur im internen Arbeitsmodus</span><h2 id="management-brief-title">Management-Brief</h2></div><span className="private-marker"><LockKeyhole aria-hidden="true" /> Interne Analyse</span></div>
      <div>{analytics.decisions.map((item, index) => <button key={item.id} onClick={() => openEntity("opportunities", item.id)}><span>{index + 1}</span><div><strong>{item.organization}</strong><p>{item.title}</p><small>{item.reason}</small></div><ArrowRight aria-hidden="true" /></button>)}</div>
    </section> : <section className="share-report" aria-labelledby="share-report-title"><Eye aria-hidden="true" /><div><h2 id="share-report-title">Bereinigte Berichtsansicht</h2><p>Kontaktdaten, Gesprächsnotizen, interne Fragen und Bearbeitungshinweise sind ausgeblendet. Sichtbar bleiben nur aggregierte CRM-Kennzahlen. Es findet kein Export und kein Versand statt.</p></div></section>}

    <footer className="analytics-evidence"><TrendingUp aria-hidden="true" /><span><strong>Faktenbasis:</strong> {analytics.evidence.opportunityCount} Chancen und {analytics.evidence.eventCount} datierte Ereignisse im gewählten Zeitraum. Kennzahlen zeigen den aktuellen CRM-Stand und sind keine Prognose.</span><BarChart3 aria-hidden="true" /></footer>
  </div>;
}

function Metric({ label, value, detail, attention = false }) { return <div className={attention ? "attention" : ""}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function AnalyticsHead({ eyebrow, title, id, action = null }) { return <div className="analytics-module-head"><div><span>{eyebrow}</span><h2 id={id}>{title}</h2></div>{action}</div>; }
function formatShortDate(value) { return value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`)) : "–"; }
function statusGradient(items, total) { const colors = { active: "#0e5b49", won: "#c99a3d", lost: "#cf726d" }; let start = 0; return `conic-gradient(${items.map((item) => { const end = start + ((item.count / total) * 100); const segment = `${colors[item.id]} ${start}% ${end}%`; start = end; return segment; }).join(", ")})`; }
