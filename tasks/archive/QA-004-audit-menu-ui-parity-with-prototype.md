# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-004`
- Родительская задача: `FEATURE-007`
- Заголовок: `Провести аудит UI parity вкладки Меню относительно прототипа`
- Описание: `Нужно провести полный gap analysis текущей реализации вкладки Меню против прототипа интерфейса. QA должен сравнить живой текущий frontend, живой прототип из .references/Expressa_admin и код референса как вспомогательный источник, затем подготовить полный отчет для frontend по всем расхождениям в составе экрана, расположении элементов, поведении, внешнем виде, состояниях и responsive-поведении.`
- Единица поставки: `FEATURE-007`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `frontend/src/views/MenuCatalogView.vue`, `.references/Expressa_admin/README.md`, `.references/Expressa_admin/package.json`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Примечания

- Зависимости: `FEATURE-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `frontend/src/views/MenuCatalogView.vue`, `.references/Expressa_admin/README.md`, `.references/Expressa_admin/package.json`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- Ожидаемый результат для ревью: `Подготовлен полный QA-отчет для frontend по вкладке Меню с воспроизводимым перечнем всех отличий от прототипа по экранным элементам, позиционированию, spacing, визуальным стилям, текстам, состояниям, поведению и desktop/mobile responsive.`
- Проверки: `Сравнение текущей реализации и прототипа на desktop/mobile; проверка пустого состояния, списка категорий, списка товаров, раскрытия категорий, диалогов, disabled/tooltip-состояний, текстов, spacing, цветов и поведения; фиксация результатов в отдельном отчете, пригодном как входной артефакт для FE bugfix задачи.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются acceptance path, QA маршрут сравнения с прототипом, required evidence или структура итогового QA-отчета для Menu UI parity.`
- Критерии готовности: `QA-задача завершена, когда существует полный и воспроизводимый отчет по всем расхождениям вкладки Меню с прототипом, а frontend может использовать его как исчерпывающий входной артефакт для bugfix без дополнительных уточнений.`

## Результат выполнения

### Метод аудита

- Сопоставлены task/source-of-truth артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`.
- Сравнены текущая Vue-реализация `frontend/src/views/MenuCatalogView.vue` и дочерние SFC с React-референсом `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `AddCategoryDialog.tsx`, `EditCategoryDialog.tsx`, `AddProductDialog.tsx`, `EditProductDialog.tsx`, `MenuGuide.tsx`.
- Аудит выполнен как UI parity/gap analysis. Поведенческие контракты `FEATURE-002` не переопределялись и не проверялись заново вне визуально-поведенческого слоя экрана `Меню`.

### Подтвержденные расхождения

1. `High` Поведение category dialog при активном флаге `Группа опций` все еще не совпадает с прототипом: в текущем приложении в этой же модалке раскрывается полноценный встроенный editor `Настройка группы опций` с выбором `Тип выбора`, кнопкой `Добавить опцию`, списком карточек опций, полями `Название опции` / `Доплата` и чекбоксом `Доступна`. В референсе после активации toggle внутри category dialog не появляется embedded-конструктор опций: сценарий ограничен переключателем и select `Выбрать группу опций`.
   Текущее: `frontend/src/components/menu-catalog/MenuCategoryDialog.vue:36-129`.
   Референс add: `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx:90-127`.
   Референс edit: `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx:116-153`.
   Repro: открыть `Добавить группу`, включить `Группа опций` и сравнить содержимое модалки с прототипом.

2. `High` Семантика controls в category dialogs остается инвертированной относительно прототипа. В референсе toggle `Группа опций` означает, что текущая категория сама является option group, поэтому select `Выбрать группу опций` блокируется при включенном toggle и никакой дополнительный assigned-flow не активируется. В текущей Vue-реализации toggle одновременно переключает режим category dialog в embedded editor option-group и управляет очисткой `selectedOptionGroupId`; payload пишет `optionGroupRefs` только когда toggle выключен. Это делает interaction model и смысл переключателя отличными от prototype-flow.
   Текущее: `frontend/src/components/menu-catalog/MenuCategoryDialog.vue:36-54`, `:191-317`.
   Референс add: `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx:90-127`.
   Референс edit: `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx:116-153`.
   Repro: открыть `Добавить группу`, включить/выключить `Группа опций` и сравнить доступность select + смысл toggle с поведением референса.

3. `Medium` Desktop action-row все еще не совпадает с прототипом по размеру кнопок: в текущей реализации обе CTA растягиваются на доступную ширину через `flex: 1`, а wrapper второй кнопки тоже занимает всю строку. В референсе на desktop обе кнопки имеют content-width (`md:flex-initial` / `md:w-auto`) и не заполняют весь горизонтальный слот.
   Текущее: `frontend/src/views/MenuCatalogView.vue:14-39`, `:415-448`.
   Референс: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx:131-156`, `.references/Expressa_admin/src/app/components/Button.tsx:14-25`.
   Repro: открыть `/menu` на desktop и сравнить ширину `Добавить группу` / `Добавить товар` с prototype screenshot или reference-screen.

4. `Medium` Глобальное сообщение об ошибке реализовано как широкий inline-banner под action-row и визуально занимает значительную часть экрана, тогда как референсный flow использует компактные toast-уведомления и не вставляет persistent error block между header/actions и основным контентом. Из-за этого error-state визуально доминирует над экраном `Меню` и ломает parity по композиции.
   Текущее: `frontend/src/views/MenuCatalogView.vue:41-49`, `:454-460`, `frontend/src/modules/menu-catalog/validation.ts:100-114`.
   Референс: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx:11`, `:51-53`, `:65-68`, `:89-90`, `:101-102`, `.references/Expressa_admin/src/app/components/ui/sonner.tsx`.
   Repro: воспроизвести backend/store error на `/menu` и сравнить presentation ошибки с прототипом.

5. `Medium` Add-product dialog еще не доведен до структуры прототипа: сейчас форма начинается с поля `Название товара`, а selector категории идет вторым, тогда как в reference add-dialog первым полем идет `Категория`, затем `Название товара`. Для edit-dialog это расхождение уже устранено, но create-flow все еще визуально отличается.
   Текущее: `frontend/src/components/menu-catalog/MenuItemDialog.vue:19-43`.
   Референс add: `.references/Expressa_admin/src/app/components/AddProductDialog.tsx:109-147`.
   Repro: открыть `Добавить товар` и сравнить порядок первых двух полей с прототипом.

### Итог для FE-004

- Повторная проверка показала, что часть замечаний из первого QA-отчета уже закрыта, но parity все еще не достигнут по поведению category dialog в режиме `Группа опций`, desktop action-row, error-state presentation и create-product dialog.
- `QA-004` остается открытой по 5 актуальным расхождениям.
- Для закрытия `FE-004` frontend должен привести category dialog к prototype-flow без встроенного конструктора опций внутри этой модалки, синхронизировать смысл toggle/select с прототипом, вернуть desktop-кнопкам content-width presentation, заменить широкий inline error-banner на уведомление, совпадающее с reference-flow, и довести add-product dialog до того же порядка полей, что и в прототипе.
- `docs/architecture/application-map/qa-menu-catalog.md` не обновлялся: acceptance path и QA-маршрут не изменились, изменился только результат аудита по конкретной feature.
