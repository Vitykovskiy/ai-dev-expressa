# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-005`
- Родительская задача: `FEATURE-002`
- Заголовок: `E2E управление каталогом меню administrator`
- Описание: `Система должна иметь browser e2e suite для FEATURE-002 на основании пользовательских сценариев управления каталогом меню: administrator создает категории, товары, размерную модель напитков S/M/L, группы дополнительных опций, опции и назначает группы на категории; пользователь без capability menu получает отказ по documented route.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `browser e2e stack и fixtures, подготовленные в рамках QA-005; renamed backend integration evidence из BE-004 используется только как входное подтверждение contract behavior`

## Примечания

- Зависимости: `AR-005`, `FE-005`, `DO-009`; renamed backend integration coverage из `BE-004` используется как входное evidence`
- Минимальный read set: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Есть browser e2e evidence по FEATURE-002: сценарий administrator manages menu catalog покрывает создание категории, товара-напитка с ценами S/M/L, группы дополнительных опций, опций и назначения группы на категорию; negative checks покрывают неполную размерную модель, неверное правило группы опций и доступ без capability menu.`
- Проверки: `Browser e2e-сценарии: administrator открывает опубликованный backoffice; создает категорию; создает товар-напиток с полным набором цен S/M/L; получает отказ для неполной размерной модели; создает группу дополнительных опций с корректным правилом выбора; получает отказ для неверного правила группы опций; создает платные и бесплатные опции; назначает группу на категорию; пользователь без capability menu получает отказ. Финальный acceptance-прогон выполняется QA-owned Playwright командой. Backend endpoint integration run из BE-004 допустим как входное contract evidence, но не закрывает feature-level e2e QA. Результат: зафиксированы Playwright summary, browser report и ссылки на созданные BUG-задачи с метками frontend/backend/devops при воспроизводимых product failures или launch failures.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются e2e сценарии каталога, fixtures, contract mocks, test route или acceptance path.`
- Критерии готовности: `E2E QA-задача завершена, когда browser e2e-покрытие FEATURE-002 актуально, финальная QA-owned Playwright команда воспроизводима, последний прогон зафиксирован с summary и browser report, а все найденные blocking product failures или launch failures оформлены через BUG-задачи с метками контура причины или явно отсутствуют.`

## Результаты выполнения

- Подзадача `QA-005/03` выполнена: добавлен QA-owned Playwright feature suite `e2e/menu-catalog/admin-menu-catalog.spec.ts`.
- Сценарий `administrator manages menu catalog through backoffice` покрывает UI-flow: открытие `/menu`, создание обычной группы меню, создание напитка с ценами `S/M/L`, создание группы опций через toggle `Группа опций`, создание бесплатной и платной опции как товаров внутри группы опций, назначение группы опций на категорию и проверку сохраненного snapshot через backend contract.
- Negative coverage в `e2e/menu-catalog/admin-menu-catalog.spec.ts` покрывает отказ для неполной размерной модели напитка, отказ `invalid-option-group-rule` для неверного правила группы опций и отказ прямого API-доступа к меню для test actor без доступного `menu` access в локальном test-mode.
- Automated coverage mapping приведен к stable Scenario IDs из `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`: Playwright suite содержит annotations/title для `FTS-002-001`, `FTS-002-003`, `FTS-002-004`, `FTS-002-005`, `FTS-002-006`, `FTS-002-007`, `FTS-002-008`, `FTS-002-011`; backend integration/domain evidence содержит test titles для `FTS-002-002`, `FTS-002-003`, `FTS-002-005`, `FTS-002-006`, `FTS-002-007`, `FTS-002-008`, `FTS-002-011`.
- Финальный browser e2e-прогон: `5 passed`.
- Evidence финального прогона: Playwright summary и browser report.
- В финальном прогоне `QA-005/03` воспроизводимых product failures или launch failures не обнаружено; создание `BUG-*` по результатам этой подзадачи не требуется.
- Подзадача `QA-005/04` выполнена: defect handoff проведен по финальному Playwright evidence.
- Последний browser e2e result: `5 passed`; failed tests: `[]`.
- Новые `BUG-*` задачи по результатам `QA-005/04` не создавались, потому что воспроизводимые product failures и launch failures отсутствуют.
- Блокеры с неясным контуром причины по результатам `QA-005/04` отсутствуют.
