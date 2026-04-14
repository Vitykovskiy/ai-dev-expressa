# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-001`
- Родительская задача: `DEV-001`
- Заголовок: `Поднять административный API и доменные правила для DU-01`
- Описание: `Реализовать backend-срез DU-01: Telegram/test-mode auth session, bootstrap главного administrator через ADMIN_TELEGRAM_ID, административные контракты управления меню, ролями/блокировкой и настройками слотов, а также shared DTO для frontend. Customer-ordering, barista-order-processing, reminder flow и unblock_user в scope задачи не входят.`
- Единица поставки: `DU-01`
- Роль: `Бэкенд`
- Изменяемый контур: `backend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/domain-model/identity-and-access.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Административный backend DU-01 поднимает авторизацию/bootstrapping и обслуживает меню, пользователей и настройки слотов через тестируемые доменные правила и shared contracts.`
- Проверки: `Jest unit tests для policy/service/validator/mapper слоев; интеграционный smoke bootstrap главного administrator, смены роли, блокировки пользователя, сохранения меню и настроек слотов в test mode.`
- Обновление карты приложения: `Обязательно при изменении фактических модулей, entrypoints, shared contracts, env/config или deployment path относительно AR-001: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Backend изолирует policy спорного назначения administrator, публикует только подтвержденные контракты DU-01 и не смешивает административный срез с customer/barista сценариями следующих поставок.`
- Блокер: `Во входных материалах не согласовано, может ли любой administrator назначать новых administrator; реализация должна локализовать это правило в backend policy и не зашивать его в transport/API слой.`
