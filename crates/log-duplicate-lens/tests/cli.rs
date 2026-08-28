use assert_cmd::Command;
use predicates::prelude::*;
use serde_json::Value;
use std::io::Write;

fn duplicate_jsonl() -> tempfile::NamedTempFile {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(file, r#"{{"ts":1700000000000,"msg":"retry token=secret id=12345","stream":{{"shard":"a"}}}}"#).unwrap();
    writeln!(file, r#"{{"ts":1700000000100,"msg":"retry token=secret id=67890","stream":{{"shard":"b"}}}}"#).unwrap();
    file
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
fn claim_cli_demo_runs_without_an_input_path() {
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg("demo")
        .assert()
        .success()
        .stdout(predicate::str::contains("7 labeled log records"))
        .stdout(predicate::str::contains("2 suspected duplicate groups / 3 duplicate copies"))
        .stdout(predicate::str::contains("Demo report:"));
}

#[test]
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
fn claim_cli_retry_window_changes_which_events_match() {
    let mut file = tempfile::NamedTempFile::new().unwrap();
    writeln!(file, r#"{{"ts":1700000000000,"msg":"retry id=12345","stream":{{"shard":"a"}}}}"#).unwrap();
    writeln!(file, r#"{{"ts":1700000001600,"msg":"retry id=67890","stream":{{"shard":"b"}}}}"#).unwrap();
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
fn claim_cli_limits_apply_to_events_groups_and_input_size() {
    let file = duplicate_jsonl();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--max-events", "1", "--json"])
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""sampled": true"#));
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--max-groups", "0"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains("resource limits must be greater than zero"));
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--max-input-mb", "0"])
        .assert()
        .code(2)
        .stderr(predicate::str::contains("resource limits must be greater than zero"));
}

#[test]
fn claim_cli_redaction_removes_a_secret_from_the_report() {
    let file = duplicate_jsonl();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .arg(file.path())
        .args(["--json", "--redact", "token=[^ ]+=>token=[REDACTED]"])
        .assert()
        .success()
        .stdout(predicate::str::contains("token=[REDACTED]"))
        .stdout(predicate::str::contains("token=secret").not());
}

#[test]
fn claim_cli_local_processing_runs_with_an_unusable_proxy() {
    let file = duplicate_jsonl();
    Command::cargo_bin("log-duplicate-lens")
        .unwrap()
        .env("HTTP_PROXY", "http://127.0.0.1:1")
        .env("HTTPS_PROXY", "http://127.0.0.1:1")
        .arg(file.path())
        .arg("--json")
        .assert()
        .success()
        .stdout(predicate::str::contains(r#""suspected_groups": 1"#));
}
