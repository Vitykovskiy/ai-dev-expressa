# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-001`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator входит во внутренний административный контур через Telegram`
- Описание: `Фича должна дать работоспособный вход administrator во внутренний административный контур через служебного Telegram-бота, обеспечить bootstrap главного administrator через ADMIN_TELEGRAM_ID, запрет прямого рабочего доступа по URL без Telegram вне test environment и ролевой доступ administrator к административным вкладкам. Результат должен демонстрироваться отдельно от управления меню, слотами и пользователями и служит фундаментом для остальных фич спринта.`
- Единица поставки: `FEATURE-001`
- Роль: `Разработка`
- Изменяемый контур: `delivery-unit`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Согласованный состав дочерних задач: `AR-001` — архитектурная рамка Telegram-входа и guard-правил; `BE-001` — bootstrap главного administrator и серверный контроль доступа; `FE-001` — клиентская часть входа в backoffice и ролевые guard-правила; `DO-001` — окружение, конвейер и дымовая проверка FEATURE-001; `QA-001` — e2e-покрытие Telegram-входа administrator.
- Рекомендованный порядок выполнения: `AR-001`, затем параллельно `BE-001` и `FE-001`, после чего `DO-001` и `QA-001`.
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Главный administrator создаётся идемпотентно из ADMIN_TELEGRAM_ID, administrator может открыть внутренний административный контур через служебного Telegram-бота и получает доступ только к разрешённым административным вкладкам, а прямой рабочий доступ по URL без Telegram блокируется вне test environment.`
- Проверки: `Модульные тесты bootstrap главного administrator и ролевых guard-правил; e2e-сценарий входа administrator через служебного Telegram-бота; дымовая проверка доступа administrator к вкладкам menu/users/settings; приемочный сценарий блокировки прямого рабочего доступа по URL вне Telegram.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Фича считается завершённой, когда вход administrator в Telegram-центричном режиме v1 работает end-to-end, административные вкладки доступны по роли, а ограничения доступа без Telegram подтверждены проверками.`
