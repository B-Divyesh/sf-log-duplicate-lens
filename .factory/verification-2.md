# Independent verification 2 — PASS

**Candidate:** `f9b952a9fddfd87aa1eae64736affb4bb6d8c0ff`
**Live URL:** <https://log-duplicate-lens.sociobot.in/>
**Date:** 2026-08-28
**Verdict:** **PASS** — fresh clean-checkout, package-consumer, local production, and live-deployment evidence meets the researched CLI contract. No release-blocking defects were found.

## Scope and method

The checkout began clean at exactly the candidate SHA. I installed dependencies from `package-lock.json`, ran every repository test component and available static check, built the exact production artifacts, packaged the CLI, and installed that package into an isolated temporary Cargo consumer. I then independently exercised normal, boundary, and recovery paths against the release binary and repeated browser/PWA checks against the live HTTPS deployment.

`verify-url.sh` is not present in this repository, so its title/lang/main/alt/console checks were performed directly in Playwright alongside aXe.

## Local quality gates — passed

```sh
npm ci
cargo test --workspace
vitest run src/analyzer.test.ts --globals
npx playwright test
cargo clippy --workspace --all-targets -- -D warnings
npm run build
npm run pack:cli
npm run test:performance
```

- `npm ci` installed 175 packages and reported **0 vulnerabilities**.
- Rust tests: **10 passed** (5 library, 2 binary, 3 CLI integration); Vitest: **4 passed**; Playwright: **12 passed** across desktop Chromium and the 390 × 844 mobile project (`test-results/.last-run.json` reports `passed`). The browser suite includes the sample flow, malformed-input focus recovery, aXe, mobile overflow/offline use, PWA online-update/offline fallback, and legal pages.
- Strict Clippy passed with `-D warnings`. TypeScript `tsc --noEmit` passed as part of both `build:site` and the Playwright web server. No separate lint script is defined.
- `npm run build` succeeded, producing `target/release/log-duplicate-lens` (2,611,432 bytes) and `dist/site/`.
- `npm run pack:cli` produced `target/package/log-duplicate-lens-0.1.0.crate` (16,641 bytes).
- `npm run test:performance` passed: Lighthouse 13.4.1 reported **Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.2 s, TBT 70 ms, CLS 0**.

## CLI and package consumer — passed

The release binary was exercised with two JSONL events in distinct `shard` streams, 120 ms apart. After default normalization it returned one suspected group, one duplicate copy, 50.0% duplicate event volume, 2.0× alert inflation, `shard` label evidence, and documented exit code **3** with `--fail-on-duplicates`. `--redact 'token=[^ ]+=>token=[REDACTED]'` removed `token=secret` from the reported preview.

- Equivalent events in the same stream returned zero groups and exit 0.
- `--max-events 1` marked the result `sampled: true` and included the truncation caution.
- Malformed JSONL returned exit **2** with `invalid JSON on line 1`.
- The package was unpacked into an isolated temporary directory and installed with `cargo install --path … --root …`. Its public binary printed `log-duplicate-lens 0.1.0`; against a two-stream, normalized duplicate it returned stable JSON with one group and exit **3**.

This corroborates the brief’s core behavior: local processing, configurable normalization/redaction, cross-stream-only evidence, inflation estimates, non-accusatory caution text, and explicit resource ceilings.

## Live deployment identity and browser QA — passed

Fresh SHA-256 comparisons prove the live deployment is this candidate’s production build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `fad7931c15598a1540f8c3640c2d8d0a5859d1875ca16222aa23fc0678e34b9e` |
| `sw.js` | `be73cc4f66ef397cc89ee2b56095fe2a182d5e8b87a3bc567c5aeed823bb14be` |
| `assets/index-CQhEIqkq.js` | `fabbfb7533ee7fd6316fe1c37a6929fca7d73510e5c8d562949b9a103b935091` |
| `assets/styles-Basu2tYJ.css` | `6b4e50d0cc9ddc3e057adc33660421be313cf001abb86a636e38b5a838f00535` |

Independent Playwright checks on the live URL found:

- Correct title, `lang="en"`, exactly one `h1`, one `main`, and no images lacking `alt`.
- Labeled sample flow: `EVIDENCE FOUND`, 3 copies, and 2 suspected amplification groups.
- Invalid JSON explains the line/parse problem and restores focus to the log input.
- aXe reported **0 serious/critical** violations. Keyboard Tab lands on the skip link first with a visible `rgb(243, 233, 210) solid 3px` outline.
- At 390 px: **0 px** horizontal overflow. With reduced motion, a trace animation duration is `1e-05s` (effectively disabled).
- **0** console errors, page errors, and failed requests. The unlicensed session requested only `log-duplicate-lens.sociobot.in`.
- PWA regression: after controlling the live page, a sentinel `STALE-CACHE-PROOF` response was injected into its versioned cache for `/`. An online reload did **not** render it (`staleOnline: false`); an offline reload rendered the real `Find the copies your stream labels hide.` shell.

## Privacy, policies, caching, and budgets — passed

- Source review and a clean live browser session found no analytics, trackers, CDNs, third-party fonts/scripts, or log-content outbound request. The only coded cross-origin runtime request is the documented opt-in license verification request to `https://api.sociobot.in`; it is initiated only for a returned/stored/submitted license token. The free analyzer works without it.
- The live root and service worker send HSTS, `nosniff`, restrictive CSP (`connect-src 'self' https://api.sociobot.in`; `frame-ancestors 'none'`), strict referrer policy, and a camera/microphone/geolocation-denying permissions policy. `/privacy/` and `/terms/` both return 200.
- `/sw.js` sends `Cache-Control: no-cache`; the versioned, hashed JavaScript sends `public, max-age=31536000, immutable`.
- Release sizes: initial JS **12,565 bytes**, CSS **18,219 bytes**, mobile hero **24,206 bytes**, and all static output **173,499 bytes**. These are below the stated JS/CSS/mobile-hero budgets.

## Defects by severity

None found. No known verification gaps block release.
