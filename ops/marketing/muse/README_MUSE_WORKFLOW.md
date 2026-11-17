# GRAY MATTER — MUSE SOCIAL POSTING WORKFLOW

**Status:** APPROVAL QUEUE. Contains drafts the owner has not approved. Do not publish.  
**Owner:** Gray Matter LLC. **Channel:** the Gray Matter Facebook page.  
**Captions:** `README_DAILY_CAPTIONS.md` in this folder. **Machine-readable copy:** `queue.json`.

## Purpose

Post 14 Facebook posts, one per day, in Day order. Each post pairs one caption with one approved Gray Matter image from this folder. The goal is inquiries from small-business owners through the Gray Matter website.

## Required setup

1. Confirm Muse is connected to the Gray Matter Facebook page, not a personal profile or another page.
2. Confirm every image listed below is present in this folder.
3. Confirm the start date, daily time and time zone (America/Chicago) with the owner.
4. Show the owner a preview of every post (image, caption, date) and get approval before unattended publishing. Any entry marked NOT YET APPROVED must be approved individually.

## Images used

- `gm-social-business-websites-square.png`
- `gm-social-digital-solutions-square.png`
- `gm-social-technology-checkup-square.png`
- `gm-social-workflow-automation-square.png`

## Daily workflow

1. Check the Facebook page for that day's Post ID or caption. Never double-post.
2. Use the matching image unchanged: no cropping, filters, AI edits or new logos.
3. Publish caption, then CTA paragraph, then hashtags, exactly as written.
4. Record Post ID, date and time, post URL and outcome. Report failures; do not blindly retry.
5. Send the record back so `ops/marketing/posted-log.csv` can be updated in GitHub. Posts in that log are never queued again.

## Safeguards

- Do not invent statistics, prices, client names, testimonials or results.
- Prices may only appear as written in the caption.
- Do not edit, rename or delete files in this folder. It is regenerated from GitHub.
- If a link fails to open, pause that post and report it.

## Definition of done

- 14 posts published in order, one per day, each with its matching image.
- No duplicates. A post URL recorded for every Post ID.
