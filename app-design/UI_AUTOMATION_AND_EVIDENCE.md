# UI Automation and Evidence | Test the Experience, Not the Screenshot

**Purpose:** Establish repeatable proof that important native/web flows work. This is a companion to [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) and [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md), not an installed test framework.

**Arooma references:** [SwiftUI UX consolidation](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-11-01-swiftui-ux-consolidation.md), [Maestro failure spec](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-11-02-maestro-failures-spec.md), and [failure handoff](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-11-02-maestro-failures-handoff.md). Arooma's documented test results reflect **dated individual runs**, not its present release status.

## 1. Pick the right automation layer

- **Unit/domain:** validation, mutations, migrations, deterministic data transformations.
- **Integration:** real API/database permission, session, purchased entitlement, persisted record.
- **End-to-end UI:** real navigation, visible controls, editing, cancellation, return-to-origin, Undo and errors.
- **Hardware acceptance:** performance, haptics, accessibility speech, interruptions, camera/device sensors and real tactile feel.

Native iOS automation tools may include XCUITest and **Maestro**. Web apps can use Playwright or another maintained browser E2E framework. Use frameworks already configured in the target repo; do not install a new runner into the Gray Matter business website because of this guide.

## 2. Write stable, meaningful flows

- Start with a declared fixture: clean install or seeded existing data, expected permissions, device/OS and appearance.
- Use stable accessibility identifiers for ambiguous labels. Do not require every user-visible string to be globally unique.
- Assert a **meaningful result**, not merely that a button was tapped or an animation completed.
- Record the originating screen and verify it remains available or is intentionally restored after a modal action.
- Test validation failures, duplicate records, destructive Undo and app restart as relevant.
- Include empty, dense, slow and offline conditions.
- Avoid arbitrary fixed sleeps when a state/element wait expresses the real requirement.

### Example behavior contract

Given a user opens quick add from a particular screen, when a valid item is saved, then a real record appears and the app returns to its documented destination. When the save is rejected, no success appears. If Undo is offered and invoked, the record and UI return to the promised prior state.

## 3. Diagnose a failed UI test accurately

A failed assertion is **not automatically an app defect**. Collect:

1. Exact build and test-run URL, commit SHA, simulator/device and OS.
2. Failing step/selector, expected result and timestamp.
3. Screenshot/video at the failing step **and** accessibility hierarchy snapshot.
4. App and automation logs, any navigation/modality changes and persisted state.
5. Classification: **app bug**, **flow/locator bug**, **timing or synchronization issue**, **environment/permission issue**, or **unresolved**.

Arooma's documented examples illustrate three common causes:
- A lazy-list row below the fold may be absent from the accessibility tree until scrolled into view.
- A sheet visible in a screenshot may not yet be represented in the hierarchy at the exact assertion time.
- An Undo assertion may expect the wrong UI destination, even when the app performed the intended domain operation.

Correct the test when it misunderstands approved behavior; correct the app when real behavior is wrong. **Never make a failure disappear by deleting the assertion, weakening its requirement or labeling a step optional**.

## 4. Evidence and acceptance standard

- Syntax/lint checks for all changed flow files.
- Repeat important repaired flows (for example, two consecutive clean runs where reliability is uncertain).
- Store machine-readable test results such as JUnit XML together with screenshots, logs and accessibility hierarchies.
- State pass/total counts for the actual run, not the intended target.
- Separate automated simulator success from physical-device checks.
- Note which interactions still need manual VoiceOver, haptics, animation/scroll and hardware testing.
- Keep exact results attached to the same commit that will be reviewed/released.

**Do not claim an app, screenshot, prototype, or test suite is fully validated from a compile-only result.** Open a scoped PR with the failure register, root cause, fix and repeat evidence.

See [TACTILE_MOTION_AND_DEVICE_QA.md](TACTILE_MOTION_AND_DEVICE_QA.md) for gesture/device testing and [UX_REVIEW_AND_SPEC_PROTOCOL.md](UX_REVIEW_AND_SPEC_PROTOCOL.md) for design decisions.
