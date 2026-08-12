# Engineering Principles

## The seven principles

1. **Frame stability.** Shared components never hardcode a color, font, or business-specific string. If a component in `shared/` contains a literal hex value, a font name, or a business name, that's a bug. Every visual and content value comes in as a prop or a CSS custom property.

2. **Uniform joints.** Every component of a given category takes the same shaped props across every vertical, so parts snap in interchangeably. A `Gallery` used in the barber template and a `Gallery` used in the lawyer template take identical props. If a vertical needs a `Gallery` to do something another vertical's `Gallery` doesn't, that's a new optional prop with a safe default, not a divergent copy of the component.

3. **Theme last.** Visual identity is applied only through CSS custom properties fed by `content.json`. Changing a client's look (color, font pairing) must never require editing component code, only theme token values.

4. **Content is data.** All copy, contact info, hours, and image paths live in `content.json`. No copy in `.astro` files. If you find a string of client-facing text hardcoded in a component or page, move it to `content.json` before shipping.

5. **Progressive enhancement.** Every page works with JS disabled. Islands add polish (a smoother gallery interaction, a form validation nicety), never core function. A user with JS off can still see the content, read the hours, call the number, and submit the contact form.

6. **Accessibility is not optional.** Semantic HTML throughout (`<nav>`, `<main>`, `<button>`, real headings in order). Real focus states on every interactive element, visible, not suppressed. Alt text is a required field in the content schema for every image, not an afterthought filled in during QA. Contrast is checked against the actual theme tokens a client picks, not just the default theme.

7. **Delete before you abstract.** Fifteen templates that share too little is better than a framework nobody can read. If a new vertical need doesn't clearly generalize, implement it locally in that vertical's template first. Promote it to `shared/` only once a second vertical needs the same thing and the shape is proven. Don't build the abstraction speculatively.

## Performance budget

These are hard limits, not targets to approach:

- **Under 100KB total transfer** on initial mobile load, images included.
- **Zero JS** on any page that has no interactive island. If a page has no form, no gallery interaction requiring JS, and no other island, it ships no JS bundle.
- **Lighthouse mobile: 95+ performance, 100 accessibility.** Run against every template before it's added to the library, and against every client site before production deploy.
- **Largest Contentful Paint under 1.5s** on simulated 4G.

A change that would blow any of these limits does not ship. If a feature request can't fit the budget, the answer is a lighter implementation of the same feature, not a budget exception.

## Naming conventions

- Shared components: PascalCase, noun-first, describing what they are not what vertical uses them. `Hero.astro`, `Gallery.astro`, `ContactForm.astro`, not `BarberHero.astro`.
- Vertical-specific parts: PascalCase, descriptive of function. `BookingWidget.astro`, `BeforeAfterSlider.astro`.
- CSS custom properties: kebab-case, namespaced by category. `--color-primary`, `--color-accent`, `--font-heading`, `--font-body`, `--space-md`. Never a bare `--primary` with no category prefix.
- `content.json` keys: camelCase, matching the shape documented in `ARCHITECTURE.md`.
- Client project slugs: lowercase kebab-case business name, e.g. `fade-city-barbershop`.

## Definition of done for a client site

A client site is not done until every item below is true:

- [ ] `content.json` fully populated, no placeholder text or Lorem Ipsum remaining anywhere.
- [ ] All images processed: EXIF-stripped, resized and compressed for their placement, real alt text written per image.
- [ ] Theme tokens set to the client's chosen font pairing and color, applied via `theme.css`, no component code edited to achieve the look.
- [ ] Site builds clean (`npm run build`), no console errors or warnings.
- [ ] Site fully usable with JS disabled: content visible, phone number tappable, form present and submittable.
- [ ] Lighthouse mobile run: 95+ performance, 100 accessibility, confirmed against the actual deployed preview, not just local dev.
- [ ] Total initial mobile transfer under 100KB, verified in the network panel against the preview deploy.
- [ ] `_headers` file present in the build output and confirmed live on the preview deploy (check response headers).
- [ ] Contact form tested end to end: honeypot present, submission reaches the provider, confirmation message shown, no input echoed back into the page.
- [ ] All tap targets checked at 44px minimum, especially phone number links, nav items, and form buttons.
- [ ] Client has reviewed the preview deploy and signed off, or the single included revision round is complete.
