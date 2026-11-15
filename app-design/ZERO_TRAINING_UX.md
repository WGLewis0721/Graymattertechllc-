# Zero-Training UX | Usable by Anyone, With No Explanation

**Purpose:** Design for people who have no time and no patience to be taught: a guest buying on a phone, a volunteer at a door while the host talks to the artist. The standard is simple and testable: **nobody should need a sentence of explanation.** Companion to [UX_REVIEW_AND_SPEC_PROTOCOL.md](UX_REVIEW_AND_SPEC_PROTOCOL.md) (Hick, Fitts, Jakob, Postel as review lenses) and [WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md) (how the budgets below are enforced).

**Origin:** Adapted from the simplification pass of the Listening Room reference build, [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25) ([lr-pay.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/site/assets/js/lr-pay.js), [lr-door.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/site/assets/js/lr-door.js), [plain-words.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/tools/qa/plain-words.js)). Labels: **[Repo]** verified in that code; **[Not tested]** not run with real users or devices.

## 1. The rule: one headline, one sentence, one button

Every screen state shows **one headline, one plain sentence and one obvious button**. Anything else goes under **More**. A screen that needs a legend, a paragraph or a second primary button is carrying a concept the user must learn; remove or merge the concept.

Show **only what matters at this moment.** A pass card in the line at the door is a big code and a name. The same card the week before is "you're in, the address appears on Thursday". The interface follows the situation, not the data model.

## 2. Run a simplification pass

List every step, gesture, label and screen the user meets. For each, ask: *can the system do this behind the button, can it be merged with the step before, is it a concept the user must be taught?* Then record before and after. The reference pass [Repo]:

| Before | After | Why |
| --- | --- | --- |
| Separate "hold seats" then "pay" | One **Pay $50.00** button; the hold happens behind it | Fewer decisions |
| Press-and-hold to reveal, plus a "can't hold?" checkbox | One tap on **Show the address**, with **Open in Maps** beside it | The gesture needed explaining |
| A four-step timeline, five buttons | One sentence, one button, the rest under More | One thing per screen |
| Entry code shown from payment onward | Appears only at the door, at the top, screen kept awake | Nothing to screenshot early; the code is the point at the door |
| An extra "door phrase" | Removed | A concept nobody asked for |
| A door screen with a "paste a code" box | One giant **Scan a guest** button, full-screen color answers, a find-by-name backup | A volunteer has ten seconds |

Be honest about trade-offs when you simplify a security feature: say what protection was given up and why it was worth it ([GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md](GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md) records one).

## 3. Budgets that tests can check [Repo]

| Budget | Value in the reference build | How it is checked |
| --- | --- | --- |
| Things to tap on a screen | 1 to 5 (the form screen 5; the other screens 1 or 2) | Count visible buttons, links, inputs and summaries |
| Technical words | None (a list: token, payload, webhook, hold, reveal, server, QR...) | Regex over the visible text of each state |
| Reading grade | 8 or lower (measured 1 to 2) | Flesch-Kincaid on visible sentences |
| First screen on a phone | The primary action fully visible in 390 by 664 (the Pay button sat at 560px) | `getBoundingClientRect` inside the viewport |
| Tap target | 44px or larger; the door's primary button 90px+ | Size audit |
| Primary actions competing | One filled button at a time | Count filled buttons |

Check the **real phone window**, not the full screen height: a mobile browser's bars take about 180px.

## 4. Operator mode (the door, the counter, the till) [Repo]

- **One giant primary action.** The page opens on it with no scrolling.
- **Answer in one word and one color, full screen:** green (let them in, with the name), yellow (already in, with the time), red (not yet, with the one thing to do). Add a short beep or vibration, because the operator is not always looking at the screen.
- **Keep the camera open between guests.** The job becomes aim, look at the color, wave through. Clear the green answer by itself after about 2.5 seconds, and ignore the *same* code for several seconds so a guest still holding the phone up does not trigger a confusing second answer.
- **A backup that needs no phone:** a name list with search, a big button per row, and one confirmation ("Is this them?") before a manual check-in. Log manual check-ins differently.
- **Set-up once:** a link that carries the key, remembered by the phone. If the device is not set up, say so in plain words and name the one fix.
- **Plain failures:** "Camera is off. Tap Allow, or use the name list." Never an error code.
- **A 15-second briefing the host can say out loud** (write it into the handoff): open the link; tap the big Scan button; green means let them in, yellow means already in, red means not yet; no phone, search the name, tap Let in, check their ID.

## 5. Copy rules

- Words a person would say aloud: "Pay $50.00", "Show the address", "Get tickets", not "Confirm reservation payload".
- State what happens next in one sentence ("Your address will appear on this card on Thu, Nov 19 at 5:00 PM").
- Errors say what to do ("Please type your name"), not what failed.
- Put the expectation where the decision is made (the form says when the secret will arrive), not only in a policy page.
- Provide a plain-language privacy page that matches what the product actually stores.

## 6. Acceptance

- [ ] Every state has one headline, one sentence and one obvious button; extras are under More.
- [ ] The budgets in section 3 are enforced by a script and pass.
- [ ] The primary action is inside a 390 by 664 first screen on every look.
- [ ] The operator screen works with the camera and without it, and gives a one-word color answer.
- [ ] A person who has never seen it completes the task with no explanation. **[Not tested]**: the reference build ran scripted checks only; run this with real people before relying on it.
