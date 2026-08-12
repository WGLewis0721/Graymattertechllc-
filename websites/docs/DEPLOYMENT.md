# Deployment

Every client site goes live in two stages. GitHub Pages is not touched at all during stage one. Read `docs/SECURITY.md` ("pre-launch confidentiality") for why this split exists before treating any part of it as optional.

The Astro build itself is identical in both stages. Only where the same static output gets deployed changes.

## Stage 1: gated preview

Purpose: let the client see and approve the real, deployed site before anyone else can.

- **Host:** Cloudflare Pages. Connect the client's repository (or push the built `dist/` directly if you're not wiring up Cloudflare's own build). Build command `npm run build`, output directory `dist`.
- **Access control:** Cloudflare Access in front of the Pages project.
  - Create a Cloudflare Access application scoped to the Pages deployment's domain.
  - Policy: allow by email, one-time-code login. Add the client's email address (and anyone else on their side who needs to review) to the allow list.
  - The client does not create an account anywhere. They visit the preview URL, enter their email, receive a one-time code, enter it, and see the site. That's the entire flow from their side.
- **GitHub Pages status during this stage:** disabled. Not "private," disabled. Go check Settings > Pages on the client repo if there's ever doubt; it should say Pages is not enabled. A private repo does not achieve confidentiality on GitHub Pages, see `docs/SECURITY.md`, so don't reach for that as a substitute.
- **`noindex` and `robots.txt`:** still in force. See `docs/SECURITY.md`, "search visibility." Nothing about this stage changes them.
- **Revisions:** the client reviews on this same gated URL. A revision round means rebuilding and redeploying to the same Cloudflare Pages project; the URL doesn't change mid-review.

Nothing in this stage is GitHub-Pages-specific. It's a normal static deploy behind a normal access gate.

## Stage 2: launch

Purpose: put the approved site on GitHub Pages, on the client's real domain, publicly.

Do not start stage two until the client has explicitly signed off on the stage-one preview.

### 1. Configure `site` and `base` in `astro.config.mjs`

This has to be set correctly before the first Pages build, because it affects every internal link Astro generates.

- **Custom domain** (e.g. `fadecitybarbershop.com`): 
  ```js
  export default defineConfig({
    site: 'https://fadecitybarbershop.com',
    base: '/',
  });
  ```
- **`username.github.io/repo` URL** (no custom domain): 
  ```js
  export default defineConfig({
    site: 'https://username.github.io',
    base: '/fade-city-barbershop',
  });
  ```
  Every internal link and asset reference must respect this base path. Use Astro's own base-aware helpers (root-relative links via Astro's built-in base handling, `import.meta.env.BASE_URL` where a raw path is unavoidable) rather than hardcoding `/` as the link root. A link that ignores `base` works in local dev and breaks the moment it's deployed under a repo subpath.

### 2. Confirm `public/.nojekyll` is present

GitHub Pages runs Jekyll by default, and Jekyll ignores any path starting with an underscore, which includes Astro's `_astro/` output directory. A `.nojekyll` file in `public/` (which Astro copies to the build root) turns Jekyll off entirely. `withastro/action` normally adds this automatically during the deploy, but commit the file to the repo anyway so it's true even if someone builds and deploys by a different path later.

### 3. Add `public/CNAME`, custom-domain clients only

A single line, the domain, nothing else:

```
fadecitybarbershop.com
```

Do not add this file before stage two. Its absence during stage one is part of the deliberate signal that the site isn't on GitHub Pages yet (see `docs/ENGINEERING.md`, definition of done). For a `username.github.io/repo` deployment with no custom domain, there is no CNAME file at all, ever.

### 4. DNS records

Give these to whoever holds the client's domain registrar access (confirmed during intake, see `docs/INTAKE.md`).

**Apex domain** (`fadecitybarbershop.com`, no `www`): four `A` records, all at the apex:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optionally, four `AAAA` records for IPv6, also at the apex:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**`www` subdomain**, if used: one `CNAME` record pointing at `username.github.io`.

DNS changes take time to propagate. Don't schedule "Enforce HTTPS" (next step) for the same hour as the DNS change; check propagation first.

### 5. Enable GitHub Pages on the client repo

Settings > Pages > Source: GitHub Actions (not "Deploy from a branch"). This is what makes the Actions workflow below the thing that actually publishes the site.

### 6. The GitHub Actions workflow

Uses `withastro/action`, which has a `path` input for pointing the build at a project that lives in a subdirectory rather than the repo root. For a standard client repo (the Astro project at repo root), `path` is `.`. Minimal shape:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
```

This only starts actually publishing once step 5 (Source: GitHub Actions) is set. Before that, this workflow can exist in the repo and run, it just has nowhere to deploy to.

### 7. Enforce HTTPS

Settings > Pages > Enforce HTTPS. Turn this on only after DNS has propagated and GitHub has finished issuing the Let's Encrypt certificate for the domain (the checkbox is unavailable, or will fail, if you try too early). Recheck a few hours after the DNS step if it's not immediately available.

### 8. Flip `noindex` off

Remove the `<meta name="robots" content="noindex, nofollow">` tag (or change it to an indexable value) and update `robots.txt` from disallow-all to allow. This is a content change like any other: commit it, let the Actions workflow rebuild and redeploy. It does not happen automatically at any other step in this process, it is a deliberate, explicit action taken only once everything else above is confirmed live and correct.

### Launch checklist, in order

- [ ] Client has signed off on the stage-one gated preview.
- [ ] `site` and `base` set correctly in `astro.config.mjs` for the actual target (custom domain vs. `username.github.io/repo`).
- [ ] `public/.nojekyll` present and committed.
- [ ] `public/CNAME` added, custom-domain clients only, containing exactly the domain.
- [ ] DNS records handed to the client/registrar and propagation confirmed.
- [ ] GitHub Pages enabled on the client repo, Source: GitHub Actions.
- [ ] Actions workflow present and its first deploy run has succeeded.
- [ ] Enforce HTTPS turned on, after confirming DNS propagation and certificate issuance.
- [ ] `noindex` removed and `robots.txt` opened up, committed and redeployed.
- [ ] Final spot check of the live domain: loads over HTTPS, phone/directions/form all work, Lighthouse mobile still 95+/100 against the real live URL.
