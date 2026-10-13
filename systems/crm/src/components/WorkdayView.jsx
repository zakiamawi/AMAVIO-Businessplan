import { ArrowRight, CalendarDays, Check, Circle, Clock3 } from "lucide-react";
import { useMemo } from "react";
import { buildFounderFocus, demoToday } from "../domain/decisionIntelligence";
import { organizationName } from "../domain/crmDomain";

export function WorkdayView({ data, openEntity, onNavigate, onSetTaskStatus }) {
  const today = demoToday(data);
  const focus = useMemo(() => buildFounderFocus(data, today), [data, today]);
  const tasks = useMemo(() => (data.tasks || [])
    .filter((item) => !item.archivedAt && item.status !== "completed")
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)) || priorityOrder(a.priority) - priorityOrder(b.priority))
    .slice(0, 5), [data.tasks]);
  const agenda = useMemo(() => buildAgenda(data), [data]);
  const followUps = useMemo(() => buildFollowUps(data, focus), [data, focus]);

  return <div className="workday-view">
    <header className="workday-hero">
      <div><span className="workspace-kicker">Fokus & Umsetzung</span><h1>Mein Arbeitstag</h1><p>Drei Entscheidungen. Ein klarer Tagesverlauf.</p></div>
      <div className="workday-date"><strong>{formatLongDate(today)}</strong><span>Weniger offen lassen.<br />Mehr bewirken.</span></div>
    </header>

    <div className="workday-lead-grid">
      <section className="workday-section priority-section" aria-labelledby="workday-priority-title">
        <div className="workday-section-head"><div><span>Heute zuerst</span><h2 id="workday-priority-title">Prioritäten</h2></div><button onClick={() => onNavigate("tasks")}>Alle Aufgaben <ArrowRight aria-hidden="true" /></button></div>
        <div className="workday-priorities">
          {focus.map((item, index) => <article key={item.opportunityId} className={`workday-priority priority-${index + 1}`}>
            <button className="workday-priority-main" onClick={() => openEntity("opportunities", item.opportunityId)}>
              <span className="workday-rank">{String(item.rank).padStart(2, "0")}</span>
              <span><strong>{item.title}</strong><small>{item.organization}</small></span>
              <em>{item.reason}</em>
            </button>
            <button className="workday-row-action" onClick={() => openEntity("opportunities", item.opportunityId)}>{item.actionLabel}<ArrowRight aria-hidden="true" /></button>
          </article>)}
        </div>
      </section>

      <aside className="workday-section agenda-section" aria-labelledby="workday-agenda-title">
        <div className="workday-section-head"><div><span>Zeit & Fälligkeit</span><h2 id="workday-agenda-title">Heute & als Nächstes</h2></div><CalendarDays aria-hidden="true" /></div>
        <ol className="workday-agenda">
          {agenda.map((item) => <li key={`${item.entityType}-${item.id}`}>
            <button onClick={() => openEntity(item.entityType, item.id)}>
              <time>{item.when}</time><i aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.context}</small></span><ArrowRight aria-hidden="true" />
            </button>
          </li>)}
        </ol>
      </aside>
    </div>

    <section className="workday-section close-today" aria-labelledby="close-today-title">
      <div className="workday-section-head"><div><span>Verantwortung & Abschluss</span><h2 id="close-today-title">Heute abschließen</h2></div><button onClick={() => onNavigate("tasks")}>Aufgabenbereich öffnen <ArrowRight aria-hidden="true" /></button></div>
      <div className="workday-task-ledger">
        {tasks.length ? tasks.map((task) => <article key={task.id}>
          <button className="workday-check" onClick={() => onSetTaskStatus(task.id, "completed")} aria-label={`${task.title} abschließen`}><Circle aria-hidden="true" /></button>
          <button className="workday-task-main" onClick={() => openEntity("tasks", task.id)}>
            <span><strong>{task.title}</strong><small>{organizationName(data, task.organizationId)}</small></span>
            <time className={task.dueDate < today ? "overdue" : ""}>{dueLabel(task.dueDate, today)}</time>
            <b className={`task-state ${task.status}`}>{task.status === "in_progress" ? "In Arbeit" : "Offen"}</b>
            <ArrowRight aria-hidden="true" />
          </button>
        </article>) : <div className="workday-empty"><Check aria-hidden="true" /><span><strong>Für heute ist nichts mehr offen.</strong><small>Neue Aufgaben erscheinen hier nach Fälligkeit und Priorität.</small></span></div>}
      </div>
    </section>

    <section className="workday-section followup-section" aria-labelledby="followup-title">
      <div className="workday-section-head"><div><span>Beziehungen im Blick</span><h2 id="followup-title">Kontakt & Follow-up</h2></div><button onClick={() => onNavigate("worklog")}>Arbeitsjournal öffnen <ArrowRight aria-hidden="true" /></button></div>
      <div className="workday-followups">
        {followUps.map((item) => <button key={item.id} onClick={() => openEntity(item.type, item.id)}>
          <Clock3 aria-hidden="true" /><span><strong>{item.organization}</strong><small>{item.label}</small></span><em>{item.status}</em><ArrowRight aria-hidden="true" />
        </button>)}
      </div>
    </section>
  </div>;
}

function buildAgenda(data) {
  const appointments = (data.appointments || []).filter((item) => !item.archivedAt && item.status === "planned").map((item) => ({
    id: item.id, entityType: "appointments", when: String(item.startsAt || "").slice(11, 16) || formatShortDate(String(item.startsAt || "").slice(0, 10)), title: item.title, context: organizationName(data, item.organizationId), sort: String(item.startsAt || ""),
  }));
  const followUps = (data.followUps || []).filter((item) => !item.archivedAt && item.status !== "completed").map((item) => ({
    id: item.id, entityType: "followUps", when: formatShortDate(item.dueDate), title: item.title, context: organizationName(data, item.organizationId), sort: `${item.dueDate}T23:00`,
  }));
  return [...appointments, ...followUps].sort((a, b) => a.sort.localeCompare(b.sort)).slice(0, 5);
}

function buildFollowUps(data, focus) {
  const followUps = (data.followUps || []).filter((item) => !item.archivedAt && item.status !== "completed").map((item) => ({ id: item.id, type: "followUps", organization: organizationName(data, item.organizationId), label: item.title, status: formatShortDate(item.dueDate) }));
  const focusItems = focus.map((item) => {
    const opportunity = data.opportunities.find((entry) => entry.id === item.opportunityId);
    return { id: item.opportunityId, type: "opportunities", organization: item.organization, label: opportunity?.title || item.title, status: opportunity?.nextActionDue ? formatShortDate(opportunity.nextActionDue) : "offen" };
  });
  return [...followUps, ...focusItems].filter((item, index, list) => list.findIndex((entry) => entry.organization === item.organization) === index).slice(0, 4);
}

function priorityOrder(value) { return ({ high: 0, medium: 1, low: 2 })[value] ?? 3; }
function formatLongDate(value) { return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
function formatShortDate(value) { return value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(new Date(`${value}T12:00:00`)) : "offen"; }
function dueLabel(value, today) { return value === today ? `Heute, ${formatShortDate(value)}` : value < today ? `Überfällig · ${formatShortDate(value)}` : formatShortDate(value); }
