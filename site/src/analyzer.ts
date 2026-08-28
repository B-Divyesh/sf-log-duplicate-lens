export type Labels = Record<string, string>;

export interface LogEvent {
  timestamp: number;
  message: string;
  labels: Labels;
  bytes: number;
}

export interface DemoGroup {
  fingerprint: string;
  message: string;
  copies: number;
  streams: number;
  spreadMs: number;
  extraBytes: number;
  differingLabels: string[];
}

export interface DemoReport {
  schemaVersion: 1;
  observedEvents: number;
  suspectedGroups: number;
  duplicateCopies: number;
  duplicatePercent: number;
  alertInflation: number;
  extraBytes: number;
  groups: DemoGroup[];
  caution: string;
}

interface WorkGroup {
  normalized: string;
  message: string;
  start: number;
  end: number;
  copies: number;
  bytes: number;
  baselineBytes: number;
  labels: Map<string, Labels>;
}

const MESSAGE_FIELDS = ["message", "msg", "log", "line"];
const TIME_FIELDS = ["timestamp", "ts", "time", "@timestamp"];

export function parseLogs(input: string): LogEvent[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    const array = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(array)) throw new Error("The JSON root is not an event array.");
    return array.map((value, index) => eventFromRecord(value, index));
  }
  if (trimmed.startsWith("{") && trimmed.includes('"result"')) {
    try {
      const root = JSON.parse(trimmed) as Record<string, unknown>;
      const data = root.data as Record<string, unknown> | undefined;
      const results = (data?.result ?? root.result) as unknown;
      if (Array.isArray(results)) return parseLokiResults(results);
    } catch {
      // A multi-line JSONL file also begins with `{`; fall through to line parsing.
    }
  }

  return input
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line, index) => {
      if (!line.trimStart().startsWith("{")) {
        return {
          timestamp: index,
          message: line,
          labels: { source: "text" },
          bytes: new TextEncoder().encode(line).length
        };
      }
      try {
        return eventFromRecord(JSON.parse(line) as unknown, index);
      } catch (error) {
        throw new Error(`Line ${index + 1} is not valid JSON: ${errorMessage(error)}`);
      }
    });
}

function parseLokiResults(results: unknown[]): LogEvent[] {
  const events: LogEvent[] = [];
  for (const result of results) {
    if (!isRecord(result) || !Array.isArray(result.values)) {
      throw new Error("A Loki result is missing its values array.");
    }
    const labels = toLabels(result.stream);
    for (const pair of result.values) {
      if (!Array.isArray(pair) || pair.length < 2) {
        throw new Error("A Loki value must contain a timestamp and line.");
      }
      const message = String(pair[1]);
      events.push({
        timestamp: parseTimestamp(pair[0], events.length),
        message,
        labels,
        bytes: new TextEncoder().encode(message).length
      });
    }
  }
  return events;
}

function eventFromRecord(value: unknown, index: number): LogEvent {
  if (!isRecord(value)) throw new Error(`Event ${index + 1} is not an object.`);
  const rawMessage = MESSAGE_FIELDS.map((field) => value[field]).find(
    (item) => item !== undefined
  );
  if (rawMessage === undefined) throw new Error(`Event ${index + 1} has no message field.`);
  const rawTime = TIME_FIELDS.map((field) => value[field]).find((item) => item !== undefined);
  const rawLabels = value.stream ?? value.labels;
  const message = typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);
  return {
    timestamp: parseTimestamp(rawTime, index),
    message,
    labels: toLabels(rawLabels),
    bytes: new TextEncoder().encode(message).length
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toLabels(value: unknown): Labels {
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, String(item)]));
  }
  if (typeof value === "string") {
    const labels: Labels = {};
    value
      .replace(/^\{|\}$/g, "")
      .split(",")
      .forEach((part) => {
        const equals = part.indexOf("=");
        if (equals > 0) {
          labels[part.slice(0, equals).trim()] = part
            .slice(equals + 1)
            .trim()
            .replace(/^"|"$/g, "");
        }
      });
    if (Object.keys(labels).length) return labels;
    return { stream: value };
  }
  return { source: "unknown" };
}

function parseTimestamp(value: unknown, fallback: number): number {
  if (typeof value === "string" && !/^\d+$/.test(value)) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  const magnitude = Math.abs(number);
  if (magnitude > 1e17) return number / 1e6;
  if (magnitude > 1e14) return number / 1e3;
  if (magnitude < 1e11) return number * 1000;
  return number;
}

export function normalizeMessage(message: string): string {
  return message
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})\b/g, "<time>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, "<uuid>")
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "<ip>")
    .replace(/\b\d{4,}\b/g, "<num>");
}

export function analyzeLogs(events: LogEvent[], windowMs: number): DemoReport {
  const ordered = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const work: WorkGroup[] = [];
  const latest = new Map<string, number>();
  for (const event of ordered) {
    const normalized = normalizeMessage(event.message);
    if (!normalized) continue;
    const streamKey = JSON.stringify(
      Object.entries(event.labels).sort(([left], [right]) => left.localeCompare(right))
    );
    const previous = latest.get(normalized);
    const group = previous === undefined ? undefined : work[previous];
    if (group && event.timestamp >= group.start && event.timestamp - group.start <= windowMs) {
      group.end = Math.max(group.end, event.timestamp);
      group.copies += 1;
      group.bytes += event.bytes;
      if (!group.labels.has(streamKey)) group.labels.set(streamKey, event.labels);
    } else {
      latest.set(normalized, work.length);
      work.push({
        normalized,
        message: event.message,
        start: event.timestamp,
        end: event.timestamp,
        copies: 1,
        bytes: event.bytes,
        baselineBytes: event.bytes,
        labels: new Map([[streamKey, event.labels]])
      });
    }
  }

  const groups = work
    .filter((group) => group.copies > 1 && group.labels.size > 1)
    .map((group): DemoGroup => {
      const streams = [...group.labels.values()];
      const keys = new Set(streams.flatMap((labels) => Object.keys(labels)));
      const differingLabels = [...keys].filter((key) => {
        const values = new Set(streams.map((labels) => labels[key] ?? "<absent>"));
        return values.size > 1;
      });
      return {
        fingerprint: fnv1a(normalizeMessage(group.message)),
        message: group.message.slice(0, 180),
        copies: group.copies,
        streams: group.labels.size,
        spreadMs: group.end - group.start,
        extraBytes: Math.max(0, group.bytes - group.baselineBytes),
        differingLabels
      };
    })
    .sort((a, b) => b.copies - a.copies);
  const duplicateCopies = groups.reduce((total, group) => total + group.copies - 1, 0);
  const logical = Math.max(1, events.length - duplicateCopies);
  return {
    schemaVersion: 1,
    observedEvents: events.length,
    suspectedGroups: groups.length,
    duplicateCopies,
    duplicatePercent: events.length ? (duplicateCopies / events.length) * 100 : 0,
    alertInflation: events.length ? events.length / logical : 1,
    extraBytes: groups.reduce((total, group) => total + group.extraBytes, 0),
    groups,
    caution: "Matching messages are candidates, not proof of erroneous ingestion. Confirm producer, retry, and sharding behavior."
  };
}

function fnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
