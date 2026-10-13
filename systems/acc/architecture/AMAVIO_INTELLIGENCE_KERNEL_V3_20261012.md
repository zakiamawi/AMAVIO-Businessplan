# AMAVIO Intelligence Kernel V3

Stand: 12.10.2026  
Reifegrad: lokale providerunabhängige Fachlogik unterhalb der Programmreise

## Zweck

Kernel V3 macht keine „KI-Oberfläche“ auf. Er stellt drei versionierte Fähigkeiten bereit, die aus dem synthetischen Programmkontext reproduzierbare Arbeitsvorlagen erzeugen:

1. `program.evidence_reconcile` – Lieferbelege, Widersprüche, Lücken und Klärungsauftrag;
2. `program.critical_path_replan` – Ereignis, Abhängigkeiten, Fristen, Alternativen und Unsicherheiten;
3. `program.delivery_brief_compose` – interner Programmbrief mit Quellenbezug und Qualitätsrubrik.

## Schichten

- Program Evidence Graph: Kohorten, Arbeitspakete, Entscheidungen, Abhängigkeiten und Quellenreferenzen.
- Policy Engine: acht blockierende Ausführungs- und Wirkungsgrenzen.
- Capability Registry: drei fachliche Fähigkeiten in Version `3.0.0`.
- Evaluation Harness: 36 deterministische lokale Szenarien.
- Provider Registry: lokale Domain Engine aktiv; OpenAI- und Mistral-Adapter nur installiert, nicht aktiviert, nicht callable, nicht authentifiziert und nicht smoke-getestet.
- Human Gate: jede Ausgabe bleibt `awaiting_human_review`; eine Zustimmung bedeutet nur `advisory_approved`, niemals automatische Anwendung.

## Providerunabhängigkeit

Fachvertrag, Kontext, Policies, strukturierte Ausgabe, Evaluation und Human Gate sind vom Provider getrennt. Ein späterer Adapter darf nur dieselben Schemas bedienen und muss gegen dieselbe lokale Baseline bewertet werden. Für Release L findet kein externer Netzwerkaufruf statt.

## Nicht freigegeben

Providerkonto, API-Key, Kosten, Live-Modelltest, echte Daten, produktive Identity, Hosting, Integration, Versand, Buchung oder automatisierte Entscheidung.
