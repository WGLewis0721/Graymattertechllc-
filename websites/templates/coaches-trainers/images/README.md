# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `floor-1.png` through `floor-4.png` | Training floor gallery (SwipeGallery) | 1200x900 | 4:3 |
| `transform-1-before.png` / `transform-1-after.png` | Transformations (BeforeAfterSlider) | 1200x900 | 4:3, same crop/angle for before and after so the comparison reads cleanly |
| `transform-2-before.png` / `transform-2-after.png` | Transformations (BeforeAfterSlider) | 1200x900 | 4:3, same crop/angle for before and after |
| `transform-3-before.png` / `transform-3-after.png` | Transformations (BeforeAfterSlider) | 1200x900 | 4:3, same crop/angle for before and after |

Minimum 3 before/after pairs, up to 4 is fine (just add more `transformations` entries in content.json and matching files here). Minimum 4 training-floor photos for the gallery, more is fine.

Every image needs real alt text in content.json before this stops being a demo. Before/after pairs additionally need client sign-off to use their photo and likeness at all, on top of the EXIF strip. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
