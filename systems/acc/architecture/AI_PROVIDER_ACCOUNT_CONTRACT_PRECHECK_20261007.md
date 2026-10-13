# AMAVIO ACC – Vertrags- und Kontofähigkeits-Precheck der AI-Finalisten

**Stand:** 07.10.2026  
**Scope:** Mistral API EU und OpenAI API EU für `GATE-02-EXTERNAL-ASSISTANCE-SANDBOX`  
**Arbeitsmodus:** ausschließlich öffentliche Primärquellen und bestehende lokale ACC-Architektur; kein Login, keine Kontoeröffnung, kein API-Key, kein Modellaufruf, keine Supportanfrage und keine Kosten  
**Ergebnisstatus:** beide Anbieter `CONDITIONAL GO`; Mistral bleibt bevorzugter Kandidat für den nächsten Founder-Gate

## 1. Statuslogik

- **PASS – öffentlich belegt:** Anbieter dokumentiert die Fähigkeit aktuell in einer offiziellen Quelle.
- **CONDITIONAL – kontoseitig nachzuweisen:** Fähigkeit existiert, ist aber genehmigungs-, plan-, konto-, projekt- oder vertragsabhängig.
- **OPEN – erst nach Freigabe prüfbar:** Ohne autorisierte Konto-/Vertragsaktion ist keine belastbare Aussage möglich.
- **OUT – nicht im Gate-02-Scope:** Funktion wird bewusst nicht verwendet.

Ein öffentliches `PASS` bedeutet nicht, dass es im späteren AMAVIO-Konto bereits aktiviert ist.

## 2. Mistral API EU

| Prüffeld | Öffentlicher Nachweis | Precheck-Status | Für AMAVIO noch erforderlich |
|---|---|---|---|
| Kommerzielles DPA/AVV | DPA ist in die Commercial Terms einbezogen; Mistral handelt für Kundendaten als Processor. DPA wird nicht offline unterschrieben. | **PASS** | Vertragsversion und AMAVIO-Vertragspartei bei Kontoaktivierung archivieren. |
| EU-Inferenz | `api.eu.mistral.ai` verarbeitet Inferenz in mehreren EU-/EFTA-Rechenzentren; 10 % Regionalaufschlag. | **PASS** | Base URL serverseitig fest verdrahten und im Audit protokollieren. |
| EU-Hosting | Mistral nennt EU-Hosting als Standard; funktionsabhängige temporäre Drittlandtransfers bleiben möglich. | **PASS mit Grenze** | Nur stateless Chat Completions; Subprocessor-/Transferprüfung am Aktivierungstag. |
| Training-Opt-out | Pay-as-you-go-Kunden können opt-out wählen; ZDR und Training-Opt-out sind getrennt. | **CONDITIONAL** | Im Admin-Panel aktivieren und mit Screenshot/Export dokumentieren; kein Feedback senden. |
| Zero Data Retention | Für Pay-as-you-go und unterstützte stateless Endpoints verfügbar, aber nur nach begründeter Anfrage und Mistral-Freigabe. | **CONDITIONAL** | Pay-as-you-go aktivieren, ZDR beantragen, Genehmigung abwarten und sichtbaren Admin-Status dokumentieren. |
| Gate-02-Endpoint | `/v1/chat/completions` ist ZDR-fähig. Agents, Conversations, Files, Batch und Libraries sind nicht ZDR-fähig. | **PASS** | Nur `/v1/chat/completions`; übrige Produkte technisch sperren. |
| Modell in EU-Region | Regionale Dokumentation nutzt `mistral-medium-latest` als Beispiel, weist aber darauf hin, dass Modelle je Region variieren. | **CONDITIONAL** | Nach Kontoaktivierung `models.list` ausschließlich gegen den EU-Endpunkt ausführen und konkrete Modell-ID/Snapshot festhalten. |
| Spending Limit | Organisation und Workspace können monatliche harte Limits erhalten; bei Erreichen werden API-Aufrufe gesperrt. | **PASS** | Eigenen Gate-02-Workspace anlegen und 25 USD Hard Limit setzen – erst nach Founder-Kostenfreigabe. |
| Rate Limits | RPS und TPM werden im Admin-Panel modellbezogen ausgewiesen. | **CONDITIONAL** | Konkrete Limits nach Kontoaktivierung lesen und im Testprofil dokumentieren. |
| Preview-/Labs-Grenze | Labs-/Preview-Modelle fallen nicht unter ZDR; Commercial Terms enthalten eine Trainingsausnahme. | **PASS** | Mistral Large 4 Public Preview und alle Labs-Modelle technisch ausschließen. |
| API-Key-Sicherheit | Workspace-gebundene Keys und getrennte Workspaces werden offiziell unterstützt. | **PASS** | Nur serverseitige Umgebungsvariable/Secret Store; niemals Browser, Repository oder Auditinhalt. |

### Mistral-Gesamturteil

**CONDITIONAL GO – bevorzugter Gate-02-Kandidat.**

Öffentlich belegt sind EU-Endpunkt, DPA, ZDR-Fähigkeit für Chat Completions, Training-Opt-out und echte Workspace-Spending-Limits. Nicht belegt werden kann ohne Konto und Anbieterfreigabe, ob ZDR für AMAVIO genehmigt wird, ob Training-Opt-out aktiv ist und welche konkrete Modell-ID am EU-Endpunkt verfügbar ist.

**Freigabeschwelle:** Gate 02 darf erst geöffnet werden, wenn ZDR im Admin-Panel sichtbar aktiv ist, Training-Opt-out dokumentiert ist, `mistral-medium-latest` beziehungsweise eine festgehaltene stabile Medium-3.5-Modell-ID am EU-Endpunkt gelistet wird und das 25-USD-Hard-Limit aktiv ist.

## 3. OpenAI API EU

| Prüffeld | Öffentlicher Nachweis | Precheck-Status | Für AMAVIO noch erforderlich |
|---|---|---|---|
| Kommerzielles DPA/AVV | OpenAI-DPA deckt API Services ab; für EWR-/Schweiz-Kunden ist OpenAI Ireland Ltd. Vertragspartei, vorbehaltlich der konkreten Vereinbarung. | **PASS** | Geltende DPA-Version und Vertragspartei im künftigen Organisationskonto archivieren. |
| Kein Training standardmäßig | API-Daten werden nicht zum Training verwendet, sofern nicht ausdrücklich opt-in. | **PASS** | Data-Sharing-/Feedback-Opt-ins deaktiviert lassen. |
| EU Data Residency | `eu.api.openai.com` unterstützt regionale Verarbeitung/Storage; GPT-6.1 Sol unterstützt US- und EU-Data-Residency. | **PASS als Fähigkeit** | Eignung/Freischaltung für das AMAVIO-Konto und EU-Projekt nachweisen. |
| Nicht-US-Zusatzanforderung | Nicht-US-Regionen erfordern Freigabe für Abuse-Monitoring-Kontrollen und ein Modified Retention Amendment. | **CONDITIONAL** | Anbieterfreigabe und Amendment vor erster Gate-02-Anfrage dokumentieren. |
| ZDR/MAM | Eligible Customers können nach vorheriger OpenAI-Freigabe ZDR oder Modified Abuse Monitoring konfigurieren. Standard sind Abuse-Logs mit bis zu 30 Tagen. | **CONDITIONAL** | ZDR bevorzugen; Genehmigung und Projektstatus im Data-Retention-Tab dokumentieren. |
| Gate-02-Endpoint | `/v1/responses` und `/v1/chat/completions` behandeln `store` unter ZDR als `false`; nicht alle Features sind ZDR-fähig. | **PASS mit Grenze** | Stateless Textaufruf, `store:false`; Files, Vector Stores, Web Search, MCP, Code Interpreter und externe Tools sperren. |
| Aktuelles Modell | `gpt-6.1-sol` ist seit 29.09.2026 aktuell dokumentiert, unterstützt Structured Outputs und EU Data Residency. | **PASS** | Modell-ID `gpt-6.1-sol` fest konfigurieren; Alias-/Snapshotstrategie vor Testbeginn entscheiden. |
| Project Hard Limit | Monatliche Hard Limits auf Organisations- und Projektebene werden unterstützt; bei Überschreitung folgt `429`. | **PASS** | Eigenes Gate-02-Projekt und 25 USD Project Hard Limit – erst nach Founder-Kostenfreigabe. |
| Rate Limits | Modell- und Tierlimits sind dokumentiert; konkrete Limits erscheinen in den Projekteinstellungen/API-Headern. | **CONDITIONAL** | Nach Kontoaktivierung tatsächliche Projektlimits und Header protokollieren. |
| API-Key-Sicherheit | Projekt-, Service-Account- und Key-Trennung wird unterstützt. | **PASS** | Zeitlich begrenzter Gate-02-Key, nur serverseitig, Rotation nach Test. |
| Systemdaten | Account-, Nutzungs-, Abrechnungs- und bestimmte Metadaten fallen nicht vollständig unter regionale Customer-Content-Residenz. | **PASS als dokumentierte Grenze** | Im Datenfluss und in der Datenschutzbewertung ausdrücklich festhalten. |

### OpenAI-Gesamturteil

**CONDITIONAL GO – belastbarer Alternativpfad.**

OpenAI ist hinsichtlich des konkreten aktuellen Modells und EU-Supports öffentlicher dokumentiert als Mistral. Die größere Hürde liegt im vertraglichen Freigabeprozess: EU Data Residency, ZDR/Modified Abuse Monitoring und das Modified Retention Amendment müssen für AMAVIO tatsächlich genehmigt und aktiviert sein.

**Freigabeschwelle:** Gate 02 darf erst geöffnet werden, wenn das EU-Projekt sichtbar aktiv ist, ZDR im Projekt konfiguriert ist, das Modified Retention Amendment gilt und ein 25-USD-Project-Hard-Limit aktiv ist.

## 4. Direkter Vergleich nach dem Precheck

| Kriterium | Mistral EU | OpenAI EU | Entscheidungseffekt |
|---|---|---|---|
| EU-naher Standardpfad | stärker | gut, aber eligibility-/amendment-abhängig | Vorteil Mistral |
| Konkretes aktuelles Modell öffentlich EU-bestätigt | regional variabel, Kontoabfrage nötig | GPT-6.1 Sol ausdrücklich EU-fähig | Vorteil OpenAI |
| Training | Opt-out muss aktiv gesetzt werden | API standardmäßig kein Training | Vorteil OpenAI |
| ZDR | Pay-as-you-go, begründete Anfrage, Ermessensentscheidung | eligible customers, Freigabe und Zusatzanforderungen | beide conditional |
| Hard Cost Cap | Organisation und Workspace | Organisation und Projekt | gleichwertig für Gate 02 |
| Stateless Minimalpfad | `/v1/chat/completions` | `/v1/responses` oder Chat Completions | gleichwertig |
| Vertrags-/Setup-Komplexität | voraussichtlich geringer | voraussichtlich höher | Vorteil Mistral |
| Tokenkosten im Gate 02 | sehr niedrig | sehr niedrig | nicht entscheidend |

## 5. Entscheidung nach öffentlichem Precheck

### Empfohlener Kandidat für die zweite Founder-Freigabe

**Mistral API EU mit stabilem Mistral Medium 3.5, vorbehaltlich vier harter Nachweise:**

1. `api.eu.mistral.ai` und konkrete stabile Modell-ID sind im Konto verfügbar;
2. Training-Opt-out ist aktiv;
3. ZDR ist genehmigt und im Admin-Panel aktiv;
4. Gate-02-Workspace hat ein monatliches Hard Limit von maximal 25 USD.

Scheitert einer dieser Punkte, wird nicht improvisiert: Dann wechselt die Prüfung zu **OpenAI API EU mit `gpt-6.1-sol`**, ebenfalls nur nach aktivem ZDR, EU-Projekt, Modified Retention Amendment und 25-USD-Hard-Limit.

## 6. Noch nicht autorisierte Aktionen

Der aktuelle Precheck autorisiert nicht:

- Mistral- oder OpenAI-Kontoeröffnung;
- Hinterlegung einer Zahlungsmethode;
- Aktivierung von Pay-as-you-go oder Kauf von Credits;
- Annahme neuer Vertragsbedingungen im Namen von AMAVIO;
- ZDR-/Sales-/Supportanfrage;
- Erstellung eines API-Keys;
- Speicherung eines Secrets;
- Modell- oder Testaufruf;
- Änderung des ACC-Codes;
- Verarbeitung realer Daten.

## 7. Vorbereitete, noch nicht zu sendende Anbieteranfrage

### Mistral

> AMAVIO plant einen eng begrenzten, rein synthetischen internen API-Test über `api.eu.mistral.ai`. Bitte bestätigen Sie für unser künftiges kommerzielles Pay-as-you-go-Konto: (1) Anwendbarkeit des aktuellen DPA, (2) Aktivierbarkeit von Training-Opt-out, (3) Genehmigungsfähigkeit von Zero Data Retention für `/v1/chat/completions`, (4) Verfügbarkeit einer stabilen Mistral-Medium-3.5-Modell-ID am EU-Endpunkt, (5) mögliche Subprocessor-/Drittlandverarbeitung trotz EU-Endpunkt und (6) Durchsetzung eines monatlichen Workspace-Hard-Limits von 25 USD. Es werden zunächst ausschließlich synthetische Daten verarbeitet; Agents, Files, Batch, Conversations und Preview-/Labs-Modelle sind ausgeschlossen.

### OpenAI

> AMAVIO plant einen eng begrenzten, rein synthetischen internen API-Test über `eu.api.openai.com` mit `gpt-6.1-sol`. Bitte bestätigen Sie für unser künftiges API-Organisationskonto: (1) Anwendbarkeit des aktuellen DPA mit OpenAI Ireland Ltd., (2) Eligibility für EU Data Residency, (3) Freigabeprozess für Zero Data Retention oder Modified Abuse Monitoring, (4) erforderliches Modified Retention Amendment, (5) EU-Fähigkeit von `gpt-6.1-sol` für einen stateless Text-/Structured-Output-Aufruf und (6) Durchsetzung eines monatlichen Project Hard Limits von 25 USD. Es werden zunächst ausschließlich synthetische Daten verarbeitet; Files, Vector Stores, Web Search, MCP und externe Tools sind ausgeschlossen.

Keine dieser Anfragen wurde versendet.

## 8. Primärquellen

### Mistral

- <https://docs.mistral.ai/inference/regional-inference>
- <https://docs.mistral.ai/admin/monitor-comply/zero-data-retention>
- <https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr>
- <https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models>
- <https://docs.mistral.ai/admin/billing-usage/usage-limits>
- <https://docs.mistral.ai/getting-started/quickstarts/admin/manage-workspaces>
- <https://legal.mistral.ai/terms/data-processing-addendum/>
- <https://legal.mistral.ai/terms/commercial-terms-of-service/>

### OpenAI

- <https://developers.openai.com/api/docs/guides/your-data>
- <https://developers.openai.com/api/docs/models/gpt-6.1-sol>
- <https://developers.openai.com/api/docs/guides/spend-limits>
- <https://developers.openai.com/api/docs/guides/rate-limits>
- <https://openai.com/policies/data-processing-addendum/>

## 9. Nächster Founder-Gate

Eine nächste Freigabe müsste ausdrücklich benennen, ob AMAVIO:

1. nur eine noch nicht zu sendende Mistral-Anfrage final redigieren will; oder
2. eine Mistral-Konto-/Pay-as-you-go-/ZDR-Prüfung mit maximal 25 USD Kostenlimit tatsächlich autorisiert.

Bis dahin bleibt `GATE-02-EXTERNAL-ASSISTANCE-SANDBOX` geschlossen.

