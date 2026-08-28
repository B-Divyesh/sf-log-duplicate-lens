//! Analysis engine for Log Duplicate Lens.
//!
//! The public surface is deliberately small: create an [`AnalysisConfig`] and
//! pass a buffered reader to [`analyze_reader`]. No input leaves the process.

use chrono::DateTime;
use regex::Regex;
use serde::Serialize;
use serde_json::Value;
use std::collections::{BTreeMap, BTreeSet, HashMap};
use std::fmt;
use std::io::{self, BufRead, Read};
use std::sync::LazyLock;

static UUID_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?i)\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b")
        .unwrap()
});
static IP_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\b(?:\d{1,3}\.){3}\d{1,3}\b").unwrap());
static LONG_NUMBER_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\b\d{4,}\b").unwrap());
static ISO_IN_MESSAGE_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})\b").unwrap()
});

/// Accepted input structures.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InputFormat {
    Auto,
    Jsonl,
    Loki,
    Text,
}

impl fmt::Display for InputFormat {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            Self::Auto => "auto",
            Self::Jsonl => "jsonl",
            Self::Loki => "loki",
            Self::Text => "text",
        })
    }
}

/// A regex transformation applied to message fingerprints or report previews.
#[derive(Debug, Clone)]
pub struct RewriteRule {
    pub regex: Regex,
    pub replacement: String,
}

impl RewriteRule {
    pub fn new(pattern: &str, replacement: impl Into<String>) -> Result<Self, regex::Error> {
        Ok(Self {
            regex: Regex::new(pattern)?,
            replacement: replacement.into(),
        })
    }
}

/// Resource bounds and field mappings for one analysis.
#[derive(Debug, Clone)]
pub struct AnalysisConfig {
    pub window_ns: i64,
    pub normalize_dynamic_fields: bool,
    pub normalization_rules: Vec<RewriteRule>,
    pub redaction_rules: Vec<RewriteRule>,
    pub ignored_labels: BTreeSet<String>,
    pub message_field: Option<String>,
    pub timestamp_field: Option<String>,
    pub stream_field: Option<String>,
    pub max_events: usize,
    pub max_groups: usize,
    pub max_input_bytes: usize,
}

impl Default for AnalysisConfig {
    fn default() -> Self {
        Self {
            window_ns: 2_000_000_000,
            normalize_dynamic_fields: true,
            normalization_rules: Vec::new(),
            redaction_rules: Vec::new(),
            ignored_labels: BTreeSet::new(),
            message_field: None,
            timestamp_field: None,
            stream_field: None,
            max_events: 250_000,
            max_groups: 10_000,
            max_input_bytes: 128 * 1024 * 1024,
        }
    }
}

/// Evidence for one suspected logical event observed in multiple streams.
#[derive(Debug, Clone, Serialize)]
pub struct DuplicateGroup {
    pub fingerprint: String,
    pub message_preview: String,
    pub first_timestamp: String,
    pub last_timestamp: String,
    pub observed_copies: usize,
    pub duplicate_copies: usize,
    pub stream_count: usize,
    pub streams: Vec<BTreeMap<String, String>>,
    pub differing_labels: BTreeMap<String, Vec<String>>,
    pub retry_spread_ms: f64,
    pub observed_bytes: u64,
    pub estimated_extra_bytes: u64,
    pub evidence: Vec<String>,
}

/// Stable report returned by the library and by `--json`.
#[derive(Debug, Clone, Serialize)]
pub struct AnalysisReport {
    pub schema_version: u8,
    pub input_format: String,
    pub observed_events: usize,
    pub analyzed_events: usize,
    pub sampled: bool,
    pub dropped_group_candidates: usize,
    pub suspected_groups: usize,
    pub duplicate_copies: usize,
    pub duplicate_event_percent: f64,
    pub estimated_logical_events: usize,
    pub alert_inflation_factor: f64,
    pub observed_bytes: u64,
    pub estimated_extra_bytes: u64,
    pub groups: Vec<DuplicateGroup>,
    pub cautions: Vec<String>,
}

/// Parsing, resource, or I/O failure.
#[derive(Debug)]
pub enum LensError {
    Io(io::Error),
    InvalidInput(String),
    LimitExceeded(String),
}

impl fmt::Display for LensError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Io(error) => write!(f, "{error}"),
            Self::InvalidInput(message) | Self::LimitExceeded(message) => f.write_str(message),
        }
    }
}

impl std::error::Error for LensError {}

impl From<io::Error> for LensError {
    fn from(value: io::Error) -> Self {
        Self::Io(value)
    }
}

#[derive(Debug)]
struct Event {
    timestamp_ns: i64,
    message: String,
    labels: BTreeMap<String, String>,
    bytes: u64,
}

#[derive(Debug)]
struct WorkGroup {
    normalized: String,
    preview: String,
    start_ns: i64,
    end_ns: i64,
    copies: usize,
    bytes: u64,
    baseline_bytes: u64,
    streams: BTreeMap<String, BTreeMap<String, String>>,
}

/// Analyze a Loki response, JSONL records, or plain newline-delimited text.
///
/// Input is capped by `max_input_bytes`, events by `max_events`, and candidate
/// clusters by `max_groups`, making resource use explicit on hostile exports.
pub fn analyze_reader<R: BufRead>(
    mut reader: R,
    requested_format: InputFormat,
    config: &AnalysisConfig,
) -> Result<AnalysisReport, LensError> {
    if config.window_ns < 0 {
        return Err(LensError::InvalidInput(
            "timestamp window must not be negative".into(),
        ));
    }
    if config.max_events == 0 || config.max_groups == 0 || config.max_input_bytes == 0 {
        return Err(LensError::InvalidInput(
            "resource limits must be greater than zero".into(),
        ));
    }

    let mut input = Vec::new();
    let mut limited = reader.by_ref().take(config.max_input_bytes as u64 + 1);
    limited.read_to_end(&mut input)?;
    if input.len() > config.max_input_bytes {
        return Err(LensError::LimitExceeded(format!(
            "input exceeds the {} MiB safety limit; raise --max-input-mb deliberately or sample the export",
            config.max_input_bytes / 1024 / 1024
        )));
    }
    let text = std::str::from_utf8(&input)
        .map_err(|_| LensError::InvalidInput("input is not valid UTF-8".into()))?;
    let detected = detect_format(text, requested_format);
    let (mut events, observed, sampled) = parse_events(text, detected, config)?;
    events.sort_by_key(|event| event.timestamp_ns);

    let observed_bytes = events.iter().map(|event| event.bytes).sum();
    let mut groups: Vec<WorkGroup> = Vec::new();
    let mut last_by_fingerprint: HashMap<u64, usize> = HashMap::new();
    let mut dropped_group_candidates = 0usize;

    for event in events {
        let normalized = normalize_message(&event.message, config);
        if normalized.is_empty() {
            continue;
        }
        let fingerprint = fnv1a64(normalized.as_bytes());
        let stream_key = canonical_stream(&event.labels, &config.ignored_labels);
        let match_index = last_by_fingerprint
            .get(&fingerprint)
            .copied()
            .filter(|index| {
                let group = &groups[*index];
                event.timestamp_ns >= group.start_ns
                    && event.timestamp_ns.saturating_sub(group.start_ns) <= config.window_ns
                    && group.normalized == normalized
            });

        if let Some(index) = match_index {
            let group = &mut groups[index];
            group.end_ns = group.end_ns.max(event.timestamp_ns);
            group.copies += 1;
            group.bytes = group.bytes.saturating_add(event.bytes);
            group
                .streams
                .entry(stream_key)
                .or_insert_with(|| filtered_labels(&event.labels, &config.ignored_labels));
        } else if groups.len() < config.max_groups {
            let mut streams = BTreeMap::new();
            streams.insert(
                stream_key,
                filtered_labels(&event.labels, &config.ignored_labels),
            );
            let preview = redact_preview(&event.message, config);
            let index = groups.len();
            groups.push(WorkGroup {
                normalized,
                preview,
                start_ns: event.timestamp_ns,
                end_ns: event.timestamp_ns,
                copies: 1,
                bytes: event.bytes,
                baseline_bytes: event.bytes,
                streams,
            });
            last_by_fingerprint.insert(fingerprint, index);
        } else {
            dropped_group_candidates += 1;
        }
    }

    let mut result_groups: Vec<DuplicateGroup> = groups
        .into_iter()
        .filter(|group| group.copies > 1 && group.streams.len() > 1)
        .map(finalize_group)
        .collect();
    result_groups.sort_by(|a, b| {
        b.duplicate_copies
            .cmp(&a.duplicate_copies)
            .then_with(|| a.first_timestamp.cmp(&b.first_timestamp))
    });

    let duplicate_copies: usize = result_groups
        .iter()
        .map(|group| group.duplicate_copies)
        .sum();
    let estimated_extra_bytes: u64 = result_groups
        .iter()
        .map(|group| group.estimated_extra_bytes)
        .sum();
    let analyzed_events = observed.min(config.max_events);
    let estimated_logical_events = analyzed_events.saturating_sub(duplicate_copies);
    let duplicate_event_percent = percent(duplicate_copies, analyzed_events);
    let alert_inflation_factor = if estimated_logical_events == 0 {
        1.0
    } else {
        analyzed_events as f64 / estimated_logical_events as f64
    };

    let mut cautions = vec![
        "Matching messages are candidates, not proof of erroneous ingestion; confirm producer and retry behavior.".into(),
        "Inflation estimates treat each time-bounded cross-stream group as one logical event.".into(),
    ];
    if sampled || dropped_group_candidates > 0 {
        cautions
            .push("Resource limits truncated this analysis; totals are sample estimates.".into());
    }

    Ok(AnalysisReport {
        schema_version: 1,
        input_format: detected.to_string(),
        observed_events: observed,
        analyzed_events,
        sampled,
        dropped_group_candidates,
        suspected_groups: result_groups.len(),
        duplicate_copies,
        duplicate_event_percent,
        estimated_logical_events,
        alert_inflation_factor,
        observed_bytes,
        estimated_extra_bytes,
        groups: result_groups,
        cautions,
    })
}

fn detect_format(input: &str, requested: InputFormat) -> InputFormat {
    if requested != InputFormat::Auto {
        return requested;
    }
    let trimmed = input.trim_start();
    if trimmed.starts_with('{') {
        let first_line = trimmed.lines().next().unwrap_or_default();
        if first_line.contains("\"resultType\"")
            || (trimmed.contains("\"data\"") && trimmed.contains("\"result\""))
        {
            InputFormat::Loki
        } else {
            InputFormat::Jsonl
        }
    } else if trimmed.starts_with('[') {
        InputFormat::Loki
    } else {
        InputFormat::Text
    }
}

fn parse_events(
    input: &str,
    format: InputFormat,
    config: &AnalysisConfig,
) -> Result<(Vec<Event>, usize, bool), LensError> {
    match format {
        InputFormat::Jsonl => parse_jsonl(input, config),
        InputFormat::Loki => parse_loki(input, config),
        InputFormat::Text => parse_text(input, config),
        InputFormat::Auto => unreachable!(),
    }
}

fn parse_text(
    input: &str,
    config: &AnalysisConfig,
) -> Result<(Vec<Event>, usize, bool), LensError> {
    let observed = input.lines().filter(|line| !line.trim().is_empty()).count();
    let events = input
        .lines()
        .filter(|line| !line.trim().is_empty())
        .take(config.max_events)
        .enumerate()
        .map(|(index, line)| Event {
            timestamp_ns: index as i64 * 1_000_000,
            message: line.to_string(),
            labels: BTreeMap::from([("source".into(), "text".into())]),
            bytes: line.len() as u64,
        })
        .collect();
    Ok((events, observed, observed > config.max_events))
}

fn parse_jsonl(
    input: &str,
    config: &AnalysisConfig,
) -> Result<(Vec<Event>, usize, bool), LensError> {
    let mut events = Vec::new();
    let mut observed = 0usize;
    for (index, line) in input.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }
        observed += 1;
        if events.len() >= config.max_events {
            continue;
        }
        let value: Value = serde_json::from_str(line).map_err(|error| {
            LensError::InvalidInput(format!("invalid JSON on line {}: {error}", index + 1))
        })?;
        events.push(event_from_json(&value, index, config)?);
    }
    Ok((events, observed, observed > config.max_events))
}

fn parse_loki(
    input: &str,
    config: &AnalysisConfig,
) -> Result<(Vec<Event>, usize, bool), LensError> {
    let root: Value = serde_json::from_str(input)
        .map_err(|error| LensError::InvalidInput(format!("invalid Loki JSON: {error}")))?;
    let mut events = Vec::new();
    let mut observed = 0usize;

    if let Some(results) = root
        .pointer("/data/result")
        .and_then(Value::as_array)
        .or_else(|| root.get("result").and_then(Value::as_array))
    {
        for result in results {
            let labels = labels_from_value(result.get("stream"));
            let values = result
                .get("values")
                .and_then(Value::as_array)
                .ok_or_else(|| {
                    LensError::InvalidInput("Loki stream is missing a values array".into())
                })?;
            for pair in values {
                observed += 1;
                if events.len() >= config.max_events {
                    continue;
                }
                let pair = pair.as_array().ok_or_else(|| {
                    LensError::InvalidInput("Loki values entries must be [timestamp, line]".into())
                })?;
                if pair.len() < 2 {
                    return Err(LensError::InvalidInput(
                        "Loki values entries must contain timestamp and line".into(),
                    ));
                }
                let timestamp_ns = parse_timestamp(&pair[0]).ok_or_else(|| {
                    LensError::InvalidInput("Loki entry has an invalid timestamp".into())
                })?;
                let message = value_to_string(&pair[1]);
                events.push(Event {
                    timestamp_ns,
                    bytes: message.len() as u64,
                    message,
                    labels: labels.clone(),
                });
            }
        }
    } else if let Some(array) = root.as_array() {
        observed = array.len();
        for (index, value) in array.iter().take(config.max_events).enumerate() {
            events.push(event_from_json(value, index, config)?);
        }
    } else {
        return Err(LensError::InvalidInput(
            "expected a Loki query response or JSON event array".into(),
        ));
    }
    Ok((events, observed, observed > config.max_events))
}

fn event_from_json(
    value: &Value,
    index: usize,
    config: &AnalysisConfig,
) -> Result<Event, LensError> {
    let object = value.as_object().ok_or_else(|| {
        LensError::InvalidInput(format!("event {} is not a JSON object", index + 1))
    })?;
    let message_keys: Vec<&str> = config
        .message_field
        .as_deref()
        .map(|field| vec![field])
        .unwrap_or_else(|| vec!["message", "msg", "log", "line"]);
    let message = message_keys
        .iter()
        .find_map(|key| object.get(*key))
        .map(value_to_string)
        .ok_or_else(|| {
            LensError::InvalidInput(format!(
                "event {} has no message field; use --message-field",
                index + 1
            ))
        })?;
    let timestamp_keys: Vec<&str> = config
        .timestamp_field
        .as_deref()
        .map(|field| vec![field])
        .unwrap_or_else(|| vec!["timestamp", "ts", "time", "@timestamp"]);
    let timestamp_ns = timestamp_keys
        .iter()
        .find_map(|key| object.get(*key))
        .and_then(parse_timestamp)
        .unwrap_or(index as i64 * 1_000_000);
    let stream_keys: Vec<&str> = config
        .stream_field
        .as_deref()
        .map(|field| vec![field])
        .unwrap_or_else(|| vec!["stream", "labels"]);
    let labels = stream_keys
        .iter()
        .find_map(|key| object.get(*key))
        .map(|value| labels_from_value(Some(value)))
        .unwrap_or_else(|| BTreeMap::from([("source".into(), "unknown".into())]));
    Ok(Event {
        timestamp_ns,
        bytes: message.len() as u64,
        message,
        labels,
    })
}

fn labels_from_value(value: Option<&Value>) -> BTreeMap<String, String> {
    match value {
        Some(Value::Object(object)) => object
            .iter()
            .map(|(key, value)| (key.clone(), value_to_string(value)))
            .collect(),
        Some(Value::String(text)) => parse_label_string(text),
        Some(other) => BTreeMap::from([("stream".into(), value_to_string(other))]),
        None => BTreeMap::from([("source".into(), "unknown".into())]),
    }
}

fn parse_label_string(input: &str) -> BTreeMap<String, String> {
    let trimmed = input.trim().trim_start_matches('{').trim_end_matches('}');
    let mut labels = BTreeMap::new();
    for part in trimmed.split(',') {
        if let Some((key, value)) = part.split_once('=') {
            labels.insert(
                key.trim().to_string(),
                value.trim().trim_matches('"').to_string(),
            );
        }
    }
    if labels.is_empty() {
        labels.insert("stream".into(), input.into());
    }
    labels
}

fn parse_timestamp(value: &Value) -> Option<i64> {
    match value {
        Value::Number(number) => number.as_i64().and_then(epoch_to_ns),
        Value::String(text) => {
            if let Ok(number) = text.parse::<i64>() {
                epoch_to_ns(number)
            } else {
                DateTime::parse_from_rfc3339(text)
                    .ok()
                    .and_then(|date| date.timestamp_nanos_opt())
            }
        }
        _ => None,
    }
}

fn epoch_to_ns(value: i64) -> Option<i64> {
    let magnitude = value.unsigned_abs();
    if magnitude < 100_000_000_000 {
        value.checked_mul(1_000_000_000)
    } else if magnitude < 100_000_000_000_000 {
        value.checked_mul(1_000_000)
    } else if magnitude < 100_000_000_000_000_000 {
        value.checked_mul(1_000)
    } else {
        Some(value)
    }
}

fn normalize_message(message: &str, config: &AnalysisConfig) -> String {
    let mut normalized = message.split_whitespace().collect::<Vec<_>>().join(" ");
    if config.normalize_dynamic_fields {
        normalized = ISO_IN_MESSAGE_RE
            .replace_all(&normalized, "<time>")
            .into_owned();
        normalized = UUID_RE.replace_all(&normalized, "<uuid>").into_owned();
        normalized = IP_RE.replace_all(&normalized, "<ip>").into_owned();
        normalized = LONG_NUMBER_RE
            .replace_all(&normalized, "<num>")
            .into_owned();
    }
    for rule in &config.normalization_rules {
        normalized = rule
            .regex
            .replace_all(&normalized, rule.replacement.as_str())
            .into_owned();
    }
    normalized
}

fn redact_preview(message: &str, config: &AnalysisConfig) -> String {
    let mut preview = message.to_string();
    for rule in &config.redaction_rules {
        preview = rule
            .regex
            .replace_all(&preview, rule.replacement.as_str())
            .into_owned();
    }
    let mut chars = preview.chars();
    let shortened: String = chars.by_ref().take(220).collect();
    if chars.next().is_some() {
        format!("{shortened}…")
    } else {
        shortened
    }
}

fn canonical_stream(labels: &BTreeMap<String, String>, ignored: &BTreeSet<String>) -> String {
    filtered_labels(labels, ignored)
        .iter()
        .map(|(key, value)| format!("{key}={value}"))
        .collect::<Vec<_>>()
        .join("\u{1f}")
}

fn filtered_labels(
    labels: &BTreeMap<String, String>,
    ignored: &BTreeSet<String>,
) -> BTreeMap<String, String> {
    labels
        .iter()
        .filter(|(key, _)| !ignored.contains(*key))
        .map(|(key, value)| (key.clone(), value.clone()))
        .collect()
}

fn finalize_group(group: WorkGroup) -> DuplicateGroup {
    let streams: Vec<BTreeMap<String, String>> = group.streams.into_values().collect();
    let mut label_values: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    for labels in &streams {
        for key in streams.iter().flat_map(|stream| stream.keys()) {
            let value = labels
                .get(key)
                .cloned()
                .unwrap_or_else(|| "<absent>".into());
            label_values.entry(key.clone()).or_default().insert(value);
        }
    }
    let differing_labels: BTreeMap<String, Vec<String>> = label_values
        .into_iter()
        .filter(|(_, values)| values.len() > 1)
        .map(|(key, values)| (key, values.into_iter().collect()))
        .collect();
    let retry_spread_ms = group.end_ns.saturating_sub(group.start_ns) as f64 / 1_000_000.0;
    let mut evidence = vec![format!(
        "{} byte-identical normalized copies crossed {} streams within {:.1} ms",
        group.copies,
        streams.len(),
        retry_spread_ms
    )];
    if differing_labels.is_empty() {
        evidence
            .push("stream identities differ, but no individual varying label was retained".into());
    } else {
        evidence.push(format!(
            "labels vary across streams: {}",
            differing_labels
                .keys()
                .cloned()
                .collect::<Vec<_>>()
                .join(", ")
        ));
    }
    evidence.push(
        "possible retry or automatic sharding signature; verify against producer and distributor metrics"
            .into(),
    );
    DuplicateGroup {
        fingerprint: format!("{:016x}", fnv1a64(group.normalized.as_bytes())),
        message_preview: group.preview,
        first_timestamp: format_timestamp(group.start_ns),
        last_timestamp: format_timestamp(group.end_ns),
        observed_copies: group.copies,
        duplicate_copies: group.copies - 1,
        stream_count: streams.len(),
        streams,
        differing_labels,
        retry_spread_ms,
        observed_bytes: group.bytes,
        estimated_extra_bytes: group.bytes.saturating_sub(group.baseline_bytes),
        evidence,
    }
}

fn format_timestamp(nanos: i64) -> String {
    DateTime::from_timestamp(
        nanos.div_euclid(1_000_000_000),
        nanos.rem_euclid(1_000_000_000) as u32,
    )
    .map(|date| date.to_rfc3339_opts(chrono::SecondsFormat::Millis, true))
    .unwrap_or_else(|| nanos.to_string())
}

fn value_to_string(value: &Value) -> String {
    match value {
        Value::String(text) => text.clone(),
        other => other.to_string(),
    }
}

fn fnv1a64(bytes: &[u8]) -> u64 {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in bytes {
        hash ^= *byte as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}

fn percent(part: usize, total: usize) -> f64 {
    if total == 0 {
        0.0
    } else {
        part as f64 / total as f64 * 100.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Cursor;

    #[test]
    fn detects_cross_stream_duplicates_and_not_same_stream_repeats() {
        let input = concat!(
            r#"{"timestamp":"2026-01-01T00:00:00Z","message":"request 12345 failed","stream":{"app":"api","shard":"a"}}"#,
            "\n",
            r#"{"timestamp":"2026-01-01T00:00:00.250Z","message":"request 98765 failed","stream":{"app":"api","shard":"b"}}"#,
            "\n",
            r#"{"timestamp":"2026-01-01T00:00:10Z","message":"health ok","stream":{"app":"api","shard":"a"}}"#,
            "\n",
            r#"{"timestamp":"2026-01-01T00:00:10.100Z","message":"health ok","stream":{"app":"api","shard":"a"}}"#,
            "\n"
        );
        let report = analyze_reader(
            Cursor::new(input),
            InputFormat::Jsonl,
            &AnalysisConfig::default(),
        )
        .unwrap();
        assert_eq!(report.suspected_groups, 1);
        assert_eq!(report.duplicate_copies, 1);
        assert_eq!(report.groups[0].stream_count, 2);
        assert!(report.groups[0].differing_labels.contains_key("shard"));
    }

    #[test]
    fn parses_loki_stream_response_across_result_order() {
        let input = r#"{"status":"success","data":{"resultType":"streams","result":[{"stream":{"job":"web","shard":"1"},"values":[["1767225600000000000","timeout id=12345"]]},{"stream":{"job":"web","shard":"2"},"values":[["1767225600500000000","timeout id=67890"]]}]}}"#;
        let report = analyze_reader(
            Cursor::new(input),
            InputFormat::Loki,
            &AnalysisConfig::default(),
        )
        .unwrap();
        assert_eq!(report.suspected_groups, 1);
        assert_eq!(report.groups[0].retry_spread_ms, 500.0);
    }

    #[test]
    fn redacts_before_report_but_keeps_detection() {
        let input = concat!(
            r#"{"ts":1700000000000,"msg":"failed token=secret","labels":{"pod":"a"}}"#,
            "\n",
            r#"{"ts":1700000000100,"msg":"failed token=secret","labels":{"pod":"b"}}"#,
            "\n"
        );
        let mut config = AnalysisConfig::default();
        config
            .redaction_rules
            .push(RewriteRule::new(r"token=\S+", "token=[REDACTED]").unwrap());
        let report = analyze_reader(Cursor::new(input), InputFormat::Jsonl, &config).unwrap();
        assert_eq!(report.suspected_groups, 1);
        assert!(!report.groups[0].message_preview.contains("secret"));
    }

    #[test]
    fn labeled_sample_meets_detection_target() {
        let mut input = String::new();
        for group in 0..20 {
            for shard in ["a", "b"] {
                input.push_str(&format!(
                    "{{\"ts\":{},\"msg\":\"checkout {} failed ref {}0000\",\"stream\":{{\"job\":\"pay\",\"shard\":\"{}\"}}}}\n",
                    1_700_000_000_000i64 + group * 10_000 + if shard == "b" { 120 } else { 0 },
                    group,
                    group,
                    shard
                ));
            }
        }
        for index in 0..20 {
            input.push_str(&format!(
                "{{\"ts\":{},\"msg\":\"unique event {}\",\"stream\":{{\"job\":\"pay\",\"shard\":\"a\"}}}}\n",
                1_700_001_000_000i64 + index * 10_000,
                index
            ));
        }
        let report = analyze_reader(
            Cursor::new(input),
            InputFormat::Jsonl,
            &AnalysisConfig::default(),
        )
        .unwrap();
        assert!(
            report.suspected_groups >= 18,
            "found {} of 20",
            report.suspected_groups
        );
        assert!(
            report.suspected_groups <= 20,
            "false-positive groups should remain below 5%"
        );
    }

    #[test]
    fn empty_input_is_a_valid_empty_report() {
        let report = analyze_reader(
            Cursor::new(""),
            InputFormat::Auto,
            &AnalysisConfig::default(),
        )
        .unwrap();
        assert_eq!(report.analyzed_events, 0);
        assert!(report.groups.is_empty());
    }
}
