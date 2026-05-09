"""Produce a compact human-readable summary of the ROSRA v4 workbook so the
assistant can build a memory pointer without re-reading the full JSON dump.

For each sheet we emit:
- dimensions
- unique formulas (deduped) so we know what calculations are encoded
- header row(s) (rows with mostly text, near the top)
- a handful of representative cells

Output: text file that's small enough to paste-summarize.
"""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path


def summarize(workbook: dict) -> str:
    out = []
    for sheet in workbook["sheets"]:
        name = sheet["name"]
        rows, cols = sheet["max_row"], sheet["max_col"]
        cells = sheet["cells"]
        out.append(f"\n=== Sheet: {name} ({rows} rows x {cols} cols, {len(cells)} cells) ===")

        # Collect formulas
        formulas = []
        text_cells = []
        for addr, val in cells.items():
            if isinstance(val, dict) and "f" in val:
                formulas.append((addr, val["f"]))
            elif isinstance(val, str):
                text_cells.append((addr, val))

        # Unique formula patterns (replace cell refs with #)
        import re
        norm_re = re.compile(r"\$?[A-Z]+\$?\d+")
        pattern_count = Counter()
        for addr, f in formulas:
            pattern = norm_re.sub("REF", f)
            pattern_count[pattern] += 1

        if pattern_count:
            out.append(f"  Formulas (unique patterns): {len(pattern_count)} of {len(formulas)} formulas")
            for pat, count in pattern_count.most_common(20):
                out.append(f"    [{count}x] {pat[:200]}")

        # Show first ~40 text cells (headers, labels)
        if text_cells:
            out.append(f"  Text/label cells (first 60):")
            for addr, t in text_cells[:60]:
                snippet = t[:120].replace("\n", " ")
                out.append(f"    {addr}: {snippet}")

        # Sample numeric values
        nums = [(addr, val) for addr, val in cells.items() if isinstance(val, (int, float))]
        if nums:
            out.append(f"  Numeric cells: {len(nums)}, sample (first 12): " + ", ".join(f"{a}={v}" for a, v in nums[:12]))

    return "\n".join(out)


def main():
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    workbook = json.loads(src.read_text(encoding="utf-8"))
    summary = summarize(workbook)
    dst.write_text(summary, encoding="utf-8")
    print(f"Wrote {len(summary)} bytes to {dst}")


if __name__ == "__main__":
    main()
