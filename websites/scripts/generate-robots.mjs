#!/usr/bin/env node
// Regenerates public/robots.txt from content.json's `launched` flag
// before every build (wired as the npm "prebuild" step, which npm runs
// automatically before "build"). This keeps robots.txt and
// BaseLayout's <meta name="robots"> tag driven by the exact same flag,
// so they can never drift out of sync with each other. See
// docs/SECURITY.md, "search visibility", and docs/DEPLOYMENT.md,
// launch checklist step "noindex removed and robots.txt opened up".
//
// Mirrors astro.config.mjs's site/base resolution on purpose — both
// are short and stable enough that a shared module would be more
// ceremony than the duplication it removes (docs/ENGINEERING.md,
// principle 7). Keep the two in sync if either changes.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

const root = fileURLToPath(new URL('..', import.meta.url));
const content =
  readJson(`${root}src/content.json`) ??
  readJson(`${root}examples/demo-client/content.json`) ??
  {};

const launched = content.launched ?? false;
const site = process.env.SITE_URL ?? content.site ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? content.base ?? '/';

const trimmedSite = site.replace(/\/+$/, '');
const trimmedBase = base === '/' ? '' : base.replace(/\/+$/, '');
const baseUrl = `${trimmedSite}${trimmedBase}/`;

const body = launched
  ? `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}sitemap-index.xml\n`
  : `# Pre-launch. See docs/SECURITY.md, "search visibility".\nUser-agent: *\nDisallow: /\n`;

writeFileSync(`${root}public/robots.txt`, body);
console.log(`public/robots.txt written (launched: ${launched})`);
