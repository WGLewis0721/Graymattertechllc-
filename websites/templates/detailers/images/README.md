# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `ba-paint-before.png` / `ba-paint-after.png` | BeforeAfterSlider | 1200x900 | 4:3, same framing before and after |
| `ba-interior-before.png` / `ba-interior-after.png` | BeforeAfterSlider | 1200x900 | 4:3, same framing before and after |
| `ba-wheel-before.png` / `ba-wheel-after.png` | BeforeAfterSlider | 1200x900 | 4:3, same framing before and after |
| `gallery-1.png` through `gallery-3.png` | "Recent work" (SwipeGallery) | 1200x900 | 4:3 |

Minimum 3 gallery photos, more is fine (add more `gallery` entries in content.json and matching files here). Each `beforeAfter` pair in content.json needs a matching before/after file here; 2-4 pairs is typical.

## Shooting the before/after pairs

This is the section of the page a detailing client is actually judged on, and it's the easiest one to get wrong:

- **Same angle, same distance, same lens.** Mark where you stood. A comparison shot from two different positions reads as two different cars and kills the effect.
- **Same lighting.** Direct sun for both, or shade for both, never one of each. Swirl marks are only visible in hard light, so paint-correction pairs should be shot in it — that's the point.
- **Don't stage the "before" worse than it was.** Adding dirt for the photo is fabricating a result. The transformation is real; let it be.
- **Watch for reflections.** A detailed panel is a mirror. Check the "after" frame for you, your phone, and anything else you don't want published.
- **Get the customer's permission for the plate**, or crop/blur it. A license plate is identifying information about someone who did not agree to appear on a website.

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder — vehicle photos routinely carry GPS coordinates of the customer's home or workplace.
