# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-003`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator управляет рабочими часами и вместимостью слотов`
- Описание: `Фича должна дать administrator возможность из вкладки settings изменять рабочие часы и вместимость слотов выдачи, сохраняя административные настройки как источник для последующего формирования доступных слотов текущего дня. Результат должен поставляться отдельно от клиентского выбора слотов и отдельно от управления меню и пользователями.`
- Единица поставки: `FEATURE-003`
- Роль: `Разработка`
- Изменяемый контур: `delivery-unit`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Administrator из вкладки settings сохраняет рабочие часы и вместимость слотов, при отсутствии изменений применяются значения по умолчанию, а обновлённые параметры могут использоваться системой как источник формирования доступных слотов текущего дня.`
- Проверки: `Модульные тесты валидации рабочих часов и вместимости слота; e2e-сценарий изменения рабочих часов и вместимости из вкладки settings; дымовая проверка сохранения дефолтных и изменённых значений; приемочный сценарий по SL-003-SL-006 и BO-005.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Фича считается завершённой, когда administrator end-to-end управляет рабочими часами и вместимостью слотов, а правила дефолтов и валидации подтверждены тестами и приемочным сценарием.`
