#!/usr/bin/env bash
# Composite the three clips, the overlay frames and the audio mix into the final MP4.
#   assemble.sh <square|vertical> s1.mp4 s2.mp4 s3.mp4 overlay_dir mix.wav out.mp4
# Timeline (intro 3.6s): S1 starts under the intro dissolve at 3.4s; S1->S2 and S2->S3 are
# 0.4s dissolves centred on the 7.2s and 10.8s beats; the last S3 frame holds under the end card.
set -euo pipefail
FMT=$1 S1=$2 S2=$3 S3=$4 OV=$5 AUD=$6 OUT=$7
DUR=20.4
if [ "$FMT" = vertical ]; then
  # 9:16: square footage centred at y=420 with soft top/bottom edges, over a blurred, darkened fill
  clip() { echo "[$1:v]trim=0:$2,setpts=PTS-STARTPTS,fps=24,split[f$1][b$1];
    [b$1]scale=1920:1920:flags=bicubic,crop=1080:1920,boxblur=40:2,eq=brightness=-0.12:saturation=0.85[g$1];
    [f$1]scale=1080:1080:flags=lanczos,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(Y,1079-Y)/70)'[m$1];
    [g$1][m$1]overlay=0:420,setsar=1,format=yuv420p"; }
else
  clip() { echo "[$1:v]trim=0:$2,setpts=PTS-STARTPTS,scale=1080:1080:flags=lanczos,setsar=1,fps=24,format=yuv420p"; }
fi
ffmpeg -y -v error \
  -i "$S1" -i "$S2" -i "$S3" -framerate 24 -i "$OV/o_%04d.png" -i "$AUD" \
  -filter_complex "
    $(clip 0 4.0),tpad=start_mode=clone:start_duration=3.4[a];
    $(clip 1 4.0)[b];
    $(clip 2 3.8)[c];
    [a][b]xfade=transition=fade:duration=0.4:offset=7.0[ab];
    [ab][c]xfade=transition=fade:duration=0.4:offset=10.6,tpad=stop_mode=clone:stop_duration=6.0[base];
    [base][3:v]overlay=0:0:format=auto,format=yuv420p,trim=0:$DUR[v]" \
  -map "[v]" -map 4:a -t $DUR \
  -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of compact "$OUT"
