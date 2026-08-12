# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `gallery-1.png` through `gallery-3.png` | "Spaces we've cared for" (SwipeGallery) | 1200x900 | 4:3 |
| `ba-kitchen-before.png` / `ba-kitchen-after.png` | BeforeAfterSlider | 1200x900 | 4:3, same framing before and after |
| `ba-bathroom-before.png` / `ba-bathroom-after.png` | BeforeAfterSlider | 1200x900 | 4:3, same framing before and after |
| `ba-bedroom-before.png` / `ba-bedroom-after.png` | BeforeAfterSlider | 1200x900 | 4:3, same framing before and after |

Minimum 3 gallery photos, more is fine (just add more `gallery` entries in content.json and matching files here). Each `beforeAfter` pair in content.json needs a matching before/after file here; add more pairs the same way (2-4 is typical). For a real client, shoot the before and after from the same angle and distance so the comparison actually reads as the same space.

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
