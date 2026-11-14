const E = require("./engine.js"), DB = require("./dice.json");
const byId = Object.fromEntries(DB.map(d => [d.id, d])), rng = E.mulberry32(77), T = 600;
const bag = ids => ids.map(id => byId[id]), std = id => Array(6).fill(id);
const mixed = (ids) => () => bag(ids.concat(Array(6 - ids.length).fill("std")));
function win(mk) { let w = 0; for (let i = 0; i < T; i++) { const st = i % 2 === 0; const r = E.simulateDuel({ dice: mk(), dbById: byId, profile: "ausgewogen", starts: st }, { dice: bag(std("std")), dbById: byId, profile: "ausgewogen", starts: !st }, 2000, rng, 300); if (r.winner === "a") w++; } return (100 * w / T).toFixed(0) + " %"; }
const rows = [];
for (const t of ["t15", "t456", "t23"]) for (const l of [1, 4]) rows.push([`6x ${t} Stufe ${l}`, mixed(Array(6).fill(`${t}_${l}`))]);
for (const k of [1, 5, 2, 6]) rows.push([`6x T${k} (Einzelseite)`, mixed(Array(6).fill("t" + k))]);
rows.push(["1 Golden (g1) + 5 Standard", mixed(["g1"])], ["1 Golden (g5) + 5 Standard", mixed(["g5"])], ["1 Golden (g3) + 5 Standard", mixed(["g3"])], ["2 Golden (g1,g5) + 4 Standard", mixed(["g1", "g5"])]);
rows.push(["2 Okkulte + 4 Standard", mixed(["o", "o_1"])]);
console.log("| Beutel gegen 6 Standard (ausgewogen, Ziel 2000) | Siegquote |\n|---|---|");
for (const [n, mk] of rows) console.log(`| ${n} | ${win(mk)} |`);
