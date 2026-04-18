<template>
  <div class="product-detail">
    <MenuPageHeader
      label="menu.menu_product_detail"
      text="Форма меняет товар в общем черновике структурного снимка. Сохранение на сервер выполняет панель вкладки `menu`."
      :title="pageTitle"
    >
      <template #actions>
        <Button variant="ghost" @click="goBackToProducts">К списку товаров</Button>
      </template>
    </MenuPageHeader>

    <v-alert
      v-if="draftMessage"
      class="product-detail__alert"
      color="primary"
      data-testid="product-draft-message"
      variant="tonal"
    >
      {{ draftMessage }}
    </v-alert>

    <v-row>
      <v-col cols="12" lg="7">
        <v-card class="detail-card" rounded="lg">
          <MenuProductEditorForm
            :category-name="category?.name ?? null"
            :mode="isCreateMode ? 'create' : 'edit'"
            :product="product"
            @cancel="goBackToProducts"
            @submit="submitProduct"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="detail-card detail-card--summary" rounded="lg">
          <p class="detail-card__section-label">Ценовая модель</p>
          <h4 class="detail-card__summary-title">{{ priceModelTitle }}</h4>
          <p class="detail-card__summary-text">
            Для товара используется одна базовая цена. Для напитка форма подготавливает цены
            размеров S, M и L без локального переопределения серверных правил.
          </p>

          <div v-if="product?.itemType === 'drink'" class="detail-card__sizes">
            <div
              v-for="sizePrice in product.sizePrices"
              :key="sizePrice.size"
              class="detail-card__size-item"
            >
              <span class="detail-card__size-label">{{ sizePrice.size }}</span>
              <strong>{{ sizePrice.price }} ₽</strong>
            </div>
          </div>

          <div v-else-if="product" class="detail-card__single-price">
            <span class="detail-card__single-price-label">Базовая цена</span>
            <strong>{{ product.basePrice ?? '—' }} ₽</strong>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-if="optionGroups.length > 0" class="detail-card" rounded="lg">
      <p class="detail-card__section-label">Наследуемые группы дополнительных опций</p>
      <div class="detail-card__group-list">
        <button
          v-for="optionGroup in optionGroups"
          :key="optionGroup.optionGroupId"
          type="button"
          class="detail-card__group-button"
          @click="openAddonGroup(optionGroup.optionGroupId)"
        >
          <span>{{ optionGroup.name }}</span>
          <small>
            {{ optionGroup.selectionMode === 'single' ? 'Один выбор' : 'Множественный выбор' }}
          </small>
        </button>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '../components/base';
import { MenuPageHeader, MenuProductEditorForm } from '../components/menu';
import {
  NEW_MENU_PRODUCT_ID,
  createMenuAddonGroupDetailRoute,
  createMenuProductDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  findMenuCatalogProduct,
  menuCatalogStore,
  resolveMenuCategoryOptionGroups,
} from '../stores/menu-catalog-store';
import type { MenuCatalogProductDraft } from '../types';

const route = useRoute();
const router = useRouter();
const draftMessage = ref<string | null>(null);
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const routeProductId = computed(() =>
  typeof route.params.productId === 'string' ? route.params.productId : null,
);
const isCreateMode = computed(() => routeProductId.value === NEW_MENU_PRODUCT_ID);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const product = computed(() =>
  isCreateMode.value
    ? null
    : findMenuCatalogProduct(menuCatalogStore.state.catalog, routeProductId.value),
);
const optionGroups = computed(() =>
  resolveMenuCategoryOptionGroups(menuCatalogStore.state.catalog, categoryId.value),
);
const pageTitle = computed(() => {
  if (isCreateMode.value) {
    return 'Новый товар';
  }

  return product.value?.name ?? 'Карточка товара';
});
const priceModelTitle = computed(() => {
  if (!product.value) {
    return 'Новая позиция ещё не добавлена в черновик';
  }

  return product.value.itemType === 'drink'
    ? 'Напиток с ценами S/M/L'
    : 'Товар без обязательного размера';
});

function goBackToProducts() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuProductsRoute(categoryId.value));
}

function submitProduct(productDraft: MenuCatalogProductDraft) {
  if (!categoryId.value) {
    return;
  }

  if (isCreateMode.value) {
    const product = menuCatalogStore.addProduct(categoryId.value, productDraft);

    if (!product) {
      return;
    }

    draftMessage.value = 'Товар добавлен в черновик каталога.';
    void router.replace(createMenuProductDetailRoute(categoryId.value, product.menuItemId));
    return;
  }

  if (!routeProductId.value || !menuCatalogStore.updateProduct(routeProductId.value, productDraft)) {
    return;
  }

  draftMessage.value = 'Товар обновлён в черновике каталога.';
}

function openAddonGroup(optionGroupId: string) {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuAddonGroupDetailRoute(categoryId.value, optionGroupId));
}
</script>

<style scoped lang="scss">
.product-detail {
  display: grid;
  gap: 1rem;
}

.detail-card {
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);
  padding: 1.25rem;

  &__section-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__summary-title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.5vw, 1.7rem);
    font-weight: 800;
  }

  &__summary-text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__sizes,
  &__group-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__sizes,
  &__single-price {
    margin-top: 1rem;
  }

  &__size-item,
  &__single-price {
    min-width: 8rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.9), rgba(255, 255, 255, 0.96));
  }

  &__size-label,
  &__single-price-label {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--expressa-muted);
    font-size: 0.8rem;
  }

  &__group-list {
    margin-top: 0.85rem;
  }

  &__group-button {
    display: grid;
    gap: 0.2rem;
    min-width: 14rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.96);
    color: var(--expressa-text);
    text-align: left;
    cursor: pointer;
  }

  &__group-button small {
    color: var(--expressa-muted);
  }
}
</style>
