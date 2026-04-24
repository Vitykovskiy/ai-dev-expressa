# Карта документации `docs/system`

Этот файл нужен только для навигации по системным артефактам. Источником правды являются документы в соответствующих семействах.

## Как искать документ

- Если нужно начать работу по конкретной новой `FEATURE-*`: сначала читать package `feature-specs/<feature-id>-<slug>/index.md`, затем только role-relevant package slices и supporting sources, назначенные в role read routes.
- Если `FEATURE-*` еще хранится в legacy flat format: читать ее flat feature spec и sibling `.test-scenarios.md`, затем точечно переходить в связанные supporting sources.
- Если нужно понять границы системы, внешние роли, Telegram-точки входа, системные срезы для анализа и зафиксированные несогласованности: `system-context`.
- Если нужно понять верхнеуровневые задачи поставки и их зависимости: переходите в `tasks/`, а не в `system-context`.
- Если нужно понять сущности, связи и инварианты предметной области: `domain-model`.
- Если нужно понять поведение системы от триггера до исхода: `use-cases`.
- Если нужно понять входы, выходы, проверки, ошибки и side effects конкретного взаимодействия: `contracts`.
- Если нужно понять жизненный цикл заказа и допустимые переходы: `state-models`.
- Если нужно понять, как экран, действие, UI-state или role-guard связаны с системным поведением: `ui-behavior-mapping`.
- Если нужен входной UI-указатель на канонический визуальный источник и системные ограничения: `ui-contracts`.

Для новых `FEATURE-*` основным входом архитектора является decomposed feature package. `ui-contracts` остаются указателем на визуальный канон и прототипы, `ui-behavior-mapping` остается связкой экранов с системным поведением, а feature-level handoff задается через package slices.

## Семейства артефактов

### `feature-specs`

- Один folder package = одна `FEATURE-*`.
- Новый путь: `feature-specs/<feature-id>-<slug>/`.
- Required slices: `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`, `test-scenarios.md`.
- Использовать `index.md` как первый маршрут чтения для архитектурной декомпозиции конкретной фичи.
- Package раскладывает feature-level context по срезам, чтобы агент читал только релевантную часть: boundary/navigation, behavior, interfaces, UI behavior и QA scenarios.
- Canonical источниками анализа остаются `use-cases`, `contracts`, `domain-model`, `state-models` и `ui-behavior-mapping`; package фиксирует feature-specific выводы и точечные ссылки.
- Для UI-фич `ui-behavior.md` подготавливается после анализа текущего интерфейса, UI-контракта или прототипа, `ui-behavior-mapping` и всех системно значимых UI-состояний.
- Для non-UI фич `ui-behavior.md` остается коротким slice со статусом `n/a`.
- Архитектор начинает с package `index.md`, затем читает назначенные role read routes. При gap в сценариях, inputs, validations, errors, interfaces, UI states, role read routes или design readiness фича возвращается системному аналитику.
- Legacy flat files `feature-specs/<feature-id>-<slug>.md` и `feature-specs/<feature-id>-<slug>.test-scenarios.md` допустимы для существующих фич до ближайшего системно-аналитического обновления.

- `FEATURE-001 Administrator Telegram Backoffice Access`
  - Файл: [feature-specs/feature-001-administrator-telegram-backoffice-access.md](./feature-specs/feature-001-administrator-telegram-backoffice-access.md)
  - Сценарии тестирования: [feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md](./feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md)
  - Использовать для архитектурной декомпозиции backoffice entry, Telegram bootstrap, role-aware navigation и direct-route guard `FEATURE-001`, а также для handoff QA-сценариев по session bootstrap и capability access.

- `FEATURE-003 Administrator Slot Settings Management`
  - Файл: [feature-specs/feature-003-administrator-slot-settings-management.md](./feature-specs/feature-003-administrator-slot-settings-management.md)
  - Сценарии тестирования: [feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md](./feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md)
  - Использовать для архитектурной декомпозиции административного сценария изменения рабочих часов и вместимости слотов, а также для handoff QA-сценариев по применению настроек к дальнейшей генерации customer-слотов.

- `FEATURE-004 Administrator User Role Management`
  - Файл: [feature-specs/feature-004-administrator-user-role-management.md](./feature-specs/feature-004-administrator-user-role-management.md)
  - Сценарии тестирования: [feature-specs/feature-004-administrator-user-role-management.test-scenarios.md](./feature-specs/feature-004-administrator-user-role-management.test-scenarios.md)
  - Legacy flat package. Использовать как основной handoff архитектору по административному сценарию просмотра пользователей и назначения ролей `barista` и `administrator`; flat feature spec и sibling test scenarios уже фиксируют consumer-facing transport/API boundary `GET /backoffice/users` и `PATCH /backoffice/users/{userId}/role`.
  - При декомпозиции использовать вместе с `contracts/user-role-and-blocking-management.md`: правило назначения роли `administrator` зафиксировано через guard `BootstrapAdministrator`, открытый blocker по этой фиче снят.

### `system-context`

- `Expressa v1 Telegram Ordering`
  - Файл: [system-context/expressa-v1-telegram-ordering.md](./system-context/expressa-v1-telegram-ordering.md)
  - Использовать, если нужно быстро зафиксировать границы продукта, внешних акторов, системную ответственность, системные срезы для анализа, ограничения и открытые вопросы верхнего уровня.

### `domain-model`

- `Identity And Access`
  - Файл: [domain-model/identity-and-access.md](./domain-model/identity-and-access.md)
  - Использовать для ролей, Telegram-идентификации, блокировки доступа и ограничений по вкладкам backoffice.

- `Menu Catalog`
  - Файл: [domain-model/menu-catalog.md](./domain-model/menu-catalog.md)
  - Использовать для структуры меню, товаров, размеров напитков, групп дополнительных опций и временной доступности.

- `Ordering And Pickup`
  - Файл: [domain-model/ordering-and-pickup.md](./domain-model/ordering-and-pickup.md)
  - Использовать для корзины, заказа, слотов выдачи, вместимости и audit-атрибутов по заказу.

### `state-models`

- `Order Lifecycle`
  - Файл: [state-models/order-lifecycle.md](./state-models/order-lifecycle.md)
  - Использовать для допустимых состояний заказа, переходов, guard-условий и терминальных состояний.

### `use-cases`

- `Customer Create Pickup Order`
  - Файл: [use-cases/customer-create-pickup-order.md](./use-cases/customer-create-pickup-order.md)
  - Использовать для customer-флоу от открытия customer-приложения до создания заказа.

- `Customer View Order History`
  - Файл: [use-cases/customer-view-order-history.md](./use-cases/customer-view-order-history.md)
  - Использовать для просмотра customer собственной истории заказов.

- `Barista Confirm Order`
  - Файл: [use-cases/barista-confirm-order.md](./use-cases/barista-confirm-order.md)
  - Использовать для перевода заказа из `Создан` в `Подтвержден`.

- `Barista Reject Order`
  - Файл: [use-cases/barista-reject-order.md](./use-cases/barista-reject-order.md)
  - Использовать для отклонения заказа с обязательной причиной.

- `Barista Mark Order Ready`
  - Файл: [use-cases/barista-mark-order-ready.md](./use-cases/barista-mark-order-ready.md)
  - Использовать для перевода заказа в `Готов к выдаче`.

- `Barista Close Order`
  - Файл: [use-cases/barista-close-order.md](./use-cases/barista-close-order.md)
  - Использовать для закрытия заказа после офлайн-выдачи.

- `Barista Manage Menu Availability`
  - Файл: [use-cases/barista-manage-menu-availability.md](./use-cases/barista-manage-menu-availability.md)
  - Использовать для временного включения и выключения товаров и дополнительных опций.

- `Barista Receive Order Reminder`
  - Файл: [use-cases/barista-receive-order-reminder.md](./use-cases/barista-receive-order-reminder.md)
  - Использовать для напоминаний barista о заказах, ожидающих действий.

- `Administrator Manage Menu`
  - Файл: [use-cases/administrator-manage-menu.md](./use-cases/administrator-manage-menu.md)
  - Использовать для изменения категорий, товаров, цен и групп дополнительных опций.

- `Administrator Manage Slot Settings`
  - Файл: [use-cases/administrator-manage-slot-settings.md](./use-cases/administrator-manage-slot-settings.md)
  - Использовать для рабочих часов и вместимости слотов.

- `Administrator Manage Users And Roles`
  - Файл: [use-cases/administrator-manage-users-and-roles.md](./use-cases/administrator-manage-users-and-roles.md)
  - Использовать для назначения ролей `barista` и `administrator`.

- `Administrator Block User`
  - Файл: [use-cases/administrator-block-user.md](./use-cases/administrator-block-user.md)
  - Использовать для блокировки пользователя.

### `contracts`

- `Customer Ordering`
  - Файл: [contracts/customer-ordering.md](./contracts/customer-ordering.md)
  - Использовать для чтения меню, корзины, выбора слота, создания заказа и истории заказов.

- `Backoffice Order Processing`
  - Файл: [contracts/backoffice-order-processing.md](./contracts/backoffice-order-processing.md)
  - Использовать для операций barista по обработке заказа.

- `Backoffice Auth And Capability Access`
  - Файл: [contracts/backoffice-auth-and-capability-access.md](./contracts/backoffice-auth-and-capability-access.md)
  - Использовать для `POST /backoffice/auth/session`, `GET /backoffice/:capability`, состава `AuthenticatedActor`, error mapping входа и связи между session bootstrap и route/capability guard.

- `Menu And Availability Management`
  - Файл: [contracts/menu-and-availability-management.md](./contracts/menu-and-availability-management.md)
  - Использовать для изменения каталога administrator и оперативной доступности barista.

- `Slot Settings Management`
  - Файл: [contracts/slot-settings-management.md](./contracts/slot-settings-management.md)
  - Использовать для управления рабочими часами, вместимостью и генерации слотов.

- `User Role And Blocking Management`
  - Файл: [contracts/user-role-and-blocking-management.md](./contracts/user-role-and-blocking-management.md)
  - Использовать для bootstrap главного administrator, назначения ролей и блокировки пользователей.

- `Telegram Notifications`
  - Файл: [contracts/telegram-notifications.md](./contracts/telegram-notifications.md)
  - Использовать для customer-уведомлений и barista-напоминаний.

### `ui-contracts`

- `Expressa Customer UI Contract`
  - Файл: [ui-contracts/expressa-customer-ui-contract.md](./ui-contracts/expressa-customer-ui-contract.md)
  - Использовать как входной UI-указатель клиентского веб-интерфейса перед формализацией системного поведения.
  - Визуальный канон не хранится в `docs/system`: единственный источник истины для макета, экранной композиции и визуальных состояний находится в versioned `Git`-tracked `.references/Expressa_customer`.

- `Expressa Backoffice UI Contract`
  - Файл: [ui-contracts/expressa-backoffice-ui-contract.md](./ui-contracts/expressa-backoffice-ui-contract.md)
  - Использовать как входной UI-указатель внутреннего административного контура: он фиксирует канонический референс в versioned `Git`-tracked `.references/Expressa_admin`, строгие ограничения parity и допустимые исключения только из системных артефактов.
  - Визуальный канон не хранится в `docs/system`: единственный источник истины для макета, экранной композиции и визуальных состояний находится в versioned `Git`-tracked `.references/Expressa_admin`.

### `ui-behavior-mapping`

- `Customer Ordering`
  - Файл: [ui-behavior-mapping/customer-ordering-ui-binding.md](./ui-behavior-mapping/customer-ordering-ui-binding.md)
  - Использовать для привязки customer UI-контракта к вариантам использования, contracts, validations, state-model и экранным состояниям.

- `Backoffice Operations`
  - Файл: [ui-behavior-mapping/backoffice-ui-binding.md](./ui-behavior-mapping/backoffice-ui-binding.md)
  - Использовать для привязки backoffice UI-действий и состояний к ролевому доступу, операциям заказа, управлению меню, пользователями и настройками без повторного проектирования экранной композиции.

## Быстрый маршрут для следующей роли

- Если задача привязана к конкретной новой `FEATURE-*`: читать `README.md`, затем `docs/system/feature-specs/<feature-id>-<slug>/index.md`, затем только package slices и supporting sources из role read routes.
- Если задача привязана к legacy flat `FEATURE-*`: читать `README.md`, затем `docs/system/feature-specs/<feature-id>-<slug>.md`, sibling `.test-scenarios.md`, затем только связанные supporting sources и архитектурные карты.
- Если задача про создание заказа customer: читать `system-context/expressa-v1-telegram-ordering.md`, `domain-model/ordering-and-pickup.md`, `use-cases/customer-create-pickup-order.md`, `contracts/customer-ordering.md`, `state-models/order-lifecycle.md`.
- Если задача про каталог и допы: читать `domain-model/menu-catalog.md`, `use-cases/administrator-manage-menu.md`, `use-cases/barista-manage-menu-availability.md`, `contracts/menu-and-availability-management.md`.
- Если задача про обработку заказа barista: читать `domain-model/ordering-and-pickup.md`, `state-models/order-lifecycle.md`, `use-cases/barista-confirm-order.md`, `use-cases/barista-reject-order.md`, `use-cases/barista-mark-order-ready.md`, `use-cases/barista-close-order.md`, `contracts/backoffice-order-processing.md`, `contracts/telegram-notifications.md`.
- Если задача про роли, Telegram-доступ и блокировку: для `FEATURE-004` сначала читать ее legacy flat feature spec и sibling test scenarios, затем `domain-model/identity-and-access.md`, `use-cases/administrator-manage-users-and-roles.md`, `use-cases/administrator-block-user.md`, `contracts/user-role-and-blocking-management.md`.
- Если задача про вход во внутренний backoffice, session bootstrap, capability guard или test-mode ограничения: читать `domain-model/identity-and-access.md`, `contracts/backoffice-auth-and-capability-access.md`, `ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`.
- Если задача про слоты и вместимость: читать `domain-model/ordering-and-pickup.md`, `use-cases/administrator-manage-slot-settings.md`, `contracts/slot-settings-management.md`.
- Если задача приходит из UI-контракта или экранного флоу на этапе подготовки `FEATURE-*`: читать соответствующий файл в `ui-contracts/`, затем нужные versioned-файлы в `.references`, затем соответствующий файл в `ui-behavior-mapping/` вместе с целевыми `use-cases`, `contracts` и `state-models`; перед передачей архитектору создать feature package.
- Если задача про UI внутреннего административного контура: читать `README.md`, затем package `index.md` целевой `FEATURE-*` при его наличии; для подготовки feature package читать `ui-contracts/expressa-backoffice-ui-contract.md`, нужные versioned-файлы в `.references/Expressa_admin`, `ui-behavior-mapping/backoffice-ui-binding.md` и затем целевые `use-cases`, `contracts`, `domain-model` и `state-models`.
- Если задача про UI клиентского веб-интерфейса: читать `README.md`, затем package `index.md` целевой `FEATURE-*` при его наличии; для подготовки feature package читать `ui-contracts/expressa-customer-ui-contract.md`, нужные versioned-файлы в `.references/Expressa_customer`, `ui-behavior-mapping/customer-ordering-ui-binding.md` и затем целевые `use-cases`, `contracts`, `domain-model` и `state-models`.
- Если в ходе системного анализа выявлены design gaps или required prototype updates, системный аналитик должен ссылаться на конкретные versioned-файлы в `.references/`, зафиксировать требования к изменениям и выполнить повторную верификацию по обновленному Git-tracked состоянию этих файлов.

## Зафиксированные blockers и вопросы

- Не определена периодичность Telegram-напоминаний barista.
- Не зафиксировано системное поведение при конкурентной попытке занять последний слот выдачи.
- Не определён требуемый уровень snapshot-данных каталога внутри заказа после последующего изменения меню.
- UI-контракты содержат дополнительные расхождения: англоязычные статусы против русскоязычной каноники, действие `unblock_user`, диапазон `slot_capacity 1..50`, real-time индикатор новых заказов и атрибуты товара, не подтверждённые текущими бизнес-правилами.
