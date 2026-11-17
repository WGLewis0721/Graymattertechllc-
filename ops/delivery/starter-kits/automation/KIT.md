---
id: automation
name: Workflow Automation Starter Kit
service: workflow-automation
---

# Workflow Automation Starter Kit

## Who it is for

"I keep doing the same tasks over and over."

A small business where the same information is typed into two or three places,
follow-ups depend on someone remembering, and orders or bookings arrive through
email, forms, or social messages and get copied by hand.

## Fit check

1. Name the task that repeats most often. How many times a week does it happen, and who does it?
2. Is the task the same every time, or does it change in ways that need a person's judgment? Routine parts get automated; judgment stays with a person.
3. Which tools do they already pay for and use daily: Google Workspace or Microsoft 365, a booking tool, a payment tool, a spreadsheet, a CRM?
4. Does the booking or scheduling tool already send reminders? If yes, use it before building anything.
5. Who must be told when the automation fails or hits an exception?
6. Will they approve each customer-facing message type in writing before it goes live?

**Disqualifier:** the client wants the automation to send customer messages nobody has approved, or to act on money (refunds, charges, payouts) with no human approval step. Decline the build and refer it for a quote on a narrower scope.

## Scope included

- One mapped workflow, written as the map in Build step 1 and signed off by the client.
- One build of that workflow on the tools the client already owns, where possible.
- Each approved trigger, step, and notification working end to end on test data.
- Exception handling: a notice to a named person when a step fails or a record is incomplete.
- A one-page run guide for the client, and a list of every account the workflow touches.
- Change requests during the build, limited to the steps on the signed map.

## Scope excluded

- Custom software, a custom app, or a new portal.
- Any workflow added after sign-off. Quoted as a new map.
- Paid automation tool subscriptions the client chooses to add.
- Social-message order workflows beyond the reference SOP. Quote those per engagement.
- Ongoing monitoring, unless quoted under the Technology Partner service (`technology-partner`).

## Client inputs

- A plain-language description of the current process and where it breaks.
- Admin or delegated access to the tools the workflow touches. Use invitations, not shared passwords.
- Sample records: 5 to 10 real examples, with names removed, for testing.
- The exact message text they approve for each notification.
- The name of the person who receives failure notices.

## Default stack

Prefer what the client already owns, in this order:

1. Their own tools with built-in automation: Google Workspace or Microsoft 365 rules and forms, and their booking tool's built-in reminders. Paid by the client as part of what they already pay.
2. Zapier or Make on the free tier, if it covers the task volume. Free tier; upgrade only with the client's written approval.
3. n8n for multi-step logic the free tiers cannot run. Free to self-host; if they use n8n's hosted plan, the client pays for it.
4. Reference build: ManyChat, n8n, and Airtable for social-message orders, from `docs/SOPs/workflow automations/SOCIAL-DM-TO-ORDER-AUTOMATION-SOP.md`. Any paid plan is paid by the client.

Do not add a new paid tool when a built-in or free-tier option covers the step.

## Build steps

1. Map the task before automating it. Write these five things in one table: trigger (what starts it), steps (in order), data (what fields move and where), exceptions (what can go wrong and who handles it), and notifications (who gets told, by which channel). Get the client to sign it.
2. Cut any step the map does not need. Mark which steps are approved for automation.
3. Record each approved step's current manual time, so the before-and-after can be shown at handoff.
4. Choose the cheapest tool from the default stack that covers every step. Write the choice and its plan in the run guide.
5. Create the workflow in a test copy or test folder. Never point it at live customer records first.
6. Run 5 to 10 sample records through every path, including one that fails on purpose. Confirm the failure notice reaches the named person.
7. Fix each failed path. Re-run the full sample set.
8. Switch the workflow to live. Watch the first real records and confirm each one.
9. Write the run guide: what starts the workflow, what it does, how to pause it, and who to call when it fails.
10. Hand off the accounts and the run guide. Remove Gray Matter's access once the client confirms the workflow runs.

## QA checklist

- [ ] The signed task map lists a trigger, ordered steps, data fields, at least one exception, and named notification recipients.
- [ ] Every automated step matches a step marked approved on the map.
- [ ] Every notification text matches the wording the client approved in writing.
- [ ] Each of the 5 to 10 sample records reaches its final expected state with no manual edit.
- [ ] The deliberately failing record triggers a failure notice that arrives in the named person's inbox or channel.
- [ ] A duplicate submission does not create a duplicate record or a second message.
- [ ] No customer message is sent from a test record.
- [ ] The workflow can be paused from one place, and pausing stops new runs.
- [ ] The run guide names every connected account and its owner.
- [ ] The client logs in to each connected account using their own credentials.

## Handoff

- The client receives: the signed task map, the run guide, a list of every connected account with its owner, and a short walkthrough of one real record.
- The client owns every account the workflow uses. Transfer ownership before go-live, or create the accounts under their email.
- Gray Matter keeps no passwords after handoff. Remove any Gray Matter access and confirm in writing.
- The before-and-after manual time from Build step 3 goes in the handoff note.

## Maintenance option

Quoted after a fit check, based on how many workflows run, how often the tools change, and whether the client wants changes handled. No maintenance price is published for this service. Confirm the figure in writing before setting it up.
