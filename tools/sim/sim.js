const E = require("../../engine.js"), DB = require("../../dice.json");
const byId = Object.fromEntries(DB.map(d => [d.id, d]));
const T = +process.argv[2] || 600;
const rng = E.mulberry32(20261113);
const pick = a => a[Math.floor(rng() * a.length)];
const bag = ids => ids.map(id => byId[id]);
const std6 = () => bag(Array(6).fill("std"));
const startBag = () => { const out = [], cnt = {}; while (out.length < 4) { const id = `${rng() < .5 ? "bd" : "bq"}_f${1 + Math.floor(rng() * 6)}_m${1 + Math.floor(rng() * 6)}`; if ((cnt[id] || 0) < byId[id].maxInventory) { cnt[id] = (cnt[id] || 0) + 1; out.push(byId[id]); } } return out.concat(bag(["std", "std"])); };
const gez4 = () => bag(["t456_4", "t456_4", "t15_4", "t15_4", "t23_4", "t23_4"]);
const occ = n => () => bag(["o", "o_1", "o_2", "o_3", "o_4", "o_5"].slice(0, n).concat(Array(6 - n).fill("std")));
const golden = () => bag(["g1", "g1", "g5", "g5", "g1", "g5"].map((x, i) => ["g1", "g2", "g3", "g4", "g5", "g6"][i]));
function npcPool(group) { // vereinfacht nach Abschnitt 13.5
  const G = { 1: [["std", 60], ["bd", 32], ["bq", 8]], 2: [["std", 60], ["bd", 22], ["bq", 8], ["gez", 10]], 3: [["std", 40], ["bd", 12], ["bq", 8], ["gez", 40]] }[group];
  const out = []; let gez = 0, cap = { 1: 0, 2: 1, 3: 2 }[group];
  for (let i = 0; i < 6; i++) {
    let x = rng() * G.reduce((a, g) => a + g[1], 0), k; for (const g of G) { x -= g[1]; if (x < 0) { k = g[0]; break; } }
    if (k === "gez") { if (gez >= cap) k = "std"; else { gez++; out.push(byId[`${pick(["t15", "t456", "t23"])}_${group === 2 ? 1 : 1 + Math.floor(rng() * 2)}`]); continue; } }
    out.push(k === "std" ? byId.std : byId[`${k}_f${1 + Math.floor(rng() * 6)}_m${1 + Math.floor(rng() * 6)}`]);
  }
  return out;
}
function duel(mkA, pa, mkB, pb, target, aStarts) {
  const r = E.simulateDuel({ dice: mkA(), dbById: byId, profile: pa, starts: aStarts }, { dice: mkB(), dbById: byId, profile: pb, starts: !aStarts }, target, rng, 300);
  return r;
}
function stat(mkA, pa, mkB, pb, target) {
  let w = 0, ws = 0, turns = 0, s = 0, n = 0;
  for (let i = 0; i < T; i++) {
    const st = i % 2 === 0, r = duel(mkA, pa, mkB, pb, target, st);
    if (r.winner === "a") { w++; if (st) ws++; } turns += r.turns; if (st) s++; n++;
  }
  return { win: w / n, avgTurns: turns / n, winStart: ws / s, winSecond: (w - ws) / (n - s) };
}
const pct = x => (100 * x).toFixed(0) + " %";
const out = [];
const P = ["vorsichtig", "ausgewogen", "risikofreudig", "jaeger"];
out.push("## 1. KI-Profile gegeneinander (je 6 Standardwürfel, Ziel 2000, Siegquote der Zeile)");
out.push("| Profil | " + P.join(" | ") + " | Züge je Duell |"); out.push("|---|" + P.map(() => "---|").join("") + "---|");
for (const a of P) { const cells = []; let tt = 0; for (const b of P) { const s = stat(std6, a, std6, b, 2000); cells.push(pct(s.win)); tt += s.avgTurns; } out.push(`| ${a} | ${cells.join(" | ")} | ${(tt / 4).toFixed(1)} |`); }
out.push("\n## 2. Startbeutel (4 beschädigt + 2 Standard) des Spielers gegen NPCs (Spieler spielt ausgewogen)");
out.push("| Gegner (Pool, Profil, Ziel) | Siegquote Start | Siegquote als Zweiter | gesamt | Züge |"); out.push("|---|---|---|---|---|");
for (const [name, g, prof, tg] of [["Slums (1, vorsichtig, 1500)", 1, "vorsichtig", 1500], ["Handelsstraße (2, ausgewogen, 2000)", 2, "ausgewogen", 2000], ["Kneipe (2, risikofreudig, 2500)", 2, "risikofreudig", 2500], ["Hafen (3, risikofreudig, 3000)", 3, "risikofreudig", 3000]]) {
  const s = stat(startBag, "ausgewogen", () => npcPool(g), prof, tg); out.push(`| ${name} | ${pct(s.winStart)} | ${pct(s.winSecond)} | ${pct(s.win)} | ${s.avgTurns.toFixed(1)} |`);
}
out.push("\n## 3. Beuteltypen gegen 6 Standardwürfel (beide ausgewogen, Ziel 2000)");
out.push("| Beutel | Siegquote | Züge |"); out.push("|---|---|---|");
for (const [n, mk] of [["6 Standard", std6], ["Startbeutel", startBag], ["Gezinkt Stufe 4 (6 Stück)", gez4], ["1 Okkult + 5 Standard", occ(1)], ["2 Okkulte + 4 Standard", occ(2)], ["3 Okkulte + 3 Standard", occ(3)], ["4 Okkulte + 2 Standard", occ(4)], ["6 Okkulte", occ(6)], ["Golden G1–G6", golden]]) {
  const s = stat(mk, "ausgewogen", std6, "ausgewogen", 2000); out.push(`| ${n} | ${pct(s.win)} | ${s.avgTurns.toFixed(1)} |`);
}
console.log(out.join("\n"));
