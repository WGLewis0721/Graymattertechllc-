# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `before-roof.png` / `after-roof.png` | ProjectGallery (BeforeAfterSlider), first pair | 1200x900 | 4:3, matched framing between before and after |
| `before-kitchen.png` / `after-kitchen.png` | ProjectGallery (BeforeAfterSlider), second pair | 1200x900 | 4:3, matched framing between before and after |
| `before-bath.png` / `after-bath.png` | ProjectGallery (BeforeAfterSlider), third pair | 1200x900 | 4:3, matched framing between before and after |

Minimum 2 before/after pairs, more is fine (just add more `beforeAfter` entries in content.json and matching `before-*`/`after-*` files here). Shoot each before/after pair from the same angle and distance so the comparison reads clearly.

`content.json`'s `gallery` field is intentionally empty for this template — project photography lives entirely in the `beforeAfter` before/after pairs above, so there is no separate plain photo swipe gallery to fill in.

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
