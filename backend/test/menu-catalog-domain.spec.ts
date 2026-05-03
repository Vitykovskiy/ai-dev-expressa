import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  InvalidDrinkSizeModelError,
  InvalidOptionGroupRuleError,
} from "../src/menu-catalog/domain/menu-catalog.errors";
import { MenuCatalogValidator } from "../src/menu-catalog/domain/menu-catalog.validator";

describe("MenuCatalogValidator", () => {
  let moduleRef: TestingModule;
  let validator: MenuCatalogValidator;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [MenuCatalogValidator],
    }).compile();
    validator = moduleRef.get(MenuCatalogValidator);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it("FTS-002-008 rejects a drink without the complete S/M/L price model", () => {
    expect(() =>
      validator.validateItem({
        menuItemId: "item-1",
        menuCategoryId: "category-1",
        name: "Latte",
        itemType: "drink",
        basePrice: 0,
        availability: true,
        drinkSizePrices: [
          { size: "S", price: 250 },
          { size: "M", price: 300 },
        ],
      }),
    ).toThrow(InvalidDrinkSizeModelError);
  });

  it("FTS-002-002 rejects size prices on a regular menu item", () => {
    expect(() =>
      validator.validateItem({
        menuItemId: "item-1",
        menuCategoryId: "category-1",
        name: "Brownie",
        itemType: "regular",
        basePrice: 180,
        availability: true,
        drinkSizePrices: [{ size: "S", price: 180 }],
      }),
    ).toThrow(InvalidDrinkSizeModelError);
  });

  it("FTS-002-011 rejects an unknown option group selection mode", () => {
    expect(() =>
      validator.validateOptionGroup({
        optionGroupId: "group-1",
        name: "Milk",
        selectionMode: "exclusive" as "single",
        options: [],
      }),
    ).toThrow(InvalidOptionGroupRuleError);
  });
});
