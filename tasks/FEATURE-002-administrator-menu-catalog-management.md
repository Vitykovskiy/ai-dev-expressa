# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-002`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator управляет каталогом меню, ценами и дополнительными опциями`
- Описание: `Нужно дать administrator законченный сценарий управления каталогом: категории, товары, цены, размеры напитков S/M/L, группы дополнительных опций, варианты выбора и назначение групп на категории. Фича не включает оперативное включение и выключение доступности barista, обработку заказов или клиентский заказ.`
- Единица поставки: `FEATURE-002`
- Роль: `Разработка`
- Приоритет: `Критический`
- Статус: `Ожидает тестирования`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Декомпозиция: `AR-003`, `BE-002`, `FE-002`, `DO-003`, `QA-002`, `QA-005`; повторная нормализация feature-level acceptance выполняется через `AR-005`, `BE-004`, `FE-005`, `DO-009`, `QA-005`. `DO-003` остается historical baseline для non-gate wrapper route, а `DO-009` должен расширить его до isolated VPS browser acceptance route без переноса e2e-сценариев в DevOps.
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- Ожидаемый результат для ревью: `Administrator через вкладку Меню может создать и изменить категории, товары, ценовые схемы, группы дополнительных опций и сами опции без потери системных правил для напитков, взаимоисключающих групп и наследования групп от категории.`
- Проверки: `Модульные тесты доменных правил каталога и валидаций; интеграционные проверки контракта Manage menu catalog; manual QA пользовательских сценариев и UI parity; browser e2e-сценарий создания категории, товара с размерами и группы дополнительных опций через isolated route задеплоенного test VPS; дымовая проверка сборки и запуска затронутых контуров.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули каталога, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда управление каталогом работает как законченный административный сценарий, дочерние AR/FE/BE/DO/QA-* задачи завершены и проверены, manual QA пройдена, e2e QA подтверждена deployed evidence на test VPS, а blocking BUG-задачи закрыты или явно отсутствуют.`
