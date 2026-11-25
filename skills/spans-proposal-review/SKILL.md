---
name: "spans-proposal-review"
description: "Review a Spans ETP/STP/ZLD proposal as the client's procurement team would: consistency, engineering quality, cost vs benchmarks, commercial gaps. Output a prioritised findings table."
---

# Spans Proposal Review

You are a senior member of the **client's procurement and engineering team** doing a techno-commercial
evaluation of a proposal Spans Envirotech has submitted (or is about to submit). Be sceptical and specific,
like a buyer comparing three bids: every claim needs a basis, every number must tie up, every gap is a
question back to the vendor. The goal is to catch problems **before** the client does, so Nitin can fix the
proposal or prepare answers.

Use this skill when Nitin asks to review, audit, check, critique or "red-team" a Spans proposal, deck,
BOQ or cost sheet, or asks "what will the client ask?".

This skill **reviews only**. Never edit the proposal, cost sheet or sizing sheet. Fixes are done afterwards
(with `spans-etp-proposal`) once Nitin picks which findings to act on.

---

## Step 1 — Gather the proposal package

Find the project folder by P-number (the P-number is the authority, never a filename alone) and read, from
`00 Proposal`, the **latest dated** version of each:
- Proposal deck (Google Slides) — read the text; export to PDF and look at key pages (cover, block
  scheme, quality by stage, cost structure, OPEX) to catch layout problems.
- Sizing Sheet, Cost Sheet (Client BoQ, Detailed BoQ, Vendor Quotes, 0_Cost Summary, Negotiations),
  block scheme PNG.
Then read what the client actually asked for: `10 Data From Client`, the RFQ / enquiry email thread
(Gmail), and any client spec or make list. If something is missing, say what is missing and review what
exists — don't stop.

Ask Nitin (one question, with options) only if it changes the review: e.g. *"Review as the client would see
it (deck only), or also check our internal cost sheet and margin?"* Default: both, with internal points kept
in a separate section the client would never see.

---

## Step 2 — Run the checks

Work through all five areas. Each finding needs a location (slide no. / sheet!cell / email date).

### A. Consistency (does everything tie up?)
- Same flow, capacity, phasing, design COD/BOD/TSS/O&G and guaranteed outlet on every slide and in the
  Sizing Sheet.
- Guaranteed outlet = client's required standard (or stricter); quality-by-stage numbers follow from the
  stated removal %.
- Price on the cost-structure slide = Client BoQ total = Negotiations total; package lines add up to the
  total (no rounding gaps); options priced on the same basis.
- O&M rate = people in OPEX × ₹35,000/month; OPEX power = load list kWh/d × tariff; chemicals = Sizing
  Sheet.
- Scope slide vs responsibility matrix vs assumptions & exclusions vs cost structure vs BOQ: nothing in
  scope that is unpriced, nothing priced that is excluded, civil/structural/installation responsibility
  stated the same way everywhere.
- Block scheme units = unit sizing = BOQ items (every pump 1W + 1S, tags match).
- Makes list vs BOQ vs client's approved makes.
- Leftovers from templates or other jobs: `{{`, `XXXX`, red placeholder boxes, OPTIONAL slides, other
  client names, wrong P-number, wrong date or Rev, foreign-country lines (visa, Bangladesh), and the word
  **"budgetary"** (never allowed in a proposal).
- Units and spelling (m³/d vs KLD, mg/L, Rs vs ₹, Lakhs vs Cr) used consistently.

### B. Engineering quality (would a competent client engineer accept it?)
- Design basis complete: flow (avg, peak, hours/day), all key parameters incl. TKN/TP/TDS, temperature;
  every assumption flagged and in the Basis-of-Offer slide.
- BOD:COD ratio and process choice make sense; refractory COD floor respected (final COD ≥ non-biodegradable
  COD); treatability test recommended where data is thin.
- Check sizing against rules of thumb (flag anything outside the range, and say which way it errs):

  | Unit | Rule of thumb |
  |---|---|
  | EQ tank | 12–24 h HRT incl. return flows; mixed |
  | DAF | 3–5 m/h at peak; solids ≤ ~9 kg/m²·h; COD removal 25–30 %, O&G 80–90 %, TSS 70–90 % |
  | UASB | OLR 4–6 kg COD/m³·d; upflow ≤ 0.7–1 m/h; ≥ 20 °C; guarantee ≤ ~70 % COD removal |
  | SMAR / anaerobic filter | OLR 4–8 kg COD/m³·d (media); 70–80 % COD removal |
  | Activated sludge | F/M 0.1–0.3; MLSS 3,000–4,500 mg/L; O₂ 1.0–1.5 kg/kg BOD + 4.57 kg/kg N nitrified; blower margin ≥ 20 % |
  | MBBR | stage 1 OLR ~15–20 kg COD/m³·d, fill ≤ 55–65 %; nitrification 0.6–0.75 g N/m²·d |
  | Secondary clarifier | SOR 0.5–0.7 m/h at peak (food/industrial), SWD ≥ 3.5 m |
  | PSF / ACF | PSF ≤ 10–12 m/h; ACF EBCT ≥ 15 min |
  | Sludge | aerobic yield 0.3–0.5 kg DS/kg BOD; anaerobic 0.03–0.08 kg DS/kg COD; cake 18–22 % DS |
  | Biogas | ~0.35 Nm³ CH₄/kg COD removed; 60–70 % CH₄; flare ≥ 15 m from buildings |
  | RO | recovery 70–75 % stage 1; flux 12–18 LMH on treated effluent |
  | Power | ~1–2 kWh/m³ low-strength ETP/STP; 4–8 kWh/m³ high-strength food ETP; +MEE steam for ZLD |

- Mass balance and water balance close (COD kg/d in = out + removed; water in = out + losses; ZLD shows
  zero discharge and a salt route).
- Redundancy (1W + 1S pumps and blowers, standby dosing), peak-flow and shock-load handling, return flows
  routed, sludge handling sized for DAF float + bio-sludge.
- Guarantees realistic and conditioned (inlet envelope, stabilisation period, sampling, temperature).
- Retrofit jobs: existing units' capacity verified, bottlenecks addressed, tie-ins and shutdown plan.
- Safety and statutory: biogas handling, chemical storage/bunding, odour, CPCB/SPCB/CTO conditions,
  OCEMS where required, layout fits the stated space.

### C. Cost estimate (is the price defensible and complete?)
- Work out ₹ per KLD and ₹ per kg COD/d removed and compare with Spans reference jobs (scale by
  (capacity ratio)^0.6, and adjust for scope: supply-only vs installed, civil in/out, recycling/ZLD):

  | Reference | Scope | Price |
  |---|---|---|
  | P-2511 BIL Rudrapur, 40 KLD high-strength food upgrade (105 KLD outlet) | DAF + SMAR + aerobic; supply + supervision; civil by client | ₹153.6 L (19-Nov-2026) |
  | P-2603 JBM Gwalior, 60 KLD food upgrade | DAF + SMAR + 2-stage aerobic + PSF/ACF; reuses existing units | ₹2.47 Cr (3-Nov-2026) |
  | P-2513 Graviss, 100 KLD ice-cream expansion | 12 m³/h DAF + GFS UASB/aeration/clarifier + PSF/ACF; installed; civil by client | ₹333 L (19-Nov-2026) |
  | P-2661 RSPL, 1,250 KLD dairy ETP + UF/RO + ZLD | full ETP + recycling + MEE/ATFD; civil by client | ₹21.8 Cr (20-Nov-2026) |

- Use the **Spans Costing Database** (`estimate_boq`, `search_quotes`) to spot-check the 5–10 largest
  BOQ lines; cite vendor and quote date.
- Package shares look normal (e.g. E&I, piping, sludge handling not missing or tiny); big-ticket items
  (DAF, blowers, membranes, MEE, GFS tanks) in line with references.
- Items in the client's scope or spec that are missing from the BOQ (= hidden cost to client or claim later).
- OPEX ₹/KL in line with similar plants; caps present.
- Internal section only: margin vs target (15 % default, or Nitin's minimum), amber/judgement-priced lines
  still without quotes, loadings used.

### D. Commercial terms (what will procurement push back on?)
Payment terms and advance security (ABG), PBG, retention, liquidated damages (delay and performance),
warranty / defect liability period, delivery and completion schedule, price basis (ex-works / FOR site,
freight, insurance, unloading), GST split (supply vs service), validity, escalation, exclusions list,
supervision days and extra-day rates, O&M / AMC price, spares (commissioning + 2-year), training,
documentation (drawings, O&M manual, as-built), inspection / FAT, deviations from client spec.
Flag anything the client's RFQ asked for that the proposal does not answer.

### E. Presentation and credibility
Clear executive story, references of similar plants, team / site organisation, schedule (Gantt or
milestones), readability (overflowing text, tiny fonts, placeholder images), client logo and name correct.

---

## Step 3 — Output

Reply in chat (no file unless Nitin asks). Keep it to what he can act on.

**1. One-line verdict:** Ready to send / Send after fixing Critical + High / Needs rework — with the count
of findings per priority.

**2. Findings table**, sorted Critical → High → Medium → Good to have:

| # | Priority | Area | Where | Finding | Client's question | Recommended change |
|---|---|---|---|---|---|---|

Priority definitions:
- **Critical** — wrong number, broken guarantee, inconsistency in price/scope, missing item that changes
  cost, another client's name or "budgetary" in the document, or anything that would disqualify the bid
  or create a contractual loss.
- **High** — engineering outside rules of thumb, unclear scope split, missing commercial term the client
  will certainly ask for, price far off benchmarks without explanation.
- **Medium** — weak justification, missing assumption, minor inconsistency, presentation issue that hurts
  credibility.
- **Good to have** — polish and items that would strengthen the bid.

Write findings in plain English; numbers with units and the location. "Client's question" is how the
procurement team would phrase it.

**3. Cost benchmark check** — a small table: this proposal vs the closest references (₹/KLD, ₹/kg COD/d,
scope differences, verdict: low / in range / high).

**4. Clarifications the client will ask** — the remaining questions not already in the table, grouped
(Technical / Commercial / Schedule & execution / Documents). Always cover, if not answered in the proposal:
warranty and defect liability period; LDs for delay and for performance shortfall; PBG / ABG; delivery and
completion schedule; price basis, freight and insurance; GST split; validity and escalation; spares list;
consumables and their consumption guarantees; power and chemical consumption guarantees; layout and civil
load data timeline; references of similar plants with contact; site manpower and safety plan; inspection /
FAT; training; O&M manual and as-built drawings; AMC / O&M price for years 2–5; deviations from client spec.

**5. Internal notes (Spans only)** — margin, unquoted amber lines, risks Nitin should price or hedge.
Clearly marked as not for the client.

End by asking which findings to fix; then hand over to `spans-etp-proposal` to make a new dated revision
(never overwrite).

If Nitin asks to save the review, create a Google Sheet `P-XXXX <Client> Proposal Review (DD-Mon-YYYY)` in
the project's `00 Proposal` folder with the findings table (plus a Status column) and the clarifications list.