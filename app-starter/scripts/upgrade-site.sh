#!/usr/bin/env bash
# Non-destructive design preparation for an existing website checkout.
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "Usage: bash app-starter/scripts/upgrade-site.sh <existing-website-dir> --name SiteName --screens 'Home,Services,Contact' --reference /path/original.png" >&2
  exit 2
fi
target="$1"; shift
name=""; screens=""; reference=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) name="${2:-}"; shift 2 ;;
    --screens) screens="${2:-}"; shift 2 ;;
    --reference) reference="${2:-}"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"
docs="$root/../app-design"
[[ -d "$target" ]] || { echo "Existing website folder not found: $target" >&2; exit 3; }
target="$(cd "$target" && pwd)"
[[ -e "$target/index.html" || -e "$target/package.json" || -e "$target/.git" ]] || { echo "Target does not look like a website repository" >&2; exit 3; }
[[ ! -e "$target/design" ]] || { echo "Refusing to overwrite existing design folder" >&2; exit 3; }
[[ -n "$name" && -n "$screens" && -n "$reference" ]] || { echo "--name, --screens, and --reference required" >&2; exit 2; }
[[ ! -e "$target/scripts/check-design.py" ]] || { echo "Existing check-design.py would be overwritten" >&2; exit 3; }
[[ ! -e "$target/.github/workflows/design-gates.yml" ]] || { echo "Existing workflow would be overwritten" >&2; exit 3; }
[[ -d "$target/app-design" ]] && { echo "Existing app-design folder found; preserving it"; } || true
python3 -c "import sys; from PIL import Image; Image.open(sys.argv[1]).verify()" "$reference" || { echo "Provide readable screenshot and install Pillow" >&2; exit 3; }
python3 "$script_dir/init-design.py" --check-only --mode upgrade --name "$name" --kind website --platform web --screens "$screens" --reference "$reference"
[[ -d "$target/app-design" ]] || cp -R "$docs" "$target/app-design"
mkdir -p "$target/scripts" "$target/.github/workflows"
for file in check-design.py render-wireframes.py compare-screenshots.py open-correction.py requirements-design.txt; do
  cp "$script_dir/$file" "$target/scripts/$file"
done
cp "$root/project-automation/design-gates.yml" "$target/.github/workflows/design-gates.yml"
python3 "$script_dir/init-design.py" --mode upgrade --dest "$target" --templates "$docs/templates" --name "$name" --kind website --platform web --screens "$screens" --reference "$reference"
python3 "$target/scripts/render-wireframes.py" --root "$target"
echo "Prepared non-destructive upgrade in $target/design; website source files untouched. Inspect existing source and complete prebuild spec before changes."
