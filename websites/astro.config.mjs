import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// GitHub Pages correctness: `site` and `base` must be right before the
// first build, since Astro bakes `base` into every generated internal
// link, asset path, and the sitemap. Get this wrong and every link on
// the deployed site 404s. See docs/DEPLOYMENT.md, stage 2, step 1.
//
// Precedence: SITE_URL / BASE_PATH env vars (set per-repo in that
// client's GitHub Actions workflow, so the same template source needs
// no editing to target a different domain) win over content.json's own
// `site` / `base` fields, which win over a local dev default. A real
// client project keeps its content at src/content.json; this shared
// frame has no such file yet (no vertical template exists), so it
// falls back to examples/demo-client/content.json to keep this build
// exercising the same resolution path a real client repo will use.
function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

const root = fileURLToPath(new URL('.', import.meta.url));
const content =
  readJson(`${root}src/content.json`) ??
  readJson(`${root}examples/demo-client/content.json`) ??
  {};

const site = process.env.SITE_URL ?? content.site ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? content.base ?? '/';
const launched = content.launched ?? false;

export default defineConfig({
  site,
  base,
  // GitHub Pages serves static files only. No adapter, no SSR, ever.
  output: 'static',
  integrations: [
    // Only generate a sitemap once launched — pre-launch, robots.txt
    // disallows everything anyway (scripts/generate-robots.mjs), so an
    // unlinked sitemap.xml in the build output would just be dead
    // bytes with no purpose. Respects `site` + `base` automatically.
    ...(launched ? [sitemap()] : []),
  ],
});
