# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-006`
- Родительская задача: `FEATURE-002`
- Заголовок: `Редактор товаров каталога меню и валидации цен`
- Описание: `Нужно реализовать в apps/backoffice-web редактор товаров каталога меню поверх FE-004 и общего каркаса FE-005: создание и изменение товара внутри выбранной категории, переключение между типами product и drink, базовую цену для товара без обязательного размера и полный набор цен S/M/L для напитка. Клиентская часть должна выполнять только UX-валидации формы и подготовку структурного снимка к сохранению через существующий PUT /api/backoffice/menu/catalog; серверная часть остаётся источником истины по каноническим правилам ценовой модели.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `AR-002`, `BE-002`, `FE-004`, `FE-005`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `apps/backoffice-web позволяет administrator создавать и изменять товар выбранной категории, переключать форму между обычным товаром и напитком, задавать базовую цену или цены S/M/L, видеть UX-ошибки обязательных полей и серверные ошибки invalid-drink-size-model без дублирования серверной бизнес-логики.`
- Проверки: `Модульные тесты валидаторов или композиционных функций редактора товара; локальная проверка создания товара с базовой ценой и напитка с ценами S/M/L; npm run test:backoffice.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда administrator может из маршрута menu.menu_product_detail создать или изменить товар и напиток, а сохранение использует существующий структурный снимок каталога и общие DTO.`
