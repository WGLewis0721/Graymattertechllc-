# Gray Matter — Essential Agency Starter Kit (MVP)

**Status:** Approved planning brief; implementation not started.  
**Owner:** Gray Matter Digital Solutions  
**Source of truth:** This GitHub repository for shared standards, templates, and technical resources.  
**Business-facing copy:** Google Drive, after verification and approval.  
**Next agent:** Haiku should read [HAIKU_FOUNDATION_HANDOFF.md](HAIKU_FOUNDATION_HANDOFF.md) first.

## Mission

Build the smallest practical set of resources needed to take a customer from **first conversation → discovery → quote → approval → delivery → invoice/payment → handoff**, with optional ongoing support. Preserve existing work and avoid agency-scale administration until client demand justifies it.

This is approximately **20% of the original full agency operating system plan**. The goal is meaningful, repeatable client engagements, not a large document collection or a custom business management platform.

### Non-negotiable rules

1. **Inspect before creating.** Reuse complete assets already in `services/`, `app-design/`, `app-starter/`, `docs/`, `pricing.html`, `agreement.html`, and the existing website funnel. Mark existing, partial, and missing capabilities before any writes.
2. **Repository first.** Proposed standards and templates are developed and validated in GitHub; approved human-readable deliverables are then copied to Google Drive.
3. **Google Drive is not a second source of truth.** Check existing folders and documents by path/title and, when available, durable ID. If already present, **skip**. Report differences instead of overwriting. Maintain a small source-to-Drive manifest.
4. **Protect clients.** This repository is public. Do not commit client names, private inquiries, prospect email addresses, quotes with real amounts, contracts, invoices, credentials, access tokens, or client data. Keep sensitive operational records in restricted systems.
5. **Do not change the live website.** No production code, deployment, checkout, pricing page, or service claims may be altered under this initiative.
6. **No fabricated facts.** Pricing, delivery dates, client outcomes, certifications, testimonials, and agreements must be grounded in existing approved sources or remain clearly marked placeholders.
7. **Small, reviewable changes.** Use focused PRs; do not merge, send messages, issue bills, buy subscriptions, or configure live production integrations without authorization.

## What to build — six essentials

### 1. Simple service menu

**Intent:** Explain what Gray Matter can do and how each service is purchased without writing a unique sales package for every job.

- [ ] Inventory the current ten service pages; link to them instead of duplicating their definitions.
- [ ] Define three reusable *engagement types*: **Quick Fix**, **Project Package**, and **Monthly Partner**.
- [ ] Create a one-page internal service menu identifying the client problem, deliverables, exclusions, qualification questions, and next step.
- [ ] Do not invent public prices. Capture scope and cost assumptions internally for review.

**Done when:** A prospect can be mapped to an existing service and a suitable engagement type.

### 2. Discovery and client intake

**Intent:** Record enough information to recommend a solution and estimate the work.

- [ ] One universal discovery questionnaire: contact (in private records), business goal, current process/tools, pain points, desired outcome, timeframe, budget range, decision-maker, access/dependencies.
- [ ] One concise client brief / consultation note template.
- [ ] One small stage tracker: **New → Discovery → Quoted → Approved → In Delivery → Complete → Support**.
- [ ] Prefer existing tools rather than building a CRM or client portal.

**Done when:** One discovery conversation produces a clear scope decision and next action.

### 3. Quotes, approval, and invoices — priority

**Intent:** Send a friendly, credible price with clear boundaries and collect payment without custom billing software.

- [ ] A one-page **estimate/quote template**: client/project label; goal; scope and deliverables; inclusions; exclusions; one-time fee or line items; optional recurring costs; revision allowance if approved; assumptions; validity period; payment milestones; acceptance method.
- [ ] Templates for **Quick Fix**, **Project Package**, and **Monthly Partner**; keep language approachable and avoid intimidating legal or technical jargon.
- [ ] A private pricing worksheet: estimated hours, rate assumptions, third-party fees, contingency, margin, approved total. Never silently turn assumptions into public prices.
- [ ] A short agreement/authorization checklist; reuse `agreement.html` as a source where appropriate, without treating a template as legal advice.
- [ ] Document **Square Estimates → customer acceptance → Square Invoice → payment confirmation/receipt** as the preferred initial workflow. Set up and use **Gray Matter's own** business account; never a client's account.
- [ ] Distinguish **estimate (not yet agreed)** from **invoice (approved/completed work or a due milestone)**. Define deposit and final balance where applicable.
- [ ] Produce a **fictional laundry-delivery website/booking example** using placeholder scope and `[Approved price]` only. Do not expose real client project terms in this public repo.
- [ ] Store actual sent estimates, invoices, payment status, and receipts in the invoicing system—not in GitHub.

**Done when:** A small client job can be scoped, priced, approved, invoiced, and documented without building a payment application.

### 4. Minimum delivery toolbag

**Intent:** Start projects with proven methods, not blank pages.

- [ ] One common delivery checklist: kickoff → access → implement → verify → client review → handoff.
- [ ] Reuse `app-design/` and `app-starter/` for websites and apps; do not create a second design system.
- [ ] One lightweight automation starter: trigger/action map, credentials boundary, retries, alerts, rollback, test cases.
- [ ] One lightweight technology assessment starter: current tools, risks, quick wins, prioritized recommendations.
- [ ] A small vendor/tool registry: recommended use cases, selection criteria, alternatives, third-party costs and ownership. No blanket subscriptions.
- [ ] One QA/acceptance checklist and one handoff package (deliverables, operating instructions, account ownership, next steps, optional support).

**Done when:** Common website, workflow, and technology-assessment engagements share a coherent start-to-finish process. **Do not** build ten complete technical frameworks yet; expand only against real paid use cases.

### 5. Lightweight marketing and lead engine

**Intent:** Feed the existing Muse publisher and ChatGPT outreach workflow, not replace them.

- [ ] A rolling 30-day **Muse-ready** content queue with subject, service connection, caption, approved asset link, CTA, intended date, and status.
- [ ] Reusable content brief and editorial approval checklist; only approved posts should enter the publishing queue.
- [ ] A **private** prospect registry with source evidence, service fit, outreach status, suppression/opt-out records, and follow-up dates.
- [ ] A per-lead tailored email template plus **morning and afternoon** outreach queue formats.
- [ ] Keep external sends subject to appropriate approval, applicable legal requirements, and deduplication; do not implement unattended public outreach just because a file exists.

**Done when:** Agents have precise queue formats and a repeatable process without a custom marketing platform.

### 6. Google Drive replication

**Intent:** Make approved business documents easy to use while keeping GitHub canonical.

- [ ] Determine the existing Gray Matter destination folder before creating one.
- [ ] Mirror only approved, human-facing docs (brief, quote template, SOP, handoff, service menu), not source code or sensitive data.
- [ ] Skip a matching existing item; never silently replace it.
- [ ] Record GitHub path/revision, Drive ID/link, check date, and `CREATED / SKIPPED_EXISTING / MISMATCH / BLOCKED` in a sync manifest.
- [ ] If editing a Drive-native original is needed, request a separate authorized operation rather than creating shadow copies.

**Done when:** Docs have traceable source links and no duplicate files or destructive overwrites.

## Completion criteria

- [ ] Initial repo/Drive inventory performed; every item classified `REUSED`, `MISSING`, `INCOMPLETE`, `CREATED`, `VALIDATED`, or `BLOCKED`.
- [ ] One representative **fictional** client can move through discovery, quote, approval, delivery checklist, invoice instructions, and handoff.
- [ ] Templates are useful, not placeholder-only shells; unknown business details are called out rather than fabricated.
- [ ] Existing website/app assets are linked rather than duplicated.
- [ ] Files are reviewed and navigable; sensitive information is absent.
- [ ] Drive replication occurs only after approval and presence checks.
- [ ] Each PR reports what exists, what changed, tests/checks, blockers, and the next assignment.

## Explicitly out of scope (for now)

Custom CRM, customer portal, billing/payment code, full support desk, elaborate dashboards, ten complete vendor-specific frameworks, unnecessary AI agent orchestration, production changes, public client case studies without permission, and automatic emails or payments.

## Suggested order of effort

1. **Quote + intake + basic handoff:** immediate client value.
2. **Shared service/toolbag and delivery process:** reduce repeat work.
3. **Muse and outreach queue contracts:** feed existing agents.
4. **Drive copy/manifest:** replicate validated materials, skip existing.
5. **Broader agency architecture:** defer to Fable once the foundation is real.

**Success means a client engagement is easier to sell, deliver, and bill—not that a large number of files were generated.**
