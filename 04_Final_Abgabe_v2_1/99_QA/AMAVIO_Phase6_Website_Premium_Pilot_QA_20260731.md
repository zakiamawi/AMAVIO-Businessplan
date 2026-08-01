# AMAVIO Phase 6 – Website Premium Pilot QA

Stand: 31. Juli 2026

## Ziel

Den ersten Website-Premiumschnitt technisch und visuell prüfen, bevor größere 3D-/Video-/Motion-Ausbaustufen folgen.

## Technische Verifikation

Nach den CSS-, SVG- und MotionReveal-Anpassungen:

- `rtk rg` auf alte Grün-/Petrol-Reste: keine Treffer
- `rtk npm run lint`: erfolgreich
- `rtk npm run build`: erfolgreich
- Next.js Build: 19 Routen
- Browser-Preview: keine Console-Warnungen oder -Fehler im geprüften Lauf
- Desktop- und Mobile-Startseite: kein horizontaler Overflow

Hinweis: `SITE_URL` ist lokal nicht gesetzt. Der Build nutzt deshalb `http://localhost:3000` und blockiert Indexing. Das ist für lokale Preview korrekt, aber nicht deployment-reif.

## Geänderte Website-Bereiche

- Premium-Farbrichtung in `src/app/globals.css` nachgeschärft:
  - stärkeres Midnight/Navy für Hero-Typografie
  - wärmeres Cream-Paper im Hintergrund
  - Champagne/Copper als Akzent
  - alte grünliche Step-Rail-Verläufe entfernt
  - mobile Chip-Leiste scrollbar, aber ohne sichtbare Billig-Scrollbar
- SVG-Platzhalter in `public/images/` von grünlich-sage auf Navy/Champagne/Platinum umgestellt.
- `MotionReveal` erweitert:
  - neuer `eager`-Modus für above-the-fold Inhalte
  - Startseiten-Hero ist jetzt sofort sichtbar und hängt nicht mehr riskant an `whileInView`.

## Browser-QA-Artefakte

Screenshots und Browser-Ergebnisdatei:

`04_Final_Abgabe_v2_1/99_QA/website_preview_checks_20260731/`

Wichtigste geprüfte Dateien:

- `desktop_home_viewport_after_eager.png`
- `mobile_home_viewport_after_eager.png`
- `browser_preview_results.json`

## Ehrlicher Designbefund

Der Stand ist jetzt als Premium-Basis brauchbar: Navy, Cream und Champagne wirken klarer, die Startseite ist lesbar, und der technische Reveal-Bug ist behoben.

Noch nicht final:

- Die Website ist visuell noch eher “eleganter Editorial-Prototyp” als “20.000-Euro-Experience”.
- Es fehlt noch ein echter Signature-Moment: 3D-/Motion-System, räumliche Objektlogik, hochwertigere Hero-Medien oder ein interaktiver Journey-Layer.
- Die aktuellen SVGs sind nur Platzhalter. Sie sind farblich bereinigt, aber noch nicht stark genug als finale Marke.
- Kontaktformular-Fehlerpfade, Tastatur/Fokus, echte Links, Pflichtdaten und Deployment-`SITE_URL` sind noch offen.

## Empfehlung für die nächste Website-Stufe

Nicht direkt überall 3D einbauen. Besser ein gezielter Signature-Pilot:

1. Startseiten-Hero als “AMAVIO Operating Path” mit räumlicher Tiefe.
2. Scroll-Sequenz: Bedarf → Wohnpfad → Einzug → 90 Tage Stabilisierung.
3. Kleine R3F/Three.js-Komponente oder CSS/Canvas-Pilot, nur wenn Performance sauber bleibt.
4. Danach Desktop/Mobile erneut screenshotten und erst dann ausweiten.
