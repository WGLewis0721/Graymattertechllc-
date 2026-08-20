# Gray Matter — Digital & Technology Solutions

A complete multi-page static business website for **Gray Matter**, a digital and technology solutions company offering web design, booking systems, e-commerce, automation, and cloud, security &amp; DevOps consulting (including 1099 contract engagements).

https://wglewis0721.github.io/Graymattertechllc-/

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero, outcome chooser, recommendation panel, recognition callouts, before/after, service menu, Tech Fit preview, industries, CTA |
| `services.html` | Services — the nine productized services as a problem → outcome menu |
| `industries.html` | Who We Help — index of the industry pages |
| `industries/*.html` | Six industry pages (barbers & salons, detailers, contractors, real estate, appointment businesses, professional services) |
| `process.html` | How We Work — the 10-stage "Tech Fit to Completion" roadmap, ends in a business-inquiry CTA |
| `cloud-consulting.html` | Cloud Consulting — cloud infrastructure, security, DevOps, and technology consulting for 1099/contract engagements |
| `portfolio.html` | Work — case-study system, rendered from `js/data.js`; honest empty state until real projects are published |
| `pricing.html` | Pricing — three-tier web plans, add-ons, FAQ accordion |
| `contact.html` | Contact — goal-first inquiry form that accepts `?service=`, `?goal=`, and `?wants=` context |
| `agreement.html` | Client Agreement — full 8-section service terms document |
| `sops.html` | Standard Operating Procedures — documented client-journey processes |

## Tech Stack

- **Pure HTML5, CSS3, Vanilla JavaScript** — zero frameworks, zero build tools
- **Google Fonts** — Syne (headings) + DM Sans (body) via CDN
- **Font Awesome 6** — icons via CDN
- Runs as fully static files — open any `.html` file in a browser

## File Structure

```
/
├── index.html
├── services.html
├── process.html
├── cloud-consulting.html
├── portfolio.html
├── pricing.html
├── contact.html
├── agreement.html
├── sops.html
├── robots.txt
├── sitemap.xml
├── industries.html
├── industries/
│   └── (six industry pages)
├── css/
│   └── style.css      # single stylesheet
└── js/
    ├── data.js        # content architecture (services, outcomes, industries, …)
    └── main.js        # all behaviour
```

## Design System

| Token | Value |
|-------|-------|
| Paper (page background) | `#F7F4ED` |
| Ink (text / dark panels) | `#152238` |
| Blue (accent) | `#2F64D6` |
| Mint | `#B8E1D0` |
| Gold | `#F3C969` |
| Coral | `#E9785D` |
| Line (borders) | `#D5DBE4` |

Headings use Manrope, body copy uses Inter. Card radius `20px`, control radius `12px`, panel radius `28px`.

## Content Architecture

`js/data.js` is the single source of truth for reusable business information:

| Collection | Drives |
|------------|--------|
| `services` | recommendation cards, related-service blocks |
| `outcomes` | homepage outcome chooser, inquiry-form goal chips |
| `websiteActions` | the Business Websites configurator |
| `automationTasks` | the Workflow Automation task picker |
| `opportunityTargets` / `opportunityAreas` | the Opportunity Finder targeting |
| `industries` | industry cards |
| `caseStudies` | the Work page (empty until real projects exist) |
| `packages` | website package tiers |

Add an outcome, service, or industry by editing that file — the components read
from it and need no markup changes. Pages in a subdirectory set
`<body data-root="../">` so `GM_DATA.url()` resolves links correctly.

SEO-critical copy (the service menu, the outcome cards) is **also** written as
static HTML so it is crawlable and works without JavaScript; the data-driven
components enhance it rather than replace it.

## Features

- **Outcome chooser** — pick a business goal, matching services are revealed in place
- **Configurators** — website actions, automation tasks, and opportunity targeting, each with a live summary
- **CTA context routing** — every call to action carries `?service=` and `?goal=` into the inquiry form
- **Before → After component** — side-by-side by default, with an optional Before/After/Both toggle
- **Solutions mega menu** organized by customer goal, with collapsible groups on mobile
- **Persistent mobile CTA** that retreats over the footer
- **Scroll-triggered fade-up animations** via IntersectionObserver
- **FAQ accordion** — single-open accordion on the pricing page
- **Contact form validation** — required field checks, email regex validation, and animated success message
- Mobile-first responsive grid system (1 → 2 → 3/4 columns)
- Full `prefers-reduced-motion` support

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose `main` (or your working branch) and `/ (root)` as the folder
5. Click **Save** — your site will be live at `https://<username>.github.io/<repo-name>/`

No build step required. Simply open `index.html` in your browser or serve locally:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

## Customization Checklist

- [ ] Replace `hello@yourdomainhere.com` with your real email address
- [ ] Update social media `href="#"` links with real profile URLs
- [ ] Add real case studies to `caseStudies` in `js/data.js` (client permission required)
- [ ] Update the footer copyright year if needed
- [ ] Replace the contact form with a real form backend (Formspree, Netlify Forms, etc.)
- [ ] Update cloud consulting service descriptions with specific certifications or tooling expertise
