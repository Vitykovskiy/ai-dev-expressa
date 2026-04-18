<template>
  <div v-if="categories.length > 0" class="menu-category-list">
    <article
      v-for="category in categories"
      :key="category.categoryId"
      class="menu-category-card"
      data-testid="menu-category-card"
    >
      <div class="menu-category-card__badges">
        <StatusBadge :label="`${category.productCount} товаров`" variant="accent" />
        <StatusBadge :label="`${category.optionGroupCount} групп допов`" variant="neutral" />
      </div>

      <div class="menu-category-card__content">
        <h4 class="menu-category-card__title">{{ category.name }}</h4>
        <p class="menu-category-card__text">
          Категория наследует {{ category.optionGroupCount }} групп дополнительных опций.
        </p>
      </div>

      <div class="menu-category-card__groups">
        <Button
          v-for="optionGroup in category.optionGroups"
          :key="optionGroup.optionGroupId"
          variant="ghost"
          @click="$emit('openAddonGroup', category.categoryId, optionGroup.optionGroupId)"
        >
          {{ optionGroup.name }}
        </Button>
        <span v-if="category.optionGroupCount === 0" class="menu-category-card__muted">
          Группы дополнительных опций ещё не назначены.
        </span>
      </div>

      <div class="menu-category-card__actions">
        <Button @click="$emit('openProducts', category.categoryId)">Открыть товары</Button>
        <Button
          data-testid="edit-category"
          variant="secondary"
          @click="$emit('editCategory', category.categoryId)"
        >
          Изменить
        </Button>
        <Button
          data-testid="create-category-addon-group"
          variant="ghost"
          @click="$emit('createAddonGroup', category.categoryId)"
        >
          Создать группу допов
        </Button>
      </div>
    </article>
  </div>

  <EmptyState
    v-else
    data-testid="menu-category-empty"
    subtitle="Создайте первую категорию и сохраните структурный снимок."
    title="Категории ещё не созданы"
  >
    <template #actions>
      <Button @click="$emit('createCategory')">Создать категорию</Button>
    </template>
  </EmptyState>
</template>

<script setup lang="ts">
import type { MenuCatalogOptionGroup } from '@expressa/shared-types';
import { Button, EmptyState, StatusBadge } from '../base';

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
  createAddonGroup: [categoryId: string];
  createCategory: [];
  editCategory: [categoryId: string];
  openAddonGroup: [categoryId: string, optionGroupId: string];
  openProducts: [categoryId: string];
}>();
</script>

<style scoped lang="scss">
.menu-category-list {
  display: grid;
  gap: 1rem;
}

.menu-category-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--expressa-border);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.94);
}

.menu-category-card__badges,
.menu-category-card__actions,
.menu-category-card__groups {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.menu-category-card__content {
  display: grid;
  gap: 0.75rem;
}

.menu-category-card__title {
  margin: 0;
  color: var(--expressa-text);
  font-size: clamp(1.1rem, 1.35vw, 1.5rem);
  font-weight: 800;
}

.menu-category-card__text {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.7;
}

.menu-category-card__muted {
  color: var(--expressa-muted);
}

@media (min-width: 960px) {
  .menu-category-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
