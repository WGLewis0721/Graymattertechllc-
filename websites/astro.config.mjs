import { defineConfig } from 'astro/config';

// Static output, zero JS by default. Client sites deploy to Cloudflare Pages
// as static files; islands are opt-in per component, never global.
export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // astro:assets default (sharp) covers the responsive image generation
    // every shared component relies on. Do not swap this without checking
    // the performance budget in docs/ENGINEERING.md.
  },
});
