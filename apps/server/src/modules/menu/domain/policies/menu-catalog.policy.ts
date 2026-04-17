import type { DrinkSize, MenuCatalogSnapshot } from '@expressa/shared-types';
import { InvalidDrinkSizeModelError } from '../errors/invalid-drink-size-model.error';
import { InvalidOptionGroupRuleError } from '../errors/invalid-option-group-rule.error';
import type { MenuCatalog, MenuCatalogItem } from '../models/menu-catalog';

const DRINK_SIZE_ORDER: readonly DrinkSize[] = ['S', 'M', 'L'];

export function normalizeMenuCatalog(snapshot: MenuCatalogSnapshot): MenuCatalog {
  return {
    categories: snapshot.categories.map((category) => ({
      menuCategoryId: category.menuCategoryId.trim(),
      name: category.name.trim(),
      optionGroupRefs: [...new Set(category.optionGroupRefs.map((reference) => reference.trim()))],
    })),
    items: snapshot.items.map((item) => ({
      menuItemId: item.menuItemId.trim(),
      menuCategoryId: item.menuCategoryId.trim(),
      name: item.name.trim(),
      itemType: item.itemType,
      basePrice: item.basePrice ?? null,
      sizePrices: [...item.sizePrices]
        .map((sizePrice) => ({
          size: sizePrice.size,
          price: sizePrice.price,
        }))
        .sort(
          (left, right) =>
            DRINK_SIZE_ORDER.indexOf(left.size) - DRINK_SIZE_ORDER.indexOf(right.size),
        ),
    })),
    optionGroups: snapshot.optionGroups.map((group) => ({
      optionGroupId: group.optionGroupId.trim(),
      name: group.name.trim(),
      selectionMode: group.selectionMode,
      options: group.options.map((option) => ({
        optionId: option.optionId.trim(),
        name: option.name.trim(),
        priceDelta: option.priceDelta,
      })),
    })),
  };
}

export function validateMenuCatalog(catalog: MenuCatalog): void {
  const optionGroupIds = new Set<string>();
  const referencedOptionGroupIds = new Set<string>();
  const optionIds = new Set<string>();
  const categoryIds = new Set<string>();
  const itemIds = new Set<string>();

  for (const group of catalog.optionGroups) {
    assertUniqueIdentifier(
      optionGroupIds,
      group.optionGroupId,
      `Option group "${group.optionGroupId}" is duplicated`,
    );

    if (group.options.length === 0) {
      throw new InvalidOptionGroupRuleError(
        `Option group "${group.optionGroupId}" must contain at least one option`,
      );
    }

    for (const option of group.options) {
      assertUniqueIdentifier(
        optionIds,
        option.optionId,
        `Option "${option.optionId}" is duplicated`,
      );
    }
  }

  for (const category of catalog.categories) {
    assertUniqueIdentifier(
      categoryIds,
      category.menuCategoryId,
      `Menu category "${category.menuCategoryId}" is duplicated`,
    );

    for (const optionGroupRef of category.optionGroupRefs) {
      if (!optionGroupIds.has(optionGroupRef)) {
        throw new InvalidOptionGroupRuleError(
          `Menu category "${category.menuCategoryId}" references unknown option group "${optionGroupRef}"`,
        );
      }

      referencedOptionGroupIds.add(optionGroupRef);
    }
  }

  for (const item of catalog.items) {
    assertUniqueIdentifier(itemIds, item.menuItemId, `Menu item "${item.menuItemId}" is duplicated`);

    if (!categoryIds.has(item.menuCategoryId)) {
      throw new InvalidOptionGroupRuleError(
        `Menu item "${item.menuItemId}" references unknown menu category "${item.menuCategoryId}"`,
      );
    }

    validateItemPricing(item);
  }

  for (const optionGroupId of optionGroupIds) {
    if (!referencedOptionGroupIds.has(optionGroupId)) {
      throw new InvalidOptionGroupRuleError(
        `Option group "${optionGroupId}" must be assigned to at least one menu category`,
      );
    }
  }
}

function validateItemPricing(item: MenuCatalogItem): void {
  if (item.itemType === 'drink') {
    if (item.basePrice !== null) {
      throw new InvalidDrinkSizeModelError(
        `Drink "${item.menuItemId}" must not define basePrice when size prices are used`,
      );
    }

    const sizes = item.sizePrices.map((sizePrice) => sizePrice.size);

    if (
      item.sizePrices.length !== DRINK_SIZE_ORDER.length ||
      new Set(sizes).size !== DRINK_SIZE_ORDER.length ||
      DRINK_SIZE_ORDER.some((size) => !sizes.includes(size))
    ) {
      throw new InvalidDrinkSizeModelError(
        `Drink "${item.menuItemId}" must define prices for sizes S, M and L exactly once`,
      );
    }

    return;
  }

  if (item.basePrice === null) {
    throw new InvalidDrinkSizeModelError(
      `Product "${item.menuItemId}" must define basePrice when no drink sizes are used`,
    );
  }

  if (item.sizePrices.length > 0) {
    throw new InvalidDrinkSizeModelError(
      `Product "${item.menuItemId}" must not define size prices`,
    );
  }
}

function assertUniqueIdentifier(
  identifiers: Set<string>,
  identifier: string,
  message: string,
): void {
  if (identifiers.has(identifier)) {
    throw new InvalidOptionGroupRuleError(message);
  }

  identifiers.add(identifier);
}
