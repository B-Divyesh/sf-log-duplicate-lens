import { analyzeLogs, normalizeMessage, parseLogs } from "./analyzer";

const sample = [
  { ts: 1_700_000_000_000, msg: "timeout request 12345", stream: { job: "api", shard: "a" } },
  { ts: 1_700_000_000_200, msg: "timeout request 98765", stream: { job: "api", shard: "b" } },
  { ts: 1_700_000_010_000, msg: "healthy", stream: { job: "api", shard: "a" } },
  { ts: 1_700_000_010_100, msg: "healthy", stream: { job: "api", shard: "a" } }
];

describe("browser analyzer", () => {
  it("finds cross-stream matches and excludes same-stream repeats", () => {
    const events = parseLogs(sample.map((event) => JSON.stringify(event)).join("\n"));
    const report = analyzeLogs(events, 2_000);
    expect(report.suspectedGroups).toBe(1);
    expect(report.groups[0].differingLabels).toEqual(["shard"]);
  });

  it("parses Loki responses", () => {
    const input = JSON.stringify({
      data: {
        result: [
          { stream: { shard: "a" }, values: [["1700000000000000000", "error 12345"]] },
          { stream: { shard: "b" }, values: [["1700000000100000000", "error 67890"]] }
        ]
      }
    });
    expect(analyzeLogs(parseLogs(input), 500).suspectedGroups).toBe(1);
  });

  it("normalizes noisy identifiers but preserves short status codes", () => {
    expect(normalizeMessage("job 12345 from 10.2.3.4 status 503")).toBe(
      "job <num> from <ip> status 503"
    );
  });

  it("returns a useful empty report", () => {
    expect(analyzeLogs(parseLogs(""), 2_000)).toMatchObject({
      observedEvents: 0,
      suspectedGroups: 0,
      alertInflation: 1
    });
  });
});
