# Foundation Gaps

Gaps that remain after this foundation, with the owner or Fable decision each one needs. Nothing here is decided by Haiku.

| # | Gap | Why it matters | Decision owner | Blocks | Smallest next step |
|---|---|---|---|---|---|
| G1 | Payment method: Square is proposed, but the live site and [agreement.html](../../agreement.html) do not name it | Invoicing cannot be finalized | Owner | Square procedure, invoice step | Choose Square or the existing methods; update the agreement only if the owner approves |
| G2 | Gray Matter's own Square account | Invoices must never run through a client's account | Owner | Square setup | Confirm the account exists and who administers it |
| G3 | Approved prices and timelines for the 10 fit-check services ([ARCHITECTURE.md §8](../ARCHITECTURE.md)) | Quotes need approved numbers | Owner | Fees on quotes for those services | Approve a price or keep the fit-check wording |
| G4 | Internal price bands and hourly rate | Estimates need a private basis | Owner | Internal pricing worksheet | Provide rate and margin rules; keep them out of the repo |
| G5 | Agreement scope is written for website design | Quick Fix and Monthly Partner work may need different terms | Owner, with legal review | Use of the agreement for non-website work | Decide whether a separate short agreement is needed |
| G6 | Deposit wording: the agreement calls the 50% deposit non-refundable | May not suit a Quick Fix | Owner | Quick Fix payment terms | Confirm whether the same terms apply to every engagement type |
| G7 | Muse publisher input format is not in the repo | The content queue cannot be connected | Owner, then Fable | Live content queue | Owner supplies the field list; the draft format in the spec is then confirmed |
| G8 | Outreach send tool, sender account, daily cap, cooldown, legal review | Unattended outreach is not allowed; sends need controls | Owner | Any outreach sending | Decide the tool and caps; keep sends manual until then |
| G9 | Drive destination folder and file IDs | Replication needs a confirmed target | Owner, with Fable for any integration | Any Drive copy | Owner confirms the folder; a permitted check records existing files |
| G10 | Client-owned accounts policy for each engagement | Affects handoff and access | Owner | Access step | Adopt the default in [DELIVERY_AND_HANDOFF_CHECKLIST.md §7](DELIVERY_AND_HANDOFF_CHECKLIST.md) or change it |
| G11 | Generic automation starter | Only one automation SOP exists | Fable | Second automation engagement | Build after a real second engagement |
| G12 | Generic technology assessment starter | Only the checkup page and AI SOP discovery exist | Fable | Second checkup engagement | Build after a real second engagement |
| G13 | Fictional dry run has no built site | The booking page and QA are planned, not tested | Fable or Haiku in a later PR | Proof that the delivery steps work end to end | Build a sample from `websites/templates/hospitality-and-cleaning-services/` in a separate PR |

## Not gaps (already covered)

- Client intake for websites: [websites/docs/INTAKE.md](../../websites/docs/INTAKE.md)
- Service catalog and public pricing: [services.html](../../services.html), [pricing.html](../../pricing.html)
- Design and release evidence: [app-design/templates/](../../app-design/templates/)
