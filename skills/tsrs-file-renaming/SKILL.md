---
name: tsrs-file-renaming
description: >
  Rename TSRS (The Shri Ram School) exam paper PDFs from cryptic numeric filenames
  (like 100841_2.pdf) into human-readable names following the format:
  Subject Name_Year_Sheet Type.pdf (e.g., Chemistry_2023-24_Term 2_Examination.pdf).
  Use this skill whenever the user mentions renaming school papers, TSRS files,
  exam PDFs, or has a folder of numbered PDF files from a school that need
  descriptive names. Also trigger when the user says things like "organize my
  exam papers", "rename these question papers", "fix these PDF filenames",
  or mentions TSRS, Shri Ram School, or ICSE/ISC exam papers.
---

# TSRS File Renaming Skill

This skill renames TSRS (The Shri Ram School) exam paper PDFs from numeric codes
into descriptive names. The target format is:

```
Subject Name_Year_Sheet Type.pdf
```

Examples:
- `100841_2.pdf` → `Chemistry_2023-24_Term 2_Examination_Answering Scheme.pdf`
- `80192_1.pdf` → `Mass Media & Communication_2023-24_Term 1_Examination_Answering Scheme.pdf`
- `Bio T1 QP.pdf` → `Biology_2023-24_Term 1_Examination.pdf`

## How It Works

The skill extracts metadata by reading text from the first 1-2 pages of each PDF.
TSRS papers follow recognizable patterns in their headers and body text that
reveal the subject, academic year, and type of paper.

## Step-by-Step Workflow

### 1. Install dependencies

```bash
pip install pymupdf --break-system-packages -q
```

### 2. Run the extraction script

The bundled script at `scripts/tsrs_rename.py` handles the full workflow.
Run it in **extract mode** first to generate a mapping without renaming anything:

```bash
python <skill-path>/scripts/tsrs_rename.py --folder "<path-to-folder>" --extract-only
```

This produces a `rename_mapping.csv` file in the working directory showing
every PDF's proposed new name. It also prints a summary to stdout.

### 3. Review the mapping with the user

Present the mapping to the user. Pay special attention to:

- **Files marked "Unknown Subject"** — these need manual identification.
  Read their first page text and ask the user what subject they are.
- **Files marked "Unknown Year"** — same approach. Often the year can be
  inferred from surrounding files or the file's modification date.
- **Duplicate names** — files that map to the same new name get a "(copy N)"
  suffix. Check if they're genuinely identical files or different papers that
  need more specific names.

Ask the user to confirm or correct any issues before proceeding.

### 4. Apply manual fixes

If the user provides corrections, update the mapping CSV accordingly.
The script accepts a `--fixes` argument with a JSON file of overrides:

```json
{
  "original_filename.pdf": ["Correct Subject", "2024-25", "Term 1_Examination"]
}
```

```bash
python <skill-path>/scripts/tsrs_rename.py --folder "<path>" --fixes fixes.json
```

### 5. Apply the renames

Once the user approves:

```bash
python <skill-path>/scripts/tsrs_rename.py --folder "<path>" --apply
```

This renames all files and prints a summary of what changed.

## Metadata Extraction Patterns

TSRS papers embed metadata in several locations. The script checks them in
priority order:

### Header code line (most reliable)
Found in the first few lines, these follow patterns like:
- `TSRS/NT/Chemistry/2023-24`
- `Term 2/NSH/Hindi/Answering Scheme/2025`
- `SJ/WS/TSRS-m/IX-Physics/2024-25`
- `TSRS M/T2/MJ/Geography/2023-24`

### Structured body text
After "The Shri Ram School Moulsari Campus", papers typically list:
- Exam type: "Term 1 Examination, 2023-24"
- Class: "Class IX" / "Class X" / "Grade 9"
- Subject name on its own line

### Subject line or explicit label
- `Subject: Geography`
- `Class IX\nChemistry`

### Answer scheme indicators
Look for: "Answering Scheme", "Answer Key", "Marking Scheme", "Answer Scheme"

## Subject Normalization

The script normalizes subject names to consistent forms:

| Raw text variations | Normalized to |
|---|---|
| Chem, Chemistry | Chemistry |
| Phy, Physics | Physics |
| Bio, Biology | Biology |
| Math, Maths, Mathematics | Mathematics |
| Eng Lang, English Language | English Language |
| Eng Lit, English Literature, Literature in English | English Literature |
| Geo, Geography | Geography |
| R&AI, Robotics and AI, Robotics & Artificial Intelligence | Robotics & AI |
| EVS, Environmental Science | EVS |
| Mass Media and Communication | Mass Media & Communication |
| Phy Ed, Physical Education | Physical Education |
| Commercial Applications, Economic Applications | Commercial Applications |

## Year Normalization

Years are normalized to `YYYY-YY` format:
- `2023-2024` → `2023-24`
- `2025` (single year) → `2024-25` (assumes academic year ending)
- `24-25` → `2024-25`

## Sheet Type Classification

The script identifies these paper types (in priority order):

1. **Examination** — contains "examination" or "exam" keyword
2. **Sample Paper** — contains "sample paper" or "specimen"
3. **Mixed Bag** — revision compilations, numbered if multiple
4. **Revision Worksheet** / **Reinforcement Worksheet**
5. **Worksheet** — general worksheets, sometimes topic-specific
6. **Study Notes** — lesson material or notes
7. **Exam Tips** — preparation guidance

Each is prefixed with the term if applicable (e.g., "Term 2_Examination").

## Handling Edge Cases

- **Scanned/image PDFs** (no extractable text): Flag as "Unknown" and ask user
- **Homework files** (HW_ prefix): Extract topic from filename suffix
- **Already-named files** (like "Bio T1 AS.pdf"): Still process through extraction
  to ensure consistent naming
- **Duplicate files** (with "(1)" suffix): Detect and mark as copies
- **Multiple classes**: Extract class from text (Class IX, X, XI, XII) and include
  if not Class IX (since most papers are IX, include class only for others)
- **Files from other schools or ICSE board**: The script handles ICSE specimen
  papers and similar formats

## Output Format Details

The final filename format:

```
Subject_Year_[Term N_]Sheet Type[_Topic][_Answering Scheme].pdf
```

Components:
- **Subject**: Normalized subject name
- **Year**: Academic year in YYYY-YY format
- **Term** (optional): "Term 1" or "Term 2" if applicable
- **Sheet Type**: Examination, Worksheet, Mixed Bag, etc.
- **Topic** (optional): Specific topic like "Trigonometry" or "Elections"
- **Answering Scheme** (optional): Appended if it's an answer key/marking scheme
