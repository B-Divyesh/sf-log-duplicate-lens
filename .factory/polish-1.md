# Polish 1 — finding closure

Candidate repaired: b7e8c29eef035e2a71aaf5780cdb5f450c428dba.
Live checked: 2026-08-28 at https://log-duplicate-lens.sociobot.in.

| Review finding | Change made | Evidence |
| --- | --- | --- |
| R1-B1 first-screen clarity | Rewrote the headline, audience sentence, primary action, and three facts. | .factory/copy-audit.md; live root title and 390 px screenshot .factory/evidence/home-mobile.png |
| R1-B2 one-click isolated demo | /demo and ?demo=1 preload/analyze the seven-record sample; banner has Reset demo and Start for real; only demo-prefixed storage is used. | @claim:sample-analysis; @claim:demo-isolation; live-demo-mobile.png |
| R1-B3 CLI demo/sample | Added bundled examples/labeled-sample.jsonl and log-duplicate-lens demo, which writes a new temporary report path. Added a self-hosted terminal transcript. | cargo test --test cli claim_cli_demo_runs_without_an_input_path |
| R1-B4 claims registry | Added .factory/claims.json with seven observable claim commands and browser/CLI claim coverage. | all listed claim commands passed |
| R1-B5 dead checkout | Removed the unavailable paid offer, checkout, license storage, and merchant/refund promises. | live link crawl has no checkout destination |
| R1-B6 demo/404 routes | Built a real demo output route and a designed 404 with Home/Demo links; SWA now returns HTTP 404 for unknown paths. | live /demo demo result; curl /not-a-real-route = 404 |
| R1-M1 wording/terminology/actions | Rewrote headings, actions, README, and labels around “suspected duplicate group.” | .factory/copy-audit.md; npm test |
| R1-M2 metadata/navigation | Added canonical, Open Graph, Twitter, apple-touch metadata; consistent Home/Demo/Privacy/Terms shell; live announcement/focus for demo. | routes test; verify-url.sh live report |
| R1-M3 mobile layout | Kept all four primary links in a 390 px header, stacked controls/readouts, and retained 44 px targets. | mobile Playwright project; home-mobile.png |
| R1-PWA1 stale shell | Preserved the content-versioned service worker and its network-first document path. | service worker regression in npm test |
| R1-PWA2 performance | Retained responsive original WebP and content-visibility path. | npm run test:performance: 100/100/100/100 |

## Live re-check

A cold 390 × 844 Chromium context at /demo reported title “Demo — Log Duplicate
Lens,” the persistent banner, two suspected duplicate groups, three duplicate
copies, zero horizontal overflow, only demo:log-duplicate-lens:active storage,
and no page errors. ?demo=1 gave the same demo title and banner. Root, Privacy,
and Terms returned 200; an unknown route returned 404. Evidence screenshot:
.factory/evidence/live-demo-mobile.png.
