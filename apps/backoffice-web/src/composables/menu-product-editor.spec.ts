import type { MenuCatalogItem } from '@expressa/shared-types';
import {
  createMenuProductDraft,
  hasMenuProductEditorErrors,
  validateMenuProductEditorForm,
} from './menu-product-editor';

describe('menu product editor validation', () => {
  it('requires a product name and base price for a product without sizes', () => {
    const errors = validateMenuProductEditorForm({
      name: '   ',
      itemType: 'product',
      basePrice: '',
      sizePrices: {
        S: '',
        M: '',
        L: '',
      },
    });

    expect(errors.name).toBe('Укажите название товара.');
    expect(errors.basePrice).toBe('Укажите базовую цену товара.');
    expect(hasMenuProductEditorErrors(errors)).toBe(true);
  });

  it('requires prices for every drink size', () => {
    const errors = validateMenuProductEditorForm({
      name: 'Латте',
      itemType: 'drink',
      basePrice: '',
      sizePrices: {
        S: '190',
        M: '',
        L: '-1',
      },
    });

    expect(errors.name).toBeNull();
    expect(errors.sizePrices.S).toBeNull();
    expect(errors.sizePrices.M).toBe('Укажите цену размера M.');
    expect(errors.sizePrices.L).toBe('Цена размера L должна быть числом от 0.');
    expect(hasMenuProductEditorErrors(errors)).toBe(true);
  });

  it('builds a product draft with base price and no size prices', () => {
    const draft = createMenuProductDraft({
      name: '  Круассан  ',
      itemType: 'product',
      basePrice: '160,5',
      sizePrices: {
        S: '',
        M: '',
        L: '',
      },
    });

    expect(draft).toEqual({
      name: 'Круассан',
      itemType: 'product',
      basePrice: 160.5,
      sizePrices: [],
    });
  });

  it('builds a drink draft with S/M/L prices and no base price', () => {
    const draft = createMenuProductDraft({
      name: 'Раф',
      itemType: 'drink',
      basePrice: '300',
      sizePrices: {
        S: '210',
        M: '250',
        L: '290',
      },
    });

    expect(draft).toEqual({
      name: 'Раф',
      itemType: 'drink',
      basePrice: null,
      sizePrices: [
        { size: 'S', price: 210 },
        { size: 'M', price: 250 },
        { size: 'L', price: 290 },
      ],
    });
  });

  it('accepts an existing drink as initial validation input', () => {
    const product: MenuCatalogItem = {
      menuItemId: 'item-latte',
      menuCategoryId: 'cat-coffee',
      name: 'Латте',
      itemType: 'drink',
      basePrice: null,
      sizePrices: [
        { size: 'S', price: 190 },
        { size: 'M', price: 230 },
        { size: 'L', price: 270 },
      ],
    };
    const errors = validateMenuProductEditorForm({
      name: product.name,
      itemType: product.itemType,
      basePrice: '',
      sizePrices: {
        S: '190',
        M: '230',
        L: '270',
      },
    });

    expect(hasMenuProductEditorErrors(errors)).toBe(false);
  });
});
