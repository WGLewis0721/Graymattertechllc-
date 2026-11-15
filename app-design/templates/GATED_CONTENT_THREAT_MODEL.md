# {{PRODUCT}} | Gated Content Threat Model

Fill before building anything that hides a value until it is earned (a location, a code, a download, a members-only drop). Guidance: [GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md](../GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md). Be specific; "secure" is not an entry.

**Status:** [[FILL]] (draft / reviewed) | **Reviewer:** [[FILL]]

## The secret
- What it is, who may see it, when, and for how long: [[FILL]]
- Where it lives (server only) and who can change it: [[FILL]]
- It must **never** appear in: the page, scripts, public config, emails, calendar files, saved images, logs, URLs, the repository: [ ] confirmed by test

## Order of events
- Chosen order (pay, earn, reveal): [[FILL]]
- What proves payment (a **signed server-to-server confirmation**, never a browser redirect): [[FILL]]
- What happens to a payment that arrives late (after a hold expired or a seat was resold): [[FILL]]

## Threats and what answers them
| Threat | Likelihood / impact | Defense | What the defense does **not** do | Test |
| --- | --- | --- | --- | --- |
| Screenshot or photo shared on social media | | Late release; short, capped reveal; watermark with name and clock | A screenshot in the window still spreads | |
| Someone enters with only the secret | | Door needs a live code **and** the name | | |
| An old picture of a code | | Rotating code, one use | | |
| UI bypassed, server called directly (too early, wrong token, over the limit) | | Rules enforced in the server and database | | |
| Two buyers, one seat (race) | | Atomic hold in the database | | |
| Replayed payment confirmation | | Idempotent handling | | |
| A guest cannot show a phone | | Find-by-name with one confirmation, logged separately | A name can be claimed by someone else: operator checks ID | |
| A volunteer's phone is lost | | Rotate the staff key | | |
| Other: [[FILL]] | | | | |

## Human factors
- The tap, window and view limit chosen and why (state what protection was given up for usability): [[FILL]]
- The operator's answer screen (one word, one color) and the backup without a phone: [[FILL]]
- The 15-second briefing the host will say aloud: [[FILL]]

## Demo versus live
- Where all demo secrets and the stand-in venue live (one file): [[FILL]]
- Removed before real sales: [ ]
- Disclosure text for the stand-in: [[FILL]]

## Verified and not verified
- Browser tests with secret-absent assertions at every state: [[FILL]]
- Database tests with concurrency, roles and caps: [[FILL]]
- Processor sandbox run and signature check: [[FILL]] (**[Not tested]** until done)
- Real devices, deployed server, email delivery: [[FILL]]
