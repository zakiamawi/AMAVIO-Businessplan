# R3.5 Implementation Crosswalk

| Fachanforderung | Umsetzung | Nachweis | Grenze |
|---|---|---|---|
| Founder Focus mit Outreach-/Research-Signalen verbinden | `buildOperationalSignals` leitet Kontakt-, Quellen-, Entscheidungs- und Entwurfsprüfpunkte aus der primären Chance ab | Unit- und Komponentenprüfung, sichtbarer R3.5-Bereich | keine externe Recherche |
| „Darf kontaktiert werden?“ | `buildContactabilityDecision` mit sechs erklärten Prüfdimensionen und drei Zuständen | Unit-Tests für offen, bereit und gesperrt | keine Rechtsfreigabe |
| kombinierter Preflight | `buildOutreachPreflight` verbindet Kontaktentscheidung, Draft, Prüfnotiz, lokale Freigabe und Providerlock | Unit-, Komponenten- und E2E-Prüfung | `productiveSendAllowed` immer `false` |
| offene Fragen in Arbeit überführen | `createReadinessTask` erzeugt eine reguläre CRM-Aufgabe | Integrationstest und E2E | ausdrücklich ausgelöste lokale Mutation |
| Dublettenschutz | stabiler `readinessKey`; vorhandene Aufgabe deaktiviert die Aktion | Unit-, Integration- und E2E-Test | keine automatische Zusammenführung |
| spätere Gates trennen | Gate Strip für Reale Daten, Einzelversand und Live Research | Komponenten- und statisches QA-Gate | alle drei bleiben geschlossen |
| Ausgangsstand schützen | datierte Sicherung plus separate Arbeitskopie und Konfigurationsbackups | Ordner- und QA-Evidenz | R3.4 bleibt unverändert |
| Persistenz isolieren | eigener R3.5-LocalStorage-Key und eigene SQLite-Datei, kontrollierte Übernahme älterer synthetischer Zustände | Persistenztest, statisches QA | kein produktives Backend |
| AMAVIO Design erhalten | Editorial-Ledger, Navy/Creme/Gold, offene Trennlinien und responsive Stapelung | Browser-Screenshots 1600/1280/1024/768/430/390 und 200 % | kein Redesign des Gesamtprodukts |

## Dateien

Neu sind `src/domain/outreachReadiness.js` und die R3.5-Dokumente. Angepasst wurden Founder Decision Cockpit, State Engine, State Hook, Speicher-/Migrationsvertrag, lokaler Server, Styles, QA-Skripte und Tests. Die synthetischen Beispieldatensätze wurden fachlich nicht ersetzt; lediglich Meta- und Speicherstatus kennzeichnen die neue isolierte Arbeitskopie.

## Verbleibende Product-Owner-Entscheidungen

Offen bleiben der konkrete Umfang realer Daten, Rechts-/Datenschutzprüfung je Kontaktweg, Providerwahl, Budget, Absenderkonfiguration, Versandrollen, Suppression-/Beschwerdeprozess, erlaubte Research-Quellen, Authentifizierung, Mehrbenutzerbetrieb, Hosting, App-/ACC-Verträge sowie Deployment. R3.5 nimmt keine dieser Entscheidungen vorweg.
