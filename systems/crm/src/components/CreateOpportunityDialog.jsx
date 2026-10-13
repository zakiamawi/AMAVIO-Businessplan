import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { owners, stages } from "../data/seed";

const initial = {
  account: "",
  title: "",
  stage: "contact",
  sector: "Gesundheit",
  region: "Düsseldorf",
  potential: 5900,
  nextAction: "Bedarfsgespräch vorbereiten",
  dueDate: "2026-10-15",
  owner: "ZA",
  priority: "medium",
  source: "Direktkontakt",
  contactId: "",
  note: "",
};

export function CreateOpportunityDialog({ open, onClose, onCreate }) {
  const [form, setForm] = useState(initial);
  useEffect(() => { if (open) setForm(initial); }, [open]);
  if (!open) return null;

  function change(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  function submit(event) {
    event.preventDefault();
    if (!form.account.trim() || !form.title.trim()) return;
    onCreate({ ...form, account: form.account.trim(), title: form.title.trim(), potential: Number(form.potential) || 0 });
  }

  return (
    <div className="modal-layer" role="presentation">
      <button className="modal-scrim" onClick={onClose} aria-label="Dialog schließen" />
      <form className="create-dialog" onSubmit={submit}>
        <div className="dialog-head"><div><span>Neuer Datensatz</span><h2>Chance anlegen</h2><p>Wird ausschließlich in diesem Browser lokal gespeichert.</p></div><button className="icon-button" type="button" onClick={onClose} aria-label="Schließen"><X /></button></div>
        <div className="form-grid">
          <label className="wide">Unternehmen *<input required value={form.account} onChange={(event) => change("account", event.target.value)} autoFocus /></label>
          <label className="wide">Chance *<input required value={form.title} onChange={(event) => change("title", event.target.value)} /></label>
          <label>Phase<select value={form.stage} onChange={(event) => change("stage", event.target.value)}>{stages.map((stage) => <option value={stage.id} key={stage.id}>{stage.label}</option>)}</select></label>
          <label>Verantwortlich<select value={form.owner} onChange={(event) => change("owner", event.target.value)}>{owners.map((owner) => <option value={owner.id} key={owner.id}>{owner.name}</option>)}</select></label>
          <label>Segment<input value={form.sector} onChange={(event) => change("sector", event.target.value)} /></label>
          <label>Region<input value={form.region} onChange={(event) => change("region", event.target.value)} /></label>
          <label>Potenzial in EUR<input type="number" min="0" value={form.potential} onChange={(event) => change("potential", event.target.value)} /></label>
          <label>Fälligkeit<input type="date" value={form.dueDate} onChange={(event) => change("dueDate", event.target.value)} /></label>
          <label className="wide">Nächste Handlung<input value={form.nextAction} onChange={(event) => change("nextAction", event.target.value)} /></label>
          <label className="wide">Arbeitsnotiz<textarea value={form.note} onChange={(event) => change("note", event.target.value)} /></label>
        </div>
        <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose}>Abbrechen</button><button className="primary-action" type="submit">Chance anlegen</button></div>
      </form>
    </div>
  );
}
