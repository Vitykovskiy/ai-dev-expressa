# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-005`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator блокирует пользователя и прекращает доступ`
- Описание: `Нужно дать administrator законченный сценарий блокировки пользователя. После блокировки пользователь получает статус blocked и теряет доступ к приложению. Фича не включает разблокировку, потому что она не зафиксирована текущими системными артефактами.`
- Единица поставки: `FEATURE-005`
- Роль: `Системный аналитик`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/ConfirmDialog.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Ожидаемый результат для ревью: `Подготовлены feature spec и документ сценариев тестирования FEATURE-005: зафиксированы граница фичи, пользовательские сценарии, UI-взаимодействия, validations, errors, design readiness, крайние случаи и handoff для архитектурной декомпозиции.`
- Проверки: `Feature spec и .test-scenarios документ созданы в docs/system/feature-specs, карточка FEATURE-005 ссылается на оба документа, сценарии содержат stable scenario IDs, manual QA route, e2e coverage expectation и required assertions; design readiness сверен с .references/Expressa_admin/src/app/screens/UsersScreen.tsx и .references/Expressa_admin/src/app/components/ConfirmDialog.tsx.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули пользователей, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда блокировка пользователя прекращает доступ по системному контракту и дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Ограничение: `Действие unblock_user есть в UI-контракте, но отсутствует в утверждённых системных артефактах; не реализовывать разблокировку в рамках этой фичи без отдельного решения.`
