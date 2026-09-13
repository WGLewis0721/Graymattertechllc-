# Round 1 SEO Changelog — Gray Matter Digital Solutions

Branch: `claude/gray-matter-seo-round-1-gh7ppn`
Site audited: https://graymatterdigitalsolutions.com

## Fixes completed by phase

### Phase 1 — Technical SEO and indexing hygiene
Full detail in `ROUND-1-TECHNICAL-AUDIT.md`. Summary:
- Every canonical tag, `og:url`, `twitter:*` URL, JSON-LD `url`, and the sitemap itself pointed at `.html` paths that production actually 307-redirects away from. Rewrote all of them to the real clean canonical URL (verified live against the production origin, not assumed).
- Rewrote every internal `href` across all 30 pages (nav, footer, mega-menu, breadcrumbs, in-body CTAs) from `.html` to the clean form, so visitors and crawlers no longer take an avoidable redirect hop on every click. Updated the JS link builders (`data.js`, `funnel-data.js`, `funnel.js`, `plan-intake.js`) and rewrote the nav active-link highlighter in `main.js` to resolve URLs instead of string-matching `.html` filenames.
- Found `README.md`, `wrangler.jsonc`, `docs/`, and the separate `websites/` template-library project were all being publicly deployed and crawlable with no reason to be. Excluded them via `.assetsignore`.
- Added a custom, on-brand `404.html` wired up via `not_found_handling: "404-page"` in `wrangler.jsonc` (there was previously no content on a 404, just a bare status).
- Verified: robots.txt blocks nothing important; only `portfolio.html` (intentionally, documented) and the non-production `client-demos/` carry `noindex`.

### Phase 2 — Page inventory, titles, metadata
Full detail in `PAGE-SEARCH-MAP.md`. Summary:
- Documented intent, title, description, H1, canonical, and intended internal links for every indexable URL.
- Found titles, descriptions, and H1s were already unique and content-matched across the site — this was in noticeably good shape already.
- One real cannibalization risk: `services.html`'s title/og:title were near-duplicates of the homepage title. Retitled around its actual browse/catalog intent.
- Trimmed the three most-overlength meta descriptions (Home, Services, Contact were 210–259 characters) to ~150–160 characters.

### Phase 3 — Commercial service pages
- Read all 10 productized service pages plus Cloud Consulting against the problem / who-it's-for / what-we-do / result / CTA framework. All ten already do this well (specific problem statements, ICP-framed packages, a Before/After result block, a process recap, a Related Services cross-link section, multiple CTAs) — no rewrite needed.
- The one gap: `cloud-consulting.html` had no bridge back to the small-business service pages. Added an "Also Available" section linking to Backup & Recovery and Business Security.

### Phase 4 — Local SEO, entity, and trust
- Business naming was already consistent (`Gray Matter LLC` / `Gray Matter`) — verified, no change needed.
- "River Region" — the common name for the Montgomery metro — was entirely absent from the site despite thorough Montgomery coverage. Added it to the site-wide footer locale line, About's "Where We Work" section, and the homepage's `areaServed` JSON-LD.
- Added a `WebSite` JSON-LD block to the homepage (previously only `ProfessionalService` existed).
- Added a `Service` + `OfferCatalog` JSON-LD block to `cloud-consulting.html` for its four sub-offerings (every other service page had one; this page didn't).
- Added visible breadcrumb navigation and matching `BreadcrumbList` JSON-LD to the five indexable pages that had neither (`about`, `contact`, `pricing`, `agreement`, `sops`), matching the pattern already used on the other 24 pages.
- Validated all 52 JSON-LD blocks on the site parse as valid JSON.
- No reviews, ratings, awards, clients, or addresses were invented anywhere in this round.

### Phase 5 — Internal linking, conversion, and validation
- Crawled every internal link on the site and resolved it the same way Cloudflare's asset router resolves a clean URL (file-before-directory precedence): **zero broken internal links.**
- Checked for orphaned pages (pages nothing links to): only `portfolio.html`, which is intentionally unlinked and `noindex` (documented empty state).
- All 71 `<img>` tags on the site have meaningful `alt` text — none missing, none empty on non-decorative images.
- Every page has exactly one `<h1>`; heading order is otherwise sequential. (Minor, pre-existing, non-blocking note: the mega-menu's category labels use `<h6>` for a visual/semantic grouping inside the nav flyout, which skips h4/h5 — cosmetic only, doesn't affect page content hierarchy, left as-is to avoid nav redesign.)
- The contact form posts via `fetch` to `formsubmit.co` and is unmodified by this round — confirmed the JS wiring is intact.
- Verified in a headless browser at 390px width (iPhone-class viewport) on Home, About, Services, Business Websites, Cloud Consulting, Contact, and the new 404 page: no horizontal overflow, no console/JS errors, and the nav active-state highlighting (rewritten in Phase 1) correctly marks the current page on every one of them.
- Priority pages remain reachable within 1–2 clicks from anywhere (mega-menu + footer on every page); industry pages are 2 clicks from the homepage via "Who We Help."

## Files changed (cumulative, all phases)

- `sitemap.xml`, `.assetsignore`, `wrangler.jsonc`, `404.html` (new)
- `docs/seo/ROUND-1-TECHNICAL-AUDIT.md`, `docs/seo/PAGE-SEARCH-MAP.md`, `docs/seo/ROUND-1-CHANGELOG.md` (new — and, per the `.assetsignore` change, none of these are publicly deployed)
- All 30 root/`services/`/`industries/` HTML pages — canonical/OG/Twitter/JSON-LD URLs, internal hrefs, breadcrumbs where added, footer locale text
- `js/data.js`, `js/funnel-data.js`, `js/funnel.js`, `js/plan-intake.js`, `js/main.js`
- `index.html` — trimmed description, `WebSite` schema, River Region in `areaServed`
- `services.html` — retitled around browse/catalog intent
- `contact.html` — trimmed description, breadcrumb
- `cloud-consulting.html` — "Also Available" section, `Service`/`OfferCatalog` schema, breadcrumb JSON-LD (visible breadcrumb already existed)
- `about.html`, `pricing.html`, `agreement.html`, `sops.html` — breadcrumb nav + JSON-LD

## URLs verified

Verified live against the production origin (pre-fix state, to characterize the actual bugs) and/or in a local server that replicates Cloudflare's asset-routing rules (post-fix state, since the fix has not yet been deployed — see below): homepage, `/about`, `/services`, `/services/business-websites`, `/cloud-consulting`, `/contact` (with and without query params), `/industries/contractors`, `/pricing`, `/process`, plus the `.html`/trailing-slash/`/index.html` redirect variants of each, the `www` subdomain, plain HTTP, and an unknown path (404).

**Important — this round has not been deployed yet.** As of this writing, `graymatterdigitalsolutions.com` is still serving the pre-fix `sitemap.xml` and `.html` canonicals; this branch (`claude/gray-matter-seo-round-1-gh7ppn`) has been pushed to the repository but not merged, and there is no CI/CD workflow in this repo that deploys automatically. Whatever normally deploys `main` to Cloudflare (the dashboard's git integration, or a manual `wrangler deploy`) needs to run against this branch's changes before the live site reflects any of the above. Re-verify the live URLs above after that deploy.

## Search Console actions still required

1. **Merge/deploy this branch**, then in GSC submit the updated `sitemap.xml` (same URL, new contents) and request re-indexing of the homepage.
2. **Cloudflare dashboard settings (not in this repo):**
   - Add a redirect rule: `www.graymatterdigitalsolutions.com/*` → `https://graymatterdigitalsolutions.com/$1` (308). Currently `www` serves the identical site with a `200`, unredirected.
   - Turn on "Always Use HTTPS" (SSL/TLS → Edge Certificates). Currently plain `http://` serves a `200` unredirected.
3. **Decide on `client-demos/aknorthstar/`** — it's public (though `noindex,nofollow`) and looks like it could be an active client-facing preview link. Confirm whether it's still needed; if not, add `client-demos/` to `.assetsignore`.
4. After the deploy, spot-check GSC's URL Inspection tool on a few previously-excluded `.html`/`/index.html` URLs — they should now show as redirects to the clean canonical rather than being flagged as separate "alternate" pages, and the exclusion count should stabilize rather than climb.

## Remaining risks

- The `www`/HTTP items above are live today and are the two things in this whole audit that are outside this repository's control — they need a Cloudflare dashboard change, not a code change.
- `client-demos/aknorthstar/` remains deployed and unaddressed pending the decision above.
- No deploy pipeline was found in this repo (`.github/workflows` has no deploy job), so it's worth confirming with whoever owns the Cloudflare account how `main` actually gets published, so this round (and future ones) reach production reliably.

## Recommended Round 2 work

- Once real client work exists, populate `portfolio.html` and remove its `noindex` — it's the single highest-value page currently sitting empty on purpose.
- Set up and link real business profiles (Google Business Profile, LinkedIn) so a `sameAs` array can be added to the Organization/WebSite schema — none exist today, so none were fabricated.
- The ~15 non-priority pages whose meta descriptions run 160–190 characters are fine but could be tightened opportunistically the next time each page is touched for content reasons.
- Consider a images/performance pass (compression, `loading="lazy"` coverage) as a follow-up to this round's content/structure/linking focus — out of scope here but worth a dedicated look.
