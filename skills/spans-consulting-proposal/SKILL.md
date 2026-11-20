---
name: "spans-consulting-proposal"
description: "Spans engineering consultancy proposals for WTP/STP/ETP/ZLD: feasibility/DPR, detailed engineering, tender docs & TBE, PMC, audits. Man-day fee Google Sheet + Google Doc offer in 00 Proposal."
---

# Spans Envirotech — Engineering Consultancy Proposal (WTP · STP · ETP)

Use this when the client is buying **engineering services, not a plant**: feasibility/DPR, concept or
detailed engineering, tender documents and technical bid evaluation (TBE), vendor document review,
PMC/site supervision, or an audit/troubleshooting study of an existing plant. Includes Spans acting as
**sub-consultant** to another consultant or EPC (e.g. P-2671 for Fichtner).

Not this skill: a price to build the plant → `spans-epc-proposal`; supply of named equipment →
`spans-trading-quote`. If an RFQ mixes both, ask Nitin which offer to make (or make two).

Deliverables — **Google files in the project's `00 Proposal` folder** (see "Output to Google Drive"):
1. **Google Sheet** `P-XXXX [Client] Consultancy Fee Estimate Rev[N]` — INTERNAL. Phase × role
   matrix, formula-driven, yellow inputs (man-days, rates), totals, fee as % of project capex.
2. **Google Doc** `P-XXXX [Client] Consultancy Proposal Rev[N]`.
3. **PDF** of the Doc, only when Nitin says it's ready to send.
4. Generator scripts saved as plain-text files in `00 Proposal/_generators`.
Doc ref: `SPANS/P-XXXX/ECS-001/REV-N`.

---

## Output to Google Drive (applies to every deliverable)

No local .xlsx/.docx is the deliverable — everything ends up as a native Google Sheet / Google Doc
in the selected project's `00 Proposal` folder. Read the `google-workspace` skill (and its
`references/sheets.md`, `references/docs.md`) before the first Drive/Docs/Sheets call.

**1. Find the folder first.**
- Drive `search_files`: `title contains 'P-XXXX' and mimeType = 'application/vnd.google-apps.folder'`
  (project folders live under `Spans - ACTIVE PROJECTS`; if nothing comes back, also try
  `sharedWithMe = true`, then search by client name).
- Then `parentId = '<project folder id>' and title contains '00 Proposal' and mimeType = 'application/vnd.google-apps.folder'`.
- More than one match → ask Nitin which. No project folder → ask; don't create one. Project folder
  exists but no `00 Proposal` → create it inside the project folder and say so.
- Read the RFQ and client inputs from the project folder / `10 Data From Client` (`read_file_content`).

**2. Build, then upload with conversion.** Build the fee workbook with openpyxl and the proposal with
docx-js locally, recalculate, then upload each to `00 Proposal` with Drive `create_file`:
- Sheet: `base64Content` of the .xlsx, `contentMimeType: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `parentId` = 00 Proposal id.
- Doc: `base64Content` of the .docx, `contentMimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document`, same `parentId`.
- If an upload fails or is too large, create an empty Google Sheet/Doc in the folder
  (`contentMimeType` `application/vnd.google-apps.spreadsheet` / `.document`, no content) and fill it
  with the Sheets connector (`update_formulas`, `update_values`, `update_spreadsheet`) or Docs
  connector (`update_doc`).

**3. Verify in Google.** Sheet: `get_values` on totals — formulas must evaluate after conversion.
Doc: `read_file_content` to check the fee table matches the Sheet; export PDF and look at cover and fee
page (white text on dark header rows).

**4. Revisions and edits.** New Rev = new Google file with the new Rev in its title, same folder;
never overwrite an earlier Rev. Changes within a Rev are made in place with the Docs/Sheets connectors
(same link) after re-reading the file.

**5. Internal vs client.** The fee estimate Sheet (day rates, man-days) is never shared with the client
unless the RFQ asks for the breakup.

**6. Report** each file as a link in one line. If the Drive, Docs or Sheets connector is missing or
off, stop and tell Nitin which one to turn on — don't fall back to local files silently.

---

## Shared Spans conventions
- Drive: `Spans - ACTIVE PROJECTS > P-XXXX ...` → `00 Proposal` (outputs), `10 Data From Client` (RFQ etc.).
- After each Rev, write/update `P-XXXX <client> - consultancy proposal.md` in the claude.ai Project
  (RFQ scope, rate card used, man-day table, fee, timeline, terms, exclusions, links to the Google files).
- Brand palette and docx white-text-on-dark-fill rule exactly as in `spans-epc-proposal`
  (navy `1F4E79`, blue `2E75B6`, green `1F6B3A`, yellow inputs, `DARK_BG` auto-white in `makeCell`).

---

## Step 1 — Read the RFQ and pin down the bounds
Extract into a table before pricing anything:
- Who we work for (owner / owner's consultant / EPC) and the end client & site.
- Plant: type (WTP/STP/ETP/ZLD), capacity, known scheme, standards (name them; check current
  CPCB/SPCB/NGT/IS limits for the location rather than quoting from memory).
- Phases and deliverables asked for, in the client's own numbering.
- **Effort drivers**: number of schemes to evaluate, number of drawings/datasheets, number of offers in
  TBE, revisions per vendor document, review turnaround (days), site visits, meetings, duration.
- Price format required (e.g. lump sum per phase + GST) and any submission template.
If an effort driver is not stated, assume a number and write it into the offer — that number is what
protects the fee.

## Step 2 — Service modules (pick, rename to match the RFQ)
- **A. Feasibility / DPR** — site visit, data review, sampling/treatability plan, 2–3 scheme options,
  mass balance, PFDs, preliminary sizing, CAPEX/OPEX (±25 %), recommendation, DPR report.
- **B. Concept / basic engineering** — DBR, mass & water balance, PFD, preliminary P&ID, layout,
  CAPEX/OPEX (±15–20 %), client approval.
- **C. Detailed engineering** — hydraulic profile, P&IDs, GA/layout, equipment datasheets & specs,
  electrical load list, SLD inputs, I/O list, control philosophy, BOQ, civil input drawings
  (structural design only if in scope).
- **D. Tender support** — tender technical spec, BOQ, performance guarantees & LDs, evaluation criteria,
  pre-bid replies, TBE of N offers, technical evaluation report and recommendation.
- **E. Post-award review** — vendor document review (N revisions/doc, X-day turnaround), comment
  resolution, design review meetings.
- **F. PMC / site** — supervision visits, FAT/inspection, commissioning witness, PG test review.
- **G. Audit / O&M review / troubleshooting** — site visit and sampling, unit-by-unit performance and
  capacity check, root-cause of non-compliance or odor, gap list, upgrade options with budget costs.
What each module needs technically by plant type (inputs, standards, typical trains) is in
`spans-epc-proposal` Step 2 — reuse it for the "Understanding & Approach" section.
Deliverables Spans produces under these modules (DBR, DPR, specs, TER) are also Google Docs/Sheets in
the project's Drive folders — say so in the offer.

## Step 3 — Fee build-up (man-days × rate)
Rate card (₹/man-day, from P-2671, Oct 2026 — confirm with Nitin before each use):

| Role | Rate |
|---|---|
| Project Manager | 30,000 |
| Senior Expert (ETP/ZLD/process) | 50,000 |
| Project Engineer | 12,500 |
| Designer / Draughtsman | 7,500 |

Build the matrix per phase: man-days by role → fee. Reference shape from P-2671 (800 KLD RO-reject
PTP+RO+ZLD, 4 phases): Concept 29 MD, Tender docs 46, TBE (5 offers) 18, Post-award (4 revs avg) 39 —
132 MD, ₹24.15 L. Scale from it by effort drivers, not by plant capacity alone.
Add separately: site visit days at role rates; travel & stay at actuals (or lump sum if the client
wants a firm price); lab/treatability at actuals by an approved lab.
On the internal sheet also show: fee ÷ estimated project capex (%) and fee per man-day blended, so
Nitin can judge it against the market. Margin is inside the day rates — do not add another margin line.

## Step 4 — Proposal Doc structure
1. Cover (prepared for, by, ref, date)
2. Understanding of the project (plant, objective, constraints — in our words, shows we read the RFQ)
3. Scope of services by phase — table: Phase | Activities | Deliverables | Client inputs needed
4. Approach & methodology (how we evaluate schemes, design basis principles, review process)
5. Team & key personnel (roles, short profiles; relevant Spans references)
6. Schedule — week-by-week table; show client/owner hold points (approvals, bidding) explicitly
7. Fee schedule — in the client's requested format (lump sum per phase + GST 18 %); show the man-day
   breakup only if the RFQ asks for it
8. Assumptions that bound the fee (offers, revisions, turnaround, visits, duration)
9. Commercial terms — billing per phase/milestone (post-award monthly pro-rata), payment within 30 days,
   extra work/revisions/offers at the day rates, travel at actuals, taxes extra, validity 60 days
10. Exclusions — lab/treatability tests, surveys/geotech, structural design, statutory approvals,
    procurement, supervision and commissioning attendance (unless scoped), plant performance
11. Liability — design based on client-furnished data; Spans not responsible for EPC contractor's
    performance; aggregate liability capped at the fee; no consequential loss

## Step 5 — Quality check
- [ ] Every RFQ deliverable appears in the scope table with the client's numbering
- [ ] Every effort driver is stated as an assumption in the offer
- [ ] Fee Sheet formulas evaluate in Google; totals match the Doc's fee table; GST shown separately
- [ ] Schedule fits the client's duration and shows client hold points
- [ ] Exclusions and liability clauses present; validity stated
- [ ] Sheet and Doc are native Google files in the project's `00 Proposal` folder, titled with P-XXXX and Rev; earlier Revs untouched
- [ ] Fee Sheet not shared with client unless asked; PDF export checked
- [ ] Ref `SPANS/P-XXXX/ECS-001/REV-N`; Project doc updated with links