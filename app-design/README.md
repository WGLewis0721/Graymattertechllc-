# Gray Matter | Reusable App Design & Development Library

**Purpose:** A reference library for starting future web, SaaS, and native iOS products using proven design and development practices. Last reviewed **November 11, 2026**.

**Important:** This folder is documentation, not a runnable starter app. The parent repository is the live, static Gray Matter business website; its HTML/CSS/JavaScript must not be replaced with React or SwiftUI because of the references here.

## New app: follow these steps

1. Copy [templates/PROJECT_BRIEF.md](templates/PROJECT_BRIEF.md) into the new product repository and fill in the problem, audience, first useful outcome, platform, business model, and constraints.
2. Choose a product path: [Web / SaaS](WEB_PLAYBOOK.md), [Native iPhone / iPad](IOS_PLAYBOOK.md), or both with a deliberate shared API.
3. Create a unique [design system](DESIGN_SYSTEM.md): typography, colors, graphic identity, states, navigation, animation, and interaction behavior.
4. Use the [13-source UI catalog](LIBRARY_CATALOG.md) to pick only the components justified by real screens. React components do **not** become SwiftUI components.
5. Implement one complete vertical slice with **real persistence** and error handling, then expand. Give an AI coder the [workflow prompts](AI_WORKFLOW.md).
6. Check [security, payments, testing, and launch gates](SECURITY_AND_RELEASE.md). Use the [release evidence checklist](templates/RELEASE_CHECKLIST.md).
7. Record architecture and UX decisions in [templates/DECISION_LOG.md], and individual feature criteria in [templates/FEATURE_SPEC.md].

## Index

| File | Role |
| --- | --- |
| [LIBRARY_CATALOG.md](LIBRARY_CATALOG.md) | 13 screenshot resources, links, best uses, compatibility and selection |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Graphic design, research, branding, UX, motion, accessibility |
| [WEB_PLAYBOOK.md](WEB_PLAYBOOK.md) | React + TypeScript choices, component stack, data, tests and deploy |
| [IOS_PLAYBOOK.md](IOS_PLAYBOOK.md) | SwiftUI, Apple UX, gestures, Codemagic and App Store |
| [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) | Privacy, permissions, money, resilience, QA and release gates |
| [AI_WORKFLOW.md](AI_WORKFLOW.md) | Reusable prompts and agent rules |
| [templates/PROJECT_BRIEF.md](templates/PROJECT_BRIEF.md) | Product intake |
| [templates/FEATURE_SPEC.md](templates/FEATURE_SPEC.md) | Feature acceptance criteria |
| [templates/DECISION_LOG.md](templates/DECISION_LOG.md) | One record for approved decisions |
| [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md) | Release proof and sign-off |

## Forking versus starting fresh

A fork of **this** repo contains Gray Matter's entire business website and Git history, **not a ready-to-run app**. You can fork to retain this knowledge library, but remove site-specific code and settings before making a new product. Do not deploy the business homepage from an app fork.

For a clean starting point, the better long-term option is a **separate app-starter template repository** with this folder and platform-specific starter projects. GitHub's **Use this template** creates a new history; a fork retains the parent history: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template

**Today:** Create a fresh project of the right kind (React or SwiftUI) and copy this **app-design/** folder into it. This preserves useful knowledge without importing a production marketing website.

## Standards

- Begin with the user outcome; build backward to architecture, design and code.
- Favor simple concepts executed exceptionally well: clear, useful, polished, fast and memorable.
- Keep **one source of truth** for domain logic, design tokens, release requirements and current decisions.
- Use accessible proven primitives, not the entire gallery of animated components.
- Product identity belongs to each product; do not reuse corporate brand colors or former products' credentials automatically.
- Keep the released version as the baseline. Every change should be testable and reversible.
- Review current external documentation, package versions, licensing and pricing before each new build.
