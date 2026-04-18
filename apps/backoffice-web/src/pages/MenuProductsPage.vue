<template>
  <div class="menu-products">
    <MenuSectionHeader
      label="menu.menu_products"
      :text="headerText"
      :title="categoryTitle"
      title-test-id="page-title"
    >
      <template #actions>
        <div class="menu-products__actions">
          <MenuActionButton data-testid="create-product" @click="createProduct">
            Добавить товар
          </MenuActionButton>
          <MenuActionButton data-testid="back-to-categories" variant="ghost" @click="goBackToCategories">
            К категориям
          </MenuActionButton>
        </div>
      </template>
    </MenuSectionHeader>

    <MenuCategoryProductsList
      :category-name="category?.name ?? null"
      :option-groups="optionGroupCards"
      :products="productCards"
      @create-addon-group="createAddonGroup"
      @create-product="createProduct"
      @open-addon-group="openAddonGroup"
      @open-product="openProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MenuCategoryProductsList from '../components/MenuCategoryProductsList.vue';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
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
const categoryTitle = computed(() => category.value?.name ?? 'Товары категории');
const productCards = computed(() =>
  products.value.map((product) => ({
    productId: product.menuItemId,
    name: product.name,
    itemTypeLabel: product.itemType === 'drink' ? 'Напиток' : 'Товар',
    itemTypeShortLabel: product.itemType === 'drink' ? 'S/M/L' : '₽',
    priceSummary: resolveMenuProductPriceSummary(product),
  })),
);
const optionGroupCards = computed(() =>
  optionGroups.value.map((optionGroup) => ({
    optionGroupId: optionGroup.optionGroupId,
    name: optionGroup.name,
  })),
);
const headerText = computed(() => {
  if (!category.value) {
    return 'Откройте категорию из дерева menu, чтобы просмотреть её товары и продолжить работу с общим черновиком.';
  }

  if (products.value.length === 0) {
    return 'Категория уже выбрана. Добавьте первую позицию или вернитесь к дереву категорий без смены общего черновика вкладки `menu`.';
  }

  return 'Откройте строку товара, чтобы перейти в карточку, или добавьте новую позицию в общий черновик выбранной категории.';
});

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

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-start;
  }
}
</style>
