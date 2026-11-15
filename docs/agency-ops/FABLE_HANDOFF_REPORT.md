# Fable Handoff Report

**From:** Haiku foundation pass · **Base:** [PR #39](https://github.com/WGLewis0721/Graymattertechllc-/pull/39) branch `docs/agency-mvp-haiku-foundation` · **Scope:** documentation only

## What was found

- Most of the starter kit already exists: service pages, published pricing, the client agreement, website templates and intake, app and web starters, design and release templates, two workflow SOPs, and the approved asset manifest. Details are in [FOUNDATION_INVENTORY.md](FOUNDATION_INVENTORY.md).
- Missing: a universal intake, a quote and invoice playbook, a general delivery and handoff checklist, a toolbag index, and queue formats for content and outreach.
- Payment terms already exist in [agreement.html](../../agreement.html) (50% deposit, 50% completion, optional 40/30/30 for Premium / Full Platform builds of $800 or more). They were used, not changed.

## What was reused

Linked, not copied: services, pricing, agreement, website intake and templates, app and web starters, design and release templates, SOP handoff and approval steps, and the approved asset manifest. No existing file was edited.

## What was built

| File | Purpose |
|---|---|
| CLIENT_INTAKE_TEMPLATE.md | Discovery questions, engagement type, one-page brief, stage tracker |
| QUOTE_AND_INVOICE_PLAYBOOK.md | Three engagement types, estimate template, estimate vs invoice, acceptance |
| DELIVERY_AND_HANDOFF_CHECKLIST.md | Kickoff to support, ownership defaults, handoff package |
| TOOLBAG_INDEX.md | Existing resources, service shortlist, deferred items |
| CONTENT_AND_OUTREACH_QUEUE_SPEC.md | Muse-ready 30-day queue, private registry, morning and afternoon queues, send gates |
| DRIVE_REPLICATION_MANIFEST.md | Non-operational manifest template with statuses; no IDs |
| FICTIONAL_DRY_RUN_LAUNDRY_DELIVERY.md | Fictional walkthrough from intake to handoff |
| FOUNDATION_STATUS.md, FOUNDATION_INVENTORY.md, FOUNDATION_GAPS.md | Status table, classifications, open decisions |

All files are under `docs/agency-ops/`. No live page, script, or config was changed.

## What is blocked

1. **Square.** The proposed invoicing path is not approved, the owner's Square account is not confirmed, and the agreement names other payment methods. The Square steps are written as a procedure only.
2. **Muse and outreach.** Their input formats and send tools are not in the repo. Nothing is connected or sent.
3. **Google Drive.** No destination folder confirmed and no Drive check performed. No IDs were created.
4. **Prices.** Ten services still need approved prices or the fit-check wording stays.

## Smallest next integration decision

**Choose the payment path for invoices** (Square with Gray Matter's own account, or the existing methods in the agreement). Everything after acceptance depends on it.

Then, in order:
1. Confirm the Drive destination folder, so the manifest can record `SKIPPED_EXISTING` or `CREATED`.
2. Confirm Muse's input format, so the queue spec can be checked against a real consumer.

## Validation run

Checks run on the new files:

- All relative links resolve (script check: 0 broken).
- No email addresses, API keys, or secret-like values found. The only matches were the word "secret" in guidance text.
- Dollar amounts appear only as the $800 agreement threshold; no fees were invented. Published prices were not repeated.
- No file outside `docs/agency-ops/` changed.

## Request to Fable

Review the gaps in [FOUNDATION_GAPS.md](FOUNDATION_GAPS.md), decide G1 and G7 first, and extend these files rather than creating parallel ones.
