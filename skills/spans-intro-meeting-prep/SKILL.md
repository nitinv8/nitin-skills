---
name: "spans-intro-meeting-prep"
description: "Prep Nitin for an intro/review meeting on a new Spans enquiry: block scheme, unit-process table and client questions, saved to Notion and Drive. No proposal or BOQ."
---

# Spans Intro Meeting Prep

Prepare Nitin (Spans Envirotech) for an initial review or intro meeting with a client on a new enquiry, BEFORE any proposal is written.

**Outputs:** a block scheme, a unit-process table, and a numbered list of meeting questions, saved where the team can find them (Notion Sales Funnel page + project's "00 Proposal" folder in Drive).

**Do NOT** create the proposal, BOQ or costing. If Nitin asks for those afterwards, hand off to the relevant skill (spans-epc-proposal, spans-consulting-proposal or spans-trading-quote).

## When to use

- "prep for the meeting with <client>"
- "create the block scheme and questions for <project>"
- "intro call with <client> today"
- A project number (P-xxxx) plus a request for meeting prep

## Step 1 – Find the enquiry

1. **Gmail** (bd@spans.co.in and Nitin's inbox): search for the client's enquiry and any meeting invite. Read the full thread, including attached data (lab reports, flow data, drawings).
2. **Google Drive**: find the project folder under *Spans - ACTIVE PROJECTS > P-xxxx ...*, its **00 Proposal** and **10 Data From Client** subfolders. Read every client file.
3. **Notion**: find the project's page in the **Spans Sales Funnel** database.
4. **Memory and past chats**: check for anything already known about the client, site or earlier projects.

If the project folder or Notion page can't be found, say so and continue with what is available. Don't create new folders or pages unless asked.

## Step 2 – Sanity-check the client data

- Work out what the stated capacity actually refers to (inlet flow? product? mixed streams?). Say so plainly if it is ambiguous.
- Cross-check the client's numbers against each other, e.g.:
  - flow × concentration vs. stated chemical consumption
  - BOD:COD ratio (biodegradability)
  - TDS vs. ion sum / cation–anion balance
  - flow vs. production or water consumption
- Flag anything that doesn't add up, **with the arithmetic**, as a question for the meeting.
- List every assumption being made where data is missing. This becomes the "assumed basis".

## Step 3 – Block scheme (Excalidraw)

Load the Excalidraw tool (read its read_me first), then draw the process block scheme:

- Main process line, left to right.
- Recycle / reuse streams.
- Utilities (steam, power, cooling water).
- Side streams (sludge, condensate, reject) and chemical make-up.
- **Dashed lines** for utilities and side streams; solid for the main line.
- Indicative flows / strengths on the boxes, from the assumed basis.
- A **yellow note box** stating the assumed basis and any data conflict.

Below the scheme, add a 3-column table:

| Unit process | What it achieves (1–2 lines) | Design basis (key sizing figure) |
|---|---|---|

Design basis = flow, HRT, loading, micron rating, steam/power etc. **Shade the main cost item.**

Footer line: "Basis: ... All figures to be confirmed after client data."

Keep text bound to its container so the file stays editable.

## Step 4 – Meeting questions (Notion)

Group questions into numbered sections. Default sections (adapt per project; drop or add as needed):

1. **Capacity and flow** – what the capacity refers to, continuous vs batch, peak, future expansion
2. **Feed / effluent quality** – lab report, ranges, sources mixed in, temperature
3. **Required output quality** – discharge norms, reuse targets, CTO/consent conditions
4. **Questions on data already sent** – the inconsistencies from Step 2, with the arithmetic
5. **Utilities** – steam, cooling water, power, where by-products / condensate can go
6. **Site and scope** – space, layout, distances, civil/shed scope, reusable existing assets
7. **Commercial** – always include:
   - current cost of the chemical / water being saved
   - electricity tariff and steam cost (for payback)
   - timeline and what is driving it
   - budget approved or not, and who approves
   - procurement process and stages
   - decision makers and evaluators
   - vendor registration
   - payment terms, PBG / retention
   - budgetary vs firm offer
   - competing vendors
   - preferred makes / MOC
   - technology preference
8. **Next steps** – site visit, sampling, technical contact

Put the most important questions first in each section.

### Writing to Notion – FORMAT (important; Notion mangles other formats)

Write on the project's Sales Funnel page inside an **H3 toggle heading**:

`Questions for client meeting - (<date>)`

Inside the toggle, use **one continuous numbered list**. Each section is a top-level numbered item with a bold title; its questions are a nested numbered list indented with 3 spaces:

```
1. <b>Capacity and flow</b>
   1. Question...
   2. Question...
2. <b>Feed quality</b>
   1. Question...
```

Rules:
- Do NOT use "- " bullets inside a paragraph.
- Do NOT put blank lines or `<p />` between sections – that breaks the list into separate blocks.
- Use update_content / insert_content so other content on the page is kept. Never overwrite the whole page.
- After writing, **fetch the page once** and confirm the content came back as list items, not one paragraph with `<br />` breaks. If it broke, fix it and re-check.

## Step 5 – Save to Drive

Save to the project's **00 Proposal** folder:

1. `<P-xxxx> <Client> Block Scheme Rev A.excalidraw`
   - A compact, valid .excalidraw JSON rebuilt from the same elements (text bound to containers).
   - Upload as `application/json` with conversion disabled.
2. `<P-xxxx> <Client> Block Scheme Rev A.pdf`
   - One-page render of the scheme plus the table.
   - Use matplotlib with core PDF fonts (`pdf.use14corefonts = True`) to keep the file small enough to upload.

After upload, check the Drive file sizes match the local files. If a later revision exists, bump the letter (Rev B, Rev C) rather than overwriting.

Also send Nitin the **PNG** of the scheme in chat so he has it on his phone.

## Step 6 – Reply

Keep it short:
- What was created and where (Notion page, Drive files).
- The assumed basis in one line.
- The 1–2 questions that matter most for the meeting.

Explain technical terms a client might ask about only if Nitin asks.

## Style

- Plain English, short sentences.
- Indian units and conventions: KLD, m3/h, ₹, lakh.
- Mark everything as **draft / indicative** until client data is confirmed.