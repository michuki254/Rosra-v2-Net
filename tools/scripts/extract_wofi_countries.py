"""Extract the country list (name + ISO3 + income group) from National_Data
sheet of the WoFi estimator workbook dump. Writes wofi_countries.json with
UTF-8 encoding so downstream scripts can consume it safely.
"""
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path


def main() -> None:
    here = Path(__file__).parent
    dump_path = here / "wofi_estimator_dump.json"
    out_path = here / "wofi_countries.json"

    data = json.loads(dump_path.read_text(encoding="utf-8"))
    countries: list[dict] = []
    for sheet in data["sheets"]:
        if sheet["name"] != "National_Data":
            continue
        rows: dict[int, dict[str, object]] = defaultdict(dict)
        for addr, value in sheet["cells"].items():
            col = "".join(c for c in addr if c.isalpha())
            row_num = int("".join(c for c in addr if c.isdigit()))
            rows[row_num][col] = value
        for row_num in sorted(rows):
            if row_num == 1:
                continue
            cols = rows[row_num]
            if "A" in cols and "B" in cols:
                countries.append(
                    {
                        "name": cols["A"],
                        "iso3": cols["B"],
                        "income_group": cols.get("C", ""),
                    }
                )

    out_path.write_text(
        json.dumps(countries, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(countries)} countries to {out_path}")


if __name__ == "__main__":
    main()
