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
