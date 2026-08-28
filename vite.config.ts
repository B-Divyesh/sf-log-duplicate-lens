import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: "site",
  publicDir: "public",
  build: {
    outDir: "../dist/site",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL("./site/index.html", import.meta.url)),
        privacy: fileURLToPath(new URL("./site/privacy/index.html", import.meta.url)),
        terms: fileURLToPath(new URL("./site/terms/index.html", import.meta.url)),
        legalRoute: fileURLToPath(new URL("./site/src/legal-route.ts", import.meta.url))
      }
    }
  }
});
