# Gray Matter — Digital & Technology Solutions

A complete multi-page static business website for **Gray Matter**, a digital and technology solutions company offering web design, booking systems, e-commerce, automation, and cloud, security &amp; DevOps consulting (including 1099 contract engagements).

https://wglewis0721.github.io/Graymattertechllc-/

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero, proof bar, 8-category services overview, How We Work preview, featured work, CTA |
| `services.html` | Services — 8 categories (web design, booking, e-commerce, automation, cloud infrastructure, security, DevOps, technology consulting) |
| `process.html` | How We Work — the 8-step "tech fit to finished solution" roadmap, ends in a business-inquiry CTA |
| `cloud-consulting.html` | Cloud Consulting — cloud infrastructure, security, DevOps, and technology consulting for 1099/contract engagements |
| `portfolio.html` | Portfolio — filterable project grid with category filters |
| `pricing.html` | Pricing — three-tier web plans, add-ons, FAQ accordion |
| `contact.html` | Contact — project inquiry form (web + cloud options), contact sidebar |
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
- [ ] Swap placeholder `picsum.photos` images with real project screenshots
- [ ] Update the footer copyright year if needed
- [ ] Replace the contact form with a real form backend (Formspree, Netlify Forms, etc.)
- [ ] Update cloud consulting service descriptions with specific certifications or tooling expertise
