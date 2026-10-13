# R3.5 Kontaktentscheidung und Outreach-Preflight – Fachvertrag

**Geltung:** nur lokaler synthetischer Einzelarbeitsplatz  
**Keine Aussage:** keine Rechtsberatung, keine Datenschutzfreigabe, keine Versandfreigabe

## Kontaktentscheidung

Die Sicht „Darf kontaktiert werden?“ wertet ausschließlich dokumentierte lokale Merkmale aus:

1. aktiver Kontaktstatus und keine harte Sperre;
2. kein aktiver Eintrag in der lokalen Sperrliste;
3. Kontakt-/Rechtsstatus ist dokumentiert oder als gesondert geprüft markiert;
4. Datenherkunft, Quellenreferenz und Recherchezeitpunkt sind dokumentiert;
5. Zeitpunkt der letzten Prüfung ist dokumentiert;
6. Informationsstatus ist dokumentiert;
7. die synthetische Schutzgrenze ist erfüllt (`synthetic: true`, `.invalid`-Adresse).

Ergebniswerte:

- `blocked`: mindestens eine harte Sperre oder Verletzung der Synthetikgrenze;
- `review_required`: keine harte Sperre, aber mindestens ein Nachweis fehlt;
- `locally_ready`: alle lokalen Prüfpunkte sind dokumentiert.

Die zugehörigen Anzeigen lauten „Nein – lokal gesperrt“, „Prüfung erforderlich“ und „Nur lokal vorbereitet“. Kein Zustand erlaubt produktiven Versand.

## Outreach-Preflight

Der Preflight kombiniert die Kontaktentscheidung mit Entwurfs- und Systemmerkmalen. Zweck, Kanal, Betreff und Text müssen vorhanden sein. Eine Kanalprüfnotiz muss dokumentiert sein. Die menschliche lokale Freigabe muss separat erfolgen. Der Provideradapter muss deaktiviert bleiben oder externe Schreibwege ausdrücklich verbieten.

Der technische Vertrag setzt in jedem Ergebnis `productiveSendAllowed: false`. Auch `approved_local` ist nur ein lokaler Prüfmarker und erzeugt weder `sentAt` noch Netzwerkverkehr. Eine lokale Freigabe wird abgewiesen, wenn Kontakt oder Sperrliste blockieren oder der Kontakt-/Rechtsstatus offen ist.

## Aufgabenconversion

Jeder abgeleitete Prüfpunkt besitzt einen stabilen Schlüssel nach dem Muster `r3.5:<opportunityId>:<kind>`. Beim Anlegen entsteht eine reguläre lokale Aufgabe mit Organisation, Kontakt und Chance, Owner, Fälligkeit, Priorität, Beschreibung und Audit-Ereignis. Ein bereits vorhandener nicht archivierter Schlüssel verhindert eine zweite Aufgabe. Die Conversion führt keine Außenaktion aus.

## Herkunft und Nachvollziehbarkeit

Alle Aussagen werden deterministisch aus dem lokalen Zustand erzeugt. Es gibt keinen externen Modellaufruf, keine externe Datenübertragung und keine autonome Änderung. Der Benutzer löst die Aufgabenanlage ausdrücklich aus. Der erzeugte Text kennzeichnet die Aufgabe als lokale synthetische R3.5-Arbeit ohne freigegebene Außenwirkung.
