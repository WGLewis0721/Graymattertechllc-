# Gray Matter App Starter | Design-to-Build

Start a new React/TypeScript website or app, or a native SwiftUI iOS app, with required design deliverables.

**New requirement:** Every new project must produce a real visual **Brand Board**, **UI Kit**, **Screen Map**, an individual design for **every screen you request**, working integrated screens, and test evidence. See [Design-to-Build Contract](../app-design/DESIGN_TO_BUILD_CONTRACT.md).

This starter is isolated from Gray Matter's production static business website.

## Generate with the exact screens you want

Run from a local clone of this business repository:

~~~bash
bash app-starter/scripts/new-app.sh web HausWebsite ./projects --kind website --screens 'Home,Menu,Ordering,Events,Contact'
bash app-starter/scripts/new-app.sh ios CollectionApp ./projects --kind app --screens 'Onboarding,Home,Collection,Details,Settings'
~~~

The old command without --screens still works and creates a default **Tasks** demo. Duplicate screen names and overwriting existing projects are rejected.

## What gets generated

| Location | Required purpose |
| --- | --- |
| design/BRIEF.md | Client or product brief, requiring approval |
| design/BRAND_BOARD.md | Brand identity brief; actual visual proof required |
| design/UI_KIT.md | Component states/tokens; visual proof and working components required |
| design/SCREEN_MAP.md | Complete user journeys and navigation |
| design/requested-screens.json | Original exact requested screen list; drift checked |
| design/screens.json | Live screen inventory, design/source/test paths and status |
| design/screens/<id>.md | One individual spec per requested screen |
| design/QA.md | Build, interaction, accessibility and release evidence |
| scripts/check-design.py | Structural gates for plan/design/build/release |
| .github/workflows/design-gates.yml | PR/push design-stage structural check |
| app-design/ | Shared graphic, UX, coding, security and QA library |

**The initial React/SwiftUI task list is a demo, not the completed screens.** A design/coding agent must work through the [full product assignment](../app-design/AI_WORKFLOW.md#copyable-prompt-build-an-entire-new-product) and produce real artwork, reusable components, page designs and code. A manifest entry alone creates no UI.

## Validate

From the newly generated product folder:

~~~bash
python3 scripts/check-design.py --stage plan
python3 scripts/check-design.py --stage design
python3 scripts/check-design.py --stage build
python3 scripts/check-design.py --stage release
~~~

Fresh products intentionally fail these gates until deliverables and evidence exist. They are structural checks, not proof that UI looks good or code works. The GitHub Action runs the design gate; branch protection is separate.

## Run the starter demo

**Web:** Run npm install, npm run test, npm run build and npm run dev inside the generated web folder.

**iOS:** Configure a unique bundle ID, run xcodegen generate --spec project.yml on macOS, then open the generated project in Xcode. Codemagic compiles an unsigned simulator build only.

Never claim customer accounts, payment processing, deployment, or real inquiry forms are ready unless separately implemented and tested. See [VALIDATION.md](VALIDATION.md).
