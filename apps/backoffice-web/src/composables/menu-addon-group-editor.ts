import type {
  MenuCatalogCategory,
  MenuCatalogOptionGroup,
  OptionGroupSelectionMode,
} from '@expressa/shared-types';
import { reactive } from 'vue';
import type { MenuCatalogOptionGroupDraft } from '../types';

export interface MenuAddonGroupEditorOptionForm {
  formId: string;
  optionId: string | null;
  name: string;
  priceDelta: string;
}

export interface MenuAddonGroupEditorForm {
  categoryIds: string[];
  name: string;
  options: MenuAddonGroupEditorOptionForm[];
  selectionMode: OptionGroupSelectionMode;
}

export interface MenuAddonGroupEditorOptionErrors {
  name: string | null;
  priceDelta: string | null;
}

export interface MenuAddonGroupEditorErrors {
  categoryIds: string | null;
  name: string | null;
  options: MenuAddonGroupEditorOptionErrors[];
}

let nextOptionFormId = 0;

function createOptionFormId(): string {
  nextOptionFormId += 1;
  return `option-form-${nextOptionFormId}`;
}

function formatPriceDelta(priceDelta: number | null | undefined): string {
  return priceDelta === null || priceDelta === undefined ? '0' : String(priceDelta);
}

function createOptionForm(
  option: MenuCatalogOptionGroup['options'][number] | null = null,
): MenuAddonGroupEditorOptionForm {
  return {
    formId: createOptionFormId(),
    optionId: option?.optionId ?? null,
    name: option?.name ?? '',
    priceDelta: formatPriceDelta(option?.priceDelta),
  };
}

function parsePriceDelta(value: string): number | null {
  const normalizedValue = value.trim().replace(',', '.');

  if (!normalizedValue) {
    return null;
  }

  const priceDelta = Number(normalizedValue);

  return Number.isFinite(priceDelta) ? priceDelta : null;
}

function createEmptyOptionErrors(count: number): MenuAddonGroupEditorOptionErrors[] {
  return Array.from({ length: count }, () => ({
    name: null,
    priceDelta: null,
  }));
}

function resolveInitialCategoryIds(
  categories: MenuCatalogCategory[],
  optionGroupId: string | null,
  initialCategoryId: string | null,
): string[] {
  if (!optionGroupId) {
    return initialCategoryId ? [initialCategoryId] : [];
  }

  return categories
    .filter((category) => category.optionGroupRefs.includes(optionGroupId))
    .map((category) => category.menuCategoryId);
}

export function createMenuAddonGroupEditorForm(
  optionGroup: MenuCatalogOptionGroup | null,
  categories: MenuCatalogCategory[],
  initialCategoryId: string | null,
): MenuAddonGroupEditorForm {
  const optionForms =
    optionGroup && optionGroup.options.length > 0
      ? optionGroup.options.map((option) => createOptionForm(option))
      : [createOptionForm()];

  return {
    categoryIds: resolveInitialCategoryIds(
      categories,
      optionGroup?.optionGroupId ?? null,
      initialCategoryId,
    ),
    name: optionGroup?.name ?? '',
    options: optionForms,
    selectionMode: optionGroup?.selectionMode ?? 'single',
  };
}

export function validateMenuAddonGroupEditorForm(
  form: MenuAddonGroupEditorForm,
): MenuAddonGroupEditorErrors {
  return {
    categoryIds: form.categoryIds.length > 0 ? null : 'Выберите хотя бы одну категорию.',
    name: form.name.trim() ? null : 'Укажите название группы.',
    options: form.options.map((option, index) => {
      const priceDelta = parsePriceDelta(option.priceDelta);

      return {
        name: option.name.trim() ? null : `Укажите название варианта ${index + 1}.`,
        priceDelta:
          priceDelta !== null && priceDelta >= 0
            ? null
            : `Доплата варианта ${index + 1} должна быть числом от 0.`,
      };
    }),
  };
}

export function hasMenuAddonGroupEditorErrors(
  errors: MenuAddonGroupEditorErrors,
): boolean {
  return (
    errors.categoryIds !== null ||
    errors.name !== null ||
    errors.options.some((option) => option.name !== null || option.priceDelta !== null)
  );
}

export function createMenuAddonGroupDraft(
  form: MenuAddonGroupEditorForm,
): MenuCatalogOptionGroupDraft {
  return {
    categoryIds: [...form.categoryIds],
    name: form.name.trim(),
    options: form.options.map((option) => ({
      optionId: option.optionId,
      name: option.name.trim(),
      priceDelta: parsePriceDelta(option.priceDelta) ?? 0,
    })),
    selectionMode: form.selectionMode,
  };
}

export function useMenuAddonGroupEditor(
  initialOptionGroup: MenuCatalogOptionGroup | null,
  initialCategories: MenuCatalogCategory[],
  initialCategoryId: string | null,
) {
  const form = reactive<MenuAddonGroupEditorForm>(
    createMenuAddonGroupEditorForm(
      initialOptionGroup,
      initialCategories,
      initialCategoryId,
    ),
  );
  const errors = reactive<MenuAddonGroupEditorErrors>({
    categoryIds: null,
    name: null,
    options: createEmptyOptionErrors(form.options.length),
  });

  function reset(
    optionGroup: MenuCatalogOptionGroup | null,
    categories: MenuCatalogCategory[],
    categoryId: string | null,
  ) {
    const nextForm = createMenuAddonGroupEditorForm(optionGroup, categories, categoryId);

    form.categoryIds = [...nextForm.categoryIds];
    form.name = nextForm.name;
    form.options = nextForm.options;
    form.selectionMode = nextForm.selectionMode;
    errors.categoryIds = null;
    errors.name = null;
    errors.options = createEmptyOptionErrors(form.options.length);
  }

  function addOption() {
    form.options.push(createOptionForm());
    errors.options.push({
      name: null,
      priceDelta: null,
    });
  }

  function removeOption(formId: string) {
    if (form.options.length <= 1) {
      return;
    }

    const optionIndex = form.options.findIndex((option) => option.formId === formId);

    if (optionIndex === -1) {
      return;
    }

    form.options.splice(optionIndex, 1);
    errors.options.splice(optionIndex, 1);
  }

  function validate(): boolean {
    const nextErrors = validateMenuAddonGroupEditorForm(form);

    errors.categoryIds = nextErrors.categoryIds;
    errors.name = nextErrors.name;
    errors.options = nextErrors.options;

    return !hasMenuAddonGroupEditorErrors(errors);
  }

  return {
    addOption,
    errors,
    form,
    removeOption,
    reset,
    validate,
  };
}
