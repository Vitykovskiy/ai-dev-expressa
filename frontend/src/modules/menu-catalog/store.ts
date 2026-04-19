import { reactive, readonly } from "vue";
import {
  createMenuCatalogApi,
  MenuCatalogApiError,
  type MenuCatalogClient,
} from "./api";
import type {
  MenuCatalogSnapshot,
  MenuCatalogState,
  MenuCategoryPayload,
  MenuItemPayload,
  OptionGroupPayload,
} from "./types";

const emptySnapshot: MenuCatalogSnapshot = {
  categories: [],
  items: [],
  optionGroups: [],
};

const state = reactive<MenuCatalogState>({
  status: "idle",
  snapshot: emptySnapshot,
  errorCode: null,
});

let api: MenuCatalogClient = createMenuCatalogApi();
let pendingLoad: Promise<MenuCatalogSnapshot> | null = null;

export function useMenuCatalogStore() {
  return {
    state: readonly(state),
    loadCatalog,
    createCategory,
    updateCategory,
    deleteCategory,
    createItem,
    updateItem,
    deleteItem,
    createOptionGroup,
    updateOptionGroup,
    deleteOptionGroup,
  };
}

export function setMenuCatalogApiForTests(nextApi: MenuCatalogClient): void {
  api = nextApi;
  resetMenuCatalogStore();
}

export function resetMenuCatalogStore(): void {
  state.status = "idle";
  state.snapshot = emptySnapshot;
  state.errorCode = null;
  pendingLoad = null;
}

export async function loadCatalog(): Promise<MenuCatalogSnapshot> {
  if (state.status === "ready") {
    return state.snapshot;
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  state.status = "loading";
  state.errorCode = null;
  pendingLoad = api
    .getCatalog()
    .then(applySnapshot)
    .catch(handleError)
    .finally(() => {
      pendingLoad = null;
    });

  return pendingLoad;
}

export async function createCategory(
  payload: MenuCategoryPayload,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.createCategory(payload));
}

export async function updateCategory(
  menuCategoryId: string,
  payload: MenuCategoryPayload,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.updateCategory(menuCategoryId, payload));
}

export async function deleteCategory(
  menuCategoryId: string,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.deleteCategory(menuCategoryId));
}

export async function createItem(
  payload: MenuItemPayload,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.createItem(payload));
}

export async function updateItem(
  menuItemId: string,
  payload: MenuItemPayload,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.updateItem(menuItemId, payload));
}

export async function deleteItem(
  menuItemId: string,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.deleteItem(menuItemId));
}

export async function createOptionGroup(
  payload: OptionGroupPayload,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.createOptionGroup(payload));
}

export async function updateOptionGroup(
  optionGroupId: string,
  payload: OptionGroupPayload,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.updateOptionGroup(optionGroupId, payload));
}

export async function deleteOptionGroup(
  optionGroupId: string,
): Promise<MenuCatalogSnapshot> {
  return save(() => api.deleteOptionGroup(optionGroupId));
}

async function save(
  operation: () => Promise<MenuCatalogSnapshot>,
): Promise<MenuCatalogSnapshot> {
  state.status = "saving";
  state.errorCode = null;

  return operation().then(applySnapshot).catch(handleError);
}

function applySnapshot(snapshot: MenuCatalogSnapshot): MenuCatalogSnapshot {
  state.snapshot = snapshot;
  state.status = "ready";
  state.errorCode = null;
  return snapshot;
}

function handleError(error: unknown): never {
  state.status = "error";
  state.errorCode =
    error instanceof MenuCatalogApiError
      ? error.code
      : "menu-catalog-request-failed";
  throw error;
}
