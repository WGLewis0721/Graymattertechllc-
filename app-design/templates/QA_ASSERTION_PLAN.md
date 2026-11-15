# {{PRODUCT}} | QA Assertion Plan

Fill before building QA scripts, then keep it next to them. Guidance: [WEB_QA_BY_ASSERTION.md](../WEB_QA_BY_ASSERTION.md); start from the rows in [BUILD_LESSONS_REGISTER.md](../BUILD_LESSONS_REGISTER.md).

**Status:** [[FILL]] | **Build / commit:** [[FILL]] | **Runner:** [[FILL]] (use the repo's existing runner)

## Where it runs
- Source served at: [[FILL]] | **Built** output served at: [[FILL]] (same sub-path and 404 behavior as production) | Live URL: [[FILL]]
- Browser launch flags needed (for example software WebGL): [[FILL]]
- Heavy audits run **alone** (no concurrent runs): [ ] confirmed

## Viewport matrix (tick what applies)
- [ ] 390 x 844 phone · [ ] **390 x 664 phone with browser bars** · [ ] 820 x 1180 tablet · [ ] 1024 x 768 · [ ] **1366 x 650 laptop with bars** · [ ] 1440 x 900
- [ ] Reduce Motion context · [ ] each edition/look: [[FILL]]

## Assertions (add the specific selectors, stops and expected values)
| # | Assertion | Selectors / values | Script | Result (pass/total) |
| --- | --- | --- | --- | --- |
| 1 | No console errors, failed requests or requests to another origin | | | |
| 2 | No horizontal overflow | | | |
| 3 | Scroll-state: expected layers visible at each progress stop | stops: [[FILL]] | | |
| 4 | No visible text under 12px; no tap target under 44px | | | |
| 5 | Contrast over live art on the brightest 5% of pixels | stops: [[FILL]] | | |
| 6 | Primary action fully inside the first 390 x 664 screen | | | |
| 7 | Key controls and footers are not covered (`elementFromPoint`) | | | |
| 8 | Decorations never overlap text (geometry sweep, widths x heights) | | | |
| 9 | Plain language: no jargon, 1 to 5 things to tap, reading grade at or under 8 | jargon list: [[FILL]] | | |
| 10 | Gated value absent from DOM, config, exports and files at every state | states: [[FILL]] | | |
| 11 | Server refuses forbidden requests when the UI is bypassed | | | |
| 12 | Content Security Policy enforced (injected inline, foreign script, `eval`) | | | |
| 13 | Each deploy-gate check fails on a deliberately broken copy | | | |
| 14 | Deep unknown address returns the styled 404 | | | |
| 15 | Reduce Motion: static layout, all copy, no overflow | | | |
| 16 | Camera or scanner path with a fake feed; no-camera fallback | | | |
| 17 | Static link check | | | |

## Not testable here (label, do not skip)
- [ ] Real phones (collapsing browser bars, frame rate): **[Not tested]** until run
- [ ] Screen readers · 200% zoom · high-contrast modes · real network conditions
- [ ] The platform's built-in QR detector · email delivery · a deployed server and a real payment sandbox

## Reporting
- Pass over total for the run that happened; commit SHA; local vs built vs live; flaky items re-run alone and their outcome.
- No assertion was deleted, weakened or marked optional to make a run pass: [ ] confirmed
