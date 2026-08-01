# AMAVIO Website Design System

## Zielwirkung

Die Website soll wie eine hochwertige, filmische B2B-/Investor-Experience wirken: warm, urban, vertrauenswürdig, präzise und menschlich. Sie darf KI-generiert sein, aber nicht nach generischem KI-Template aussehen.

## Farbwelt

Leitfarben:

- Deep Navy `#10243E` – Autorität, Vertrauen, Managementfähigkeit
- Midnight Blue `#071523` – dunkle Premiumflächen, Hero, Abschlussmomente
- Warm Paper `#F6EFE2` – Hauptfläche statt knalligem Weiß
- Soft Cream `#FFF8EC` – Karten, leichte Panels, Textflächen
- Champagne Brass `#D6B46A` – Hauptakzent, Linien, Highlights
- Muted Copper `#B97855` – sparsame Wärme für menschliche Nähe
- Platinum Mist `#D8D4C8` – technische Präzision, feine Linien

Nicht verwenden:

- Grün
- Sage
- Petrol als Markenkern
- Neon-Tech-Farben
- kaltes Reinweiß als große Fläche

## Typografie

- Display-Schrift für große Markenmomente und Kapitel-/Hero-Titel
- Sans-Schrift für UI, Navigation, Formulare und erklärende Texte
- Headlines groß, ruhig und selbstbewusst
- Body Copy nicht zu klein, keine „Investoren-PDF in Website gepresst“-Optik

## Layoutprinzipien

- Cinematic Hero statt Standard-Landingpage
- große Bild-/Video-/3D-Flächen mit klaren Textzonen
- dunkle Dramaturgieflächen zwischen warmen Paper-Abschnitten
- weniger Kartenraster, mehr geführte Story
- Tabellenlogik auf der Website vermeiden; Prozesse visuell erzählen
- klare mobile Fallbacks für Motion und 3D

## Motion-System

Basis:

- sanfte Scroll-Reveals
- maskierte Text- und Bildübergänge
- leichte Parallax-Tiefe
- Microinteractions auf CTAs, Cards und Prozesspunkten

Erweitert:

- Scroll-synchronisierte Prozessstrecke
- 3D-Campus-/Systemszene
- Video-Layer für Hero und ausgewählte Abschnitte
- Reduced-Motion-Fallback immer beachten

## 3D-Richtung

3D soll nicht dekorativ-beliebig sein, sondern AMAVIO erklären.

Gute Motive:

- Campus-/Wohnhub-Miniatur
- Projektpfad von Bedarf zu Einzug zu 90 Tagen
- Partner-/Objektnetzwerk
- Gates: Scope, Budget, Daten, Kapazität, Change
- Plattform-Statusfläche mit subtiler Tiefe

Schlechte Motive:

- generische rotierende Würfel
- futuristische Neon-Stadt
- abstrakte Kugelwolken ohne Bezug
- übertriebene Luxus-Hotelwelt

## Toolstack

Kostenarmer Kern:

1. Next.js + Tailwind
2. Motion for React
3. Lenis
4. Three.js + React Three Fiber + Drei
5. GSAP + ScrollTrigger nur für komplexe Sequenzen
6. Higgsfield nur für vorbereitete finale Bild-/Videoassets

Optional später:

- Rive für interaktive Vektoranimationen
- Spline für schnelle 3D-Prototypen oder Embeds ohne Watermark
- Remotion für generative Videoassets, nicht als Website-Runtime
- Theatre.js nur bei sehr komplexem Timeline-Bedarf

## QA-Kriterien

Vor jeder finalen Website-Freigabe:

- Build erfolgreich
- Lint erfolgreich
- Desktop- und Mobile-Preview geprüft
- keine sichtbaren Placeholder
- keine grünen Tokens
- keine Textüberläufe
- Motion mit `prefers-reduced-motion` respektiert
- 3D darf Ladezeit und Lesbarkeit nicht ruinieren
- `SITE_URL` für Deployment gesetzt

