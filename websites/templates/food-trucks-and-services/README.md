# food-trucks-and-services template

A one-page site for a food truck. Big, appetizing photography and a loud, playful color scheme carry the page; copy stays minimal.

## Conversion goal

Find today's location, or book the truck for a private event/catering. Because the business itself moves, "find us today" is the most time-sensitive job the page has to do, so `LocationTracker` runs right under the Hero, ahead of the menu. `EventBookingCTA` sits near the bottom as the second conversion path, for anyone who wants the truck to come to them instead.

## Unique parts

- `src/components/LocationTracker.astro` — the one genuinely new component. A weekly schedule of where the truck parks: day, location, and time window, rendered as a real `<table>`. Not the shared `HoursTable`: that component only has one open/close time per day and no location field, which can't express a truck that serves lunch at one address and dinner at another on the same day. Built locally rather than promoted to `shared/` because no other vertical in this library needs a "where do I find you" schedule; a shop has one address, it doesn't move.

Everything else on the page is a shared component, reused as-is or just relabeled — deliberately, not because building a new one was skipped:

- "MenuBoard" is the shared `ItemShowcase` directly. It already has the exact shape a food truck's menu needs (photo, name, price, description grid); it was added to `shared/` for this reason, alongside entrepreneurs' "ProductShelf" which needed the identical shape. There is no separate MenuBoard component to maintain.
- "EventBookingCTA" is the shared `ContactForm` with its `selectField` prop set to an event-type dropdown (Private party, Corporate catering, Wedding, Other). `ContactForm`'s one deliberate escape hatch (a single optional category select) already covers this; a bespoke booking form would just be a second copy of the same fields with a different label.
- The "golden hour vibe" gallery is the shared `SwipeGallery`, holding truck and crowd photos separate from the individually-photographed menu items.

## Pages

One page: `src/pages/index.astro`. A food truck doesn't need more than one scroll: hero, today's stops, the menu, some atmosphere photos, testimonials, event booking, and typical hours all fit as anchor sections, consistent with the swipe-first, single-page philosophy this whole library is built around (`docs/PHILOSOPHY.md`). Section order and rhythm are deliberately different from other verticals in this library (location before menu, booking after the gallery and testimonials, hours and the map last) to match what a mobile business actually needs first.

## What to change first for a new client

1. `content.json` — business name, tagline, phone, service area (most trucks don't have a fixed address; use `business.serviceArea` instead), typical hours, `services` (event/catering pricing), `menu` (the real menu, 6-10 items), `stops` (the real weekly route), gallery entries, testimonials, `formEndpoint` (a real Formspree endpoint), `map` (usually the commissary kitchen or home base, not a storefront), `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `theme.css` — only if this client's brand needs different defaults than the mustard-and-chili-red baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo, including one per menu item. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`).
4. `src/components/LocationTracker.astro` — no props to change here; the schedule itself lives entirely in `content.json`'s `stops` array.
