# Build Lessons Register | Real Defects, Their Causes and the Test That Now Prevents Them

**Purpose:** A short, searchable list of the defects that actually occurred while building a high-end promo site and its ticket flow, so the next build **starts with the guards already in place**. Each row is a symptom, a root cause, the fix and the **prevention** (usually an assertion). Read it before planning QA; append to it after every project. Companion to [WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md) and the library's [corrective-action template](templates/CORRECTIVE_ACTION.md).

**Origin:** The Listening Room reference build, [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25) (fictional demo). Every row happened; none is hypothetical. **[Repo]** = reproduced and fixed in that code, with the named check.

## Motion, art and layout

| ID | Symptom | Root cause | Fix | Prevention |
| --- | --- | --- | --- | --- |
| L-01 | First-beat text stayed on screen through later beats; visual review missed it for several rounds | An intro `from()` and the scrubbed `to()` animated the same property | Intro for extras moved to a CSS animation | **Scroll-state assertions** at each progress stop |
| L-02 | Text unreadable over moving art | Art brightest exactly where type sat | Shader dims the text side (`uSafe`); measure on the brightest 5% of pixels | Contrast-over-art script at every stop and size; fix checker bugs (per-line rectangles, `color(srgb)` parsing) |
| L-03 | Phone: top bar wrapped, tiny axis labels, clipped names, an empty panel | Desktop assumptions | Per-look phone sizes, HTML axis labels, a heading scale for a wide face | Overflow, text under 12px, tap under 44px audit at 390 |
| L-04 | Stacked (Reduce Motion) page scrolled sideways | Negative margins on large type | `overflow-x: clip` in static mode | Overflow assertion in a Reduce Motion context |
| L-05 | Device toggle moved the user to a different scroll position | Progress read **after** the resize | Read progress **before** resize, restore after | Mount/destroy and device-toggle tests keep progress |
| L-06 | Duplicate "context lost" warnings | Releasing the WebGL context twice | One owner (`destroy`) releases it | Console-error assertion |
| L-07 | The scroll cue overlapped the headline and tagline on many window sizes (found only by rendering a 1200 by 630 share image) | Audits used 900px-tall windows | The cue measures itself and hides when it would touch text | **Geometry sweep** across widths and heights; permanent 1366 by 650 viewport |
| L-08 | The page footer, including the demo disclosure, was invisible in a real window | Painted **under** fixed background layers; full-page screenshots lay out fixed layers differently so every capture looked fine | `z-index` on the footer | **Not-covered assertion** (`elementFromPoint`) in a real viewport |

## Flow and usability

| ID | Symptom | Root cause | Fix | Prevention |
| --- | --- | --- | --- | --- |
| L-09 | A press on a button was cancelled | A periodic refresh rebuilt the button under the finger | Idempotent render keyed on the data it shows | Test across a refresh interval |
| L-10 | The Pay button was 822 to 865px down an 844px screen | Card first, long form, three-line intro | Seats and total on one row, no eyebrow, shorter intro (Pay at 560px on a 664px screen) | **First-screen assertion at 390 by 664** on every look |
| L-11 | A new person had to be told what to do | Hold-to-reveal gesture, a timeline, five buttons, jargon, a "paste a code" door box | One headline, one sentence, one button; color answers at the door | Plain-words check; tap budget ([ZERO_TRAINING_UX.md](ZERO_TRAINING_UX.md)) |
| L-12 | The first exported card picture was cut off, and saving a picture or a calendar file did nothing in sandboxed viewers | Script-triggered downloads are blocked in sandboxed viewers; the export itself was also incomplete (fixed in the card renderer) | Show the picture inline ("press and hold to save") and give manual calendar instructions beside the download | Download tests and an inline-preview check |
| L-13 | The demo's "scan the latest card" picked a seeded guest | Ordering by a jumped clock | Exclude seeded records | A test that scans the card just bought |

## Security, gates and deploy

| ID | Symptom | Root cause | Fix | Prevention |
| --- | --- | --- | --- | --- |
| L-14 | A 404 several folders deep was unstyled | `<base href>` placed after the stylesheet links | `<base>` first in `<head>` | Deep-404 test on a server that mimics the production sub-path |
| L-15 | A Content Security Policy test passed for the wrong reason | `evaluate` runs outside the page's policy | Probe from a script the page itself loads | Enforcement tests: injected script, foreign script, `eval` |
| L-16 | A "forged code" test was rejected as expired, proving nothing | A made-up time step is checked before the signature | Use the current step with a wrong code | Assert the *reason* returned |
| L-17 | Gates looked reliable but had never failed | No negative tests | Break a copy of the output on purpose, require failure | Negative tests for every gate check |
| L-18 | A live-site test failed while the local one passed | Hard-coded root paths; the host serves under `/repo-name/` | Relative probe URLs, glob routes | Run the same suite on the built site and on the live URL |
| L-19 | Real artist names sat in a public repository | An early upload's file names | Fictional-only rule; the gate scans published output | Gate name scan **plus** a manual check of the repository root and archives |
| L-20 | A security feature added friction for honest users | Hold-to-reveal and 3 views of 20 seconds | One tap; 5 views of 45 seconds; maps link; say what protection was given up | Threat model states the trade-off ([GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md](GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md)) |

## Process and documentation

| ID | Symptom | Root cause | Fix | Prevention |
| --- | --- | --- | --- | --- |
| L-21 | Documents said the scroll track was "about 520vh"; the code said 620vh (560vh on phones) | A number copied from an earlier iteration and never re-checked; found while writing this library | Corrected in the source docs | Check every number in a document **against the source at write time** and label it verified |
| L-22 | A link in a social comment would not become clickable | The address ended in a hyphen; edited comments are not re-linked | End in a slash, own line, post a new comment | Link-sharing checklist ([STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md](STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md)) |
| L-23 | A flaky scroll assertion | Two heavy audits ran at once and starved the CPU | Run audits alone; re-run a flake alone before treating it as a defect | A rule in the QA doc: heavy audits alone |
| L-24 | The agent's own shell was killed; a static server served nothing | `pkill -f <pattern>` matched the shell; a rebuild deleted the directory the server held open | Kill by process id; restart the server after a rebuild | Operating rules in [WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md) |

## How to use this register

1. Before planning QA for a new build, read the rows for your surface and copy the prevention checks into the QA plan ([templates/QA_ASSERTION_PLAN.md](templates/QA_ASSERTION_PLAN.md)).
2. When a defect appears, add a row here **and** the assertion, in the same pull request.
3. Do not close a row without its prevention in place and run at least once against both the built site and the live site.
