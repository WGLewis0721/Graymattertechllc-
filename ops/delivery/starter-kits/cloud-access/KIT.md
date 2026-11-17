---
id: cloud-access
name: Cloud Access Starter Kit
service: work-from-anywhere
---

## Who it is for

"My business only works from one computer."

Typical client: the files, email, and tools live on one office computer. Work stops when that person is out, and staff email attachments back and forth to get things done.

## Fit check

1. Does the client already pay for Google Workspace, Microsoft 365, or Dropbox? (If yes, we use it. If no, the client chooses one and pays for it.)
2. Which computer holds the files that matter, and roughly how many gigabytes are they? (Sets the move time.)
3. How many people need access to the same files, and do they need different folders? (Sets the folder map.)
4. Which devices do people use away from the office: laptops, phones, tablets? (Sets setup scope.)
5. Can the owner name who should and should not see each folder? (Required for the folder map.)
6. Is the business email on the same provider as the files? (Affects how sharing and sign-in are set up.)
7. Is there a staff member who will be the day-to-day admin after handoff? (Needed for offboarding.)

**Disqualifier:** the client wants everyone to share one login, or wants the files moved to a service nobody on the team will sign in to. We do not set up shared logins.

Tier: the Work From Anywhere service is quoted per engagement after this fit check.

## Scope included

- Inventory of the files and folders to move, written on `FOLDER_MAP.md`.
- Move of the agreed files from the current computer into the client’s existing cloud account, with a file count and size check after each move.
- Shared folders created by role (for example Office, Field, Accounting), with access granted to groups instead of single people.
- Sign-in protected by multi-factor authentication for every user.
- Access set up on the owner’s laptop and phone, and on up to three staff devices, as agreed.
- A written list of what should not be reached remotely (for example payroll or bank files), and how that is enforced.
- Offboarding steps written for the client’s admin, and a dry run of removing one test user.

## Scope excluded

- New computers, phones, or tablets. Hardware is the client’s purchase.
- Cloud storage or software subscriptions. The client keeps paying its own provider.
- Backup of the files. Covered by the Backup and Recovery kit.
- Business-specific software installs or line-of-business app migrations.
- Custom VPN or remote desktop servers. If a client needs one, it is quoted separately.

## Client inputs

- Admin access to the chosen cloud account (Google Workspace, Microsoft 365, or Dropbox), or the owner present to sign in.
- Current file locations, and the list of folders the team needs.
- Names, roles, and devices for every person who will sign in.
- Decision on which folders are restricted and which role may see them.
- Access to the current computer for the move, with the owner present.
- A named day-to-day admin for the account after handoff.

## Default stack

- File storage and sharing: Google Workspace (Drive) or Microsoft 365 (OneDrive and SharePoint), whichever the client owns. If they own Dropbox, use Dropbox. **Client pays** for any seat or plan above what they already have.
- Multi-factor sign-in: the provider’s built-in setting. No extra cost.
- Phone and laptop sync: the provider’s own desktop and mobile app (Drive for desktop, OneDrive, or Dropbox). No cost.
- Folder map: `FOLDER_MAP.md` in this kit, kept in the client’s cloud.
- Moves: the provider’s built-in upload or sync client. No third-party tool is needed.

## Build steps

1. Confirm which cloud service the client already owns and who holds its admin role.
2. Copy `FOLDER_MAP.md` into the client’s cloud and fill in the current location of every folder to be moved.
3. Agree the role groups with the owner (for example Office, Field, Accounting) and create one group per role in the cloud admin console.
4. Create one shared folder per role, grant the group access, and grant the owner full control.
5. Turn on multi-factor sign-in for the admin account first, then for every user, and record each user as Yes in the folder map.
6. Move the agreed files into the shared folders. Count the files at the source and the destination, and write both numbers in the folder map.
7. Install the provider’s sync app on the owner’s laptop and phone. Sign in and open one file from each device.
8. Install the sync app on each staff device agreed in scope. Open one file from each device.
9. Restrict the folders listed as not remote-accessible, and test that a non-owner user cannot open one.
10. Write the offboarding steps on the last page of `FOLDER_MAP.md`, then run them once on a test user and remove that test user.
11. Walk the admin through the folder map and the offboarding steps. Get a yes on the access list.

## QA checklist

- [ ] The file count in each shared folder matches the count recorded at the source for every folder moved.
- [ ] A file opened from the owner’s phone matches the same file on the owner’s laptop.
- [ ] A test user in the Field group can open the Field folder and cannot open the Accounting folder.
- [ ] Sign-in for every user asks for a second factor on a fresh browser.
- [ ] The restricted folders listed in the folder map are refused to a non-owner user.
- [ ] A test user was added to a group, given access, removed from the group, and a file open attempt was refused.
- [ ] The offboarding steps on `FOLDER_MAP.md` were run once on the test user and each step is ticked.
- [ ] The admin account has a second factor on and the admin’s name is written in the folder map.
- [ ] No shared login is used for any user in the folder map.

## Handoff

- The client receives the completed `FOLDER_MAP.md`, the list of users and groups, the offboarding steps, and a short screen walkthrough.
- The client owns the cloud account, the admin role, and every user account. Gray Matter keeps no passwords after handoff, and any setup login is removed before the handoff call ends, as set out in `agreement.html`.
- Show the admin how to add a user, add them to a group, and remove them.

## Maintenance option

Ongoing care is not part of this kit. Quote it after the fit check. For ongoing user changes, device setup, and sign-in help, offer `technology-partner` as the ongoing option, priced per engagement.
