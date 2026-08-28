# Polish 2 — zero-finding closure

Repair commits: `bfb8aa4435348cd0051696feea68f8103e57242b`,
`e3f29f8`, and `a2f04a6`. Deployed from `a2f04a6` on 2026-08-28 to
https://log-duplicate-lens.sociobot.in.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Kept the direct first-screen headline, audience, action, and result note. | `.factory/copy-audit.md`; cold live 390 px root check. |
| R1-B2 / F-2-1 | Demo mode hides the landing-only hero, puts the readout first, keeps the notice sticky, focuses and scrolls the result heading, and uses the `demo:` namespace. | `@claim:demo-mobile-result`, `@claim:demo-isolation`; `.factory/evidence/polish-2-live/mobile-demo-result.png`; live `/` → `/demo` gave banner `[4,98]` and result `[251,287]` in 390×844. |
| R1-B3 | Retained the bundled seven-record CLI demo and temporary report path. | `claim_cli_demo_runs_without_an_input_path`; live terminal transcript on `/`. |
| R1-B4 / F-2-2 | Corrected Privacy and README: Reset reruns the sample; only leaving demo removes its marker. | `@claim:demo-isolation`; live `/privacy/` text and live Reset/Start-for-real storage check. |
| R1-B4 / F-2-3 | Expanded `claims.json` from 7 to 19 observable claims for browser-local processing, input forms, site privacy, CLI detection/JSON/evidence/Loki/window/limits/redaction/local use, and existing demo guarantees. | Every listed command passed from clean clone `/tmp/log-duplicate-lens-clean-round2`; final `npm test` passed 36 browser tests. |
| R1-B5 | The unavailable paid checkout remains absent; no purchase claim or dead checkout link remains. | Live route/link check; no checkout URL in rendered root. |
| R1-B6 | Retained real `/demo`, `?demo=1`, title handling, designed HTTP 404, legal routes, focus to demo result, and route announcement. | Live `/demo` 200 with demo title; `/not-a-real-route` 404; route browser test. |
| R1-M1 / F-2-4 | Standardized the UI and README on **Retry window** and renamed the control **Copy install command**. | `uses Retry window and Copy install command consistently`; live control name check. |
| R1-M2 / F-2-5 | Added local `apple-touch-icon.png` (180×180) and `social-card.png` (1200×630), referenced across home, legal, and generated 404 routes. | `ships local touch and social assets with their declared dimensions`; live assets both 200. |
| R1-M3 | Retained the compact mobile navigation and zero-overflow layout. | Live 390 px check reports `overflow: 0`; mobile Playwright project passed. |
| R1-PWA1 | Retained versioned SW cache, online shell refresh, and offline fallback. | `service worker uses a fresh online shell and retains an offline fallback`. |
| R1-PWA2 | Retained responsive WebP and deferred below-fold rendering. | `npm run test:performance`: 100/100/100/100; 4.22 kB gzip JS, 5.07 kB gzip CSS. |
| Live a11y follow-up | Added an accessible name for the deferred install control and made the scrollable evidence pane focusable and labeled. | `/opt/fleet/lib/verify-url.sh` reports zero unnamed buttons; live aXe serious/critical list is empty; `demo evidence pane remains keyboard-accessible`. |

## Live evidence

- `/demo`: 200, title **Demo — Log Duplicate Lens**, one h1, one main, no
  missing image alt text, no console errors, and no unnamed controls.
- Fresh `?demo=1`: two groups, three duplicate copies, only
  `demo:log-duplicate-lens:active`; Reset kept that marker and Start for real
  removed it.
- The fresh 390×844 click path showed both the sticky demo banner and result
  heading in the viewport. It made no off-origin request and had no page error.
- `/`, `/demo`, `/privacy/`, `/terms/`, touch icon, and social card returned
  200. `/not-a-real-route` returned 404.
- Live aXe found zero serious or critical violations. Screenshots and verifier
  JSON are in `.factory/evidence/polish-2-live/` (ignored build evidence).
