# Edition System | Same Quality Every Time, Different Every Time

**Purpose:** For anything that recurs (a monthly event, a weekly drop, a campaign series, a roster of artists or clients) the design problem is consistency of *quality* with variety of *feel*. Split the product into a **frame** that never changes and a **skin** that changes per edition, keep the per-edition data in **one config file**, and turn the quality bar into **numbers that tests enforce**. Also covers the **client concept-review site** used to let a client choose between looks.

**Origin:** Adapted from the Listening Room reference build (fictional DJ listening-party site), [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25): five skins, one frame, one config file per night. Labels: **[Repo]** verified in that code; **[Rec]** recommendation. The reference build's names, palettes and copy are not library content.

## 1. Frame versus skin [Repo]

| | Frame (identical every edition) | Skin (changes per edition) |
| --- | --- | --- |
| Structure | Page skeleton, number and order of beats, scroll length | Which motif or imagery fills it |
| Components | Ticket / card anatomy, buttons, scrubber, forms | Palette, accent, display face and weight |
| Type roles | Body face and label face, minimum sizes | The display face and its treatment (case, weight, style) |
| Layout | Grid, margins, glass panels behind data | Heading scale for a wide or narrow face |
| Motion | Scrubbed, intro under 2 seconds, nothing flashes, Reduce Motion fallback | The easing feel (a slow ease versus a hard one) |
| Copy | Order: eyebrow, name, tagline, statement, set, room, closing | Voice: a film has acts, a funk night has hours |
| Texture | None | Grain amount |

The frame is why every edition is the same quality. The skin is why each feels like its own. **When a new edition needs a frame change, change the frame for all editions or do not do it.**

## 2. One config file per edition [Rec, Repo]

Everything an operator edits lives in one file (a plain object loaded by the page): identity, tagline, statement, schedule or set list with an `energy` value per slot, event facts (date, doors, price, capacity), room points, closing copy, theme (motif, fonts, five colors, easing, grain) and payment mode.

- **Only public facts go in it.** Anything in a static config is public. Secrets, private addresses and keys live elsewhere (see [GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md](GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md)).
- **No invented numbers.** `seatsLeft: null` means "show no count". Wire it to real inventory or leave it off.
- Keep configuration and behavior apart: the engine owns no copy.
- A new edition is a **copy of an existing edition folder** with a different config. Entry pages never change.

## 3. Turn the quality bar into numbers

Every skin must pass the guardrails; a skin that fails does not ship [Repo]:

| Pair | Minimum |
| --- | --- |
| Ink on the page background | 7 : 1 |
| Muted text on the page background | 4.5 : 1 |
| Accent on the page background | 4.5 : 1 |
| Text on an accent-filled button | 4.5 : 1 |
| Text over live art | 4.5 : 1 body, 3 : 1 at 24px or larger, measured on the brightest 5% of pixels (see [IMMERSIVE_SCROLL_HERO_SITES.md](IMMERSIVE_SCROLL_HERO_SITES.md)) |
| Label size | 12px or larger |
| Tap target | 44px or larger |

**Generate the brand board from the real configs**, not by hand: render every edition's palette, type, live contrast rows and cards from the same files the site loads. A board that is generated cannot drift from the product. Pair it with the library's [BRAND_BOARD template](templates/BRAND_BOARD.md); the board is the proof, the template is the record.

## 4. Producing a new edition (about 15 minutes once the copy exists) [Repo]

1. Copy an existing edition folder; rename it. Do not touch the entry pages.
2. Fill the config: identity, tagline, statement, schedule with `energy`, event facts, payment mode. Fill [templates/EDITION_BRIEF.md](templates/EDITION_BRIEF.md) first if the facts are not yet approved.
3. Pick a motif, a display face and five colors. Open the generated board and make every contrast row pass.
4. Add the edition to the audit page lists ([WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md)).
5. Screenshot at phone (390 wide) and desktop (1440 wide); run the audit and the pay-flow check once.
6. Deploy. The deploy gate ([STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md](STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md)) confirms nothing regressed.

## 5. The client concept-review site [Repo]

When a client must choose between looks, do not send five links and a PDF. One page, four moves:

1. **Explore.** Live previews of every concept in one page (laptop or phone frame), with a **skin switcher that swaps the edition in place and keeps the scroll position**, so each look is judged at the same moment of the story. Keyboard: arrows, or 1 to 5. Build this on `mount()`/`destroy()`.
2. **Generate the deliverable.** A button per concept, and one for all, that produces the customer-facing artifact (for example the ticket card) in that style, from a name typed once.
3. **Pick.** A favorite, a second choice and a note, with Copy, Email and Share. **Nothing is sent anywhere**: the pick lives in the browser and in the message the client copies. If you pre-address the email button, you are publishing that address in the page source; leave it empty in a public repo and tell the client where to reply.
4. **Say what is demo.** Mark every fictional name, simulated checkout and stand-in venue plainly (banner and footer). Tell the client what any floating demo control does (for example a clock that jumps time).

Before sending, ask the three questions in the [client message](#6-the-client-message): is it live on their phone, do they know it is a demo, and how does their pick reach you.

## 6. The client message [Rec]

> Subject: Pick the look for **[project]** (5 minutes)
>
> I built five different looks. A phone or a laptop both work: **[link to the review page]**
> 1. Scroll inside each preview; the buttons at the top switch looks without losing your place.
> 2. Press Generate on the customer cards.
> 3. Choose a favorite and a second choice; copy it and reply to this message.
>
> This is a demo: made-up names, no real payments, nothing you click is sent to me until you reply. What I most want to know: which one feels like your room, and anything that made you stop and wonder what to do.

## 7. Public repository rule [Repo]

If the repository is public, use **fictional names only**. Keep real-artist or real-client reference notes in a private bundle. Enforce it mechanically: the deploy gate scans published files for a forbidden-name list and fails the build ([STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md](STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md)). The gate covers published output only; check the repository root and uploaded archives by hand, because an early upload there can carry real names in file names.

## 8. Acceptance

- [ ] Frame and skin are separated; a skin change needs no frame code change.
- [ ] One config per edition, public facts only, no invented numbers.
- [ ] Guardrail table passes for every edition, from tests, not opinion.
- [ ] The brand board is generated from the real configs.
- [ ] A new edition was produced by copy-and-edit and passed the audit.
- [ ] The review page keeps scroll position across switches and sends nothing anywhere.
- [ ] Demo content is labeled; no real names in a public repo.
