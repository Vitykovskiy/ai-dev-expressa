<template>
  <ui-section-list class="catalog-panel">
    <template #header>
      <div class="catalog-panel__header">
        <h2>Категории меню</h2>
        <p>Группы, товары и назначенные группы опций</p>
      </div>
    </template>
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
              (categoryOptionGroupsMap[category.menuCategoryId]?.length ?? 0) >
              0
            "
            class="assigned-groups"
          >
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

          <div
            v-if="
              (categoryItemsMap[category.menuCategoryId]?.length ?? 0) === 0
            "
            class="category-empty"
          >
            <ui-empty-state
              :icon="Coffee"
              :icon-size="32"
              title="Товаров в этой группе пока нет"
              subtitle="Создайте первый товар для выбранной группы"
            >
              <template #actions>
                <ui-inline-action @click="$emit('create-item', category)"
                  >Добавить товар</ui-inline-action
                >
              </template>
            </ui-empty-state>
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
import UiButton from "../../ui/UiButton.vue";
import UiEmptyState from "../../ui/UiEmptyState.vue";
import UiIconButton from "../../ui/UiIconButton.vue";
import UiInlineAction from "../../ui/UiInlineAction.vue";
import UiSectionList from "../../ui/UiSectionList.vue";
import {
  itemCountLabel,
  itemPriceLabel,
} from "../../modules/menu-catalog/presentation";
import type {
  MenuCategory,
  MenuItem,
  OptionGroup,
} from "../../modules/menu-catalog/types";

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
}

.catalog-panel__header h2 {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 18px;
}

.catalog-panel__header p {
  margin: 4px 0 0;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 20px;
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

.assigned-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 16px 0 48px;
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
