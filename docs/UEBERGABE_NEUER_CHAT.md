# Übergabe für einen neuen Chat: Farkle-Roguelite „Der Weg aus den Slums"
Stand: 13.11.2026, Version „Story" (Service-Worker-Cache slums-v7). Sprache im Projekt und im Chat: Deutsch.

## Startnachricht für den neuen Chat (kopieren)
„Ich entwickle das Farkle-Roguelite ‚Der Weg aus den Slums' (Browserspiel, Vanilla-JS, PWA, mobil zuerst). Lies die angehängte UEBERGABE_NEUER_CHAT.md und die Projektdateien (farkle_projekt.zip, entpacken). Der Stand ist fertig bis einschließlich Story-Strängen. Nächster Schritt: Test auf dem iPhone auswerten und die offenen Punkte aus Abschnitt 8 abarbeiten. Arbeite eigenständig, melde dich nur bei Entscheidungen, die ich treffen muss, und halte Antworten kurz (ich lese auf dem Handy)."

## 0. Update 14.11.2026
Das Projekt liegt auf GitHub (B0endal/slums-farkle, Pages aktiv). Ein neuer Chat klont das Repo statt das Zip zu nutzen. Pfade: Simulationen in tools/sim/, Doku in docs/. gen_data.py ist entfernt (dice.json ist die Quelle). Die iPhone-Checkliste ist vollständig bestanden (docs/CHECKLISTE_iPhone.md). Dateiliste in Abschnitt 2 ist entsprechend zu lesen.

## 1. Links und Dokumente
- Spielversion (Claude-Seite, privat): https://claude.ai/artifact/1VzZ2jh5uMTTGghkuUGDpw (Slug 040c4b1b-7d7e-46ed-98ee-d7ed73aeabd4, letzte Version 1794603982-693d). Neu veröffentlichen mit publish_files (slug, base_version = letzte Version, nur index.html).
- Spezifikation v3 (Welt, Regeln, final): https://claude.ai/artifact/2vzb2c12mv3fzYeVpY8Bcd
- Spezifikation v4 (Änderungen, Sound/Animationen, Abnahme, Backlog): https://claude.ai/artifact/7F6RwK3c56U4D6kgnnZvUT. Noch nicht enthalten: Höhlensystem, Story-Stränge, Kompendium im Duell (siehe Abschnitt 8).
- Weitere Dateien im Projekt: UEBERGABE.md (ausführliches Verlaufsprotokoll), balancing_ergebnisse.md, Farkle_Roguelite_Spezifikation_v2.xlsx (Würfel-Matrix, zwei Blätter veraltet).

## 2. Dateien und Aufbau (Ordner farkle/)
- engine.js: reine Logik (UMD): Wertung, Hot Dice, Okkult-Faktor (min(Deckel, 0,5 × Anzahl okkulter Würfel), Deckel 3, mit Okkult-Set 4 über setOccultMax), KI-Profile (vorsichtig, ausgewogen, risikofreudig, jaeger), simulateDuel, Sicherheitsstufen (samplesNeeded, confidenceLevel).
- engine.test.js: 24 Tests (`node engine.test.js`).
- dice.json: 124 Würfel (standard, beschaedigt, gezinkt, golden, okkult, signatur). Signaturwürfel haben fixedName: sig_gilde, sig_asche, sig_s1 (Fortunato), sig_s2 (Wucht), sig_s3 (Zwillingswürfel).
- dicenames.js: Namen aus Seed. Signaturwürfel sind ausgenommen (dname liefert fixedName).
- game.src.html: die gesamte Spiellogik und Oberfläche. build.py setzt daraus index.html zusammen (Engine, Namen, Würfel eingebettet, HTML-Kopf, Manifest- und Apple-Tags, SW-Registrierung nur über http/https).
- sw.js (Service Worker, Network-first, Cache slums-v7, bei jedem Release hochzählen), manifest.webmanifest, icons/.
- sim.js bis sim5.js: Balancing-Simulationen (sim5 enthält Höhlen-Gruppen 7a bis 7g). gen_data.py: erzeugt Daten aus der Tabelle.
- Auslieferung: index.html allein reicht zum Spielen. Für die Installation als App (Home-Bildschirm, offline) müssen index.html, sw.js, manifest.webmanifest und icons/ zusammen auf einer https-Adresse liegen (z. B. Netlify Drop). Aus der Dateien-App oder als Claude-Seite lässt sich nur spielen, nicht installieren.

## 3. Zustand und Speicher
- localStorage-Schlüssel farkle-proto-v1: { P, G, uidSeq }. P bleibt über Läufe (seed, names, comp = Kompendium, unlocks, qitems, settings, achievements). G ist der Lauf (G.v === 2): Tag, Zeit, Silber, Ort, Wachendruck je Ort, inv/active (Würfel), npcs (Budget, Pool, out, respawn), duel (wird mitgespeichert, Neuladen setzt fort), quest, items, shop, shop2, rare, spy, st (Story-Fortschritt), flags, disc, roam.
- migrate() ergänzt fehlende Felder alter Spielstände. Export- und Importcode unter „Mehr“.

## 4. Spielwelt (Kurzfassung)
- 20 Orte plus Höhlen (tunnel1 Spähgang, tunnel2 Lagerhöhle, tunnel3 Kriegskammer, generalsaal) und 88 NPCs nach Spezifikation v3. Poolgruppen 1 bis 5, 6a bis 6c (Ruine), 7a bis 7c und 7g (Höhlen), U (Würfelmacher, fester Pool). Seltene Würfel: Hauptwelt höchstens 2 Golden und 4 Okkulte je Lauf, Höhlen und Story-NPCs haben eigene Vorräte (nie doppelt, gemeinsames R.used).
- Sperren: Slums↔Kanalisation braucht Schlüssel (Gorm, 500), Stadttor↔Markt nachts mit Wachwechsel-Quest oder Gunst, Markt↔Schlosstor Adelskleidung. Kleidung: Fiora (200 / 2000). Händler und Schwarzmarkt nur in der Gasse, 3 Würfel täglich.
- Wachendruck: +1 je Duell am Ort, Weiterreisen −5, Zurück +3, gefasst ab 10 (13 bei Strang „Faule Wache: erpressen“). In den Höhlen kein Wachendruck.
- Frühphase: Startsilber 30 (+20 mit Starthilfe), Slums-NPCs würfeln mit 5 Würfeln, bis sie einen Würfel von dir gewinnen.
- Höhlensystem: ein zufälliger generischer Kneipengast (G.spy) ist der Spion. Letztes Duell gegen ihn öffnet den Zugang in der Inneren Kanalisation. Je Raum 5 Gegner (müssen alle besiegt werden, sie betrinken sich statt zu fliehen), danach General Kharzul Eisenhand. Sieg öffnet den Ausgang zur Aue und gibt den Erfolg „Held der Stadt“.
- Neun Story-Stränge (game.src.html, Abschnitt „Story-Stränge“, Daten in STORIES und STORY_NPCS): Aschenkreis, Gildenbund, Salzbrüder, Silberne Siegel, Dornenbrüder, blinder Würfelmacher, Bettlerkönig, Faule Wache, Rache der Vorhut. Schrittarten ev: win, final, arrive, choice, act (mit btn). Neuen Strang anlegen heißt: Eintrag in STORIES, bei Bedarf Einträge in STORY_NPCS, Texte in say. Erfolge in ACH.

## 5. Bedienung (Stand)
Gewählte Würfel sind grün mit Haken markiert. Würfelinfo per Langdruck (450 ms) auf einen Würfel oder Tipp auf seinen Namen, auch beim Händler (Knopf „Info“). Kompendium ist im Duell erreichbar, der Knopf „Gegner“ im Duellkopf zeigt die Würfel des Gegners mit eigenen Messwerten. Eigener Name, Favorit und Sterne erscheinen überall, wo der Würfel steht. Sound und „Ruhige Darstellung“ unter „Mehr“.

## 6. Test und Release (Ablauf)
1. `node engine.test.js` (24 Tests).
2. `python3 build.py` erzeugt index.html.
3. Browser-Tests mit Playwright (Python, headless), Muster siehe unten.
4. sw.js: Cache-Namen hochzählen.
5. Veröffentlichen: publish_files (slug, base_version, files [index.html]). Zip für die App-Installation: index.html, sw.js, manifest.webmanifest, icons.
Testmuster: Seite laden, localStorage leeren, neu laden, `closeSheet()`, dann per `page.evaluate` Zustand setzen (`G.loc='…'; render()`), Duelle mit `endDuel(true)` und gesetztem `G.duel` simulieren, Story über `storyArrive(...)` auslösen. Stolpersteine: Überlagerndes Sheet blockiert Klicks (vorher `closeSheet()`); `rng` nie dauerhaft auf eine Konstante setzen, sonst hängt newRun in einer Endlosschleife; Hinweis-Texte (`hint`) in STORIES als Funktion schreiben, wenn sie G lesen, weil STORIES beim Laden ausgewertet wird.

## 7. Entscheidungen des Nutzers (nicht ändern ohne Rückfrage)
- Okkult-Faktor gedeckelt (×3, mit Set ×4). Okkulte bleiben selten.
- Startsilber 30, Slums-Gegner mit 5 Würfeln.
- Höhlen: Gegner verschwinden nicht, sie betrinken sich. Endgegner steht über den bisherigen Gegnern. Ausgang führt zur Aue, Erfolg „Held der Stadt“.
- Alle neun Story-Stränge werden umgesetzt (erledigt). Weitere Gruppen und Parteien sind ausdrücklich willkommen.
- Der Nutzer liest auf dem iPhone: kurze Antworten, Ergebnis zuerst.

## 8. Offene Punkte
1. Test auf einem echten iPhone (Checkliste in Spezifikation v4, Abschnitt 4: Home-Bildschirm, Offline, Safe Areas, Tippflächen, Ton, Langdruck, Neuladen im Duell, Export/Import, Tutorial). Fehler daraus beheben.
2. Spezifikation v4 ergänzen: Höhlensystem, Story-Stränge, Würfelinfo und Kompendium im Duell, Signaturwürfel, neue Erfolge. Alt-Hinweise in v3 nachziehen (Startsilber 30, 5-Würfel-Gegner).
3. Balancing der Story-Gegner und Belohnungen in echten Läufen prüfen (Simulation gibt nur Anhaltspunkte: Standardbeutel gewinnen gegen Höhle 3 etwa 40 %, gegen den General etwa 25 %).
4. Prüfen: Texte und Dialoge der Stränge auf Ton und Stimmigkeit lesen, Hinweise im Karten-Tab verständlicher machen, falls Spieler Strangbeginne übersehen.
5. Backlog: Aue als eigenes Gebiet mit festen NPCs, Kategorien Edel/Exklusiv/Verflucht, Schwierigkeitsstufen und täglicher Seed, weitere Stränge.
6. Hinweis: Die Tabelle Farkle_Roguelite_Spezifikation_v2.xlsx hat veraltete Blätter „Map & Orts-Matrix“ und „Gegner & KI-Parameter“.
