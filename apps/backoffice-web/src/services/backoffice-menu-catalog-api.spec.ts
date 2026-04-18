import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import {
  BackofficeMenuCatalogApi,
  normalizeBackofficeMenuCatalogError,
} from './backoffice-menu-catalog-api';

function createCatalogSnapshot(): MenuCatalogSnapshot {
  return {
    categories: [
      {
        menuCategoryId: 'cat-coffee',
        name: 'Кофе',
        optionGroupRefs: ['group-milk'],
      },
    ],
    items: [
      {
        menuItemId: 'item-latte',
        menuCategoryId: 'cat-coffee',
        name: 'Латте',
        itemType: 'drink',
        basePrice: null,
        sizePrices: [
          { size: 'S', price: 190 },
          { size: 'M', price: 230 },
          { size: 'L', price: 270 },
        ],
      },
    ],
    optionGroups: [
      {
        optionGroupId: 'group-milk',
        name: 'Молоко',
        selectionMode: 'single',
        options: [
          {
            optionId: 'option-oat',
            name: 'Овсяное',
            priceDelta: 40,
          },
        ],
      },
    ],
  };
}

describe('BackofficeMenuCatalogApi', () => {
  it('requests the menu catalog with a bearer token', async () => {
    const response = createCatalogSnapshot();
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const api = new BackofficeMenuCatalogApi('http://localhost:3000/api', fetchMock);

    const result = await api.getCatalog('access-token');

    expect(result).toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/backoffice/menu/catalog',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it('saves the current structural snapshot through PUT /api/backoffice/menu/catalog', async () => {
    const snapshot = createCatalogSnapshot();
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const api = new BackofficeMenuCatalogApi('http://localhost:3000/api', fetchMock);

    const result = await api.saveCatalog('access-token', snapshot);

    expect(result).toEqual(snapshot);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/backoffice/menu/catalog',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(snapshot),
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it('normalizes contract errors returned by the menu catalog endpoints', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 422,
          reason: 'invalid-drink-size-model',
          message: 'Drink size model is invalid',
        }),
        {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    const api = new BackofficeMenuCatalogApi('http://localhost:3000/api', fetchMock);

    await expect(api.saveCatalog('access-token', createCatalogSnapshot())).rejects.toEqual({
      statusCode: 422,
      reason: 'invalid-drink-size-model',
      message: 'Drink size model is invalid',
    });

    expect(
      normalizeBackofficeMenuCatalogError({
        statusCode: 422,
        reason: 'invalid-drink-size-model',
        message: 'Drink size model is invalid',
      }),
    ).toEqual({
      statusCode: 422,
      reason: 'invalid-drink-size-model',
      message: 'Drink size model is invalid',
    });
  });

  it('supports a relative /api base URL for menu catalog requests', async () => {
    const snapshot = createCatalogSnapshot();
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const api = new BackofficeMenuCatalogApi('/api', fetchMock);

    await api.getCatalog('access-token');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backoffice/menu/catalog',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });
});
