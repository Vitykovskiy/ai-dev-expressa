# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Серверная часть bootstrap главного administrator и контроля доступа в backoffice`
- Описание: `Нужно реализовать в apps/server серверную часть FEATURE-001: идемпотентный bootstrap главного administrator из ADMIN_TELEGRAM_ID, разрешение доступа во внутренний административный контур по Telegram-контексту служебного бота, поддержку test environment с DISABLE_TG_AUTH=true и серверные guard-правила для административного доступа. Результат должен отдельно покрывать идентификацию, ролевой контекст и запрет рабочего доступа без Telegram на стороне server без захвата клиентской части маршрутизации и интерфейса.`
- Единица поставки: `FEATURE-001`
- Роль: `Бэкенд`
- Изменяемый контур: `backend`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-001`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Server создаёт главного administrator из ADMIN_TELEGRAM_ID идемпотентно, принимает только допустимый Telegram-контекст служебного бота для рабочего входа в backoffice, поддерживает оговорённый test environment и отклоняет доступ без Telegram или без административной роли.`
- Проверки: `Модульные тесты bootstrap главного administrator, проверки Telegram-контекста, test environment и серверных guard-правил; локальная дымовая проверка серверного входа administrator и отказа в доступе без Telegram-контекста.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда server end-to-end поддерживает bootstrap и серверный контроль доступа для FEATURE-001, а ключевые правила доступа подтверждены модульными тестами и дымовой проверкой.`
