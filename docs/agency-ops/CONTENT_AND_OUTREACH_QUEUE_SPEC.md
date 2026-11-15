# Content and Outreach Queue Spec

**Status:** CREATED (queue formats only) · **Audience:** owner and any agent that prepares posts or outreach drafts

This spec defines queue **formats** and approval gates. It does not send anything, publish anything, or store leads. Nothing here turns on an automatic publisher or outreach sender.

## Privacy rules (public repo)

- **Never commit real prospects, contacts, email addresses, phone numbers, or client names in this repo.** Examples below are fictional.
- The **prospect registry** lives in a restricted system (CRM, private spreadsheet, or private Drive file). Only the template below lives here.
- Opt-outs and suppression records are never deleted. They are kept so the same person is not contacted again.
- Do not include credentials or API keys in any queue file.

## Part 1 — Muse-ready content queue (rolling 30 days)

**Status:** INCOMPLETE. The Muse publisher's input format is **not in this repo**. Confirm the field names with the owner before any agent writes to a live queue. Until then, use this format as a draft for review.

Approved asset sources: [assets/gray-matter/ASSET-MANIFEST.md](../../assets/gray-matter/ASSET-MANIFEST.md) and the approved logo files under `assets/gray-matter-media-package/brand/approved-reference/`. Use only assets listed there, or assets the owner approves.

| Field | Rules |
|---|---|
| `id` | `C-YYYYMMDD-NN`, unique |
| `status` | `Draft` → `Needs Approval` → `Approved` → `Scheduled` → `Published` (or `Rejected`) |
| `intended_date` | Date in the rolling 30-day window |
| `subject` | One sentence on the problem or lesson |
| `service_link` | Relative link to one service page, e.g. `services/workflow-automation.html` |
| `caption` | Plain language. No invented statistics, testimonials, results, or prices |
| `approved_asset` | Path from the asset manifest. Blank = not ready |
| `cta` | One call to action from an approved list (for example, "Send us your question") |
| `approved_by` / `approved_on` | Required before `Approved` |

Example (fictional):

| id | status | intended_date | subject | service_link | caption | approved_asset | cta | approved_by | approved_on |
|---|---|---|---|---|---|---|---|---|---|
| C-20261201-01 | Needs Approval | 2026-12-01 | Stop retyping the same order details | services/workflow-automation.html | "Repeat orders shouldn't cost you an hour a day." | `[asset path]` | Send us your question | — | — |

Rules:
- A post reaches `Scheduled` only after `Approved`.
- Content from the TikTok character system follows its own gates in [approval-gates.md](../../haiku-character-content-system/approval-gates.md). This queue does not replace them.

## Part 2 — Private prospect registry (restricted, template only)

Keep the real registry outside this repo.

| Field | Notes |
|---|---|
| `prospect_id` | Internal ID, e.g. `P-0001` |
| `business_type` | Category only |
| `source_evidence` | Public source the lead came from, and the date seen |
| `service_fit` | Service page slug |
| `outreach_status` | `New` · `Queued` · `Sent` · `Replied` · `Closed` · `Opted out` |
| `suppressed` | `yes` for opt-outs, bounces, or do-not-contact requests. Never delete |
| `last_contact` / `next_follow_up` | Dates |
| `approved_by` | Owner or named approver |

## Part 3 — Outreach queue formats

Queues are prepared in the morning and afternoon. Each item is a **draft** until a person approves it.

**Morning queue** (prepared by the morning run; reviewed before 12:00 local time)

| # | prospect_id | template_id | channel | service_fit | source_evidence | approval | status |
|---|---|---|---|---|---|---|---|
| 1 | P-0001 | T-01 | email | services/business-websites.html | (link, date) | pending | Draft |

**Afternoon queue** (follow-ups and new drafts; reviewed before 16:00 local time)

| # | prospect_id | template_id | channel | next_follow_up | suppression check | approval | status |
|---|---|---|---|---|---|---|---|
| 1 | P-0001 | T-02 | email | 2026-12-03 | passed | pending | Draft |

**Daily send cap:** `[owner decision]`. Do not set a number here.

## Part 4 — Tailored email template (T-01, first contact)

- Subject and opening line refer to one observed, public detail about the business (cite the source in the registry, not in the email).
- One sentence on how Gray Matter could help, linked to one service page.
- No invented results, testimonials, prices, timelines, or claims. Use `[Approved price]` only if the owner approved it.
- Sender identity and a physical postal address, as required by applicable anti-spam law.
- Opt-out line: "Reply STOP or unsubscribe and we will not contact you again."
- No attachments, no tracking pixels without owner approval.

## Gates (all required before any send)

| Gate | Check |
|---|---|
| G1 — Human approval | A named person approved this exact message |
| G2 — Dedupe | `prospect_id` not already sent within the cooldown `[owner decision]` |
| G3 — Suppression | `suppressed` is not `yes` |
| G4 — Compliance | Sender identity, postal address, and opt-out are present |
| G5 — Authorized sender | Sent by a tool or person the owner authorized. No unattended sending |

If any gate fails, do not send. Move the item to `Needs Approval` and note the reason.

## Open decisions (owner)

1. Muse publisher input format and who operates it.
2. Who sends outreach, and through which tool and account.
3. Daily cap and cooldown period.
4. Legal review of the email template for each target region.

## Done when

An agent can prepare a correct 30-day content queue and a morning or afternoon outreach queue from this spec, and a person can approve or reject each item without touching a live publisher or sender.
