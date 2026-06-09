"""One-shot refactor: replace the legacy Within-Country OSR Frontier panel in
_PotentialEstimates.cshtml with the new WoFi Top-Down OSR Potential Estimator
output panel.

We find the marker "<!-- Bottom Panel - Frontier Analysis" and replace
everything down to (and including) the matching closing </div> for the
analysisPanelWrap element. The new content preserves the col-12 wrapper and
the next-step CTA so downstream JS / styles for the CTA keep working.
"""
from __future__ import annotations

import sys
from pathlib import Path

VIEW = Path(__file__).parent.parent / "Views" / "Shared" / "_PotentialEstimates.cshtml"

START_MARKER = '<!-- Bottom Panel - Frontier Analysis (Full Width) — hidden until "Get Analysis" is clicked -->'
PANEL_OPEN = '<div class="col-12" id="analysisPanelWrap"'

NEW_PANEL = '''        <!-- Bottom Panel - WoFi Top-Down OSR Potential Estimator — hidden until "Get Analysis" is clicked -->
        <div class="col-12" id="analysisPanelWrap" style="display:none;">
            <div class="analysis-panel">
                <div class="wofi-estimator-card" id="wofiEstimatorCard">

                    <!-- Header strip -->
                    <div class="wofi-header">
                        <div class="wofi-header-icon"><i class="bi bi-graph-up-arrow"></i></div>
                        <div class="wofi-header-content">
                            <h4 class="wofi-title">@Localizer["Wofi_Title"]</h4>
                            <p class="wofi-subtitle">@Localizer["Wofi_Subtitle"]</p>
                        </div>
                        <div class="wofi-header-meta" id="wofiHeaderMeta">
                            <span class="wofi-meta-row"><span class="wofi-meta-label">@Localizer["Wofi_IncomeGroup"]</span><span id="wofiIncomeGroupLabel">—</span></span>
                            <span class="wofi-meta-row"><span class="wofi-meta-label">@Localizer["Wofi_BenchmarkFrontier"]</span><span id="wofiBenchmarkLabel">—</span></span>
                            <span class="wofi-meta-row"><span class="wofi-meta-label">@Localizer["Wofi_ProfileFactor"]</span><span id="wofiProfileFactorLabel">—</span></span>
                        </div>
                    </div>

                    <!-- Placeholder shown before Get Analysis has been clicked -->
                    <div class="wofi-placeholder" id="wofiPlaceholder">
                        <i class="bi bi-bullseye"></i>
                        <p>@Localizer["Wofi_Placeholder"]</p>
                    </div>

                    <!-- Estimator output (hidden until first compute returns) -->
                    <div class="wofi-content" id="wofiContent" style="display:none;">

                        <!-- 3-up tile row: Potential, Gap, Frontier index -->
                        <div class="wofi-tiles">
                            <div class="wofi-tile wofi-tile-potential">
                                <span class="wofi-tile-label">@Localizer["Wofi_PotentialLabel"]</span>
                                <span class="wofi-tile-value" id="wofiPotentialValue">—</span>
                                <span class="wofi-tile-caption">@Localizer["Wofi_PotentialCaption"]</span>
                            </div>
                            <div class="wofi-tile wofi-tile-gap">
                                <span class="wofi-tile-label">@Localizer["Wofi_GapLabel"]</span>
                                <span class="wofi-tile-value" id="wofiGapValue">—</span>
                                <span class="wofi-tile-caption">@Localizer["Wofi_GapCaption"]</span>
                            </div>
                            <div class="wofi-tile wofi-tile-index">
                                <span class="wofi-tile-label">@Localizer["Wofi_FrontierIndexLabel"]</span>
                                <span class="wofi-tile-value" id="wofiFrontierIndexValue">—</span>
                                <span class="wofi-tile-caption" id="wofiFrontierInterpretation">—</span>
                            </div>
                        </div>

                        <!-- Actual + Gap = Potential horizontal stacked bar -->
                        <div class="wofi-bar-block">
                            <div class="wofi-bar-header">
                                <h5 class="wofi-bar-title">@Localizer["Wofi_BarTitle"]</h5>
                                <span class="wofi-bar-units" id="wofiBarUnits">—</span>
                            </div>
                            <div class="wofi-bar-track" id="wofiBarTrack" role="img" aria-label="@Localizer["Wofi_BarAriaLabel"]">
                                <div class="wofi-bar-segment wofi-bar-actual" id="wofiBarActual">
                                    <span class="wofi-bar-segment-label" id="wofiBarActualLabel"></span>
                                </div>
                                <div class="wofi-bar-segment wofi-bar-gap" id="wofiBarGap">
                                    <span class="wofi-bar-segment-label" id="wofiBarGapLabel"></span>
                                </div>
                            </div>
                            <div class="wofi-bar-legend">
                                <span class="wofi-bar-legend-item"><span class="wofi-bar-swatch wofi-bar-swatch-actual"></span>@Localizer["Wofi_LegendActual"]: <strong id="wofiLegendActual">—</strong></span>
                                <span class="wofi-bar-legend-item"><span class="wofi-bar-swatch wofi-bar-swatch-gap"></span>@Localizer["Wofi_LegendGap"]: <strong id="wofiLegendGap">—</strong></span>
                                <span class="wofi-bar-legend-item wofi-bar-legend-total">@Localizer["Wofi_LegendPotential"]: <strong id="wofiLegendPotential">—</strong></span>
                            </div>
                        </div>

                        <!-- Warning ribbon (shown only if WarningLevel != OK) -->
                        <div class="wofi-warning" id="wofiWarning" style="display:none;" data-level="OK">
                            <i class="bi bi-exclamation-triangle"></i>
                            <span id="wofiWarningMessage"></span>
                        </div>

                        <!-- Methodology / data-source caption -->
                        <div class="wofi-methodology">
                            <details>
                                <summary>@Localizer["Wofi_MethodologyToggle"]</summary>
                                <div class="wofi-methodology-content">
                                    <p>@Localizer["Wofi_MethodologyBody"]</p>
                                    <ul class="wofi-methodology-list">
                                        <li><strong>@Localizer["Wofi_Method_GdpLabel"]:</strong> <span id="wofiMethodGdp">—</span></li>
                                        <li><strong>@Localizer["Wofi_Method_LocalGdpLabel"]:</strong> <span id="wofiMethodLocalGdp">—</span></li>
                                        <li><strong>@Localizer["Wofi_Method_BenchmarkLabel"]:</strong> <span id="wofiMethodBenchmark">—</span></li>
                                        <li><strong>@Localizer["Wofi_Method_GdpShareLabel"]:</strong> <span id="wofiMethodGdpShare">—</span></li>
                                        <li><strong>@Localizer["Wofi_Method_DataSource"]:</strong> <span id="wofiMethodSource">—</span></li>
                                    </ul>
                                    <p class="wofi-methodology-caveat">@Localizer["Wofi_MethodologyCaveat"]</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                <!-- Forward CTA: usher the user to the per-stream analysis section -->
                <div class="next-step-cta-wrap">
                    <button type="button" id="goToStreamAnalysisBtn" class="next-step-cta">
                        <span class="next-step-cta__copy">
                            <span class="next-step-cta__eyebrow">@SharedLocalizer["Nav_NextStep"]</span>
                            <span class="next-step-cta__title">@Localizer["NextStepCTA_Title"]</span>
                            <span class="next-step-cta__sub">@Localizer["NextStepCTA_Sub"]</span>
                        </span>
                        <span class="next-step-cta__arrow">
                            <i class="bi bi-arrow-right"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
'''


def find_block_end(lines: list[str], start_idx: int) -> int:
    """Return the index of the line that closes the analysisPanelWrap div,
    by counting open/close <div tokens from start_idx."""
    depth = 0
    started = False
    for i in range(start_idx, len(lines)):
        line = lines[i]
        # Count opens
        opens = line.count("<div ") + line.count("<div>")
        # Count closes
        closes = line.count("</div>")
        if not started:
            depth += opens
            depth -= closes
            if depth > 0:
                started = True
        else:
            depth += opens
            depth -= closes
            if depth == 0:
                return i
    raise RuntimeError("Could not find matching </div> for analysisPanelWrap")


def main() -> None:
    text = VIEW.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    start_idx = next(
        i for i, ln in enumerate(lines)
        if START_MARKER in ln
    )
    panel_open_idx = next(
        i for i, ln in enumerate(lines[start_idx:], start=start_idx)
        if PANEL_OPEN in ln
    )
    end_idx = find_block_end(lines, panel_open_idx)

    print(f"Replacing lines {start_idx + 1}..{end_idx + 1} "
          f"({end_idx - start_idx + 1} lines)")

    before = "".join(lines[:start_idx])
    after = "".join(lines[end_idx + 1:])

    VIEW.write_text(before + NEW_PANEL + after, encoding="utf-8")
    print(f"Wrote {VIEW}")


if __name__ == "__main__":
    main()
