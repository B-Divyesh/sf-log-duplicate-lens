import "./styles.css";
import { analyzeLogs, parseLogs, type DemoReport, type LogEvent } from "./analyzer";

const PRODUCT = "log-duplicate-lens";
const API = "https://api.sociobot.in/api/v1";
const LICENSE_KEY = `sb_license:${PRODUCT}`;
const VERDICT_KEY = `sb_license_verdict:${PRODUCT}`;
const PRESETS_KEY = `sb_presets:${PRODUCT}`;
const MAX_BROWSER_BYTES = 5 * 1024 * 1024;
const DAY = 86_400_000;

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
let currentReport: DemoReport | null = null;
let currentEvents: LogEvent[] = [];

byId("sample-button").addEventListener("click", () => {
  input.value = sample;
  clearError();
  input.focus();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  clearError();
  if (file.size > MAX_BROWSER_BYTES) {
    showError("That file is larger than the 5 MB browser limit. Use the CLI with explicit memory bounds instead.");
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

analyzeButton.addEventListener("click", () => {
  clearError();
  setReadoutState("Analyzing locally…", true);
  window.setTimeout(() => {
    try {
      currentEvents = parseLogs(input.value);
      currentReport = analyzeLogs(currentEvents, selectedWindow());
      renderReport(currentReport);
      setReadoutState(currentReport.suspectedGroups ? "Evidence found" : "No cross-stream matches", false);
      exportButton.disabled = false;
    } catch (error) {
      currentEvents = [];
      currentReport = null;
      exportButton.disabled = true;
      showError(error instanceof Error ? error.message : "The sample could not be analyzed.");
      setReadoutState("Input error", false);
      input.focus();
    }
  }, 20);
});

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
  const command = byId("install-command").textContent ?? "";
  try {
    await navigator.clipboard.writeText(command);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Select command above";
  }
  window.setTimeout(() => (button.textContent = "Copy command"), 1800);
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
  if (!report.observedEvents) {
    evidence.append(buildNotice("The sample is empty", "Paste JSONL or load the labeled example, then analyze again."));
    return;
  }
  if (!report.groups.length) {
    evidence.append(buildNotice("No cross-stream matches in this window", "Try a wider tolerance only if the producer’s retry timing supports it."));
    return;
  }
  const title = document.createElement("h3");
  title.textContent = `${report.groups.length} suspected amplification ${report.groups.length === 1 ? "group" : "groups"}`;
  evidence.append(title);
  report.groups.slice(0, 8).forEach((group, index) => {
    const item = document.createElement("article");
    const heading = document.createElement("h4");
    heading.textContent = `Signal ${String(index + 1).padStart(2, "0")} · ${group.copies} copies / ${group.streams} streams`;
    const message = document.createElement("code");
    message.textContent = group.message;
    const detail = document.createElement("p");
    detail.textContent = `${group.spreadMs.toFixed(0)} ms spread · varying ${group.differingLabels.join(", ") || "stream identity"} · fingerprint ${group.fingerprint}`;
    item.append(heading, message, detail);
    evidence.append(item);
  });
}

function buildNotice(title: string, copy: string): HTMLElement {
  const notice = document.createElement("div");
  notice.className = "result-notice";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = copy;
  notice.append(strong, paragraph);
  return notice;
}

function selectedWindow(): number {
  return Number(document.querySelector<HTMLInputElement>('input[name="window"]:checked')?.value ?? 2000);
}

function setReadoutState(label: string, busy: boolean): void {
  byId("readout-state").textContent = label;
  results.setAttribute("aria-busy", String(busy));
  analyzeButton.disabled = busy;
}

function showError(message: string): void {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError(): void {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function updateNetwork(): void {
  const label = byId("network-label");
  const strip = byId("network-strip");
  if (navigator.onLine) {
    label.textContent = "Local circuit ready · nothing uploaded";
    strip.classList.remove("offline");
  } else {
    label.textContent = "Offline · analysis and export still work locally";
    strip.classList.add("offline");
  }
}
window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);
updateNetwork();

interface Verdict {
  valid: boolean;
  reason: string;
  checkedAt: number;
}

function consumeReturnedLicense(): string | null {
  const url = new URL(window.location.href);
  const returned = url.searchParams.get("license");
  if (returned) {
    localStorage.setItem(LICENSE_KEY, returned);
    url.searchParams.delete("license");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    return returned;
  }
  return localStorage.getItem(LICENSE_KEY);
}

async function initializeLicense(): Promise<void> {
  const token = consumeReturnedLicense();
  const cached = parseStored<Verdict>(VERDICT_KEY);
  if (token && cached?.valid) unlockFieldKit("Field Kit ready");
  if (!token) return;
  if (cached && Date.now() - cached.checkedAt < DAY) {
    if (cached.valid) unlockFieldKit("Field Kit ready");
    return;
  }
  await verifyLicense(token, false);
}

async function verifyLicense(token: string, announce: boolean): Promise<void> {
  const message = byId("license-message");
  if (announce) message.textContent = "Checking license…";
  try {
    const response = await fetch(`${API}/products/${PRODUCT}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error("Verification service unavailable");
    const data = (await response.json()) as { valid?: boolean; reason?: string };
    const verdict: Verdict = { valid: data.valid === true, reason: data.reason ?? "invalid", checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    if (verdict.valid) {
      localStorage.setItem(LICENSE_KEY, token);
      unlockFieldKit("Field Kit verified");
      message.textContent = "License active. Presets and sensitivity comparison are unlocked.";
    } else {
      lockFieldKit("License no longer active");
      message.textContent = `This license is ${verdict.reason.replace("_", " ")}. You can purchase a new Field Kit below.`;
    }
  } catch {
    message.textContent = navigator.onLine
      ? "License verification is unavailable. The free analyzer still works; try again later."
      : "Offline. The free analyzer still works; license verification will wait for a connection.";
  }
}

byId<HTMLFormElement>("license-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = byId<HTMLInputElement>("license-token").value.trim();
  if (!token) {
    byId("license-message").textContent = "Paste the token from your purchase email first.";
    return;
  }
  localStorage.setItem(LICENSE_KEY, token);
  await verifyLicense(token, true);
});

function unlockFieldKit(state: string): void {
  byId("license-state").textContent = state;
  byId("pro-controls").setAttribute("aria-disabled", "false");
  byId<HTMLInputElement>("preset-name").disabled = false;
  byId<HTMLButtonElement>("save-preset").disabled = false;
  byId<HTMLButtonElement>("sensitivity-button").disabled = false;
}

function lockFieldKit(state: string): void {
  byId("license-state").textContent = state;
  byId("pro-controls").setAttribute("aria-disabled", "true");
  byId<HTMLInputElement>("preset-name").disabled = true;
  byId<HTMLButtonElement>("save-preset").disabled = true;
  byId<HTMLButtonElement>("sensitivity-button").disabled = true;
}

byId("save-preset").addEventListener("click", () => {
  const name = byId<HTMLInputElement>("preset-name").value.trim();
  const output = byId("sensitivity-output");
  if (!name) {
    output.textContent = "Name the preset before saving it.";
    return;
  }
  const presets = parseStored<Array<{ name: string; window: number }>>(PRESETS_KEY) ?? [];
  presets.push({ name, window: selectedWindow() });
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets.slice(-12)));
  output.textContent = `Saved “${name}” locally with a ${selectedWindow() / 1000} s window.`;
});

byId("sensitivity-button").addEventListener("click", () => {
  const output = byId("sensitivity-output");
  if (!currentEvents.length) {
    output.textContent = "Analyze a non-empty sample first.";
    return;
  }
  const base = selectedWindow();
  const rows = [0.5, 1, 2].map((factor) => {
    const report = analyzeLogs(currentEvents, base * factor);
    return `${factor}× window: ${report.suspectedGroups} groups / ${report.duplicateCopies} copies`;
  });
  output.replaceChildren(...rows.map((text) => {
    const line = document.createElement("p");
    line.textContent = text;
    return line;
  }));
});

function parseStored<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id}`);
  return element as T;
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => undefined));
}

void initializeLicense();
