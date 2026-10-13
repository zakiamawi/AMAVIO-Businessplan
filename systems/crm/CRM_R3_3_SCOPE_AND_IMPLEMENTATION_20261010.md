# AMAVIO One CRM – R3.3 Owner-Operated Growth CRM

**Stand:** 10.10.2026  
**Arbeitskopie:** `20261010_AMAVIO_One_CRM_R3_3_Owner_Growth_Working`  
**Reifegrad:** **Lokales AMAVIO Owner-CRM mit synthetisch geprüftem Growth- und Outreach-Core – noch ohne produktiven Versand und ohne externe Datenanbindung.**

## Produktentscheidung

Das CRM ist kein zu verkaufendes SaaS-Produkt. Es ist das interne Vertriebs-, Kontakt-, Recherche- und Marketing-Arbeitssystem von AMAVIO. Ziel ist ein auf den tatsächlichen AMAVIO-Ablauf zugeschnittenes, kostengünstiges System anstelle eines umfassenden HubSpot-Abonnements.

Die bisherige C1-Supabase-Planung wird nicht gelöscht. Sie wird als spätere Cloud-, Team- und Synchronisierungsoption geparkt. Die unmittelbare Systembasis ist lokal, einbenutzerorientiert und nicht öffentlich erreichbar.

## In R3.3 umgesetzt

- lokale Node-API, ausschließlich an `127.0.0.1` gebunden;
- SQLite-Datenbank mit WAL-Modus, Schema-Migrationstabelle, kanonischem v5-Zustand und versionierten Snapshots;
- kontrollierte Migration des synthetischen R3.2/v4-Zustands auf R3.3/v5;
- Browser-Fallback, falls die lokale API nicht gestartet ist;
- JSON-Export sowie synthetische Importvorschau und kontrollierte Übernahme;
- Sicherung vor Restore, Import und Reset;
- Zielsegmente und Passungskriterien;
- Recherchewarteschlange mit Quellen-URL, Quellenart, Recherchezeitpunkt, Qualitäts- und Statuswert;
- kontrollierte Übernahme eines geprüften Rechercheeintrags als Lead;
- Outreach-Entwürfe mit Kontakt, Zweck, Betreff, Inhalt, Prüfnachweis und deaktiviertem Anbieteradapter;
- lokale Outreach-Freigabe nur bei dokumentiertem Kontakt-/Rechtsstatus;
- Kontaktsperre mit Sperrregister und automatischer Blockierung verbundener Outreach-Entwürfe;
- Kosten-, Tages- und Monatslimits als lokale Planungsgrenzen;
- globale Suche über Zielsegmente, Recherche und Outreach;
- AMAVIO-spezifische Navigation und responsive Growth-Arbeitsfläche.

## Technisch wirksame Grenzen

- `meta.realDataEnabled` ist `false`;
- `meta.outboundEnabled` ist `false`;
- Provideradapter `provider-brevo-disabled` hat `externalWritesAllowed: false`;
- Outreach kennt keinen Status `sent`; `sentAt` bleibt `null`;
- der sichtbare Versandbutton ist deaktiviert;
- Import akzeptiert nur den synthetischen R3.2-/R3.3-Vertrag;
- keine Secrets, Zugangsdaten oder Auth-Artefakte werden gelesen oder gespeichert;
- keine externe URL wird durch die Anwendung automatisiert abgerufen;
- ACC und App bleiben getrennt und erhalten keine Daten.

## Ausgangsschutz

- unveränderter Quellstand: `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Working`;
- vollständige Sicherung: `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Sicherung_Pre_R3_3`;
- neue Arbeitskopie: `20261010_AMAVIO_One_CRM_R3_3_Owner_Growth_Working`;
- Ausgangs- und Kopiedateien außerhalb `node_modules` wurden vor Bearbeitung per SHA-256 verglichen;
- die macOS-Kopie meldete nur Metadatenwarnungen bei ausführbaren `node_modules/.bin`-Symlinks; Dateizahl und Gesamtgröße waren identisch.

## Lokaler Betrieb

```bash
npm start
```

`npm start` erstellt zuerst den Build und startet anschließend die lokale Anwendung unter `http://127.0.0.1:4373`. Die SQLite-Datei entsteht in `local-data/amavio-one-crm-r3-3.sqlite` und ist durch `.gitignore` von Versionsverwaltung ausgeschlossen.

Für reine UI-Entwicklung bleibt möglich:

```bash
npm run dev -- --port 4366
```

In diesem Modus zeigt das CRM transparent den „Lokalen Browser-Fallback“.

## Nicht behauptet

R3.3 ist nicht produktionsbereit, nicht für reale personenbezogene Daten freigegeben, nicht datenschutzrechtlich oder sicherheitstechnisch abgenommen, nicht mehrbenutzerfähig, nicht mandantenfähig, nicht öffentlich gehostet und mit keinem externen Dienst verbunden.
