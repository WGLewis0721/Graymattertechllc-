#!/usr/bin/env bash
set -euo pipefail

# Spin up a new client project from a vertical template.
#
# Usage: scripts/new-client.sh <vertical> <client-slug>
# Example: scripts/new-client.sh barber fade-city-barbershop
#
# Degits templates/<vertical> into clients/<client-slug> — a clean copy
# with no git history back to this template library, matching the
# handoff model in docs/SECURITY.md ("client handoff") — including the
# .github/workflows/deploy.yml, public/.nojekyll, and public/CNAME.example
# the template ships. It then drops in a blank content.json matching
# src/schemas/content.schema.json, with `launched: false`. Every REPLACE
# placeholder must be filled in before this passes the build
# (src/lib/content.ts validates content.json at build time).
#
# This does not create a GitHub repository or touch GitHub Pages
# settings. That happens later, at launch — see docs/DEPLOYMENT.md.

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <vertical> <client-slug>" >&2
  exit 1
fi

VERTICAL="$1"
SLUG="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$ROOT_DIR/templates/$VERTICAL"
DEST_DIR="$ROOT_DIR/clients/$SLUG"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "No template for vertical '$VERTICAL' at $TEMPLATE_DIR" >&2
  echo "Available verticals:" >&2
  ls "$ROOT_DIR/templates" 2>/dev/null >&2 || echo "  (none scaffolded yet)" >&2
  exit 1
fi

if [ -e "$DEST_DIR" ]; then
  echo "$DEST_DIR already exists, refusing to overwrite" >&2
  exit 1
fi

echo "Spinning up $SLUG from templates/$VERTICAL ..."
npx --yes degit "$TEMPLATE_DIR" "$DEST_DIR"

mkdir -p "$DEST_DIR/src/images"

cat > "$DEST_DIR/src/content.json" <<JSON
{
  "hero": {
    "image": "images/REPLACE-hero.jpg",
    "alt": "REPLACE: describe the hero photo"
  },
  "business": {
    "name": "REPLACE Business Name",
    "tagline": "REPLACE tagline",
    "phone": "+1-555-000-0000",
    "email": "owner@example.com",
    "address": "REPLACE street address, city, state zip"
  },
  "hours": [
    { "day": "Mon-Fri", "open": "09:00", "close": "17:00" },
    { "day": "Sat", "open": null, "close": null },
    { "day": "Sun", "open": null, "close": null }
  ],
  "services": [
    { "name": "REPLACE service", "price": "REPLACE price", "duration": "REPLACE duration" }
  ],
  "gallery": [
    { "src": "images/REPLACE-1.jpg", "alt": "REPLACE: describe this photo" }
  ],
  "theme": {
    "fontPairing": "modern-sans",
    "colorScheme": "warm-neutral"
  },
  "formEndpoint": "https://formspree.io/f/REPLACE",
  "seo": {
    "title": "REPLACE Business Name — REPLACE tagline",
    "description": "REPLACE a search-result description, 160 characters or fewer."
  },
  "launched": false
}
JSON

echo "Done. Next steps:"
echo "  1. cd clients/$SLUG"
echo "  2. Replace every REPLACE value in src/content.json (see websites/docs/INTAKE.md)"
echo "  3. EXIF-strip and drop processed photos into src/images/ (scripts/strip-exif.sh)"
echo "  4. npm install && npm run dev"
echo "  5. When ready to review: deploy to the gated Cloudflare Pages preview, not GitHub Pages (docs/DEPLOYMENT.md, stage 1)"
echo "  6. content.json's \"launched\" stays false until docs/DEPLOYMENT.md stage 2, launch"
