#!/usr/bin/env python3
"""
TSRS Exam Paper PDF Renamer

Renames TSRS (The Shri Ram School) exam paper PDFs from numeric codes
into descriptive names: Subject_Year_Sheet Type.pdf

Usage:
  # Extract-only mode (generates mapping, doesn't rename)
  python tsrs_rename.py --folder /path/to/pdfs --extract-only

  # Apply renames (uses previously generated mapping or generates fresh)
  python tsrs_rename.py --folder /path/to/pdfs --apply

  # With manual fixes file
  python tsrs_rename.py --folder /path/to/pdfs --fixes fixes.json --apply
"""

import fitz  # PyMuPDF
import os
import re
import json
import csv
import sys
import argparse
from collections import defaultdict
from pathlib import Path


# ─── Subject Normalization ───────────────────────────────────────────────────

def normalize_subject(raw):
    """Map raw subject text to a clean, consistent subject name."""
    raw = raw.strip()
    r = raw.lower().strip()

    mapping = [
        ('chemistry', 'Chemistry'), ('chem', 'Chemistry'),
        ('physics', 'Physics'), ('phy', 'Physics'),
        ('biology', 'Biology'), ('bio', 'Biology'),
        ('mathematics', 'Mathematics'), ('maths', 'Mathematics'), ('math', 'Mathematics'),
        ('hindi language', 'Hindi Language'), ('hindi literature', 'Hindi Literature'),
        ('hindi', 'Hindi'),
        ('history & civics', 'History & Civics'), ('history and civics', 'History & Civics'),
        ('history', 'History'),
        ('civics', 'Civics'),
        ('geography', 'Geography'), ('geo', 'Geography'),
        ('english language', 'English Language'), ('eng lang', 'English Language'),
        ('literature in english', 'English Literature'),
        ('english literature', 'English Literature'), ('eng lit', 'English Literature'),
        ('english', 'English'),
        ('french', 'French'),
        ('spanish', 'Spanish'),
        ('mass media', 'Mass Media & Communication'),
        ('home science', 'Home Science'),
        ('robotics & artificial intelligence', 'Robotics & AI'),
        ('robotics and artificial intelligence', 'Robotics & AI'),
        ('robotics & ai', 'Robotics & AI'), ('robotics and ai', 'Robotics & AI'),
        ('r&ai', 'Robotics & AI'), ('r & ai', 'Robotics & AI'),
        ('physical education', 'Physical Education'),
        ('indian dance', 'Indian Dance'), ('ind-dance', 'Indian Dance'),
        ('hindustani music', 'Hindustani Music'),
        ('music', 'Music'),
        ('computer science', 'Computer Science'), ('computer', 'Computer Science'),
        ('commercial application', 'Commercial Applications'),
        ('economic application', 'Commercial Applications'),
        ('economics', 'Economics'), ('eco', 'Economics'),
        ('evs', 'EVS'), ('environmental', 'EVS'),
        ('commerce', 'Commerce'),
    ]

    for keyword, normalized in mapping:
        if keyword in r:
            return normalized

    return raw.title()


# ─── Year Normalization ──────────────────────────────────────────────────────

def normalize_year(year_str):
    """Normalize year strings to YYYY-YY format."""
    year_str = year_str.strip()

    # 2023-24 or 2023-2024
    m = re.match(r'(\d{4})\s*[-/]\s*(\d{2,4})', year_str)
    if m:
        y1, y2 = m.group(1), m.group(2)
        return f"{y1}-{y2}" if len(y2) == 2 else f"{y1}-{y2[2:]}"

    # Single year: 2025 → 2024-25
    m = re.match(r'^(\d{4})$', year_str)
    if m:
        y = int(m.group(1))
        return f"{y-1}-{str(y)[2:]}"

    # Short: 24-25 → 2024-25
    m = re.match(r'^(\d{2})\s*[-/]\s*(\d{2})$', year_str)
    if m:
        return f"20{m.group(1)}-{m.group(2)}"

    return year_str


# ─── Text Extraction ─────────────────────────────────────────────────────────

def extract_text(filepath, max_pages=2):
    """Extract text from first pages of a PDF."""
    try:
        doc = fitz.open(filepath)
        text = ""
        for i in range(min(max_pages, len(doc))):
            text += doc[i].get_text() + "\n"
        doc.close()
        return text
    except Exception as e:
        return ""


# ─── Metadata Extraction ─────────────────────────────────────────────────────

SUBJECT_KEYWORDS = [
    'Chemistry', 'Physics', 'Biology', 'Mathematics', 'Maths', 'Math',
    'Hindi Language', 'Hindi Literature', 'Hindi',
    'History & Civics', 'History and Civics', 'History', 'Civics',
    'Geography',
    'English Language', 'English Literature', 'Literature in English',
    'French', 'Spanish',
    'Mass Media and Communication', 'Mass Media & Communication',
    'Home Science',
    'Robotics & AI', 'Robotics and AI', 'Robotics & Artificial Intelligence',
    'Robotics and Artificial Intelligence', 'R&AI',
    'Physical Education',
    'Indian Dance', 'IND-DANCE',
    'Hindustani Music', 'Music',
    'Computer Science', 'Computer',
    'Commercial Applications', 'Economic Applications', 'Economics',
    'EVS', 'Environmental Science',
    'Commerce',
]


def extract_metadata(filename, text):
    """
    Extract subject, year, and sheet type from PDF text.
    Returns (subject, year, sheet_type) — any may be None if not found.
    """
    subject = None
    year = None
    sheet_type = None
    is_as = False

    text_lower = text.lower()
    lines = [l.strip() for l in text.split('\n') if l.strip()]

    # ── Answer scheme detection ──
    if any(kw in text_lower for kw in [
        'answering scheme', 'answer key', 'answer scheme', 'marking scheme'
    ]):
        is_as = True

    # ── Year extraction ──
    year_matches = re.findall(r'(\d{4})\s*[-/]\s*(\d{2,4})', text)
    for ym in year_matches:
        y = normalize_year(f"{ym[0]}-{ym[1]}")
        if y.startswith('20'):
            year = y
            break

    if not year:
        single_years = re.findall(r'\b(20\d{2})\b', text)
        for sy in single_years:
            y_int = int(sy)
            if 2018 <= y_int <= 2030:
                year = normalize_year(sy)
                break

    # ── Subject extraction ──
    # Try explicit "Subject: X" pattern
    m = re.search(r'Subject\s*:\s*([A-Za-z&\s]+?)(?:\n|$|Class|Grade)', text)
    if m:
        subject = normalize_subject(m.group(1).strip())

    # Search first 25 lines for subject keywords
    if not subject:
        for line in lines[:25]:
            for kw in SUBJECT_KEYWORDS:
                if kw.lower() in line.lower():
                    subject = normalize_subject(kw)
                    break
            if subject:
                break

    # Try "Class XX\nSubjectName" pattern
    if not subject:
        m = re.search(
            r'Class\s*(?:IX|X{1,2}I{0,2}|9|10|11|12)\s*\n\s*([A-Za-z&\s\(\)]+?)(?:\s*\n|\s*$)',
            text
        )
        if m:
            subj = re.sub(r'\s*\(Part.*?\)', '', m.group(1).strip())
            if len(subj) > 2:
                subject = normalize_subject(subj)

    # ── Class extraction (for non-IX classes) ──
    class_label = None
    class_match = re.search(
        r'(?:Class|Grade)\s*[-:\s]?\s*(IX|X{1,2}I{0,2}|9|10|11|12)\b', text, re.IGNORECASE
    )
    if class_match:
        raw_class = class_match.group(1).upper()
        class_map = {'9': 'IX', '10': 'X', '11': 'XI', '12': 'XII'}
        class_label = class_map.get(raw_class, raw_class)

    # ── Sheet type extraction ──
    parts = []

    # Term detection
    term_match = re.search(r'Term\s*[-\s]?(\d)', text, re.IGNORECASE)
    if term_match:
        parts.append(f"Term {term_match.group(1)}")

    # Paper type detection (priority order)
    if re.search(r'\bexamination\b|\bexam\b', text_lower):
        parts.append('Examination')
    elif re.search(r'\bsample\s*paper\b|\bspecimen\b', text_lower):
        parts.append('Sample Paper')
    elif re.search(r'\bmixed\s*bag\b', text_lower):
        mb = re.search(r'mixed\s*bag\s*[-\s#]?(\d+)?', text_lower)
        num = mb.group(1) if mb and mb.group(1) else ''
        parts.append(f"Mixed Bag{' ' + num if num else ''}")
    elif re.search(r'(?:reinforcement|revision)\s*work\s*-?\s*sheet', text_lower):
        rws = re.search(r'(?:reinforcement|revision)\s*work\s*-?\s*sheet\s*[-\s#]?(\d+)?', text_lower)
        num = rws.group(1) if rws and rws.group(1) else ''
        parts.append(f"Revision Worksheet{' ' + num if num else ''}")
    elif re.search(r'\bwork\s*-?\s*sheet\b', text_lower):
        ws = re.search(r'work\s*-?\s*sheet\s*[-\s#]?(\d+)?', text_lower)
        num = ws.group(1) if ws and ws.group(1) else ''
        parts.append(f"Worksheet{' ' + num if num else ''}")
    elif re.search(r'\bexam\s*tips\b', text_lower):
        parts.append('Exam Tips')
    elif re.search(r'\bnotes?\b|\blesson\b', text_lower):
        parts.append('Study Notes')
    else:
        parts.append('Paper')

    # Topic extraction (optional)
    topic_match = re.search(r'Topic\s*:\s*([^\n]+)', text)
    if topic_match:
        topic = topic_match.group(1).strip()
        if len(topic) < 50:
            parts.append(f"({topic})")

    sheet_type = '_'.join(parts)

    if is_as:
        sheet_type += '_Answering Scheme'

    # Include class if not IX (since IX is the default/most common)
    if class_label and class_label not in ('IX',):
        sheet_type = f"Class {class_label}_{sheet_type}"

    return subject, year, sheet_type


# ─── Rename Mapping ──────────────────────────────────────────────────────────

def build_mapping(folder, fixes=None):
    """
    Build a rename mapping for all PDFs in the folder.
    Returns list of (original_name, new_name, subject, year, sheet_type) tuples.
    """
    fixes = fixes or {}
    files = sorted([f for f in os.listdir(folder) if f.lower().endswith('.pdf')])

    mapping = []
    name_counts = defaultdict(int)

    for filename in files:
        if filename in fixes:
            subject, year, sheet_type = fixes[filename]
        else:
            filepath = os.path.join(folder, filename)
            text = extract_text(filepath)

            if not text.strip():
                subject, year, sheet_type = None, None, None
            else:
                subject, year, sheet_type = extract_metadata(filename, text)

        subject = subject or 'Unknown Subject'
        year = year or 'Unknown Year'
        sheet_type = sheet_type or 'Paper'

        base_name = f"{subject}_{year}_{sheet_type}"
        base_name = re.sub(r'[<>:"/\\|?*]', '-', base_name)
        base_name = re.sub(r'\s+', ' ', base_name).strip()

        name_counts[base_name] += 1
        if name_counts[base_name] > 1:
            new_name = f"{base_name} (copy {name_counts[base_name]}).pdf"
        else:
            new_name = f"{base_name}.pdf"

        mapping.append((filename, new_name, subject, year, sheet_type))

    return mapping


def save_mapping_csv(mapping, output_path):
    """Save the rename mapping as a CSV for easy review."""
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Original', 'New Name', 'Subject', 'Year', 'Sheet Type'])
        for orig, new, subj, yr, st in mapping:
            writer.writerow([orig, new, subj, yr, st])


def apply_renames(folder, mapping):
    """Apply the rename mapping to actual files."""
    success = 0
    errors = 0
    skipped = 0

    for orig, new, *_ in mapping:
        old_path = os.path.join(folder, orig)
        new_path = os.path.join(folder, new)

        if not os.path.exists(old_path):
            print(f"  SKIP (not found): {orig}")
            skipped += 1
            continue

        if old_path == new_path:
            print(f"  SKIP (same name): {orig}")
            skipped += 1
            continue

        # Handle conflicts
        if os.path.exists(new_path):
            base, ext = os.path.splitext(new)
            counter = 2
            while os.path.exists(os.path.join(folder, f"{base} (dup {counter}){ext}")):
                counter += 1
            new = f"{base} (dup {counter}){ext}"
            new_path = os.path.join(folder, new)

        try:
            os.rename(old_path, new_path)
            success += 1
        except Exception as e:
            print(f"  ERROR: {orig} -> {new}: {e}")
            errors += 1

    return success, errors, skipped


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='TSRS Exam Paper PDF Renamer')
    parser.add_argument('--folder', required=True, help='Path to folder containing PDFs')
    parser.add_argument('--extract-only', action='store_true',
                        help='Only extract metadata and save mapping (no renaming)')
    parser.add_argument('--apply', action='store_true',
                        help='Apply the renames')
    parser.add_argument('--fixes', help='Path to JSON file with manual overrides')
    parser.add_argument('--output', default='rename_mapping.csv',
                        help='Output path for the mapping CSV (default: rename_mapping.csv)')

    args = parser.parse_args()

    if not os.path.isdir(args.folder):
        print(f"Error: '{args.folder}' is not a valid directory")
        sys.exit(1)

    # Load fixes if provided
    fixes = {}
    if args.fixes:
        with open(args.fixes, 'r') as f:
            fixes = json.load(f)

    # Build mapping
    print(f"Scanning PDFs in: {args.folder}")
    mapping = build_mapping(args.folder, fixes)

    total = len(mapping)
    unknowns = [(o, n, s, y, t) for o, n, s, y, t in mapping if 'Unknown' in n]

    print(f"\nFound {total} PDF files")
    print(f"Files with unknown metadata: {len(unknowns)}")

    if unknowns:
        print("\n⚠ Files needing attention:")
        for orig, new, subj, yr, stype in unknowns:
            print(f"  {orig:<45} → {new}")

    # Print full mapping
    print(f"\n{'ORIGINAL':<45} {'NEW NAME'}")
    print("=" * 130)
    for orig, new, *_ in mapping:
        print(f"{orig:<45} {new}")

    # Save CSV
    save_mapping_csv(mapping, args.output)
    print(f"\nMapping saved to: {args.output}")

    # Apply if requested
    if args.apply and not args.extract_only:
        print("\nApplying renames...")
        success, errors, skipped = apply_renames(args.folder, mapping)
        print(f"\nDone! Renamed: {success}, Errors: {errors}, Skipped: {skipped}")
    elif not args.extract_only and not args.apply:
        print("\nUse --extract-only to just see the mapping, or --apply to rename files.")


if __name__ == '__main__':
    main()
