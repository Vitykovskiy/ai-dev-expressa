import { MenuCatalogService } from '../src/modules/menu/application/services/menu-catalog.service';
import { InMemoryMenuCatalogRepository } from '../src/modules/menu/infrastructure/persistence/in-memory-menu-catalog.repository';

describe('MenuCatalogService', () => {
  const createService = () => new MenuCatalogService(new InMemoryMenuCatalogRepository());

  it('saves a normalized catalog snapshot', async () => {
    const service = createService();

    const result = await service.saveCatalog({
      categories: [
        {
          menuCategoryId: ' coffee ',
          name: ' Кофе ',
          optionGroupRefs: [' milk ', 'milk', 'syrup'],
        },
      ],
      items: [
        {
          menuItemId: 'latte',
          menuCategoryId: ' coffee ',
          name: ' Латте ',
          itemType: 'drink',
          basePrice: null,
          sizePrices: [
            { size: 'L', price: 260 },
            { size: 'S', price: 180 },
            { size: 'M', price: 220 },
          ],
        },
      ],
      optionGroups: [
        {
          optionGroupId: 'milk',
          name: ' Молоко ',
          selectionMode: 'single',
          options: [
            {
              optionId: 'oat',
              name: ' Овсяное ',
              priceDelta: 40,
            },
          ],
        },
        {
          optionGroupId: 'syrup',
          name: ' Сироп ',
          selectionMode: 'multiple',
          options: [
            {
              optionId: 'vanilla',
              name: ' Ваниль ',
              priceDelta: 20,
            },
          ],
        },
      ],
    });

    expect(result).toEqual({
      categories: [
        {
          menuCategoryId: 'coffee',
          name: 'Кофе',
          optionGroupRefs: ['milk', 'syrup'],
        },
      ],
      items: [
        {
          menuItemId: 'latte',
          menuCategoryId: 'coffee',
          name: 'Латте',
          itemType: 'drink',
          basePrice: null,
          sizePrices: [
            { size: 'S', price: 180 },
            { size: 'M', price: 220 },
            { size: 'L', price: 260 },
          ],
        },
      ],
      optionGroups: [
        {
          optionGroupId: 'milk',
          name: 'Молоко',
          selectionMode: 'single',
          options: [{ optionId: 'oat', name: 'Овсяное', priceDelta: 40 }],
        },
        {
          optionGroupId: 'syrup',
          name: 'Сироп',
          selectionMode: 'multiple',
          options: [{ optionId: 'vanilla', name: 'Ваниль', priceDelta: 20 }],
        },
      ],
    });
  });

  it('rejects drink items without the full S/M/L price model', async () => {
    const service = createService();

    await expect(
      service.saveCatalog({
        categories: [
          {
            menuCategoryId: 'coffee',
            name: 'Кофе',
            optionGroupRefs: [],
          },
        ],
        items: [
          {
            menuItemId: 'espresso-tonic',
            menuCategoryId: 'coffee',
            name: 'Эспрессо-тоник',
            itemType: 'drink',
            basePrice: null,
            sizePrices: [
              { size: 'S', price: 200 },
              { size: 'M', price: 240 },
            ],
          },
        ],
        optionGroups: [],
      }),
    ).rejects.toMatchObject({
      payload: {
        statusCode: 422,
        reason: 'invalid-drink-size-model',
      },
    });
  });

  it('rejects option groups that are not assigned to a menu category', async () => {
    const service = createService();

    await expect(
      service.saveCatalog({
        categories: [
          {
            menuCategoryId: 'desserts',
            name: 'Десерты',
            optionGroupRefs: [],
          },
        ],
        items: [
          {
            menuItemId: 'brownie',
            menuCategoryId: 'desserts',
            name: 'Брауни',
            itemType: 'product',
            basePrice: 190,
            sizePrices: [],
          },
        ],
        optionGroups: [
          {
            optionGroupId: 'toppings',
            name: 'Топпинги',
            selectionMode: 'multiple',
            options: [
              {
                optionId: 'chocolate',
                name: 'Шоколад',
                priceDelta: 30,
              },
            ],
          },
        ],
      }),
    ).rejects.toMatchObject({
      payload: {
        statusCode: 422,
        reason: 'invalid-option-group-rule',
      },
    });
  });
});
