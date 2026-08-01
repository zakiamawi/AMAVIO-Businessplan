# AMAVIO Website Toolchain & Subscription Decision v1

Datum: 2026-07-30

## Ziel

Eine Website erzeugen, die wie eine hochpreisige Agenturarbeit wirkt, aber mit möglichst wenig externen Kosten entsteht.

## Klare Empfehlung

Jetzt keine neuen Abos kaufen außer bereits vorhandenem Higgsfield.

Erst kostenlos/code-first bauen. Danach nur gezielt kaufen, wenn ein konkreter Engpass entsteht.

## Kernstack – sofort nutzen

| Tool | Zweck | Kosten | Entscheidung |
|---|---|---:|---|
| Next.js | Website-Framework | bereits vorhanden | nutzen |
| Tailwind CSS | Layout/Styling | kostenlos | nutzen |
| Motion for React | Microinteractions, Reveals | kostenlos / OSS | installieren und nutzen |
| Lenis | Smooth Scroll, hochwertiges Scrollgefühl | kostenlos / OSS | installieren und nutzen |
| Three.js | 3D/WebGL-Basis | kostenlos / OSS | nutzen |
| React Three Fiber | React-Integration für Three.js | kostenlos / OSS | nutzen |
| Drei | fertige R3F-Helfer | kostenlos / OSS | nutzen |
| GSAP + ScrollTrigger | komplexe Scrollsequenzen | seit 2025/2026 für Web kostenlos | gezielt nutzen |

## Kostenpflichtig nur bei Bedarf

### Higgsfield

Status:

- Abo vorhanden, aber begrenzt.

Empfehlung:

- nutzen, aber nur mit fertiger Shotlist und finalen Prompts.
- Keine spontanen Variantenorgien.

Priorität:

- Hero Video
- Community/Arrival Clip
- Plattform/Process Clip
- ggf. Social/OG Visual

### Penpot

Kosten:

- Professional Plan kostenlos.

Empfehlung:

- kein Abo nötig.
- Nur nutzen, wenn wir Wireframes oder Designsystem visuell auslagern wollen.

### Spline

Kosten:

- Free möglich, aber Web-Exports mit Watermark.
- Starter ca. $12/Monat jährlich bzw. ca. $15 monatlich.

Empfehlung:

- noch nicht buchen.
- Erst prüfen, ob React Three Fiber reicht.
- Buchen nur, wenn wir eine Spline-Szene schneller/besser ohne Watermark brauchen.

### Rive

Kosten:

- Free zum Lernen.
- Cadet ca. $9/Seat/Monat zum Shippen.

Empfehlung:

- noch nicht buchen.
- Nur sinnvoll, wenn wir interaktive Vektor-/State-Machine-Animationen wirklich brauchen.

### LottieFiles

Kosten:

- Free limitiert, öffentliche Downloads begrenzt.

Empfehlung:

- kein Abo.
- Nur einzelne kostenlose Animationen prüfen, Lizenz je Asset kontrollieren.

### Remotion

Kosten:

- für Einzelpersonen / sehr kleine Teams frei nutzbar; größere kommerzielle Nutzung lizenzpflichtig.

Empfehlung:

- nicht für Website-Runtime.
- Später optional für generative Videoassets oder Deck-/Website-Clips.

### Theatre.js

Kosten:

- Core OSS, Studio mit AGPL-Thema im Dev-Kontext.

Empfehlung:

- nicht jetzt.
- Zu komplex für erste Website-Premiumphase.

## Nicht empfohlen

- Figma-Abo aktuell nicht nötig.
- Webflow-Abo nicht nötig, weil wir bereits eine Next.js-Codebasis haben.
- Spline AI Add-on nicht nötig.
- Stockvideo-Abo nicht nötig vor Higgsfield-Shotlist.

## Geplanter Website-Stack für AMAVIO

1. Next.js + Tailwind als Basis
2. Motion for React für UI- und Textbewegung
3. Lenis für Scrollgefühl
4. React Three Fiber + Drei für Hero-/Key-3D
5. GSAP nur für komplexe Scroll-Choreografie
6. Higgsfield für wenige hochwertige Video-/Bildassets
7. Penpot optional für visuelle Skizzen

## Risiko- und Performance-Regeln

- 3D nur in 1–2 Schlüsselbereichen.
- Mobile Fallback ohne schwere WebGL-Szene.
- `prefers-reduced-motion` respektieren.
- Video als WebM/MP4 optimieren und nicht riesig einbetten.
- Keine Abhängigkeiten installieren, die nur Deko liefern.

