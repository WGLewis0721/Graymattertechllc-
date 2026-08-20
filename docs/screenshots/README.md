# Funnel screenshots

Captured from the local build with Playwright at two viewports:

* **desktop** — 1440 × 900
* **mobile** — 390 × 844 (iPhone-class), touch enabled

| File | State |
|------|-------|
| `outcome-menu-*` | Step 1 — *What Do You Want to Fix First?* The four swipeable outcome cards, the persistent action bar, and the "Not sure what will help most?" alternative. |
| `starting-points-*` | Step 2 — the starting points for *Protect My Business* only, each with its plain-language result, displayed price, displayed time, and three inclusions. |
| `customize-toggles-*` | Step 3 — the Complete Protection Package toggles, with two switched on and the live plan summary beside them. |
| `plan-drawer-*` | The plan drawer — right-side drawer on desktop, bottom sheet on mobile — showing goal, plan, inclusions, additions, price, timeline, what happens next, and the approval checklist. |
| `final-confirmation-*` | The plan carried into the inquiry form on `contact.html`, with the structured fields filled in behind it. |
| `guided-recommendation-*` | The *Recommend It for Me* result — one primary recommendation with one sentence of reasoning. |

Re-capture after a funnel change: serve the site locally, then drive the
same states in a browser. These are documentation artefacts, not test
fixtures — nothing in the site reads them.
