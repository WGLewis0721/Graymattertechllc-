# Existing client website — brand / UI system audit and delivery

Use when a client site already exists and you need a **brand kit, brand board, UI kit, consistent icons/fonts and reliable per-screen handoff**, rather than a speculative redesign. Companion to [Design-to-Build Contract](DESIGN_TO_BUILD_CONTRACT.md), [Upgrade Workflow](UPGRADE_AND_CORRECTIVE_WORKFLOW.md) and the [WD reference case](case-studies/WD_AUTO_DETAILING_SITE_SYSTEM.md).

## 0 — Ground the work before touching production

1. Read the current repo, default branch, page inventory, CSS/JS dependencies, current assets, previous designs, latest merged PRs, and any approved briefs/decision logs.
2. Read client files with the authorized connector; identify revision/date, client owner, approved vs proposed facts. If a Doc/Drive folder is inaccessible, record **access blocked** and do not claim it was synchronized or approved.
3. Identify contractual brand decisions, typography licenses and the *actual* business conversion route. Do not derive pricing, availability or payment status from screenshots.
4. Identify conflicts between active docs and legacy/copilot/agent instructions; record them before editing. Treat active code and signed client approvals above historical drafts.
5. Use a feature branch and draft PR for review. Preserve the runtime and client assets. Never merge or deploy without the project's required approvals.

## 1 — Inventory / evidence matrix

Create `design/AUDIT.md` with **present / partial / missing / blocked** labels and source paths for:

- Brief, brand voice, logo source and variants (color, reverse, horizontal, favicon and social).
- Color palette, semantic tokens, contrast pairings, spacing, radius, shadows and motion.
- Display/body/accent font families, locally hosted files, weight axes, fallbacks, licensing and unresolved approved fonts.
- Icon inventory: source icons, SVG geometry, accessible labels, decorative use, sizes, stroke/filled styles, duplicated or inconsistent symbols.
- Photo/video library with source, authenticity, rights, responsive crop, poster and file size.
- UI component code + visual documentation: nav, buttons, links, forms, cards, pricing, progress, alerts, empty/error/loading/success and mobile.
- Current pages/routes and complete journeys, including stubbed integrations, nonfunctional CTAs and preview disclaimers.
- Desktop/mobile wireframes and real screenshot evidence, tests, contrast, keyboard, accessibility and reduced-motion.

Only say **missing** when a search of the relevant repository area found no artifact; a CSS pattern may exist even if its documentation or visual proof does not.

## 2 — Expected destination in a client repository

```text
design/
  README.md                       Index, status and authority
  AUDIT.md                        Evidence inventory and conflicts
  BRIEF.md                        Scope + approved business facts
  PREBUILD_PLAN.md                Decisioned execution plan
  REFERENCES.md                   Inspected source/inspiration register
  BRAND_BOARD.md                  Brand story and directions, approval
  UI_KIT.md                       Component contract + state matrix
  SCREEN_MAP.md                   Existing pages and entry/exit
  QA.md                           Test evidence and signoff
  brand/
    BRAND_KIT.md                  Approved asset and license manifest
    TYPOGRAPHY.md                 Types, specimens, fallback & load policy
    ICONOGRAPHY.md                24px system, SVG rules, registry & labels
    assets/                       Approved client-original logo exports
  wireframes/
    *.svg                         Editable per-page desktop/mobile drafts
    exports/*.png                 Matching PNG previews
  evidence/
    brand-board/                  Rendered board(s)
    ui-kit/                       Rendered kit(s)
    before/                       Real baseline captures
    after/                        Real post-change captures
    comparisons/                  Actual screenshot comparisons
```

The file tree is a **target contract**, not proof that generated images/assets already exist. Reuse an existing repo's names and structure rather than overwriting established conventions. Do not create empty evidence files to pass checks. Use the existing site framework; plain HTML/CSS/JS is a valid finished product.

## 3 — Brand-kit and icon delivery rules

- **Brand board** communicates a *visual direction* in one view (logos, palette, type samples, imagery, components, texture); its Markdown explanation is not the render.
- **Brand kit** is production asset authority: exact files, variants, allowed usage, source/rights, semantic color specifications, font files, attribution, version and change owner.
- **UI kit** is the functional UI authority: components and states, token mapping, responsive/focus/error rules, source implementation files and a visual gallery. It must be tested, not only drawn.
- **Icons** are a unified set: document base viewBox (24×24 is reasonable), line weight, corner/cap style, optical sizing, fills, currentColor vs brand fills, aria-hidden policy and labels. Catalog the icons in the actual repo. Reuse approved inline SVGs by extracting a canonical registry instead of replacing every pictogram on sight.
- **Fonts** must have explicit names, actual files, commercial usage rights, fallbacks, roles, font-display, weight variants and documented pending decisions. Do not download a branded commercial font without a license.
- A **single source of truth** means one canonical brand value, not necessarily one CSS file. If legacy pages duplicate inline tokens, add parity checks and plan a safe migration with rendered regression evidence rather than a blind stylesheet swap.

## 4 — Delivery gates

| Gate | Required proof | Stop condition |
| --- | --- | --- |
| Research | Repository/Docs/Drive/decision sources and conflicts recorded | Unknown approved business facts or client authority |
| Direction | Brand board render and asset/font/license review | Unapproved logo, palette, paid typeface or fabricated content |
| Components | UI kit render, accessible states, icon gallery, code ownership | Unlabeled icons, state gaps or stray hard-coded brand colors |
| Screens | Mobile + desktop wireframe for every requested page and user journey | Missing pages/flows or unapproved structural change |
| Integration | Real working CTA/form/payment status or explicitly labeled demo | Fake checkout, unverifiable request delivery |
| QA / launch | Real browser screenshots, visual diffs, functional tests, keyboard, mobile, contrast, reduced motion; written approval | Unverified critical workflow, unresolved major defects or no owner approval |

Track each item as **existing, planned, implemented or verified**. Never mark a proposal completed. A design-only PR may be reviewed independently of unresolved server/payment architecture.
