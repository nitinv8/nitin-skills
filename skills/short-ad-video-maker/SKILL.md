---
name: short-ad-video-maker
description: Generates short promotional/ad videos (up to 60 seconds, default 1920x1080 16:9) from a prompt describing the product, message, and call-to-action. Produces a rendered .mp4 with kinetic-text motion graphics, optional user-supplied photos/logos (with Ken Burns pans), scene transitions, and an offline synthesized voiceover — plus a clean script.md with scene-by-scene timing and voiceover lines for re-recording with a real human voice later. Use this whenever the user asks to create an ad, commercial, promo video, product video, marketing video, or "60 second ad" / "30 second ad" for any product, service, or company (e.g. Spans Envirotech, Xestu.com, or anything else) — even if they don't say the word "skill" or "video maker."
---

# Short Ad Video Maker

Turns a prompt into a rendered short ad (<=60s) using scene-based motion graphics,
optional photos, and an offline text-to-speech voiceover.

## Known constraints (be upfront about these with the user)

- **No internet access to stock footage, stock music, or AI voice APIs.** The sandbox
  can only reach PyPI/npm/GitHub/Ubuntu package mirrors — not image/music libraries or
  services like ElevenLabs/Google TTS.
- **Voiceover is offline `espeak-ng` TTS — it sounds robotic**, not like a natural
  human voice. Always deliver the rendered draft *and* the `script.md` file so the
  user can re-record a real voiceover later if they want polish.
- **No licensed background music.** Ads are visual/voice-driven only unless the user
  supplies their own royalty-free music file to mix in.
- **Hard cap: 60 seconds total.** If scene durations + voiceover overrun this, the
  script prints a warning listing each scene's duration — shorten the script text
  and re-run rather than silently speeding up the voice.

Mention the robotic-voice limitation briefly the first time you generate a video in
a conversation, then proceed — don't ask permission every time.

## Workflow

1. **Read the prompt** for: company/product name, the core message, 3-6 beats
   (hook -> problem -> solution/features -> proof -> call to action), any uploaded
   images/logos, desired aspect ratio (default 1920x1080 16:9; use [1080,1920] for
   9:16 Reels/Shorts or [1080,1080] for square if asked), and target duration.

2. **Draft the scene breakdown first as text** in the chat (2-3 sentences per scene:
   on-screen text + voiceover line) so the user can sanity-check the message before
   you spend time rendering. Skip this check-in only if the user has already given a
   full detailed script.

3. **Write the JSON spec** (schema below) to a working file, e.g. `/tmp/ad_spec.json`.
   Keep on-screen text short (under ~8 words per line) — this is a video, not a slide.

4. **Copy any user-uploaded images** referenced in the spec into a writable temp dir
   first (uploads are read-only) and point the spec's `background.path` at the copy.

5. **Run the renderer:**
   ```bash
   python3 /mnt/skills/user/short-ad-video-maker/scripts/build_ad.py /tmp/ad_spec.json /mnt/user-data/outputs/<ad_name>
   ```
   (Adjust the skill path if it's installed elsewhere — check where this SKILL.md
   itself lives and reference `scripts/build_ad.py` relative to it.)

6. This produces `<ad_name>.mp4` and `script.md` in the output folder. Check the
   printed total duration — if it warns about exceeding 60s, trim scene text/VO
   lines and re-run before presenting anything.

7. **Present both files** with `present_files` (video first, script second) and
   briefly note the voiceover-quality tradeoff and that `script.md` is there for
   re-recording.

## Spec schema

```json
{
  "title": "Human-readable name, used in script.md",
  "output_name": "ad.mp4",
  "resolution": [1920, 1080],
  "fps": 30,
  "voice": {"enabled": true, "voice": "en-us", "rate": 165, "pitch": 45},
  "scenes": [
    {
      "duration": 4,
      "background": {"type": "color", "value": "#0E2A1F"},
      "texts": [
        {"text": "Is your ETP failing compliance?", "position": "center",
         "size": 80, "color": "#FFFFFF", "font": "display"}
      ],
      "voiceover": "Is your effluent treatment plant failing compliance checks?"
    },
    {
      "duration": 4,
      "background": {"type": "image", "path": "/tmp/ad_assets/plant_photo.jpg"},
      "kenburns": true,
      "texts": [
        {"text": "Spans Envirotech retrofits ETPs fast.", "position": "bottom",
         "size": 60, "color": "#FFFFFF", "font": "bold"}
      ],
      "voiceover": "Spans Envirotech redesigns and retrofits ETPs for full regulatory compliance."
    }
  ]
}
```

Notes:
- `background.type` is `"color"` (hex value) or `"image"` (path to a real image —
  Ken Burns zoom applies automatically unless `"kenburns": false`).
- `font` is one of `"display"` (bold condensed, best for short punchy headlines),
  `"bold"`, or `"regular"` — mapped to bundled fonts in `assets/fonts/`.
- `position` is `"center"`, `"top"`, or `"bottom"`.
- A scene's actual on-screen duration is `max(duration, voiceover_length + 0.5s)` —
  the video never cuts off a voice line early.
- Scenes crossfade into each other automatically (0.4s).
- Skip `"voiceover"` on a scene (or set `voice.enabled: false` globally) for a
  silent, text-only scene/ad.

## Design guidance for good short ads

- Hook in scene 1 (a question or bold claim), not the company name.
- One idea per scene — don't stack more than ~8 words of on-screen text at once.
- End on a clear, short call-to-action (phone/website/"Call us today").
- 4-6 scenes of 3-5s each is a good default for a 20-30s ad; use more scenes only
  if the user explicitly wants the full 60s.
- For Spans Envirotech / Xestu.com ads specifically, lean on dark green/teal or
  navy backgrounds with a bright accent color (amber/gold) for the CTA text —
  matches an industrial/engineering B2B feel unless the user asks otherwise.
