# Контекстный пакет QA-007/01

## Карточка контекста

- Исходная задача: `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- Подзадача: `01 — E2E Positive Save And Slot Generation`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `Playwright browser e2e для успешного сохранения настроек и влияния на генерацию слотов`
- Связанный план: `QA-007-execution-plan.md`

## Цель подзадачи

Создать feature-specific browser e2e spec для `FEATURE-003`, который покрывает `FTS-003-001` и `FTS-003-006` через documented route.

## Поведенческий промпт исполнителя

```text
You operate as a strict QA engineer.

Complete only subtask 01 from QA-007 within the source task QA-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- `QA-007-execution-plan.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/use-cases/administrator-manage-slot-settings.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/backend-slot-settings.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `e2e/playwright.config.ts`
- `e2e/menu-catalog/admin-menu-catalog.spec.ts`
- `frontend/src/views/SettingsView.vue`
- `frontend/src/components/slot-settings/SlotSettingsForm.vue`
- `frontend/src/modules/slot-settings/api.ts`
- `backend/src/slot-settings/slot-settings.controller.ts`
- `backend/src/slot-settings/customer-slots.controller.ts`
- `backend/src/slot-settings/available-slots.service.ts`

## Ключевые факты из источников

- `FTS-003-001` requires persisted form values, success notification, and successful save operation.
- `FTS-003-006` requires generated intervals, saved capacity limit, current-day date, and 10-minute slot length.
- Settings UI route is `/settings`; fields have ids `#slot-settings-open`, `#slot-settings-close`, `#slot-settings-capacity`; the save button text is `Сохранить`.
- Backoffice settings API is `GET/PUT /backoffice/settings/slot-settings`; customer slots API is `GET /customer/slots`.

## Разрешенная зона правок

- `e2e/slot-settings/**`
- `e2e/package.json` only if an existing script-compatible test path requires it.

## Запрещенная зона правок

- Production backend code.
- Production frontend code.
- Documentation and task cards, except this subtask may update only its own status line in `QA-007-execution-plan.md` when instructed to mark completion.

## Ожидаемый результат

`e2e/slot-settings/admin-slot-settings.spec.ts` or equivalent contains browser e2e coverage for successful administrator save and subsequent slot generation behavior.

## Проверки

- `npm --prefix e2e test -- slot-settings` when a target environment is available.

## Критерии готовности

- `FTS-003-001` appears in a Playwright test title or annotation.
- `FTS-003-006` appears in a Playwright test title or annotation.
- The test asserts UI success feedback only after the save operation.
- The test asserts `/customer/slots` reflects saved settings.

## Открытые вопросы

- Нет.
