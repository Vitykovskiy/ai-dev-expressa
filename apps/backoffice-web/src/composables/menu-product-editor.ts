import type {
  DrinkSize,
  MenuCatalogItem,
  MenuCatalogItemType,
} from '@expressa/shared-types';
import { reactive } from 'vue';
import type { MenuCatalogProductDraft } from '../types';

export const MENU_PRODUCT_EDITOR_DRINK_SIZES: readonly DrinkSize[] = ['S', 'M', 'L'];

export interface MenuProductEditorForm {
  name: string;
  itemType: MenuCatalogItemType;
  basePrice: string;
  sizePrices: Record<DrinkSize, string>;
}

export interface MenuProductEditorErrors {
  name: string | null;
  basePrice: string | null;
  sizePrices: Record<DrinkSize, string | null>;
}

function formatPrice(price: number | null | undefined): string {
  return price === null || price === undefined ? '' : String(price);
}

function findSizePrice(product: MenuCatalogItem | null | undefined, size: DrinkSize): string {
  return formatPrice(product?.sizePrices.find((sizePrice) => sizePrice.size === size)?.price);
}

function createEmptySizePriceErrors(): Record<DrinkSize, string | null> {
  return {
    S: null,
    M: null,
    L: null,
  };
}

function parsePrice(value: string): number | null {
  const normalizedValue = value.trim().replace(',', '.');

  if (!normalizedValue) {
    return null;
  }

  const price = Number(normalizedValue);

  return Number.isFinite(price) ? price : null;
}

function validateRequiredPrice(value: string, emptyMessage: string, invalidMessage: string) {
  if (!value.trim()) {
    return emptyMessage;
  }

  const price = parsePrice(value);

  if (price === null || price < 0) {
    return invalidMessage;
  }

  return null;
}

export function createMenuProductEditorForm(
  product: MenuCatalogItem | null = null,
): MenuProductEditorForm {
  return {
    name: product?.name ?? '',
    itemType: product?.itemType ?? 'product',
    basePrice: product?.itemType === 'product' ? formatPrice(product.basePrice) : '',
    sizePrices: {
      S: findSizePrice(product, 'S'),
      M: findSizePrice(product, 'M'),
      L: findSizePrice(product, 'L'),
    },
  };
}

export function validateMenuProductEditorForm(
  form: MenuProductEditorForm,
): MenuProductEditorErrors {
  const errors: MenuProductEditorErrors = {
    name: form.name.trim() ? null : 'Укажите название товара.',
    basePrice: null,
    sizePrices: createEmptySizePriceErrors(),
  };

  if (form.itemType === 'product') {
    errors.basePrice = validateRequiredPrice(
      form.basePrice,
      'Укажите базовую цену товара.',
      'Базовая цена должна быть числом от 0.',
    );
    return errors;
  }

  for (const size of MENU_PRODUCT_EDITOR_DRINK_SIZES) {
    errors.sizePrices[size] = validateRequiredPrice(
      form.sizePrices[size],
      `Укажите цену размера ${size}.`,
      `Цена размера ${size} должна быть числом от 0.`,
    );
  }

  return errors;
}

export function hasMenuProductEditorErrors(errors: MenuProductEditorErrors): boolean {
  return (
    errors.name !== null ||
    errors.basePrice !== null ||
    Object.values(errors.sizePrices).some((error) => error !== null)
  );
}

export function createMenuProductDraft(form: MenuProductEditorForm): MenuCatalogProductDraft {
  if (form.itemType === 'product') {
    return {
      name: form.name.trim(),
      itemType: 'product',
      basePrice: parsePrice(form.basePrice) ?? 0,
      sizePrices: [],
    };
  }

  return {
    name: form.name.trim(),
    itemType: 'drink',
    basePrice: null,
    sizePrices: MENU_PRODUCT_EDITOR_DRINK_SIZES.map((size) => ({
      size,
      price: parsePrice(form.sizePrices[size]) ?? 0,
    })),
  };
}

export function useMenuProductEditor(initialProduct: MenuCatalogItem | null = null) {
  const form = reactive<MenuProductEditorForm>(createMenuProductEditorForm(initialProduct));
  const errors = reactive<MenuProductEditorErrors>({
    name: null,
    basePrice: null,
    sizePrices: createEmptySizePriceErrors(),
  });

  function clearErrors() {
    errors.name = null;
    errors.basePrice = null;
    errors.sizePrices.S = null;
    errors.sizePrices.M = null;
    errors.sizePrices.L = null;
  }

  function reset(product: MenuCatalogItem | null = null) {
    const nextForm = createMenuProductEditorForm(product);

    form.name = nextForm.name;
    form.itemType = nextForm.itemType;
    form.basePrice = nextForm.basePrice;
    form.sizePrices.S = nextForm.sizePrices.S;
    form.sizePrices.M = nextForm.sizePrices.M;
    form.sizePrices.L = nextForm.sizePrices.L;
    clearErrors();
  }

  function setItemType(itemType: MenuCatalogItemType) {
    form.itemType = itemType;
    clearErrors();
  }

  function validate(): boolean {
    const nextErrors = validateMenuProductEditorForm(form);

    errors.name = nextErrors.name;
    errors.basePrice = nextErrors.basePrice;
    errors.sizePrices.S = nextErrors.sizePrices.S;
    errors.sizePrices.M = nextErrors.sizePrices.M;
    errors.sizePrices.L = nextErrors.sizePrices.L;

    return !hasMenuProductEditorErrors(errors);
  }

  return {
    errors,
    form,
    reset,
    setItemType,
    validate,
  };
}
