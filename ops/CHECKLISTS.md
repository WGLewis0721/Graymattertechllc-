# Gray Matter operating checklists

The fixed rhythm for running Gray Matter from your phone and laptop. Times are
Central. Targets come from `ops/GTM.md` §6 and are starting assumptions until
the first review on **2026-12-15**.

**How to use:** quoted lines ("…") are what you say to Claude. 📱 = phone, 💻 = laptop.
Nothing contacts a lead automatically. You send every message.

| Rhythm | When | Time | Where |
|---|---|---|---|
| Daily | Mon–Fri | about 75 min in 4 blocks | 📱 |
| Shop visits | Tue + Thu | 60 min | 📱 in person |
| Weekly | Friday 3:00 pm | 30 min | 💻 |
| Bi-weekly | Every other Friday 3:30 pm (starting Dec 4) | 30 min | 💻 |
| Monthly | First Monday 9:00 am (starting Dec 7) | 60 min | 💻 |

---

## Daily (Mon–Fri)

### 8:30 am · Morning outreach (30 min) 📱
- [ ] "Run the morning campaign." The batch lands in Drive: *Ops Lead Data / campaigns/*
- [ ] Read each message. Fix anything not true for that business.
- [ ] Send each one yourself from Gmail or Messenger (target: **6 a day**)
- [ ] "Log L00xx, L00yy as sent by email" (or by Facebook DM)

### 12:30 pm · Social (10 min) 📱
- [ ] Check that Muse posted today's Facebook + Instagram post
- [ ] Reply to every comment and DM in full sentences. Ask ChatGPT for help with any tricky reply.
- [ ] A DM that sounds like a lead? "Add [business], [what they said], from Facebook DM."

### 1:30 pm · Follow-ups and calls (30 min) 📱
- [ ] "Run the afternoon campaign."
- [ ] Send due follow-ups. Make the calls (`call-opener` script).
- [ ] Log every outcome: sent, called, voicemail, replied, booked, declined, or stop
- [ ] Anyone said "stop"? "Log L00xx as stop." They go on the do-not-contact list for good.

### 5:00 pm · Close the day (5 min) 📱
- [ ] Answer replies that came in. Book calls into your calendar.
- [ ] Anything owed to a client today? Done, or moved with a message to them.
- [ ] Quick pipeline check: "Who replied today?"

### Tue + Thu · Shop visits (60 min) 📱
- [ ] Before leaving: "Presence check for [shop] at [website/Facebook]."
- [ ] Visit 1 barbershop or detail shop. Bring the five-line presence check, offer it free.
- [ ] "Log L00xx in-person: [what happened]." (target: **2 visits a week**)

### Any day · Client work 💻
- [ ] Open the client folder in Drive *(Ops Client Folders / client)*. Work the next unchecked line in `KIT_CHECKLIST.md`.
- [ ] New yes? "Quote [lead] for [kit]." Then "Deposit invoice for [client]." Send both yourself.

---

## Weekly (Friday 3:00 pm, 30 min) 💻

Say: **"Weekly review."** Then work through:

- [ ] **Pipeline vs targets**, from `leads.py report`. Write down any number that is short.
  - [ ] 25 new beachhead leads added
  - [ ] 30 first touches
  - [ ] 2 visits
  - [ ] 3 calls booked
  - [ ] 1 proposal sent
- [ ] **Next week's leads.** Find and add enough to reach 25 (Google Maps: "barber Montgomery AL", "mobile detailing Prattville").
- [ ] **Content**
  - [ ] Log what Muse posted this week ("Mark these posted: …" with the post links)
  - [ ] Approve the next 7 days of posts. Fix or skip any you don't like.
  - [ ] "Export the Muse queue starting Monday and update Drive."
- [ ] **Money in:** every invoice sent? Any deposit unpaid more than 7 days? Send a reminder.
- [ ] **Client work:** every active client has a next step and a date.
- [ ] **Plan next week:** block the daily times, visit days, and any client build time.

---

## Bi-weekly (every other Friday 3:30 pm, 30 min) 💻

- [ ] **Clean the pipeline**
  - [ ] Leads with no reply after 4 touches move to nurture
  - [ ] Dead leads move to lost
  - [ ] Merge any duplicates
- [ ] **What's working?**
  - [ ] Look at the replies: which opening line, segment and channel got answers?
  - [ ] Tell Claude, and adjust the outreach observation lines
- [ ] **Content refill**
  - [ ] Fewer than 14 approved posts waiting? "Write 10 new posts for barbers and detailers."
  - [ ] Add any good ChatGPT drafts: "Add this as a post."
- [ ] **Proof**
  - [ ] Any project finished? Ask the client for a Google review and, in writing, permission for a case study
  - [ ] "Add [client] as a case study" once you have that permission
- [ ] **Referrals:** ask every launched client: "Who's one other owner I should talk to?"
- [ ] **Gray Matter's own Google Business Profile:**
  - [ ] Post one update
  - [ ] Answer any reviews or questions

---

## Monthly (first Monday 9:00 am, 60 min) 💻

- [ ] **Scorecard** (write it in one line per item):
  - [ ] Leads added
  - [ ] First touches
  - [ ] Reply rate
  - [ ] Calls booked
  - [ ] Proposals sent
  - [ ] Won
  - [ ] Revenue collected
  - [ ] Maintenance clients
- [ ] **Decide one change** (GTM §7):
  - Low replies? Change the message, not the segment.
  - Calls but no closes? Change how the offer and price are presented.
  - Hitting targets? Raise them.
- [ ] **Maintenance clients:** run each one's monthly care, send a short "what we did" note, and invoice.
- [ ] **Money:** match payments to invoices. Set aside the tax share your accountant recommends. Review Gray Matter's own subscriptions and cancel unused ones.
- [ ] **Security and backups** (do for yourself what you sell):
  - [ ] Review who has access to Gray Matter LLC in Drive. Remove anything not needed (e.g. old service accounts).
  - [ ] Two-step sign-in on in email, Facebook, Instagram, GitHub, Square/bank
  - [ ] Restore one file from backup to prove backups work
- [ ] **Systems**
  - [ ] "Run the ops checks and mirror the ops folder to Drive."
  - [ ] Confirm Muse is still connected
  - [ ] Confirm the Instagram bio link still works
- [ ] **Website**
  - [ ] Click through pricing, contact form, and the plan builder on your phone
  - [ ] Update the portfolio if new work was approved
- [ ] **Look ahead:** pick next month's one focus (from the GTM 90-day plan) and put the visit days on the calendar

---

## 90-day review (Mon Feb 15, 2027; then every quarter)
- [ ] Read `GTM.md` §8. Did we reach 3 launched clients in the beachhead?
- [ ] If yes, open cleaning services and contractors for outreach. If no, find what is stuck (leads, replies, calls, closes) and fix that first.
- [ ] Update the targets in `ops/leads/scoring.json` with the real numbers.
