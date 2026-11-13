# Create, Upgrade, Export and Correct | Gray Matter Design Workflow

**Goal:** The same professional process applies to a new website/app and to a redesign of an existing client website. Deliver a traceable **pre-build plan/spec, reference and resource register, brand board, UI kit, individual editable wireframes + PNG exports, full implementation and corrective QA**.

## 1. Choose the workflow

### A. Create a new app or website

From a local clone of Gray Matter:

~~~bash
python3 -m pip install -r app-starter/scripts/requirements-design.txt
bash app-starter/scripts/new-app.sh web HausWebsite ./projects --kind website --screens 'Home,Menu,Ordering,Events,Contact'
# Or:
bash app-starter/scripts/new-app.sh ios MyNativeApp ./projects --kind app --screens 'Onboarding,Home,Collection,Details,Settings'
~~~

This scaffolds the entire original requested screen inventory. It **immediately exports draft low-fidelity wireframe PNGs and editable SVGs** for every named screen, in desktop/mobile or native iPad/iPhone proportions.

### B. Upgrade an existing website from a screenshot

~~~bash
python3 -m pip install -r app-starter/scripts/requirements-design.txt
bash app-starter/scripts/upgrade-site.sh ./my-existing-site \
  --name ClientSite --screens 'Home,Services,Contact' \
  --reference ./screenshots/existing-home.png
~~~

Run from a checkout of Gray Matter; the target is an **existing website source folder**, not an image-only design. The script checks for an existing site and refuses to overwrite an existing design folder or design checker. It copies the original screenshot into the target's design/evidence/before/, creates a baseline audit and the same wireframe/design library, **without changing existing HTML, React, CSS, scripts or project metadata**.

**Privacy:** Before committing screenshots, review them for customer data, emails, personal information, secrets and licensed assets, especially in public repositories. Prefer private repositories for client materials.

**Important:** A screenshot cannot reveal hidden menus, business logic, forms, databases, security or accessibility. The AI agent must inspect real code, test current behavior and preserve the approved working baseline.

## 2. Mandatory pre-build specification and resources

Both modes create:
- design/BRIEF.md
- design/PREBUILD_PLAN.md
- design/REFERENCES.md and design/references.json
- design/BRAND_BOARD.md and design/UI_KIT.md
- design/SCREEN_MAP.md, design/requested-screens.json and design/screens.json
- design/screens/<screen-id>.md for each requested screen
- design/CORRECTIVE_ACTION.md, design/corrections.json and design/QA.md
- design/UPGRADE_AUDIT.md only for screenshot-driven upgrades

The prebuild plan must state the exact user outcome, current state, alternatives considered, chosen design, screen-level scope, resources/dependencies, cost/license decisions, risks, implementation sequence and acceptance tests.

**The research register must be factual.** For every reference (Pinterest, Mobbin, Apple HIG, Dribbble, existing branding, UI library, typography, asset source), record title, original URL or source file, specific lesson applied, what must not be copied, rights/cost, review date and whether the source was actually inspected. Do not claim a web link was verified if it wasn't opened.

~~~json
{
  "sources": [{
    "title": "Official Apple Human Interface Guidelines",
    "category": "platform",
    "url": "https://developer.apple.com/design/human-interface-guidelines/",
    "why_use": "System navigation, controls and interaction principles",
    "what_not_to_copy": "Apple brand assets or trademark presentation",
    "license_or_terms": "Reference documentation; review terms",
    "checked_on": "2026-11-12",
    "inspected": true
  }]
}
~~~

Replace the example with **sources actually studied for that project**. Run:

~~~bash
cd ./projects/HausWebsite
python3 scripts/check-design.py --stage plan
~~~

The plan gate fails until the brief, plan/spec, reference narrative and at least one properly documented inspected source are supplied. For upgrades, it also requires a completed functionality/baseline audit and an actual existing screenshot. Passing the structural check does **not** substitute for real owner approval.

## 3. Wireframes and PNG export

The generator provides per-screen editable JSON at design/wireframes/<screen-id>.json, plus automatically rendered **draft** previews:

    design/wireframes/exports/home-desktop.svg
    design/wireframes/exports/home-desktop.png
    design/wireframes/exports/home-mobile.svg
    design/wireframes/exports/home-mobile.png

Edit sections, labels and block heights in the JSON, then rerender all screens or one:

~~~bash
python3 scripts/render-wireframes.py --root . 
python3 scripts/render-wireframes.py --root . --only home
~~~

The SVGs are editable vector wireframes; the PNGs are presentation/export images. **The initial draft is a generic structure, not an approved researched design.** An AI agent/designer must develop the real hierarchy, component decisions, brand board, UI kit and high-fidelity individual screen proofs. The draft files do not automatically satisfy the design gate.

## 4. Before/after PNG comparison for existing sites

After implementing and running the actual redesigned website, save a screenshot of the **real resulting page** (not its mockup) under design/evidence/after/ and run:

~~~bash
python3 scripts/compare-screenshots.py \
  --root . --screen home \
  --before design/evidence/before/original.png \
  --after design/evidence/after/home.png \
  --out design/evidence/comparisons/home-before-after.png
~~~

The script makes a labeled side-by-side PNG and registers before/after evidence in design/screens.json. It **refuses to use a draft wireframe as the after screenshot**. For an additional existing page, set its `existing_page` to true and collect a proper before/after pair. Document image capture size/browser to avoid claiming improvement on incomparable viewports.

## 5. Corrective workflow when something is wrong

An issue discovered in screenshots, user review or tests **must not be silently patched and declared solved**.

~~~bash
python3 scripts/open-correction.py \
  --id nav-does-not-open --screen home \
  --problem 'Menu button fails on small phones' \
  --evidence design/evidence/fail-nav.png
~~~

The script creates a dedicated `design/corrections/nav-does-not-open.md` defect/spec record and adds an open issue to `design/corrections.json`. The owner/agent must record: observed vs expected behavior, approved reference, root cause, safe corrective plan, affected files, before/after evidence, regression test results, reviewer approval and rollback method.

Once the real fix is verified, fill the spec and the registry's `changed_files`, `regression_evidence` and `reviewer_approval`, then mark status `closed`. The **release gate fails if any correction remains open or is closed without evidence and review**. Repeat the cycle when the fix is still wrong.

## 6. Validation, honesty and handoff

~~~bash
python3 scripts/check-design.py --stage plan
python3 scripts/check-design.py --stage design
python3 scripts/check-design.py --stage build
python3 scripts/check-design.py --stage release
~~~

These check that files, declared statuses, actual PNG/SVG wireframes, source references, implementation evidence, screenshots and corrective records exist. They **do not inspect whether the app really functions, whether copy is factually accurate or whether the visual design is excellent**.

Additionally run framework builds/unit/E2E, manual device/browser audits, accessibility checks and actual submission/deployment verification. The new starter's generated GitHub Action checks the **design** structural stage. To prevent bypass, make it a required branch-protection check in the product repo.

**Deliver to the user:** signed-off plan/spec, source and inspiration register, brand board, UI kit, named screen inventory, editable wireframes + PNGs, finished screen exports, working build, before/after comparison for upgrades, resolved defect register and tested evidence. Never claim a project is shipped based only on these documents.
