# AMAVIO One CRM – C1 Datenschutz- und Provider-Due-Diligence

**Stand und Quellenabruf:** 10.10.2026  
**Providerkandidat:** Supabase Managed Platform, spezifische AWS-Region `eu-central-1` Frankfurt  
**Status:** technische und dokumentarische Vorprüfung abgeschlossen; keine Rechtsberatung, kein Vertragsschluss und keine Datenschutzfreigabe

## Prüfgegenstand

Geprüft wurde ausschließlich, ob die öffentlich verfügbaren Providerunterlagen ausreichend konkret sind, um einen engen C1-Beschluss vorzubereiten. Es wurde kein Konto geöffnet, kein Dokument akzeptiert, keine Anfrage versendet und keine Anbieterumgebung aufgerufen.

## Ergebnis

Die öffentliche Evidenz ist hinreichend für eine bedingte technische C1-Planung, aber nicht hinreichend für eine endgültige Vertrags- oder Datenschutzfreigabe. Besonders relevant sind:

- Das aktuelle DPA ist Version 1 vom 01.08.2026 und benennt Supabase Pte. Ltd. in Singapur als Vertragspartner/Auftragsverarbeiter.
- Die Frankfurter Region steuert den Ort von PostgreSQL, Auth und Backups, garantiert aber ausdrücklich nicht, dass jede Verarbeitung in dieser Region bleibt.
- Account-/Billingdaten, globale Supportzugriffe sowie Telemetrie/Logs können außerhalb der gewählten Region verarbeitet werden; SCCs und eine TIA werden als Transfermechanismen genannt.
- Die am 10.10.2026 verlinkte Subprozessorenliste ist auf den 01.06.2026 datiert und enthält zahlreiche weitere Anbieter. Die öffentlich gelieferte PDF benennt Anbieter und Verarbeitungszwecke, aber in der ausgelesenen Fassung keine vollständigen Verarbeitungsorte.
- Ein Provider-DPA, eine Frankfurter Region, SOC 2 oder ISO 27001 machen AMAVIO nicht automatisch datenschutzkonform oder sicher.

## Verarbeitungsebenen in C1

| Ebene | Daten | C1-Regel |
|---|---|---|
| CRM-Fachdaten | synthetische Organisationen, `.invalid`-Kontakte, Chancen, Aufgaben, Journal | nur K1; keine reale Person oder reale Organisation als CRM-Datensatz |
| Testidentitäten | synthetische Alias-Adressen, Passwort- und TOTP-Testdaten | bevorzugt ohne reale Mailzustellung; keine produktive Nutzerbasis |
| Provider-Verwaltungsdaten | Name/Kontakt des Kontoinhabers, Login, MFA, Abrechnung, Support | technisch unvermeidbare reale Verwaltungsdaten; ausdrückliche Annahme und Anbieterprüfung erforderlich |
| Sicherheits-/Nutzungsmetadaten | IP, Zeit, Geräte-/Session- und Logmetadaten | minimieren; Aufbewahrung und Zugriffe dokumentieren |
| Geheimnisse | Passwörter, API-/Service-Schlüssel, TOTP-Seeds | K4; nie CRM-Fachobjekt, Repository, Dokumentation oder Klartextlog |

## Art.-28-/Vertragscheck

Art. 28 DSGVO verlangt einen bindenden Vertrag und hinreichende Garantien des Auftragsverarbeiters. Das veröffentlichte DPA enthält Rollen, Weisungsbindung, Unterauftragsverarbeitung, Sicherheitsmaßnahmen, Incident-Unterrichtung, Rückgabe/Löschung und SCC-Regelungen. Vor C1 müssen trotzdem folgende Punkte von einer qualifizierten Stelle geprüft und dokumentiert werden:

1. passt die automatisch einbezogene Vertragsfassung tatsächlich zur geplanten Kunden-/Verantwortlichenrolle von AMAVIO;
2. sind Gegenstand, Dauer, Zwecke, Datenarten und betroffene Kategorien für den engen C1-Zweck korrekt abgedeckt;
3. ist die allgemeine Genehmigung von Subprozessoren samt kurzer Einspruchsfrist akzeptabel und organisatorisch beherrschbar;
4. genügt die Transferbewertung für Singapur, USA, globale Supportzugriffe und die konkret eingesetzten Subprozessoren;
5. sind die veröffentlichten TOMs und zugänglichen Auditnachweise für den synthetischen Stagingzweck ausreichend;
6. wie werden DPA-, TIA-, Subprozessoren- und Vertragsänderungen überwacht;
7. sind Rückgabe, Export und Löschung einschließlich Backups im Exit-Prozess ausreichend nachweisbar.

## Provider-Evidenzmatrix

| Thema | Öffentliche Evidenz 10.10.2026 | Bewertung für C1 | Status |
|---|---|---|---|
| Vertragspartner/DPA | DPA Version 1 vom 01.08.2026; Supabase Pte. Ltd.; Processor-/Controller-Rollen | prüfbar dokumentiert, noch nicht qualifiziert angenommen | offen |
| Region | Datenbank, Auth und Backups liegen in ausgewählter AWS-Region | `eu-central-1` ist technisch passend | bedingt erfüllt |
| Verarbeitung außerhalb der Region | Provider nennt Account/Billing, Support, Telemetrie/Logs und ggf. CDN | Datenfluss ist nicht rein deutsch/europäisch | Transferprüfung offen |
| SCC/TIA | SCCs im DPA; TIA für Singapur/USA verlinkt | Mechanismus vorhanden, Einzelfallbewertung erforderlich | offen |
| Subprozessoren | Liste vom 01.06.2026; Änderungsabonnement und Einspruchsregel im DPA | Liste muss bei Freigabe erneut gesichert und geprüft werden | offen |
| TOMs | DPA Schedule 1 beschreibt Governance, Zugang, Verschlüsselung, Backups, Tests | brauchbare Basisevidenz; Shared Responsibility bleibt | bedingt erfüllt |
| Security-Nachweise | SOC 2 Type 2 und ISO 27001 werden dokumentiert; Berichte/Zertifikat je nach Tarif/Zugang | Marketing-/Dokuaussage allein genügt nicht als AMAVIO-Prüfung | offen bis Nachweiszugang geklärt |
| Löschung/Exit | DPA: Kopie auf Anfrage innerhalb 30 Tagen nach Vertragsende; Löschung nach Retention Period | in Exit-Runbook aufgenommen; tatsächliche Durchführung später zu belegen | bedingt erfüllt |
| Incident | DPA: Benachrichtigung ohne unangemessene Verzögerung, soweit möglich binnen 48 h | AMAVIO braucht eigenen Melde- und Bewertungsprozess | Spezifikation erfüllt, Betreiber offen |
| Support/SLA | bezahlte Projekte mit begrenztem Support; Uptime-SLA nur Enterprise, Support-SLA Team/Enterprise | Pro bietet keine Uptime-SLA; für nichtproduktives C1 akzeptabel, nicht für Produktion | für C1 akzeptabel |

## Datenminimierung und Zweckbindung für C1

- keine echten CRM-Namen, E-Mail-Adressen, Telefonnummern, Organisationen, Gesprächsinhalte oder Dokumente;
- für Fachobjekte ausschließlich erkennbar synthetische Werte und `.invalid`-Domains;
- keine Kopie aus App, ACC, Website, Research, Businessplan, Kontaktlisten oder produktiven Systemen;
- Supporttickets enthalten keine Datenbankauszüge, Tokens, Screenshots mit Secrets oder vollständige Fachdatensätze;
- keine Storage-Nutzung und kein Upload;
- Logfelder nur Actor-ID/Pseudonym, Objekt-ID, Aktion, Ergebnis, Zeitpunkt, Korrelations-ID und notwendige Statusmetadaten;
- keine Inhaltskopie von Notizen, Gesprächen, Angeboten oder Entscheidungen im Audit;
- Provider-Verwaltungsdaten werden getrennt von CRM-Fachdaten inventarisiert.

## Betroffenenrechte, Aufbewahrung und Löschung

Da CRM-Fachdaten in C1 synthetisch bleiben, entstehen daraus keine realen CRM-Betroffenenfälle. Provider-Verwaltungsdaten können dennoch personenbezogen sein. Vor Kontoanlage müssen Verantwortlichkeit und Kontaktweg für Auskunft, Berichtigung, Löschung, Einschränkung und Incidentbearbeitung benannt sein.

Für C1 gilt operativ:

- synthetische Fachdaten: maximal für die Dauer des C1-Blocks plus 30 Tage Abnahme-/Fehlernachweis; danach Exportentscheidung und Projektbereinigung;
- Audit-/Sicherheitsmetadaten: nur erforderliche Provider-/C1-Retention, im Pro-Tarif nach aktueller Preisdokumentation sieben Tage Logzugriff;
- tägliche Backups: nach aktueller Dokumentation im Pro-Tarif sieben Tage;
- C1-Ende: versionierter logischer Export, Löschentscheidung, Nachweis der Projektlöschung oder begründete Weiterführung;
- produktive Fristen oder reale Betroffenenprozesse werden hier ausdrücklich nicht freigegeben.

## Offene Freigabeblocker

| Blocker | Erforderliche Evidenz | Freigabestelle |
|---|---|---|
| DP-01 | qualifizierte Bewertung DPA/SCC/TIA und der tatsächlichen Transferwege | Datenschutz/qualifizierte Beratung |
| DP-02 | aktuelle Subprozessorenliste mit Verarbeitungsorten und akzeptierter Änderungsüberwachung | Datenschutz + Product Owner |
| DP-03 | dokumentierte Annahme der realen Provider-Verwaltungsdaten | Product Owner + Datenschutz |
| DP-04 | Verantwortlicher für Betroffenen-/Incident-Prozess benannt | Product Owner |
| DP-05 | bei C1-Start erneut gespeicherter Versions-/Abrufnachweis aller zeitkritischen Providerdokumente | technischer Betreiber + Datenschutz |

## Maßgebliche offizielle Quellen

- [Supabase Data Processing Addendum, Version 1 vom 01.08.2026](https://supabase.com/legal/customer-resources/data-processing-addendum)
- [Supabase Data Residency and Transfers FAQ, Version 1 vom 06.10.2026](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq)
- [Supabase Subprocessor List, Seite mit verlinkter Liste vom 01.06.2026](https://supabase.com/legal/customer-resources/subprocessor-list)
- [Supabase Security](https://supabase.com/docs/guides/security)
- [Supabase Shared Responsibility Model](https://supabase.com/docs/guides/deployment/shared-responsibility-model)
- [Supabase Support Policy](https://supabase.com/support-policy)
- [Supabase Service Level Agreement](https://supabase.com/sla)
- [DSGVO, insbesondere Art. 28, EUR-Lex](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32016R0679)
- [EDPB Guidelines 07/2020 – Controller and Processor](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en)

## Keine Rechtsaussage

Dieses Dokument ist eine technische und organisatorische Due-Diligence-Vorlage. Es bestätigt keine Rechtmäßigkeit, keinen wirksamen Vertragsschluss, keine Datenschutzkonformität und keine Freigabe für reale personenbezogene Daten.

