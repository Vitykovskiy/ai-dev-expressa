# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-004`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator назначает пользователям роли barista и administrator`
- Описание: `Фича должна дать administrator возможность из вкладки users назначать пользователям роли barista и administrator с немедленным пересчётом доступа к вкладкам внутреннего административного контура. Результат должен поставляться отдельно от блокировки пользователей, чтобы изменение ролевой модели и прекращение доступа были независимыми и проверяемыми поставками.`
- Единица поставки: `FEATURE-004`
- Роль: `Разработка`
- Изменяемый контур: `delivery-unit`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Administrator из вкладки users назначает пользователю роль barista или administrator, система сохраняет новое ролевое назначение и пересчитывает доступ пользователя к вкладкам внутреннего административного контура в соответствии с ролью.`
- Проверки: `Модульные тесты допустимых ролевых назначений и пересчёта доступа к вкладкам; e2e-сценарий назначения роли barista и administrator из вкладки users; дымовая проверка обновления доступных вкладок после смены роли; приемочный сценарий по AR-006-AR-008 и BO-013.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Фича считается завершённой, когда administrator end-to-end управляет назначением ролей, а изменение прав доступа подтверждается тестами и приемочным сценарием без смешения с блокировкой пользователей.`
- Блокер: `Во входных материалах не согласовано, может ли любой administrator назначать роль administrator, или это право ограничено главным administrator. До отдельного решения реализация должна следовать текущему системному контракту и зафиксированному открытому вопросу.`
