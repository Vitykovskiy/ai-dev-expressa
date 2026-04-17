# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Окружение, конвейер и дымовая проверка для Telegram-входа administrator`
- Описание: `Нужно подготовить окружение и маршрут развёртывания для FEATURE-001: описание и подключение ADMIN_TELEGRAM_ID, DISABLE_TG_AUTH и TG_BACKOFFICE_BOT_TOKEN в нужных окружениях, обновление этапов конвейера и smoke-check для входа administrator во внутренний административный контур через Telegram. Задача должна покрывать только окружение, GitHub Actions, VPS-маршрут развёртывания, дымовую проверку и порядок восстановления без создания прикладных e2e-тестов.`
- Единица поставки: `FEATURE-001`
- Роль: `Девопс`
- Изменяемый контур: `devops`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/quality-and-delivery.md`
- Контурная карта: `docs/architecture/application-map/quality-and-delivery.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `AR-001`, `BE-001`, `FE-001`
- Минимальный read set: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/quality-and-delivery.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Ожидаемый результат для ревью: `Для FEATURE-001 описан и воспроизводим маршрут развёртывания с нужными секретами и переменными окружения, конвейер готов прогонять требуемые проверки, а дымовая проверка подтверждает вход administrator через Telegram и отказ при некорректном рабочем доступе.`
- Проверки: `Pipeline-validation для затронутых workflow; staging или локальная дымовая проверка критического сценария FEATURE-001; документированный порядок восстановления для неуспешного развёртывания Telegram-входа administrator.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/quality-and-delivery.md, docs/architecture/deployment-map.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда FEATURE-001 можно предсказуемо провести через окружения, проверить дымовым сценарием и при необходимости откатить без ручных догадок о секретах, переменных окружения и шагах конвейера.`
