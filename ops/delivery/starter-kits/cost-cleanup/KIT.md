---
id: cost-cleanup
name: Technology Cost Cleanup Starter Kit
service: technology-cost-cleanup
---

## Who it is for

"I’m paying for things nobody uses."

Typical client: software, hosting, and seat licenses renew automatically. Some belong to people who left, some duplicate each other, and nobody has listed them since they were added.

## Fit check

1. Can the owner, or the person who pays the bills, give us three months of card and bank statements? (Required. No statements, no job.)
2. Roughly how many software and service charges appear on those statements? (Sets the review time.)
3. Does the owner know the admin login for the main software tools, or can they get it? (Needed to see seat counts. We do not need the passwords.)
4. Are there seat-based tools (per user licenses) where staff have come and gone? (Sets the unused-seat check.)
5. Who has the final say on cancelling anything? (Required: the owner confirms every cancel.)
6. Will the owner cancel or authorize changes in writing, or will they want us to act for them? (We only act on written authorization, and the client still signs in to cancel.)
7. Is there a known renewal date coming in the next 60 days? (Sets urgency.)

**Disqualifier:** the owner wants us to hold their card or bank login, or to cancel without confirming each item. We do not take the job on those terms.

Tier: the Technology Cost Cleanup service is quoted per engagement after this fit check.

## Scope included

- Three months of card and bank statements reviewed, with every recurring software or service charge listed on `SUBSCRIPTION_LEDGER.md`.
- Duplicate tools found and listed side by side with the job each one does.
- Unused and extra seats found by checking each tool’s user list against current staff.
- A keep, cancel, or consolidate recommendation for each line, with the reason in one sentence.
- A written confirmation from the owner for each line before any cancellation.
- Savings recorded as actual monthly amounts from the statements, not estimates.
- A short summary for the owner: the monthly total before, the monthly total after cancellations the owner approved, and the renewal dates still to watch.

## Scope excluded

- Cancelling anything without the owner’s written confirmation for that line.
- Negotiating new contracts or vendor discounts.
- Moving data between tools, or migrating a system to a cheaper one. That is quoted separately.
- Buying replacement tools.
- Tax or accounting advice on how charges are booked.

## Client inputs

- Three months of card and bank statements (PDF or CSV download, or read on screen with the owner present). Statements may be redacted to hide account numbers.
- A list of the software tools the owner knows about, with the person who signed up for each.
- Admin access to the main tools, or the owner present to show the user list.
- A current staff list, so unused seats can be matched to people who still work there.
- A named person who gives the owner’s written go-ahead for each cancellation.

## Default stack

- Ledger: `SUBSCRIPTION_LEDGER.md` in this kit, kept in a spreadsheet or document the client owns.
- Statements: the client’s own bank and card download. No new tool needed.
- Seat checks: each vendor’s own admin user list. No cost.
- Cancellation: done by the client in the vendor’s own account, or by written authorization that the client’s admin carries out. **Client pays** for any tool they keep.
- No third-party subscription-tracking app is needed for this kit.

## Build steps

1. Get three months of statements from the owner. Confirm the date range covers three full months.
2. Copy `SUBSCRIPTION_LEDGER.md` into a client-owned file and list the statement months across the top of the monthly amount column.
3. Scan each statement and add one row per recurring software or service charge, with the vendor, the card or account, and the monthly amount as it appears.
4. Sort the rows by vendor name. Mark any vendor that appears twice, or two vendors that do the same job, in the Duplicate column.
5. For each tool with seats, open the admin user list and count active users. Compare with the current staff list and record the unused count.
6. Write a keep, cancel, or consolidate recommendation for each row, with one sentence of reason.
7. Send the owner the list. Ask for a yes, a no, or a question for each row, and record the answer and the date in the decision column.
8. For each approved cancellation, record the owner’s written confirmation in the ledger, then have the client cancel in the vendor’s account or give written authorization to the client’s admin.
9. After the next full statement cycle, check the statements again and confirm each cancelled charge has stopped. Record the confirmed monthly amount removed.
10. Calculate the monthly total before and after, using only amounts seen on the statements. Write the savings as actual monthly amounts, and note any renewal dates still to watch.
11. Deliver the finished ledger and summary to the owner.

## QA checklist

- [ ] Every recurring charge on the three months of statements appears as one row in `SUBSCRIPTION_LEDGER.md`.
- [ ] Each row’s monthly amount matches a charge on a statement, with the statement month written beside it.
- [ ] Each duplicate pair or overlapping tool is marked, with the job each one does written beside it.
- [ ] Each seat-based tool shows its active user count next to the current staff count.
- [ ] Every cancellation has the owner’s written confirmation recorded with a date before the cancel is done.
- [ ] No cancellation was made without a matching written confirmation in the ledger.
- [ ] The savings figure equals the sum of confirmed monthly amounts removed, taken from statements, with no estimated lines.
- [ ] After the next statement cycle, each cancelled charge is absent from the statement, or the ledger notes why it is still present.
- [ ] No card number, bank login, or vendor password appears anywhere in the ledger or summary.

## Handoff

- The client receives the finished `SUBSCRIPTION_LEDGER.md`, the summary of before and after monthly totals, and the list of renewal dates to watch.
- The client owns every vendor account and every card. Gray Matter keeps no passwords or statement copies after handoff, and any temporary access is removed before the handoff call ends, as set out in `agreement.html`.
- Show the owner which cancellations are still open and where each one is done in the vendor’s account.

## Maintenance option

Ongoing care is not part of this kit. Quote it after the fit check. For an ongoing review of renewals and seats, offer `technology-partner` as the ongoing option, priced per engagement.
