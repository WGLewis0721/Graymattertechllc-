# Gray Matter SOP — AI Command Center

**Service Category:** Workflow Automation  
**Offering:** AI Command Center  
**Primary Use Case:** A solo professional or small team uses several AI tools for different purposes and wants one organized way to access, route, manage, and govern those tools without Gray Matter building a custom AI portal from scratch.  
**Default Delivery Model:** Existing multi-model chat interface + AI gateway/router + client-owned model/API accounts + optional shared knowledge, logging, budgets, and automations.

---

## 1. Purpose

This SOP defines how Gray Matter fulfills an AI Command Center order from discovery through handoff.

The customer problem usually sounds like:

> “I use ChatGPT, Claude, Gemini, Grok, Perplexity, and other AI tools for different things. It is getting confusing. Can you put this into one organized system?”

Gray Matter should solve that problem primarily through **integration, configuration, routing, governance, and workflow design** rather than by developing a brand-new AI chat application.

The standard outcome is:

**One workspace → approved AI models → clear roles/routing → centralized keys/billing controls → shared prompts/knowledge where needed → documented handoff.**

---

## 2. Service Outcome

At completion, the client should have:

- One primary place to access the AI models they actually use.
- A reduced and clearly labeled model list.
- A documented purpose for each AI/model.
- Optional automatic routing by task type.
- Centralized API/key management appropriate to the client size.
- Spending controls appropriate to the client.
- Shared prompt templates where useful.
- Shared company knowledge where useful.
- Individual user access for teams where required.
- A tested process for common tasks.
- A simple handoff guide.
- Optional ongoing support from Gray Matter.

---

## 3. Standard Architecture

### Default Architecture

User  
→ AI workspace/interface  
→ AI gateway/router  
→ OpenAI / Anthropic / Google / xAI / Perplexity / other approved providers  
→ optional shared knowledge / business systems

### Recommended Tool Patterns

#### Basic / Solo Client

- **Workspace:** Open WebUI or comparable established multi-model interface
- **Gateway:** OpenRouter
- **Purpose:** Fastest setup, least custom engineering, one user or very small usage footprint

Architecture:

Open WebUI  
→ OpenRouter  
→ selected models

#### Professional / Technical Client

- **Workspace:** Open WebUI or LibreChat
- **Gateway:** LiteLLM
- **Provider access:** client-owned API keys/accounts
- **Purpose:** More control over providers, routing, retries, budgets, logs, and future customization

Architecture:

Open WebUI / LibreChat  
→ LiteLLM  
→ client-selected AI providers

#### Small Business / Team

- **Workspace:** Open WebUI or LibreChat with separate user accounts
- **Gateway:** LiteLLM or Portkey
- **Provider access:** business-owned API accounts/keys
- **Controls:** budgets, routing, logging, roles, shared prompts, shared knowledge where needed
- **Purpose:** Team consistency, centralized management, reduced subscription sprawl, better governance

Architecture:

Employees  
→ shared AI workspace  
→ gateway/router  
→ approved models  
→ shared knowledge / business tools

---

## 4. Do Not Overbuild

Gray Matter should NOT build a custom portal unless the client has a requirement that cannot be satisfied by an established interface.

Do not create a custom frontend merely to:

- show several AI models,
- provide chat history,
- switch models,
- upload files,
- create users,
- save prompts,
- compare model responses.

Use existing software first.

Custom development should only be considered when the client requires unique business logic, proprietary UI behavior, deeply embedded line-of-business workflows, or a customer-facing product rather than an internal productivity system.

---

## 5. Phase 1 — Customer Discovery

### Step 1 — Identify Users

Record:

- Number of users
- Job roles
- Who will be system owner/admin
- Whether users need separate accounts
- Whether everyone may access every model
- Whether usage needs to be logged by user

Classify the order as:

- Solo
- Small team
- Department/team

Do not use a team architecture for a solo user unless there is a real need.

### Step 2 — Inventory Current AI Tools

Ask the client to list every AI tool currently used.

For each tool record:

- Tool/provider name
- Current subscription/account type
- What they use it for
- How often they use it
- Features they cannot lose
- Whether an API is available for the needed capability
- Whether the feature is app-only

Create a table:

| Current Tool | Current Purpose | Keep? | API Needed? | Replacement/Model |
|---|---|---|---|---|

### Step 3 — Inventory Real Tasks

Do not ask only “Which model do you like?”

Ask what work they actually perform.

Examples:

- Writing client emails
- Brainstorming design concepts
- Coding
- Web research
- Social-media research
- Proposal writing
- Document analysis
- Product descriptions
- Marketing copy
- Data analysis
- Image prompting
- Internal SOP creation
- Customer-response drafting

Capture 10–30 real recurring tasks.

### Step 4 — Identify Must-Keep Features

Some consumer AI applications contain features that are not equivalent to a plain API call.

Identify whether the client depends on:

- Provider-specific research tools
- Image generation
- Voice mode
- Canvas/artifact features
- Native connectors
- Specialized agents/GPTs/projects
- Provider-specific file handling
- Social-network-native access

If a required feature cannot be reproduced through the chosen API/workspace, document that the client will continue using that original application for that specific use case.

The goal is **less fragmentation**, not pretending every feature is interchangeable.

---

## 6. Phase 2 — Solution Design

### Step 5 — Reduce the Model List

Review the client's current tools and eliminate unnecessary duplication.

Example final list:

- General / reasoning
- Coding
- Research
- Current-events/social research
- Fast / inexpensive
- Creative writing

Do not expose dozens of models unless the client specifically wants them.

The system should make choices easier, not create a larger model menu.

### Step 6 — Define Model Roles

Create a routing matrix.

Example:

| Task Type | Primary Model | Backup Model |
|---|---|---|
| General business work | GPT-class model | Gemini-class model |
| Coding | Claude-class model | GPT-class model |
| Research | Perplexity/search-enabled model | approved fallback |
| Current social/X research | Grok/xAI where appropriate | research model |
| Fast/simple work | lower-cost fast model | second low-cost model |

Model roles should reflect the client's actual tasks and current provider capabilities.

### Step 7 — Choose Routing Style

Select one of three models.

#### Manual Routing

User chooses the model from a short labeled list.

Best for:

- solo clients,
- clients who already know their preferred tools,
- clients who want maximum control.

#### Guided Routing

Workspace labels models by purpose rather than only by technical model name.

Example labels:

- Coding
- Research
- Writing
- Quick Answer
- Deep Reasoning

Best for most small businesses.

#### Automatic Routing

System classifies the task and sends it to an approved model automatically.

Best when:

- task categories are predictable,
- client wants simplicity,
- routing rules can be reliably tested.

Always provide an override when practical.

### Step 8 — Select the Stack

Use the smallest stack that satisfies requirements.

Decision rule:

- Solo + simplicity → Open WebUI + OpenRouter
- Solo/technical + control → Open WebUI + LiteLLM
- Team + centralized controls → Open WebUI/LibreChat + LiteLLM or Portkey
- Significant business automation after AI output → add n8n only where needed

Do not add n8n solely for model switching if the gateway already performs that function.

---

## 7. Phase 3 — Account Ownership and Security

### Step 9 — Establish Client Ownership

Preferred ownership:

**Client owns:**

- AI provider accounts
- Gateway account where practical
- Hosting account where practical
- Domain/subdomain if used
- Business email identities
- Billing method

**Gray Matter receives:**

- admin/integration access required to configure the system
- temporary credentials only when no delegated access method exists

Avoid building the client's production system around Gray Matter's personal API keys.

### Step 10 — Handle API Keys Correctly

Never place provider API keys:

- directly in browser JavaScript,
- in public GitHub repositories,
- inside client documentation,
- in screenshots,
- in plaintext handoff emails.

Store secrets using the gateway, host, environment variables, or secret manager appropriate to the deployment.

### Step 11 — Configure Cost Controls

Define:

- overall monthly budget
- per-user budget if applicable
- expensive models that require manual selection
- default lower-cost model for routine tasks
- alerts when practical

For a team, avoid giving every employee unrestricted access to the most expensive models unless justified.

---

## 8. Phase 4 — Infrastructure Setup

### Step 12 — Create/Configure the AI Gateway

Depending on the selected tier:

#### OpenRouter

- Create or connect client account.
- Add approved billing method.
- Select approved models.
- Generate required API credential.
- Configure usage limits if available/required.

#### LiteLLM

- Deploy/configure LiteLLM proxy.
- Add client-owned provider credentials.
- Configure model aliases.
- Configure fallback models.
- Configure retry behavior.
- Configure budgets/rate limits where needed.
- Enable logging appropriate to client requirements.

#### Portkey

- Connect client provider accounts/keys.
- Create model/provider configurations.
- Configure routing/fallback policies.
- Configure budgets/rate limits.
- Configure observability/logging appropriate to client requirements.

### Step 13 — Deploy the Workspace

Use an established multi-model interface.

Typical process:

1. Create deployment environment.
2. Install/deploy Open WebUI or LibreChat according to official documentation.
3. Configure the workspace endpoint to use the selected gateway.
4. Confirm HTTPS.
5. Configure the client-facing URL if needed.
6. Disable unnecessary public signup.
7. Create the owner/admin account.
8. Configure backup/update process appropriate to hosting method.

### Step 14 — Configure Model Names

Do not leave the customer staring at technical model identifiers unless they want them.

Where supported, use clear labels such as:

- Gray Matter — General
- Gray Matter — Coding
- Gray Matter — Research
- Gray Matter — Fast
- Gray Matter — Deep Reasoning

If transparent provider names are important to the client, include both purpose and model/provider.

Example:

`Coding — Claude`

### Step 15 — Hide Unapproved Models

Remove or hide models that:

- were not approved,
- are redundant,
- are too expensive,
- create confusion,
- should not be available to certain users.

---

## 9. Phase 5 — Team Configuration

Skip this section for a solo client unless needed.

### Step 16 — Create User Accounts

Create one account per employee.

Do not share one password among six employees.

Record:

- employee
- role
- access level
- allowed models
- usage/budget policy

### Step 17 — Define Roles

Example for a six-person boutique:

- Owner/Admin — full access
- Designer — approved creative/coding/design-support models
- Marketing — writing/research models
- Sales — customer response/proposal models
- Production — operational/document models
- Admin — general productivity models

Permissions should match actual job needs.

### Step 18 — Create Shared Prompt Templates

Examples:

- Write a client response
- Create a product description
- Summarize an order request
- Turn notes into a quote
- Draft social caption
- Review customer requirements
- Create production checklist

Keep templates short, reusable, and tied to actual business tasks.

### Step 19 — Add Shared Knowledge Only If Needed

Possible content:

- brand voice guide
- pricing policies
- service descriptions
- SOPs
- product information
- internal FAQs
- customer service policies

Do not upload sensitive or unnecessary information simply because the system supports files/knowledge.

Confirm what data the client is comfortable sending to third-party AI providers.

---

## 10. Phase 6 — Optional Business Workflow Integration

The AI Command Center itself is primarily an AI consolidation/integration service.

Add n8n or another workflow engine only when the client wants AI output to trigger business processes.

Examples:

- AI finishes proposal → save to Drive → notify salesperson
- AI summarizes inquiry → create CRM record
- AI drafts response → human approves → send email
- AI creates product copy → send to review queue
- AI extracts order details → update Airtable

### Human Approval Rule

By default, require approval before actions such as:

- sending external communications,
- publishing content,
- deleting records,
- modifying critical business data,
- spending money,
- issuing refunds,
- executing customer commitments.

---

## 11. Phase 7 — Testing

### Step 20 — Build the Test Set

Use real client tasks gathered during discovery.

Minimum recommended test set:

- Solo: 10–15 representative tasks
- Team: 20–30 representative tasks across roles

### Step 21 — Test Each Model Role

For each task verify:

- correct model is available
- routing is correct
- output quality is acceptable
- response time is acceptable
- cost is reasonable
- fallback works when configured
- files work where required
- users can understand which option to choose

### Step 22 — Test Access Controls

For teams verify:

- each user can log in
- each user sees only intended resources/models where supported
- admin account works
- removed/disabled users cannot continue accessing the system

### Step 23 — Test Failure Scenarios

Test/document:

- provider/API failure
- exhausted credits
- invalid API key
- rate limit
- gateway outage
- model unavailable
- hosting restart

The client should know what happens when a provider is unavailable.

### Step 24 — Tune the System

Adjust:

- labels
- default model
- routing rules
- fallback model
- spending thresholds
- prompt templates
- user permissions

Repeat testing until the common workflows are simple and predictable.

---

## 12. Phase 8 — Client Training

### Step 25 — Demonstrate the System

Show the client:

1. Where to log in.
2. How to start a conversation.
3. How to choose a model/purpose.
4. When automatic routing is used.
5. How to override the model if allowed.
6. How to upload/reference files if enabled.
7. How to use shared prompts.
8. How to view history.
9. What features still require the original AI application.
10. Who to contact when something fails.

### Step 26 — Teach One Simple Rule

The client should leave knowing:

> “Start here for normal AI work. Only go back to the original app when you need one of its special native features.”

---

## 13. Phase 9 — Handoff

### Solo Client Handoff

Provide:

- Workspace URL
- Owner login
- Admin ownership confirmation
- One-page “what to use for what” guide
- List of connected providers
- Billing/usage explanation
- Support instructions

### Team Client Handoff

Provide:

- Workspace URL
- Owner/admin account
- Individual user accounts or account-creation process
- Role/access matrix
- Model-purpose guide
- Shared prompt guide
- Budget/usage policy
- Provider/gateway ownership confirmation
- Support instructions

### Access Cleanup

If the client did not purchase ongoing management:

- confirm client admin ownership
- transfer any required credentials/accounts
- remove Gray Matter access that is no longer needed
- retain only documentation Gray Matter is authorized to retain

---

## 14. Phase 10 — Documentation Package

Store a client-specific implementation record containing:

- Architecture diagram
- Workspace product/version
- Gateway/router used
- Approved providers/models
- Model role matrix
- Routing rules
- Fallback rules
- User/role matrix
- Hosting location/account owner
- Domain/subdomain
- Backup/update procedure
- Support contacts
- Known limitations

Do NOT store secret keys in the document.

---

## 15. Ongoing Support Offering

Offer an optional **AI Command Center Care** plan.

Possible coverage:

- provider/model changes
- broken API troubleshooting
- gateway updates
- workspace updates
- new model integration
- routing optimization
- cost review
- user onboarding/offboarding
- prompt template maintenance
- usage review
- shared knowledge updates
- workflow additions

Recommended recurring review questions:

- Are users still switching back to separate AI apps unnecessarily?
- Which models are actually being used?
- Are expensive models being used for cheap tasks?
- Have provider/model capabilities changed?
- Are routing rules still correct?
- Are there new repetitive tasks that should become workflows?

---

## 16. Example Fulfillment — One-Woman Graphic Designer

### Client Need

Uses six AI applications for concept development, client emails, research, copywriting, and general brainstorming.

### Fulfillment

1. Inventory six tools and tasks.
2. Identify which provider-native features she must keep.
3. Reduce routine work to four or five model roles.
4. Deploy Open WebUI.
5. Connect OpenRouter.
6. Enable only approved models.
7. Label models by purpose.
8. Configure basic monthly spending controls.
9. Create a few reusable prompts.
10. Test with real design-business tasks.
11. Train client.
12. Hand off one login + one-page guide.

### Do Not Add Unless Needed

- complex team permissions
- enterprise observability
- extensive routing logic
- custom portal
- large knowledge base

---

## 17. Example Fulfillment — Six-Person T-Shirt Boutique

### Client Need

Six employees use AI differently and the owner wants consistent tools, shared workflows, centralized billing, and control.

### Fulfillment

1. Inventory users, roles, tasks, and current subscriptions.
2. Define approved model list.
3. Define model roles by task.
4. Deploy shared Open WebUI or LibreChat workspace.
5. Deploy/configure LiteLLM or Portkey.
6. Connect business-owned provider credentials.
7. Configure aliases/routing/fallbacks.
8. Configure budgets/rate limits.
9. Create six individual accounts.
10. Configure access by role where supported.
11. Create shared prompt templates.
12. Add approved business knowledge if useful.
13. Add n8n only for business-process actions that need automation.
14. Test tasks across every role.
15. Train owner/admin.
16. Train employees on the simplified model choices.
17. Hand off admin ownership, team guide, and support process.

---

## 18. Gray Matter Internal Template Standard

Suggested internal service/template identifier:

`GM-AUTO-AI-001 AI Command Center`

Reusable components:

- Discovery questionnaire
- AI tool inventory worksheet
- Task inventory worksheet
- Model-role matrix
- Stack decision matrix
- Open WebUI deployment checklist
- OpenRouter setup checklist
- LiteLLM setup checklist
- Team user/role matrix
- Test-case sheet
- Handoff guide template
- AI Command Center Care checklist

For each new client, clone the template and customize rather than designing the engagement from scratch.

---

## 19. Definition of Done

The AI Command Center order is complete when:

- The client's real AI use cases are documented.
- Required provider-native features and exceptions are documented.
- The client has one primary AI workspace.
- Only approved models are exposed.
- Model roles are understandable.
- Routing works as designed.
- API keys are secured.
- Client ownership is documented.
- Budgets/limits are configured where required.
- Team accounts/roles are configured where required.
- Representative client tasks pass testing.
- Failure behavior is understood/documented.
- Client training is complete.
- Client has admin access.
- Client has a simple usage guide.
- Gray Matter support/access status is documented.

---

## 20. Simple Customer-Facing Description

**AI Command Center**

> Bring the AI tools you already use into one organized system. Gray Matter configures the workspace, connects the right AI models, simplifies which tool to use for each job, and adds team controls, budgets, and workflows when needed.

The service is sold as **integration and workflow simplification**, not as custom AI software development unless the client specifically orders custom development.
