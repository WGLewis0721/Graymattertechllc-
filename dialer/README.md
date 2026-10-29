# Gray Matter Power Dialer (internal MVP)

An **operator-only, one-line browser power dialer** for Gray Matter lead outreach.
This folder is deliberately separate from the public sales funnel. The existing
marketing site stays entirely static; a private Cloudflare Worker handles data,
auth, Twilio tokens, and TwiML.

## What works after provisioning

- Import CSV or add contacts individually. Column names: `name,company,phone,source,timezone`.
- New contacts are **not cleared for calling**. Individual approval records the
  chosen US time zone and a review note. The reviewer must check applicable
  do-not-call and telemarketing rules before approving.
- Search/filter contacts, review local calling hours, track outcomes and notes,
  schedule follow-ups, and enforce permanent Do Not Call from the UI.
- Browser outbound calls using the Twilio Voice JavaScript SDK, routed through a
  signed Twilio webhook. A one-use dial token ensures the browser cannot override
  the destination or bypass the server-side eligibility/hour checks.
- Opt-in power dial behavior: switch on "Dial next eligible contact after saving
  an outcome". It dials the next approved queue contact **only after** the
  previous call ends and you save its outcome. It never calls in parallel.
- US numbers only; capped at 6 authorized calls per minute globally and at most
  one authorization per contact per 10 minutes. 8 AM–9 PM contact-local window.
- No call recording, voicemail drop, prerecorded audio, predictive or parallel
  dialing. No DNC list subscription or legal eligibility verification.

## Not ready to call until configured

GitHub Pages cannot hold a Twilio API secret or store a private call log.
`dialer/index.html` ships as a public *shell* with no leads and no secrets.
Its API rejects requests without an operator access key. **Do not put any real
prospect data in repository files, URL parameters, or JavaScript configuration.**

### 1. Set up the voice provider

In Twilio:

1. Obtain a Twilio voice-capable US number.
2. Create a standard API Key (SID and secret), under your Twilio account.
3. Create a **TwiML Application** for browser outgoing calls. Its Voice URL
   (HTTP POST) must be your future Worker URL followed by `/voice`.
4. Note Account SID, Auth Token, API Key SID/secret, TwiML Application SID,
   and purchased outgoing caller ID.

Twilio trial accounts may only call verified destinations. Trial/production
charges and telemarketing restrictions still apply.

### 2. Create Cloudflare D1 + deploy isolated Worker

From `dialer/api`, with a Cloudflare account and Wrangler logged in:

```bash
npx wrangler d1 create graymatter-power-dialer
cp wrangler.toml.example wrangler.toml
# Set the D1 database_id in wrangler.toml from the command above.
# Set VOICE_WEBHOOK_URL to the actual HTTPS Worker /voice URL.
npx wrangler d1 execute graymatter-power-dialer --remote --file=schema.sql
npx wrangler secret put OPERATOR_KEY
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_API_KEY_SID
npx wrangler secret put TWILIO_API_KEY_SECRET
npx wrangler secret put TWILIO_TWIML_APP_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_FROM_NUMBER
npx wrangler deploy
```

Generate a **long, random** operator key (for example
`openssl rand -hex 32`); do not reuse a login password. The key is kept
in memory only and is cleared by Lock/refresh; this is a single-operator MVP,
not a full SSO system. Put stronger access policy/identity auth and audited
key rotation in place before adding multiple operators.

`wrangler.toml` is environment-specific and **must not be committed**.
Twilio webhooks must be sent to exactly the same URL as
`VOICE_WEBHOOK_URL`, including case, scheme, and any query string.
Request signatures are checked against the server-side Twilio Auth Token.

### 3. Connect the browser UI

Set `dialer/config.js` **only** to the Worker HTTPS base URL (no trailing slash):

```js
window.GM_DIALER_CONFIG = Object.freeze({
  apiBase: "https://YOUR-WORKER.your-subdomain.workers.dev"
});
```

The same website origin must be in the Worker's `ALLOWED_ORIGIN`, e.g.,
`https://graymatterdigitalsolutions.com`. If testing from the GitHub Pages
domain instead, set that exact origin for the test Worker.

Open `https://graymatterdigitalsolutions.com/dialer/`, enter your operator
key, and import a small test CSV. Check that contacts remain blocked until
individually reviewed. Place **only a verified test call to yourself first**.

The browser loads a pinned version of the Twilio Voice SDK from ESM.sh as an
isolated convenience for the first MVP (Twilio no longer hosts an official
v2 SDK CDN). For production, review and self-host the upstream SDK bundle;
do not mistake the external ESM service for a Twilio-hosted distribution.
The call device requires HTTPS, microphone permission, and a supported
desktop WebRTC browser.

### CSV sample

```csv
name,company,phone,source,timezone
```

Intentionally no invented people or real phone numbers are included.

### Local checks

```bash
# From the repository root
node --check dialer/dialer.js
node --check dialer/api/worker.js
node --test dialer/api/worker.test.mjs
python3 -m http.server 8080
# Open http://localhost:8080/dialer/ (UI shell only until configured)
```

To use the local page with the Worker, set `ALLOWED_ORIGIN` to the exact
local origin in a separate development environment. Never weaken production
CORS or embed the operator key in the page.

## Calling safeguards and limitations

Calling prospects is not automatically permitted just because they are
businesses. Validate the type of phone line, applicable federal/state laws,
suppression lists, consent where required, and do-not-call requests. The
approval checkbox is a workflow prompt, **not** an automated compliance
screen. Your contact's actual US time zone is mandatory; the API checks
the window again immediately before sending TwiML. Any Do Not Call outcome
is permanently suppressed in this interface.

A Twilio access token lasts one hour and the UI refreshes it before subsequent
calls when near expiration. Phone service requires
provisioning and cannot be tested end-to-end without real Twilio credentials.
No dialer code, branch merge, or GUI preview can substitute for that setup.

## Future hardening

Cloudflare Access / SSO, user accounts and audit trails, automatic carrier/
DNC screening via a reputable provider, role-based limits, callback
notifications, short-lived device token refresh, and Twilio status callbacks
to reconcile unsuccessful attempts without treating a failed connection as
a completed conversation.
