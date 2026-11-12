# Native iPhone / iPad App Development

**Default native stack:** Swift + SwiftUI, system accessibility, Apple platform conventions and native persistence. React UI catalog resources are **inspiration**, not SwiftUI packages. Optional native sources are cataloged in [NATIVE_UI_REFERENCES.md](NATIVE_UI_REFERENCES.md), and the detailed [motion/haptic/device test guide](TACTILE_MOTION_AND_DEVICE_QA.md) adapts useful methods from Spread.

## Design and architecture

- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/
- iPhone Duo and resizable layout guidance where applicable: https://developer.apple.com/iphone-duo/prepare/
- Design navigation, safe areas, sheets, gestures, keyboard, Dynamic Type, VoiceOver, light/dark and reduced motion before visual polish.
- Separate model, domain rules, persistence, services and SwiftUI state. Avoid multiple authoritative copies of hours, tasks, payments or records.
- Choose local-first vs server-first deliberately. For sync, specify offline writes, merge/conflict handling, retries, account transitions and deletion.
- A flying card is a visual interaction; persistent deletion and undo remain separately testable actions.
- Set product-specific design tokens and graphical assets. Prefer native patterns unless a custom control produces clear user value.

## Editorial visual identity

For collections of distinctive, premium cards, use [EDITORIAL_CARD_AND_ARTWORK.md](EDITORIAL_CARD_AND_ARTWORK.md): separate clean background imagery from live dynamic labels, action controls, authoritative state and validated persistence. Keep a replaceable asset registry and fallbacks; do not ship a full flattened mockup as a native control.

## Interaction standard

For cards, rails, radial controls and side drawers document **touch → response → movement → settle → persisted outcome**. Haptics should correspond to meaningful detents/actions. Tests must cover interrupted, slow and fast swipes; gestures competing with system edge/back navigation; dynamic content; return from background and app restart.

A preview or simulator snapshot is not enough to validate real feel. Capture evidence from a physical device when possible.

## Cloud macOS builds with Codemagic

Native iOS YAML: https://docs.codemagic.io/yaml-quick-start/building-a-native-ios-app/

Signing: https://docs.codemagic.io/yaml-code-signing/signing-ios/

First release flow: https://docs.codemagic.io/yaml-quick-start/first-signed-build/

Recommended order:
1. Compile an **unsigned** build and resolve compile failures first.
2. Configure Xcode version, bundle ID, certificate/profile and secure App Store Connect key.
3. Make a signed build and test through TestFlight/real-device distribution.
4. Inspect logs/artifacts for actual failures; YAML syntax success is not proof that Swift compiled.
5. Publish through a deliberately controlled release pipeline and smoke test after release.

Keep signing credentials and API keys outside Git. Codemagic replaces a local Mac for CI builds/signing, **not** physical device UX testing.

## Monetization and store readiness

For **digital functionality consumed in the app**, review Apple In-App Purchase and current region-specific purchase rules before selecting a payment system: https://developer.apple.com/app-store/review/guidelines/ . Physical goods/services can differ. Include tested entitlement, restore, cancellation/refund and receipt handling.

Before submitting: app metadata/screenshots, privacy, support URL, accessible core flow, required account-deletion flow, demo credentials or review mode, stable backend, appropriate certificates and real TestFlight evidence. An approved build pipeline does not guarantee App Store approval.

See [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) and [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md).
