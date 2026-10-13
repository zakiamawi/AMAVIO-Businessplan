import { pipelineStages } from "../domain/crmDomain";

export function PipelineRail({ opportunities, selected, onSelect }) {
  const counts = Object.fromEntries(pipelineStages.map((stage) => [stage.id, opportunities.filter((item) => !item.archivedAt && item.stageId === stage.id).length]));
  return (
    <div className="pipeline-rail" aria-label="Pipeline nach Phase">
      {pipelineStages.map((stage) => (
        <button
          key={stage.id}
          className={selected === stage.id ? "active" : ""}
          onClick={() => onSelect(selected === stage.id ? "all" : stage.id)}
          aria-pressed={selected === stage.id}
        >
          <strong>{counts[stage.id]}</strong>
          <span>{stage.label}</span>
        </button>
      ))}
    </div>
  );
}
