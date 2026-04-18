import type {
  MenuCatalogCategory,
  MenuCatalogOptionGroup,
} from '@expressa/shared-types';
import {
  collectMenuAddonGroupEditorValidationSummary,
  createMenuAddonGroupDraft,
  createMenuAddonGroupEditorForm,
  hasMenuAddonGroupEditorErrors,
  resolveMenuAddonGroupEditorCompletionState,
  useMenuAddonGroupEditor,
  validateMenuAddonGroupEditorForm,
} from './menu-addon-group-editor';

const categories: MenuCatalogCategory[] = [
  {
    menuCategoryId: 'cat-coffee',
    name: 'Coffee',
    optionGroupRefs: ['group-milk'],
  },
  {
    menuCategoryId: 'cat-desserts',
    name: 'Desserts',
    optionGroupRefs: ['group-milk'],
  },
  {
    menuCategoryId: 'cat-breakfast',
    name: 'Breakfast',
    optionGroupRefs: [],
  },
];

const optionGroup: MenuCatalogOptionGroup = {
  optionGroupId: 'group-milk',
  name: 'Milk',
  selectionMode: 'multiple',
  options: [
    {
      optionId: 'option-oat',
      name: 'Oat',
      priceDelta: 40,
    },
    {
      optionId: 'option-soy',
      name: 'Soy',
      priceDelta: 0,
    },
  ],
};

describe('menu addon group editor', () => {
  it('creates a new group form with the current category selected and one empty option', () => {
    const form = createMenuAddonGroupEditorForm(null, categories, 'cat-coffee');

    expect(form.categoryIds).toEqual(['cat-coffee']);
    expect(form.name).toBe('');
    expect(form.selectionMode).toBe('single');
    expect(form.options).toEqual([
      expect.objectContaining({
        optionId: null,
        name: '',
        priceDelta: '0',
      }),
    ]);
    expect(form.options[0].formId).toMatch(/^option-form-/);
  });

  it('creates an edit form from option group data and category bindings', () => {
    const form = createMenuAddonGroupEditorForm(optionGroup, categories, 'cat-breakfast');

    expect(form.categoryIds).toEqual(['cat-coffee', 'cat-desserts']);
    expect(form.name).toBe('Milk');
    expect(form.selectionMode).toBe('multiple');
    expect(form.options).toEqual([
      expect.objectContaining({
        optionId: 'option-oat',
        name: 'Oat',
        priceDelta: '40',
      }),
      expect.objectContaining({
        optionId: 'option-soy',
        name: 'Soy',
        priceDelta: '0',
      }),
    ]);
  });

  it('requires a category, group name, option name and non-negative price delta', () => {
    const errors = validateMenuAddonGroupEditorForm({
      categoryIds: [],
      name: '   ',
      selectionMode: 'single',
      options: [
        {
          formId: 'option-form-1',
          optionId: null,
          name: '',
          priceDelta: '',
        },
        {
          formId: 'option-form-2',
          optionId: null,
          name: 'Oat',
          priceDelta: '-1',
        },
      ],
    });

    expect(errors.categoryIds).not.toBeNull();
    expect(errors.name).not.toBeNull();
    expect(errors.options[0].name).not.toBeNull();
    expect(errors.options[0].priceDelta).not.toBeNull();
    expect(errors.options[1].name).toBeNull();
    expect(errors.options[1].priceDelta).not.toBeNull();
    expect(hasMenuAddonGroupEditorErrors(errors)).toBe(true);
  });

  it('builds validation summary and completion state for missing fields', () => {
    const form = {
      categoryIds: [],
      name: '',
      selectionMode: 'single' as const,
      options: [
        {
          formId: 'option-form-1',
          optionId: null,
          name: '',
          priceDelta: '',
        },
      ],
    };
    const errors = validateMenuAddonGroupEditorForm(form);

    expect(collectMenuAddonGroupEditorValidationSummary(errors)).toEqual([
      'Выберите хотя бы одну категорию.',
      'Укажите название группы.',
      'Укажите название варианта 1.',
      'Доплата варианта 1 должна быть числом от 0.',
    ]);
    expect(resolveMenuAddonGroupEditorCompletionState(form)).toEqual({
      badge: 'Нужно заполнить: 4',
      tone: 'warning',
    });
  });

  it('builds a trimmed draft with parsed price deltas and preserved option ids', () => {
    const draft = createMenuAddonGroupDraft({
      categoryIds: ['cat-desserts', 'cat-coffee'],
      name: '  Syrups  ',
      selectionMode: 'multiple',
      options: [
        {
          formId: 'option-form-1',
          optionId: 'option-vanilla',
          name: '  Vanilla  ',
          priceDelta: '35,5',
        },
        {
          formId: 'option-form-2',
          optionId: null,
          name: 'Caramel',
          priceDelta: '0',
        },
      ],
    });

    expect(draft).toEqual({
      categoryIds: ['cat-desserts', 'cat-coffee'],
      name: 'Syrups',
      selectionMode: 'multiple',
      options: [
        {
          optionId: 'option-vanilla',
          name: 'Vanilla',
          priceDelta: 35.5,
        },
        {
          optionId: null,
          name: 'Caramel',
          priceDelta: 0,
        },
      ],
    });
  });

  it('keeps option forms and errors aligned when options are added and removed', () => {
    const editor = useMenuAddonGroupEditor(null, categories, 'cat-coffee');
    const firstOptionFormId = editor.form.options[0].formId;

    editor.addOption();
    const secondOptionFormId = editor.form.options[1].formId;
    editor.errors.options[1].name = 'Option error';

    editor.removeOption(firstOptionFormId);

    expect(editor.form.options).toHaveLength(1);
    expect(editor.form.options[0].formId).toBe(secondOptionFormId);
    expect(editor.errors.options).toEqual([
      {
        name: 'Option error',
        priceDelta: null,
      },
    ]);

    editor.removeOption(secondOptionFormId);

    expect(editor.form.options).toHaveLength(1);
    expect(editor.errors.options).toHaveLength(1);
  });
});
