# Immersive Scroll-Driven Promo Sites | One Pinned Hero, Verified

**Purpose:** A repeatable way to build a high-end, single-page promo site in which **scroll is the funnel**: one pinned stage, a few beats, one primary action, live generative art behind the type, and a legible, honest fallback. Companion to [WEBSITE_DESIGN_WORKFLOW.md](WEBSITE_DESIGN_WORKFLOW.md) (brief, references, assets) and [WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md) (how it is proven).

**Origin:** Adapted from the Listening Room reference build (a fictional DJ listening-party site), inspected at [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25). Evidence labels: **[Repo]** = verified in that code at that commit; **[Rec]** = recommendation; **[Not tested]** = not run. Listening Room's brand, copy, palettes and artwork are **not** part of this library.

**Scope:** New, independent sites. This is **not** guidance for the live Gray Matter business website, which stays zero-library under its own [.github/copilot-instructions.md](../.github/copilot-instructions.md).

## 1. Decide whether this pattern fits

| Use it when | Do not use it when |
| --- | --- |
| One story, one primary action (reserve, book, subscribe), a few short beats | Many pages, long reading, a dense catalog, an app UI |
| The first impression sells the product (events, launches, artists, products) | Search-driven long-form content |
| You can afford device testing of the scroll and the canvas | You cannot test on real phones |

Hero-only means the *page* is one stage. It does not mean the content lives in the artwork: headings, copy, prices and the call to action are real HTML.

## 2. Architecture [Repo]

- **Track and stage.** A tall `.track` (620vh on desktop, 560vh on phones) holds a sticky, full-height `.stage`. Scroll progress 0 to 1 is the only input.
- **One scrubbed timeline.** A single GSAP timeline bound to the track with ScrollTrigger (`scrub: .75`) fades beats in and out and moves their parts. Layers that are off are `autoAlpha: 0` (opacity and `visibility`), so they are also gone for assistive technology and keyboards.
- **Beats are a funnel, not a gallery.** Five beats at progress 0, .12, .34, .58, .82: Arrive (who), Sound (feel), Set (what happens), Room (the place and the rules), Ticket (the action). Each beat carries one idea.
- **A scrubber that is also navigation.** A bottom bar shows the beats as ticks (clickable) and a clock that runs across the evening as you scroll.
- **Exactly one filled button on screen:** the top bar's until the last beat, then the ticket's. Everything else is quiet.
- **Everything comes from one config object.** `mount(config, opts)` builds the entire hero into one root and returns `{ destroy, progress, setProgress }`. That is what makes a skin switcher possible: destroy, mount the next config at the same progress (see [EDITION_SYSTEM_FRAME_AND_SKIN.md](EDITION_SYSTEM_FRAME_AND_SKIN.md)).
- **`destroy()` must clean up everything:** kill the ScrollTriggers, remove window listeners, stop animation frames, disconnect observers, release the GL context. Verify with 20 rapid swaps: no leaked canvases, no leaked triggers.
- **Responsive logic in `gsap.matchMedia()`**, not scattered resize handlers. Read scroll progress **before** a resize and restore it after, or the page drifts when a device is toggled.

### The intro must not fight the scrub

Never animate the same property with an intro `from()` and the scrubbed `to()`. The later beats then inherit the intro's end state and text stays visible when it should be gone (the Arrive copy stayed on screen through later beats; visual review missed it for several rounds). Give the intro its own mechanism: a CSS keyframe for the extras, a short GSAP intro only for properties the scrub never touches. Then **assert** which layers are visible at each progress stop ([WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md)).

## 3. Generative art with a legible-type contract [Repo]

Raw **WebGL1 fragment shaders**, no dependency. One uniform API for every motif, so a new look is "pick a motif and five colors":

~~~text
uRes uTime uProg uPtr uDpr uSeed uSafe     // size, clock, scroll progress, pointer, pixel ratio, seed, safe-zone flag
uBg uInk uAcc uAcc2                         // the four palette colors the art may use
~~~

- **`uSafe` is the key idea.** When on, the shader itself darkens the area where type lives: in landscape it multiplies the picture by 0.3 on the text side, easing up to 1.0 on the open side (a smoothstep across roughly 28% to 68% of the width); in portrait by 0.5. The art stays vivid where there is no text, and contrast is guaranteed by construction. Panels and plates that carry no text leave it off.
- **Performance rules:** cap the device pixel ratio (1.5 default), render at about 0.72 scale on phones, cap the frame rate (60, 40 for touch, about 24 for small plates), pause when off-screen (`IntersectionObserver`) or when the tab is hidden, and draw **one still frame** under Reduce Motion.
- **Release the context once.** `destroy()` already loses the WebGL context; calling `WEBGL_lose_context` again yourself produces duplicate warnings.
- **Grain** (a small noise term inside the shader) is part of the skin, 0.05 (clean) to 0.08 (cinematic).

## 4. Prove legibility over moving art

Do not eyeball text on art. Method [Repo]:

1. At each scroll stop (for example 0, .28, .54, .7, 1) record every text line's rectangle (use DOM `Range` rectangles per line, not block widths, which overstate the area) and its computed color.
2. Hide the UI and screenshot the **bare art** at that stop.
3. For each line, take the pixels behind its rectangle and compute contrast against the **brightest 5%** of them (worst case, not the average).
4. Pass at 4.5:1 for body text and 3:1 for text 24px or larger. In the reference build 150 of 150 lines passed; the tightest was 5.8:1.

Two checker pitfalls found the hard way: parse `color(srgb ...)` values as well as `rgb()`, and use per-line rectangles.

## 5. Fallbacks that are real

- **Reduce Motion, missing animation libraries or print:** mark the root `data-mode="static"` and render a stacked, unpinned page: all copy visible, no animation, one still art frame. Under static mode, clip horizontal overflow (negative margins on wide type otherwise scroll sideways).
- **No JavaScript:** a `<noscript>` block with the essentials (name, date, place, price, link).
- **Essential content as HTML**, so crawlers and assistive tools see it.

## 6. Decorations must yield to content

A small decoration (for example a "scroll to enter" cue pinned near the bottom) will eventually touch the headline at some window size. Make it measure itself: if its rectangle comes within a margin of the tagline, hide it. Test **short** laptop windows (about 1366 by 650 once browser bars are counted), not only 900px-tall ones. In the reference build this overlap was found only by rendering a 1200 by 630 share image; a sweep of five looks by four widths by nine heights then confirmed none remained.

## 7. Vendor and record third-party code [Repo]

Vendor libraries locally (no CDN) so the Content Security Policy can forbid third-party scripts and no visitor data goes to another host. Record each library, version and license from the file's own header; **review the terms yourself** before shipping.

| Library | Version | License as stated in the file |
| --- | --- | --- |
| GSAP, ScrollTrigger | 3.12.7 | GreenSock standard license (see gsap.com/standard-license) |
| qrcode.js (QR generation) | n/a | MIT, Kazuhiko Arase |
| jsQR (QR reading) | 1.4.0 | Apache-2.0 |

## 8. Acceptance

- [ ] Every beat has exactly the expected layers visible at its progress stop (asserted, not eyeballed).
- [ ] Exactly one filled primary button is visible at every stop.
- [ ] Legibility over art measured at every stop and size (4.5:1 / 3:1) with the method above.
- [ ] Reduce Motion gives a stacked static page with all copy and no overflow.
- [ ] `destroy()` leaves no canvases, listeners or triggers after 20 mount/destroy cycles.
- [ ] No decoration overlaps text at 390 wide, 820, 1024, 1366 by 650 and 1440.
- [ ] Phone frame rate and the collapsing browser bar checked on **real devices** (the reference build did **not** do this: **[Not tested]**).
- [ ] Third-party libraries vendored, versioned and license-reviewed.

Reference files: [lr-hero.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/site/assets/js/lr-hero.js), [lr-shaders.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/site/assets/js/lr-shaders.js), [lr.css](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/site/assets/css/lr.css), [artcontrast.js](https://github.com/WGLewis0721/Listening-party-/blob/71aeb25/tools/qa/artcontrast.js). Treat them as a worked example to adapt, not a package to install.
