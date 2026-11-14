import openpyxl, json
ws = openpyxl.load_workbook("Farkle_Roguelite_Spezifikation_v2.xlsx")["Würfel-Matrix"]
CAT = {"Standard":"standard","Beschädigt":"beschaedigt","Gezinkt":"gezinkt","Golden Pick":"golden","Okkult":"okkult"}
dice = []
for r in range(2, 121):
    sides = [{"value": ws.cell(r, 8+4*i).value, "weight": ws.cell(r, 6+4*i).value, "mult": ws.cell(r, 9+4*i).value} for i in range(6)]
    dice.append({"id": ws.cell(r,1).value, "category": CAT[ws.cell(r,3).value], "maxInventory": ws.cell(r,4).value,
                 "baseValue": ws.cell(r,31).value, "totalMult": 1, "sides": sides})
ids = [d["id"] for d in dice]
assert len(set(ids)) == 119
for d in dice:
    assert all(isinstance(s["weight"], (int,float)) and s["weight"] > 0 for s in d["sides"]) or d["category"]=="golden", d["id"]
    if d["category"] == "golden":
        assert sum(1 for s in d["sides"] if s["weight"] > 0) == 1, d["id"]
json.dump(dice, open("dice.json","w"), ensure_ascii=False)
from collections import Counter
print(len(dice), Counter(d["category"] for d in dice))
print([d for d in dice if d["id"] in ("g3","bq_f2_m1","o_2_5")])
