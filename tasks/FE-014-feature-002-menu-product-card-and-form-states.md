# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-014`
- Родительская задача: `FEATURE-002`
- Заголовок: `Карточка товара и состояния формы товара`
- Описание: `Нужно адаптировать карточку товара в apps/backoffice-web поверх FE-013 по мотивам add/edit product из прототипа .references/Expressa_admin: секции формы, переключение типа товара, матрицу размеров и цен, UX-валидации, destructive-действия, локальные pending/error-состояния и действия сохранения. Публичные HTTP-контракты, DTO, маршруты menu.* и menuCatalogStore менять нельзя; клиентская часть должна использовать существующие композиционные функции и хранилища состояния для оркестрации и валидаций, а шаблоны и компоненты — только для отображения и локальных UI-состояний.`
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

- Зависимости: `FE-013`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Карточка товара воспроизводит новый визуальный язык для создания и редактирования обычного товара и напитка, корректно показывает pending/error/destructive-состояния и использует существующую клиентскую оркестрацию без переноса предметной логики в шаблон.`
- Проверки: `После FE-014 проверить создание и редактирование обычного товара и напитка с размерами, ошибки валидации и ошибки сохранения; модульные тесты формы товара и связанных композиционных функций при наличии ветвящейся логики; npm run test:backoffice.`
- Обновление карты приложения: `Не требуется, если маршрут и роль страницы не меняются; при выделении новых крупных компонентов карточки товара или изменении маршрута detail обновить docs/architecture/application-map/backoffice-web.md и README.md при необходимости.`
- Критерии готовности: `Задача завершена, когда administrator может из маршрута карточки товара пройти полный сценарий create/edit/save/delete в новом дизайне для обычного товара и напитка, а FE-015 получает согласованный визуальный подход к detail-редакторам menu.`
