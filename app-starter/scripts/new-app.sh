#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: bash app-starter/scripts/new-app.sh <web|ios> <AppName> [output-parent]" >&2
  exit 2
fi
platform="$1"
name="$2"
out="."
if [[ $# -eq 3 ]]; then out="$3"; fi
if [[ "$platform" != "web" && "$platform" != "ios" ]]; then
  echo "Platform must be web or ios." >&2; exit 2
fi
if [[ ! "$name" =~ ^[A-Z][A-Za-z0-9]*$ ]]; then
  echo "App name must start with a capital letter and contain letters/numbers only." >&2; exit 2
fi

script_dir="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"
docs="$root/../app-design"
if [[ ! -d "$docs/templates" ]]; then
  echo "app-design/ was not found beside app-starter/." >&2; exit 3
fi
mkdir -p "$out"
out="$(cd "$out" && pwd)"
dest="$out/$name"
if [[ -e "$dest" ]]; then
  echo "Refusing to overwrite: $dest" >&2; exit 3
fi
mkdir -p "$dest"
cp -R "$root/$platform/." "$dest/"
cp -R "$docs" "$dest/app-design"
cp "$root/.editorconfig" "$root/.gitignore" "$dest/"

if [[ "$platform" == "web" ]]; then
  slug="$(printf "%s" "$name" | tr '[:upper:]' '[:lower:]')"
  sed -i.bak "s/gray-matter-web-starter/$slug/g" "$dest/package.json"
  rm "$dest/package.json.bak"
  printf "# %s (Web)\n\nGenerated with Gray Matter App Starter.\n\nCommands: npm install, npm run test, npm run build, npm run dev.\n\nFill out app-design/templates/PROJECT_BRIEF.md. Data is local-only.\n" "$name" > "$dest/README.md"
else
  for file in "$dest/project.yml" "$dest/codemagic.yaml" "$dest/Sources/AppEntry.swift" "$dest/Tests/StarterStoreTests.swift"; do
    sed -i.bak "s/GrayMatterStarter/$name/g" "$file"
    rm "$file.bak"
  done
  printf "# %s (iOS)\n\nGenerated with Gray Matter App Starter.\n\n1. Replace the example bundle ID in project.yml.\n2. Run xcodegen generate --spec project.yml on macOS.\n3. Open %s.xcodeproj and test on real devices.\n4. Codemagic compiles an unsigned Simulator build only.\n5. Fill out app-design/templates/PROJECT_BRIEF.md.\n" "$name" "$name" > "$dest/README.md"
fi
echo "Created $platform project: $dest"
