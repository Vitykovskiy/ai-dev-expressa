<template>
  <div class="menu-products">
    <section class="menu-products__header">
      <div>
        <p class="menu-products__label">menu.menu_products</p>
        <h3 class="menu-products__title" data-testid="page-title">{{ categoryTitle }}</h3>
        <p class="menu-products__text">
          Список строится по `menuCategoryId` выбранной категории. Для каждого товара отображается
          тип, ценовая модель и inherited-связь с группами дополнительных опций.
        </p>
      </div>

      <div class="menu-products__actions">
        <v-btn
          color="primary"
          variant="flat"
          data-testid="create-product"
          @click="createProduct"
        >
          Создать товар
        </v-btn>
        <v-btn variant="text" color="primary" @click="goBackToCategories">К категориям</v-btn>
      </div>
    </section>

    <v-row v-if="products.length > 0">
      <v-col v-for="product in products" :key="product.menuItemId" cols="12" lg="6">
        <v-card class="product-card" rounded="xl" data-testid="menu-product-card">
          <div class="product-card__chips">
            <v-chip color="primary" variant="tonal">
              {{ product.itemType === 'drink' ? 'Напиток' : 'Товар' }}
            </v-chip>
            <v-chip color="secondary" variant="tonal">{{ priceSummary(product) }}</v-chip>
          </div>

          <h4 class="product-card__title">{{ product.name }}</h4>
          <p class="product-card__text">
            Категория наследует {{ optionGroups.length }} групп дополнительных опций, поэтому
            карточка товара опирается на них без локальных переопределений.
          </p>

          <div class="product-card__actions">
            <v-btn
              color="primary"
              variant="flat"
              @click="openProduct(product.menuItemId)"
            >
              Открыть карточку
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-else class="product-empty" rounded="xl">
      <p class="product-empty__label">Категория пока без товаров</p>
      <h4 class="product-empty__title">Снимок каталога не содержит позиций для этой категории</h4>
      <p class="product-empty__text">
        Навигация к категории уже работает, а детальное наполнение и редакторы будут дополняться в
        следующем шаге.
      </p>
    </v-card>

    <v-card v-if="optionGroups.length > 0" class="product-groups" rounded="xl">
      <p class="product-groups__label">Наследуемые группы дополнительных опций</p>
      <div class="product-groups__buttons">
        <v-btn
          v-for="optionGroup in optionGroups"
          :key="optionGroup.optionGroupId"
          variant="text"
          color="primary"
          @click="openAddonGroup(optionGroup.optionGroupId)"
        >
          {{ optionGroup.name }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  createMenuAddonGroupDetailRoute,
  createMenuCategoriesRoute,
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

  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: end;
    justify-content: space-between;
  }

  &__label,
  .product-empty__label,
  .product-groups__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title,
  .product-card__title,
  .product-empty__title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.4vw, 1.65rem);
    font-weight: 800;
  }

  &__text,
  .product-card__text,
  .product-empty__text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }
}

.product-card,
.product-empty,
.product-groups {
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);
}

.product-card {
  display: grid;
  gap: 1rem;
  height: 100%;
  padding: 1.25rem;

  &__chips,
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

.product-empty,
.product-groups {
  padding: 1.25rem;
}

.product-groups__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
</style>
