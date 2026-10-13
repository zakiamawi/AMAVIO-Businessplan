import { useId, useState } from 'react'
import { AlertTriangle, Check, ChevronDown, Clock3, Database, History, Link2, ListChecks, ShieldCheck, Sparkles, WifiOff } from 'lucide-react'
import { useArrivalScenario } from '../arrival/store.js'
import { PrimaryButton } from './Primitives.jsx'

const statusLabels = {
  draft: { de: 'Entwurf', en: 'Draft' }, locked: { de: 'Gesperrt', en: 'Locked' }, open: { de: 'Offen', en: 'Open' },
  submitted: { de: 'Eingereicht', en: 'Submitted' }, under_review: { de: 'In Prüfung', en: 'In review' }, approved: { de: 'Freigegeben', en: 'Approved' },
  changes_requested: { de: 'Änderung erforderlich', en: 'Changes requested' }, archived: { de: 'Archiviert', en: 'Archived' }, completed: { de: 'Abgeschlossen', en: 'Completed' },
  answered: { de: 'Beantwortet', en: 'Answered' }, closed: { de: 'Geschlossen', en: 'Closed' }, question: { de: 'Rückfrage', en: 'Question' },
  expired: { de: 'Abgelaufen', en: 'Expired' }, acknowledged: { de: 'Entgegengenommen', en: 'Acknowledged' }, ready: { de: 'Bereit', en: 'Ready' },
  unread: { de: 'Ungelesen', en: 'Unread' }, read: { de: 'Gelesen', en: 'Read' }, pending: { de: 'Offen', en: 'Pending' }, decided: { de: 'Entschieden', en: 'Decided' },
}

const objectLabels = {
  RoleContext: { de: 'Rollenkontext', en: 'Role context' }, ProfessionalTask: { de: 'Arrival-Aufgabe', en: 'Arrival task' }, SupportRequest: { de: 'Unterstützungsfall', en: 'Support request' },
  HousingCapacity: { de: 'Wohnkapazität', en: 'Housing capacity' }, HousingNeed: { de: 'Wohnbedarf', en: 'Housing need' }, HousingNeedResponse: { de: 'Wohnantwort', en: 'Housing response' },
  HandoverSignal: { de: 'Übergabesignal', en: 'Handover signal' }, PartnerOffer: { de: 'Partnerangebot', en: 'Partner offer' }, PartnerDemand: { de: 'Partnernachfrage', en: 'Partner demand' },
  PartnerDemandResponse: { de: 'Partnerantwort', en: 'Partner response' }, RoleMessage: { de: 'Rollenhinweis', en: 'Role message' }, ReviewDecision: { de: 'Reviewentscheidung', en: 'Review decision' },
}

function localize(value, language) {
  return value?.[language] || value?.de || value?.en || String(value || '')
}

function formatEventTime(value, language) {
  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(value))
}

function ObjectList({ objects, language }) {
  return objects.length ? <ul className="arrival-object-list">{objects.map((object) => <li key={object.id}>
    <div><strong>{localize(object.label, language)}</strong><small>{localize(objectLabels[object.objectType], language)} · V{object.version}</small></div>
    <span>{object.status ? localize(statusLabels[object.status], language) : (language === 'de' ? 'Kontext' : 'Context')}</span>
  </li>)}</ul> : <p className="arrival-empty">{language === 'de' ? 'Aktuell sind keine weiteren Fachobjekte sichtbar.' : 'No further process objects are visible at this time.'}</p>
}

function EventList({ events, language }) {
  return events.length ? <ol className="arrival-event-list">{events.map((event) => <li key={event.id} className={event.disruption ? 'is-disruption' : ''}>
    <time dateTime={event.occurredAtUtc}>{formatEventTime(event.occurredAtUtc, language)}</time>
    <span><strong>{event.displayTitle}</strong><small>{event.result === 'rejected' ? (language === 'de' ? 'Ohne Zustandsänderung' : 'Without state change') : (language === 'de' ? 'Synthetisch protokolliert' : 'Recorded synthetically')}</small></span>
  </li>)}</ol> : <p className="arrival-empty">{language === 'de' ? 'Noch kein für diese Rolle freigegebener Verlauf.' : 'No history has yet been released for this role.'}</p>
}

export function ArrivalProcessPanel({ actorId, language }) {
  const { projection, execute, runtime, assistance, explain } = useArrivalScenario(actorId, language)
  const [actionMessage, setActionMessage] = useState('')
  const [actionBusy, setActionBusy] = useState(false)
  const [assistBusy, setAssistBusy] = useState(false)
  const titleId = useId()

  async function handleExecute() {
    setActionBusy(true)
    const result = await execute()
    setActionMessage(result.ok
      ? (language === 'de' ? 'Der synthetische Fachstand und Ihre Projektion wurden gemeinsam aktualisiert.' : 'The synthetic process state and your projection were updated together.')
      : (language === 'de' ? 'Der Schritt wurde nicht ausgeführt. Verantwortung oder Versionsstand erlauben die Aktion nicht.' : 'The step was not completed. Responsibility or version does not allow the action.'))
    setActionBusy(false)
  }

  async function handleExplain() {
    setAssistBusy(true)
    const result = await explain()
    if (!result.ok) setActionMessage(language === 'de' ? 'Die lokale Assistenz ist nur bei verbundenem Fachkern verfügbar.' : 'The local assistant is only available when the service core is connected.')
    setAssistBusy(false)
  }

  return (
    <section className="arrival-process" aria-labelledby={titleId} data-next-actor={projection.next?.actorId || 'complete'} data-arrival-progress={projection.progress}>
      <header className="arrival-process-head">
        <div><h2 id={titleId}>{language === 'de' ? 'Ihre Arrival-Reise' : 'Your arrival journey'}</h2><p>{language === 'de' ? 'Sieben Phasen. Eine klare nächste Verantwortung.' : 'Seven phases. One clear next responsibility.'}</p></div>
        <p className="arrival-progress" aria-label={language === 'de' ? `${projection.progress} Prozent abgeschlossen` : `${projection.progress} percent complete`}><strong>{projection.progress}%</strong><span>{projection.completedSteps}/{projection.totalSteps}</span></p>
      </header>

      <ol className="arrival-phase-rail" aria-label={language === 'de' ? 'Arrival-Phasen' : 'Arrival phases'}>
        {projection.phases.map((phase, index) => <li key={phase.id} className={`phase-${phase.status}`} aria-current={phase.status === 'current' ? 'step' : undefined}>
          <span>{phase.status === 'complete' ? <Check aria-hidden="true" size={15} /> : index + 1}</span><strong>{phase.label}</strong>
        </li>)}
      </ol>

      <div className="journey-responsibility">
        <ListChecks aria-hidden="true" size={21} />
        <div><span>{language === 'de' ? 'Nächste Verantwortung' : 'Next responsibility'}</span><strong>{projection.next?.actorLabel || (language === 'de' ? 'Journey abgeschlossen' : 'Journey complete')}</strong><p>{projection.next?.title || (language === 'de' ? 'Alle vorgesehenen synthetischen Schritte wurden durchlaufen.' : 'All planned synthetic steps have been completed.')}</p></div>
        {projection.next?.canAct ? <PrimaryButton onClick={handleExecute} disabled={actionBusy}>{actionBusy ? (language === 'de' ? 'Wird geprüft …' : 'Checking …') : projection.next.action}</PrimaryButton> : <span className="waiting-note"><Clock3 aria-hidden="true" size={16} />{language === 'de' ? 'Keine erneute Eingabe erforderlich' : 'No resubmission required'}</span>}
      </div>

      {projection.latestIncident ? <aside className="arrival-incident"><AlertTriangle aria-hidden="true" size={20} /><div><strong>{language === 'de' ? 'Kontrollierter Störpfad' : 'Controlled disruption path'}</strong><p>{projection.latestIncident.displayTitle}</p></div></aside> : null}
      {actionMessage ? <p className="arrival-action-message" role="status">{actionMessage}</p> : null}

      <details className="process-details">
        <summary><span><ShieldCheck aria-hidden="true" size={18} />{language === 'de' ? 'Freigegebene Prozessdetails' : 'Permitted process details'}</span><ChevronDown aria-hidden="true" size={19} /></summary>
        <p className="process-boundary">{language === 'de' ? `Synthetischer Referenzfall ${projection.caseId}. Nur rollenfreigegebene Objekte und Ereignisse.` : `Synthetic reference case ${projection.caseId}. Only role-permitted objects and events.`}</p>
        <div className="arrival-evidence-grid">
          <section aria-labelledby={`${titleId}-objects`}><h3 id={`${titleId}-objects`}><ListChecks aria-hidden="true" size={18} />{language === 'de' ? 'Ihre sichtbaren Vorgänge' : 'Your visible items'}</h3><ObjectList objects={projection.objects} language={language} /></section>
          <section aria-labelledby={`${titleId}-history`}><h3 id={`${titleId}-history`}><History aria-hidden="true" size={18} />{language === 'de' ? 'Freigegebener Verlauf' : 'Released history'}</h3><EventList events={projection.events} language={language} /></section>
        </div>
        <section className="r2-runtime" aria-labelledby={`${titleId}-runtime`} data-runtime-status={runtime.status}>
          <header>
            <div>
              <h3 id={`${titleId}-runtime`}>{language === 'de' ? 'Lokale R2-Grundlage' : 'Local R2 foundation'}</h3>
              <p>{language === 'de' ? 'Technisch verbunden, weiterhin ausschließlich synthetisch und ohne externe Wirkung.' : 'Technically connected, still synthetic only and without external effect.'}</p>
            </div>
            <span className={`runtime-state state-${runtime.status}`}>{runtime.status === 'connected' ? (language === 'de' ? 'Verbunden' : 'Connected') : runtime.status === 'checking' ? (language === 'de' ? 'Prüfung' : 'Checking') : (language === 'de' ? 'Lokaler Rückfall' : 'Local fallback')}</span>
          </header>
          <ul className="runtime-capabilities">
            <li><Database aria-hidden="true" size={18} /><span><strong>{language === 'de' ? 'Fachstand' : 'Case state'}</strong><small>{runtime.status === 'connected' ? 'SQLite · lokal persistent' : (language === 'de' ? 'Browserprojektion' : 'Browser projection')}</small></span></li>
            <li><Link2 aria-hidden="true" size={18} /><span><strong>{language === 'de' ? 'ACC-Grenze' : 'ACC boundary'}</strong><small>{runtime.acc === 'local_endpoint_ready' ? (language === 'de' ? 'Versionierter lokaler Endpunkt' : 'Versioned local endpoint') : (language === 'de' ? 'Nur Vertragsreferenz' : 'Contract reference only')}</small></span></li>
            <li>{runtime.ai === 'disabled' ? <WifiOff aria-hidden="true" size={18} /> : <Sparkles aria-hidden="true" size={18} />}<span><strong>{language === 'de' ? 'Assistenz' : 'Assistance'}</strong><small>{runtime.ai === 'disabled' ? (language === 'de' ? 'Ohne Fachkern deaktiviert' : 'Disabled without service core') : (language === 'de' ? 'Lokal · ohne Entscheidungseffekt' : 'Local · no decision effect')}</small></span></li>
          </ul>
          <div className="runtime-assistance">
            <PrimaryButton onClick={handleExplain} disabled={assistBusy || runtime.status !== 'connected'}>{assistBusy ? (language === 'de' ? 'Erklärt …' : 'Explaining …') : (language === 'de' ? 'Nächsten Schritt erklären' : 'Explain next step')}</PrimaryButton>
            {assistance ? <div className="assistance-result" role="status"><strong>{assistance.heading}</strong><p>{assistance.summary}</p><small>{assistance.boundary}</small></div> : null}
          </div>
        </section>
      </details>
    </section>
  )
}
