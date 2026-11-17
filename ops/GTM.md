# Gray Matter go-to-market strategy

*Version 1 · 2026-11-17 · Owner: William Lewis · Review on 2026-12-15 (after 4 weeks of data)*

Every price below is already published on `pricing.html`. Every target is a
**starting assumption** to replace with real numbers from `leads.py report`
after four weeks. The tools read the decisions here: `ops/leads/scoring.json`
(`priority_segments`, `weekly_targets`) and `ops/marketing/data/pillars.json`
(`focus_industries`).

## 1. The bet in one sentence

Win **appointment-based personal service businesses in the Montgomery River
Region** whose customers can't easily find, book or reach them. Sell them a
**Business Site with booking**, then keep them on **monthly maintenance** and
grow into automation, security and backup.

## 2. Who first (and who waits)

| Priority | Segment | Why now | Score bonus |
|---|---|---|---|
| **1 · Beachhead** | Barbers & salons | Booking is the whole business, problems are visible from the street and in reviews, a template exists (`websites/templates/barbers-stylists`), and past barbershop work exists | +15 |
| **1 · Beachhead** | Detailers (shop and mobile) | Owners work with their hands and can't answer the phone; quotes and deposits live in DMs; a template exists; past detailing work exists | +15 |
| 2 · Next | Cleaning & turnover services | Quote-request business; slow replies lose jobs; template exists | +8 |
| 2 · Next | Contractors & home services | High job value, quote-request flow; template exists | +8 |
| Opportunistic | Real estate, professional services, food trucks, solo founders, appointment businesses | Take inbound and referrals; no outbound effort yet | 0 |
| Separate path | Cloud consulting (`cloud-consulting.html`) | Different buyer and vocabulary; network and referral-driven, never mixed into small-business outreach | n/a |

**Why narrow:** one segment means one message, one portfolio, one set of
referrals, and every job makes the next one easier to sell. Widen the
beachhead only after reaching three paying clients in it.

**Ideal client:** owner-operated; 1 to 10 people; in Montgomery, Prattville,
Millbrook, Wetumpka or Pike Road; active on Facebook or Instagram; and with **one
visible problem**: no real website, no online booking, reviews mentioning
missed calls, or orders taken in DMs. `leads.py audit-lead` and the scoring
signals detect exactly these.

**Disqualify:** no decision maker reachable; wants a full custom app on a
starter budget; refuses the deposit terms in `agreement.html`.

## 3. The offer ladder

| Step | Offer | Price (published) | Job |
|---|---|---|---|
| 0 · Door opener | **Free Online Presence Check**: a 10-minute look at their site, Google listing and booking path, sent as five plain lines | Free | Earn the conversation. Generated from `leads.py audit-lead` evidence. |
| 1 · Core | **Business Site**: up to 5 pages, online booking, services and pricing, gallery | From $1,500 | The main sale for the beachhead. |
| 1 · Budget | Essential Site: up to 3 pages | From $750 | For an owner who only needs to be found. Step them up later. |
| 2 · Recurring | **Monthly Maintenance** | $149 – $299/mo | Attach to every site. This is what makes the business stable. |
| 2 · Add-on | SEO Audit & Setup | $350 – $750 | Offer when Google visibility is the stated pain. |
| 3 · Expand | Workflow Automation (booking reminders, DM-to-order), Business Security, Backup | Fit-check priced | Sell to existing clients 30 to 60 days after launch. |

**What one client is worth** (arithmetic on published prices): a Business Site
plus maintenance is $1,500 + 12 × $149 to $299 = **$3,288 to $5,088 in the first
year**. Maintenance is the lever: 10 maintained clients bring $1,490 to $2,990
in every month.

**Decision for the owner:** set a fixed public price for the Business Technology
Checkup. A known price makes it a second door opener for owners outside the
beachhead. Until then it stays fit-check priced and the free presence check does
the job.

## 4. The message

- **Problem, in their words:** "People can't book me unless they call, and I
  can't answer when I'm working."
- **Promise:** *Customers can find you, see what you do and what it costs, and
  book without calling.* (This is the published Business Site outcome.)
- **Proof:** local; the owner, not an agency; a fixed published price; one revision
  process; and the client owns every account.
- **Call to action:** "Want me to send you a free 10-minute check of how
  customers find and book you?"

Never claim results, numbers or clients we can't show. Post rules:
`ops/marketing/BRAND_VOICE.md`.

## 5. Channels, in order of effort

1. **Direct outreach** (daily, highest intent): `leads.py campaign morning` and
   `afternoon`. Beachhead leads score first automatically.
2. **In person** (weekly): walk into two beachhead shops a week with the
   presence check already done. Barbershops and detail shops are reachable in
   person, and that is the advantage of being local.
3. **Facebook content** (five posts a week through Muse): it builds the
   recognition that makes cold outreach warm. The queue favors the focus industries.
4. **Gray Matter's own Google Business Profile**: complete it, add services
   and photos, ask every client for a review at close-out (`CLOSEOUT.md`).
5. **Referrals**: ask every launched client for one introduction to another
   owner. Shops know shops.
6. **Not yet:** paid ads, cold calling lists, directories that charge. Revisit at
   the 90-day review if outreach volume is the limit.

## 6. Weekly rhythm and targets (starting assumptions)

| Activity | Weekly target | Source |
|---|---|---|
| New beachhead leads researched and scored | 25 | `leads.py add` / `audit-lead` |
| First touches sent | 30 (6 each weekday morning) | `campaign morning` + `log` |
| Follow-ups sent | all that are due | `campaign afternoon` |
| In-person visits | 2 | `log --channel in-person` |
| Facebook posts published | 5 | Muse + `content.py mark-posted` |
| Discovery calls held | 3 | `log --outcome booked` |
| Proposals sent | 1 | status `proposal-sent` |

`python3 ops/tools/leads.py report` compares the last 7 days against these
targets. The targets live in `scoring.json`; change them there.

## 7. What to measure

| Metric | How | First read |
|---|---|---|
| Reply rate | replied ÷ first touches | Week 4 |
| Call rate | calls booked ÷ replies | Week 4 |
| Close rate | won ÷ proposals | Week 8 |
| Maintenance attach | clients on maintenance ÷ sites launched | Week 12 |
| Channel of each won client | the lead's `source` field | Every win |

If the reply rate is low, change the message and observation lines, not the
segment. If calls don't close, revisit the offer and price presentation.

## 8. First 90 days

| Weeks | Focus | Done when |
|---|---|---|
| 1–2 | **Proof and setup.** Turn two finished projects into case studies (written client permission required; `js/data.js` `caseStudies` is empty today). Complete the Gray Matter Google Business Profile. Approve the first two weeks of posts. Research the first 50 beachhead leads. | 2 case studies drafted, 50 leads scored, Muse queue approved |
| 3–6 | **Run the loop.** Morning and afternoon campaigns every weekday, two visits a week, five posts a week. | 4 weeks of activity logged; first review on 2026-12-15 |
| 7–10 | **Convert and deliver.** Quote with `engage.py`, deliver from the website kit, attach maintenance to every launch. | First beachhead client launched and on maintenance |
| 11–13 | **Review and widen.** Read the metrics. If 3+ beachhead clients have launched, open cleaning and contractors for outbound. Ask every client for a referral and a review. | 90-day review written; segments confirmed or changed |

## 9. Open decisions (owner)

1. A fixed public price for the Technology Checkup (section 3).
2. Permission to publish two case studies, and which projects.
3. Whether in-person visits fit your schedule. If not, move those two
   weekly slots to extra outreach.
