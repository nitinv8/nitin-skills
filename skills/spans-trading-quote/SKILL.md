---
name: "spans-trading-quote"
description: "Spans supply-only quotes for named equipment, own-fabricated items, consumables/spares or partner packages against an enquiry/PR: costing Google Sheet + Google Doc offer in 00 Proposal."
---

# Spans Envirotech — Trading / Supply Quotation (WTP · STP · ETP equipment)

Use this when the client (end user, EPC contractor or consultant) asks Spans to **supply specific
items** against their spec, enquiry or purchase requisition: e.g. DAF units, screens and gates,
mixers, blowers, pumps, media, skimmers, biogas safety trains, membranes, chemicals, spares, or an
evaporator/ZLD package from a partner. Supply may include P&F, freight, supervision of erection.
Examples: P-2648 Nirani (5 ETP packages, supply only, freight incl.), P-2645 VA Tech Wabag (screens &
gates, 35 % markup).

Not this skill: whole plant design+build → `spans-epc-proposal`; engineering services →
`spans-consulting-proposal`.

Deliverables — **Google files in the project's `00 Proposal` folder** (see "Output to Google Drive"):
1. **Google Sheet** `P-XXXX [Client] Supply Costing Rev[N]` — tabs: Enquiry Register · Cost Build-up
   (INTERNAL) · Price Schedule · Rev History.
2. **Google Doc** `P-XXXX [Client] Supply Offer Rev[N]`.
3. If the client gave their own price-bid format: fill a copy of it and save it in `00 Proposal` too
   (Google Sheet if theirs is a spreadsheet; keep their layout).
4. **PDF** of the Doc, only when Nitin says it's ready to send.
Doc ref: `SPANS/P-XXXX/SUP-001/REV-N`.

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
- Read the enquiry, PR and annexures from the project folder / `10 Data From Client`.

**2. Build, then upload with conversion.** Build the costing workbook with openpyxl and the offer with
docx-js locally, recalculate, then upload each to `00 Proposal` with Drive `create_file`:
- Sheet: `base64Content` of the .xlsx, `contentMimeType: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `parentId` = 00 Proposal id.
- Doc: `base64Content` of the .docx, `contentMimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document`, same `parentId`.
- If an upload fails or is too large, create an empty Google Sheet/Doc in the folder
  (`contentMimeType` `application/vnd.google-apps.spreadsheet` / `.document`, no content) and fill it
  with the Sheets connector (`update_formulas`, `update_values`, `update_spreadsheet`) or Docs
  connector (`update_doc`).

**3. Verify in Google.** Sheet: `get_values` on item totals and the grand total — formulas must
evaluate after conversion. Doc: `read_file_content` to check the price schedule matches the Sheet;
export PDF and look at the price page and one datasheet (white text on dark header rows).

**4. Revisions and edits.** New Rev = new Google file with the new Rev in its title, same folder;
never overwrite an earlier Rev. Changes within a Rev are made in place with the Docs/Sheets connectors
(same link) after re-reading the file. The Rev History tab in the latest Sheet carries all Revs.

**5. Internal vs client.** The costing Sheet (costs, margins, vendor names) is never shared with the
client. The client gets the Doc/PDF and, if needed, a separate Price Schedule sheet.

**6. Report** each file as a link in one line. If the Drive, Docs or Sheets connector is missing or
off, stop and tell Nitin which one to turn on — don't fall back to local files silently.

---

## Shared Spans conventions
- Drive: `Spans - ACTIVE PROJECTS > P-XXXX ...` → `00 Proposal`, `10 Data From Client` (enquiry, PR,
  datasheets, annexures). Read every annexure — specs hide there.
- After each Rev, write/update `P-XXXX <client> - supply quote.md` in the claude.ai Project (line items,
  cost by Rev, price, terms, open clarifications, links to the Google files).
- Brand palette and docx white-text-on-dark-fill rule exactly as in `spans-epc-proposal`.

---

## Step 1 — Enquiry register
One row per line item, keeping the **client's numbering** (enquiry no., PR no., item no.):
`Item | Client spec summary | Qty | MOC | Standards / make list | Delivery point | Required date |
Category | Spec compliance (Comply / Deviation / Clarify)`.
Categories (drive sourcing and margin):
- **Bought-out resale** — vendor equipment sold on (blowers, pumps, instruments, media, valves).
- **Own-fabricated** — made by Spans or our fabricator (screens, gates, DAF tanks, skimmers, steel tanks).
- **Consumables & spares** — chemicals, membranes, media top-up, spares.
- **Partner package** — e.g. evaporator/ATFD/ZLD from a partner. Don't name the partner in any
  client-facing document unless Nitin says to.

## Step 2 — Technical sanity check (don't skip)
Re-check each item against its duty with a quick calculation (e.g. DAF hydraulic and solids loading,
saturator recycle, pump head/flow, blower air demand, polymer make-up hours, screen open area). Do not
redesign the client's plant — raise mismatches as clarifications and quote to spec unless Nitin
decides otherwise. Typical finds: client's tank lasts only 3 h of dosing; a stated removal % conflicts
with a stated outlet limit; motor/kW undersized; ATEX zone not stated.

## Step 3 — Cost build-up (INTERNAL)
**Bought-out:** vendor quote for this job, else Spans Costing Database (`search_quotes`,
`estimate_item_cost`) — cite vendor and quote date, escalate old quotes, note exclusions (GST, freight,
E&C usually excluded). Get ≥ 2 quotes for any item above ₹5 L.
**Own-fabricated:** steel weight (plate/sections by MOC, show the weight estimate) × ₹/kg (e.g. SS304
~₹380/kg used on P-2648, Oct 2026 — confirm current) + bought-outs + machining + surface treatment /
pickling-passivation + testing + engineering & drawings + packing. Benchmark against any past bids
(e.g. Britannia DAF bid comparison) and scale by size, not by guess.
**Consumables & spares:** unit price, MOQ, shelf life, lead time; short validity.
**Partner package:** partner's price + Spans scope (interfaces, coordination, any local bought-outs).
Then per line: P&F, freight to delivery point (actual quote or estimate, stated separately),
transit insurance, inspection/TPI if asked, supervision of E&C (man-days × rate) if asked.
Mark each line's source: green = quote/DB, amber = judgement (goes on the "get quotes" list).

## Step 4 — Pricing rule (margin % by category)
Selling = cost × (1 + margin). Defaults are **to be confirmed by Nitin** — use his latest values:

| Category | Default margin |
|---|---|
| Bought-out resale | 15 % |
| Own-fabricated | 30 % (Wabag screens & gates went at 35 %) |
| Consumables & spares | 20 % |
| Partner package | 10 % |
| Supervision / services | 25 % |
| Freight, insurance | 0 % (pass-through) |

If Nitin says he will add margin himself, set the margin cells to 0 % and say so (P-2648 did this).
Show effective overall margin on the internal tab. Never cut cost lines to reach a price; change
margin and record why. Keep a **Rev History** tab (cost and price per item per Rev, reason for
change); a Rev that wrongly cut costs is marked withdrawn, not overwritten.

## Step 5 — Offer Doc
1. Covering letter (1 page): reference to enquiry/PR, what we quote, headline total, validity.
2. Price schedule in the client's line order: unit price, qty, amount; P&F and freight shown as the
   client asked (included or separate); GST extra with HSN code and rate.
3. Technical datasheet per item: duty, size, MOC, motor/kW, make, standards, scope of supply, documents.
4. Compliance / deviation statement against the client spec; clarifications list from Step 2.
5. Make list (offered makes, "or equivalent" only if allowed).
6. Commercial terms (defaults — confirm per job): price basis (ex-works or FOR site); payment
   (e.g. advance with PO, balance against proforma before dispatch, retention after commissioning);
   delivery in weeks from PO and drawing approval; warranty 12 months from commissioning or 18 months
   from supply, whichever is earlier; validity 30 days with steel price variation clause; LD capped
   (≤ 5 %) only if the client insists; exclusions (civil, unloading, erection unless quoted, power,
   utilities, statutory permissions).

## Step 6 — Quality check
- [ ] Every enquiry line is priced or explicitly regretted; client numbering kept
- [ ] Sanity check done; mismatches raised as clarifications
- [ ] Every cost line has a source and date; amber lines listed for vendor quotes
- [ ] Category margins applied (or 0 % if Nitin adds his own); effective margin shown
- [ ] Rev History updated; Google Sheet formulas evaluate; Doc totals = Sheet; GST/HSN correct
- [ ] Sheet and Doc are native Google files in the project's `00 Proposal` folder, titled with P-XXXX and Rev; earlier Revs untouched
- [ ] Costing Sheet not shared with client; no partner name in client documents unless approved
- [ ] Ref `SPANS/P-XXXX/SUP-001/REV-N`; Project doc updated with links; PDF checked