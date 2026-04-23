# Contract: Backoffice Auth And Capability Access

## Граница

Один набор tightly coupled контрактов: вход во внутренний backoffice-контур через служебный Telegram entrypoint, восстановление `AuthenticatedActor` и проверка прямого доступа к capability-boundary.

## Источники

- `docs/system/domain-model/identity-and-access.md`
- `docs/system/system-context/expressa-v1-telegram-ordering.md`
- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`
- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`

## Contract `Create backoffice session`

### Consumer

- `frontend backoffice`

### Operation boundary

- `POST /backoffice/auth/session`

### Inputs

#### Request body in Telegram mode

| Поле       | Обязательность                   | Описание                                                             |
| ---------- | -------------------------------- | -------------------------------------------------------------------- |
| `initData` | Да, когда Telegram auth включена | Telegram Web App `initData`, полученный из служебного Telegram-бота. |

#### Request body in test-mode

| Поле             | Обязательность | Описание                            |
| ---------------- | -------------- | ----------------------------------- |
| `testTelegramId` | Нет            | Явный тестовый Telegram identifier. |

### Validations and constraints

- Production и test с включённой Telegram auth принимают только `initData`; прямой вход без него запрещён.
- Test-mode допустим только при серверно разрешённом `NODE_ENV=test` и `DISABLE_TG_AUTH=true`.
- Если `testTelegramId` не передан в разрешённом test-mode, используется `ADMIN_TELEGRAM_ID`.
- Frontend не включает test-mode самостоятельно и не может считать `VITE_BACKOFFICE_TEST_TELEGRAM_ID` самостоятельным способом обхода Telegram.
- Источник истины по ролям и capabilities находится на backend; клиент не вычисляет их локально и не присылает роль в запросе.
- Пользователь должен существовать в системе, не быть `blocked` и иметь хотя бы одну backoffice capability.

### Outputs

#### Success response body

| Поле           | Тип семантики              | Описание                                                                               |
| -------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| `userId`       | Идентификатор пользователя | Внутренний идентификатор пользователя.                                                 |
| `telegramId`   | Внешний идентификатор      | Telegram identifier аутентифицированного пользователя.                                 |
| `roles`        | Набор ролей                | Подтверждённые backend роли пользователя.                                              |
| `capabilities` | Набор capabilities         | Разрешённые вкладки backoffice: `orders`, `availability`, `menu`, `users`, `settings`. |

### Capability mapping

| Роль            | Разрешённые capabilities                              |
| --------------- | ----------------------------------------------------- |
| `barista`       | `orders`, `availability`                              |
| `administrator` | `orders`, `availability`, `menu`, `users`, `settings` |
| `customer`      | отсутствуют                                           |

### Business errors

| Условие                                             | Ошибка                        | HTTP outcome       |
| --------------------------------------------------- | ----------------------------- | ------------------ |
| Telegram auth включена, но `initData` не передан    | `telegram-init-data-required` | `401 Unauthorized` |
| Telegram auth включена, но server secret недоступен | `telegram-bot-token-required` | `401 Unauthorized` |
| `initData` не проходит проверку подписи             | `telegram-hash-invalid`       | `401 Unauthorized` |
| Telegram user не найден в системе                   | `backoffice-user-not-found`   | `403 Forbidden`    |
| Пользователь заблокирован                           | `user-blocked`                | `403 Forbidden`    |
| У пользователя нет ни одной backoffice capability   | `backoffice-role-required`    | `403 Forbidden`    |

### Side effects

- Создаёт только session context ответа; отдельная server-side session persistence для FEATURE-001 не зафиксирована.
- Возвращает frontend полный минимальный набор фактов для role-aware navigation и route guard без чтения backend-кода.

## Contract `Check backoffice capability access`

### Consumer

- `frontend backoffice`

### Operation boundary

- `GET /backoffice/:capability`

### Inputs

#### Path parameter

| Параметр     | Описание                                                                              |
| ------------ | ------------------------------------------------------------------------------------- |
| `capability` | Одна из допустимых capability: `orders`, `availability`, `menu`, `users`, `settings`. |

#### Headers in Telegram mode

| Header                 | Обязательность                   | Описание                                                    |
| ---------------------- | -------------------------------- | ----------------------------------------------------------- |
| `x-telegram-init-data` | Да, когда Telegram auth включена | То же `initData`, что использовалось для session bootstrap. |

#### Headers in test-mode

| Header               | Обязательность | Описание                                                                         |
| -------------------- | -------------- | -------------------------------------------------------------------------------- |
| `x-test-telegram-id` | Нет            | Явный test Telegram identifier; при отсутствии используется `ADMIN_TELEGRAM_ID`. |

### Validations and constraints

- Capability guard сначала валидирует саму capability boundary, затем повторно аутентифицирует пользователя тем же правилом, что и `Create backoffice session`.
- Прямой доступ к capability без валидного Telegram entry в production не поддерживается.
- Capability guard не доверяет никакой присланной клиентом роли; решение принимается только по backend user record.

### Outputs

- При успехе возвращается тот же `AuthenticatedActor`, что и в `Create backoffice session`.

### Business errors

| Условие                                                              | Ошибка                                   | HTTP outcome    |
| -------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `capability` отсутствует в каноническом списке                       | `backoffice-capability-not-found`        | `404 Not Found` |
| Пользователь аутентифицирован, но capability не разрешена его ролями | `backoffice-capability-forbidden`        | `403 Forbidden` |
| Ошибки аутентификации и blocked/no-role условия                      | те же, что в `Create backoffice session` | `401` или `403` |

### Side effects

- Успешная проверка прикрепляет к запросу подтверждённого `AuthenticatedActor` для дальнейшей server-side обработки.

## Handoff rules for FE and QA

- FE-исполнитель должен опираться на `capabilities` из session response для видимости вкладок и локального route guard.
- FE-исполнитель не должен читать `backend/src/identity-access/*`, чтобы определить состав `AuthenticatedActor`, список capabilities, заголовки, test-mode fallback или error mapping.
- QA-исполнитель должен проверять `401` и `403` как разные классы отказа: отсутствие валидного Telegram entry против запрета по системному доступу.

## Открытые вопросы и ограничения

- Контракт фиксирует только FEATURE-001 boundary входа и доступа; операции управления меню, пользователями, слотами и заказами остаются в своих отдельных contracts.
- Способ долговременного хранения сессии или токена в FEATURE-001 не зафиксирован: канонически подтверждён только request/response boundary для восстановления `AuthenticatedActor`.
