# CLAUDE.md — websites/

Orientation for Claude Code sessions working in this folder.

## What this is

A template library for a productized small-business website service (barbers, lawyers, contractors, coaches, real estate agents, solo entrepreneurs). Clients supply only a business name, photos, and a typography/color preference. Every site is assembled from the same shared components, themed per client, and shipped in one to two weeks.

This is not a single website. It is the source for many client websites, generated one at a time via `degit`.

## Scope boundary

Everything for this project lives inside `websites/`. Do not touch files outside this folder. Do not assume anything outside `websites/` is related to this project.

## Read first

In order:

1. `docs/PHILOSOPHY.md` — the model-kit framing and why the system is shaped this way.
2. `docs/ARCHITECTURE.md` — folder layout, the shared/vertical/theme split, the `content.json` contract.
3. `docs/ENGINEERING.md` — the seven rules, the performance budget, definition of done.
4. `docs/SECURITY.md` — security checklist, including the `_headers` file contents.
5. `docs/INTAKE.md` — what gets collected from a client and in what form.
6. `README.md` — practical how-to: intake flow, degit spin-up, deploy, timeline.

## Rules that must not be broken

- **Shared components never hardcode a color, font, or business-specific string.** Everything visual or content-specific comes in as a prop or a theme token.
- **No copy in `.astro` files.** All copy, contact info, hours, and image paths live in `content.json`.
- **Theme changes never touch component code.** A new client look is a `theme.css` token change, nothing else.
- **Every component of a given category shares the same prop shape across verticals.** Don't let a `Gallery` in one template diverge from a `Gallery` in another.
- **Zero JS by default.** JS ships only as islands, only where genuinely needed, and every page still works with JS disabled.
- **Stay under the performance budget**: under 100KB initial mobile transfer (images included), Lighthouse mobile 95+ performance / 100 accessibility, LCP under 1.5s on simulated 4G. A feature that blows the budget doesn't ship as proposed.
- **No secrets in the repo.** Form endpoint IDs and analytics keys are fine in `content.json`; anything else goes in Cloudflare Pages environment variables.
- **EXIF strip every client photo before it touches the repo.** No exceptions, see `docs/SECURITY.md`.
- **Don't abstract speculatively.** A vertical-specific need is implemented locally first, promoted to `shared/` only once a second vertical needs the same shape. Fifteen templates that share too little beats an unreadable shared framework.
- **This is documentation-first work when the task says so.** If a task is scoped as docs-only, don't scaffold Astro, don't run `npm install`, don't write site code. Check what the task actually asks for before building.

## Where things live

```
websites/
  README.md              # how-to: intake, degit, deploy, timeline
  CLAUDE.md               # this file
  docs/
    PHILOSOPHY.md
    ARCHITECTURE.md
    SECURITY.md
    ENGINEERING.md
    INTAKE.md
  shared/                 # (once scaffolded) components + base styles, no vertical or client specifics
  templates/              # (once scaffolded) one folder per vertical, built from shared/
  parts/                  # (once scaffolded) optional vertical-specific components
```

`shared/`, `templates/`, and `parts/` don't exist yet as of this file's writing; this pass is documentation only. Check `ARCHITECTURE.md` for the intended layout before creating them.

Client sites are never generated inside this repo. They are `degit` copies spun up into their own project directories, outside this repo entirely.
