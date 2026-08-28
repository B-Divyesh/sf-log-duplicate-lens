# Polish 3 — cumulative zero-finding closure

Release candidate repaired: `0d5328821a410afe6220d93a8834f38f39107d66`.
Review baseline: `8a39b8cb56807d86623659d6c5ef94f60f0214bc`.
Functional repair commits: `f7072aa`, `c9558d0`, and `fb038e8`.
Live URL: https://log-duplicate-lens.sociobot.in.

## Finding map

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-B1 — first-screen clarity | Kept the direct six-word job headline, named Loki operators and the problem in one sentence, and paired **Try it with sample data** with the exact result. | `@claim:sample-analysis`; `.factory/copy-audit.md`; cold live root check at 390×844. |
| R1-B2 / F-2-1 / F-3-1 — one-click mobile demo | `/demo` and `?demo=1` analyze immediately. Demo entry now performs an instant banner-aware scroll and focuses the result, eliminating the smooth-scroll race. The sticky notice, Reset demo, and Start for real remain visible and usable. | `@claim:demo-mobile-result`; `@claim:sample-analysis`; `.factory/evidence/polish-3-live/mobile-demo-result.png`; live bounds: banner y=4–106.14, result y=121.73–156.98 in 390×844. |
| R1-B3 / F-3-2 — real CLI demo and recording | Retained `log-duplicate-lens demo`, the bundled seven-record fixture, and its temporary report. Replaced the static mock-up with an original, self-hosted animated SVG capture of the real command and output, plus an expandable HTML transcript. | `claim_cli_demo_runs_without_an_input_path`; `@claim:cli-demo-recording`; `.factory/evidence/polish-3-live/cli-recording.png`; live `/cli-demo.svg` = 200 and 960×360. |
| R1-B4 / F-2-2 — truthful demo storage | Privacy, README, and demo docs now agree: Reset reruns the sample and keeps the demo marker; Start for real removes demo-prefixed keys. Normal storage remains untouched. | `@claim:demo-isolation`; live `?demo=1` test preserved `real:review-probe`, removed only `demo:log-duplicate-lens:active`, and retained three copies after Reset. |
| R1-B4 / F-2-3 — complete claims registry | Expanded the registry from 19 to 23 entries and kept observable tests for every earlier browser, privacy, format, export, limit, offline, and CLI statement. | All 23 exact commands in `.factory/claims.json` passed separately from clean clone `/tmp/log-duplicate-lens-final-mFN3Go/repo`; log `/tmp/log-duplicate-lens-claims-final.log`. |
| R1-B5 — dead purchase path | The unavailable paid tier, checkout, license storage, merchant, refund, and price claims remain removed. The free CLI and browser product are complete. | Live link crawl: root, demo, legal routes, assets, and GitHub return 200; rendered site contains no checkout URL. |
| R1-B6 — real routes and 404 | Kept direct `/demo`, `/privacy/`, `/terms/`, a generated styled 404, history/back behavior, route announcement, and focus movement. Generated `/demo` source now has its own title, description, and canonical before JavaScript runs. | `routes expose separate titles and a designed not-found page`; live `/not-a-real-route` = HTTP 404; cold live route audit reports one h1 and one main on every route. |
| R1-M1 / F-2-4 — plain, consistent controls | Retained **Retry window** and **Copy install command** everywhere. Updated the remaining capability copy to concrete verbs and removed unexplained normalization wording. | `uses Retry window and Copy install command consistently`; `.factory/copy-audit.md`. |
| R1-M2 / F-2-5 — metadata, navigation, and local assets | Retained route-specific titles/descriptions/canonicals, Open Graph/Twitter fields, consistent Home/Demo/Privacy/Terms links, local 180×180 touch icon, and local 1200×630 social image. Demo Open Graph/Twitter titles now update with its route. | `ships local touch and social assets with their declared dimensions`; route test; live asset/status crawl; `verify-url.sh` root and demo reports. |
| R1-M3 — mobile layout | Kept the instrument-panel identity while making navigation, demo controls, export, and wordmark at least 44 px; adjacent mobile links have 8 px spacing and the 390 px layout has no overflow. | `fits a 390px viewport with Demo and Privacy navigation`; `mobile controls meet touch targets and reduced motion removes animation`; live mobile screenshot. |
| R1-PWA1 — fresh and offline shell | The versioned service worker precaches `/demo` and the recording, uses network-first navigation online, and provides the shell offline. Registration is deferred until after first paint. | `@claim:offline-demo`; `service worker uses a fresh online shell and retains an offline fallback`; `.factory/evidence/polish-3-live/offline-demo.png`. |
| R1-PWA2 — performance | Limited the SVG recording to opacity motion and deferred service-worker registration. The site still ships small hashed JS/CSS and responsive product art. | Clean-clone Lighthouse: 95 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s, CLS 0. JS 4.45 kB gzip; CSS 5.17 kB gzip. |
| F-3-3 — misleading sample action | Renamed the action **Show sample result** and made one activation both load and analyze the sample. | `@claim:browser-sample-action`; live workbench produced three duplicate copies after one activation. |
| F-3-4 — unsupported browser redaction | Replaced the browser promise with the accurate instruction: **Remove sensitive values from this input before exporting.** CLI redaction remains documented separately and tested. | `.factory/copy-audit.md`; `claim_cli_redaction_removes_a_secret_from_the_report`; live root copy check. |
| F-3-5 — unlisted normalization claim | Rewrote the step as **Ignore changing request IDs when matching messages** and registered an observable two-stream fixture. | `@claim:browser-normalization`; live fixture with request IDs 12345/67890 produced one group. |
| F-3-6 — unlisted label-evidence claim | Rewrote the step as **List labels that differ between streams** and registered an observable shard fixture. | `@claim:browser-label-evidence`; live evidence contained `varying shard`. |

## Full verification

- Clean clone: `/tmp/log-duplicate-lens-final-mFN3Go/repo` at `fb038e8`.
- `npm test`: 18 Rust tests, 4 Vitest tests, and 48 Playwright tests passed.
- All 23 claim commands ran independently and passed.
- `npm run build`: release CLI and `dist/site/` built successfully.
- `npm run pack:cli`: package verification passed; 62.2 KiB unpacked and 17.0 KiB compressed.
- `npm run test:performance`: 95 / 100 / 100 / 100; FCP 0.9 s, LCP 1.2 s, TBT 260 ms, CLS 0.
- Live cold audit: no page or console errors, no off-origin demo requests, zero serious/critical axe violations across root, demo, privacy, terms, and 404, and successful offline demo reload/reset.

No review finding remains open.
