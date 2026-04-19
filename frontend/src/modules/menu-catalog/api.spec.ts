import { describe, expect, it, vi } from "vitest";
import { MenuCatalogApi, MenuCatalogApiError } from "./api";

const snapshot = {
  categories: [],
  items: [],
  optionGroups: [],
};

describe("MenuCatalogApi", () => {
  it("loads catalog with backoffice auth headers", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
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
});
