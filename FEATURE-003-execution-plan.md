# FEATURE-003 Execution Plan

## Назначение

План задает порядок аналитической подготовки `FEATURE-003` к передаче архитектору.

Целевой результат: фича получает канонический feature package для архитектурной декомпозиции без чтения production-кода:

- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- обновленную навигацию `docs/system/README.md`
- обновленную карточку `tasks/FEATURE-003-administrator-slot-settings-management.md`

## Границы

### Разрешенные изменения

- `FEATURE-003-execution-plan.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/README.md`
- `tasks/FEATURE-003-administrator-slot-settings-management.md`

### Запрещенные изменения

- `backend/`
- `frontend/`
- `e2e/`
- `.references/`
- runtime-конфигурация
- production-код

## Подзадачи

1. [ ] Свести канонические источники по рабочим часам, вместимости и генерации слотов.
2. [ ] Зафиксировать feature boundary, workflows, UI states, validations, errors и design readiness для `FEATURE-003`.
3. [ ] Подготовить sibling документ сценариев тестирования со stable scenario IDs и coverage mapping.
4. [ ] Обновить navigation и task-card для handoff архитектору.

## Входные источники

- `tasks/FEATURE-003-administrator-slot-settings-management.md`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/use-cases/administrator-manage-slot-settings.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-slot-settings.md`

## Ключевой риск

- UI reference задает диапазон `slot_capacity` `1..50`, а канонические business/system artifacts подтверждают только дефолт `5` и ошибку `invalid-slot-capacity`; это расхождение должно быть зафиксировано как inconsistency без произвольной канонизации верхней границы.

## Проверки

- Проверить, что оба feature-документа созданы в `docs/system/feature-specs/`.
- Проверить, что `docs/system/README.md` ссылается на `FEATURE-003` как на отдельный маршрут чтения.
- Проверить, что карточка `FEATURE-003` ссылается на feature spec и sibling test scenarios document.
- Проверить, что feature spec фиксирует design readiness и inconsistency по диапазону `slot_capacity`.
- Проверить, что test scenarios document содержит stable Scenario IDs, manual route, e2e expectation и required assertions.

## Критерии готовности

- Архитектор может начать декомпозицию `FEATURE-003` с одного feature spec.
- QA может использовать sibling test scenarios document как единый источник сценариев.
- Карточка `FEATURE-003` переведена на роль `Архитектор` без обращения к `frontend/` или `backend/` коду.
