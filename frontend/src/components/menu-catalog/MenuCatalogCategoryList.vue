<template>
  <v-card class="catalog-panel" rounded="lg">
    <div v-if="categories.length === 0" class="empty-state">
      <BookOpen :size="38" />
      <h2>Меню пусто</h2>
      <p>Добавьте первую группу для начала работы</p>
    </div>

    <div v-else class="category-list">
      <div v-for="category in categories" :key="category.menuCategoryId" class="category-block">
        <div class="category-row">
          <v-btn
            class="category-row__main"
            variant="text"
            rounded="0"
            @click="toggleCategory(category.menuCategoryId)"
          >
            <span class="category-row__content">
              <span class="category-row__label">
                <component
                  :is="expandedCategoryIds.has(category.menuCategoryId) ? ChevronDown : ChevronRight"
                  :size="20"
                />
                <span>
                  <strong>{{ category.name }}</strong>
                  <small>{{ itemCountLabel(categoryItemsMap[category.menuCategoryId]?.length ?? 0) }}</small>
                </span>
              </span>
            </span>
          </v-btn>
          <v-btn
            class="icon-button"
            color="primary"
            variant="text"
            icon
            title="Редактировать группу"
            @click="$emit('edit-category', category)"
          >
            <Edit3 :size="18" />
          </v-btn>
        </div>

        <div v-if="expandedCategoryIds.has(category.menuCategoryId)" class="category-detail">
          <div v-if="(categoryOptionGroupsMap[category.menuCategoryId]?.length ?? 0) > 0" class="assigned-groups">
            <v-chip
              v-for="group in categoryOptionGroupsMap[category.menuCategoryId]"
              :key="group.optionGroupId"
              color="primary"
              variant="tonal"
              size="small"
              rounded="lg"
            >
              {{ group.name }}
            </v-chip>
          </div>

          <div v-if="(categoryItemsMap[category.menuCategoryId]?.length ?? 0) === 0" class="category-empty">
            <Coffee :size="32" />
            <p>Товаров в этой группе пока нет</p>
            <v-btn class="inline-button" color="primary" variant="tonal" @click="$emit('create-item', category)">
              Добавить товар
            </v-btn>
          </div>

          <v-btn
            v-for="item in categoryItemsMap[category.menuCategoryId] ?? []"
            :key="item.menuItemId"
            class="product-row"
            variant="text"
            rounded="0"
            @click="$emit('edit-item', item)"
          >
            <span class="product-row__content">
              <span>
                <strong>{{ item.name }}</strong>
                <small>{{ itemPriceLabel(item) }}</small>
              </span>
              <ChevronRight :size="18" />
            </span>
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
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
.category-row__label strong {
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
  justify-content: flex-start;
  color: #111111;
  text-transform: none;
  letter-spacing: 0;
}

.category-row__main {
  min-height: 56px;
  padding: 0 16px;
}

.category-row__content,
.product-row__content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
}

.category-row__label {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-row__label > span,
.product-row__content > span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.category-row__label small,
.product-row__content small {
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

.product-row {
  min-height: 56px;
  padding: 0 16px 0 48px;
  border-top: 1px solid #e0e0e0;
}

.icon-button {
  min-width: 44px;
  min-height: 44px;
  align-self: center;
}

.inline-button {
  min-height: 34px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}
</style>
