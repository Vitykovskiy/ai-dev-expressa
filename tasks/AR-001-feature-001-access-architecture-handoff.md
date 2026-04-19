# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Зафиксировать архитектурный handoff для входа administrator в backoffice`
- Описание: `Нужно определить контуры реализации FEATURE-001: frontend backoffice entry, backend identity/access, env/runtime и QA-проверки. Результат должен позволить FE/BE/DO/QA задачам выполняться без локального переопределения стека, маршрутов, env/config и guard-правил.`
- Единица поставки: `FEATURE-001`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-access.md`
- Контурная карта: `docs/architecture/application-map.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`
- Ожидаемый результат для ревью: `Архитектурные карты созданы и FE/BE/DO/QA задачи FEATURE-001 имеют достаточный read set для выполнения.`
- Проверки: `Проверить наличие архитектурной навигации, контурных карт и отсутствие бизнес-артефактов в read set дочерних исполнительских задач.`
- Обновление карты приложения: `Выполнено: создан docs/architecture/application-map.md и контурные карты для FEATURE-001.`
- Критерии готовности: `Задача завершена, когда архитектурный handoff покрывает frontend, backend, delivery/runtime и QA контуры FEATURE-001.`
