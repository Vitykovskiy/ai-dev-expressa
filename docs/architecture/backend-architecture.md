# Backend Architecture

## Базовый стандарт

- Серверная часть Expressa v1 реализуется на `NestJS`.
- Контур идентификации и доступа должен быть отделён от доменных контуров меню, слотов, заказов и уведомлений.
- Backend является источником истины по пользователю, Telegram identity, ролям и доступу к backoffice capabilities.

## Для FEATURE-001

Подробная карта bootstrap administrator, Telegram/test-mode authorization и role guard находится в `docs/architecture/application-map/backend-access.md`.
