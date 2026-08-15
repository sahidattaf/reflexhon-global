# Contributing to Reflexhon Global

Thank you for helping build Reflexhon. This guide covers how to report a bug, submit a Papiamentu or cultural-context correction, and propose a code change. For community principles and roles, see [COMMUNITY.md](COMMUNITY.md). For conduct expectations, see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Privacy first

**Never submit personal or sensitive information** in an issue, pull request, commit message, or code sample — no passwords, financial details, health information, government IDs, or anyone else's personal data. If a bug report or correction originally contained such information, redact it before posting.

## Reporting a bug

1. Check open issues first to avoid a duplicate.
2. Open a new GitHub issue describing:
   - what you did (steps to reproduce),
   - what you expected,
   - what actually happened (exact error text or behavior, with personal/sensitive details removed).
3. If the bug is a privacy or security concern, classify it as such and follow [docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md](docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md) rather than posting exploit details publicly — contact the maintainer directly first.

## Submitting a Papiamentu or cultural-context correction

Papiamentu is not simple translation, and Aruba, Bonaire, and Curaçao are not one homogeneous culture. If a response is linguistically wrong, culturally inaccurate, or wrongly generalizes across islands:

1. Open a GitHub issue (or use the beta feedback link if you're a founding tester).
2. Include the exact prompt tested, the response received, the correction, and the island/dialect context if relevant.
3. Classify it as a `language correction` or `cultural-context correction` per [docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md](docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md).

## Proposing a code change

1. Fork or branch from `main`.
2. Follow the existing layered architecture (routes → services → utils) described in `CLAUDE.md`.
3. Add or update tests for the behavior you change.
4. Run the checks below before opening a pull request.
5. Open a pull request against `main` describing what changed and why, and link any related issue.

## Verified behavior vs. proposed capabilities

Documentation and pull request descriptions must clearly separate:
- **Verified behavior** — confirmed by running tests, checking live routes, or inspecting current code.
- **Proposed or planned capabilities** — not yet implemented, or implemented but not verified end-to-end.

Do not describe planned or partially built features as if they are live, tested, or production-verified. When in doubt, state what was actually checked and when.

## Test, lint, and pull-request expectations

Before opening a pull request:

```bash
npm install
npm test
npm run lint
```

- All tests must pass; do not skip or delete a failing test to make the suite green — fix the underlying issue or explain why the test's expectation changed.
- Lint must not introduce new errors. New warnings should be justified in the PR description.
- Keep pull requests scoped to one concern where practical, and note in the description what was and wasn't validated (e.g., "ran `npm test` and `npm run lint`; did not test against the deployed Worker").

## Questions

Open an issue, or contact [@sahidattaf](https://github.com/sahidattaf).
