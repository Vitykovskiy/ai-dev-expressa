<template>
  <div class="catalog-panel">
    <div v-if="categories.length === 0" class="empty-state">
      <ui-empty-state
        :icon="BookOpen"
        :icon-size="38"
        title="Меню пусто"
        subtitle="Добавьте первую группу для начала работы"
      />
    </div>

    <div v-else class="category-list">
      <ui-data-table
        v-for="section in categoryTableSections"
        :key="section.title"
        :headers="categoryHeaders"
        :items="section.rows"
        :group-by="categoryTableGroupBy"
        item-value="menuCategoryId"
        hide-default-header
      >
        <template #group-header="{ item, columns, isGroupOpen, toggleGroup }">
          <tr
            class="category-table__group-row"
            @vue:mounted="openCategoryGroup(item, isGroupOpen, toggleGroup)"
            @vue:updated="openCategoryGroup(item, isGroupOpen, toggleGroup)"
          >
            <th :colspan="columns.length" scope="colgroup">
              {{ item.value }}
            </th>
          </tr>
        </template>

        <template #item="{ item, internalItem, isExpanded, toggleExpand }">
          <tr class="category-table__category-row">
            <td>
              <ui-button
                class="category-row__main"
                variant="ghost"
                @click="toggleExpand(internalItem)"
              >
                <span class="category-row__content">
                  <span class="category-row__label">
                    <component
                      :is="
                        isExpanded(internalItem) ? ChevronDown : ChevronRight
                      "
                      :size="20"
                    />
                    <span>
                      <strong>{{ item.category.name }}</strong>
                      <small>{{
                        item.countLabel(
                          categoryItemsMap[item.menuCategoryId]?.length ?? 0,
                        )
                      }}</small>
                    </span>
                  </span>
                </span>
              </ui-button>
            </td>
            <td class="category-table__edit-cell">
              <ui-icon-button
                class="category-row__edit"
                title="Редактировать группу"
                @click="$emit('edit-category', item.category)"
              >
                <Edit3 :size="18" />
              </ui-icon-button>
            </td>
          </tr>
        </template>

        <template #expanded-row="{ item, columns }">
          <tr class="category-table__detail-row">
            <td :colspan="columns.length">
              <div class="category-detail">
                <div
                  v-if="
                    (categoryItemsMap[item.menuCategoryId]?.length ?? 0) === 0
                  "
                  class="category-empty"
                >
                  <Coffee :size="32" class="category-empty__icon" />
                  <p class="category-empty__text">
                    {{ item.emptyText }}
                  </p>
                </div>

                <ui-button
                  v-for="menuItem in categoryItemsMap[item.menuCategoryId] ??
                  []"
                  :key="menuItem.menuItemId"
                  class="product-row"
                  variant="ghost"
                  @click="$emit('edit-item', menuItem)"
                >
                  <span class="product-row__content">
                    <span>
                      <strong>{{ menuItem.name }}</strong>
                      <small>{{ item.priceLabel(menuItem) }}</small>
                    </span>
                    <ChevronRight :size="18" />
                  </span>
                </ui-button>
              </div>
            </td>
          </tr>
        </template>
      </ui-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Coffee,
  Edit3,
} from "lucide-vue-next";
import { computed } from "vue";
import UiButton from "@/ui/UiButton.vue";
import UiDataTable, {
  type UiDataTableGroupBy,
  type UiDataTableHeader,
  type UiDataTableRecord,
} from "@/ui/UiDataTable.vue";
import UiEmptyState from "@/ui/UiEmptyState.vue";
import UiIconButton from "@/ui/UiIconButton.vue";
import {
  itemCountLabel,
  itemPriceLabel,
  optionCountLabel,
} from "@/modules/menu-catalog/presentation";
import type { MenuCategory, MenuItem } from "@/modules/menu-catalog/types";

interface DataTableGroup {
  id: string;
}

type DataTableGroupStateGetter = (group: DataTableGroup) => boolean;
type DataTableGroupToggle = (group: DataTableGroup) => void;

const props = defineProps<{
  categories: readonly MenuCategory[];
  categoryItemsMap: Record<string, MenuItem[]>;
  optionGroupCategoryIds: readonly string[];
}>();

defineEmits<{
  "edit-category": [category: MenuCategory];
  "create-item": [category: MenuCategory];
  "edit-item": [item: MenuItem];
  "edit-option-group": [optionGroupId: string];
}>();

const optionGroupCategoryIdSet = computed(
  () => new Set(props.optionGroupCategoryIds),
);
const regularCategories = computed(() =>
  props.categories.filter(
    (category) => !optionGroupCategoryIdSet.value.has(category.menuCategoryId),
  ),
);
const optionCategories = computed(() =>
  props.categories.filter((category) =>
    optionGroupCategoryIdSet.value.has(category.menuCategoryId),
  ),
);

interface CategorySection {
  title: string;
  categories: MenuCategory[];
  emptyText: string;
  countLabel: (count: number) => string;
  priceLabel: (item: MenuItem) => string;
}

const visibleSections = computed(() =>
  [
    {
      title: "Основное меню",
      categories: regularCategories.value,
      emptyText: "Товаров в этой группе пока нет",
      countLabel: itemCountLabel,
      priceLabel: (item: MenuItem) => itemPriceLabel(item),
    },
    {
      title: "Группы опций",
      categories: optionCategories.value,
      emptyText: "Опций в этой группе пока нет",
      countLabel: optionCountLabel,
      priceLabel: (item: MenuItem) =>
        itemPriceLabel(item, { freeLabel: "Бесплатно" }),
    },
  ].filter((section) => section.categories.length > 0),
);

interface CategoryTableRow extends UiDataTableRecord {
  menuCategoryId: string;
  sectionTitle: string;
  category: MenuCategory;
  emptyText: string;
  countLabel: (count: number) => string;
  priceLabel: (item: MenuItem) => string;
}

interface CategoryTableSection {
  title: string;
  rows: CategoryTableRow[];
}

const categoryHeaders: UiDataTableHeader<UiDataTableRecord>[] = [
  { key: "name", title: "Группа", sortable: false },
  { key: "actions", title: "Действия", align: "end", sortable: false },
];
const categoryTableGroupBy: UiDataTableGroupBy[] = [
  { key: "sectionTitle", order: "asc" },
];
const categoryTableSections = computed<CategoryTableSection[]>(() =>
  visibleSections.value.map((section: CategorySection) => ({
    title: section.title,
    rows: section.categories.map((category) => ({
      menuCategoryId: category.menuCategoryId,
      sectionTitle: section.title,
      category,
      emptyText: section.emptyText,
      countLabel: section.countLabel,
      priceLabel: section.priceLabel,
    })),
  })),
);

function openCategoryGroup(
  group: DataTableGroup,
  isGroupOpen: DataTableGroupStateGetter,
  toggleGroup: DataTableGroupToggle,
): void {
  if (!isGroupOpen(group)) {
    toggleGroup(group);
  }
}
</script>

<style scoped lang="scss">
.catalog-panel {
  display: block;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state,
.category-empty {
  padding: 0;
}

.category-table__group-row {
  background: var(--app-color-background-secondary);
}

.category-table__group-row th {
  padding: 10px 16px;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
}

.category-table__category-row {
  background: var(--app-color-background-secondary);
}

.category-table__category-row td,
.category-table__detail-row td {
  padding: 0;
}

.category-table__edit-cell {
  width: 72px;
  text-align: right;
}

.category-row__main,
.product-row {
  justify-content: flex-start;
  border-radius: 0;
}

.category-row__main {
  flex: 1 1 auto;
  min-width: 0;
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
  display: flex;
  width: 100%;
  flex: 1 1 auto;
  min-height: 56px;
  padding: 0 16px 0 48px;
  border-top: 1px solid var(--app-color-border);
}

.product-row :deep(.v-btn__content) {
  width: 100%;
}

.category-row__edit {
  align-self: center;
  flex: 0 0 auto;
  color: var(--app-color-accent) !important;
}

.category-row__edit:hover {
  background: var(--app-color-accent-light) !important;
}
</style>
