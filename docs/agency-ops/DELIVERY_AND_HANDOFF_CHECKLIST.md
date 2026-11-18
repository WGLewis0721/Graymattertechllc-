# Delivery and Handoff Checklist

**Status:** CREATED · **Audience:** Gray Matter staff, internal · **Sequence:** kickoff → access → implement → verify → client review → handoff → support

This checklist is the general process. Use the technical starters for the build itself rather than copying them here.

| Build type | Use these starters and procedures |
|---|---|
| Business website | [websites/](../../websites/) templates and [websites/docs/DEPLOYMENT.md](../../websites/docs/DEPLOYMENT.md) (launch checklist). For app-style or custom sites: [app-design/](../../app-design/README.md) and [app-starter/](../../app-starter/README.md) |
| Workflow automation | [Social DM to Order SOP](../SOPs/workflow%20automations/SOCIAL-DM-TO-ORDER-AUTOMATION-SOP.md) (build, testing, approval, handoff) |
| AI tools or command center | [AI Command Center SOP](../SOPs/workflow%20automations/AI-COMMAND-CENTER-SOP.md) (discovery, ownership, security, cost controls) |

## 1. Kickoff

- [ ] Approved estimate on file, with written acceptance ([QUOTE_AND_INVOICE_PLAYBOOK.md](QUOTE_AND_INVOICE_PLAYBOOK.md))
- [ ] Client agreement linked: [agreement.html](../../agreement.html)
- [ ] Deposit status recorded (received, or not required)
- [ ] Brief approved ([CLIENT_INTAKE_TEMPLATE.md](CLIENT_INTAKE_TEMPLATE.md) Part C)
- [ ] Scope, exclusions, and timeline restated in writing
- [ ] Named client contact and approver

## 2. Access

- [ ] Access list agreed: what, who provides it, and by when
- [ ] Client owns critical accounts where possible (hosting, domain, booking, payments, messaging). Gray Matter receives the access needed to build and maintain
- [ ] Credentials handled in a password manager or the platform's secret store. Never in this repo, in a shared chat, or in a screenshot
- [ ] Access removed or rotated at handover where the agreement requires it

## 3. Implement

- [ ] Built from the matching starter or template (see table above). No second design system
- [ ] Real business facts only: prices, timelines, testimonials, licenses, and claims come from the client or approved sources. Anything missing stays `TODO: client to supply`
- [ ] Changes are on a branch and reviewed before any merge; no direct production edits

## 4. Verify (QA)

- [ ] Every internal link and asset resolves
- [ ] Mobile and desktop layouts checked; no horizontal scroll
- [ ] Forms send a success state only after a real success; errors are shown
- [ ] Keyboard navigation and visible focus states work
- [ ] Reduced-motion preference respected
- [ ] No console errors
- [ ] Evidence recorded: [app-design/templates/DESIGN_QA.md](../../app-design/templates/DESIGN_QA.md) or [app-design/templates/RELEASE_CHECKLIST.md](../../app-design/templates/RELEASE_CHECKLIST.md), as applicable
- [ ] Privacy check: no client data, private contacts, or secrets in the deliverable

## 5. Client review

- [ ] Review on a gated preview, not a public launch
- [ ] Revision allowance applied as quoted. Extra work goes to a change request and a new estimate
- [ ] Client sign-off recorded in writing

## 6. Handoff package

Provide each item below. Items from the [AI Command Center SOP](../SOPs/workflow%20automations/AI-COMMAND-CENTER-SOP.md) and [Social DM SOP](../SOPs/workflow%20automations/SOCIAL-DM-TO-ORDER-AUTOMATION-SOP.md) apply where relevant.

- [ ] Deliverables list (files, pages, workflows)
- [ ] Operating instructions (how to edit content, change status, pause automation)
- [ ] Account ownership confirmation: who owns each account
- [ ] Workflow diagram and list of automatic messages (if automation)
- [ ] Definitions of statuses (if any)
- [ ] Support contact and process
- [ ] Final invoice sent and paid, or payment terms stated in writing

## 7. Ownership defaults

These follow [agreement.html](../../agreement.html) (intellectual property section). Confirm them for each engagement.

| Item | Default |
|---|---|
| Final design and custom assets | Client after final payment |
| Client accounts (hosting, domain, booking, payments) | Client |
| Gray Matter build tools and templates | Not addressed in agreement.html; confirm per engagement |
| Portfolio display of completed work | Gray Matter, unless the client requests otherwise in writing |

## 8. Post-project support offer

- [ ] Offer an optional support or care plan, with the price from [pricing.html](../../pricing.html) only
- [ ] Describe what the plan covers and what it excludes, in writing
- [ ] Do not set up recurring billing until the client agrees in writing

## Done when

The client can operate the deliverable without Gray Matter in the room, owns the accounts that matter, and has a written handoff package and a clear next step.
