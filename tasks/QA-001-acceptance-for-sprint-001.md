# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-001`
- Родительская задача: `Sprint-001`
- Заголовок: `Провести приемку Sprint-001 / DU-01`
- Описание: `Подготовить и выполнить финальную приемочную проверку `Sprint-001` для administrator: вход в backoffice, управление меню, ролями/блокировкой и настройками слотов, а также проверить ограничения административного scope. Проверка должна опираться на завершенные `FEATURE-*` и явно фиксировать, что customer/barista-функции и неподтвержденные действия не считаются частью `DU-01`.`
- Единица поставки: `DU-01`
- Роль: `Тестирование`
- Изменяемый контур: `qa`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/FEATURE-003-menu-management.md`, `tasks/FEATURE-004-user-access-management.md`, `tasks/FEATURE-005-slot-settings.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `FEATURE-001`, `FEATURE-002`, `FEATURE-003`, `FEATURE-004`, `FEATURE-005`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/FEATURE-003-menu-management.md`, `tasks/FEATURE-004-user-access-management.md`, `tasks/FEATURE-005-slot-settings.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Есть зафиксированный результат приемки `Sprint-001`, подтверждающий сквозной административный сценарий и границы scope первой поставки.`
- Проверки: `Приемочный сценарий administrator end-to-end; feature smoke для `FEATURE-001`; проверка role/test-mode guards; проверка отсутствия неподтвержденных действий вроде unblock_user в обязательном acceptance scope.`
- Обновление карты приложения: `Не требуется, если в ходе проверки не выявлена фактическая архитектурная расходимость; при выявлении расхождения должны быть обновлены docs/architecture/application-map.md и docs/architecture/README.md.`
- Критерии готовности: `Результат приемки показывает, что `Sprint-001` / `DU-01` можно развернуть и продемонстрировать как отдельный административный контур, а все отклонения от подтвержденного scope документированы.`
