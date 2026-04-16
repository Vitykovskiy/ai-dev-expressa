# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Архитектурная рамка Telegram-входа administrator во внутренний административный контур`
- Описание: `Нужно зафиксировать архитектурную рамку реализации FEATURE-001: границы между apps/server, apps/backoffice-web и packages/shared-types, способ bootstrap главного administrator через ADMIN_TELEGRAM_ID, прохождение Telegram-контекста во внутренний административный контур, поведение test environment c DISABLE_TG_AUTH=true, серверные и клиентские guard-правила, а также точки, где блокируется прямой рабочий доступ по URL без Telegram. Результатом должна стать согласованная архитектурная рамка, достаточная для параллельной постановки BE-, FE-, DO- и QA-задач без догадок о разделении ответственности.`
- Единица поставки: `FEATURE-001`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Зафиксирована архитектурная рамка FEATURE-001 с явным разделением ответственности между server, backoffice веб-приложением, общими типами, окружением и тестовым режимом; по документам понятно, где создаётся главный administrator, как передаётся Telegram-контекст, как работают guard-правила и где блокируется прямой доступ без Telegram.`
- Проверки: `Архитектурное ревью обновлённых docs/architecture/application-map.md и docs/architecture/deployment-map.md; проверка согласованности дочерних задач FEATURE-001 с зафиксированными точками входа, переменными окружения и guard-правилами.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда архитектурные документы и дочерние задачи позволяют реализовывать FEATURE-001 без неразрешённых вопросов о границах модулей, Telegram-контексте, test environment и маршруте развёртывания.`
