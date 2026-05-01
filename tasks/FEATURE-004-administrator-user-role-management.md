# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-004`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator назначает роли пользователям`
- Описание: `Нужно дать administrator законченный сценарий просмотра пользователей и назначения ролей barista или administrator с пересчётом доступа к вкладкам внутреннего административного контура. Фича не включает блокировку пользователя, разблокировку пользователя или изменение ролей customer.`
- Единица поставки: `FEATURE-004`
- Роль: `Системный аналитик`
- Приоритет: `Критический`
- Статус: `В работе`

## Ссылки на документы

- Feature package: `docs/system/feature-specs/feature-004-administrator-user-role-management/`, `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Ожидаемый результат для ревью: `Подготовлены feature package и документ сценариев тестирования FEATURE-004: зафиксированы граница фичи, пользовательские сценарии, UI-взаимодействия, validations, errors, design readiness, крайние случаи и handoff для архитектурной декомпозиции. Package остается в status draft до снятия blocker по назначению роли administrator.`
- Проверки: `Feature package slices index.md, behavior.md, interfaces.md, ui-behavior.md и test-scenarios.md созданы в docs/system/feature-specs/feature-004-administrator-user-role-management; карточка FEATURE-004 ссылается на package root, index.md и test-scenarios.md; сценарии содержат stable scenario IDs, manual QA route, e2e coverage expectation и required assertions; design readiness сверен с .references/Expressa_admin/src/app/screens/UsersScreen.tsx и .references/Expressa_admin/src/app/components/AddUserDialog.tsx.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули пользователей, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда назначение ролей работает по согласованным правилам доступа и дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Блокер: `Не согласовано, может ли любой administrator назначать других administrator, или это право ограничено только главным administrator. До снятия блокера нельзя финализировать поведение назначения роли administrator.`
