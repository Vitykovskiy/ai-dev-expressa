# System Context: Expressa v1 Telegram Ordering

## Граница

Один системный контекст: продукт `Expressa v1` в границах Telegram-центричного заказа на выдачу и операционного backoffice для ролей `barista` и `administrator`.

## Источники

- `docs/business/vision/expressa-v1-telegram-ordering.md`
- `docs/business/glossary/telegram-ordering-v1.md`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/order-lifecycle-and-history.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/*.md`

## Назначение системы

- Предоставить `customer` возможность оформить заказ на выдачу через клиентский веб-интерфейс, открываемый из клиентского Telegram-бота.
- Предоставить `barista` и `administrator` единый backoffice веб-интерфейс, открываемый через отдельного служебного Telegram-бота.
- Поддерживать жизненный цикл заказа, выбор слота выдачи, историю заказов, Telegram-уведомления customer и Telegram-напоминания barista.

## Внешние акторы и внешние системы

| Тип | Участник | Роль по отношению к системе |
|---|---|---|
| Актор | `customer` | Открывает customer-приложение, формирует корзину, создаёт заказ, просматривает историю заказов. |
| Актор | `barista` | Обрабатывает заказы, временно управляет доступностью меню, получает Telegram-напоминания. |
| Актор | `administrator` | Управляет меню, слотами, пользователями, ролями и блокировкой. |
| Внешняя система | `клиентский Telegram-бот` | Точка входа customer и канал уведомлений о смене статуса заказа. |
| Внешняя система | `служебный Telegram-бот` | Точка входа в backoffice и канал напоминаний для barista. |

## Inbound interactions

| Источник | Взаимодействие |
|---|---|
| `customer` через клиентского Telegram-бота | Открытие customer-приложения, просмотр меню, управление корзиной, создание заказа, просмотр истории заказов. |
| `barista` через служебного Telegram-бота | Подтверждение заказа, отклонение заказа, перевод в `Готов к выдаче`, закрытие заказа, изменение доступности меню. |
| `administrator` через служебного Telegram-бота | Управление меню, рабочими часами, вместимостью слотов, ролями пользователей и блокировкой. |
| Конфигурация развёртывания | Инициализация главного administrator через `ADMIN_TELEGRAM_ID`. |
| Тестовый режим | Отключение Telegram-авторизации через `DISABLE_TG_AUTH=true`. |

## Outbound interactions

| Получатель | Взаимодействие |
|---|---|
| `клиентский Telegram-бот` | Отправка customer уведомлений о смене статуса заказа, включая причину отклонения. |
| `служебный Telegram-бот` | Отправка barista напоминаний о заказах, ожидающих действий. |

## Ответственность системы

- Хранить пользователей, их роли и статус блокировки.
- Предоставлять ролевой доступ к customer-приложению и backoffice только в Telegram-центричном режиме v1.
- Хранить и предоставлять актуальный каталог меню, его структуру, цены, размеры напитков и группы дополнительных опций.
- Хранить и применять рабочие часы, слоты выдачи текущего дня и вместимость слотов.
- Создавать заказы из корзины customer и вести их жизненный цикл.
- Хранить историю заказов customer.
- Хранить audit-атрибуты по действиям barista: подтверждение, отклонение, перевод в `Готов к выдаче`.

## Зоны вне ответственности системы

- Онлайн-оплата и любая оплата внутри приложения.
- Акции, скидки, бонусная логика и купоны.
- Слоты выдачи за пределами текущего дня.
- Продвинутая логика остатков сверх включения и выключения доступности товаров и дополнительных опций.
- Расширенная отчётность и аналитические панели.

## Системные ограничения и обязательства

### Функциональные ограничения

- Прямой рабочий доступ к веб-интерфейсам по URL без прохождения через Telegram не поддерживается.
- Горизонт выбора слотов ограничен текущим днём.
- Активными для вместимости слота считаются заказы в статусах `Создан`, `Подтвержден`, `Готов к выдаче`.
- Неактивными для вместимости слота считаются заказы в статусах `Отклонен`, `Закрыт`.

### Зафиксированные системные constraints из входных материалов

- Главный administrator задаётся через `ADMIN_TELEGRAM_ID`; старт системы должен быть идемпотентным относительно его создания.
- В test environment Telegram-авторизация отключается через `DISABLE_TG_AUTH=true`.
- Валюта расчётов: российские рубли, округление до целых значений.
- Во входных требованиях зафиксированы технологические ограничения `NestJS`, `Vue 3`, `Vuetify`, независимые сервисы и обязательный CI/CD-процесс; этот документ фиксирует их как внешние constraints, но не раскрывает архитектурную реализацию.

## System capability decomposition for analysis

Ниже перечислены системные срезы, которые нужны для системного анализа и навигации по артефактам.

Этот раздел не является каноническим backlog-планом и не должен механически превращаться в верхнеуровневые задачи поставки.

| Системный срез | Бизнес-требование | Изменяемая системная граница | Обязательные артефакты | Аналитические зависимости | Результат для системной спецификации |
|---|---|---|---|---|---|
| `Customer ordering` | Заказ на выдачу через Telegram | Customer ordering | `domain-model/ordering-and-pickup.md`, `use-cases/customer-create-pickup-order.md`, `contracts/customer-ordering.md`, `state-models/order-lifecycle.md` | `Menu and options`, `Slots and capacity` | Customer может создать заказ на слот текущего дня без догадок о статусах и валидации. |
| `Menu and options` | Каталог, размеры напитков, дополнительные опции | Menu catalog | `domain-model/menu-catalog.md`, `contracts/menu-and-availability-management.md`, `use-cases/administrator-manage-menu.md`, `use-cases/barista-manage-menu-availability.md` | — | Меню и дополнительные опции заданы на уровне системы, включая ограничения по ролям и доступности. |
| `Slots and capacity` | Слоты выдачи и вместимость | Pickup slot policy | `domain-model/ordering-and-pickup.md`, `contracts/slot-settings-management.md`, `use-cases/administrator-manage-slot-settings.md` | — | Правила слотов, рабочих часов и вместимости выражены как системные ограничения. |
| `Order operations` | Подтверждение, отклонение, готовность, закрытие | Backoffice order processing | `use-cases/barista-*.md`, `contracts/backoffice-order-processing.md`, `state-models/order-lifecycle.md` | `Customer ordering` | Barista может проводить заказ через допустимые переходы и система фиксирует требуемый audit. |
| `Access and roles` | Telegram-доступ, роли, блокировка | Identity and access | `domain-model/identity-and-access.md`, `contracts/user-role-and-blocking-management.md`, `use-cases/administrator-manage-users-and-roles.md`, `use-cases/administrator-block-user.md` | — | Права и ограничения доступа выражены явно для customer и backoffice. |
| `Customer and barista notifications` | Уведомления customer и напоминания barista | Notification delivery | `contracts/telegram-notifications.md`, `use-cases/barista-receive-order-reminder.md` | `Customer ordering`, `Order operations` | Известно, какие события инициируют уведомления и какие данные они обязаны содержать. |

## Открытые вопросы и несогласованности

### Открытые вопросы

- Периодичность Telegram-напоминаний barista о заказах, ожидающих действий, во входных материалах не зафиксирована.
- Бизнес-документы в `docs/business` не фиксируют количественные требования к производительности, доступности, retention, SLA и безопасности кроме обязательности Telegram-канала и test-mode исключения.

### Несогласованности входных материалов

- `docs/business/business-rules/access-and-roles.md` и сценарий `administrator-manage-users-and-roles.md` не фиксируют однозначно, может ли любой `administrator` назначать новых `administrator`, или это право принадлежит только главному administrator. До разрешения противоречия нельзя считать границу полномочий по назначению `administrator` окончательно установленной.


