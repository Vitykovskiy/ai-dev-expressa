import { getTelegramInitData } from "../auth/telegram";
import type {
  MenuCatalogErrorCode,
  MenuCatalogSnapshot,
  MenuCategoryPayload,
  MenuItemPayload,
  OptionGroupPayload,
} from "./types";

export interface MenuCatalogApiOptions {
  readonly apiBaseUrl?: string;
  readonly testTelegramId?: string;
  readonly initData?: string;
  readonly fetchImpl?: typeof fetch;
}

interface ErrorResponseBody {
  readonly message?: string;
}

export class MenuCatalogApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: MenuCatalogErrorCode,
  ) {
    super(message);
    this.name = "MenuCatalogApiError";
  }
}

export interface MenuCatalogClient {
  getCatalog(): Promise<MenuCatalogSnapshot>;
  createCategory(payload: MenuCategoryPayload): Promise<MenuCatalogSnapshot>;
  updateCategory(
    menuCategoryId: string,
    payload: MenuCategoryPayload,
  ): Promise<MenuCatalogSnapshot>;
  deleteCategory(menuCategoryId: string): Promise<MenuCatalogSnapshot>;
  createItem(payload: MenuItemPayload): Promise<MenuCatalogSnapshot>;
  updateItem(
    menuItemId: string,
    payload: MenuItemPayload,
  ): Promise<MenuCatalogSnapshot>;
  deleteItem(menuItemId: string): Promise<MenuCatalogSnapshot>;
  createOptionGroup(payload: OptionGroupPayload): Promise<MenuCatalogSnapshot>;
  updateOptionGroup(
    optionGroupId: string,
    payload: OptionGroupPayload,
  ): Promise<MenuCatalogSnapshot>;
  deleteOptionGroup(optionGroupId: string): Promise<MenuCatalogSnapshot>;
}

export class MenuCatalogApi implements MenuCatalogClient {
  constructor(private readonly options: MenuCatalogApiOptions = {}) {}

  async getCatalog(): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>("/backoffice/menu/catalog");
  }

  async createCategory(
    payload: MenuCategoryPayload,
  ): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>("/backoffice/menu/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateCategory(
    menuCategoryId: string,
    payload: MenuCategoryPayload,
  ): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>(
      `/backoffice/menu/categories/${menuCategoryId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  }

  async deleteCategory(menuCategoryId: string): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>(
      `/backoffice/menu/categories/${menuCategoryId}`,
      {
        method: "DELETE",
      },
    );
  }

  async createItem(payload: MenuItemPayload): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>("/backoffice/menu/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateItem(
    menuItemId: string,
    payload: MenuItemPayload,
  ): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>(
      `/backoffice/menu/items/${menuItemId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  }

  async deleteItem(menuItemId: string): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>(
      `/backoffice/menu/items/${menuItemId}`,
      {
        method: "DELETE",
      },
    );
  }

  async createOptionGroup(
    payload: OptionGroupPayload,
  ): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>("/backoffice/menu/option-groups", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateOptionGroup(
    optionGroupId: string,
    payload: OptionGroupPayload,
  ): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>(
      `/backoffice/menu/option-groups/${optionGroupId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  }

  async deleteOptionGroup(optionGroupId: string): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>(
      `/backoffice/menu/option-groups/${optionGroupId}`,
      {
        method: "DELETE",
      },
    );
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await (this.options.fetchImpl ?? fetch)(
      this.resolveUrl(path),
      {
        ...init,
        headers: {
          "content-type": "application/json",
          ...this.authHeaders(),
          ...init.headers,
        },
      },
    );

    const body = await readJson(response);
    if (!response.ok) {
      const code = readErrorCode(body);
      throw new MenuCatalogApiError(code, response.status, code);
    }

    return body as T;
  }

  private resolveUrl(path: string): string {
    const base = this.options.apiBaseUrl?.trim();
    return `${base ? base.replace(/\/$/, "") : ""}${path}`;
  }

  private authHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const initData = this.options.initData ?? getTelegramInitData();
    if (initData) {
      headers["x-telegram-init-data"] = initData;
    }

    const testTelegramId = this.options.testTelegramId?.trim();
    if (testTelegramId) {
      headers["x-test-telegram-id"] = testTelegramId;
    }

    return headers;
  }
}

export function createMenuCatalogApi(): MenuCatalogApi {
  return new MenuCatalogApi({
    apiBaseUrl: import.meta.env.VITE_BACKOFFICE_API_BASE_URL,
    testTelegramId: import.meta.env.VITE_BACKOFFICE_TEST_TELEGRAM_ID,
  });
}

function readErrorCode(body: unknown): MenuCatalogErrorCode {
  if (isErrorResponseBody(body) && typeof body.message === "string") {
    return body.message as MenuCatalogErrorCode;
  }

  return "menu-catalog-request-failed";
}

function isErrorResponseBody(value: unknown): value is ErrorResponseBody {
  return typeof value === "object" && value !== null && "message" in value;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
