# Foundation Inventory

**Scope:** Existing repo assets checked against the [Essential Agency Starter Kit](ESSENTIAL_AGENCY_STARTER_KIT.md) and the [Haiku Foundation Handoff](HAIKU_FOUNDATION_HANDOFF.md). Classifications follow the handoff's status table.

## Existing assets

| Asset | Status | Evidence | Note |
|---|---|---|---|
| Service catalog (10 services) | REUSED | [services.html](../../services.html), [services/](../../services/) | Link to these; do not duplicate definitions |
| Published prices and packages | REUSED | [pricing.html](../../pricing.html); [ARCHITECTURE.md §4](../ARCHITECTURE.md) | Only source for public prices |
| Client service agreement | REUSED | [agreement.html](../../agreement.html) | Website-design scope; payment terms: 50% deposit, 50% completion, optional 40/30/30 for Premium / Full Platform builds of $800 or more |
| Client intake (websites) | REUSED | [websites/docs/INTAKE.md](../../websites/docs/INTAKE.md) | Website-specific; used after the brief is approved |
| Discovery questions (AI tools) | INCOMPLETE | [AI Command Center SOP §5](../SOPs/workflow%20automations/AI-COMMAND-CENTER-SOP.md) | Covers AI tooling only, not general agency discovery |
| Website templates (9 verticals) | REUSED | [websites/](../../websites/README.md) | Includes a hospitality and cleaning vertical |
| Website launch checklist | REUSED | [websites/docs/DEPLOYMENT.md](../../websites/docs/DEPLOYMENT.md) | Used in delivery checklist |
| App and web starters | REUSED | [app-starter/](../../app-starter/README.md), [app-design/](../../app-design/README.md) | Do not create a second design system |
| Design and release templates | REUSED | [DESIGN_QA.md](../../app-design/templates/DESIGN_QA.md), [RELEASE_CHECKLIST.md](../../app-design/templates/RELEASE_CHECKLIST.md) | Evidence for QA step |
| Client handoff and approval steps | REUSED | [Social DM SOP §6–7](../SOPs/workflow%20automations/SOCIAL-DM-TO-ORDER-AUTOMATION-SOP.md), [AI Command Center SOP Steps 9–11](../SOPs/workflow%20automations/AI-COMMAND-CENTER-SOP.md) (ownership, keys, cost controls) | Referenced by the delivery checklist |
| Payment configuration | REUSED (unchanged) | [pay.html](../../pay.html), [js/payment-config.js](../../js/payment-config.js) | Stripe disabled; no Square reference; out of scope |
| Approved logo and icons | REUSED | `assets/gray-matter-media-package/brand/approved-reference/` | Required for content assets |
| Approved asset manifest | REUSED | [assets/gray-matter/ASSET-MANIFEST.md](../../assets/gray-matter/ASSET-MANIFEST.md) | Source for queue asset links |
| TikTok content approval gates | REUSED (separate system) | [approval-gates.md](../../haiku-character-content-system/approval-gates.md) | Not the Muse queue; referenced, not merged |
| Workflow Automation SOP | REUSED | [Social DM SOP](../SOPs/workflow%20automations/SOCIAL-DM-TO-ORDER-AUTOMATION-SOP.md) | Covers one workflow; generic starter deferred |
| Operating rules | REUSED | [.github/copilot-instructions.md](../../.github/copilot-instructions.md) | Payments, claims, and vocabulary rules apply to new docs |

## Created in this foundation

| Asset | Status | Handoff item |
|---|---|---|
| [CLIENT_INTAKE_TEMPLATE.md](CLIENT_INTAKE_TEMPLATE.md) | CREATED | 1 |
| [QUOTE_AND_INVOICE_PLAYBOOK.md](QUOTE_AND_INVOICE_PLAYBOOK.md) | CREATED (Square steps BLOCKED) | 2 |
| [DELIVERY_AND_HANDOFF_CHECKLIST.md](DELIVERY_AND_HANDOFF_CHECKLIST.md) | CREATED | 3 |
| [TOOLBAG_INDEX.md](TOOLBAG_INDEX.md) | CREATED | 4 |
| [CONTENT_AND_OUTREACH_QUEUE_SPEC.md](CONTENT_AND_OUTREACH_QUEUE_SPEC.md) | CREATED (Muse contract BLOCKED) | 5 |
| [FOUNDATION_STATUS.md](FOUNDATION_STATUS.md) | CREATED | 6 |
| [DRIVE_REPLICATION_MANIFEST.md](DRIVE_REPLICATION_MANIFEST.md) | CREATED (template only) | Step 4 |
| [FICTIONAL_DRY_RUN_LAUNDRY_DELIVERY.md](FICTIONAL_DRY_RUN_LAUNDRY_DELIVERY.md) | CREATED | Step 3 |
| [FOUNDATION_GAPS.md](FOUNDATION_GAPS.md) | CREATED | Step 1 |
| [FABLE_HANDOFF_REPORT.md](FABLE_HANDOFF_REPORT.md) | CREATED | Step 5 |

## Not created (deliberately)

- A separate service menu file. The engagement-type table in the quote playbook and the service links in the intake template cover the same need without a duplicate.
- Generic automation and technology-assessment starters. Deferred until a second paid engagement needs them (see [TOOLBAG_INDEX.md §4](TOOLBAG_INDEX.md)).
