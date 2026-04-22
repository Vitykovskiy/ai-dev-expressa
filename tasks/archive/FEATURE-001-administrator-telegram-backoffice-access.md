# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-001`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator входит во внутренний административный контур через Telegram`
- Описание: `Нужно обеспечить законченный административный вход: главный administrator создаётся идемпотентно из ADMIN_TELEGRAM_ID, administrator открывает внутренний административный контур через служебного Telegram-бота, получает доступ к разрешённым вкладкам и не может работать в продуктовой среде по прямому URL без Telegram. В test environment допустим режим DISABLE_TG_AUTH=true. Фича задаёт входной контур для последующих административных возможностей, но не включает управление меню, слотами, ролями или блокировкой.`
- Единица поставки: `FEATURE-001`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-access.md`
- Контурная карта: `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TopBar.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`

## Примечания

- Зависимости: `нет`
- Декомпозиция: `AR-001`, `FE-001`, `BE-001`, `DO-001`, `QA-001`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`
- Ожидаемый результат для ревью: `Administrator может открыть внутренний административный контур через служебного Telegram-бота, система создаёт главного administrator из ADMIN_TELEGRAM_ID идемпотентно, вкладки доступны по роли, а прямой рабочий доступ без Telegram заблокирован вне test environment.`
- Проверки: `Модульные тесты bootstrap administrator и role guard; интеграционные проверки Telegram/test-mode авторизации; e2e-сценарий открытия внутреннего административного контура administrator; дымовая проверка сборки и запуска затронутых контуров.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если появляются новые точки входа, env/config, маршруты внутреннего административного контура или правила запуска.`
- Критерии готовности: `Фича закрыта, когда вход administrator через Telegram и test-mode исключение работают по системным ограничениям, а дочерние AR/FE/BE/DO/QA-* задачи завершены и проверены.`

## Результат выполнения

- `AR-001` и `AR-002` зафиксировали самодостаточный архитектурный handoff для frontend, backend, delivery/runtime и QA контуров.
- `BE-001` реализовала bootstrap главного `administrator`, Telegram/test-mode авторизацию и серверный role guard с negative checks для production-like bypass.
- `FE-001` реализовала клиентский вход в backoffice через Telegram, server-driven actor/capabilities и route/navigation guard.
- `DO-001` добавила PR checks, branch policy `PR -> checks only`, `main -> test deploy`, а также runtime/smoke contract для VPS test-окружения.
- `QA-001` подтвердила unit, integration, e2e и smoke evidence, достаточные для перевода `FEATURE-001` в статус `Выполнена`.
