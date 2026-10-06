# Service promo videos

One short promo per service, all built from the same template so the series matches.

| Promo | Folder |
|---|---|
| 1. Workflow Automation | [workflow-automation/](workflow-automation/) |

## How a promo is made

1. **Three clips in Higgsfield.** Generate them as Seedance 2.5 480p drafts (12 credits each), check them, then finalize at 1080p (48 credits each). Use 1:1, 4 seconds, no audio. Start every prompt with this exact style prefix so the clips cut together:

   > cinematic 3D motion graphic, deep navy background #152238, cobalt blue #2F64D6 gradient light trails, soft mint and gold accents, fluid slow camera drift, premium depth of field, ultra clean, Apple keynote style, square 1:1 framing, no readable text, no letters, no logos, UI elements show abstract bars instead of words

   AI video garbles lettering, so all words and the logo are added in editing.

2. **Save the clips** as `<service>/clips/s1.mp4`, `s2.mp4` and `s3.mp4`. The scenes are: the owner's pain, chaos becoming order, and the service's signature moment.

3. **Build** with `bash template/build.sh <service>`. It writes the square (1080x1080) and vertical (1080x1920) cuts into the service folder.

## The template

- `template/build_overlay.py` draws the text and cards. The service name, tagline and contact line are at the top of the file. The scene text and its timing are in `body()`.
- `template/sfx.py` makes the sound effects.
- `template/assemble.sh` dissolves the clips together and lays the text, cards and audio on top.
- `template/build.sh` runs the whole build. It downloads the fonts and the music, then renders both formats.

Everything is timed to a 100 BPM grid (0.6s per beat), so cuts land on the beat. The intro card is 3.6s, each scene is 3.6s and the end card is 6.0s, for 20.4s in total.

For each new service, change `SERVICE`, the scene lines in `body()`, the sound-effect times in `sfx.py` (they follow the steps in that service's clips) and `TOGGLE_ON`, the moment the S3 clip has its signature change. If you use a different music track, re-measure its beats and replace the music section of `build.sh`.

Rules from the storyboard: one line of text per scene, no hard cuts, the real logo only, and contact details exactly as on the website.
