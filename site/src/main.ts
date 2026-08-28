import "./styles.css";
import { analyzeLogs, parseLogs, type DemoReport, type LogEvent } from "./analyzer";

const MAX_BROWSER_BYTES = 5 * 1024 * 1024;
const DEMO_KEY = "demo:log-duplicate-lens:active";
const sample = [
  { ts: "2026-08-28T02:14:06.000Z", msg: "checkout timed out request=614892", stream: { app: "checkout", shard: "original", pod: "api-7d9" } },
  { ts: "2026-08-28T02:14:06.184Z", msg: "checkout timed out request=614892", stream: { app: "checkout", shard: "auto-3", pod: "api-7d9" } },
  { ts: "2026-08-28T02:14:06.411Z", msg: "checkout timed out request=614892", stream: { app: "checkout", shard: "auto-7", pod: "api-7d9" } },
  { ts: "2026-08-28T02:14:09.000Z", msg: "health probe ok status=200", stream: { app: "checkout", shard: "original", pod: "api-7d9" } },
  { ts: "2026-08-28T02:15:40.000Z", msg: "inventory retry id=883421", stream: { app: "inventory", shard: "one" } },
  { ts: "2026-08-28T02:15:40.720Z", msg: "inventory retry id=119042", stream: { app: "inventory", shard: "two" } },
  { ts: "2026-08-28T02:18:01.000Z", msg: "order completed status=201", stream: { app: "checkout", shard: "original" } }
].map((entry) => JSON.stringify(entry)).join("\n");

const input = byId<HTMLTextAreaElement>("log-input");
const fileInput = byId<HTMLInputElement>("file-input");
const analyzeButton = byId<HTMLButtonElement>("analyze-button");
const exportButton = byId<HTMLButtonElement>("export-button");
const results = byId<HTMLElement>("results");
const errorBox = byId<HTMLElement>("input-error");
const isDemo = location.pathname === "/demo" || location.pathname === "/demo/" || new URLSearchParams(location.search).get("demo") === "1";
let currentReport: DemoReport | null = null;
let currentEvents: LogEvent[] = [];

function loadSample(analyze = false): void {
  input.value = sample;
  clearError();
  if (analyze) runAnalysis();
  else input.focus();
}

byId("sample-button").addEventListener("click", () => loadSample(true));
byId("demo-reset").addEventListener("click", () => loadSample(true));
byId("demo-exit").addEventListener("click", () => {
  for (const key of Object.keys(localStorage)) if (key.startsWith("demo:")) localStorage.removeItem(key);
  location.assign("/");
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  clearError();
  if (file.size > MAX_BROWSER_BYTES) {
    showError("That file is larger than the 5 MB browser limit. Use the CLI for larger exports.");
    return;
  }
  setReadoutState("Reading file…", true);
  try {
    input.value = await file.text();
    setReadoutState("Ready to analyze", false);
  } catch {
    showError("The browser could not read that file. Choose an uncompressed UTF-8 export.");
    setReadoutState("File error", false);
  }
});

analyzeButton.addEventListener("click", runAnalysis);
function runAnalysis(): void {
  clearError();
  setReadoutState("Analyzing locally…", true);
  window.setTimeout(() => {
    try {
      currentEvents = parseLogs(input.value);
      currentReport = analyzeLogs(currentEvents, selectedWindow());
      renderReport(currentReport);
      setReadoutState(currentReport.suspectedGroups ? "Evidence found" : "No cross-stream matches", false);
      exportButton.disabled = false;
      if (isDemo) {
        positionDemoResult();
      }
    } catch (error) {
      currentEvents = [];
      currentReport = null;
      exportButton.disabled = true;
      showError(error instanceof Error ? error.message : "The sample could not be analyzed.");
      setReadoutState("Input error", false);
      input.focus();
    }
  }, 20);
}

exportButton.addEventListener("click", () => {
  if (!currentReport) return;
  const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "log-duplicate-lens-report.json";
  anchor.click();
  URL.revokeObjectURL(url);
  exportButton.textContent = "Evidence exported";
  window.setTimeout(() => (exportButton.textContent = "Export JSON evidence"), 1600);
});

byId("copy-button").addEventListener("click", async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  try {
    await navigator.clipboard.writeText(byId("install-command").textContent ?? "");
    button.textContent = "Copied";
  } catch { button.textContent = "Select command above"; }
  window.setTimeout(() => (button.textContent = "Copy install command"), 1800);
});

function renderReport(report: DemoReport): void {
  byId("empty-readout").hidden = true;
  byId("metrics").hidden = false;
  byId("evidence").hidden = false;
  byId("metric-copies").textContent = String(report.duplicateCopies);
  byId("metric-percent").textContent = `${report.duplicatePercent.toFixed(1)}% of ${report.observedEvents} events`;
  byId("metric-alert").textContent = `${report.alertInflation.toFixed(2)}×`;
  byId("metric-bytes").textContent = formatBytes(report.extraBytes);
  const evidence = byId("evidence");
  evidence.replaceChildren();
  const title = document.createElement("h3");
  title.id = "result-heading";
  title.tabIndex = -1;
  title.textContent = `${report.groups.length} suspected duplicate ${report.groups.length === 1 ? "group" : "groups"}`;
  evidence.append(title);
  report.groups.slice(0, 8).forEach((group, index) => {
    const item = document.createElement("article");
    const heading = document.createElement("h4");
    heading.textContent = `Group ${String(index + 1).padStart(2, "0")} · ${group.copies} copies / ${group.streams} streams`;
    const message = document.createElement("code"); message.textContent = group.message;
    const detail = document.createElement("p"); detail.textContent = `${group.spreadMs.toFixed(0)} ms spread · varying ${group.differingLabels.join(", ") || "stream identity"}`;
    item.append(heading, message, detail); evidence.append(item);
  });
}

function selectedWindow(): number { return Number(document.querySelector<HTMLInputElement>('input[name="window"]:checked')?.value ?? 2000); }
function setReadoutState(label: string, busy: boolean): void { byId("readout-state").textContent = label; results.setAttribute("aria-busy", String(busy)); analyzeButton.disabled = busy; }
function showError(message: string): void { errorBox.textContent = message; errorBox.hidden = false; }
function clearError(): void { errorBox.textContent = ""; errorBox.hidden = true; }
function formatBytes(bytes: number): string { return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`; }

function setDemoHeadingOutline(): void {
  const homeHeading = byId("hero-title");
  const demoHeading = byId("workbench-title");
  const hiddenHomeHeading = document.createElement("h2");
  hiddenHomeHeading.id = homeHeading.id;
  hiddenHomeHeading.tabIndex = -1;
  hiddenHomeHeading.textContent = homeHeading.textContent;
  homeHeading.replaceWith(hiddenHomeHeading);

  const routeHeading = document.createElement("h1");
  routeHeading.id = demoHeading.id;
  routeHeading.tabIndex = -1;
  routeHeading.textContent = "Review the sample duplicate groups";
  demoHeading.replaceWith(routeHeading);
}

function positionDemoResult(): void {
  const heading = document.getElementById("result-heading");
  const banner = byId("demo-banner");
  if (!heading) return;

  // Route entry must settle before a claim or a keyboard user inspects it.
  // Override the decorative page scroll for this state transition only.
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const bannerOffset = banner.getBoundingClientRect().height + 20;
  const top = heading.getBoundingClientRect().top + window.scrollY - bannerOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  heading.focus({ preventScroll: true });
  requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
}

function updateNetwork(): void {
  const label = byId("network-label"); const strip = byId("network-strip");
  label.textContent = navigator.onLine ? "Local circuit ready · nothing uploaded" : "Offline · analysis and export still work locally";
  strip.classList.toggle("offline", !navigator.onLine);
}
window.addEventListener("online", updateNetwork); window.addEventListener("offline", updateNetwork); updateNetwork();

function restoreHomeRouteFocus(event: PageTransitionEvent): void {
  if (isDemo) return;
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (!event.persisted && navigation?.type !== "back_forward") return;

  const heading = byId("hero-title");
  heading.focus({ preventScroll: true });
  byId("route-announcer").textContent = "Log Duplicate Lens — find duplicate Loki logs";
}

// A demo opens as a separate document so native Back can use either a fresh
// load or the back/forward cache. `pageshow` covers both paths and returns a
// keyboard or screen-reader visitor to a meaningful home-route landmark.
window.addEventListener("pageshow", restoreHomeRouteFocus);

if (isDemo) {
  document.body.classList.add("demo-mode");
  setDemoHeadingOutline();
  localStorage.setItem(DEMO_KEY, "active");
  byId("demo-banner").hidden = false;
  document.title = "Demo — Log Duplicate Lens";
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", "https://log-duplicate-lens.sociobot.in/demo");
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", "Demo — Log Duplicate Lens");
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute("content", "Demo — Log Duplicate Lens");
  byId("route-announcer").textContent = "Demo — Log Duplicate Lens";
  loadSample(true);
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    window.setTimeout(() => navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => undefined), 3_000);
  }, { once: true });
}
function byId<T extends HTMLElement = HTMLElement>(id: string): T { const element = document.getElementById(id); if (!element) throw new Error(`Missing #${id}`); return element as T; }
