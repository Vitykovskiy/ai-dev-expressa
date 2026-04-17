# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-005`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator блокирует пользователя и прекращает доступ к продукту`
- Описание: `Фича должна дать administrator возможность из вкладки users блокировать пользователя так, чтобы он терял доступ к продукту и больше не мог пользоваться клиентским или внутренним административным контуром. Результат должен поставляться отдельно от назначения ролей, потому что блокировка является самостоятельным управленческим действием с отдельным проверяемым эффектом.`
- Единица поставки: `FEATURE-005`
- Роль: `Разработка`
- Изменяемый контур: `delivery-unit`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Administrator из вкладки users блокирует пользователя, система сохраняет признак blocked и прекращает доступ этого пользователя к продукту в соответствии с системными правилами доступа.`
- Проверки: `Модульные тесты перехода пользователя в blocked-состояние и запрета доступа; e2e-сценарий блокировки пользователя из вкладки users; дымовая проверка недоступности клиентского и внутреннего административного контура для заблокированного пользователя; приемочный сценарий по AR-004 и BO-006.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, README.md при необходимости`
- Критерии готовности: `Фича считается завершённой, когда administrator end-to-end блокирует пользователя, а прекращение доступа к продукту подтверждается тестами и приемочным сценарием как самостоятельный результат поставки.`
