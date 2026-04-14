# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-001`
- Родительская задача: `DEV-001`
- Заголовок: `Провести приемку административного контура DU-01`
- Описание: `Подготовить и выполнить приемочную проверку DU-01 для administrator: вход в backoffice, управление меню, ролями/блокировкой и настройками слотов, а также проверить ограничения административного scope. Проверка должна опираться на итоговые FE/BE/DO артефакты и явно фиксировать, что customer/barista-функции и неподтвержденные действия не считаются частью DU-01.`
- Единица поставки: `DU-01`
- Роль: `Тестирование`
- Изменяемый контур: `qa`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/FE-001-admin-backoffice-ui-for-du-01.md`, `tasks/BE-001-admin-backoffice-api-for-du-01.md`, `tasks/DO-001-runtime-and-delivery-for-du-01.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `FE-001`, `BE-001`, `DO-001`
- Минимальный read set: `tasks/FE-001-admin-backoffice-ui-for-du-01.md`, `tasks/BE-001-admin-backoffice-api-for-du-01.md`, `tasks/DO-001-runtime-and-delivery-for-du-01.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Есть зафиксированный результат приемки DU-01, подтверждающий сквозной административный сценарий и границы scope первой поставки.`
- Проверки: `Приемочный сценарий administrator end-to-end; smoke-check из DO-001; проверка role/test-mode guards; проверка отсутствия неподтвержденных действий вроде unblock_user в обязательном acceptance scope.`
- Обновление карты приложения: `Не требуется, если в ходе проверки не выявлена фактическая архитектурная расходимость; при выявлении расхождения должны быть обновлены docs/architecture/application-map.md и docs/architecture/README.md.`
- Критерии готовности: `Результат приемки показывает, что DU-01 можно развернуть и продемонстрировать как отдельный административный контур, а все отклонения от подтвержденного scope документированы.`
