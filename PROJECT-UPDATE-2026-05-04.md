# ROSRA V2 — Project Update

**Date:** 4 May 2026
**Project:** Revenue Optimisation Self-Reform Assessment (ROSRA), Version 2
**Prepared by:** Boniface Michuki

---

## 1. Summary

This update reports progress on the items raised in the last project meeting and lists the work scoped for the next iteration. Four of the meeting items have been completed and deployed to the staging environment; three items remain open and are proposed as the focus of the next iteration.

Production URL: <https://rosraapp-production.up.railway.app>

---

## 2. Items Completed Since the Last Meeting

### 2.1 UI clean-up — removal of the side menu

The persistent left-hand side menu has been removed from the analysis screens. Users now move through the four-step pipeline using the **horizontal stepper** at the top of the page (Gap Analysis → Prioritization → Overview Selection → Recommendations) and the prominent **Previous step / Next step** buttons at the bottom of each screen.

**Why:** The side menu duplicated the stepper navigation, competed for visual attention, and pulled the user's focus away from the active step. Removing it gave each step the full width of the canvas and produced a calmer, more focused page.

**Outcome:** Cleaner layout, fewer simultaneous navigation paths, and a more linear, distraction-free workflow.

### 2.2 Prioritization — scoped to relevant analysis only

The Prioritization step now shows only the streams and gap-types that are actually relevant to the user's plan:

- **Empty streams are no longer surfaced.** Streams the user added but never populated with data (e.g. an empty Solid Waste Fee or Parking Fee row) are filtered out of the Stream Prioritization table, the bar chart, and the Top Gaps to Tackle ranking.
- **Stale data from previous sessions or other reports is excluded.** The page now uses the server-saved report's stream list as the authoritative allowlist, so generic streams left over in browser storage no longer leak through.
- **Removed gap priorities propagate downstream.** When a user sets a priority slot to (Remove) in the Gap Sequencing table, that gap-type is dropped from the Top Gaps to Tackle list, the master priority list, the Overview Selection cards, and the final Recommendations.
- **Visual cues for plan completeness.** Streams with one or more removed priorities now carry a "Partial plan" badge; streams with all priorities removed carry a "No plan" badge with a strikethrough on the name and a muted bar in the chart.

**Outcome:** What the user sees in Step 2 now matches the plan they have actually built — no phantom streams, no orphan gap-types.

### 2.3 Overview Selection — question-driven narrowing

The Overview Selection step now opens with a short **personalisation questionnaire** that narrows the 82-card solution library to the cards that fit the city's context:

1. **How fast do you need results?** (Quick wins, Medium-term, Long-term)
2. **Which political feasibility are you open to?** (Higher feasibility, Moderate, Lower feasibility)
3. **Where do you most want to improve?** (Compliance, Coverage, Valuation, Liability)

Once answered, the questionnaire collapses into a chip strip showing the active filters and the live count of matching cards. Users can edit the answers or skip the questionnaire entirely and browse all 82 cards. For users who open an existing or sample report (where prior selections already exist), the questionnaire is hidden automatically — they go straight to the cards.

A **"Go to Recommendations (N) →"** shortcut appears in the sidebar once five or more solutions have been selected, so power users with large plans don't have to scroll back to the bottom of the page to advance.

**Outcome:** Faster path from 82 candidate solutions to the handful that actually fit the user's context, with no extra clicks for users opening existing reports.

### 2.4 Methodology section on the landing page

A new **"How ROSRA Works"** section has been added to the public landing page, walking visitors through the four-step methodology with screenshots from the live Nairobi sample report:

- Step 1 — Gap Analysis
- Step 2 — Prioritization
- Step 3 — Overview Selection
- Step 4 — Recommendations

Each step has a short, plain-language description of what the tool does and what decisions the user makes there, followed by a **"Explore the Sample Report →"** button at the end of the section so prospective users can move from reading about the methodology to interacting with a real report in one click.

**Outcome:** Visitors landing on the home page now have a clear, visual understanding of what ROSRA does before they start their own analysis.

---

## 3. Outstanding Items — Proposed Scope for the Next Iteration

### 3.1 Top-down analysis mechanism

The bottom-up pipeline (Gap Analysis → Prioritization → Overview Selection → Recommendations) is the more developed track. The **top-down** track — comparing the city's Own-Source Revenue performance against domestic and international peers via the Performance Overview / Peer SNG analytics — needs:

- A clear walk-through of the analytical method (peer selection, benchmark calculation, indicator interpretation).
- Tighter integration with the bottom-up findings, so the two views inform each other rather than running in parallel.
- A guided journey for users whose data does not allow a full bottom-up analysis but who can still benefit from the top-down snapshot.

### 3.2 Export-report structure

The current PDF / HTML export from the Recommendations step covers the action plan but does not yet present the full ROSRA story end to end. The next iteration should design and implement an export that includes:

- An executive summary with the headline figures (actual OSR, potential OSR, total gap, top reform recommendations).
- The Gap Analysis dashboards per stream.
- The Prioritization rankings, including any (Remove) decisions and the resulting addressable gap.
- The selected solution cards grouped by stream and timeline.
- Implementation timelines and progress-tracker placeholders for ongoing reform monitoring.

The output should be print-ready, brand-consistent, and suitable for sharing with city decision-makers and development partners without further editing.

### 3.3 Data management

A clearer data-management story is needed across the application, covering:

- Where data is stored (browser storage vs. server-side report records) and how the two stay in sync.
- How users save, name, and reopen reports — including drafts versus submitted reports.
- Versioning and audit (who changed what and when).
- Data export and import (CSV upload for streams, peer-data uploads, sample-report seeding).
- Permissions and access — which users can view, edit, validate, or delete which reports.

This iteration would also tidy up the migration off temporary browser-only state into a proper server-side data model, so reports survive cleanly across sessions, devices, and users.

---

## 4. Production Status

The four completed items are live on staging and have been verified end-to-end against the Nairobi sample report:

| Item | Status |
|---|---|
| Side menu removal | Live |
| Prioritization — relevant analysis only | Live |
| Overview Selection — question-driven narrowing | Live |
| Methodology section on the landing page | Live |

---

## 5. Next Steps

1. Confirm the priority order of the three outstanding items (top-down analysis / export structure / data management) for the next iteration.
2. Agree on a delivery target for the iteration.
3. Define the acceptance criteria for each outstanding item, particularly the export-report structure (what sections, what audience, what brand template).
