# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Инициализация apps/backoffice-web для внутреннего административного контура`
- Описание: `Нужно создать в apps/backoffice-web каркас клиентской части FEATURE-001 на согласованном стеке Vue 3, Vite, Vuetify, Vue Router и Vitest. В объём входят настройка workspace-пакета, базовые scripts, точка входа, корневой layout, минимальные заглушки экранов и базовая конфигурация окружения для внутреннего административного контура. В объём не входят HTTP-интеграция bootstrap доступа, хранение пользовательского контекста, ролевые guard-правила и экран отказа в доступе: они выносятся в следующие фронтенд-задачи.`
- Единица поставки: `FEATURE-001`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `AR-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `В репозитории появился каталог apps/backoffice-web с запускаемым каркасом клиентской части внутреннего административного контура, согласованным со стеком проекта, базовой маршрутизацией-заглушкой, корневым layout и минимальными экранами для дальнейшей реализации FEATURE-001.`
- Проверки: `Локальный запуск apps/backoffice-web; сборка клиентской части; минимальная дымовая проверка отображения корневого layout и заглушек экранов.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда в репозитории существует и запускается apps/backoffice-web с устойчивым каркасом клиентской части, достаточным для последующей реализации HTTP-интеграции, хранения контекста доступа и guard-правил в отдельных задачах.`
