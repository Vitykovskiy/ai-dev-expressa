# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-004`
- Родительская задача: `Sprint-001`
- Заголовок: `User access management`
- Описание: `Реализовать отдельную фичу `DU-01.F04`: administrator управляет ролями пользователей и блокировкой в подтвержденном scope `DU-01`. Спорное право назначения новых administrator должно остаться локализованным в policy-слое и явно проверяемым.`
- Единица поставки: `DU-01.F04`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/architecture/du-01/README.md`

## Примечания

- Зависимости: `FEATURE-002`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/architecture/du-01/README.md`
- Ожидаемый результат для ревью: `Administrator может отдельно пройти сценарий управления ролями и блокировкой пользователей как самостоятельный vertical slice.`
- Проверки: `Smoke назначения ролей и блокировки; unit/integration checks policy-правил и запрет неподтвержденных действий.`
- Обновление карты приложения: `Обязательно при изменении access-модулей, shared contracts или entrypoints.`
- Критерии готовности: `Фича отдельно проверяема и не зависит от незавершенных menu management или slot settings capability сверх утвержденных контрактов.`
