---
id: backup-recovery
name: Backup and Recovery Starter Kit
service: backup-recovery
---

## Who it is for

"Everything important lives on one computer."

Typical client: customer records, contracts, photos, and accounting files sit on one laptop or desktop. If that device fails, is stolen, or a file is deleted, nobody can get it back.

## Fit check

1. Which computers and phones hold business files, and which of them is the one that cannot be lost? (Sets scope.)
2. Roughly how much data is important: a few gigabytes of documents, or many gigabytes of photos and video? (Sets storage needs.)
3. Does the client already pay for Google Drive, OneDrive, Dropbox, or iCloud storage with enough space? (Sets the cloud target.)
4. Is there an external drive the client owns, or will they buy one? (Client pays for any new drive.)
5. Can the owner name the files they would be unable to work without? (Required for the "cannot be lost" list.)
6. Who will sign in to the backup account and keep the recovery email current? (Required for handoff.)
7. Is the owner willing to schedule a quarterly restore check? (Required for the ongoing rule.)

**Disqualifier:** the client will not give us a list of what matters, or wants the backup kept only on the same device it protects. A backup on the same disk is not a backup, and we do not sign off on one.

Tier: the Backup and Recovery service is quoted per engagement after this fit check.

## Scope included

- A "cannot be lost" list written by the owner: each folder or account, its location, and its owner, on `RESTORE_TEST_LOG.md`.
- A 3-2-1 explanation in plain language, given to the owner in writing: 3 copies of important data, on 2 different kinds of storage, with 1 copy off-site.
- Automatic backup of the important folders to the client’s cloud account, with a second copy on an external drive where the client owns one.
- Version history turned on, with the number of days of versions recorded.
- One tested restore: a real file deleted or moved on purpose, restored from backup, opened, and logged on `RESTORE_TEST_LOG.md`.
- A quarterly restore check on the calendar, with the next date written in the log.
- A one-page "if a device fails" recovery plan kept with the log.

## Scope excluded

- Replacement computers, phones, or external drives. Hardware is the client’s purchase.
- Cloud storage upgrades. The client pays for any plan above what they have.
- Backup of systems we do not have access to, such as a vendor’s hosted booking tool, unless the vendor offers an export.
- Full disaster recovery for a whole office, or a server-level recovery plan.
- Ransomware cleanup or forensic work. If an incident is suspected, stop and quote it separately.

## Client inputs

- Admin or owner sign-in on each device that holds important files.
- Access to the cloud account chosen for backup, and the recovery email for that account.
- The owner’s list of what cannot be lost, with folder names where they are known.
- An external drive, if the client owns one, or a decision to buy one.
- A calendar slot for the first restore test and the quarterly checks.

## Default stack

Prefer what the client already owns.

- Cloud backup: the client’s existing Google Drive, OneDrive, Dropbox, or iCloud. Client owns; any plan above their current one is **client pays**.
- Windows: File History to an external drive, and OneDrive folder backup for Documents, Desktop, and Pictures. Built into Windows. No extra cost.
- macOS: Time Machine to an external drive, and iCloud Drive for Documents and Desktop. Built into macOS. No extra cost.
- Version history: the built-in version history in Google Drive, OneDrive, and Dropbox. No extra cost.
- External drive (optional): client owns, or **client pays** for a new drive.
- Log and schedule: `RESTORE_TEST_LOG.md` in this kit, kept in the client’s cloud.

## Build steps

1. Sit with the owner and write the "cannot be lost" list in `RESTORE_TEST_LOG.md`, one line per folder or account, with its location.
2. Write the 3-2-1 explanation on the first page of the log, in the owner’s own words, and hand a copy to the owner.
3. Turn on automatic cloud backup for each folder on the list, using the client’s cloud account.
4. Set up the external drive backup where the client owns one: File History on Windows, Time Machine on macOS.
5. Turn on version history in the cloud account and record the number of days in the log.
6. Pick one real file on the list. Note its name and location in the log, then delete it or move it out of its folder.
7. Restore that file from the backup, open it, and check the contents match. Record the date, the source, the restore path, and the result.
8. Set a repeating calendar reminder every three months for the quarterly restore check, and record the next date in the log.
9. Write the "if a device fails" recovery plan on the last page of the log: the account to sign in to, the drive to use, and the first person to call.
10. Walk the owner through the log and the restore test. Get a yes that the list is complete.

## QA checklist

- [ ] Every folder on the "cannot be lost" list shows automatic backup turned on in the device or cloud settings.
- [ ] A real file was deleted or moved on purpose, then restored from backup, and the restored file opened without error.
- [ ] The restored file’s contents match the original, checked by opening both or comparing file size and last-modified date.
- [ ] The restore test row in `RESTORE_TEST_LOG.md` has a date, a file name, a source, a restore path, and a result.
- [ ] Version history shows at least one earlier version of a changed file in the cloud account.
- [ ] The external drive, where used, shows a completed backup in File History or Time Machine.
- [ ] The next quarterly restore date is written in the log and on the owner’s calendar.
- [ ] The backup account’s recovery email and second factor are set to the client’s own accounts.

## Handoff

- The client receives the completed `RESTORE_TEST_LOG.md`, the 3-2-1 explanation, the recovery plan, and a short screen walkthrough of how to restore a file.
- The client owns the cloud account, the external drive, and every backup setting. Gray Matter keeps no passwords after handoff, and any setup login is removed before the handoff call ends, as set out in `agreement.html`.
- Show the owner how to restore one file from version history and from the backup tool.

## Maintenance option

Ongoing care is not part of this kit. Quote it after the fit check. For quarterly restore checks run by Gray Matter, offer `technology-partner` as the ongoing option, priced per engagement.
