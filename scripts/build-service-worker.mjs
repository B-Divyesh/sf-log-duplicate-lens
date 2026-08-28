import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}/dist/site`;
const shellFiles = [
  "index.html",
  "privacy/index.html",
  "terms/index.html",
  "lens-cutaway-640.webp",
  "lens-cutaway.webp",
  "cli-demo.svg",
  "favicon.svg",
  "manifest.webmanifest"
];
const contents = await Promise.all(shellFiles.map((file) => readFile(`${dist}/${file}`)));
const version = createHash("sha256").update(Buffer.concat(contents)).digest("hex").slice(0, 16);
const template = await readFile(`${root}/site/sw.template.js`, "utf8");
await writeFile(`${dist}/sw.js`, template.replace("__CACHE_VERSION__", version));
console.log(`Stamped service worker cache ${version}`);
