# Toolbag Index

**Status:** CREATED · **Rule:** link to what exists; buy or subscribe only when a paid engagement needs it. No blanket subscriptions.

Costs and vendor features are **not verified** in this repo. Check current vendor pricing and terms before recommending or buying anything.

## 1. Existing resources (REUSED — link, do not copy)

| Need | Resource | Use when | Ownership / approval |
|---|---|---|---|
| Website template (vertical) | [websites/](../../websites/README.md) | A small-business brochure or booking site fits a vertical (barbers, coaches, contractors, lawyers, real estate, detailers, food trucks, hospitality and cleaning, entrepreneurs) | Client repo per project; launch needs client sign-off |
| Website launch checklist | [websites/docs/DEPLOYMENT.md](../../websites/docs/DEPLOYMENT.md) | Before any client site goes live | Gray Matter; launch needs approval |
| Client website intake | [websites/docs/INTAKE.md](../../websites/docs/INTAKE.md) | After the brief is approved, for website templates | Client supplies inputs |
| Custom web or SaaS app | [app-starter/](../../app-starter/README.md) and [app-design/](../../app-design/README.md) | A custom app or a site that needs more than a template | Gray Matter; design-to-build evidence required |
| iOS app | [app-starter/ios/](../../app-starter/ios/README.md) | A native SwiftUI app | Gray Matter; Apple account owned by the client or Gray Matter, confirmed at kickoff |
| Website design workflow | [app-design/WEBSITE_DESIGN_WORKFLOW.md](../../app-design/WEBSITE_DESIGN_WORKFLOW.md) | Reference-driven design for a client site | Gray Matter |
| AI tools and cost controls | [AI Command Center SOP](../SOPs/workflow%20automations/AI-COMMAND-CENTER-SOP.md) | Client needs a shared AI workspace or model routing | Client-owned accounts preferred; cost controls in Step 11 of the SOP |
| Social DM to order automation | [Social DM SOP](../SOPs/workflow%20automations/SOCIAL-DM-TO-ORDER-AUTOMATION-SOP.md) | Orders taken through Facebook or Instagram messages | Client-owned Airtable, ManyChat, and booking/payment systems preferred |
| Client forms | Formspree (named in [websites/docs/INTAKE.md](../../websites/docs/INTAKE.md)) | Static site contact forms | Client or Gray Matter account; confirm at kickoff |
| Client agreement | [agreement.html](../../agreement.html) | Every paid engagement | Owner-approved terms |

## 2. Shortlist by need (services that use these tools)

These are the existing service pages, which define what Gray Matter sells. Each one needs a fit check before quoting.

| Need | Service page | Why and when to use it | Cost and approval |
|---|---|---|---|
| Automation | [Workflow Automation](../../services/workflow-automation.html) | Repeated tasks that cost time every week | Vendor costs vary; owner approves tool choice and any subscription |
| Assessment | [Business Technology Checkup](../../services/business-technology-checkup.html) | A client wants a clear view of current tools, risks, and quick wins | Mostly time; no third-party cost assumed |
| Backup and security | [Backup & Recovery](../../services/backup-recovery.html), [Business Security](../../services/business-security.html) | Data loss risk, account protection, or recovery testing is needed | Vendor costs vary; client owns backup and security accounts |
| Cloud and remote access | [Work From Anywhere](../../services/work-from-anywhere.html); [cloud-consulting.html](../../cloud-consulting.html) for technical buyers | Staff need secure access from outside the office | Client-owned accounts; no shared admin logins |
| Cost cleanup | [Technology Cost Cleanup](../../services/technology-cost-cleanup.html) | Overlapping or unused software subscriptions | No new subscriptions; cancellations need client approval |

## 3. Candidate tools (not adopted)

These tools appear in the existing SOPs. Adopt one only when a paid engagement needs it, and record the owner.

| Tool | Where it appears | Decision needed |
|---|---|---|
| Airtable | Social DM SOP | Confirm client ownership before first use |
| ManyChat | Social DM SOP | Confirm client ownership and approval for messaging |
| n8n | Social DM SOP | Confirm hosting and credentials boundary |
| Square | Starter kit (proposed for invoices) | BLOCKED until the owner decides; see [QUOTE_AND_INVOICE_PLAYBOOK.md](QUOTE_AND_INVOICE_PLAYBOOK.md) |
| OpenRouter, LiteLLM, Portkey | AI Command Center SOP | Choose one only for an approved AI workspace |

## 4. Gaps (deferred)

- A generic automation starter (trigger/action map, credentials boundary, retries, alerts, rollback, tests) is **not built**. The Social DM SOP already covers the build and testing steps for one workflow. Build the generic version only after a second paid automation engagement.
- A generic technology assessment starter is **not built**. The Business Technology Checkup page and the AI Command Center SOP discovery steps cover the content. Build the template after a second paid checkup.

## Done when

A staff member can find the right existing resource in one or two clicks, knows its cost and approval owner, and does not buy a tool that no engagement needs.
