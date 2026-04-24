# Карточка задачи

## Карточка задачи

- Идентификатор: `BA-001`
- Родительская задача: `FEATURE-004`
- Заголовок: `Бизнес-уточнения по управлению ролями и user-management в backoffice`
- Описание: `Нужно снять открытые бизнес-вопросы, которые блокируют финализацию системных правил для FEATURE-004 и создают расхождения между UI-референсом и каноническими системными артефактами. Задача охватывает уточнение права назначения роли administrator, границы и смысл операций block/unblock на экране Пользователи, а также бизнес-решение о том, какие действия user-management должны считаться частью одного сценария, а какие должны быть разделены по отдельным feature boundaries. Результатом должна стать обновленная бизнес-формулировка без скрытых допущений, достаточная для снятия или явной переформулировки текущего blocker в FEATURE-004 и для согласованного handoff в системную аналитику.`
- Единица поставки: `FEATURE-004`
- Роль: `Бизнес аналитик`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/domain-model/identity-and-access.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `docs/business/README.md`, `docs/business/business-rules/access-and-roles.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`, `docs/business/glossary/telegram-ordering-v1.md`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `tasks/FEATURE-004-administrator-user-role-management.md`, `tasks/FEATURE-005-administrator-user-blocking.md`

## Примечания

- Зависимости: `FEATURE-004`, `FEATURE-005`
- Минимальный read set: `docs/business/README.md`, `docs/business/business-rules/access-and-roles.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`, `docs/business/glossary/telegram-ordering-v1.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- Ожидаемый результат для ревью: `Бизнес-аналитик фиксирует однозначные ответы на открытые вопросы user-management и обновляет бизнес-артефакты так, чтобы системная аналитика могла опираться на них без догадок. Должно быть явно определено, кто может назначать роль administrator, является ли unblock_user подтвержденной бизнес-операцией, должен ли экран Пользователи объединять назначение ролей и блокировку как один бизнес-сценарий или это разные сценарии, и какой бизнес-смысл имеет визуально доступный выбор administrator в форме Новый пользователь.`
- Проверки: `Проверить, что docs/business/business-rules/access-and-roles.md и связанные business scenarios больше не содержат двусмысленности по праву назначения administrator; проверить, что business-артефакты явно подтверждают или исключают unblock_user; проверить, что границы между FEATURE-004 и FEATURE-005 могут быть выведены из business-артефактов без обращения к production-коду или догадкам по UI.`
- Обновление карты приложения: `Не требуется`
- Критерии готовности: `Открытые бизнес-вопросы по user-management зафиксированы в канонических business-артефактах; системный blocker по правилу назначения administrator либо снимается подтвержденным бизнес-источником, либо переформулируется в явное ограничение; сценарии управления ролями и блокировки пользователей разделены или объединены на уровне бизнес-смысла явно и без противоречий с UI-референсом.`

## Зафиксированные решения

- Источник решений: `заказчик, ответ в рабочем диалоге от 2026-04-24`.
- Право назначения роли `administrator` есть только у главного administrator.
- Главный administrator может назначать `administrator`, а administrator может назначать `barista`.
- `unblock_user` входит в подтвержденный scope `Expressa v1`.
- Экран `Пользователи` объединяет назначение ролей, блокировку и разблокировку как единую бизнес-поверхность user-management.
- Выбор роли `administrator` в форме `Новый пользователь` подтвержден для `v1`.
- Entry point `Добавить пользователя` используется и для назначения `barista`, и для назначения `administrator`.
