# FE-002 Context 02 Menu UI Components And View Orchestration

## Context Card

- Source task: `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- Subtask: `FE-002-02 Menu UI Components And View Orchestration`
- Executor role: `Фронтенд`
- Responsibility area: `/menu` route view and feature-specific menu catalog Vue components.
- Related plan: `FE-002-execution-plan.md`

## Goal

Reviewer must see that the administrator can use the `Меню` tab to view categories and option groups, create and edit categories, create and edit items, create option groups through the category flag, create options as items inside option groups, and assign option groups to ordinary categories.

## Behavioral Prompt

```text
You operate as a strict frontend engineer.

Complete only the FE-002-02 Menu UI Components And View Orchestration subtask within FE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Mandatory Read Set

- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `FE-002-execution-plan.md`
- `FE-002-context-01-api-store.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- `frontend/src/views/MenuCatalogView.vue`
- `frontend/src/components/menu-catalog/MenuCatalogCategoryList.vue`
- `frontend/src/components/menu-catalog/MenuCategoryDialog.vue`
- `frontend/src/components/menu-catalog/MenuItemDialog.vue`

## Key Facts

- `/menu` is the existing administrator-only surface for FE-002.
- The canonical flow has `Добавить группу`, `Добавить товар`, category edit, product edit and modal dialogs.
- Option groups are created through the `Группа опций` flag; a separate option-group route or button is outside scope.
- Options are added as items inside a category that represents an option group.
- A category assigns an option group through `Выбрать группу опций`.
- The implementation uses Vue 3 and Vuetify, not React.

## Allowed Edit Area

- `frontend/src/views/MenuCatalogView.vue`
- `frontend/src/components/menu-catalog/*.vue`
- `frontend/src/ui/*` only when an existing primitive blocks this subtask.

## Forbidden Edit Area

- `.references/Expressa_admin/**`
- `backend/**`
- `docs/system/**`
- `frontend/src/modules/auth/**`
- `frontend/src/router/**` unless a direct blocker is found and documented before changes.

## Inputs And Dependencies

- Depends on FE-002-01 API/store operations.
- FE-002-03 depends on this subtask exposing validation and error states in the UI where needed.

## Expected Result

The `/menu` screen and dialogs provide the FE-002 canonical menu-flow with loading, empty, disabled and save-busy states and without adding out-of-scope screens.

## Checks

- `npm run typecheck`
- Targeted component tests if changed or added.
- Manual parity note against `.references/Expressa_admin` in the final subtask report.

## Readiness Criteria

- `Добавить товар` is unavailable when no categories exist.
- Category dialogs support ordinary category, option-group flag and option-group assignment.
- Item dialogs support base price and full `S/M/L` drink price inputs.
- Option-group categories prevent drink-size editing for options.
- No separate route-level option group panel is introduced.

## Risks And Prohibitions

- Risk: losing parity with the React reference by inventing new layout patterns.
- Prohibition: do not implement barista availability controls in the structural catalog UI.

## Open Questions

- `selectionMode` is a documented product/architecture gap in the feature spec; do not invent a new UI control unless an approved artifact already defines it.
