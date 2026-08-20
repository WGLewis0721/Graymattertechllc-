# templates/

Nine complete, standalone Astro projects, one per vertical, each built by copying the shared frame (`src/components/shared/`, `src/layouts/BaseLayout.astro`, `src/lib/`, `src/schemas/`, `src/styles/`, and the GitHub Pages plumbing) and layering a distinct theme, page structure, content, and a small number of genuinely new components on top. See `docs/ARCHITECTURE.md` for the shared/vertical/theme split and `scripts/new-client.sh` for how a template becomes a client project.

None of these are vertical-agnostic reskins of each other. Section order, density, image treatment, and type scale all differ by design — read each template's own `README.md` for the specifics.

## At a glance

| Vertical | Conversion goal | Unique parts (new) | Reused shared parts, relabeled | Pages | Build size |
| --- | --- | --- | --- | --- | --- |
| `barbers-stylists` | Book an appointment | `BookingWidget`, `StylistRoster` | CutGallery = `SwipeGallery`; PriceList = `ServiceCard` grid | 1 | 65,263 B |
| `coaches-trainers` | Book a free intro session | `ScheduleStrip` | ProgramGrid = `ServiceCard` grid; TransformationSlider = `BeforeAfterSlider` | 1 | 90,524 B |
| `entrepreneurs` | Contact or buy | `OfferBlock`, `StoryPanel`, `LinkHub` | ProductShelf = `ItemShowcase` | 1 | 89,689 B |
| `real-estate-agents` | Request a valuation or schedule a showing | `ListingCard`, `NeighborhoodStrip` | ListingGrid = page-level grid of `ListingCard`; ValuationCTA = `Section` + `CTAButton`; AgentBio = `BioCard` | 1 | 91,721 B |
| `lawyers` | Request a consultation | `PracticeAreaGrid`, `CaseResultsList`, `DisclaimerBlock` | AttorneyProfile = `BioCard`; ConsultationForm = `ContactForm` + `selectField` | 1 | 51,843 B |
| `contractors` | Request a quote | `LicenseBadgeStrip` | ServiceAreaMap = `MapEmbed`; ProjectGallery = `BeforeAfterSlider`; QuoteRequestForm = `ContactForm` + `selectField`; EmergencyCallBar = `StickyCallBar` | 1 | 65,985 B |
| `food-trucks-and-services` | Find today's location, or book catering | `LocationTracker` | MenuBoard = `ItemShowcase`; EventBookingCTA = `ContactForm` + `selectField` | 1 | 95,500 B |
| `hospitality-and-cleaning-services` | Request a cleaning quote | `ServiceChecklist`, `AvailabilityBadge` | Before/after showcase = `BeforeAfterSlider`; quote form = `ContactForm` + `selectField` | 1 | 84,464 B |
| `detailers` | Book a detail, or request a quote by vehicle size | `VehicleSizeTable` | Results slider = `BeforeAfterSlider`; add-ons = `ServiceCard` grid; quote form = `ContactForm` + `selectField` fed the same `vehicleSizes` array | 1 | 93,761 B |

Every build size is a full `npm run build` output (HTML, CSS, every responsive image variant, `.nojekyll`, `robots.txt`) with the demo `content.json`, well inside the 100KB budget in `docs/ENGINEERING.md` — `food-trucks-and-services` and `detailers` are the closest at ~94-96KB, worth watching once a client's real photography replaces the synthetic placeholders. All nine report 0 errors/warnings/hints from `astro check` and pass a non-root-base GitHub Pages build (see below) with zero broken links.

Every vertical is single-page by design. None of these businesses need more than one scrollable page of anchor sections; adding pages a solo operator would never fill was explicitly out of scope.

## Why only 14 new components across 9 verticals

The task sheet for the first pass listed roughly 30 "unique parts" across the original eight verticals. Most of them turned out to be an existing shared component doing its job under a different label, or two-plus verticals independently wanting the identical shape. Three shared components (`BeforeAfterSlider`, `BioCard`, `ItemShowcase`) and one shared extension (`ContactForm`'s optional `selectField`) were added to the frame itself, each because a second (or third) vertical needed the exact same shape — the explicit trigger condition in `docs/ENGINEERING.md`, principle 7, and the exception this task's brief itself granted. See `src/components/shared/README.md` for the full reasoning and prop contracts. What's left, genuinely new per vertical, is small on purpose:

- `barbers-stylists`: `BookingWidget`, `StylistRoster`
- `coaches-trainers`: `ScheduleStrip`
- `entrepreneurs`: `OfferBlock`, `StoryPanel`, `LinkHub`
- `real-estate-agents`: `ListingCard`, `NeighborhoodStrip`
- `lawyers`: `PracticeAreaGrid`, `CaseResultsList`, `DisclaimerBlock`
- `contractors`: `LicenseBadgeStrip`
- `food-trucks-and-services`: `LocationTracker`
- `hospitality-and-cleaning-services`: `ServiceChecklist`, `AvailabilityBadge`
- `detailers`: `VehicleSizeTable`

## GitHub Pages compatibility, verified per template

Every template was independently rebuilt with `SITE_URL=https://wglewis0721.github.io BASE_PATH=/<vertical>` (simulating a `username.github.io/<repo>` deployment with no custom domain) and checked for:

- The build succeeding at all.
- Zero `src=`/`href=` attributes starting with a bare `/` that aren't prefixed with the configured base (`grep -oE '(src|href)="/[^"]*"' dist/index.html | grep -v '/<vertical>'` returns nothing).
- `dist/.nojekyll` present.
- The canonical URL and `og:url` correctly reflecting the base-prefixed path.

All nine passed clean. No template failed. Also confirmed across all nine: no `_headers` file anywhere in the source tree (the only hits are inside `node_modules/prismjs`, an unrelated third-party file, gitignored), every `astro.config.mjs` sets `output: 'static'` with no adapter, and nothing in any template depends on SSR or custom HTTP headers — consistent with `docs/SECURITY.md`'s "no-headers host" posture.

## Building a template in place

`npm ci && npm run build` inside a template folder needs `websites/node_modules` to exist as well as the template's own. The build resolves tsconfigs by walking up the tree, reaches `websites/tsconfig.json`, and fails with `Tsconfig not found astro/tsconfigs/strict` if `astro` isn't installed at that level. Run `npm ci` once in `websites/` first. A real client project never hits this: `scripts/new-client.sh` copies the template out to a standalone repo where there is no parent tsconfig to find.

## What each template still needs before it's a real client site

None of these are launch-ready. Every one ships `launched: false`, a fictional business in `content.json`, and synthetic solid-color placeholder photos (real client photos don't exist yet at the template stage). Spinning one up for an actual client means running `scripts/new-client.sh`, then working through `docs/INTAKE.md` and each template's own README, "what to change first for a new client".
