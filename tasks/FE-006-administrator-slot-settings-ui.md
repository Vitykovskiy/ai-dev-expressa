# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-006`
- Родительская задача: `FEATURE-003`
- Заголовок: `Реализовать UI управления рабочими часами и вместимостью слотов`
- Описание: `Нужно реализовать клиентский сценарий administrator во вкладке Настройки на Vue 3/Vuetify: чтение текущих или дефолтных значений, изменение рабочих часов и вместимости слота, сохранение настроек, отображение success/error states и сохранение контекста редактирования при ошибке. React-референс используется как визуальный ориентир, но реализация должна опираться на backend contract и существующий server-driven backoffice session.`
- Единица поставки: `FEATURE-003`
- Роль: `Фронтенд`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## Примечания

- Зависимости: `FEATURE-001`, `AR-006`, `BE-005 для финальной интеграции; можно начать с contract/mock adapter.`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Ожидаемый результат для ревью: `Administrator во вкладке Настройки может загрузить текущие параметры, изменить рабочие часы и вместимость, сохранить допустимые значения, увидеть success notification только после подтверждённого ответа backend и получить user-visible validation state для invalid-working-hours и invalid-slot-capacity без потери контекста формы.`
- Проверки: `Frontend unit/component tests для form state, loading/success/error states и error mapping; integration test с contract/mock adapter для slot settings API; frontend build/test; ручная проверка desktop/mobile поведения по SettingsScreen reference.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md, если появляются новые route-level modules, client API boundary, validation/presentation helpers, guard states или slot settings UI handoff rules.`
- Критерии готовности: `FE-задача завершена, когда клиентский сценарий /settings работает на server-driven actor/capabilities и backend slot settings contract, не канонизирует max=50 только по UI reference и не смешивает управление настройками слотов с customer flow заказа.`
