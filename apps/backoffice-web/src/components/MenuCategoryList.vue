<template>
  <v-row v-if="categories.length > 0">
    <v-col
      v-for="category in categories"
      :key="category.categoryId"
      cols="12"
      lg="6"
    >
      <v-card class="menu-card" rounded="lg" data-testid="menu-category-card">
        <div class="menu-card__topline">
          <v-chip color="primary" variant="tonal">{{ category.productCount }} товаров</v-chip>
          <v-chip color="secondary" variant="tonal">
            {{ category.optionGroupCount }} групп допов
          </v-chip>
        </div>

        <h4 class="menu-card__title">{{ category.name }}</h4>
        <p class="menu-card__text">
          Категория наследует {{ category.optionGroupCount }} групп дополнительных опций.
        </p>

        <div class="menu-card__groups">
          <v-btn
            v-for="optionGroup in category.optionGroups"
            :key="optionGroup.optionGroupId"
            variant="text"
            color="primary"
            @click="$emit('openAddonGroup', category.categoryId, optionGroup.optionGroupId)"
          >
            {{ optionGroup.name }}
          </v-btn>
          <span v-if="category.optionGroupCount === 0" class="menu-card__muted">
            Группы дополнительных опций ещё не назначены.
          </span>
        </div>

        <div class="menu-card__actions">
          <v-btn
            color="primary"
            variant="flat"
            @click="$emit('openProducts', category.categoryId)"
          >
            Открыть товары
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            data-testid="edit-category"
            @click="$emit('editCategory', category.categoryId)"
          >
            Изменить
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-card v-else class="menu-empty" rounded="lg" data-testid="menu-category-empty">
    <p class="menu-empty__label">Каталог пуст</p>
    <h4 class="menu-empty__title">Категории ещё не созданы</h4>
    <p class="menu-empty__text">Создайте первую категорию и сохраните структурный снимок.</p>
  </v-card>
</template>

<script setup lang="ts">
import type { MenuCatalogOptionGroup } from '@expressa/shared-types';

interface MenuCategoryListItem {
  categoryId: string;
  name: string;
  optionGroupCount: number;
  optionGroups: Pick<MenuCatalogOptionGroup, 'name' | 'optionGroupId'>[];
  productCount: number;
}

defineProps<{
  categories: MenuCategoryListItem[];
}>();

defineEmits<{
  editCategory: [categoryId: string];
  openAddonGroup: [categoryId: string, optionGroupId: string];
  openProducts: [categoryId: string];
}>();
</script>

<style scoped lang="scss">
.menu-card,
.menu-empty {
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);
}

.menu-card {
  display: grid;
  gap: 1rem;
  height: 100%;
  padding: 1.25rem;

  &__topline,
  &__actions,
  &__groups {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
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

  &__muted {
    color: var(--expressa-muted);
  }
}

.menu-empty {
  padding: 1.5rem;

  &__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
</style>
