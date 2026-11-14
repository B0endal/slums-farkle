# Übergabe: Farkle Roguelite „Der Weg aus den Slums"
Stand: 13.11.2026. Sprache: Deutsch.

## Was existiert
- Spezifikation v3 (Claude-Dokument, Titel „Farkle Roguelite – Spezifikation v3 (final)"), alle Regeln beschlossen.
- Tabelle Farkle_Roguelite_Spezifikation_v2.xlsx: bereinigte Würfel-Matrix (119 Würfel), Blätter Würfelnamen und Namen Beispiel-Seed. Die Blätter „Map & Orts-Matrix" und „Gegner & KI-Parameter" sind noch alt (maßgeblich ist die Spezifikation).
- Prototyp (Artifact „Der Weg aus den Slums"): Duell, 5 Orte, Tasche mit Statistik, Kompendium, Namen aus Seed.
- Dateien in diesem Ordner: engine.js (reine Logik), engine.test.js (24 Tests), dice.json (aus Tabelle), dicenames.js (Seed-Namen), game.src.html + build.py -> index.html, sim.js und sim2.js (Balancing), balancing_ergebnisse.md.

## Beschlossene Regelpunkte (Auszug)
Einzelne 1 = 100, 5 = 50. Drilling 1er 1000, 2er 200 bis 6er 600. Vier/fünf/sechs gleiche 1000/2000/3000. Teilstraße 1-5 und 2-6 je 750. Straße 1500. Drei Paare 1500, Doppel-Drilling 2500, Vierling plus Paar 1500. Beste Aufteilung zählt. Okkult-Faktor 0,5 x N okkulte Würfel in der aktiven Tasche, multipliziert je okkultem Würfel in der Kombination. Faktor gedeckelt auf höchstens ×3 (engine.js, OCCULT_FACTOR_MAX; 22 Tests grün, index.html neu gebaut). Instant-Sieg beim Abschicken, Spieler beginnt.

## Entschieden
- Balancing: bleibt wie gemessen. Okkulte sind selten, Faktor-Deckel ×3 reicht.

## Stand Schritt 2 (Welt), Prototyp index.html, nach Spezifikation v3
Fertig: 20 Orte und 88 NPCs (Abschnitte 4 und 13.2, Verbindungen beidseitig geprüft), Poolgruppen 1 bis 6c (13.5) mit Obergrenzen und Einmaligkeit seltener Würfel (im Test über 400 Läufe: Ø 1,3 Golden, Ø 3,4 Okkulte, nie mehr als 2 und 4, keine Doppelten), Tag- und Nachtwache wechseln mit der Tageszeit zwischen Kneipe und Stadttor, Quest „Wachwechsel“ mit Quest-Item „Wohlwollen der Nachtwache“, äußeres Tor (nachmittags und nachts nach Quest oder Item), inneres Tor (Adelskleidung), Kanalisationsschlüssel (Gorm, 500), Kleiderhändlerin Fiora (200 und 2000, Duell-Bedingung für Marktplatz, Gildeviertel, Gasthof und Schloss), Händler in der Gasse (kauft für 50 %, 3 Tageswürfel) und Schwarzmarkt (Unlock durch Gretel, bleibt über Runs), Weg des Gerechten am Stadttor, Final-Offer-Slot wird beim Respawn neu ausgelost, Busted behält Unlocks und Quest-Items. Der frühere Rückkauf verlorener Würfel und der Passierschein sind entfernt (stehen nicht in der Spezifikation).
Annahmen, bitte prüfen: KI-Profile der Wachen (ausgewogen), von Dorf, Aue und Stadttor und der Ruinen-NPCs (Gast risikofreudig, Beschwörer und Meister jäger); Gezinkt-Stufen und Obergrenze in den Gruppen 6a bis 6c (in der Spezifikation nicht genannt); Aufteilung D zu Q im Händlerangebot (26 zu 9 Prozent); Dorf, Aue und Ruine sind frei erreichbar, die Ruine-Story fehlt noch (Backlog). Adelskleidung zählt auch als Bürgerkleidung.
Dialoge: kleines Dialogsystem (DIALOGS in game.src.html, als Sheet statt eigener #dialog-view) mit Wache am Stadttor (Hinweise je nach Queststand, Stellen mit Bestätigung), betrunkene Wache in der Kneipe, Fiora, Gorm, Rattenschnauze und Quest-Texte nach den Siegen (Nachtwache, Tagwache, Gretel). Alle Texte sind von mir geschrieben und können frei geändert werden.
Offen: Kompendium-Sicherheitsstufen, Gilden-Rang und Okkult-Set (Backlog), Aue-NPCs (Backlog), Schritt 3 und 4.

## Stand Schritt 3 (Meta), nach Spezifikation Abschnitt 12
Fertig: Kompendium je Würfel mit seen, Würfe, Zähler je Seite, eigenem Namen, Favorit, Priorität (0 bis 3 Sterne) und eigener Gruppe, dazu Filter (Alle, Favoriten, je Gruppe) und Sortierung (Würfe, Priorität, Name). Sicherheitsstufe je Seite und gesamt (unklar, Tendenz, wahrscheinlich, gesichert) nach n = 1,96² · (1 − p) / (p · 0,05²) als reine Funktion in engine.js (confidenceLevel, samplesNeeded) mit Tests (24 grün). Das Kompendium zeigt nur Namen und Messwerte, nie die Kategorie. Gesehen werden Würfel im Besitz, im Händlerangebot und beim Würfeln. Freischaltungen und Quests stehen unter „Mehr“. Alles bleibt über Runs, Neuladen und Export/Import erhalten.
Annahmen: Schwellen der Stufen (Verhältnis gemessene Würfe zu Richtwert: unter 0,15 unklar, unter 0,5 Tendenz, unter 1 wahrscheinlich, ab 1 gesichert); nie gewürfelte Seiten (zum Beispiel defekte Seite) werden ab 500, 2000 und 7700 Würfen als Tendenz, wahrscheinlich und gesichert gewertet; die Priorität ist eine Sternskala von 0 bis 3.

## Stand Schritt 4 und 5 (Politur, Balancing der Welt)
Fertig: PWA (manifest.webmanifest, sw.js mit Offline-Cache, Icons im Ordner icons, build.py setzt den vollständigen HTML-Kopf mit Apple-Tags und registriert den Service Worker nur über http/https; getestet mit lokalem Server inklusive Neuladen ohne Netz), Tutorial (7 Schritte beim ersten Start, wiederholbar unter „Mehr“), Weltsimulation sim3.js, Ergebnisse und Stellschrauben in balancing_ergebnisse.md (Teil 2).
Offen: Entscheidung zu den Stellschrauben (siehe balancing_ergebnisse.md), Test auf einem echten iPhone (Home-Bildschirm, Offline), Sound und Animationen.

## Entscheidung Frühphase (umgesetzt)
Startsilber 30 und Slums-Gegner mit 5 Würfeln (6, sobald sie einen Würfel von dir gewinnen). Die Spezifikation v3 nennt noch 20 Silber (Abschnitte 1, 8 und 11) und 6 Würfel je Pool, dort bitte nachziehen. Messung in balancing_ergebnisse.md, Teil 3.

## Stand Sound, Animationen, Duell-Persistenz (fertig)
Sound (Web Audio, synthetisiert, keine Dateien) und Animationen (CSS) mit Schaltern „Sound“ und „Ruhige Darstellung“ unter „Mehr“, prefers-reduced-motion wird beachtet. Das laufende Duell wird bei jedem Speichern mitgesichert; nach Neuladen geht es am selben Punkt weiter, ein Gegnerzug wird fortgesetzt. Service-Worker-Cache: slums-v4. Details und Abnahmeliste: Spezifikation v4 (https://claude.ai/artifact/7F6RwK3c56U4D6kgnnZvUT).

## Stand Höhlensystem (Endspiel, fertig)
Ein zufälliger generischer Gast der Kneipe (G.spy, nie der Wirt) ist der Spion der Vorhut. Wer ihn im letzten Duell (Einsatzwürfel) schlägt, erfährt vom Höhlensystem; der Zugang erscheint in der Inneren Kanalisation (G.quest.tunnel = 1). Vier Orte: Spähgang, Lagerhöhle, Kriegskammer (je 5 Gegner, Gruppen 7a bis 7c, Ziele 6500 / 8000 / 9000) und Hohlsaal des Generals (General Kharzul Eisenhand, Gruppe 7g, Ziel 10000). Ein Raum öffnet den nächsten erst, wenn alle Gegner besiegt sind. Besiegte Höhlengegner fliehen nicht, sie ärgern sich und betrinken sich (Feld out, kein Auffüllen des Budgets). In den Höhlen gibt es keinen Wachendruck. Nach dem General öffnet sich der Ausgang zur Aue, dazu der Erfolg „Held der Stadt“ (P.achievements, bleibt über Runs). Höhlengegner haben einen eigenen Vorrat seltener Würfel (bis 4 Golden, 8 Okkulte, nie doppelt). Alte Spielstände werden migriert. Balancing (sim5.js): Standardbeutel gewinnen gegen Höhle 3 etwa 40 %, gegen den General etwa 25 %; mit 3 Okkulten und 3 starken Gezinkten etwa 71 % und 55 %.
Annahmen: je Raum fünf Gegner, 3 Räume vor dem General; Budget 3 × Mindesteinsatz; der Ausgang führt nur nach draußen (nicht zurück in die Höhle).

## Stand Story-Stränge (fertig, neun Stück)
Gemeinsames Gerüst in game.src.html (Abschnitt „Story-Stränge“): STORIES (Schritte mit ev = win/final/arrive/choice/act, at, npc, cond/why/back, amb, btn, say), STORY_NPCS (nur sichtbar, solange ihr Schritt aktiv ist; nach dem Sieg verschwinden sie), G.st (Fortschritt je Strang), G.flags, G.disc (Rabatt), G.roam (unterwegs auftauchende Gegner), P.achievements. Das Intro erscheint beim ersten Besuch des Orts, wenn die Bedingung erfüllt ist.
Stränge: Aschenkreis (Veyra taucht unterwegs auf, drei Siegel, Finale in der Ruine; Aschenwürfel und dauerhaft Okkult-Faktor bis ×4), Gildenbund (drei Prüfungen mit Auflagen, Meisterprüfung; Siegelwürfel, 15 % Rabatt), Salzbrüder (drei Lieferungen auf Zeit mit Wachendruck, Finale Egbert besiegen oder bestechen; Markt im Hafen, Seeweg zur Aue), Silberne Siegel (Seitenwahl, Finale im Torsaal; Kanzler: 10 % Rabatt und 600 Silber, Cordula: Geheimgang und Goldener Würfel), Dornenbrüder (Aue, Kräuter, Mechthild flickt beschädigte Würfel für 15 Silber), blinder Würfelmacher (drei Fragmente, Finale, Wahl eines Signaturwürfels), Bettlerkönig (Starthilfe +20 Silber dauerhaft), faule Wache (anzeigen: Tor immer offen, erpressen: Gefasst erst bei Druck 13), Rache der Vorhut (nach dem General, drei Rächer tauchen unterwegs auf, 1000 Silber).
Neue Würfel in dice.json (category "signatur", fixedName): sig_gilde, sig_asche, sig_s1, sig_s2, sig_s3. Engine: setOccultMax. Die Migration alter Spielstände ergänzt fehlende Felder. SW-Cache slums-v7. Offen: Balancing der Story-Gegner und Texte in echten Läufen prüfen.

## Nächste Schritte
1. Test auf einem echten iPhone (Checkliste in Spezifikation v4, Abschnitt 4).
2. Spezifikation v4 um Höhlensystem und Story-Stränge ergänzen.
3. Story-Gegner und Belohnungen in echten Läufen balancen.
