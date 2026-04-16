# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-001`
- Родительская задача: `DEV-001`
- Заголовок: `Зафиксировать архитектурную рамку DU-01 и декомпозировать её на дочерние задачи`
- Описание: `На основе утвержденных бизнес- и системных артефактов по DU-01 зафиксировать применимый архитектурный контур для административной поставки Expressa v1, актуализировать docs/architecture под нужды DU-01 и только после этого создать review-ready дочерние задачи реализации для необходимых контуров frontend, backend, devops и QA.`
- Единица поставки: `DU-01`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/DEV-001-administration-foundation.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `tasks/DEV-001-administration-foundation.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Для DU-01 зафиксированы архитектурные ограничения и определены правила, по которым после завершения AR-001 создается комплект дочерних задач реализации с одним reviewable outcome на контур.`
- Проверки: `Обновлены релевантные документы в docs/architecture; созданы дочерние задачи только для тех контуров, необходимость которых подтверждена архитектурными артефактами DU-01.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Архитектурная рамка DU-01 не оставляет разработчикам решений по стеку, кодстайлу и контурной декомпозиции; только после ее фиксации могут быть созданы дочерние задачи реализации, позволяющие независимо выполнять и ревьюить работу по нужным контурам.`
