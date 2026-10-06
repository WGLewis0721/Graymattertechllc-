#!/usr/bin/env bash
# Rebuild a promo's square (1080x1080) and vertical (1080x1920) cuts from its clips.
#   bash build.sh <promo_dir>        e.g. bash build.sh ../workflow-automation
# <promo_dir> holds promo.json and clips/s1.mp4 ... sN.mp4 (one per scene).
# Needs ffmpeg, python3, numpy, Pillow. Fonts (Google Fonts, OFL) and the music
# (Pixabay Content License) are downloaded at build time, not committed.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
PROMO=$(cd "$1" && pwd)
NAME=$(basename "$PROMO")
WORK="${WORK:-$(mktemp -d)}"
mkdir -p "$WORK/fonts"
cfg() { python3 -c "import json,sys; c=json.load(open('$PROMO/promo.json')); print(eval(sys.argv[1]))" "$1"; }

for f in Manrope:800 Inter:500 Inter:600; do  # brand fonts, static TTF per weight
  n=${f%%:*} w=${f##*:}; out="$WORK/fonts/$n-$w.ttf"
  [ -s "$out" ] && continue
  url=$(curl -fsS -A "Mozilla/4.0" "https://fonts.googleapis.com/css2?family=$n:wght@$w" | grep -o 'https://fonts.gstatic.com[^)]*' | head -1)
  curl -fsS -o "$out" "$url"
done

# Music: one bar-aligned intro section, then the groove; it resolves on a downbeat with an
# echo tail, leaving silence on the end card's final hold. Cut points live in promo.json.
# Pass MUSIC_FILE=/path/to/track.mp3 to use a local copy; otherwise music.url is downloaded.
TRACK="${MUSIC_FILE:-$WORK/$(cfg "c['music']['file']")}"
if [ ! -s "$TRACK" ]; then
  URL=$(cfg "c['music'].get('url', '')")
  [ -n "$URL" ] || { echo "Music not found: download $(cfg "c['music']['title']") and run with MUSIC_FILE=/path/to/it" >&2; exit 1; }
  curl -fsS -A "Mozilla/5.0" -e "https://pixabay.com/" -o "$TRACK" "$URL"
fi
INTRO=$(cfg "c['intro']['duration']")
TOTAL=$(cfg "round(c['intro']['duration'] + sum(s['duration'] for s in c['scenes']) + c['end_card']['duration'], 3)")
RESOLVE=$(cfg "c['music']['resolve']")
BODYLEN=$(python3 -c "print(round($RESOLVE + 0.7, 3))")
FADE=$(python3 -c "print(round($INTRO + $RESOLVE + 0.05, 3))")
ffmpeg -y -v error -ss "$(cfg "c['music']['intro_from']")" -t "$INTRO" -i "$TRACK" \
  -af "afade=t=in:st=0:d=0.04,afade=t=out:st=$(python3 -c "print(round($INTRO - 0.015, 3))"):d=0.015" -ar 44100 -ac 2 "$WORK/intro.wav"
ffmpeg -y -v error -ss "$(cfg "c['music']['body_from']")" -t "$BODYLEN" -i "$TRACK" -af "afade=t=in:st=0:d=0.005" -ar 44100 -ac 2 "$WORK/body.wav"
ffmpeg -y -v error -i "$WORK/intro.wav" -i "$WORK/body.wav" -filter_complex \
  "[0][1]concat=n=2:v=0:a=1,aecho=0.8:0.6:140|280:0.35|0.2,afade=t=out:st=$FADE:d=0.65,apad=whole_dur=$TOTAL,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:$TOTAL" \
  -ar 44100 "$WORK/music.wav"
python3 "$HERE/sfx.py" "$PROMO" "$WORK/sfx.wav"
GAIN=$(cfg "c['music'].get('mix_gain_db', 0)")  # trims a dense track down to the series' loudness
VOL=$([ "$GAIN" = "0" ] || echo "volume=${GAIN}dB,")
ffmpeg -y -v error -i "$WORK/music.wav" -i "$WORK/sfx.wav" -filter_complex \
  "[0:a]atrim=0:$TOTAL[m];[1:a]atrim=0:$TOTAL[s];[m][s]amix=inputs=2:normalize=0,${VOL}alimiter=limit=0.79:attack=3:release=50:level=0,atrim=0:$TOTAL" \
  -ar 44100 "$WORK/mix.wav"

for fmt in square vertical; do
  rm -rf "$WORK/ov_$fmt"
  python3 "$HERE/build_overlay.py" "$PROMO" "$WORK/ov_$fmt" "$WORK/fonts" $fmt
  python3 "$HERE/assemble.py" "$PROMO" $fmt "$WORK/ov_$fmt" "$WORK/mix.wav" "$PROMO/gm-promo-$NAME-$fmt.mp4"
done
echo "done: $PROMO/gm-promo-$NAME-square.mp4 $PROMO/gm-promo-$NAME-vertical.mp4"
