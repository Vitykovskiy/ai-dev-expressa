import "reflect-metadata";
import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import {
  createItem,
  createOptionGroup,
  removeCategory,
  removeOptionGroup,
  updateItem,
} from "../src/menu-catalog/domain/menu-catalog.mutations";
import { MenuCatalogSnapshot } from "../src/menu-catalog/domain/menu-catalog.types";
import {
  MenuCategoryHasItemsError,
  OptionGroupInUseError,
} from "../src/menu-catalog/domain/menu-catalog.errors";

describe("menu catalog mutations", () => {
  it("rejects deleting a category that still has items", () => {
    expectBadRequest(() => removeCategory(createSnapshot(), "category-1"), {
      message: "menu-category-has-items",
      type: MenuCategoryHasItemsError,
    });
  });

  it("rejects deleting an option group that is still assigned to a category", () => {
    expectBadRequest(() => removeOptionGroup(createSnapshot(), "group-1"), {
      message: "option-group-in-use",
      type: OptionGroupInUseError,
    });
  });

  it("creates and updates item defaults without changing DTO semantics", () => {
    const item = createItem({
      menuCategoryId: "category-1",
      name: "Latte",
      itemType: "drink",
      drinkSizePrices: [
        { size: "S", price: 250 },
        { size: "M", price: 300 },
        { size: "L", price: 350 },
      ],
    });

    const updated = updateItem(item, {
      availability: false,
      basePrice: 0,
    });

    expect(item.menuItemId).toEqual(expect.any(String));
    expect(updated).toMatchObject({
      menuCategoryId: "category-1",
      name: "Latte",
      itemType: "drink",
      basePrice: 0,
      availability: false,
      drinkSizePrices: [
        { size: "S", price: 250 },
        { size: "M", price: 300 },
        { size: "L", price: 350 },
      ],
    });
  });

  it("assigns option ids and parent group id to created options", () => {
    const group = createOptionGroup({
      name: "Milk",
      selectionMode: "single",
      options: [{ name: "Regular" }, { name: "Oat", priceDelta: 60 }],
    });

    expect(group.options).toHaveLength(2);
    expect(group.options[0]).toMatchObject({
      optionGroupId: group.optionGroupId,
      name: "Regular",
      priceDelta: 0,
      availability: true,
    });
    expect(group.options[0].optionId).toEqual(expect.any(String));
  });
});

function createSnapshot(): MenuCatalogSnapshot {
  return {
    categories: [
      {
        menuCategoryId: "category-1",
        name: "Coffee",
        optionGroupRefs: ["group-1"],
      },
    ],
    items: [
      {
        menuItemId: "item-1",
        menuCategoryId: "category-1",
        name: "Latte",
        itemType: "drink",
        basePrice: 0,
        availability: true,
        drinkSizePrices: [
          { size: "S", price: 250 },
          { size: "M", price: 300 },
          { size: "L", price: 350 },
        ],
      },
    ],
    optionGroups: [
      {
        optionGroupId: "group-1",
        name: "Milk",
        selectionMode: "single",
        options: [],
      },
    ],
  };
}

function expectBadRequest(
  action: () => unknown,
  expectation: {
    message: string;
    type: typeof BadRequestException;
  },
): void {
  try {
    action();
    throw new Error("Expected action to throw");
  } catch (error) {
    expect(error).toBeInstanceOf(expectation.type);
    expect((error as BadRequestException).getResponse()).toMatchObject({
      message: expectation.message,
    });
  }
}
