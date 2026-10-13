import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const focusableSelector = "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";

export function AccessibleDialog({ open, title, description, children, onClose, size = "medium", initialFocusRef, returnFocusRef: explicitReturnFocusRef }) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const returnTarget = explicitReturnFocusRef?.current || document.activeElement;
    const panel = panelRef.current;
    const focusTarget = initialFocusRef?.current || panel?.querySelector(focusableSelector) || panel;
    requestAnimationFrame(() => focusTarget?.focus());

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll(focusableSelector)];
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => returnTarget?.focus?.());
    };
  }, [explicitReturnFocusRef, initialFocusRef, onClose, open]);

  if (!open) return null;
  return (
    <div className="modal-layer" role="presentation">
      <button className="modal-scrim" type="button" onClick={onClose} aria-label={`${title} schließen`} />
      <section ref={panelRef} className={`accessible-dialog dialog-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}>
        <header className="dialog-head">
          <div><span>AMAVIO One · CRM</span><h2 id={titleId}>{title}</h2>{description ? <p id={descriptionId}>{description}</p> : null}</div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={`${title} schließen`}><X aria-hidden="true" /></button>
        </header>
        {children}
      </section>
    </div>
  );
}
