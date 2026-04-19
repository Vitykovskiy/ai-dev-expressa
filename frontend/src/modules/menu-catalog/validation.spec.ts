import { describe, expect, it } from "vitest";
import {
  mapMenuCatalogError,
  normalizeDrinkSizePrices,
  validateMenuItemPayload,
  validateOptionGroupPayload
} from "./validation";

describe("menu catalog validation", () => {
  it("requires all drink size prices", () => {
    const result = validateMenuItemPayload({
      menuCategoryId: "cat-1",
      name: "Латте",
      itemType: "drink",
      drinkSizePrices: [
        { size: "S", price: 180 },
        { size: "M", price: 220 }
      ]
    });

    expect(result).toEqual({
      valid: false,
      message: "Укажите цены для размеров S, M и L"
    });
  });

  it("accepts regular product with base price", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Круассан",
        itemType: "regular",
        basePrice: 160
      })
    ).toEqual({ valid: true, message: null });
  });

  it("normalizes drink size prices from form strings", () => {
    expect(normalizeDrinkSizePrices({ S: "180", M: "220,5", L: "260" })).toEqual([
      { size: "S", price: 180 },
      { size: "M", price: 220.5 },
      { size: "L", price: 260 }
    ]);
  });

  it("rejects negative option price delta", () => {
    expect(
      validateOptionGroupPayload({
        name: "Сиропы",
        selectionMode: "multiple",
        options: [{ name: "Ваниль", priceDelta: -1, availability: true }]
      })
    ).toEqual({
      valid: false,
      message: "Укажите названия опций и неотрицательные доплаты"
    });
  });

  it("maps backend validation codes to operator messages", () => {
    expect(mapMenuCatalogError("invalid-drink-size-model")).toContain("S, M и L");
    expect(mapMenuCatalogError("invalid-option-group-rule")).toContain("тип выбора");
  });
});
