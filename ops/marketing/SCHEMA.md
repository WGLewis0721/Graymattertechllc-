# Content repository formats

Everything is one Markdown file with flat `key: value` front matter. No nested
YAML. Validate with `python3 ops/tools/content.py validate`.

## Post: `posts/<id>.md`

```
---
id: gm-fb-0001              # unique, matches filename
status: draft               # draft | approved | queued | posted | retired
platform: facebook
pillar: save-time           # key in data/pillars.json
topic: T03                  # key in data/pillars.json topics
service: workflow-automation  # Gray Matter service slug
industry: barbers-salons    # industry slug from js/data.js, or any
format: scenario            # scenario | checklist | question | myth | before-after | tip
hook: The first line of the post, repeated exactly as the body's first line.
cta: fit-check              # key in data/ctas.json
cta_question:               # only when cta is comment
image: assets/gray-matter/social/gm-social-workflow-automation-square.png
hashtags: #GrayMatter #MontgomeryAL #SmallBusiness
created: 2026-11-16
---
The first line of the post, repeated exactly as the body's first line.

Body paragraphs. 45 to 130 words in total, no CTA text and no hashtags in the
body: the exporter appends both.
```

## Research brief: `research/<topic>-<slug>.md`

```
---
id: T03
title: No-shows and manual appointment reminders
pillar: save-time
services: workflow-automation
audience: barbers-salons, appointment-businesses
researched: 2026-11-16
---
## The problem in the owner's words
## What is actually going on
Facts only. Every factual claim ends with a source marker like [1].
## Post angles
Five or more one-line angles, each a distinct moment or question.
## What Gray Matter does about it
## Sources
1. Title. Publisher. https://... (accessed 2026-11-16)
```

A brief needs at least two sources that were actually opened and read.
