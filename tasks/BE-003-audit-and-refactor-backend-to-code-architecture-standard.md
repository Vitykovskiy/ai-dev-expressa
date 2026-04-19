# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-003`
- Родительская задача: `FEATURE-006`
- Заголовок: `Провести аудит и рефакторинг backend по стандарту code architecture`
- Описание: `Нужно проверить backend контуры access и menu catalog на соответствие NestJS boundaries и при необходимости разнести controller/service/domain/repository responsibilities без изменения API contracts, auth semantics, guard behavior, DTO shape и error mapping. Рефакторинг должен быть поведенчески нейтральным.`
- Единица поставки: `FEATURE-006`
- Роль: `Бэкенд`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `backend/src/identity-access/`, `backend/src/menu-catalog/`

## Примечания

- Зависимости: `AR-004`; `DO-002` для финальной проверки quality gates
- Минимальный read set: `docs/architecture/stack.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`
- Ожидаемый результат для ревью: `Backend access и menu catalog контуры соответствуют границам controller для HTTP boundary, service для orchestration, domain validator/errors/types для правил и repository для хранения; файлы не превышают целевые пороги без явного обоснования; contracts и error mapping сохранены.`
- Проверки: `backend lint, format:check, typecheck, test, build; integration проверки auth/capability behavior и menu catalog endpoints; negative checks для guard denial и backend validation errors без изменения response contract.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/backend-access.md и docs/architecture/application-map/backend-menu-catalog.md, если меняются backend modules, repository boundaries, domain modules, test boundaries или runtime assumptions.`
- Критерии готовности: `Задача завершена, когда backend аудит выполнен, нужный поведенчески нейтральный рефакторинг внесен, quality gates проходят, а любые необходимые изменения contracts/behavior оформлены как blocker вместо локального изменения.`
