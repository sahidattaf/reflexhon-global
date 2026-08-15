# P2A Feedback Triage Workflow

This is the daily process for turning founding tester feedback into tracked, actionable work during the 14-day beta. It applies to feedback received via the GitHub feedback link, the beta signup form's free-text notes (if any), and any direct reports to the owner.

## Intake classifications

Every incoming item gets exactly one primary classification:

| Classification | Description |
|---|---|
| `language correction` | Grammar, spelling, phrasing, or fluency issue in Papiamentu or English output. |
| `cultural-context correction` | Response is culturally inaccurate, wrongly generalizes Aruba/Bonaire/Curaçao, or misses island-specific nuance. |
| `bug` | The product does not behave as documented (error, crash, broken route, incorrect data). |
| `UX issue` | The product behaves correctly but is confusing, hard to find, or hard to use. |
| `feature request` | Tester wants new capability not currently in scope. |
| `privacy/security concern` | Possible data exposure, unsafe input handling, unclear consent, or similar. |

If an item spans two classifications, pick the most severe and note the secondary in the record's evidence field.

## Severity levels

| Severity | Definition | Example |
|---|---|---|
| Critical | Confirmed privacy/security exposure, or a truth-safety/marketing-safety claim reaching testers (e.g., unsupported financial promise, fabricated capability claim). | Personal data logged or exposed; page claims a reward system that doesn't exist. |
| High | Feature broken or clearly wrong for the documented beta scope; blocks a tester from completing a core action. | Chat endpoint returns errors for valid input; feedback link is broken. |
| Medium | Real correction or issue that doesn't block use. | A Curaçao-specific answer uses an Aruba-only expression. |
| Low | Minor wording, cosmetic, or nice-to-have. | Button label could be clearer. |

A `privacy/security concern` or a confirmed marketing-safety violation is never below Critical or High — see [P2A_LAUNCH_PLAN.md](P2A_LAUNCH_PLAN.md) stop gate.

## Triage record fields

Track each item (in the project's issue tracker or a private triage sheet) with:

- **Owner** — who is responsible for the next action.
- **Status** — `new`, `triaged`, `in progress`, `resolved`, `won't fix`.
- **Evidence** — what was observed (prompt used, screenshot description, steps to reproduce). Redact personal/sensitive details before recording.
- **Decision** — what was decided (fix now, fix later, defer, reject) and why.
- **Resolution** — what was actually done, and when.

## Daily triage steps

1. Collect new items from the GitHub feedback link and any direct reports.
2. Assign classification and severity.
3. For Critical items: notify the owner immediately; do not wait for the next daily pass. Evaluate against the Stop gate in the launch plan the same day.
4. For High/Medium/Low items: record fields above and queue for the weekly review.
5. Decide whether the item should become a public GitHub issue (see below).

## Rules for converting feedback into GitHub issues

Convert an item into a public GitHub issue when:
- It's a concrete, reproducible language, cultural, bug, or UX finding, and
- It contains **no personal or sensitive information**, and
- Making it public doesn't itself create a marketing-safety or privacy problem (e.g., don't publicly restate a tester's private complaint verbatim if it identifies them).

Before creating the issue:
- Strip names, emails, exact locations, or any other identifying detail from the tester's original report.
- Rewrite in neutral, factual language (what was tested, what was expected, what happened).
- Link back to the internal triage record for traceability, not the other way around.

**Never copy personal or sensitive information into GitHub.** If a report contains such information, keep the triage record private, redact the public issue (or skip creating one), and handle any required privacy follow-up outside the public tracker.

## Weekly rollup

At the end of each week, the owner summarizes triage activity (counts by classification/severity, notable corrections, resolutions) into [WEEKLY_REVIEW_TEMPLATE.md](WEEKLY_REVIEW_TEMPLATE.md).
