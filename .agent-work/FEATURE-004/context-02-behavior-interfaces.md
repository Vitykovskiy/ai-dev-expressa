# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/FEATURE-004-administrator-user-role-management.md`
- Подзадача: `02 — behavior and interfaces slices`
- Роль исполнителя: `Системный аналитик`
- Контурная карта: `n/a`
- Зона ответственности: `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- Связанный план: `.agent-work/FEATURE-004/execution-plan.md`

## Цель подзадачи

Создать behavior и interfaces slices для просмотра пользователей и назначения ролей без переноса блокировки, разблокировки, создания пользователей или реализации в scope.

## Поведенческий промпт исполнителя

```text
You operate as a system analyst.

Complete only the behavior and interfaces slices for FEATURE-004. Describe system behavior, inputs, outputs, guards, validations and errors from the assigned sources. Record the administrator-assignment blocker without resolving it by assumption.
```

## Обязательный read set

- `tasks/FEATURE-004-administrator-user-role-management.md`
- `.agent-work/FEATURE-004/context-01-source-boundary.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/use-cases/administrator-manage-users-and-roles.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

## Ключевые факты из источников

- Система должна предоставлять `administrator` список пользователей.
- Система должна позволять назначить целевому пользователю роль `barista`.
- Система должна поддерживать назначение роли `administrator` только после разрешения blocker по владельцу права назначения.
- Система должна пересчитывать доступ к вкладкам после изменения роли.
- Ошибки источника: `administrator-role-required`, `role-not-assignable`.
- Блокировка, разблокировка и снятие роли `barista` не входят в FEATURE-004.

## Разрешенная зона правок

- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `.agent-work/FEATURE-004/execution-plan.md`

## Запрещенная зона правок

- Другие package slices, кроме ссылок и traceability при необходимости.
- Production-код и тесты.
- `.references/**`.
- Архитектурная декомпозиция и дочерние задачи.

## Входы и зависимости

- Зависит от подзадачи `01`.
- Подзадачи `03` и `04` используют итоговые anchors и сценарные IDs.

## Ожидаемый результат

Два package slices с feature-specific workflows, constraints, contracts, operation boundaries, inputs, outputs, guards and error mapping.

## Проверки

- `behavior.md` не описывает API wire shape.
- `interfaces.md` не пересказывает workflows за пределами operation boundary.
- Все unresolved facts находятся в `Open Questions` или `Blockers`.

## Критерии готовности

- Workflow просмотра пользователей и назначения роли покрыт.
- Scope constraints атомарно исключают блокировку, разблокировку, создание пользователей и изменение роли `customer`.
- Safety constraints фиксируют роль backend/source of truth и запрет доступа без `administrator`.

## Риски и запреты

- Риск: включить `unblock_user` или `revoke_barista` из UI reference в подтвержденное поведение.
- Запрет: выбирать endpoint paths или persistence strategy без архитектурного основания.

## Открытые вопросы

- Кто имеет право назначать роль `administrator`: любой `administrator` или только главный `administrator`.
