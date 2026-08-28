# Log Duplicate Lens — review 5 handoff

## Outcome

Review 5 is **FAIL** with four minor findings recorded in `.factory/review-5.md`. No product code was changed.

Open findings:

- F-5-1: browser retry-window behavior is shown but has no browser claim/test.
- F-5-2: browser impact estimates are shown but unregistered and “Alert amplifier” is unclear.
- F-5-3: legal/static route changes leave focus on `BODY` and do not announce the route.
- F-5-4: generated 404 footer lacks the normal factory/version attribution.

## Verification performed

- Cold live mobile (390 x 844) and desktop checks; first-read job, audience, and first action are clear.
- Live demo one-click result, banner, Reset, Start-for-real, storage isolation, same-origin interception, and offline Reset checks passed.
- The CLI demo ran from a new temporary directory and wrote a temporary report.
- Clean clone `/tmp/log-duplicate-lens-review5-DzngYe/repo`: `npm ci`, all 23 exact `.factory/claims.json` commands, `npm test`, and `npm run build` passed. The individual-claim transcript is `/tmp/log-duplicate-lens-review5-claims.log`.
- Live route metadata/h1/main checks, link crawl, HTTP 404, Back focus, and headers were checked. All rendered HTTP links returned 200; explicit mailto links were retained.

## How to verify repairs

~~~sh
npm ci
npm test
npm run build
~~~

Run every exact command in `.factory/claims.json` independently from a clean clone. Add tests for F-5-1 and F-5-2, then verify Home -> Privacy -> Terms and the 404 entry move focus to the new h1 and announce the route. Confirm the 404 footer reads “Built by Param Factory · v0.1.0”.
