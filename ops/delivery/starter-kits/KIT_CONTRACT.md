# Starter kit contract

A starter kit is the reusable foundation for one Gray Matter service: what we
ask, what we deliver, how we build it, how we check it, how we hand it over.
`python3 ops/tools/check_ops.py` enforces this contract.

Each kit is a folder `ops/delivery/starter-kits/<kit-id>/` with exactly two
required files, plus optional extras (checklists, scripts, sample configs).

## `kit.json`

```json
{
  "id": "website",
  "name": "Website Starter Kit",
  "service": "business-websites",
  "default_lines": [
    {"item": "website-business", "qty": 1}
  ],
  "timeline": "2-3 weeks",
  "reuses": ["websites/README.md", "app-design/templates/WEBSITE_BRIEF.md"]
}
```

- `service`: a slug from `js/data.js` (`services/<slug>.html` exists).
- `default_lines[].item`: a key in `ops/delivery/price-book.json`. For a price
  of `null` the quote shows "Price confirmed after a quick fit check" and the
  owner sets the amount with `--price item=amount`.
- `timeline`: from the price book when it has one, otherwise
  `"Confirmed after a quick fit check"`.
- `reuses`: repository paths this kit builds on. Every path must exist.

## `KIT.md`

Front matter: `id`, `name`, `service` (same as kit.json). Then these sections,
in this order, all required and non-empty:

1. `## Who it is for` the client's problem in their own words (reuse the
   `problem` line from `js/data.js`).
2. `## Fit check` 5 to 8 questions that decide whether we take the job and
   which tier. Include at least one disqualifier.
3. `## Scope included` concrete deliverables, each checkable.
4. `## Scope excluded` what is quoted separately.
5. `## Client inputs` what we need before work starts (accounts, access,
   files, decisions).
6. `## Default stack` tools we use, preferring what the client already owns
   and free tiers. Every paid tool is named with who pays for it. No tool the
   client must keep paying for unless it is the point of the service.
7. `## Build steps` numbered, in order, each one a verb-first instruction a
   technician can follow without asking.
8. `## QA checklist` `- [ ]` items, each a pass/fail test, not a goal.
9. `## Handoff` what the client receives and is shown; credential handover
   rules (client owns every account; Gray Matter keeps no passwords after
   handoff, matching `agreement.html`).
10. `## Maintenance option` what ongoing care looks like and how it is priced
    (use `addon-maintenance` only for websites; others are fit-check priced).

## Rules

- Never invent prices, timelines, client names, results or certifications.
- Reuse existing repository material by linking to it, rather than copying it.
- Keep it short enough to run a real job from: a kit is a working checklist,
  not an essay.
