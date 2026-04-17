<template>
  <div class="product-detail">
    <section class="product-detail__header">
      <div>
        <p class="product-detail__label">menu.menu_product_detail</p>
        <h3 class="product-detail__title">{{ product?.name ?? 'Карточка товара' }}</h3>
        <p class="product-detail__text">
          Карточка показывает текущий серверный снимок товара и подготавливает устойчивую точку
          входа для редактора `FE-005`.
        </p>
      </div>

      <div class="product-detail__actions">
        <v-btn variant="text" color="primary" @click="goBackToProducts">К списку товаров</v-btn>
      </div>
    </section>

    <v-row>
      <v-col cols="12" lg="7">
        <v-card class="detail-card" rounded="xl">
          <div class="detail-card__chips">
            <v-chip color="primary" variant="tonal">
              {{ product?.itemType === 'drink' ? 'Напиток' : 'Товар без обязательного размера' }}
            </v-chip>
            <v-chip v-if="category" color="secondary" variant="tonal">
              Категория: {{ category.name }}
            </v-chip>
          </div>

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

          <div v-else class="detail-card__single-price">
            <span class="detail-card__single-price-label">Базовая цена</span>
            <strong>{{ product?.basePrice ?? '—' }} ₽</strong>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="detail-card detail-card--note" rounded="xl">
          <p class="detail-card__note-label">Следующий шаг</p>
          <h4 class="detail-card__note-title">Редактор формы будет опираться на этот маршрут</h4>
          <p class="detail-card__note-text">
            В `FE-004` маршрут уже связан с данными каталога и выбранной категорией. `FE-005`
            сможет переиспользовать тот же снимок и сохранить изменения через единый store.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="detail-card" rounded="xl" v-if="optionGroups.length > 0">
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  createMenuAddonGroupDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  findMenuCatalogProduct,
  menuCatalogStore,
  resolveMenuCategoryOptionGroups,
} from '../stores/menu-catalog-store';

const router = useRouter();
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const productId = computed(() => menuCatalogStore.state.selection.productId);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const product = computed(() =>
  findMenuCatalogProduct(menuCatalogStore.state.catalog, productId.value),
);
const optionGroups = computed(() =>
  resolveMenuCategoryOptionGroups(menuCatalogStore.state.catalog, categoryId.value),
);

function goBackToProducts() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuProductsRoute(categoryId.value));
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

  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: end;
    justify-content: space-between;
  }

  &__label,
  .detail-card__note-label,
  .detail-card__section-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title,
  .detail-card__note-title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.5vw, 1.7rem);
    font-weight: 800;
  }

  &__text,
  .detail-card__note-text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }
}

.detail-card {
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);
  padding: 1.25rem;

  &__chips,
  &__sizes,
  &__group-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__sizes {
    margin-top: 1rem;
  }

  &__size-item,
  &__single-price {
    min-width: 8rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 1rem;
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.9), rgba(255, 255, 255, 0.96));
  }

  &__size-label,
  &__single-price-label {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--expressa-muted);
    font-size: 0.8rem;
  }

  &__note-title,
  &__note-text {
    max-width: 26rem;
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
    border-radius: 1rem;
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
