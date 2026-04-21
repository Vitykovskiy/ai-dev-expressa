# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-005`
- Родительская задача: `FEATURE-002`
- Заголовок: `E2E управление каталогом меню administrator`
- Описание: `Система должна иметь browser e2e suite для FEATURE-002 на основании пользовательских сценариев управления каталогом меню: administrator создает категории, товары, размерную модель напитков S/M/L, группы дополнительных опций, опции и назначает группы на категории; пользователь без capability menu получает отказ по documented route.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `browser e2e stack и fixtures, подготовленные в рамках QA-005; renamed backend integration evidence из BE-004 используется только как входное подтверждение contract behavior`

## Примечания

- Зависимости: `AR-005`, `FE-005`, `DO-009`; renamed backend integration coverage из `BE-004` используется как входное evidence`
- Минимальный read set: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Есть browser e2e evidence по FEATURE-002: сценарий administrator manages menu catalog покрывает создание категории, товара-напитка с ценами S/M/L, группы дополнительных опций, опций и назначения группы на категорию; negative checks покрывают неполную размерную модель, неверное правило группы опций и доступ без capability menu.`
- Проверки: `Browser e2e-сценарии: administrator открывает опубликованный backoffice; создает категорию; создает товар-напиток с полным набором цен S/M/L; получает отказ для неполной размерной модели; создает группу дополнительных опций с корректным правилом выбора; получает отказ для неверного правила группы опций; создает платные и бесплатные опции; назначает группу на категорию; пользователь без capability menu получает отказ. Финальный acceptance-прогон выполняется через npm run test:vps:e2e на isolated test VPS route после успешного main -> test deploy и smoke-check. Локальный browser run допустим для разработки и debug. Backend endpoint integration run из BE-004 допустим как входное contract evidence и debug, но не закрывает feature-level e2e QA. Результат: зафиксирован wrapper summary, browser report, pass/fail прогон на test VPS и ссылки на созданные BUG-задачи с метками frontend/backend/devops при воспроизводимых defects.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются e2e сценарии каталога, fixtures, contract mocks, test route или acceptance path.`
- Критерии готовности: `E2E QA-задача завершена, когда browser e2e-покрытие FEATURE-002 актуально, финальная команда запуска на isolated test VPS route воспроизводима, последний deployed прогон зафиксирован с wrapper summary и browser report, а все найденные blocking defects оформлены через BUG-задачи с метками контура причины или явно отсутствуют.`
