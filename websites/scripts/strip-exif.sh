#!/usr/bin/env bash
set -euo pipefail

# Batch-strip EXIF metadata from client intake photos. Mandatory before
# any photo is committed to a client project or uploaded anywhere — see
# docs/SECURITY.md, "client photo hygiene". Phone photos carry EXIF GPS
# data; a storefront or headshot photo can leak a home address.
#
# Usage: scripts/strip-exif.sh <directory-of-photos>
# Example: scripts/strip-exif.sh intake/fade-city-barbershop/photos

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <directory-of-photos>" >&2
  exit 1
fi

DIR="$1"

if [ ! -d "$DIR" ]; then
  echo "$DIR is not a directory" >&2
  exit 1
fi

if ! command -v exiftool >/dev/null 2>&1; then
  echo "exiftool not found. Install it first:" >&2
  echo "  macOS:         brew install exiftool" >&2
  echo "  Debian/Ubuntu: sudo apt install libimage-exiftool-perl" >&2
  exit 1
fi

echo "Stripping EXIF metadata in $DIR ..."
exiftool -all= -overwrite_original -recurse \
  -ext jpg -ext jpeg -ext png -ext heic \
  "$DIR"

echo "Verifying no GPS data remains ..."
if exiftool -recurse -ext jpg -ext jpeg -ext png -ext heic "$DIR" | grep -i "gps"; then
  echo "GPS data still present after stripping. Do not proceed until this is clean." >&2
  exit 1
fi

echo "Clean. Safe to move these photos into a client project."
