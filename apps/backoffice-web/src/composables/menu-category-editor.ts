import { reactive } from 'vue';

export interface MenuCategoryEditorForm {
  name: string;
}

export interface MenuCategoryEditorErrors {
  name: string | null;
}

export function createMenuCategoryEditorForm(name = ''): MenuCategoryEditorForm {
  return {
    name,
  };
}

export function validateMenuCategoryEditorForm(
  form: MenuCategoryEditorForm,
): MenuCategoryEditorErrors {
  return {
    name: form.name.trim() ? null : 'Укажите название категории.',
  };
}

export function hasMenuCategoryEditorErrors(errors: MenuCategoryEditorErrors): boolean {
  return Object.values(errors).some((error) => error !== null);
}

export function useMenuCategoryEditor(initialName = '') {
  const form = reactive<MenuCategoryEditorForm>(createMenuCategoryEditorForm(initialName));
  const errors = reactive<MenuCategoryEditorErrors>({
    name: null,
  });

  function reset(name = '') {
    form.name = name;
    errors.name = null;
  }

  function validate(): boolean {
    const nextErrors = validateMenuCategoryEditorForm(form);
    errors.name = nextErrors.name;

    return !hasMenuCategoryEditorErrors(errors);
  }

  return {
    errors,
    form,
    reset,
    validate,
  };
}
