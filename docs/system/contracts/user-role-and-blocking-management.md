# Contract: User Role And Blocking Management

## Граница

Один набор контрактов: управление ролями пользователей, блокировкой и bootstrap главного administrator.

## Источники

- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-users-and-roles.md`
- `docs/business/scenarios/administrator-block-user.md`
- `Expressa — Требования к продукту.txt`

## Contract `Bootstrap main administrator`

### Inputs

- Значение `ADMIN_TELEGRAM_ID`.

### Validations and constraints

- При запуске должен существовать только один главный administrator из env-конфигурации.
- Повторный старт должен быть идемпотентным относительно наличия этого пользователя.

### Outputs

- Пользователь с ролью `administrator`, связанный с `ADMIN_TELEGRAM_ID`.

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

### Business errors

- `administrator-role-required`
- `role-not-assignable`

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
