# Gray Matter | Reusable App Design & Development Library

**Purpose:** A reference library for starting future web, SaaS, and native iOS products using proven design and development practices. Last expanded **November 12, 2026**, with reusable design practices adapted from Spread and Arooma.

**Important:** This folder is documentation, not a runnable starter app. The parent repository is the live, static Gray Matter business website; its HTML/CSS/JavaScript must not be replaced with React or SwiftUI because of the references here.

## Mandatory deliverables for every new product

**[Design-to-Build Contract](DESIGN_TO_BUILD_CONTRACT.md):** A visual brand board, a real UI kit, an individual design for every user-requested screen/page, functional implementation of all screens, and actual QA evidence are mandatory for new projects. The [app starter](https://github.com/WGLewis0721/Graymattertechllc-/tree/main/app-starter) creates the brief, screen manifest, design files and structural gates. The AI coding/design agent must create the actual visuals and working code. No silent screen omissions.

## New app: follow these steps

1. Copy [templates/PROJECT_BRIEF.md](templates/PROJECT_BRIEF.md) into the new product repository and fill in the problem, audience, first useful outcome, platform, business model, and constraints.
2. Choose a product path: [Web / SaaS](WEB_PLAYBOOK.md), [Native iPhone / iPad](IOS_PLAYBOOK.md), or both with a deliberate shared API.
3. Create a unique [design system](DESIGN_SYSTEM.md): typography, colors, graphic identity, states, navigation, animation, and interaction behavior. Use [UX review and spec guidance](UX_REVIEW_AND_SPEC_PROTOCOL.md) to make decisions. For client websites, follow [the ChatGPT website workflow](WEBSITE_DESIGN_WORKFLOW.md) first.
4. Use the [13-source UI catalog](LIBRARY_CATALOG.md) and optional [native UI references](NATIVE_UI_REFERENCES.md) to pick only components justified by actual screens. React components do **not** become SwiftUI components.
5. Implement one complete vertical slice with **real persistence** and error handling, then expand. For gestures, art or video, read [tactile QA](TACTILE_MOTION_AND_DEVICE_QA.md), [editorial cards](EDITORIAL_CARD_AND_ARTWORK.md), [creative asset production](CREATIVE_ASSET_PRODUCTION.md), and [animated media](ANIMATED_MEDIA_PIPELINE.md) as needed. Give an AI coder the [workflow prompts](AI_WORKFLOW.md).
6. Check [security, payments, testing, and launch gates](SECURITY_AND_RELEASE.md). Use the [release evidence checklist](templates/RELEASE_CHECKLIST.md).
7. Record architecture and UX decisions in [templates/DECISION_LOG.md], and individual feature criteria in [templates/FEATURE_SPEC.md].

## Index

| File | Role |
| --- | --- |
| [LIBRARY_CATALOG.md](LIBRARY_CATALOG.md) | 13 screenshot resources, links, best uses, compatibility and selection |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Graphic design, research, branding, UX, motion, accessibility |
| [DESIGN_TO_BUILD_CONTRACT.md](DESIGN_TO_BUILD_CONTRACT.md) | Mandatory brand board, UI kit, named-screen design/build and verification gates |
| [UX_REVIEW_AND_SPEC_PROTOCOL.md](UX_REVIEW_AND_SPEC_PROTOCOL.md) | UX laws, design reviews, documentation authority and S/M/L specs |
| [EDITORIAL_CARD_AND_ARTWORK.md](EDITORIAL_CARD_AND_ARTWORK.md) | Premium editorial card anatomy, art composition, live data separation |
| [CREATIVE_ASSET_PRODUCTION.md](CREATIVE_ASSET_PRODUCTION.md) | Editable AI-assisted visuals, source facts, layered retouching, rights and export QA |
| [ANIMATED_MEDIA_PIPELINE.md](ANIMATED_MEDIA_PIPELINE.md) | Verified animation, real decoded video, looping/poster/offline integration |
| [OBJECT_FIRST_NATIVE_PATTERNS.md](OBJECT_FIRST_NATIVE_PATTERNS.md) | Selected object identity, native gestures, inspection, sharing and on-device privacy |
| [UI_AUTOMATION_AND_EVIDENCE.md](UI_AUTOMATION_AND_EVIDENCE.md) | E2E/mobile UI tests, screenshot/hierarchy diagnosis and trustworthy evidence |
| [TACTILE_MOTION_AND_DEVICE_QA.md](TACTILE_MOTION_AND_DEVICE_QA.md) | Glide/Snap/Settle, haptics, accessibility, adaptive/foldable device tests |
| [NATIVE_UI_REFERENCES.md](NATIVE_UI_REFERENCES.md) | Optional SwiftUI and supplementary web references from Spread |
| [WEB_PLAYBOOK.md](WEB_PLAYBOOK.md) | React + TypeScript choices, component stack, data, tests and deploy |
| [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md) | Reference-driven AI website design, imagery, building, refinement and QA |
| [IOS_PLAYBOOK.md](IOS_PLAYBOOK.md) | SwiftUI, Apple UX, gestures, Codemagic and App Store |
| [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) | Privacy, permissions, money, resilience, QA and release gates |
| [AI_WORKFLOW.md](AI_WORKFLOW.md) | Reusable prompts and agent rules |
| [templates/PROJECT_BRIEF.md](templates/PROJECT_BRIEF.md) | Product intake |
| [templates/BRAND_BOARD.md](templates/BRAND_BOARD.md) | Brand identity and actual visual proof |
| [templates/UI_KIT.md](templates/UI_KIT.md) | Reusable components, tokens and gallery proof |
| [templates/SCREEN_MAP.md](templates/SCREEN_MAP.md) | Complete navigation, states and requested screen coverage |
| [templates/SCREEN_SPEC.md](templates/SCREEN_SPEC.md) | Individual screen visual and acceptance contract |
| [templates/DESIGN_QA.md](templates/DESIGN_QA.md) | QA evidence and sign-off |
| [templates/WEBSITE_BRIEF.md](templates/WEBSITE_BRIEF.md) | Client website requirements, design references and content approval |
| [templates/FEATURE_SPEC.md](templates/FEATURE_SPEC.md) | Feature acceptance criteria |
| [templates/DESIGN_CHANGE_SPEC.md](templates/DESIGN_CHANGE_SPEC.md) | Medium/large design change options, constraints, device QA and rollback |
| [templates/ASSET_JOB_MANIFEST.md](templates/ASSET_JOB_MANIFEST.md) | Versioned asset art brief, source/rights, generation layers and approvals |
| [templates/DECISION_LOG.md](templates/DECISION_LOG.md) | One record for approved decisions |
| [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md) | Release proof and sign-off |

## Forking versus starting fresh

A fork of **this** repo contains Gray Matter's entire business website and Git history, **not a ready-to-run app**. You can fork to retain this knowledge library, but remove site-specific code and settings before making a new product. Do not deploy the business homepage from an app fork.

For a clean starting point, the better long-term option is a **separate app-starter template repository** with this folder and platform-specific starter projects. GitHub's **Use this template** creates a new history; a fork retains the parent history: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template

**Today:** Use the existing [app starter generator](https://github.com/WGLewis0721/Graymattertechllc-/tree/main/app-starter) to create a clean React or SwiftUI project with this folder included, or copy **app-design/** into another properly scaffolded project. This avoids importing the production marketing website.

## Origin of the Spread-derived additions

The November 12 additions summarize reusable patterns from [Spread's design documentation](https://github.com/WGLewis0721/spread-app/tree/main/docs/design), inspected at source commit [f32466f](https://github.com/WGLewis0721/spread-app/commit/f32466fa5555bb9ff025ce57b45ed2aafe246136). These are **adapted guidance**, not wholesale copied Spread specs. Spread's brand assets, hour budgets, Wallet navigation, app-specific animation numbers, current feature statuses and older superseded decisions remain exclusively in Spread. This business repository installs no new dependencies or design tokens from that project.

## Arooma-derived additions

The November 12 update also adapts original practices from [Arooma's design brain](https://github.com/WGLewis0721/Arooma-App/tree/main/docs/design), inspected at [source commit 3c3cd7a](https://github.com/WGLewis0721/Arooma-App/commit/3c3cd7a4ef6d94fcd864db61fd75339cf35b5800). The portable material includes **verified-copy and licensing manifests, layered AI art production, non-destructive photo effects, real video verification, selected-object interactions, and Maestro-style UI test evidence**. Arooma's protected photography, brand identity, fragrance facts, exact card artwork, animation settings and product implementation status have **not** been copied. No added media or runtime dependencies are installed.

## Standards

- Begin with the user outcome; build backward to architecture, design and code.
- Favor simple concepts executed exceptionally well: clear, useful, polished, fast and memorable.
- Keep **one source of truth** for domain logic, design tokens, release requirements and current decisions.
- Use accessible proven primitives, not the entire gallery of animated components.
- Product identity belongs to each product; do not reuse corporate brand colors or former products' credentials automatically.
- Keep the released version as the baseline. Every change should be testable and reversible.
- Review current external documentation, package versions, licensing and pricing before each new build.
