# P2A — Public Beta Launch Plan

Status: Draft, pending owner sign-off on remaining open items; launch dates below are owner-approved
Program type: invite-only learning program
Duration: 14 days (2026-08-17 – 2026-08-30)
Maximum first cohort: **25 founding testers**

This plan governs Phase 2A of the Reflexhon public beta. It does not authorize a general-audience launch, paid tier, token, or points system. It covers only the scope described below.

## Owner-approved launch dates

The dates below are confirmed by the owner for this controlled beta window. Every other section of this plan remains in draft pending final owner sign-off on the entry-criteria checklist.

| Milestone | Date |
|---|---|
| Start (Day 1) | 2026-08-17 |
| Day-7 review | 2026-08-23 |
| Day-14 close | 2026-08-30 |
| Go / adjust / stop decision | 2026-08-31 |

## Objectives

1. Learn whether founding testers can complete a Papiamentu chat interaction, understand its cultural-context limits, and give evaluable feedback without guidance.
2. Collect language and cultural-context corrections from real testers across Aruba, Bonaire, and Curaçao contexts.
3. Validate that the feedback intake path (GitHub issues + Google Form) is usable and produces actionable reports.
4. Confirm the beta disclosures (mistakes warning, human-review notice, privacy notice) are seen and understood before testers submit input.
5. Produce one verified weekly review per week of the program, using [MEASUREMENT_SPEC.md](MEASUREMENT_SPEC.md) metrics only.

## Non-goals

Explicitly out of scope for P2A:

- No ReflexPoints, ReflexCoin, tokens, wallets, or any transferable value.
- No payments, pricing, billing, or paid tiers.
- No financial promises, equity offers, or compensation for participation.
- No claims of adoption, user counts, accuracy, or performance that are not independently verified per this program.
- No new database, authentication system, email automation, or third-party integration (implementation stays documentation-first, per program scope).
- No general-audience or public marketing push. Access is invite-only for named founding testers.

## Entry criteria

The program may start only when all of the following are true:

- [ ] Owner has confirmed the cohort size cap (max 25) and the invite list.
- [ ] The public beta UI (`public/index.html`) carries the beta badge, mistakes disclosure, human-review notice, and privacy notice unchanged or strengthened.
- [ ] `npm test` and `npm run lint` pass on the launch branch.
- [ ] The Google Form signup link (`https://forms.gle/G1iYxEPqV2Zpd6447`) is live and reachable.
- [ ] The GitHub feedback issue link is live and reachable.
- [ ] [FOUNDING_TESTER_GUIDE.md](FOUNDING_TESTER_GUIDE.md) has been sent or is ready to send to invitees.
- [ ] Owner has reviewed and accepted this plan.

## Exit criteria

The 14-day window ends when any of the following is true, whichever comes first:

- Day 14 (2026-08-30) is reached and a final weekly review is completed, or
- The cohort reaches 25 accepted founding testers and 14 days have elapsed since the first tester was activated, or
- A stop gate (below) is triggered.

The go / adjust / stop decision informed by the final review is made on 2026-08-31.

Exit does not by itself authorize a wider launch. A wider launch requires a separate, explicit decision informed by the final review.

## Operating rhythm

**Daily (owner or designated reviewer):**
- Scan new GitHub issues opened via the beta feedback link.
- Triage new items using [FEEDBACK_TRIAGE_WORKFLOW.md](FEEDBACK_TRIAGE_WORKFLOW.md).
- Flag any critical privacy/security item immediately; do not wait for the weekly cycle.

**Weekly (owner), due 2026-08-23 (Day-7) and 2026-08-30 (Day-14):**
- Reconcile Google Form signups against activated testers.
- Compile the week's metrics per [MEASUREMENT_SPEC.md](MEASUREMENT_SPEC.md).
- Complete [WEEKLY_REVIEW_TEMPLATE.md](WEEKLY_REVIEW_TEMPLATE.md) and store it under this program's review log.
- Decide and record a go / hold / stop recommendation for the following week.

## Gates

**Go** — continue the program as planned into the next week or to general availability review, when:
- No unresolved critical privacy/security issue exists.
- The cohort is actively producing feedback (at least one useful submission per active week).
- No truth-safety or marketing-safety regression has been found in the live UI or docs.

**Hold** — pause new tester activation, keep existing testers running, when:
- A high-severity (not critical) issue is open and awaiting a fix or decision.
- Verified metrics cannot be reconciled confidently for a given week.
- The owner needs more time to evaluate a borderline finding.

**Stop** — end the program immediately, when:
- A critical privacy or security issue is confirmed (e.g., sensitive data exposure, broken access control).
- A confirmed truth-safety or marketing-safety violation reaches testers (e.g., an unsupported claim, an accidental financial promise).
- The owner decides the learning objective cannot be met safely within this scope.

Any Stop must be documented in the weekly review log with the triggering evidence, even if the stop happens mid-week.

## Proposed targets vs. verified results

Targets below are **proposed planning inputs only**. They are not claims of expected or guaranteed outcomes, and must not be published externally as commitments.

| Metric | Proposed target (planning only) | Verified result |
|---|---|---|
| Founding testers activated | up to 25 | *(fill in weekly review)* |
| Testers submitting at least one piece of feedback | majority of activated testers | *(fill in weekly review)* |
| Useful feedback submissions (see triage workflow) | at least 1 per active tester | *(fill in weekly review)* |
| Cultural/language corrections logged | tracked, no fixed target | *(fill in weekly review)* |
| Critical privacy/security issues | 0 | *(fill in weekly review)* |

Verified results are filled in only from data collected per [MEASUREMENT_SPEC.md](MEASUREMENT_SPEC.md) and the weekly review process — never estimated or projected.

## Related documents

- [FOUNDING_TESTER_GUIDE.md](FOUNDING_TESTER_GUIDE.md) — sent to invitees
- [FEEDBACK_TRIAGE_WORKFLOW.md](FEEDBACK_TRIAGE_WORKFLOW.md) — daily triage process
- [MEASUREMENT_SPEC.md](MEASUREMENT_SPEC.md) — what is and is not measured
- [WEEKLY_REVIEW_TEMPLATE.md](WEEKLY_REVIEW_TEMPLATE.md) — weekly reporting format
