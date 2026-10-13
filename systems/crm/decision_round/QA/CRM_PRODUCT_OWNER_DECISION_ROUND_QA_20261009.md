# AMAVIO One CRM – QA der Product-Owner-Entscheidungsrunde

**Datum:** 09.10.2026  
**Status:** **ENTSCHEIDUNGSREIF / QA BESTANDEN / NICHT FREIGEGEBEN**  
**Produktstand:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## 1. Prüfzweck

Dieser Nachweis prüft das lokale Entscheidungspaket für `PO-CRM-001` bis `PO-CRM-020`. Geprüft wurde, ob alle offenen Entscheidungen vollständig, eindeutig, quellenbezogen und ohne stillschweigende Freigabe für eine Product-Owner-Runde vorbereitet sind.

Die Prüfung ist keine fachliche, rechtliche, datenschutzrechtliche, sicherheitstechnische oder produktive Genehmigung der vorgeschlagenen Entscheidungen.

## 2. Geprüfte Unterlagen

- `README_START_HERE.md`
- `CRM_PRODUCT_OWNER_DECISION_BRIEF_20261009.md`
- `CRM_PRODUCT_OWNER_DECISION_REGISTER_20261009.csv`
- `CRM_DECISION_DEPENDENCY_AND_GATE_MAP_20261009.md`
- `CRM_DECISION_PROTOCOL_DRAFT_20261009.md`
- `CRM_DECISION_CROSSWALK_20261009.csv`
- `scripts/qa-decision-round.mjs`
- kanonische Ausgangsmatrix `../CRM_PRODUCT_OWNER_DECISIONS.md`
- bestehende Architektur-, Datenschutz-, Berechtigungs-, Handoff-, Reifegrad- und QA-Dokumente des Canonical-Core-Pakets

## 3. Maschinelle Prüfung

Ausgeführt:

```text
node decision_round/scripts/qa-decision-round.mjs
```

Ergebnis: **BESTANDEN**

- `20/20` PO-IDs sind im Entscheidungsregister vorhanden und eindeutig.
- `20/20` PO-IDs sind im Crosswalk vorhanden und eindeutig.
- `20/20` PO-IDs bleiben in der kanonischen Quellmatrix genau einmal erfasst.
- `12` fachliche Entscheidungen sind als `open_decision_ready` eingeordnet.
- `8` produktive Technik- und Integrationsgates sind als `open_confirm_gate` eingeordnet.
- Keine PO-ID ist als genehmigt, entschieden oder produktiv freigegeben markiert.
- Bündel-, Abhängigkeits-, Gate- und Nichtfreigabegrenzen sind vorhanden.

Zusätzlich ausgeführt:

```text
npm run qa
```

Ergebnis: **BESTANDEN**

- lokale und synthetische Kennzeichnung vorhanden;
- Markenanker und Reduced-Motion-Regel vorhanden;
- keine IGS-spezifischen Fachbegriffe in der aktiven Implementierung;
- Pflichtdokumente und Persistenzvertrag vorhanden;
- keine externen Netzwerkpfade in der aktiven Implementierung.

## 4. Fachliche Vollständigkeitsprüfung

| Prüfpunkt | Ergebnis | Anmerkung |
|---|---|---|
| Vollständigkeit der IDs | bestanden | `PO-CRM-001` bis `PO-CRM-020` vollständig |
| Eindeutige Zuordnung | bestanden | jede ID genau einem Entscheidungsbündel zugeordnet |
| Empfehlung und Alternativen | bestanden | Register enthält Vorschlag, Alternativen und Konsequenzen |
| Quellenbezug | bestanden | Crosswalk ordnet jede ID vorhandenen Verträgen und Evidenzen zu |
| Abhängigkeiten | bestanden | Gate-Map trennt fachliche Vorbedingungen und produktive Gates |
| Freigabegrenze | bestanden | kein Vorschlag wird als Beschluss behandelt |
| Produktgrenzen | bestanden | CRM, App und ACC bleiben getrennte Produkte und Codebasen |
| Datenstatus | bestanden | ausschließlich lokale synthetische Arbeitsdaten vorgesehen |
| Integrationsstatus | bestanden | keine Integration aktiviert oder vorweggenommen |
| Freigabeprotokoll | bestanden | Felder bewusst leer; ein leerer Eintrag gilt nicht als Entscheidung |

## 5. Erhalten, verändert, neu, vorbereitet und gesperrt

### Erhalten

- vollständige aktive CRM-Implementierung und ihre synthetischen Beispieldaten;
- bestehendes Layout, Markenmittel, Interaktionen und Testarchitektur;
- kanonisches Domänenmodell, Statusvertrag und Produktgrenzen;
- alle offenen beziehungsweise gesperrten Statuswerte der 20 PO-Entscheidungen.

### Verändert

- `CRM_PRODUCT_OWNER_DECISIONS.md` erhielt ausschließlich einen Verweis auf das Entscheidungspaket; kein Entscheidungsstatus wurde geändert.

### Neu hinzugefügt

- Entscheidungskurzvorlage;
- strukturiertes Register für alle 20 IDs;
- Abhängigkeits- und Gate-Karte;
- nicht operativer Protokollentwurf;
- Quellen- und Evidenz-Crosswalk;
- maschinelles QA-Gate für die Entscheidungsrunde;
- dieser QA-Nachweis und ein lokales Integritätsmanifest.

### Nur vorbereitet

- Product-Owner-Auswahl für Bündel A und B;
- ausdrückliche Bestätigung der weiterhin geschlossenen Gates in Bündel C;
- spätere Überführung ausdrücklich beschlossener Punkte in kanonische Verträge.

### Weiterhin gesperrt

- produktive Datenbank, Authentifizierung und Rollen-Durchsetzung;
- Mehrbenutzer- und Mandantenbetrieb;
- Import oder Verarbeitung realer Kontaktdaten;
- E-Mail-, Kalender-, Dokumenten-, App- oder ACC-Integration;
- produktive KI, Hosting, Deployment, Veröffentlichung und Git-Push.

## 6. Nicht erneut ausgeführte Prüfungen

Build, Unit-, Vertrags-, Komponenten-, Integrations-, End-to-End-, Desktop-, Zwischenbreiten-, Mobile-, Tastatur-, Zoom- und Accessibility-Prüfungen des Canonical-Core-Pakets wurden in diesem reinen Dokumentationsschritt nicht erneut ausgeführt. Es wurde kein aktiver Anwendungscode, Testcode, Layout oder Laufzeitvertrag verändert. Der zuvor dokumentierte technische Reifegrad wird dadurch nicht erweitert.

## 7. Offener menschlicher Schritt

Der Product Owner muss die Empfehlungen je Bündel oder je ID ausdrücklich annehmen, ändern, ablehnen oder vertagen. Erst danach dürfen beschlossene Inhalte in die kanonischen Verträge überführt werden. Für produktive Gates ist zusätzlich ein getrennt beauftragter Discovery-, Rechts-, Datenschutz-, Sicherheits-, Kosten- und Integrationsprozess erforderlich.

## 8. Schlussurteil

Das Entscheidungspaket ist vollständig und konsistent für eine Product-Owner-Runde vorbereitet. Es bleibt **nicht operativ**, **nicht produktiv freigegeben** und erteilt keine implizite Genehmigung.
