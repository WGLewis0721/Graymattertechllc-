# Object-First Native App UX | Stable Identity, Intentional Gestures

**Purpose:** Turn a collection, portfolio, media library, personal notebook or other content-driven iOS app into a coherent experience around the **selected object**, not a maze of tabs and ornamental buttons.

**Adapted from Arooma:** [native iOS design guide](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/platforms/AROOMA_IOS_DESIGN_GUIDE.md), [premium native interaction spec](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-10-31-native-premium-motion-interaction-system.md), [gesture-first discovery spec](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-10-31-gesture-first-wishlist-discovery.md) and [UX consolidation](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-11-01-swiftui-ux-consolidation.md). These sources include past proposed behaviors and partial test results; the following are **general lessons**, not claims of Arooma's current shipped behavior.

## 1. One user object, multiple presentations

Model **one stable selected-item ID and one authoritative item record**. Gallery, stack, detail sheet, search results, favorites and sharing should project the same item without creating a second data owner for each view.

- Preserve selection through layout switches and background/foreground.
- Show consistent identity, position in collection, status and saved state.
- Presentations may rearrange objects, but should not silently duplicate, delete or change ownership.
- A zoom, card flip, tilt or drag updates visual state. Only a deliberate validated command updates persistent state.
- Keep historical records, local data, user photos and entitlement state intact during visual improvements.

A feeling of physical substance comes from coherent **occlusion, depth, lighting, contact shadow, press response, velocity continuity, and consistent object geometry**, not just stacking stronger shadows and transforms.

## 2. Gesture-first does not mean gesture-only

Start with the actual common journey: discover → inspect → act → confirm → return. Minimize redundant navigation while preserving visible escape routes and discoverable actions.

| User intent | Useful pattern | Accessibility/clarity requirement |
| --- | --- | --- |
| Browse a set | Finger-driven direct manipulation with bounded settle | Explicit next/previous or accessible adjustable action |
| Inspect selected item | Tap to inspect/flip only when signposted | Readable detail action that does not require a secret swipe |
| Add/save an item | Direct quick-add for simple inputs; review for ambiguous or camera-derived data | Clear destination and truthful saved/undo state |
| Search and filter | Search keeps current filters and returns to previous context | No forced reset of search after inspection |
| Share | Native share sheet or appropriate export of the selected object | Do not include private notes/owner history by default |
| Delete/change relationship | Intentional action with correct confirmation or Undo | No accidental consequences hidden behind velocity gestures |

A single object might move between “to consider,” “owned” and “archived” states, depending on product semantics. Avoid duplicating records merely to simulate categories. Return people to the screen they started from after a modal task, not an unrelated default tab.

## 3. The camera or OCR is only an input

A scan can recognize visible text and barcodes on supported devices; it is **not automatically authoritative product identification**. Show extracted text, confidence/uncertainty, and a user review step when necessary. Distinguish verified lookup from a local suggestion; never fabricate global catalog coverage or official affiliation.

Network enrichment and third-party imagery require their own permission, privacy, legal and graceful-offline decisions. The user must be able to save local notes or an unverified item when a catalog source is unavailable, if the product supports that workflow.

## 4. Photographic material and native controls

Treat approved visual art as the **content layer**, with a stable, legible native control layer above. Premium materials and motion may enhance the object, but must not overwrite it.

- Native sheets, navigation and controls typically win over custom mimics.
- Do not apply high-cost blur/foil effects indiscriminately. Profile actual GPU behavior.
- Use Core Motion/tilt only when it materially improves interaction and with Reduce Motion and energy considerations.
- Show real content and adequate context; don't make the user wait for a long branding intro.
- Dynamic Type, VoiceOver, focus, Reduce Transparency and gestures' keyboard/tap alternatives remain first-class.
- Performance must be measured on hardware when a claim concerns touch physics, haptics or frame cadence.

## 5. Evidence-driven simplification

Before removing a control, check whether it is really redundant or provides essential access from a particular context. Maintain a decision inventory:

- **Implement:** remove a proven duplicate, shorten an unnecessary round trip, or improve directness.
- **Retain:** multiple entry points serve distinct meaningful contexts or empty states.
- **Not applicable:** an older design document describes a component not reachable in the current build.
- **Blocked:** data/rights/device prerequisites missing. Do not invent success.

Test the entire route, including **return to origin**, close/dismiss, Undo, reload, offline, empty collection and interrupted interactions. Use [UI_AUTOMATION_AND_EVIDENCE.md](UI_AUTOMATION_AND_EVIDENCE.md) to distinguish app defects from test-script defects.

Related: [TACTILE_MOTION_AND_DEVICE_QA.md](TACTILE_MOTION_AND_DEVICE_QA.md), [CREATIVE_ASSET_PRODUCTION.md](CREATIVE_ASSET_PRODUCTION.md), [IOS_PLAYBOOK.md](IOS_PLAYBOOK.md).
