# Contract: User Role And Blocking Management

## Граница

Один набор контрактов: управление ролями пользователей, блокировкой и bootstrap главного administrator.

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

## Contract `Read users for role management`

### Consumer

- `administrator`

### Inputs

- Нет обязательных бизнес-входов.

### Validations and constraints

- Операция доступна только пользователю с административными правами.

### Outputs

- Список пользователей для вкладки `Пользователи`.
- Для каждого пользователя система возвращает идентификатор пользователя, Telegram-идентификатор, текущие роли и признак блокировки.
- Для каждого пользователя система возвращает человекочитаемую подпись пользователя, если она есть в источнике идентификации.

### Business errors

- `administrator-role-required`

## Contract `Assign user role`

### Consumer

- `administrator`

### Inputs

- Целевой пользователь.
- Назначаемая роль `barista` или `administrator`.

### Validations and constraints

- Операция доступна только пользователю с административными правами.
- Допустимые назначаемые роли ограничены `barista` и `administrator`.

### Outputs

- Обновлённый набор ролей пользователя.
- Обновлённый доступ к вкладкам backoffice.
- Обновлённое представление пользователя в списке пользователей.

### Business errors

- `administrator-role-required`
- `role-not-assignable`
- `user-not-found`

### Несогласованности

- Требование о том, кто именно имеет право назначать роль `administrator`, противоречиво и требует отдельного разрешения.

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
