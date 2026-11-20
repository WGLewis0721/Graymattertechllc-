# Gray Matter Operations

The internal operating system for Gray Matter LLC: find opportunities, reach
out, qualify, quote, deliver from a reusable foundation, hand off. GitHub is the
source of truth. Python 3 standard library only; nothing to install, no
subscriptions.

**This repository is public and its root is the live website.** Nothing under
`ops/` is linked from the site. Private data never enters git: lead records live
in `$GM_LEADS_DIR` (default `ops/leads/private/`) and client folders in
`$GM_CLIENTS_DIR` (default `ops/delivery/private/clients/`). Both defaults are
gitignored, and `check_ops.py` fails if either is ever tracked. Point both
variables at a private location (a private repository clone or a synced private
Drive folder) to back them up.

**Run it on a schedule:** [CHECKLISTS.md](CHECKLISTS.md) has the daily, weekly, bi-weekly and monthly checklists.

**Strategy first:** [GTM.md](GTM.md) sets who we sell to first, the offer ladder, channels, weekly targets and the 90-day plan. The tools below follow it: lead scoring favors its priority segments, the Muse queue favors its focus industries, and `leads.py report` compares each week against its targets.

```
ops/
├── GTM.md              go-to-market strategy (read first)
├── marketing/          A. Marketing Content Engine
│   ├── BRAND_VOICE.md     rules every post follows
│   ├── SCHEMA.md          post and research-brief formats
│   ├── data/              pillars, topics, CTAs (edit to add topics)
│   ├── research/          sourced research briefs, one per topic
│   ├── posts/             one file per Facebook post (draft → approved → posted)
│   ├── index/             generated searchable index (md + json)
│   ├── muse/              generated Muse hand-off folder
│   └── video/             video notes + engine/ (post → Reel renderer and review tool)
├── leads/              B. Lead Intelligence System
│   ├── DISCOVERY.md       where to find leads, what to capture, rules
│   ├── scoring.json       signals, points, tiers, cadence, campaign windows
│   └── outreach/          email, DM, and call templates
├── delivery/           C. Product Delivery Factory
│   ├── price-book.json    published prices and agreement terms only
│   ├── templates/         discovery → proposal → quote → invoice → handoff → closeout
│   └── starter-kits/      9 service kits (KIT.md + kit.json each)
├── tools/              content.py · leads.py · engage.py · check_ops.py
└── tests/              acceptance tests (run in CI)
```

## The daily loop

| When | Do | Command |
|---|---|---|
| Morning, 8:30 | First touches to the best new leads | `python3 ops/tools/leads.py campaign morning` |
| Morning | Send each message yourself, then log it | `leads.py log L0007 --channel email --outcome sent` |
| Afternoon, 1:30 | Follow-ups due, replies, calls | `python3 ops/tools/leads.py campaign afternoon` |
| Any time | Add a lead you found | `leads.py add --business "..." --industry detailers --website ...` |
| Any time | Check their public site, record signals | `leads.py audit-lead L0007` |
| Weekly | Approve posts, refresh the Muse queue | `content.py approve gm-fb-0003 ...` then `content.py export-muse --start <monday>` |
| Weekly | Pipeline health | `leads.py report` |

Campaign files are written to `$GM_LEADS_DIR/campaigns/`. Nothing is sent
automatically: you review every message and send it from your own inbox, DM or phone.

## From lead to paid engagement

1. **Qualify.** Run the discovery call (`delivery/templates/DISCOVERY_CALL.md`)
   and the kit's `## Fit check`. Record the problem: `leads.py update L0007 --problem "..." --status qualified`.
2. **Quote.** `python3 ops/tools/engage.py new --lead L0007 --kit website --add addon-seo=500`
   creates a private client folder holding the proposal, quote, onboarding, QA,
   handoff, change-request and close-out documents, plus the kit checklist.
   Services without a published price need `--price <item>=<amount>` after the
   fit check. Prices below the published floor, or outside a published range, are refused.
3. **Deposit.** `engage.py invoice <client-slug> deposit` (50%, non-refundable, per the agreement).
4. **Deliver** from `KIT_CHECKLIST.md` in the client folder: build steps, then QA.
5. **Balance and handoff.** `engage.py invoice <client-slug> balance`, then `HANDOFF.md` and `CLOSEOUT.md`.
6. Mark the lead `won`: `leads.py update L0007 --status won`.

`engage.py kits` lists every kit with its price and timeline.

**Hours from commit history:** `python3 ops/tools/git_hours.py <repo> --rate 150` groups commits into work sessions
(commits under 2 hours apart = one session, plus 30 minutes before each session's first commit) and prices them.
It counts only time between commits, so treat it as the floor of your time on a build, not the whole job. `engage.py status` lists open engagements.

## Marketing content

- `content.py search backup --pillar protect` searches posts and briefs.
- `content.py validate` enforces the voice rules: banned filler, no invented
  statistics or prices, 45–130 words, one CTA, and no near-duplicate posts or hooks.
- `content.py export-muse --start 2026-11-23 --days 14` writes
  `muse/README_MUSE_WORKFLOW.md`, `muse/README_DAILY_CAPTIONS.md` and `muse/queue.json`
  in the same shape as earlier Muse folders. It refuses to export while any
  validation problem exists. Use `--include-drafts` to build an approval queue;
  the files then say NOT YET APPROVED on every draft.
- After Muse publishes: `content.py mark-posted gm-fb-0003 --date 2026-11-23 --url <post-url>`.
  Posted ids are never queued again.
- New topic: add it to `data/pillars.json`, write a research brief with at least
  two real sources, then write posts. One Haiku session per topic batch works well.

## Checks

```bash
python3 ops/tools/check_ops.py                 # contracts: content, kits, templates, outreach, privacy
python3 -m unittest discover -s ops/tests -v   # acceptance tests
```

Both run in CI on every pull request that touches `ops/` (`.github/workflows/ops-validation.yml`).

## Google Drive

All Gray Matter files live in the business Drive folder **Gray Matter LLC**
(owned by graymattertechllc@gmail.com, with William's personal account as Editor):

| What | Drive location |
|---|---|
| Mirror of this repo (runbook, templates, kits, research, Muse queue) | Gray Matter LLC / 04 - Operations & SOPs / **Gray Matter Ops (mirror of GitHub)** |
| Muse posting folder | …/Gray Matter Ops (mirror of GitHub) / **01 - Muse Facebook Queue** |
| Private lead data (`$GM_LEADS_DIR`) | Gray Matter LLC / 03 - Sales & Clients / Leads & Prospects / **Ops Lead Data (private - do not share)** |
| Private client folders (`$GM_CLIENTS_DIR`) | Gray Matter LLC / 03 - Sales & Clients / Active Clients / **Ops Client Folders (private - do not share)** |

On the laptop, with Google Drive for desktop, point the tools at the two private
folders (the path depends on how Drive for desktop names shared folders on your machine):

```bash
export GM_LEADS_DIR=".../Gray Matter LLC/03 - Sales & Clients/Leads & Prospects/Ops Lead Data (private - do not share)"
export GM_CLIENTS_DIR=".../Gray Matter LLC/03 - Sales & Clients/Active Clients/Ops Client Folders (private - do not share)"
```

GitHub is authoritative. Finished resources are copied, without duplicates, to
the Drive folder **Gray Matter Ops (mirror of GitHub)**. Never edit the Drive
copies: change GitHub, then re-mirror. The Muse folder in Drive is regenerated
from `ops/marketing/muse/` on each export.
