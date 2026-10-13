import { useEffect, useId, useRef } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { PrimaryButton, SecondaryButton } from './Primitives.jsx'

const focusable = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function FocusDialog({ open, language, variant = 'review', title, description, onClose, onConfirm, returnFocusRef }) {
  const ref = useRef(null)
  const returnFocus = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return undefined
    returnFocus.current = document.activeElement
    const returnTarget = returnFocusRef?.current || returnFocus.current
    const dialog = ref.current
    const initial = dialog?.querySelector('[data-initial-focus]') || dialog
    initial?.focus()
    function onKeyDown(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab' || !dialog) return
      const nodes = [...dialog.querySelectorAll(focusable)]
      if (!nodes.length) { event.preventDefault(); return }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (!(returnTarget instanceof HTMLElement) || !returnTarget.isConnected) return
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => returnTarget.focus({ preventScroll: true }))
      })
    }
  }, [open, onClose, returnFocusRef])

  if (!open) return null
  const danger = ['destructive', 'conflict'].includes(variant)
  const Icon = danger ? AlertTriangle : CheckCircle2
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={ref} className={`focus-dialog ${danger ? 'dialog-danger' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex="-1" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-head">
          <Icon aria-hidden="true" size={26} />
          <button className="icon-button" type="button" onClick={onClose} aria-label={language === 'de' ? 'Dialog schließen' : 'Close dialog'}><X aria-hidden="true" size={22} /></button>
        </div>
        <h2 id={titleId} tabIndex="-1" data-initial-focus>{title}</h2>
        <p id={descriptionId}>{description}</p>
        <dl className="effect-list">
          <div><dt>{language === 'de' ? 'Lokale Wirkung' : 'Local effect'}</dt><dd>{language === 'de' ? 'Der synthetische Fachstand und die sichtbare Projektion können lokal fortgeschrieben werden.' : 'The synthetic case state and visible projection may be advanced locally.'}</dd></div>
          <div><dt>{language === 'de' ? 'Keine externe Wirkung' : 'No external effect'}</dt><dd>{language === 'de' ? 'Keine reale Einreichung, Buchung, Freigabe oder Nachricht.' : 'No real submission, booking, approval or message.'}</dd></div>
        </dl>
        <div className="dialog-actions">
          <SecondaryButton onClick={onClose}>{language === 'de' ? 'Sicher abbrechen' : 'Cancel safely'}</SecondaryButton>
          <PrimaryButton onClick={onConfirm}>{language === 'de' ? 'Synthetisch fortfahren' : 'Continue synthetically'}</PrimaryButton>
        </div>
      </section>
    </div>
  )
}
