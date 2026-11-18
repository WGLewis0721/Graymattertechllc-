# Foundation Status

Single status table for the foundation. Validation notes describe checks actually run. Drive sync is not performed in this foundation.

**Legend — Status:** REUSED · INCOMPLETE · MISSING · CREATED · VALIDATED · BLOCKED
**Legend — Drive sync:** `PENDING` · `SKIPPED_EXISTING` · `CREATED` · `MISMATCH` · `BLOCKED` (see [DRIVE_REPLICATION_MANIFEST.md](DRIVE_REPLICATION_MANIFEST.md))

| Asset | Status | Repo link | Validation notes | Drive sync eligibility | Blocker / next action |
|---|---|---|---|---|---|
| Client intake (universal) | CREATED | [CLIENT_INTAKE_TEMPLATE.md](CLIENT_INTAKE_TEMPLATE.md) | Links checked; no contact data | PENDING | Owner approves the questions |
| Quote, approval, and invoice playbook | CREATED | [QUOTE_AND_INVOICE_PLAYBOOK.md](QUOTE_AND_INVOICE_PLAYBOOK.md) | Prices limited to `[Approved price]` and published values; terms match agreement.html | PENDING (after payment steps approved) | BLOCKED: Square decision and account (G1, G2) |
| Delivery and handoff checklist | CREATED | [DELIVERY_AND_HANDOFF_CHECKLIST.md](DELIVERY_AND_HANDOFF_CHECKLIST.md) | Links to existing starters and SOPs checked | PENDING | Owner confirms ownership defaults (G10) |
| Toolbag index | CREATED | [TOOLBAG_INDEX.md](TOOLBAG_INDEX.md) | Links to existing resources checked; no vendor costs asserted | Not eligible (internal) | Owner approves any new tool |
| Content and outreach queue spec | CREATED (format only) | [CONTENT_AND_OUTREACH_QUEUE_SPEC.md](CONTENT_AND_OUTREACH_QUEUE_SPEC.md) | Fictional examples only; no leads or emails | Not eligible (internal) | BLOCKED: Muse input format (G7); outreach controls (G8) |
| Foundation status (this file) | CREATED | [FOUNDATION_STATUS.md](FOUNDATION_STATUS.md) | Self-checked against the handoff table | Not eligible (internal) | None |
| Fictional dry run | CREATED | [FICTIONAL_DRY_RUN_LAUNDRY_DELIVERY.md](FICTIONAL_DRY_RUN_LAUNDRY_DELIVERY.md) | Fictional business; prices as placeholders; no item checked | Not eligible (example) | Built-site test in a later PR (G13) |
| Drive replication manifest | CREATED (template) | [DRIVE_REPLICATION_MANIFEST.md](DRIVE_REPLICATION_MANIFEST.md) | No Drive IDs; none fabricated | Template only | BLOCKED: Drive folder confirmation (G9) |
| Foundation inventory | CREATED | [FOUNDATION_INVENTORY.md](FOUNDATION_INVENTORY.md) | Every existing asset classified | Not eligible (internal) | None |
| Foundation gaps | CREATED | [FOUNDATION_GAPS.md](FOUNDATION_GAPS.md) | Owner and Fable decisions listed | Not eligible (internal) | Owner and Fable decisions |
| Fable handoff report | CREATED | [FABLE_HANDOFF_REPORT.md](FABLE_HANDOFF_REPORT.md) | Summarizes this foundation | Not eligible (internal) | Fable review |
| Client service agreement | REUSED | [agreement.html](../../agreement.html) | Not changed | Not in scope | Owner decides scope (G5) |
| Published pricing | REUSED | [pricing.html](../../pricing.html) | Not changed | Not in scope | Owner approves fit-check prices (G3) |
| Service catalog | REUSED | [services/](../../services/) | Not changed | Not in scope | None |
| Website intake | REUSED | [websites/docs/INTAKE.md](../../websites/docs/INTAKE.md) | Not changed | Not in scope | None |
| Website templates | REUSED | [websites/](../../websites/README.md) | Not changed | Not in scope | None |
| App and web starters | REUSED | [app-starter/](../../app-starter/README.md), [app-design/](../../app-design/README.md) | Not changed | Not in scope | None |
| Payment configuration | REUSED (unchanged) | [js/payment-config.js](../../js/payment-config.js) | Stripe disabled; not changed | Not in scope | Owner decision (G1) |
| Muse and outreach contracts | MISSING (external) | Not in repo | Cannot be validated from the repo | Not eligible | BLOCKED: owner input (G7, G8) |
| Live website | Unchanged | — | No production file changed in this PR | Not in scope | None |
