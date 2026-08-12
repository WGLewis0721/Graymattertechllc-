# Claude Code Media Handoff

## Keep
- Existing seven-page static/GitHub Pages architecture, navigation, contact form behavior, service/pricing copy that remains accurate, FAQ and agreement/SOP content.
- Direct founder-led voice and Cloud Consulting as a distinct secondary lane.

## Replace / remove
- Replace the existing uniform `#0f172a/#1e293b` dark/teal template treatment with paper/ink tokens.
- Replace the current text-only brand treatment with `brand/gm-wordmark.svg`. The approved symbol is the GM brain mark: the blue left fold is a G and the ink right fold is an M. Use `icons/gm-mark.svg` only when the full wordmark will not fit.
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
