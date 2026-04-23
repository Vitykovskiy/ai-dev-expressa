import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MenuCatalogApiError,
  type MenuCatalogClient,
} from "@/modules/menu-catalog/api";
import {
  resetMenuCatalogStore,
  setMenuCatalogApiForTests,
  useMenuCatalogStore,
} from "@/modules/menu-catalog/store";
import type { MenuCatalogSnapshot } from "@/modules/menu-catalog/types";

const emptySnapshot: MenuCatalogSnapshot = {
  categories: [],
  items: [],
  optionGroups: [],
};

const categorySnapshot: MenuCatalogSnapshot = {
  categories: [{ menuCategoryId: "cat-1", name: "Кофе", optionGroupRefs: [] }],
  items: [],
  optionGroups: [],
};

function createApiMock(
  overrides: Partial<MenuCatalogClient> = {},
): MenuCatalogClient {
  return {
    getCatalog: vi.fn().mockResolvedValue(emptySnapshot),
    createCategory: vi.fn().mockResolvedValue(categorySnapshot),
    updateCategory: vi.fn().mockResolvedValue(categorySnapshot),
    deleteCategory: vi.fn().mockResolvedValue(emptySnapshot),
    createItem: vi.fn().mockResolvedValue(emptySnapshot),
    updateItem: vi.fn().mockResolvedValue(emptySnapshot),
    deleteItem: vi.fn().mockResolvedValue(emptySnapshot),
    createOptionGroup: vi.fn().mockResolvedValue(emptySnapshot),
    updateOptionGroup: vi.fn().mockResolvedValue(emptySnapshot),
    deleteOptionGroup: vi.fn().mockResolvedValue(emptySnapshot),
    ...overrides,
  };
}

describe("menu catalog store", () => {
  beforeEach(() => {
    setMenuCatalogApiForTests(createApiMock());
  });

  it("loads and exposes catalog snapshot", async () => {
    const store = useMenuCatalogStore();

    await store.loadCatalog();

    expect(store.state.status).toBe("ready");
    expect(store.state.snapshot).toEqual(emptySnapshot);
  });

  it("applies snapshot after category creation", async () => {
    const api = createApiMock();
    setMenuCatalogApiForTests(api);
    const store = useMenuCatalogStore();

    await store.createCategory({ name: "Кофе", optionGroupRefs: [] });

    expect(api.createCategory).toHaveBeenCalledWith({
      name: "Кофе",
      optionGroupRefs: [],
    });
    expect(store.state.snapshot.categories).toEqual(
      categorySnapshot.categories,
    );
  });

  it("delegates item and option group mutations to the api", async () => {
    const api = createApiMock();
    setMenuCatalogApiForTests(api);
    const store = useMenuCatalogStore();

    await store.createItem({
      menuCategoryId: "cat-1",
      name: "Латте",
      itemType: "drink",
      drinkSizePrices: [
        { size: "S", price: 200 },
        { size: "M", price: 250 },
        { size: "L", price: 300 },
      ],
    });
    await store.updateOptionGroup("group-1", {
      name: "Сиропы",
      selectionMode: "multiple",
      options: [{ name: "Ваниль", priceDelta: 30, availability: true }],
    });
    await store.deleteItem("item-1");

    expect(api.createItem).toHaveBeenCalledWith({
      menuCategoryId: "cat-1",
      name: "Латте",
      itemType: "drink",
      drinkSizePrices: [
        { size: "S", price: 200 },
        { size: "M", price: 250 },
        { size: "L", price: 300 },
      ],
    });
    expect(api.updateOptionGroup).toHaveBeenCalledWith("group-1", {
      name: "Сиропы",
      selectionMode: "multiple",
      options: [{ name: "Ваниль", priceDelta: 30, availability: true }],
    });
    expect(api.deleteItem).toHaveBeenCalledWith("item-1");
    expect(store.state.status).toBe("ready");
  });

  it("keeps backoffice capability errors in state", async () => {
    const error = new MenuCatalogApiError(
      "backoffice-capability-forbidden",
      403,
      "backoffice-capability-forbidden",
    );
    setMenuCatalogApiForTests(
      createApiMock({
        getCatalog: vi.fn().mockRejectedValue(error),
      }),
    );
    const store = useMenuCatalogStore();

    await expect(store.loadCatalog()).rejects.toBe(error);
    expect(store.state.status).toBe("error");
    expect(store.state.errorCode).toBe("backoffice-capability-forbidden");
  });

  it("coalesces concurrent catalog loads", async () => {
    const api = createApiMock({
      getCatalog: vi.fn().mockResolvedValue(categorySnapshot),
    });
    setMenuCatalogApiForTests(api);
    const store = useMenuCatalogStore();

    const firstLoad = store.loadCatalog();
    const secondLoad = store.loadCatalog();

    await expect(firstLoad).resolves.toBe(categorySnapshot);
    await expect(secondLoad).resolves.toBe(categorySnapshot);
    expect(api.getCatalog).toHaveBeenCalledTimes(1);
  });

  it("keeps backend validation code in state", async () => {
    const error = new MenuCatalogApiError(
      "invalid-option-group-rule",
      400,
      "invalid-option-group-rule",
    );
    setMenuCatalogApiForTests(
      createApiMock({
        createOptionGroup: vi.fn().mockRejectedValue(error),
      }),
    );
    const store = useMenuCatalogStore();

    await expect(
      store.createOptionGroup({
        name: "Сиропы",
        selectionMode: "single",
        options: [],
      }),
    ).rejects.toBe(error);
    expect(store.state.status).toBe("error");
    expect(store.state.errorCode).toBe("invalid-option-group-rule");

    resetMenuCatalogStore();
  });
});
