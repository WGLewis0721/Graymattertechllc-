# barbers-stylists template

A one-page site for a barbershop or hair salon. Photos carry the page; copy stays minimal.

## Conversion goal

Book an appointment. The primary CTA (`BookingWidget`) links straight out to whatever external booking provider the shop already uses (Square, Booksy, Calendly). A `ContactForm` sits underneath as a fallback for anyone who would rather message than click through to a booking flow.

## Unique parts

- `src/components/BookingWidget.astro` — the outbound booking link, styled as the page's loudest single action.
- `src/components/StylistRoster.astro` — a compact grid of the team (photo, name, specialty). Not the shared `BioCard`: that's a single deep-dive profile, this is many people at a glance.

Everything else on the page is a shared component, reused as-is or just relabeled:

- "CutGallery" is the shared `SwipeGallery`, holding cut photos.
- "PriceList" is a grid of shared `ServiceCard`s.

## Pages

One page: `src/pages/index.astro`. A barbershop doesn't need more — cuts, stylists, prices, hours, and booking all fit as anchor sections on a single scroll, consistent with the swipe-first, single-page philosophy this whole library is built around (`docs/PHILOSOPHY.md`).

## What to change first for a new client

1. `content.json` — business name, tagline, phone, address, hours, services (the price list), gallery entries, stylists, testimonials, `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `theme.css` — only if this client's brand needs different defaults than the barbershop-red-and-black baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`).
4. `src/pages/index.astro` — the `BookingWidget`'s `provider` and `href` props are hardcoded to a placeholder Square link; point them at this client's real booking page.
