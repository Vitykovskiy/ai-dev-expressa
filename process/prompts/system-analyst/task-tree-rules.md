# Task Tree Rules for Sprint and Feature

## Purpose

This instruction defines how the system analyst must form the task tree for one sprint when preparing tasks for development.

## Rules

- One top-level `SPRINT-*` task must represent exactly one sprint and nothing outside it.
- `FEATURE-*` is the only delivery-unit coordination card: one feature is one finished, working, testable, and demonstrable outcome for a customer or stakeholder.
- `FEATURE-*` is not an implementation task.
- A `FEATURE-*` with missing or outdated feature package, design readiness, validations, errors, interfaces, edge cases, role read routes, or QA coverage mapping must be owned by the system analyst.
- A `FEATURE-*` remains in analytical preparation until its feature package is ready for architecture handoff.
- A UI-related `FEATURE-*` with a blocking design-readiness gap remains in analytical preparation until the required `DESIGN-*` task is complete and the updated approved UI source is verified.
- An analytically ready `FEATURE-*` must be handed to the architect for decomposition before implementation starts.
- Production code, tests, runtime configuration, and `.references/` changes are made only under child `AR/FE/BE/DO/QA-*` tasks or `BUG-*` tasks with explicit edit boundaries.
- The system analyst does not create `AR/FE/BE/DO/QA-*` child tasks by default.
- An internal technical prerequisite, analytical system slice, or isolated capability qualifies as a standalone feature only when it can be accepted as a separate finished outcome.
- The system analyst creates or updates `SPRINT-*` and `FEATURE-*` cards.
- A `FEATURE-*` card uses `Роль: Системный аналитик` during feature-level system documentation preparation.
- A `FEATURE-*` card uses `Роль: Архитектор` only after feature package is ready for architecture handoff.
- A `FEATURE-*` card uses `Роль: Тестирование` when the assembled feature is ready for QA acceptance after mandatory child tasks are complete.
- Each analytically ready new `FEATURE-*` card must link to one feature package in `docs/system/feature-specs/<feature-id>-<slug>/`.
- Each analytically ready new `FEATURE-*` card must link to the role-relevant package slices required by its `Маршрут чтения`.
- A ready feature package is required before `FEATURE-*` handoff to the architect.
- The feature package must cover feature boundary, user workflows, UI interaction requirements where applicable, interfaces, inputs, validations, errors, system links, design readiness, role read routes, and architecture handoff checklist.
- Package `test-scenarios.md` must cover stable scenario IDs, manual QA route, required e2e coverage, expected results, required assertions, and coverage mapping placeholders.
- The system analyst must not create architect, backend, frontend, DevOps, or QA child tasks in advance.
- The architect accepts one analytically ready `FEATURE-*` at a time and decomposes it into `AR/FE/BE/DO/QA-*` tasks.
- If a UI feature has approved contracts or prototypes, the system analyst records the package trace, the UI behavior mapping, and the exact versioned design sources needed for handoff.
- If a UI feature requires approved UI source correction, the system analyst creates a self-contained `DESIGN-*` task with add/change/remove instructions for the designer.
- The system analyst does not change approved UI source or design artifacts directly.
- For every subsequent feature decomposition, two QA tasks are mandatory: one manual QA task and one e2e QA task.
- The manual QA task must cover user scenario acceptance, manual exploratory checks, UI parity for UI features, and defect triage.
- The e2e QA task must include e2e tests for that feature based on user scenarios.
- The manual QA task and e2e QA task must use the same package `test-scenarios.md` slice as the shared scenario source.
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
- `feature package` is the mandatory decomposed handoff artifact for `FEATURE-*`; canonical `use-cases`, `contracts`, `domain-model`, `state-models`, and `ui-behavior-mapping` remain the source documents behind it.
- `test-scenarios.md` is the mandatory QA-facing package slice for `FEATURE-*`; it maps documented behavior to manual and e2e coverage.
- Manual QA and e2e tests belong in `QA-*` tasks for the specific feature and do not replace the `FEATURE-*` card itself.
