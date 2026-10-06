# Promo 1: Workflow Automation

First promo in the service series. Built from Cut B ("The Sizzle") in [storyboard.md](storyboard.md), extended with a title card and an approval scene.

## Files to post

| File | Size | Use |
|---|---|---|
| `gm-promo-workflow-automation-square.mp4` | 1080x1080, 20.4s | Facebook and Instagram feed |
| `gm-promo-workflow-automation-vertical.mp4` | 1080x1920, 20.4s | Reels, Stories, TikTok, Shorts |

Both are H.264 + AAC, 24 fps, about -13 LUFS. The vertical cut keeps every line of text clear of the top 14% and bottom 35% of the frame, where Reels and Stories put their buttons and captions.

Every line of text is burned in, so the video reads with the sound off.

## Suggested post copy

> Still copying the same info into three different places?
>
> Workflow Automation from Gray Matter takes the routine work off your plate: confirmations, follow-ups, order updates, and records that update themselves. And nothing goes out to a customer you haven't approved.
>
> Tell us what needs to change. We figure out the technology.
> graymatterdigitalsolutions.com/services/workflow-automation.html · (334) 652-2601

The storyboard pairs this video with the Facebook launch post for the same service, so post the two together.

Alt text: *Animated promo. Floating chat bubbles swirl with the words "Drowning in DMs?", snap into a glowing line as "Manual" is crossed out for "Automatic.", an order card moves through status steps until an approve switch turns on with "You approve. It sends.", ending on the Gray Matter logo, tagline, website and phone number.*

## Timeline

| Time | Scene | On screen |
|---|---|---|
| 0.0-3.6 | Title card | Brain mark, "Introducing", "Workflow Automation" |
| 3.6-7.2 | Chaos | "Drowning in DMs?" |
| 7.2-10.8 | Chaos becomes order | "Manual" crossed out, then "Automatic." |
| 10.8-14.4 | Approval | "You approve. It sends." |
| 14.4-20.4 | End card | Logo, tagline, website and phone |

## Sources and licences

- **Clips** (`clips/`): Higgsfield, Seedance 2.5, 1080p finals of three drafts (jobs `1b235f1f`, `5668d5c8`, `84e4b412`), 4s each, no audio.
- **Music**: "Trap Beat" by AtlasAudio, [Pixabay](https://pixabay.com/music/beats-trap-beat-590006/), Pixabay Content License (free for commercial and social use, no attribution needed). The track is not stored in this repo. `build.sh` downloads it. Keep a screenshot of the track page in case a platform raises a copyright claim.
- **Fonts**: Manrope and Inter (Google Fonts, SIL OFL), also downloaded at build time.
- **Logo**: the approved artwork from `brand/approved-reference/`, recoloured to off-white for the dark cards and never redrawn.
- **Sound effects**: synthesised by `template/sfx.py`.

## Rebuild

```
bash ../template/build.sh .
```

This rewrites both MP4s from `clips/`. All the text, timing, sound effects and music cut points are in `promo.json`; edit it and rebuild.
