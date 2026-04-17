# Карточка задачи

## Карточка задачи

- Идентификатор: `SPRINT-002`
- Родительская задача: `нет`
- Заголовок: `Customer оформляет заказ на выдачу и просматривает историю`
- Описание: `Спринт 002 задает координационные рамки для клиентского сценария заказа в Expressa v1. Внутри спринта архитектор должен сначала нарезать работу на отдельные FEATURE-*, а затем каждая выбранная фича отдельно доводится до законченного и тестируемого результата. Спринт охватывает открытие приложения через Telegram, просмотр меню, выбор товаров и опций, выбор доступного слота текущего дня, создание заказа и просмотр истории, но сам не является единицей поставки.`
- Единица поставки: `n/a`
- Роль: `Разработка`
- Изменяемый контур: `n/a`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`, `docs/business/scenarios/customer-view-order-history.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-create-pickup-order.md`, `docs/system/use-cases/customer-view-order-history.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `SPRINT-001`
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Для SPRINT-002 определен и реализуется согласованный набор FEATURE-*, который в сумме покрывает клиентский путь от выбора меню до создания заказа и просмотра истории без догадок о внутренней архитектуре.`
- Проверки: `Каждая FEATURE-* внутри спринта проходит свои обязательные проверки, включая модульные тесты, e2e, дымовые проверки и приемочный сценарий по затронутой функциональности.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются каталоги, entrypoints, shared packages, env/config или deployment path.`
- Критерии готовности: `Спринт закрывается только после того, как все включенные в него FEATURE-* завершены, протестированы и в сумме дают работающий клиентский сценарий от открытия приложения до просмотра истории заказов.`
