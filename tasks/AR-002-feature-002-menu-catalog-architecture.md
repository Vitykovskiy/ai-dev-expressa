# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Архитектурная рамка управления каталогом меню, ценами и дополнительными опциями`
- Описание: `Нужно зафиксировать архитектурную рамку реализации FEATURE-002: границы ответственности между apps/server, apps/backoffice-web и packages/shared-types, форму чтения и сохранения каталога меню, правила представления категорий, товаров, размеров напитков и групп дополнительных опций, а также разграничение между административным редактированием структуры каталога и отдельным сценарием временной доступности barista. Результатом должна стать согласованная рамка, достаточная для параллельной постановки серверной части, клиентской части и e2e-покрытия без догадок о DTO, экранах и валидациях.`
- Единица поставки: `FEATURE-002`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Зафиксирована архитектурная рамка FEATURE-002 с явным разделением ответственности между серверной частью, внутренним административным контуром и общими типами; по документам понятно, как читается и сохраняется каталог, где валидируются размеры напитков и правила групп дополнительных опций и как меню-подпотоки укладываются в существующую навигацию внутреннего административного контура.`
- Проверки: `Архитектурное ревью обновлённой docs/architecture/application-map.md; проверка согласованности дочерних задач FEATURE-002 с зафиксированными DTO, экранами и правилами валидации.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда архитектурные документы и дочерние задачи позволяют реализовывать FEATURE-002 без неразрешённых вопросов о границах модулей, DTO каталога, маршрутах menu-подпотоков и проверках правил размеров и дополнительных опций.`
