import type {
  BackofficeMenuCatalogResponse,
  BackofficeUpdateMenuCatalogRequest,
  DrinkSize,
  MenuCatalogErrorResponse,
  MenuCatalogItemType,
  MenuCatalogSnapshot,
  OptionGroupSelectionMode,
} from '@expressa/shared-types';
import type { MenuCatalogError } from '../types';

type FetchLike = typeof fetch;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNumberOrNull(value: unknown): value is number | null {
  return value === null || typeof value === 'number';
}

function isDrinkSize(value: unknown): value is DrinkSize {
  return value === 'S' || value === 'M' || value === 'L';
}

function isMenuCatalogItemType(value: unknown): value is MenuCatalogItemType {
  return value === 'product' || value === 'drink';
}

function isOptionGroupSelectionMode(value: unknown): value is OptionGroupSelectionMode {
  return value === 'single' || value === 'multiple';
}

function isMenuCatalogSnapshot(value: unknown): value is MenuCatalogSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  const { categories, items, optionGroups } = value;

  return (
    Array.isArray(categories) &&
    categories.every(
      (category) =>
        isRecord(category) &&
        typeof category.menuCategoryId === 'string' &&
        typeof category.name === 'string' &&
        isStringArray(category.optionGroupRefs),
    ) &&
    Array.isArray(items) &&
    items.every(
      (item) =>
        isRecord(item) &&
        typeof item.menuItemId === 'string' &&
        typeof item.menuCategoryId === 'string' &&
        typeof item.name === 'string' &&
        isMenuCatalogItemType(item.itemType) &&
        isNumberOrNull(item.basePrice) &&
        Array.isArray(item.sizePrices) &&
        item.sizePrices.every(
          (sizePrice) =>
            isRecord(sizePrice) &&
            isDrinkSize(sizePrice.size) &&
            typeof sizePrice.price === 'number',
        ),
    ) &&
    Array.isArray(optionGroups) &&
    optionGroups.every(
      (optionGroup) =>
        isRecord(optionGroup) &&
        typeof optionGroup.optionGroupId === 'string' &&
        typeof optionGroup.name === 'string' &&
        isOptionGroupSelectionMode(optionGroup.selectionMode) &&
        Array.isArray(optionGroup.options) &&
        optionGroup.options.every(
          (option) =>
            isRecord(option) &&
            typeof option.optionId === 'string' &&
            typeof option.name === 'string' &&
            typeof option.priceDelta === 'number',
        ),
    )
  );
}

function isMenuCatalogErrorResponse(value: unknown): value is MenuCatalogErrorResponse {
  return (
    isRecord(value) &&
    typeof value.statusCode === 'number' &&
    typeof value.reason === 'string' &&
    typeof value.message === 'string'
  );
}

async function readJson(response: Response): Promise<unknown> {
  const payload = await response.text();

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
}

function createUnexpectedResponseError(statusCode: number, message: string): MenuCatalogError {
  return {
    statusCode,
    reason: 'unexpected-response',
    message,
  };
}

export function normalizeBackofficeMenuCatalogError(error: unknown): MenuCatalogError {
  if (isMenuCatalogErrorResponse(error)) {
    return {
      statusCode: error.statusCode,
      reason: error.reason,
      message: error.message,
    };
  }

  if (error instanceof TypeError) {
    return {
      statusCode: 0,
      reason: 'network-error',
      message: error.message || 'Network request failed',
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 0,
      reason: 'unexpected-response',
      message: error.message || 'Unexpected client error',
    };
  }

  return createUnexpectedResponseError(0, 'Unexpected client error');
}

export class BackofficeMenuCatalogApi {
  constructor(
    private readonly apiBaseUrl: string,
    private readonly fetchImpl: FetchLike = fetch.bind(globalThis),
  ) {}

  getCatalog(accessToken: string): Promise<BackofficeMenuCatalogResponse> {
    return this.request<BackofficeMenuCatalogResponse>('/api/backoffice/menu/catalog', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  saveCatalog(
    accessToken: string,
    request: BackofficeUpdateMenuCatalogRequest,
  ): Promise<MenuCatalogSnapshot> {
    return this.request<MenuCatalogSnapshot>('/api/backoffice/menu/catalog', {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.fetchImpl(`${this.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
    const payload = await readJson(response);

    if (!response.ok) {
      if (isMenuCatalogErrorResponse(payload)) {
        throw payload;
      }

      throw createUnexpectedResponseError(response.status, `Unexpected response for ${path}`);
    }

    if (!isMenuCatalogSnapshot(payload)) {
      throw createUnexpectedResponseError(response.status, `Response payload for ${path} is invalid`);
    }

    return payload as T;
  }
}
