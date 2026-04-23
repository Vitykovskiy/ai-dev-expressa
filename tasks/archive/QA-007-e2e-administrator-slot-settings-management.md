# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-007`
- Родительская задача: `FEATURE-003`
- Заголовок: `E2E управление настройками слотов administrator`
- Описание: `Система должна иметь browser e2e suite для FEATURE-003 на основании пользовательских сценариев управления рабочими часами и вместимостью слотов: administrator изменяет и сохраняет настройки, получает ожидаемые ошибки валидации и подтверждает влияние новых значений на дальнейшую генерацию доступных слотов текущего дня; пользователь без capability settings получает отказ по documented route.`
- Единица поставки: `FEATURE-003`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `feature-specific browser tests и fixtures для slot settings`

## Примечания

- Зависимости: `AR-006`, `FE-006`, `BE-005`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Есть browser e2e evidence по FEATURE-003: сценарии FTS-003-001, FTS-003-003, FTS-003-004, FTS-003-005 и FTS-003-006 покрыты через canonical local QA route; coverage mapping фиксирует scenario IDs, test files, test titles и required assertions; финальный acceptance run воспроизводим командой npm run test:e2e -- slot-settings против published e2e stand.`
- Проверки: `Browser e2e-сценарии по Scenario IDs FTS-003-001, FTS-003-003, FTS-003-004, FTS-003-005, FTS-003-006; финальный acceptance-прогон выполняется командой npm run test:e2e -- slot-settings по текущему documented route из deployment map; coverage mapping обязан зафиксировать scenario ID -> test file -> test title -> required assertions; результат включает Playwright summary, browser report и ссылки на созданные BUG-задачи с метками frontend/backend/devops при воспроизводимых product failures или launch failures.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-slot-settings.md, если меняются e2e сценарии slot settings, fixtures, contract mocks, test route или acceptance path.`
- Критерии готовности: `E2E QA-задача завершена, когда browser e2e-покрытие FEATURE-003 актуально, финальная команда npm run test:e2e -- slot-settings воспроизводима, последний Playwright-прогон зафиксирован с coverage mapping, summary и browser report, а все найденные blocking product failures или launch failures оформлены через BUG-задачи с метками контура причины или явно отсутствуют.`

## E2E evidence

- Test files: `e2e/slot-settings/admin-slot-settings-save.spec.ts`, `e2e/slot-settings/admin-slot-settings-validation.spec.ts`, `e2e/slot-settings/admin-slot-settings-access.spec.ts`
- Focused browser run: `npm run test:e2e -- slot-settings`
- Focused browser route: local QA Playwright execution against default `https://expressa-e2e-test.vitykovskiy.ru`, with `E2E_BASE_URL` and `E2E_BACKEND_BASE_URL` available only as local QA overrides.

## Coverage mapping

| Scenario ID   | Test file                                                  | Test title                                      | Required assertions                                                                                                                                                                                                                            |
| ------------- | ---------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FTS-003-001` | `e2e/slot-settings/admin-slot-settings-save.spec.ts`       | `FTS-003-001 administrator saves slot settings` | Successful `PUT /backoffice/settings/slot-settings`; success feedback appears after save; reloaded form contains saved `workingHoursOpen`, `workingHoursClose`, and `slotCapacity`.                                                            |
| `FTS-003-003` | `e2e/slot-settings/admin-slot-settings-validation.spec.ts` | `FTS-003-003 invalid working hours`             | Equal open/close values show user-visible working-hours validation; save button is disabled; no success feedback appears; no save request is sent; editable invalid values remain until correction; reload restores the last persisted values. |
| `FTS-003-004` | `e2e/slot-settings/admin-slot-settings-validation.spec.ts` | `FTS-003-004 invalid slot capacity`             | Capacity `0` shows inline field error; save button is disabled; no success feedback appears; no save request is sent; reload restores the last persisted capacity.                                                                             |
| `FTS-003-005` | `e2e/slot-settings/admin-slot-settings-access.spec.ts`     | `FTS-003-005 settings access guard`             | Barista session has no `settings` capability; settings navigation link is absent; direct `/settings` route shows `403` forbidden state; settings heading and save action are absent.                                                           |
| `FTS-003-006` | `e2e/slot-settings/admin-slot-settings-save.spec.ts`       | `FTS-003-006 settings affect slot generation`   | Saved settings are followed by `/customer/slots` JSON verification; slots are limited to the saved working window; every slot uses 10-minute interval length, current-day date, saved capacity limit, and zero active order count.             |

## Acceptance evidence

- Required command: `npm run test:e2e -- slot-settings`
- Required default stand: `https://expressa-e2e-test.vitykovskiy.ru`
- Required evidence: Playwright summary and browser report from the local QA command.
- Last acceptance run date: `2026-04-23`
- Last acceptance run result: `5 passed`
- Last acceptance run summary: `FTS-003-001`, `FTS-003-003`, `FTS-003-004`, `FTS-003-005` и `FTS-003-006` passed в published `test-e2e` route; `npm run test:e2e -- slot-settings` завершился без product failures и launch failures.
- Additional route verification: `curl -i https://expressa-e2e-test.vitykovskiy.ru/customer/slots` возвращает `HTTP/1.1 200 OK` и `Content-Type: application/json; charset=utf-8`.
- Browser report: `e2e/playwright-report`
- Failure artifacts: `не требуются; последний acceptance run завершился без падений`

## Defect status

- Blocking product failures: `не выявлены`
- Blocking launch failures with clear product/runtime cause contour: `не выявлены`
- BUG tasks created: `не создавались; acceptance route восстановлен, воспроизводимых product failures и launch failures нет`
- Blocker recorded in this QA task: `отсутствует`
