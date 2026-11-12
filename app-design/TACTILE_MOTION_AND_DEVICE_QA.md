# Tactile Motion, Apple Feel and Device QA

**Purpose:** Give an app one reliable physical interaction language and a testable native-device acceptance process. Derived from Spread's [motion contract](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/tactile-precision/MOTION_CONTRACT.md), [animation tuning](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/tactile-precision/ANIMATION_TUNING_GUIDE.md), [verification gates](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/tactile-precision/VERIFICATION.md), [Apple design guidance](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/platforms/APPLE_DESIGN_PRINCIPLES.md) and [device pack](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/packs/device-layout.md).

Spread's duration numbers, old Crown gestures, deletion behavior and superseded navigation details are **product-specific and not recommended defaults**.

## Glide / Snap / Settle

| Primitive | Meaning | Check |
| --- | --- | --- |
| **Glide** | Object tracks finger/pointer while actively manipulated | No artificial tween while held; scrolling and swipe directions don't fight |
| **Snap** | One discrete state/value changes after a clear, valid threshold | Bound the step; one cue; no phantom increments or repeated writes |
| **Settle** | Object lands in a deterministic rest position | Damped, interruptible and continuous when input reverses |

Use a clear contract: **contact → immediate visual feedback → direct movement/draft → validation → accepted/refused outcome → settle → accessible result**.

Some interactions validate before a preview, others on release. Whatever the order, **animations never own saved state**. A failed mutation returns to the stored value and announces why. Do not trigger domain writes from frame callbacks or the end of a pretty transition.

Touch begins responding promptly even if an intentional transition takes longer. Keep component identity stable during a move; prefer position/opacity over animating text reflow. Motion must be interruptible without blocking later taps.

## Haptics are semantic, bounded and optional

| Event | Intent | Anti-pattern |
| --- | --- | --- |
| Contact/selection | One light cue on meaningful navigation | Buzzing on incidental scrolling |
| Discrete detent | One cue for accepted increment | Tick every frame or beyond a limit |
| Boundary/refusal | Single rate-limited warning and readable explanation | Repeating boundary haptics |
| Committed success | Confirmation **after store/backend acceptance** | Celebrating a rejected save |
| Destructive edit | Clear UI affordance with approved confirmation or Undo | Invisible gesture-only deletion |

Always provide visual and accessible feedback without haptic hardware. Honor system settings. Simulator recordings cannot verify physical vibration quality.

## Native materials and graphic restraint

- Prefer system navigation, controls and sheets unless a deliberate product requirement justifies custom behavior.
- Separate functional controls/navigation from content surfaces; don't cover every card with translucent glass.
- CSS blur is a web approximation, not identical to native iOS system material.
- Favor strong typography, careful spacing, hairlines and controlled accents over decorating every control.
- Test Reduce Motion, Reduce Transparency, Increase Contrast, VoiceOver and Dynamic Type.
- Keep graphic art and the control layer independent, including when swapping backgrounds.

Apple references: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/), [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) and [SwiftUI animations](https://developer.apple.com/documentation/swiftui/animations).

## Adaptive layout is about available space

- Size the layout based on **available dimensions and safe areas**, not device marketing names or hard-coded screen sizes.
- Apply top/bottom/left/right insets separately; keep functional hit targets in safe interactive regions.
- Test narrow phones, large phones, tablet split view, multitasking, rotation, large text and live resizing.
- For foldable/dual-region layouts, place important controls, sheets and drag targets clear of occluded/hinge areas.
- Wide space should show more useful content, not stretch a phone-sized card absurdly.
- Preserve user selection, scroll position and saved data through rotation, resize, fold, background/foreground.
- Use widths around **390 / 820 / 1024 / 1366 points** as sample visual smoke tests when applicable, **not mandated breakpoints**; confirm current target device and SDK expectations.

## Given / When / Then interaction cases

1. **Given** a panel in motion, **when** a new selection occurs, **then** the previous motion stops cleanly and the new focus settles without a ghost state.
2. **Given** an active drag, **when** the user reverses direction, **then** the object follows without scripted latency.
3. **Given** a stored value at its limit, **when** the user scrubs farther, **then** no invalid write occurs and a reason is shown.
4. **Given** a rejected save, **when** the request finishes, **then** success is not reported and previous valid state is restored.
5. **Given** a drag-only-looking affordance, **when** a screen-reader or keyboard user opens it, **then** an equivalent operation is available.
6. **Given** a long vertical list, **when** horizontal gestures occur in the intended zone, **then** vertical scroll remains usable.
7. **Given** a meaningful Undo, **when** the user invokes it, **then** the entire promised data change is reversed.
8. **Given** rotation, app backgrounding or fold/resize mid-transition, **when** the app resumes, **then** offsets, focus and persistence remain correct.
9. **Given** reduced motion and enlarged text, **when** the flow repeats, **then** all labels and actions remain accessible.

## Verification records

For each meaningful motion change capture **commit SHA, build, OS, physical device, window/posture, same representative data, expected/actual result, screenshot/video, tests and limitations**.

Run unit/integration and device checks. Use simulator for layout; use physical hardware for perceived gesture timing, Taptic feedback, thermal/fps and VoiceOver as needed. Treat missing evidence as **not tested**, not a pass. A green Codemagic job or a still image does not prove native interaction quality.

Use [IOS_PLAYBOOK.md](IOS_PLAYBOOK.md), [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) and [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md) for overall shipment.
