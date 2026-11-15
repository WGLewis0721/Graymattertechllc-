# {{PRODUCT}} | Site Plumbing and Deploy-Gate Checklist

Release evidence for the "traditional website" layer. Guidance: [STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md](../STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md). Tick an item only when it was **run**; for a not-applicable item write `- [x] N/A: <reason>`.

**Status:** [[FILL]] | **Commit:** [[FILL]] | **Production URL / sub-path:** [[FILL]] | **Reviewer:** [[FILL]]

## Per-page head (injected at build time)
- [ ] Content Security Policy on every page; inline scripts covered by hash; no `unsafe-inline` or `unsafe-eval` for scripts
- [ ] Referrer policy set
- [ ] Description, absolute canonical and robots rule on every page
- [ ] Open Graph + Twitter tags with a 1200 x 630 image and alt text; image rendered from the running site
- [ ] Icons (`.ico`, SVG, apple-touch) and web manifest linked
- [ ] 404 page: `<base>` is first in `<head>`; styled at any depth

## Files emitted
- [ ] `sitemap.xml` lists only indexable pages; `lastmod` present
- [ ] `robots.txt` points at the sitemap
- [ ] `security.txt` has a contact and an `Expires` more than 30 days out (also at the fallback root path)
- [ ] Human site map page; plain pages: privacy, terms, accessibility, 404 (written from what the product actually does; **not legal advice**)

## Indexing decision (one line per page group)
- Indexable: [[FILL]] | `noindex`: [[FILL]] | Demo labeled "concept demo" where fictional: [ ]

## Gate (CI)
- [ ] The gate runs after the build and **blocks** deploy on failure
- [ ] Seen to fail on purpose for: external script · unhashed inline script · broken link · forbidden name · inline handler · missing policy
- [ ] Browser twin passes on the **built** site served under the production sub-path, then on the **live** URL (no console errors, no policy violations, no requests to other sites; injected script, foreign script and `eval` blocked)

## Share and search
- [ ] Crawler check: page fetched with the `facebookexternalhit/1.1` user agent returns 200, the tags and a reachable image
- [ ] Sharing Debugger refreshed after any change to tags or image
- [ ] Link-sharing tips applied (ends in a slash; own line; new comment, not an edit)
- [ ] Sitemap submitted in the search console · custom domain decided: [[FILL]]

## Repository
- [ ] `SECURITY.md` · dependency/action update bot · generated files documented
- [ ] Header file for a host that can send headers (HSTS, `frame-ancestors`, `Permissions-Policy`): present, **not published** where ignored
- [ ] Third-party code vendored with versions and licenses recorded; terms reviewed

## Evidence and limits
- Commands run and outcomes: [[FILL]]
- Not run: [[FILL]] (for example real-device checks, a custom domain, header enforcement)
