# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-006`
- Родительская задача: `FEATURE-003`
- Заголовок: `Зафиксировать архитектурный handoff управления настройками слотов`
- Описание: `Нужно определить контуры реализации FEATURE-003: frontend вкладка Настройки, backend boundary управления рабочими часами и вместимостью слотов, а также QA-проверки влияния сохранённых настроек на дальнейшую генерацию доступных слотов. Результат должен позволить FE/BE/QA задачам выполняться без восстановления маршрутов, endpoint boundary, DTO, guard-правил и acceptance path из production-кода.`
- Единица поставки: `FEATURE-003`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/qa-slot-settings.md`
- Контурная карта: `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/qa-slot-settings.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Ожидаемый результат для ревью: `Архитектурные карты FEATURE-003 обновлены, а FE/BE/QA задачи имеют достаточный read set для реализации управления настройками слотов и проверки влияния настроек на генерацию слотов без чтения production-кода соседнего контура.`
- Проверки: `Проверить наличие backend-slot-settings и qa-slot-settings карт; проверить, что FE/BE/QA карточки содержат feature spec, test scenarios document, consumer-facing contract, профильные карты и не требуют бизнес-артефактов.`
- Обновление карты приложения: `Выполнено: обновлены docs/architecture/README.md, docs/architecture/application-map.md, docs/architecture/frontend-architecture.md, docs/architecture/backend-architecture.md, docs/architecture/qa-standards.md, docs/architecture/application-map/frontend-backoffice.md; созданы docs/architecture/application-map/backend-slot-settings.md и docs/architecture/application-map/qa-slot-settings.md.`
- Критерии готовности: `Задача завершена, когда архитектурный handoff покрывает frontend, backend и QA контуры FEATURE-003; отсутствие DO-подзадачи документировано как осознанное решение из-за отсутствия изменений delivery/runtime path.`

## Результат выполнения

- Созданы контурные карты `backend-slot-settings.md` и `qa-slot-settings.md`.
- Обновлены архитектурная навигация и профильные стандарты под `FEATURE-003`.
- Зафиксировано, что `FEATURE-003` не требует отдельной `DO-*` подзадачи, потому что feature package не меняет env/config, pipeline, smoke-check или acceptance runner path.
- Зафиксировано архитектурное ограничение: верхняя граница `slotCapacity` не канонизируется как `50` только на основании UI reference; FE/BE handoff должен опираться на system contract и documented error mapping.
