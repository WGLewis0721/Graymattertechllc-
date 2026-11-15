# Fictional Dry Run — Breezy Bundle Laundry

**Status:** CREATED · **Fictional:** "Breezy Bundle Laundry", its owner, and every detail below are invented for this walkthrough. No real business, person, price, or sale is represented.

Purpose: show one client moving through intake → quote → authorization → delivery → invoice → handoff, using only the foundation files.

---

## 1. Intake

Discovery answers (fictional), recorded using [CLIENT_INTAKE_TEMPLATE.md](CLIENT_INTAKE_TEMPLATE.md):

- **Business:** a laundry pickup-and-delivery service for apartments and small offices.
- **Problem:** pickup and delivery windows are arranged by text message. Missed messages mean missed pickups and about an hour of rescheduling a day.
- **Desired outcome:** customers choose a pickup window on a simple page and get a confirmation message.
- **Timeframe:** live within 3 weeks.
- **Current tools:** a shared phone, a spreadsheet, and text messages. No booking tool yet.
- **Must stay the same:** the existing phone number and the current price list.
- **Access:** the owner provides the domain login and a photo set. The owner's accounts stay in the owner's name.
- **Out of scope:** route optimization and driver payroll.

**Concise problem statement:** Pickup scheduling by text message causes missed windows and daily rework.
**Desired outcome:** A customer books a pickup window online and receives an automatic confirmation.

**Engagement type:** Project Package (a defined build with milestones). **Service fit:** Business Websites ([services/business-websites.html](../../services/business-websites.html)) with the online-booking option. A fit check confirms the scope before any price.

---

## 2. Quote

Estimate, following [QUOTE_AND_INVOICE_PLAYBOOK.md](QUOTE_AND_INVOICE_PLAYBOOK.md):

> **Estimate for:** Breezy Bundle Laundry (fictional) · **Date:** `[date]` · **Valid until:** `[date]`
>
> **Your goal.** Let customers pick a pickup window online and get a confirmation.
>
> **What we will do.** Build a short site with a pickup-window booking page, a confirmation message, and a contact page. Connect the booking to the owner's chosen tool `[owner decision]`.
>
> **Included.** Up to `[approved page count]` pages; booking page; confirmation message; mobile layout; one revision round.
>
> **Not included.** Route planning, driver pay, payment processing, and any service not listed above.
>
> **Fee.** `[Approved price]` one-time.
>
> **Payment schedule.** Per our agreement: `[Approved deposit amount]` to start, `[Approved balance amount]` at completion.
>
> **Assumptions.** The owner supplies photos, copy, and domain access by `[date]`. Decisions are made within 3 business days.
>
> **How to accept.** Reply in writing to approve. The [client agreement](../../agreement.html) applies.

**Open for owner:** the approved fee, the booking tool, the deposit amount, and whether a booking tool is a separate cost.

---

## 3. Authorization

- The owner replies in writing: "Approved." Record the reply and date in the restricted system.
- Stage tracker moves from *Quoted* to *Approved*.
- Deposit invoice is issued only for `[Approved deposit amount]`, per the agreement.

If the owner asks to change the scope or price, a new estimate is sent. Nothing is added to the approved estimate by message alone.

---

## 4. Delivery

Using [DELIVERY_AND_HANDOFF_CHECKLIST.md](DELIVERY_AND_HANDOFF_CHECKLIST.md):

- **Kickoff:** scope restated in writing; access list agreed.
- **Implement:** start from a website template. The closest existing vertical is `websites/templates/hospitality-and-cleaning-services/` ([websites/README.md](../../websites/README.md)). Fill content only from the owner's supplied copy. No invented reviews or statistics.
- **Verify:** sample QA checklist below.
- **Client review:** gated preview; one revision round; written sign-off.

**Sample QA checklist (fictional run):**
- [ ] Booking page works on a phone-width screen with no horizontal scroll
- [ ] Every internal link resolves
- [ ] Confirmation message is sent only after a successful booking
- [ ] Reduced-motion preference respected
- [ ] No placeholder text remains; `TODO: client to supply` items resolved or listed
- [ ] Phone number and hours come from the owner, not from the template

No item is checked: this dry run plans the QA, it does not test a built page.

---

## 5. Invoice

Using the estimate → invoice table in [QUOTE_AND_INVOICE_PLAYBOOK.md](QUOTE_AND_INVOICE_PLAYBOOK.md):

1. Deposit invoice for `[Approved deposit amount]` after written acceptance.
2. Balance invoice for `[Approved balance amount]` after the client signs off on the gated preview.
3. Payment method: **BLOCKED.** Square is proposed but not approved. Until the owner decides, use the payment methods already listed in [agreement.html](../../agreement.html).

Estimate and invoice are different documents. The estimate is never relabelled as an invoice.

---

## 6. Handoff

Client handoff summary (sample):

> **Your site is live.** Here is what you have:
> - Pages: `[list]`
> - Booking page: customers pick a pickup window; you get a confirmation copy `[how]`.
> - Accounts: the domain, hosting, and booking account are in your name. We keep the access we need to maintain the site.
> - How to change hours or the phone number: `[steps]`.
> - Support: `[contact process]`. An optional care plan is listed on [pricing.html](../../pricing.html).

---

## Unanswered questions for the owner

1. Approved fee for this project, and the deposit and balance amounts.
2. Which booking tool to use, and whether that tool's cost is the client's.
3. Square or the existing payment methods in [agreement.html](../../agreement.html).
4. Whether the agreement's web-design scope covers this booking feature as written.
5. Whether a support plan is offered at handoff.
