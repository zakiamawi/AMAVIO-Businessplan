# AMAVIO Intelligence – Provider-Adapter-Stand

**Stand:** 07.10.2026  
**Contract:** `acc.capability.v1`  
**Aktiver Laufzeitmodus:** `local`  
**Außenwirkung:** keine

## Ziel

AMAVIO Intelligence ist die eigene fachliche Schicht des Produkts. Sie besteht aus Domänenmodell, Fallgedächtnis, Evidenz, Regeln, Simulation, Human Gates, Arbeitsprodukten und Evaluation. Ein externes Sprachmodell ist darin nur ein austauschbarer Verstärker für eng begrenzte Fähigkeiten und niemals die Quelle der Produktwahrheit.

## Implementierte Provider-Schnittstelle

Alle Provider erhalten denselben begrenzten Auftrag und müssen dasselbe strukturierte Ergebnis liefern. Freigegebene Fähigkeiten:

- `summarize_evidence`
- `explain_conflict`
- `draft_work_product`
- `explain_simulation`

Jede Antwort muss Status, Überschrift, Entwurf, Quellenreferenzen, Unsicherheiten, verbotene Aktionen und ausschließlich menschlich freizugebende nächste Schritte enthalten. Ausgaben ohne Schema- oder Quellenkonformität werden verworfen.

## Reifegrad je Provider

| Provider | Adapter implementiert | Lokal callable | Konto/Projekt konfiguriert | Authentifiziert | Live smoke-tested | Aktivierungsstatus |
|---|---:|---:|---:|---:|---:|---|
| AMAVIO local | ja | ja | nicht erforderlich | nicht erforderlich | ja, lokal | aktiv |
| OpenAI | ja | nur mit injiziertem Testtransport geprüft | nein | nein | nein | `gate_closed` |
| Mistral | ja | nur mit injiziertem Testtransport geprüft | nein | nein | nein | `gate_closed` |

Die OpenAI-Implementierung zielt auf `POST /v1/responses`, setzt `store: false` und fordert ein JSON-Schema über `text.format` an. Die Mistral-Implementierung zielt auf `POST /v1/chat/completions` und fordert `response_format.type = json_schema` an. Diese Formate wurden gegen die offiziellen Anbieterbeschreibungen implementiert:

- OpenAI Structured Outputs: <https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses>
- Mistral Chat API: <https://docs.mistral.ai/api>

## Technische Kosten- und Datenschutzsperre

Ein externer Lauf wird serverseitig abgelehnt, solange nicht gleichzeitig alle folgenden Werte bewusst gesetzt sind:

1. External Provider Mode aktiviert;
2. genau ein Provider ausgewählt;
3. konkretes Modell benannt;
4. Berechtigungsnachweis nur zur Laufzeit injiziert;
5. ausschließlich synthetischer Testmodus bestätigt.

Die Arbeitskopie liest keine Secrets aus dem Projekt, enthält keine API-Schlüssel und führt im Standardbetrieb keinen externen Netzwerkaufruf aus. Browser-QA und Test-Suite prüfen diesen geschlossenen Zustand.

## Separates Gate für einen späteren Sandbox-Test

Vor einem einzigen echten Provideraufruf bleiben ausdrücklich offen:

- Founder-Entscheidung zu Provider und Modell;
- DPA/AVV, Region, Retention/ZDR, Training, Security und Vertragsmodus;
- eigenes Projekt beziehungsweise Konto und minimales Berechtigungskonzept;
- hartes Budget- und Rate-Limit;
- finaler synthetischer Testsatz und Abbruchkriterien;
- ausdrückliche Freigabe für Netzwerkaufruf und Kosten.

Die Adapter-Implementierung ist deshalb AI-ready, aber keine Anbieteraktivierung.

