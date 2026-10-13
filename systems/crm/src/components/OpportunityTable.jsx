import { ArrowUpRight, CalendarDays, MoreVertical } from "lucide-react";
import { organizationName, ownerById, stageById } from "../domain/crmDomain";

const money = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

export function OpportunityTable({ opportunities, data, onOpen }) {
  if (!opportunities.length) {
    return <div className="empty-state"><strong>Keine Chancen in dieser Ansicht.</strong><span>Filter oder Suche zurücksetzen, um weitere Datensätze zu sehen.</span></div>;
  }

  return (
    <>
      <div className="desktop-table-wrap">
        <table className="opportunity-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Chance</th>
              <th>Phase</th>
              <th>Potenzial</th>
              <th>Nächste Aktion</th>
              <th>Verantwortlich</th>
              <th aria-label="Aktionen" />
            </tr>
          </thead>
          <tbody>
            {opportunities.map((item, index) => (
              <tr key={item.id} className={index === 0 ? "selected" : ""} onClick={() => onOpen(item.id)}>
                <td><strong>{organizationName(data, item.organizationId)}</strong><small>{data.organizations.find((organization) => organization.id === item.organizationId)?.region} · {data.organizations.find((organization) => organization.id === item.organizationId)?.sector}</small></td>
                <td>{item.title}</td>
                <td><span className={`stage-label stage-${item.stageId}`}>{stageById[item.stageId]?.label}</span></td>
                <td className="money">{money.format(item.potential)}</td>
                <td>{item.nextAction}<small>{date.format(new Date(`${item.nextActionDue}T12:00:00`))}</small></td>
                <td><span className="owner"><span className="avatar small">{ownerById[item.ownerId]?.initials}</span>{ownerById[item.ownerId]?.name}</span></td>
                <td><button className="icon-button row-action" aria-label={`${organizationName(data, item.organizationId)} öffnen`} onClick={(event) => { event.stopPropagation(); onOpen(item.id); }}><MoreVertical /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-opportunity-list">
        {opportunities.map((item, index) => (
          <button key={item.id} className={`mobile-opportunity ${index === 0 ? "selected" : ""}`} onClick={() => onOpen(item.id)}>
            <span className="mobile-opportunity-head"><strong>{organizationName(data, item.organizationId)}</strong><ArrowUpRight aria-hidden="true" /></span>
            <span>{item.title}</span>
            <span className="mobile-opportunity-meta"><b>{money.format(item.potential)}</b><i /><CalendarDays aria-hidden="true" /> {date.format(new Date(`${item.nextActionDue}T12:00:00`))}</span>
          </button>
        ))}
      </div>
    </>
  );
}
