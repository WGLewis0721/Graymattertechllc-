# Web QA by Assertion | Scripts Find What Eyes Miss

**Purpose:** Concrete, repeatable browser-QA recipes for websites and web apps, and the rule behind them: **every defect that mattered in the reference build was found by a script or a rendered image, not by looking at the page. When you find a defect, write the assertion that catches it, and keep it.** Companion to [UI_AUTOMATION_AND_EVIDENCE.md](UI_AUTOMATION_AND_EVIDENCE.md) (principles, native flows) and [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) (gates).

**Origin:** Adapted from the Listening Room reference build, [source commit 71aeb25](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25), scripts in [tools/qa/](https://github.com/WGLewis0721/Listening-party-/tree/71aeb25/tools/qa). Labels: **[Repo]** verified in those scripts; **[Not tested]** outside what a desktop headless browser can show. These scripts use Playwright with Chromium; use whatever maintained runner your target repo already has. Do not add a runner to the Gray Matter business website because of this guide.

## 1. Setup [Repo]

- Serve the **built** site, not only the source tree (the build step changes pages).
- WebGL in a server browser needs software rendering: launch Chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.
- Run heavy audits **alone**. Two audits at once starved the CPU and produced a flaky scroll-state failure that did not reproduce in 30 isolated rewinds. If a failure appears only under load, re-run it alone before calling it a defect.
- Never `pkill -f <pattern>` from the agent's own shell (it killed the shell); kill by process id.
- After rebuilding a directory a static server is serving, restart the server; it keeps the deleted directory open and serves nothing.

## 2. The viewport matrix [Repo]

| Viewport | Why |
| --- | --- |
| 390 by 844 | Phone, full screen |
| **390 by 664** | **A phone with the browser's bars showing.** Test "first screen" here, not at 844 |
| 820 by 1180 | Tablet |
| 1024 by 768 | Small laptop |
| **1366 by 650** | **A typical laptop with the browser bars showing.** Tall-window assumptions fail here |
| 1440 by 900 | Desktop |

Run each edition/look at every viewport, plus a Reduce Motion context (`reducedMotion: 'reduce'`).

## 3. Assertion catalog

| # | Assert | Defect it caught or guards against |
| --- | --- | --- |
| 1 | No console errors or warnings, no failed requests, **no request to another origin** | Silent third-party loads; CSP violations |
| 2 | `document.documentElement.scrollWidth - innerWidth <= 0` | Sideways scroll in static or phone layouts |
| 3 | **Scroll-state:** at each progress stop, exactly the expected layers are visible | Text from an earlier beat stuck on screen |
| 4 | Visible text under 12px: none. Visible tap targets under 44px: none | Mobile defects (tiny axis labels, wrapped bars) |
| 5 | **Contrast over live art** on the brightest 5% of pixels behind each text line | Unreadable type over moving art |
| 6 | **First screen:** the primary action is fully inside a 390 by 664 viewport | A Pay button 822 to 865px down an 844px screen (below the fold in a real browser) |
| 7 | **Not covered:** `elementFromPoint` at the center of a control returns that control | A footer painted under fixed background layers |
| 8 | **Geometry sweep:** decorations never overlap text across widths x heights | A scroll cue touching the headline on short windows |
| 9 | **Plain language:** no jargon, 1 to 5 things to tap, reading grade at or under 8, per screen | Drift back to technical words ([ZERO_TRAINING_UX.md](ZERO_TRAINING_UX.md)) |
| 10 | **Secret absent:** a gated value is not in the DOM, config, exports or files at every state | Leaks before payment or release ([GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md](GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md)) |
| 11 | **Server enforces, not the UI:** call the API directly for the forbidden action (too early, wrong token, over the limit) | Rules that only a hidden button enforced |
| 12 | **Policy enforced:** an injected inline script, a foreign script and `eval` are blocked | A CSP that exists but is not enforced |
| 13 | **Gates fail when they should:** break a copy on purpose and require the gate to fail | A gate that has never been seen to fail |
| 14 | **Deep 404:** an unknown address several folders deep returns 404 and is styled | A `<base>` tag placed after the stylesheets |
| 15 | **Reduce Motion:** static mode, all copy visible, no overflow | Missing fallback |
| 16 | **Camera path:** a fake camera reads a real QR; green; no double flash; releases the camera; no-camera message | Camera-scanning regressions |
| 17 | Static link check: every internal link and file reference exists | Broken links and 404 assets |

## 4. Recipes [Repo]

**Scroll to a progress stop and assert visible layers**

~~~js
await page.evaluate(p => { const t = document.getElementById('track'); scrollTo(0, t.offsetTop + (t.offsetHeight - innerHeight) * p); }, 0.45);
await page.waitForTimeout(1700);                                    // the scrub smooths; wait for it to settle
const isVisible = e => { const c = getComputedStyle(e); return c.visibility !== 'hidden' && parseFloat(c.opacity) > 0.05 && c.display !== 'none'; };
// expected = { 0.45: ['.b-set'], ... }: compare, for every layer, visible === (layer is in expected[p])
~~~

**First screen** and **not covered**

~~~js
const inView = sel => page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width > 0; }, sel);
const onTop = sel => page.evaluate(s => { const a = document.querySelector(s), r = a.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!t && (t === a || a.contains(t)); }, sel);
~~~

**Enforcement of a Content Security Policy.** Code run through the test tool's own channel (`evaluate`, init scripts) is **exempt** from the page's policy, so a naive `eval` test passes for the wrong reason. Probe from a script the *page* loads:

~~~js
await page.route('**/__eval_probe.js', r => r.fulfill({ contentType: 'text/javascript',
  body: "try { new Function('return 1')(); window.__ev = 'ran'; } catch (e) { window.__ev = 'blocked'; }" }));
const ev = await page.evaluate(() => new Promise(res => { const s = document.createElement('script'); s.src = '__eval_probe.js';
  s.onload = s.onerror = () => setTimeout(() => res(window.__ev), 100); document.body.appendChild(s); }));   // expect 'blocked'
~~~

Use a **relative** probe URL and a glob route so the same test works at the root and under a sub-path such as `/repo-name/`. For an injected inline script, append a `<script>` with `textContent` and listen for `securitypolicyviolation`.

**A fake camera for a QR scanner.** Render the code to a picture, turn it into a video file, launch the browser with the file as its camera:

~~~bash
ffmpeg -y -loop 1 -i qr.png -t 3 -r 10 -vf "scale=480:480,pad=640:480:80:0:white" -pix_fmt yuv420p qr.y4m
# Chromium flags: --use-fake-device-for-media-stream --use-fake-ui-for-media-stream --use-file-for-fake-video-capture=qr.y4m
~~~

Linux Chromium has no built-in `BarcodeDetector`, so this exercises the fallback decoder (the path older iPhones use); the built-in path stays **[Not tested]**.

**Negative test of a gate.** Copy the built output, break one thing (an external script tag, an unhashed inline script, a broken link, a forbidden name, an inline handler, a missing policy), run the gate, and require a failure message naming that problem. A gate that has never been seen to fail is not a gate.

## 5. Tool pitfalls [Repo]

- **Full-page screenshots lay out fixed elements differently** from a real window. A footer hidden under a fixed layer looked fine in every full-page capture. Use viewport screenshots **and** the not-covered assertion.
- **A forged-code test must use the current time step**; a made-up step is rejected as "expired" before the signature is checked, so the test proves the wrong thing.
- **Live versus local paths:** a site served under `/repo-name/` breaks tests that hard-code root paths. Derive paths from the page.
- **`waitForTimeout` is a last resort.** Scrubbed motion needs a settle time; for everything else wait on a state or element.
- **A passing test can be a bad test.** When a check passes on the first try, deliberately break the thing and watch it fail.

## 6. Order and evidence

1. Unit tests of shared logic, then database and server tests (see the gated-content pattern).
2. App audits on the source (viewport matrix, scroll states, contrast, plain language, secret-absent).
3. **Build**, then the static gate (no browser).
4. Browser checks on the **built** site, served the way production serves it (same sub-path, same 404 behavior).
5. Deploy.
6. The same browser checks against the **live** URL.

Report **pass over total for the run that happened**, the commit SHA, the viewport list, and the local-versus-live distinction. Separate what a desktop headless browser can show from what only real devices, real assistive technology and real networks can: collapsing mobile browser bars, real frame rate, screen readers, 200% zoom, a dim doorway, the platform's built-in QR detector. Label those **[Not tested]** until someone tests them. Never delete, weaken or mark "optional" an assertion to make a failure disappear.

Template: [templates/QA_ASSERTION_PLAN.md](templates/QA_ASSERTION_PLAN.md).
