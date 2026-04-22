# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-005`
- Родительская задача: `FEATURE-003`
- Заголовок: `Реализовать backend управление настройками слотов`
- Описание: `Нужно реализовать серверный контур Manage working hours and slot capacity для administrator: чтение текущих или дефолтных рабочих часов и вместимости, сохранение новых параметров и применение последнего успешно сохранённого snapshot к дальнейшему формированию доступных customer-слотов текущего дня. Контур должен использовать существующую backoffice-авторизацию и не включать customer checkout, изменение длины слота или расширение горизонта слотов за пределы текущего дня.`
- Единица поставки: `FEATURE-003`
- Роль: `Бэкенд`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FEATURE-001`, `AR-006`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/architecture/stack.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/backend-slot-settings.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Backend предоставляет защищённый administrator-only API чтения и сохранения настроек слотов, воспроизводит ошибки invalid-working-hours и invalid-slot-capacity, возвращает дефолтные значения до первого сохранения и применяет последнее успешно сохранённое сочетание рабочих часов и вместимости к генерации доступных слотов текущего дня.`
- Проверки: `Модульные тесты доменных правил slot settings и slot generation; integration tests для endpoints чтения/сохранения настроек; negative tests для invalid-working-hours, invalid-slot-capacity и доступа без capability settings; backend build/test.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/backend-slot-settings.md и при необходимости docs/architecture/application-map/backend-access.md, если появляются новые modules, endpoints, DTO, repository adapters, guard attachment или error mapping.`
- Критерии готовности: `BE-задача завершена, когда backend является источником истины для рабочих часов и вместимости слотов, а frontend/QA могут работать с slot settings API и slot generation behavior без чтения backend production-кода для восстановления contract.`
- Ограничение: `Не канонизировать верхнюю границу slotCapacity как 50 только по UI reference; если реализация требует дополнительного numeric bound сверх feature spec и contract, это считается blocker handoff и должно быть возвращено на уточнение.`
