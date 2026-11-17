---
id: website
name: Website Starter Kit
service: business-websites
---

# Website Starter Kit

## Who it is for

"I need customers to find me and take action."

A local business that has a social page or nothing at all, gets the same questions
in DMs or on the phone, and wants one professional place that answers them and
takes the next step: a call, a booking, a quote request.

## Fit check

Ask these before quoting. Record the answers in the intake notes.

1. What must a customer be able to do on the site: call, book, request a quote, see pricing, pay, or view work? (Maps to the tier.)
2. Does the client have a logo, at least 5 usable photos, and a written list of services with prices or "call for quote"?
3. Is a contact form enough, or do they need online booking or a quote form? Booking and quote forms need the Business tier or higher.
4. Do they need payments, a store, or digital product sales? These need the Growth tier and a defined scope before the quote.
5. Does the client own, or can they access, the domain registrar? If not, DNS changes are a blocker for launch.
6. Will the client own the Cloudflare, Formspree, and GitHub accounts from day one?
7. Can the client name one person who approves content and gives feedback within 5 business days per round?

**Disqualifier:** the site needs to store customer records, accounts, patient or client files, or card data on the site itself. The stack has no backend and no database (`websites/README.md`). Decline this kit and refer it out for a quote.

## Scope included

Tier maps to a price-book item. Default is Business.

- Essential (`website-essential`): up to 3 pages, mobile-friendly design, contact form, social links, basic search setup. 1 revision round.
- Business (`website-business`, default): up to 5 customized pages, online booking or appointment requests, inquiry and quote form, services and pricing, photo gallery, search and analytics setup, Google Business Profile setup, business email setup. 2 revision rounds.
- Growth (`website-growth`): up to 8 pages, booking and payments, one core follow-up automation, lead capture, analytics and conversion tracking. Revisions unlimited during build.
- Every tier: a written scope, a gated preview link, a launch, and a walkthrough at handoff.

## Scope excluded

Quoted separately, by price-book key:

- `addon-email-marketing` (range $300-$600)
- `addon-seo` (range $350-$750)
- `addon-copywriting` (range $400-$900)
- `addon-maintenance` (range $149-$299 per month; see Maintenance option)
- Domain, hosting, and third-party service fees. These are paid by the client.
- Custom design beyond the template theme, and anything not in the tier table above.

## Client inputs

Collect these before build (`websites/docs/INTAKE.md`):

- Business text: services, pricing or "call for quote", hours, address, service area, contact details.
- Photos, resized and stripped of EXIF data (`websites/scripts/strip-exif.sh`).
- Logo, and any brand colors they must match.
- Font pairing and color scheme picked from the pre-curated lists.
- Formspree form endpoint, created in the client's own account.
- Domain registrar login or confirmed DNS delegation.
- Written decision that the client repo may be public (needed for GitHub Pages on the free plan).

## Default stack

- Astro static build from a vertical template in `websites/templates/` (nine verticals). Free, open source.
- GitHub Pages for the public launch. Free for a public repo. Account owned by the client.
- Formspree for the contact and quote forms. Client's account; check the plan limits at setup.
- Cloudflare Pages with Cloudflare Access for the gated preview (email one-time code). Client's account. Gray Matter does not keep a standing login.
- Domain: client-paid, client-owned.

## Build steps

1. Confirm the tier and the add-ons on the fit-check answers. Write them into the intake notes.
2. Pick the closest vertical in `websites/templates/README.md`. Note it in the intake notes.
3. Run `websites/scripts/new-client.sh` to create a standalone client repo from that template.
4. Keep GitHub Pages disabled on the client repo. Do not add a `CNAME` or `.nojekyll` file yet.
5. Replace the demo `content.json` and the placeholder photos with client text and images. Follow the template's own README, "what to change first for a new client".
6. Set the theme from the chosen font pairing and palette. Check text contrast against the brand board in `app-design/templates/BRAND_BOARD.md`.
7. Wire the Formspree endpoint into the contact and quote forms. Send one test submission.
8. Deploy to Cloudflare Pages behind Cloudflare Access, following `websites/docs/DEPLOYMENT.md` stage one.
9. Run the viewport and assertion checks in `app-design/WEB_QA_BY_ASSERTION.md` against the gated preview. Fix each failure before the client sees it.
10. Send the client the gated preview link. Collect feedback within 5 business days per round. Apply revision rounds allowed by the tier.
11. On written sign-off, follow `websites/docs/DEPLOYMENT.md` stage two: set `site` and `base`, add `.nojekyll`, enable GitHub Pages with Actions, point DNS, turn on Enforce HTTPS, remove `noindex`.
12. Check the live URL and the form once more, then start the handoff.

## QA checklist

- [ ] The gated preview URL asks for a Cloudflare Access email code and loads the site for the client's email.
- [ ] GitHub Pages reads "not enabled" in the client repo Settings before sign-off.
- [ ] Every page loads at 375px, 768px, and 1280px widths with no horizontal scrollbar.
- [ ] Every internal link and image on every page returns a 200 response (no broken links).
- [ ] Submitting the contact form delivers one message to the client's Formspree inbox.
- [ ] No placeholder text ("Lorem", "Demo", "Your Business Name") remains on any page.
- [ ] Every image is under 150KB after build and has alt text.
- [ ] The page `<title>` and meta description are unique on each page.
- [ ] The live site, after launch, returns the client's domain over HTTPS with a valid certificate.
- [ ] `noindex` is absent from the live site and present on the preview.
- [ ] The revision count used matches the tier in the signed agreement.

## Handoff

- The client receives: the live URL, a short page-by-page guide, the form inbox instructions, and a walkthrough recording or call.
- The client owns every account: GitHub, Cloudflare, Formspree, domain registrar, and Google Business Profile. Transfer ownership before final files go out.
- Gray Matter keeps no passwords after handoff. Remove any access Gray Matter added and confirm this in writing, matching `agreement.html`.
- Ownership of the site transfers to the client on final payment in full (`ops/delivery/price-book.json` terms).

## Maintenance option

Use `addon-maintenance` (monthly, $149-$299 per month range in the price book). Quote a figure inside that range after a quick fit check of page count, form volume, and how often the client expects changes. Hosting and domain fees stay separate.
