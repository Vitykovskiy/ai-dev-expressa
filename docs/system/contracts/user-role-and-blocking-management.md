# Contract: User Role And Blocking Management

## Граница

Один набор consumer-facing контрактов: bootstrap главного `administrator`, чтение списка пользователей, назначение роли и блокировка пользователя.

## Источники

- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-users-and-roles.md`
- `docs/business/scenarios/administrator-block-user.md`

## Contract `Bootstrap main administrator`

### Inputs

- Значение `ADMIN_TELEGRAM_ID`.

### Validations and constraints

- При запуске должен существовать только один главный administrator из env-конфигурации.
- Повторный старт должен быть идемпотентным относительно наличия этого пользователя.

### Outputs

- Пользователь с ролью `administrator`, связанный с `ADMIN_TELEGRAM_ID`.

## Contract `Read users list`

### Consumer

- `administrator`

### Purpose

- Получить наблюдаемый список пользователей для экрана `Пользователи` без восстановления структуры ответа из production-кода.

### Transport boundary

- Method: `GET`
- Path: `/backoffice/users`
- Required capability: `users`
- Auth context: server-side `AuthenticatedActor`, подтвержденный backoffice auth boundary

### Request

#### Query parameters

- `search` — необязательная строка для поиска по имени пользователя или `telegramUsername`.
- `role` — необязательный фильтр со значениями `barista`, `administrator`.
- `blocked` — необязательный фильтр со значениями `true`, `false`.

### Validations and constraints

- Операция доступна только пользователю с административными правами и capability `users`.
- Контракт чтения списка пользователей не изменяет роли, `blocked state` или другие атрибуты пользователя.
- Контракт чтения списка пользователей должен оставаться в границах сценария выбора цели назначения роли и не смешивать `FEATURE-004` с операцией `Block user`.

### Response `200 OK`

```json
{
  "items": [
    {
      "userId": "usr_123",
      "displayName": "Иван Петров",
      "telegramUsername": "@ivan_petrov",
      "roles": ["customer", "barista"],
      "blocked": false,
      "availableRoleAssignments": ["barista", "administrator"]
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Response semantics

- `items[].roles` отражает фактический набор ролей пользователя на стороне identity-access boundary.
- `items[].blocked` передается как наблюдаемое состояние пользователя, потому что оно влияет на смежный административный контур, но само по себе не инициирует действие блокировки в рамках этого контракта.
- `items[].availableRoleAssignments` отражает набор ролей, которые инициатор может назначить целевому пользователю без дополнительных догадок из production-кода.
- Для обычного `administrator` `items[].availableRoleAssignments` включает только `barista`.
- Для `BootstrapAdministrator` `items[].availableRoleAssignments` может включать `barista` и `administrator`.

### Transport errors

- `401 Unauthorized` + `telegram-init-data-required | telegram-bot-token-required | telegram-hash-invalid` — auth context backoffice не подтвержден.
- `403 Forbidden` + `backoffice-capability-forbidden` — у инициатора нет capability `users`.
- `500 Internal Server Error` + `identity-access-read-failed` — identity-access boundary не смог прочитать пользователей без частичного результата.

## Contract `Assign user role`

### Consumer

- `administrator`

### Purpose

- Изменить набор ролей целевого пользователя в рамках административной операции назначения роли.

### Transport boundary

- Method: `PATCH`
- Path: `/backoffice/users/{userId}/role`
- Required capability: `users`
- Auth context: server-side `AuthenticatedActor`, подтвержденный backoffice auth boundary

### Request

```json
{
  "role": "barista"
}
```

### Inputs

- `userId` в path — идентификатор целевого пользователя.
- `role` в body — назначаемая роль `barista` или `administrator`.

### Validations and constraints

- Операция доступна только пользователю с административными правами и capability `users`.
- Допустимые назначаемые роли ограничены `barista` и `administrator`.
- Контракт изменяет только ролевое назначение пользователя и связанный доступ к вкладкам backoffice.
- Контракт не изменяет роль `customer`.
- Контракт не выполняет блокировку или разблокировку пользователя.
- Любой `administrator` с capability `users` может назначить роль `barista`.
- Только `BootstrapAdministrator`, совпадающий с `ADMIN_TELEGRAM_ID`, может назначить роль `administrator`.

### Response `200 OK`

```json
{
  "userId": "usr_123",
  "roles": ["customer", "barista"],
  "backofficeAccess": {
    "capabilities": ["orders", "availability"]
  }
}
```

### Response semantics

- `roles` отражает фактически сохраненный набор ролей пользователя после операции.
- `backofficeAccess.capabilities` отражает пересчитанный доступ пользователя к вкладкам backoffice на основании серверного набора ролей.
- Для назначения `barista` пересчитанный доступ ограничивается capabilities, соответствующими вкладкам `Заказы` и `Доступность`.
- Для назначения `administrator` shape успешного ответа остается тем же и возвращается только после проверки правила `BootstrapAdministrator`.

### Transport and business errors

- `401 Unauthorized` + `telegram-init-data-required | telegram-bot-token-required | telegram-hash-invalid` — auth context backoffice не подтвержден.
- `403 Forbidden` + `backoffice-capability-forbidden` — у инициатора нет capability `users`.
- `403 Forbidden` + `administrator-role-required` — инициатор не имеет административных прав для операции назначения роли.
- `403 Forbidden` + `administrator-role-assignment-forbidden` — инициатор пытается назначить роль `administrator`, не являясь `BootstrapAdministrator`.
- `404 Not Found` + `user-not-found` — целевой пользователь не найден в identity-access boundary.
- `422 Unprocessable Entity` + `role-not-assignable` — запрошено значение роли вне набора `barista`, `administrator`.
- `500 Internal Server Error` + `identity-access-write-failed` — identity-access boundary не смог сохранить новое ролевое назначение без частичного результата.

### Несогласованности

- Отсутствуют.

## Contract `Block user`

### Consumer

- `administrator`

### Inputs

- Целевой пользователь.

### Outputs

- Пользователь со статусом `blocked`.

### Side effects

- Пользователь теряет доступ к приложению.

### Business errors

- `administrator-role-required`
- `user-not-found`
