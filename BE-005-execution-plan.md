# BE-005 Execution Plan

## Назначение

План задает маршрут реализации backend-контура `FEATURE-003`.

Целевой результат: backend предоставляет administrator-only API чтения и сохранения настроек слотов, а также использует последнее успешно сохраненное сочетание рабочих часов и вместимости для генерации доступных слотов текущего дня.

## Границы

### Разрешенные изменения

- `BE-005-execution-plan.md`
- `backend/src/app.module.ts`
- `backend/src/slot-settings/**`
- `backend/test/**`
- `docs/architecture/application-map/backend-slot-settings.md`
- `tasks/BE-005-administrator-slot-settings-backend.md`

### Запрещенные изменения

- `frontend/`
- `e2e/`
- `.references/`
- runtime-конфигурация и delivery path
- контур `identity-access`, кроме использования существующего guard/capability contract

## Подзадачи

1. [ ] Реализовать доменные типы, ошибки и проверки `slot-settings`.
2. [ ] Реализовать in-memory хранение snapshot и application services чтения, сохранения и генерации доступных слотов.
3. [ ] Реализовать `GET/PUT /backoffice/settings/slot-settings` и `GET /customer/slots`.
4. [ ] Добавить unit/integration tests для validations, guard и применения сохраненных настроек к генерации слотов.
5. [ ] Обновить backend application map и task-card по фактическому результату handoff.

## Входные источники

- `tasks/BE-005-administrator-slot-settings-backend.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/use-cases/administrator-manage-slot-settings.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-slot-settings.md`
- `docs/architecture/application-map/backend-access.md`

## Ключевой риск

- Верхняя граница `slotCapacity` не подтверждена каноническими источниками, поэтому backend не должен канонизировать `50` как системный максимум только по UI reference.

## Проверки

- Проверить дефолтный ответ до первого сохранения: `09:00–20:00` и `5`.
- Проверить ошибки `invalid-working-hours` и `invalid-slot-capacity`.
- Проверить guard `settings` для чтения и сохранения настроек.
- Проверить влияние сохраненных настроек на `GET /customer/slots`.
- Проверить `npm test`, `npm run typecheck` и `npm run build` в `backend/`.

## Критерии готовности

- Backend является источником истины для рабочих часов и вместимости слотов.
- Administrator может читать и сохранять настройки без чтения frontend-кода.
- Генерация доступных слотов использует последнее успешно сохраненное состояние.
- Контурная карта backend описывает фактическую структуру production-кода.
