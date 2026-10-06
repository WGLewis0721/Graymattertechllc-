# Promo videos

Short promos for Gray Matter, all built from the same template so the series matches.

| Promo | Folder |
|---|---|
| 1. Workflow Automation | [workflow-automation/](workflow-automation/) |
| 2. Gray Matter, Your TechOps Studio | [techops-studio/](techops-studio/) |

## How a promo is made

1. **Generate one clip per scene in Higgsfield.** Use 1:1, no audio. Start every prompt with this exact style prefix so the clips cut together:

   > cinematic 3D motion graphic, deep navy background #152238, cobalt blue #2F64D6 gradient light trails, soft mint and gold accents, fluid slow camera drift, premium depth of field, ultra clean, Apple keynote style, square 1:1 framing, no readable text, no letters, no logos, UI elements show abstract bars instead of words

   AI video garbles lettering, so all words and the logo are added in editing. Starting each clip from the last frame of the one before (`start_image`) makes the scenes flow into each other.

   | Model | Cost per 4s clip | Used for |
   |---|---|---|
   | Seedance 2.5 (480p draft, then 1080p final) | 12 + 48 | Promo 1 |
   | Kling 3.0 pro, 1080p | 7 | Promo 2 |

2. **Save the clips** as `<promo>/clips/s1.mp4`, `s2.mp4` and so on, one per scene. If a clip has something the promo can't use, `template/reframe_clip.py` can trim its start and push in slowly to frame it out (promo 2's clip 3 is the example).

3. **Write `<promo>/promo.json`.** It holds the intro card text, each scene's length and on-screen text, the end card, the music cut points and the sound effects. Copy the nearest existing one and edit it.

4. **Build** with `bash template/build.sh <promo>`. It writes the square (1080x1080) and vertical (1080x1920) cuts into the promo folder.

## The template

- `template/build.sh` runs the whole build. It downloads the fonts and the music, makes the audio mix, then renders both formats.
- `template/build_overlay.py` draws the intro card, the scene text and the end card. The scene text types are documented at the top of the file:
  - `words`: the line appears word by word
  - `swap`: one line is replaced by another, optionally struck out first
  - `accent`: half of the line turns mint on cue
  - `sequence`: one word at a time under a small label
- `template/sfx.py` makes the sound effects listed in `promo.json`.
- `template/assemble.py` dissolves the clips together and lays the text, cards and audio on top.
- `template/reframe_clip.py` trims a clip and pushes in on it without jitter.

Everything is timed to a 100 BPM grid (0.6s per beat), so cuts land on the beat. The intro card is 3.6s, scenes are whole bars or beats, and the end card is 6.0s. In the vertical cut, the scene text sits at y=1160, inside the area Reels and Stories leave clear. `vertical_footage_y` in `promo.json` moves the footage up or down if it crowds the text.

Rules from the storyboard: one line of text per scene, no hard cuts, the real logo only (recoloured for dark backgrounds, never redrawn), and contact details exactly as on the website.
