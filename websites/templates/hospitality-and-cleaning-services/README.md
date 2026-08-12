# hospitality-and-cleaning-services template

A one-page site for a residential cleaning / Airbnb turnover service. Copy stays reassuring and specific; the goal is to make a stranger comfortable enough to hand over their house keys.

## Conversion goal

Request a cleaning quote or book a stay-ready / turnover service. The page builds trust before it asks for anything: an availability signal up top, exactly what's included in each package, and real before/after proof, all ahead of the quote form (`ContactForm`) near the bottom.

## Unique parts

- `src/components/ServiceChecklist.astro` — a single package tier (Standard, Deep Clean, Airbnb Turnover) rendered as a checklist of included tasks. Not the shared `ServiceCard`: that's price-forward, one price per card, with no list of included items. This is task-forward and used once per tier.
- `src/components/AvailabilityBadge.astro` — a small trust/urgency pill ("Booking 3 days out this week"), deliberately tiny: a status dot plus one line, placed right under the hero so reassurance lands before anything else.

Everything else on the page is a shared component, reused as-is or just relabeled:

- The before/after showcase is the shared `BeforeAfterSlider` directly, not a new component. It was promoted to `shared/` specifically because this vertical, coaches-trainers, and contractors all independently needed the same dirty-to-clean / before-to-after comparison shape (see `src/components/shared/README.md`).
- The quote request form is the shared `ContactForm` directly, not a new form component, using its `selectField` prop for service type (One-time cleaning, Recurring cleaning, Airbnb turnover, Move-in/move-out). That escape hatch exists precisely for this vertical's "which service" question, so a separate `QuoteRequestForm` component would just be a fork of `ContactForm` with nothing new in it.
- "Spaces we've cared for" is the shared `SwipeGallery`, holding general work photos (distinct from the before/after pairs, which are their own comparison shape).
- Hours, testimonials, map, and footer are the shared `HoursTable`, `TestimonialStrip`, `MapEmbed`, and `Footer`.

## Pages

One page: `src/pages/index.astro`. Order: Hero, an `AvailabilityBadge` right underneath for early reassurance, package checklists (what's included, builds trust before money comes up), a general work gallery, the before/after showcase, testimonials, hours, then the quote form and map. This deliberately front-loads trust-building content before the ask, a different rhythm than the barbershop template's cuts-first, book-immediately flow.

## What to change first for a new client

1. `content.json` — business name, tagline, phone, address, hours, `services` (the priced package summary), `packages` (the detailed checklist per tier), `availability`, gallery entries, `beforeAfter` pairs, testimonials, `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `theme.css` — only if this client's brand needs different defaults than the fresh-blue-and-white baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo, including both the before and after image for every `beforeAfter` pair. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`). Shoot before/after pairs from the same angle so the comparison reads clearly.
4. `src/pages/index.astro` — the select field's `options` list in the `ContactForm` call is hardcoded to this client's service menu; adjust it if the new client's service breakdown differs.
