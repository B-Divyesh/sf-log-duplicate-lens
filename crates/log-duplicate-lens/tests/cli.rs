use assert_cmd::Command;
use predicates::prelude::*;
use std::io::Write;

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
fn documented_json_flow_and_exit_code_work() {
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
