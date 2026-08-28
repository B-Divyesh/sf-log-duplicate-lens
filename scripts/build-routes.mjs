import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const out = "dist/site";
await mkdir(join(out, "demo"), { recursive: true });
await cp(join(out, "index.html"), join(out, "demo", "index.html"));

const assets = await readdir(join(out, "assets"));
const stylesheet = assets.find((name) => name.startsWith("styles-") && name.endsWith(".css"));
if (!stylesheet) throw new Error("Could not find built stylesheet for the 404 route");

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#202a27"><meta name="description" content="The requested Log Duplicate Lens page was not found.">
<meta name="robots" content="noindex"><meta property="og:title" content="Page not found — Log Duplicate Lens">
<meta property="og:description" content="The requested Log Duplicate Lens page was not found.">
<meta property="og:image" content="https://log-duplicate-lens.sociobot.in/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Page not found — Log Duplicate Lens"><meta name="twitter:description" content="The requested Log Duplicate Lens page was not found."><meta name="twitter:image" content="https://log-duplicate-lens.sociobot.in/social-card.png">
<title>Page not found — Log Duplicate Lens</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"><link rel="stylesheet" href="/assets/${stylesheet}">
</head><body>
<a class="skip-link" href="#main">Skip to main content</a><div class="network-strip"><span class="status-lamp" aria-hidden="true"></span><span>Instrument route check</span></div>
<header class="site-header"><a class="wordmark" href="/" aria-label="Log Duplicate Lens home">LDL <span>Log Duplicate Lens<small>Local diagnostic · 0.1.0</small></span></a><nav aria-label="Primary navigation"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></header>
<main class="legal-main" id="main"><p class="eyebrow">Route not found</p><h1>This instrument page is not here</h1><p>Check the address, return home, or open the sample analysis.</p><p class="hero-actions"><a class="button button-primary" href="/">Go home</a><a class="button button-secondary" href="/demo">Open sample analysis</a></p></main>
<footer><a class="wordmark footer-mark" href="/">LDL <span>Log Duplicate Lens</span></a><p>Find suspected duplicate groups across Loki streams.</p><nav aria-label="Footer navigation"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer>
</body></html>`;
await mkdir(join(out, "404"), { recursive: true });
await writeFile(join(out, "404", "index.html"), html);
