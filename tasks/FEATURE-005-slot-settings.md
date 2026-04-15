# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-005`
- Родительская задача: `Sprint-001`
- Заголовок: `Slot settings`
- Описание: `Реализовать отдельную фичу `DU-01.F05`: administrator управляет рабочими часами и вместимостью слотов. Фича должна отдельно демонстрировать сохранение и применение настроек без смешивания со сценарием управления меню или ролями.`
- Единица поставки: `DU-01.F05`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-slot-settings.md`
- Требования / правила: `docs/business/business-rules/pickup-slots-and-capacity.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/architecture/du-01-administration.md`

## Примечания

- Зависимости: `FEATURE-002`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/architecture/du-01-administration.md`
- Ожидаемый результат для ревью: `Administrator может отдельно пройти сценарий настройки рабочих часов и вместимости слотов как самостоятельный vertical slice.`
- Проверки: `Smoke чтения и сохранения настроек слотов; unit/integration checks валидаторов и доменных ограничений.`
- Обновление карты приложения: `Обязательно при изменении slot-settings модулей, env/config или entrypoints.`
- Критерии готовности: `Фича отдельно проверяема, воспроизводима и не смешивает свой результат с недоставленными capability других административных фич.`
