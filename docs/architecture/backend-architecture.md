# Backend Architecture

## Базовый стандарт

- Серверная часть Expressa v1 реализуется на `NestJS`.
- Контур идентификации и доступа должен быть отделён от доменных контуров меню, слотов, заказов и уведомлений.
- Backend является источником истины по пользователю, Telegram identity, ролям и доступу к backoffice capabilities.

## Для FEATURE-001

Подробная карта bootstrap administrator, Telegram/test-mode authorization и role guard находится в `docs/architecture/application-map/backend-access.md`.

## Для FEATURE-002

Подробная карта server-side boundary управления каталогом меню находится в `docs/architecture/application-map/backend-menu-catalog.md`. Контур каталога использует access guard из `backend-access.md`, но не смешивается с identity/access модулем.
