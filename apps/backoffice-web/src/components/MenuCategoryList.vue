<template>
  <v-row v-if="categories.length > 0">
    <v-col
      v-for="category in categories"
      :key="category.categoryId"
      cols="12"
      lg="6"
    >
      <MenuSurfaceCard class="menu-card" data-testid="menu-category-card" full-height>
        <div class="menu-card__topline">
          <MenuBadge>{{ category.productCount }} товаров</MenuBadge>
          <MenuBadge tone="neutral">{{ category.optionGroupCount }} групп допов</MenuBadge>
        </div>

        <h4 class="menu-card__title">{{ category.name }}</h4>
        <p class="menu-card__text">
          Категория наследует {{ category.optionGroupCount }} групп дополнительных опций.
        </p>

        <div class="menu-card__groups">
          <MenuActionButton
            v-for="optionGroup in category.optionGroups"
            :key="optionGroup.optionGroupId"
            size="compact"
            variant="ghost"
            @click="$emit('openAddonGroup', category.categoryId, optionGroup.optionGroupId)"
          >
            {{ optionGroup.name }}
          </MenuActionButton>
          <span v-if="category.optionGroupCount === 0" class="menu-card__muted">
            Группы дополнительных опций ещё не назначены.
          </span>
        </div>

        <div class="menu-card__actions">
          <MenuActionButton @click="$emit('openProducts', category.categoryId)">
            Открыть товары
          </MenuActionButton>
          <MenuActionButton
            data-testid="edit-category"
            variant="ghost"
            @click="$emit('editCategory', category.categoryId)"
          >
            Изменить
          </MenuActionButton>
          <MenuActionButton
            data-testid="create-category-addon-group"
            variant="secondary"
            @click="$emit('createAddonGroup', category.categoryId)"
          >
            Создать группу допов
          </MenuActionButton>
        </div>
      </MenuSurfaceCard>
    </v-col>
  </v-row>

  <MenuEmptyState
    v-else
    data-testid="menu-category-empty"
    label="Каталог пуст"
    text="Создайте первую категорию и сохраните структурный снимок."
    title="Категории ещё не созданы"
  />
</template>

<script setup lang="ts">
import type { MenuCatalogOptionGroup } from '@expressa/shared-types';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuEmptyState from './menu/MenuEmptyState.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';

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
  editCategory: [categoryId: string];
  openAddonGroup: [categoryId: string, optionGroupId: string];
  openProducts: [categoryId: string];
}>();
</script>

<style scoped lang="scss">
.menu-card {
  display: grid;
  gap: 1rem;

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
</style>
