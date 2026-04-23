import { describe, expect, it } from "vitest";
import {
  mapMenuCatalogError,
  normalizeDrinkSizePrices,
  parseMoney,
  validateMenuCategoryPayload,
  validateMenuItemPayload,
  validateOptionGroupPayload,
} from "@/modules/menu-catalog/validation";

describe("menu catalog validation", () => {
  it("requires category name after trimming", () => {
    expect(
      validateMenuCategoryPayload({ name: "   ", optionGroupRefs: [] }),
    ).toEqual({
      valid: false,
      message: "Введите название группы",
    });
  });

  it("requires all drink size prices", () => {
    const result = validateMenuItemPayload({
      menuCategoryId: "cat-1",
      name: "Латте",
      itemType: "drink",
      drinkSizePrices: [
        { size: "S", price: 180 },
        { size: "M", price: 220 },
      ],
    });

    expect(result).toEqual({
      valid: false,
      message: "Укажите цены для размеров S, M и L",
    });
  });

  it("rejects drink with zero size price", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Латте",
        itemType: "drink",
        drinkSizePrices: [
          { size: "S", price: 180 },
          { size: "M", price: 0 },
          { size: "L", price: 260 },
        ],
      }),
    ).toEqual({
      valid: false,
      message: "Укажите цены для размеров S, M и L",
    });
  });

  it("accepts regular product with base price", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Круассан",
        itemType: "regular",
        basePrice: 160,
      }),
    ).toEqual({ valid: true, message: null });
  });

  it("accepts regular product with zero base price", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Сахар",
        itemType: "regular",
        basePrice: 0,
      }),
    ).toEqual({ valid: true, message: null });
  });

  it("rejects regular product with negative base price", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Сахар",
        itemType: "regular",
        basePrice: -1,
      }),
    ).toEqual({
      valid: false,
      message: "Укажите цену товара",
    });
  });

  it("rejects regular product with drink size prices", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Круассан",
        itemType: "regular",
        basePrice: 160,
        drinkSizePrices: [{ size: "S", price: 180 }],
      }),
    ).toEqual({
      valid: false,
      message: "Отключите цены размеров для обычного товара",
    });
  });

  it("rejects regular product with non-finite base price", () => {
    expect(
      validateMenuItemPayload({
        menuCategoryId: "cat-1",
        name: "Круассан",
        itemType: "regular",
        basePrice: Number.NaN,
      }),
    ).toEqual({
      valid: false,
      message: "Укажите цену товара",
    });
  });

  it("normalizes drink size prices from form strings", () => {
    expect(
      normalizeDrinkSizePrices({ S: "180", M: "220,5", L: "260" }),
    ).toEqual([
      { size: "S", price: 180 },
      { size: "M", price: 220.5 },
      { size: "L", price: 260 },
    ]);
  });

  it("keeps invalid money input as non-finite for validation", () => {
    expect(parseMoney("12abc")).toBeNaN();
  });

  it("rejects negative option price delta", () => {
    expect(
      validateOptionGroupPayload({
        name: "Сиропы",
        selectionMode: "multiple",
        options: [{ name: "Ваниль", priceDelta: -1, availability: true }],
      }),
    ).toEqual({
      valid: false,
      message: "Укажите названия опций и неотрицательные доплаты",
    });
  });

  it("accepts free option price delta", () => {
    expect(
      validateOptionGroupPayload({
        name: "Сиропы",
        selectionMode: "multiple",
        options: [{ name: "Без сахара", priceDelta: 0, availability: true }],
      }),
    ).toEqual({ valid: true, message: null });
  });

  it("maps backend validation codes to operator messages", () => {
    expect(mapMenuCatalogError("invalid-drink-size-model")).toContain(
      "S, M и L",
    );
    expect(mapMenuCatalogError("invalid-option-group-rule")).toContain(
      "тип выбора",
    );
  });

  it("maps auth, capability and request errors to operator messages", () => {
    expect(mapMenuCatalogError("backoffice-capability-forbidden")).toContain(
      "Недостаточно прав",
    );
    expect(mapMenuCatalogError("telegram-hash-invalid")).toContain(
      "подтвердить вход",
    );
    expect(mapMenuCatalogError("menu-catalog-request-failed")).toContain(
      "запрос каталога",
    );
  });
});
