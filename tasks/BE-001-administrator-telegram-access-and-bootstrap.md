# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Реализовать backend bootstrap administrator и Telegram/test-mode авторизацию`
- Описание: `Нужно реализовать серверный контур входа administrator: идемпотентно создать главного administrator из ADMIN_TELEGRAM_ID, проверять служебный Telegram-вход, разрешать test-mode bypass только в test environment при DISABLE_TG_AUTH=true и применять role guard для backoffice вкладок и прямых обращений.`
- Единица поставки: `FEATURE-001`
- Роль: `Бэкенд`
- Изменяемый контур: `backend`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Backend создаёт administrator из ADMIN_TELEGRAM_ID идемпотентно, валидирует Telegram/test-mode вход и возвращает корректный отказ для прямого production доступа без Telegram.`
- Проверки: `Модульные тесты bootstrap administrator, config validation и role guard matrix; интеграционные проверки Telegram auth и DISABLE_TG_AUTH=true в test environment; negative test для production-like bypass.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/backend-access.md и при необходимости docs/architecture/application-map/delivery-and-runtime.md, если появляются новые modules, endpoints, env vars или правила запуска.`
- Критерии готовности: `BE-задача завершена, когда backend является источником истины по пользователю и ролям, а test-mode авторизация не может быть использована как production fallback.`

## Результат выполнения

- Создан минимальный NestJS backend в `backend/`.
- Реализованы `IdentityAccessModule`, bootstrap главного `administrator`, проверка Telegram Web App `initData`, test-mode bypass только для `NODE_ENV=test DISABLE_TG_AUTH=true` и role guard для `orders`, `availability`, `menu`, `users`, `settings`.
- Добавлены тесты `backend/test/*.spec.ts`: bootstrap administrator, config validation, Telegram auth, test-mode auth, production-like negative bypass и матрица role guard.
- Обновлены `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md` и `README.md`.
