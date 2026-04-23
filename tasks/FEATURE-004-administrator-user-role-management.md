# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-004`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator назначает роли пользователям`
- Описание: `Нужно дать administrator законченный сценарий просмотра пользователей и назначения ролей barista или administrator с пересчётом доступа к вкладкам внутреннего административного контура. Фича не включает блокировку пользователя, разблокировку пользователя или изменение ролей customer. Перед архитектурной декомпозицией handoff должен содержать явный consumer-facing transport/API contract чтения списка пользователей и назначения роли без обращения исполнителей к production-коду соседнего контура.`
- Единица поставки: `FEATURE-004`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- Ожидаемый результат для ревью: `Архитектор получает FEATURE-004 с готовыми feature spec и sibling test scenarios document, явным consumer-facing transport/API contract для списка пользователей и назначения роли и сохранённым blocker по правилу назначения роли administrator без скрытых предположений.`
- Проверки: `Карточка FEATURE-004 ссылается на feature spec, sibling .test-scenarios документ и contract user-role-and-blocking-management; docs/system/README.md содержит актуальную навигационную ссылку на оба артефакта FEATURE-004 и указывает transport/API boundary; blocker по праву назначения роли administrator сохранен как единственный открытый blocker для архитектурной декомпозиции.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули пользователей, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Карточка FEATURE-004 готова к архитектурной декомпозиции, когда она ссылается на feature spec и sibling test scenarios document, минимальный read set достаточен для архитектора, consumer-facing transport/API contract чтения списка пользователей и назначения роли закреплен в канонических system artifacts, а blocker по праву назначения роли administrator сохранен в явном transport-level виде без скрытых предположений.`
- Блокер: `Не согласовано, может ли любой administrator назначать других administrator, или это право ограничено только главным administrator. До снятия блокера нельзя финализировать поведение назначения роли administrator.`
- Архитектурный статус: `Consumer-facing transport/API contract для чтения списка пользователей и назначения роли пользователю зафиксирован в docs/system/contracts/user-role-and-blocking-management.md и включен в feature-level handoff; отдельный blocker по отсутствию contract boundary снят.`
- Архитектурное требование: `При декомпозиции FEATURE-004 назначение ролей должно опираться на постоянное хранение пользователей, ролей и blocked state в БД; in-memory реализация не является допустимым итоговым решением для этой фичи.`
