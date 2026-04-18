# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-012`
- Родительская задача: `FEATURE-002`
- Заголовок: `Экран категорий и состояния дерева menu`
- Описание: `Нужно визуально перенести экран категорий menu в apps/backoffice-web поверх FE-011: список категорий, пустое состояние, раскрытие и сворачивание групп, действия создания и редактирования категории, диалоги и disabled-состояния должны соответствовать прототипу .references/Expressa_admin и укладываться в текущую архитектуру pages/components/composables/stores. Нельзя менять публичные HTTP-контракты, DTO, маршруты menu.* и menuCatalogStore; локальные UI-состояния должны оставаться внутри компонентов, а UX-валидации и сценарии сохранения — в композиционных функциях и хранилищах состояния.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FE-011`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Экран категорий использует новый shell и общие примитивы, воспроизводит визуальный поток прототипа для пустого каталога, списка категорий, раскрытия дерева и диалогов, но сохраняет текущую архитектурную рамку и существующие сценарии работы со структурным снимком каталога.`
- Проверки: `После FE-012 проверить пустой каталог, создание и редактирование категории, раскрытие списка, dirty-state и сохранение; модульные тесты композиционных функций или компонентов экрана категорий при наличии ветвящейся UI-логики; npm run test:backoffice.`
- Обновление карты приложения: `Не требуется, если структура menu-маршрутов и каталогов не меняется; при выделении новых крупных компонентов экрана категорий или изменении маршрутов обновить docs/architecture/application-map/backoffice-web.md и README.md при необходимости.`
- Критерии готовности: `Задача завершена, когда administrator может из маршрута categories работать со списком категорий и состояниями дерева в новом дизайне, а FE-013 получает согласованный визуальный и компонентный каркас для списка товаров выбранной категории.`
