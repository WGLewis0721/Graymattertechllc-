# Shared components — the joint contract

This folder is the frame. Every vertical template composes pages out of these components plus, occasionally, a `parts/` component. Read `docs/PHILOSOPHY.md` and `docs/ENGINEERING.md` before adding anything here — this file documents the mechanical contract those docs describe, so a new part snaps in correctly.

## The rule

A component in this folder never contains a hardcoded color, font name, or business-specific string. If you can `grep -E "#[0-9a-fA-F]{3,6}"` a `.astro` file in this folder and get a hit outside a comment, that's a bug. Every visual value is a `var(--token)` from `src/styles/tokens.css`. Every piece of copy is a prop.

## GitHub Pages base path

This library hosts on GitHub Pages, which means a site's real URL can be `https://domain.com/` (base `/`) or `https://username.github.io/repo-name/` (base `/repo-name`), decided per client and set in `astro.config.mjs` (see `docs/DEPLOYMENT.md`). No component in this folder hardcodes a leading-slash root path, because a hardcoded `/` breaks the moment a client is served from a repo subpath instead of a custom domain. The pattern every component here actually uses:

- **In-page navigation** (`Header`'s nav, `SwipeGallery`'s dots) uses `#fragment` anchors, which are relative to the current page and never need a base prefix.
- **External links** (`tel:`, `mailto:`, Formspree's endpoint, a Google Maps search URL) are absolute URLs or non-`http` schemes, which don't go through `base` at all.
- **Images** always go through `astro:assets`' `<Image>` component with a resolved `ImageMetadata` object (see below), which bakes the correct base-prefixed path in automatically.

If a new component ever needs to link to another page within the same site, that link must be built from Astro's own base-aware primitives (root-relative links through Astro's routing, or `import.meta.env.BASE_URL` where a raw path is unavoidable), never a string literal starting with `/`.

## Prop shape by category

These shapes are fixed across every vertical. A barber template and a lawyer template both call `Hero` with exactly these props, in this order of relevance. If a vertical needs different behavior, the fix is a new optional prop with a safe default on the existing component, never a forked copy.

- **Header** — `businessName: string`, `nav?: {label, href}[]`, `ctaLabel?: string`, `ctaHref?: string`.
- **Footer** — `businessName: string`, `phone: string`, `email?: string`, `address?: string`, `social?: {instagram?, facebook?, google?, yelp?}`.
- **Hero** — `heading: string`, `subheading?: string`, `image: ImageMetadata`, `imageAlt: string`, `ctaLabel?: string`, `ctaHref?: string`.
- **Section** — `id?: string`, `heading?: string`, `headingLevel?: 'h2'|'h3'`, `background?: 'default'|'alt'`, `width?: 'sm'|'md'|'lg'`, default slot for content.
- **CTAButton** — `label: string`, `href: string`, `variant?: 'primary'|'accent'|'outline'`, `type?: 'link'|'submit'`.
- **ContactForm** — `endpoint: string` (a Formspree URL, always), `submitLabel?: string`, `redirectTo?: string`, `selectField?: {label: string, name: string, options: string[]}`. Core field set (name, phone-or-email, message, honeypot) is fixed. `selectField` is the one deliberate escape hatch: a single optional category dropdown, added once three verticals independently wanted the same shape under a different label (lawyers' "ConsultationForm" wants practice area, contractors' and hospitality-and-cleaning's "QuoteRequestForm" want project/service type). It is not a general field builder — a vertical that needs more than this still needs a different form component in `parts/`.
- **SwipeGallery** — `images: {image: ImageMetadata, alt: string}[]`, `id: string` (required — used to namespace the anchor-based position indicator when a page has more than one gallery), `aspectRatio?: string`.
- **BeforeAfterSlider** — `items: {before: ImageMetadata, after: ImageMetadata, beforeAlt: string, afterAlt: string, label?: string}[]`, `id: string` (required, same namespacing purpose as `SwipeGallery`'s), `aspectRatio?: string`. Added once three verticals (coaches-trainers, contractors, hospitality-and-cleaning) independently needed the same before/after comparison shape — import it directly rather than building a per-vertical copy.
- **ServiceCard** — `name: string`, `price: string`, `duration?: string`, `description?: string`. Renders as `<li>`; the caller supplies the wrapping `<ul>`. Use this when items aren't individually photographed (coaching programs, legal practice areas).
- **ItemShowcase** — `items: {image: ImageMetadata, imageAlt: string, name: string, price: string, description?: string}[]`. Renders its own grid, no wrapping `<ul>` needed from the caller. Added once two verticals independently needed the identical shape: entrepreneurs' "ProductShelf" and food-trucks-and-services' "MenuBoard". Use this instead of `ServiceCard` when each item has a photo.
- **BioCard** — `photo: ImageMetadata`, `photoAlt: string`, `name: string`, `title: string`, `bio: string`, `credentials?: string[]`. A single-person profile. Added once two verticals independently needed the identical shape: real-estate-agents' "AgentBio" and lawyers' "AttorneyProfile". Not for a roster of many people (barbers-stylists' StylistRoster stays vertical-specific: compact, many-per-page, no full bio text).
- **TestimonialStrip** — `testimonials: {quote, author, role?}[]`.
- **HoursTable** — `hours: {day, open: string|null, close: string|null}[]`.
- **MapEmbed** — `embedUrl: string`, `title: string`. The only place a raw third-party iframe is allowed (docs/SECURITY.md). Its origin must be present in `BaseLayout`'s CSP `frame-src`. Also stands in for a "service area map" (contractors) — same component, different section heading.
- **StickyCallBar** — `phone: string`, `address?: string`. Rendered once, by `BaseLayout`, not by individual pages — this is global chrome, not a page section. Also stands in for contractors' "EmergencyCallBar" — same component; urgency framing comes from page copy (e.g. a Hero CTA), not a fork of this component.

## Why images are always `ImageMetadata`, never a bare src string

`content.json` stores image references as path strings (see docs/ARCHITECTURE.md's content.json contract). Shared components never resolve those strings themselves — that would mean baking a specific file layout assumption into the frame. Instead, the page (which knows its own `src/images/` layout) resolves a content.json path string to a real `ImageMetadata` object, typically via `import.meta.glob`, and hands the resolved object to `Hero` or `SwipeGallery`. This keeps the shared layer decoupled from where images physically live, and it's what makes `astro:assets` optimization (responsive `srcset`, format conversion, and correct base-prefixed URLs) actually run — a bare string src bypasses that pipeline entirely.

## Adding a new shared component

1. Confirm it's actually shared: does a second vertical need this exact shape today, not hypothetically? If not, it belongs in `parts/` or a specific `templates/<vertical>/`, not here (docs/ENGINEERING.md, principle 7).
2. Give it a category-appropriate, business-agnostic name (`Testimonials`, not `LawyerReviews`).
3. Every visual value comes from a token. If the token you need doesn't exist yet, add it to `tokens.css` with a comment explaining what it controls, don't inline a value.
4. Every piece of copy comes from a prop, ultimately sourced from `content.json`.
5. Any link stays base-path-safe per the rule above — no hardcoded leading slash.
6. Update this file's prop-shape list.
7. Check it against the definition of done in `docs/ENGINEERING.md` before it's used in a template: zero JS unless it's a deliberate island, 44px minimum tap targets on anything interactive, real focus states, alt text required where relevant.
