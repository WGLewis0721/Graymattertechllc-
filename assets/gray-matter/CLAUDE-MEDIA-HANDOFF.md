# Claude Code Media Handoff

## Keep
- Existing seven-page static/GitHub Pages architecture, navigation, contact form behavior, service/pricing copy that remains accurate, FAQ and agreement/SOP content.
- Direct founder-led voice and Cloud Consulting as a distinct secondary lane.

## Replace / remove
- Replace the existing uniform `#0f172a/#1e293b` dark/teal template treatment with paper/ink tokens.
- Replace the current text-only brand treatment with `brand/gm-logo-horizontal.svg`. The approved symbol is the supplied rounded monoline GM brain: one continuous deep-ink line system forms the brain, G, and M. Use `brand/gm-logo-stacked.svg` for centered/narrow placements and `icons/gm-mark.svg` only when a full lockup will not fit. Do not redraw or reinterpret the symbol.
- Replace `picsum.photos` portfolio images immediately. They are placeholders and must not remain as portfolio proof.
- Replace Font Awesome service icons with the supplied outcome-led SVGs.

## Add in this order
1. Add token variables and font imports; establish paper page backgrounds, ink type, white cards.
2. Homepage: use `hero/gm-hero-desktop.svg` in a right-side `<img>` next to HTML hero copy; use `mobile/gm-hero-mobile.svg` below 767px. Load eager/high priority. Do not use it as a cover background.
3. Add an “What do you want your business to do?” HTML section. Use individual `outcomes/` SVGs as decorative card illustrations; card labels remain HTML.
4. Rebuild services around the nine offers with `services/` icons. Use 3-up grid (1024+), 2-up (768–1023), 1-up below.
5. Add `technology-checkup/gm-tech-checkup.svg` to Checkup entry-product section.
6. Add `packages/gm-package-system.svg` above package cards as an explanatory visual. Package copy, included features, add-on controls and selected state must be real HTML. Add text/icon state changes in addition to color.
7. Add process preview to home and link to a dedicated Process page. Use horizontal desktop roadmap `process/gm-tech-fit-full-desktop.svg`; swap to mobile file at 767px. Keep the 10-step explanation as an ordered HTML list directly after it.
8. Use `consulting/gm-advanced-consulting.svg` only on Cloud Consulting/contract pages.
9. Use portfolio frames only as templates around genuine screenshots. Remove conceptual project names if they cannot be documented as actual work.

## Loading / accessibility
- Eager only: desktop/mobile hero, wordmark (if used), favicon.
- `loading="lazy"`: service icons after first viewport, outcomes, process, checkup, patterns, portfolio frames.
- Decorative patterns: `alt=""`; service/hero/checkup/process assets use the manifest alt text. Never make essential copy image-only.
- Use `favicons/favicon.svg`, plus the included 32px, 180px, 192px and 512px PNG derivatives in the document head and web-app metadata.

## GitHub Pages compatibility
Use relative URLs such as `assets/gray-matter-media-package/...`; do not require a bundler. SVGs are standalone and safe as `<img>`. Use CSS `@media` for asset swapping. Avoid JS dependency for the base visual system.

## Approved logo — source of truth (mandatory)

**Do not redraw, trace, regenerate, convert, or substitute the logo.** Previous implementation attempts failed because they treated the logo as an idea rather than placing the approved artwork.

Use these exact, reference-derived PNG assets. They were cut directly from the client-approved identity board and preserve the exact approved geometry, wordmark, rule, tracking, colors, and GM brain mark:

- Header/footer and primary desktop lockup: `brand/approved-reference/gm-logo-horizontal-approved.png`
- Narrow/centered placement: `brand/approved-reference/gm-logo-stacked-approved.png`
- Icon-only contexts at 72px+: `brand/approved-reference/gm-mark-approved.png`
- Browser icon: `brand/approved-reference/gm-favicon-approved-32.png`
- Apple touch icon: `brand/approved-reference/gm-apple-touch-approved-180.png`
- PWA/app icon: `brand/approved-reference/gm-icon-approved-192.png` or `brand/approved-reference/gm-favicon-approved-512.png`

Do **not** use any other `gm-logo-*`, `gm-mark-*`, or `favicons/*` identity file in this package. Those legacy files are superseded for web implementation.

Implementation requirements:

```html
<!-- desktop header: use this exact file, not recreated HTML/SVG -->
<a class="site-logo" href="index.html" aria-label="Gray Matter home">
  <img src="assets/gray-matter-media-package/brand/approved-reference/gm-logo-horizontal-approved.png"
       width="1132" height="270"
       alt="Gray Matter — Digital and Technology Solutions">
</a>
```

```css
.site-logo img { display: block; width: clamp(178px, 20vw, 270px); height: auto; }
@media (max-width: 560px) {
  .site-logo img { width: 188px; }
}
```

Never place the full identity-board screenshot on the public site. The full board remains a reference for review only. Do not recreate the mark with HTML letters, substitute a generic brain, split the symbol into colored halves, fill the hemispheres, add circuits, alter the blue rule, or change the wordmark/descriptive line spacing.
