import { AccessibleDialog } from "./AccessibleDialog";

export function ConfirmDialog({ config, onClose }) {
  return <AccessibleDialog open={Boolean(config)} title={config?.title || "Bestätigen"} description={config?.description} onClose={onClose} size="small">
    <div className="confirm-body"><p>{config?.body}</p>{config?.note ? <small>{config.note}</small> : null}</div>
    <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose}>Abbrechen</button><button type="button" className={config?.tone === "danger" ? "danger-action" : "primary-action"} onClick={() => { config?.onConfirm?.(); onClose(); }}>{config?.confirmLabel || "Bestätigen"}</button></div>
  </AccessibleDialog>;
}
