# Copilot Instructions for the Gray Matter LLC Website

## Project overview

The official business website for **Gray Matter LLC**, a digital and
technology solutions company. The site serves two distinct buyers:

1. **Small businesses** — via a guided menu funnel on the homepage. Plain
   language only.
2. **Technical organizations** — via `cloud-consulting.html`. AWS,
   infrastructure, Terraform, DevOps, and contract language belongs here and
   nowhere else.

Never mix the two vocabularies.

`docs/ARCHITECTURE.md` is the authoritative description of the direction,
the funnel state model, the pricing rules, and the checkout rules. **Read it
before changing anything in the funnel.** `README.md` is the orientation and
file map.

## Tech stack

- **HTML5, CSS3, vanilla JavaScript** — zero frameworks, zero build tools,
  zero npm dependencies
- **Google Fonts** — Manrope (headings) + Inter (body) via CDN
- **Font Awesome 6** — icons via CDN
- Fully static; GitHub Pages, `main` branch, `/` root

## File structure

```
/
├── index.html              # home — hosts the guided menu funnel (#build-my-plan)
├── services.html  process.html  about.html  cloud-consulting.html
├── pricing.html   contact.html  agreement.html  portfolio.html  sops.html
├── industries.html  industries/   # nine industry pages
├── services/                      # ten service detail pages
├── css/
│   ├── style.css           # site styles and design tokens
│   └── funnel.css          # funnel styles (index.html and contact.html only)
├── js/
│   ├── data.js             # site content architecture
│   ├── main.js             # site behaviour
│   ├── funnel-data.js      # FUNNEL CONFIGURATION — edit the menu here
│   ├── funnel.js           # funnel behaviour and state machine
│   └── plan-intake.js      # receives a built plan on contact.html
└── docs/                   # ARCHITECTURE.md and screenshots
```

## Design system

Always use these custom properties:

| Token            | Value                       |
|------------------|-----------------------------|
| `--gm-paper`     | `#F7F4ED` (page background) |
| `--gm-ink`       | `#152238` (text, dark panels) |
| `--gm-blue`      | `#2F64D6` (accent)          |
| `--gm-sky`       | `#EDF1F8` (supporting surface, defined in `funnel.css`) |
| `--gm-mint`      | `#B8E1D0`                   |
| `--gm-gold`      | `#F3C969`                   |
| `--gm-coral`     | `#E9785D`                   |
| `--gm-line`      | `#D5DBE4` (borders)         |

Headings use Manrope; body copy uses Inter. Use the approved logo assets in
`assets/gray-matter-media-package/brand/approved-reference/` — never
generate or substitute another logo. Do not use a founder photograph; the
site uses the real founder credentials and neutral icon treatments.

## Code style

- **HTML**: semantic elements, 2-space indent. Navigation and footer markup
  is duplicated per page — that is the established pattern here. Change it
  with a scripted, uniform edit across every page, never by hand on one.
- **CSS**: use the tokens and existing utility classes before adding new
  ones. Mobile-first, 1 → 2 → 3/4 column progression. Site styles go in
  `css/style.css`; funnel styles go in `css/funnel.css`. Do not start a
  third stylesheet or a second design system.
- **JavaScript**: vanilla only. Site behaviour in `js/main.js`; funnel
  behaviour in `js/funnel.js`; funnel content in `js/funnel-data.js`.
  Keep configuration and behaviour separate — `funnel.js` must own no
  business copy. Use `addEventListener`, never inline handlers.
- Do **not** introduce build tools, package managers, frameworks, or a
  carousel library.

## Key behaviours to preserve

- **Guided menu funnel** (`[data-funnel]` on `index.html`): outcome →
  starting point → compatible options → plan drawer. State lives in memory,
  `sessionStorage['gm-funnel-v1']`, and the URL query string. Nothing
  reloads the page. Fast lanes (I Know What I Need, Recommend It for Me, My
  Plan, Start Now) stay available at every step.
- **Option compatibility**: `GM_FUNNEL.allows(planId, optionId)` is the only
  gate. Website options must never appear while configuring security or
  backup, including via a hand-edited URL.
- **Plan drawer**: modal — backdrop, `aria-modal`, focus loop, Escape to
  close. It is the only element allowed to loop focus.
- **Toggles**: `<button role="switch">` with accurate `aria-checked`; the
  checked state also draws a tick, never colour alone; every change is
  announced through the polite live region.
- **Swipe rails**: native `overflow-x` + CSS `scroll-snap`. Never call
  `preventDefault` on touch events, never add a gesture library. Arrow keys
  move focus between cards; visible prev/next buttons appear from 768px.
- **Responsive navbar**: hamburger on mobile, collapsible Solutions groups,
  scroll-activated background, active-link highlighting.
- **Contact form**: FormSubmit AJAX with required-field checks, email regex,
  and an explicit success confirmation — a failed request must never show a
  success state. The structured `plan_*` hidden fields are filled by
  `js/plan-intake.js`.
- **Configurators** on service pages: `[data-chipset="<collection>"]` renders
  chips from a `GM_DATA` collection; `[data-summary-for]` renders the live
  summary.
- **Reduced motion**, **44px touch targets**, **visible focus styles**, and
  **no horizontal page scroll** are requirements, not preferences.

## Content rules

- **Never invent business facts.** No client names, testimonials, metrics,
  prices, turnaround times, certifications, popularity claims, or guarantees
  that were not supplied.
- `pricing.html` is the only place that sets prices. The funnel reuses those
  exact published values and **never totals add-ons** — a total is a quote.
- Anything without approved public pricing shows
  *"Price confirmed after a quick fit check"* and
  *"Timeline confirmed after a quick fit check"*.
- Only present something as an option when it adds separate scope, extra
  volume, ongoing labour, hardware, or another system. Ordinary required
  website functionality is an inclusion, not an upsell. A function limited
  to one package must be described as belonging to that package.
- Use restrained guidance labels ("Recommended for your plan", "Good for
  teams", "Best for important files", "Optional ongoing protection"). Do not
  mark every option as recommended. "Most Complete" is allowed; "Best" and
  "Most Popular" are not, unless real sales data supports them.
- Avoid internal words in customer-facing copy: "selections",
  "configuration", "SKU", "integration architecture", "solution matrix".
- Example figures (the cost-cleanup bill, the checkup report card) must
  carry an "illustrative" label and a disclaimer.
- SEO-critical copy must also exist as static HTML, not only as
  JS-rendered content.
- Add new funnel content to `js/funnel-data.js`; add new site content to
  `js/data.js`. Components read from them.

## Payments

There is no payment processing in this repository. `GM_FUNNEL.checkout.links`
in `js/funnel-data.js` is the only place a real payment or deposit URL
belongs. Every entry ships empty; while empty, the primary action is
**Send My Plan** through the inquiry form. Never build a fake checkout,
never imply a payment was received, and never invent a Stripe, Square, or
PayPal link. Never present a checkbox as a legally verified electronic
signature — link to `agreement.html` instead.

## Testing and validation

There is no automated test suite in the repository. Validate changes by
serving the root and checking:

```bash
python3 -m http.server 8080
```

1. Every internal link and anchor still resolves.
2. Mobile navigation, the Solutions mega menu, and the contact form work.
3. A failed form request shows the error block, never success.
4. Each outcome leads to the correct starting points, and each starting
   point exposes only compatible options.
5. Toggles update the plan immediately and announce the change.
6. Back navigation and reload restore funnel state.
7. Keyboard-only users can complete the funnel.
8. No console errors; no horizontal page scroll at 320–1440px.
9. `prefers-reduced-motion` is respected.
10. Structural HTML changes pass the [W3C Validator](https://validator.w3.org/).

## Deployment

GitHub Pages (branch `main`, root `/`). `.nojekyll` prevents Jekyll
processing. Merging to `main` redeploys. No CI pipeline.
