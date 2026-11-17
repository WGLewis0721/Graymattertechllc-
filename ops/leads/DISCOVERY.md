# Lead discovery

Goal: a short list of businesses with a **concrete, visible problem** Gray
Matter solves. A lead is not worth contacting until its `problem` field holds
one specific sentence, and the scoring will not rank it A or B without one.

## Where to look (free, public)

| Source | Search | Look for |
|---|---|---|
| Google Maps | "<industry> Montgomery AL", "<industry> Prattville" | No website link, or the website link is Facebook. Reviews mentioning "couldn't reach", "never called back", "hard to book". |
| Facebook | Local business pages and community groups | Orders taken in comments or DMs, "message to book", hours posted only as images. |
| Business websites | `leads.py audit <url>` | No HTTPS, no mobile layout, old copyright, no booking link. |
| Montgomery Area Chamber of Commerce directory | Members by category | New members (growing), contact names. |
| Local news and "now open" posts | New openings, expansions, hiring | Growth moments: setting up accounts, files and access right. |
| Your own network and past clients | Referrals | Always tier the referral; still record the problem. |

**Start with the beachhead in `ops/GTM.md`: barbers and salons, and detailers.** Those leads score highest automatically.

Industries with a page and starter kit (`served_industry` bonus): barbers and
salons, detailers, contractors, real estate, appointment businesses, solo
founders, food trucks, cleaning services, professional services.

## What to capture per lead

`business`, `industry`, `city`, the `website` or `facebook` link, a
`contact_name` when public, and one `evidence` note quoting what you saw (a
review line, a missing link). Then write the `problem` in the owner's words:
"Customers can only book by calling, and calls go unanswered during jobs."

## Rules

- Public business information only. Do not scrape sites against their terms, buy
  lists, or collect personal home details.
- Email must identify Gray Matter, include the business address (Montgomery,
  Alabama), and offer a working opt-out. All templates do. Honor "stop" at
  once: `leads.py log <id> --outcome stop` adds the lead to `do-not-contact.txt`.
- Contact a lead at most four times (`cadence_days`), then move it to nurture.
- Never send automated bulk messages. Every message is reviewed and sent by a person.
- Lead data stays in `$GM_LEADS_DIR`, never in this public repository.
