import { Injectable } from "@nestjs/common";
import { drinkSizeValues, type MenuCatalogDto } from "@expressa/shared-types";

import { DomainError } from "../../common/errors/domain-error";

const ensureUniqueIds = (
  values: string[],
  message: string,
  code: "invalid-option-group-rule" | "invalid-drink-size-model" = "invalid-option-group-rule"
): Set<string> => {
  const set = new Set<string>();

  for (const value of values) {
    if (!value.trim() || set.has(value)) {
      throw new DomainError(code, 400, message);
    }

    set.add(value);
  }

  return set;
};

@Injectable()
export class MenuCatalogValidator {
  validate(catalog: MenuCatalogDto): void {
    const categoryIds = ensureUniqueIds(
      catalog.categories.map((category) => category.menuCategoryId),
      "Menu category identifiers must be unique and non-empty"
    );
    const optionGroupIds = ensureUniqueIds(
      catalog.optionGroups.map((group) => group.optionGroupId),
      "Option group identifiers must be unique and non-empty"
    );

    ensureUniqueIds(
      catalog.items.map((item) => item.menuItemId),
      "Menu item identifiers must be unique and non-empty"
    );

    const optionIds = new Set<string>();
    for (const group of catalog.optionGroups) {
      if (!group.name.trim()) {
        throw new DomainError("invalid-option-group-rule", 400, "Option group name is required");
      }

      for (const option of group.options) {
        if (!option.optionId.trim() || optionIds.has(option.optionId)) {
          throw new DomainError(
            "invalid-option-group-rule",
            400,
            "Option identifiers must be unique and non-empty"
          );
        }

        if (!option.name.trim()) {
          throw new DomainError("invalid-option-group-rule", 400, "Option name is required");
        }

        optionIds.add(option.optionId);
      }
    }

    for (const category of catalog.categories) {
      if (!category.name.trim()) {
        throw new DomainError("invalid-option-group-rule", 400, "Category name is required");
      }

      for (const optionGroupId of category.optionGroupIds) {
        if (!optionGroupIds.has(optionGroupId)) {
          throw new DomainError(
            "invalid-option-group-rule",
            400,
            `Category references missing option group ${optionGroupId}`
          );
        }
      }
    }

    for (const item of catalog.items) {
      if (!categoryIds.has(item.menuCategoryId)) {
        throw new DomainError(
          "invalid-option-group-rule",
          400,
          `Menu item references missing category ${item.menuCategoryId}`
        );
      }

      if (!item.name.trim()) {
        throw new DomainError("invalid-option-group-rule", 400, "Menu item name is required");
      }

      if (item.itemType === "drink") {
        if (item.basePrice !== null) {
          throw new DomainError(
            "invalid-drink-size-model",
            400,
            "Drink item cannot define basePrice"
          );
        }

        const sizeSet = new Set(item.sizePrices.map((sizePrice) => sizePrice.size));
        const hasEverySize = drinkSizeValues.every((size) => sizeSet.has(size));
        const hasValidPrices = item.sizePrices.every((sizePrice) => sizePrice.price >= 0);

        if (!hasEverySize || sizeSet.size !== drinkSizeValues.length || !hasValidPrices) {
          throw new DomainError(
            "invalid-drink-size-model",
            400,
            "Drink item must define non-negative prices for S, M and L"
          );
        }
      } else if (item.basePrice === null || item.basePrice < 0 || item.sizePrices.length > 0) {
        throw new DomainError(
          "invalid-drink-size-model",
          400,
          "Regular item must define non-negative basePrice and no sizePrices"
        );
      }
    }
  }
}

