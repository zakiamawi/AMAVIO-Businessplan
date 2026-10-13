# Fachliche App-/ACC-Übergabegrenze

**Stand:** 30.09.2026  
**Status:** Zielbild/Architekturhypothese; nicht implementiert, nicht integriert, nicht produktiv freigegeben

## Zweck

Dieses Dokument beschreibt nur die fachliche Grenze zwischen dem Arrival Control Center und der separaten AMAVIO One App. Es simuliert keine Verbindung und ist kein API-Vertrag.

## Führungsprinzip

Das ACC führt Arbeitgebermandat, Standort, Kohorte, Arrival Case, Risiko, Freigabe, interne AMAVIO-Notiz und Reporting. Die App zeigt ausschließlich rollenbezogene, minimierte Teilansichten für Fachkraft, Wohnanbieter und lokalen Partner.

Es gibt keine ungefilterte gemeinsame Datenansicht und keinen direkten App-Zugriff auf interne ACC-Daten.

## Fachlich zulässige Signaltypen im Zielbild

| Richtung | App-Rolle | Minimaler fachlicher Inhalt | Bleibt im ACC/bei AMAVIO | Harte Grenze |
|---|---|---|---|---|
| ACC → App | Fachkraft | eigener nächster Schritt, eigener Status, eigener Termin, strukturierte Rückfrage | Kohorte, Budget, Management-KPI, interne Notiz, Daten anderer Personen | keine Leistungsbewertung, kein sensibler allgemeiner Freitext |
| App → ACC | Fachkraft | strukturierter Check-in, Blockierungsgrundkategorie, Unterstützungsanfrage | interne Bewertung, Eskalationsentscheidung, Arbeitgebersteuerung | keine automatische Risikobewertung oder Entscheidung |
| ACC → App | Wohnanbieter | anonymisiertes/personenarmes Bedarfsmuster, Kategorie, Zeitraum, Kapazitätsfrage | Identität der Fachkraft, Vollkohorte, Arbeitgeberbudget, andere Anbieter | keine automatische Zuordnung, Buchung oder Wohnraumzusage |
| App → ACC | Wohnanbieter | eigener Objekt-/Kapazitätsentwurf, Eignungskategorie, Verfügbarkeit, Rückfrage | AMAVIO-Prüfung, Freigabe, Übergabeentscheidung | Einreichung ist keine Veröffentlichung oder Partnerschaft |
| ACC → App | lokaler Partner | anonymisierte Kategorie-/Mengennachfrage, Zeitraum, Kapazitätsfrage | Personenprofile, Arbeitgeber-/Kohortendaten, andere Partnerangebote | keine Nachfrage-, Reichweiten- oder Rabattgarantie |
| App → ACC | lokaler Partner | eigener Angebotsentwurf, Termin, Plätze, Bedingungen, Rückfrage | Prüfung, Publikationsentscheidung, interne Qualitätsnotiz | keine Selbstfreigabe oder automatische Veröffentlichung |
| ACC → App | alle Rollen | zulässiger Prüfstatus, strukturierter Grund, nächste Verantwortung | vollständiger Audit-, Risiko- und Entscheidungszusammenhang | keine Offenlegung interner Notizen oder fremder Daten |

## Geplanter Kontrollfluss

1. ACC beziehungsweise AMAVIO Operations gibt Rolle, Zweck und minimierten Kontext frei.
2. Ein späterer Workflow-/API-Kern müsste Identität, Organisation, Objektzugriff, Zweck und Zustand serverseitig prüfen.
3. Die App zeigt nur ein rollenbezogenes View Model.
4. Die externe Rolle sendet ein validiertes minimales Signal, einen Entwurf oder eine Rückfrage.
5. ACC beziehungsweise AMAVIO prüft und entscheidet menschlich.
6. Nur ein zulässiger Status und nächster Schritt wird zurückprojiziert.

## Nicht vorhanden

- keine App-/ACC-Verbindung;
- kein Backend/BFF und kein Eventbus;
- keine produktive Identität, Einladung oder Rechteprüfung;
- keine Contracttests, Idempotenz, Replay- oder Reconciliation-Logik;
- keine produktive Benachrichtigung oder Dateiübertragung;
- keine echte Entscheidung, Buchung, Veröffentlichung oder Vertragswirkung;
- keine KI, kein Matching und kein Scoring.

## Gates vor einer technischen Umsetzung

- freigegebener Zweck und Datenkatalog je Rolle;
- Rechtsgrundlage, Informationspflichten, Einwilligungs-/Notice-Logik und Löschung;
- Identity Provider, serverseitige Rollen-/Objekt-/Zweckprüfung und Negativtests;
- versionierte REST-/Eventverträge, Idempotenz, Audit und Fehlerbehandlung;
- Security-, Hosting-, DPA/AVV-, Backup-/Restore- und Incident-Gates;
- Test mit synthetischen Daten, danach gesondert freigegebene rollenreine Nutzertests.

Keines dieser Gates wird durch die lokale ACC- oder App-Demo ersetzt.
