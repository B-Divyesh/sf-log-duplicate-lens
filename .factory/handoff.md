# Log Duplicate Lens — polish 4 handoff

## Outcome

**PASS.** Repair commit
`358038d940bb609abffd5794247fc89728b48acd` is pushed to `origin/main` and its
static `dist/site/` artifact is deployed at
https://log-duplicate-lens.sociobot.in. The cumulative review set has zero open
findings.

## Repair made

F-4-1 is closed. `site/src/main.ts` now handles `pageshow` on a returned home
route, including a back/forward-cache restore. It focuses the home h1
(`#hero-title`) without moving the restored scroll position and writes the
home-route label to the polite announcer. The route end-to-end test now asserts
both focus and announcement after `/` → `/demo` → browser Back.

The catalog description is now the 83-character verb-first sentence:
“Find duplicate Loki logs across streams to investigate alert and storage
inflation.” The product keeps its mid-century instrument-panel identity; no
visual system was replaced.

## Exact verification evidence

- Fresh clone: `/tmp/log-duplicate-lens-polish4-clean-u6Y2Z5` at
  `358038d940bb609abffd5794247fc89728b48acd`.
- Fresh-clone `npm ci` completed with zero vulnerabilities.
- Each of the 23 exact commands declared in `.factory/claims.json` passed
  independently. Their transcript is
  `/tmp/log-duplicate-lens-polish4-claims.log`; it ends `ALL CLAIMS PASSED`.
- Fresh-clone `npm test` passed: 18 Rust tests, 4 Vitest tests, and 48
  Playwright tests. These include the accessibility axe integration, keyboard,
  privacy/network interception, storage isolation, offline, PWA, and mobile
  checks.
- Fresh-clone `npm run build`, `npm run pack:cli`, and `npm run
  test:performance` passed. The package artifact is
  `target/package/log-duplicate-lens-0.1.0.crate` (17,386 bytes).
- Lighthouse: performance 100, accessibility 100, best practices 100, SEO
  100; FCP 0.9 s, LCP 1.4 s, TBT 50 ms, CLS 0. Release JS is 4.55 kB gzip and
  CSS is 5.17 kB gzip.
- Deployment used `/opt/fleet/lib/deploy-static.sh log-duplicate-lens
  dist/site`; Static Web Apps deployment ID
  `a31f1518-0feb-44fe-bfcb-0efd7364e83b` succeeded.
- Cold live audit passed for `/`, `/demo`, `/privacy/`, `/terms/`, and an
  unknown route (HTTP 404). It confirmed titles, one h1/main each, metadata,
  legal/header/footer links, no console/page errors on 200 routes, and no
  serious/critical axe findings. `verify-url.sh` reports are at
  `.factory/evidence/polish-4-live/root/verify.json` and
  `.factory/evidence/polish-4-live/demo/verify.json`.
- Cold live demo audit confirmed first-screen copy, direct `?demo=1`, sticky
  banner, Reset demo, Start for real, two groups/three copies, demo-only
  storage, no off-origin requests, offline Reset, zero 390 px overflow, and
  `/` → `/demo` → Back focus on `#hero-title` with the route announcement.
  Evidence: `.factory/evidence/polish-4-live/audit/live-audit.json`,
  `live-demo-mobile.png`, and `live-back-focus.png`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run pack:cli
npm run test:performance
```

Run every command in `.factory/claims.json` separately from a clean checkout.
Then open the live `/demo` and verify the banner, populated result, Reset demo,
and Start for real. Navigate `/` → `/demo` → browser Back: focus must be on the
home h1 and the live region must say “Log Duplicate Lens — find duplicate Loki
logs.”

## Known gaps

None.
