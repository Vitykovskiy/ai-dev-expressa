# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-011`
- Родительская задача: `FEATURE-002`
- Заголовок: `Shell вкладки menu и панель сохранения в визуальном стиле прототипа`
- Описание: `Нужно перенести shell вкладки menu в apps/backoffice-web на новый визуальный слой поверх FE-010: hero/header, счетчики, action-bar, блоки загрузки, ошибки, предупреждения и MenuCatalogSavePanel должны воспроизводить новый дизайн и корректно работать с текущими состояниями idle/loading/error/saving/dirty. Публичные HTTP-контракты, DTO, маршруты menu.* и menuCatalogStore менять нельзя; допускаются только внутренние изменения props/emits/slots menu-компонентов и адаптация MenuCatalogShellPage вместе с MenuCatalogSavePanel. Оркестрация загрузки, сохранения и предупреждений остается в композиционных функциях и хранилищах состояния.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FE-010`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Shell вкладки menu визуально приведен к новому дизайну, корректно отражает состояния idle/loading/error/saving/dirty и продолжает использовать существующую оркестрацию чтения, сохранения и предупреждений без переноса бизнес-логики в шаблоны.`
- Проверки: `Модульные тесты shell-состояний и панели сохранения, если при переносе появляется нетривиальная логика отображения; локальная проверка сценариев loading/error/dirty/save из вкладки menu на desktop и mobile; npm run test:backoffice.`
- Обновление карты приложения: `Не требуется, если меняется только визуальный слой; при изменении структуры shell-компонентов, маршрутов или точек сборки обновить docs/architecture/application-map/backoffice-web.md и README.md при необходимости.`
- Критерии готовности: `Задача завершена, когда shell menu использует общий визуальный слой FE-010, отражает все базовые состояния вкладки и не требует локального копирования стилей или логики между страницами menu.`
