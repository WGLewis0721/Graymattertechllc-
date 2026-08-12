# Security

## Threat model

The deliverable is a static marketing site for a small business. There is no database, no authentication, no server runtime, no user accounts, and no PII at rest. This is deliberate: the smallest attack surface is the one that doesn't exist. A static site with no backend cannot be SQL-injected, cannot leak a user table because there isn't one, and cannot have its auth bypassed because there is no auth.

The residual risks are narrow and specific: leaking a client's home address through photo metadata, a spam-bot abusing the contact form, a compromised third-party embed running arbitrary script in the page, and a leaked secret in the repo. Each is addressed below as an operational checklist.

## Secrets

- [ ] No secrets committed to the repo, ever. Form endpoint IDs and analytics keys (Formspree form ID, Plausible/GA site ID) are public-safe by design and may live in `content.json` or client code.
- [ ] Anything that is not public-safe (API keys with write access, third-party account credentials) goes in Cloudflare Pages environment variables, set in the dashboard, never in a tracked file.
- [ ] `.gitignore` at the root of every client project covers at minimum:

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

- [ ] Forms post to a third-party endpoint only (Formspree, Netlify Forms). No custom backend, no server code to secure.
- [ ] Every form includes a honeypot field (a hidden input real users never fill, bots often do) in addition to the provider's own spam filtering. Neither alone is sufficient; both together catch most automated spam.
- [ ] Forms never accept file uploads. A file upload field is an attack surface this system has no reason to carry, and no client site needs it.
- [ ] Submitted input is never echoed back into the page. No "thanks, {name}" rendered from an unescaped form field. Confirmation messages are static.

## HTTP headers

Every client site ships a Cloudflare Pages `_headers` file at the project root (copied into `dist/` on build, or placed in `public/` so Astro copies it automatically). Contents:

```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src 'self' https://www.google.com https://maps.google.com; form-action 'self' https://formspree.io https://*.netlify.app; base-uri 'none'; object-src 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Notes on the CSP:
- `style-src 'unsafe-inline'` is required because Astro emits some inline styles for scoped component CSS; this is a known, accepted tradeoff for a static-output framework, not an oversight.
- `frame-src` is scoped to the specific third-party embed domains a given site actually uses (Google Maps shown as the common case). Trim it to nothing (`frame-src 'none'`) on sites that embed nothing, and add a domain only when a specific embed requires it.
- `form-action` is scoped to the specific form provider domains in use. Remove whichever provider a given site does not use.
- Adjust the `_headers` file per client site to match its actual third-party surface. Do not ship a wider CSP than the site needs.

## Dependency discipline

- [ ] Minimal direct dependencies. Astro, an image library if `astro:assets` needs a helper, and nothing else by default.
- [ ] Lockfile (`package-lock.json` or equivalent) is committed for every client project.
- [ ] Dependabot is enabled on every client repo that has one, and on this template repo.
- [ ] No unvetted Astro integrations. Before adding an integration, check its maintenance status, its dependency tree, and whether the same result is achievable without it.
- [ ] Every added dependency must justify its bytes against the performance budget in `ENGINEERING.md`. A dependency that pushes a page over budget is a rejected dependency, no exceptions.

## Third-party embeds

Third-party embeds (maps, booking widgets, review feeds) are the main real risk in this system, because they run code this project doesn't control on pages this project is responsible for.

- [ ] Lazy-load every embed. It loads on scroll-into-view or on tap, never on initial page load, both for performance and to avoid running third-party script before the user has done anything.
- [ ] Sandbox in an iframe wherever the provider supports it (`<iframe sandbox="allow-scripts allow-same-origin">`, scoped as tight as the embed allows). An iframe boundary contains a compromised or malicious embed to its own frame.
- [ ] Never inline third-party script into the page `<head>`. A `<script src="...">` tag pointing at a third party in the head runs with the full privileges of the page, on every page load, whether the user ever interacts with the widget or not. If a widget can only be embedded via head script, that is a reason to pick a different provider, not a reason to make an exception.

## Client handoff

- [ ] Clients receive the deployed, live site. They do not receive repo write access as part of the standard delivery.
- [ ] If a client explicitly purchases the code (an add-on, not the default), ownership transfer means: the client project repo (not this template library) is transferred or its access is granted to the client's own GitHub account, the Cloudflare Pages project is transferred to a Cloudflare account the client controls, and any environment variables/secrets are rotated post-transfer since they were visible to the delivering team during build.
- [ ] This template library (`websites/` in this repo) is never part of a handoff. Clients get their own generated project, produced by `degit`, with no git history connecting it back to the shared template source.
