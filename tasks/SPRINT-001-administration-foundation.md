# Карточка задачи

## Карточка задачи

- Идентификатор: `SPRINT-001`
- Родительская задача: `нет`
- Заголовок: `Административный контур запуска и управления Expressa v1`
- Описание: `Спринт 001 задает координационные рамки для административного запуска Expressa v1. Внутри спринта архитектор должен сначала декомпозировать работу на FEATURE-*, после чего каждая фича отдельно доводится до законченного и тестируемого результата. Спринт охватывает вход администратора во внутренний административный контур через Telegram, управление меню, клиентскую часть внутреннего административного контура по React-референсу, рабочие часы и вместимость слотов, роли пользователей и блокировку пользователей, но сам по себе не считается единицей поставки.`
- Единица поставки: `n/a`
- Роль: `Разработка`
- Приоритет: `Критический`
- Статус: `В работе`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `docs/business/vision/expressa-v1-telegram-ordering.md`, `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`, `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `.references/Expressa_admin/src/app`

## Примечания

- Зависимости: `нет`
- Ориентиры для архитектурной декомпозиции: `Вход администратора через Telegram; управление каталогом меню, ценами и дополнительными опциями; управление рабочими часами и вместимостью слотов; назначение ролей пользователям; блокировка пользователя и прекращение доступа к продукту; клиентская часть внутреннего административного контура по React-референсу. Конкретный набор FEATURE-* определяет архитектор при декомпозиции спринта.`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app`
- Ожидаемый результат для ревью: `Для SPRINT-001 определен и реализуется согласованный набор FEATURE-*, который в сумме покрывает административный контур запуска и управления продуктом без смешения нескольких фич в одну задачу.`
- Проверки: `Каждая FEATURE-* внутри спринта проходит свои обязательные проверки, включая модульные тесты, e2e, дымовые проверки и приемочный сценарий по затронутой функциональности.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если появляются новые модули, точки входа, env/config или маршрут развёртывания.`
- Критерии готовности: `Спринт закрывается только после того, как все включенные в него FEATURE-* завершены, протестированы и в сумме дают работоспособный административный контур, пригодный для дальнейшей демонстрации и эксплуатации следующих поставок.`
- Декомпозиция: `FEATURE-001`, `FEATURE-002`, `FEATURE-003`, `FEATURE-004`, `FEATURE-005`
- Блокер: `Не согласовано, может ли любой администратор назначать других администраторов, или это право ограничено только главным администратором.`
