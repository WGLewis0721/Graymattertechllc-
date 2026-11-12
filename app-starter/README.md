# Gray Matter App Starter

A clean starting point for **React/TypeScript web apps** and **native SwiftUI iPhone/iPad apps**. The existing [app-design library](../app-design/README.md) remains the single reference for design, components, accessibility, architecture, AI prompts, security and release checklists.

The source stays separate from Gray Matter's production website. **Nothing in this directory is installed or executed by the website.**

## Generate a new product

From a local clone of this business repository:

    bash app-starter/scripts/new-app.sh web MyApp ~/Projects

or:

    bash app-starter/scripts/new-app.sh ios MyApp ~/Projects

The generator copies only the chosen platform, its own settings, and the shared app-design library into a new project. It does not copy the website or Git history and refuses to overwrite an existing folder.

## Website design workflow

For client-facing or marketing websites, use [the reference-driven ChatGPT website workflow](../app-design/WEBSITE_DESIGN_WORKFLOW.md) and [client website brief](../app-design/templates/WEBSITE_BRIEF.md). The app-starter generator already copies the full app-design library into new projects, so there is no separate copy to maintain here.

## Web project

    cd ~/Projects/MyApp
    npm install
    npm run test
    npm run build
    npm run dev

React + TypeScript + Vite, with an accessible responsive local-storage task demonstration. shadcn/ui, Base UI, Radix, Sonner, Vaul, and gallery effects are **opt-in**. Choose intentionally from the catalog; they are not needed for the starting experience.

## Native iOS project

    cd ~/Projects/MyApp
    xcodegen generate --spec project.yml
    open MyApp.xcodeproj

SwiftUI + a local task store, XcodeGen and XCTest. A Codemagic configuration performs unsigned Simulator compilation only. Configure signing, a unique bundle ID and App Store delivery separately.

## Advanced design guidance from Spread

The starter copies the central app-design folder into each new app. That now includes [UX/design-spec reviews](../app-design/UX_REVIEW_AND_SPEC_PROTOCOL.md), [editorial card and image-layer rules](../app-design/EDITORIAL_CARD_AND_ARTWORK.md), [native tactile motion and device acceptance](../app-design/TACTILE_MOTION_AND_DEVICE_QA.md), and [optional SwiftUI references](../app-design/NATIVE_UI_REFERENCES.md). These are reference methods, not preinstalled components, libraries or Spread-branded assets.

## Before a real launch

Fill out [PROJECT_BRIEF](../app-design/templates/PROJECT_BRIEF.md), choose a platform playbook, and complete the [release checklist](../app-design/templates/RELEASE_CHECKLIST.md).

**These are demos, not production-ready applications.** There is no user authentication, cloud backend, sensitive-data persistence, subscriptions, entitlements, signed release or payment processing.

## Contents

- web/ = React web starter
- ios/ = native SwiftUI starter
- scripts/new-app.sh = create an independent, single-platform project
- ../app-design/ = reusable design/development knowledge, maintained once

Verification: See VALIDATION.md.
