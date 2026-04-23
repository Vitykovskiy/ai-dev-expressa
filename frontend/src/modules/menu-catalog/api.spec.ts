import { describe, expect, it, vi } from "vitest";
import {
  MenuCatalogApi,
  MenuCatalogApiError,
} from "@/modules/menu-catalog/api";
import type {
  MenuCategoryPayload,
  MenuItemPayload,
  OptionGroupPayload,
} from "@/modules/menu-catalog/types";

const snapshot = {
  categories: [],
  items: [],
  optionGroups: [],
};

describe("MenuCatalogApi", () => {
  it("loads catalog with backoffice auth headers", async () => {
    const fetchImpl = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(snapshot), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const api = new MenuCatalogApi({
      apiBaseUrl: "http://localhost:3000",
      initData: "signed-init-data",
      testTelegramId: "1001",
      fetchImpl,
    });

    await api.getCatalog();

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:3000/backoffice/menu/catalog",
      {
        headers: {
          "content-type": "application/json",
          "x-telegram-init-data": "signed-init-data",
          "x-test-telegram-id": "1001",
        },
      },
    );
  });

  it("posts category payload to contract endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const api = new MenuCatalogApi({ fetchImpl });

    await api.createCategory({ name: "Кофе", optionGroupRefs: ["milk"] });

    expect(fetchImpl).toHaveBeenCalledWith("/backoffice/menu/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Кофе", optionGroupRefs: ["milk"] }),
    });
  });

  it("uses contract endpoints for every catalog mutation", async () => {
    const fetchImpl = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(snapshot), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const api = new MenuCatalogApi({ fetchImpl });
    const categoryPayload: MenuCategoryPayload = {
      name: "Кофе",
      optionGroupRefs: ["milk"],
    };
    const itemPayload: MenuItemPayload = {
      menuCategoryId: "category-1",
      name: "Латте",
      itemType: "drink",
      drinkSizePrices: [
        { size: "S", price: 200 },
        { size: "M", price: 250 },
        { size: "L", price: 300 },
      ],
    };
    const optionGroupPayload: OptionGroupPayload = {
      name: "Молоко",
      selectionMode: "single",
      options: [
        {
          optionId: "option-1",
          name: "Овсяное",
          priceDelta: 50,
          availability: true,
        },
      ],
    };

    await api.updateCategory("category/1", categoryPayload);
    await api.deleteCategory("category/1");
    await api.createItem(itemPayload);
    await api.updateItem("item/1", itemPayload);
    await api.deleteItem("item/1");
    await api.createOptionGroup(optionGroupPayload);
    await api.updateOptionGroup("group/1", optionGroupPayload);
    await api.deleteOptionGroup("group/1");

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "/backoffice/menu/categories/category%2F1",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "/backoffice/menu/categories/category%2F1",
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      3,
      "/backoffice/menu/items",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      4,
      "/backoffice/menu/items/item%2F1",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      5,
      "/backoffice/menu/items/item%2F1",
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      6,
      "/backoffice/menu/option-groups",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      7,
      "/backoffice/menu/option-groups/group%2F1",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      8,
      "/backoffice/menu/option-groups/group%2F1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("reloads catalog snapshot when mutation returns only the changed entity", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            menuCategoryId: "category-1",
            name: "Кофе",
            optionGroupRefs: [],
          }),
          {
            status: 201,
            headers: { "content-type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            categories: [
              {
                menuCategoryId: "category-1",
                name: "Кофе",
                optionGroupRefs: [],
              },
            ],
            items: [],
            optionGroups: [],
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      );
    const api = new MenuCatalogApi({ fetchImpl });

    const catalog = await api.createCategory({
      name: "Кофе",
      optionGroupRefs: [],
    });

    expect(catalog.categories).toHaveLength(1);
    expect(fetchImpl).toHaveBeenNthCalledWith(2, "/backoffice/menu/catalog", {
      headers: { "content-type": "application/json" },
    });
  });

  it("maps backend catalog errors", async () => {
    const api = new MenuCatalogApi({
      fetchImpl: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "invalid-drink-size-model" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        }),
      ),
    });

    await expect(
      api.createItem({
        menuCategoryId: "cat",
        name: "Латте",
        itemType: "drink",
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<MenuCatalogApiError>>({
        status: 400,
        code: "invalid-drink-size-model",
      }),
    );
  });

  it("keeps backoffice capability errors visible", async () => {
    const api = new MenuCatalogApi({
      fetchImpl: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: "backoffice-capability-forbidden" }),
          {
            status: 403,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    });

    await expect(api.getCatalog()).rejects.toEqual(
      expect.objectContaining<Partial<MenuCatalogApiError>>({
        status: 403,
        code: "backoffice-capability-forbidden",
      }),
    );
  });
});
