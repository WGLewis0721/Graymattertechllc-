# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `office-1.png`, `office-2.png` | Our office (SwipeGallery) | 1200x900 | 4:3 |
| `attorney.png` | Your attorney (BioCard / AttorneyProfile) | 600x600 | 1:1, square crop, face centered |

This vertical is text-forward, not photo-forward (see README.md), so the image count stays modest on purpose: a hero, a small two-photo office gallery, and one attorney portrait. Add more `gallery` entries and matching files here only if a client genuinely wants a larger office gallery; there is no requirement to expand it.

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
