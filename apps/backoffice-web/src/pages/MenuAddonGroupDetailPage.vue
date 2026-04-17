<template>
  <div class="addon-detail">
    <section class="addon-detail__header">
      <div>
        <p class="addon-detail__label">menu.addon_group_detail</p>
        <h3 class="addon-detail__title" data-testid="page-title">
          {{ optionGroup?.name ?? 'Группа дополнительных опций' }}
        </h3>
        <p class="addon-detail__text">
          Группа привязана к категории и наследуется всеми товарами этой категории. Карточка
          показывает текущее правило выбора и состав опций.
        </p>
      </div>

      <div class="addon-detail__actions">
        <v-btn variant="text" color="primary" @click="goBackToProducts">К товарам категории</v-btn>
      </div>
    </section>

    <v-row>
      <v-col cols="12" lg="4">
        <v-card class="addon-card" rounded="xl">
          <p class="addon-card__label">Привязка к категории</p>
          <h4 class="addon-card__title">{{ category?.name ?? 'Категория не выбрана' }}</h4>
          <p class="addon-card__text">
            Группу наследуют {{ inheritedProducts }} товаров из выбранной категории.
          </p>
          <v-chip color="primary" variant="tonal">
            {{ optionGroup?.selectionMode === 'single' ? 'Взаимоисключающий выбор' : 'Множественный выбор' }}
          </v-chip>
        </v-card>
      </v-col>

      <v-col cols="12" lg="8">
        <v-card class="addon-card" rounded="xl" data-testid="addon-group-detail">
          <p class="addon-card__label">Состав группы</p>
          <div class="addon-card__options">
            <div
              v-for="option in optionGroup?.options ?? []"
              :key="option.optionId"
              class="addon-card__option"
            >
              <div>
                <strong>{{ option.name }}</strong>
                <p class="addon-card__option-text">
                  {{ option.priceDelta === 0 ? 'Бесплатная опция' : `Доплата ${option.priceDelta} ₽` }}
                </p>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { createMenuProductsRoute } from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  findMenuCatalogOptionGroup,
  menuCatalogStore,
  resolveMenuCategoryProducts,
} from '../stores/menu-catalog-store';

const router = useRouter();
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const optionGroupId = computed(() => menuCatalogStore.state.selection.optionGroupId);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const optionGroup = computed(() =>
  findMenuCatalogOptionGroup(menuCatalogStore.state.catalog, optionGroupId.value),
);
const inheritedProducts = computed(
  () => resolveMenuCategoryProducts(menuCatalogStore.state.catalog, categoryId.value).length,
);

function goBackToProducts() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuProductsRoute(categoryId.value));
}
</script>

<style scoped lang="scss">
.addon-detail {
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
  .addon-card__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title,
  .addon-card__title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.5vw, 1.7rem);
    font-weight: 800;
  }

  &__text,
  .addon-card__text,
  .addon-card__option-text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }
}

.addon-card {
  display: grid;
  gap: 1rem;
  height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);

  &__options {
    display: grid;
    gap: 0.75rem;
  }

  &__option {
    padding: 0.95rem 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 1rem;
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.88), rgba(255, 255, 255, 0.96));
  }

  &__option-text {
    margin-top: 0.35rem;
  }
}
</style>
