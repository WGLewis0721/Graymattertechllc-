# contractors template

A one-page site for a roofing, remodeling, or general contracting business. Rugged and practical: proof of licensing sits near the top of the page, not buried at the bottom, and the phone number is impossible to miss.

## Conversion goal

Request a quote. The primary path is `QuoteRequestForm` (the shared `ContactForm`, with its `selectField` set to project type) at the bottom of the page, but a bold, always-visible phone CTA sits right under the trust badges near the top for anyone who would rather call than fill out a form, and the shared `StickyCallBar` keeps tap-to-call and directions one thumb away on every scroll position on mobile.

## Unique parts

Only one component is genuinely new to this vertical:

- `src/components/LicenseBadgeStrip.astro` — a horizontal strip of text-based trust badges (license number, insurance, bonding, certifications). No other vertical needs proof-of-licensing framed as a standalone strip, so this stays local rather than moving to `shared/`.

Everything else the spec calls out by a vertical-specific name is a shared component, reused as-is or just relabeled — deliberately **not** built as a separate component:

- "ServiceAreaMap" is the shared `MapEmbed`, with the `Section` wrapping it headed "Areas we serve" instead of "Find us". Same iframe embed, same CSP allowance, different heading.
- "ProjectGallery" is the shared `BeforeAfterSlider`, holding roofing, kitchen, and bathroom before/after pairs. It was promoted to `shared/` once three verticals (coaches-trainers, contractors, hospitality-and-cleaning) independently needed the same before/after comparison shape, so this template imports it directly rather than keeping a local copy.
- "QuoteRequestForm" is the shared `ContactForm` with its `selectField` prop set to project type (`Roofing`, `Kitchen remodel`, `Bathroom remodel`, `Siding and gutters`, `Room addition`, `General repair`). That select is the one deliberate escape hatch on `ContactForm`, added for exactly this shape.
- "EmergencyCallBar" is the shared `StickyCallBar`, rendered globally by `BaseLayout` on every page already — a persistent bottom bar with tap-to-call and directions is exactly what an emergency call bar is. The urgency framing comes from page copy instead of a fork: a bold `CTAButton` with a `tel:` href sits directly under the license badges near the top of the page ("Storm damage or an urgent repair? We answer day or night.").

## Pages

One page: `src/pages/index.astro`. A contractor's site doesn't need more than one page: trust signals, services, recent work, service area, hours, and the quote request all fit as anchor sections on a single scroll, consistent with the swipe-first, single-page philosophy this library is built around (`docs/PHILOSOPHY.md`). Section order: Hero, trust (`LicenseBadgeStrip` plus the emergency call CTA), services, testimonials, recent projects (`BeforeAfterSlider`), service area (`MapEmbed`), hours, quote request (`ContactForm`).

## What to change first for a new client

1. `content.json` — business name, tagline, phone, address, hours, services, `licenses` (this client's real license number, insurance coverage, bond, and certifications), `beforeAfter` (real before/after project pairs), testimonials, `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`). `gallery` is intentionally left empty here — project photography lives in `beforeAfter` instead of a separate plain photo swipe; populate `gallery` too only if this client wants an additional non-comparison photo swipe.
2. `theme.css` — only if this client's brand needs different defaults than the charcoal-and-safety-orange baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo, including both the "before" and "after" shot in each `beforeAfter` pair. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`).
4. `src/components/LicenseBadgeStrip.astro` badges are entirely data-driven from `content.json`'s `licenses` field — no component edits needed for a new client, just accurate license/insurance/bond numbers.
