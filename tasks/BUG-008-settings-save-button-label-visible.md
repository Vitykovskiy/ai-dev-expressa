# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-008`
- Родительская задача: `FEATURE-003`
- Заголовок: `Кнопка сохранения настроек должна показывать название`
- Единица поставки: `FEATURE-003`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

`Исправить воспроизводимое frontend-расхождение вкладки Настройки: кнопка сохранения должна показывать читаемое название Сохранить на фоне primary-кнопки.`

## Детали дефекта

- Контур причины: `frontend`.
- Затронутые сценарии: `FTS-003-001`, `FTS-003-002`.
- Шаги воспроизведения:
  1. Открыть вкладку `Настройки`.
  2. Дождаться загрузки формы рабочих часов и вместимости слота.
  3. Проверить нижнюю кнопку сохранения.
- Фактический результат: кнопка сохранения отображается как синяя primary-область, но название `Сохранить` визуально сливается с background или отсутствует.
- Ожидаемый результат: кнопка сохранения показывает читаемое название `Сохранить` с контрастом, соответствующим `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx` и `ui-button`.

## Границы задачи

### Функциональные требования

- Система должна отображать название `Сохранить` на кнопке сохранения настроек в обычном состоянии.
- Система должна сохранять читаемость названия кнопки на desktop и mobile viewport.
- Система должна сохранять disabled и loading states кнопки без потери визуального контраста доступного названия.
- Система должна сохранять текущую отправку формы настроек и success/error states.

### Scope Constraints

- Задача охватывает только клиентскую реализацию кнопки сохранения на вкладке `Настройки`.
- Задача охватывает общий `ui-button` только в части, необходимой для восстановления читаемости текста.
- Задача охватывает визуальное соответствие primary-кнопки текущему UI-контракту.

### Safety Constraints

- Система должна сохранять route `/settings` и administrator-only guard.
- Система должна сохранять текущий контракт чтения и сохранения настроек слотов.
- Система должна сохранять validation и error mapping настроек слотов.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/views/SettingsView.vue`
- `frontend/src/components/slot-settings/SlotSettingsForm.vue`
- `frontend/src/ui/UiButton.vue`
- `frontend/src/ui/contracts.ts`, если источник дефекта находится в mapping вариантов кнопки
- `frontend/src/ui/index.scss`, если источник дефекта находится в tokens или глобальных стилях UI
- `frontend/src/components/slot-settings/*.spec.ts`, если потребуется добавить точечный тест
- `frontend/src/ui/*.spec.ts`, если потребуется покрыть `ui-button`

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration

## Маршрут чтения

- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- `frontend/src/ui/README.md`

## Справочные ссылки

- `frontend/src/components/slot-settings/SlotSettingsForm.vue` — текущая кнопка сохранения.
- `frontend/src/ui/UiButton.vue` — reusable button primitive.

## Результат готовности

`На вкладке Настройки кнопка сохранения показывает читаемое название Сохранить во всех штатных состояниях, а сценарий сохранения настроек остается неизменным.`

## Проверки

- Вручную открыть `/settings` и проверить читаемость названия `Сохранить` на кнопке сохранения.
- Вручную проверить desktop и mobile viewport.
- Проверить `FTS-003-001` для успешного сохранения настроек.
- Проверить, что disabled и loading states сохраняют понятное состояние кнопки.
- `npm run test:frontend`
- `npm run typecheck:frontend`

## Комментарии

- `2026-05-03`: User feedback: `UiButton` должен оставаться простым UI-primitive для стилизации. Логику Loader не нужно переносить внутрь `ui`; если нужна кнопка с Loader, это должен быть отдельный компонент.
- `2026-05-03`: Задача возвращена в работу по user feedback со скриншотом вкладки `Настройки`: primary-кнопка сохранения все еще отображается без читаемого названия после поля вместимости слота.

## Результат выполнения

`2026-05-03: исправлена читаемость названия Сохранить на primary-кнопке сохранения настроек. UiButton оставлен styling primitive: slot forwarding возвращен к прямому пробросу $slots, loading-логика и фильтрация attrs из UiButton удалены, отдельный UiButton.spec.ts удален. Автоматические проверки прошли: npm run lint:frontend, npm run stylelint:frontend, npm run test:frontend (15 files, 71 tests), npm run typecheck:frontend. Ручная проверка /settings на desktop/mobile не выполнялась.`
