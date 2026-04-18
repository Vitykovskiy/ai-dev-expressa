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
            Создать товар
          </MenuActionButton>
          <MenuActionButton
            data-testid="create-addon-group"
            variant="secondary"
            @click="createAddonGroup"
          >
            Создать группу допов
          </MenuActionButton>
          <MenuActionButton variant="ghost" @click="goBackToCategories">
            К категориям
          </MenuActionButton>
        </div>
      </template>
    </MenuSectionHeader>

    <v-row v-if="products.length > 0">
      <v-col v-for="product in products" :key="product.menuItemId" cols="12" lg="6">
        <MenuSurfaceCard class="product-card" data-testid="menu-product-card" full-height>
          <div class="product-card__chips">
            <MenuBadge>
              {{ product.itemType === 'drink' ? 'Напиток' : 'Товар' }}
            </MenuBadge>
            <MenuBadge tone="neutral">{{ priceSummary(product) }}</MenuBadge>
          </div>

          <h4 class="product-card__title">{{ product.name }}</h4>
          <p class="product-card__text">
            Категория наследует {{ optionGroups.length }} групп дополнительных опций, поэтому
            карточка товара опирается на них без локальных переопределений.
          </p>

          <div class="product-card__actions">
            <MenuActionButton @click="openProduct(product.menuItemId)">
              Открыть карточку
            </MenuActionButton>
          </div>
        </MenuSurfaceCard>
      </v-col>
    </v-row>

    <MenuEmptyState
      v-else
      class="product-empty"
      label="Категория пока без товаров"
      text="Навигация к категории уже работает, а детальное наполнение и редакторы будут дополняться в следующем шаге."
      title="Снимок каталога не содержит позиций для этой категории"
    />

    <MenuSurfaceCard v-if="optionGroups.length > 0" class="product-groups">
      <p class="product-groups__label">Наследуемые группы дополнительных опций</p>
      <div class="product-groups__buttons">
        <MenuActionButton
          v-for="optionGroup in optionGroups"
          :key="optionGroup.optionGroupId"
          size="compact"
          variant="ghost"
          @click="openAddonGroup(optionGroup.optionGroupId)"
        >
          {{ optionGroup.name }}
        </MenuActionButton>
      </div>
    </MenuSurfaceCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuBadge from '../components/menu/MenuBadge.vue';
import MenuEmptyState from '../components/menu/MenuEmptyState.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import MenuSurfaceCard from '../components/menu/MenuSurfaceCard.vue';
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
const headerText =
  'Список строится по `menuCategoryId` выбранной категории. Для каждого товара отображается тип, ценовая модель и inherited-связь с группами дополнительных опций.';

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

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-start;
  }
}

.product-card {
  display: grid;
  gap: 1rem;

  &__chips,
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.4vw, 1.65rem);
    font-weight: 800;
  }

  &__text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }
}

.product-groups {
  display: grid;
  gap: 0.75rem;
}

.product-groups__label {
  margin: 0;
  color: var(--expressa-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-groups__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
