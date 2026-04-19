# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Настроить runtime-конфигурацию входа administrator`
- Описание: `Нужно подготовить env/config, CI checks, test deployment flow и smoke-check для FEATURE-001: ADMIN_TELEGRAM_ID, секрет служебного Telegram-бота, ограничение DISABLE_TG_AUTH=true только test environment, два обязательных PR job и автодеплой merge в main на VPS test-окружения.`
- Единица поставки: `FEATURE-001`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `BE-001`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Runtime окружения имеют явные переменные ADMIN_TELEGRAM_ID и секрет служебного Telegram-бота; DISABLE_TG_AUTH=true разрешён только в test environment; на PR выполняются обязательные job quality и build; merge в main запускает автодеплой на VPS test-окружения; smoke-check подтверждает запуск и отказ production-like bypass.`
- Проверки: `PR workflow quality: backend/frontend typecheck и unit tests; PR workflow build: сборка backend/frontend; pipeline/config validation для env vars и deploy secrets; smoke-check backend bootstrap administrator; smoke-check прямого production-like bypass; smoke-check test-mode доступа при DISABLE_TG_AUTH=true на VPS test environment.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md и docs/architecture/deployment-map.md, если меняются env vars, pipeline, branch policy, deployment path, команды запуска или smoke-check.`
- Критерии готовности: `DO-задача завершена, когда конфигурация не позволяет случайно включить test-mode bypass в production, PR блокируется падающими quality/build проверками, а merge в main приводит к автодеплою на VPS test-окружения со smoke-проверками.`

## Результат выполнения

- Добавлены GitHub Actions `.github/workflows/pr-checks.yml` и `.github/workflows/deploy-test.yml` с двумя обязательными PR job `quality` и `build`, а также автодеплоем `main` на VPS `test`.
- Для PR checks добавлены исполнимые typecheck-команды `backend/package.json` и `frontend/package.json`.
- Зафиксирован runtime/deployment contract для `main -> test`, `NODE_ENV=test` и `DISABLE_TG_AUTH=true` только на test VPS в `docs/architecture/application-map/delivery-and-runtime.md` и `docs/architecture/deployment-map.md`.
- Обновлена навигация `README.md` под каталог `.github/workflows/`.
