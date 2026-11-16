# Gray Matter content rules

Voice: a capable neighbor who fixes technology for a living. Plain words, short
sentences, the customer's own phrasing ("I keep doing the same tasks over and
over"). Tagline family: *Tell us what needs to change. We figure out the
technology.* / *Grow. Save. Protect. Get it handled.*

Audience: owners of small businesses in Montgomery, Alabama and remote clients:
barbers and salons, detailers, contractors, real estate, appointment businesses,
solo founders, food trucks, cleaning services, professional services.

## Every post must

1. Open with a specific moment the owner recognizes (a Saturday no-show, a
   quote request found Monday morning, the laptop that holds every contract).
   Not a claim about "businesses today".
2. Name one problem and one plain outcome. One idea per post.
3. Be usable on its own: the reader learns or can do something even if they
   never click.
4. End with exactly one call to action from `data/ctas.json`.
5. Stay inside the facts: services and wording from `js/data.js` and the
   service pages; prices only from `pricing.html`.

## Never

- Invent statistics, percentages, client names, testimonials, results,
  timelines or prices. A number appears only if a research brief cites its
  source, and never a `%` in a post body.
- Use filler: "in today's digital world", "game-changer", "unlock", "leverage",
  "seamless", "cutting-edge", "revolutionize", "next level", "digital
  landscape", "are you tired of", "look no further", "it's no secret",
  "elevate", "supercharge", "robust", "empower".
- Stack hashtags (max 4) or emoji (max 2).
- Promise outcomes ("double your bookings"). Describe what changes instead.
- Repeat a hook, an opening scene or a structure already in `posts/`.
  `python3 ops/tools/content.py validate` rejects near-duplicates.

## Formats

`scenario` a short story of one owner-type moment · `checklist` 3 to 5 things to
check yourself today · `question` one honest question plus why it matters ·
`myth` a belief and what is actually true · `before-after` the same task before
and after · `tip` one thing to do in ten minutes.
