# ETP Design Standards — Default Parameters

## Equalisation (EQ) Tank
- HRT: 8–12 hours (use 10 hr default for industrial effluent)
- Shape: rectangular RCC with mixing arrangement
- Provide 15% freeboard

## Belt Skimmer / O&G Trap
- Size for 100% of peak hourly flow
- O&G removal efficiency: 70–80%

## DAF (Dissolved Air Flotation)
- Surface hydraulic loading: 3–5 m³/m²/hr
- HRT: 20–30 minutes
- Default removal efficiencies (conservative — use these unless overridden):
  - O&G: 80%
  - TSS: 70%
  - COD: 30%
  - BOD: 30%
  - NH₄-N: 5%
- Sludge: 0.5 kg DS per kg (TSS removed + O&G removed); assume 1% solids

## MBBR (Moving Bed Biofilm Reactor)
### Stage 1 — High-rate carbonaceous
- Carrier fill: 55% (by volume)
- Carrier specific surface area: 800 m²/m³ (AnoxKaldnes K5 or equivalent)
- Total carrier area = Volume × fill% × specific surface area
- OLR range: 18–22 kg COD/m³/day (design to 20)
- COD removal efficiency: 50% (conservative)
- NH₄-N removal efficiency: 10% (heterotrophs dominant at high OLR — minimal nitrification)
- O₂ demand: 0.35 kg O₂ per kg COD removed (carbonaceous) + 4.57 kg O₂ per kg NH₄-N nitrified
- Air:O₂ ratio: 1 kg O₂ per 4.8 Nm³ air (standard blower)

### Stage 2 — Polishing + full nitrification
- Carrier fill: 65–70% (use 70% for max nitrification)
- Carrier specific surface area: 800 m²/m³
- OLR: typically 10–15 kg COD/m³/day at this stage
- COD removal efficiency: 38%
- NH₄-N removal: governed by SALR
  - SALR design: 0.75 g NH₄-N/m²/day
  - Required carrier area = NH₄-N load (g/day) / SALR
  - Safety margin: size so capacity ≥ load × 1.05
- O₂ demand for nitrification: 4.57 kg O₂ per kg NH₄-N nitrified
- Combined MBBR HRT: (V₁ + V₂) / hourly flow

### MBBR DO target
- Stage 1: 3–4 mg/l (high O₂ demand zone)
- Stage 2: 4–6 mg/l (nitrification needs higher DO)

## Tube Settler (Clarifier)
- Upflow rate: 1.0–1.5 m³/m²/hr (use 1.2 as default)
- HRT: 1.5–2 hr
- Sludge blanket: 30% of depth
- Tube module: 60° inclined, 50mm tube diameter, 1m module length

## Filter Press (Sludge Dewatering)
- Total sludge = DAF sludge + MBBR excess biomass
  - MBBR excess biomass: 0.05–0.10 kg VSS per kg COD removed (use 0.07 default)
- Filter press cycle: 4 hr press time, assume 8 pressings per day (two shifts)
- Cake moisture: 70–75% (i.e., 25–30% dry solids)
- Filter area sizing: 15–20 kg DS/m²/cycle

## Aeration / Blower
- DO probe controlled; size for 120% of peak O₂ demand
- Diffusers: fine bubble membrane, OTE 25% at 4m submergence

## Chemical Dosing
- pH correction: NaOH (10% solution) or H₂SO₄ as required
- Coagulant (DAF): Alum 100–200 mg/l, or PAC 50–100 mg/l
- Flocculant: polyelectrolyte 1–3 mg/l
- Nutrient (if BOD:COD > 5, rare for pharma): urea + DAP
- Anti-foaming agent: as needed

## Power Rules of Thumb
- Blowers: 0.075–0.10 kW per kg O₂/hr delivered
- Pumps: size for 120% of design flow, 65–70% pump efficiency
- DAF: 1–3 kW per m³/hr of flow treated
- Filter press: 3–5 kW per press

## pH and Temp
- Optimal MBBR pH: 7.0–7.5 for nitrification; 6.5–8.5 for carbonaceous
- Optimal temp: 20–35°C; nitrification rate halves at <15°C
