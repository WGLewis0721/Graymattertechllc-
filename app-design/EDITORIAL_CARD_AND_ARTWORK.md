# Editorial Cards and Replaceable Artwork

**Purpose:** Build distinctive, high-quality card collections while keeping information, accessibility, interactions and saved data truthful. Adapted from Spread's [editorial card art direction](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/planner/SPREAD_LIFE_CARD_ART_DIRECTION.md), [art handoff](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/planner/CLAUDE_EDITORIAL_ART_HANDOFF.md) and [UI kit](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/ui-kit/UI_KIT.md).

Spread's exact categories, stored hours, brand assets and changing Life-card implementation requirements are **not** universal templates. For professional **layered, editable production** of the underlying illustrations, source facts, photography and licensing, see [CREATIVE_ASSET_PRODUCTION.md](CREATIVE_ASSET_PRODUCTION.md), adapted from Arooma. For actual animated illustrations, use [ANIMATED_MEDIA_PIPELINE.md](ANIMATED_MEDIA_PIPELINE.md).

## A card family, not disconnected posters

Give every card a shared **anatomy**: shape, radius, interior grid, label position, readable live value, primary action, optional footer, consistent lighting and texture. Each card can have its own illustrated category identity without changing the layout grammar.

An editorial style can use matte fields, fine print texture, natural directional light, tactile shadows and a restrained object scene. Let the scene communicate category meaning. Do not recreate meaningless credit-card numbers, contactless chips or payment marks when the card is actually about time, work, health, school or another category.

### Separate five responsibilities

| Layer | Owns | Never owns |
| --- | --- | --- |
| Background artwork | Photo, illustration, texture, negative space | Dynamic labels, numbers, dates or fake UI |
| Component shell | Shape, typography, responsive clipping, safe text area | Business calculations or independent data store |
| Live projection | Correct current title, values, status, labels from authoritative data | Choosing artwork by hard-coded presentation logic |
| Interaction | Tap, focus, edit, keyboard/VoiceOver, gestures, transitions | Duplicated validation rules or store writes |
| Domain and persistence | Validated state changes, permissions, source-of-truth data | Animation frame or image rendering |

**Never ship a flattened AI-generated card mockup as the entire live UI.** Render every meaningful title, quantity, date and interaction as genuine native SwiftUI/React/HTML content.

## Image composition rules

- Put a meaningful subject in the art zone and reserve a **quiet text-safe zone** (often left or top, but adapt to the layout).
- Reserve space for optional live footer data instead of baking days, values or badges into pixels.
- Different categories share lighting, palette logic, artwork scale, paper/texture treatment and geometry.
- Long user-defined names, larger text and narrow phones have priority over decorative overlap.
- Test dark/light and increased-contrast treatments. Use an opaque or dimmed text zone when the image reduces legibility.
- Create an asset **registry keyed by category/ID**, with one fallback for missing/custom categories. Swapping an image should not touch data, gestures, state or navigation.
- Keep licensed original assets, export sizes, cropping guidance and source credits together.

### Reusable AI-art direction prompt

> Create a clean, text-free editorial artwork background for a [CATEGORY] card in a [PRODUCT / BRAND]. The larger card collection uses [PALETTE], [LIGHTING], [TEXTURE], [MATERIAL], [ILLUSTRATION STYLE] and a consistent object scale. Show [SCENE/OBJECTS], weighted toward [ART ZONE], with negative space at [TEXT-SAFE ZONE] for **real UI labels and controls added later**. Respect responsive cropping. Output [SIZE/FORMAT]. Do not draw words, numbers, dates, payment chips, logos, navigation, buttons, or watermarks.

This produces a visual asset, **not** a data-bearing UI. Marketing images must still be approved and licensed under [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md).

## Acceptance

- [ ] One coherent card grammar with distinct but related illustration identities.
- [ ] Card art is clean, text-free and replaceable independently.
- [ ] Real values, dates and category names come from the app's authoritative data.
- [ ] Missing art, dark mode, small phones, tablets, long names and large text work.
- [ ] The art layer does not intercept touch or fake a control.
- [ ] No new background animation loop was introduced merely to add polish.
- [ ] Asset licensing, origin and optimized responsive export are recorded.
- [ ] Real app screenshots and interactive evidence, not only image concepts, are reviewed.

Related: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [TACTILE_MOTION_AND_DEVICE_QA.md](TACTILE_MOTION_AND_DEVICE_QA.md).
