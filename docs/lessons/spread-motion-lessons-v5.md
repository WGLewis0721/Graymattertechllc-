# Motion lessons from the Spread opening (v5)

Date: 2026-11-16. Project: Spread 30-second product commercial, built in Remotion 4.0.543 with React 19.3.1.
Output: 1080×1920, 30 fps, H.264 + AAC 48 kHz stereo. Only items below were rendered or measured in this project.
Items marked "not verified" were not checked by rendering or by measurement.

## 1. Sources used

| Source | Commit read | What was used | What was not adopted |
|---|---|---|---|
| Vincentwei1021/video-shotcraft | 253ae59 | Recipe cards crane-rise-reveal, speed-ramp-freeze, impact-feedback, crash-zoom-punch, radial-ripple-phone-chips, ui-to-brand-morph; demo TSX for the crash punch, hit counter, ripple and flip; aesthetic-rules; sound-design §4.2–4.6; promo-energy-arc | The Remotion workbench and template (heavier than the project needed). flying-words was read and not used. |
| lemomo-ai/lemo-opuscar | 3a7132b | TECHNIQUE.md pipeline (one timeline, loudness −14 LUFS) | Not installed. Its install tiers add a voice model and sample libraries (roughly 0.5 GB and up) that the lean rule rules out. |
| EveryInc/product-launch-video | 68660ae | SKILL.md storyboard table and the "product in 3 s" rule | Not installed. It overlaps with the existing remotion-video skill and the storyboard step. |
| joeseesun/opus-video-prompts | 7977c80 | Prompts 15 (UI morph loop) and 16 (high-end product video): measured positions, sub-frame motion blur | The banned-effects list (glows, shake, RGB split). It conflicts with a "maximum wow" brief. |
| meetmati-ai/mati-teaser | 47b6e20 | Spring settings for beat reveals (damping 14, stiffness 100–120) | Not used directly. |
| WGLewis0721/remotion-cinematic | b86df2d | Listed only | Not read in depth. |

Installed: `video-shotcraft` skill files (SKILL.md, references, Apache-2.0 LICENSE), 996 KB, 124 recipe cards. Loaded in this session after a refresh. Recipe cards were read in full before use.

## 2. What worked (verified by render and measurement)

1. **Measure the output audio offset for the exact pipeline.** For Remotion 4.0.543 + H.264/AAC 48 kHz at 30 fps, the rendered track sits −0.9 ms from its placed event. The 1.28-frame AAC priming constant in video-shotcraft §4.6 did not reproduce. Re-measure whenever the Remotion version, codec, sample rate or container changes.
2. **Pin every sound by its measured peak, not its file start.** Envelope peaks measured with numpy: `whoosh.wav` 467 ms, `shh.wav` 315 ms, `rustle.wav` 90 ms, `riser.wav` 1095 ms, `boom.wav` 6 ms, `thock.wav` 3 ms, `tick.wav` 2 ms. Pinning a whoosh by its start would have landed it about half a second late.
   `Sequence.from = round((target − peak − outputOffset) × fps)`. Frame rounding caps precision at ±16.7 ms at 30 fps.
3. **Measured sync, render against target** (normalised cross-correlation on the rendered track, confident matches only). Boom −14 ms (frame rounding), riser +9 ms, opening ticks −1 ms and +2 ms, payoff thock −14 ms, payoff chime −14 ms, payoff tick +2 ms.
   Not verified: two chimes (−34 ms and +77 ms) and the quiet whooshes and dense cascades. The chimes sit on whoosh tails and the whooshes match poorly, so those numbers are not trusted.
4. **Global hit-stop on one shared clock.** Two frames (the impact-feedback reference value), applied to the whole hook including the text. The impact reads as physical rather than as one element stuttering.
5. **Crash punch in log space with a damped-cosine return.** Push 1.0 → 1.035 over six frames, then `0.035·exp(−u/2.2)·cos(πu/5.2)`, which overshoots back and settles. Add a 12 px shake with tau 1.8 frames for six frames only. Nothing lingers after the hit.
6. **Time-sampled motion blur without a blur filter.** Draw the moving element three times at t, t−0.022 s and t−0.044 s, with opacity 1, 1/2 and 1/3. This reads as motion in the stills and the render.
7. **Flip-to-line morph** (values from the ui-to-brand-morph demo). Anticipation −10°, +14°, −18°, then 0. scaleX goes to 0.04 with cubic-in over 0.4 s. A bloom spring (damping 11, stiffness 130, mass 0.9) opens it, with the content swapped in at the thinnest point. The block visibly becomes the card.
8. **Kinetic type as the hour stack.** Cream word-blocks land one per accent (5 words, 96 px, 5% of frame height). They read as the sentence building the week. The first caption is the approved line, unchanged.
9. **Keep the hold alive.** Three ripple rings breathe at 1.7 rad phase offsets, the device creeps 2% through the hold, and the lit chips and shape line stay on. A three-layer float shadow (contact, far, ambient) makes the device read as floating.
10. **Never leave the first frame empty.** Start the first cascade inside the frame: five blocks are already in the air at frame 0. Before this change, only two were visible.

## 3. What failed, and what changed

- **Flat first frame:** only two blocks were in view. Fixed by lowering the start-height threshold so the first cascade starts inside the frame.
- **Neon rings too hot:** the highlight glow at alpha 0.9 read as a game HUD. Lowered to 0.55.
- **Shape line too thin:** 12 px with no glow was lost at phone size. Now 16 px with a glow.
- **Payoff names hidden:** names sat at the bottom of each stacked card, so only the front card's name showed. The names now sit in each card's visible header strip.
- **Words overlapped the swing:** the word-blocks crossed the rising phone. They now fade out before the swing begins.
- **Linear punch decay:** it lacked the overshoot in the reference. Fixed with the log-space push and damped cosine (§2.5).

## 4. Deviations from the rules, recorded not silent

- **Energy arc:** the opening is deliberately high-energy. The promo-energy-arc default is a low brand open. This is a recorded deviation for a "maximum wow" brief.
- **Q5, one protagonist in the open:** the hook is a group of hour blocks, used as an abstract motif. The protagonist (the device) arrives at 2.6 s.
- **Q3, no handheld shake:** the 12 px shake is an impact shake, six frames long. It is not camera handheld.
- **Q8, four-side fly-in encircling the wordmark:** the four cards fly in from four sides, but they settle as a stack below the wordmark, not around it.
- **Q11, caption size:** the approved caption pills are 44 px (2.3% of frame height), below the 5% guideline. Not fixed, because the caption style is approved. The word-blocks meet the guideline at 96 px.
- **Q2, rasterise before scaling:** the close-up upscales the 1179 px capture by 1.5×. Possible softness. Not measured.

## 5. Rules to keep (checklist for the next project)

- Measure the output audio offset for the exact pipeline, and record the versions with the number.
- Pin every sound by its measured peak. Accept the ±17 ms frame bound at 30 fps, or move to sub-frame timing if you need better.
- Freeze the whole hook on one clock. Two frames per big impact. At most three whole-frame impacts per film.
- Start the first cascade inside the frame, so the first frame is never empty.
- Give the hold a living element: rings, a creep of 2% or less, or a breathing lit state.
- Keep every name or label inside the visible part of any stacked card.
- Check the render with stills, then with frame extracts from the rendered MP4, then with the sync measurement. A still alone is not enough.

## 6. Reusable snippets (verified in render)

```ts
// Sound timing: pin the measured peak to the picture target.
export const sfxFrom = (targetS: number, file: string, peakS: Record<string, number>, outputOffsetS = -0.0009, fps = 30) =>
  Math.max(0, Math.round((targetS - (peakS[file] ?? 0) - outputOffsetS) * fps));

// Hit-stop on a shared clock: everything that uses tf freezes for HOLD seconds at HIT.
const tField = (t: number, HIT: number, HOLD: number) => (t <= HIT ? t : t <= HIT + HOLD ? HIT : t - HOLD);
const realOf = (tf: number, HIT: number, HOLD: number) => (tf < HIT ? tf : tf + HOLD);

// Crash punch: log-space push, then a damped cosine return (u = frames since the hit).
const punch = t < HIT
  ? Math.exp(Math.log(1.035) * p * p) - 1          // p = eased progress over the six frames before HIT
  : 0.035 * Math.exp(-u / 2.2) * Math.cos((Math.PI * u) / 5.2);

// Time-sampled motion: earlier positions drawn fainter.
[0, 0.022, 0.044].map((d, k) => ({ at: t - d, opacity: [1, 0.5, 1 / 3][k] }));
```

## 7. Open items

- Attention and "wow" were judged by stills and extracts only. A person needs to watch it in motion, and ideally a test audience should.
- The music is a generated placeholder. Its licence is not confirmed.
- The approved middle still shows a third-party brand name in one scene. Demo-data recapture is needed before release.
- The Hallie v7 film and the Grady companion were not reviewed for continuity.
