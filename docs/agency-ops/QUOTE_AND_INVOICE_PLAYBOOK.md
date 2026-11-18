# Quote, Approval, and Invoice Playbook

**Status:** CREATED (Square steps BLOCKED pending owner decision) · **Audience:** Gray Matter staff, internal

Use this to send one friendly estimate, get written approval, and invoice correctly. Sent estimates, invoices, and payment records live in the invoicing system, **not** in this repo.

## Ground rules

1. **Never invent a price.** Every fee is `[Approved price]` until the owner approves it. Published prices come only from [pricing.html](../../pricing.html) and must match it exactly.
2. **Estimate ≠ invoice.** An estimate is a proposal, not yet agreed. An invoice is a request for payment for approved work or a due milestone.
3. **A sent estimate is a request, not a signature.** Link to [agreement.html](../../agreement.html) for the full terms. Do not present a checkbox as an electronic signature.
4. **Payment terms come from the agreement.** Do not change them in a quote. Current terms in [agreement.html](../../agreement.html): a 50% non-refundable deposit before work starts and a 50% balance due at completion, before final files or launch. Premium or Full Platform builds valued at $800 or more may use a written 40/30/30 three-payment structure.
5. **No payment links on the live site from this work.** [pay.html](../../pay.html) and [js/payment-config.js](../../js/payment-config.js) are out of scope.

## Engagement types

| Type | Use when | Typical structure | Existing starting points |
|---|---|---|---|
| **Quick Fix** | One defined problem, small fixed scope, short timeline | One fee, one deliverable, one revision round if approved | Often a single service page, e.g. [Technology Cost Cleanup](../../services/technology-cost-cleanup.html) or [Business Technology Checkup](../../services/business-technology-checkup.html) |
| **Project Package** | A defined build or setup with a clear end | Fee plus milestones (deposit, approval, completion) | Website packages on [pricing.html](../../pricing.html); other services after a fit check |
| **Monthly Partner** | Ongoing support or care after delivery | Setup fee (if any) plus a recurring care fee | Care plans on [pricing.html](../../pricing.html); [Technology Partner](../../services/technology-partner.html) after a fit check |

Fit-check services (no public price yet) use `[Approved price]` and `[Approved timeline]` only. Open items are listed in [ARCHITECTURE.md §8](../ARCHITECTURE.md).

## Estimate template (one page, plain language)

> **Estimate for:** `[Client label]` · **Date:** `[date]` · **Valid until:** `[date]`
>
> **Your goal.** `[One or two sentences from the discovery brief.]`
>
> **What we will do.**
> - `[Deliverable 1]`
> - `[Deliverable 2]`
>
> **Included.** `[Plain list]`
>
> **Not included.** `[Plain list, including anything the client asked about that is out of scope.]`
>
> **Fee.** `[Approved price]` (one-time) · `[Approved monthly amount, if any]` (recurring)
>
> **Payment schedule.** Per our agreement: `[Approved deposit amount]` to start, `[Approved balance amount]` at completion. `[Milestones, if a Project Package.]`
>
> **Assumptions.** `[Access you provide, materials you supply, decisions you make by a date.]`
>
> **Revisions.** `[Approved revision allowance]`
>
> **How to accept.** Reply in writing to approve this estimate. Our [client agreement](../../agreement.html) applies. Work starts after the deposit is received.

## Internal pricing worksheet (private, never in this repo)

- Estimated hours by task, with owner's rate `[owner decision]`
- Third-party fees (domains, licenses, hosting, tools) `[actual amounts]`
- Contingency `[owner decision]`
- Margin `[owner decision]`
- Approved total `[owner approval required]`
- Reviewer and date

Assumptions must never become public prices silently.

## Approval and acceptance

- Approved means the client replies in writing (email or message) that they accept the estimate, and the reply is saved in the restricted record.
- Record the approval date and link it to the stage tracker (*Approved*) in [CLIENT_INTAKE_TEMPLATE.md](CLIENT_INTAKE_TEMPLATE.md).
- Work starts after the deposit is received when the agreement requires one.

## Estimate → invoice → payment

| Step | Action | Evidence to keep (restricted system) |
|---|---|---|
| 1 | Send estimate with approved numbers only | Sent date, version |
| 2 | Client accepts in writing | Saved reply, date |
| 3 | Issue deposit invoice (per agreement) | Invoice number, amount, due date |
| 4 | Deliver milestones or completion | Delivery record (see [DELIVERY_AND_HANDOFF_CHECKLIST.md](DELIVERY_AND_HANDOFF_CHECKLIST.md)) |
| 5 | Issue balance invoice | Invoice number, amount, due date |
| 6 | Confirm payment and send receipt | Payment date, receipt |

Invoices not paid within 7 days of the due date may pause work, and a late fee may apply, as stated in [agreement.html](../../agreement.html). Do not add other late-fee terms in a quote.

## Square workflow (written procedure only, BLOCKED)

**Status: BLOCKED.** Square is the proposed initial workflow in the [starter kit](ESSENTIAL_AGENCY_STARTER_KIT.md). It is not referenced on the live site, and [agreement.html](../../agreement.html) lists bank transfer, PayPal, Venmo, and Cash App as payment methods. The owner must decide:

1. Whether Gray Matter will use Square, and confirm that **Gray Matter's own** Square account exists (never a client's account).
2. Whether [agreement.html](../../agreement.html) should name Square as a payment method.

Once both are approved, the procedure is:

1. Create an **estimate** in Gray Matter's Square account, with approved line items only.
2. Send it. Record the client's written acceptance outside Square if Square does not capture it.
3. After acceptance, convert the estimate to an **invoice** for the deposit only.
4. Send the invoice. Check payment status in the Square dashboard.
5. Send the receipt and record the invoice number in the restricted system.

Verify Square's current feature names and fees in Square's own documentation before use. Fees are not verified in this repo.

## Done when

A small job can be scoped, priced, approved, invoiced, and documented without building a payment application, and each step has a record outside GitHub.
