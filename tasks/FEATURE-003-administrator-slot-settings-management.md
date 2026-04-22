# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-003`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator управляет рабочими часами и вместимостью слотов`
- Описание: `Нужно дать administrator законченный сценарий изменения рабочих часов и вместимости слотов выдачи. Сохранённые параметры должны применяться к дальнейшему формированию доступных слотов текущего дня. Фича не включает создание заказов customer и не расширяет горизонт слотов за пределы текущего дня.`
- Единица поставки: `FEATURE-003`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Ожидаемый результат для ревью: `Архитектор получает полный feature package для FEATURE-003: feature spec, sibling test scenarios document, design-readiness audit и зафиксированную inconsistency по диапазону slot capacity без необходимости читать production-код.`
- Проверки: `Feature spec и .test-scenarios документ созданы в docs/system/feature-specs, docs/system/README.md ссылается на FEATURE-003, карточка FEATURE-003 ссылается на оба документа, сценарии содержат stable scenario IDs, manual QA route, e2e coverage expectation и required assertions, blocker по верхней границе slot capacity зафиксирован в feature spec, design readiness сверен с .references/Expressa_admin/src/app/screens/SettingsScreen.tsx.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули настроек, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда настройки слотов сохраняются и применяются к выдаче слотов, а дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Открытый вопрос: `Feature spec фиксирует blocker: UI reference указывает диапазон slot_capacity 1..50, а канонические business/system artifacts подтверждают только дефолт 5 и ошибку invalid-slot-capacity; верхняя граница требует отдельного архитектурного решения.`
