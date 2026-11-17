---
id: tech-checkup
name: Technology Checkup Starter Kit
service: business-technology-checkup
---

## Who it is for

"I don’t know what I actually need."

Typical client: the business runs on devices, accounts, subscriptions, a website, and email that were added over years by different people. The owner cannot say what is risky, what is wasted, or what to fix first.

## Fit check

1. How many computers, phones, and tablets does the business use, roughly? (Sets the inventory time within the 60 to 90 minute window.)
2. Which accounts and tools does the owner use every day: email, banking, accounting, booking, shared drive? (Sets the inventory list.)
3. Does the business have a website and its own domain name? (Sets the website and domain checks.)
4. Is there a list of subscriptions, or does the owner have to find them in bank and card statements? (Sets how much time goes to the cost review.)
5. Who makes technology purchases today, and will the owner be in the room for the review? (Required: the owner decides the plan.)
6. Does the owner want a written report, or a verbal review only? (Written report is the standard deliverable.)
7. Is the owner ready to act on at least the "Fix first" items within a few weeks? (Sets whether a follow-up service is needed.)

**Disqualifier:** the owner will not give access to, or describe, the accounts and devices in scope, so the review would be guesswork. We do not write a report card from guesses.

Tier: the Business Technology Checkup is quoted after this fit check. Confirm scope and fee in writing before the session.

## Scope included

- A 60 to 90 minute review with the owner, covering devices, accounts, subscriptions, website, domain, email, backups, and security basics.
- An inventory table of devices, accounts, and subscriptions, written on the report card template.
- A plain-language report card (format: the "Report Card, Not a Sales Pitch" section of `services/business-technology-checkup.html`), with each area marked Working, At risk, or Fix first, and one line of reason per mark.
- A first-things-first plan: each finding listed in priority order, with the Gray Matter service slug that addresses it.
- A 30-minute read-out with the owner to agree which items are in the plan.
- The finished report card and plan delivered to the owner in writing.

## Scope excluded

- Doing any of the fixes. Each fix is quoted through the service it maps to.
- Deep security testing, penetration testing, or a vulnerability scan.
- A full network or wiring survey.
- Cancelling subscriptions or changing accounts during the checkup. Cost changes go through the Technology Cost Cleanup kit.
- Forensic work on any suspected incident.

## Client inputs

- The owner present for 60 to 90 minutes, with a list of the devices they use.
- A list of every subscription the owner knows about, and the bank or card statement access the owner is willing to share for the cost review.
- Domain registrar and website host names, and their owner contact.
- Email provider and backup location, if known.
- A decision on who will approve the plan.

## Default stack

- Inventory and report card: a report card document the client keeps, in the format the service page describes.
- Checks: the built-in settings of the devices and accounts being reviewed (Windows, macOS, iOS, Android, Google, Microsoft, and the registrar’s and host’s own admin pages). No cost.
- Domain and email record lookups: free public DNS lookup tools. No cost.
- Report delivery: a PDF or document the client owns. No paid tool needed.

## Build steps

1. Send the owner a one-page list of what to have ready: devices, account names, subscriptions, and the domain and host names.
2. Start the report card document with the client name, date, and the owner’s name.
3. List each device in the inventory table: owner, operating system, and whether it is updated and encrypted.
4. List each account and subscription in the inventory table, with the owner and the monthly amount from the owner’s own records.
5. Check the website and domain: registrar expiry date, who the registrar account belongs to, and whether the site uses HTTPS.
6. Look up the domain’s SPF, DKIM, and DMARC records and write the result in the email row.
7. Check the backup row: is there any backup, where it goes, and when it last ran, as shown by the owner or the device settings.
8. Check the security row: multi-factor sign-in on email and banking, and whether any login is shared.
9. Mark each area Working, At risk, or Fix first, with one line of reason per mark.
10. Build the first-things-first plan. For each At risk or Fix first item, write the action and the matching service slug: `business-security`, `backup-recovery`, `work-from-anywhere`, `technology-cost-cleanup`, `business-websites`, or `technology-partner`.
11. Read the report card and plan with the owner, and mark which items the owner agrees to.
12. Send the finished report card and plan to the owner in writing. Keep no copy of any password or login.

## QA checklist

- [ ] The report card has one mark (Working, At risk, or Fix first) for every area: devices, accounts, subscriptions, website, domain, email, backups, and security.
- [ ] Every At risk or Fix first item has a one-line reason written beside it.
- [ ] Every item in the first-things-first plan names one service slug from the list in Build step 10.
- [ ] Every figure in the report card comes from the owner’s records or a device or account screen, with the source written beside it.
- [ ] Any example figure in the report is marked "illustrative" in the same line.
- [ ] The checkup session length was recorded, and it falls between 60 and 90 minutes.
- [ ] The owner confirmed in writing which plan items they agree to.
- [ ] No password, recovery code, or card number appears anywhere in the report card or plan.

## Handoff

- The client receives the finished report card, the first-things-first plan, and the inventory table, delivered as a document the client owns.
- The client owns every account and device listed. Gray Matter keeps no passwords after handoff, and nothing is stored from the review session, as set out in `agreement.html`.
- Walk the owner through the Fix first items, and say which service each one points to. The owner decides what to act on, with no obligation to act on all of them.

## Maintenance option

Ongoing care is not part of this kit. Quote it after the fit check. The checkup can be repeated later on request, priced per engagement. For ongoing support that acts on the plan, offer `technology-partner`, priced per engagement.
