# AMAVIO Working System v1

Datum: 2026-07-30

## Ziel

AMAVIO-Unterlagen und Website bis zur finalen Abgabe hochwertig, prüferfest, visuell überzeugend und konsistent fertigstellen.

## Priorität A – Muss perfekt sein

1. Businessplan
   - Langfassung vollständig und konsistent
   - zusätzlich prüfen, ob eine kompaktere Prüferfassung sinnvoll ist
   - Finanzmodell v1.8 bleibt die führende Finanzquelle
   - Tabellen reduzieren, verdichten oder in Anhänge verlagern
   - stärker editorial: Kapitelauftakte, Entscheidungsboxen, Diagramme, Timeline

2. Website
   - keine Starter-/KI-Baukastenoptik
   - cinematic, warm, hochwertig, professionell
   - Navy/Gold/Creme statt Petrol/Sage/Grün
   - Motion, Video, starke Bildsprache und saubere responsive QA

3. Investor Pitch
   - vorhandene Deck-Logik erhalten
   - visuell später an Website-System angleichen
   - klare Investorenstory: Risiko reduziert, Delivery bewiesen, Kapital wird prüfbar eingesetzt

4. Client Pitch / Employer Decision
   - Arbeitgebernutzen klarer als Produktliste
   - Fokus: arbeitsfähiger Start, weniger HR-/Operations-Reibung, klare Gates

## Priorität B – Wichtig, aber nachgeordnet

- Partner Capability Deck
- One-Pager
- Anlagenpaket
- PDF-/Word-/Deck-QA
- GitHub-Sicherung und saubere Übergabe

## Arbeitsprinzipien

- Keine finalen Dateien ohne Backup überschreiben.
- Erst Quelle bestimmen, dann ändern.
- Kleine Gates: bauen, exportieren, rendern, prüfen.
- Wenn ein Pilot nicht eindeutig besser ist, nicht ausrollen.
- Keine grünen/Sage-Farben im finalen Premium-System.
- Keine erfundenen Register-, Rechts-, Finanz- oder Objektdaten.
- Wenn externer Zugang fehlt, erst selbst prüfen, dann Benutzer nur bei echtem Blocker fragen.

## Designrichtung

Kernwirkung:

- warm
- premium
- urban
- cinematic
- menschlich
- seriös
- prüferfest

Farben:

- Navy als Autorität
- Brass/Champagne als Hauptakzent statt grellem Gold
- Copper/Rose-Gold nur sehr sparsam für Wärme und menschliche Nähe
- kühles Platin/Silber nur für technische Präzision, nicht als Leitfarbe
- Creme/Warm-Paper als Fläche
- dunkle Premiumflächen für Dramaturgie
- kein Grün/Sage als Leitsystem

Farbregel:

- Blau bleibt unverhandelbar.
- Akzente dürfen hochwertig-metallisch wirken, aber nicht billig-golden.
- Keine Corporate-Tech-Neonfarben.
- Keine grünen UI- oder Markentokens.

## Website-Media-Strategie

Higgsfield-Abo sparsam nutzen:

1. erst Shotlist und Asset-Briefs bauen
2. nur finale Prompts generieren
3. keine parallelen Varianten ohne klares Ziel
4. jedes Asset auf Textfreiheit, Anatomie, Fotorealismus, Cropping und Nutzbarkeit prüfen

Kostenarme Toolpriorität:

1. Code-first Design in Next.js
2. GSAP + ScrollTrigger für hochwertige Scroll- und Timeline-Animationen
3. Motion for React für Microinteractions und View-Transitions
4. React Three Fiber + Drei für gezielte 3D-WebGL-Szenen
5. Lenis für hochwertige Scroll-Physik
6. Higgsfield sparsam für finale Video-/Bildassets
7. Penpot nur bei Bedarf für Wireframes/Designsystem
8. Rive/Lottie nur für kleine, gezielte Microinteractions
9. Spline nur, wenn schneller 3D-Prototyp oder Web-Embed klar besser ist
10. Figma aktuell nicht erforderlich

3D-Regel:

- 3D ist ausdrücklich erwünscht, aber nur dort, wo es Premiumwirkung oder Verständnis verbessert.
- Keine beliebigen rotierenden Würfel oder generischen Tech-Objekte.
- Gute AMAVIO-3D-Motive: Architektur-/Campus-Miniatur, Ankunftspfad, Objekt-/Partnernetz, Projekt-Gates, Wohn- und Community-Zonen.
- 3D muss mobil abschaltbar oder reduziert sein, wenn Performance leidet.

## Subagent-Rollen

Subagents dürfen genutzt werden, wenn sie konkret Zeit sparen oder Risiko reduzieren.

Empfohlene Rollen:

- Source-of-Truth & QA Controller: Versionen, Exporte, Renderchecks, Dateikonsistenz
- Businessplan Editorial Architect: Prüferfassung, Kürzung, Tabellenlogik
- Financial Evidence Controller: Zahlenkonsistenz Businessplan ↔ Excel ↔ Decks
- Website Creative Technologist: Next.js, Motion, 3D, Video, Build
- Brand & Motion Director: Premiumlook, Palette, Higgsfield-Briefs, Storyboards
- Investor Pitch Strategist: Investmentlogik, Risikoreduktion, Kapitalstory
- Client/Employer Pitch Strategist: Arbeitgebernutzen, Kaufentscheidung, CTA
- Delivery & Export Engineer: finale Word/PDF/PPTX/Website-Exports

Regel:

- Subagents nicht blind vermehren.
- Jeder Agent bekommt eine enge Aufgabe und klare Dateien.
- Kritische finale Entscheidungen bleiben beim Hauptagenten.

## GitHub / Deployment

GitHub Remote:

- `https://github.com/zakiamawi/AMAVIO-Businessplan.git`

Aktueller Blocker:

- GitHub CLI ist lokal nicht eingeloggt.
- Für Push/PR muss `gh auth login` einmalig durch den Benutzer erfolgen oder Git-Auth anderweitig verfügbar sein.

Website Deployment:

- `SITE_URL` muss vor deploybarer Version als echte HTTPS-Origin gesetzt werden.
- Ohne `SITE_URL` blockt die Website Indexing.
