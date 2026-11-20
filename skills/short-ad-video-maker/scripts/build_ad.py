#!/usr/bin/env python3
"""
build_ad.py — Renders a scene-based JSON spec into a short ad .mp4 (<=60s)
plus a human-readable script.md (for re-recording with a real voice later).

Usage:
    python3 build_ad.py <spec.json> <output_dir>

See ../SKILL.md for the full spec schema and a worked example.
"""
import json
import os
import subprocess
import sys
import wave
import contextlib

from PIL import Image, ImageDraw, ImageFont
from moviepy import (
    ImageClip, CompositeVideoClip, AudioFileClip, concatenate_videoclips,
    concatenate_audioclips, AudioClip,
)
from moviepy.video.fx import FadeIn, FadeOut, Resize
from moviepy.audio.fx import AudioFadeIn, AudioFadeOut

FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts")
FONT_MAP = {
    "display": os.path.join(FONT_DIR, "BigShoulders-Bold.ttf"),
    "bold": os.path.join(FONT_DIR, "BricolageGrotesque-Bold.ttf"),
    "regular": os.path.join(FONT_DIR, "BricolageGrotesque-Regular.ttf"),
}

MAX_TOTAL_SECONDS = 60.0


def wav_duration(path):
    with contextlib.closing(wave.open(path, 'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        return frames / float(rate)


def make_voiceover(text, out_path, voice="en-us", rate=165, pitch=45):
    """Offline TTS via espeak-ng. Robotic but dependency-free."""
    cmd = [
        "espeak-ng", "-v", voice, "-s", str(rate), "-p", str(pitch),
        "-w", out_path, text,
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return wav_duration(out_path)


def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        bbox = draw.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def render_text_png(text, size, font_key, font_size, color, position, resolution, align="center"):
    """Render a transparent PNG of the text at the given position."""
    W, H = resolution
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font_path = FONT_MAP.get(font_key, FONT_MAP["bold"])
    font = ImageFont.truetype(font_path, font_size)

    max_width = int(W * 0.82)
    lines = wrap_text(text, font, max_width, draw)
    line_height = int(font_size * 1.2)
    block_height = line_height * len(lines)

    if position == "center":
        y0 = (H - block_height) // 2
    elif position == "top":
        y0 = int(H * 0.12)
    elif position == "bottom":
        y0 = H - block_height - int(H * 0.12)
    else:
        y0 = (H - block_height) // 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        line_w = bbox[2] - bbox[0]
        x = (W - line_w) // 2 if align == "center" else int(W * 0.09)
        y = y0 + i * line_height
        # soft shadow for legibility over photos
        draw.text((x + 3, y + 3), line, font=font, fill=(0, 0, 0, 140))
        draw.text((x, y), line, font=font, fill=color)
    return img


def build_background_clip(scene, resolution, duration):
    W, H = resolution
    bg = scene.get("background", {"type": "color", "value": "#0E0E10"})
    if bg["type"] == "image":
        img = Image.open(bg["path"]).convert("RGB")
        # cover-crop to resolution
        src_ratio = img.width / img.height
        tgt_ratio = W / H
        if src_ratio > tgt_ratio:
            new_h = H
            new_w = int(H * src_ratio)
        else:
            new_w = W
            new_h = int(W / src_ratio)
        img = img.resize((new_w, new_h))
        left = (new_w - W) // 2
        top = (new_h - H) // 2
        img = img.crop((left, top, left + W, top + H))
        tmp_path = bg["path"] + ".cover.png"
        img.save(tmp_path)
        clip = ImageClip(tmp_path).with_duration(duration)
        if scene.get("kenburns", True):
            zoom = 1.10
            clip = clip.resized(lambda t: 1 + (zoom - 1) * (t / duration))
            clip = clip.with_position(("center", "center"))
    else:
        color = bg.get("value", "#0E0E10")
        color = color.lstrip("#")
        rgb = tuple(int(color[i:i + 2], 16) for i in (0, 2, 4))
        solid = Image.new("RGB", (W, H), rgb)
        tmp_path = os.path.join(os.path.dirname(bg.get("path", "/tmp/_solid.png")) or "/tmp", f"_solid_{color}.png")
        solid.save(tmp_path)
        clip = ImageClip(tmp_path).with_duration(duration)
    return clip


def build_scene_clip(scene, resolution, work_dir, idx, voice_cfg):
    texts = scene.get("texts", [])
    vo_text = scene.get("voiceover")
    vo_clip = None
    vo_duration = 0.0

    if voice_cfg.get("enabled") and vo_text:
        vo_path = os.path.join(work_dir, f"scene_{idx}_vo.wav")
        vo_duration = make_voiceover(
            vo_text, vo_path,
            voice=voice_cfg.get("voice", "en-us"),
            rate=voice_cfg.get("rate", 165),
            pitch=voice_cfg.get("pitch", 45),
        )
        vo_clip = AudioFileClip(vo_path)

    duration = max(scene.get("duration", 4.0), vo_duration + 0.5 if vo_duration else 0.0)

    bg_clip = build_background_clip(scene, resolution, duration)
    layers = [bg_clip]

    for t in texts:
        png_path = os.path.join(work_dir, f"scene_{idx}_text_{texts.index(t)}.png")
        img = render_text_png(
            t["text"], t.get("size", 90), t.get("font", "display"),
            t.get("size", 90), t.get("color", "#FFFFFF"),
            t.get("position", "center"), resolution,
        )
        img.save(png_path)
        delay = t.get("delay", 0.0)
        anim = t.get("animation", "fade_in")
        tc = ImageClip(png_path).with_duration(duration - delay).with_start(delay)
        if anim in ("fade_in", "slide_up"):
            tc = tc.with_effects([FadeIn(0.35)])
        layers.append(tc)

    scene_clip = CompositeVideoClip(layers, size=resolution).with_duration(duration)
    if vo_clip:
        pad = duration - vo_duration
        silence = AudioClip(lambda t: 0, duration=max(pad, 0)).with_fps(44100)
        full_audio = concatenate_audioclips([vo_clip, silence]) if pad > 0 else vo_clip
        scene_clip = scene_clip.with_audio(full_audio)
    return scene_clip


def write_script_md(spec, out_path, total_duration):
    lines = [f"# Script: {spec.get('title', 'Untitled Ad')}", "",
              f"Target length: {total_duration:.1f}s (cap: {MAX_TOTAL_SECONDS:.0f}s)", "",
              "| # | Duration | On-screen text | Voiceover line | Visual |",
              "|---|----------|-----------------|----------------|--------|"]
    for i, s in enumerate(spec["scenes"], 1):
        onscreen = " / ".join(t["text"] for t in s.get("texts", [])) or "-"
        vo = s.get("voiceover", "-")
        bg = s.get("background", {})
        visual = bg.get("path", bg.get("value", "-"))
        lines.append(f"| {i} | {s.get('duration', 4)}s | {onscreen} | {vo} | {visual} |")
    with open(out_path, "w") as f:
        f.write("\n".join(lines))


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 build_ad.py <spec.json> <output_dir>")
        sys.exit(1)

    spec_path, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    work_dir = os.path.join(out_dir, "_work")
    os.makedirs(work_dir, exist_ok=True)

    with open(spec_path) as f:
        spec = json.load(f)

    resolution = tuple(spec.get("resolution", [1920, 1080]))
    fps = spec.get("fps", 30)
    voice_cfg = spec.get("voice", {"enabled": True})

    clips = []
    for idx, scene in enumerate(spec["scenes"]):
        clip = build_scene_clip(scene, resolution, work_dir, idx, voice_cfg)
        clips.append(clip)

    total_duration = sum(c.duration for c in clips)
    if total_duration > MAX_TOTAL_SECONDS:
        print(f"WARNING: total duration {total_duration:.1f}s exceeds the {MAX_TOTAL_SECONDS:.0f}s cap.")
        print("Scene durations:", [round(c.duration, 1) for c in clips])
        print("Trim scene text/voiceover lines and re-run.")

    # crossfade transitions between scenes
    faded = [clips[0]]
    for c in clips[1:]:
        faded.append(c.with_effects([FadeIn(0.4)]))
    final = concatenate_videoclips(faded, method="compose", padding=-0.4)

    out_mp4 = os.path.join(out_dir, spec.get("output_name", "ad.mp4"))
    final.write_videofile(out_mp4, fps=fps, codec="libx264", audio_codec="aac", threads=4, logger=None)

    write_script_md(spec, os.path.join(out_dir, "script.md"), total_duration)
    print(f"Done. Video: {out_mp4}  Duration: {final.duration:.1f}s  Script: {os.path.join(out_dir, 'script.md')}")


if __name__ == "__main__":
    main()
