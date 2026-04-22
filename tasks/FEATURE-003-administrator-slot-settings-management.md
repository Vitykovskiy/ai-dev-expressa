# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-003`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator управляет рабочими часами и вместимостью слотов`
- Описание: `Нужно дать administrator законченный сценарий изменения рабочих часов и вместимости слотов выдачи. Сохранённые параметры должны применяться к дальнейшему формированию доступных слотов текущего дня. Фича не включает создание заказов customer и не расширяет горизонт слотов за пределы текущего дня.`
- Единица поставки: `FEATURE-003`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `В работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/application-map.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/qa-slot-settings.md`
- Контурная карта: `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Декомпозиция: `AR-006`, `FE-006`, `BE-005`, `QA-006`, `QA-007`; отдельная `DO-*` подзадача не создается, потому что feature package не меняет delivery/runtime path, env/config, pipeline или acceptance runner route.
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/qa-slot-settings.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Ожидаемый результат для ревью: `Архитектурный handoff FEATURE-003 завершен: созданы контурные карты и дочерние FE/BE/QA задачи с самодостаточным read set для реализации и проверки управления настройками слотов без чтения production-кода соседнего контура.`
- Проверки: `Созданы docs/architecture/application-map/backend-slot-settings.md и docs/architecture/application-map/qa-slot-settings.md; docs/architecture/README.md и docs/architecture/application-map.md ссылаются на новые карты; карточка FEATURE-003 ссылается на feature spec, test scenarios document и дочерние AR/FE/BE/QA задачи; в FE/BE/QA карточках указан consumer-facing contract, профильные карты и stable Scenario IDs из sibling test scenarios document.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули настроек, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда настройки слотов сохраняются и применяются к выдаче слотов, а дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Открытый вопрос: `Feature spec фиксирует blocker: UI reference указывает диапазон slot_capacity 1..50, а канонические business/system artifacts подтверждают только дефолт 5 и ошибку invalid-slot-capacity; верхняя граница требует отдельного архитектурного решения.`
