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
- Ожидаемый результат для ревью: `Архитектор получает FEATURE-004 с готовыми feature spec и sibling test scenarios document, явным consumer-facing transport/API contract для списка пользователей и назначения роли и подтвержденным правилом, что роль administrator назначает только главный administrator без открытого blocker по этой фиче.`
- Проверки: `Карточка FEATURE-004 ссылается на feature spec, sibling .test-scenarios документ и contract user-role-and-blocking-management; docs/system/README.md содержит актуальную навигационную ссылку на оба артефакта FEATURE-004 и указывает transport/API boundary; карточка и docs map не содержат устаревшего blocker по праву назначения роли administrator и согласованы с BA-001.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули пользователей, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Карточка FEATURE-004 готова к архитектурной декомпозиции, когда она ссылается на feature spec и sibling test scenarios document, минимальный read set достаточен для архитектора, consumer-facing transport/API contract чтения списка пользователей и назначения роли закреплен в канонических system artifacts, а правило назначения роли administrator зафиксировано без открытых blocker в BA-001 и system artifacts.`
- Блокер: `Отсутствует; право назначения роли administrator подтверждено в BA-001 и ограничено главным administrator, совпадающим с ADMIN_TELEGRAM_ID.`
- Архитектурный статус: `Consumer-facing transport/API contract для чтения списка пользователей и назначения роли пользователю зафиксирован в docs/system/contracts/user-role-and-blocking-management.md и включен в feature-level handoff; правило назначения роли administrator подтверждено в BA-001 и отражено в feature spec, test scenarios и docs map.`
- Архитектурное требование: `При декомпозиции FEATURE-004 назначение ролей должно использовать PostgreSQL как постоянное хранилище пользователей, ролей и blocked state для итогового runtime path этой фичи.`
