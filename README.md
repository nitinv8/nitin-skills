# nitin-skills
A collection of custom Claude skills for productivity, marketing, and content management

## Skills

| Skill | Purpose |
|-------|---------|
| `business-card-to-csv` | Extract contact details from business card photos into a CSV |
| `short-ad-video-maker` | Generate short promo/ad videos (.mp4) with voiceover and script |
| `spans-case-study` | Draft website case studies from project reports/decks, with fact sheet and QA checks |
| `spans-consulting-proposal` | Consultancy proposals for WTP/STP/ETP/ZLD |
| `spans-etp-proposal` | EPC proposal for an ETP/STP: block scheme, sizing sheet, BoQ, deck |
| `spans-intro-meeting-prep` | Prep for an intro meeting on a new enquiry |
| `spans-proposal-review` | Review a proposal as the client's procurement team would: prioritised findings table |
| `spans-trading-quote` | Supply-only equipment quotes with costing sheet and offer |
| `tsrs-file-renaming` | Rename exam paper PDFs to readable names |
| `vendor-bd-sync` | Sync new vendors from Gmail into a Notion tracker |
| `youtube-summary` | Summarise YouTube videos into a Google Doc knowledge base |

## Install

Each skill is a folder under `skills/` containing a `SKILL.md`. Copy the ones you want into
`~/.claude/skills/` (or a project's `.claude/skills/`):

```bash
git clone https://github.com/nitinv8/nitin-skills
cp -r nitin-skills/skills/<skill-name> ~/.claude/skills/
```

## Updating this backup

Re-copy changed skill folders into `skills/`, then commit and push.
