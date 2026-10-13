import { Check, ChevronRight, Languages, LockKeyhole, ShieldCheck } from 'lucide-react'

export function Brand({ light = false, compact = false }) {
  const source = light ? '/assets/brand/amavio-logo-light.svg' : '/assets/brand/amavio-logo-primary.svg'
  return <span className={`brand-mark ${compact ? 'compact' : ''}`}><img src={source} alt="AMAVIO One" /></span>
}

export function LanguageSwitch({ language, onChange }) {
  const next = language === 'de' ? 'en' : 'de'
  return (
    <button className="language-switch" type="button" onClick={() => onChange(next)} aria-label={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}>
      <Languages aria-hidden="true" size={17} />
      <span className={language === 'de' ? 'active' : ''}>DE</span><span aria-hidden="true">/</span><span className={language === 'en' ? 'active' : ''}>EN</span>
    </button>
  )
}

export function RoleLock({ label }) {
  return <span className="role-lock"><LockKeyhole aria-hidden="true" size={17} /><span>{label}</span></span>
}

export function SyntheticNotice({ language }) {
  return (
    <div className="synthetic-notice" role="note">
      <ShieldCheck aria-hidden="true" size={16} />
      <span>{language === 'de'
        ? 'Lokale synthetische Zielprojektion · keine echten Personen, Fälle oder externen Systemwirkungen.'
        : 'Local synthetic target projection · no real people, cases or external system effects.'}</span>
    </div>
  )
}

export function PrimaryButton({ children, onClick, type = 'button', disabled = false }) {
  return <button className="button primary" type={type} onClick={onClick} disabled={disabled}><span>{children}</span><ChevronRight aria-hidden="true" size={18} /></button>
}

export function SecondaryButton({ children, onClick, type = 'button' }) {
  return <button className="button secondary" type={type} onClick={onClick}>{children}</button>
}

export function TrustNotice({ language, nonEffect }) {
  return (
    <aside className="trust-notice" aria-labelledby="trust-title">
      <ShieldCheck aria-hidden="true" size={25} />
      <div>
        <h2 id="trust-title">{language === 'de' ? 'Nur Ihre freigegebenen Informationen' : 'Only your permitted information'}</h2>
        <p>{language === 'de' ? 'Sie sehen nur Angaben, die für Ihre Rolle und diesen Schritt notwendig sind.' : 'You only see information required for your role and this step.'}</p>
        <p className="trust-boundary"><strong>{language === 'de' ? 'Ausgeschlossen:' : 'Excluded:'}</strong> {nonEffect}</p>
      </div>
    </aside>
  )
}

export function StepRow({ index, title, detail, status, onOpen, language }) {
  return (
    <li className="step-row">
      <span className="step-index" aria-hidden="true">{index}</span>
      <button type="button" onClick={onOpen} aria-label={`${title}. ${status}`}>
        <span className="step-copy"><strong>{title}</strong><small>{detail}</small></span>
        <span className="step-status"><Check aria-hidden="true" size={14} />{status}</span>
        <ChevronRight aria-hidden="true" size={21} />
      </button>
      <span className="sr-only">{language === 'de' ? 'Synthetischer Schritt' : 'Synthetic step'}</span>
    </li>
  )
}

export function SkipLink({ target = 'page-title', language }) {
  return <a className="skip-link" href={`#${target}`}>{language === 'de' ? 'Zum Hauptinhalt' : 'Skip to main content'}</a>
}
