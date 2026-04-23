# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-007`
- Родительская задача: `FEATURE-003`
- Заголовок: `E2E управление настройками слотов administrator`
- Описание: `Система должна иметь browser e2e suite для FEATURE-003 на основании пользовательских сценариев управления рабочими часами и вместимостью слотов: administrator изменяет и сохраняет настройки, получает ожидаемые ошибки валидации и подтверждает влияние новых значений на дальнейшую генерацию доступных слотов текущего дня; пользователь без capability settings получает отказ по documented route.`
- Единица поставки: `FEATURE-003`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `локальный containerized e2e runner из текущего QA stack; feature-specific browser tests и fixtures для slot settings`

## Примечания

- Зависимости: `AR-006`, `FE-006`, `BE-005`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Есть browser e2e evidence по FEATURE-003: сценарии FTS-003-001, FTS-003-003, FTS-003-004, FTS-003-005 и FTS-003-006 покрыты через documented route; coverage mapping фиксирует scenario IDs, test files, test titles и required assertions; финальный acceptance run воспроизводим локальной containerized командой QA runner.`
- Проверки: `Browser e2e-сценарии по Scenario IDs FTS-003-001, FTS-003-003, FTS-003-004, FTS-003-005, FTS-003-006; финальный acceptance-прогон выполняется локальной containerized командой QA runner по текущему documented route из deployment map; coverage mapping обязан зафиксировать scenario ID -> test file -> test title -> required assertions; результат включает runner summary, browser report, pass/fail локального контейнерного прогона и ссылки на созданные BUG-задачи с метками frontend/backend/devops при воспроизводимых product failures или launch failures.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-slot-settings.md, если меняются e2e сценарии slot settings, fixtures, contract mocks, test route или acceptance path.`
- Критерии готовности: `E2E QA-задача завершена, когда browser e2e-покрытие FEATURE-003 актуально, финальная локальная containerized команда QA runner воспроизводима, последний локальный контейнерный прогон зафиксирован с coverage mapping, runner summary и browser report, а все найденные blocking product failures или launch failures оформлены через BUG-задачи с метками контура причины или явно отсутствуют.`

## E2E evidence

- Test file: `e2e/slot-settings/admin-slot-settings.spec.ts`
- Source commit for final evidence attempt: `303d9da`
- Focused browser run: `npm --prefix e2e test -- slot-settings`
- Focused browser run result after subtask 02: `4 passed`, `1 skipped`
- Skipped focused scenario: `FTS-003-006 settings affect slot generation`
- Skip reason: `E2E_BACKEND_BASE_URL is required to query /customer/slots as JSON.`

## Coverage mapping

| Scenario ID   | Test file                                       | Test title                                      | Required assertions                                                                                                                                                                                                                            |
| ------------- | ----------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FTS-003-001` | `e2e/slot-settings/admin-slot-settings.spec.ts` | `FTS-003-001 administrator saves slot settings` | Successful `PUT /backoffice/settings/slot-settings`; success feedback appears after save; reloaded form contains saved `workingHoursOpen`, `workingHoursClose`, and `slotCapacity`.                                                            |
| `FTS-003-003` | `e2e/slot-settings/admin-slot-settings.spec.ts` | `FTS-003-003 invalid working hours`             | Equal open/close values show user-visible working-hours validation; save button is disabled; no success feedback appears; no save request is sent; editable invalid values remain until correction; reload restores the last persisted values. |
| `FTS-003-004` | `e2e/slot-settings/admin-slot-settings.spec.ts` | `FTS-003-004 invalid slot capacity`             | Capacity `0` shows inline field error; save button is disabled; no success feedback appears; no save request is sent; reload restores the last persisted capacity.                                                                             |
| `FTS-003-005` | `e2e/slot-settings/admin-slot-settings.spec.ts` | `FTS-003-005 settings access guard`             | Barista session has no `settings` capability; settings navigation link is absent; direct `/settings` route shows `403` forbidden state; settings heading and save action are absent.                                                           |
| `FTS-003-006` | `e2e/slot-settings/admin-slot-settings.spec.ts` | `FTS-003-006 settings affect slot generation`   | Saved settings are followed by `/customer/slots` JSON verification; slots are limited to the saved working window; every slot uses 10-minute interval length, current-day date, saved capacity limit, and zero active order count.             |

## Acceptance runner evidence

- Required command: `npm run test:e2e:local`
- Required command result: `failed before Docker build`
- Required command failure: `mkdir: cannot create directory 'artifacts/qa-005-local-e2e': File exists`
- Visible filesystem state after failure: PowerShell, `cmd`, and `bash ls` did not show `artifacts/qa-005-local-e2e`; only `artifacts/remote-e2e` was visible before the retry.
- Retry command for isolated evidence path: `env LOCAL_E2E_ARTIFACT_DIR=artifacts/qa-007-local-e2e bash scripts/run-local-container-e2e.sh`
- Retry result: `blocked by local runner timeout after 20 minutes`
- Retry artifact: `artifacts/qa-007-local-e2e/local-e2e-20260423T115229Z.host.log`
- Retry artifact status: host log was created with `0` bytes; no host summary, container summary, browser report, or Playwright test results were written.
- Browser report path for successful local containerized runner: `artifacts/qa-007-local-e2e/playwright-report/index.html`
- Browser report status: `not created because the local runner did not reach browser e2e execution`
- Final acceptance status: `blocked by local runner/filesystem environment before browser e2e evidence could complete`

## Defect status

- Blocking product failures: `не обнаружены в доступном focused browser evidence`
- Blocking launch failures with clear product/runtime cause contour: `отсутствуют`
- BUG tasks created: `не создавались`
- Blocker recorded in this QA task: local containerized acceptance runner is not reproducible in the current workspace because the default artifact path fails at `mkdir`, and an isolated artifact-dir retry did not produce runner summary or browser report before timeout.
