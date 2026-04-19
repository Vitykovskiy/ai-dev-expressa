<template>
  <div class="catalog-panel">
    <div v-if="categories.length === 0" class="empty-state">
      <BookOpen :size="38" />
      <h2>Меню пусто</h2>
      <p>Добавьте первую группу для начала работы</p>
    </div>

    <div v-else class="category-list">
      <div v-for="category in categories" :key="category.menuCategoryId" class="category-block">
        <div class="category-row">
          <button type="button" class="category-row__main" @click="toggleCategory(category.menuCategoryId)">
            <ChevronDown v-if="expandedCategoryIds.has(category.menuCategoryId)" :size="20" />
            <ChevronRight v-else :size="20" />
            <span>
              <strong>{{ category.name }}</strong>
              <small>{{ itemCountLabel(categoryItemsMap[category.menuCategoryId]?.length ?? 0) }}</small>
            </span>
          </button>
          <button
            type="button"
            class="icon-button"
            title="Редактировать группу"
            @click="$emit('edit-category', category)"
          >
            <Edit3 :size="18" />
          </button>
        </div>

        <div v-if="expandedCategoryIds.has(category.menuCategoryId)" class="category-detail">
          <div v-if="(categoryOptionGroupsMap[category.menuCategoryId]?.length ?? 0) > 0" class="assigned-groups">
            <span v-for="group in categoryOptionGroupsMap[category.menuCategoryId]" :key="group.optionGroupId">
              {{ group.name }}
            </span>
          </div>

          <div v-if="(categoryItemsMap[category.menuCategoryId]?.length ?? 0) === 0" class="category-empty">
            <Coffee :size="32" />
            <p>Товаров в этой группе пока нет</p>
            <button type="button" class="inline-button" @click="$emit('create-item', category)">Добавить товар</button>
          </div>

          <button
            v-for="item in categoryItemsMap[category.menuCategoryId] ?? []"
            :key="item.menuItemId"
            type="button"
            class="product-row"
            @click="$emit('edit-item', item)"
          >
            <span>
              <strong>{{ item.name }}</strong>
              <small>{{ itemPriceLabel(item) }}</small>
            </span>
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, ChevronDown, ChevronRight, Coffee, Edit3 } from "lucide-vue-next";
import { ref } from "vue";
import { itemCountLabel, itemPriceLabel } from "../../modules/menu-catalog/presentation";
import type { MenuCategory, MenuItem, OptionGroup } from "../../modules/menu-catalog/types";

defineProps<{
  categories: readonly MenuCategory[];
  categoryItemsMap: Record<string, MenuItem[]>;
  categoryOptionGroupsMap: Record<string, OptionGroup[]>;
}>();

defineEmits<{
  "edit-category": [category: MenuCategory];
  "create-item": [category: MenuCategory];
  "edit-item": [item: MenuItem];
}>();

const expandedCategoryIds = ref<Set<string>>(new Set());

function toggleCategory(menuCategoryId: string): void {
  const next = new Set(expandedCategoryIds.value);
  if (next.has(menuCategoryId)) {
    next.delete(menuCategoryId);
  } else {
    next.add(menuCategoryId);
  }

  expandedCategoryIds.value = next;
}
</script>

<style scoped lang="scss">
.catalog-panel {
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
}

.empty-state,
.category-empty {
  padding: 36px 16px;
  text-align: center;
  color: #999999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-state h2,
.category-row__main strong {
  margin: 0;
  color: #111111;
}

.empty-state p,
.category-empty p {
  margin: 0;
}

.category-block + .category-block {
  border-top: 1px solid #e0e0e0;
}

.category-row {
  display: flex;
  align-items: stretch;
  background: #f5f5f7;
}

.category-row__main,
.product-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 0;
  background: transparent;
  color: #111111;
  text-align: left;
  cursor: pointer;
}

.category-row__main {
  padding: 14px 16px;
}

.category-row__main span,
.product-row span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.category-row__main small,
.product-row small {
  color: #999999;
  font-size: 12px;
}

.category-detail {
  background: #ffffff;
}

.assigned-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 16px 0 48px;
}

.assigned-groups span {
  padding: 4px 8px;
  border-radius: 8px;
  background: #e8e8ff;
  color: #1a1aff;
  font-size: 12px;
}

.product-row {
  padding: 13px 16px 13px 48px;
  border-top: 1px solid #e0e0e0;
}

.icon-button {
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #1a1aff;
  cursor: pointer;
}

.inline-button {
  min-height: 34px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  background: #e8e8ff;
  color: #1a1aff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>
