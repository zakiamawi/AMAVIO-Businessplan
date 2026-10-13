# AMAVIO One CRM – R3.4 Visualisierungsvertrag

**Stand:** 10.10.2026

## Grundsatz

Eine Visualisierung ist nur zulässig, wenn ihre Werte aus dem aktuellen lokalen CRM-Zustand ableitbar sind, ihre Bedeutung textlich erkennbar bleibt und jeder interaktive Teil zu einem echten Detail- oder Arbeitsbereich führt. Dekorative Datenbilder und erfundene Trends sind ausgeschlossen.

## Pipeline Movement

Der Balkenwert ist der aktuelle, nicht archivierte Chancenbestand der jeweiligen Phase. `Bewegung` zählt nur Aktivitäten vom Typ `stage_change`, deren Zusammenfassung die Zielphase dokumentiert. Es wird kein historischer Vergleich erfunden. Fehlt ein Phasenereignis, erscheint `keine Bewegung` statt einer Nulltrend-Behauptung. Verlorene Chancen werden nicht als Erfolgsphase visualisiert.

## Aging Strip

Das Alter ist die Differenz zwischen synthetischem Referenzdatum und jüngster dokumentierter Chancenaktivität; falls keine Aktivität existiert, gilt `updatedAt` beziehungsweise `createdAt`. Die vier Buckets sind 0–7, 8–14, 15–30 und mehr als 30 Tage. Archivierte, gewonnene und verlorene Chancen werden ausgeblendet.

## Entscheidungsreife

Der Prozentwert ist kein KI-Score und keine Abschlusswahrscheinlichkeit. Er zählt sechs transparente Dimensionen: dokumentierter Bedarf, Schlüsselkontakt, Entscheider, Leistungsrahmen, terminierte nächste Handlung und offene Fragen. `hoch`, `mittel` und `niedrig` sind lokale Lesestufen dieses Vollständigkeitsrasters.

## Datenvertrauen

Quelle, Aktualität, Vollständigkeit und Dublettenrisiko werden getrennt dargestellt. Farbe ist nie die einzige Information; Statuswort, Detailtext und Symbol begleiten jeden Zustand. Dublettenprüfung ist ein lokaler Namenshinweis und keine automatische Zusammenführung.

## Responsive Vertrag

Pipeline und Aging dürfen bei kleinen Breiten innerhalb ihres Moduls horizontal scrollen. Die Dokumentseite selbst darf nicht horizontal überlaufen. Alle Werte bleiben über zugängliche Namen der Schaltflächen erreichbar; eine Grafikrolle darf keine fokussierbaren Schaltflächen semantisch verschlucken.
