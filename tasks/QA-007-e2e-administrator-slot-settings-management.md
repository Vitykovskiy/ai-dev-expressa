# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-007`
- Родительская задача: `FEATURE-003`
- Заголовок: `E2E управление настройками слотов administrator`
- Описание: `Система должна иметь browser e2e suite для FEATURE-003 на основании пользовательских сценариев управления рабочими часами и вместимостью слотов: administrator изменяет и сохраняет настройки, получает ожидаемые ошибки валидации и подтверждает влияние новых значений на дальнейшую генерацию доступных слотов текущего дня; пользователь без capability settings получает отказ по documented route.`
- Единица поставки: `FEATURE-003`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `локальный containerized e2e runner из текущего QA stack; feature-specific browser tests и fixtures для slot settings`

## Примечания

- Зависимости: `AR-006`, `FE-006`, `BE-005`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Есть browser e2e evidence по FEATURE-003: сценарии FTS-003-001, FTS-003-003, FTS-003-004, FTS-003-005 и FTS-003-006 покрыты через documented route; coverage mapping фиксирует scenario IDs, test files, test titles и required assertions; финальный acceptance run воспроизводим локальной containerized командой QA runner.`
- Проверки: `Browser e2e-сценарии по Scenario IDs FTS-003-001, FTS-003-003, FTS-003-004, FTS-003-005, FTS-003-006; финальный acceptance-прогон выполняется локальной containerized командой QA runner по текущему documented route из deployment map; coverage mapping обязан зафиксировать scenario ID -> test file -> test title -> required assertions; результат включает runner summary, browser report, pass/fail локального контейнерного прогона и ссылки на созданные BUG-задачи с метками frontend/backend/devops при воспроизводимых product failures или launch failures.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-slot-settings.md, если меняются e2e сценарии slot settings, fixtures, contract mocks, test route или acceptance path.`
- Критерии готовности: `E2E QA-задача завершена, когда browser e2e-покрытие FEATURE-003 актуально, финальная локальная containerized команда QA runner воспроизводима, последний локальный контейнерный прогон зафиксирован с coverage mapping, runner summary и browser report, а все найденные blocking product failures или launch failures оформлены через BUG-задачи с метками контура причины или явно отсутствуют.`
