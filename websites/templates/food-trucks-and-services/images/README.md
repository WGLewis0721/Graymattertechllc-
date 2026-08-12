# images/

Drop a real client's EXIF-stripped photos here (see `docs/SECURITY.md` and `docs/INTAKE.md` in the template library). The placeholder images currently in this folder are synthetic solid-color stand-ins so this template builds and demos on its own; replace every one of them for a real client, do not build on top of them.

## Required images and dimensions

| File referenced in content.json | Used by | Minimum size | Aspect ratio |
| --- | --- | --- | --- |
| `hero.png` (or `.jpg`) | Hero | 1600x900 | 16:9, wide, subject off-center so headline text has room |
| `vibe-1.png` through `vibe-4.png` | Golden hour vibe gallery (SwipeGallery) | 1200x900 | 4:3 |
| `menu-al-pastor.png`, `menu-baja-fish.png`, `menu-carne-asada.png`, `menu-mushroom-poblano.png`, `menu-elote.png`, `menu-nachos.png`, `menu-horchata.png`, `menu-churros.png` | MenuBoard (shared ItemShowcase) | 1200x900 | 4:3, one photo per menu item |

Minimum 4 vibe photos, more is fine (just add more `gallery` entries in content.json and matching files here). Exactly one photo per menu item, so add or remove a matching file whenever `menu` in content.json changes.

Every image needs real alt text in content.json before this stops being a demo. See `docs/SECURITY.md` for the mandatory EXIF strip step before any real client photo goes in this folder.
