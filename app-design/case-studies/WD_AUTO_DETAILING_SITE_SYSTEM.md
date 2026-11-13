# WD Auto Detailing — reusable design-system lessons

**Inspected:** November 13, 2026  
**Reference:** [WD-AutoDetailing](https://github.com/WGLewis0721/WD-AutoDetailing) on `main`.  
**Status:** Evidence-backed example; not a default brand or an instruction to copy its business logic.

## Actual source material examined

- [BUILD_NOTES](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/Documentation/BUILD_NOTES.md): art direction, component conventions, asset provenance, actual limitations.
- [New client overview](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/Documentation/new-client-OVERVIEW.md), [ways of working](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/Documentation/new-client-WAYS-OF-WORKING.md) and [build lessons](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/Documentation/new-client-BUILD-LESSONS.md): approval gates, client truth, architecture boundaries.
- [Tokens](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/site/src/styles/tokens.css), [base/components](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/site/src/styles/base.css) and [SVG icon registry](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/site/src/lib/icons.ts): concrete implementation, not just design aspirations.
- [Grayscale wireframes](https://github.com/WGLewis0721/WD-AutoDetailing/tree/main/design/wireframes) and [README](https://github.com/WGLewis0721/WD-AutoDetailing/blob/main/README.md): source artifacts, scopes and preview limitations.

## Reusable patterns confirmed in source

| Pattern | Observed WD implementation | Transfer to another client |
| --- | --- | --- |
| Cohesive identity | Ivory/white, black and restrained gold; specific 60/30/10 visual weighting | Define a **different, client-approved** palette and usage hierarchy; never copy WD colors or logo by default |
| Typography with purpose | Instrument Serif for display; Manrope for body; fonts imported in base stylesheet | Define display, body, accent roles, hosted files, fallbacks and license evidence |
| Token discipline | One `site/src/styles/tokens.css` for the Astro site; token checker `site/scripts/check-tokens.mjs` | Keep a designated authority for values; add drift check adapted to the existing stack; do not install Astro or npm into static projects without reason |
| Component grammar | Consistent button, card, chip and field treatments in `base.css`; shared states | Document actual component variants, focus/hover/disabled/loading/error and responsive behavior in a UI kit |
| Icon language | Centralized 24x24 SVG path registry; 1.6px stroke, rounded caps/joins, `currentColor`; decorative icons `aria-hidden` | Adopt a consistent original icon system and inventory; meaningful icons still need accessible labels |
| Predictable layout | 4px spacing scale, defined corner/shadow/tap tokens, responsive CSS | Verify spacing, sizing and real tap targets at multiple widths |
| Measured motion | Small transitions, poster fallback, reduced-motion CSS | Set motion duration/easing and fallback policy, not animation for its own sake |
| Evidence before go-live | Brief → grayscale wireframe sign-off → preview review → QA + written launch approval | Keep gated reviews, actual screenshots, truthful CTA checks, and a change record |
| Business truth | Never invent menu, hours, testimonials or availability; actual client media identified | Reconcile client's latest approved data with public text before publishing |
| Honest architecture | README distinguishes preview/sample availability/payment from working integrations | Design states must label demo behavior and avoid pretending an unconnected checkout works |

## What not to transfer

- The WD brand, palette, company photos, 3D vehicle assets, pricing or booking steps.
- The Astro, GitHub Pages, or Square architecture into an existing non-Astro/non-Square project automatically.
- Older planning text as an implementation fact: WD's `WEBSITE_BUILD_PLAN.md` retains prior Cloudflare planning while its README documents GitHub Pages. Prefer actual deployed code, current README and test evidence over obsolete proposals.
- WD's 3D or video effects unless they measurably improve the target client's visitor journey.

## Required output when using WD as a reference

1. `design/BRIEF.md` and `design/PREBUILD_PLAN.md` record approved business truth, conversion goal and provenance.
2. `design/BRAND_BOARD.md` + **rendered** proof: logo variants, color usage, type specimen, imagery and motion examples.
3. `design/brand/BRAND_KIT.md`: asset manifest, files, attribution, license, fonts, tokens and a canonical icon specification.
4. `design/UI_KIT.md` + **rendered** component gallery + real implementation paths.
5. `design/SCREEN_MAP.md`, per-page specs, grayscale wireframes and desktop/mobile screenshots; do not silently omit pages.
6. `design/QA.md` plus source-of-truth/diff checks, keyboard/mobile/contrast/reduced-motion and primary CTA flow evidence.
7. A recorded client approval and explicit open decisions. Missing shared files must be marked **not reviewed**, never guessed.

See [Client Site Design Audit](../CLIENT_SITE_DESIGN_SYSTEM_AUDIT.md) and [Brand Kit & Icons template](../templates/BRAND_KIT_AND_ICONOGRAPHY.md).
