# Gray Matter — Digital & Technology Solutions

A static, multi-page business website for **Gray Matter LLC**, a digital and
technology solutions company serving small businesses, entrepreneurs, and
technical organizations.

https://wglewis0721.github.io/Graymattertechllc-/

> **Tell us what needs to change. We figure out the technology.**
> Grow. Save. Protect. Get it handled.

The homepage is a **guided menu funnel**: choose the result you want, see
only the starting points that fit it, toggle compatible options, and review
one plan before anything begins. `docs/ARCHITECTURE.md` is the full
description of that direction, the state model, and the rules — read it
before changing the funnel.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero, the guided menu funnel (`#build-my-plan`), recognition callouts, before/after, compact solution index, process preview, founder credibility, audiences, CTA |
| `services.html` | Full service detail catalog — the ten productized services as problem → outcome cards |
| `industries.html` · `industries/*.html` | Who We Help index plus nine industry pages |
| `process.html` | How We Work — the ten-stage "Tech Fit to Completion" roadmap |
| `about.html` | Founder credentials, how the work runs, the two buyer paths, contact details |
| `cloud-consulting.html` | Cloud infrastructure, cloud security, DevOps, and contract consulting — the separate technical buyer path |
| `pricing.html` | Website package pricing, add-on pricing, comparison matrix, FAQ |
| `contact.html` | Goal-first inquiry form; receives plans built in the funnel |
| `agreement.html` | Client agreement — full service terms |
| `portfolio.html` | Case-study system, rendered from `js/data.js`; honest empty state until real projects are published |
| `sops.html` | Documented client-journey standard operating procedures |

## Tech stack

- **HTML5, CSS3, vanilla JavaScript** — no frameworks, no build tools, no npm dependencies
- **Google Fonts** — Manrope (headings) + Inter (body) via CDN
- **Font Awesome 6** — icons via CDN
- Fully static; hosted on GitHub Pages

## File structure

```
/
├── index.html              # home — hosts the guided menu funnel
├── services.html  process.html  about.html  cloud-consulting.html
├── pricing.html   contact.html  agreement.html  portfolio.html  sops.html
├── industries.html
├── industries/             # nine industry pages
├── services/               # ten service detail pages
├── css/
│   ├── style.css           # site styles and design tokens
│   └── funnel.css          # funnel styles (index.html and contact.html only)
├── js/
│   ├── data.js             # site content architecture (services, industries, packages…)
│   ├── main.js             # site behaviour (nav, form, accordions, configurators)
│   ├── funnel-data.js      # FUNNEL CONFIGURATION — the single place to edit the menu
│   ├── funnel.js           # funnel behaviour and state machine
│   └── plan-intake.js      # receives a built plan on contact.html
├── docs/
│   ├── ARCHITECTURE.md     # direction, architecture, and the rules
│   └── screenshots/        # funnel states, mobile and desktop
├── assets/                 # approved brand, service, social, and process artwork
├── robots.txt  sitemap.xml  .nojekyll
```

## Design system

| Token | Value |
|-------|-------|
| Paper (page background) | `#F7F4ED` |
| Ink (text / dark panels) | `#152238` |
| Blue (accent) | `#2F64D6` |
| Sky (supporting surface) | `#EDF1F8` |
| Mint | `#B8E1D0` |
| Gold | `#F3C969` |
| Coral | `#E9785D` |
| Line (borders) | `#D5DBE4` |

Headings use Manrope, body copy uses Inter. Card radius `20px`, control
radius `12px`, panel radius `28px`. Approved logo assets live in
`assets/gray-matter-media-package/brand/approved-reference/` — never
substitute another logo.

## The funnel

```
outcome  →  starting point  →  compatible options  →  plan  →  inquiry
```

* `js/funnel-data.js` holds **every** funnel label, mapping, inclusion,
  displayed price, displayed timeline, guidance label, guided-question rule,
  and checkout URL. Editing that one file changes the menu.
* `js/funnel.js` renders it and owns the state machine. State lives in
  memory, in `sessionStorage['gm-funnel-v1']`, and in the URL query string,
  so Back and reload keep a customer's progress. Nothing reloads the page.
* Fast lanes — *I Know What I Need*, *Recommend It for Me*, *My Plan*,
  *Start Now* — stay available at every step, and *Start Now* works
  straight from any starting-point card.
* Without JavaScript the funnel container falls back to a crawlable list of
  every outcome and starting point, linked to the service pages.

## Content architecture

`js/data.js` remains the source of truth for the rest of the site:

| Collection | Drives |
|------------|--------|
| `services` | service cards and related-service blocks |
| `outcomes` | inquiry-form goal chips |
| `websiteActions` / `automationTasks` / `opportunity*` / other option sets | the service-page configurators |
| `industries` | industry cards |
| `packages` | website package tiers |
| `caseStudies` | the Work page (empty until real projects exist) |

Pages in a subdirectory set `<body data-root="../">` so `GM_DATA.url()`
resolves links correctly.

## Content rules

- **Never invent business facts** — no prices, timelines, limits,
  testimonials, popularity claims, performance claims, client names, or
  certifications that were not supplied.
- Services without approved public pricing display
  *"Price confirmed after a quick fit check"* and
  *"Timeline confirmed after a quick fit check"*.
- `pricing.html` is the only place that sets prices. The funnel reuses those
  exact values and never totals add-ons.
- A function that belongs to one package is described as belonging to that
  package, never as universally included. Ordinary required website
  functionality is an inclusion, not an upsell.
- Example figures (the cost-cleanup bill, the checkup report card) carry an
  "illustrative" label and a disclaimer.

## Payments

There is no payment processing in this repository and no fake checkout.
`GM_FUNNEL.checkout.links` in `js/funnel-data.js` is the only place a real
payment or deposit URL belongs; every entry ships empty, and while it is
empty the plan's primary action is **Send My Plan** through the existing
inquiry form. See §5 of `docs/ARCHITECTURE.md`.

## Running locally

No build step. Serve the root:

```bash
python3 -m http.server 8080
# or
npx http-server -p 8080 -c-1
```

## Deployment

GitHub Pages, `main` branch, `/` root. `.nojekyll` keeps Pages from running
Jekyll. Merging to `main` redeploys; there is no CI pipeline.

## Open items

- Approved prices and timelines for the ten services that currently show the
  fit-check wording (listed in `docs/ARCHITECTURE.md` §8).
- Real checkout or deposit links for the two website plans.
- Real, approved case studies for `GM_DATA.caseStudies`.
