# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-006`
- Родительская задача: `FEATURE-003`
- Заголовок: `Ручное тестирование управления настройками слотов administrator`
- Описание: `Нужно вручную проверить собранную FEATURE-003: administrator во вкладке Настройки читает текущие или дефолтные значения, изменяет рабочие часы и вместимость слота, сохраняет допустимые значения и видит ожидаемые validation/success states; пользователь без capability settings не может выполнить сценарий. Manual QA также сверяет live-интерфейс с backoffice UI contract и .references/Expressa_admin, фиксирует exploratory findings и оформляет воспроизводимые defects через BUG-задачи с меткой контура причины.`
- Единица поставки: `FEATURE-003`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## Примечания

- Зависимости: `BE-005`, `FE-006`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Ожидаемый результат для ревью: `Есть manual QA evidence по сценариям FTS-003-001...FTS-003-007, negative evidence для доступа без capability settings, desktop/mobile UI parity evidence против backoffice UI contract и .references/Expressa_admin, а также список заведённых BUG-задач с метками контура причины или явное подтверждение, что воспроизводимые product defects не обнаружены.`
- Проверки: `Ручные сценарии по Scenario IDs FTS-003-001, FTS-003-002, FTS-003-003, FTS-003-004, FTS-003-005, FTS-003-006, FTS-003-007; UI parity: desktop/mobile сравнение вкладки Настройки с .references/Expressa_admin/src/app/screens/SettingsScreen.tsx; exploratory checks: loading/error/disabled/notification states, сохранение контекста формы после ошибок, responsive behavior; defect handoff: список созданных BUG-задач с метками frontend/backend/devops или подтверждение отсутствия воспроизводимых defects.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-slot-settings.md, если меняются manual acceptance path, UI parity route, required manual evidence или зона ответственности QA по slot settings.`
- Критерии готовности: `Manual QA-задача завершена, когда ручные пользовательские сценарии и UI parity FEATURE-003 подтверждены, все воспроизводимые defects оформлены через BUG-задачи с метками контура причины или явно отсутствуют, а закрытие FEATURE-003 остаётся заблокированным только при незавершённой E2E QA-007 или открытых blocking BUG-задачах.`
