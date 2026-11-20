---
name: youtube-summary
description: >
  Create detailed bullet-point summaries of YouTube videos and save them to the user's
  Google Doc knowledge base. Trigger this skill whenever the user pastes a YouTube URL
  and asks for a summary, mentions "summarize this video", "add to my notes", or any
  variation of wanting to capture key learnings from a YouTube video. Also trigger when
  the user says things like "watch this later and summarize" or "log this video". This
  skill handles the full workflow: fetching transcript/content, generating a structured
  summary, and appending it to the correct tab in the user's Google Doc.
---

# YouTube Summary Skill

Summarizes YouTube videos with detailed bullets and saves them to the user's Google Doc,
organised by channel (one tab per YouTuber).

---

## Step 1 — Extract Video Information

Use `web_fetch` on the YouTube URL to retrieve:
- **Video title**
- **Channel name** (this is used to match the correct Google Doc tab)
- **Video description** (often contains key points)

Also use `web_search` to find any available transcript or detailed coverage of the video
if the page content is thin.

---

## Step 2 — Generate the Summary

Produce a structured summary in this format:

```
## [Full weekday name], [DD Month YYYY] - Youtube Video
[YouTube URL]

**[Video Title]**

[Brief 1-2 sentence intro of what the video covers — plain text]

Key Takeaways:
- **Main point 1**
  - Supporting detail or sub-point
  - Supporting detail or sub-point
- **Main point 2**
  - Supporting detail
- **Main point 3**
  - Supporting detail
  - Supporting detail
... (continue for all significant points)

Actionable Insights:
- Specific things the viewer can do or apply
- ...

Stocks & Companies Mentioned:
*(Include this section ONLY if the video discusses specific companies or stocks)*

| Stock / Company | Ticker | TL;DR | Key Price Levels |
|----------------|--------|-------|-----------------|
| e.g. Apple | AAPL | Bullish on AI revenue growth | Support: $180, Target: $220 |
| e.g. Reliance | RELIANCE.NS | Expansion into green energy | Resistance: ₹2,900 |

- If no ticker is mentioned, leave the Ticker cell blank
- If no price levels are discussed, write "—" in that cell  
- Keep TL;DR to one punchy sentence per company
```

**Formatting rules — strictly follow these:**
- **Only ONE heading per entry: the H2 date heading at the top.** No H3, H4, or any other markdown headings anywhere else.
- Section labels like "Key Takeaways:", "Actionable Insights:", "Stocks & Companies Mentioned:" are plain text followed by a colon — NOT headings.
- To highlight or emphasise content use only:
  - **Bold** for key terms, company names, important figures
  - *Italics* for context, caveats, or secondary notes
  - Underline for critical warnings or must-remember points
  - 🔴 Red text for risks, warnings, or bearish signals
  - 🟢 Green text for opportunities, bullish signals, or positive outcomes
  - 🔵 Blue text for data points, statistics, or neutral references
  - (When writing to Google Doc, apply actual font colours using the Docs API — red: #FF0000, green: #00AA00, blue: #0000FF)

**Content guidelines:**
- Focus on Business/Finance and Tech/Tutorial content — be precise with numbers, frameworks, tools, and named concepts
- Each top-level bullet should capture a distinct idea; sub-bullets add context, examples, or data
- Aim for 6–12 top-level bullets depending on video length and density
- Use plain English; avoid filler phrases like "the speaker mentions..."
- For tutorials: include specific steps, commands, or settings mentioned
- For finance/business: include specific figures, strategies, or frameworks named

---

## Step 3 — Match the Google Doc Tab

The user's YouTube notes Google Doc is:
**URL:** https://docs.google.com/document/d/1je-Kd4YFuyWYpPbJpw109JxnxlfFanjN3J1QWmjOdhI/edit
**Doc ID:** `1je-Kd4YFuyWYpPbJpw109JxnxlfFanjN3J1QWmjOdhI`

1. Extract the **channel name** from Step 1
2. Use `google_drive_fetch` with the Doc ID above to read the document and list available tabs/sections
4. Match the channel name to an existing tab (case-insensitive, partial match is OK —
   e.g. channel "Ali Abdaal" matches tab "Ali Abdaal")
5. **If no matching tab is found:** STOP. Tell the user:
   > "⚠️ I couldn't find a tab for **[Channel Name]** in your Google Doc. Please create
   > a tab for this channel and try again, or let me know the correct tab name to use."
   Do NOT write anything to the document.

---

## Step 4 — Insert Summary into the Google Doc

Once the correct tab is confirmed:

1. Insert the formatted summary at the **top of the tab**, just below any Table of
   Contents or header section (i.e. after any `---` divider or heading row at the top)
2. Add a `---` horizontal rule **below** the new entry to separate it from older entries
3. Confirm to the user with a short message:
   > "✅ Summary added to the **[Channel Name]** tab in your Google Doc."

---

## Important Rules

- **Never create a new tab** — only write to existing tabs
- **Always insert at the top** (newest first), below any TOC/header
- **Always show the summary in chat first** before writing to the doc, so the user can
  review it
- If the video is unavailable, private, or the transcript can't be retrieved, say so
  clearly and ask the user if they want to provide notes manually
- Do not write to the Google Doc without confirming with the user first if anything
  looks uncertain (e.g. ambiguous tab match)
