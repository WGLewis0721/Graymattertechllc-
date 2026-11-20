# Seek engine: how Reels are made

Every Reel is built from an approved post, not typed fresh. `content.py reel-spec <post-id>` refuses a post that fails validation, then assembles three scenes: the post's hook, the approved service outcome (`js/data.js`), and the call to action and contact (`ops/marketing/ads/ads.json`). Nobody writes new words for a video.

## Rules the renderer follows
1. **Every frame is a function of time.** `seek(t)` draws frame `t` alone. No timers, CSS transitions, randomness or state from earlier frames. Any frame can be drawn in any order.
2. **Canvas 2D, not DOM.** Chromium caches DOM layers, so frames differed slightly depending on draw order. Canvas redraws everything each call.
3. **Motion is a closed-form spring** (`spring(t,k,c,m)`), so it can be evaluated at any `t`.
4. **Container before text, text out before the next container, first frame never empty.**
5. **Safe zones:** top 16% and bottom 36% of 9:16 stay free of text (app buttons and captions cover them).

## Quality loop
| Step | Command | What it proves |
|---|---|---|
| Pre-render | `reel.js --check` | Same pixels forward, reverse and shuffled; no CSS animations; no text overflow |
| Preview | `reel.js --stills` | Key frames to look at before rendering |
| Encoded file | `review.py` | h264, yuv420p, size, fps, duration, audio track, size under 100 MB; frames each second and around every scene change; contact sheet and phone-size strip |
| Human | open the video | Watch with sound, read on a phone, confirm wording. `review.json` leaves these null until someone does it |

## Output
Files go to `engine/out/` (gitignored): `<post>-9x16.mp4`, `<post>-1x1.mp4`, manifest, spec, review files. Upload the approved ones to Drive "04 - Promo Videos".

## Requirements
Node + Playwright (Chromium), ffmpeg, Python with Pillow. No Remotion, no paid service.
