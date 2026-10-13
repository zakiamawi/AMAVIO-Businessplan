# AMAVIO ACC – AI-Provider-, Datenschutz- und Kostenvergleich

**Stand:** 07.10.2026  
**Entscheidungszweck:** Vorauswahl für `GATE-02-EXTERNAL-ASSISTANCE-SANDBOX`  
**Prüfstatus:** öffentliche Anbieter- und EU-Quellen geprüft; keine Konten eröffnet, keine Verträge abgeschlossen, keine API aktiviert und keine Kosten ausgelöst  
**Datengrenze:** ausschließlich synthetische, klar markierte Testfälle; keine realen Personen-, Arbeitnehmer-, Arbeitgeber-, Objekt- oder Partnerdaten

## Ergebnis in einem Satz

Für Gate 02 sind **Mistral API über den EU-Endpunkt mit Mistral Medium 3.5** und **OpenAI API über den EU-Endpunkt mit GPT-6.1 Sol** die zwei belastbarsten Finalisten. Die vorläufige AMAVIO-Empfehlung ist **Mistral als datenschutz- und EU-nahe Erstwahl**, sofern Mistral vor Aktivierung ZDR, Training-Opt-out, DPA und EU-Endpunkt schriftlich beziehungsweise in den Kontoeinstellungen bestätigt. OpenAI ist der stärkste direkte Alternativpfad, wenn EU Data Residency plus Modified Retention/ZDR für AMAVIO freigeschaltet werden.

Das ist noch **keine Providerfreigabe**. Gate 02 bleibt technisch geschlossen, bis Founder, Anbieter, Modell, Kostenlimit und Datenmodus ausdrücklich festgelegt sind.

## 1. Bewerteter AMAVIO-Anwendungsfall

Der Vergleich bezieht sich ausschließlich auf assistive Generierung im bestehenden ACC-Provider-Interface:

- synthetische Fallzusammenfassung;
- synthetische Evidenzprüfung;
- strukturierter Arbeitsplan;
- Kommunikationsentwurf ohne Versand;
- JSON-Ausgabe mit `summary`, `recommendation`, `evidence[]`, `confidence`, `uncertainty`, `forbiddenActions[]` und `proposedSteps[]`;
- serverseitige Schema- und Inhaltsvalidierung;
- menschliche Annahme oder Zurückweisung;
- deterministischer lokaler Fallback;
- keine Personenbewertung, kein Profiling, keine Prognose, keine automatische Entscheidung und keine Außenwirkung.

Nicht bewertet werden Consumer-Chats, frei zugängliche Chat-Oberflächen, Browser-Plugins, Agenten mit autonomer Tool-Nutzung, Websuche, Files APIs, RAG-Speicher oder produktive Arbeitnehmerdaten.

## 2. Entscheidungskriterien

Die Kriterien sind bewusst in dieser Reihenfolge priorisiert:

1. **Datenschutz und Vertrag:** DPA/AVV, Verantwortlichkeiten, Training, Retention, Löschung und Unterauftragnehmer;
2. **EU-Verarbeitung:** belastbarer regionaler Inferenzpfad und regionale Speicherung, nicht nur Unternehmenssitz;
3. **Wirkungsgrenze:** stateless API, kein serverseitiger Agent, keine persistente Files-/Conversation-Funktion;
4. **Ausgabezuverlässigkeit:** strukturierte Ausgaben, Function Calling, Schema-Validierung und reproduzierbare Modellversion;
5. **Betrieb:** Kostenlimit, Rate Limit, Monitoring, Fehlerbehandlung und Abschaltbarkeit;
6. **Portabilität:** providerneutrales Interface, keine unnötigen proprietären Tools und einfacher Modellwechsel;
7. **Kosten:** Tokenpreis plus regionale Aufschläge; Setup-, Support-, Cloud- und Compliance-Aufwand getrennt betrachtet.

## 3. Anbieterübersicht

| Pfad | Datenschutz-/Regionsbild | Training und Aufbewahrung | Kostenbild | AMAVIO-Eignung heute |
|---|---|---|---|---|
| **Mistral API – EU** | `api.eu.mistral.ai` verarbeitet Inferenz in EU-/EFTA-Rechenzentren; Mistral nennt EU-Hosting als Standard, weist aber auf mögliche temporäre Transfers bei einzelnen Funktionen hin. EU-Inferenz kostet 10 % Aufschlag. | DPA verfügbar. ZDR ist für unterstützte stateless API-Aufrufe auf bezahlten Plänen nach Freigabe verfügbar. Training-Opt-out und ZDR sind getrennte Einstellungen. Labs-/Preview-Modelle sind ausgeschlossen. | Sehr günstig bis moderat. Medium 3.5: effektiv EU ca. $1,65 Input / $8,25 Output je 1 Mio. Token. | **Finalist 1 / vorläufige Erstwahl.** Gute EU-Nähe, klarer stateless ZDR-Pfad, überschaubare Integration. Vorher schriftliche/Konto-Bestätigung aller vier Kontrollen nötig. |
| **OpenAI API – EU** | `eu.api.openai.com` unterstützt regionale Verarbeitung und Speicherung für geeignete Modelle/Funktionen. Nicht-US-Regionen benötigen Freigabe für Abuse-Monitoring-Kontrollen und ein Modified-Retention-Amendment. Systemdaten können außerhalb der Region verarbeitet werden. EU-Endpunkte kosten bei neueren Modellen 10 % Aufschlag. | API-Daten werden standardmäßig nicht zum Training verwendet. Standardmäßig können Abuse-Monitoring-Logs Inhalte bis zu 30 Tage halten; ZDR/Modified Abuse Monitoring erfordern Freigabe. DPA und SCC-Mechanismus verfügbar. | GPT-6.1 Sol EU ca. $2,20 / $11,00; GPT-6 Luna EU ca. $0,11 / $0,55 je 1 Mio. Input-/Output-Token. | **Finalist 2.** Sehr stark für strukturierten, toolfähigen Betrieb und günstig. Vertragliche/technische EU- und Retention-Freischaltung ist vor Nutzung zwingend nachzuweisen. |
| **Google Vertex AI – EU/Non-global** | Vertex AI kann regional konfiguriert werden; Datenresidenz und Sicherheitskontrollen sind modell- und funktionsspezifisch. IAM, Projektgrenzen, VPC-SC/CMEK je nach Funktion möglich. | Google verwendet Kundendaten nicht ohne Erlaubnis zum Trainieren. Für echtes ZDR müssen unter anderem Abuse-Logging-Ausnahme und Verzicht auf speichernde Features geprüft werden. Standardmäßiger In-Memory-Cache hat 24 Stunden TTL, ist projektisoliert und kann deaktiviert werden. | Gemini 3.8 Flash non-global aktuell ca. $0,825 / $4,125; ab 01.01.2027 ca. $1,65 / $8,25. Zusätzliche Cloud-/Logging-Kosten möglich. | **Enterprise-Alternative.** Stark, wenn AMAVIO ohnehin Google Cloud als Betriebsplattform wählt. Für einen kleinen Gate-02-Test höherer Setup-Aufwand als direkte API. |
| **Microsoft Foundry/Azure OpenAI – EU Data Zone** | EU Data Zone verarbeitet innerhalb der Azure EU Data Boundary; Standard/Regional kann auf Azure-Geographie begrenzen. Prompts und Antworten werden nicht zur Basismodellverbesserung genutzt. | Modelle sind stateless; Abuse Monitoring kann bei erkannten Mustern Speicherung und menschliche Prüfung auslösen, sofern Modified Abuse Monitoring nicht genehmigt ist. Microsoft-DPA und Azure-Sicherheitskontrollen gelten. | Modell-, Region- und Deployment-abhängig; die offizielle statische Preisseite liefert keine belastbare einheitliche AMAVIO-Zahl. Vor Auswahl ist eine konkrete Calculator-/Portal-Kalkulation erforderlich. | **Enterprise-Alternative.** Sinnvoll bei Microsoft-/Azure-Vorgabe eines Pilotkunden, SSO/Entra-Strategie oder privaten Netzanforderungen; für Gate 02 derzeit unnötig komplex. |
| **Anthropic API – direkt** | Direkt nur `global` oder `us` als Inferenz-Geografie; Workspace-Daten werden laut aktueller Dokumentation weiterhin in den USA gespeichert. Verarbeitung kann global erfolgen. Keine direkte EU-Pinning-Option belegt. | Kein Training von kommerziellen Inputs/Outputs ohne Opt-in/Feedback. Standard-/featureabhängige Retention; ZDR nur nach Enterprise-Freigabe und nicht für alle Features. DPA mit SCC ist Bestandteil der Commercial Terms. | Claude Sonnet 5: $2 / $10 je 1 Mio. Input-/Output-Token. | **Qualitäts-Challenger, nicht Datenschutz-Erstwahl.** Für ausschließlich synthetische Benchmarks denkbar, aber für den späteren EU-Personaldatenpfad nicht erste Wahl, solange EU-Speicherung/Processing nicht vertraglich anders vereinbart ist. |

### Nicht in die erste Gate-02-Auswahl aufgenommen

- **AWS Bedrock:** kann EU-Regionen, Private Networking und mehrere Modelle anbieten, aber Retention und Preise sind modell- und regionabhängig. Für AMAVIO wäre dies ein späterer Infrastrukturpfad, wenn ein Arbeitgeber AWS verlangt; für den ersten synthetischen Test erhöht es den Betriebsaufwand ohne notwendigen Produktnutzen.
- **Mistral Large 4 Public Preview:** am 06.10.2026 veröffentlicht. Preview-Modelle sind für diesen Gate-02-Pfad ausgeschlossen, weil Mistrals Commercial Terms für Labs-/Preview-Modelle abweichende Datennutzung zulassen können und ZDR sie nicht abdeckt.
- **Consumer-Abonnements aller Anbieter:** nicht mit kommerzieller API, DPA, Region, ZDR und Projektkontrollen verwechseln.

## 4. Vergleichbare Kostenrechnung

### Rechenannahmen

- Preise in **USD**, netto, ohne Umsatzsteuer, Wechselkurs, Support, Netzwerk, Storage, Logging oder Cloud-Grundkosten;
- keine Cache-, Batch-, Priority- oder Mengenrabatte;
- ein Assistenzlauf: **4.000 Input-Token + 1.000 Output-Token**;
- Szenario S: **300 Läufe/Monat** = 1,2 Mio. Input + 0,3 Mio. Output;
- Szenario M: **1.500 Läufe/Monat** = 6 Mio. Input + 1,5 Mio. Output;
- bei Mistral und OpenAI ist der dokumentierte EU-Aufschlag von 10 % eingerechnet;
- Google non-global nutzt den aktuell veröffentlichten Regionalpreis; der angekündigte Preis ab 01.01.2027 wird separat ausgewiesen;
- Anthropic Direct ist global und deshalb **kein** EU-vergleichbarer Real-Datenpfad.

| Anbieter / Modell | Effektiver Input $/1M | Effektiver Output $/1M | 300 Läufe | 1.500 Läufe | Hinweis |
|---|---:|---:|---:|---:|---|
| OpenAI GPT-6 Luna, EU | 0,11 | 0,55 | **0,30 $** | **1,49 $** | Kostenbaseline; Qualität muss gegen AMAVIO-Schema getestet werden. |
| Mistral Large 3, EU | 0,55 | 1,65 | **1,16 $** | **5,78 $** | Günstiger Challenger; Modellqualität nicht aus Preis ableiten. |
| Google Gemini 3.8 Flash, non-global, bis 31.12.2026 | 0,825 | 4,125 | **2,23 $** | **11,14 $** | Aktionspreis; ab 2027 Verdopplung. |
| Mistral Medium 3.5, EU | 1,65 | 8,25 | **4,46 $** | **22,28 $** | Vorgeschlagener Mistral-Qualitätspfad. |
| Anthropic Claude Sonnet 5, global | 2,00 | 10,00 | **5,40 $** | **27,00 $** | Kein bestätigter direkter EU-Pfad. |
| OpenAI GPT-6.1 Sol, EU | 2,20 | 11,00 | **5,94 $** | **29,70 $** | Aktueller vorgeschlagener OpenAI-Qualitätspfad. |
| Google Gemini 3.8 Flash, non-global, ab 01.01.2027 | 1,65 | 8,25 | **4,46 $** | **22,28 $** | Angekündigter Standardpreis. |
| Microsoft Foundry/Azure | offen | offen | **zu kalkulieren** | **zu kalkulieren** | Erst nach Modell-, Region- und Deployment-Auswahl belastbar. |

**Interpretation:** Selbst 1.500 textbasierte Assistenzläufe liegen bei den direkten Kandidaten im niedrigen zweistelligen Dollarbereich. Eine Providerentscheidung nur nach Tokenpreis wäre daher falsch. Vertragsfähigkeit, EU-Modus, Retention, Qualität und Betriebsaufwand sind wichtiger.

Die wiederverwendbare Rechengrundlage liegt zusätzlich in `AI_PROVIDER_COST_MODEL_20261007.csv`.

## 5. Datenschutz- und Vertragsbewertung

### Mistral – Bedingungen für eine AMAVIO-Freigabe

Vor Aktivierung müssen alle Punkte belegt sein:

- bezahlter kommerzieller API-Plan, nicht Consumer Chat;
- DPA/AVV gilt für das konkrete Konto;
- API-Ziel ausschließlich `api.eu.mistral.ai`;
- ZDR im Admin-Bereich sichtbar und aktiv;
- Training-/Anonymized-Improvement-Opt-out aktiv;
- ausschließlich `/v1/chat/completions`; keine Agents, Conversations, Files, Batch, Libraries oder Labs/Preview;
- konkretes Modell in der EU-Region verfügbar;
- Workspace-Spending-Limit und Rate Limit gesetzt;
- Subprocessor-Liste, mögliche Drittlandtransfers und technische Maßnahmen archiviert;
- Modell-ID, Endpoint, Request-ID, Promptversion und Schema-Version im AMAVIO-Audit protokolliert, aber keine unnötigen Promptinhalte in Logs dupliziert.

### OpenAI – Bedingungen für eine AMAVIO-Freigabe

- kommerzielles API-Projekt unter geltendem DPA;
- Data Residency für Europa aktiviert;
- `eu.api.openai.com` serverseitig fest verdrahtet;
- Freigabe für Modified Abuse Monitoring oder ZDR und abgeschlossenes Modified Retention Amendment nachgewiesen;
- `store: false`, soweit der konkrete Endpoint dies unterstützt beziehungsweise unter ZDR erzwingt;
- nur ZDR-/EU-fähige Endpoints und Features;
- keine Files-, Vector-Store-, Web-Search-, MCP- oder sonstigen Drittanbieterpfade im Gate 02;
- Projekt-Hard-Limit, Rate Limit und separater Gate-02-Key;
- DPA, Subprocessor-Liste und Systemdaten-Ausnahme dokumentiert.

### Google Vertex AI – Bedingungen für eine spätere Prüfung

- konkretes EU-Projekt und regionaler Endpoint;
- Modellverfügbarkeit in genau dieser Region bestätigt;
- Abuse-Monitoring-Ausnahme geprüft, falls ZDR gefordert wird;
- projektweiten In-Memory-Cache bei Bedarf deaktiviert;
- keine Google Search-/Maps-Grounding- oder Session-Resumption-Funktionen;
- IAM-Minimalrechte, getrenntes Servicekonto, Budgetalarm und gegebenenfalls VPC-SC/CMEK;
- CDPA/DPA, Subprocessor- und Datenflussprüfung.

### Microsoft Foundry – Bedingungen für eine spätere Prüfung

- EU Data Zone Standard oder geeignete regionale Deployment-Art; kein Global Deployment für reale Daten;
- konkretes Modell und verfügbare Region;
- Modified Abuse Monitoring beziehungsweise Datenprüfpfad geklärt;
- Azure DPA, Tenant, Subscription, Entra-Rollen und Netzwerkmodell;
- Calculator-Export mit Pay-as-you-go-, Logging- und Nebenkosten;
- Entscheidung, ob Azure strategischer Plattformstandard werden soll – nicht nur AI-Provider.

### Anthropic Direct – offene Hürde

Anthropic dokumentiert aktuell nur `us` oder `global` für direkte Inferenz, während Workspace-Speicherung US-basiert bleibt. Damit ist Direct API für den späteren AMAVIO-Real-Datenpfad nur vertretbar, wenn ein individuelles Vertragswerk einen passenden EU-Datenmodus belegt. Ein synthetischer Qualitätsbenchmark allein löst diese Hürde nicht.

## 6. Rechtliche Produktgrenze

Diese Bewertung ist technische und produktstrategische Orientierung, keine Rechtsberatung.

- AMAVIO bleibt Verantwortlicher für Zweck, Rechtsgrundlage, Transparenz, Datenminimierung und Betroffenenrechte; ein DPA des Providers ersetzt diese Pflichten nicht.
- Eine Datenschutz-Folgenabschätzung ist vor einer Verarbeitung erforderlich, die voraussichtlich ein hohes Risiko für Rechte und Freiheiten erzeugt. Für Arbeitnehmer-/Integrationskontexte sollte die DSFA-Vorprüfung deshalb bereits vor dem ersten Real-Datenpiloten erfolgen.
- Die DSGVO schützt vor ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung. Das aktuelle Human Gate bleibt technisch und fachlich verpflichtend.
- AI-Systeme für Beschäftigung und Arbeitnehmermanagement können nach dem EU AI Act Hochrisiko sein. Assistive Zusammenfassung ohne Personenbewertung reduziert das Risiko, ersetzt aber keine Prüfung des konkreten `intended purpose`.
- Gate 02 darf deshalb keine Auswahl, Eignungsbewertung, Leistungsbewertung, Verhaltensanalyse, automatische Priorisierung einer Person, Zugangsentscheidung oder Arbeitsbedingungsentscheidung enthalten.

## 7. Empfohlener Entscheidungsweg

### Stufe A – jetzt, ohne Provideraktivierung

1. Founder bestätigt den bevorzugten Finalisten oder ordnet einen engen Vertrags-Precheck für beide Finalisten an.
2. Für den ausgewählten Anbieter werden DPA, ZDR/Retention, Training, EU-Endpoint, Modellverfügbarkeit und Kostenlimit als **belegte Kontoeinstellungen oder Vertragsunterlagen** geprüft.
3. Erst danach wird genau **ein** Provider für Gate 02 benannt.

### Stufe B – kontrollierter synthetischer Gate-02-Test

Empfohlene Testgröße: 24 synthetische Fälle × drei kontrollierte Varianten = 72 Läufe. Ein Budgetlimit von **maximal 25 USD netto** wäre dafür sehr konservativ; es wird erst nach Founder-Freigabe eingerichtet und nicht aus diesem Dokument abgeleitet.

Bewertung je Lauf:

- JSON-Schema gültig: ja/nein;
- alle Aussagen durch mitgelieferte Evidenz gedeckt: Anteil in Prozent;
- erfundene Fakten oder Personen: Anzahl;
- verbotene Aktion vorgeschlagen: ja/nein;
- Unsicherheit korrekt sichtbar: ja/nein;
- deutscher Fachtext klar und umsetzbar: 1–5;
- Latenz und Timeout;
- Input-, Output- und Gesamttoken;
- tatsächliche Kosten;
- menschliche Annahme, Korrektur oder Zurückweisung;
- Fallback funktioniert bei Timeout, 429, 5xx, ungültigem JSON und Prompt Injection.

### Stufe C – eigener späterer Real-Daten-Gate

Ein erfolgreiches synthetisches Ergebnis erlaubt **nicht** automatisch reale Daten. Dafür bleiben mindestens offen:

- Zweck und Rechtsgrundlage;
- DSFA-Vorprüfung beziehungsweise DSFA;
- Verzeichnis der Verarbeitungstätigkeiten;
- DPA/AVV- und Subprocessor-Prüfung;
- Lösch- und Auskunftsprozess;
- Security-/Threat-Modell;
- Authentifizierung, Mandantentrennung und Berechtigungen;
- Betriebs-, Incident- und Supportmodell;
- gesonderte Founder- und gegebenenfalls Rechts-/Datenschutzfreigabe.

## 8. Founder-Entscheidungsvorlage

Noch **nicht** ausfüllen, bevor die offenen Kontonachweise vorliegen:

> Freigegeben ist `GATE-02-EXTERNAL-ASSISTANCE-SANDBOX` mit **[Provider]**, Modell **[Modell-ID/Snapshot]**, ausschließlich über **[EU-Endpoint]**, im dokumentierten **[ZDR/Retention-Modus]**, mit deaktivierter Trainingsnutzung und einem Hard Limit von **[Betrag] USD netto**. Verarbeitet werden ausschließlich die versionierten synthetischen Gate-02-Fixtures. Jede Ausgabe bleibt ein validierter Vorschlag mit wirksamer menschlicher Prüfung. Reale Daten, produktive Registrierung, Live-Nachrichten, Buchungen, Personenprognosen, automatische Entscheidungen, Hosting und Veröffentlichung bleiben ausgeschlossen.

## 9. Quellen – nur Primärquellen

### Mistral

- [Regional inference – EU-Endpunkt und 10-%-Aufschlag](https://docs.mistral.ai/inference/regional-inference)
- [Zero data retention](https://docs.mistral.ai/admin/monitor-comply/zero-data-retention)
- [API-Preise](https://docs.mistral.ai/inference/pricing)
- [EU-Hosting und mögliche temporäre Transfers](https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data)
- [Commercial Terms – Training und Preview-/Labs-Ausnahme](https://legal.mistral.ai/terms/commercial-terms-of-service/)
- [Data Processing Addendum](https://legal.mistral.ai/terms/data-processing-addendum/)

### OpenAI

- [Data Controls – Training, Retention, ZDR und EU Data Residency](https://developers.openai.com/api/docs/guides/your-data)
- [API-Preise und EU-Aufschlag](https://developers.openai.com/api/docs/pricing)
- [Aktuelle Modellübersicht](https://developers.openai.com/api/docs/models/compare)
- [Data Processing Addendum](https://openai.com/policies/data-processing-addendum/)
- [Security and Privacy](https://openai.com/security-and-privacy/)

### Google Cloud

- [Vertex AI und Zero Data Retention](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention)
- [Generative-AI-Preise](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Vertex AI Security Controls](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/security-controls)
- [Google Cloud Data Residency Services](https://cloud.google.com/terms/data-residency)

### Microsoft

- [Foundry Deployment Types und EU Data Zone](https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types)
- [Daten, Datenschutz und Sicherheit für Foundry Models](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy)
- [Azure OpenAI Service Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/)

### Anthropic

- [Data Residency](https://platform.claude.com/docs/en/manage-claude/data-residency)
- [Serverstandorte und US-Speicherung](https://privacy.anthropic.com/en/articles/7996890-where-are-your-servers-located-do-you-host-your-models-on-eu-servers)
- [API- und Datenaufbewahrung](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- [Training kommerzieller Daten](https://privacy.anthropic.com/en/articles/7996868-is-my-data-used-for-model-training)
- [DPA mit SCC](https://privacy.anthropic.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa)
- [Aktuelle Claude-Preise](https://platform.claude.com/docs/en/about-claude/pricing)

### EU-Rechtsrahmen

- [DSGVO – insbesondere Art. 22 und Art. 35](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679)
- [EDPB – Datenschutz-Folgenabschätzung](https://www.edpb.europa.eu/topics/accountability-and-compliance-tools/data-protection-impact-assessment_en)
- [EU-Kommission – AI Act und Hochrisiko-Einsatzbereiche](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)

## 10. Offene Punkte, die öffentliche Quellen nicht ersetzen

- konkrete ZDR-/Retention-Freischaltung im künftigen AMAVIO-Konto;
- genaue juristische Vertragspartei und anwendbare Vertragsversion;
- aktuelle Subprocessor-Liste am Tag der Aktivierung;
- tatsächliche Modellverfügbarkeit am EU-Endpunkt;
- Rate Limits des konkreten Kontos;
- Support- und Incident-Verpflichtungen;
- Netto-/Bruttoabrechnung, Wechselkurs und Umsatzsteuer;
- Modellqualität im AMAVIO-Schema;
- Datenschutz-/Rechtsprüfung vor jedem Real-Daten-Einsatz.
