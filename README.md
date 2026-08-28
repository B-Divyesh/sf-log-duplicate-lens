# Log Duplicate Lens

An offline-first CLI for Loki and JSON-log operators who need to measure suspected duplicate ingestion across streams. Lens normalizes noisy message fields, groups equal messages within a timestamp tolerance, and reports volume, alert, label, and retry evidence without uploading logs or declaring that every repeated line is an error.

Live documentation and local demo: <https://log-duplicate-lens.sociobot.in>

## Install

Download a release binary, or build the single binary from source:

```sh
cargo install --path crates/log-duplicate-lens
```

Version 0.1.0 supports Linux, macOS, and Windows anywhere Rust can compile.

## Usage

Analyze `logcli --output=jsonl` output with the default two-second tolerance:

```sh
log-duplicate-lens loki.jsonl
```

Analyze a Loki `query_range` JSON response, redact secrets before they enter the report, and write machine-readable evidence:

```sh
log-duplicate-lens export.json \
  --format loki \
  --window 1500ms \
  --redact 'token=[^ ]+=>token=[REDACTED]' \
  --json > duplicate-report.json
```

Read newline-delimited text from standard input and disable built-in UUID, IP, and number normalization:

```sh
journalctl -o cat | log-duplicate-lens - --format text --normalize none
```

Useful controls:

- `--message-field`, `--timestamp-field`, and `--stream-field` map custom JSONL records.
- `--ignore-label pod` removes volatile labels from stream identity and evidence.
- `--max-events 250000` and `--max-groups 10000` put explicit bounds on analysis memory.
- `--fail-on-duplicates` exits with code 3 when suspected cross-stream groups are found. Invalid input exits 2; I/O errors exit 1.
- `--json` provides a stable, typed report surface for scripts.

Lens accepts plain text, JSONL records, Loki JSONL (`timestamp`, `line`, and `labels`), and Loki `query_range` stream responses. Timestamps may be RFC 3339 or Unix seconds/milliseconds/microseconds/nanoseconds. Lines without timestamps receive deterministic sequence timestamps and are compared by adjacency.

## Interpretation

A group is a **suspected amplification cluster**, not proof of bad ingestion. Lens only reports groups that cross distinct stream identities, then shows the labels that differ and the observed retry timing. Confirm the producer, retry, or sharding behavior before changing ingestion.

## Develop and verify

Requirements: Rust 1.85+, Node 22+, and npm 10+.

```sh
npm ci
npm run dev
npm test
npm run build
npm run pack:cli
npm run test:performance
```

`npm run build` produces the release binary under `target/release/` and the deployable static site at `dist/site/`. The site build stamps a content-derived service-worker cache key, uses network-first document navigation with an offline shell fallback, and sends `sw.js` with `Cache-Control: no-cache` on Static Web Apps. `npm run pack:cli` runs `cargo package` without publishing. `npm run test:performance` runs reproducible mobile Lighthouse against the production build and requires Performance ≥90 and the other audited categories ≥95.

## Privacy

CLI analysis is entirely local and contains no telemetry. The browser demo also processes selected files in the browser. The site stores a license token, a daily verification result, and optional paid investigation presets in local storage only. See the [privacy notice](https://log-duplicate-lens.sociobot.in/privacy/).

## License

MIT © 2026 Sociobot (Param Factory). See [LICENSE](LICENSE).
