# Copilot Instructions for Gray Matter LLC Website

## Project Overview

This is the official business website for **Gray Matter LLC**, a digital solutions and technology consulting company. The site showcases web design services, booking systems, e-commerce, and cloud/IT consulting (including 1099 contract engagements).

## Tech Stack

- **Pure HTML5, CSS3, Vanilla JavaScript** — zero frameworks, zero build tools, zero npm dependencies
- **Google Fonts** — Syne (headings) + DM Sans (body) loaded via CDN
- **Font Awesome 6** — icons loaded via CDN
- Fully static files — no compilation or bundling required

## File Structure

```
/
├── index.html        # Home page
├── services.html     # Services page
├── portfolio.html    # Portfolio page with filterable project grid
├── pricing.html      # Pricing page with three-tier plans and FAQ accordion
├── contact.html      # Contact/inquiry form
├── agreement.html    # Client agreement / service terms
├── css/
│   └── style.css     # All styles (single stylesheet)
└── js/
    └── main.js       # All JavaScript (single script)
```

## Design System

Always use these CSS custom property values when adding or modifying styles:

| Token            | Value              |
|------------------|--------------------|
| Base background  | `#0f172a` (deep navy) |
| Surface          | `#1e293b`          |
| Accent           | `#14b8a6` (teal)   |
| Accent light     | `#5eead4`          |
| Text             | `#f8fafc`          |
| Text muted       | `#94a3b8`          |

## Code Style Conventions

- **HTML**: Use semantic HTML5 elements (`<section>`, `<article>`, `<nav>`, `<main>`, `<footer>`, etc.). Indent with 2 spaces.
- **CSS**: Follow the existing single-file approach in `css/style.css`. Use CSS custom properties (variables) for colors and reuse existing utility classes before adding new ones. Mobile-first responsive design using a 1 → 2 → 3/4 column grid progression.
- **JavaScript**: Vanilla JS only — no jQuery or other libraries. Keep all JS in `js/main.js`. Use `const`/`let` (no `var`). Prefer `addEventListener` over inline event handlers.
- Do **not** introduce build tools, package managers, or JavaScript frameworks.

## Running Locally

No build step required. Open any `.html` file directly in a browser, or serve the root with a simple static server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .
```

## Key Behaviors to Preserve

- **Responsive navbar**: hamburger menu for mobile, scroll-activated background, active page highlighting via `data-page` attributes.
- **Scroll-triggered animations**: fade-up effects powered by `IntersectionObserver` in `main.js`.
- **Portfolio filter**: client-side category filtering with no page reload.
- **FAQ accordion**: single-open accordion on the pricing page.
- **Contact form validation**: required field checks, email regex, and animated success message.

## Testing & Validation

There is no automated test suite. Validate changes by:

1. Opening the affected `.html` file(s) in a browser (or `python3 -m http.server 8080`).
2. Checking all pages at both mobile (≤768 px) and desktop widths.
3. Verifying the navbar, animations, portfolio filter, FAQ accordion, and contact form still work correctly after any JS changes.
4. Running the HTML through the [W3C Validator](https://validator.w3.org/) for structural changes.

## Deployment

The site is hosted on **GitHub Pages** (branch: `main`, root folder `/`). Merging to `main` automatically redeploys. No CI pipeline is required.
