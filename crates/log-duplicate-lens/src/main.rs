use clap::{Parser, ValueEnum};
use log_duplicate_lens::{
    AnalysisConfig, AnalysisReport, InputFormat, LensError, RewriteRule, analyze_reader,
};
use std::collections::BTreeSet;
use std::fs::File;
use std::io::{self, BufReader, Write};
use std::path::PathBuf;
use std::process::ExitCode;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Copy, ValueEnum)]
enum FormatArg {
    Auto,
    Jsonl,
    Loki,
    Text,
}

impl From<FormatArg> for InputFormat {
    fn from(value: FormatArg) -> Self {
        match value {
            FormatArg::Auto => Self::Auto,
            FormatArg::Jsonl => Self::Jsonl,
            FormatArg::Loki => Self::Loki,
            FormatArg::Text => Self::Text,
        }
    }
}

#[derive(Debug, Clone, Copy, ValueEnum)]
enum NormalizeArg {
    Default,
    None,
}

#[derive(Debug, Parser)]
#[command(
    name = "log-duplicate-lens",
    version,
    about = "Measure suspected cross-stream duplicate log ingestion locally",
    long_about = "Log Duplicate Lens samples Loki or JSON logs, normalizes dynamic message fields, and reports time-bounded matches that cross stream identities. Matches are evidence to investigate, not automatic proof that ingestion is wrong.",
    after_help = "EXAMPLES:\n  log-duplicate-lens loki.jsonl\n  log-duplicate-lens export.json --format loki --window 1500ms --json\n  journalctl -o cat | log-duplicate-lens - --format text\n\nNo log content is uploaded and no telemetry is emitted."
)]
struct Cli {
    /// Input file, or - for standard input
    #[arg(default_value = "-")]
    input: PathBuf,

    /// Input structure; auto recognizes Loki responses, JSONL, and text
    #[arg(long, value_enum, default_value = "auto")]
    format: FormatArg,

    /// Maximum timestamp distance inside one candidate group (for example 2s, 500ms)
    #[arg(long, default_value = "2s", value_parser = parse_duration)]
    window: i64,

    /// Built-in normalization for UUIDs, IPs, embedded timestamps, and 4+ digit numbers
    #[arg(long, value_enum, default_value = "default")]
    normalize: NormalizeArg,

    /// Additional fingerprint rewrite as REGEX=>REPLACEMENT; repeatable
    #[arg(long = "normalize-rule", value_parser = parse_rule)]
    normalization_rules: Vec<RewriteRule>,

    /// Redact report previews as REGEX=>REPLACEMENT; repeatable
    #[arg(long, value_parser = parse_rule)]
    redact: Vec<RewriteRule>,

    /// Ignore a label when identifying and comparing streams; repeatable
    #[arg(long = "ignore-label")]
    ignored_labels: Vec<String>,

    /// JSONL message field override
    #[arg(long)]
    message_field: Option<String>,

    /// JSONL timestamp field override
    #[arg(long)]
    timestamp_field: Option<String>,

    /// JSONL stream/labels field override
    #[arg(long)]
    stream_field: Option<String>,

    /// Maximum events retained for ordered analysis
    #[arg(long, default_value_t = 250_000)]
    max_events: usize,

    /// Maximum time-bounded fingerprint clusters retained
    #[arg(long, default_value_t = 10_000)]
    max_groups: usize,

    /// Maximum input size read into memory, in MiB
    #[arg(long, default_value_t = 128)]
    max_input_mb: usize,

    /// Emit the stable JSON report schema
    #[arg(long)]
    json: bool,

    /// Exit 3 when suspected duplicate groups are present
    #[arg(long)]
    fail_on_duplicates: bool,
}

fn main() -> ExitCode {
    if std::env::args().nth(1).as_deref() == Some("demo") {
        return run_demo();
    }
    let cli = Cli::parse();
    match run(&cli) {
        Ok(report) => {
            let output = if cli.json {
                serde_json::to_string_pretty(&report).expect("report is serializable")
            } else {
                render_text(&report)
            };
            if let Err(error) = writeln!(io::stdout().lock(), "{output}") {
                eprintln!("lens: could not write report: {error}");
                return ExitCode::from(1);
            }
            if cli.fail_on_duplicates && report.suspected_groups > 0 {
                ExitCode::from(3)
            } else {
                ExitCode::SUCCESS
            }
        }
        Err(LensError::Io(error)) => {
            eprintln!("lens: I/O error: {error}");
            ExitCode::from(1)
        }
        Err(error) => {
            eprintln!("lens: invalid input: {error}");
            ExitCode::from(2)
        }
    }
}

/// Run the bundled labeled sample without requiring an input path.
///
/// The report is deliberately written to a new temporary file so a trial
/// cannot overwrite an operator's own report or input.
fn run_demo() -> ExitCode {
    let config = AnalysisConfig::default();
    let report = match analyze_reader(
        std::io::Cursor::new(include_str!("../examples/labeled-sample.jsonl")),
        InputFormat::Jsonl,
        &config,
    ) {
        Ok(report) => report,
        Err(error) => {
            eprintln!("lens: bundled demo could not run: {error}");
            return ExitCode::from(1);
        }
    };
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or_default();
    let path = std::env::temp_dir().join(format!("log-duplicate-lens-demo-{stamp}.json"));
    let json = match serde_json::to_string_pretty(&report) {
        Ok(json) => json,
        Err(error) => {
            eprintln!("lens: could not encode demo report: {error}");
            return ExitCode::from(1);
        }
    };
    if let Err(error) = std::fs::write(&path, json) {
        eprintln!("lens: could not write demo report: {error}");
        return ExitCode::from(1);
    }
    println!("Bundled sample: 7 labeled log records");
    println!("Result: {} suspected duplicate groups / {} duplicate copies", report.suspected_groups, report.duplicate_copies);
    println!("Demo report: {}", path.display());
    ExitCode::SUCCESS
}

fn run(cli: &Cli) -> Result<AnalysisReport, LensError> {
    let config = AnalysisConfig {
        window_ns: cli.window,
        normalize_dynamic_fields: matches!(cli.normalize, NormalizeArg::Default),
        normalization_rules: cli.normalization_rules.clone(),
        redaction_rules: cli.redact.clone(),
        ignored_labels: cli.ignored_labels.iter().cloned().collect::<BTreeSet<_>>(),
        message_field: cli.message_field.clone(),
        timestamp_field: cli.timestamp_field.clone(),
        stream_field: cli.stream_field.clone(),
        max_events: cli.max_events,
        max_groups: cli.max_groups,
        max_input_bytes: cli.max_input_mb.saturating_mul(1024 * 1024),
    };
    if cli.input.as_os_str() == "-" {
        analyze_reader(
            BufReader::new(io::stdin().lock()),
            cli.format.into(),
            &config,
        )
    } else {
        let file = File::open(&cli.input).map_err(LensError::Io)?;
        analyze_reader(BufReader::new(file), cli.format.into(), &config)
    }
}

fn parse_duration(input: &str) -> Result<i64, String> {
    let (number, multiplier) = if let Some(value) = input.strip_suffix("ms") {
        (value, 1_000_000i64)
    } else if let Some(value) = input.strip_suffix("us") {
        (value, 1_000i64)
    } else if let Some(value) = input.strip_suffix("ns") {
        (value, 1i64)
    } else if let Some(value) = input.strip_suffix('s') {
        (value, 1_000_000_000i64)
    } else {
        return Err("use a duration suffix: ns, us, ms, or s".into());
    };
    let amount: f64 = number
        .parse()
        .map_err(|_| "duration must be a non-negative number".to_string())?;
    if !amount.is_finite() || amount < 0.0 {
        return Err("duration must be a non-negative finite number".into());
    }
    let nanos = amount * multiplier as f64;
    if nanos > i64::MAX as f64 {
        return Err("duration is too large".into());
    }
    Ok(nanos.round() as i64)
}

fn parse_rule(input: &str) -> Result<RewriteRule, String> {
    let (pattern, replacement) = input
        .split_once("=>")
        .ok_or_else(|| "rewrite rules use REGEX=>REPLACEMENT".to_string())?;
    if pattern.is_empty() {
        return Err("rewrite regex must not be empty".into());
    }
    RewriteRule::new(pattern, replacement).map_err(|error| format!("invalid regex: {error}"))
}

fn render_text(report: &AnalysisReport) -> String {
    let mut output = String::new();
    output.push_str("LOG DUPLICATE LENS · LOCAL EVIDENCE REPORT\n");
    output.push_str("────────────────────────────────────────────\n");
    output.push_str(&format!(
        "Input       {} · {} events{}\n",
        report.input_format,
        report.analyzed_events,
        if report.sampled { " (sampled)" } else { "" }
    ));
    output.push_str(&format!(
        "Suspected   {} cross-stream groups · {} extra copies\n",
        report.suspected_groups, report.duplicate_copies
    ));
    output.push_str(&format!(
        "Amplifier   {:.2}× alert count · {:.1}% event volume · {} estimated bytes\n",
        report.alert_inflation_factor, report.duplicate_event_percent, report.estimated_extra_bytes
    ));

    if report.groups.is_empty() {
        output.push_str("\nNO CROSS-STREAM MATCHES IN THIS WINDOW\n");
        if report.analyzed_events == 0 {
            output.push_str("The input was empty. Export a bounded window and run Lens again.\n");
        } else {
            output.push_str(
                "Try a wider --window or a targeted --normalize-rule if retry timing is known.\n",
            );
        }
    } else {
        for (index, group) in report.groups.iter().enumerate() {
            output.push_str(&format!(
                "\n#{:02}  {} copies / {} streams / {:.1} ms\n",
                index + 1,
                group.observed_copies,
                group.stream_count,
                group.retry_spread_ms
            ));
            output.push_str(&format!("     “{}”\n", group.message_preview));
            output.push_str(&format!("     fingerprint {}\n", group.fingerprint));
            for evidence in &group.evidence {
                output.push_str(&format!("     • {evidence}\n"));
            }
        }
    }
    output.push_str(
        "\nCAUTION      A match is evidence, not proof. Confirm retry/sharding behavior.\n",
    );
    output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn duration_parser_accepts_documented_values() {
        assert_eq!(parse_duration("1500ms").unwrap(), 1_500_000_000);
        assert_eq!(parse_duration("2s").unwrap(), 2_000_000_000);
        assert!(parse_duration("2").is_err());
    }

    #[test]
    fn rewrite_parser_requires_unambiguous_separator() {
        let rule = parse_rule(r"token=[^ ]+=>token=[REDACTED]").unwrap();
        assert_eq!(
            rule.regex
                .replace_all("token=abc", rule.replacement.as_str()),
            "token=[REDACTED]"
        );
    }
}
