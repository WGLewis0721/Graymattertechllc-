# CLAUDE.md — websites/

Orientation for Claude Code sessions working in this folder.

## What this is

A template library for a productized small-business website service (barbers, lawyers, contractors, coaches, real estate agents, solo entrepreneurs). Clients supply only a business name, photos, and a typography/color preference. Every site is assembled from the same shared components, themed per client, and shipped in one to two weeks.

This is not a single website. It is the source for many client websites, each generated one at a time via `degit` into its own repository. GitHub Pages serves one site per repo, so there is no single deployed "client sites" repo, only this template library plus one repo per client.

## Scope boundary

Everything for this project lives inside `websites/`. Do not touch files outside this folder. Do not assume anything outside `websites/` is related to this project.

## Read first

In order:

1. `docs/PHILOSOPHY.md` — the model-kit framing and why the system is shaped this way.
2. `docs/ARCHITECTURE.md` — folder layout, the shared/vertical/theme split, the `content.json` contract.
3. `docs/ENGINEERING.md` — the seven rules, the performance budget, definition of done.
4. `docs/SECURITY.md` — security checklist, including what GitHub Pages does and does not allow.
5. `docs/DEPLOYMENT.md` — the two-stage deploy: gated preview, then GitHub Pages launch.
6. `docs/INTAKE.md` — what gets collected from a client and in what form.
7. `docs/CLIENT-PRIVACY.md` — the plain-language version of the confidentiality story, written for clients.
8. `README.md` — practical how-to: intake flow, degit spin-up, deploy, timeline.

## Rules that must not be broken

- **Shared components never hardcode a color, font, or business-specific string.** Everything visual or content-specific comes in as a prop or a theme token.
- **No copy in `.astro` files.** All copy, contact info, hours, and image paths live in `content.json`.
- **Theme changes never touch component code.** A new client look is a `theme.css` token change, nothing else.
- **Every component of a given category shares the same prop shape across verticals.** Don't let a `Gallery` in one template diverge from a `Gallery` in another.
- **Zero JS by default.** JS ships only as islands, only where genuinely needed, and every page still works with JS disabled.
- **Stay under the performance budget**: under 100KB initial mobile transfer (images included), Lighthouse mobile 95+ performance / 100 accessibility, LCP under 1.5s on simulated 4G. A feature that blows the budget doesn't ship as proposed.
- **Hosting is GitHub Pages. There is no `_headers` file, no `.htaccess`, no custom HTTP headers, ever.** Security headers that need real header support (X-Frame-Options, X-Content-Type-Options, Permissions-Policy, HSTS) cannot be set on this host, full stop. Don't add a `_headers` file expecting it to work, and don't tell a client it provides protection it can't provide. CSP and Referrer-Policy go in a `<meta>` tag instead; see `docs/SECURITY.md`.
- **Forms post to Formspree only.** Netlify Forms does not work here; there is no Netlify build step in this pipeline.
- **GitHub Pages is never enabled on a client repo before the client signs off.** Review happens on a Cloudflare Pages deploy behind Cloudflare Access (email one-time-code). See `docs/DEPLOYMENT.md`. Do not shortcut this by making the repo private and enabling Pages anyway, a private repo's Pages site is still fully public.
- **Never build client-side password protection as a substitute for the above.** It's theater on a static site; the content ships in the bundle regardless of any JS prompt in front of it.
- **`noindex, nofollow` and a disallow-all `robots.txt` ship by default** and are only removed as an explicit step in the launch checklist, never automatically.
- **No secrets in the repo.** Form endpoint IDs and analytics keys are fine in `content.json`; anything else goes in Cloudflare Pages environment variables (stage one) or that repo's GitHub Actions secrets (stage two, if ever needed).
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
    DEPLOYMENT.md
    CLIENT-PRIVACY.md
  shared/                 # (once scaffolded) components + base styles, no vertical or client specifics
  templates/              # (once scaffolded) one folder per vertical, built from shared/
  parts/                  # (once scaffolded) optional vertical-specific components
```

`shared/`, `templates/`, and `parts/` don't exist yet as of this file's writing; this pass is documentation only. Check `ARCHITECTURE.md` for the intended layout before creating them.

Client sites are never generated inside this repo. They are `degit` copies spun up into their own repositories, outside this repo entirely, because GitHub Pages serves one site per repository.
