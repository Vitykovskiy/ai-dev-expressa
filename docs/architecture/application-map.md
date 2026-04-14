# Карта приложения

## Назначение

Этот документ помогает быстро понять, где находится каждый контур приложения, как он запускается, чем он зависит от соседних модулей и какие изменения требуют обновления документации.

## Текущее состояние

- На текущем этапе прикладной код еще не добавлен в репозиторий.
- Эта карта фиксирует целевую структуру, по которой должны создаваться первые модули и каталоги.
- Первый разработчик, который создаёт новый реальный каталог из карты, должен актуализировать этот документ по фактическим путям.

## Целевая структура и ответственность

| Контур | Планируемый путь | Ответственность | Основные зависимости |
| --- | --- | --- | --- |
| Backend API | `apps/api` | Доменные операции, контракты, интеграция с БД, orchestration use cases | `packages/shared-types`, `PostgreSQL`, Telegram bots |
| Customer WebApp | `apps/customer-web` | Customer UI внутри Telegram WebApp | `apps/api`, `packages/shared-types`, `packages/ui` |
| Backoffice WebApp | `apps/backoffice-web` | Backoffice UI для `barista` и `administrator` | `apps/api`, `packages/shared-types`, `packages/ui` |
| Customer Bot | `apps/customer-bot` | Telegram entrypoint и уведомления customer | `apps/api`, Telegram Bot API |
| Backoffice Bot | `apps/backoffice-bot` | Telegram entrypoint backoffice и напоминания barista | `apps/api`, Telegram Bot API |
| Shared Types | `packages/shared-types` | Общие DTO, enum, schema fragments и типы контрактов | Backend и оба frontend-клиента |
| Shared UI | `packages/ui` | Переиспользуемые UI-строительные блоки для web-клиентов | `Vuetify`, frontend apps |
| Infra | `infra/` | Локальные compose-файлы, deploy scripts, шаблоны окружения | Все runtime-контуры |
| CI/CD | `.github/workflows` | Build, test, image publish, deploy, smoke-check | Все runtime-контуры |

## Точки входа и маршруты

- `apps/customer-web`: entrypoint customer-facing Telegram WebApp.
- `apps/backoffice-web`: entrypoint backoffice Telegram WebApp.
- `apps/customer-bot`: Telegram customer bot webhook/polling entrypoint.
- `apps/backoffice-bot`: Telegram backoffice bot webhook/polling entrypoint.
- `apps/api`: основной backend runtime для бизнес-логики и интеграций.

## Где запускать и проверять

- Локальный запуск контуров и compose orchestration описываются в `infra/` и дублируются ссылкой здесь после появления реальных файлов.
- Команды unit tests и smoke-проверок для каждого контура должны быть добавлены сюда после первого появления кода.
- Deployment path и environment-specific маршруты читаются из `deployment-map.md`.

## Когда обновлять карту

- Появился новый каталог верхнего уровня или новый runtime contour.
- Изменился entrypoint, способ запуска, путь к тестам или путь к deployment-артефакту.
- Появился новый shared package, новый внешний dependency edge или новый интеграционный модуль.
- Изменились env vars, которые важны для запуска, тестирования или деплоя.
