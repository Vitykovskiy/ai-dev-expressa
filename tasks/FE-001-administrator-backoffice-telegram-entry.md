# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Реализовать клиентский вход administrator в backoffice через Telegram`
- Описание: `Нужно реализовать клиентский backoffice entry на Vue 3/Vuetify: принять Telegram Web App init data, передать его backend-контуру, получить authenticated actor/roles, показать разрешённые вкладки administrator и заблокировать рабочий UI без допустимого входа. React-референс используется только как визуальный и поведенческий ориентир для layout, routes и навигации.`
- Единица поставки: `FEATURE-001`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/application-map/frontend-backoffice.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`, `.references/Expressa_admin/src/app/components/TopBar.tsx`

## Примечания

- Зависимости: `BE-001 для финальной интеграции authenticated actor/roles; можно начать с контрактного client boundary и mock adapter.`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/frontend-backoffice.md`, `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`
- Ожидаемый результат для ревью: `Administrator, открывший backoffice через служебный Telegram entrypoint, видит разрешённые вкладки; прямой доступ без допустимого входа не показывает рабочий UI; role guard защищает прямые routes.`
- Проверки: `Модульные тесты role navigation и route guard; интеграционная проверка frontend auth bootstrap с backend contract/mock; сборка frontend; ручная проверка desktop/mobile навигации по референсу.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md, если появляются новые routes, auth states, frontend env/config или навигационные правила.`
- Критерии готовности: `FE-задача завершена, когда клиентский backoffice использует серверный authenticated actor, не хардкодит роль administrator и блокирует запрещённые вкладки как в навигации, так и по прямому пути.`
