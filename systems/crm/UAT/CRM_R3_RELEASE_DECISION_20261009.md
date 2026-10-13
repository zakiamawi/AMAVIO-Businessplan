# AMAVIO One CRM – R3 Release Decision

**Status:** **ENTSCHEIDUNG AUSSTEHEND**  
**Aktuell maximal zulässige Aussage:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Entscheidungswege

### Weg 1 – R3 Acceptance Freeze

Voraussetzung:

- UAT vollständig durchgeführt;
- Product-Owner-Option A bestätigt;
- keine P0-/P1-Befunde offen;
- Abschlussmanifest und Prüfsummen erzeugt.

Wirkung:

- R3 wird als fachlich akzeptierter lokaler synthetischer Referenzstand eingefroren;
- spätere Änderungen benötigen eine neue Version;
- keine produktive Freigabe und keine Öffnung von Bündel C.

### Weg 2 – Begrenztes R3.1-Stabilisierungspaket

Voraussetzung:

- Product-Owner-Option B bestätigt;
- jede Änderung besitzt Findings-ID, Sollzustand und Test;
- keine neue Capability und keine Bündel-C-Berührung.

Wirkung:

- genau ein gebündelter Korrekturlauf;
- danach erneute gezielte UAT und Freeze-Entscheidung.

### Weg 3 – UAT zurückgestellt

Voraussetzung:

- Product-Owner-Option C oder keine ausdrückliche Entscheidung.

Wirkung:

- technischer R3-Stand bleibt QA-bestanden, aber fachlich nicht abgenommen;
- keine Erweiterung, kein Freeze als akzeptierter Stand und kein produktiver Folgeauftrag.

## Bündel-C-Folgeentscheidung

Ein späteres R4 darf erst nach R3-Acceptance separat vorgeschlagen werden. Selbst dann bleibt jede produktive Fähigkeit einzeln gesperrt, bis sie ausdrücklich geöffnet wird. Aus dieser Release-Entscheidung entsteht keine stillschweigende Freigabe.
