---
name: business-card-to-csv
description: Extracts contact details from photos of business cards (visiting cards) and compiles them into a simple CSV file with Company Name, Person Name, Designation, Phone Number, and Email ID. Use this skill whenever the user uploads photo(s) of business cards, visiting cards, or contact cards and wants them digitized, extracted, converted to a spreadsheet/CSV/Excel list, or organized into a contact list. Trigger this even if the user just says "extract these business cards," "digitize these cards," "make a contact list from these photos," or uploads several card images without further explanation — this skill's job is to turn card photos into a clean CSV every time.
---

# Business Card to CSV

Extracts contact details from one or more photos of business cards and produces a single CSV file with five columns: **Company Name, Person Name, Designation, Phone Number, Email ID**.

## Workflow

1. **Locate the images.** Check `/mnt/user-data/uploads` for the uploaded photo(s). A single photo may contain **one or multiple business cards** (e.g. a photo of several cards laid out on a table) — treat each card as a separate row.

2. **Read each card carefully.** For every card visible across all uploaded photos, extract exactly these five fields:
   - **Company Name**
   - **Person Name**
   - **Designation** (job title / role, e.g. "Managing Director", "Executive Director")
   - **Phone Number**
   - **Email ID**

   Guidance for tricky cases:
   - If a card lists multiple phone numbers (e.g. mobile and landline), include the mobile/primary number. If both seem equally relevant, put both in the same cell separated by `; `.
   - Keep phone numbers as printed on the card (including country codes like `+91`) rather than reformatting them.
   - If a field is unreadable, ambiguous, or absent from the card, leave that cell **blank** — never guess or invent a value.
   - If your reading of a field is uncertain (blurry photo, unusual font), make your best reading but flag it to the user in your reply after the CSV is created (e.g. "double check the phone number for row 3, the photo was a bit blurry").
   - Ignore taglines, addresses, and websites — only the five requested fields go into the CSV.

3. **Build the CSV.** Create a CSV with header row exactly:
   ```
   Company Name,Person Name,Designation,Phone Number,Email ID
   ```
   One row per business card, in the order the cards were encountered (photo by photo, left-to-right/top-to-bottom within a photo if multiple cards appear together).

   Use Python's `csv` module (or equivalent) rather than hand-writing commas, so that any commas inside a field (e.g. "Spans Envirotech Pvt. Ltd., Gurugram") are properly quoted.

4. **Save and deliver.** Write the file to `/mnt/user-data/outputs/business_cards.csv` (if the user is processing more than one batch in the same conversation, use a distinguishing name like `business_cards_2.csv` for the next batch rather than overwriting or appending — each run gets its own fresh file). Present the file to the user with `present_files`.

5. **Summarize briefly.** After sharing the file, give a one-line summary (e.g. "Extracted 6 contacts from 2 photos into business_cards.csv") and call out any fields you weren't fully confident about.

## Notes

- This is a vision/reading task, not a coding task — read the fields directly off the images rather than trying to OCR programmatically.
- Don't add extra columns (address, website, etc.) beyond the five above unless the user explicitly asks for them in that request.
- If a photo doesn't contain a business card at all, skip it and mention that to the user rather than inventing a row.
