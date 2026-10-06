# Promo 2: Gray Matter, Your TechOps Studio

Brand introduction. It says what Gray Matter is and gives "TechOps studio" a meaning: websites, systems, automation, operations and security, handled in one place. The plan it was built from is in [plan.md](plan.md).

## Files to post

| File | Size | Use |
|---|---|---|
| `gm-promo-techops-studio-square.mp4` | 1080x1080, 24.0s | Facebook and Instagram feed |
| `gm-promo-techops-studio-vertical.mp4` | 1080x1920, 24.0s | Reels, Stories, TikTok, Shorts |

Both are H.264 + AAC, 24 fps, about -14 LUFS. Every line of text is burned in, so the video reads with the sound off. In the vertical cut, all text stays clear of the top 14% and bottom 35% of the frame, where the apps put their buttons and captions.

## Post copy

> Gray Matter is a TechOps studio for businesses that know something needs to work better, but don't necessarily know what the fix looks like yet.
>
> Websites. Systems. Automation. Operations. Security.
>
> TechOps is the technology side of how your business runs, handled in one place: the website your customers see, the systems and automations behind it, and the everyday operations and security that keep it all working.
>
> You tell us what needs to change. We figure out the technology, build it, test it, and hand it over. Nothing starts until you approve the scope, price and timeline.
>
> graymatterdigitalsolutions.com/about.html#techops · (334) 652-2601

The link goes to the "What TechOps Means" section of the About page, which explains each of the five words and links to the matching service.

Alt text: *Animated brand video. A title card reads "Meet Gray Matter, Your TechOps Studio". A glowing knot of threads twists with the words "It should work better.", then unravels into straight lanes of light as "Don't know the fix yet?" becomes "That's our job." Five icons appear below the lanes, and the words Websites, Systems, Automation, Operations and Security appear one by one under "TechOps means", each underlining its icon. It ends on the Gray Matter logo, the five words, the tagline "Tell us what needs to change. We figure out the technology.", the website and the phone number.*

## Timeline

| Time | Scene | On screen |
|---|---|---|
| 0.0-4.0 | Title card | Brain mark, "Meet Gray Matter", "Your TechOps Studio" (over the song's calm bars) |
| 4.0-8.0 | The feeling | "It should work better." (the music builds) |
| 8.0-12.0 | The turn | "Don't know the fix yet?" swaps to "That's our job." |
| 12.0-18.0 | What TechOps means | The bass drops back in. "TechOps means", then Websites. Systems. Automation. Operations. Security., one every 1.5 beats with a rising chime and a mint underline under its icon |
| 18.0-24.0 | End card | Logo, the five words, tagline, website and phone; the music resolves on a downbeat and ends just before the cut |

## Sources

- **Clips**: Higgsfield, Seedance 2.5, 480p drafts finalized at 1080p, no audio, 255 credits in total (jobs `9dc01825`, `9074578e`, `bcc573a3`). They are anchored on two shared frames, the knot and the straight lanes (Seedance `omni_reference` start and end images), so the three clips flow into each other.
  - Clip 1 ends pushed in on the knot, so `clips/s2.mp4` starts zoomed in to match it exactly, then pulls back to full frame before the knot unravels. The unedited clip is `clips/raw/s2.mp4`:

    ```
    python3 ../template/reframe_clip.py clips/raw/s2.mp4 clips/s2.mp4 --length 4.45 --from-scale 1.65 --from-x0 218.7 --from-y0 159.5 --reach 1.6
    ```

    `s1.mp4` and `s3.mp4` are used as generated.
- **Music**: "Hip Hop - Upbeat" by MusicForPeople (Pixabay track 491996, Pixabay Content License), 90 BPM. The cut runs from 52.14s to the bar 27 downbeat at 74.81s: calm bars under the title card, the build under scenes 1 and 2, and the bass drop (64.14s in the track) on the five words. The track is not stored in the repo (the licence doesn't allow sharing it as a standalone file). Download it from Pixabay and pass it to the build.
- **Fonts**: Manrope and Inter (Google Fonts, SIL OFL), downloaded at build time.
- **Logo**: the approved artwork from `brand/approved-reference/`, recoloured for the dark cards and never redrawn.

## Rebuild

```
MUSIC_FILE=/path/to/musicforpeople-hip-hop-upbeat-491996.mp3 bash ../template/build.sh .
```

All the text, timing, sound effects and music cut points are in `promo.json`.
