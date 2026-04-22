# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-003`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator управляет рабочими часами и вместимостью слотов`
- Описание: `Нужно дать administrator законченный сценарий изменения рабочих часов и вместимости слотов выдачи. Сохранённые параметры должны применяться к дальнейшему формированию доступных слотов текущего дня. Фича не включает создание заказов customer и не расширяет горизонт слотов за пределы текущего дня.`
- Единица поставки: `FEATURE-003`
- Роль: `Системный аналитик`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Ожидаемый результат для ревью: `Подготовлены feature spec и документ сценариев тестирования FEATURE-003: зафиксированы граница фичи, пользовательские сценарии, UI-взаимодействия, validations, errors, design readiness, крайние случаи и handoff для архитектурной декомпозиции.`
- Проверки: `Feature spec и .test-scenarios документ созданы в docs/system/feature-specs, карточка FEATURE-003 ссылается на оба документа, сценарии содержат stable scenario IDs, manual QA route, e2e coverage expectation и required assertions; design readiness сверен с .references/Expressa_admin/src/app/screens/SettingsScreen.tsx.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули настроек, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда настройки слотов сохраняются и применяются к выдаче слотов, а дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Открытый вопрос: `UI-контракт указывает диапазон slot_capacity 1..50, но системные артефакты фиксируют только дефолт 5 и ошибку invalid-slot-capacity; диапазон нельзя считать каноническим без отдельного решения.`
