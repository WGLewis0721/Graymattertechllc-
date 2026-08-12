# entrepreneurs template

A one-page site for a solo entrepreneur running a personal-brand business, such as a home-based food business (private chef, small-batch bakery, meal prep) or a solo consultant. Story-driven, mostly single-column, photo-forward where it counts (the product shelf), and light everywhere else so the founder's own voice carries the page.

The demo content here is a fictional home bakery and private-dinner business, Goldenrod Kitchen, run by Priya Anand out of a licensed home kitchen in Austin, Texas.

## Conversion goal

Contact or buy. There is no single external booking tool the way barbers-stylists has a booking provider: a solo entrepreneur's actual funnel is scattered across an order form, Instagram DMs, and a contact message, so this template surfaces all of them and lets the visitor pick whichever they'd actually use. `OfferBlock` and `ItemShowcase` push toward buying directly; `ContactForm` and `LinkHub` cover everyone who wants to ask first or order through a channel this template doesn't own.

## Unique parts

- `src/components/OfferBlock.astro` — a visually emphasized callout for a single promotional offer (here, 10% off a first order). New: no other vertical needs a standalone promo callout with its own CTA in this shape.
- `src/components/StoryPanel.astro` — a portrait photo plus a founder's-story paragraph, placed early on the page. New: not the shared `BioCard` (which is a professional profile with name/title/credentials fields); this is a single narrative block with no such fields, meant to lead a personal-brand page.
- `src/components/LinkHub.astro` — a link-in-bio-style vertical stack of full-width tap targets (order form, Instagram, menu PDF, market schedule, text-to-order). New: no other vertical needs a standalone outbound-link stack as its own section.

Reused as-is:

- "ProductShelf" is the shared `ItemShowcase` component, holding six priced, photographed products. Nothing vertical-specific here; `ItemShowcase` was added to `shared/` specifically because entrepreneurs' "ProductShelf" and food-trucks-and-services' "MenuBoard" both needed this exact image-forward priced-grid shape.
- "Custom & private orders" is a grid of the shared `ServiceCard`, for offerings that aren't individually photographed (a private dinner party, a cooking class, a bake subscription).
- The behind-the-scenes photo strip is the shared `SwipeGallery`.
- Testimonials, hours, the contact form, header, footer, and the sticky mobile call bar are all shared components, used unmodified.

## Pages

One page: `src/pages/index.astro`. Section order: Hero, the founder's story (`StoryPanel`), the promotional offer (`OfferBlock`), the product shelf (`ItemShowcase`), behind-the-scenes photos (`SwipeGallery`), custom/private orders (`ServiceCard` grid), testimonials, then hours, the contact form, and `LinkHub` together under one "Order or say hello" section. This deliberately leads with story and offer rather than a photo gallery, unlike barbers-stylists, since this vertical is personal-brand-first, not visual-inventory-first.

## What to change first for a new client

1. `content.json` — business name, tagline, phone, service area (or address, if the client has a public storefront), hours, services, gallery entries, `products`, `offer`, `story`, `links`, testimonials, `formEndpoint` (a real Formspree endpoint), `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `theme.css` — only if this client's brand needs different defaults than the warm-terracotta baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`).
4. `src/pages/index.astro` — the nav labels and `LinkHub`'s ordering assume an order-form-plus-Instagram funnel; adjust if this client's actual link set differs (a solo consultant might swap the market schedule and menu PDF links for a calendar link and a portfolio link, for example).
