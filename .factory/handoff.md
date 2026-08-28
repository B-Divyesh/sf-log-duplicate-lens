# Log Duplicate Lens — review 4 handoff

## Outcome

This was an independent, non-product-code review. Review 4 is **FAIL** with
one minor remaining finding, documented in `.factory/review-4.md`: browser Back
from `/demo` returns focus to `BODY` instead of a deliberate home-route target
and does not announce the returned route.

## What was verified

- Cold production checks at 390 × 844 and desktop: clear job, audience, and
  first action; no horizontal overflow or console/page errors.
- One-click `/demo` shows the sticky demo notice and populated two-group,
  three-copy result in the phone viewport. Reset reruns the sample; leaving
  removes only `demo:` storage and preserves normal storage.
- Demo request interception was same-origin only; offline demo coverage passed.
- The real CLI demo ran from a new temporary directory against its bundled
  seven-record sample and printed a temporary report path.
- All 23 claims in `.factory/claims.json` passed from fresh clone
  `/tmp/log-duplicate-lens-review4-no0LbB/repo`; the browser claim run was 14
  passing tagged tests and `cargo test --test cli` passed all registered CLI
  claims.
- `npm test` exercised the complete Rust, Vitest, and 48 Playwright test suite;
  `npm run build` produced the release CLI and `dist/site/`.
- Live route metadata, h1/main landmarks, legal/header/footer links, designed
  404, favicon/social/touch assets, internal/external link crawl, visual
  identity, and copied landing/README text were audited.

## Required next step

Restore a meaningful focus target and aria-live route announcement when the
visitor returns from demo with browser Back/forward, then add an end-to-end
test for that path. Rerun all claim commands and the route check after the
repair.

## How to verify

```sh
npm ci
npm test
npm run build
```

Run each command recorded in `.factory/claims.json`, then test `/` → `/demo`
→ browser Back and confirm focus is on the prior action or home h1 and that the
route is announced.
