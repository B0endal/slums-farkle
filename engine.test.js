const assert = require("assert");
const E = require("./engine.js");
const DB = require("./dice.json");
const byId = Object.fromEntries(DB.map(d => [d.id, d]));
const D = (value, extra) => Object.assign({ value, mult: 1, totalMult: 1, occult: false }, extra);
const S = (vals, f = 0, extra) => E.scoreSelection(vals.map(v => D(v, extra)), f);
let n = 0; const t = (name, fn) => { fn(); n++; console.log("ok", name); };

t("Einzelwertung", () => { assert.equal(S([1]).score, 100); assert.equal(S([5]).score, 50); assert.equal(S([1, 5]).score, 150); });
t("Drillinge", () => { assert.equal(S([1,1,1]).score, 1000); assert.equal(S([2,2,2]).score, 200); assert.equal(S([6,6,6]).score, 600); });
t("Mehrfache (Beispiele der Spezifikation)", () => {
  // Regelbild: vier gleiche 1000, fünf gleiche 2000, sechs gleiche 3000, unabhängig von der Augenzahl
  assert.equal(S([3,3,3,3]).score, 1000); assert.equal(S([3,3,3,3,3,3]).score, 3000);
  assert.equal(S([1,1,1,1]).score, 1100); /* besser als 1000: Drilling 1000 plus einzelne 1 */ assert.equal(S([2,2,2,2,2]).score, 2000);
  assert.equal(S([6,6,6,6,6,6]).score, 3000);
});
t("Straße und Teilstraße", () => {
  assert.equal(S([1,2,3,4,5,6]).score, 1500); assert.equal(S([6,5,4,3,2,1]).score, 1500);
  assert.equal(S([1,2,3,4,5]).score, 750); assert.equal(S([5,4,3,2,6]).score, 750);
  assert.equal(S([1,2,3,4]), null);
});
t("Drei Paare, Doppel-Drilling, Vierling plus Paar", () => {
  assert.equal(S([2,2,3,3,4,4]).score, 1500); assert.equal(S([1,1,5,5,6,6]).score, 1500);
  assert.equal(S([2,2,2,4,4,4]).score, 2500); assert.equal(S([1,1,1,5,5,5]).score, 2500);
  assert.equal(S([3,3,3,3,6,6]).score, 1500); assert.equal(S([2,2,2,2,5,5]).score, 1500);
});
t("Ungültige Auswahlen", () => {
  assert.equal(S([2]), null); assert.equal(S([2,2]), null);
  assert.equal(S([1,2]), null); assert.equal(S([0,1]), null); assert.equal(S([]), null);
});
t("Drilling + Einzelne", () => { assert.equal(S([3,3,3,1,5]).score, 450); assert.equal(S([2,2,2,2,5]).score, 1050);
  assert.equal(S([2,2,2,2,1,1]).score, 1500); /* Vierling plus Paar */ });
t("Multiplikator wirkt als Produkt auf die Kombi", () => {
  const sel = [D(3,{mult:2}), D(3,{mult:3}), D(3)]; assert.equal(E.scoreSelection(sel, 0).score, 300 * 6);
  const single = [D(1,{mult:2}), D(1)]; assert.equal(E.scoreSelection(single, 0).score, 200 + 100);
});
t("totalMult", () => assert.equal(E.scoreSelection([D(1,{totalMult:3})], 0).score, 300));
t("Okkult-Faktor (Beispiele)", () => {
  const O = v => D(v, { occult: true });
  // N = 4 -> Faktor 2; Drilling aus 3 Okkulten = 2*2*2 = x8
  assert.equal(E.scoreSelection([O(3), O(3), O(3)], 2).score, 300 * 8);
  // N = 6 -> Faktor 3; sechs okkulte Sechser = 3^6 = 729, Basis 3000
  assert.equal(E.scoreSelection(Array(6).fill(0).map(() => O(6)), 3).score, 3000 * 729);
  // N = 1 -> Faktor 0,5
  assert.equal(E.scoreSelection([O(1)], 0.5).score, 50);
  // nicht okkulte Würfel in der Kombi bleiben unberührt
  assert.equal(E.scoreSelection([O(1), D(1)], 2).score, 200 + 100);
});
t("occultFactor aus Tasche", () => {
  const bag = ["o", "o_1", "o_1_2", "o_2", "std", "bd_f1_m1"].map(id => byId[id]);
  assert.equal(E.occultFactor(bag), 2); assert.equal(E.occultFactor([byId.std]), 0);
});
t("Okkult-Faktor ist auf x3 gedeckelt", () => {
  const o = byId["o"];
  assert.equal(E.occultFactor(Array(6).fill(o)), 3);
  assert.equal(E.occultFactor(Array(8).fill(o)), 3);
  assert.equal(E.occultFactor(Array(10).fill(o)), 3);
  assert.equal(E.occultFactor(Array(5).fill(o)), 2.5);
});
t("Kompendium: benötigte Würfe laut Spezifikation", () => {
  assert.equal(Math.round(E.samplesNeeded(1 / 6) / 100) * 100, 7700);
  assert.equal(Math.round(E.samplesNeeded(0.3) / 100) * 100, 3600);
  assert.equal(Math.round(E.samplesNeeded(1 / 9) / 100) * 100, 12300);
});
t("Kompendium: Sicherheitsstufen", () => {
  assert.equal(E.confidenceLevel(0, 0), 0);
  assert.equal(E.confidenceLevel(60, 10), 0);          // wenige Würfe: unklar
  assert.equal(E.confidenceLevel(2000, 333), 1);       // Tendenz
  assert.equal(E.confidenceLevel(5000, 833), 2);       // wahrscheinlich
  assert.equal(E.confidenceLevel(9000, 1500), 3);      // gesichert
  assert.equal(E.confidenceLevel(9000, 0), 3);
});
t("Farkle-Erkennung", () => {
  assert.equal(E.hasScoring([D(2), D(3), D(4), D(6), D(2), D(3)]), false);
  assert.equal(E.hasScoring([2,2,3,3,4,4].map(v => D(v))), true); // drei Paare
  assert.equal(E.hasScoring([D(2), D(2), D(2)]), true);
  assert.equal(E.hasScoring([D(2), D(3), D(4)]), false);
  assert.equal(E.hasScoring([D(1,{}), D(3)]), true);
  assert.equal(E.hasScoring([1,2,3,4,5,6].map(v => D(v))), true);
  assert.equal(E.hasScoring([D(0), D(0)]), false);
});
t("Hot Dice mit 6 und mit weniger Würfeln", () => {
  let dice = [1,5,1,5,1,1].map(v => ({ value: v, selected: true, locked: false }));
  let k = E.keepSelected(dice); assert.equal(k.hot, true); assert.ok(k.dice.every(d => !d.locked));
  dice = [1,5].map(v => ({ value: v, selected: true, locked: false }));
  k = E.keepSelected(dice); assert.equal(k.hot, true);
  dice = [{ value: 1, selected: true, locked: false }, { value: 5, selected: false, locked: false }];
  k = E.keepSelected(dice); assert.equal(k.hot, false); assert.equal(k.dice[0].locked, true);
  assert.equal(E.keepSelected([]).hot, false);
});
t("Wahrscheinlichkeiten aus Gewichten", () => {
  DB.forEach(d => { const p = E.sideProbabilities(d); assert.ok(Math.abs(p.reduce((a, b) => a + b, 0) - 1) < 1e-9, d.id); });
  assert.ok(Math.abs(E.sideProbabilities(byId.std)[0] - 1/6) < 1e-9);
  assert.ok(Math.abs(E.sideProbabilities(byId.bq_f1_m1)[0] - 4/9) < 1e-9);
  assert.ok(Math.abs(E.sideProbabilities(byId.bd_f1_m1)[0] - 2/7) < 1e-9);
  assert.ok(Math.abs(E.sideProbabilities(byId.t456_4)[5] - 9/20) < 1e-9);
});
t("Golden Pick würfelt immer seine Seite", () => {
  const rng = E.mulberry32(1);
  for (let k = 1; k <= 6; k++) for (let i = 0; i < 200; i++) assert.equal(byId["g" + k].sides[E.rollSideIndex(byId["g" + k], rng)].value, k);
});
t("Defekte Seite hat Wert 0 und zählt nie", () => {
  const d = byId.bd_f3_m1; assert.equal(d.sides[2].value, 0);
  assert.equal(E.scoreSelection([D(0)], 0), null);
});
t("Würfelverteilung entspricht den Gewichten (Monte Carlo)", () => {
  const rng = E.mulberry32(42), N = 60000, cnt = [0,0,0,0,0,0], die = byId.bq_f2_m1;
  for (let i = 0; i < N; i++) cnt[E.rollSideIndex(die, rng)]++;
  const p = E.sideProbabilities(die);
  cnt.forEach((c, i) => assert.ok(Math.abs(c / N - p[i]) < 0.01, "Seite " + i));
});
t("validSelections findet beste Auswahl", () => {
  const dice = [1,1,1,5,2,3].map(v => D(v));
  const s = E.validSelections(dice, 0).sort((a, b) => b.score - a.score)[0]; assert.equal(s.score, 1050);
});
t("KI-Entscheidung", () => {
  assert.equal(E.aiShouldBank("vorsichtig", 300, 4, 0, 2000), true);
  assert.equal(E.aiShouldBank("vorsichtig", 250, 4, 0, 2000), false);
  assert.equal(E.aiShouldBank("vorsichtig", 100, 2, 0, 2000), true);
  assert.equal(E.aiShouldBank("ausgewogen", 450, 5, 0, 2000), true);
  assert.equal(E.aiShouldBank("risikofreudig", 450, 5, 0, 2000), false);
  assert.equal(E.aiShouldBank("jaeger", 500, 4, 0, 2000), false);
  assert.equal(E.aiShouldBank("jaeger", 100, 3, 1950, 2000), true); // Sieg
  assert.equal(E.aiShouldBank("vorsichtig", 0, 3, 0, 2000), false);
  assert.equal(E.aiShouldBank("vorsichtig", 500, 0, 0, 2000), false); // Hot Dice
});
t("Simulation: Duelle enden, Standard gegen Standard fair", () => {
  const rng = E.mulberry32(7), bag = Array(6).fill(byId.std);
  const mk = (p, starts) => ({ dice: bag, dbById: byId, profile: p, starts });
  let aWins = 0, ended = 0, turnsSum = 0; const R = 600;
  for (let i = 0; i < R; i++) {
    const r = E.simulateDuel(mk("ausgewogen", true), mk("ausgewogen", false), 2000, rng);
    if (r.winner) ended++; if (r.winner === "a") aWins++; turnsSum += r.turns;
  }
  assert.equal(ended, R); const rate = aWins / R;
  console.log("   Beginner-Siegquote Standard vs Standard:", rate.toFixed(3), "Züge je Duell:", (turnsSum / R).toFixed(1));
  assert.ok(rate > 0.45 && rate < 0.70);
});
t("Simulation: Okkult-Beutel schlägt Standard deutlich", () => {
  const rng = E.mulberry32(9);
  const occ = ["o","o_1","o_2","o_3","o_4","o_5"].map(id => byId[id]), std = Array(6).fill(byId.std);
  let w = 0; const R = 400;
  for (let i = 0; i < R; i++) if (E.simulateDuel({ dice: occ, dbById: byId, profile: "ausgewogen", starts: true }, { dice: std, dbById: byId, profile: "ausgewogen", starts: false }, 2000, rng).winner === "a") w++;
  console.log("   Siegquote 6 Okkulte vs Standard:", (w / R).toFixed(3));
  assert.ok(w / R > 0.8);
});
console.log("\n" + n + " Tests bestanden");
