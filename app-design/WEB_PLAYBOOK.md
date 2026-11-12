# Web and SaaS App Development

**Do not run these commands in the current business-site repository.** It intentionally uses HTML/CSS/vanilla JS and no npm dependencies. The following is guidance for **new, independent React-based projects**.

For a new **client, service or marketing website**, start with [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md) and [templates/WEBSITE_BRIEF.md](templates/WEBSITE_BRIEF.md) before prompting ChatGPT to build pages. Design references and approved visuals must lead to real usable interfaces, not just attractive mockups.

**New Gray Matter starter projects:** Follow the [Design-to-Build Contract](DESIGN_TO_BUILD_CONTRACT.md), including a rendered Brand Board, rendered UI Kit and a designed and implemented page for every requested screen. The generator tracks pages via --screens. Its task list is demonstration code only.

## Choose the right project type

| Need | Default starting point |
| --- | --- |
| Signed-in SPA/dashboard | Vite + React + TypeScript |
| SEO-heavy public routes + app | Next.js + React + TypeScript |
| Very small static marketing site | Plain semantic HTML, CSS and JS |
| Fully native iOS | SwiftUI; see [IOS_PLAYBOOK.md](IOS_PLAYBOOK.md) |

For React projects, use an app-specific token system, optional Tailwind, shadcn/ui components with **one chosen Base UI or Radix foundation**, and purposeful feature dependencies. The shadcn CLI must be used **inside the new compatible app**; see https://ui.shadcn.com/docs/cli. Typical commands in an appropriate new project:

~~~bash
npx shadcn@latest init
npx shadcn@latest add dialog
~~~

Check the actual framework, lockfile, Tailwind version and **components.json** before running commands. Do not overwrite a working style preset casually.

## Organize by domain and user journey

~~~text
src/
  routes/           # screen composition
  components/ui/    # common components
  features/         # complete user features
  domain/           # models and business rules
  lib/              # auth, data, services and integrations
  styles/           # one semantic token system
tests/              # domain, integration and e2e
docs/               # project brief, decisions, release
~~~

Implement first slice: **user opens → creates a real record → sees it persisted → edits it → recovers from failure → returns**. A functional end-to-end flow beats five polished empty pages.

## Data, auth and payments

- Define typed business/data contracts, input validation, server authorization and visible error states.
- Only introduce sign-in when justified. Handle recovery, sign-out, account deletion and session expiry.
- For Supabase, enable and test RLS on exposed tables and confirm that user A cannot access user B. Keep service-role keys **server-side**. https://supabase.com/docs/guides/deployment/going-into-prod
- Stripe is an option for **web payment flows**, not a blanket replacement for iOS In-App Purchase. Verify server-side webhook signatures and granted entitlements. A redirect to success is not payment proof.
- Do not copy production credentials, table IDs, auth providers or client data from another app.

## Quality and deploy

- Add type checking, linting, unit tests for business rules, integration tests for auth/data/payments and browser end-to-end tests for the primary journey.
- Test mobile layouts, scroll, touch, focus, keyboard, screen readers, reduced motion, light/dark and failure/slow-network handling.
- Keep staging and production separate. Review migrations and maintain a rollback route.
- Vercel or another deployment provider publishes the build; it doesn't verify that permissions, purchases or interaction are correct.
- Record the exact build, release version, tested URL and pass/fail evidence in [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md).

## Component choices

Use [LIBRARY_CATALOG.md](LIBRARY_CATALOG.md) as a task-based selector: Sonner for toast, Vaul for web sheet, cmdk for command search, NumberFlow for animated digits, gallery components for specific visual cases. Avoid redundant packages and prioritize accessibility and testability.
