# R3.6 Audit sichtbarer Informationen

**Datum:** 13.10.2026  
**Ziel:** Keine Entwicklungsunterhaltung, Agenten-/Promptinformationen oder unnötige technische Interna in operativen CRM-Ansichten.

## Klassifikation

### Operativ zulässig

- CRM-Objekte, Rollen, Status, Fälligkeiten und Beziehungen;
- AMAVIO-interne Geschäftsnotizen, sofern sie zum jeweiligen CRM-Datensatz gehören;
- Kennzahlen und Managementhinweise, die direkt aus dem CRM-Zustand abgeleitet werden;
- Profilname und CRM-Rolle des vorgesehenen lokalen Nutzers;
- ausdrückliche Sperren, wenn eine sichtbare Aktion andernfalls als produktiv missverstanden werden könnte.

### Nur auf „Daten & Sicherung“ zulässig

- Speichermodus und Schema;
- Sicherungs- und Wiederherstellungsstatus;
- Echtdaten-, Versand- und Cloud-Sperren;
- G1-Reifegrad und offene Eintrittsgates.

### Nicht in der Produktoberfläche zulässig

- Chat-, Prompt-, Agenten- oder Modellnamen;
- Hinweise auf Zusammenarbeit zwischen Nutzer und Entwicklungsassistenz;
- QA-Arbeitssätze, interne Entwicklungsschritte oder Arbeitsordnerpfade;
- R3.x-Versionsetiketten als wiederkehrender UI-Inhalt;
- Behauptungen zu Produktivfreigabe, Datenschutzfreigabe oder Sicherheit, die nicht belegt sind.

## Durchgeführte Änderungen

- technische Fußzeile aus dem Cockpit entfernt;
- R3.5-/Prototyp- und KI-Simulationssprache aus Arbeitstag und Cockpit entfernt;
- Seitenleistenhinweis auf einen neutralen Einstieg „Systemstatus und Datengrenzen“ reduziert;
- Dialogkopf auf „AMAVIO One · CRM“ vereinheitlicht;
- Auswertungen in „Interne Analyse“ und „Berichtsansicht“ getrennt;
- Kontaktentscheidung und Outreach-Preflight als fachliche „Kontaktfreigabe“ ohne R3.x- oder Entwicklungslabel neu positioniert;
- G1- und Persistenzinformationen ausschließlich im Datenbereich gebündelt.

## Ergebnis

Die sichtbare Arbeitsoberfläche enthält keine Hinweise auf Codex, ChatGPT, Claude, Prompts, Agenten, Entwicklungsdialoge oder interne Arbeitsordner. Der automatisierte Sichtbarkeitstest deckt Arbeitstag, Cockpit, Pipeline, Auswertungen, Daten & Sicherung sowie Kontaktfreigabe in sechs Breiten ab. Geschäftlich interne Informationen bleiben dort sichtbar, wo sie für CRM-Arbeit notwendig sind. Die bereinigte Berichtsansicht blendet Kontaktdaten, Notizen und interne Fragestellungen konzeptionell aus und zeigt ausschließlich aggregierte Kennzahlen.

## Grenze

Dieser Audit ist ein Produkt- und UI-Audit, keine datenschutzrechtliche Freigabe. Vor realen Daten müssen Zweck, Rechtsgrundlage, Informationspflichten, Zugriffsschutz, Betroffenenprozesse, Fristen und technische Schutzmaßnahmen gesondert freigegeben werden.

