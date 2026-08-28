# Polish 5 — cumulative zero-finding closure

Repair commit: `d1e0bc035ef988d196588e6fc4fbe7bfff3fe578`, pushed to
`origin/main` and deployed as static artifact `dist/site/` on 2026-08-28.
The Static Web Apps deployment id was `a01fffbf-3cad-481a-bf54-16ff58e01543`.
Live URL: <https://log-duplicate-lens.sociobot.in/>.

Clean-clone evidence is `/tmp/log-duplicate-lens-polish-5-clean-eN4G6M/repo`.
Its individual-claim transcript is
`/tmp/log-duplicate-lens-polish-5-claims.log`; full-suite transcript is
`/tmp/log-duplicate-lens-polish-5-full-clean.log`. Live screenshots and the
machine-readable audit are under `/tmp/log-duplicate-lens-polish-5-live-pRfMxB/`.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Retained the six-word task headline, explicit Loki-operator audience, and sample-result note. | Cold live root screenshot `/tmp/log-duplicate-lens-polish-5-live-pRfMxB/root/screenshot-mobile.png`; live `/` 200. |
| R1-B2 / F-2-1 / F-3-1 | Retained one-click `/demo` and `?demo=1` analysis, sticky isolation notice, Reset, Start for real, and deterministic result focus. | `@claim:sample-analysis`, `@claim:demo-mobile-result`, `@claim:demo-isolation`; live screenshot `audit/live-demo-mobile.png`; live audit records banner y=4–106 and result y=122–157 in a 390×844 viewport. |
| R1-B3 / F-3-2 | Retained the bundled seven-record CLI demo, temporary report, self-hosted SVG recording, and transcript. | `cli-demo`, `cli-demo-recording` claims; live `/cli-demo.svg` check. |
| R1-B4 / F-2-2 | Retained the isolated `demo:` namespace and truthful Reset-versus-Start-for-real wording. | `@claim:demo-isolation`; live audit preserved `real:polish-5-probe`, retained the demo marker on Reset, and removed it on Start for real. |
| F-2-3 | Expanded the registry to 25 observable claims; no reliance statement remains without a matching test. | Every exact command in `.factory/claims.json` passed separately from the clean clone; transcript above. |
| R1-B5 | Kept the unavailable checkout, price, and license promises removed. | Live rendered-link crawl in `audit/live-audit.json` found no checkout target and all HTTP links returned 200. |
| R1-B6 | Retained direct demo/legal routes, route titles and metadata, static HTTP 404, focus handoff, and route announcements. | `routes expose separate titles and a designed not-found page`; live audit covers `/`, `/demo`, legal routes, and 404. |
| R1-M1 / F-2-4 | Retained the single **Retry window** term and **Copy install command** action. | `uses Retry window and Copy install command consistently`; `.factory/copy-audit.md`. |
| R1-M2 / F-2-5 | Retained local touch/social assets, canonical and OG/Twitter metadata, and legal navigation. | `ships local touch and social assets with their declared dimensions`; live URL verifier reports on all four public routes. |
| R1-M3 | Retained the compact mobile navigation, 44 px controls, and no-overflow layout. | `fits a 390px viewport with Demo and Privacy navigation`; `mobile controls meet touch targets and reduced motion removes animation`; live audit reports no overflow. |
| R1-PWA1 | Retained the versioned service worker, online refresh behavior, and offline demo path. | `@claim:offline-demo`; `service worker uses a fresh online shell and retains an offline fallback`; live offline Reset passed. |
| R1-PWA2 | Retained responsive local art and small hashed bundles. | Clean-clone Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0. |
| F-3-3 | Retained **Show sample result** as an analysis action rather than a fill-only action. | `@claim:browser-sample-action`. |
| F-3-4 | Kept browser redaction as an accurate instruction, not an unsupported capability. | `.factory/copy-audit.md`; browser wording is visible in the cold root screenshot. |
| F-3-5 | Retained request-ID normalization wording and its observable browser fixture. | `@claim:browser-normalization`. |
| F-3-6 | Retained differing-label evidence wording and its observable shard fixture. | `@claim:browser-label-evidence`. |
| F-4-1 | Retained Home focus/announcement after browser Back or forward-cache restoration. | `routes expose separate titles and a designed not-found page`; live route audit covers a 404 → Terms Back focus handoff. |
| F-5-1 | Added `browser-retry-window` to the registry and a browser fixture that proves a 1.6-second pair has 0 copies at 0.5 s and 1 copy at 2 s. | `@claim:browser-retry-window`; live screenshot `/tmp/log-duplicate-lens-polish-5-live-pRfMxB/audit/live-retry-window.png`. |
| F-5-2 | Rewrote **Alert amplifier** as **Estimated alerts if every duplicate fires** and **Extra bytes** as **Extra log bytes**. Added `browser-impact-estimates`. | `@claim:browser-impact-estimates`; live fixture reports 1 copy, 2.00× alerts, and 1 B at `audit/live-impact-estimates.png`. |
| F-5-3 | Added a reusable static-route module that focuses each h1 without scrolling and populates `#route-announcer`; Privacy, Terms, and generated 404 now use it. | Route test covers Home → Privacy → Terms and 404 → Back; live screenshot `audit/live-privacy-focus.png`; `audit/live-audit.json` records focus/announcements. |
| F-5-4 | Generated the full shared footer for 404, including factory/version attribution and source link. | Route test asserts both; live screenshot `/tmp/log-duplicate-lens-polish-5-live-pRfMxB/audit/live-404-focus.png`; live unknown URL returns HTTP 404. |

## Verification

- Clean clone at `d1e0bc0`: `npm ci`, all 25 exact claim commands, `npm test`,
  `npm run build`, `npm run pack:cli`, and `npm run test:performance` passed.
- `npm test` passed 18 Rust tests, 4 Vitest tests, and 52 Playwright checks.
  The Playwright suite includes aXe serious/critical checks, keyboard, mobile,
  privacy interception, demo storage isolation, offline reset, routes, 404,
  metadata, and service-worker regression coverage.
- The release build emits `dist/site/`; CLI packaging passed with a 62.2 KiB
  crate (17.0 KiB compressed).
- Local URL verifier passed for `/` and `/demo`. Its cold screenshots are in
  `/tmp/log-duplicate-lens-polish-5-local-Tq2nx7/`.
- Post-deploy URL verifier passed for `/`, `/demo`, `/privacy/`, and `/terms/`:
  each has title, `lang`, one h1, main, image alt coverage, labeled controls,
  and no console errors.
- Post-deploy aXe found zero serious or critical violations on `/`, `/demo`,
  `/privacy/`, `/terms/`, and the HTTP-404 route. The live audit also confirmed
  all rendered HTTP links return 200, no off-origin demo request, and no live
  console error.

No review finding remains unresolved.
