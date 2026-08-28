# Log Duplicate Lens v0.1.0 — handoff

## Delivered

- A publishable Rust library and single `log-duplicate-lens` binary under `crates/log-duplicate-lens`.
- Streaming-compatible input surfaces for JSONL/plain lines plus bounded parsing for Loki `query_range` responses and JSON event arrays.
- RFC 3339 and Unix epoch timestamp parsing; configurable retry windows; built-in UUID, IP, embedded-time, and long-number normalization; custom normalization and report-redaction rules.
- Cross-stream-only candidate groups with stream identity, varying-label, retry-spread, byte, event-volume, and alert-inflation evidence. Reports explicitly avoid claiming that every match is erroneous.
- Explicit `--max-events`, `--max-groups`, and `--max-input-mb` resource ceilings (defaults: 250,000 / 10,000 / 128 MiB), stable schema-versioned `--json`, and exit codes 0/1/2/3.
- A responsive Vite landing/docs site and real in-browser local analyzer at `dist/site/`. It has sample, file, empty, error, offline, keyboard, 390 px mobile, and export paths.
- A distinctive mid-century instrument-panel system, documented in `.factory/design.md`, plus the original 94 KB `site/public/lens-cutaway.webp` hero. It was generated with `/opt/fleet/lib/gen-image.sh` using `factory-image`, then resized/stripped/compressed locally. The full prompt and provenance are recorded in the design file.
- One-time $29 Field Kit unlock through the Sociobot API contract: hosted checkout link, query-token capture and URL cleanup, local token storage, cached daily verification, optimistic offline unlock, restore form, and quiet invalid-license handling. Paid features are saved local presets and window-sensitivity comparison; analysis, evidence export, accessibility, and safety remain free.
- Privacy and terms pages, MIT license, README usage/install/deploy documentation, changelog, PWA shell cache, cache headers, CSP, manifest, sitemap, and no analytics/CDN/runtime third-party scripts.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run pack:cli
```

- `npm test`: passed on 2026-08-28 — 10 Rust tests, 4 browser-engine unit tests, and 10 Playwright tests across desktop and 390 px mobile Chromium.
- The Rust labeled sample detects 20/20 intentional cross-stream groups (100%, target ≥90%) with 0 false-positive groups (target <5%).
- `cargo clippy --workspace --all-targets -- -D warnings`: passed.
- `npm run build`: passed; produces `target/release/log-duplicate-lens` (2.5 MB) and `dist/site/index.html`. Total static output is 196 KB; initial JS is 12.54 KB raw / 5.07 KB gzip, CSS is 18.09 KB raw / 4.77 KB gzip, and the hero is 94 KB WebP.
- `npm run pack:cli`: passed package and clean package verification; crate archive is 16.1 KB compressed. Registry publishing was not attempted.
- `npm audit`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence`: passed with no console/page errors, title and `lang`, exactly one `h1`, a `main` landmark, and no missing image alt text.
- Axe via Playwright: no serious or critical violations on desktop or mobile.
- Lighthouse 12.8.2 mobile/local production build: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 120 ms, CLS 0. Lab Lighthouse does not emit a field INP value; the local analysis interaction is covered end to end and its intentional UI delay is 20 ms.

## Deploy and publish

- Static deploy root: `dist/site/` (contains `index.html`).
- Full build command: `npm run build`.
- Site-only work-order command: `npm run build:site`.
- CLI packaging command: `npm run pack:cli`. The factory owns registry/release credentials and should publish the generated crate/binaries.
- Register the `log-duplicate-lens` paid product with the Sociobot billing factory before release so the already-wired checkout and verify routes become active. No provider or product ID is hardcoded.

## Known gaps / next steps

- The browser workbench intentionally caps files at 5 MB and exposes the standard normalizer only. Large exports, custom mappings, redaction, and custom normalization belong in the CLI.
- Full Loki response parsing is bounded by the configured input byte ceiling; JSONL is the preferred format for very large samples.
- The repository ships source and a verified Cargo package, not prebuilt platform binaries. Add those in the release pipeline.
- Lighthouse numbers are localhost lab measurements; validate field INP after production traffic exists.
