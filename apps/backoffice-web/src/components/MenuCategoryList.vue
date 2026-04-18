<template>
  <MenuSurfaceCard
    v-if="categories.length > 0"
    class="menu-category-tree"
    data-testid="menu-category-tree"
    padding="none"
    variant="subtle"
  >
    <div
      v-for="(category, index) in categories"
      :key="category.categoryId"
      class="menu-category-tree__node"
      :class="{ 'menu-category-tree__node--expanded': isExpanded(category.categoryId) }"
    >
      <div
        class="menu-category-tree__row"
        :class="{ 'menu-category-tree__row--bordered': index < categories.length - 1 }"
      >
        <button
          class="menu-category-tree__trigger"
          :aria-expanded="isExpanded(category.categoryId)"
          :data-testid="`toggle-category-${category.categoryId}`"
          type="button"
          @click="toggleCategory(category.categoryId)"
        >
          <span
            class="menu-category-tree__chevron"
            :class="{ 'menu-category-tree__chevron--expanded': isExpanded(category.categoryId) }"
            aria-hidden="true"
          />

          <span class="menu-category-tree__summary">
            <span class="menu-category-tree__title">{{ category.name }}</span>
            <span class="menu-category-tree__meta">
              {{ category.productCount }} {{ pluralize(category.productCount, 'товар', 'товара', 'товаров') }}
              ·
              {{ category.optionGroupCount }}
              {{ pluralize(category.optionGroupCount, 'группа допов', 'группы допов', 'групп допов') }}
            </span>
          </span>
        </button>

        <div class="menu-category-tree__row-actions">
          <MenuActionButton
            :data-testid="`edit-category-${category.categoryId}`"
            size="compact"
            variant="ghost"
            @click="$emit('editCategory', category.categoryId)"
          >
            Изменить
          </MenuActionButton>
        </div>
      </div>

      <div
        v-if="isExpanded(category.categoryId)"
        :data-testid="`category-panel-${category.categoryId}`"
        class="menu-category-tree__panel"
      >
        <div class="menu-category-tree__badges">
          <MenuBadge>{{ category.productCount }} {{ pluralize(category.productCount, 'товар', 'товара', 'товаров') }}</MenuBadge>
          <MenuBadge tone="neutral">
            {{ category.optionGroupCount }}
            {{ pluralize(category.optionGroupCount, 'группа допов', 'группы допов', 'групп допов') }}
          </MenuBadge>
        </div>

        <section class="menu-category-tree__section">
          <p class="menu-category-tree__section-label">Товары категории</p>
          <div v-if="category.products.length > 0" class="menu-category-tree__branch">
            <MenuListRow
              v-for="product in category.products"
              :key="product.productId"
              class="menu-category-tree__product-row"
              interactive
              tag="button"
              type="button"
              @click="$emit('openProducts', category.categoryId)"
            >
              {{ product.name }}
              <template #leading>
                <span class="menu-category-tree__product-dot" aria-hidden="true" />
              </template>
              <template #meta>
                {{ product.priceSummary }}
              </template>
              <template #trailing>
                <span class="menu-category-tree__product-link">К списку</span>
              </template>
            </MenuListRow>
          </div>
          <div v-else class="menu-category-tree__empty-branch">
            В этой категории пока нет товаров. Откройте список категории, чтобы добавить первую позицию.
          </div>
        </section>

        <section class="menu-category-tree__section">
          <p class="menu-category-tree__section-label">Группы дополнительных опций</p>
          <div v-if="category.optionGroups.length > 0" class="menu-category-tree__groups">
            <MenuActionButton
              v-for="optionGroup in category.optionGroups"
              :key="optionGroup.optionGroupId"
              :data-testid="`open-addon-group-${category.categoryId}-${optionGroup.optionGroupId}`"
              size="compact"
              variant="ghost"
              @click="$emit('openAddonGroup', category.categoryId, optionGroup.optionGroupId)"
            >
              {{ optionGroup.name }}
            </MenuActionButton>
          </div>
          <div v-else class="menu-category-tree__empty-branch">
            Группы дополнительных опций ещё не назначены. Их можно создать прямо из этой ветки.
          </div>
        </section>

        <div class="menu-category-tree__panel-actions">
          <MenuActionButton
            :data-testid="`open-products-${category.categoryId}`"
            @click="$emit('openProducts', category.categoryId)"
          >
            Открыть товары
          </MenuActionButton>
          <MenuActionButton
            :data-testid="`create-category-addon-group-${category.categoryId}`"
            variant="secondary"
            @click="$emit('createAddonGroup', category.categoryId)"
          >
            Создать группу допов
          </MenuActionButton>
        </div>
      </div>
    </div>
  </MenuSurfaceCard>

  <MenuEmptyState
    v-else
    data-testid="menu-category-empty"
    label="Каталог пуст"
    text="Создайте первую категорию, чтобы после этого открыть список товаров и связанные группы дополнительных опций."
    title="Категории ещё не созданы"
  >
    <template #actions>
      <MenuActionButton data-testid="create-category-empty" @click="$emit('createCategory')">
        Создать категорию
      </MenuActionButton>
    </template>
  </MenuEmptyState>
</template>

<script setup lang="ts">
import type { MenuCatalogOptionGroup } from '@expressa/shared-types';
import { ref, watch } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuEmptyState from './menu/MenuEmptyState.vue';
import MenuListRow from './menu/MenuListRow.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';

interface MenuCategoryProductListItem {
  name: string;
  priceSummary: string;
  productId: string;
}

interface MenuCategoryListItem {
  categoryId: string;
  name: string;
  optionGroupCount: number;
  optionGroups: Pick<MenuCatalogOptionGroup, 'name' | 'optionGroupId'>[];
  products: MenuCategoryProductListItem[];
  productCount: number;
}

const props = defineProps<{
  categories: MenuCategoryListItem[];
}>();

defineEmits<{
  createCategory: [];
  createAddonGroup: [categoryId: string];
  editCategory: [categoryId: string];
  openAddonGroup: [categoryId: string, optionGroupId: string];
  openProducts: [categoryId: string];
}>();

const expandedCategoryIds = ref<string[]>([]);

watch(
  () => props.categories.map((category) => category.categoryId),
  (categoryIds) => {
    const validIds = new Set(categoryIds);
    expandedCategoryIds.value = expandedCategoryIds.value.filter((categoryId) => validIds.has(categoryId));
  },
  { immediate: true },
);

function isExpanded(categoryId: string) {
  return expandedCategoryIds.value.includes(categoryId);
}

function toggleCategory(categoryId: string) {
  expandedCategoryIds.value = isExpanded(categoryId)
    ? expandedCategoryIds.value.filter((value) => value !== categoryId)
    : [...expandedCategoryIds.value, categoryId];
}

function pluralize(count: number, one: string, few: string, many: string) {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return one;
  }

  if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
    return few;
  }

  return many;
}
</script>

<style scoped lang="scss">
.menu-category-tree {
  display: grid;
  overflow: hidden;

  &__node {
    display: grid;
  }

  &__node--expanded {
    background: rgba(255, 255, 255, 0.72);
  }

  &__row {
    display: grid;
    gap: 0.85rem;
    padding: 1rem;
  }

  &__row--bordered {
    border-bottom: 1px solid var(--expressa-border);
  }

  &__trigger {
    display: flex;
    gap: 0.9rem;
    align-items: center;
    min-width: 0;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
  }

  &__trigger:hover &__title {
    color: var(--accent);
  }

  &__chevron {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgba(232, 232, 255, 0.64);
    color: var(--accent);
    flex-shrink: 0;
  }

  &__chevron::before {
    content: '';
    width: 0.55rem;
    height: 0.55rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(-45deg);
    transition: transform var(--expressa-menu-transition-fast);
  }

  &__chevron--expanded::before {
    transform: rotate(45deg) translate(-1px, -1px);
  }

  &__summary {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
    flex: 1;
  }

  &__title {
    color: var(--expressa-text);
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.35;
    transition: color var(--expressa-menu-transition-fast);
  }

  &__meta {
    color: var(--expressa-muted);
    font-size: 0.88rem;
    line-height: 1.5;
  }

  &__row-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &__panel {
    display: grid;
    gap: 1rem;
    padding: 0 1rem 1rem 3.9rem;
    border-bottom: 1px solid var(--expressa-border);
  }

  &__badges,
  &__groups,
  &__panel-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  &__section {
    display: grid;
    gap: 0.6rem;
  }

  &__section-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__branch {
    display: grid;
    gap: 0.55rem;
  }

  &__product-row {
    &:deep(.menu-list-row__trailing) {
      color: var(--accent);
      font-size: 0.82rem;
      font-weight: 700;
    }
  }

  &__product-dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--accent);
  }

  &__product-link {
    white-space: nowrap;
  }

  &__empty-branch {
    padding: 0.9rem 1rem;
    border: 1px dashed var(--expressa-border);
    border-radius: var(--expressa-menu-radius-md);
    background: rgba(255, 255, 255, 0.72);
    color: var(--expressa-secondary);
    line-height: 1.6;
  }

  &__panel-actions {
    padding-top: 0.2rem;
  }
}

@media (min-width: 760px) {
  .menu-category-tree__row {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .menu-category-tree__row-actions,
  .menu-category-tree__panel-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 759px) {
  .menu-category-tree__panel {
    padding-left: 1rem;
  }
}
</style>
