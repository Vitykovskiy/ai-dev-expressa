# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-003`
- Родительская задача: `Sprint-001`
- Заголовок: `Menu management`
- Описание: `Реализовать отдельную фичу `DU-01.F03`: administrator управляет каталогом меню в пределах подтвержденного scope `DU-01`. Фича покрывает CRUD и валидации меню, но не включает роли пользователей и настройки слотов.`
- Единица поставки: `DU-01.F03`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`
- Требования / правила: `docs/business/business-rules/menu-catalog-and-options.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/architecture/du-01-administration.md`

## Примечания

- Зависимости: `FEATURE-002`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/architecture/du-01-administration.md`
- Ожидаемый результат для ревью: `Administrator может отдельно пройти сценарий управления меню как самостоятельный vertical slice.`
- Проверки: `Smoke CRUD-сценария меню; unit/integration checks доменных правил каталога.`
- Обновление карты приложения: `Обязательно при изменении модулей каталога, shared contracts или entrypoints.`
- Критерии готовности: `Фича отдельно демонстрируется и не зависит от незавершенных user access или slot settings capability.`
