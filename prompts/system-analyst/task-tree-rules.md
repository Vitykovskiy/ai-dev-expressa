# Task Tree Rules for Sprint and Feature

## Purpose

This instruction defines how the system analyst must form the task tree for one sprint when preparing tasks for development.

## Rules

- One top-level `SPRINT-*` task must represent exactly one sprint and nothing outside it.
- `FEATURE-*` is the only delivery-unit card: one feature is one finished, working, testable, and demonstrable outcome for a customer or stakeholder.
- An internal technical prerequisite, analytical system slice, or isolated capability qualifies as a standalone feature only when it can be accepted as a separate finished outcome.
- The system analyst creates or updates `SPRINT-*` and `FEATURE-*` cards.
- Each `FEATURE-*` card must link to exactly one feature spec in `docs/system/feature-specs/<feature-id>-<slug>.md`.
- A ready feature spec is required before `FEATURE-*` handoff to the architect.
- The feature spec must cover feature boundary, user workflows, UI interaction requirements where applicable, inputs, validations, errors, system links, design readiness, and architecture handoff checklist.
- The system analyst must not create architect, backend, frontend, DevOps, or QA child tasks in advance.
- The architect accepts one analytically ready `FEATURE-*` at a time and decomposes it into `AR/FE/BE/DO/QA-*` tasks.
- For every subsequent feature decomposition, two QA tasks are mandatory: one manual QA task and one e2e QA task.
- The manual QA task must cover user scenario acceptance, manual exploratory checks, UI parity for UI features, and defect triage.
- The e2e QA task must include e2e tests for that feature based on user scenarios.
- `DO-*` is created only when the feature actually changes the VPS environment, `test` or `production` deployment, GitHub Actions, or introduces a mandatory VPS test/e2e run path needed for QA acceptance.
- While at least one `FEATURE-*` inside the sprint is incomplete, `SPRINT-*` remains in status `В работе`.
- `FEATURE-*` moves to status `Ожидает тестирования` only after all mandatory contour tasks for that feature are complete.
- The QA engineer takes `FEATURE-*` only after it has moved to status `Ожидает тестирования`.
- `FEATURE-*` is closed only after manual QA is complete, e2e passes, the assembled result is verified, and blocking `BUG-*` tasks are closed.
- `SPRINT-*` is closed only after all `FEATURE-*` tasks included in it are complete.
- Do not combine several finished features into one `FEATURE-*` card, even if they belong to one business scenario or were identified in one analysis session.

## Notes

- Analytical decomposition of the system into menu, slots, notifications, access, and other system slices is not the same as decomposing a sprint into features.
- `SPRINT-*` is the coordination boundary for a group of features, and `FEATURE-*` is the coordination boundary for one delivery unit.
- `feature-spec` is the mandatory scenario-level handoff document for `FEATURE-*`; canonical `use-cases`, `contracts`, `domain-model`, `state-models`, and `ui-behavior-mapping` remain the source documents behind it.
- Manual QA and e2e tests belong in `QA-*` tasks for the specific feature and do not replace the `FEATURE-*` card itself.
