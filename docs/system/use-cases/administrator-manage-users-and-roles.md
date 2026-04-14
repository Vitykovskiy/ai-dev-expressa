# Use Case: Administrator Manage Users And Roles

## Граница

Один use case: назначение пользователю роли `barista` или `administrator`.

## Источники

- `docs/business/scenarios/administrator-manage-users-and-roles.md`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/backoffice-operations.md`

## Триггер

Administrator инициирует изменение ролей пользователя.

## Предусловия

- Пользователь идентифицирован через Telegram backoffice-бота.
- Пользователь имеет роль `administrator` и доступ к вкладке `Пользователи`.

## Основной поток

1. Система предоставляет administrator список пользователей.
2. Administrator выбирает пользователя.
3. Administrator назначает пользователю роль `barista` или `administrator`.
4. Система сохраняет новое ролевое назначение.
5. Система пересчитывает доступ пользователя к вкладкам backoffice согласно новым ролям.

## Альтернативы и исключения

- Если назначаемая роль не входит в разрешённый набор, система не выполняет изменение.

## Постусловия

- Роль пользователя обновлена.

## Несогласованности

- Во входных материалах не согласовано, может ли любой `administrator` назначать новых `administrator`, или это право ограничено главным administrator.
