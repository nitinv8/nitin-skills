---
name: spans-etp-proposal
description: "Spans EPC proposal for an ETP/STP (incl. recycling, RO, ZLD): Excalidraw block scheme + PNG, Sizing Sheet, BoQ cost sheet and Google Slides deck, all in the project's 00 Proposal folder."
---

# Spans Envirotech — ETP Proposal (EPC / turnkey)

Use when Nitin or the Spans team needs a proposal for Spans to **design, supply, install/supervise and
commission** an effluent or sewage treatment plant: new, expansion or upgrade, with or without
recycling/RO/ZLD. A client name + flow + lab data or an RFQ is enough to start.

Not this skill: pure engineering-hours jobs (DPR, tender docs, TBE, PMC, audit) → `spans-consulting-proposal`;
named equipment/spares supply against a PR → `spans-trading-quote`.

Reference jobs this skill is built from (open them when in doubt about format or wording):

| Job | What to borrow | Drive IDs |
|---|---|---|
| P-2511 BIL Rudrapur (40 KLD food ETP upgrade) | Deck: changes-since slide, quality by stage, PGT, optional items, cost bridge, OPEX + caps. Cost sheet: BoQ Tracker | Deck `14TWLf0VRPINXSeyNUy_q3lGb3VcehxH7MsRcTq4inAc`; Tracker `1FmkXm35pr5NY2J2JED7K-GjgDsVbfTy8TpF-w-t6dQM`; Block scheme `BIL Rudrapur Updated Block Scheme (19-Nov-2026).excalidraw` `1-P-sKaRnCCYmXt7vihqO6ZuzPM4QUkA3` |
| P-2603 JBM Gwalior / BIL (60 KLD upgrade) | Existing-ETP bottleneck table, "use of existing units" table, unit sizing tables | Deck `1U3txUthsxipoVs9sC6c-Y2XD3PopaauUCRzwd7iTNE0` |
| P-2624 Greenwave PET (500 KLD ETP-ZLD) | Cost sheet with Negotiations tab; UF/RO/HRSCC/MEE+ATFD package costs for scaling | Cost estimate `1jjB1uQGDjctytACjy1zTtat7gPeIiHAc7LpFn3YzISg` |
| P-2513 Graviss (100 KLD expansion, GFS tanks) | Summary dashboard + Engineering & PMC man-day tab; integration-with-existing slide; civil-by-client slide; makes list | Deck `12zV3yr4mwXhnGYD5bKJUy_sTjtsTG03SUPo_NHAkJaE`; Cost `1_mNdV44YHMkFOgIjwfPSYzgtU2QrffkOQUG9mFzuvbM` |
| P-2661 RSPL Kanpur (1,250 KLD dairy ETP-ZLD) | Deck structure (technical/commercial dividers, basis-of-offer, water-balance diagram, key civil units with volume + HRT) | Deck `1z7haCGdaUNzy-Mw35-xIU9wprqfcMpGUnNHNmi7vmQc` |

---

## Hard rules (every job)

1. **Everything lives in the project's `00 Proposal` folder** on the Spans shared drive
   (`Spans - ACTIVE PROJECTS > P-XXXX <Client> <title> > 00 Proposal`). Find it first with Drive
   `search_files` (`title contains 'P-XXXX'` + folder mimeType, then `parentId = <id> and title contains '00 Proposal'`).
   The P-number is the authority — never trust a filename alone (BIL Rudrapur P-2511 ≠ JBM BIL P-2603).
   More than one match → ask. No project folder → ask, don't create. Read everything in `10 Data From Client` first.
2. **Never overwrite.** Every deliverable and every revision is a new dated copy:
   `P-XXXX <Client> <Deliverable> (DD-Mon-YYYY)`. Earlier files stay untouched. Within the same day's
   version, edit in place (re-read first, keep anyone else's edits).
3. **Never use the word "budgetary"** anywhere in a proposal (deck, sheet titles, payment terms, notes).
   Reference decks may still contain it (e.g. Graviss payment terms) — strip it from every copy.
4. **Costing is reality, pricing is strategy.** Costs are vendor-grounded and spec-compliant (client's
   make list, not cheapest listings). Prices come only from the sheet's loadings. Never cut a cost line
   to hit a target price — change the loading/profit factor and say so.
5. **Ask one question at a time**, each with 2–4 labelled options and a recommended one.
6. **Report status** after each work session as Yes/No lines:
   `Updated Block Scheme: Yes/No` · `Updated Sizing Sheet: Yes/No` · `Updated Cost Sheet: Yes/No` ·
   `Updated Presentation: Yes/No` — each with its link, then open items.
7. Read the `google-workspace` skill before the first Drive/Sheets/Slides write. If a connector is
   missing, stop and name it — never fall back to local files silently.

---

## Step 0 — Questions to ask on every job (one at a time, with options)

Ask only what the client data and email thread don't already answer:
1. **Reference deck to copy:** the closest past job (Rudrapur for small food upgrade, RSPL for large /
   recycling / ZLD, Graviss for expansion with existing plant, JBM for heavy reuse of existing units).
2. **Scope split:** civil by client (default) / Spans / GFS or MS tanks by Spans; structural steel
   (platforms, walkways, pipe racks); installation by Spans or supervision only.
3. **Loadings** for the cost sheet — always ask, show these side by side:
   | Option | Install | Engg | Supvn | Profit factor |
   |---|---|---|---|---|
   | Rudrapur | 87.4% | 94.5% | 95.2% | (job-specific) |
   | Greenwave | 91% | 96.5% | 95.5% | 85% |
   | Graviss | man-day build-up on the Engg & PMC tab | | | 85% |
   Default profit factor **85% (= 15% margin on the quote; quote = cost ÷ factor)**. Loadings are
   factors too: loaded cost = cost ÷ factor. Ask also for any minimum contribution margin (e.g. Graviss ₹30–35 L).
4. **Optional items / options** to price separately (drum screen, online analysers, biogas use, UF,
   odour control, SS piping, TVR on MEE…).
5. **Power tariff and disposal rates** for OPEX if not known (defaults below).
6. **Phasing** (e.g. one of two trains now) — must be stated identically in background, scope and cost slides.

---

## Step 1 — Process design (engineering basis)

**Inputs:** flow (KLD, hours/day, peak), stream-wise characteristics (pH, COD, BOD, TSS, O&G, TKN, TP,
TDS, metals), target standard (name the governing CPCB/SPCB/NGT/CTO condition for the location — check,
don't quote from memory), reuse needs, site/space, utilities, existing units. Any late-added process
line or capacity change → re-characterise the influent, don't patch old numbers.

**Assumption register (mandatory):** `Parameter | Assumed value | Why | Impact if wrong` — in the Sizing
Sheet (marked ASSUMED) and in the deck's Basis-of-Offer / Design-Assumptions slide. Flag suspect data
(BOD:COD inconsistent, peaks above design basis).

**Process selection by BOD:COD:** >0.5 biology alone; 0.3–0.5 two-stage/high-rate; <0.3 expect a
refractory floor (~30–35 % of COD) → physico-chemical step or polishing. Spans trains used recently:
- High-strength food (biscuit, cake, ice-cream, dairy; COD > 3,000): screen → O&G → EQ → DAF (PAC/poly/caustic, not lime) → buffer → UASB or SMAR (+flare) → aerobic (ASP / 2-stage) → clarifier(s) → PSF + ACF → sludge to screw/volute press.
- Mild (mine, utility): screen → O&G → EQ → MBBR → tube settler → PSF/ACF.
- Metals/acid: batch neutralisation & precipitation → settler → filter press → chelating IX (NaOH, not lime, if brine goes to an evaporator).
- Recycling / ZLD: UF → RO-1 → RO-2 on RO-1 reject → HRSCC softening → RO-3 → MEE + ATFD (evaporator from partner UMI first); boiler RO + EDI if boiler feed is needed.

**Conservative defaults (confirm with client on retrofits):** DAF COD 25–30 %, BOD 20–30 %, O&G 80–90 %,
TSS 70–90 %; DAF area = max(hydraulic 3–5 m/h, solids ~9 kg/m²·h). UASB OLR 4–6 kg COD/m³·d, upflow ≤ 0.7–1 m/h;
anaerobic COD removal guaranteed ≥ 70 % only (expected 75–80 %). MBBR stage 1 ~55 % fill, OLR ~20;
stage 2 65–70 % fill, 0.6–0.75 g NH4-N/m²·d, capacity ≥ 1.05 × load. Clarifier SOR ≤ 0.5–0.7 m/h at peak.
For food effluent, ask whether the client wants MBBR loading as SALR (g BOD/m²·d) or volumetric OLR.
PSF ≤ 10 m/h; ACF EBCT ≥ 15 min. Aeration for 120 % of peak O₂. Nutrients (urea/DAP) for start-up only
on food effluent. Non-biodegradable COD ~120 mg/L unless data says otherwise — recommend a treatability test.
When inputs are uncertain run an optimistic and a conservative case; if they disagree on whether the
design works, show both — never split the difference silently. Fill-fraction (media fits the tank) is a
separate PASS/FAIL from discharge compliance.

**Retrofit / expansion:** build an existing tank & equipment register from layout drawings (flag
discrepancies), a bottleneck table (Available | Needed | Limitation) and a "new scheme vs existing unit
re-used" table. Don't inherit a prior design's rates without asking. "No new tanks" is a hard
constraint. Odour complaint → odour module (covers on pretreatment units, ducting, duty + standby
blower, ACF or wet scrubber; practical floor ~150–250 m³/h; also check aeration/DO).

`references/design-standards.md` in this skill holds further default rates.

---

## Step 2 — Block scheme (Excalidraw + PNG) — first deliverable

1. Copy the closest reference `.excalidraw` (Rudrapur 19-Nov or RSPL 20-Nov) into `00 Proposal` as
   `P-XXXX <Client> Block Scheme (DD-Mon-YYYY).excalidraw` and edit the JSON (or build fresh with the
   Excalidraw tool, using `cameraUpdate` / `restoreCheckpoint` to work in sections).
2. Conventions: left-to-right flow; **existing units dashed grey**, **new Spans units solid green**,
   **client civil** in its own colour with "CIVIL – client scope"; common units marked; legend box.
   Every pumping stage shows pumps **1W + 1S** with tags (P1, P2… / 20-P-01A/B); dosing points, biogas
   to flare, sludge lines dashed to the press, return flows (filtrate, backwash) back to EQ.
   Tag scheme: 10 collection, 20 primary/DAF, 30 anaerobic, 40 aerobic, 50 tertiary, 60 recycling,
   70 sludge, 80 ZLD.
3. Render a PNG (e.g. elements → SVG → cairosvg/rsvg), open it to check text is readable, and upload as
   `P-XXXX <Client> Block Scheme (DD-Mon-YYYY).png` beside the `.excalidraw`.
4. Show Nitin the PNG and get the scheme agreed before sizing in detail.

---

## Step 3 — Sizing Sheet (Google Sheet)

`P-XXXX <Client> Sizing Sheet (DD-Mon-YYYY)` — copy of the **master Sizing Sheet template** (see
"Master templates"). Interim: Nitin is building a separate design sheet; the two will be merged later,
so keep tabs self-contained and easy to swap.

Tabs:
1. **Design Basis** — yellow input cells (navy font) per stream + targets; assumption register.
2. **Unit Sizing** — one block per unit, all formulas; civil units carry volume and HRT; existing units flagged.
3. **Water Balance** — flows for every arrow of the diagram, reuse split, losses, % recovery.
4. **COD Mass Balance** — per stage: flow, COD in/out mg/L, kg COD/d in/out/removed, % removal stage and cumulative.
5. **Electrical Load List** — Tag | Drive | Working | Standby | kW each | Installed kW | Running kW | Hours/day | kWh/d; totals; kWh/m³.
6. **Chemicals & Sludge** — dose (mg/L), kg/d, product, cost/d; DAF float + bio-sludge kg DS/d, cake t/d at % DS.
7. **OPEX** — the 5 heads (below) + caps.
8. **Compliance** — outlet vs guarantee with `=IF()` ✓ COMPLIANT / ⚠ MARGINAL / ✗ FAILS; fill-fraction check.
   Pattern: `=IF(E171<=F171,IF(E171>F171*0.9,"⚠ MARGINAL","✓ COMPLIANT"),"✗ FAILS")` (E = outlet, F = limit).
   Retrofits add an Existing Tank & Equipment Register tab (fixed reference, not inputs).

Rules: every calculated cell is a formula referencing inputs; pre-compute row numbers before cross-tab
formulas; notes never start with "="; numbers cast to float; only functions Google Sheets supports
(IF/ROUND/SUM/MAX/MIN/SUMPRODUCT). If built with openpyxl (`scripts/gen_sizing_template.py` helpers),
recalculate locally with zero errors, upload with conversion, then spot-check key cells with `get_values`.
Dark fills (navy `1F4E79`, blue `2E75B6`, green `1F6B3A`) always carry white text.

**OPEX — 5 heads only:** Manpower · Power · Chemicals · Sludge disposal · Maintenance. Defaults:
manpower = people × ₹35,000/month; power ₹9–10/kWh (ask); sludge cake ₹1,500–2,000/t; maintenance
5 % of E&M + 1 % of civil per year. For ZLD jobs put steam under Power & utilities and salt-to-TSDF under
Sludge disposal as sub-lines. Show Rs/day and Rs/KL; caps ≈ 15 % above expected for power kWh/m³,
chemicals Rs/m³ and each key dose.

---

## Step 4 — Cost Sheet (Google Sheet)

`P-XXXX <Client> Cost Sheet (DD-Mon-YYYY)` — copy of the **master Cost Sheet template**. Tabs:
- **0_Cost Summary** — cost under the 5 heads (Bought-out, Fabricated, Engineering & PM, Installation T&C,
  Supervision), profit, quote, margin; plus a head × package table with check rows that must read 0.
- **Negotiations** — Package | Cost (₹ Cr) | Quote (₹ Cr) | Margin on quote | Negotiation factor (yellow,
  default 95 %) | List price incl. negotiation room. Point the package rows at the right Client BoQ rows.
- **1_Client BoQ** — packages ETP-01 Collection … ETP-09 Sludge, UF-01, RO-1, RO-2, BFW-01, ZLD-01, ZLD-02,
  CIV-01 and ETP-10 (seed sludge) as "Client Scope", ETP-91/92/93 service rows "Included". Auto-summed from
  Detailed BoQ. Fill Project / Project Code / Date in row 4.
- **2_Detailed BoQ** — one row per tagged item: Client Ref, Sub Code (`<Ref>-A`, `-B`…), Description
  (`item | spec`), Unit, **Supply Type F/B** (drives the fabricated vs bought-out split), Working, Standby;
  proposal-stage vendor + rate pulled from Vendor Quotes (PS), Discount, Install %, Engg %, Supvn %,
  Total est. cost (= item + install + engg + supvn), Profit factor, Quote, Est. margin. Add rows by copying
  an existing row (keeps formulas); the master has one placeholder row per package. Delete package rows
  not in scope only after checking Client BoQ, Negotiations and 0_Cost Summary still read cleanly.
- **3_Vendor Quotes** — one row per vendor per sub code; **append, never overwrite**; Selected = **PS**
  (proposal stage) / **Y** (execution) / N — only one PS and one Y per sub code. Column J holds the source
  (Costing DB / quote / scaled reference / judgement).
- **4_Actual Costs** — empty at proposal stage.
- **Engg & PMC Estimate** — man-days × CTC × markup for engineering and supervision; installation crew
  months + machinery + consumables with sub-contractor profit and Spans markup (example values from Graviss).
- **Makes List** — feeds the deck.

Cost summary must also be readable under 5 heads: Bought-outs · Fabricated · Engineering & PM ·
Installation, Testing & Commissioning · Site & Operation supervision.

**Where each cost comes from (record the source on every line):**
1. **Spans Costing Database** — `estimate_boq` for the whole list (send flow, head, kW, volume, MOC);
   `search_quotes` for comparables. Green.
2. Vendor quote for this job. Green.
3. Reference projects (Rudrapur, Greenwave, Graviss, RSPL detailed BoQs) scaled by (capacity ratio)^0.6
   — add a **+15 % negotiation buffer** on scaled package prices (UF, RO, MEE/ATFD, DAF) unless Nitin
   says otherwise. Amber.
4. Engineering judgement. Amber → "get vendor quotes" list.
Existing reused items: "Existing, No Cost". Client-scope civil: listed with volume, zero cost.

Verify with `get_values`: no `#REF!/#VALUE!/#NAME?/#DIV/0!`; report quote, cost, margin %, and compare
with any minimum margin Nitin gave.

---

## Step 5 — Proposal deck (Google Slides)

Copy the **master deck** (`Spans Master – Proposal Deck Template`, see "Master templates") into `00 Proposal`
as `P-XXXX <Client> Proposal (DD-Mon-YYYY)`. Every client-specific field is a `{{placeholder}}`: fill them with
`replaceAllText` where the text repeats ({{Client}}, {{Plant}}, {{capacity}}) and cell or box edits elsewhere.
Before finishing, search the deck for `{{`, `XXXX`, red placeholder boxes and "OPTIONAL" titles: none may be
left. Delete the OPTIONAL slides that don't apply (existing-ETP review for new plants, changes-since for Rev 0),
unused cost-structure rows and the recycled-water column / UF-RO-MEE boxes on non-recycling jobs. Add the client
logo on the cover if available. Use a past client deck only for wording ideas, never as the copy base. Slide order:

**Front:** Cover (title, site, date, Rev) · Mission · About Spans · Customers.
**Technical Proposal** (divider)
1. Project Background — client, plant, need, scheme in one paragraph, basis (emails / site visit dates).
2. Basis of this Offer — Item | Client input | Spans basis (assumptions to confirm).
3. Design Basis — raw (per stream) vs guaranteed outlet.
4. *(Upgrade/expansion)* Existing scheme · bottlenecks table · integration / use of existing units.
5. Block Scheme — the PNG.
6. Guaranteed Quality by Stage — guaranteed values bold, intermediate indicative (*), conditions in footer.
7. **COD Mass Balance** — table from the Sizing Sheet.
8. **Water Balance** — diagram drawn as slide shapes like RSPL: stage boxes, KLD on arrows, reuse split,
   losses box, "water recovered ≈ x KLD (y %)" footer, basis note.
9. Unit Sizing — screenshot(s) of the Unit Sizing tab.
10. **Key Civil Units** — # | Civil unit | UG/AG | Approx. volume (m³) | Approx. HRT (client scope note; total m³; sheds and buildings listed).
11. **Electrical Load List** — screenshot of the load list (installed vs running kW, kWh/d).
12. Utilities & Sludge — connected/running kW, kWh/d, fresh water, sludge cake t/d, biogas.
13. Performance Guarantee Test — test, guaranteed, not guaranteed, security (PBG or 10 % retention), client inputs, supervision.
14. Scope of Work · Makes List · Assumptions & Exclusions (client responsibilities).
**Commercial Proposal** (divider)
15. Responsibility Matrix.
16. Proposed Cost Structure — 1 PCB documentation (included) · 2 design & detailed engineering (included) ·
    3 supply, integration and putting into service (price) · 3A/3B… packages or options · 4 installation /
    supervision of installation (included) · 5 supervision of testing, commissioning & stabilisation —
    **1 month** included · 6 Regular O&M (non-comprehensive, 12 months) — **₹35,000 × people per month**
    (people from OPEX manpower) · GST, P&F, freight as applicable.
17. Optional Items — #, item, purpose, price excl. GST.
18. **O&M / Expected OPEX and Caps** — the 5 heads, Rs/day and Rs/KL, caps table, basis footer.
19. Payment Terms — default (BIL/Graviss): 30 % advance with order; running invoices 70 % on supply,
    20 % on installation, 5 % on testing & commissioning, 5 % one month after commissioning; advance
    adjusted pro-rata; GST extra (GSTIN 06AAACS9538A1ZJ); TDS (PAN AAACS9538A); boarding/lodging note;
    delivery 16–20 weeks from advance + drawing approval; validity 30 days.
20. Closing slide.
*Revisions add:* "Changes since <date> proposal" table (after Background) and a Total Cost Bridge slide.

**Screenshots from the Sizing Sheet:** export the sheet as PDF (`download_file_content`,
`exportMimeType: application/pdf`), render the page with PyMuPDF at ~200 dpi, crop tightly to the table,
save PNG to `00 Proposal` (`P-XXXX <Client> <Table> (DD-Mon-YYYY).png`). If the export layout is poor,
render the `get_values` range as a clean table image in the Spans palette instead.
Slides cannot pull images from private Drive links: try inserting; if it fails, leave a red
"Insert <file>.png here" placeholder on that slide and list it in the status report.

**Check:** export the deck to PDF and look at cover, block scheme, quality-by-stage, civil units, cost
structure and OPEX pages; every number must match the Sizing / Cost Sheets; package prices must add to
the total (fix rounding).

---

## Step 6 — Close-out

- Status lines (rule 6) with links; list amber cost lines needing quotes, placeholders to fill, open client questions.
- Write/update `P-XXXX <client> - design basis & budget.md` in the claude.ai Project (client data, basis,
  key results, price table, open items, links).
- Point out stray working copies in the folder rather than leaving Nitin to guess which files are final.

---

## Master templates

All three masters live in the Spans templates folder (`1-H9WgYIJyZWljEYzuEqE6YD1vPvgLAi5`).
- **Spans Master – Proposal Deck Template** `1uuPZe_GEO3madjybUhlVSrjiuwNxqc2a3rj2h3h4Lbc` — 29 slides in the
  Step 5 order, built on the RSPL deck: placeholders throughout, BIL/Graviss payment terms, 5-head OPEX + caps,
  cost structure with O&M at ₹35,000 × people, red placeholder boxes for the block scheme, unit-sizing and
  load-list images, COD balance table, water-balance diagram (ZLD layout; trim for plain ETPs), and two
  OPTIONAL slides (existing-ETP review, changes since previous proposal). Always start a job
by copying them (Drive `copy_file` into the project's `00 Proposal` with the dated title); never edit the masters
during a job.
- **Spans Master – Cost Sheet Template** `1-m-f1mMk_7cHZDc6sFoI9h3nwz3kBcpl32x_8KwOeoI` — built from the
  P-2661 RSPL sheet (Greenwave structure, corrected total-cost formula), plus Graviss Engg & PMC and
  Rudrapur Makes List. Default loadings in the placeholder rows: install 91 %, engg 96.5 %, supvn 95.5 %,
  profit 85 % — replace with the loadings Nitin picks for the job.
- **Spans Master – Sizing Sheet Template** `156G0NXAL_NOyA-KUFF-tDrBL6wv1CTwPdXMl8oZyfqE` — 8 tabs
  (Design Basis, Unit Sizing, Water Balance, COD Mass Balance, Electrical Load List, Chemicals & Sludge,
  OPEX, Compliance), all formulas, yellow inputs pre-filled with a 100 KLD high-strength food ETP example
  (DAF → UASB/SMAR → aeration + clarifier → PSF + ACF). Replace every yellow input; add or delete unit and
  drive rows to match the block scheme, then re-check the totals and the Compliance tab.
If a change to a master is needed, tell Nitin and make it only when he agrees.

## Brand palette

Navy `1F4E79` (title bar, grand total), blue `2E75B6` (section/table headers), green `1F6B3A`
(stage-2 sections), yellow `FFFF00` inputs with navy font, light blue `EBF5FB` calculated, pale blue
`D6E4F0` labels/zebra, pass `C6EFCE`/`276221`, warn `FFEB9C`/`9C6500`, fail `FFC7CE`/`9C0006`, borders
`AAAAAA`, grey `555555` secondary text. White text on every dark fill — set it in the helper, never rely on defaults.

## Legacy files in this skill

`references/design-standards.md` — still valid defaults. `references/equipment-rates.md` — old indicative
rates; use only after the Costing Database and reference projects, and mark amber.
`scripts/gen_sizing_template.py` — openpyxl helpers usable for the Sizing Sheet.
`scripts/gen_proposal_template.js` — Word proposal generator, no longer used (deck is Google Slides).