# Independent verification 1 — FAIL

**Candidate:** `bd580817b0b3490fb9f8fdeac40382bbd59980a9`  
**URL tested:** <https://log-duplicate-lens.sociobot.in/>  
**Date:** 2026-08-28  
**Verdict:** **FAIL** — the CLI and deployed site largely work, but the PWA cannot reliably receive future updates and mobile Lighthouse performance is below the required threshold.

## Release blockers

### High — service-worker update path serves stale documents indefinitely

`site/public/sw.js` uses the fixed cache name `log-duplicate-lens-v1` and responds cache-first for every same-origin GET, including `/`. A subsequent service-worker revision keeps that same cache rather than replacing it. Thus an existing client can retain an old cached `index.html`, which continues to reference the old immutable JS/CSS forever.

Fresh browser evidence against the live deployment:

1. Loaded the site, waited until `navigator.serviceWorker.controller` was non-null, and confirmed an offline reload rendered the application.
2. While back online, placed a sentinel HTML response in the existing `log-duplicate-lens-v1` cache for `/`.
3. Reloaded. The browser rendered `STALE-CACHE-PROOF` from cache instead of fetching the online document (`staleCacheServed: true`).

This is a controlled reproduction of the current cache-first update behavior, not a production mutation. It fails the required PWA service-worker update check. Version the cache per release and/or use a network-first navigation strategy (with an offline fallback), then test an update from an existing controlled client.

### High — mobile Lighthouse performance budget missed

The supplied acceptance threshold is Lighthouse mobile Performance >= 90. Fresh production measurements did not meet it:

| Runner | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| Lighthouse 13.4.1 | 78 | 100 | 100 | 100 | 1.0 s | 1.5 s | 990 ms | 0 |
| Lighthouse 12.8.2 | 80 | 100 | 100 | 100 | 1.0 s | 1.5 s | 830 ms | 0 |

Both runs used the Playwright-provided Chromium with `--headless --no-sandbox --disable-dev-shm-usage --disable-gpu` against the live URL. The score is below the 90 budget even though transfer sizes are small. Re-profile the long tasks/TBT under the release browser and make the threshold pass before release.

## Passed evidence

### Clean checkout, quality gates, and package

- Checkout was clean and began at exactly `bd580817b0b3490fb9f8fdeac40382bbd59980a9`.
- `npm ci` succeeded; npm audit reported 0 vulnerabilities.
- `npm test` completed successfully: 10 Rust tests, 4 Vitest tests, and 10 Playwright tests across desktop Chromium and the 390 px project. Playwright's `test-results/.last-run.json` recorded `{"status":"passed","failedTests":[]}`.
- `cargo clippy --workspace --all-targets -- -D warnings` passed.
- Exact production command `npm run build` passed, producing `target/release/log-duplicate-lens` and `dist/site/`.
- `npm run pack:cli` passed and produced `target/package/log-duplicate-lens-0.1.0.crate` (16,469 bytes).
- Unpacked that crate into a clean temporary consumer, installed it with `cargo install --path ... --root ...`, and executed its public binary. It reported `log-duplicate-lens 0.1.0` and found a two-stream duplicate with stable JSON output and exit code 3.
- The website's published `cargo install --git https://github.com/B-Divyesh/sf-log-duplicate-lens` command also installed into a separate clean consumer and its binary reported `0.1.0`.

### CLI job-to-be-done exercise

- Two JSONL records in distinct `shard` streams, 120 ms apart, formed one suspected group: 1 extra copy, 50.0% duplicate event volume, 2.0x alert inflation, `shard` label evidence, and exit code 3 with `--fail-on-duplicates`.
- `--redact 'token=\\S+=>token=[REDACTED]'` removed `token=secret` from the emitted preview while preserving grouping.
- Equivalent events from the same stream reported zero suspected groups.
- Malformed JSONL returned the documented invalid-input exit code 2; a `--max-events 1` boundary marked the report sampled and added the truncation caution; empty/plain text handling was exercised by tests and manual use.
- The crate test suite also covers Loki `query_range`, labeled 20-group detection (the >=90% target), no same-stream false-positive group, redaction, and empty input.

### Live deployment, privacy, browser, and accessibility

- The live root document SHA-256 exactly equals the locally built `dist/site/index.html`: `97ce4eea63fda5c3d1b91832b76acaef03dfc43be1692531eb8f4f670f97ad30`.
- The deployed emitted JS and CSS also exactly match the candidate build:
  - `assets/index-QT-Ghh34.js`: `3f82bfbe4aa8daf980e53115241205740f6b8bade0c0f682825d3f50888bfd55`
  - `assets/styles-B6BQ0Jlp.css`: `2aa8f83b0f8b987de5f96b5c947a36fcaa76e561f878118e188954df98b68cd4`
- Live Playwright smoke: loaded the labeled sample, analyzed it, observed 3 copies; zero console errors, page errors, or failed requests; no third-party resource requests; axe returned 0 serious/critical violations.
- Keyboard-only tabbing reaches the skip link first and then all primary actions/form controls with a visible solid focus outline. The malformed-input recovery test returns focus to the log textarea.
- At 390 px, browser measurement found 0 px horizontal overflow. With reduced motion, trace animation duration was `1e-05s` (effectively disabled).
- Privacy review found no analytics, tracking, CDN fonts/scripts, or log-content upload. In a no-license session the page made no outbound resource requests; the only coded external runtime request is the documented Sociobot license verification endpoint, invoked only with a stored/submitted license token. CSP limits `connect-src` to self and `https://api.sociobot.in`.
- Live response headers include HSTS, `nosniff`, restrictive CSP, `frame-ancestors 'none'`, referrer policy, and permissions policy. Hashed JS uses `Cache-Control: public, max-age=31536000, immutable`; hero image uses a 7-day cache policy. `/privacy/` and `/terms/` returned 200.
- Bundle measurements: initial JS 12,541 bytes raw, CSS 18,091 bytes raw, hero WebP 95,576 bytes, all within the stated transfer budgets. The static output totals about 163 KB.

## Scope notes

- No product code was modified. This report and the handoff update are the only repository changes.
- The requested `verify-url.sh` was not present in the repository; the equivalent checks were performed in Playwright (title, lang, one h1, main, image alt/axe, console and page errors).

## Required next steps

1. Repair and version the service-worker update/navigation caching strategy; prove an old controlled client obtains the new shell after a deployment and still reloads offline.
2. Investigate the production mobile Lighthouse TBT and bring Performance to >=90 under a documented reproducible command.
3. Re-run this verification after both blockers are fixed.
