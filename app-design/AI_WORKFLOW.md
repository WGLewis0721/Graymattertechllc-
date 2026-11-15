# AI Builder Workflow

For Claude Code, Codex, Copilot or another coding/design agent. External skills, connectors and MCP servers are **optional**; evaluate instructions, source access, cost and permissions before enabling.

## Read in this order

1. New product's filled [PROJECT_BRIEF](templates/PROJECT_BRIEF.md).
2. [README](README.md), [DESIGN_SYSTEM](DESIGN_SYSTEM.md) and the relevant platform playbook.
3. Actual target repository source, dependency lockfile, tests, current release and decision log. For nontrivial redesigns, use [UX_REVIEW_AND_SPEC_PROTOCOL.md](UX_REVIEW_AND_SPEC_PROTOCOL.md) and the [DESIGN_CHANGE_SPEC template](templates/DESIGN_CHANGE_SPEC.md); for small routine fixes, keep the process lean.
4. [LIBRARY_CATALOG](LIBRARY_CATALOG.md) or [NATIVE_UI_REFERENCES](NATIVE_UI_REFERENCES.md) for a concrete UI need. When interaction/visual artwork is involved, consult [TACTILE_MOTION_AND_DEVICE_QA](TACTILE_MOTION_AND_DEVICE_QA.md) or [EDITORIAL_CARD_AND_ARTWORK](EDITORIAL_CARD_AND_ARTWORK.md).
5. [SECURITY_AND_RELEASE](SECURITY_AND_RELEASE.md) and release checklist. For generated images, require [the asset manifest](templates/ASSET_JOB_MANIFEST.md) and [creative production guide](CREATIVE_ASSET_PRODUCTION.md); for video, [animated-media acceptance](ANIMATED_MEDIA_PIPELINE.md). For UI tests, consult [UI_AUTOMATION_AND_EVIDENCE.md](UI_AUTOMATION_AND_EVIDENCE.md).

**Scope:** These documents are for a **new product**. The Gray Matter corporate website remains a no-framework static site under its own **.github/copilot-instructions.md**.

6. For a premium promo site, a recurring-edition product, a ticket or secret-until-earned flow, or a quality-gated static site: [CASE_STUDY_LISTENING_ROOM.md](CASE_STUDY_LISTENING_ROOM.md), then the documents it maps to ([IMMERSIVE_SCROLL_HERO_SITES](IMMERSIVE_SCROLL_HERO_SITES.md), [EDITION_SYSTEM_FRAME_AND_SKIN](EDITION_SYSTEM_FRAME_AND_SKIN.md), [GATED_CONTENT_AND_DIGITAL_PASS_PATTERN](GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md), [ZERO_TRAINING_UX](ZERO_TRAINING_UX.md), [STATIC_SITE_PLUMBING_AND_DEPLOY_GATE](STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md)). **Before planning QA, read [WEB_QA_BY_ASSERTION](WEB_QA_BY_ASSERTION.md) and the [BUILD_LESSONS_REGISTER](BUILD_LESSONS_REGISTER.md)** so known defects are guarded from the start.

## Website-specific workflow

For a client website or marketing page, read [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md) and complete [templates/WEBSITE_BRIEF.md](templates/WEBSITE_BRIEF.md) before coding. That document includes design-reference evaluation, visual-asset preparation, a reusable ChatGPT build prompt, iterative refinement and production QA. Use it alongside, not in place of, the existing repository's rules.

## Copyable prompt: build an entire new product

> I want you to build **[PRODUCT NAME]** for **[TARGET USERS]** on **[WEB / WEBSITE / NATIVE IOS]**. I require exactly these named screens/pages: **[SCREEN LIST IN ORDER]**. Read the Gray Matter DESIGN_TO_BUILD_CONTRACT, the selected platform playbook and the existing code. Do not silently remove, combine, or defer any requested screen.
>
> 1. Generate a new product using the Gray Matter app-starter, passing the exact screen names with --screens. Fill the generated design/BRIEF.md with my approved requirements and facts. Keep design/requested-screens.json and design/screens.json aligned.
> 2. Research relevant design references and create a **real visual Brand Board**, not just prose: original visual identity, approved logo/icon direction, typography, colors, imagery, layout and motion. Save editable design specifications and a visual proof.
> 3. Produce a **real visual UI Kit** plus reusable tokens/components in the product's framework. Cover buttons, navigation, cards, forms, alerts, empty/loading/error/focus/disabled states and responsive/accessibility behavior.
> 4. Create a complete Screen Map and an individual visual design/wireframe, screen spec and primary action for **every screen I named**. Include mobile/tablet/desktop or applicable native sizes, navigation, empty/error states and accessible controls.
> 5. Implement all specified screens in the actual app. Make navigation and meaningful actions work against real approved data and backend integrations when required. Do not pass off dead buttons, fake checkout or screenshots as functional pages.
> 6. Run python3 scripts/check-design.py --stage plan, design, build and release as evidence is collected. Run actual framework tests/build, screen-by-screen E2E journeys and relevant device checks. Keep a record of exact files, build commits, screenshots, test results and known limitations.
> 7. Report links/paths to the Brand Board, UI Kit, screen inventory, every implemented page, UI tests and remaining release blockers. Do not claim production deployment without verified release evidence.
>
> Build in a separate product folder/repository. Preserve any approved client identity and never invent client facts, photos, prices, testimonials, entitlements or paid integrations. Make design and implementation cohesive. Finish the requested scope before calling the project complete.

## Copyable prompt: research, build and revise an existing or new website

> Read [UPGRADE_AND_CORRECTIVE_WORKFLOW.md](UPGRADE_AND_CORRECTIVE_WORKFLOW.md) and [DESIGN_TO_BUILD_CONTRACT.md](DESIGN_TO_BUILD_CONTRACT.md). I want **[NEW PRODUCT / SCREENSHOT-BASED UPGRADE]** of **[REPO]** using **[REFERENCE SCREENSHOT IF UPGRADE]** and these required screens: **[LIST]**. First inspect the current code when upgrading, preserve its functional behavior and create an approved **pre-build plan and specification** and an inspected references/resources register with URLs, what inspired each choice, what must not be copied, licensing, dependencies and acceptance tests. Generate/export individual editable SVG and PNG wireframes for every screen and develop a cohesive actual brand board, UI kit and designed screens. Only then implement functioning code, running tests and accessible mobile layouts. For an upgrade, capture real before/after screenshots and a comparison PNG. If I report something wrong, open a corrective ticket, document root cause, implement a targeted fix, retest and get approval. Do not close unresolved issues or claim deployment without evidence.

## Copyable prompt: premium single-page promo site with recurring editions

> Read [CASE_STUDY_LISTENING_ROOM.md](CASE_STUDY_LISTENING_ROOM.md) and the documents it maps to, then [WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md) and [BUILD_LESSONS_REGISTER.md](BUILD_LESSONS_REGISTER.md). I want a **[MONTHLY / WEEKLY / PER-ARTIST]** promo site for **[EVENT OR PRODUCT]** in **[CITY]**, built from this source material: **[POST, SCREENSHOT, BRIEF]**. Requirements: one page, **hero only**, scroll-animated to funnel the visitor to **[ONE ACTION]**; customizable per **[ARTIST / EDITION]**, its aesthetic and its **[SCHEDULE / SET LIST]**; a separate **[PAYMENT / TICKET]** page that creates a customer card in the same look; **[SECRET, for example the location]** shown only after purchase.
>
> 1. Turn my material into a **numbered requirement list** and map each requirement to an interface decision and a UX law. Use **fictional names only** in anything public; keep real references private.
> 2. Research relevant sites; record what to borrow and what not to. Define a **frame that never changes and a skin that does**, with the contrast, size and tap guardrails as **numbers**. Generate the brand board from the real configs. Produce **[N] complete looks** and wireframes.
> 3. Build the engine with a **config object per edition**, a pinned scroll hero, generative art that dims the type side by construction, one filled button on screen, a **static fallback** and `mount()`/`destroy()`. No invented facts or numbers.
> 4. Verify **by script, not by eye**: scroll states, contrast over live art, sizes, overflow, console, Reduce Motion, a first-screen check at 390 by 664, covered-element and overlap checks at 1366 by 650. Write the assertion for every defect you find.
> 5. Design the gated flow with a **threat model** (a screenshot cannot be blocked), a simulator first, then the server, then database and concurrency tests. Make it usable by **people who will not be taught**: one headline, one sentence, one button per state; plain-words checks; an operator screen that answers in one color.
> 6. Add the site plumbing (share previews, sitemap, security policy enforced and tested, plain pages, a styled 404) and a **deploy gate you have seen fail on purpose**. Test the built site under the production sub-path, then the live URL.
> 7. Build a **client review page** (all looks, an in-place skin switcher that keeps scroll position, generate the customer artifact, favorite and note, nothing sent anywhere) and a short client message that says what is demo.
> 8. Report pass over total for each check that actually ran, the commit SHA, what is simulated, and what is **[Not tested]** (real phones, screen readers, a real payment sandbox, deployed server). Never claim live or production-ready without evidence.

## Copyable prompt: start a product

> Read the filled PROJECT_BRIEF, app-design README, DESIGN_SYSTEM and relevant WEB_PLAYBOOK or IOS_PLAYBOOK. Inspect the actual target repo before proposing changes. Identify its current framework and dependencies, source-of-truth data, CI and known-good release. Propose the smallest complete user journey and implement it end-to-end with real persistence, loading/empty/error states, accessibility, correct authorization and tests. Use existing components before adding packages; select one primitive base for new React apps. No isolated prototype. Document files changed, exact test evidence, unresolved problems and next release gate. Do not fabricate test results or deploy claims.

## Copyable prompt: design and implement a screen

> Implement [FEATURE] to accomplish [USER OUTCOME]. Read this project's design tokens, navigation, current code and FEATURE_SPEC before editing. Use at most two justified visual references from LIBRARY_CATALOG, with original product styling. Define default, pressed, focus, empty, loading, offline and error states; document each gesture, animation, haptic, accessibility behavior and reduced-motion fallback. Integrate in the real app, not a standalone demo. Test on relevant sizes/devices; provide screenshot or interaction recording and persistence evidence. Keep changes focused and update the feature spec.

## Copyable prompt: release review

> Compare the current build with PROJECT_BRIEF, FEATURE_SPEC, DESIGN_SYSTEM, SECURITY_AND_RELEASE and RELEASE_CHECKLIST. Inspect build logs/artifacts and run available tests. Identify actual reproducible defects and fix release-blocking problems without overwriting unrelated work. Confirm security boundaries, persistence, payments, UI/gesture performance, store/deployment configuration and recovery. Report exact commit SHA, test commands and results, proof links, failures and unverified items. Do not claim live release or App Store approval without external confirmation. Preserve the working baseline.

## Operating rules

- Result first; design and code follow the user outcome. No unnecessary dependency churn.
- Keep one active spec and decision source; no duplicate contradictory files.
- Don't copy secrets, proprietary designs or paid assets without license.
- Always distinguish **verified**, **not run**, **blocked** and **assumed**.
- Use reviewable scoped PRs; record the changed files, acceptance proof and rollback strategy.
- Don't mark a UI as done from a still image or a green build alone.
- Preserve current release as the golden baseline until a tested change supersedes it.
- When you find a defect, write the **assertion that would have caught it** in the same change ([WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md)), and add a row to the lessons register.
- Check every number you put in a document **against the source at write time** and label it verified; a stale figure is a defect ([BUILD_LESSONS_REGISTER.md](BUILD_LESSONS_REGISTER.md), L-21).
- A gate or check that has never failed is unproven: break something on purpose and watch it fail.
