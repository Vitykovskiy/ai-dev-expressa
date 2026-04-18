<template>
  <div class="product-detail">
    <MenuSectionHeader
      label="menu.menu_product_detail"
      text="Форма меняет товар в общем черновике структурного снимка. Сохранение на сервер выполняет панель вкладки `menu`."
      :title="pageTitle"
      title-test-id="page-title"
    >
      <template #actions>
        <MenuActionButton variant="ghost" @click="goBackToProducts">
          К списку товаров
        </MenuActionButton>
      </template>
    </MenuSectionHeader>

    <MenuSurfaceCard
      v-if="draftMessage"
      class="product-detail__draft"
      data-testid="product-draft-message"
      variant="subtle"
    >
      <MenuBadge size="compact">Черновик обновлён</MenuBadge>
      <p class="product-detail__draft-text">{{ draftMessage }}</p>
    </MenuSurfaceCard>

    <v-row>
      <v-col cols="12" lg="7">
        <MenuSurfaceCard class="detail-card" full-height>
          <MenuProductEditorForm
            :category-name="category?.name ?? null"
            :mode="isCreateMode ? 'create' : 'edit'"
            :product="product"
            @cancel="goBackToProducts"
            @submit="submitProduct"
          />
        </MenuSurfaceCard>
      </v-col>

      <v-col cols="12" lg="5">
        <MenuSurfaceCard class="detail-card detail-card--summary" full-height>
          <MenuSectionHeader
            label="Ценовая модель"
            text="Для товара используется одна базовая цена. Для напитка форма подготавливает цены размеров S, M и L без локального переопределения серверных правил."
            :title="priceModelTitle"
          />

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
        </MenuSurfaceCard>
      </v-col>
    </v-row>

    <MenuSurfaceCard v-if="optionGroups.length > 0" class="detail-card">
      <MenuSectionHeader
        label="Наследуемые группы дополнительных опций"
        title="Группы доступны товару через категорию"
      />
      <div class="detail-card__group-list">
        <MenuListRow
          v-for="optionGroup in optionGroups"
          :key="optionGroup.optionGroupId"
          interactive
          tag="button"
          @click="openAddonGroup(optionGroup.optionGroupId)"
        >
          <span>{{ optionGroup.name }}</span>
          <template #meta>
            {{ optionGroup.selectionMode === 'single' ? 'Один выбор' : 'Множественный выбор' }}
          </template>
        </MenuListRow>
      </div>
    </MenuSurfaceCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MenuProductEditorForm from '../components/MenuProductEditorForm.vue';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuBadge from '../components/menu/MenuBadge.vue';
import MenuListRow from '../components/menu/MenuListRow.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import MenuSurfaceCard from '../components/menu/MenuSurfaceCard.vue';
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

  &__draft {
    display: grid;
    gap: 0.75rem;
  }

  &__draft-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
  }
}

.detail-card {
  display: grid;
  gap: 1rem;

  &__sizes,
  &__group-list {
    display: grid;
    gap: 0.75rem;
  }

  &__sizes,
  &__single-price {
    margin-top: 0.25rem;
  }

  &__size-item,
  &__single-price {
    min-width: 8rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-md);
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.9), rgba(255, 255, 255, 0.96));
  }

  &__size-label,
  &__single-price-label {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--expressa-muted);
    font-size: 0.8rem;
  }
}
</style>
