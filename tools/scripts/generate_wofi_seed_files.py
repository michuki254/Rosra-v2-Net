"""Generate the three remaining WoFi seed JSON files from the workbook dump:

  Data/Wofi/wofi_country_proxy.json   124 country rows
                                       (country, iso3, income_group, strict_proxy_pct_gdp,
                                        components_available, recurrent_property_tax_pct_gdp,
                                        tariffs_fees_pct_gdp, property_income_pct_gdp)
  Data/Wofi/wofi_frontier_stats.json   4 income-group rows
                                       (income_group, peer_count, base_top20_pct_gdp,
                                        final_headline_pct_gdp, final_benchmark_factor)
  Data/Wofi/wofi_premium_rules.json    5 profile-factor rows
                                       (profile_name, factor, when_to_use, observed_band)

The fourth seed file (wofi_national_data.json) is produced by
fetch_wofi_national_data.py against the live World Bank API.
"""
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path


def rows_by_number(sheet: dict) -> dict[int, dict[str, object]]:
    rows: dict[int, dict[str, object]] = defaultdict(dict)
    for addr, value in sheet["cells"].items():
        col = "".join(c for c in addr if c.isalpha())
        row_num = int("".join(c for c in addr if c.isdigit()))
        rows[row_num][col] = value
    return rows


def get_sheet(dump: dict, name: str) -> dict:
    for s in dump["sheets"]:
        if s["name"] == name:
            return s
    raise KeyError(name)


def build_country_proxy(dump: dict) -> list[dict]:
    sheet = get_sheet(dump, "WOFI_Country_Proxy")
    rows = rows_by_number(sheet)
    out: list[dict] = []
    for row_num in sorted(rows):
        if row_num == 1:
            continue
        cols = rows[row_num]
        out.append(
            {
                "iso3": cols.get("A"),
                "country": cols.get("B"),
                "income_group": cols.get("C"),
                "strict_osr_proxy_pct_gdp": cols.get("D"),
                "components_available": cols.get("F"),
                "property_tax_missing_flag": cols.get("G"),
                "recurrent_property_tax_pct_gdp": cols.get("H"),
                "tariffs_fees_pct_gdp": cols.get("I"),
                "property_income_pct_gdp": cols.get("J"),
                "source_note": cols.get("M"),
            }
        )
    return out


def build_frontier_stats(dump: dict) -> list[dict]:
    sheet = get_sheet(dump, "Frontier_Stats")
    rows = rows_by_number(sheet)
    out: list[dict] = []
    for row_num in sorted(rows):
        if row_num == 1:
            continue
        cols = rows[row_num]
        out.append(
            {
                "income_group": cols.get("A"),
                "peer_count": cols.get("B"),
                "top20_count": cols.get("C"),
                "base_top20_frontier_pct_gdp": cols.get("D"),
                "p80_pct_gdp": cols.get("E"),
                "max_observed_pct_gdp": cols.get("F"),
                "local_admin_pooled_sng_factor": cols.get("G"),
                "option2_shrinkage": cols.get("H"),
                "option2_half_factor": cols.get("I"),
                "total_osr_proxy_uplift": cols.get("J"),
                "final_benchmark_factor": cols.get("K"),
                "final_headline_frontier_pct_gdp": cols.get("L"),
            }
        )
    return out


def build_premium_rules(dump: dict) -> list[dict]:
    sheet = get_sheet(dump, "Premium_Rules")
    rows = rows_by_number(sheet)
    out: list[dict] = []
    for row_num in sorted(rows):
        if row_num == 1:
            continue
        cols = rows[row_num]
        out.append(
            {
                "profile_name": cols.get("A"),
                "when_to_use": cols.get("B"),
                "factor": cols.get("C"),
                "observed_band": cols.get("D"),
                "calibration_note": cols.get("E"),
            }
        )
    return out


def main() -> None:
    here = Path(__file__).parent
    dump_path = here / "wofi_estimator_dump.json"
    out_dir = here.parent / "Data" / "Wofi"
    out_dir.mkdir(parents=True, exist_ok=True)

    dump = json.loads(dump_path.read_text(encoding="utf-8"))

    targets = [
        ("wofi_country_proxy.json", build_country_proxy(dump)),
        ("wofi_frontier_stats.json", build_frontier_stats(dump)),
        ("wofi_premium_rules.json", build_premium_rules(dump)),
    ]

    for name, data in targets:
        path = out_dir / name
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"Wrote {len(data):>4} rows -> {path}")


if __name__ == "__main__":
    main()
