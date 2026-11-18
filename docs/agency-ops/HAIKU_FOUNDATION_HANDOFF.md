# Haiku Foundation Handoff — Read This First

**Purpose:** Prepare the minimum viable Gray Matter client-engagement kit for later Fable architecture and integration. **This is a work order, not a claim the implementation exists.**

**Primary specification:** [Essential Agency Starter Kit](ESSENTIAL_AGENCY_STARTER_KIT.md).  
**Repository:** `WGLewis0721/Graymattertechllc-`.  
**Scope:** Documentation and reusable internal templates only; **do not modify the live site**.

## Roles and boundaries

- **Haiku:** Audit existing assets, identify gaps, create a small coherent foundation, supply verified examples, and prepare a precise Fable handoff.
- **Fable:** Resolve architecture and integration decisions after the foundation exists; implement only where justified by real business needs.
- **Human owner:** Approves service prices, legal/contract terms, client records, external communications, invoices, financial commitments, production changes, and final merges.

Do not rebuild existing `app-design/`, `app-starter/`, service pages, funnel, or agreements. Do not implement automatic publishing, outreach sending, Square account changes, or Drive writes in the initial foundation PR.

## Step 1 — Inspect, classify, and link

Read at minimum:
- `README.md`
- `docs/ARCHITECTURE.md`
- `services.html` and `services/`
- `pricing.html` and `agreement.html`
- `app-design/README.md` and `app-starter/README.md`
- `docs/SOPs/` and relevant existing operational files

Use the existing implementation as evidence. Before adding each planned file, search for an equivalent and classify it:

| Status | Meaning | Agent action |
|---|---|---|
| REUSED | Existing complete asset | Link to it, do not copy |
| INCOMPLETE | Partially fits requirement | Record exact missing parts; prefer small correction |
| MISSING | No suitable asset | Propose/create minimal new resource |
| CREATED | Newly added | Link source and intended usage |
| VALIDATED | Reviewed with evidence | Eligible for later Drive sync |
| BLOCKED | Needs owner input, permission, or private account | Stop the affected action, record blocker |

Create a short `FOUNDATION_INVENTORY.md` and a `FOUNDATION_GAPS.md` under `docs/agency-ops/` **if they do not already exist**. Avoid a large agency audit report.

## Step 2 — Create only the smallest useful assets

Focus on these **six artifacts** (reusing and linking existing equivalent assets where possible):

1. **`CLIENT_INTAKE_TEMPLATE.md`** — 10–15 practical discovery questions plus a one-page client brief and next step.
2. **`QUOTE_AND_INVOICE_PLAYBOOK.md`** — Friendly one-page estimate template; three engagement types (Quick Fix, Project Package, Monthly Partner); internal pricing questions; acceptance, deposit/final payment; Square estimate-to-invoice steps; clear distinction between estimate and invoice.
3. **`DELIVERY_AND_HANDOFF_CHECKLIST.md`** — General client delivery, QA, review, account ownership, and post-project support offer; link to existing technical starters.
4. **`TOOLBAG_INDEX.md`** — Links to existing tools and a small shortlist for automation, assessment, backup/security, cloud access, cost cleanup; why/when to use tools, costs and approval/ownership requirements. Do not recommend buying everything.
5. **`CONTENT_AND_OUTREACH_QUEUE_SPEC.md`** — Schema/examples for Muse's content supply and ChatGPT's private morning/afternoon lead queues; explicit approval and privacy gates. Never commit real leads here.
6. **`FOUNDATION_STATUS.md`** — Single status table: asset, status, repo link, validation notes, Drive sync eligibility, blocker/next action.

**Do not create duplicates.** If an adequate equivalent is already in the repo, make the status index point to it and mark it REUSED.

## Step 3 — Demonstrate the workflow safely

Use a **fictional laundry-delivery business** as a dry-run (not a real client's private details).

- Intake yields a concise written problem and desired outcome.
- Quote specifies a realistic *structure*, but leaves any unapproved fee as `[Approved price]`. Do not invent prices or claim a sale.
- Demonstrate quote vs invoice, approval, and the appropriate Square workflow **as a written procedure only**.
- Select existing website/app starter or automation toolbag resources.
- Finish with a sample QA checklist and client handoff summary.
- Record unanswered scope/price questions for the owner.

## Step 4 — Prepare a small Drive replication manifest

Create a **non-operational template** describing:
- repository source path
- source commit/revision
- Drive target path and file ID (when known)
- validation state
- replication status `PENDING / SKIPPED_EXISTING / CREATED / MISMATCH / BLOCKED`

The actual Drive synchronization is **not part of this first Haiku assignment**. Later, Fable or a permitted integration should check the destination, skip existing files, avoid overwrites, and copy only approved business docs. Do not fabricate Drive IDs or claim synchronization occurred.

## Step 5 — Verify and report

- Inspect `git diff --name-only` and confirm all changes are under `docs/agency-ops/` (optional README link permitted).
- Verify every referenced relative path resolves.
- Search for leaked API keys, email addresses, real customer information, invented claims and prices.
- Check all six artifacts are present **or explicitly mapped to existing files**, and show one completed fictional walkthrough.
- Provide a short Fable-ready report: what was found, what was reused, what was built, what's blocked, and the smallest next integration decision.

## Definition of done

The foundation is ready when a human can follow **intake → quote → authorization → delivery → invoice → handoff** by opening no more than a few well-linked documents, and Fable can extend this process without first repairing or deduplicating Haiku's work.

**Stop after the foundation PR.** Do not expand to a full agency operating system, merge, deploy, send mail, issue invoices, or write to Google Drive without further authorization.
