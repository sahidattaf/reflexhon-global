# P2A Measurement Spec

This defines exactly what is and is not measured during the Phase 2A beta. It is written to match what `public/index.html` and `public/analytics.html` actually implement today — not aspirational analytics. See [docs/security/P0_ENDPOINT_AUDIT.md](../security/P0_ENDPOINT_AUDIT.md) for the security review that constrains this design.

## Hard constraints

- No fingerprinting.
- No persistent cross-session tracking (no cookies, no device IDs, no cross-visit identity).
- No client-IP storage or transmission to analytics.
- No unsupported analytics claims (e.g., "real-time," "live dashboard," specific visitor counts) in any public-facing copy.

## Category 1 — Session-only UI events

Implemented today in `public/index.html` via `trackEvent(name)`, stored only in that browser tab's `sessionStorage` key `reflexhon_beta_events`. Counters reset when the tab/session ends and are never transmitted anywhere; they exist only for a tester to self-inspect their own session if asked.

Current events:

| Event | Fires when |
|---|---|
| `page_view` | The beta page loads. |
| `tab_view_chat` / `tab_view_datasets` / `tab_view_analytics` | Tester switches to that tab. |
| `example_prompt_selected` | Tester clicks one of the three demo prompt chips. |
| `message_submitted` | Tester sends a chat message. |
| `response_success` / `response_error` / `response_network_error` | The chat API call resolves. |
| `feedback_opened` | Tester clicks "Give public feedback." |
| `beta_signup_opened` | Tester clicks "Join Beta Community." |

Notes:
- Message and prompt **text is never included** in these counters — only event names and counts.
- This is a UI-side self-report mechanism, not server-side analytics. It does not tell the owner how many distinct people visited; it cannot be aggregated across testers because nothing is sent off the page.

## Category 2 — Google Form operational data

Collected only by Google Forms/Sheets at `https://forms.gle/G1iYxEPqV2Zpd6447`, outside this codebase:

- **Completed signups** — count of founding testers who submitted the form. This is the authoritative signup count for the program; nothing in the app itself records signups.

The owner reviews this data manually in Google Forms/Sheets. It is not pulled into the app or any automated pipeline as part of this program.

## Category 3 — Manually verified program metrics

These require the owner to manually reconcile GitHub activity, the Google Form, and direct tester contact each week. They are not produced by any automated instrumentation:

- **Activated testers** — testers who signed up (Category 2) and are confirmed to have accessed the beta (e.g., via a follow-up confirmation, or self-reported use).
- **Useful feedback submissions** — GitHub issues or reports triaged as at least Medium severity and classified per [FEEDBACK_TRIAGE_WORKFLOW.md](FEEDBACK_TRIAGE_WORKFLOW.md) (excludes duplicates and non-actionable notes).
- **Corrections accepted** — `language correction` or `cultural-context correction` items where the Decision field records the correction was accepted.
- **Issues resolved** — triage records with Status `resolved`.

These are recorded directly in [WEEKLY_REVIEW_TEMPLATE.md](WEEKLY_REVIEW_TEMPLATE.md), sourced from the triage records, not estimated.

## Category 4 — Metrics not currently available

Do not report these as if they exist. They are explicitly not implemented in this program:

- **Unique or returning visitor counts.** `public/analytics.html` labels this "Visitor identity — Not collected by this preview." No visitor identity is measured anywhere in this program.
- **Server-side page-visit counts.** The deployed Worker path does not persist page-view logs for the beta UI.
- **Cross-session or cross-device tester identity.** There is no login and no persistent identifier linking sessions to a person, except what a tester voluntarily provides via the Google Form.
- **Real-time or live dashboards.** `/api/v1/analytics` returns simplified, non-persistent, in-memory placeholder data, as already disclosed on the Usage Preview tab.
- **Funnel or conversion rates from page view to signup.** Because page views (Category 1) and signups (Category 2) live in separate, non-linked systems, a precise per-tester funnel cannot be computed — only the two independent counts side by side.

## Reporting rule

Every metric quoted in a weekly review or any external communication must cite which category (1–4) it came from. A Category 4 item must never be reported as a number — only as "not currently available."
