# QA Checklist: {{project_name}}

*Serves process stage 7: Confirm It Works, completed before anything is shown to the client.*

Project: {{project_name}}
Date: {{date}}
Tester: ______________________
Build or URL tested: ______________________

**Rules:** Mark Pass only after you have tested the item yourself. Mark Fail and note what happened. Never tick an untested item. Mark N/A only with a specific reason.

## Devices and layout

| # | Check | Result | Evidence or notes |
|---|---|---|---|
| 1 | Phone width: no horizontal scrolling, a 16px side gutter, nothing clipped or overlapping | [ ] Pass [ ] Fail | |
| 2 | Desktop or laptop width, in at least two current browsers | [ ] Pass [ ] Fail | |
| 3 | Text is readable and buttons are easy to tap on a phone | [ ] Pass [ ] Fail | |

## Links, forms, and automations

| # | Check | Result | Evidence or notes |
|---|---|---|---|
| 4 | Every link works (internal and external), tested by clicking it | [ ] Pass [ ] Fail | |
| 5 | Every form is submitted with a real test record, and the record arrives where it should | [ ] Pass [ ] Fail | |
| 6 | Every automation (email, booking, reminder, sync) runs from trigger to result with a test record | [ ] Pass [ ] Fail | |
| 7 | Test records are removed or clearly labeled, and each one is listed in the evidence | [ ] Pass [ ] Fail | |
| 8 | A bad input or a failure shows a clear message, not a blank page | [ ] Pass [ ] Fail | |

## Access

| # | Check | Result | Evidence or notes |
|---|---|---|---|
| 9 | Every account and user with access is listed, and anyone not needed is removed | [ ] Pass [ ] Fail | |
| 10 | Gray Matter access was granted by invite or delegate; no passwords were sent by text or email | [ ] Pass [ ] Fail | |
| 11 | The client's own email is the owner of each account (domain, hosting, email, website platform, payments) | [ ] Pass [ ] Fail | |
| 12 | Recovery methods are set and under the client's control | [ ] Pass [ ] Fail | |

## Backups and recovery (where relevant)

| # | Check | Result | Evidence or notes |
|---|---|---|---|
| 13 | Backups are enabled, and a test restore has been completed | [ ] Pass [ ] Fail [ ] N/A | |
| 14 | Recovery steps are written in the handoff packet | [ ] Pass [ ] Fail [ ] N/A | |

## Content and quality

| # | Check | Result | Evidence or notes |
|---|---|---|---|
| 15 | No placeholder text left. Search for "lorem", "TODO", "{{", "example.com", "xxx" | [ ] Pass [ ] Fail | |
| 16 | Names, contact details, and prices match the signed quote | [ ] Pass [ ] Fail | |
| 17 | The client has confirmed rights to every image, font, and asset used | [ ] Pass [ ] Fail | |
| 18 | Pages and content match the agreed scope, with nothing extra and nothing missing | [ ] Pass [ ] Fail | |

## Evidence

| # | Check | Result | Evidence or notes |
|---|---|---|---|
| 19 | Screenshots of phone and desktop views, with date and device | [ ] Pass [ ] Fail | |
| 20 | Test records for each form and automation, with date and result | [ ] Pass [ ] Fail | |
| 21 | Every failure is logged with the fix applied and the retest result | [ ] Pass [ ] Fail | |

## Sign-off

Verdict: **PASS / FAIL** (Pass only if every applicable item passes)

Blocking issues:

Known limitations:

Reviewer name and date:

A passing checklist shows the work functions as tested. It does not guarantee search rankings, uptime, or business results.
