<template>
  <ui-section-list class="catalog-panel">
    <div v-if="categories.length === 0" class="empty-state">
      <ui-empty-state
        :icon="BookOpen"
        :icon-size="38"
        title="Меню пусто"
        subtitle="Добавьте первую группу для начала работы"
      />
    </div>

    <div v-else class="category-list">
      <div
        v-for="category in categories"
        :key="category.menuCategoryId"
        class="category-block"
      >
        <div class="category-row">
          <ui-button
            class="category-row__main"
            variant="ghost"
            @click="toggleCategory(category.menuCategoryId)"
          >
            <span class="category-row__content">
              <span class="category-row__label">
                <component
                  :is="
                    expandedCategoryIds.has(category.menuCategoryId)
                      ? ChevronDown
                      : ChevronRight
                  "
                  :size="20"
                />
                <span>
                  <strong>{{ category.name }}</strong>
                  <small>{{
                    itemCountLabel(
                      categoryItemsMap[category.menuCategoryId]?.length ?? 0,
                    )
                  }}</small>
                </span>
              </span>
            </span>
          </ui-button>
          <ui-icon-button
            class="icon-button"
            title="Редактировать группу"
            @click="$emit('edit-category', category)"
          >
            <Edit3 :size="18" />
          </ui-icon-button>
        </div>

        <div
          v-if="expandedCategoryIds.has(category.menuCategoryId)"
          class="category-detail"
        >
          <div
            v-if="
              (categoryItemsMap[category.menuCategoryId]?.length ?? 0) === 0
            "
            class="category-empty"
          >
            <Coffee :size="32" class="category-empty__icon" />
            <p class="category-empty__text">Товаров в этой группе пока нет</p>
          </div>

          <ui-button
            v-for="item in categoryItemsMap[category.menuCategoryId] ?? []"
            :key="item.menuItemId"
            class="product-row"
            variant="ghost"
            @click="$emit('edit-item', item)"
          >
            <span class="product-row__content">
              <span>
                <strong>{{ item.name }}</strong>
                <small>{{ itemPriceLabel(item) }}</small>
              </span>
              <ChevronRight :size="18" />
            </span>
          </ui-button>
        </div>
      </div>
    </div>
  </ui-section-list>
</template>

<script setup lang="ts">
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Coffee,
  Edit3,
} from "lucide-vue-next";
import { ref } from "vue";
import UiButton from "@/ui/UiButton.vue";
import UiEmptyState from "@/ui/UiEmptyState.vue";
import UiIconButton from "@/ui/UiIconButton.vue";
import UiSectionList from "@/ui/UiSectionList.vue";
import {
  itemCountLabel,
  itemPriceLabel,
} from "@/modules/menu-catalog/presentation";
import type { MenuCategory, MenuItem } from "@/modules/menu-catalog/types";

defineProps<{
  categories: readonly MenuCategory[];
  categoryItemsMap: Record<string, MenuItem[]>;
}>();

defineEmits<{
  "edit-category": [category: MenuCategory];
  "create-item": [category: MenuCategory];
  "edit-item": [item: MenuItem];
  "edit-option-group": [optionGroupId: string];
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
}

.empty-state,
.category-empty {
  padding: 0;
}

.category-block + .category-block {
  border-top: 1px solid var(--app-color-border);
}

.category-row {
  display: flex;
  align-items: stretch;
  background: var(--app-color-background-secondary);
}

.category-row__main,
.product-row {
  width: 100%;
  justify-content: flex-start;
  border-radius: 0;
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

.category-row__label strong {
  color: var(--app-color-text-primary);
}

.category-row__label > span,
.product-row__content > span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.category-row__label small,
.product-row__content small {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.category-detail {
  background: var(--app-color-background-surface);
}

.category-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  border-top: 1px solid var(--app-color-border);
  text-align: center;
}

.category-empty__icon,
.category-empty__text {
  color: var(--app-color-text-muted);
}

.category-empty__text {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.product-row {
  min-height: 56px;
  padding: 0 16px 0 48px;
  border-top: 1px solid var(--app-color-border);
}

.icon-button {
  align-self: center;
}
</style>
