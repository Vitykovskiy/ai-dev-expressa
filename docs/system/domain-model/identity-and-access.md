# Domain Model: Identity And Access

## Граница

Одна доменная модель: идентификация пользователя, роли, каналы доступа и блокировка доступа в `Expressa v1`.

## Источники

- `docs/business/glossary/telegram-ordering-v1.md`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-users-and-roles.md`
- `docs/business/scenarios/administrator-block-user.md`

## Сущности и value objects

### Entity `User`

| Поле         | Тип семантики         | Описание                                                                    |
| ------------ | --------------------- | --------------------------------------------------------------------------- |
| `userId`     | Идентификатор         | Внутренний идентификатор пользователя в системе.                            |
| `telegramId` | Внешний идентификатор | Идентификатор пользователя Telegram, используемый как основа идентификации. |
| `roles`      | Набор ролей           | Роли пользователя в системе.                                                |
| `blocked`    | Признак состояния     | Признак блокировки доступа к приложению.                                    |

### Value object `Role`

Допустимые значения:

- `customer`
- `barista`
- `administrator`

### Entity `BootstrapAdministrator`

| Поле         | Тип семантики             | Описание                                                                                    |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------------- |
| `telegramId` | Конфигурационное значение | Значение `ADMIN_TELEGRAM_ID`, задающее главного administrator при развёртывании.            |
| `singleton`  | Инвариант                 | Во входных материалах предусмотрен только один главный administrator, задаваемый через env. |

### Value object `AccessChannel`

Допустимые значения:

- `customer-telegram-entry`
- `backoffice-telegram-entry`
- `test-mode-without-telegram`

## Отношения

- `User` с ролью `customer` использует `customer-telegram-entry`.
- `User` с ролью `barista` или `administrator` использует `backoffice-telegram-entry`.
- `administrator` назначает роль `barista` другим `User`.
- `BootstrapAdministrator` назначает роль `administrator` другим `User`.
- `administrator` может установить для `User` признак `blocked=true`.

## Инварианты и ограничения

- Любой пользователь, активировавший клиентского бота, получает роль `customer`.
- Пользователь с `blocked=true` не может пользоваться приложением.
- Прямой рабочий доступ к веб-интерфейсу по URL без Telegram не поддерживается.
- Исключение без Telegram допускается только в test environment.
- Доступ к вкладкам backoffice определяется ролью пользователя.
- Роль `barista` даёт доступ только к вкладкам `Заказы` и `Доступность`.
- Роль `administrator` даёт доступ к вкладкам `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- Система должна разрешать пользователю с ролью `administrator` назначать пользователям роль `barista`.
- Система должна разрешать главному administrator назначать пользователям роль `administrator`.

## Наблюдаемые пробелы

- Во входных материалах не зафиксировано, может ли один пользователь одновременно иметь несколько операционных ролей сверх сочетания с ролью `customer`.
- Во входных материалах не определён системный статус пользователя до первой активации любого Telegram-бота.
