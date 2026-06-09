"""Fetch national GDP per capita (current LCU) and total population for every
WoFi-estimator country, from the World Bank Open Data API.

- Indicator NY.GDP.PCAP.CN: GDP per capita, current LCU
- Indicator SP.POP.TOTL:    Population, total

For each country we record the most recent year for which BOTH indicators
have non-null values. If they never overlap (rare), we take the most recent
value from each indicator independently and flag the mismatch in the note.

Output: Data/Wofi/wofi_national_data.json (UTF-8, pretty-printed) plus a
sidecar wofi_national_data_report.json with coverage stats.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API_BASE = "https://api.worldbank.org/v2"
GDP_PCAP_LCU = "NY.GDP.PCAP.CN"
POP_TOTAL = "SP.POP.TOTL"
DATE_RANGE = "2000:2024"
PER_PAGE = 200
USER_AGENT = "ROSRA-WoFi-Fetcher/1.0 (+https://unhabitat.org)"

# Workbook ISO3 → World Bank ISO3 fixups.
ISO_FIXUPS = {
    "XKV": "XKX",  # Kosovo: workbook uses XKV, World Bank uses XKX
}


def http_get_json(url: str, retries: int = 4, backoff: float = 1.5) -> object:
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_err = exc
            time.sleep(backoff * (attempt + 1))
    assert last_err is not None
    raise last_err


def fetch_indicator(iso3: str, indicator: str) -> list[dict]:
    url = (
        f"{API_BASE}/country/{iso3}/indicator/{indicator}"
        f"?format=json&date={DATE_RANGE}&per_page={PER_PAGE}"
    )
    payload = http_get_json(url)
    if not isinstance(payload, list) or len(payload) < 2 or payload[1] is None:
        return []
    out: list[dict] = []
    for obs in payload[1]:
        year = obs.get("date")
        value = obs.get("value")
        if year is None or value is None:
            continue
        out.append({"year": int(year), "value": float(value)})
    out.sort(key=lambda r: r["year"], reverse=True)
    return out


def pick_best(gdp_pc: list[dict], pop: list[dict]) -> dict:
    gdp_years = {r["year"]: r["value"] for r in gdp_pc}
    pop_years = {r["year"]: r["value"] for r in pop}
    overlap = sorted(set(gdp_years) & set(pop_years), reverse=True)
    if overlap:
        y = overlap[0]
        return {
            "gdp_per_capita_lcu": gdp_years[y],
            "national_population": pop_years[y],
            "data_year": y,
            "note": "World Bank WDI: GDPpc (NY.GDP.PCAP.CN) and Pop (SP.POP.TOTL) for same year",
        }
    # No overlap. Take latest of each, flag the year mismatch.
    if gdp_pc and pop:
        return {
            "gdp_per_capita_lcu": gdp_pc[0]["value"],
            "national_population": pop[0]["value"],
            "data_year": min(gdp_pc[0]["year"], pop[0]["year"]),
            "note": (
                f"World Bank WDI: GDPpc year {gdp_pc[0]['year']}, "
                f"Pop year {pop[0]['year']} (no overlapping year)"
            ),
        }
    if gdp_pc and not pop:
        return {
            "gdp_per_capita_lcu": gdp_pc[0]["value"],
            "national_population": None,
            "data_year": gdp_pc[0]["year"],
            "note": "World Bank WDI: GDPpc only — no population data returned",
        }
    if pop and not gdp_pc:
        return {
            "gdp_per_capita_lcu": None,
            "national_population": pop[0]["value"],
            "data_year": pop[0]["year"],
            "note": "World Bank WDI: population only — no GDPpc data returned",
        }
    return {
        "gdp_per_capita_lcu": None,
        "national_population": None,
        "data_year": None,
        "note": "World Bank WDI: no data returned for either indicator",
    }


def main() -> None:
    here = Path(__file__).parent
    countries_path = here / "wofi_countries.json"
    out_dir = here.parent / "Data" / "Wofi"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "wofi_national_data.json"
    report_path = out_dir / "wofi_national_data_report.json"

    countries = json.loads(countries_path.read_text(encoding="utf-8"))
    results: list[dict] = []
    report: dict[str, list] = {
        "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
        "source": "World Bank Open Data API (NY.GDP.PCAP.CN, SP.POP.TOTL)",
        "indicator_range": DATE_RANGE,
        "iso_fixups_applied": [],
        "missing_both": [],
        "missing_gdp_only": [],
        "missing_pop_only": [],
        "year_mismatch": [],
        "covered": 0,
        "total": len(countries),
    }

    for i, c in enumerate(countries, start=1):
        wb_iso = ISO_FIXUPS.get(c["iso3"], c["iso3"])
        if wb_iso != c["iso3"]:
            report["iso_fixups_applied"].append(
                {"name": c["name"], "workbook_iso3": c["iso3"], "wb_iso3": wb_iso}
            )
        try:
            gdp_pc = fetch_indicator(wb_iso, GDP_PCAP_LCU)
            pop = fetch_indicator(wb_iso, POP_TOTAL)
        except Exception as exc:  # noqa: BLE001 — report and continue
            print(f"  ! {c['name']} ({wb_iso}): fetch error: {exc}", file=sys.stderr)
            gdp_pc, pop = [], []

        best = pick_best(gdp_pc, pop)

        record = {
            "country": c["name"],
            "iso3": c["iso3"],
            "wb_iso3": wb_iso,
            "income_group": c["income_group"],
            "gdp_per_capita_lcu": best["gdp_per_capita_lcu"],
            "national_population": best["national_population"],
            "data_year": best["data_year"],
            "source": best["note"],
        }
        results.append(record)

        if best["gdp_per_capita_lcu"] is None and best["national_population"] is None:
            report["missing_both"].append(c["name"])
        elif best["gdp_per_capita_lcu"] is None:
            report["missing_gdp_only"].append(c["name"])
        elif best["national_population"] is None:
            report["missing_pop_only"].append(c["name"])
        else:
            report["covered"] += 1
        if "no overlapping" in best["note"]:
            report["year_mismatch"].append(c["name"])

        print(
            f"[{i:3d}/{len(countries)}] {c['name']:<48}"
            f"  GDPpc={best['gdp_per_capita_lcu']!s:<18}"
            f"  Pop={best['national_population']!s:<14}"
            f"  Yr={best['data_year']}"
        )
        time.sleep(0.15)

    out_path.write_text(
        json.dumps(results, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print()
    print(f"Wrote {out_path}")
    print(f"Wrote {report_path}")
    print(
        f"Coverage: {report['covered']}/{report['total']} countries with both values."
    )
    if report["missing_both"]:
        print(f"Missing both:   {report['missing_both']}")
    if report["missing_gdp_only"]:
        print(f"Missing GDP:    {report['missing_gdp_only']}")
    if report["missing_pop_only"]:
        print(f"Missing Pop:    {report['missing_pop_only']}")
    if report["year_mismatch"]:
        print(f"Year mismatch:  {report['year_mismatch']}")


if __name__ == "__main__":
    main()
