# Security, Reliability, Monetization and Launch

**Reference standards:** [OWASP ASVS (web)](https://owasp.org/www-project-application-security-verification-standard/), [OWASP MASVS (mobile)](https://mas.owasp.org/MASVS/), [Supabase production](https://supabase.com/docs/guides/deployment/going-into-prod), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Apple App Review](https://developer.apple.com/app-store/review/guidelines/).

## Decisions needed before launch

- **Data:** Collect only what's necessary. Define permission, encryption, retention, deletion, export and recovery.
- **Identity:** Decide whether accounts are essential; handle verification, logout, reset, expiry, abuse controls and deletion.
- **Authorization:** Enforce server-side rules, RLS or equivalent, and test cross-user *negative* cases. A hidden button is not security.
- **Keys/integrations:** Least privilege, secure variable storage, budgets, timeouts, rate limits, provider failure behavior. Never commit secrets.
- **Payments:** Document price, buyer promise, taxes as applicable, entitlements, subscriptions, refund/cancellation rules, and webhook/receipt verification. No fake checkout and no entitlement on client-side optimistic success.
- **Resilience:** Backups plus tested restore, graceful offline/degraded modes, monitoring, idempotent mutations, error tracking and rollback.
- **Compliance:** Review privacy policy, commercial code/font/asset licenses, Apple rules and actual claims made to users.

## Creative asset and UI-evidence gate

For product imagery, generated graphics and third-party photos, use [CREATIVE_ASSET_PRODUCTION.md](CREATIVE_ASSET_PRODUCTION.md) and [templates/ASSET_JOB_MANIFEST.md](templates/ASSET_JOB_MANIFEST.md) to track approved copy, image source, rights, published scope and removal fallback. An AI transformation or a brand disclaimer does not automatically grant distribution rights. For cinematic media, check actual decoded motion and packaged video with [ANIMATED_MEDIA_PIPELINE.md](ANIMATED_MEDIA_PIPELINE.md). For end-to-end UI failures, distinguish test script, accessibility hierarchy, timing and app bugs using [UI_AUTOMATION_AND_EVIDENCE.md](UI_AUTOMATION_AND_EVIDENCE.md).

## Gated content, static-site and scripted-QA gates

For tickets, passes or anything hidden until earned, follow [GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md](GATED_CONTENT_AND_DIGITAL_PASS_PATTERN.md) and fill the [threat model](templates/GATED_CONTENT_THREAT_MODEL.md). **A screenshot cannot be blocked on the web**; design the leak to be late, traceable, short-lived and insufficient. For a new independent static site, use [STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md](STATIC_SITE_PLUMBING_AND_DEPLOY_GATE.md) and its [checklist](templates/SITE_PLUMBING_CHECKLIST.md): a Content Security Policy that is **enforced and tested** (not merely present) and a deploy gate **proven to fail** on purpose. Plan browser checks with [WEB_QA_BY_ASSERTION.md](WEB_QA_BY_ASSERTION.md).

## Engineering release gate

- [ ] No secrets, customer data or unauthorized external service credentials in Git.
- [ ] Auth and backend permissions verified for unauthenticated and different-user attempts.
- [ ] Database RLS/equivalent tested, not merely enabled.
- [ ] User input validation and trusted payment/entitlement paths tested.
- [ ] Third-party code, AI skills and dependencies reviewed for security/license risks.
- [ ] Account recovery/deletion, privacy, support and data retention work as represented.
- [ ] Failed requests show errors instead of false success; offline and retry paths tested.
- [ ] Logging, backups, operational ownership and rollback documented.
- [ ] Gated values (a private address, a code, a download) are absent from every public file and from the page until released, asserted at **every state**; the server refuses forbidden requests even when the UI is bypassed.
- [ ] Every automated gate was seen to **fail** on a deliberately broken copy before it was trusted.

## Experience release gate

- [ ] Core user journey works with real data from clean installation/login.
- [ ] First-run, empty, loading, error, permission denial and offline scenarios tested.
- [ ] Small phone, large phone and tablet (if supported), orientation/resize, keyboard, font scaling and theme tested.
- [ ] Keyboard/focus or VoiceOver, contrast, touch, and reduced motion checked.
- [ ] Motion, swipes, scrolling and haptics are coherent and interruptible.
- [ ] Persisted changes survive restart; edit/delete/undo is accurate.
- [ ] Screenshots, recordings, test outputs and full error logs attached.

## Ship in stages

1. **Specify:** user outcome, architecture, tokens, data ownership, security and payment model.
2. **Build:** real first vertical slice with error handling.
3. **Test:** unit/integration/E2E/device, auth negative tests and payment results.
4. **Review:** compare implemented UI recording with design and feature spec.
5. **Candidate:** known commit/version, signed or deployed artifact, metadata and rollback.
6. **Release:** controlled production/web/TestFlight/App Store action.
7. **Observe:** crash/error reports, usage metric, charge reconciliation, support feedback.

Never label a release **complete**, **live**, **approved** or **production-ready** without corresponding evidence. Preserve a known-good version. Use [templates/RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md).
