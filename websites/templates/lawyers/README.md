# lawyers template

A one-page site for a small law firm or solo practitioner. Text carries the page; the tone is authoritative and restrained, not bold or playful, and the layout is denser than the other verticals in this library on purpose.

## Conversion goal

Request a consultation. The primary CTA and the page's closing section both point at `ConsultationForm` (the shared `ContactForm` with its `selectField` set to practice area), which posts straight to Formspree. There is no outbound booking widget here the way there is for barbers-stylists: legal intake benefits from a short written description of the matter before any call happens, so the form is the whole conversion path.

## Unique parts

- `src/components/PracticeAreaGrid.astro` — a grid of practice area cards (name, short description, optional icon). Genuinely new: the shared `ServiceCard` requires a `price`, and law firms don't typically price-list practice areas the way a barbershop prices haircuts. Forcing a fake price string onto "Family Law" would be dishonest placeholder copy, so this vertical gets its own card shape instead.
- `src/components/CaseResultsList.astro` — a list of past case result summaries with a required, visible "results vary" disclaimer note above the list. Genuinely new: no other vertical needs this shape, and past-results disclaimers are a common source of attorney-advertising trouble, so the note is structurally required by the component's props, not left to page copy discipline.
- `src/components/DisclaimerBlock.astro` — a small, visually distinct block (muted color, smaller text, top border) for the attorney-advertising disclaimer. Genuinely new and deliberately small: it is a rendering slot for a single `text` prop, nothing else.

Everything else on the page is a shared component, reused as-is or just relabeled:

- "AttorneyProfile" is the shared `BioCard` — photo, name, title, bio, credentials (bar admissions, in this case).
- "ConsultationForm" is the shared `ContactForm`, with `selectField` set to practice area (label "Practice area", name `practice_area`, options pulled straight from `content.json`'s `practiceAreas`).
- The office gallery is the shared `SwipeGallery`, kept intentionally small (two photos) since this vertical is text-forward, not photo-forward.

## Pages

One page: `src/pages/index.astro`. Section order is practice areas first (the primary informational need for someone evaluating a firm), then attorney profile and case results to build trust, then testimonials, a small office gallery, hours, the consultation form, and the disclaimer near the bottom.

## Legal disclaimer: placeholder text, do not launch as-is

**The `disclaimer` field in `content.json`, and the `note` field inside `caseResults`, both ship with obvious placeholder language, not real legal copy.** Attorney advertising is regulated per-jurisdiction (per state bar in the US), and the specific required wording, formatting, and placement varies by where the firm is licensed and practices. Writing plausible-sounding disclaimer language ourselves would be actively misleading: a client could ship it believing it provides real protection when it does not.

Before this template is used for any real client:

1. The firm's own counsel (not this team) must supply the actual attorney-advertising disclaimer text for every jurisdiction the firm practices in.
2. That text replaces `content.json`'s `disclaimer` field in full.
3. The "results vary" note inside `content.json`'s `caseResults.note` should also be reviewed by the firm's counsel; the shipped wording is a reasonable general placeholder, not jurisdiction-verified language.
4. Do not remove `DisclaimerBlock` from `src/pages/index.astro` — only replace the text it renders.

## What to change first for a new client

1. `content.json` — business name, tagline, phone, address, hours, `services` (kept intentionally minimal, most firms don't publish per-matter pricing), `practiceAreas`, `attorney`, `caseResults`, gallery entries, testimonials, `formEndpoint` (a real Formspree endpoint), `map`, `seo`. Leave `launched: false` until the client has signed off (`docs/DEPLOYMENT.md`).
2. `content.json`'s `disclaimer` field and `caseResults.note` — see the section above. This is not optional cleanup, it blocks launch.
3. `theme.css` — only if this client's brand needs different defaults than the navy-and-charcoal baseline here. Most clients will instead just set `content.json`'s `theme.fontPairing` / `theme.colorScheme` (or an explicit `theme.colors` override) rather than touching this file.
4. `images/` — replace every placeholder photo. See `images/README.md` for exact dimensions per slot. EXIF-strip everything first (`docs/SECURITY.md`).
5. `src/pages/index.astro` — the nav labels and `ConsultationForm`'s practice area options are derived from `content.json`, so they update automatically once `practiceAreas` changes; no page edits should be needed for a typical new client.
