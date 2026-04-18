<template>
  <div class="menu-products">
    <MenuPageHeader
      label="menu.menu_products"
      text="Список строится по `menuCategoryId` выбранной категории. Для каждого товара отображается тип, ценовая модель и inherited-связь с группами дополнительных опций."
      :title="categoryTitle"
    >
      <template #actions>
        <Button data-testid="create-product" @click="createProduct">Создать товар</Button>
        <Button
          data-testid="create-addon-group"
          variant="secondary"
          @click="createAddonGroup"
        >
          Создать группу допов
        </Button>
        <Button variant="ghost" @click="goBackToCategories">К категориям</Button>
      </template>
    </MenuPageHeader>

    <MenuProductList
      :option-groups="optionGroups"
      :price-summary="priceSummary"
      :products="products"
      @open-addon-group="openAddonGroup"
      @open-product="openProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '../components/base';
import { MenuPageHeader, MenuProductList } from '../components/menu';
import {
  createMenuAddonGroupDetailRoute,
  createMenuCategoriesRoute,
  createMenuNewAddonGroupRoute,
  createMenuNewProductRoute,
  createMenuProductDetailRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  menuCatalogStore,
  resolveMenuCategoryOptionGroups,
  resolveMenuCategoryProducts,
  resolveMenuProductPriceSummary,
} from '../stores/menu-catalog-store';

const router = useRouter();
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const products = computed(() =>
  resolveMenuCategoryProducts(menuCatalogStore.state.catalog, categoryId.value),
);
const optionGroups = computed(() =>
  resolveMenuCategoryOptionGroups(menuCatalogStore.state.catalog, categoryId.value),
);
const categoryTitle = computed(() =>
  category.value ? `Товары категории «${category.value.name}»` : 'Товары категории',
);

function priceSummary(product: Parameters<typeof resolveMenuProductPriceSummary>[0]) {
  return resolveMenuProductPriceSummary(product);
}

function goBackToCategories() {
  void router.push(createMenuCategoriesRoute());
}

function openProduct(productId: string) {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuProductDetailRoute(categoryId.value, productId));
}

function createProduct() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuNewProductRoute(categoryId.value));
}

function createAddonGroup() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuNewAddonGroupRoute(categoryId.value));
}

function openAddonGroup(optionGroupId: string) {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuAddonGroupDetailRoute(categoryId.value, optionGroupId));
}
</script>

<style scoped lang="scss">
.menu-products {
  display: grid;
  gap: 1rem;
}
</style>
