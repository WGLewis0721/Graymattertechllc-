# Caption rules for ranking

How Gray Matter captions are written so Facebook and Instagram show them to
more of the right people. Each rule says where it comes from, and how confident
we can be in it. `content.py validate` enforces the rules marked **enforced**.

## What the platforms actually say

Meta publishes how Facebook Feed ranks posts, at a high level. Its Feed AI
system predicts, for each person, things like:

- how likely they are to **scroll past** a post rather than engage with it;
- how likely they are to **click into** a post and view it full screen;
- how likely they are to **click a link** to an outside website, and how long they stay there;
- whether they have a **strong intent to interact** with the people or groups involved. [1]

Meta also **reduces distribution** of *engagement bait*: posts that explicitly
ask for votes, shares, comments, tags, likes or other reactions. Pages that do
it repeatedly are demoted more than single posts. Requests for help, advice or
recommendations are not treated as bait. [2] *Clickbait links* are demoted
too. [3]

For Instagram, the ranking signals Instagram's head has described most
recently are watch time, likes per reach and **sends per reach** (people
sharing a post privately). Captions with clear keywords help Instagram
search. These come from secondary reporting of his statements, not a
published Instagram document, so treat them as directional. [4]

Meta does not publish where the "See more" cut falls. Tool vendors observe
about **125 characters** on mobile. [5]

## The rules

| # | Rule | Why | Enforced |
|---|---|---|---|
| R1 | **Hook within 125 characters**, concrete, and complete on its own: a time, a place, a thing that happened. | It must survive the "scroll past" prediction and show before "See more". [1][5] | yes |
| R2 | **No engagement bait.** Never ask people to like, share, tag, comment, type a word or vote. | Meta demotes it, and demotes Pages that repeat it more. [2] | yes |
| R3 | **No clickbait or withheld payoffs** ("you won't believe", "the secret"). Deliver the point in the post. | Clickbait links are demoted; a post must be worth opening. [1][3] | yes |
| R4 | **One search keyword per post** (`keyword:`): the plain phrase an owner would type, such as "online booking barbershop". Its words must appear in the caption. | Captions are searchable text. Keywords help Instagram search. [4] | yes |
| R5 | **End on a real question when it fits** (`question:`): ask about their experience, not for a reaction. | Real conversations feed the "intent to interact" prediction; questions asking for advice or experiences are not bait. [1][2] | format only |
| R6 | **One useful, specific link** on Facebook (the CTA), never a teaser. | Facebook predicts link clicks and time spent on the site, so the page must deliver what the post promises. [1] | via CTAs |
| R7 | **Instagram:** no URL in the text; point to the bio link, with at most 5 hashtags. | Links in Instagram captions are not clickable. Recent reporting says hashtags matter less than keywords. [4] | yes (exporter) |
| R8 | **Always attach the image**, unchanged. Short native video beats a still once available. | Watch time is a named Instagram signal; full-screen views are a Facebook prediction. [1][4] | via Muse |
| R9 | **Reply to every comment the same day**, in full sentences. | Conversations signal intent to interact. [1] | Muse workflow |
| R10 | **Same time daily:** 11:00–13:00 or 18:00–20:00 Central. Change only on four weeks of evidence. | A consistent habit for followers. **Assumption**: confirm with page insights. | Muse workflow |

## Writing a strong post (checklist)

1. The hook names a moment the owner has lived. It is within 125 characters, with no question bait.
2. Line 2 earns the "See more" tap: the cost of the problem, in plain words.
3. The middle gives one thing to do, specific enough to do today.
4. The keyword reads naturally, not stuffed.
5. Optional: one real question, then the CTA, then 2 to 4 hashtags.

## Sources

1. Facebook Feed AI system. Meta Transparency Center. https://transparency.meta.com/features/explaining-ranking/fb-feed (accessed 2026-11-18)
2. Engagement Bait (Content Distribution Guidelines). Meta Transparency Center. https://transparency.meta.com/features/approach-to-ranking/content-distribution-guidelines/engagement-bait/ (accessed 2026-11-18)
3. Types of content we demote. Meta Transparency Center. https://transparency.meta.com/features/approach-to-ranking/types-of-content-we-demote/ (accessed 2026-11-18)
4. How the Instagram Algorithm Works: Your 2026 Guide. Buffer. https://buffer.com/library/instagram-algorithm/ ; Unpacking Instagram's Focus on Sends Per Reach. Lindsey Gamble. https://www.lindseygamble.com/blog/unpacking-instagrams-focus-on-sends-per-reach-a-timeline-why-it-matters-and-tips-for-creators-brands (secondary reporting, accessed 2026-11-18)
5. Facebook Character Limits 2026. lettercounter.org. https://lettercounter.org/blog/facebook-character-limit-guide/ (observed approximation, accessed 2026-11-18)
