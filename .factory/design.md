# Log Duplicate Lens — visual thesis

## Direction: mid-century instrument panel

The product is an investigative instrument, not another observability dashboard. Its landing page and local demo borrow from 1950s–60s field analyzers: warm enamel, dark phenolic panels, cream paper readouts, engraved labels, calibrated ticks, and a single amber warning lamp. The visual metaphor makes the job legible: many incoming traces pass through a lens and resolve into one probable event. Decoration is functional—scales mean ratios, traces mean streams, and numbered steps mean the investigation sequence.

This is intentionally a single, warm-light mode. Repainting the panel as a generic dark theme would weaken the physical-instrument metaphor. Every page explicitly paints its background.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| `panel` | `#202A27` | Primary phenolic instrument face |
| `panel-raised` | `#2C3732` | Raised controls and output well |
| `paper` | `#F3E9D2` | Warm documentation and readout field |
| `paper-deep` | `#DED0B2` | Rules and inset paper areas |
| `ink` | `#17201D` | Text on paper |
| `ink-soft` | `#4E5A54` | Secondary copy on paper |
| `chalk` | `#F7F0E1` | Text on panel |
| `chalk-soft` | `#C6D0C8` | Secondary panel copy |
| `signal` | `#F2A43B` | Primary actions and suspected amplification |
| `signal-dark` | `#A85716` | Signal text/rules on paper |
| `scope` | `#63B7A0` | Healthy/local/private state |
| `danger` | `#C95043` | Input and verification errors |

All normal text/background combinations meet WCAG AA. Signal color never carries state alone; it is paired with words, shapes, or values.

## Type

- Display and labels: `Arial Narrow`, `Roboto Condensed`, `Liberation Sans Narrow`, sans-serif. Condensed uppercase titling evokes engraved equipment labels without downloading a font.
- Readouts and code: `ui-monospace`, `SFMono-Regular`, `Cascadia Mono`, `Liberation Mono`, monospace. Tabular figures keep ratios and byte counts steady.
- Body: `Inter`-like native stack (`system-ui`, `Segoe UI`, sans-serif), 16–18px with 1.55 leading. No third-party font requests.
- Scale: 14, 16, 18, 24, 40, and responsive 64px. The site has exactly one `h1`.

## Spacing and shape

An 8px base rhythm governs page spacing, with 4px reserved for fine label gaps. Content width is 1180px and prose is capped near 68 characters. Corners are modest (4–12px), closer to fabricated housings than soft consumer cards. One-pixel rules, inset shadows, and screw-head details create depth. Independent readouts receive bordered housings; ordinary copy is grouped by whitespace instead of cards. Targets are at least 44×44px.

## Interaction grammar

- Primary controls resemble amber illuminated keys; secondary controls are cream outlined keys.
- Focus is a high-contrast double ring: cream then amber.
- The demo follows a physical sequence: **Load sample / choose file → calibrate window → inspect readout → export evidence**.
- File analysis is local. A persistent scope label says “Local circuit · nothing uploaded.” Offline state is calm and explicit; analysis remains available while license revalidation waits.
- Mobile drops ornamental scale ticks and stacks the control/readout regions; it retains the input, result, evidence, export, and legal routes.

## Motion policy

On first reveal, trace lines draw once and the ratio needle settles over 480ms using transform/opacity only. Result numbers cross-fade over 180ms. Buttons move by 1px while pressed, like panel keys. Nothing loops. Under `prefers-reduced-motion: reduce`, drawing and needle travel are removed and states update instantly.

## Original asset plan and provenance

- `site/public/lens-cutaway.webp`: generated specifically for this product with the factory image generator (`factory-image`) on 2026-08-28, then converted locally to WebP. `site/public/lens-cutaway-640.webp` is its locally resized, WebP-encoded responsive derivative for the mobile first paint. Prompt: “A wide editorial cutaway illustration of a fictional mid-century log signal analyzer on a workbench, dark forest-green enamel casing, cream paper chart, three thin input traces converging through a glass lens into one amber output pulse, precise 1960s technical manual gouache and screen-print texture, warm studio light, no people, no brand, no letters, no numbers, no readable text, no watermark, restrained palette of forest green, parchment, amber and muted teal, generous negative space, landing-page hero, straight-on three-quarter view.” Generated asset is original to this repository; no third-party source material.
- UI marks, dividers, trace diagrams, knobs, and the logo monogram are hand-authored in CSS/inline SVG and contain no external artwork.
