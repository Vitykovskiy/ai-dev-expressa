import { BadRequestException, Injectable } from "@nestjs/common";
import {
  DRINK_SIZES,
  DrinkSize,
  DrinkSizePrice,
  MENU_ITEM_TYPES,
  MenuCatalogSnapshot,
  MenuItem,
  OPTION_SELECTION_MODES,
  OptionGroup
} from "./menu-catalog.types";
import {
  InvalidDrinkSizeModelError,
  InvalidOptionGroupRuleError
} from "./menu-catalog.errors";

@Injectable()
export class MenuCatalogValidator {
  validateItem(item: MenuItem): void {
    if (!MENU_ITEM_TYPES.includes(item.itemType)) {
      throw new BadRequestException("invalid-menu-item-type");
    }

    assertText(item.name, "menu-item-name-required");
    assertNonNegativeMoney(item.basePrice, "invalid-base-price");

    if (item.itemType === "drink") {
      validateDrinkSizePrices(item.drinkSizePrices);
      return;
    }

    if (item.drinkSizePrices.length > 0) {
      throw new InvalidDrinkSizeModelError();
    }
  }

  validateOptionGroup(group: OptionGroup): void {
    assertText(group.name, "option-group-name-required");

    if (!OPTION_SELECTION_MODES.includes(group.selectionMode)) {
      throw new InvalidOptionGroupRuleError();
    }

    const optionIds = new Set<string>();
    for (const option of group.options) {
      assertText(option.name, "option-name-required");
      assertNonNegativeMoney(option.priceDelta, "invalid-option-price-delta");

      if (option.optionGroupId !== group.optionGroupId) {
        throw new InvalidOptionGroupRuleError();
      }

      if (optionIds.has(option.optionId)) {
        throw new InvalidOptionGroupRuleError();
      }
      optionIds.add(option.optionId);
    }
  }

  validateCategoryReferences(snapshot: MenuCatalogSnapshot): void {
    const optionGroupIds = new Set(snapshot.optionGroups.map((group) => group.optionGroupId));
    const categoryIds = new Set(snapshot.categories.map((category) => category.menuCategoryId));

    for (const category of snapshot.categories) {
      assertText(category.name, "menu-category-name-required");
      for (const optionGroupId of category.optionGroupRefs) {
        if (!optionGroupIds.has(optionGroupId)) {
          throw new BadRequestException("option-group-not-found");
        }
      }
    }

    for (const item of snapshot.items) {
      if (!categoryIds.has(item.menuCategoryId)) {
        throw new BadRequestException("menu-category-not-found");
      }
      this.validateItem(item);
    }

    for (const group of snapshot.optionGroups) {
      this.validateOptionGroup(group);
    }
  }
}

function validateDrinkSizePrices(prices: readonly DrinkSizePrice[]): void {
  if (prices.length !== DRINK_SIZES.length) {
    throw new InvalidDrinkSizeModelError();
  }

  const seen = new Set<DrinkSize>();
  for (const price of prices) {
    if (!DRINK_SIZES.includes(price.size)) {
      throw new InvalidDrinkSizeModelError();
    }

    if (seen.has(price.size)) {
      throw new InvalidDrinkSizeModelError();
    }
    seen.add(price.size);

    assertNonNegativeMoney(price.price, "invalid-drink-size-model");
  }

  for (const size of DRINK_SIZES) {
    if (!seen.has(size)) {
      throw new InvalidDrinkSizeModelError();
    }
  }
}

function assertText(value: string, error: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestException(error);
  }
}

function assertNonNegativeMoney(value: number, error: string): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    if (error === "invalid-drink-size-model") {
      throw new InvalidDrinkSizeModelError();
    }
    throw new BadRequestException(error);
  }
}
