# AMAVIO One CRM – C1 Autorisierungs- und RLS-Testmatrix

**Stand:** 10.10.2026  
**Status:** verbindlicher Testvertrag für einen späteren C1-Block; keine Policy implementiert  
**Prinzip:** Frontend-Sichtbarkeit ist keine Berechtigung. AMAVIO-API und RLS müssen verbotene Aktionen unabhängig voneinander abweisen.

## Rollen

- `crm_admin`
- `commercial_owner`
- `commercial_editor`
- `operations_viewer`
- `privacy_reviewer`

Es gibt in C1 weder externe Partnerrollen noch App-/ACC-Rollen, anonyme Nutzer oder Mandantenadministratoren.

## Allgemeine Regeln

- Jede Sitzung benötigt eine aktive, administrativ angelegte Testidentität und AAL2.
- Ohne gültige Sitzung, mit AAL1 oder deaktivierter Identität sind alle CRM-Zugriffe gesperrt.
- `anon` erhält keine Fachobjektrechte.
- Direkte Fachmutation durch `authenticated` ist gesperrt; die lokale AMAVIO-API führt die Fachmutation mit serverseitiger Prüfung aus.
- `crm_admin` ist keine Datenbank-Superuserrolle und darf RLS nicht aus der Anwendung heraus deaktivieren.
- Auditereignisse sind append-only; keine Fachrolle bearbeitet oder löscht sie.
- Export, Import, physische Löschung und Integrationen bleiben für alle Rollen gesperrt.

## Objekt- und Aktionsmatrix

Legende: **E** erlaubt, **B** bedingt nach Objekt-/Zuweisungsregel, **V** verboten.

| Objekt/Aktion | Admin | Commercial Owner | Commercial Editor | Operations Viewer | Privacy Reviewer |
|---|---:|---:|---:|---:|---:|
| Organisation lesen | E | B: eigene/zugewiesene | B: freigegebene | B: nur gewonnener Handoff-Kontext | B: nur notwendige Metadaten |
| Organisation anlegen/bearbeiten | E | B | B | V | V |
| Organisation archivieren/wiederherstellen | E | B: verantwortlich | V | V | V |
| Kontakt lesen | E | B: eigene/zugewiesene | B: freigegebene | V | B: Kontakt-/Herkunftsstatus |
| Kontakt anlegen/bearbeiten | E | B | B | V | B: nur Datenschutzstatus |
| Kontakt archivieren | E | B: verantwortlich | V | V | B: Sperr-/Prüfmarker, keine Archivierung |
| Chance lesen | E | B | B | B: gewonnen/freigegeben | B: notwendige Herkunft/Statusdaten |
| Chance anlegen/bearbeiten/Phase | E | B | B: ohne Owner-/Policyänderung | V | V |
| Chance archivieren/wiederherstellen | E | B: verantwortlich | V | V | V |
| Aufgabe lesen/bearbeiten/abschließen | E | B: eigene/Team | B: zugewiesen | V | V |
| Aktivität/Notiz/Gespräch/Termin | E | B | B | B: nur freigegebener Handoff-Kontext lesen | B: nur notwendige Datenschutzmetadaten |
| Wiedervorlage | E | B | B | V | V |
| Angebot | E | B | B | B: freigegebene gewonnene Chance lesen | V |
| Entscheidung | E | B | B: erfassen, keine Governanceentscheidung | B: freigegeben lesen | B: Datenschutzentscheidung |
| Dokumentreferenz-Metadaten | E | B | B | B: freigegeben lesen | B: Datenschutzreferenz |
| Partnerorganisation/-kontakt | E | B | B | V | B: Kontakt-/Herkunftsstatus |
| Lead und Konvertierung | E | B | B | V | B: notwendige Kontaktstatusdaten |
| Owner/Rollenzuweisung | E | B: innerhalb freigegebener Teamregel | V | V | V |
| Audit lesen | E | B: eigene/zugewiesene Ereignisse | B: eigene Aktionen | V | B: Datenschutz-/Zugriffsereignisse |
| Audit schreiben/ändern/löschen | V direkt; nur System schreibt | V | V | V | V |
| physisch löschen | V | V | V | V | V |
| exportieren/importieren | V | V | V | V | V |
| ACC/App/E-Mail/Kalender auslösen | V | V | V | V | V |

## Pflicht-Negativtests

| ID | Versuch | Erwartung API | Erwartung RLS/DB |
|---|---|---|---|
| AUTH-01 | ohne Sitzung lesen | 401 | keine Daten |
| AUTH-02 | AAL1-Faktor liest Fachobjekt | 403/MFA erforderlich | Policy verweigert |
| AUTH-03 | gesperrter Nutzer mit altem Token | 401/403 | Policy verweigert |
| AUTH-04 | Editor ändert eigene Rolle oder Owner-Regel | 403 | keine Änderung |
| AUTH-05 | Owner liest nicht zugewiesenen Restricted Contact | 403/404 | keine Zeile |
| AUTH-06 | Operations Viewer liest offenen Lead/Kontakt | 403/404 | keine Zeile |
| AUTH-07 | Privacy Reviewer ändert Chance oder Angebot | 403 | keine Änderung |
| AUTH-08 | Rolle versucht Export/Import | 403/nicht vorhanden | keine Funktion/kein Privileg |
| AUTH-09 | Rolle versucht physisches Delete | 403 | `DELETE` verweigert |
| AUTH-10 | Browser verwendet anon/publishable key für Tabellenmutation | keine API-Funktion | RLS verweigert |
| AUTH-11 | authentifizierter Client umgeht AMAVIO-API | nicht anwendbar | direkte Mutation verweigert |
| AUTH-12 | manipulierte Objekt-/Workspace-ID | 403/404 | keine fremde Zeile; Single Workspace fest |
| AUTH-13 | ungültiger Phasenwechsel trotz Schreibrolle | 422 | Transaktion ohne Änderung |
| AUTH-14 | archivierte Chance wird normal bearbeitet | 409/422 | keine Änderung außer Restore-Pfad |
| AUTH-15 | Auditereignis wird geändert/gelöscht | 403 | `UPDATE/DELETE` verweigert |
| AUTH-16 | Service-Key im Browserbundle gesucht | nicht vorhanden | nicht anwendbar |
| AUTH-17 | ACC-/App-Referenz als Integrationsaufruf missbraucht | 403/nicht vorhanden | keine externe Verbindung |
| AUTH-18 | Mandanten-/Workspacewechsel | nicht vorhanden | keine zweite Workspace-ID zulässig |

## Positive Vertragstests

- jede Rolle kann genau die erlaubten Minimalfälle ausführen;
- erlaubte Mutation erzeugt Fachänderung und minimiertes Auditereignis in einer Transaktion;
- Objektzuweisung und Rollenentzug wirken unmittelbar nach Session-/Claim-Aktualisierung;
- Archivierung und Wiederherstellung erhalten Beziehungen und Historie;
- erlaubte Pipelineübergänge und Pflichtfeldregeln entsprechen `CRM_STATUS_AND_TRANSITION_CONTRACT.md`;
- alle R3.2-End-to-End-Pfade funktionieren mit synthetischen Daten über die neue API-Grenze;
- Reload, Fehler, Offlinezustand und Providerausfall führen nicht zu stillen Datenverlusten oder falschen Erfolgsanzeigen.

## RLS-Abnahme

Vor C1-Abnahme muss für jede fachliche Tabelle belegt sein:

1. RLS aktiv;
2. kein Default-/Fallback-Allow;
3. anonyme Zugriffe verweigert;
4. direkte Mutationen für normale Auth-Nutzer verweigert;
5. Lesen nur gemäß Rollen-/Objektvertrag;
6. Audit unveränderlich für Fachrollen;
7. Test mit mindestens einer erlaubten und einer verbotenen Identität;
8. keine Policy verlässt sich allein auf vom Client frei gesetzte Metadaten;
9. keine Service-/Adminrolle wird an den Browser ausgegeben;
10. Ergebnisse sind automatisiert und im C1-QA-Bericht protokolliert.

## Abweichungsregel

Jeder erfolgreich ausgeführte Verbotsfall ist ein Stop-Kriterium. Eine UI-Ausblendung, ein Hinweistext oder ein nachträglicher Auditlogeintrag kompensiert keine fehlende technische Verweigerung.

