# Polish 4 — cumulative zero-finding closure

Repair commit: `358038d940bb609abffd5794247fc89728b48acd` (pushed to
`origin/main`). Deployed static artifact: `dist/site/`. Live URL:
https://log-duplicate-lens.sociobot.in.

The only open review-four issue was F-4-1. This repair restores a meaningful
home-route focus target and announces the returned route after browser Back or
forward-cache restoration. All earlier fixes remain present and were retested
from a new clone.

Evidence convention: every row names its clean-clone test. The cold full-root
screenshot is `evidence/polish-4-live/root/screenshot-desktop.png`; the mobile
demo and repaired Back path are captured in
`evidence/polish-4-live/audit/live-demo-mobile.png` and
`evidence/polish-4-live/audit/live-back-focus.png`. The matching live URL
status, metadata, storage, offline, link, focus, and axe checks are recorded
in `evidence/polish-4-live/audit/live-audit.json`.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Retained the direct job headline, named Loki operators, and the explicit sample action/result note. | Cold 390 px live audit records the headline in `audit/live-audit.json`; [root mobile screen](evidence/polish-4-live/root/screenshot-mobile.png); live `/` = 200. |
| R1-B2 | Retained one-click `/demo` and `?demo=1` sample analysis, persistent banner, Reset demo, Start for real, and the `demo:` namespace. | `@claim:sample-analysis`, `@claim:demo-mobile-result`, `@claim:demo-isolation`; [live demo mobile](evidence/polish-4-live/audit/live-demo-mobile.png); live `/demo` = 200. |
| R1-B3 | Retained the bundled seven-record CLI `demo`, temporary report output, local SVG recording, and text transcript. | `claim_cli_demo_runs_without_an_input_path`, `@claim:cli-demo-recording`; live `/cli-demo.svg` loaded during link audit. |
| R1-B4 | Retained the checked claims registry and truthful Reset-versus-Start-for-real storage wording. | All 23 registry commands passed separately from fresh clone; `@claim:demo-isolation`; live storage record in `audit/live-audit.json`. |
| R1-B5 | Kept the unavailable paid checkout, price, and license promises removed. | Live rendered-link crawl in `audit/live-audit.json` found only working site and source links; no checkout target remains. |
| R1-B6 | Retained direct demo/legal routes, distinct metadata, and the designed HTTP 404. | `routes expose separate titles and a designed not-found page`; live `/demo` = 200 and `/not-a-real-route` = 404 in `audit/live-audit.json`. |
| R1-M1 | Retained plain action names and the consistent **Retry window** term. | `uses Retry window and Copy install command consistently`; live root screenshot and copy audit. |
| R1-M2 | Retained canonical/OG/Twitter metadata, local 180 px touch icon, 1200×630 social card, and legal navigation. | `ships local touch and social assets with their declared dimensions`; live route audit and link crawl. |
| R1-M3 | Retained the compact 390 px layout with Demo and Privacy navigation and 44 px controls. | `fits a 390px viewport with Demo and Privacy navigation`; `mobile controls meet touch targets and reduced motion removes animation`; live audit reports overflow `0`. |
| R1-PWA1 | Retained the versioned service-worker shell and offline demo reset path. | `@claim:offline-demo`; live offline Reset passed in `audit/live-audit.json`. |
| R1-PWA2 | Retained the responsive local art, small bundles, and deferred service-worker work. | `npm run test:performance`: 100/100/100/100; JS 4.55 kB gzip, CSS 5.17 kB gzip. |
| F-2-1 | Kept demo result-first on a phone: sticky notice and populated result are in one viewport. | `@claim:demo-mobile-result`; [live mobile demo](evidence/polish-4-live/audit/live-demo-mobile.png); live `/` → `/demo` check. |
| F-2-2 | Kept privacy copy accurate: Reset reruns the sample; Start for real clears only `demo:` data. | `@claim:demo-isolation`; live `real:polish-4-probe` preservation in `audit/live-audit.json`. |
| F-2-3 | Retained observable registry coverage for browser, CLI, privacy, format, limits, export, and offline statements. | Every `claims.json` command passed independently; command log `/tmp/log-duplicate-lens-polish4-claims.log`. |
| F-2-4 | Kept **Retry window** and **Copy install command** as the single control/action names. | `uses Retry window and Copy install command consistently`; live `/` check. |
| F-2-5 | Kept local touch/social assets with their declared sizes on all routes. | `ships local touch and social assets with their declared dimensions`; live root metadata audit. |
| F-3-1 | Kept the mobile demo transition deterministic with an instant banner-aware scroll and focus. | Exact `@claim:demo-mobile-result` passed from fresh clone; live screenshot and bounds check in `audit/live-audit.json`. |
| F-3-2 | Kept the self-hosted animated SVG capture of the real CLI command with an accessible transcript. | `@claim:cli-demo-recording`; live `/cli-demo.svg` = 200 in link audit. |
| F-3-3 | Kept **Show sample result** as a truthful one-activation sample analysis action. | `@claim:browser-sample-action`; live demo readout shows three copies. |
| F-3-4 | Kept the browser sentence as safety guidance rather than an unsupported redaction capability. | `.factory/copy-audit.md`; live root copy in `root/screenshot-desktop.png`. |
| F-3-5 | Kept request-ID normalization explained and covered by a browser fixture. | `@claim:browser-normalization`; fresh-clone claim log. |
| F-3-6 | Kept browser differing-label evidence explained and covered by a shard fixture. | `@claim:browser-label-evidence`; fresh-clone claim log. |
| F-4-1 | Added `pageshow` handling for Back/forward-cache restoration. Returning to `/` focuses `#hero-title` and announces **Log Duplicate Lens — find duplicate Loki logs**. Added end-to-end assertions. | `routes expose separate titles and a designed not-found page`; [live Back-focus screen](evidence/polish-4-live/audit/live-back-focus.png); live `audit/live-audit.json` reports `focusId: hero-title`. |

## Verification

- Fresh clone `/tmp/log-duplicate-lens-polish4-clean-u6Y2Z5` at
  `358038d940bb609abffd5794247fc89728b48acd`: `npm ci`, every one of the 23
  exact `claims.json` commands, `npm test`, `npm run build`, `npm run
  pack:cli`, and `npm run test:performance` all passed.
- The full suite covers 18 Rust tests, 4 Vitest tests, and 48 Playwright tests,
  including accessibility, privacy request interception, storage isolation,
  offline demo reset, keyboard operation, mobile layout, routes, metadata, and
  service-worker behavior.
- Lighthouse from the release build: performance 100, accessibility 100, best
  practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 50 ms, CLS 0.
- Post-deploy `verify-url.sh` passed for live `/` and `/demo`; the reports and
  cold screenshots are under `.factory/evidence/polish-4-live/`.
- Post-deploy Playwright + axe audit found zero serious/critical violations on
  `/`, `/demo`, `/privacy/`, `/terms/`, and the HTTP-404 route. The same audit
  checked direct `?demo=1`, storage isolation, Reset/Start-for-real, no
  off-origin demo requests, offline reset, mobile overflow, Back focus, titles,
  one h1/main per route, and rendered links.

No review finding remains unresolved.
