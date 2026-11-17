---
id: business-security
name: Business Security Starter Kit
service: business-security
---

## Who it is for

"I’m not sure who still has access to my business."

Typical client: a small business where former staff, vendors, or a shared login still reach email, banking, the domain, social pages, or payment tools. Nobody is sure who set up which account or where the recovery email points.

## Fit check

1. Does the owner own the business email domain and its registrar account, or can they get admin access to both? (Required. Without it we cannot change recovery settings.)
2. Roughly how many people and outside vendors touch the business accounts today? (Sets the time estimate for the access review.)
3. Which accounts matter most: email, bank, payment tools, website host, domain, social pages? (Sets the order of work.)
4. Do staff share any logins today? (Confirms the password manager rollout is needed.)
5. Is the owner able to decide who keeps access, and remove people who should not have it? (Required for the access review.)
6. Does the business have company-owned devices, or do staff use personal phones and laptops for work? (Sets device scope.)
7. Will the client pay for a password manager plan if the free tier does not cover their needs? (Confirms the paid tool choice.)

**Disqualifier:** the owner will not approve removing any access, or wants us to keep the passwords after handoff. We do not take the job on those terms.

Tier: the Business Security service is quoted per engagement after this fit check. Confirm scope in writing before any account is changed.

## Scope included

- Account and access inventory on `ACCESS_INVENTORY.md`, one row per system, with owner, admins, MFA status, recovery method, and last-reviewed date.
- Removal list for former employees and vendors, approved by the owner, with each removal recorded in the inventory.
- Password manager rollout: one business vault, owned by the client, with each shared login moved into it and the old shared password changed.
- Multi-factor sign-in turned on for email, banking, domain registrar, social pages, and payment tools, or a written note where a system cannot do it.
- Email protection check on the domain: SPF, DKIM, and DMARC records looked up and written up in plain English, with changes made only with the owner’s approval.
- Device basics on each covered computer and phone: operating system updates on, automatic screen lock set, disk encryption on.
- A one-page "If something looks wrong" response card, given to the owner and posted where staff can see it.

## Scope excluded

- Monitoring, managed antivirus, or a security service that runs after handoff (quoted separately as ongoing support through `technology-partner`).
- Forensic investigation of a past breach. If one is suspected, stop and handle it as a separate quote.
- Writing or editing company policies, employment agreements, or HR procedures.
- Buying hardware, or replacing devices that cannot run current updates.
- Any paid tool subscription. The client pays the password manager plan directly.

## Client inputs

- Owner-level admin access to the business email, domain registrar, bank portal, payment tools, and social pages, or the owner present to sign in.
- A list of every person and vendor who has had access, with their role and end date if they left.
- The current recovery email and phone number for each account.
- Decision on who keeps access and who is removed.
- Business devices list (computers and phones that touch business accounts).
- Signed fit-check acceptance and the agreed scope.

## Default stack

Prefer what the client already owns. Nothing here is a new recurring bill unless the client chooses it.

- Multi-factor sign-in: the settings already in the client’s email, bank, registrar, social, and payment accounts. Client owns; no cost.
- Email records check: the domain’s DNS panel plus a free lookup tool for SPF, DKIM, and DMARC. No cost.
- Operating system updates, screen lock, and disk encryption: built into Windows, macOS, iOS, and Android. No cost.
- Password manager: Bitwarden or 1Password business plan. **Client pays**, billed to the client’s own account. Gray Matter does not hold the payment method or the vault owner login.
- Access inventory: `ACCESS_INVENTORY.md` in this kit, kept in a folder the client owns.

## Build steps

1. Copy `ACCESS_INVENTORY.md` into a client-owned shared folder and rename it for the client.
2. Sit with the owner and list every account in the table, one row each, including vendor and former-staff access.
3. Fill the Owner, Admins, and Recovery method columns from the owner’s answers. Leave MFA blank until checked.
4. Remove each access the owner has approved for removal, and record the date in the Last reviewed column.
5. Choose the password manager with the owner, and have the client create the business account and paying plan.
6. Create one vault with the owner as owner. Move each shared login into the vault, then change the shared password.
7. Turn on multi-factor sign-in for email, banking, registrar, social pages, and payment tools. Mark each row Yes or No in the MFA column.
8. Look up the domain’s SPF, DKIM, and DMARC records. Write the result in plain English and make only the changes the owner approves.
9. Check each covered device: updates on, automatic screen lock set, disk encryption on. Record the result per device.
10. Fill the "If something looks wrong" card with the owner’s phone and recovery contacts, print one copy, and give a copy to the owner.
11. Walk the owner through the inventory and the card. Get a yes that the list is correct.

## QA checklist

- [ ] Every row in `ACCESS_INVENTORY.md` has an Owner, a Recovery method, and a Last reviewed date.
- [ ] A former employee’s login was tried after removal and was refused.
- [ ] Each shared login was replaced by a vault entry, and the old shared password no longer works.
- [ ] Sign-in to the business email asks for a second factor on a fresh browser.
- [ ] Sign-in to the bank portal and the domain registrar asks for a second factor.
- [ ] The SPF, DKIM, and DMARC lookup results are written in the inventory with a yes or no for each.
- [ ] Each covered device shows automatic screen lock enabled in its settings screen.
- [ ] Each covered device shows disk encryption on (BitLocker, FileVault, or device encryption).
- [ ] The "If something looks wrong" card is in the owner’s hands and lists a working phone number.
- [ ] The password manager account is in the client’s name, and Gray Matter’s login is not an owner of the vault.

## Handoff

- The client receives the completed `ACCESS_INVENTORY.md`, the response card, a written summary of what changed, and a short walkthrough on screen.
- The client owns every account, including the password manager, the email, the registrar, and the bank. Recovery methods point to the client.
- Gray Matter keeps no passwords after handoff. Any temporary login used during setup is removed or changed before the handoff call ends, as set out in `agreement.html`.
- Show the owner how to add and remove a user in the password manager and in the email admin panel.

## Maintenance option

Ongoing care is not part of this kit. Quote it after the fit check. If the owner wants someone to keep access reviews, updates, and email records current, offer `technology-partner` as the ongoing option, priced per engagement.
