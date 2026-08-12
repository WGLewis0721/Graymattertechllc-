# real-estate-agents template

A one-page site for a solo real estate agent or small agency. Listings carry the page; the agent is the anchor of trust underneath them.

## Conversion goal

Request a home valuation or schedule a showing. The page leads with a grid of featured listings (the real hero of a real estate site, ahead of the actual `Hero` banner's own weight), then builds trust with neighborhood context and the agent's own profile, then closes with a dedicated valuation call-to-action and a `ContactForm` for anyone ready to reach out directly.

## Unique parts

- `src/components/ListingCard.astro` — a property card: photo, price, beds/baths, address, and an optional status badge ("For sale", "Under contract", "New listing"). Genuinely new: nothing in `shared/` has this image + beds/baths shape.
- `src/components/NeighborhoodStrip.astro` — a horizontal, swipeable strip of neighborhood highlight cards (name, description, optional photo), using the same no-JS `scroll-snap` pattern as the shared `TestimonialStrip`/`SwipeGallery`. Genuinely new: no other vertical needs a "place, not person or product" card shape yet.

Everything else on the page is a shared component, reused as-is or just relabeled:

- "ListingGrid" is **not** a separate component. It's a page-level responsive `<ul>` grid of `ListingCard`s, with a small scoped `<style>` block in `src/pages/index.astro` (same pattern as barbers-stylists' `.price-grid`), because a plain CSS grid wrapper doesn't earn its own component.
- "ValuationCTA" is **not** a separate component. It's composed at the page level from the shared `Section` (heading + copy) and `CTAButton` (the one prominent action, linking to `#contact`) — `CTAButton` already covers "one prominent action" on its own, so a wrapper component would just be a fixed arrangement of two existing components.
- "AgentBio" is the shared `BioCard` directly (photo, name, title, bio, credentials), relabeled "Meet your agent" in the section heading. Added to `shared/` specifically because this vertical and lawyers-attorneys both needed the identical single-person-profile shape; do not build a per-vertical copy.
- "PriceList"-equivalent ("How I can help") is a grid of shared `ServiceCard`s, used for buyer representation, seller representation, home valuation, and relocation assistance.
- "CutGallery"-equivalent ("Behind the scenes") is the shared `SwipeGallery`, holding lifestyle/process photos (open houses, closings, signage) — separate from the listings grid, which uses `ListingCard`, not `SwipeGallery`.

## Pages

One page: `src/pages/index.astro`. A solo agent's site doesn't need a page per listing for this template pass — listings, neighborhoods, services, agent bio, hours, and contact all fit as anchor sections on a single scroll, consistent with the swipe-first, single-page philosophy this library is built around (`docs/PHILOSOPHY.md`). Section order deliberately differs from barbers-stylists' price-first rhythm: here, listings come immediately after `Hero`, since listings are the actual point of the page, and the valuation CTA is a standalone section ahead of the contact form rather than folded into it.

## What to change first for a new client

1. `content.json` — business name, agent name/tagline, phone, address, hours, `services` (framed as buyer/seller representation and valuation, not haircuts), `listings` (the current property inventory), `neighborhoods`, `agent` (photo, bio, credentials), gallery, testimonials, `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `theme.css` — only if this client's brand needs different defaults than the navy-and-brass baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
3. `images/` — replace every placeholder photo: hero, every listing, every neighborhood, the agent's headshot, and the gallery. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`). This is the most image-heavy template in the library, so budget extra shoot/selection time for a real client.
4. `src/pages/index.astro` — the `ContactForm`'s `selectField` options ("Buying a home", "Selling a home", "Free home valuation", "Just have a question") are a reasonable default; adjust if this client's intake categories differ.
