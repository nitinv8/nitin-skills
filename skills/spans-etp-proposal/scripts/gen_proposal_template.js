const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  PageBreak, Header, Footer, PageNumber, NumberFormat, convertInchesToTwip,
  UnderlineType, VerticalAlign, TableLayoutType
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── Helpers ───────────────────────────────────────────────────────────────
const TWIP = convertInchesToTwip;
const PAGE_W = 12240; // A4 width in DXA
const MARGIN  = 1440; // 1 inch margins
const TABLE_W = PAGE_W - 2 * MARGIN; // usable width

function heading1(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 120 },
    border: { bottom: { color: '1971c2', size: 6, space: 4, style: BorderStyle.SINGLE } }
  });
}
function heading2(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 }
  });
}
function heading3(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 60 }
  });
}
function para(runs, opts = {}) {
  return new Paragraph({
    children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22, font: 'Calibri' })],
    spacing: { before: 80, after: 80, line: 276 },
    ...opts
  });
}
function bold(text, size = 22) {
  return new TextRun({ text, bold: true, size, font: 'Calibri' });
}
function normal(text, size = 22) {
  return new TextRun({ text, size, font: 'Calibri' });
}
function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 }
  });
}
function subbullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: 'Calibri' })],
    bullet: { level: 1 },
    spacing: { before: 30, after: 30 }
  });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function spacer(lines = 1) {
  return new Paragraph({ text: '', spacing: { before: 80 * lines, after: 0 } });
}
function hr() {
  return new Paragraph({
    text: '',
    border: { bottom: { color: 'AAAAAA', size: 4, space: 4, style: BorderStyle.SINGLE } },
    spacing: { before: 100, after: 100 }
  });
}

// ─── Table helpers ──────────────────────────────────────────────────────────
function makeCell(text, opts = {}) {
  const {
    bold: isBold = false,
    bg = 'FFFFFF',
    align = AlignmentType.LEFT,
    width,
    span = 1,
    size = 20
  } = opts;
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: String(text), bold: isBold, size, font: 'Calibri' })],
      alignment: align,
      spacing: { before: 40, after: 40 }
    })],
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: bg },
    columnSpan: span,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }
  });
}

function headerRow(cells) {
  return new TableRow({
    children: cells.map(([text, width]) => makeCell(text, { bold: true, bg: '1971C2', align: AlignmentType.CENTER, width, size: 18 })),
    tableHeader: true
  });
}

function dataRow(cells, stripe = false) {
  const bg = stripe ? 'EBF5FB' : 'FFFFFF';
  return new TableRow({
    children: cells.map(([text, width, align]) => makeCell(text, { bg, align: align || AlignmentType.LEFT, width }))
  });
}

// ─── BOQ Data ───────────────────────────────────────────────────────────────
const boqData = [
  [1,  'Belt Oil Skimmer with Drive Motor & Frame',                   '1 No.', 'SS 304 Belt & Frame',                    '1,80,000',  '1,80,000'],
  [2,  'Equalization Tank (30 m³, 5.5m × 3.0m × 2.0m)',             '1 No.', 'MS Epoxy Coated / GLS Bolted',           '4,20,000',  '4,20,000'],
  [3,  'Air Agitation Grid for EQ Tank',                             '1 Lot', 'Schedule 40 PVC Pipe & Diffusers',       '55,000',    '55,000'],
  [4,  'Equalization Transfer Pumps (1W + 1S)',                      '2 Nos.','CI Body / SS 316 Impeller, 3.0 kW each', '95,000',    '95,000'],
  [5,  'Dissolved Air Flotation (DAF) System Skid – Complete',       '1 No.', 'MS Epoxy / SS 304 Internals & Scraper',  '8,50,000',  '8,50,000'],
  [6,  'Chemical Dosing Skid – Acid/Alkali (pH Correction)',         '1 No.', 'PP Tank 500 L / PVC Pipe & Pump',        '65,000',    '65,000'],
  [7,  'Chemical Dosing Skid – PAC (Coagulant)',                     '1 No.', 'PP Tank 500 L / PVC Pipe & Pump',        '65,000',    '65,000'],
  [8,  'Chemical Dosing Skid – Polymer (Flocculant)',                '1 No.', 'PP Tank 500 L / PVC Pipe & Pump',        '70,000',    '70,000'],
  [9,  'MBBR Reactor Tank (25 m³, 4.5m × 2.5m × 2.5m)',            '1 No.', 'GLS Bolted / MS Epoxy Coated',           '5,80,000',  '5,80,000'],
  [10, 'MBBR Media – Virgin HDPE Carriers (800 m²/m³, 55% Fill)',   '13.1 m³','Virgin HDPE (Kaldnes K5 equiv.)',        '3,90,000',  '3,90,000'],
  [11, 'MBBR Air Grid & Retention Screens (Inlet + Outlet)',         '1 Lot', 'SS 304 Pipe Grid / Wedge Wire Screen',   '95,000',    '95,000'],
  [12, 'Air Blowers – Roots Type (150 Nm³/hr, 1W + 1S)',            '2 Nos.','CI Body, V-Belt Drive, Silencer & NRV',  '2,20,000',  '2,20,000'],
  [13, 'Internal Recirculation Pump (MBBR → EQ Tank)',              '1 No.', 'CI Body / SS 316 Impeller, 2.2 kW',      '52,000',    '52,000'],
  [14, 'Tube Settler Tank with PVC Module Media',                   '1 No.', 'MS Epoxy / PVC Modules (60° angle)',     '3,20,000',  '3,20,000'],
  [15, 'Filter Press Feed Pumps – AODD / PC Type (1W + 1S)',        '2 Nos.','CI / SS, 1.5 kW each',                  '75,000',    '75,000'],
  [16, 'Chamber Filter Press (500 × 500 mm, 20 plates)',            '1 No.', 'MS Fabricated Frame / PP Filter Plates', '2,40,000',  '2,40,000'],
  [17, 'Interconnecting Piping, Valves, Fittings & Supports',       '1 Lot', 'UPVC (process) / MS (structural)',        '2,80,000',  '2,80,000'],
  [18, 'Electrical MCC + Control Panel (IP55) with Instruments',    '1 Lot', 'MS Powder Coated, IP55, PLC/Timer',      '3,50,000',  '3,50,000'],
];

// ─── Document construction ──────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 28, color: '1864AB', font: 'Calibri' },
        paragraph: { spacing: { before: 400, after: 120 } }
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 24, color: '1971C2', font: 'Calibri' },
        paragraph: { spacing: { before: 280, after: 80 } }
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 22, color: '2F9E44', font: 'Calibri' },
        paragraph: { spacing: { before: 200, after: 60 } }
      }
    ]
  },
  sections: [
    // ═══ SECTION 1: TITLE PAGE ════════════════════════════════════════════
    {
      properties: {
        page: {
          margin: { top: TWIP(1), bottom: TWIP(1), left: TWIP(1.25), right: TWIP(1) }
        }
      },
      children: [
        spacer(4),
        new Paragraph({
          children: [bold('TECHNICAL & COMMERCIAL PROPOSAL', 52)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 }
        }),
        new Paragraph({
          children: [bold('Effluent Pre-Treatment Plant (ETP)', 38)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        hr(),
        spacer(1),
        // Info table
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [3600, 6840],
          rows: [
            ['Prepared For',   'Nuwill Research and Innovations Pvt. Limited'],
            ['Project Site',   'Greenfield Pharmaceutical Facility, Mangalore SEZ, Karnataka, India'],
            ['Document Ref.',  'SPANS/P-2622/ETP-001/REV-1'],
            ['Date',           'July 2026'],
            ['Design Capacity','60 KL/Day (2.5 m³/hr continuous forward flow)'],
            ['Prepared By',    'Spans Envirotech Pvt. Ltd., Process Engineering Division'],
            ['Document Status','For Client Review & Approval'],
          ].map(([label, value], i) => new TableRow({
            children: [
              makeCell(label, { bold: true, bg: 'D0EBFF', width: 3600 }),
              makeCell(value, { bg: i % 2 === 0 ? 'F8F9FA' : 'FFFFFF', width: 6840 })
            ]
          }))
        }),
        spacer(3),
        new Paragraph({
          children: [
            normal('This document is proprietary and confidential. Prepared exclusively for ', 18),
            bold('Nuwill Research and Innovations Pvt. Limited', 18),
            normal(' by Spans Envirotech Pvt. Ltd. Unauthorized reproduction or distribution is prohibited.', 18)
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 0 }
        }),
        pageBreak(),

        // ═══ TABLE OF CONTENTS (manual) ══════════════════════════════════
        heading1('Table of Contents'),
        ...[
          ['Executive Summary & Process Narrative', '3'],
          ['Section 1  —  Process Description', '3'],
          ['Section 2  —  Design Basis & Performance Guarantees', '5'],
          ['Section 3  —  Detailed Bill of Quantities (BOQ)', '6'],
          ['Section 4  —  Utility & Operational Requirements', '8'],
          ['Section 5  —  Commercial Terms & Conditions', '10'],
          ['Section 6  —  Exclusions & Client Scope', '11'],
        ].map(([title, pg]) => new Paragraph({
          children: [
            new TextRun({ text: title, size: 22, font: 'Calibri' }),
            new TextRun({ text: `\t${pg}`, size: 22, font: 'Calibri' })
          ],
          tabStops: [{ type: 'right', position: TABLE_W, leader: 'dot' }],
          spacing: { before: 60, after: 60 }
        })),
        pageBreak(),

        // ═══ SECTION: EXECUTIVE SUMMARY ══════════════════════════════════
        heading1('Executive Summary'),
        para([
          normal(
            'Nuwill Research and Innovations Pvt. Limited is establishing a greenfield pharmaceutical manufacturing facility within the Mangalore Special Economic Zone (SEZ), Karnataka. As a member industry of the SEZ, the facility is obligated to discharge treated effluent meeting the inlet specifications prescribed by the Mangalore SEZ Common Effluent Treatment Plant (CETP) authority.'
          )
        ]),
        para([
          normal(
            'Characterisation of effluent drawn from an analogous sister manufacturing facility (sample collected 11-Jun-2026) confirms that six key parameters exceed permissible CETP inlet limits: pH at 5.18 (limit: 5.5–9.0), Oil & Grease at 647 mg/l (limit: 20 mg/l), COD at 12,000 mg/l (limit: 2,750 mg/l), BOD at 3,600 mg/l (limit: 1,150 mg/l), TSS at 1,200 mg/l (limit: 100 mg/l), Ammoniacal Nitrogen at 154 mg/l (limit: 50 mg/l), and Selenium marginally at 0.063 mg/l (limit: 0.05 mg/l). The extremely high organic load (COD 12,000 mg/l) is characteristic of soft-gel capsule manufacturing operations involving gelatin hydrolysis, glycerin, ethanol and formulation rinse streams.'
          )
        ]),
        para([
          normal(
            'Spans Envirotech Pvt. Ltd. proposes a compact, modular Effluent Pre-Treatment Plant (ETP) of '
          ),
          bold('60 KL/day (2.5 m³/hr)'),
          normal(
            ' design capacity, employing a proven two-stage treatment philosophy: (a) Physical-Chemical pre-treatment via Belt Oil Skimming, Equalization with pH correction, and Dissolved Air Flotation (DAF) to remove free and emulsified oil, suspended matter, colloidal COD, and fine particulates (targeting ~50% COD reduction); followed by (b) Attached-Growth Biological Treatment via a Moving Bed Biofilm Reactor (MBBR) for simultaneous COD polishing and nitrification of NH₄-N (154 → <50 mg/l). Gravity clarification in a Tube Settler and final sludge dewatering on a Chamber Filter Press complete the treatment train.'
          )
        ]),
        para([
          normal(
            'The entire plant is designed on a '
          ),
          bold('modular, bolted-tank assembly'),
          normal(
            ' philosophy using GLS (Glass-Lined Steel) or MS Epoxy Coated tanks, eliminating the need for civil RCC construction and drastically compressing site installation time. The plant is designed to comply with all applicable environmental regulations under the Environment Protection Act, 1986 and the Hazardous Waste Management Rules, 2016.'
          )
        ]),
        spacer(1),

        // ═══ SECTION 1: PROCESS DESCRIPTION ═════════════════════════════
        heading1('Section 1 — Process Description'),
        heading2('1.1  Primary Treatment: Skimming & Equalization'),
        para([
          bold('Belt Oil Skimmer:  '),
          normal(
            'Raw effluent from process areas, washings, and floor drains is first collected in a Raw ETP Sump. A continuously operating SS 304 Belt Oil Skimmer is mounted across the sump to mechanically remove free-floating oil and grease before any downstream pumping. This protects downstream equipment and achieves an initial O&G reduction from 647 mg/l to approximately 200–210 mg/l (~68% removal), substantially reducing the emulsification load on the DAF unit. The remaining emulsified and colloidal oil fraction is addressed by coagulation-enhanced DAF.'
          )
        ]),
        para([
          bold('Equalization Tank (30 m³, HRT ≈ 12 hrs):  '),
          normal(
            'Skimmed effluent is transferred to a 30 m³ Equalization Tank (HRT: 12 hrs) for flow and load equalization. A submerged PVC air-agitation grid powered by a dedicated low-pressure blower ensures homogeneous mixing and prevents sedimentation. Given the raw effluent pH of 5.18 (below CETP minimum of 5.5), pH correction is critical: an automated Alkali (NaOH) dosing system corrects pH to the target range of 6.8–7.5 ahead of biological treatment. PAC (Poly Aluminium Chloride, dose: 250–350 mg/l) is added as a coagulant and Anionic Polyelectrolyte (dose: 3–5 mg/l) as a flocculant to initiate colloidal destabilisation and micro-floc formation. These dosing rates are elevated compared to lower-strength effluents due to the high COD (12,000 mg/l) and TSS (1,200 mg/l) loading.'
          )
        ]),

        heading2('1.2  Physical-Chemical Treatment: Dissolved Air Flotation (DAF)'),
        para([
          normal(
            'The pre-conditioned, coagulated effluent from the Equalization Tank is pumped to the Dissolved Air Flotation (DAF) unit. In the DAF, a recycle stream of treated water is pressurised to 4–5 bar in a pressure vessel where it is saturated with dissolved air. Upon release back to atmospheric pressure at the DAF inlet, micro-bubbles (diameter 30–80 μm) are generated and attach to oil droplets, flocs, and suspended particles, causing them to float to the surface as a sludge blanket. A mechanical surface scraper continuously removes this float sludge to a sludge hopper.'
          )
        ]),
        para([
          normal(
            'The DAF unit is designed for a surface loading rate of 3.5 m³/m²/hr (conservative, given high TSS inlet of 1,200 mg/l). With enhanced coagulation (PAC 300 mg/l + polymer 4 mg/l), the DAF is expected to achieve: O&G reduction from ~207 mg/l (post-skimmer) to <10 mg/l (>97%); TSS from 1,200 to ~96 mg/l (>92%); and COD reduction of approximately 50% from 12,000 mg/l to ~6,000 mg/l by removing particulate and colloidal organic matter. Selenium (0.063 mg/l, marginally above the 0.05 mg/l limit) is addressed by PAC co-precipitation in this stage, reducing it to ~0.022 mg/l. The chemical sludge collected from the DAF surface scraper (estimated 40–55 kg dry solids/day — significantly higher than low-strength effluents due to the elevated TSS and COD load) is conveyed to the Chamber Filter Press for dewatering.'
          )
        ]),

        heading2('1.3  Biological Treatment: MBBR Reactor'),
        para([
          bold('Process Rationale:  '),
          normal(
            'The post-DAF effluent presents two simultaneous biological treatment challenges: (i) residual COD at ~6,000 mg/l requiring further reduction to below the CETP limit of 2,750 mg/l, and (ii) Ammoniacal Nitrogen at ~139 mg/l requiring nitrification to below 50 mg/l. The Moving Bed Biofilm Reactor (MBBR) addresses both simultaneously. Conventional activated sludge processes at this organic loading would require prohibitively large reactor volumes and produce large quantities of unstable excess sludge. MBBR technology employs free-floating polyethylene carrier media that support dense, stable biofilm on their protected internal surface area — decoupling solids retention time (SRT) from hydraulic retention time (HRT), enabling a compact, high-rate reactor that simultaneously performs heterotrophic COD removal and autotrophic nitrification.'
          )
        ]),
        para([
          bold('MBBR Design Parameters:  ')
        ]),
        bullet('Tank Volume: 25 m³ (MS Epoxy / GLS bolted construction)'),
        bullet('Carrier Media Volume: 13.1 m³, Virgin HDPE (Kaldnes K5 equivalent)'),
        bullet('Specific Protected Surface Area: ≥ 800 m²/m³'),
        bullet('Media Fill Ratio: 55% of net tank volume'),
        bullet('Total Available Biofilm Area: ~10,480 m²'),
        bullet('Aeration: 150 Nm³/hr total air capacity (1W + 1S Roots Blowers) via SS 304 fine-bubble air grid'),
        bullet('Design DO (Dissolved Oxygen): 2.0–4.0 mg/l'),
        bullet('Surface Area Loading Rate (SALR) for Nitrification: 0.75 g NH₄-N/m²/day at 28°C'),
        bullet('NH₄-N Removal Capacity: 10,480 m² × 0.75 g/m²/day = 7.86 kg/day → Outlet NH₄-N: ~42 mg/l (<50 limit ✓)'),
        bullet('Organic Loading Rate (OLR): ~14.4 kg COD/m³/day (high — heterotrophic COD removal dominant; DO control critical)'),
        bullet('COD removal (post-DAF effluent, 6,000 mg/l): 55% target → outlet ~2,700 mg/l (within CETP limit of 2,750 mg/l — marginal)'),
        bullet('BOD removal (post-DAF, ~2,160 mg/l): 60% target → outlet ~864 mg/l (within CETP limit of 1,150 mg/l ✓)'),
        bullet('Important: COD compliance is marginal. Operational discipline (DO ≥ 2 mg/l, stable HRT, no shock loads) is essential.'),
        spacer(1),
        para([
          bold('Internal Recirculation Loop:  '),
          normal(
            'To provide alkalinity for nitrification and to buffer pH fluctuations, an internal recirculation pump returns 100–150% of the MBBR outlet flow back to the head of the Equalization Tank. This recirculation loop also dilutes incoming peak loads and stabilises the biological process.'
          )
        ]),

        heading2('1.4  Clarification: Tube Settler Tank'),
        para([
          normal(
            'MBBR effluent containing detached biofilm solids is conveyed to the Tube Settler Tank. Inclined PVC tube modules (60° angle) promote laminar upflow conditions and efficient gravity settling of biological solids at a low surface overflow rate (1.0–1.5 m³/m²/hr). Settled bio-sludge is periodically withdrawn from the tank hopper and conveyed to the Filter Press. Clarified supernatant overflows to the Treated Water Holding Tank.'
          )
        ]),

        heading2('1.5  Treated Water Holding Tank & Discharge'),
        para([
          normal(
            'The Treated Water Holding Tank (TWHT) serves as a final buffer for quality verification before discharge. Online/grab sample monitoring of key parameters confirms compliance with SEZ CETP inlet standards. On confirmation of compliance, treated effluent is discharged to the Mangalore SEZ CETP network. In the event of a non-compliance event, the TWHT allows recirculation back to the head of the plant for re-treatment.'
          )
        ]),

        heading2('1.6  Sludge Handling & Dewatering'),
        para([
          normal(
            'Two sludge streams are generated. Due to the high COD (12,000 mg/l) and TSS (1,200 mg/l) loading, sludge quantities are substantially higher than typical low-strength effluents: (a) Chemical sludge from the DAF surface scraper: 40–55 kg dry solids/day (comprising removed TSS, oil sludge, and PAC-polymer floc); and (b) Biological sludge from the Tube Settler underflow: 25–35 kg dry solids/day (excess biofilm from the MBBR carrier media). Both streams are fed by AODD (Air-Operated Double Diaphragm) or Progressive Cavity pumps to the Chamber Filter Press (500×500 mm, 20 plates). At ~65–90 kg total DS/day, the filter press will operate approximately 5–8 cycles per day. The Filter Press produces dry filter cakes (25–32% dry solids) which must be stored in leak-proof containers and disposed through a CPCB/KSPCB-authorised Treated, Storage & Disposal Facility (TSDF) for hazardous wastes. Filtrate from the press is returned to the Raw ETP Sump head.'
          )
        ]),
        pageBreak(),

        // ═══ SECTION 2: DESIGN BASIS ══════════════════════════════════════
        heading1('Section 2 — Design Basis & Performance Guarantees'),
        heading2('2.1  Influent Design Parameters'),
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [900, 3600, 2000, 2200, 740],
          rows: [
            headerRow([
              ['S.No.', 900],
              ['Parameter', 3600],
              ['Raw Measured Value', 2000],
              ['CETP Inlet Limit', 2200],
              ['Units', 740]
            ]),
            ...([
              ['1',  'pH (Reaction)',                              '5.18',    '5.5 – 9.0',  '—'],
              ['2',  'Oil & Grease (O&G)',                        '647',     '20',         'mg/l'],
              ['3',  'Ammoniacal Nitrogen (NH₄-N)',               '154',     '50',         'mg/l'],
              ['4',  'Chemical Oxygen Demand (COD)',              '12,000',  '2,750',      'mg/l'],
              ['5',  'Biochemical Oxygen Demand (BOD₅)',          '3,600',   '1,150',      'mg/l'],
              ['6',  'Total Suspended Solids (TSS)',              '1,200',   '100',        'mg/l'],
              ['7',  'Total Dissolved Solids (TDS)',              '1,388',   '2,100',      'mg/l'],
              ['8',  'Selenium (Se)',                             '0.063',   '0.05',       'mg/l'],
              ['9',  'Copper (Cu)',                               '0.851',   '3.0',        'mg/l'],
              ['10', 'Zinc (Zn)',                                 '10.959',  '15.0',       'mg/l'],
              ['11', 'Chromium (Total)',                          '0.032',   '2.0',        'mg/l'],
              ['12', 'Phenolic Compounds (as C₆H₅OH)',           '<0.01',   '5.0',        'mg/l'],
              ['13', 'Cyanide (CN)',                              '<0.01',   '2.0',        'mg/l'],
            ]).map(([a,b,c,d,e], i) => dataRow([[a,900,AlignmentType.CENTER],[b,3600],[c,2000,AlignmentType.CENTER],[d,2200,AlignmentType.CENTER],[e,740,AlignmentType.CENTER]], i%2===0))
          ]
        }),
        para([normal('Source: Laboratory analysis report dated 11-Jun-2026 (sister facility, same manufacturing process). Parameters not listed are below detection limits. Bold parameters in red indicate CETP non-compliance at raw source.')]),
        spacer(1),
        heading2('2.2  Guaranteed Outlet Parameters'),
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [900, 3100, 1600, 1800, 900, 1140],
          rows: [
            headerRow([
              ['S.No.', 900],
              ['Parameter', 3100],
              ['Raw Inlet', 1600],
              ['Guaranteed Outlet', 1800],
              ['CETP Limit', 900],
              ['Status', 1140]
            ]),
            ...([
              ['1',  'pH',                    '5.18',    '6.5–8.0',  '5.5–9.0',   '✓ Compliant'],
              ['2',  'Oil & Grease (mg/l)',   '647',     '<10',      '20',         '✓ Compliant'],
              ['3',  'NH₄-N (mg/l)',          '154',     '<45',      '50',         '✓ Compliant'],
              ['4',  'COD (mg/l)',            '12,000',  '<2,600',   '2,750',      '⚠ Marginal'],
              ['5',  'BOD₅ (mg/l)',           '3,600',   '<900',     '1,150',      '✓ Compliant'],
              ['6',  'TSS (mg/l)',            '1,200',   '<80',      '100',        '✓ Compliant'],
              ['7',  'TDS (mg/l)',            '1,388',   '<1,500',   '2,100',      '✓ Compliant'],
              ['8',  'Selenium (mg/l)',        '0.063',   '<0.04',    '0.05',       '✓ Compliant'],
            ]).map(([a,b,c,d,e,f], i) => dataRow([[a,900,AlignmentType.CENTER],[b,3100],[c,1600,AlignmentType.CENTER],[d,1800,AlignmentType.CENTER],[e,900,AlignmentType.CENTER],[f,1140,AlignmentType.CENTER]], i%2===0))
          ]
        }),
        para([
          normal('Note: Guaranteed outlet quality is based on continuous stable operation with influent within ±20% of design parameters. '),
          bold('⚠ COD compliance is marginal: '),
          normal('design shows ~2,600 mg/l outlet vs. 2,750 mg/l CETP limit. Operational conditions (DO ≥ 2 mg/l, stable HRT, media health) must be maintained consistently. A 6–8 week MBBR biological commissioning period is required before performance guarantees apply. Spans Envirotech will conduct a formal Performance Trial Run (PTR) with third-party-verified effluent analysis.')
        ], { spacing: { before: 80, after: 80 } }),
        pageBreak(),

        // ═══ SECTION 3: BOQ ══════════════════════════════════════════════
        heading1('Section 3 — Detailed Bill of Quantities (BOQ)'),
        para([
          bold('Client:  '),
          normal('Nuwill Research and Innovations Pvt. Limited   '),
          bold('Project:  '),
          normal('60 KL/Day Effluent Pre-Treatment Plant, Mangalore SEZ')
        ]),
        spacer(1),
        (() => {
          const colW = [700, 4020, 900, 2800, 1100, 1120];
          return new Table({
            width: { size: TABLE_W, type: WidthType.DXA },
            columnWidths: colW,
            rows: [
              headerRow([
                ['Item\nNo.', colW[0]],
                ['Equipment / Description', colW[1]],
                ['Qty', colW[2]],
                ['Material of Construction (MOC)', colW[3]],
                ['Unit Rate\n(INR)', colW[4]],
                ['Total Price\n(INR)', colW[5]]
              ]),
              ...boqData.map(([no, desc, qty, moc, unit, total], i) =>
                new TableRow({
                  children: [
                    makeCell(no, { align: AlignmentType.CENTER, width: colW[0], bg: i%2===0?'EBF5FB':'FFFFFF', size: 19 }),
                    makeCell(desc, { width: colW[1], bg: i%2===0?'EBF5FB':'FFFFFF', size: 19 }),
                    makeCell(qty, { align: AlignmentType.CENTER, width: colW[2], bg: i%2===0?'EBF5FB':'FFFFFF', size: 19 }),
                    makeCell(moc, { width: colW[3], bg: i%2===0?'EBF5FB':'FFFFFF', size: 18 }),
                    makeCell(unit, { align: AlignmentType.RIGHT, width: colW[4], bg: i%2===0?'EBF5FB':'FFFFFF', size: 19 }),
                    makeCell(total, { align: AlignmentType.RIGHT, width: colW[5], bg: i%2===0?'EBF5FB':'FFFFFF', size: 19 }),
                  ]
                })
              ),
              // Sub-total
              new TableRow({
                children: [
                  makeCell('', { width: colW[0], bg: 'D0EBFF' }),
                  makeCell('Sub-Total — Mechanical, Structural & Electrical Supply', { bold: true, width: colW[1]+colW[2]+colW[3], bg: 'D0EBFF', size: 20 }),
                  makeCell('', { width: colW[2], bg: 'D0EBFF' }),
                  makeCell('', { width: colW[3], bg: 'D0EBFF' }),
                  makeCell('', { width: colW[4], bg: 'D0EBFF' }),
                  makeCell('₹ 47,12,000', { bold: true, align: AlignmentType.RIGHT, width: colW[5], bg: 'D0EBFF', size: 20 }),
                ]
              }),
              // Erection
              new TableRow({
                children: [
                  makeCell('19', { align: AlignmentType.CENTER, width: colW[0], bg: 'F8F9FA', size: 19 }),
                  makeCell('Erection, Installation, Commissioning & Trial Run', { width: colW[1], bg: 'F8F9FA', size: 19 }),
                  makeCell('1 Lot', { align: AlignmentType.CENTER, width: colW[2], bg: 'F8F9FA', size: 19 }),
                  makeCell('On-Site Labour, Tools & Consumables by Spans', { width: colW[3], bg: 'F8F9FA', size: 18 }),
                  makeCell('3,50,000', { align: AlignmentType.RIGHT, width: colW[4], bg: 'F8F9FA', size: 19 }),
                  makeCell('3,50,000', { align: AlignmentType.RIGHT, width: colW[5], bg: 'F8F9FA', size: 19 }),
                ]
              }),
              // Grand total
              new TableRow({
                children: [
                  makeCell('', { width: colW[0], bg: '1971C2' }),
                  makeCell('GRAND TOTAL — EX-WORKS + ERECTION (Before GST)', { bold: true, width: colW[1]+colW[2]+colW[3], bg: '1971C2', size: 20 }),
                  makeCell('', { width: colW[2], bg: '1971C2' }),
                  makeCell('', { width: colW[3], bg: '1971C2' }),
                  makeCell('', { width: colW[4], bg: '1971C2' }),
                  makeCell('₹ 50,62,000', { bold: true, align: AlignmentType.RIGHT, width: colW[5], bg: '1971C2', size: 20 }),
                ]
              }),
              // GST
              new TableRow({
                children: [
                  makeCell('', { width: colW[0], bg: 'D0EBFF' }),
                  makeCell('Add: GST @ 18%', { bold: true, width: colW[1]+colW[2]+colW[3], bg: 'D0EBFF', size: 20 }),
                  makeCell('', { width: colW[2], bg: 'D0EBFF' }),
                  makeCell('', { width: colW[3], bg: 'D0EBFF' }),
                  makeCell('', { width: colW[4], bg: 'D0EBFF' }),
                  makeCell('₹ 9,11,160', { bold: true, align: AlignmentType.RIGHT, width: colW[5], bg: 'D0EBFF', size: 20 }),
                ]
              }),
              // Total with GST
              new TableRow({
                children: [
                  makeCell('', { width: colW[0], bg: '1A6330' }),
                  makeCell('TOTAL PROJECT COST (Inclusive of GST @ 18%)', { bold: true, width: colW[1]+colW[2]+colW[3], bg: '1A6330', size: 21 }),
                  makeCell('', { width: colW[2], bg: '1A6330' }),
                  makeCell('', { width: colW[3], bg: '1A6330' }),
                  makeCell('', { width: colW[4], bg: '1A6330' }),
                  makeCell('₹ 59,73,160', { bold: true, align: AlignmentType.RIGHT, width: colW[5], bg: '1A6330', size: 21 }),
                ]
              }),
            ]
          });
        })(),
        spacer(1),
        para([normal('Note: Unit rates and total prices are indicative budgetary figures. Firm pricing shall be issued upon receipt of signed Purchase Order and confirmation of site survey data. All prices are in Indian Rupees (INR) and are valid for 30 days from date of this proposal.')]),
        pageBreak(),

        // ═══ SECTION 4: UTILITIES ═════════════════════════════════════════
        heading1('Section 4 — Utility & Operational Requirements'),

        heading2('4.1  Electrical Power Consumption'),
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [600, 3800, 1100, 1200, 1200, 1540],
          rows: [
            headerRow([
              ['S.No.', 600],
              ['Equipment', 3800],
              ['Qty', 1100],
              ['Unit kW', 1200],
              ['Connected\nLoad (kW)', 1200],
              ['Running\nLoad (kW)', 1540]
            ]),
            ...([
              ['1', 'Belt Oil Skimmer (Drive Motor)',           '1', '0.37', '0.37', '0.37'],
              ['2', 'EQ Tank Air Blower (Agitation)',           '1', '1.50', '1.50', '1.50'],
              ['3', 'Equalization Transfer Pump (1W+1S)',       '2', '3.00', '6.00', '3.00'],
              ['4', 'DAF System (Recycle Pump + Motor)',        '1', '3.70', '3.70', '3.70'],
              ['5', 'Chemical Dosing Pumps (3 Nos.)',           '3', '0.09', '0.27', '0.27'],
              ['6', 'MBBR Air Blower Roots Type (1W+1S)',       '2', '5.50', '11.00','5.50'],
              ['7', 'Internal Recirculation Pump',              '1', '2.20', '2.20', '2.20'],
              ['8', 'Filter Press Feed Pump (AODD/PC, 1W+1S)', '2', '1.50', '3.00', '1.50'],
              ['9', 'Miscellaneous (Lighting, Controls, Instruments)','—','—','2.00','1.50'],
            ]).map(([a,b,c,d,e,f], i) => dataRow([[a,600,AlignmentType.CENTER],[b,3800],[c,1100,AlignmentType.CENTER],[d,1200,AlignmentType.RIGHT],[e,1200,AlignmentType.RIGHT],[f,1540,AlignmentType.RIGHT]], i%2===0)),
            new TableRow({
              children: [
                makeCell('', {width:600, bg:'1971C2'}),
                makeCell('TOTAL', {bold:true, width:3800+1100+1200, bg:'1971C2', size:20}),
                makeCell('', {width:1100, bg:'1971C2'}),
                makeCell('', {width:1200, bg:'1971C2'}),
                makeCell('~30.04', {bold:true, align:AlignmentType.RIGHT, width:1200, bg:'1971C2', size:20}),
                makeCell('~19.54', {bold:true, align:AlignmentType.RIGHT, width:1540, bg:'1971C2', size:20}),
              ]
            })
          ]
        }),
        spacer(1),
        para([
          bold('Note:  '),
          normal('Power supply required: 415V ± 5%, 3-Phase, 50 Hz AC. Maximum Demand ~20 kVA (running). Earthing, lightning protection, and cable trays are in client scope unless otherwise agreed.')
        ]),

        spacer(1),
        heading2('4.2  Chemical Consumption Estimates'),
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [600, 3200, 1500, 1500, 2640],
          rows: [
            headerRow([
              ['S.No.', 600],
              ['Chemical', 3200],
              ['Dosing Rate\n(mg/l)', 1500],
              ['Daily Consumption\n(kg/day)', 1500],
              ['Remarks', 2640]
            ]),
            ...([
              ['1', 'Poly Aluminium Chloride (PAC, 30% solution)',  '250–350',  '15–21',  'Coagulation in EQ Tank / DAF. Higher dose due to COD 12,000 mg/l + TSS 1,200 mg/l'],
              ['2', 'Anionic Polyelectrolyte (0.1% solution)',      '3–5',      '0.18–0.30','Flocculation, dosed 30–60 sec after PAC'],
              ['3', 'Sodium Hydroxide (NaOH, 48%)',                 '300–400',  '18–24',  'Primary pH correction: raw pH 5.18 → target 7.0. High dose required. Auto-dosing with pH loop.'],
              ['4', 'Hydrochloric Acid (HCl, 30%)',                 'As reqd.', '2–4',    'pH reduction only if effluent becomes alkaline — standby duty'],
              ['5', 'Di-Ammonium Phosphate (DAP) — nutrient',       '10–20',    '0.6–1.2','Phosphorus supplement for MBBR if P-limited; check effluent P levels after 30 days'],
            ]).map(([a,b,c,d,e], i) => dataRow([[a,600,AlignmentType.CENTER],[b,3200],[c,1500,AlignmentType.CENTER],[d,1500,AlignmentType.CENTER],[e,2640]], i%2===0))
          ]
        }),

        spacer(1),
        heading2('4.3  Sludge Generation & Disposal'),
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [600, 2800, 1500, 1500, 3040],
          rows: [
            headerRow([
              ['S.No.', 600],
              ['Sludge Stream', 2800],
              ['Wet Sludge\n(l/day)', 1500],
              ['Dry Solids\n(kg/day)', 1500],
              ['Disposal Route', 3040]
            ]),
            ...([
              ['1', 'Chemical Sludge (from DAF surface scraper)',      '1,400–1,800', '40–55', 'High due to TSS 1,200 mg/l + COD 12,000 mg/l feed. Filter Press → Dry Cake → Authorised TSDF'],
              ['2', 'Biological Sludge (from Tube Settler underflow)', '900–1,200',   '25–35', 'MBBR excess biofilm sludge. Filter Press → Dry Cake → Authorised TSDF'],
              ['3', 'Filter Press Filtrate (combined)',                '~2,300–3,000','—',     'Returned to Raw ETP Sump head for re-treatment'],
            ]).map(([a,b,c,d,e], i) => dataRow([[a,600,AlignmentType.CENTER],[b,2800],[c,1500,AlignmentType.CENTER],[d,1500,AlignmentType.CENTER],[e,3040]], i%2===0))
          ]
        }),
        para([normal('TSDF = Treatment, Storage & Disposal Facility authorised under KSPCB/MoEFCC. Exact sludge characterisation and TCLP analysis will determine disposal classification.')]),

        spacer(1),
        heading2('4.4  Water & Other Utilities'),
        bullet('Fresh Water (instrument / seal water):  ~0.5 m³/day'),
        bullet('Compressed Air (for AODD pumps):  Dry ISA-quality air, 5–7 bar, ~50 NL/min'),
        bullet('Laboratory Facilities:  Basic pH meter, COD digester, DO meter — by client'),
        bullet('Effluent Sampling Points:  At Raw Sump, DAF outlet, MBBR outlet, and Treated Water Holding Tank'),
        pageBreak(),

        // ═══ SECTION 5: COMMERCIAL TERMS ═════════════════════════════════
        heading1('Section 5 — Commercial Terms & Conditions'),

        heading2('5.1  Price Basis'),
        bullet('All prices quoted are on an Ex-Works (EXW) basis from Spans Envirotech Pvt. Ltd. manufacturing/fabrication facility.'),
        bullet('Freight, transit insurance, unloading at site, and crane/rigging charges are in the Client\'s scope unless specifically included in the contracted BOQ.'),
        bullet('Site civil works including foundations, anchor bolts, underground piping, trenches, boundary wall, and service connections are in the Client\'s scope.'),
        bullet('Prices are valid for a period of 30 days from the date of this proposal. Post this period, prices are subject to revision based on applicable material cost indices.'),

        heading2('5.2  Taxes & Statutory Levies'),
        bullet('Goods & Services Tax (GST) @ 18% (or as applicable under prevailing GST law) is applicable over and above the quoted prices and shall be paid by the Client.'),
        bullet('Any new or increased taxes, levies, customs duties, or surcharges introduced after the date of Purchase Order shall be to the Client\'s account.'),
        bullet('GST invoices will be raised in accordance with applicable GST rules, and the Client shall provide GSTIN for registration under reverse charge or composition scheme if applicable.'),

        heading2('5.3  Delivery & Execution Schedule'),
        new Table({
          width: { size: TABLE_W, type: WidthType.DXA },
          columnWidths: [700, 5200, 2100, 1440],
          rows: [
            headerRow([['S.No.',700],['Milestone',5200],['Timeline (Weeks from PO)',2100],['Responsibility',1440]]),
            ...([
              ['1', 'Receipt of Purchase Order (PO) & Advance Payment',         'Week 0',       'Client'],
              ['2', 'Engineering & Drawing Submission (P&ID, GA, Layout)',        'Weeks 1–2',    'Spans'],
              ['3', 'Client Approval of Drawings & Technical Documents',          'Weeks 2–3',    'Client'],
              ['4', 'Material Procurement & Tank Fabrication',                    'Weeks 2–10',   'Spans'],
              ['5', 'Equipment Testing (FAT at Works, if applicable)',             'Week 10–11',   'Spans'],
              ['6', 'Dispatch & Delivery to Site (Ex-Works)',                     'Week 10–12',   'Spans'],
              ['7', 'Erection, Piping & Electrical Commissioning at Site',        'Weeks 12–14',  'Spans'],
              ['8', 'Biological Start-Up & Media Inoculation (MBBR)',             'Week 14–16',   'Spans'],
              ['9', 'Performance Trial Run & Effluent Quality Demonstration',     'Weeks 16–18',  'Spans'],
              ['10','Handover with O&M Manual & Operator Training',               'Week 18',      'Spans'],
            ]).map(([a,b,c,d], i) => dataRow([[a,700,AlignmentType.CENTER],[b,5200],[c,2100,AlignmentType.CENTER],[d,1440,AlignmentType.CENTER]], i%2===0))
          ]
        }),
        para([bold('Total Project Duration: '), normal('Approximately 16–18 weeks from PO receipt to performance trial completion. MBBR biological start-up and nitrification establishment (steady-state biofilm formation) may require an additional 6–8 weeks of operational conditioning before performance guarantees are tested.')]),

        heading2('5.4  Payment Terms'),
        bullet('40% — Advance payment along with Purchase Order (against Bank Guarantee if required)'),
        bullet('50% — Against pro-forma invoice upon readiness for dispatch of major equipment'),
        bullet('10% — Upon successful commissioning and handover, to be released within 30 days of Performance Trial completion'),
        para([normal('All payments shall be made by RTGS/NEFT to the designated Spans Envirotech Pvt. Ltd. bank account. Payment terms are subject to credit approval.')]),

        heading2('5.5  Warranty & Guarantee'),
        bullet('Equipment Warranty: 12 months from the date of successful commissioning or 18 months from the date of dispatch, whichever is earlier.'),
        bullet('Process Performance Guarantee: Outlet parameters as specified in Section 2.2 are guaranteed for a period of 6 months from the date of stable operation, subject to influent quality being within design envelope (±20%).'),
        bullet('Warranty does not cover consumables (filter cloth, chemicals, media), damage due to misuse, supply of incorrect or contaminated feed, Acts of God, or vandalism.'),
        bullet('Biological media (HDPE carriers) carry a minimum design life of 10+ years under normal operating conditions.'),
        pageBreak(),

        // ═══ SECTION 6: EXCLUSIONS ════════════════════════════════════════
        heading1('Section 6 — Scope Exclusions (Client Scope)'),
        bullet('All civil work: concrete foundations, RCC slabs, overhead structures, buildings, boundary walls, and drainage channels.'),
        bullet('Electrical supply up to MCC incoming terminals (main power supply connection, cable from substation).'),
        bullet('Fresh water supply, raw water treatment, DM water system, and utility air compressor.'),
        bullet('Laboratory setup and analytical instruments for self-monitoring.'),
        bullet('Permits, consents, and approvals including KSPCB/SEZ consent-to-establish and consent-to-operate.'),
        bullet('Operator provision and utilities (power, water, compressed air) during installation and commissioning.'),
        bullet('Sludge transport and disposal to TSDF (authorised waste management contractor).'),
        bullet('Insurance of equipment at site after delivery.'),
        bullet('Any statutory third-party inspection fees (CCOE, PESO, IBR, etc.) not specified in BOQ.'),

        spacer(2),
        hr(),
        new Paragraph({
          children: [
            bold('For and on behalf of Spans Envirotech Pvt. Ltd.', 22)
          ],
          spacing: { before: 200, after: 80 }
        }),
        spacer(3),
        new Paragraph({ children: [normal('____________________________  ', 20), normal('____________________________', 20)], spacing:{before:0,after:60} }),
        new Paragraph({ children: [bold('Authorised Signatory               ', 20), bold('   Date:', 20)], spacing:{before:0,after:60} }),
        para([normal('Spans Envirotech Pvt. Ltd. | Process Engineering & Environmental Solutions')]),
        para([normal('Document Ref: SPANS/P-2622/ETP-001/REV-0   |   Prepared: July 2026   |   Valid for: 30 Days')]),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buf => {
  const outPath = '/sessions/wonderful-eloquent-wright/mnt/outputs/Nuwill_ETP_Technical_Commercial_Proposal_Rev1.docx';
  fs.writeFileSync(outPath, buf);
  console.log('SUCCESS:', outPath);
}).catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
