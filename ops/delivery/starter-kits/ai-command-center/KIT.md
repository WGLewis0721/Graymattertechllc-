---
id: ai-command-center
name: AI Command Center Starter Kit
service: technology-partner
---

# AI Command Center Starter Kit

## Who it is for

"I need a technology person, not a technology department."

A solo professional or small team that uses several AI tools for different jobs,
pays for more subscriptions than it needs, and cannot say which tool to use for
what. They want one organized place to work with AI, and one person to call when
it breaks.

## Fit check

1. How many people will use it, and does each person need a separate login?
2. Which AI tools are used now, what each is used for, and what it costs per month?
3. Name 10 or more real recurring tasks (emails, research, coding, proposals, copy). Vague answers such as "everything" are not enough.
4. Does any task depend on a feature that only exists inside one app (image generation, voice, a native connector)? Those stay in that app. Record them as exceptions.
5. Will the client create and pay for their own AI provider accounts?
6. Who will be the system owner and admin after handoff?

**Disqualifier:** the client wants Gray Matter's own API keys or accounts to power their production system, or wants a custom AI portal built from scratch. Decline both. Use established software instead, per the SOP.

## Scope included

- A written discovery record: users, current tools, real tasks, must-keep features.
- One primary AI workspace with the approved models only, and a short labeled model list.
- A model-purpose guide: which model for which task, with a backup for each.
- Budget and usage limits set at the gateway or provider level.
- Separate user accounts and roles, if the client has more than one user.
- Shared prompt templates for the tasks the client repeats.
- A test set of the client's own tasks, with pass results recorded.
- A one-page "what to use for what" guide and a handoff packet.

## Scope excluded

- A custom chat application or portal.
- Provider subscriptions and API usage. These are client costs.
- Shared company knowledge base or document ingestion, unless the fit check shows a real need. Quote it separately.
- Business system integrations beyond the workspace. Quote per engagement.
- Ongoing support, quoted under the Technology Partner service.

## Client inputs

- The list of current AI tools with account type and monthly cost.
- The 10 to 30 real tasks, written in the client's words.
- Admin invitations to the workspace and the gateway, or a delegated setup login. No shared passwords.
- Decision on the approved model list and the monthly budget.
- The names and emails of each user, if more than one.

## Default stack

Choose by client size, and keep the list short.

- Workspace (one of): Open WebUI or LibreChat. Open source; the client pays for the host where it runs.
- Gateway (one of): OpenRouter for solo use (paid by the client through usage); LiteLLM (open source, self-hosted) or Portkey for team use with budgets and logs.
- Provider accounts: OpenAI, Anthropic, Google, or others, each owned by the client and paid by the client.
- Hosting: the client's own cloud or host account. Gray Matter configures; the client pays and owns it.
- Secrets: stored in the gateway or the host's secret store. Never in the browser, a repo, or a document.

## Build steps

1. Run discovery. Record the user count, roles, admin owner, and whether each user needs a separate login.
2. List every current AI tool in a table: tool, purpose, keep or replace, API needed, replacement model.
3. Collect 10 to 30 real recurring tasks from the client. Note the must-keep features that only exist in one app.
4. Reduce the model list to one entry per purpose (general, coding, research, fast, creative). Remove duplicates.
5. Assign a primary and backup model to each purpose. Write the routing matrix.
6. Choose the routing style: manual (user picks), guided (labels by purpose), or automatic. Pick the simplest one that fits.
7. Set up the client's provider accounts and gateway account under the client's email and billing.
8. Store every API key in the gateway or host secret store. Confirm no key appears in a document, screenshot, or browser code.
9. Set a monthly budget and a per-user limit where users are more than one. Restrict the most expensive models to manual selection.
10. Deploy the workspace on the client's host. Turn off or hide every model not on the approved list.
11. Create user accounts and roles. Give each user only the models their role needs.
12. Write 5 to 10 shared prompt templates for the repeated tasks. Store them in the workspace.
13. Run the test set: each real task on its assigned model, plus one access-control test per role, plus one failure test (a provider outage or a budget limit).
14. Fix each failed test and re-run it. Record the final results.
15. Train the client: demonstrate the workspace, then teach the one rule: use the listed model for that purpose.
16. Hand off the workspace, the owner login, the usage guide, and the support instructions.
17. Remove Gray Matter's access that the client does not need for ongoing support. Keep only the documentation Gray Matter is allowed to keep.

## QA checklist

- [ ] The discovery record lists every user, every current tool, and at least 10 real tasks.
- [ ] Only the approved models appear in the model list; no unapproved model is selectable by a standard user.
- [ ] Each approved model has a written purpose and a backup.
- [ ] A test task for each purpose returns a usable answer on its assigned model.
- [ ] Each provider account and the gateway account are under the client's email and billing.
- [ ] No API key appears in the browser source, any repo, or any handoff document.
- [ ] A standard user cannot change the budget or see another user's chat history.
- [ ] The monthly budget or alert is set and a test alert reaches the client.
- [ ] A forced provider failure is tested, and the observed behavior (error text or backup model used) is written in the usage guide.
- [ ] The client logs in to the workspace and sends one chat using their own account.
- [ ] Gray Matter's access is removed or listed in the handoff note with a date.

## Handoff

- The client receives: workspace URL, owner or admin login, the model-purpose guide, the shared prompt list, the budget and usage policy, and the support instructions.
- The client owns the provider accounts, the gateway account, the hosting account, and the billing method.
- Gray Matter keeps no passwords after handoff. Confirm in writing that all access is client-held.
- Record in the handoff note which tools were kept in their original app and why.

## Maintenance option

Ongoing support is the Technology Partner service. It is quoted after a fit check, based on user count, how often models change, and how much of the workspace the client wants Gray Matter to manage. No monthly price is published here.
