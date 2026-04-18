# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-012`
- Родительская задача: `FEATURE-006`
- Заголовок: `Перенос root layout, TopBar, TabBar и SideNav на новую систему компонентов`
- Описание: `Нужно переписать визуальный каркас BackofficeLayout по React-референсу, используя базовую систему компонентов из FE-011 и компоненты каркаса в apps/backoffice-web/src/components/layout. Нужно сохранить серверно-управляемую навигацию вкладок, route guards, экран отказа в доступе, bootstrap доступа, восстановление сессии и текущее поведение test-окружения.`
- Единица поставки: `FEATURE-006`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/components/TopBar.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`

## Примечания

- Зависимости: `FE-011`
- Минимальный read set: `README.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/RootLayout.tsx`
- Ожидаемый результат для ревью: `Root layout, мобильная нижняя навигация, планшетная боковая навигация, top bar, состояния блокировки и экран отказа в доступе визуально соответствуют UI-контракту, используют src/components/layout, а доступ по ролям не изменён.`
- Проверки: `BackofficeLayout.spec.ts`; `router/index.spec.ts`; `npm run test --workspace @expressa/backoffice-web`; `npm run build --workspace @expressa/backoffice-web`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md при изменении layout-структуры; README.md при необходимости`
- Критерии готовности: `Задача завершена, когда новый layout работает с существующими хранилищами состояния, router и services и не ломает сценарии FEATURE-001.`
