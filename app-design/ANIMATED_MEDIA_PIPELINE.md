# Animated App Artwork | From Keyframe to Verified Playback

**Purpose:** Build a genuinely animated, performant visual component. This applies to app hero animation, living illustrations, tiny video scenes, cinematic cards and branded motion. It does **not** require animation on every screen.

**Adapted from:** [Arooma Animated Scent World pipeline](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/brand/ANIMATED_SCENT_WORLD_PIPELINE.md). Its bottle-contained scene, exact aspect ratio, 6–10 second length, named render model and three-region motion threshold were **Arooma-specific acceptance requirements**, not platform-wide defaults.

## 1. Decide what actually moves

Write a short scene contract:

- **Purpose:** What user emotion, information or affordance does the motion support?
- **Static anchors:** Which elements must remain stable (logo, real content labels, frame, navigation, product identity)?
- **Dynamic regions:** Which parts of the scene move independently and how?
- **Interaction state:** When does playback start, pause, stop, or become interactive?
- **Fallback:** What shows in Reduce Motion, low-power, unavailable-codec, no-media and offline states?
- **Performance:** Pixel size, aspect, frame rate, loop behavior, memory/power budget appropriate to target device.

A static keyframe with a global zoom, artificial camera shake, border shimmer or a moving overlay must not be described as a cinematic scene with independent internal action.

## 2. Production pipeline

1. **Research and clear media.** Verify subject, source/brand rights and whether a photo or video is allowed in this particular use.
2. **Design one approved composition.** Set a stable frame, clear visual hierarchy, focal region, safe crop and static elements.
3. **Make a high-quality still keyframe.** Confirm subject geometry, copy, color, reflections and lighting before animation.
4. **Create a shot list.** Name each meaningful moving subject/region and its direction, timing, continuity, and allowed camera movement.
5. **Generate or animate real frames.** Image-to-video tools such as Higgsfield can be used, but an accepted prompt or queued job is not a completed video file.
6. **Inspect motion across time.** Review start/middle/end frames; confirm the required internal subject actually changes over time, not just a generic transform or small flicker.
7. **Composite deliberately.** Keep dynamic media below **separate** native interactive text, controls, frames or material overlays. Do not apply an incompatible shader to the decoded video layer merely to decorate the card.
8. **Export real media and a matching poster.** The poster should correspond to the delivered video rather than an unrelated generator preview; retain source video and provenance.
9. **Integrate in the actual app.** Register and bundle files or implement a tested remote-loading policy, including genuine offline behavior if claimed.
10. **Verify on target hardware.** Test playback lifecycle, decoded frames, loop seam, CPU/GPU use, thermal/power, memory, resizing, accessibility, and release packaging.

## 3. Track the actual delivery state

| Status | Permitted claim |
| --- | --- |
| Brief / prompt | Only the desired animation is specified |
| Keyframe / poster | A **static** visual is available |
| Generation in progress | A render was requested; no usable media yet |
| MP4 or other video produced | A media file exists, but not necessarily a good loop or integrated app feature |
| Integrated and tested | Actual decoding/playback and state gating verified in the target build |
| Released | Published version verified independently after release |

Use [templates/ASSET_JOB_MANIFEST.md](templates/ASSET_JOB_MANIFEST.md) to record asset status, model/tool, checksums and source. Do not replace a blocked video requirement with a static poster plus shader and claim animation is complete.

## 4. Native layering and lifecycle

For an iOS experience:

- Keep native video playback (for example, an AVPlayer-based layer) distinct from SwiftUI/Metal effects that draw gloss, border or foil. Shader compatibility with decoded video must be tested, not assumed.
- Loop only when the animation should be visible and useful; pause when offscreen, unfocused, flipped, behind a modal, app inactive, or Reduce Motion is enabled.
- Preserve touch targets, accessibility actions and accurate live information above the visual layer.
- Honor mute/autoplay policies and provide safe fallback artwork when the player fails or hardware is constrained.
- An animation that must be available offline must be **bundled or reliably cached with verified offline availability**, not linked only through a development URL.
- Keep the actual source of truth for app state separate from playback status and decorative geometry.

For web, test codec/browser support, network/data costs, lazy loading, autoplay restrictions and an accessible poster fallback.

## 5. Objective media QA

For the finished file, record metadata with tools such as ffprobe or equivalent: codec, duration, dimensions, frame rate and audio. Compare sampled frames, verify expected moving regions, label/frame registration, safe crop, first/last-frame continuity and actual decoded motion.

Track SHA-256 checksums and verify that the package or app bundle contains the **real media** with matching path/hash. Test the final release artifact, not merely a local preview. Measure performance on representative hardware.

### Definition of done

- [ ] A genuine video/animated asset exists, and its content fulfills the shot list.
- [ ] The static anchors remain stable; real motion is visible in approved regions.
- [ ] Exported file and matching poster are linked to an asset manifest.
- [ ] Playback is gated by focus, visibility, app lifecycle, user preferences and offline policy.
- [ ] No visual effect interferes with content, gestures or video decoding.
- [ ] Final packaged artifact contains the media it claims to ship.
- [ ] Target-device playback and accessibility are tested, or honestly marked unverified.

See [TACTILE_MOTION_AND_DEVICE_QA.md](TACTILE_MOTION_AND_DEVICE_QA.md) and [IOS_PLAYBOOK.md](IOS_PLAYBOOK.md). Motion polish without functional truth is not a deliverable.
