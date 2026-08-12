# Shared components — the joint contract

This folder is the frame. Every vertical template composes pages out of these components plus, occasionally, a `parts/` component. Read `docs/PHILOSOPHY.md` and `docs/ENGINEERING.md` before adding anything here — this file documents the mechanical contract those docs describe, so a new part snaps in correctly.

## The rule

A component in this folder never contains a hardcoded color, font name, or business-specific string. If you can `grep -E "#[0-9a-fA-F]{3,6}"` a `.astro` file in this folder and get a hit outside a comment, that's a bug. Every visual value is a `var(--token)` from `src/styles/tokens.css`. Every piece of copy is a prop.

## Prop shape by category

These shapes are fixed across every vertical. A barber template and a lawyer template both call `Hero` with exactly these props, in this order of relevance. If a vertical needs different behavior, the fix is a new optional prop with a safe default on the existing component, never a forked copy.

- **Header** — `businessName: string`, `nav?: {label, href}[]`, `ctaLabel?: string`, `ctaHref?: string`.
- **Footer** — `businessName: string`, `phone: string`, `email?: string`, `address?: string`, `social?: {instagram?, facebook?, google?, yelp?}`.
- **Hero** — `heading: string`, `subheading?: string`, `image: ImageMetadata`, `imageAlt: string`, `ctaLabel?: string`, `ctaHref?: string`.
- **Section** — `id?: string`, `heading?: string`, `headingLevel?: 'h2'|'h3'`, `background?: 'default'|'alt'`, `width?: 'sm'|'md'|'lg'`, default slot for content.
- **CTAButton** — `label: string`, `href: string`, `variant?: 'primary'|'accent'|'outline'`, `type?: 'link'|'submit'`.
- **ContactForm** — `endpoint: string`, `submitLabel?: string`, `redirectTo?: string`. Field set (name, phone-or-email, message, honeypot) is fixed; it is not a prop, because varying the field set per vertical would break the "no JS to submit" guarantee in unpredictable ways. A vertical that genuinely needs different fields needs a different form component in `parts/`.
- **SwipeGallery** — `images: {image: ImageMetadata, alt: string}[]`, `id: string` (required — used to namespace the anchor-based position indicator when a page has more than one gallery), `aspectRatio?: string`.
- **ServiceCard** — `name: string`, `price: string`, `duration?: string`, `description?: string`. Renders as `<li>`; the caller supplies the wrapping `<ul>`.
- **TestimonialStrip** — `testimonials: {quote, author, role?}[]`.
- **HoursTable** — `hours: {day, open: string|null, close: string|null}[]`.
- **MapEmbed** — `embedUrl: string`, `title: string`. The only place a raw third-party iframe is allowed (docs/SECURITY.md).
- **StickyCallBar** — `phone: string`, `address?: string`. Rendered once, by `BaseLayout`, not by individual pages — this is global chrome, not a page section.

## Why images are always `ImageMetadata`, never a bare src string

`content.json` stores image references as path strings (see docs/ARCHITECTURE.md's content.json contract). Shared components never resolve those strings themselves — that would mean baking a specific file layout assumption into the frame. Instead, the page (which knows its own `src/images/` layout) resolves a content.json path string to a real `ImageMetadata` object, typically via `import.meta.glob`, and hands the resolved object to `Hero` or `SwipeGallery`. This keeps the shared layer decoupled from where images physically live, and it's what makes `astro:assets` optimization (responsive `srcset`, format conversion) actually run — a bare string src bypasses that pipeline entirely.

## Adding a new shared component

1. Confirm it's actually shared: does a second vertical need this exact shape today, not hypothetically? If not, it belongs in `parts/` or a specific `templates/<vertical>/`, not here (docs/ENGINEERING.md, principle 7).
2. Give it a category-appropriate, business-agnostic name (`Testimonials`, not `LawyerReviews`).
3. Every visual value comes from a token. If the token you need doesn't exist yet, add it to `tokens.css` with a comment explaining what it controls, don't inline a value.
4. Every piece of copy comes from a prop, ultimately sourced from `content.json`.
5. Update this file's prop-shape list.
6. Check it against the definition of done in `docs/ENGINEERING.md` before it's used in a template: zero JS unless it's a deliberate island, 44px minimum tap targets on anything interactive, real focus states, alt text required where relevant.
