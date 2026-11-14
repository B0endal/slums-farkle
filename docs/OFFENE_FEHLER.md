# Offene Fehler und Änderungswünsche (Sammlung während des Tests)
Stand 14.11.2026, Version Cache v11. Wird nach Testende gesammelt abgearbeitet. Nichts davon ist bisher geändert.

## 1. Vier Einsen werden mit 2000 statt 1100 gewertet
- **Beobachtet (Nutzer, iPhone):** Vier Würfel mit Wert 1 bringen 2000 Punkte.
- **Erwartet:** 1100 Punkte (Drilling aus Einsen 1000 + einzelne 1 mit 100).
- **Engine-Prüfung (`scoreSelection`, Okkult-Faktor 1, nur Standardwürfel):** 1111 ergibt 1100. Die Engine ist in diesem Fall korrekt, ebenso 111 = 1000 und 11111 = 2000. Die Ursache liegt also vermutlich nicht in der reinen Wertungsregel.
- **Zu prüfen:**
  - Waren Würfel mit Multiplikator beteiligt (Goldener Würfel `totalMult`, Okkult-Faktor ab einem okkulten Würfel, Signaturwürfel „Wucht“ oder „Zwillingswürfel“)? Dann wären 2000 gewollt, aber für den Spieler nicht nachvollziehbar.
  - Zeigt die Vorschau im Duell den gleichen Wert wie die Gutschrift?
  - Wirkt der Stern (Joker, beliebige Augenzahl) in der Wertungsvorschau wie ein weiterer Würfel?
  - Gleichmäßige Spielregeln: Fünf gleiche = 2000, deshalb Verdacht auf Fehlzuordnung bei vier Würfeln plus Hot-Dice-Folgewurf.
- **Nächster Schritt:** Spielstand oder genaue Würfelzusammenstellung des Nutzers erfragen und per Test nachstellen, danach in Engine und Tests (`engine.test.js`) einen Fall ergänzen.

## 2. Wachwechsel-Quest (erledigt, Cache v12)
- Texte neu: Die Tagwache hat die Nachtwache im Farkle vernichtet und prahlt damit. Die Nachtwache bittet den Spieler, die Tagwache zu schlagen und ihr danach zu erzählen, er habe gegen die Nachtwache verloren.
- Neue Entscheidung nach dem Sieg über die Tagwache: Lüge (Wohlwollen der Nachtwache, Tor abends und nachts) oder Verrat (Wohlwollen der Tagwache, Tor tagsüber). Quest-Item `wohlwollen_tagwache` ist neu. `G.quest.wachwechsel`: 1,5 = Entscheidung offen (wird nach Neuladen wieder angeboten), 2 = Lüge, 3 = Verrat.

## 3. Karten-Tab (erledigt, Cache v12, wartet auf Abnahme)
- Neuer Reiter „Karte“ vor „Ort“. Zeigt bekannte Orte mit Verbindungen (Nebel: besucht oder Nachbar eines besuchten Ortes), Tippen zeigt Beschreibung, Wachendruck, Anforderungen und Weg. Reisen per Knopf in der Beschreibung. Der Tab „Ort“ bleibt unverändert bis zur Abnahme.
- Neu im Spielstand: `G.vis` (besuchte Orte).

## Vorlage für weitere Einträge
- **Beobachtet:** …
- **Erwartet:** …
- **Zu prüfen:** …
