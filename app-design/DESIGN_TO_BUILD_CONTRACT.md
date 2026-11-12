# Design to Build Contract | Required Deliverables for Every New App or Website

**Goal:** Given an idea and the exact screens/pages the owner wants, an AI agent must plan **and produce** a coherent brand board, UI kit, individual screen designs and actual working pages. Those are **deliverables with evidence**, not optional inspiration. The generator scaffolds the contract; a capable coding/design agent must execute the design and implementation. **A shell script alone does not generate finished visual assets or a running business product.**

This contract applies to **new projects created with Gray Matter App Starter**. It does **not** authorize redesigning existing production projects, inventing client facts, deploying to production or copying Spread/Arooma branding.

## Mandatory sequence and acceptance

| Gate | Required artifact | Real completion standard |
| --- | --- | --- |
| **0. Brief and inventory** | Filled PROJECT_BRIEF or WEBSITE_BRIEF, copied as `design/BRIEF.md`; `design/screens.json` | Every named page/screen is listed once with purpose and destination; requirements and current repo checked |
| **1. Brand board** | `design/BRAND_BOARD.md` plus visual proof in `design/evidence/` | Original type, palette, logo/icon direction, graphic art, layout rhythm, motion and accessible variants; licensed/approved sources |
| **2. UI kit** | `design/UI_KIT.md` plus visual preview and real shared components/tokens | Responsive/system components, inputs, navigation, cards, feedback and important default/focus/disabled/loading/error states |
| **3. Screens and user journeys** | `design/SCREEN_MAP.md`, `design/screens.json`, one `design/screens/<id>.md` per screen and individual visual proofs | Every owner-requested screen designed, connected with navigation, complete empty/error states and adaptive layout rules |
| **4. Build** | Working source for **all** screens listed in `implementation_files` | No mockup-only page, dead CTA, fake checkout or hidden placeholders; same design system and genuine actions/data |
| **5. Refine and verify** | `design/QA.md`, automated/device test records, screenshots and actual build results | Visual consistency, accessibility, mobile/tablet, permissions, failures and persistence checked; no unsupported release claims |

The **screens.json inventory is authoritative** for which screens were requested. It may not be silently trimmed when building. Any removed or deferred screen requires owner approval, with a decision logged and accurate scope update. Do not fabricate visual assets, screenshots, testimonials, payment success or backend features.

### Build-screen stages

- **Planned:** Named and scoped; no claimed completed design or implementation.
- **Designed:** A real editable screen design/wireframe exists, with spec, user action, navigation and UI-kit usage.
- **Implemented:** Integrated source exists, with actual screen implementation file(s) referenced in the manifest.
- **Verified:** Actual interaction-test/visual/accessibility evidence exists for that screen and its reviewed revision.

## Start a product in its own folder

From a checkout of the Gray Matter business repository:

~~~bash
bash app-starter/scripts/new-app.sh web HausWebsite ./projects --kind website --screens 'Home,Menu,Ordering,Events,Contact'
bash app-starter/scripts/new-app.sh ios MyNativeApp ./projects --kind app --screens 'Onboarding,Home,Collection,Details,Settings'
~~~

The generator creates a React/Vite or SwiftUI demo, copies the complete `app-design/` library, scaffolds the required `design/` deliverables and inventory, and installs a GitHub Actions design-structure check. The **task-list starter is still a demo**. The named screens are not automatically implemented simply because the inventory lists them.

Assign the generated product to a coding/design agent with [the complete product prompt](AI_WORKFLOW.md#copyable-prompt-build-an-entire-new-product). Supply approved facts, design references and source assets. The agent must create the actual art direction, visual deliverables, component system, named screens and integrated implementation.

### Check gates inside the generated project

~~~bash
python3 scripts/check-design.py --stage plan
python3 scripts/check-design.py --stage design
python3 scripts/check-design.py --stage build
python3 scripts/check-design.py --stage release
~~~

A **newly generated project intentionally fails all gates** until its brief, designs, screens, implementation and tests are done. The generator succeeds in scaffolding, not in delivering a finished product.

The design gate requires actual visual artifacts (SVG, PNG, HTML or PDF are examples) referenced by path; build and release gates check source/test evidence paths and declared statuses. **A structural pass is not proof of good design or functioning code.** Run framework build, E2E, accessibility, device checks and real publication smoke tests separately.

Generated `.github/workflows/design-gates.yml` runs the design structural gate on PRs and pushes. It does not establish required GitHub branch protection by itself; the repo owner may need to make that status check mandatory. Product-specific build/test workflows still need configuration.

## AI agent operating contract

The agent must:

1. **Inventory first:** Read the brief, user's exact screens/pages, current product source and governing rules. Propose additions explicitly, never silently remove pages.
2. **Research references:** Explain why chosen real-world examples work; do not duplicate their distinctive designs. Mark unsupported research as incomplete.
3. **Create a genuine brand board:** Render a reviewable visual proof and specify editable logo direction, type/palette, imagery, motion and accessibility.
4. **Create a genuine UI kit:** Specify semantic tokens, all necessary reusable components and states; provide visual proof and actual code components in the target framework.
5. **Design every named screen:** Each gets a spec and visual proof; include entry/exit, default/empty/loading/error, responsive and accessible behavior.
6. **Build every screen in the actual product:** Wire navigation, real data, permissions, useful actions and reliable failure states. Never substitute empty screenshots, dead-end buttons or fake checkout.
7. **Test and refine:** Run available tests and builds, compare full-screen captures on relevant devices, record real evidence, fix regressions and keep rollback.
8. **Handoff:** Provide links to brand board, UI kit, every screen, working implementation, recorded test results and release blockers. Do not claim live deployment or App Store approval without verified release evidence.

## Example: restaurant site

| Owner-requested page | Primary action | What must actually work |
| --- | --- | --- |
| Home | Discover the brand, go to Menu or Ordering | Factual headline, clear CTA and navigation |
| Menu | Browse current offerings | Approved products/prices, any requested filters |
| Ordering | Choose items and actually submit an order or use a legitimate checkout | Genuine order destination, no fake payment |
| Events | Find upcoming events and reserve/inquire | Real event information and valid contact/booking path |
| Contact | Reach the business | Form validation, real delivery destination, honest success/error |

These are **illustrative acceptance cases**, not approved client facts or code automatically produced by the starter.

## Design references

Use [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md), [EDITORIAL_CARD_AND_ARTWORK.md](EDITORIAL_CARD_AND_ARTWORK.md), [CREATIVE_ASSET_PRODUCTION.md](CREATIVE_ASSET_PRODUCTION.md), [TACTILE_MOTION_AND_DEVICE_QA.md](TACTILE_MOTION_AND_DEVICE_QA.md), [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md), and the platform playbooks.

**Authority:** A product's approved requirements and current shipped code outrank generic starter guidance. A brand board must honor a client's approved existing identity; it does not mandate replacing logos, fonts or content.
