# Client Intake Checklist

The entire client-facing input surface is three things: business name, photos, and a typography/color preference. Everything else on this checklist is either derived from those three or is short-form business info the client already has on hand (hours, phone number, service list). No client is asked to write marketing copy, choose a layout, or make a design decision beyond the style pick.

Collect all of the below before spinning up the site. Partial intake delays the delivery timeline; see `README.md`.

## 1. Business info (text, collected via form or short call)

- [ ] Legal/display business name, exact spelling and capitalization.
- [ ] Tagline or one-line description (optional; if not provided, one is drafted from the business type and offered back for approval, not invented and shipped unapproved).
- [ ] Phone number.
- [ ] Email address (public-facing, not necessarily the owner's primary inbox).
- [ ] Physical address, if the business has a location clients visit. Omit entirely for service-area-only businesses.
- [ ] Service area description, for businesses without a storefront (e.g. "Springfield and surrounding 20 miles").
- [ ] Hours of operation, per day. Explicit "closed" for days off, not omitted.
- [ ] Service or offering list: name, price (or price range, or "call for quote"), duration if relevant.
- [ ] Social links to include, if any (Instagram, Facebook, Google Business profile, Yelp).
- [ ] Any required legal/licensing text (bar number, contractor license number, insurance disclosures). Get the exact required wording from the client; do not paraphrase licensing language.

## 2. Photos

- [ ] Minimum 5, target 10-15 photos: storefront/workspace, the owner or team, work samples or product shots, and any environment shots that establish trust (clean shop, organized job site, professional office).
- [ ] Format: JPEG or PNG, camera-original resolution. Do not accept pre-compressed, pre-resized, or screenshotted photos if a better source exists; upscaling later loses quality the shoot already had.
- [ ] Orientation matters: request some photos with headroom that work as a hero/banner image (wide, subject not centered), not exclusively square social-media crops.
- [ ] No photos with identifiable third parties (customers, patients, clients in frame) without that person's consent on file with the business owner. This is the business owner's responsibility to confirm, ask directly during intake.
- [ ] **EXIF strip is mandatory before any photo is committed to the project or uploaded anywhere.** See `SECURITY.md` for the exact tooling and command. This step happens immediately on receipt, before photos are sorted, cropped, or renamed. No exceptions for "it's just a storefront photo": that's the exact photo most likely to carry a home address if the business is home-based.
- [ ] After stripping, resize and compress per placement: hero images to the template's hero dimensions, gallery images to the gallery's expected aspect ratio, at web-appropriate file size (target under 150KB per image before `astro:assets` further optimizes on build).
- [ ] File naming: descriptive kebab-case, no spaces, no camera default names. `shop-interior-1.jpg`, not `IMG_4521.jpg`.

## 3. Typography and color preference

The client picks from a short, pre-curated list, not an open-ended request. This keeps the choice fast for the client and keeps every resulting theme within the tested, accessible design space.

- [ ] Font pairing: present 3-4 named pairings (e.g. "Modern Sans", "Classic Serif", "Bold Display") with a live or static preview. Client picks one.
- [ ] Color scheme: present 3-4 named palettes (e.g. "Warm Neutral", "Cool Professional", "Bold Accent") with a live or static preview against the chosen vertical template. Client picks one.
- [ ] If the client has an existing logo or brand color they want matched instead of picking from the list, take the exact hex value or logo file, and confirm contrast against the template's text/background roles passes accessibility checks before using it. A close-enough approved palette is offered if the requested color fails contrast.

## 4. Form and integrations

- [ ] Confirm which form provider to use (Formspree or Netlify Forms) and get or create the form endpoint ID.
- [ ] Confirm whether the client wants a map embed, and if so, the exact address to pin.
- [ ] Confirm whether the client wants a booking widget embedded, and which provider (Calendly, Square Appointments, etc.), plus their existing booking link.
- [ ] Confirm whether analytics should be included (Plausible or GA), and get the site ID if the client already has an account, or set one up as part of delivery.

## 5. Domain and hosting

- [ ] Does the client have an existing domain? Get registrar and confirm DNS access, or confirm the client will delegate DNS changes.
- [ ] If no domain yet, confirm the desired domain name before build starts so it can be reserved.

## Output of intake

Once every item above is collected, it is transcribed directly into the client's `content.json` (see `ARCHITECTURE.md` for the schema) and the processed image set is placed in the client project's `src/images/`. Nothing in this checklist should require engineering judgment to translate: if a field doesn't map cleanly to the `content.json` schema, that's a signal to revisit the schema, not to improvise around it.
