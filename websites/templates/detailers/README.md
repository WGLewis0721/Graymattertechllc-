# detailers template

A one-page site for an auto detailing shop. Copy is blunt and price-forward; a detailing customer arrives with two questions ("does their work actually look like that" and "what does it cost on *my* vehicle") and this page answers them in that order, above the fold and immediately below it.

## Conversion goal

Book a detail, or request a quote for a vehicle that doesn't fit the standard sizes. Booking goes out to whatever scheduler the shop already runs (Square, Booksy, Calendly) via `content.json`'s `booking` block; the `ContactForm` at the bottom catches everyone whose vehicle or paint condition needs a human to price it.

## Unique parts

- `src/components/VehicleSizeTable.astro` — a price **matrix**: every package tier crossed with every vehicle size. This is the one genuinely new shape in this vertical. No other template prices a single service against multiple units of the same axis — barbers' price list is a flat `ServiceCard` grid (one price per service) and hospitality's `ServiceChecklist` is task-forward with no price at all. It renders twice from one data source: stacked cards below 48rem, a real `<table>` above it, with the hidden one taken out of the accessibility tree so screen readers are never offered both. It also throws at build time if a tier's `prices` array doesn't match the `vehicleSizes` length, which the JSON Schema can constrain in range but not in equality.

Everything else on the page is a shared component, reused as-is or relabeled:

- The results section is the shared `BeforeAfterSlider` directly. Detailing is the purest case for that component in the whole library, but it was already promoted to `shared/` for hospitality-and-cleaning, coaches-trainers, and contractors, so this vertical adds nothing to it.
- Add-ons are the shared `ServiceCard` grid, unchanged.
- The quote form is the shared `ContactForm` with its `selectField` prop, fed **the same `vehicleSizes` array the price table uses** — a visitor who just read the matrix picks their size again in identical words rather than describing the vehicle in free text.
- "Recent work" is the shared `SwipeGallery`; hours, reviews, map, sticky call bar, and footer are the shared `HoursTable`, `TestimonialStrip`, `MapEmbed`, `StickyCallBar`, and `Footer`.

### Why there is no `BookingWidget` here

`barbers-stylists` has one, and this vertical also links out to a third-party scheduler, so promoting it to `shared/` is the obvious move — and it is deliberately **not** made. Per `docs/ENGINEERING.md` principle 7, a shape gets promoted once a second vertical needs *the same* thing. A detailer's booking carries a deposit note a barbershop's does not, and this page places the link inside the booking section rather than standing alone as its own widget. Two verticals wanting "a link to a scheduler" is not yet two verticals wanting the same component. If a third vertical needs it, promote it then — with the deposit note as a prop — and delete both local copies.

## Pages

One page: `src/pages/index.astro`. Order: Hero, **before/after immediately**, pricing matrix, add-ons, recent work, reviews, hours and service area, then booking plus quote form and map.

That order is the deliberate difference from the other verticals. Hospitality front-loads reassurance and holds its before/after until after the package checklists; barbers leads with the work then books fast. Detailing leads with the transformation itself, because the comparison slider *is* the sales pitch — everything after it exists to answer "what does that cost on mine" while the difference is still on screen.

## What to change first for a new client

1. `content.json` — business name, tagline, phone, address, `serviceArea`, hours, `vehicleSizes` (the shop's actual size tiers, 2-4 of them), `vehicleTiers` (package names, per-size prices, and what's included), `services` (the à-la-carte add-ons), `beforeAfter` pairs, gallery entries, testimonials, `booking` (real scheduler URL and deposit policy), `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `images/` — replace every placeholder, including both halves of every `beforeAfter` pair. `images/README.md` has the dimensions and, more importantly, how to shoot the pairs so the comparison reads honestly. EXIF-strip everything first (`docs/SECURITY.md`); vehicle photos routinely carry the customer's home GPS coordinates, and license plates need cropping or permission.
3. `src/pages/index.astro` — the `featured` prop on `VehicleSizeTable` is hardcoded to `"Full Detail"`; point it at whichever tier this shop actually wants pushed, or drop the prop for no emphasis.
4. `theme.css` — only if the client's brand needs different defaults than the garage-clean near-black-and-cold-blue baseline. Most clients will set `content.json`'s `theme.colors` instead of touching this file.

## Pricing honesty

`vehicleTiers[].prices` accepts strings, not numbers, specifically so a shop can publish `"$450+"` for work that genuinely has to be quoted after inspection. Use it. A paint-correction price presented as exact, then revised upward at drop-off, costs more trust than the open-ended figure would have.
