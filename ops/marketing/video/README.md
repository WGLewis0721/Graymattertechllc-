# AI Video Unified

Practical starter for motion-graphic explainer and promo videos (Atlas-style: kinetic text, logo reveals, UI mockups, product scenes).

Combines the best Remotion templates with Higgsfield, Kie.ai, Claude, and ChatGPT so you spend less time iterating and more time selling/posting.

## Recommended Base (Fork One)

| Repo | Why it fits | License | Start here |
|------|-------------|---------|------------|
| [EveryInc/product-launch-video](https://github.com/EveryInc/product-launch-video) | Claude skill + minimal Remotion scaffold for 15-30s polished product launch videos. Storyboard-first, multi-agent review, UI rules. Closest to 80% done. | MIT | Clone → `npm install` → use the skill in Claude Code with brief + screenshots. |
| [AleBrito124356/remotion-video-templates](https://github.com/AleBrito124356/remotion-video-templates) | Ready PromoTemplate + LogoIntro + KineticText. Fully prop-driven (productName, features, screenshots, CTA). Zod schemas. | MIT | Fork, swap props, render. Matches clean text + logo + feature flow. |
| [zz41354899/SwiftClip](https://github.com/zz41354899/SwiftClip) | 30+ production templates (Product Launch, SaaS Promo, Brand Reveal, etc.). Apple Light Mode style. | MIT | Grab individual compositions or the full library. |
| [meetmati-ai/MATI-teaser](https://github.com/meetmati-ai/MATI-teaser) | Full 88s startup teaser source (13 beats, springs, transitions). Explicitly meant to fork and rebrand. | Open | Fork → change copy/colors/assets. |
| [codeverbojan/remotion-cinematic](https://github.com/codeverbojan/remotion-cinematic) | Presets for feature announcements, walkthroughs, before/after from screenshots or recordings. | MIT | Good when you already have UI captures. |

**Also useful:**
- Official Prompt to Motion Graphics: `npx create-video@latest --prompt-to-motion-graphics`
- Remotion Agent Skills + Claude/ChatGPT for code generation

## Claude / Code-Driven Tools (added from motion-graphics shortlist)

These complement the Remotion bases. Most work best inside Claude Code.

| Repo | Why added |
|------|-----------|
| [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | Highest match for clean product launch films. Claude/Codex skill with 100+ shot recipe cards, Remotion templates, 2.5D camera moves, beat-sync, and sound design. Produces editable cinematic promos from real UI screenshots. |
| [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | Claude Code skill with 99 film styles (each a ready prompt + demo film made entirely in code). Strong for stylized explainers and varied looks without starting from scratch. |
| [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) + [joeseesun/opus-video-prompts](https://github.com/joeseesun/opus-video-prompts) | Curated prompt packs of real Opus 5.5 code-rendered videos. Useful reference for prompting Claude to generate high-quality motion graphics and launch films. |
| [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) | Starter kit for hand-painted cartoon shorts (p5.js + character system). Useful only if you want illustrated/character-driven style instead of clean UI product films. |

## Full Tool Stack

| Tool | Role |
|------|------|
| **Remotion templates** (above) | Structure, kinetic text, logo reveals, UI overlays, timing — the 70-90% scaffolding |
| **Claude / ChatGPT** | Storyboard, script, scene generation, Remotion code refinement via skills or prompts |
| **Higgsfield** | Polished generative clips, cinematic presets, lifestyle/product footage, character consistency (web app or MCP) |
| **Kie.ai** | Same top models (Seedance 2.5, Kling 4.0, Veo, MiniMax, etc.) via cheap pay-as-you-go API for volume or automation |
| **Video ShotCraft / Lemo Opuscar** | Additional Claude skills for cinematic product videos and stylized code-driven films |

## Practical Path

1. Fork **product-launch-video**, **remotion-video-templates**, or install **video-shotcraft** skill as your base.
2. Use Claude (or ChatGPT) with Remotion Agent Skills / product-launch skill / ShotCraft to generate or refine scenes from a brief + your assets (screenshots, logo, copy).
3. Generate any generative elements (backgrounds, lifestyle shots, extra clips) in **Higgsfield** or via **Kie.ai** API.
4. Drop those assets into the Remotion project.
5. Render → post.

These remove most of the timeline/keyframe iteration. You still supply brand assets, script, and final polish, but the motion system and structure are already there.

## Quick Start

```bash
# Example: clone a recommended base
git clone https://github.com/EveryInc/product-launch-video.git
cd product-launch-video
npm install

# Or install the strong product-video skill:
# npx skills add Vincentwei1021/video-shotcraft

# Then use Claude Code with the skill
# Or start fresh with official starter:
# npx create-video@latest --prompt-to-motion-graphics
```

See `docs/workflow.md` and `docs/recommended-repos.md` for details.

## Reel engine (built, working)

A small deterministic renderer turns a validated post into a Reel. No timeline editor, no subscription.

```bash
python3 ops/tools/content.py reel-spec gm-fb-0001 > /tmp/spec.json
node ops/marketing/video/engine/reel.js --spec /tmp/spec.json --check     # determinism + layout test
node ops/marketing/video/engine/reel.js --spec /tmp/spec.json --format 9x16
python3 ops/marketing/video/engine/review.py ops/marketing/video/engine/out/gm-fb-0001-9x16.mp4
```

How it works and what is human-checked: `docs/seek-engine.md`.

## License

Private business use. Respect upstream licenses and provider ToS for generated content.
