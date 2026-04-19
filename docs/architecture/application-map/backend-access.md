# Backend Access Application Map

## Граница

Серверный контур идентификации, bootstrap главного `administrator`, Telegram/test-mode авторизация и role guard для backoffice.

## Модули

| Модуль | Ответственность |
|---|---|
| `IdentityAccessModule` или локальный эквивалент | Пользователи, роли, blocked state как доменная модель доступа. |
| `BootstrapAdministrator` | Идемпотентно создаёт или обновляет пользователя из `ADMIN_TELEGRAM_ID` с ролью `administrator`. |
| `TelegramAuth` | Проверяет вход из служебного Telegram-бота и связывает `telegramId` с пользователем. |
| `TestModeAuth` | Разрешает bypass Telegram только в test environment при `DISABLE_TG_AUTH=true`. |
| `BackofficeRoleGuard` | Защищает backoffice capabilities и прямые route/API обращения по ролям. |

## Server contracts for FEATURE-001

- На старте системы должен существовать пользователь с `telegramId=ADMIN_TELEGRAM_ID` и ролью `administrator`.
- Повторный старт не должен создавать дубликаты пользователя или роли.
- Backoffice auth принимает только служебный Telegram entrypoint, кроме test-mode исключения.
- Role guard возвращает отказ для прямого доступа без Telegram в production.
- Role guard разрешает `administrator` доступ ко всем вкладкам backoffice, перечисленным в `identity-and-access.md`.
- Role guard разрешает `barista` только `orders` и `availability`, но назначение/управление barista не входит в эту feature.

## Env/config

| Name | Required | Scope | Правило |
|---|---|---|---|
| `ADMIN_TELEGRAM_ID` | Да | production, test | Должен быть валидным Telegram identifier для bootstrap administrator. |
| `DISABLE_TG_AUTH` | Нет | только test | `true` разрешает test-mode без Telegram. В production значение `true` является ошибкой конфигурации. |
| `SERVICE_TELEGRAM_BOT_TOKEN` или существующий эквивалент | Да для Telegram validation | production, test при включённой Telegram auth | Используется для проверки служебного Telegram-входа. |

## Запрещено в FEATURE-001

- Реализовывать назначение ролей, блокировку, меню или слоты.
- Делать test-mode авторизацию доступной в production.
- Доверять роли, присланной клиентом, без серверной проверки пользователя.
