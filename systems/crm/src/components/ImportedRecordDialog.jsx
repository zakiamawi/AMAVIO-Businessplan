import { useEffect, useState } from "react";
import { Building2, LockKeyhole, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { importedCrmRecordsApi } from "../services/importedCrmRecords";
import { AccessibleDialog } from "./AccessibleDialog";

export function ImportedRecordDialog({ selection, onClose }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selection) return undefined;
    let active = true;
    setDetail(null);
    setError("");
    importedCrmRecordsApi.detail(selection.type, selection.id)
      .then((payload) => active && setDetail(payload))
      .catch((loadError) => active && setError(loadError.message));
    return () => { active = false; };
  }, [selection]);

  const record = detail?.record || {};
  const title = importedTitle(selection?.type, record);

  return <AccessibleDialog
    open={Boolean(selection)}
    title={title}
    description="Importierter CRM-Eintrag · lokal und schreibgeschützt"
    onClose={onClose}
    size="large"
  >
    {!detail && !error ? <div className="imported-detail-state" role="status">CRM-Eintrag wird geladen …</div> : null}
    {error ? <div className="imported-detail-state is-error" role="alert">{error}</div> : null}
    {detail && selection?.type === "organization" ? <ImportedOrganization detail={detail} /> : null}
    {detail && selection?.type === "contact" ? <ImportedContact detail={detail} /> : null}
  </AccessibleDialog>;
}

function ImportedOrganization({ detail }) {
  const record = detail.record;
  const address = [record.street, [record.postalCode, record.city].filter(Boolean).join(" "), record.state].filter(Boolean).join(", ");
  return <div className="imported-detail">
    <div className="imported-detail-facts">
      <DetailFact icon={Building2} label="Segment" value={record.segment || "Nicht angegeben"} />
      <DetailFact icon={MapPin} label="Standort" value={address || "Nicht angegeben"} />
      <DetailFact icon={Mail} label="Zentrale E-Mail" value={record.central_email || "Nicht angegeben"} />
      <DetailFact icon={Phone} label="Zentrale Telefonnummer" value={record.central_phone || "Nicht angegeben"} />
    </div>
    {record.current_url || record.website_source ? <p className="imported-website"><strong>Website</strong><a href={record.current_url || record.website_source} target="_blank" rel="noreferrer">{record.current_url || record.website_source}</a></p> : null}
    <section className="imported-related">
      <header><span>Zugeordnete Kontakte</span><strong>{detail.contacts?.length || 0}</strong></header>
      {detail.contacts?.length ? detail.contacts.map((contact) => <div key={contact.id}><UserRound aria-hidden="true" /><span><strong>{contact.name}</strong><small>{contact.role || "Funktion nicht angegeben"}</small></span></div>) : <p>Keine Kontakte in diesem Eintrag zugeordnet.</p>}
    </section>
    <ReadOnlyNotice />
  </div>;
}

function ImportedContact({ detail }) {
  const record = detail.record;
  return <div className="imported-detail">
    <div className="imported-detail-facts">
      <DetailFact icon={Building2} label="Organisation" value={record.resolvedOrganizationName || record.organization_name || "Nicht zugeordnet"} />
      <DetailFact icon={UserRound} label="Funktion" value={record.original_role || record.role || record.target_role || "Nicht angegeben"} />
      <DetailFact icon={Mail} label="E-Mail" value={record.email || "Nicht angegeben"} />
      <DetailFact icon={Phone} label="Telefon" value={record.phone || "Nicht angegeben"} />
    </div>
    <div className="contactability-warning" role="note"><LockKeyhole aria-hidden="true" /><span><strong>Nicht kontaktieren</strong><small>Für diesen importierten Kontakt liegt aktuell keine Outreach-Freigabe vor.</small></span></div>
    <ReadOnlyNotice />
  </div>;
}

function DetailFact({ icon: Icon, label, value }) {
  return <div><Icon aria-hidden="true" /><span><small>{label}</small><strong>{value}</strong></span></div>;
}

function ReadOnlyNotice() {
  return <p className="imported-readonly"><LockKeyhole aria-hidden="true" /> Der Eintrag ist lokal eingebunden und bleibt bis zur kontrollierten Übernahme schreibgeschützt.</p>;
}

function importedTitle(type, record) {
  if (type === "organization") return record.name || "Organisation";
  return record.source_full_name || [record.first_name, record.last_name].filter(Boolean).join(" ") || "Kontakt";
}
