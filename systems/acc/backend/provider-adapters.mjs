const capabilityResultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "headline", "draft", "citations", "uncertainties", "forbiddenActions", "proposedSteps"],
  properties: {
    status: { type: "string", enum: ["completed", "insufficient_evidence", "blocked"] },
    headline: { type: "string" },
    draft: { type: "string" },
    citations: { type: "array", items: { type: "string" } },
    uncertainties: { type: "array", items: { type: "string" } },
    forbiddenActions: { type: "array", items: { type: "string" } },
    proposedSteps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["action", "ownerRole", "humanGate"],
        properties: {
          action: { type: "string" },
          ownerRole: { type: "string" },
          humanGate: { type: "boolean" },
        },
      },
    },
  },
};

export const CAPABILITY_CONTRACT_VERSION = "acc.capability.v1";
export const ALLOWED_CAPABILITIES = new Set([
  "summarize_evidence",
  "explain_conflict",
  "draft_work_product",
  "explain_simulation",
]);

export class ProviderGateError extends Error {
  constructor(message, code = "provider_gate_closed") {
    super(message);
    this.name = "ProviderGateError";
    this.code = code;
  }
}

function assertCapabilityRequest(request) {
  if (!request || request.contractVersion !== CAPABILITY_CONTRACT_VERSION) {
    throw new ProviderGateError("Capability-Vertrag fehlt oder ist nicht unterstützt.", "invalid_contract");
  }
  if (!ALLOWED_CAPABILITIES.has(request.capability)) {
    throw new ProviderGateError("Capability ist nicht freigegeben.", "unsupported_capability");
  }
  if (!request.caseSnapshot || request.caseSnapshot.synthetic !== true) {
    throw new ProviderGateError("Nur explizit synthetische Fall-Snapshots sind zulässig.", "synthetic_boundary");
  }
  if (!Array.isArray(request.evidence) || request.evidence.length === 0) {
    throw new ProviderGateError("Mindestens ein Evidenzbezug ist erforderlich.", "insufficient_evidence");
  }
}

function assertCapabilityResult(result) {
  const statuses = new Set(["completed", "insufficient_evidence", "blocked"]);
  if (!result || !statuses.has(result.status)) throw new ProviderGateError("Provider-Ausgabe verletzt den Statusvertrag.", "invalid_provider_output");
  for (const key of ["headline", "draft"]) if (typeof result[key] !== "string") throw new ProviderGateError(`Provider-Ausgabe verletzt Feld ${key}.`, "invalid_provider_output");
  for (const key of ["citations", "uncertainties", "forbiddenActions", "proposedSteps"]) {
    if (!Array.isArray(result[key])) throw new ProviderGateError(`Provider-Ausgabe verletzt Feld ${key}.`, "invalid_provider_output");
  }
  const allowedEvidence = new Set(result._allowedEvidence || []);
  if (allowedEvidence.size && result.citations.some((id) => !allowedEvidence.has(id))) {
    throw new ProviderGateError("Provider-Ausgabe zitiert eine nicht freigegebene Evidenz.", "invalid_citation");
  }
  delete result._allowedEvidence;
  return result;
}

function buildPrompt(request) {
  return [
    "Du bist die austauschbare Sprach- und Strukturkomponente des AMAVIO Arrival Control Center.",
    "Arbeite ausschließlich mit dem gelieferten synthetischen Snapshot und den Evidenzeinträgen.",
    "Erfinde keine Tatsachen. Bewerte, ranke oder profiliere keine Person.",
    "Löse keine Nachricht, Buchung, Zahlung, Freigabe oder Zustandsänderung aus.",
    `Capability: ${request.capability}`,
    `Fall: ${JSON.stringify(request.caseSnapshot)}`,
    `Evidenz: ${JSON.stringify(request.evidence)}`,
    `Arbeitsauftrag: ${request.instruction}`,
    "Gib ausschließlich das vereinbarte strukturierte Ergebnis zurück.",
  ].join("\n");
}

function localCapability(request) {
  const citations = request.evidence.map((item) => item.id);
  const conflict = request.evidence.find((item) => item.reviewStatus === "conflicting");
  const missing = request.evidence.filter((item) => item.reviewStatus === "unreviewed");
  const common = {
    status: conflict || missing.length ? "insufficient_evidence" : "completed",
    citations,
    uncertainties: [
      ...(conflict ? [`Widerspruch in ${conflict.label} ist noch nicht aufgelöst.`] : []),
      ...(missing.length ? [`${missing.length} Evidenzeintrag oder Evidenzeinträge sind noch ungeprüft.`] : []),
    ],
    forbiddenActions: ["keine Person bewerten", "keine Freigabe selbst erteilen", "keine Nachricht senden", "keine Buchung auslösen"],
    proposedSteps: [
      { action: "Evidenzkonflikt fachlich klären", ownerRole: "AMAVIO Operations", humanGate: true },
      { action: "Entscheidung mit Prüfnotiz dokumentieren", ownerRole: "Arbeitgeber-Sponsor", humanGate: true },
    ],
    _allowedEvidence: citations,
  };

  const variants = {
    summarize_evidence: {
      headline: "Beleglage für die nächste menschliche Prüfung",
      draft: `${request.evidence.length} synthetische Evidenzeinträge liegen vor. ${conflict ? "Mindestens ein Widerspruch verhindert eine belastbare Freigabe." : "Die vorhandenen Angaben können gemeinsam geprüft werden."}`,
    },
    explain_conflict: {
      headline: "Widerspruch blockiert den kritischen Pfad",
      draft: conflict
        ? `${conflict.label} weicht von einer zweiten synthetischen Quelle ab. Die betroffene Abhängigkeit bleibt blockiert, bis ein Mensch die gültige Angabe bestätigt.`
        : "Im freigegebenen Evidenzausschnitt wurde kein markierter Widerspruch gefunden.",
    },
    draft_work_product: {
      headline: "Prüfbarer Arbeitsproduktentwurf",
      draft: `Fall ${request.caseSnapshot.id}: ${request.caseSnapshot.title}. Readiness: ${request.caseSnapshot.readinessLabel}. Nächster sicherer Schritt ist die menschliche Klärung der belegten offenen Abhängigkeit. Dieser Entwurf ist lokal, synthetisch und wird nicht versendet.`,
    },
    explain_simulation: {
      headline: "Auswirkung der simulierten Änderung",
      draft: request.caseSnapshot.simulationSummary || "Die Simulation verändert Termine und Folgeabhängigkeiten ausschließlich in einer isolierten Variante.",
    },
  };
  return assertCapabilityResult({ ...common, ...variants[request.capability] });
}

function outputTextFromOpenAI(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  for (const item of payload.output || []) {
    for (const content of item.content || []) if (content.type === "output_text" && typeof content.text === "string") return content.text;
  }
  return "";
}

async function openAIAdapter(request, config, fetchImpl) {
  const response = await fetchImpl("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${config.credential}` },
    body: JSON.stringify({
      model: config.model,
      input: [
        { role: "system", content: "Return only the structured AMAVIO capability result. The supplied data is synthetic." },
        { role: "user", content: buildPrompt(request) },
      ],
      text: { format: { type: "json_schema", name: "amavio_capability_result", strict: true, schema: capabilityResultSchema } },
      store: false,
    }),
    signal: AbortSignal.timeout(config.timeoutMs || 15_000),
  });
  if (!response.ok) throw new ProviderGateError(`OpenAI-Adapter antwortet mit HTTP ${response.status}.`, "provider_failure");
  const payload = await response.json();
  const text = outputTextFromOpenAI(payload);
  if (!text) throw new ProviderGateError("OpenAI-Adapter lieferte keine strukturierte Textausgabe.", "provider_failure");
  return assertCapabilityResult({ ...JSON.parse(text), _allowedEvidence: request.evidence.map((item) => item.id) });
}

async function mistralAdapter(request, config, fetchImpl) {
  const response = await fetchImpl("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${config.credential}` },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: "Return only the structured AMAVIO capability result. The supplied data is synthetic." },
        { role: "user", content: buildPrompt(request) },
      ],
      temperature: 0,
      response_format: { type: "json_schema", json_schema: { name: "amavio_capability_result", strict: true, schema: capabilityResultSchema } },
    }),
    signal: AbortSignal.timeout(config.timeoutMs || 15_000),
  });
  if (!response.ok) throw new ProviderGateError(`Mistral-Adapter antwortet mit HTTP ${response.status}.`, "provider_failure");
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new ProviderGateError("Mistral-Adapter lieferte keine strukturierte Textausgabe.", "provider_failure");
  return assertCapabilityResult({ ...JSON.parse(content), _allowedEvidence: request.evidence.map((item) => item.id) });
}

export function createProviderRegistry(options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const external = options.external || { enabled: false };

  function status() {
    return {
      active: "local",
      contractVersion: CAPABILITY_CONTRACT_VERSION,
      providers: [
        { id: "local", adapter: "implemented", configuration: "ready", activation: "active", cost: "none" },
        { id: "openai", adapter: "implemented", configuration: external.provider === "openai" ? "selected" : "not_selected", activation: external.enabled && external.provider === "openai" ? "configured_not_smoke_tested" : "gate_closed", cost: "not_authorized" },
        { id: "mistral", adapter: "implemented", configuration: external.provider === "mistral" ? "selected" : "not_selected", activation: external.enabled && external.provider === "mistral" ? "configured_not_smoke_tested" : "gate_closed", cost: "not_authorized" },
      ],
      networkCallsThisRun: 0,
      externalEffects: false,
    };
  }

  async function run(request, provider = "local") {
    assertCapabilityRequest(request);
    if (provider === "local") return { provider: "local", model: "amavio-domain-engine-v1.5", output: localCapability(request) };
    if (!external.enabled || external.provider !== provider) {
      throw new ProviderGateError("Externer Provider ist implementiert, aber bis zur separaten Konto-, Datenmodus-, Kosten- und Aktivierungsfreigabe geschlossen.");
    }
    if (!external.syntheticOnlyApproved || !external.credential || !external.model) {
      throw new ProviderGateError("Externer Provider ist nicht vollständig und synthetisch freigegeben konfiguriert.", "provider_not_configured");
    }
    const output = provider === "openai"
      ? await openAIAdapter(request, external, fetchImpl)
      : provider === "mistral"
        ? await mistralAdapter(request, external, fetchImpl)
        : null;
    if (!output) throw new ProviderGateError("Unbekannter Provider.", "unsupported_provider");
    return { provider, model: external.model, output };
  }

  return { status, run };
}

export { capabilityResultSchema };
