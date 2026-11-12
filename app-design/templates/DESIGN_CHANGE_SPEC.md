# [FEATURE OR REDESIGN] | Design Change Spec

Status: Proposed / Approved / Implemented / Verified / Superseded
Date:
Owner:
Product / repo:
Surface and target device(s):
Size: M (new behavior) / L (new screen or multiple systems)
Governing docs read (paths + sections):

## 1. User problem
Who is trying to do what, where does the current experience fail, and why does it matter?

## 2. Evidence
- Existing build / screenshots / code:
- Actual user findings:
- Facts [Repo] and uncertainties [Assumption]:
- Known-good behavior that must be preserved:

## 3. Goals / non-goals / effort
- Desired user outcome:
- Out of scope and protected paths:
- Effort budget:
- Exceptions requiring owner approval:

## 4. Options and choice
For M: compare two distinct interaction/structure options.
For L: compare three. Different colors alone don't count.

| Option | Behavioral structure | Pros | Cons |
| --- | --- | --- | --- |
| A | | | |
| B | | | |
| C (L only) | | | |

Chosen / rationale:
Rejected / rationale:

## 5. UI breadboard
- Places/screens/sheets:
- Affordances and actions:
- Connections and navigation:
- Empty, first use, loading, error, overflow, offline, undo, refused action:
- Real data ownership, validations and storage:

## 6. Design and platform
- Existing semantic tokens/components:
- Original/licensed artwork:
- Touch/gesture → glide/snap/settle:
- Haptics, interruption and reduced-motion behavior:
- Tap/keyboard/screen-reader alternatives for gestures:
- Focus, contrast, text scaling:
- Phone/tablet/resize/fold/safe areas:

## 7. Technical scope
- Files and components affected:
- Backend, persistence, security and privacy:
- Dependencies and license justification:
- No-touch boundaries:
- Feature flags, rollback and migration plan:

## 8. Acceptance criteria
1. Given ..., when ..., then ...
2. Given ..., when ..., then ...
3. Given a failure, invalid action or interrupted gesture ..., when ..., then ...

## 9. Test evidence and release
- Automated tests/commands and results:
- Screenshot or recording at same representative state:
- Device/OS/build and hardware tests:
- Accessibility results:
- Not-tested items:
- Approved merge/release status:

## 10. Decision record
Date:
Owner:
Supersedes:
Implementation PR:
Update the product's [decision log](DECISION_LOG.md) and release checklist.

See [UX review/spec protocol](../UX_REVIEW_AND_SPEC_PROTOCOL.md) and [tactile QA](../TACTILE_MOTION_AND_DEVICE_QA.md).
