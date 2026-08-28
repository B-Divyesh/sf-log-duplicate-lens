# Copy audit — polish 2

## Landing sentences

| Copy | Words | Status |
| --- | ---: | --- |
| Find duplicate Loki logs across streams | 6 | pass |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 10 | pass |
| See two duplicate groups now. | 6 | pass |
| Processes samples in this browser | 5 | pass |
| Browser input limit: 5 MB | 5 | pass |
| Evidence, not verdicts | 3 | pass |
| Paste JSON lines, a Loki response, or plain lines. | 9 | pass |
| The browser reads up to 5 MB. | 6 | pass |
| Redact sensitive values before sharing the exported report. | 7 | pass |
| A match is a lead, not a verdict. | 8 | pass |
| Look for one normalized message across streams within the retry window. | 10 | pass |
| Health checks and expected fan-out can look alike. | 8 | pass |
| Review the stream labels. | 4 | pass |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | pass |
| Run the bundled sample before pointing the tool at a log export. | 11 | pass |
| Demo uses the bundled seven-record sample and writes a temporary report. | 10 | pass |
| JSON uses --json for a machine-readable report. | 7 | pass |
| Limits use --max-events, --max-groups, and --max-input-mb. | 6 | pass |
| Find suspected duplicate groups across Loki streams. | 7 | pass |

No landing sentence exceeds 22 words. No banned marketing word appears. The
catalog line is 84 characters, starts with “Find,” and names the job plainly.

## Terminology

| Concept | Product term |
| --- | --- |
| Candidate set of repeated logs | suspected duplicate group |
| Extra observations | duplicate copies |
| Data source identity | stream |
| Time matching control | retry window |
| Built-in trial data | sample |

The source labels and accessible names use “Retry window” and “Copy install
command” exactly. Loki is introduced as a Loki query response at its first
README use.
