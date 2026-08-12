# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic gradient stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `listing-1.png` through `listing-4.png` | ListingCard grid (Listings section) | 1200x900 | 4:3, exterior shot, well-lit, no people |
| `neighborhood-1.png` through `neighborhood-3.png` | NeighborhoodStrip | 1200x800 | 3:2, a representative street or landmark shot per neighborhood |
| `agent.png` | Agent bio (shared BioCard) | 600x600 | 1:1, square crop, professional headshot, face centered |
| `gallery-1.png` through `gallery-4.png` | Gallery (shared SwipeGallery) | 1200x900 | 4:3, lifestyle shots: open houses, closings, signage |

This vertical is image-heavy by design (listings are the hero of the page), so it needs more photo slots than most templates in this library. This demo ships with 4 listings and 3 neighborhoods (the low end of the recommended 4-6 / 3-4 ranges) specifically to stay inside the library's performance budget; a real client with more inventory can add more `listings`/`neighborhoods` entries in content.json and matching files here, but should watch `dist` size (`docs/ENGINEERING.md`) when doing so. Minimum 4 for `gallery` (from the base schema).

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
