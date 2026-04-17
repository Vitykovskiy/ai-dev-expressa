import {
  hasMenuCategoryEditorErrors,
  validateMenuCategoryEditorForm,
} from './menu-category-editor';

describe('menu category editor validation', () => {
  it('requires a non-empty category name', () => {
    const errors = validateMenuCategoryEditorForm({ name: '   ' });

    expect(errors.name).toBe('Укажите название категории.');
    expect(hasMenuCategoryEditorErrors(errors)).toBe(true);
  });

  it('accepts a category name with surrounding spaces', () => {
    const errors = validateMenuCategoryEditorForm({ name: '  Кофе  ' });

    expect(errors.name).toBeNull();
    expect(hasMenuCategoryEditorErrors(errors)).toBe(false);
  });
});
