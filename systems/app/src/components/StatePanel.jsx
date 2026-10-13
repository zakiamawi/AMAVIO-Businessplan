import { AlertTriangle, Archive, CheckCircle2, Clock3, CloudOff, FileEdit, LoaderCircle, LockKeyhole, Pause, RefreshCw, Send, ShieldAlert } from 'lucide-react'
import { stateContracts } from '../data/states.js'
import { localize } from '../localize.js'
import { PrimaryButton } from './Primitives.jsx'

const icons = {
  NORMAL: Clock3, EMPTY: Archive, LOADING: LoaderCircle, DRAFT: FileEdit, READY_TO_SUBMIT: Send,
  SUBMITTED: Send, IN_REVIEW: RefreshCw, WAITING: Clock3, CHANGES_REQUESTED: FileEdit,
  APPROVED: CheckCircle2, CONFIRMED: CheckCircle2, BLOCKED: ShieldAlert, ERROR: AlertTriangle,
  OFFLINE: CloudOff, CONFLICT: RefreshCw, ACCESS_DENIED: LockKeyhole, EXPIRED: LockKeyhole,
  PAUSED: Pause, COMPLETED: CheckCircle2, ARCHIVED: Archive,
}

export function StatePanel({ state, language, onAction, item, compact = false }) {
  const contract = stateContracts[state] || stateContracts.NORMAL
  const Icon = icons[state] || Clock3
  const urgent = ['ERROR', 'CONFLICT'].includes(state)
  const title = item ? localize(item.title, language) : localize(contract.title, language)
  return (
    <section className={`state-panel tone-${contract.tone} ${compact ? 'compact' : ''}`} aria-labelledby="state-title" aria-live={urgent ? 'assertive' : 'polite'} aria-atomic="true">
      <div className="state-icon"><Icon className={state === 'LOADING' ? 'spin' : ''} aria-hidden="true" size={compact ? 20 : 25} /></div>
      <div className="state-copy">
        <span className="state-label">{localize(contract.title, language)}</span>
        <h2 id="state-title">{title}</h2>
        <p>{item ? localize(item.detail, language) : localize(contract.body, language)}</p>
        <span className="state-owner"><Clock3 aria-hidden="true" size={16} />{language === 'de' ? 'Verantwortung und Wirkung werden vor dem nächsten Schritt angezeigt.' : 'Responsibility and effect are shown before the next step.'}</span>
      </div>
      {!compact ? <PrimaryButton onClick={onAction}>{localize(contract.action, language)}</PrimaryButton> : null}
    </section>
  )
}
