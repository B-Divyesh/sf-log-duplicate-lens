use assert_cmd::Command;
use predicates::prelude::*;
use serde_json::Value;
use std::io::Write;
use std::net::TcpListener;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};

fn duplicate_jsonl() -> tempfile::NamedTempFile {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000000,"msg":"retry token=secret id=12345","stream":{{"shard":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000100,"msg":"retry token=secret id=67890","stream":{{"shard":"b"}}}}"#
    )
    .unwrap();
    file
}

fn report_from(output: std::process::Output) -> Value {
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    serde_json::from_slice(&output.stdout).unwrap()
}

fn proxy_capture() -> (
    String,
    Arc<Mutex<usize>>,
    std::sync::mpsc::Sender<()>,
    thread::JoinHandle<()>,
) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    listener.set_nonblocking(true).unwrap();
    let address = format!("http://{}", listener.local_addr().unwrap());
    let connections = Arc::new(Mutex::new(0));
    let accepted = Arc::clone(&connections);
    let (stop, stopped) = std::sync::mpsc::channel();
    let worker = thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_secs(2);
        while Instant::now() < deadline {
            if stopped.try_recv().is_ok() {
                break;
            }
            match listener.accept() {
                Ok((_stream, _address)) => *accepted.lock().unwrap() += 1,
                Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                    thread::sleep(Duration::from_millis(10));
                }
                Err(error) => panic!("proxy capture failed: {error}"),
            }
        }
    });
    (address, connections, stop, worker)
}

#[test]
fn help_is_actionable() {
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg("--help")
        .assert()
        .success()
        .stdout(predicate::str::contains("--fail-on-duplicates"))
        .stdout(predicate::str::contains("No log content is uploaded"));
}

#[test]
#[doc = "@claim:cli-detection"]
fn claim_cli_detection_finds_cross_stream_duplicates() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000000,"msg":"fail 12345","stream":{{"shard":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000100,"msg":"fail 67890","stream":{{"shard":"b"}}}}"#
    )
    .unwrap();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--json", "--fail-on-duplicates"])
        .assert()
        .code(3)
        .stdout(predicate::str::contains(r#""suspected_groups": 1"#));
}

#[test]
fn malformed_input_uses_exit_two() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(file, "{{not-json").unwrap();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--format", "jsonl"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains("invalid JSON on line 1"));
}

#[test]
#[doc = "@claim:cli-demo"]
fn claim_cli_demo_runs_without_an_input_path() {
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg("demo")
        .assert()
        .success()
        .stdout(predicate::str::contains("7 labeled log records"))
        .stdout(predicate::str::contains(
            "2 suspected duplicate groups / 3 duplicate copies",
        ))
        .stdout(predicate::str::contains("Demo report:"));
}

#[test]
#[doc = "@claim:cli-json"]
fn claim_cli_json_emits_a_machine_readable_report() {
    let file = duplicate_jsonl();
    let output = Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .arg("--json")
        .output()
        .unwrap();
    assert!(output.status.success());
    let report: Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(report["schema_version"], 1);
    assert_eq!(report["suspected_groups"], 1);
}

#[test]
#[doc = "@claim:report-evidence"]
fn claim_report_evidence_includes_message_timing_and_stream_labels() {
    let file = duplicate_jsonl();
    let output = Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .arg("--json")
        .output()
        .unwrap();
    assert!(output.status.success());
    let report: Value = serde_json::from_slice(&output.stdout).unwrap();
    let group = &report["groups"][0];
    assert!(group["message_preview"].as_str().unwrap().contains("retry"));
    assert_eq!(group["retry_spread_ms"], 100.0);
    assert_eq!(group["streams"].as_array().unwrap().len(), 2);
    assert!(group["differing_labels"].get("shard").is_some());
}

#[test]
#[doc = "@claim:cli-loki-format"]
fn claim_cli_loki_format_reads_a_query_response() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    write!(file, r#"{{"status":"success","data":{{"resultType":"streams","result":[{{"stream":{{"shard":"a"}},"values":[["1700000000000000000","timeout id=12345"]]}},{{"stream":{{"shard":"b"}},"values":[["1700000000100000000","timeout id=67890"]]}}]}}}}"#).unwrap();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--format", "loki", "--json"])
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""input_format": "loki""#))
        .stdout(predicate::str::contains(r#""suspected_groups": 1"#));
}

#[test]
#[doc = "@claim:cli-auto-format"]
fn claim_cli_auto_format_recognizes_loki_jsonl_and_text() {
    let jsonl = duplicate_jsonl();
    let jsonl_report = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(jsonl.path())
            .arg("--json")
            .output()
            .unwrap(),
    );
    assert_eq!(jsonl_report["input_format"], "jsonl");
    assert_eq!(jsonl_report["suspected_groups"], 1);

    let mut loki = tempfile::NamedTempFile::new().unwrap();
    write!(loki, r#"{{"status":"success","data":{{"resultType":"streams","result":[{{"stream":{{"shard":"a"}},"values":[["1700000000000000000","timeout id=12345"]]}},{{"stream":{{"shard":"b"}},"values":[["1700000000100000000","timeout id=67890"]]}}]}}}}"#).unwrap();
    let loki_report = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(loki.path())
            .arg("--json")
            .output()
            .unwrap(),
    );
    assert_eq!(loki_report["input_format"], "loki");
    assert_eq!(loki_report["suspected_groups"], 1);

    let mut text = tempfile::NamedTempFile::new().unwrap();
    writeln!(text, "plain log line one\nplain log line two").unwrap();
    let text_report = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(text.path())
            .arg("--json")
            .output()
            .unwrap(),
    );
    assert_eq!(text_report["input_format"], "text");
    assert_eq!(text_report["observed_events"], 2);
}

#[test]
#[doc = "@claim:cli-default-normalization"]
fn claim_cli_default_normalization_ignores_uuid_ip_time_and_long_numbers() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(file, r#"{{"ts":1700000000000,"msg":"request 550e8400-e29b-41d4-a716-446655440000 from 10.1.2.3 at 2026-01-01T00:00:00Z ref 12345 failed","stream":{{"shard":"a"}}}}"#).unwrap();
    writeln!(file, r#"{{"ts":1700000000100,"msg":"request 123e4567-e89b-42d3-a456-426614174000 from 10.9.8.7 at 2026-02-02T12:34:56Z ref 67890 failed","stream":{{"shard":"b"}}}}"#).unwrap();
    let default_report = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(file.path())
            .arg("--json")
            .output()
            .unwrap(),
    );
    assert_eq!(default_report["suspected_groups"], 1);
    let literal_report = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(file.path())
            .args(["--normalize", "none", "--json"])
            .output()
            .unwrap(),
    );
    assert_eq!(literal_report["suspected_groups"], 0);
}

#[test]
#[doc = "@claim:cli-normalize-rule"]
fn claim_cli_normalize_rule_adds_a_fingerprint_rewrite() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000000,"msg":"checkout failed request=alpha","stream":{{"shard":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000100,"msg":"checkout failed request=beta","stream":{{"shard":"b"}}}}"#
    )
    .unwrap();
    let before = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(file.path())
            .arg("--json")
            .output()
            .unwrap(),
    );
    assert_eq!(before["suspected_groups"], 0);
    let after = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(file.path())
            .args(["--normalize-rule", "request=[a-z]+=>request=<id>", "--json"])
            .output()
            .unwrap(),
    );
    assert_eq!(after["suspected_groups"], 1);
}

#[test]
#[doc = "@claim:cli-ignore-label"]
fn claim_cli_ignore_label_changes_stream_comparison() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000000,"msg":"checkout timeout","stream":{{"pod":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000100,"msg":"checkout timeout","stream":{{"pod":"b"}}}}"#
    )
    .unwrap();
    let included = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(file.path())
            .arg("--json")
            .output()
            .unwrap(),
    );
    assert_eq!(included["suspected_groups"], 1);
    let ignored = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(file.path())
            .args(["--ignore-label", "pod", "--json"])
            .output()
            .unwrap(),
    );
    assert_eq!(ignored["suspected_groups"], 0);
}

#[test]
#[doc = "@claim:cli-custom-fields"]
fn claim_cli_custom_fields_map_jsonl_records() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        file,
        r#"{{"when":1700000000000,"body":"checkout retry 12345","source_labels":{{"shard":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        file,
        r#"{{"when":1700000000100,"body":"checkout retry 67890","source_labels":{{"shard":"b"}}}}"#
    )
    .unwrap();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args([
            "--message-field",
            "body",
            "--timestamp-field",
            "when",
            "--stream-field",
            "source_labels",
            "--json",
        ])
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""suspected_groups": 1"#));
}

#[test]
#[doc = "@claim:cli-stdin"]
fn claim_cli_stdin_example_reads_jsonl() {
    let output = Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .args(["-", "--format", "jsonl", "--json"])
        .write_stdin(concat!(
            r#"{"ts":1700000000000,"msg":"stdin retry 12345","stream":{"shard":"a"}}"#,
            "\n",
            r#"{"ts":1700000000100,"msg":"stdin retry 67890","stream":{"shard":"b"}}"#,
            "\n"
        ))
        .output()
        .unwrap();
    let report = report_from(output);
    assert_eq!(report["suspected_groups"], 1);
    assert_eq!(report["input_format"], "jsonl");
}

#[test]
#[doc = "@claim:cli-retry-window"]
fn claim_cli_retry_window_changes_which_events_match() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000000000,"msg":"retry id=12345","stream":{{"shard":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        file,
        r#"{{"ts":1700000001600,"msg":"retry id=67890","stream":{{"shard":"b"}}}}"#
    )
    .unwrap();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--window", "1500ms", "--json"])
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""suspected_groups": 0"#));
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--window", "2s", "--json"])
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""suspected_groups": 1"#));
}

#[test]
#[doc = "@claim:cli-limits"]
fn claim_cli_limits_apply_to_events_groups_and_input_size() {
    let file = duplicate_jsonl();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--max-events", "1", "--json"])
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""sampled": true"#));
    let mut groups = tempfile::NamedTempFile::new().unwrap();
    writeln!(
        groups,
        r#"{{"ts":1700000000000,"msg":"checkout timeout id=12345","stream":{{"shard":"a"}}}}"#
    )
    .unwrap();
    writeln!(
        groups,
        r#"{{"ts":1700000000100,"msg":"checkout timeout id=67890","stream":{{"shard":"b"}}}}"#
    )
    .unwrap();
    writeln!(
        groups,
        r#"{{"ts":1700000010000,"msg":"inventory retry id=12345","stream":{{"shard":"c"}}}}"#
    )
    .unwrap();
    writeln!(
        groups,
        r#"{{"ts":1700000010100,"msg":"inventory retry id=67890","stream":{{"shard":"d"}}}}"#
    )
    .unwrap();
    let report = report_from(
        Command::cargo_bin("log-duplicate-lens")
            .unwrap()
            .arg(groups.path())
            .args(["--max-groups", "1", "--json"])
            .output()
            .unwrap(),
    );
    assert_eq!(report["suspected_groups"], 1);
    assert!(report["dropped_group_candidates"].as_u64().unwrap() > 0);

    let mut oversized = tempfile::NamedTempFile::new().unwrap();
    oversized.write_all(&vec![b'x'; 1024 * 1024 + 1]).unwrap();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(oversized.path())
        .args(["--max-input-mb", "1"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains(
            "input exceeds the 1 MiB safety limit",
        ));

    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--max-groups", "0"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains(
            "resource limits must be greater than zero",
        ));
}

#[test]
#[doc = "@claim:cli-redaction"]
fn claim_cli_redaction_removes_a_secret_from_the_report() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(file, r#"{{"ts":1700000000000,"msg":"retry token=secret id=12345","stream":{{"tenant":"token=secret","token=secret":"present","shard":"a"}}}}"#).unwrap();
    writeln!(file, r#"{{"ts":1700000000100,"msg":"retry token=secret id=67890","stream":{{"tenant":"token=secret","token=secret":"present","shard":"b"}}}}"#).unwrap();
    let output = Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--json", "--redact", "token=[^ ]+=>token=[REDACTED]"])
        .output()
        .unwrap();
    assert!(output.status.success());
    let serialized = String::from_utf8(output.stdout).unwrap();
    assert!(serialized.contains("token=[REDACTED]"));
    assert!(!serialized.contains("token=secret"));
    let report: Value = serde_json::from_str(&serialized).unwrap();
    let streams = report["groups"][0]["streams"].as_array().unwrap();
    assert!(streams.iter().all(|stream| {
        stream.as_object().unwrap().iter().all(|(key, value)| {
            !key.contains("secret") && !value.as_str().unwrap_or_default().contains("secret")
        })
    }));
}

#[test]
#[doc = "@claim:cli-local-processing"]
fn claim_cli_local_processing_makes_no_proxy_request() {
    let file = duplicate_jsonl();
    let (proxy, connections, stop, worker) = proxy_capture();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .env("HTTP_PROXY", &proxy)
        .env("HTTPS_PROXY", &proxy)
        .env("ALL_PROXY", &proxy)
        .env_remove("NO_PROXY")
        .arg(file.path())
        .arg("--json")
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""suspected_groups": 1"#));
    thread::sleep(Duration::from_millis(100));
    stop.send(()).unwrap();
    worker.join().unwrap();
    assert_eq!(
        *connections.lock().unwrap(),
        0,
        "the CLI must not contact a configured proxy"
    );
}
