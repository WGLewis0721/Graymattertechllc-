# Security

## Threat model

The deliverable is a static marketing site for a small business, hosted on GitHub Pages. There is no database, no authentication, no server runtime, no user accounts, and no PII at rest. This is deliberate: the smallest attack surface is the one that doesn't exist. A static site with no backend cannot be SQL-injected, cannot leak a user table because there isn't one, and cannot have its auth bypassed because there is no auth.

GitHub Pages adds one real constraint to this picture: it serves static files only and does not let you set custom HTTP response headers. No `_headers` file, no `.htaccess`, no header configuration of any kind. Any advice claiming GitHub Pages reads a `_headers` file is wrong, and nothing in this codebase should try. That constraint is handled explicitly below, not worked around.

The residual risks are narrow and specific: leaking a client's home address through photo metadata, a spam-bot abusing the contact form, a compromised third-party embed running arbitrary script in the page, a site indexed or discoverable before the client has approved it, and clickjacking via iframe embedding (the one class of protection a headerless host genuinely cannot offer). Each is addressed below as an operational checklist.

## Secrets

- [ ] No secrets committed to any repo, ever. Form endpoint IDs (Formspree) and analytics keys are public-safe by design and may live in `content.json` or client code.
- [ ] Anything that is not public-safe goes in Cloudflare Pages environment variables during the gated-preview stage (`docs/DEPLOYMENT.md`, stage 1). If a client repo's GitHub Actions build ever needs a real secret, it goes in that repo's GitHub Actions secrets, never in a tracked file. In practice, production (GitHub Pages) is a pure static build with no runtime, so there is normally nothing that needs a production secret store at all.
- [ ] `.gitignore` at the root of every client project and this template library covers at minimum:

```
.env
.env.local
node_modules
```

## Client photo hygiene

- [ ] Every photo received from a client is treated as untrusted until processed. Phone photos carry EXIF data, and EXIF GPS coordinates on a storefront or headshot photo can leak the exact location a photo was taken, which for a home-based contractor or coach means leaking their home address.
- [ ] EXIF stripping is a mandatory intake step, before any image is committed to a client project or uploaded anywhere. Strip EXIF on every image, not just ones that look like they might have location data.
- [ ] Tooling: `exiftool -all= <file>` for a single pass on the command line, or `sharp` (already a likely dependency for image processing) configured to not carry metadata through on re-encode. Batch strip the whole intake folder before any other processing step:

```bash
exiftool -all= -overwrite_original intake/photos/*.jpg
```

- [ ] Verify strip worked before moving on: `exiftool intake/photos/*.jpg | grep -i gps` should return nothing.

## Form handling

- [ ] Forms post to Formspree only. Netlify Forms is not an option: it depends on a Netlify build step to detect and wire the form, and this stack builds and deploys via GitHub Actions to GitHub Pages, not Netlify. No custom backend either way, no server code to secure.
- [ ] Every form includes a honeypot field (a hidden input real users never fill, bots often do) in addition to Formspree's own spam filtering. Neither alone is sufficient; both together catch most automated spam.
- [ ] Forms never accept file uploads. A file upload field is an attack surface this system has no reason to carry, and no client site needs it.
- [ ] Submitted input is never echoed back into the page. No "thanks, {name}" rendered from an unescaped form field. Confirmation messages are static.

## Security headers under a no-headers host

Be honest about what GitHub Pages does and does not allow, and don't pretend otherwise anywhere in this codebase or in client-facing material.

**What is achievable, via `<meta>` tags in the document head:**

- [ ] Content-Security-Policy, delivered as a meta tag, scoped tight to exactly what each template needs (self, plus the specific form and map origins in use). Every vertical template ships this in its `BaseLayout`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src 'self' https://www.google.com https://maps.google.com; form-action 'self' https://formspree.io; base-uri 'none'; object-src 'none'">
```

Trim `frame-src` and `form-action` to only the origins a given template actually embeds or posts to. Do not ship a wider policy than the site needs.

- [ ] Referrer-Policy, also deliverable as a meta tag:

```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

- [ ] `frame-ancestors` is a CSP directive that only takes effect when CSP is delivered as an HTTP header. When CSP is delivered via `<meta>`, as it must be here, `frame-ancestors` is silently ignored by the browser. Do not add it to the meta policy under the illusion that it does anything; it doesn't, and its absence is the honest state of things, not a bug to fix.

**What is not achievable on GitHub Pages, at all, under any configuration:**

- [ ] X-Frame-Options — cannot be set. No meta-tag equivalent exists.
- [ ] X-Content-Type-Options — cannot be set. No meta-tag equivalent exists.
- [ ] Permissions-Policy — cannot be set. No meta-tag equivalent exists.
- [ ] Strict-Transport-Security (HSTS) — cannot be set by this project. HTTPS itself is still enforced (see below); HSTS specifically is not something a static host without header control can add.

**Residual risk:** primarily clickjacking, since nothing here can prevent another site from iframing a client's page (the meta-tag limitation on `frame-ancestors` above is exactly this gap). The impact for a small-business marketing site with no auth, no forms that expose sensitive actions, and no user accounts is low, but it is real and it should be named, not hidden behind a document that only lists what a `_headers` file would have said if this host supported one.

**Mitigation path:** if a specific client's risk profile genuinely requires header-level protections (X-Frame-Options, HSTS, Permissions-Policy, a header-delivered CSP with working `frame-ancestors`), the fix is moving that site's hosting to a platform that supports custom headers. Nothing about the Astro codebase has to change to do that: the build output is the same static files either way, only where they're served changes. Do not attempt to hack around the limitation on GitHub Pages itself (client-side redirects, JS-based frame-busting, or similar); move the host instead.

## HTTPS

- [ ] GitHub Pages issues a Let's Encrypt certificate automatically for a custom domain once DNS is correctly pointed at it.
- [ ] "Enforce HTTPS" must be turned on in the client repo's Pages settings for every launch. It can only be enabled after DNS has propagated and GitHub has finished issuing the certificate; enabling it too early will fail. This is a launch-checklist item, not a set-and-forget one, see `docs/DEPLOYMENT.md`.

## Dependency discipline

- [ ] Minimal direct dependencies. Astro, an image library if `astro:assets` needs a helper, and nothing else by default.
- [ ] Lockfile (`package-lock.json` or equivalent) is committed for every client project.
- [ ] Dependabot is enabled on every client repo that has one, and on this template repo.
- [ ] No unvetted Astro integrations. Before adding an integration, check its maintenance status, its dependency tree, and whether the same result is achievable without it.
- [ ] Every added dependency must justify its bytes against the performance budget in `docs/ENGINEERING.md`. A dependency that pushes a page over budget is a rejected dependency, no exceptions.

## Third-party embeds

Third-party embeds (maps, booking widgets, review feeds) are the main real risk in this system, because they run code this project doesn't control on pages this project is responsible for.

- [ ] Lazy-load every embed. It loads on scroll-into-view or on tap, never on initial page load, both for performance and to avoid running third-party script before the user has done anything.
- [ ] Sandbox in an iframe wherever the provider supports it (`<iframe sandbox="allow-scripts allow-same-origin">`, scoped as tight as the embed allows). An iframe boundary contains a compromised or malicious embed to its own frame.
- [ ] Never inline third-party script into the page `<head>`. A `<script src="...">` tag pointing at a third party in the head runs with the full privileges of the page, on every page load, whether the user ever interacts with the widget or not. If a widget can only be embedded via head script, that is a reason to pick a different provider, not a reason to make an exception.

## Pre-launch confidentiality

This is a client-trust requirement, not just a technical one, and it drives the two-stage deployment model documented in full in `docs/DEPLOYMENT.md`.

GitHub Pages cannot gate a site behind a login. Pages access control (restricting who can view a published Pages site) is a GitHub Enterprise Cloud feature only. On Free, Pro, or Team, making the source repository private does not make the published Pages site private: a private repo with Pages enabled still publishes a fully public site at its Pages URL. There is no plan-independent way around this.

The rule that follows is not optional:

- [ ] A client site is never deployed to GitHub Pages until the client has signed off on it.
- [ ] GitHub Pages stays disabled in the client repo for the entire build and review phase. Not "private," disabled. Enabling Pages on a private repo does not achieve confidentiality, per above.
- [ ] Review happens on a gated preview host instead: Cloudflare Pages, with Cloudflare Access in front, using email one-time-code authentication. The client is added by email address only, no account creation required on their end.
- [ ] GitHub Pages is enabled on the client repo for the first time at launch, not before. See `docs/DEPLOYMENT.md` for the exact stage-two steps.
- [ ] The Astro build is identical for both stages. Nothing about the codebase changes at cutover, only where the same static output is deployed.

**Do not implement client-side password protection as a substitute for this.** A JavaScript password prompt layered on top of prerendered static HTML is theater: the full HTML, including whatever it "protects," ships in the response and the browser bundle regardless of whether the prompt has been answered. It can be trivially bypassed by reading the page source or disabling JS. State this plainly to anyone who suggests it as a shortcut: it is not a control, and treating it as one is worse than having no confidentiality story at all, because it creates false confidence.

## Search visibility

- [ ] Every template ships `noindex, nofollow` (via a `<meta name="robots">` tag) and a disallow-all `robots.txt` by default.
- [ ] Both are flipped on (removed / opened up) only at launch, as an explicit step in the launch checklist in `docs/DEPLOYMENT.md`, never automatically and never early.
- [ ] This is defense against accidental indexing during the build and review phase, not an access control. A determined visitor with the direct preview URL and the client's granted email access can still see the site; `noindex` and `robots.txt` only keep search engines from crawling and listing it before launch day. Don't describe this to a client as privacy or security; it isn't. The actual confidentiality control is the Cloudflare Access gate described above.

## Client handoff

- [ ] Clients receive the deployed, live site. They do not receive repo write access as part of the standard delivery.
- [ ] If a client explicitly purchases the code (an add-on, not the default), ownership transfer means: the client repo is transferred to a GitHub account the client controls, GitHub Pages and any custom domain configuration is re-verified post-transfer, and any secrets that existed (GitHub Actions secrets, if any were ever added) are rotated post-transfer since they were visible to the delivering team during build.
- [ ] This template library (`websites/` in this repo) is never part of a handoff. Clients get their own generated repository, produced by `degit`, with no git history connecting it back to the shared template source.
