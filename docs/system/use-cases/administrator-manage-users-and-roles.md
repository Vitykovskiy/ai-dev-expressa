# Вариант использования: Administrator Manage Users And Roles

## Граница

Один вариант использования: назначение пользователю роли `barista` или `administrator`.

## Источники

- `docs/business/scenarios/administrator-manage-users-and-roles.md`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/backoffice-operations.md`

## Триггер

Administrator инициирует изменение ролей пользователя.

## Предусловия

- Пользователь идентифицирован через служебного Telegram-бота.
- Пользователь имеет роль `administrator` и доступ к вкладке `Пользователи`.

## Основной поток

1. Система предоставляет administrator список пользователей.
2. Administrator выбирает пользователя.
3. Administrator назначает пользователю роль `barista`.
4. Система сохраняет новое ролевое назначение.
5. Система пересчитывает доступ пользователя к вкладкам backoffice согласно новым ролям.

## Альтернативы и исключения

- Главный administrator назначает пользователю роль `administrator`.
- Если назначаемая роль не входит в разрешённый набор, система не выполняет изменение.
- Если administrator, не являющийся главным administrator, назначает роль `administrator`, система не выполняет изменение.

## Постусловия

- Роль пользователя обновлена.
