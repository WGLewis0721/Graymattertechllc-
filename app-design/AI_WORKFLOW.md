# AI Builder Workflow

For Claude Code, Codex, Copilot or another coding/design agent. External skills, connectors and MCP servers are **optional**; evaluate instructions, source access, cost and permissions before enabling.

## Read in this order

1. New product's filled [PROJECT_BRIEF](templates/PROJECT_BRIEF.md).
2. [README](README.md), [DESIGN_SYSTEM](DESIGN_SYSTEM.md) and the relevant platform playbook.
3. Actual target repository source, dependency lockfile, tests, current release and decision log. For nontrivial redesigns, use [UX_REVIEW_AND_SPEC_PROTOCOL.md](UX_REVIEW_AND_SPEC_PROTOCOL.md) and the [DESIGN_CHANGE_SPEC template](templates/DESIGN_CHANGE_SPEC.md); for small routine fixes, keep the process lean.
4. [LIBRARY_CATALOG](LIBRARY_CATALOG.md) or [NATIVE_UI_REFERENCES](NATIVE_UI_REFERENCES.md) for a concrete UI need. When interaction/visual artwork is involved, consult [TACTILE_MOTION_AND_DEVICE_QA](TACTILE_MOTION_AND_DEVICE_QA.md) or [EDITORIAL_CARD_AND_ARTWORK](EDITORIAL_CARD_AND_ARTWORK.md).
5. [SECURITY_AND_RELEASE](SECURITY_AND_RELEASE.md) and release checklist. For generated images, require [the asset manifest](templates/ASSET_JOB_MANIFEST.md) and [creative production guide](CREATIVE_ASSET_PRODUCTION.md); for video, [animated-media acceptance](ANIMATED_MEDIA_PIPELINE.md). For UI tests, consult [UI_AUTOMATION_AND_EVIDENCE.md](UI_AUTOMATION_AND_EVIDENCE.md).

**Scope:** These documents are for a **new product**. The Gray Matter corporate website remains a no-framework static site under its own **.github/copilot-instructions.md**.

## Website-specific workflow

For a client website or marketing page, read [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md) and complete [templates/WEBSITE_BRIEF.md](templates/WEBSITE_BRIEF.md) before coding. That document includes design-reference evaluation, visual-asset preparation, a reusable ChatGPT build prompt, iterative refinement and production QA. Use it alongside, not in place of, the existing repository's rules.

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
