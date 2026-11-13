#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: bash app-starter/scripts/new-app.sh <web|ios> <AppName> [output-parent] [--kind app|website] [--screens 'Home,Menu,Contact']" >&2
}
if [[ $# -lt 2 ]]; then usage; exit 2; fi
platform="$1"
name="$2"
shift 2
out="."
screens="Tasks"
kind="app"
parent_seen=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --screens)
      if [[ $# -lt 2 ]]; then usage; exit 2; fi
      screens="$2"; shift 2 ;;
    --kind)
      if [[ $# -lt 2 ]]; then usage; exit 2; fi
      kind="$2"; shift 2 ;;
    --*) usage; exit 2 ;;
    *)
      if [[ "$parent_seen" == 1 ]]; then usage; exit 2; fi
      parent_seen=1; out="$1"; shift ;;
  esac
done
if [[ "$platform" != "web" && "$platform" != "ios" ]]; then echo "Platform must be web or ios" >&2; exit 2; fi
if [[ ! "$name" =~ ^[A-Z][A-Za-z0-9]*$ ]]; then echo "AppName must start with a capital letter and contain only letters/numbers" >&2; exit 2; fi
if [[ "$kind" != "app" && "$kind" != "website" ]]; then echo "Kind must be app or website" >&2; exit 2; fi
script_dir="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"
docs="$root/../app-design"
if [[ ! -d "$docs/templates" ]]; then echo "Expected app-design/ next to app-starter/" >&2; exit 3; fi
python3 -c "from PIL import Image; print('Pillow available for PNG wireframe export')" || { echo "Install Pillow first: python3 -m pip install Pillow" >&2; exit 3; }
python3 "$script_dir/init-design.py" --check-only --name "$name" --platform "$platform" --kind "$kind" --screens "$screens"
mkdir -p "$out"
out="$(cd "$out" && pwd)"
dest="$out/$name"
if [[ -e "$dest" ]]; then echo "Refusing to overwrite: $dest" >&2; exit 3; fi
mkdir -p "$dest"
cp -R "$root/$platform/." "$dest/"
cp -R "$docs" "$dest/app-design"
cp "$root/.editorconfig" "$root/.gitignore" "$dest/"
mkdir -p "$dest/scripts" "$dest/.github/workflows"
for script in check-design.py render-wireframes.py compare-screenshots.py open-correction.py requirements-design.txt; do
  cp "$root/scripts/$script" "$dest/scripts/$script"
done
cp "$root/project-automation/design-gates.yml" "$dest/.github/workflows/design-gates.yml"
python3 "$script_dir/init-design.py" --dest "$dest" --templates "$docs/templates" --name "$name" --platform "$platform" --kind "$kind" --screens "$screens"
python3 "$dest/scripts/render-wireframes.py" --root "$dest"
if [[ "$platform" == "web" ]]; then
  slug="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]')"
  sed -i.bak "s/gray-matter-web-starter/$slug/g" "$dest/package.json"
  rm "$dest/package.json.bak"
  cat > "$dest/README.md" <<TXT
# $name | $kind (Web)

This project is a **starter demonstration, not a finished website/app**. The baseline task UI is a demo and does not implement your requested screens.

1. Complete design/BRIEF.md, PREBUILD_PLAN.md, REFERENCES.md and references.json before coding.
2. Review generated DRAFT PNG/SVG wireframes, then create real Brand Board, UI Kit and each screen's actual design proof.
3. Implement **every requested screen** from design/screens.json as working app code, using real navigation and shared components.
4. Run: python3 scripts/check-design.py --stage design (then build and release as evidence is collected).
5. Run: npm install; npm run test; npm run build; npm run dev.

Do not claim payment, authentication, contact forms or publication are working unless integrated and tested.
TXT
else
  for file in "$dest/project.yml" "$dest/codemagic.yaml" "$dest/Sources/AppEntry.swift" "$dest/Tests/StarterStoreTests.swift"; do
    sed -i.bak "s/GrayMatterStarter/$name/g" "$file"
    rm "$file.bak"
  done
  cat > "$dest/README.md" <<TXT
# $name | Native iOS App

This is a **starter demonstration**, not a completed product. The baseline SwiftUI task screen is a demo, not the requested screen list.

1. Read app-design/DESIGN_TO_BUILD_CONTRACT.md and design/SCREEN_MAP.md.
2. Review draft PNG/SVG wireframes. Deliver actual visual Brand Board, UI Kit and screen proofs, then implement each in SwiftUI.
3. Check: python3 scripts/check-design.py --stage design (then build and release with real evidence).
4. Replace the example bundle ID in project.yml. Run xcodegen generate --spec project.yml on macOS and open $name.xcodeproj.
5. Run XCTest and real-device acceptance. Codemagic is unsigned Simulator compile only.
TXT
fi
printf 'Created %s %s starter: %s\n' "$platform" "$kind" "$dest"
printf 'Required screens: %s\n' "$screens"
printf 'Next: complete design/ then run python3 scripts/check-design.py --stage design\n'
