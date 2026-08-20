# Gray Matter Website — Direction & Architecture

Last reviewed: 2026-08-20

This document describes what the site is trying to do, how it is put
together, and the rules anyone editing it has to keep. It sits alongside
`README.md` (orientation and file map) and
`.github/copilot-instructions.md` (conventions for automated edits).

---

## 1. Direction

### The promise

> Tell us what needs to change. We figure out the technology.

Supporting message: **Grow. Save. Protect. Get it handled.**
Funnel promise: **Choose your goal. Build your plan. Approve before we start.**

### The interaction principle

> Swipe to explore. Tap to choose. Toggle to customize. Pay when ready.

The primary customer experience is a **guided menu funnel**, not a service
catalog. A visitor is never shown the whole technical catalog at once. They
choose a result, see three or four starting points that fit that result,
optionally turn on compatible options, and review one plan before anything
happens.

The mental models it borrows from, in order:

1. Ordering from a short restaurant menu.
2. Picking a standard prefabricated-home model.
3. Customizing that model with compatible options.
4. Closing quickly when the customer already knows what they want.

### Messaging rules

| Rule | What it means in practice |
|------|---------------------------|
| Zero cognitive load | Plain language. Technical terms only behind a deliberate "full details" link. |
| Link to survival | Every solution connects to making money, saving time, cutting cost, avoiding loss, reducing frustration, gaining control, or protecting the business. |
| Make it repeatable | Headings, labels, and results are short enough for a customer to repeat to a partner. |
| Customer is the hero | The customer wins. Gray Matter recommends, builds, tests, and completes. |

### Two buyer paths, kept apart

* **Small business menu funnel** — homepage, service pages, pricing.
  Plain language only.
* **Cloud consulting** — `cloud-consulting.html`. AWS, infrastructure,
  Terraform, DevOps, and contract language lives here and nowhere else.

Never mix the vocabularies.

---

## 2. Page architecture

| Page | Role |
|------|------|
| `index.html` | Home. Hosts the guided menu funnel (`#build-my-plan`) — the primary selection experience. |
| `services.html` | Full service detail catalog. SEO, inclusions, exclusions. Secondary path. |
| `services/*.html` | Ten detailed service pages: FAQs, process, what's included, what isn't. |
| `industries.html`, `industries/*.html` | Nine audience pages. |
| `pricing.html` | The only page that sets website package prices and add-on prices. |
| `process.html` | The ten-stage "Tech Fit to Completion" roadmap. |
| `about.html` | Founder credentials, how the work runs, the two buyer paths, contact. |
| `cloud-consulting.html` | The separate technical buyer path. |
| `contact.html` | The inquiry form. Receives plans built in the funnel. |
| `agreement.html` | Client agreement. Linked from the plan drawer. |
| `sops.html`, `portfolio.html` | Internal-process reference and the (currently empty) case-study system. |

Primary navigation: **Solutions · How It Works · Cloud Consulting · About ·
Tell Us What You Need**. Pricing stays reachable from the Solutions menu
footer, the mobile menu, the funnel, and the site footer. The site footer
keeps links to every individual service page for SEO and direct navigation.

Detailed service content stays on service pages. The funnel links out to
them ("Full details on …") but never absorbs them.

---

## 3. The funnel

### Files

| File | Responsibility |
|------|----------------|
| `js/funnel-data.js` | **Configuration only.** Outcomes, starting points, options, inclusions, displayed prices, displayed timelines, guidance labels, guided-question rules, and checkout URLs. |
| `js/funnel.js` | **Behaviour only.** State machine, rendering, rails, toggles, drawer, history, storage. Owns no business copy. |
| `js/plan-intake.js` | Receives a plan on `contact.html`, renders the summary, fills the structured hidden fields. |
| `css/funnel.css` | Funnel styling. Extends the tokens in `css/style.css`; loaded only by `index.html` and `contact.html`. |

To change a label, a price, an option, a mapping, or a checkout link, edit
`js/funnel-data.js` and nothing else.

### Flow

```
Step 1  outcome        four swipeable cards: grow · operate · protect · support
Step 2  starting point only the plans for the chosen outcome (2–4 cards)
Step 3  customize      only the options that plan allows (role="switch" toggles)
        plan drawer    the full confirmation state, opened deliberately
        contact.html   Send My Plan → inquiry form with structured fields
```

Two fast lanes bypass the steps and stay available at every step, in the
sticky action bar:

* **I Know What I Need** → a compact, grouped, searchable list of all
  twelve starting points. Each row can go straight to Start Now.
* **Recommend It for Me** → three plain questions, one primary
  recommendation with one sentence of reasoning, then Start / Adjust /
  Talk It Through. Answers survive going back.
* **My Plan** → opens the drawer.
* **Start Now** → opens the drawer if a plan is chosen, otherwise returns
  to the goal menu.

A customer may also press **Start Now** directly on any starting-point
card and skip customization entirely.

### State model

```js
{
  step:    'outcome' | 'plans' | 'customize' | 'browse' | 'questions' | 'recommendation',
  goal:    outcome id | null,          // grow | operate | protect | support
  plan:    starting-point id | null,
  options: [option id, …],             // always filtered to what the plan allows
  answers: { result, frustration, mode },
  why:     the sentence explaining the current recommendation
}
```

Three copies of that state are kept in sync:

1. **Memory** — the live object in `js/funnel.js`.
2. **`sessionStorage['gm-funnel-v1']`** — identifiers and labels only.
   Nothing sensitive. Written on every change; wrapped in `try/catch` so
   private-browsing mode degrades to a funnel that simply forgets.
3. **The URL** — `?goal=&plan=&opts=&step=&ans=#build-my-plan`.
   Forward moves use `pushState`, so Back returns to the previous step.
   Toggling an option uses `replaceState`, so a customer doesn't have to
   press Back once per switch. `popstate` re-reads the query and re-renders.

On load the URL wins; if the URL carries nothing, the session snapshot is
restored. Every restore is re-validated against the configuration, so a
stale or hand-edited URL can never enable an option a plan does not allow.

Nothing in the funnel reloads the page.

### Compatibility rule

`GM_FUNNEL.allows(planId, optionId)` is the single gate. `optionsFor()`,
`pricing()`, the state restore, and `plan-intake.js` all run through it, so
website options can never appear while configuring security or backup, and
an option carried in a URL for the wrong plan is dropped rather than shown.

### Accessibility contract

* Toggles are `<button role="switch">` with accurate `aria-checked`, and the
  checked state also draws a tick — never colour alone.
* The plan summary change is announced through a polite live region.
* Step changes move focus to the step heading (`tabindex="-1"`).
* Rails are native `overflow-x` + `scroll-snap`. Arrow keys move focus
  between cards; visible previous/next buttons appear from 768px and
  disable themselves when there is nothing to scroll. Nothing calls
  `preventDefault` on touch, so vertical page scrolling is untouched.
* The plan drawer is genuinely modal (backdrop, `aria-modal`), so it loops
  focus and closes on Escape. Nothing else traps focus.
* Every funnel control is at least 44×44px.
* `prefers-reduced-motion` removes transitions and smooth scrolling.

---

## 4. Money and claims

**Never invent a price, a timeline, a limit, a testimonial, a popularity
claim, or a performance claim.**

Approved, published values (from `pricing.html`) and where the funnel uses
them:

| Value | Used by |
|-------|---------|
| Starting at $750 · typically 7–10 business days | Professional Online Presence |
| Starting at $1,500 · typically 2–3 weeks | Customer Action System, and any plan where "Let Customers Book Online" is switched on |
| Starting at $3,000 · typically 4–6 weeks | Any plan where "Take Payments Online" or "Sell Products Online" is switched on |
| +$400–$900 copywriting · +$350–$750 SEO · +$300–$600 email marketing · $149–$299/mo care | Shown per option, never summed |

Everything else displays:

* **Price confirmed after a quick fit check**
* **Timeline confirmed after a quick fit check**

Add-on prices are listed individually. The funnel never totals them,
because a total would be a quote.

**Package upgrades move the whole plan, not just the number.** An option
that carries an `upgrade` block (online booking, online payments, an online
store) replaces the plan's displayed price, timeline **and inclusions**
with the package it moves the build to, and states why in one sentence.
Without that, a plan would show a bigger build's price against a smaller
build's scope. `pricing()` returns the matching `includes`; every surface
that lists inclusions after options are applied reads that, not
`plan.includes`.

**Plans carry their own boundaries.** A plan's optional `excludes` string
is one plain sentence saying what the plan is not — shown on the customize
step and in the plan drawer. It exists so a bounded solution (the Customer
Action System, the Opportunity Finder, the Checkup, the Partner
arrangement) can never be read as unlimited.

Only present something as an option when it adds separate scope, extra
volume, ongoing labour, hardware, or another system. Ordinary required
website functionality is an inclusion, not an upsell — and a function that
belongs to one package only is described as belonging to that package, never
as universally included.

---

## 5. Checkout and payment

The site is static, on GitHub Pages. There is no payment processing in the
repository and no fake checkout anywhere.

`GM_FUNNEL.checkout.links` in `js/funnel-data.js` is the **only** place a
real payment or deposit URL belongs. Every entry ships as an empty string:

```js
var CHECKOUT = {
  links: {
    'online-presence':     '',   // ← paste a real Stripe Payment Link here
    'customer-actions':    '',   // ← and here
    …
  }
};
```

Resolution rules, enforced in `resolveAction()`:

* Empty value → the primary action is **Send My Plan**, which carries the
  configured plan into the existing FormSubmit inquiry form.
* A real `https://` URL **and** `checkoutMode: 'deposit'` → the primary
  action becomes **Reserve My Project** and opens that URL in a new tab.
* `checkoutMode: 'fit-check'` → a link is ignored by design. Those services
  need technical validation, so they never take a payment.

Only the two website plans are `checkoutMode: 'deposit'`. Everything else is
`fit-check`.

The plan drawer links to `agreement.html` and says plainly that sending a
plan is a request, not a signature. Do not present a checkbox as an
electronic signature.

---

## 6. Inquiry form contract

`contact.html` keeps its existing FormSubmit action, validation, and
success/error behaviour. A failed request never shows success — the submit
handler requires an explicit `success` confirmation from the service and
otherwise reveals the error block.

The funnel adds structured hidden fields, filled by `js/plan-intake.js`:

| Field | Contents |
|-------|----------|
| `plan_goal` | The chosen outcome, e.g. "Protect My Business" |
| `plan_starting_point` | Starting point plus the service it maps to |
| `plan_options` | Enabled option labels, or "None" |
| `plan_answers` | Guided question/answer pairs, or "Guided questions not used" |
| `plan_price` | Displayed price plus whether it is published or not yet quoted |
| `plan_timeline` | Displayed timeline plus the same status |
| `plan_next_step` | "Send my plan…" or "Review it with me…" |

The plan travels as identifiers in the query string (`?plan=&opts=&ans=&next=`),
with the session snapshot as a fallback. No personal or sensitive data is
stored or passed by the funnel.

---

## 7. Technical constraints

* Static HTML, CSS, and vanilla JavaScript. No frameworks, no build step,
  no package manager, no carousel library.
* Two stylesheets: `css/style.css` (site) and `css/funnel.css` (funnel).
  Same tokens, same radii, same timing. No second design system.
* Navigation and footer markup is duplicated per page — that is the
  established pattern for this static site. Change it with a scripted,
  uniform edit across all pages, never by hand on one page.
* SEO-critical copy exists as static HTML as well as configuration. The
  funnel container ships a crawlable, no-JavaScript fallback listing every
  outcome and starting point with links to the service pages.
* Horizontal panels scroll inside their own containers. The page body must
  never scroll horizontally.

### Running locally

```bash
python3 -m http.server 8080     # or: npx http-server -p 8080 -c-1
```

---

## 8. Open items

These need a decision from the business before they can appear on the site:

1. **Approved prices and timelines** for: Opportunity Finder, Workflow
   Time-Saver, Business Process System, Work From Anywhere Setup,
   Technology Cost Cleanup, Business Security Setup, Backup & Recovery
   Setup, Complete Protection Package, Business Technology Checkup, and
   Technology Partner. Until then all ten display the fit-check wording.
2. **Real checkout or deposit links** for the two website plans, pasted
   into `GM_FUNNEL.checkout.links`.
3. **Case studies** — `GM_DATA.caseStudies` is deliberately empty until
   real, approved client work exists.
4. **Low-ticket digital products** — `GM_DATA.products` is deliberately
   empty until a real price and deliverable exist.
