# coaches-trainers template

A one-page site for a solo fitness or performance coach, or a small training studio. High energy, large type, bold imagery: photos and results carry the page, copy stays tight.

## Conversion goal

Book a free intro session. Unlike barbers-stylists (which links straight out to a third-party booking provider), this vertical's primary action is the shared `ContactForm`, posting to Formspree, framed as claiming a free intro session. The booking CTA repeats down the page rather than living only in the header/hero: once in the header, once in the hero, once in a banner after the programs section, once in a banner near the schedule, and again as the final `#book` section itself.

## Unique parts

- `src/components/ScheduleStrip.astro` — genuinely new. A horizontal swipeable strip of bookable session cards (day, time, session name, optional spots-left), using the same no-JS `scroll-snap` pattern as the shared `TestimonialStrip` / `SwipeGallery` / `BeforeAfterSlider`. Built new rather than reused because no shared component's prop shape fits a bookable-session-card (day/time/name/scarcity is a different category from a quote, an image, or a before/after pair). It stays local to this vertical per `docs/ENGINEERING.md` principle 7: promote to `shared/` only once a second vertical needs the exact same shape.

Everything else on the page is a shared component, reused as-is or just relabeled:

- "Coaching programs" is a grid of the shared `ServiceCard`, the same pattern as barbers-stylists' "PriceList" section.
- "Real client transformations" is the shared `BeforeAfterSlider`, holding 3 before/after photo pairs. Not a new component: `BeforeAfterSlider` was promoted to `shared/` specifically because coaches-trainers, contractors, and hospitality-and-cleaning all independently need this exact before/after shape (see `src/components/shared/README.md`).

## Vertical-specific content.json extensions

This template's copy of `src/schemas/content.schema.json` (and the matching `src/lib/content.ts` interfaces) adds two additive fields on top of the core contract, following the same pattern as barbers-stylists' `stylists` field:

- `sessions` — the data behind `ScheduleStrip`: `{ day, time, name, spotsLeft? }[]`.
- `transformations` — the data behind the `BeforeAfterSlider` section: `{ before, beforeAlt, after, afterAlt, label? }[]`. This one was necessary in addition to `sessions` because no core schema field can hold a before/after image pair with independent alt text; it follows the exact same additive pattern, just for a different shared component's shape.

Both extensions are local to this template's schema copy, not the shared library schema.

## Pages

One page: `src/pages/index.astro`. A solo coach doesn't need more than one scroll: transformations, programs, schedule, and booking all fit as anchor sections, consistent with the swipe-first, single-page philosophy this whole library is built around (`docs/PHILOSOPHY.md`). The section order deliberately differs from barbers-stylists: the transformation slider leads right after the hero, since proof-of-results is the emotional case a coach sells on, before the programs list.

## theme.css

Distinct from barbers-stylists' near-black-and-red barbershop palette on a warm cream page. This vertical goes full dark: electric orange (`--color-primary`) and lime (`--color-accent`) against a near-black surface, a bold sans display heading font (`Archivo Black`), and a noticeably larger type scale (`--text-2xl`/`--text-3xl`/`--text-4xl` all bumped up) for "large type, bold imagery." Because the page background itself flips dark (not just the primary/accent tokens), every surface/ink/border token that depends on background contrast is overridden together so text, cards, and form fields all stay readable; see the comments in `theme.css` for the reasoning per token.

## What to change first for a new client

1. `content.json` — business name, tagline, phone, address, hours, coaching programs (`services`), gallery entries, `sessions`, `transformations`, testimonials, `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `theme.css` — only if this client's brand needs different defaults than the electric-orange-and-lime baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo. See `images/README.md` for exact dimensions per slot. Before/after transformation photos need explicit client sign-off to use their likeness, on top of the mandatory EXIF strip (`docs/SECURITY.md`).
4. `src/pages/index.astro` — the two mid-page CTA banner captions ("Ready to see what a real plan feels like?", "Spots fill up fast...") are hardcoded English copy in this file per the "no copy in .astro files" exception boundary; check `docs/ARCHITECTURE.md` if a client needs these to be content.json-driven instead of template defaults.
