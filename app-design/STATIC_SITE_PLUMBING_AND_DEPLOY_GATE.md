# Static-Site Plumbing and Deploy Gate | The Parts Clients Expect and Visitors Never Notice

**Purpose:** The "traditional website" layer that separates a polished site from a demo: a sitemap, share previews, icons, a Content Security Policy, security files, plain legal and accessibility pages, a proper 404, and a **deploy gate** that refuses to publish a site that has lost any of it. Companion to [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md) (Step 5 launch quality) and [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md).

**Origin:** Adapted from the Listening Room reference build, [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25): [tools/build_site.py](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/tools/build_site.py), [tools/check_site.py](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/tools/check_site.py), [tools/serve_site.py](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/tools/serve_site.py), [tools/qa/site-meta.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/tools/qa/site-meta.js). Labels: **[Repo]** verified in that code, run locally and on the deployed site; **[Not tested]** not run.

**Scope:** New, independent static sites on a Pages-style host. **Do not apply the build script to the live Gray Matter business website**: it is intentionally zero-build under its own [.github/copilot-instructions.md](../.github/copilot-instructions.md). Its rules for approved facts and links still apply to anything built from this guide.

## 1. Do it at build time, from one config [Repo]

Source pages stay clean; a small build script (Python standard library only, so a CI runner needs nothing installed) assembles the output folder and **injects** the plumbing into every page's `<head>`. The rules live in one config: base URL, contact, share image, an allow-list for API hosts, and per page `{ index, description, og_title, image }`. The same output ships on every deploy.

| Injected into every page | Why |
| --- | --- |
| Content Security Policy (`<meta http-equiv>`) with inline scripts allowed **by SHA-256 hash** | No third-party or injected script can run, with no need to refactor inline scripts |
| `referrer` policy `strict-origin-when-cross-origin` | Query strings (ids) are not sent to other sites |
| `description`, `robots`, absolute `canonical` | Search and duplicates |
| Open Graph + Twitter tags: `og:title/description/url/image`, image size and alt, `summary_large_image` | The link preview when someone shares the page |
| Icons (`.ico`, SVG, apple-touch), web manifest | Browser tab and home-screen identity |
| For the 404 page: `<base href>` as the **first** thing in `<head>` | A 404 is served at any depth; a `<base>` after the stylesheets is too late |

And the build **emits**: `sitemap.xml` (with `lastmod` from the last commit that touched the source), `robots.txt` pointing at it, `security.txt` ([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)) with a contact, a future `Expires` and a policy link, and a human `sitemap.html`.

The hash step is short:

~~~python
for m in re.finditer(r'<script(?![^>]*\bsrc\s*=)([^>]*)>(.*?)</script>', doc, re.S | re.I):
    hashes.append("'sha256-" + base64.b64encode(hashlib.sha256(m.group(2).encode('utf-8')).digest()).decode() + "'")
~~~

The policy used: `default-src 'self'; script-src 'self' <hashes>; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' <allow-list>; media-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`. Trade-offs to state: `'unsafe-inline'` for **styles** (inline style attributes), and a meta policy cannot set `frame-ancestors`. Adding a third-party script, font or API will be **blocked on purpose**; put an API host in the allow-list deliberately.

## 2. Know what the host cannot do [Repo]

- **Static hosts such as GitHub Pages cannot send HTTP headers.** HSTS, `frame-ancestors`, `Permissions-Policy` and `X-Content-Type-Options` need a host that can. Keep a ready header file (Netlify and Cloudflare Pages syntax) in the repo, **not published** on the host that ignores it, and copy it when you move.
- **A project site lives under `/repo-name/`.** Crawlers read `robots.txt` and `security.txt` only at the root of a host, so on that address both are written but ignored. The per-page robots `<meta>` and a sitemap submitted in the search console are what work. **A custom domain makes all of it work** and is worth having for any professional site.
- **Hidden folders:** confirm after the first deploy that `/.well-known/security.txt` is served; also publish `/security.txt` as a fallback.

## 3. Decide what search engines may index [Rec]

A sitemap says "find this". Decide per page and keep them consistent: index the home page, the pages you want found and the plain pages; `noindex` the checkout, operator tools, duplicate copies and single-variant pages. The sitemap lists **only** indexable pages. Do not index a fictional demo as if it were a real offering; say "concept demo" in the title or description.

## 4. Plain pages that match the product [Repo]

Write them last, from what the product actually does, and keep them short and honest:

| Page | Must say |
| --- | --- |
| Privacy | What is stored in the browser (list the actual storage keys), that nothing is sent anywhere if that is true, camera use on device only, the host's own logging, and what would change if the product took payments |
| Terms | Demo status, stand-in venues, trademarks, no warranty |
| Accessibility | What was tested (contrast, tap size, text size, keyboard, reduced motion, layouts) **and what was not** (screen readers, 200% zoom, real phones); how to report a problem; no conformance claim |
| 404 | One screen, links home and to the site map, styled at any depth |
| Site map | Every page, grouped |

These are drafts and **not legal advice**. Link them from the footer of tool and checkout pages; a hero-only page can leave them to the sitemap and footer of its other pages.

## 5. Share previews [Repo]

- Render the 1200 by 630 image **from the running site** (a script that screenshots the real hero), not a stock picture. A collage of the variants suits a "pick your look" page.
- Use absolute URLs for the image and canonical; an alt text on the image.
- **Facebook caches previews.** After changing tags or the image, paste the link into the Sharing Debugger and press **Scrape Again**.
- Check what the crawler sees: fetch the page with the user agent `facebookexternalhit/1.1` and confirm status 200, the tags and a reachable image.
- Sharing tips that cost real time: end the URL in a **slash** (an address ending in a hyphen defeats link detection); put it on **its own line**; post a **new comment** rather than editing one; test the same link in a private message to tell a post or group restriction from an address problem; Instagram comments never make links clickable; retype emojis rather than pasting them out of the app (they become invisible placeholder characters). Shared domains may be treated as lower trust by a platform **[unverified]**; a custom domain removes the question.

## 6. The deploy gate [Repo]

A second script runs after the build and **fails the deploy** on any of:

- a page without a Content Security Policy, or one allowing unsafe script;
- an inline script not covered by its policy's hash, or an inline event handler (`onclick=`);
- anything loading from another website (script, stylesheet, image, frame, font, media);
- a broken internal link or file reference;
- a sitemap that disagrees with the `noindex` rules, a missing `robots.txt` pointer;
- a `security.txt` without a contact, or expiring within 30 days;
- a forbidden name (for example a real artist or client in a fictional demo) in any published file.

**Prove each check can fail:** break a copy of the output (external script tag, edited inline script, broken link, forbidden name, inline handler, removed policy) and require the gate to fail naming that problem ([WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md)). A browser-side twin loads every page, fails on any console error, policy violation or foreign request, and tests that the policy is **enforced**.

## 7. Develop and test it the way production serves it [Repo]

Serve the built output **under the production sub-path** with the real 404 page for unknown addresses at any depth (a short local server, about 30 lines). Path bugs (a `<base>` in the wrong place, root-relative assets) appear before deploy instead of after it.

## 8. Also keep in the repository

A `SECURITY.md` (how to report, scope, what to expect, what protects the site today), Dependabot for the workflow actions, and a note of which parts of the build are generated so nobody edits them by hand.

## 9. Acceptance

- [ ] Share preview verified with the crawler user agent; image reachable; Sharing Debugger refreshed after changes.
- [ ] `sitemap.xml`, `robots.txt`, `security.txt` present and consistent with the noindex rules.
- [ ] Content Security Policy on every page, enforced (injection and `eval` blocked), no third-party requests.
- [ ] Plain pages written from the product's real behavior; 404 styled at depth.
- [ ] The gate runs in CI, **blocks** a bad deploy, and has been seen to fail on purpose.
- [ ] Custom domain, header file and search-console submission decided: **[not done in the reference build]**.

Template: [templates/SITE_PLUMBING_CHECKLIST.md](templates/SITE_PLUMBING_CHECKLIST.md).
