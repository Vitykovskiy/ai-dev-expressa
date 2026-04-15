# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Собрать runtime auth/session для FEATURE-002`
- Описание: `Подготовить runtime и delivery-путь для `FEATURE-002`: к связке `api + backoffice-web` добавить обязательные для auth/session-среза `apps/backoffice-bot` и `PostgreSQL`, описать и разложить env/config (`DATABASE_URL`, `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH`, `TG_BACKOFFICE_BOT_TOKEN` и связанные runtime-параметры), обеспечить воспроизводимый локальный или lightweight test запуск и отдельный smoke-маршрут входа administrator через `Telegram backoffice-бота` или test mode. Задача должна покрыть migrations/bootstrap path, scripts и pipeline-валидацию нового runtime-контура, но не включает delivery следующих административных capability `menu-management`, `user-access-management` и `slot-settings`.`
- Единица поставки: `DU-01.F02`
- Роль: `Девопс`
- Изменяемый контур: `devops`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/AR-002-feature-002-auth-session-slicing.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-002`
- Минимальный read set: `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/AR-002-feature-002-auth-session-slicing.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Runtime `FEATURE-002` воспроизводимо поднимает `api + backoffice-web + backoffice-bot + postgres`, поддерживает bootstrap главного administrator и проходит отдельный smoke входа в административный shell через Telegram/test mode.`
- Проверки: `Локальный или lightweight test runtime для всех обязательных контуров `FEATURE-002`; применение migrations/bootstrap для auth/session persistence; pipeline validation install/test/build/smoke для нового runtime; smoke входа administrator через `Telegram backoffice-бота` или test mode при `DISABLE_TG_AUTH=true`.`
- Обновление карты приложения: `Обязательно при изменении runtime-контуров, env vars, migrations/bootstrap path, deployment path, pipeline stages или smoke-check относительно `AR-002`: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Для `FEATURE-002` существует понятный и воспроизводимый путь запуска, проверки и доставки auth/session-среза без догадок о bot entrypoint, базе данных, env-конфигурации и smoke-маршруте.`
