# UX Review and Design-Spec Protocol

**Purpose:** A reusable way to make UI/UX decisions and record them without fragmented plans or guesswork. Adapted from Spread's [foundational UX policy](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/FOUNDATIONAL_UX_PRINCIPLES.md), [design map](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/README.md), [rules card](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/RULES_CARD.md), and [spec-writing pack](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/packs/spec-writing.md).

## Start from structure, not decoration

Review these seven visual fundamentals before creating a new look:

| Principle | Question | Evidence |
| --- | --- | --- |
| Unity | Does the product feel coherent across screens and sizes? | Compare component semantics, labels and tokens |
| Balance | Is the user's work more prominent than chrome? | Thumbnail/squint hierarchy test |
| Hierarchy | Is the next action obvious? | One primary action and logical heading/focus order |
| Contrast | Can content and controls be understood without color alone? | Light/dark, focus, large text and accessible contrast |
| Emphasis | Are important actions distinguishable without everything shouting? | Review competing CTAs |
| Scale | Are controls, labels and content reachable and readable? | Touch targets, text scaling and safe areas |
| Repetition | Are familiar patterns reused instead of reinvented? | Component inventory and documented exceptions |

## UX laws as review lenses

Apply these heuristics when they matter, not as rituals:

- **Hick's Law:** Limit simultaneous meaningful choices; progressively disclose secondary tasks.
- **Jakob's Law:** Prefer familiar platform navigation and editing behavior.
- **Fitts's Law:** Make tap targets stable, adequately large and separated.
- **Gestalt grouping:** Group related content and actions visually and in accessibility reading order.
- **Chunking:** Avoid workflows that require users to memorize values across screens.
- **Tesler / Occam:** Simplify the surface without deleting essential domain rules, privacy or history.
- **Doherty:** Respond promptly to touch and report true pending/error/success state.
- **Aesthetic–usability:** Polish supports clarity but cannot excuse broken functionality.
- **Von Restorff:** Make the next required action or warning easy to distinguish.
- **Goal-gradient / Zeigarnik:** Show truthful progress and an obvious way to resume unfinished work.

Inspired by [Laws of UX](https://lawsofux.com/) and [seven design fundamentals](https://www.concretecms.com/about/blog/web-design/7-fundamentals-of-web-design). These are useful heuristics, not proven numerical performance claims.

## Documentation authority

1. **Current working implementation and approved product rules** beat older mockups, speculative specs and example apps.
2. Surface-specific instructions (native app, marketing page, checkout, etc.) beat general design heuristics for that surface.
3. Product tokens and business rules have **one source of truth**. Reference or generate mirrors, do not create competing files.
4. New design decisions go in the owning document and the product's decision log. Mark superseded proposals as history.
5. Never infer a feature has shipped because a PR, screenshot, prototype or source filename exists. Inspect the current release.

A practical reading hierarchy for AI tools: short rules card → index/map → one task-specific pack → precise long-document sections → source code/tokens. Spread uses generated rules-card and token checks; these are examples, not commands installed in the Gray Matter repository.

## Match specification effort to risk

| Size | What needs documenting |
| --- | --- |
| **S** Routine fix within an approved pattern | One-sentence outcome, focused edit and relevant checks; no large spec |
| **M** New behavior or component variation | Brief spec, two structurally different options, states, test/rollback plan |
| **L** New screen, major redesign or cross-system change | Full spec, three distinct structural options, architecture, device/accessibility matrix and rollout |

A different color scheme is not an alternate structure. State the problem, non-goals, effort budget, protected paths and genuine exceptions before choosing a concept.

### M/L design-spec sequence

1. State **who**, **task**, **surface**, and **current failure**.
2. Read relevant approved docs, the current source and design decisions before proposing changes.
3. Collect evidence and label unsupported details as assumptions.
4. Identify goals, non-goals, effort limits, required exceptions and protected behavior.
5. Compare two or three **different interactions or structures**, not merely aesthetic options.
6. Breadboard places (screens/sheets/states), affordances (actions) and connections (navigation).
7. Describe first-run, empty, loading, error, offline, overflow, denial, cancellation and Undo states.
8. Specify data owner, persistence, device sizes, input methods, focus, access, haptics and motion.
9. Write observable **Given / When / Then** acceptance, with physical-device checks where needed.
10. List risks, open decisions with owners, implementation plan, verification, rollout and rollback.
11. Record what was actually tested and what remains unverified.

Reusable form: [DESIGN_CHANGE_SPEC.md](templates/DESIGN_CHANGE_SPEC.md). Simple features can continue using [FEATURE_SPEC.md](templates/FEATURE_SPEC.md).

## Evidence conventions

- **[Repo]** inspected code or active repo documentation.
- **[Apple]** official Apple reference.
- **[3P]** third-party advice or library.
- **[Rec]** recommendation, not requirement.
- **[Assumption]** unconfirmed fact, labeled for review.
- **[Tested] / [Not tested]** only when accurate test results or device evidence are supplied.

When testing a usability change, compare the **same task and user state** before and after. Ask a tester: “Do you know how to do this?”, “Is it easy?”, “How could it be better?” Record outcomes instead of claiming success based on visuals.

**Scope boundary:** These principles never authorize redesigning a product, changing domain data, introducing packages, bypassing an owner's approved rules or merging/releasing without the relevant checks.
