"use client";

import { useMemo, useState } from "react";

type Agent = {
  name: string;
  role: string;
  strength: string;
  output: string;
};

type FlowStep = {
  step: string;
  detail: string;
};

type Scenario = {
  id: string;
  title: string;
  challenge: string;
  aiMix: string;
  outcome: string;
};

type Props = {
  agents: Agent[];
  flow: FlowStep[];
  scenarios: Scenario[];
};

export function AiOrchestrationStudio({ agents, flow, scenarios }: Props) {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0]?.id ?? "");

  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0],
    [activeScenarioId, scenarios],
  );

  return (
    <section className="ai-studio" id="ai-studio" aria-label="AI Orchestration Studio">
      <div className="ai-scenario-panel">
        <p className="eyebrow">AI Studio</p>
        <h2>Mehrere KI-Systeme, ein sauberer Delivery-Flow.</h2>
        <p>
          Statt Einzel-Prompts nutzt AMAVIO ein orchestriertes Setup: unterschiedliche
          KI-Modelle übernehmen jeweils passende Rollen von Research über Content bis QA.
        </p>
        <div className="scenario-switcher" role="tablist" aria-label="AI Use Cases">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              role="tab"
              type="button"
              aria-selected={activeScenario?.id === scenario.id}
              className={activeScenario?.id === scenario.id ? "active" : ""}
              onClick={() => setActiveScenarioId(scenario.id)}
            >
              {scenario.title}
            </button>
          ))}
        </div>
        {activeScenario ? (
          <article className="scenario-detail" role="tabpanel" aria-live="polite">
            <p>
              <strong>Challenge:</strong> {activeScenario.challenge}
            </p>
            <p>
              <strong>KI-Mix:</strong> {activeScenario.aiMix}
            </p>
            <p>
              <strong>Outcome:</strong> {activeScenario.outcome}
            </p>
          </article>
        ) : null}
      </div>

      <div className="ai-agent-panel">
        <div className="agent-mesh">
          {agents.map((agent) => (
            <article key={agent.name}>
              <span>{agent.name}</span>
              <strong>{agent.role}</strong>
              <p>{agent.strength}</p>
              <small>{agent.output}</small>
            </article>
          ))}
        </div>

        <ol className="orchestration-flow">
          {flow.map((item, index) => (
            <li key={item.step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{item.step}</strong>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
