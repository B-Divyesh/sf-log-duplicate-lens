# Log Duplicate Lens — polish 3 handoff

## Outcome

All findings from reviews 1–3 are closed. The product remains a Rust `clap`
single-binary CLI with a Vite static landing/demo site and its distinctive warm
instrument-panel visual system. The repaired site is live at
https://log-duplicate-lens.sociobot.in.

Functional repair commits are `f7072aa`, `c9558d0`, and `fb038e8`. Static
deployment `45af8a24-ae0b-45cf-9689-b2ce74b2f38e` completed through the work
order configuration (`npm ci && npm run build:site`, output `dist/site`).

## What changed

- Made both `/demo` and `?demo=1` open a fully analyzed, isolated sample with a
  persistent banner, Reset demo, Start for real, deterministic result focus,
  and banner-aware mobile positioning.
- Made **Show sample result** truthful: it loads and analyzes in one action.
- Added observable browser claims for the sample action, request-ID matching,
  differing-label evidence, and the self-hosted CLI recording. The registry now
  contains 23 claims.
- Replaced the static transcript with an original animated SVG recording based
  on the real bundled CLI demo; retained an accessible text transcript.
- Rewrote the unsupported browser-redaction promise as a safe instruction.
- Added distinct raw demo metadata, dynamic demo social titles, route focus and
  announcement assertions, route/legal/404 checks, keyboard coverage, touch
  target checks, and reduced-motion coverage.
- Kept local-only assets and privacy behavior. Deferred service-worker work and
  changed the recording animation to opacity-only motion for first-paint
  performance.
- Updated `.factory/design.md`, `.factory/demo.md`, `.factory/copy-audit.md`,
  `.factory/catalog-description.txt`, and `.factory/polish-3.md`.

## Verification

Clean clone `/tmp/log-duplicate-lens-final-mFN3Go/repo` at `fb038e8`:

- Every exact command in `.factory/claims.json`: 23 of 23 passed independently.
- `npm test`: 18 Rust tests, 4 Vitest tests, and 48 Playwright tests passed in
  Chromium and 390×844 mobile projects.
- Browser coverage includes claims, exports, malformed input, keyboard, focus,
  routing, titles, canonical metadata, 404, accessibility, privacy, touch
  targets, reduced motion, fresh service-worker navigation, and offline reset.
- `npm run build`: passed and produced `target/release/` plus `dist/site/`.
- `npm run pack:cli`: passed package verification; 62.2 KiB unpacked and
  17.0 KiB compressed.
- `npm run test:performance`: Lighthouse 95 performance, 100 accessibility,
  100 best practices, and 100 SEO; FCP 0.9 s, LCP 1.2 s, TBT 260 ms, CLS 0.
- Production assets: initial JS 10.84 kB raw / 4.45 kB gzip; CSS 20.51 kB raw /
  5.17 kB gzip; mobile hero 24.21 kB; no web fonts.

Cold production audit on 2026-08-28:

- Factory `verify-url.sh` returned HTTP 200 for root and demo, correct titles,
  `lang=en`, one h1, one main, zero missing alt text, zero unnamed buttons, and
  no console errors.
- In a fresh 390×844 context, the demo banner occupied y=4–106.14 and the
  focused result y=121.73–156.98. It showed two groups and three copies with no
  horizontal overflow, page errors, console errors, or off-origin requests.
- `?demo=1` added only `demo:log-duplicate-lens:active`; Reset retained it and
  reran the sample; Start for real removed it while preserving a seeded normal
  storage key.
- Root, demo, privacy, terms, the CLI recording, local metadata assets, and the
  GitHub source returned 200. `/not-a-real-route` returned the designed HTTP
  404. Each page had its correct title, one h1, one main, and legal links.
- Axe found zero serious or critical issues across root, demo, privacy, terms,
  and 404. A controlled service worker reloaded `/demo` offline, reset the
  sample, and announced the offline state. Reduced-motion duration was 0.00001 s.
- Screenshots and machine-readable evidence are under
  `.factory/evidence/polish-3-live/` in the worktree.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run pack:cli
npm run test:performance
```

Run each `test` command in `.factory/claims.json` separately for the claim
gate. Run `log-duplicate-lens demo` after installation for the bundled CLI
sample. Registry publishing remains the factory's responsibility.

## Known gaps

None.
