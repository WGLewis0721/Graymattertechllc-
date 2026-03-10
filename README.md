# WD Digital Solutions — Business Website

A complete multi-page static business website for **WD Digital Solutions**, a web design and development freelance brand serving coaches, trainers, barbers, and entrepreneurs.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero, proof bar, services overview, featured work, CTA |
| `services.html` | Services — detailed breakdown of all five service offerings |
| `portfolio.html` | Portfolio — filterable project grid with category filters |
| `pricing.html` | Pricing — three-tier plans, add-ons, FAQ accordion |
| `contact.html` | Contact — project inquiry form with validation, contact sidebar |
| `agreement.html` | Client Agreement — full 8-section service terms document |

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
├── portfolio.html
├── pricing.html
├── contact.html
├── agreement.html
├── css/
│   └── style.css
└── js/
    └── main.js
```

## Design System

| Token | Value |
|-------|-------|
| Base background | `#0f172a` (deep navy) |
| Surface | `#1e293b` |
| Accent | `#14b8a6` (teal) |
| Accent light | `#5eead4` |
| Text | `#f8fafc` |
| Text muted | `#94a3b8` |

## Features

- **Responsive navbar** with hamburger menu for mobile, scroll-activated background, and active page highlighting
- **Scroll-triggered fade-up animations** via IntersectionObserver
- **Portfolio filter** — client-side category filtering with no page reload
- **FAQ accordion** — single-open accordion on the pricing page
- **Contact form validation** — required field checks, email regex validation, and animated success message
- Mobile-first responsive grid system (1 → 2 → 3/4 columns)
- Teal radial gradient hero with decorative glows

## Getting Started

No build step required. Simply open `index.html` in your browser or serve with any static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

## Customization Checklist

- [ ] Replace `hello@yourdomainhere.com` with your real email address
- [ ] Update social media `href="#"` links with real profile URLs
- [ ] Swap placeholder `picsum.photos` images with real project screenshots
- [ ] Update the footer copyright year and company name if needed
- [ ] Replace the contact form with a real form backend (Formspree, Netlify Forms, etc.)
