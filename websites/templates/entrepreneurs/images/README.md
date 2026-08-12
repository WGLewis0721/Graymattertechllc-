# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `story-portrait.png` | StoryPanel | 800x1000 | 4:5, portrait crop, founder facing camera |
| `sourdough.png`, `babka.png`, `galette.png`, `granola.png`, `mealbox.png`, `cookiebox.png` | ProductShelf (shared ItemShowcase) | 1200x900 | 4:3, product photographed on its own, consistent lighting across the set |
| `kitchen-1.png` through `kitchen-4.png` | Gallery (shared SwipeGallery) | 1200x900 | 4:3, behind the scenes: prep, packaging, pickup, market |

Minimum 4 gallery photos, more is fine (just add more `gallery` entries in content.json and matching files here). Minimum 4 products for ProductShelf to read as a real shelf, 6 is a comfortable maximum before the grid gets crowded on mobile; add more `products` entries and matching files here if a client's real catalog is bigger.

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
