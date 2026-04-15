# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-012`
- Родительская задача: `Sprint-003`
- Заголовок: `Menu availability`
- Описание: `Отдельная barista-фича: barista временно управляет доступностью меню в пределах своей роли и подтвержденного scope.`
- Единица поставки: `DU-03.F03`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/barista-manage-menu-availability.md`
- Требования / правила: `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/barista-manage-menu-availability.md`

## Примечания

- Зависимости: `FEATURE-010`
- Минимальный read set: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/barista-manage-menu-availability.md`
- Ожидаемый результат для ревью: `Barista отдельно проходит сценарий временного управления доступностью меню как самостоятельный vertical slice.`
- Проверки: `Smoke сценария availability и unit/integration checks ограничений роли.`
- Обновление карты приложения: `Обязательно при изменении availability-модулей, shared contracts или entrypoints.`
- Критерии готовности: `Фича отдельно демонстрируется и не зависит от незавершенных notification capability.`
