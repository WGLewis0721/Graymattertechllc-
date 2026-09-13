# Round 1 Technical SEO Audit — Gray Matter Digital Solutions

Site: https://graymatterdigitalsolutions.com
Audited: 2026-09-13
Method: read the repository (root static HTML site, deployed as Cloudflare Workers static assets per `wrangler.jsonc`), then verified every finding against the live production origin with direct HTTP requests (not assumptions from the code alone).

## Summary

GSC's ~34 indexed URLs against a larger crawled set is not a failure signal on its own — but this audit found one real, systemic cause of "page with redirect" style exclusions: **every canonical tag and every sitemap URL pointed at a `.html` path that the production server 307-redirects away from.** That has been fixed. A second finding — internal tooling and docs being publicly served from the same origin — has also been fixed. Two remaining items are Cloudflare account/DNS settings, not files in this repo; they're called out below for manual action.

## How production actually serves this site

`wrangler.jsonc` deploys the repo root as Cloudflare Workers static assets. Verified live behavior (`curl -I`):

| Request | Result |
|---|---|
| `/` | `200` (serves `index.html`) |
| `/index.html` | `307` → `/` |
| `/about` | `200` (serves `about.html`) |
| `/about.html` | `307` → `/about` |
| `/services` | `200` (serves `services.html`, not the `services/` directory) |
| `/services.html` | `307` → `/services` |
| `/services/` (trailing slash) | `307` → `/services` |
| `/services/business-websites` | `200` |
| `/services/business-websites.html` | `307` → `/services/business-websites` |
| unknown path | `404` |

So the canonical, indexable URL for every page is the **extensionless clean path** (`/about`, `/services/business-websites`, `/` for home) — never the `.html` filename, and never a trailing slash on a non-directory page. Every `.html` URL and every trailing-slash URL is a single 307 hop to that canonical form.

## Findings and fixes

### 1. Canonical tags and sitemap pointed at URLs that redirect (fixed)

Every page's `<link rel="canonical">`, `og:url`, `twitter` meta, and the homepage's JSON-LD `url`/service `url` fields used the `.html` form (e.g. `https://graymatterdigitalsolutions.com/about.html`), and `sitemap.xml` listed the same `.html` URLs (plus `/index.html` for the homepage). Since production 307-redirects every one of these to the clean URL, this is precisely the "sitemap contains a URL that redirects" problem — and it's the most likely driver of "page with redirect" exclusions in GSC for pages that are otherwise fine.

**Fix:** rewrote every canonical, `og:url`, `twitter:*`, and JSON-LD `url` value across all 30 root/`services/`/`industries/` HTML pages to the clean production URL (`/` for home, `/about`, `/services/business-websites`, etc.). Rebuilt `sitemap.xml` with the same clean URLs and refreshed `lastmod`.

### 2. Internal links pointed at `.html`, forcing an avoidable redirect hop on every click (fixed)

Nav, footer, mega-menu, breadcrumbs, and in-body CTAs across all pages used relative `.html` hrefs (`services/business-websites.html`, `../about.html`, `index.html`, etc.). Each of those clicks cost visitors and crawlers an extra 307 round trip to reach the canonical page.

**Fix:** rewrote every internal `href` in scope to the clean form:
- `index.html` → `./` (same-level) or `../` (from `services/`, `industries/`) — the directory-root reference, not a literal `index` path.
- All other internal links → extension stripped in place (`about.html` → `about`, `services/business-websites.html` → `services/business-websites`), preserving query strings and hash fragments exactly (e.g. `contact.html?service=...` → `contact?service=...`).

Also updated the JS layer that builds some of these links dynamically, so generated URLs match:
- `js/data.js` — `services[].url`, `industries[].url`, and the `inquiryUrl()` helper's `contact` target.
- `js/funnel-data.js` — every `detailUrl` / `alsoUrl`.
- `js/funnel.js` — the `contact` and `agreement` targets used by the funnel's plan summary.
- `js/plan-intake.js` — the "change your plan" link back to the homepage funnel anchor.
- `js/main.js` — the active-nav-link highlighter previously string-matched the raw `href` attribute against `location.pathname`'s last segment, assuming both were `.html`. Rewritten to resolve each link's href against the current URL (`new URL(href, location.href).pathname`) and compare normalized paths, so it's correct regardless of relative depth, trailing slash, or the extensionless scheme — and still ignores in-page anchor links exactly as before.

Verified with an automated crawl of every `href` in every in-scope HTML file (resolved the same way Cloudflare resolves clean URLs — a sibling `name.html` file takes precedence over a same-named directory): **zero broken internal links.**

### 3. Internal tooling and documentation were being served on the public domain (fixed)

`.assetsignore` only excluded `.git` and `.wrangler`, so the entire asset directory (`.`) was deployed as-is. That meant the following were live and crawlable at the production origin, confirmed with `curl`:

- `graymatterdigitalsolutions.com/README.md`
- `graymatterdigitalsolutions.com/wrangler.jsonc`
- `graymatterdigitalsolutions.com/docs/ARCHITECTURE.md` (and the rest of `docs/`)
- `graymatterdigitalsolutions.com/websites/CLAUDE.md`, `/websites/package.json`, and the rest of the separate client-website-template-library project that happens to live in this same repo under `websites/`

None of this is linked from any indexed page, none of it is meant to be public, and it's unrelated to the marketing site's search intent — it's pure crawl-budget waste at best and unintended exposure of internal process docs at worst.

**Fix:** added `README.md`, `wrangler.jsonc`, `docs/`, and `websites/` to `.assetsignore`. They stay in the git repo; they just stop being deployed as public assets. (This also keeps this very audit, and the rest of `docs/seo/`, off the public site.)

**Not changed — needs a decision:** `client-demos/aknorthstar/` is also served publicly (its two pages already correctly carry `noindex,nofollow`, so it won't get indexed, but the files are still reachable by direct URL). This looks like it could be an active concept/preview link shared with a prospective client, so it was left alone rather than guessed at. If it's no longer needed as a live link, add `client-demos/` to `.assetsignore` in a follow-up.

### 4. Custom 404 page (added)

There was no custom 404; unmatched paths returned a bare `404` with no page content. Added `404.html` (on-brand, links to Home, Services, and priority service pages) and set `"not_found_handling": "404-page"` in `wrangler.jsonc` so Cloudflare serves it with a `404` status on any unmatched path — correct status code, and now an actual page instead of a dead end.

### 5. robots.txt (no change needed)

```
User-agent: *
Allow: /

Sitemap: https://graymatterdigitalsolutions.com/sitemap.xml
```

Nothing important is blocked. `client-demos/` and (now) `websites/`/`docs/` don't need a `Disallow` — they either carry `noindex` already or are no longer deployed at all, and adding a `Disallow` for a `noindex` page would actually stop Google from ever crawling it to see the `noindex` tag in the first place.

### 6. `noindex` audit (no accidental exclusions found)

Only `portfolio.html` carries `noindex,follow` (intentional and documented in the README — the case-studies page has no real projects yet, so it's an honest empty state, not something to index). No priority page is accidentally noindexed. `client-demos/*` correctly carries `noindex,nofollow` as a non-production demo.

### 7. www and HTTP→HTTPS — Cloudflare account settings, not repo files (action needed outside this repo)

Verified against the live origin:

- `https://www.graymatterdigitalsolutions.com/` returns `200` with the **same content** as the apex domain — it is not redirected to `https://graymatterdigitalsolutions.com/`. Every canonical tag already points at the non-www apex, which should keep Google consolidating to the right URL, but a host-level redirect would close this off properly.
- Plain `http://graymatterdigitalsolutions.com/` returns `200` directly — it is not redirected to HTTPS.

Both of these are Cloudflare zone-level settings (Redirect Rules, or the "Always Use HTTPS" toggle under SSL/TLS → Edge Certificates), not something expressed in this git repository's files. **Recommended action:** in the Cloudflare dashboard, add a redirect rule sending `www.graymatterdigitalsolutions.com/*` → `https://graymatterdigitalsolutions.com/$1` (308), and turn on "Always Use HTTPS" for the zone.

### 8. Duplicate `/services.html` vs `/services/` (not actually a conflict)

The task brief flagged this exact pattern as a classic issue to check for. Verified live: `/services/` (trailing slash, no `services/index.html` exists) 307-redirects to `/services`, which serves `services.html`'s content directly. There is no live duplicate — both paths resolve to one 200 URL. No fix needed here beyond the canonical/sitemap cleanup in Finding 1, which already points everything at `/services`.

## Done-when checklist (Phase 1)

- [x] Every intended ranking page returns HTTP 200 (verified live for every sitemap URL's clean form)
- [x] Every duplicate variant resolves or canonicals to one preferred URL (`.html`, trailing-slash, and `/index.html` variants all redirect to the one clean canonical; canonicals and sitemap now match production's actual canonical form)
- [x] No redirect chain exceeds one hop (every case found is exactly one 307 hop; internal links were also fixed to skip that hop entirely rather than just tolerate it)
- [x] Sitemap contains only canonical, indexable 200 URLs
- [x] robots.txt does not block important pages
- [x] Production build passes — static site, no build step; validated by resolving every internal link against the actual Cloudflare asset-routing rules (file-before-directory precedence) with zero broken links, and by loading key pages in a headless browser with no console/JS errors

## Files changed in this phase

- `sitemap.xml` — clean canonical URLs, refreshed `lastmod`
- `.assetsignore` — stop deploying `README.md`, `wrangler.jsonc`, `docs/`, `websites/`
- `wrangler.jsonc` — `not_found_handling: "404-page"`
- `404.html` — new on-brand 404 page
- All 30 root/`services/`/`industries/` HTML pages — canonical/OG/Twitter/JSON-LD URLs and every internal `href` switched to the clean URL form
- `js/data.js`, `js/funnel-data.js`, `js/funnel.js`, `js/plan-intake.js` — URL fields/builders updated to match
- `js/main.js` — active-nav-link detection rewritten to be URL-scheme-agnostic
