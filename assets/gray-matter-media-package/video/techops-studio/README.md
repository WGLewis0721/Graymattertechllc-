# Promo 2: Gray Matter, Your TechOps Studio

Brand introduction. It says what Gray Matter is and gives "TechOps studio" a meaning: websites, systems, automation, operations and technology, handled in one place. The plan it was built from is in [plan.md](plan.md).

## Files to post

| File | Size | Use |
|---|---|---|
| `gm-promo-techops-studio-square.mp4` | 1080x1080, 22.8s | Facebook and Instagram feed |
| `gm-promo-techops-studio-vertical.mp4` | 1080x1920, 22.8s | Reels, Stories, TikTok, Shorts |

Both are H.264 + AAC, 24 fps, about -13 LUFS. Every line of text is burned in, so the video reads with the sound off. In the vertical cut, all text stays clear of the top 14% and bottom 35% of the frame, where the apps put their buttons and captions.

## Post copy

> Gray Matter is a TechOps studio for businesses that know something needs to work better, but don't necessarily know what the fix looks like yet.
>
> Websites. Systems. Automation. Operations. Technology.
>
> TechOps is the technology side of how your business runs, handled in one place: the website your customers see, the systems and automations behind it, and the everyday tech that keeps it all working.
>
> You tell us what needs to change. We figure out the technology, build it, test it, and hand it over. Nothing starts until you approve the scope, price and timeline.
>
> graymatterdigitalsolutions.com/about.html#techops · (334) 652-2601

The link goes to the "What TechOps Means" section of the About page, which explains each of the five words and links to the matching service.

Alt text: *Animated brand video. A title card reads "Meet Gray Matter, Your TechOps Studio". A glowing knot of threads twists with the words "It should work better.", then unravels into straight lanes of light as "Don't know the fix yet?" becomes "That's our job." Five icons appear along the lanes as the words Websites, Systems, Automation, Operations and Technology appear one by one under "TechOps means". It ends on the Gray Matter logo, the five words, the tagline "Tell us what needs to change. We figure out the technology.", the website and the phone number.*

## Timeline

| Time | Scene | On screen |
|---|---|---|
| 0.0-3.6 | Title card | Brain mark, "Meet Gray Matter", "Your TechOps Studio" |
| 3.6-7.2 | The feeling | "It should work better." |
| 7.2-10.8 | The turn | "Don't know the fix yet?" swaps to "That's our job." |
| 10.8-16.8 | What TechOps means | "TechOps means", then Websites. Systems. Automation. Operations. Technology. One rising chime per word, on the music's drop |
| 16.8-22.8 | End card | Logo, the five words, tagline, website and phone |

## Sources

- **Clips**: Higgsfield, Kling 3.0 pro, 1080p, no audio, 24.5 credits for all three. Each clip starts from the last frame of the one before (jobs `351f90e4`, `c1fa420a`, `e19f93c9`).
  - Clip 3 rendered a sixth icon (a second shield). `clips/s3.mp4` drops the first second and slowly pushes in on the frame so that icon never appears:

    ```
    python3 ../template/reframe_clip.py clips/raw/s3.mp4 clips/s3.mp4 --head 1.0 --length 6.2 --to-scale 1.3 --x0 0 --y0 240 --reach 3.8
    ```

    The unedited clip 3 is kept as `clips/raw/s3.mp4`. `s1.mp4` and `s2.mp4` are used as generated.
- **Music**: the same track as promo 1, "Trap Beat" by AtlasAudio ([Pixabay](https://pixabay.com/music/beats-trap-beat-590006/), Pixabay Content License). The track is not stored in the repo; `build.sh` downloads it.
- **Fonts**: Manrope and Inter (Google Fonts, SIL OFL), downloaded at build time.
- **Logo**: the approved artwork from `brand/approved-reference/`, recoloured for the dark cards and never redrawn.

## Rebuild

```
bash ../template/build.sh .
```

All the text, timing, sound effects and music cut points are in `promo.json`.
