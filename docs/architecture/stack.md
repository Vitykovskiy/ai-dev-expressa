# Architecture Stack

## Базовые ограничения

- Server-side: `NestJS`.
- База данных: `PostgreSQL` как обязательное постоянное хранилище production-данных.
- Client-side: `Vue 3`.
- UI kit для клиентского backoffice: `Vuetify`.
- Merge-driven delivery path `main -> test VPS` использует versioned runtime images в `ghcr.io` и `Docker Compose` на VPS.
- Backoffice открывается как Telegram Web App через отдельного служебного Telegram-бота.
- React-референс `.references/Expressa_admin` является визуальным и поведенческим ориентиром, но не задаёт технологический стек реализации.
- Сервисы должны оставаться независимыми по границам ответственности; общая авторизация не должна смешиваться с управлением меню, слотами, ролями или блокировкой.

## Правило использования framework stack

- Исполнитель обязан сначала использовать встроенные возможности фреймворков и платформ, зафиксированных в этом документе и профильных архитектурных стандартах, если они покрывают требуемый сценарий без нарушения архитектурных ограничений.
- Внешняя библиотека допускается только если project stack не покрывает требуемую capability нативно либо если отдельное архитектурное решение явно фиксирует использование этой библиотеки.
- Выбор внешней библиотеки вместо нативного пути фреймворка требует явного архитектурного обоснования в project documentation до handoff в реализацию.

## Official documentation route

- `NestJS`: https://docs.nestjs.com
- `PostgreSQL`: https://www.postgresql.org/docs/
- `Vue 3`: https://vuejs.org/guide/
- `Vuetify`: https://vuetifyjs.com/en/getting-started/installation/
- `Docker Compose`: https://docs.docker.com/compose/
- `Playwright`: https://playwright.dev/docs/intro

## Правило чтения official docs

- Если задача меняет framework extension points, dependency injection wiring, persistence integration, migrations, validation pipeline, auth flow, routing, UI-kit composition, build tooling, testing infrastructure или deployment behavior, исполнитель обязан прочитать релевантные разделы official documentation до выбора реализации.
- Project-specific архитектурные документы задают, какие official docs обязательны для конкретного контура и какой нативный путь считается предпочтительным.

## Базовое решение по хранению данных

- Пользователи, роли, blocked state, каталог меню, настройки слотов и другие доменные данные должны храниться в `PostgreSQL`.
- Feature-level handoff для доменных данных должен использовать `PostgreSQL`.
- Архитектурная декомпозиция новых feature-level задач должна явно фиксировать изменения схемы хранения, migration path и runtime/config для подключения к `PostgreSQL`.
- Выбор ORM или SQL toolkit не фиксируется в этом документе и должен быть оформлен отдельной архитектурной задачей без пересмотра решения о `PostgreSQL`.

## Конфигурационные решения для FEATURE-001

- `ADMIN_TELEGRAM_ID` — обязательное production/test значение для идемпотентного создания главного `administrator`.
- `DISABLE_TG_AUTH=true` — допустимо только в test environment.
- В production прямой доступ к backoffice без валидного Telegram-входа запрещён.
- Фронтенд не принимает решение о роли сам по себе: доступные вкладки и прямые маршруты должны опираться на authenticated actor/roles, полученные из серверного контура.

## Ограничения реализации

- Нельзя добавлять управление меню, слотами, ролями или блокировкой в `FEATURE-001`; эта feature открывает только входной backoffice-контур и ролевую видимость вкладок.
- Нельзя считать скрытую вкладку достаточной защитой: прямой путь к административной вкладке должен получать отказ по role guard.
- Test-mode не должен становиться production fallback. Любая реализация `DISABLE_TG_AUTH=true` обязана быть ограничена окружением и проверками конфигурации.
- Production-ready feature, меняющая доменные данные, должна фиксировать `PostgreSQL` как итоговый runtime path и как основу feature-level handoff.

## Базовый стандарт качества кода

- Code style и code architecture style являются архитектурным ограничением, а не локальным предпочтением исполнителя.
- `FEATURE-006` не меняет пользовательские сценарии, API contracts, auth semantics, route behavior, DTO shape или backend error mapping. Любая необходимость изменить поведение фиксируется как blocker и возвращается в системный или архитектурный слой.
- Новые и рефакторимые участки должны проходить автоматические проверки: lint, format:check, typecheck, test и build для затронутого контура; для клиентской части дополнительно обязателен stylelint.
- Локальные hooks и CI должны запускать одни и те же категории проверок. Локальный успех не заменяет CI run result, а CI не отменяет обязанность держать локально воспроизводимые команды.
- Порог декомпозиции: production-файл больше 300 строк требует выделения самостоятельного компонента, композиционной функции, service/domain/repository файла или явного архитектурного обоснования в соответствующей контурной карте. Файл больше 500 строк не допускается для нового или рефакторимого кода без отдельной архитектурной задачи.
- Один файл должен иметь одну основную причину изменения. Смешение UI layout, API adapter, auth guard, domain validation, repository storage и test fixture в одном файле запрещено.
- Рефакторинг качества принимается только как поведенчески нейтральный набор изменений: сначала сохраняется contract и регрессионное подтверждение, затем улучшается структура.
