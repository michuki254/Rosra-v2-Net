# ROSRA V2 — Data Management & Admin Review Module Design

**Version:** 1.0  
**Date:** 2 April 2026  
**Status:** Proposal for review  

---

## A. Executive Recommendation

### The Problem

ROSRA currently treats every saved report as a flat, undifferentiated record. There is no concept of submission status, no review workflow, no distinction between a report where a user filled only the Property Tax tab and one where they completed the full 4-step bottom-up pipeline. The admin can see all reports in a table, but cannot validate them, cannot attach review notes, cannot generate or access PDF artifacts from the admin interface, and has no way to distinguish trusted/validated data from rough drafts.

This means ROSRA's analytical outputs — which may inform municipal revenue policy — have no quality gate between user entry and consumption.

### Recommended Architecture

**Use a single `RosraReport` table with status fields and supporting satellite tables — not separate submission/snapshot entities.**

Rationale:

1. The existing `RosraReport` already stores everything: raw inputs, derived calculations (as JSON), metadata, and ownership. It has 47 fields and 14 JSON blobs. Splitting this into "submission" and "validated snapshot" would require duplicating this entire structure — or maintaining two parallel schemas that must stay in sync. For a tool of this scale and risk profile, that is unnecessary complexity.

2. Instead, the report itself should carry a `Status` field (Draft → Submitted → Under Review → Validated / Needs Revision → Archived) and a `CompletionLevel` enum (Partial / Full). Validation operates on the report directly.

3. Supporting concerns — review notes, audit history, PDF artifacts, analysis snapshots — belong in **satellite tables** that reference the report by foreign key.

**The recommended entity structure:**

| Entity | Purpose |
|--------|---------|
| `RosraReport` (existing, extended) | Single source of truth for all assessment data, inputs, and calculated results. Extended with status, completion, reviewer fields. |
| `ReviewNote` (new) | Admin comments and internal notes attached to a report, timestamped and attributed. |
| `AnalysisSnapshot` (new) | Immutable JSON snapshot of the full `RosraFormViewModel` at a point in time (e.g., at validation). Allows "view exactly what was validated." |
| `ReportArtifact` (new) | Stores generated PDF/Excel files as binary or file-system references, linked to a snapshot. |
| `AuditLog` (existing, extended) | Already captures create/update/delete. Extend to capture status transitions, reviewer assignments, and admin edits with reason. |

**Validation granularity: Report-level with stream-level completeness tracking.**

ROSRA's value proposition is the integrated gap analysis across multiple revenue streams. Validating individual streams in isolation creates a fragmented admin experience. Instead:

- Validation status lives on the **report** (the assessment as a whole).
- A computed `CompletionLevel` field indicates whether the report is Partial (some streams empty) or Full (all required streams populated).
- The admin review interface shows per-stream completeness as **informational indicators**, not separate workflow states.
- A partial report can be validated — the admin is explicitly acknowledging "this partial analysis is good enough for its purpose."

**On "validated but still editable":**

This is a governance risk. If a validated record can be silently edited, the validation becomes meaningless — you cannot trust that what you're looking at is what was reviewed. The recommended model:

- **Validated reports are locked by default.** Neither the user nor the admin can edit inline.
- **To modify a validated report, the admin must "Unlock for Revision"**, which changes status to `Needs Revision`, records the reason in the audit log, and creates a snapshot of the pre-edit state.
- **After edits, the report must be re-validated.** This creates a clear paper trail.
- This is proportionate for an internal municipal finance tool — not enterprise-heavy, but sufficient for institutional trust.

### Assumptions Made

1. "Super Admin" maps to the existing `Admin` role. I will propose renaming to `Super Admin` for clarity and adding a `Reviewer` role.
2. The existing 23-permission framework is extensible — new permissions can be added without restructuring.
3. PDF generation via QuestPDF and Excel via ClosedXML will continue to be the export stack.
4. The application will remain a server-rendered MVC app (not migrating to SPA/Blazor).
5. File storage for PDF artifacts can use the local filesystem or a database BLOB column. I recommend filesystem with database metadata for simplicity.
6. The ~14 JSON fields in `RosraReport` will continue to store calculated results alongside raw inputs. Separating inputs from outputs would require a significant refactor that is not justified at this stage.

---

## B. Critical Product/Design Observations

### Weak Points in the Request

1. **"Validated but still editable" is contradictory.** If a validated item can be freely edited, validation is a label, not a gate. The request acknowledges this uncertainty — the solution is the "unlock for revision" pattern described above.

2. **"Re-run calculations after admin edits"** is feasible but architecturally significant. Currently, gap calculations happen in two places: (a) server-side C# for Peer SNG and Frontier analysis, and (b) implicitly in the form ViewModel structure where calculated fields are populated during tab navigation. The admin would need a "Recalculate" button that re-runs the server-side logic. This is implementable but requires extracting calculation logic from the controller into dedicated service classes.

3. **"View the exact saved dashboard snapshot"** requires a point-in-time copy of the entire `RosraFormViewModel`. Currently, the report stores JSON blobs, but not a single unified snapshot. The recommended `AnalysisSnapshot` entity solves this by serializing the full ViewModel at key moments (submission, validation).

4. **Partial vs. Full distinction** is not binary in ROSRA. A report could have: only the Potential Estimates tab, only Property Tax, Property Tax + License but no Prioritization, or everything. "Partial" should mean "missing one or more non-metadata streams" — not a user-declared status.

### Unresolved Decisions

| Decision | Impact | Recommendation |
|----------|--------|----------------|
| Should users explicitly "submit" a report, or should saving automatically make it available for review? | Determines whether users can keep working drafts invisible to admins. | Add explicit Submit action. Saved-but-not-submitted = Draft (invisible to reviewers). |
| Should the Reviewer role be able to edit data, or only validate/reject? | Affects separation of duties. | Reviewers should be able to make minor corrections (typos, obvious data errors) but not substantive changes. Substantive edits should be sent back to the user. |
| Should validated reports be publishable/shareable outside the system? | Affects whether a "Published" status is needed. | Not for MVP. Add later if needed. |
| Should partial analyses be submittable for review? | Core to the request but needs product confirmation. | Yes — but the admin should clearly see what is and isn't populated. |
| Where should generated PDFs be stored? | Filesystem vs. database BLOB vs. cloud storage. | Filesystem with database metadata. Simple, sufficient for this scale. |

### Hidden Risks

1. **JSON field mutation.** The 14 JSON fields in `RosraReport` have no schema enforcement. An admin edit could produce malformed JSON that breaks deserialization. The recalculation service must validate output before saving.

2. **Concurrency during review.** If a user edits their report while an admin is reviewing it, the admin's review is based on stale data. The existing `RowVersion` concurrency token partially addresses this, but the review workflow should also check that the report hasn't been modified since the reviewer opened it.

3. **Snapshot storage growth.** Each `AnalysisSnapshot` is a full serialization of the ViewModel (~50-100 KB). At moderate scale (1,000 reports, 2-3 snapshots each), this is ~300 MB. Manageable, but implement cleanup for old draft snapshots.

---

## C. Proposed Workflow Model

### Report Lifecycle

```
                                    ┌─────────────┐
                                    │   DRAFT      │ ← User creates/saves report
                                    └──────┬───────┘
                                           │ User clicks "Submit for Review"
                                           ▼
                                    ┌─────────────┐
                                    │  SUBMITTED   │ ← Visible to reviewers
                                    └──────┬───────┘
                                           │ Reviewer opens and begins review
                                           ▼
                                    ┌─────────────┐
                                    │ UNDER REVIEW │ ← Locked from user edits
                                    └──────┬───────┘
                                          ╱ ╲
                                         ╱   ╲
                                        ▼     ▼
                            ┌───────────────┐  ┌────────────────┐
                            │   VALIDATED   │  │ NEEDS REVISION │
                            └───────┬───────┘  └───────┬────────┘
                                    │                   │ User revises & resubmits
                                    │                   └──► Back to SUBMITTED
                                    │
                                    │ Admin unlocks for revision
                                    ▼
                            ┌───────────────┐
                            │   VALIDATED   │ ← Locked, snapshot preserved
                            └───────┬───────┘
                                    │
                              (Can be Archived or Soft Deleted)
```

### Status Definitions

| Status | Who sets it | User can edit? | Admin can edit? | Visible to reviewers? |
|--------|-------------|----------------|-----------------|----------------------|
| **Draft** | System (on first save) | Yes | No (not visible) | No |
| **Submitted** | User (explicit action) | No (locked) | Minor corrections only | Yes |
| **Under Review** | Reviewer (claims it) | No | Yes (corrections + notes) | Yes (assigned) |
| **Needs Revision** | Reviewer | Yes (unlocked) | No | Yes |
| **Validated** | Reviewer | No (locked) | No (must unlock first) | Yes |
| **Archived** | User or Admin | No | No | Admin only |
| **Soft Deleted** | User or Admin | No | Admin can restore | Admin only |

### Where Statuses Live

**Report-level only.** Each `RosraReport` gets a single `Status` field.

Stream-level completeness is a **computed property**, not a stored status. The system determines which streams have data by checking whether their JSON fields are null/empty. This is displayed as an informational badge on the review screen ("Property Tax: Complete, License: Empty, Peer SNG: Complete") — but there is no per-stream workflow.

### Completion Level

Computed, not user-declared:

```csharp
public enum CompletionLevel
{
    Metadata,    // Only location/financial info filled
    Partial,     // At least one analysis stream completed
    Full         // All enabled streams + causes + recommendations populated
}
```

The admin review interface shows this as a badge: `[Partial - 3/5 streams]` or `[Full Report]`.

---

## D. Roles and Permissions Matrix

### Recommended Roles

| Role | Justification |
|------|--------------|
| **Super Admin** | Full system access. Manages users, roles, reference data. Can do everything. Already exists as "Admin". |
| **Reviewer** | **New role.** Can review, validate, and make minor edits to submitted reports. Cannot manage users or system settings. Justified because review is a distinct workflow from administration — a subject-matter expert reviewing municipal revenue data doesn't need user management access. |
| **User** | Creates and submits reports. Existing role. |

A fourth role (e.g., "Analyst" or "Read-only Viewer") is not justified at this stage. If the need arises for stakeholders who can view validated reports but not create them, it can be added later using the existing permission framework.

### Permissions Matrix

| Capability | User | Reviewer | Super Admin |
|-----------|------|----------|-------------|
| Create reports | Yes | Yes | Yes |
| Edit own draft reports | Yes | Yes | Yes |
| Submit report for review | Yes | Yes | Yes |
| View own reports (all statuses) | Yes | Yes | Yes |
| View submitted reports (all users) | No | Yes | Yes |
| Claim report for review | No | Yes | Yes |
| Add review notes | No | Yes | Yes |
| Make minor corrections to submitted data | No | Yes | Yes |
| Validate / reject reports | No | Yes | Yes |
| Unlock validated report for revision | No | No | Yes |
| Re-run calculations | No | Yes | Yes |
| View analysis snapshots | No | Yes | Yes |
| Generate/access PDF from admin | No | Yes | Yes |
| Bulk validate/archive/export | No | Yes | Yes |
| Assign reviewer to report | No | No | Yes |
| Soft delete any report | No | No | Yes |
| Restore deleted reports | No | No | Yes |
| Permanently delete reports | No | No | Yes |
| Manage users and roles | No | No | Yes |
| Upload reference data (PeerSNG, Countries) | No | No | Yes |
| View full audit history | No | Own reviews only | Yes |
| View internal review notes | No | Yes | Yes |
| Export reports (PDF/Excel) | Own only | Any submitted | Any |

### New Permissions to Add

```
"SubmitReports", "ReviewReports", "ValidateReports", "UnlockValidatedReports",
"AssignReviewers", "ReRunCalculations", "ViewReviewNotes", "AddReviewNotes",
"ViewAnalysisSnapshots", "AccessReportArtifacts", "BulkValidate"
```

These integrate into the existing `AddAuthorization` policy setup in `Program.cs`.

---

## E. Data Model / Schema Proposal

### Modified Entity: `RosraReport` (extend existing)

**New fields to add:**

| Field | Type | Purpose |
|-------|------|---------|
| `Status` | `int` (enum) | Workflow status: Draft=0, Submitted=1, UnderReview=2, NeedsRevision=3, Validated=4 |
| `CompletionLevel` | `int` (enum) | Computed on save: Metadata=0, Partial=1, Full=2 |
| `SubmittedAt` | `DateTime?` | When user submitted for review |
| `ValidatedAt` | `DateTime?` | When reviewer validated |
| `ValidatedByUserId` | `string?` | FK to reviewer who validated |
| `ReviewerUserId` | `string?` | FK to assigned reviewer (nullable = unassigned) |
| `ReviewStartedAt` | `DateTime?` | When reviewer claimed the report |
| `RevisionReason` | `string?` | Why the report was sent back for revision |
| `LatestSnapshotId` | `int?` | FK to most recent AnalysisSnapshot |

**Stores:** Raw user inputs + calculated results (existing behavior unchanged)  
**Relationships:** One-to-many with ReviewNote, AnalysisSnapshot, ReportArtifact

### New Entity: `ReviewNote`

**Purpose:** Admin/reviewer comments attached to a report. Supports threaded discussion about data quality, corrections needed, etc.

| Field | Type | Purpose |
|-------|------|---------|
| `Id` | `int` (PK) | Primary key |
| `ReportId` | `int` (FK) | Links to RosraReport |
| `AuthorUserId` | `string` (FK) | Who wrote the note |
| `Content` | `string` | Note text (max 2000 chars) |
| `NoteType` | `int` (enum) | General=0, CorrectionRequest=1, ValidationComment=2, RevisionReason=3 |
| `StreamReference` | `string?` | Optional: which stream this note refers to (e.g., "PropertyTax", "License") |
| `CreatedAt` | `DateTime` | Timestamp |
| `IsInternal` | `bool` | If true, only visible to reviewers/admins (not the submitting user) |

**Stores:** Text content only. No derived data.  
**Relationships:** Many-to-one with RosraReport, many-to-one with ApplicationUser.

### New Entity: `AnalysisSnapshot`

**Purpose:** Immutable point-in-time copy of the full analysis state. Created at submission and validation. Allows "show me exactly what was validated."

| Field | Type | Purpose |
|-------|------|---------|
| `Id` | `int` (PK) | Primary key |
| `ReportId` | `int` (FK) | Links to RosraReport |
| `SnapshotType` | `int` (enum) | Submission=0, Validation=1, PreEditBackup=2 |
| `FormDataJson` | `string` | Full serialized `RosraFormViewModel` (JSON) |
| `CreatedAt` | `DateTime` | When snapshot was taken |
| `CreatedByUserId` | `string?` | Who triggered the snapshot |
| `Label` | `string?` | Optional human-readable label |

**Stores:** Complete derived analysis state (the full ViewModel, including all calculated gap values, peer analysis results, prioritization data).  
**Immutability:** Snapshots are never updated. A new snapshot is created for each significant event.  
**Size consideration:** ~50-100 KB per snapshot. At 1000 reports with 3 snapshots each = ~300 MB. Acceptable.

### New Entity: `ReportArtifact`

**Purpose:** Stores generated PDF and Excel files linked to a specific snapshot.

| Field | Type | Purpose |
|-------|------|---------|
| `Id` | `int` (PK) | Primary key |
| `ReportId` | `int` (FK) | Links to RosraReport |
| `SnapshotId` | `int?` (FK) | Links to AnalysisSnapshot (which version this was generated from) |
| `FileName` | `string` | Generated filename |
| `FilePath` | `string` | Filesystem path to the file |
| `FileType` | `int` (enum) | PDF=0, Excel=1 |
| `FileSizeBytes` | `long` | File size |
| `GeneratedAt` | `DateTime` | When generated |
| `GeneratedByUserId` | `string?` | Who triggered generation |

**Stores:** Metadata only. Actual files on filesystem at `wwwroot/artifacts/{reportId}/`.  
**Relationships:** Many-to-one with RosraReport, many-to-one with AnalysisSnapshot.

### Extended Entity: `AuditLog` (existing)

**New fields:**

| Field | Type | Purpose |
|-------|------|---------|
| `StatusFrom` | `string?` | Previous status (for status transitions) |
| `StatusTo` | `string?` | New status |
| `Reason` | `string?` | Why the change was made (required for certain transitions) |

### Entities NOT Needed

- **Separate `UserSubmission` table:** Unnecessary — `RosraReport` with `Status` field achieves the same thing without data duplication.
- **Separate `ValidatedReport` table:** The snapshot approach preserves the validated state without requiring a parallel schema.
- **`Attachment` table:** Not needed at MVP. PDF artifacts cover the file storage need.

---

## F. Versioning and Audit Trail

### Recommended Level of Version History

**Proportionate versioning: snapshot-based, not field-level.**

For an internal municipal finance tool, field-level version history (tracking every individual field change) is overengineering. Instead:

1. **Snapshots at key lifecycle events:** A full `AnalysisSnapshot` is automatically created when:
   - User submits report for review
   - Reviewer validates the report
   - Admin unlocks a validated report for revision (pre-edit backup)

2. **Audit log for all state changes:** The existing `AuditLog` records who did what and when, extended with status transitions and reasons.

3. **No automatic snapshot on every save.** Drafts are work-in-progress — capturing every intermediate save would generate noise without value.

### Edit Behavior for Validated Records

**Edits to validated items must create a new version.**

The process:

1. Admin clicks "Unlock for Revision" on a validated report.
2. System automatically creates a `PreEditBackup` snapshot of the current state.
3. Status changes from `Validated` → `NeedsRevision`.
4. Admin (or user, if sent back) makes edits.
5. Report is re-submitted and re-validated.
6. A new `Validation` snapshot is created.
7. Both snapshots are permanently accessible — the admin can compare "Version 1 (validated 15 March)" vs "Version 2 (validated 2 April)."

**Overwriting in place is never allowed for validated records.** Draft edits overwrite in place (because drafts are work-in-progress by definition).

### Reason Requirement

| Action | Reason required? |
|--------|-----------------|
| Submit for review | No |
| Validate | No (optional comment) |
| Reject / Needs Revision | **Yes** — must explain what needs fixing |
| Unlock validated report | **Yes** — must explain why re-opening |
| Admin edit of submitted data | **Yes** — must explain what was corrected |
| Soft delete | No (optional reason) |
| Permanent delete | **Yes** |

---

## G. Saved Analysis and Report Persistence

### Dashboard Snapshot Storage

The "exact saved dashboard snapshot" is the serialized `RosraFormViewModel` — the same object that the Rosra/Index.cshtml view renders. It contains all raw inputs AND calculated results (gap values, peer analysis metrics, frontier comparisons, prioritization rankings).

**How it works:**

1. At submission time, the system serializes the full `RosraFormViewModel` to JSON and stores it in the `AnalysisSnapshot.FormDataJson` column.
2. At validation time, another snapshot is created.
3. To view a snapshot, the admin clicks "View Snapshot" → the system deserializes the JSON back into a `RosraFormViewModel` → renders the same Rosra/Index.cshtml view in read-only mode, using the snapshot data instead of the live report data.

**Implementation detail:**

```csharp
// Creating a snapshot
var formData = BuildFormViewModelFromReport(report); // existing deserialization logic
var snapshot = new AnalysisSnapshot
{
    ReportId = report.Id,
    SnapshotType = SnapshotType.Validation,
    FormDataJson = JsonSerializer.Serialize(formData),
    CreatedAt = DateTime.UtcNow,
    CreatedByUserId = currentUser.Id
};

// Viewing a snapshot
var snapshot = await _context.AnalysisSnapshots.FindAsync(snapshotId);
var formData = JsonSerializer.Deserialize<RosraFormViewModel>(snapshot.FormDataJson);
// Render in Index view with ViewMode = true
```

This approach reuses the existing view rendering pipeline — no new UI needed for snapshot display.

### PDF Report Persistence

**Current state:** PDFs are generated on-demand and streamed to the browser as a download. They are not stored.

**Proposed change:**

1. When a report is validated, the system automatically generates a PDF and stores it as a `ReportArtifact`.
2. The admin interface shows a "Download PDF" button next to each validated report.
3. PDFs are stored on the filesystem at: `App_Data/artifacts/{reportId}/{snapshotId}_{timestamp}.pdf`
4. The `ReportArtifact` table stores the metadata and file path.
5. On-demand regeneration is also available — the admin can click "Regenerate PDF" to create a new artifact from the current report state.

**Should a snapshot be immutable once created?**

**Yes, absolutely.** Snapshots are the system's proof of "this is what was reviewed and approved." If a snapshot could be modified, the audit trail loses its meaning.

- Snapshots are created, never updated.
- If the report is edited after validation, a new snapshot is created — the old one remains unchanged.
- The admin can view any historical snapshot.

---

## H. Admin UI / UX Proposal

### Screen 1: Submissions Queue (Main Review Interface)

**URL:** `/Admin/Submissions`  
**Purpose:** The primary workspace for reviewers. Shows all reports that need attention.

**Tabs:**
| Tab | Filter | Description |
|-----|--------|-------------|
| Pending Review | Status = Submitted | Reports waiting to be claimed |
| My Reviews | Status = UnderReview, ReviewerUserId = me | Reports I'm currently reviewing |
| Needs Revision | Status = NeedsRevision | Reports sent back to users |
| All Submitted | Status != Draft | Everything that's been submitted |

**Columns:**
| Column | Purpose |
|--------|---------|
| Title | Report title |
| Author | User full name + email |
| Location | Country > Region > City |
| Completion | Badge: [Full] or [Partial - 3/5 streams] |
| Status | Color-coded badge |
| Submitted | Date submitted |
| Reviewer | Assigned reviewer (or "Unassigned") |
| Actions | View, Claim, Assign (dropdown), Validate, Reject |

**Filters:** Status, Completion Level, Country, Date Range, Reviewer, Search  
**Bulk actions:** Bulk Validate, Bulk Assign Reviewer, Bulk Archive, Bulk Export (PDF/Excel)

### Screen 2: Report Detail / Review Page

**URL:** `/Admin/Review/{id}`  
**Purpose:** The main review workspace for a single report. Shows all data, allows corrections, notes, and status actions.

**Layout:** Three-column:

**Left sidebar (narrow):**
- Report metadata card (title, author, location, dates)
- Status indicator with history
- Completion checklist (which streams have data)
- Action buttons: Validate, Reject, Unlock, Save Corrections
- Snapshot links (view previous versions)
- PDF download / regenerate

**Center (main content):**
- The full report rendered in read-only mode (same as Rosra/Index.cshtml in ViewMode)
- If admin has edit permission: inline edit toggles per section
- Stream-by-stream navigation (same tab structure as the main form)

**Right sidebar (narrow):**
- Review notes panel (threaded, timestamped)
- Add note form (with NoteType selector and stream reference)
- Audit history for this report

**Key actions:**
- "Validate" → Status → Validated, creates snapshot, generates PDF artifact
- "Needs Revision" → Status → NeedsRevision, requires reason, sends back to user
- "Save Corrections" → Saves admin edits, logs changes, keeps status as UnderReview
- "Recalculate" → Re-runs server-side calculations with current data
- "View Snapshot" → Opens a specific historical snapshot in read-only mode

### Screen 3: Validated Analyses Library

**URL:** `/Admin/ValidatedReports`  
**Purpose:** A repository of all validated reports. The "institutional knowledge" view.

**Columns:**
| Column | Purpose |
|--------|---------|
| Title | Report title |
| Location | Country > Region > City |
| Financial Year | Which year was analyzed |
| Completion | Full / Partial |
| Validated By | Reviewer name |
| Validated Date | When validated |
| Snapshots | Count of snapshots |
| PDF | Download link (if artifact exists) |
| Actions | View, Export, Archive |

**Filters:** Country, Financial Year, Completion Level, Validator, Date Range  
**Bulk actions:** Bulk Export, Bulk Archive

### Screen 4: Deleted Items / Recovery

**URL:** `/Admin/DeletedReports` (already exists)  
**Enhancement:** Add status context — show what status the report was in when deleted, and who deleted it.

---

## I. API and Backend Logic

### New Service: `SubmissionService`

**File:** `Services/SubmissionService.cs`

```
SubmitForReview(int reportId, string userId)
    → Validates report has minimum required data
    → Changes Status: Draft → Submitted
    → Sets SubmittedAt
    → Computes CompletionLevel
    → Creates AnalysisSnapshot (type: Submission)
    → Logs to AuditLog

WithdrawSubmission(int reportId, string userId)
    → Only if Status == Submitted (not yet claimed)
    → Changes Status: Submitted → Draft

ClaimForReview(int reportId, string reviewerUserId)
    → Changes Status: Submitted → UnderReview
    → Sets ReviewerUserId, ReviewStartedAt
    → Logs to AuditLog

UnclaimReview(int reportId, string reviewerUserId)
    → Changes Status: UnderReview → Submitted
    → Clears ReviewerUserId
```

### New Service: `ValidationService`

**File:** `Services/ValidationService.cs`

```
ValidateReport(int reportId, string reviewerUserId, string? comment)
    → Changes Status: UnderReview → Validated
    → Sets ValidatedAt, ValidatedByUserId
    → Creates AnalysisSnapshot (type: Validation)
    → Generates PDF artifact
    → Logs to AuditLog

RejectReport(int reportId, string reviewerUserId, string reason)
    → Changes Status: UnderReview → NeedsRevision
    → Sets RevisionReason
    → Creates ReviewNote (type: RevisionReason)
    → Logs to AuditLog

UnlockForRevision(int reportId, string adminUserId, string reason)
    → Only Super Admin
    → Creates AnalysisSnapshot (type: PreEditBackup)
    → Changes Status: Validated → NeedsRevision
    → Logs to AuditLog with reason

BulkValidate(int[] reportIds, string reviewerUserId)
    → Calls ValidateReport for each
    → Returns success/failure per report
```

### New Service: `SnapshotService`

**File:** `Services/SnapshotService.cs`

```
CreateSnapshot(int reportId, SnapshotType type, string userId)
    → Loads RosraReport
    → Builds RosraFormViewModel (reuse existing deserialization logic)
    → Serializes to JSON
    → Saves AnalysisSnapshot record
    → Returns snapshot ID

GetSnapshot(int snapshotId)
    → Loads AnalysisSnapshot
    → Deserializes FormDataJson to RosraFormViewModel
    → Returns ViewModel (ready to render in view)

GetSnapshotsForReport(int reportId)
    → Returns list of snapshots with metadata (no full JSON)
```

### New Service: `ArtifactService`

**File:** `Services/ArtifactService.cs`

```
GeneratePdfArtifact(int reportId, int snapshotId, string userId)
    → Loads snapshot → Deserializes to ViewModel
    → Calls existing ReportExportService.GeneratePdfReport()
    → Saves file to filesystem
    → Creates ReportArtifact record
    → Returns artifact ID

GetArtifact(int artifactId)
    → Returns file stream for download

DeleteArtifact(int artifactId)
    → Removes file and database record
```

### New Service: `CalculationService`

**File:** `Services/CalculationService.cs`

**Purpose:** Extracts calculation logic from `RosraController` into a reusable service. This is necessary so that the admin "Recalculate" button can re-run calculations without going through the form submission pipeline.

```
RecalculatePeerAnalysis(RosraFormViewModel model)
    → Runs the Peer SNG analysis logic (currently in RosraController lines 1860-2100)
    → Updates model.PeerSNGData with new results
    → Returns updated model

RecalculateFrontierAnalysis(RosraFormViewModel model)
    → Runs frontier comparison logic (currently in RosraController lines 1510-1630)
    → Returns updated model

RecalculateStreamGaps(RosraFormViewModel model)
    → Recalculates gap values for all streams based on current inputs
    → Returns updated model

RecalculateAll(RosraFormViewModel model)
    → Calls all above methods
    → Returns fully recalculated model
```

### New Controller: `SubmissionController`

**File:** `Controllers/SubmissionController.cs`

```
[Authorize]
POST  /Submission/Submit/{id}         → SubmissionService.SubmitForReview
POST  /Submission/Withdraw/{id}       → SubmissionService.WithdrawSubmission

[Authorize(Roles = "Admin,Reviewer")]
GET   /Submission/Queue               → Submissions queue page
GET   /Submission/Review/{id}         → Detail review page
POST  /Submission/Claim/{id}          → SubmissionService.ClaimForReview
POST  /Submission/Validate/{id}       → ValidationService.ValidateReport
POST  /Submission/Reject/{id}         → ValidationService.RejectReport
POST  /Submission/SaveCorrections/{id}→ Save admin edits to report
POST  /Submission/Recalculate/{id}    → CalculationService.RecalculateAll
POST  /Submission/BulkValidate        → ValidationService.BulkValidate
POST  /Submission/BulkAssign          → Assign reviewer to multiple reports

[Authorize(Roles = "Admin")]
POST  /Submission/Unlock/{id}         → ValidationService.UnlockForRevision

GET   /Submission/Snapshot/{id}       → View historical snapshot
GET   /Submission/Artifact/{id}       → Download PDF/Excel artifact

[Authorize(Roles = "Admin,Reviewer")]
GET   /Submission/Validated           → Validated analyses library
POST  /Submission/AddNote/{reportId}  → Add review note
GET   /Submission/Notes/{reportId}    → Get review notes
```

---

## J. Security and Access Considerations

### Role-Based Access

- All submission/review endpoints require authentication.
- Review actions require `Reviewer` or `Admin` role.
- Destructive actions (unlock, permanent delete) require `Admin` role only.
- Users can only see their own reports in Draft status. Submitted+ reports are visible to reviewers.

### Edit Restrictions

- **Draft:** Only the owner can edit.
- **Submitted / Under Review:** Only the assigned reviewer (or admin) can make corrections. Corrections are logged.
- **Validated:** Nobody can edit without first unlocking (Admin only, requires reason).
- **Needs Revision:** Only the owner can edit (making their corrections). Reviewer can add notes.

### Auditability

- Every status transition is logged in `AuditLog` with: who, when, from-status, to-status, reason (if applicable).
- Admin edits to report data are logged with field-level change descriptions.
- Review notes are immutable (cannot be edited or deleted after creation).

### Protection Against Accidental Overwrite/Deletion

- Concurrency token (`RowVersion`) prevents silent overwrites during simultaneous edits.
- Soft delete for all deletions. Permanent delete requires Admin + confirmation.
- Validated reports are locked by default — the "unlock" action is an explicit, audited step.
- Snapshots are immutable — even if the live report is corrupted, the validated snapshot is safe.

### File/Report Access

- PDF artifacts are stored on the filesystem, not publicly accessible via URL.
- Access goes through a controller action that checks authorization before streaming the file.
- File paths are not exposed to the client.

---

## K. Documentation Artifacts

### 1. Architecture Note
- System overview diagram
- Component relationships (Controllers, Services, DbContext, Views)
- Data flow diagrams (submission → review → validation → artifact generation)
- Technology stack summary

### 2. Data Model / ERD
- Entity relationship diagram showing all tables
- Field-level detail for new entities
- Migration plan from current schema

### 3. Roles and Permissions Matrix
- Full matrix as in Section D above
- Permission-to-policy mapping for Program.cs
- Default role assignments

### 4. Workflow / State Diagram
- Status transition diagram as in Section C
- Decision points and conditions for each transition
- Actor responsibility per transition

### 5. Audit / Versioning Logic Note
- What gets audited and when
- Snapshot creation triggers
- Retention policy for snapshots and audit logs

### 6. API Spec / Endpoint Inventory
- Full endpoint list with HTTP methods, parameters, responses
- Authorization requirements per endpoint
- Request/response examples

### 7. Admin UI Wireframe Descriptions
- Screen-by-screen layout descriptions
- Component specifications (tables, filters, action bars)
- Navigation flow between screens

### 8. Implementation / Migration Plan
- Phased delivery plan (Section L below)
- Database migration strategy
- Feature flag approach for gradual rollout

### 9. Test Cases / Acceptance Criteria
- Per-feature acceptance criteria (Section M below)
- Edge cases (concurrent edits, partial data, permission boundaries)

---

## L. Implementation Plan

### Phase 1: Foundation (MVP) — Weeks 1-3

**Goal:** Status workflow, submission, and basic review.

1. Add `Status`, `CompletionLevel`, submission-related fields to `RosraReport`. Create migration.
2. Create `ReviewNote` entity and migration.
3. Create `AnalysisSnapshot` entity and migration.
4. Create `SubmissionService` and `ValidationService`.
5. Add "Submit for Review" button to user Dashboard.
6. Build Submissions Queue page (`/Admin/Submissions`) with tabs and filtering.
7. Build basic Review Detail page (read-only report view + status actions + notes).
8. Add `Reviewer` role with appropriate permissions to `DbInitializer`.
9. Lock report editing based on status (Draft = editable, Submitted+ = locked for user).
10. Create snapshots on submission and validation.

**Deliverable:** Users can submit, reviewers can validate/reject, status is tracked.

### Phase 2: Admin Editing & Recalculation — Weeks 4-5

1. Extract calculation logic from `RosraController` into `CalculationService`.
2. Add inline edit capability to Review Detail page (for reviewer corrections).
3. Add "Recalculate" button that calls `CalculationService`.
4. Add "Unlock for Revision" action (Super Admin only).
5. Add reviewer assignment UI (assign dropdown in queue, bulk assign).
6. Extend audit logging with status transitions and edit reasons.

**Deliverable:** Admins can make corrections, recalculate, and manage the review pipeline.

### Phase 3: Artifacts & Snapshots — Weeks 6-7

1. Create `ReportArtifact` entity and migration.
2. Create `ArtifactService` for PDF/Excel generation and storage.
3. Auto-generate PDF on validation.
4. Add "View Snapshot" action to review page (renders historical ViewModel).
5. Build Validated Analyses Library page.
6. Add PDF download links to admin interfaces.
7. Add snapshot comparison view (side-by-side two snapshots).

**Deliverable:** Full artifact persistence, historical snapshots, validated report library.

### Phase 4: Bulk Operations & Polish — Week 8

1. Bulk validate, bulk assign, bulk export from queue.
2. Email/notification stubs for status changes (if email infrastructure exists).
3. User-facing status indicators on Dashboard (show report status, revision requests).
4. Performance optimization (index `Status` column, cache common queries).

### Later / Optional

- Email notifications on status changes
- Department/region-based access scoping
- Export validation statistics (how many reports validated per month, by region)
- Published status for external sharing
- Scheduled auto-archive for reports older than N years
- API endpoints for external systems to query validated data

---

## M. Acceptance Criteria

### AC-1: Report Submission
- Given a user with a saved Draft report, when they click "Submit for Review", then the status changes to Submitted, SubmittedAt is set, an AnalysisSnapshot is created, and the report is no longer editable by the user.
- Given a report with only the Potential Estimates tab filled, it should be submittable as a Partial report.
- Given a Submitted report that has not been claimed, the user can withdraw the submission (returns to Draft).

### AC-2: Completion Level
- A report with only location/financial metadata but no stream data = `Metadata`.
- A report with at least one non-empty stream JSON field = `Partial`.
- A report with all of: at least one stream, ProblemStatement, RecommendationSummary = `Full`.
- CompletionLevel is displayed as a badge on all admin list views.

### AC-3: Review Queue
- Reviewers see all Submitted, UnderReview, and NeedsRevision reports.
- Reports are filterable by status, completion level, country, and date range.
- Reviewers can claim an unassigned Submitted report (changes to UnderReview).
- Super Admins can assign any reviewer to any report.

### AC-4: Validation
- When a reviewer validates a report, status changes to Validated, a snapshot is created, and a PDF artifact is generated.
- Validated reports appear in the Validated Analyses Library.
- Validated reports cannot be edited without Admin unlock.

### AC-5: Rejection
- When a reviewer rejects a report, they must provide a reason.
- The reason is stored as a ReviewNote and in the RevisionReason field.
- The user can see the rejection reason and edit their report.
- After editing, the user re-submits (new Submission snapshot created).

### AC-6: Admin Corrections
- A reviewer viewing a Submitted/UnderReview report can make minor edits.
- Each edit requires a reason, logged in the audit trail.
- The "Recalculate" button re-runs server-side analysis and updates calculated fields.

### AC-7: Snapshots
- A snapshot is created on: submission, validation, and pre-edit backup.
- Clicking "View Snapshot" renders the historical data in the same Rosra form view (read-only).
- Snapshots cannot be modified or deleted.

### AC-8: PDF Artifacts
- Validated reports have a PDF automatically generated.
- The PDF is downloadable from the Validated Analyses Library and the Review Detail page.
- Regenerating a PDF creates a new artifact (old one remains).

### AC-9: Audit Trail
- Every status change is logged with: user, timestamp, from-status, to-status, reason.
- Admin edits to report data are logged with changed field descriptions.
- Audit logs are viewable by Super Admins on the report detail page.

### AC-10: Permissions
- Users cannot access review queue or validated library.
- Reviewers cannot unlock validated reports or manage users.
- Super Admins can do everything.

---

## N. Recommendation on Naming

### Module Name

**"Assessment Review & Validation"**

Rationale:
- "Assessment" is the correct domain term — ROSRA produces revenue gap *assessments*, not generic "reports" or "submissions."
- "Review & Validation" communicates the workflow nature.
- Avoids the word "management" which is vague.

### Naming for Specific Concepts

| Concept | Recommended Term | Avoid |
|---------|-----------------|-------|
| A saved analysis | Assessment | Report, Submission, Record |
| The review workflow | Assessment Review | Approval Process |
| A validated assessment | Validated Assessment | Approved Report |
| The library of validated work | Validated Assessments Library | Report Repository |
| The review queue | Review Queue | Inbox, Pending Items |
| Per-stream data completeness | Stream Coverage | Completion %, Fill Rate |
| A historical snapshot | Assessment Snapshot | Version, Copy, Backup |
| Generated PDF/Excel | Assessment Artifact | Export, Document |
| Admin corrections | Reviewer Corrections | Edits, Modifications |

### In-App Labels

- Dashboard section: "My Assessments" (user), "Review Queue" (reviewer), "Validated Assessments" (library)
- Status badges: Draft, Submitted, Under Review, Needs Revision, Validated
- Action buttons: "Submit for Review", "Claim for Review", "Validate", "Request Revision", "Unlock for Revision"

---

## O. Final Output Summaries

### 1. Architecture Summary

Extend the existing ASP.NET Core MVC application with:
- 4 new database entities (ReviewNote, AnalysisSnapshot, ReportArtifact, extended AuditLog)
- 5-6 fields added to existing RosraReport
- 4 new services (SubmissionService, ValidationService, SnapshotService, ArtifactService, CalculationService)
- 1 new controller (SubmissionController)
- 1 new role (Reviewer) with ~11 new permissions
- 4 new admin views

No new technology stack. No architectural rewrite. Builds on existing EF Core, Identity, QuestPDF, ClosedXML.

### 2. Schema Summary

```
RosraReport (extended)
  + Status (enum), CompletionLevel (enum)
  + SubmittedAt, ValidatedAt, ValidatedByUserId
  + ReviewerUserId, ReviewStartedAt, RevisionReason
  + LatestSnapshotId

ReviewNote (new)
  ReportId FK, AuthorUserId FK
  Content, NoteType, StreamReference, IsInternal
  CreatedAt

AnalysisSnapshot (new)
  ReportId FK, SnapshotType, FormDataJson
  CreatedAt, CreatedByUserId, Label

ReportArtifact (new)
  ReportId FK, SnapshotId FK
  FileName, FilePath, FileType, FileSizeBytes
  GeneratedAt, GeneratedByUserId

AuditLog (extended)
  + StatusFrom, StatusTo, Reason
```

### 3. Workflow Summary

```
Draft → Submitted → Under Review → Validated
                                  → Needs Revision → (user edits) → Submitted
Validated → (Admin unlock) → Needs Revision → Submitted → Under Review → Validated
Any status → Archived, Soft Deleted
```

### 4. Admin UI Summary

| Screen | Primary Users | Key Feature |
|--------|--------------|-------------|
| Review Queue | Reviewers, Admins | Claim, filter, bulk actions on submitted assessments |
| Review Detail | Reviewers | Full read-only view + corrections + notes + status actions |
| Validated Library | Reviewers, Admins | Browse validated assessments, download PDFs, view snapshots |
| Deleted Items | Admins | Restore or permanently delete |

### 5. Open Questions for Product Owner

1. **Should users be notified (email or in-app) when their assessment status changes?** This affects whether notification infrastructure is needed in Phase 1.

2. **What defines "minimum submittable data"?** Must a user fill at least one full stream, or is location + financial metadata enough to submit?

3. **Should the Reviewer role be able to create assessments, or only review them?** The current proposal allows it, but it could be restricted.

4. **Is there a need for assessment "templates" or "cloning"?** E.g., can a validated assessment for Nairobi 2024 be duplicated as a starting point for Nairobi 2025?

5. **Should review notes be visible to the submitting user?** The current proposal has an `IsInternal` flag — but the default behavior needs to be decided.

6. **What is the retention policy for snapshots and artifacts?** Should old draft snapshots be automatically cleaned up after validation?

7. **Is there a geographic/organizational scoping need?** E.g., should a reviewer assigned to "East Africa" only see reports from that region?

8. **Should the PDF artifact include a "Validated by [Name] on [Date]" stamp?** This would modify the QuestPDF template.

9. **Will there be bulk data import of historical assessments that bypass the review workflow?** If so, a "Legacy Import" status may be needed.

10. **Is there an anticipated scale ceiling?** (e.g., 100 reports/year vs 10,000) This affects indexing and storage decisions.
