# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-002`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator управляет каталогом меню, ценами и дополнительными опциями`
- Описание: `Фича должна дать administrator возможность из внутреннего административного контура управлять категориями меню, товарами, ценами, размерами напитков и группами дополнительных опций, включая платные, бесплатные и взаимоисключающие варианты. Результат должен демонстрироваться как самостоятельное административное управление актуальным каталогом без смешения со слотами, ролями и блокировкой пользователей.`
- Единица поставки: `FEATURE-002`
- Роль: `Разработка`
- Изменяемый контур: `delivery-unit`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Administrator из вкладки menu создаёт и изменяет категории, товары, цены, размеры напитков и группы дополнительных опций, а сохранённый каталог становится актуальным системным источником для клиентского сценария без нарушения ролевых ограничений.`
- Проверки: `Модульные тесты правил размеров напитков и групп дополнительных опций; e2e-сценарий создания и изменения категории, товара и группы дополнительных опций; дымовая проверка сохранения каталога из вкладки menu; приемочный сценарий по MC-001-MC-009 и BO-004.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Фича считается завершённой, когда administrator может end-to-end поддерживать актуальный каталог меню с ценами, размерами напитков и дополнительными опциями, а ограничения модели подтверждены тестами и приемочным сценарием.`
