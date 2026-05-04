# Behavior: FEATURE-005 Administrator User Blocking

## Карточка документа

- Feature: `FEATURE-005`
- Package root: `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/`
- Index: [index.md](./index.md)
- Status: `ready-for-architecture`
- Last consistency check: `2026-05-04`

## User Workflows

### Main workflow

1. Administrator открывает пользовательский контур `users`.
2. Система должна предоставить administrator список пользователей.
3. Administrator выбирает существующего пользователя.
4. Administrator инициирует блокировку выбранного пользователя.
5. Система должна сохранить для выбранного пользователя статус `blocked`.
6. Система должна прекратить доступ заблокированного пользователя к приложению.
7. Система должна показать administrator обновленное представление пользователя со статусом `blocked`.

### Alternative workflows

#### Пользователь уже отсутствует к моменту блокировки

1. Administrator инициирует блокировку пользователя, которого система больше не находит.
2. Система должна вернуть бизнес-ошибку `user-not-found`.
3. Система должна сохранить предыдущее состояние списка пользователей без подтверждения успешной блокировки.

#### Оператор не имеет роли administrator

1. Пользователь без роли `administrator` пытается выполнить блокировку.
2. Система должна вернуть бизнес-ошибку `administrator-role-required`.
3. Система должна сохранить состояние целевого пользователя без изменения.

### Exception workflows

#### Повторная блокировка уже заблокированного пользователя

1. Система обнаруживает, что целевой пользователь уже имеет `blocked=true`.
2. Система должна считать поведение повторной блокировки не определенным текущими canonical sources.
3. Система должна требовать отдельного resolver перед добавлением специальной ветки idempotent success, error или восстановления.

## Entity View

### Entities

- `User`
- `Role`

### Relations

- `User` может иметь роль `administrator`.
- `administrator` может установить для другого `User` признак `blocked=true`.
- `User` с `blocked=true` связан с запретом доступа к приложению.

### Invariants

- Пользователь с `blocked=true` не может пользоваться приложением.
- Система должна сохранять роли пользователя отдельно от признака `blocked`.
- Система должна применять блокировку доступа независимо от того, через какой допустимый entry channel пользователь пытается пользоваться приложением.

### Identity and ownership

- `User.userId` является внутренним идентификатором пользователя.
- `User.telegramId` является внешним идентификатором Telegram.
- Источник истины для состояния блокировки находится в системной модели пользователя.

## Input Constraints

### Required inputs

- Целевой пользователь для операции `Block user`.
- Идентифицированный actor с ролью `administrator`.

### Allowed values

- `Role`: `administrator` для actor, который выполняет блокировку.
- `blocked`: `true` как результирующее состояние целевого пользователя.

### Cross-field constraints

- Система должна применять guard `administrator-role-required` к actor до изменения целевого пользователя.
- Система должна применять `user-not-found` к отсутствующему целевому пользователю до изменения состояния.

### Boundary values

- Отсутствующий целевой пользователь должен приводить к `user-not-found`.
- Уже заблокированный пользователь остается source gap для отдельного resolver.

## Validations

### Field validations

- Система должна требовать идентификатор целевого пользователя для операции блокировки.

### Business validations

- Система должна проверять существование целевого пользователя.
- Система должна переводить найденного целевого пользователя в состояние `blocked`.

### Role or capability validations

- Система должна разрешать операцию блокировки только actor с ролью `administrator`.

## Errors

### User-facing errors

- `administrator-role-required` — Система должна сообщить, что операция доступна только administrator.
- `user-not-found` — Система должна сообщить, что целевой пользователь не найден.

### System errors

- Не зафиксированы отдельные system errors для `FEATURE-005`.

### Error mapping

| Condition                               | User-visible outcome                                                               | Source                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Actor не имеет роли `administrator`     | Система должна показать отказ выполнения операции блокировки.                      | `docs/system/contracts/user-role-and-blocking-management.md` |
| Целевой пользователь не найден          | Система должна показать, что пользователь не найден, и не подтверждать блокировку. | `docs/system/contracts/user-role-and-blocking-management.md` |
| Целевой пользователь уже `blocked=true` | Система должна считать специальное поведение не определенным текущими источниками. | `docs/system/use-cases/administrator-block-user.md`          |

## Edge Cases

- Система должна сохранять запрет доступа для заблокированного пользователя после обновления пользовательского списка.
- Система должна сохранять запрет доступа для заблокированного пользователя при следующей попытке входа в приложение.
- Система должна сохранять состояние целевого пользователя без изменения при `administrator-role-required`.
- Система должна сохранять состояние целевого пользователя без изменения при `user-not-found`.

## Scope Constraints

- `FEATURE-005` не включает разблокировку пользователя.
- `FEATURE-005` не включает назначение ролей.
- `FEATURE-005` не включает снятие ролей.
- `FEATURE-005` не включает изменение правила bootstrap главного `administrator`.
- `FEATURE-005` не включает выбор архитектурного способа хранения признака `blocked`.
- `FEATURE-005` не включает специальную ветку повторной блокировки уже заблокированного пользователя.

## Safety Constraints

- Пользователь с `blocked=true` не может пользоваться приложением.
- Actor без роли `administrator` не может блокировать пользователей.
- Ошибка `user-not-found` не изменяет состояние ни одного пользователя.
- Ошибка `administrator-role-required` не изменяет состояние целевого пользователя.

## Traceability

- Source use cases: [docs/system/use-cases/administrator-block-user.md](../../use-cases/administrator-block-user.md)
- Source domain model: [docs/system/domain-model/identity-and-access.md](../../domain-model/identity-and-access.md)
- Source state models: `n/a`
- Source contracts: [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- Related test scenarios: [test-scenarios.md](./test-scenarios.md)

## Open Questions

- Поведение повторной блокировки уже заблокированного пользователя не определено текущими canonical sources.
