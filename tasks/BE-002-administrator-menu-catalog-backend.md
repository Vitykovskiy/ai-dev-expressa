# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Реализовать backend управление каталогом меню`
- Описание: `Нужно реализовать серверный контур Manage menu catalog для administrator: хранение и изменение категорий, товаров, базовых цен, цен напитков по размерам S/M/L, групп дополнительных опций, опций и назначений групп на категории. Контур должен использовать существующую backoffice-авторизацию и не включать оперативное управление доступностью barista, клиентский заказ или обработку заказов.`
- Единица поставки: `FEATURE-002`
- Роль: `Бэкенд`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FEATURE-001`, `AR-003`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/stack.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Backend предоставляет защищённый administrator-only API управления каталогом: категории, товары, basePrice, цены S/M/L для напитков, группы опций, опции и назначение групп на категории; доменные ошибки invalid-drink-size-model и invalid-option-group-rule воспроизводимы тестами.`
- Проверки: `Модульные тесты доменных правил каталога; integration tests для Manage menu catalog endpoints; negative tests для неполной размерной модели напитка, неверного selectionMode и доступа без administrator capability; backend build/test.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/backend-menu-catalog.md и при необходимости docs/architecture/application-map/backend-access.md, если появляются новые modules, endpoints, DTO, guard attachment или error mapping.`
- Критерии готовности: `BE-задача завершена, когда backend является источником истины для структуры меню и цен, а frontend/QA могут работать с catalog API без чтения backend production-кода для восстановления contract.`

## Результат выполнения

- Реализован `MenuCatalogModule` в `backend/src/menu-catalog/` с controller/service/validator/in-memory repository.
- Добавлен защищённый administrator-only API `/backoffice/menu/*` для snapshot каталога, категорий, товаров, цен напитков `S/M/L`, групп опций, опций и назначений групп на категории.
- Расширен `BackofficeAuthGuard`: статические backoffice endpoints могут задавать capability через metadata decorator, а `/backoffice/:capability` продолжает работать по path parameter.
- Runtime-конфигурация backend переведена на `@nestjs/config`: прямой `dotenv` bootstrap и direct dependency `dotenv` удалены.
- Зафиксированы доменные проверки `invalid-drink-size-model` и `invalid-option-group-rule`, а также отказ `backoffice-capability-forbidden` для пользователя без capability `menu`.
- Добавлены тесты `backend/test/menu-catalog-domain.spec.ts` и `backend/test/menu-catalog.e2e.spec.ts`.
- Обновлены `docs/system/contracts/menu-and-availability-management.md`, `docs/architecture/application-map/backend-menu-catalog.md` и `docs/architecture/application-map/backend-access.md`.
