#!/usr/bin/env bash
# Rebuild both promo cuts (1080x1080 square, 1080x1920 vertical) from the three generated clips.
#   bash build.sh <promo_dir>        e.g. bash build.sh ../workflow-automation
# <promo_dir> must contain clips/s1.mp4 clips/s2.mp4 clips/s3.mp4. Needs ffmpeg, python3, numpy, Pillow.
# Fonts (Google Fonts, OFL) and the music (Pixabay Content License) are downloaded, not committed.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
PROMO=$(cd "$1" && pwd)
NAME=$(basename "$PROMO")
REPO=$(cd "$HERE/../../../.." && pwd)
BRAND="$REPO/assets/gray-matter-media-package/brand/approved-reference"
WORK="${WORK:-$(mktemp -d)}"
mkdir -p "$WORK/fonts"

for f in Manrope:800 Inter:500 Inter:600; do  # brand fonts, static TTF per weight
  n=${f%%:*} w=${f##*:}; out="$WORK/fonts/$n-$w.ttf"
  [ -s "$out" ] && continue
  url=$(curl -fsS -A "Mozilla/4.0" "https://fonts.googleapis.com/css2?family=$n:wght@$w" | grep -o 'https://fonts.gstatic.com[^)]*' | head -1)
  curl -fsS -o "$out" "$url"
done

# Music: "Trap Beat" by AtlasAudio (pixabay.com/music/beats-trap-beat-590006), 100 BPM.
# Intro = beats 10-15 of the bass-free opening (ends on a bar line), then the groove from
# 15.061s; it resolves on the downbeat at 18.0s with an echo tail, silence on the final hold.
TRACK="$WORK/trap-beat.mp3"
[ -s "$TRACK" ] || curl -fsS -A "Mozilla/5.0" -e "https://pixabay.com/" -o "$TRACK" \
  "https://cdn.pixabay.com/download/audio/2026/08/21/audio_ca564f6d7a.mp3"
ffmpeg -y -v error -ss 6.661 -t 3.6 -i "$TRACK" -af "afade=t=in:st=0:d=0.04,afade=t=out:st=3.585:d=0.015" -ar 44100 -ac 2 "$WORK/intro.wav"
ffmpeg -y -v error -ss 15.061 -t 15.1 -i "$TRACK" -af "afade=t=in:st=0:d=0.005" -ar 44100 -ac 2 "$WORK/body.wav"
ffmpeg -y -v error -i "$WORK/intro.wav" -i "$WORK/body.wav" -filter_complex \
  "[0][1]concat=n=2:v=0:a=1,aecho=0.8:0.6:140|280:0.35|0.2,afade=t=out:st=18.05:d=0.65,apad=whole_dur=20.4,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:20.4" \
  -ar 44100 "$WORK/music.wav"
python3 "$HERE/sfx.py" "$WORK/sfx.wav" 3.6
ffmpeg -y -v error -i "$WORK/music.wav" -i "$WORK/sfx.wav" -filter_complex \
  "[0:a]atrim=0:20.4[m];[1:a]atrim=0:20.4[s];[m][s]amix=inputs=2:normalize=0,alimiter=limit=0.79:attack=3:release=50:level=0,atrim=0:20.4" \
  -ar 44100 "$WORK/mix.wav"

for fmt in square vertical; do
  rm -rf "$WORK/ov_$fmt"
  python3 "$HERE/build_overlay.py" "$WORK/ov_$fmt" "$BRAND/gm-logo-horizontal-approved.png" "$BRAND/gm-mark-approved.png" "$WORK/fonts" $fmt
  bash "$HERE/assemble.sh" $fmt "$PROMO/clips/s1.mp4" "$PROMO/clips/s2.mp4" "$PROMO/clips/s3.mp4" \
    "$WORK/ov_$fmt" "$WORK/mix.wav" "$PROMO/gm-promo-$NAME-$fmt.mp4"
done
echo "done: $PROMO/gm-promo-$NAME-square.mp4 $PROMO/gm-promo-$NAME-vertical.mp4"
