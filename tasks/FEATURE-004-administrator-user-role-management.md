# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-004`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator назначает роли пользователям`
- Описание: `Нужно дать administrator законченный сценарий просмотра пользователей и назначения ролей barista или administrator с пересчётом доступа к вкладкам внутреннего административного контура. Фича не включает блокировку пользователя, разблокировку пользователя или изменение ролей customer.`
- Единица поставки: `FEATURE-004`
- Роль: `Системный аналитик`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Ожидаемый результат для ревью: `Подготовлены feature spec и документ сценариев тестирования FEATURE-004: зафиксированы граница фичи, пользовательские сценарии, UI-взаимодействия, validations, errors, design readiness, крайние случаи и handoff для архитектурной декомпозиции, включая обязательный переход на постоянное хранение пользователей и ролей в БД.`
- Проверки: `Feature spec и .test-scenarios документ созданы в docs/system/feature-specs, карточка FEATURE-004 ссылается на оба документа, сценарии содержат stable scenario IDs, manual QA route, e2e coverage expectation и required assertions; design readiness сверен с .references/Expressa_admin/src/app/screens/UsersScreen.tsx и .references/Expressa_admin/src/app/components/AddUserDialog.tsx.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули пользователей, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда назначение ролей работает по согласованным правилам доступа и дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Блокер: `Не согласовано, может ли любой administrator назначать других administrator, или это право ограничено только главным administrator. До снятия блокера нельзя финализировать поведение назначения роли administrator.`
- Архитектурное требование: `При декомпозиции FEATURE-004 назначение ролей должно опираться на постоянное хранение пользователей, ролей и blocked state в БД; in-memory реализация не является допустимым итоговым решением для этой фичи.`
