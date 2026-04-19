# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Настроить runtime-конфигурацию входа administrator`
- Описание: `Нужно подготовить env/config и smoke-check для FEATURE-001: ADMIN_TELEGRAM_ID, секрет служебного Telegram-бота, ограничение DISABLE_TG_AUTH=true только test environment и проверка запуска затронутых контуров.`
- Единица поставки: `FEATURE-001`
- Роль: `Девопс`
- Изменяемый контур: `devops`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `BE-001`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Runtime окружения имеют явные переменные ADMIN_TELEGRAM_ID и секрет служебного Telegram-бота; DISABLE_TG_AUTH=true разрешён только в test environment; smoke-check подтверждает запуск и отказ production-like bypass.`
- Проверки: `Pipeline/config validation для env vars; smoke-check backend bootstrap administrator; smoke-check прямого production-like доступа без Telegram; smoke-check test-mode доступа при DISABLE_TG_AUTH=true.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md, если меняются env vars, pipeline, deployment path, команды запуска или smoke-check.`
- Критерии готовности: `DO-задача завершена, когда конфигурация не позволяет случайно включить test-mode bypass в production и покрыта smoke-проверками.`
