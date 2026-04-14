# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `DEV-001`
- Заголовок: `Собрать административный backoffice UI для DU-01`
- Описание: `Реализовать Telegram WebApp для administrator в рамках DU-01: session bootstrap, административный shell и вкладки Меню, Пользователи, Настройки. UI должен опираться на shared contracts из packages/shared-types и не расширять scope до orders/availability, unblock_user, image upload и других неподтвержденных элементов общего UI-контракта.`
- Единица поставки: `DU-01`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/identity-and-access.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Administrator в backoffice проходит административный UI-сценарий DU-01 end-to-end: открывает shell, управляет меню, ролями/блокировкой и настройками слотов без обращения к недоставленным контурам.`
- Проверки: `Vitest unit tests для stores/composables/validators/API-adapters; ручной smoke сценария administrator в Telegram WebApp или test mode с прохождением вкладок Меню, Пользователи и Настройки.`
- Обновление карты приложения: `Обязательно при изменении фактических путей, entrypoints или shared package относительно AR-001: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `UI поддерживает только административный scope DU-01, использует role/test-mode guards, не дублирует API-контракты вручную и не содержит неподтвержденных действий вроде unblock_user или barista-вкладок.`
