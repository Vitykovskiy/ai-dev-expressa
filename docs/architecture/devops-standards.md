# DevOps Standards

## Базовый стандарт

- Секреты Telegram-ботов и production env values не хранятся в исходном коде.
- Test-only режимы должны иметь явную защиту от включения в production.
- Smoke-check должен проверять не только успешный запуск, но и критичные negative paths для доступа.

## Для FEATURE-001

Подробная runtime карта для `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и smoke-check находится в `docs/architecture/application-map/delivery-and-runtime.md`.

## PR gates для качества кода

- Каждый запрос на слияние в `main` должен запускать обязательные jobs для статических проверок, тестов и сборки затронутых контуров.
- Обязательные backend gates: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Обязательные frontend gates: `npm run lint`, `npm run stylelint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- CI workflow должен завершаться ошибкой при любом нарушении lint, formatting, stylelint, typecheck, tests или build. Warning-only режим для обязательного gate запрещён.
- PR считается готовым к ревью только если локальный исполнитель может воспроизвести те же команды в соответствующих каталогах `backend/` и `frontend/`.
- Если задача затрагивает только один контур, CI может оптимизировать запуск по paths, но обязательные gates для затронутого контура не должны пропадать.
- Изменение GitHub Actions, npm scripts, Husky или lint-staged считается изменением delivery/runtime карты и требует обновления `docs/architecture/application-map/delivery-and-runtime.md`.

## Локальные hooks

- Pre-commit hook должен запускать `lint-staged` на изменённых файлах и блокировать commit при ошибке formatting, lint или stylelint для файлов, к которым применимы эти проверки.
- Hook не заменяет полные `test`, `typecheck` и `build`; эти команды остаются обязательными перед передачей задачи на ревью.
- Конфигурация hooks должна быть версионирована в репозитории. Установка hooks должна быть описана через npm scripts или стандартный lifecycle, а не через ручные локальные инструкции.
- Отключение hook допустимо только как аварийное действие исполнителя и не является evidence для ревью.
