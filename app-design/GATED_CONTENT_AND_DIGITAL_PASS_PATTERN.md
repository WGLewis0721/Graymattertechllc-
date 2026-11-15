# Gated Content and Digital Passes | Secret Until Earned, Useful at the Door

**Purpose:** A pattern for anything that must stay hidden until a person has earned it and must then be easy to use: event tickets, a private location, invitations, members-only drops, vouchers. It answers three questions: *what order do buy and reveal happen in*, *what can a screenshot do*, and *how does someone get through the door with no training*. Companion to [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) and [ZERO_TRAINING_UX.md](ZERO_TRAINING_UX.md).

**Origin:** Adapted from the Listening Room reference build (fictional demo), [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25): [design/SECURE-CARD-FLOW.md](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/design/SECURE-CARD-FLOW.md), [server/](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25/server). Labels: **[Repo]** verified in that code and tests; **[Not tested]** not run. **Status of the reference: browser prototype tested end to end against a simulator; server written, type-checked and database-tested; never deployed and never run against a real payment processor.**

## 1. Decide the order: pay, then earn, then reveal

Do **not** hand out the card first and charge second: a card that already holds the secret means the secret was out before any money moved. Show the card **visually** early (it builds commitment) but keep it **locked** until the processor confirms payment. Only the processor's **signed server-to-server confirmation** unlocks it. A redirect back to a success page is not proof of payment ([WEB_PLAYBOOK.md](WEB_PLAYBOOK.md)).

~~~text
1  Name + email, one Pay button      the server quietly holds the seats for a short time (30 min)
2  Pay on the processor's hosted page   card data never touches your servers
3  Signed webhook marks the order paid  idempotent; the browser's return is not trusted
4  The card shows the area only          "You're in" and when the exact place appears
5  At the release time (T-3h)           one tap shows the exact place, briefly, watermarked, with a maps link
6  At doors                              a rotating entry code appears at the top of the card
7  The door scans the code and checks the name; find-by-name is the backup
~~~

## 2. Be honest about screenshots

**The web cannot block a screenshot or a photo of a screen.** So design the leak to be **late, traceable, short-lived and not enough to get in**:

| Defense | What it does | What it does not do |
| --- | --- | --- |
| Late release | The secret exists on the card for hours, not weeks | A leak in the window still spreads |
| Server-gated | The secret is never in the page, scripts, config, email, calendar file or card image until the server releases it | Cannot hide it from the person it is shown to |
| Tap to show, then hide | Shown for a short window (45s), hides on its own and when the person leaves the page; capped views (5); a maps link means nobody needs to read or copy it | Does not stop a screenshot inside the window |
| Live watermark | Name, reference and a ticking clock tiled over it | Makes sharing attributable, not impossible |
| Code only at the door | The entry code does not exist on the card until the door window opens, then rotates and works once | A screenshot of the secret is still the secret |
| The door checks two things | A valid live code **and** the name on the screen | Knowing the secret alone gets nobody in |
| Secret-free exports | The saved card picture and the calendar file carry the area only | The live card can still be screenshotted |

Policy matters as much as pixels: say in the terms that cards are personal, that reveals are logged, and what happens on a leak. For a small, friends-of-friends room, a traceable leak is the strongest deterrent.

### Human factors that changed the design [Repo]

- **Press-and-hold to reveal was removed.** It had to be explained and added almost nothing against a screenshot. One tap is enough.
- **The view limit went from 3 views of 20 seconds to 5 of 45.** A lost guest with no views left is a phone call the host cannot take on the night. Make the limit a per-event setting.
- **The entry code appears only at doors, at the top of the card**, and the screen is asked to stay awake (`navigator.wakeLock`, implemented but **[Not tested]**: a headless browser cannot show it) so it does not dim in a queue. Before then there is nothing to screenshot.
- **A "door phrase" and a four-step timeline were removed** as extra concepts to explain.

## 3. The state table (what each state shows and what the server may give out)

| State | Shows | One button | Server gives out |
| --- | --- | --- | --- |
| Reserve | Facts, price, when the secret appears | Pay | Nothing secret |
| Saved, unpaid | Countdown | Pay (and a small Cancel) | Nothing secret |
| Checking | Spinner | none | Nothing |
| Paid, before release | The area and when the secret appears | Add to calendar | The area; refuses the secret |
| Ready | "Your address is ready" | Show the address | The secret, once per tap, up to the cap |
| Doors | The live code, large, at the top | none | The code |
| Checked in | "You're checked in at 8:07" | none | Nothing more |
| Expired or cancelled | Seats given back | Start over | Nothing |

## 4. Server design [Repo]

- **Database:** row-level security on every table with **no policies**, so the browser's roles can read and call nothing. Money-adjacent rules live in `SECURITY DEFINER` functions granted to the service role only (hold seats, mark paid, record a reveal, check in).
- **No oversell:** seat holds are atomic. Tested with 8 parallel buyers for 1 seat: exactly 1 succeeds.
- **Idempotent payment:** replaying the same confirmation changes nothing. A confirmation for a hold that expired **and** whose seat was resold is flagged `paid_review` for a human refund, not honored.
- **Atomic caps:** the reveal count is enforced in the database. Tested with 6 parallel reveals against a cap of 5: exactly 5 granted.
- **One check-in per ticket**, whether scanned or picked by name; a name check-in is logged as such so you can see afterward who was let in by hand.
- **Reveal log** stores a salted hash of the IP address, not the address.
- **The rotating code:** `<version>.<reference>.<step>.<code>` where the code is an HMAC of reference and a 30-second step, accepted for the current step plus or minus one. Old pictures fail as "expired" and a made-up code fails as "forged".
- **Shared logic:** the rules (code, schedule, reveal gate, signature check, tokens) live in **one file that the browser prototype and the server both run**, synced by a script and guarded by a byte-equality test, so the prototype and production cannot disagree.
- **Never trust the UI:** test the server directly for early, wrong-token and over-limit requests.
- **Processor webhook signature:** the code signs the notification URL plus the raw body, as third-party guides describe. The processor's own page did not spell out the order. **[Not tested]** against a real sandbox: verify with the processor's SDK helper before any real money.

## 5. Demo mode versus live mode

Build the whole experience against a **simulator** first so it can be reviewed without a backend: the "database" is browser storage, the processor page is a labeled stand-in, a demo clock jumps to "release" and "doors". Keep **all** demo secrets and the stand-in venue in **one file**, and remove that file and the demo clock before any real ticket. Mark the demo plainly (banner, footer) and use a real public place as a stand-in only with a disclosure that it is not affiliated.

## 6. The door [Repo]

A volunteer has ten seconds and no training ([ZERO_TRAINING_UX.md](ZERO_TRAINING_UX.md)): one huge **Scan** button; the camera stays open between guests; a full-screen answer in one word and one color; find-by-name as the backup. Staff get a link that carries the key once (`door#key=...`); the phone remembers it and the key leaves the address bar. Cut someone off by rotating the key.

## 7. Tests that belong to this pattern

- Unit tests of the shared logic (code, schedule, gate, signature, tokens, file equality).
- Database tests on a real database with concurrency (holds, expiry, idempotency, resold-seat flag, atomic caps, one check-in, anonymous roles cannot read or call anything).
- Type-check the server functions.
- Browser tests of the whole journey with **secret-absent** assertions at every state (before anything, while saved, after payment, after hiding, after the views are used, after a reload, in the saved picture and the calendar file) and direct-API refusals ([WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md)).
- A fake-camera test of the door.

## 8. Acceptance and open items

- [ ] The secret is absent from every public file and from the page until released.
- [ ] Only the signed confirmation unlocks; the redirect does not.
- [ ] The server refuses forbidden requests even if the UI is bypassed.
- [ ] Concurrency tests pass on a real database.
- [ ] The door works with the camera and without it.
- [ ] Demo secrets and the stand-in venue are removed before real sales.
- [ ] **[Not tested in the reference build]:** a deployed server, a real processor sandbox, email delivery, real phones, the platform's built-in QR detector, screen readers.

Template: [templates/GATED_CONTENT_THREAT_MODEL.md](templates/GATED_CONTENT_THREAT_MODEL.md).
