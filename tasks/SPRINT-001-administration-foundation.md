# Карточка задачи

## Карточка задачи

- Идентификатор: `SPRINT-001`
- Родительская задача: `нет`
- Заголовок: `Административный контур запуска и управления Expressa v1`
- Описание: `Спринт 001 задает координационные рамки для административного запуска Expressa v1. Внутри спринта архитектор должен сначала декомпозировать работу на FEATURE-*, после чего каждая фича отдельно доводится до законченного и тестируемого результата. Спринт охватывает вход администратора во внутренний административный контур через Telegram, управление меню, полное переписывание клиентской части внутреннего административного контура по React-референсу внутри apps/backoffice-web, рабочими часами и вместимостью слотов, ролями пользователей и блокировкой пользователей, но сам по себе не считается единицей поставки.`
- Единица поставки: `n/a`
- Роль: `Разработка`
- Изменяемый контур: `n/a`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Согласованный состав спринта: `FEATURE-001` — вход администратора во внутренний административный контур через Telegram; `FEATURE-002` — управление каталогом меню, ценами и дополнительными опциями; `FEATURE-003` — управление рабочими часами и вместимостью слотов; `FEATURE-004` — назначение ролей пользователям; `FEATURE-005` — блокировка пользователя и прекращение доступа к продукту; `FEATURE-006` — полное переписывание клиентской части внутреннего административного контура в apps/backoffice-web по React-референсу в рамках Vue 3 + TypeScript + Vuetify.`
- Рекомендованный порядок поставки: `FEATURE-001` как фундамент, затем `FEATURE-002`, затем `FEATURE-006` как полное переписывание клиентской части apps/backoffice-web, после чего независимо `FEATURE-003`, `FEATURE-004` и `FEATURE-005`.
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Для SPRINT-001 определен и реализуется согласованный набор FEATURE-*, который в сумме покрывает административный контур запуска и управления продуктом без смешения нескольких фич в одну задачу.`
- Проверки: `Каждая FEATURE-* внутри спринта проходит свои обязательные проверки, включая модульные тесты, e2e, дымовые проверки и приемочный сценарий по затронутой функциональности.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если появляются новые модули, точки входа, env/config или маршрут развёртывания.`
- Критерии готовности: `Спринт закрывается только после того, как все включенные в него FEATURE-* завершены, протестированы и в сумме дают работоспособный административный контур, пригодный для дальнейшей демонстрации и эксплуатации следующих поставок.`
- Блокер: `Не согласовано, может ли любой администратор назначать других администраторов, или это право ограничено только главным администратором.`
