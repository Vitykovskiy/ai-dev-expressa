<template>
  <section class="menu-view">
    <ui-top-bar title="Меню" />

    <div class="menu-view__header">
      <div>
        <h1 class="menu-view__title">Меню</h1>
        <p v-if="categories.length > 0" class="menu-view__subtitle">
          {{ categorySummaryLabel }}
        </p>
      </div>
    </div>

    <div class="menu-view__actions">
      <ui-button
        class="action-button"
        :disabled="isBusy"
        @click="openCreateCategoryDialog"
      >
        Добавить группу
      </ui-button>
      <div class="menu-view__tooltip-group">
        <ui-button
          class="action-button"
          variant="outlined"
          :disabled="categories.length === 0 || isBusy"
          @click="openCreateItemDialog()"
        >
          Добавить товар
        </ui-button>
        <div
          v-if="categories.length === 0"
          class="menu-view__tooltip"
          role="tooltip"
        >
          Сначала создайте группу
        </div>
      </div>
    </div>

    <v-sheet
      v-if="isLoading"
      class="loading-panel"
      rounded="lg"
      color="surface"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        :size="36"
        :width="4"
      />
      <span>Загружаем каталог</span>
    </v-sheet>

    <div v-else class="menu-view__body">
      <MenuCatalogCategoryList
        :categories="categories"
        :category-items-map="categoryItemsMap"
        :option-group-category-ids="optionGroupCategoryIds"
        @edit-category="openEditCategoryDialog"
        @create-item="openCreateItemDialog"
        @edit-item="openEditItemDialog"
      />
    </div>

    <MenuCategoryDialog
      :open="categoryDialogOpen"
      :is-busy="isBusy"
      :editing-category="editingCategory"
      :product-count="editingCategoryProductCount"
      :option-groups="optionGroups"
      :owned-option-group-id="ownedOptionGroupId"
      @close="closeCategoryDialog"
      @submit="submitCategory"
      @delete="deleteCurrentCategory"
    />

    <MenuItemDialog
      :open="itemDialogOpen"
      :is-busy="isBusy"
      :editing-item="editingItem"
      :categories="categories"
      :option-group-category-ids="optionGroupCategoryIds"
      :default-category-id="defaultItemCategoryId"
      @close="closeItemDialog"
      @submit="submitItem"
      @delete="deleteCurrentItem"
    />

    <v-snackbar
      v-model="errorToastOpen"
      location="top"
      color="error"
      :timeout="4000"
    >
      {{ errorMessage }}
    </v-snackbar>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import MenuCatalogCategoryList from "@/components/menu-catalog/MenuCatalogCategoryList.vue";
import MenuCategoryDialog from "@/components/menu-catalog/MenuCategoryDialog.vue";
import MenuItemDialog from "@/components/menu-catalog/MenuItemDialog.vue";
import UiButton from "@/ui/UiButton.vue";
import UiTopBar from "@/ui/UiTopBar.vue";
import {
  findCategoryOwnedOptionGroup,
  optionGroupCategoryIds as resolveOptionGroupCategoryIds,
} from "@/modules/menu-catalog/presentation";
import { useMenuCatalogStore } from "@/modules/menu-catalog/store";
import type {
  CategoryDialogSubmitPayload,
  MenuCategory,
  MenuItem,
  MenuItemPayload,
  OptionGroup,
  OptionGroupPayload,
} from "@/modules/menu-catalog/types";
import {
  mapMenuCatalogError,
  validateMenuItemPayload,
} from "@/modules/menu-catalog/validation";

const store = useMenuCatalogStore();
const localError = ref<string | null>(null);
const errorToastOpen = ref(false);

const categoryDialogOpen = ref(false);
const editingCategory = ref<MenuCategory | null>(null);
const ownedOptionGroupId = ref("");
const ownedOptionGroupMap = reactive<Record<string, string>>({});

const itemDialogOpen = ref(false);
const editingItem = ref<MenuItem | null>(null);
const defaultItemCategoryId = ref("");

const snapshot = computed(() => store.state.snapshot);
const categories = computed(() => snapshot.value.categories);
const optionGroups = computed(() => snapshot.value.optionGroups);
const editingCategoryProductCount = computed(
  () =>
    (editingCategory.value &&
      categoryItemsMap.value[editingCategory.value.menuCategoryId]?.length) ??
    0,
);
const categoryItemsMap = computed<Record<string, MenuItem[]>>(() =>
  snapshot.value.items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const list = acc[item.menuCategoryId] ?? [];
    list.push(item);
    acc[item.menuCategoryId] = list;
    return acc;
  }, {}),
);
const optionGroupCategoryIds = computed(() =>
  resolveOptionGroupCategoryIds(
    categories.value,
    optionGroups.value,
    ownedOptionGroupMap,
  ),
);
const optionGroupCategoryIdSet = computed(
  () => new Set(optionGroupCategoryIds.value),
);
const regularCategoryCount = computed(
  () =>
    categories.value.filter(
      (category) =>
        !optionGroupCategoryIdSet.value.has(category.menuCategoryId),
    ).length,
);
const optionCategoryCount = computed(
  () =>
    categories.value.filter((category) =>
      optionGroupCategoryIdSet.value.has(category.menuCategoryId),
    ).length,
);
const categorySummaryLabel = computed(() => {
  const parts: string[] = [];
  if (regularCategoryCount.value > 0) {
    parts.push(categoryGroupLabel(regularCategoryCount.value));
  }
  if (optionCategoryCount.value > 0) {
    parts.push(optionGroupLabel(optionCategoryCount.value));
  }

  return parts.join(" · ");
});
const isBusy = computed(
  () => store.state.status === "loading" || store.state.status === "saving",
);
const isLoading = computed(() => store.state.status === "loading");
const errorMessage = computed(
  () => localError.value ?? mapMenuCatalogError(store.state.errorCode),
);

onMounted(() => {
  void store.loadCatalog().catch(() => undefined);
});

watch(
  errorMessage,
  (message) => {
    errorToastOpen.value = Boolean(
      message && (localError.value || store.state.errorCode),
    );
  },
  { immediate: true },
);

function openCreateCategoryDialog(): void {
  clearError();
  editingCategory.value = null;
  ownedOptionGroupId.value = "";
  categoryDialogOpen.value = true;
}

function openEditCategoryDialog(category: MenuCategory): void {
  clearError();
  editingCategory.value = category;
  ownedOptionGroupId.value =
    ownedOptionGroupMap[category.menuCategoryId] ??
    findCategoryOwnedOptionGroup(category, optionGroups.value)?.optionGroupId ??
    "";
  categoryDialogOpen.value = true;
}

function closeCategoryDialog(): void {
  categoryDialogOpen.value = false;
  ownedOptionGroupId.value = "";
  clearError();
}

async function submitCategory(
  submission: CategoryDialogSubmitPayload,
): Promise<void> {
  clearError();
  if (!submission.category.name.trim()) {
    localError.value = "Введите название группы";
    return;
  }

  try {
    const knownOwnedOptionGroupId = editingCategory.value
      ? (ownedOptionGroupMap[editingCategory.value.menuCategoryId] ??
        findCategoryOwnedOptionGroup(editingCategory.value, optionGroups.value)
          ?.optionGroupId ??
        "")
      : "";
    let savedOwnedOptionGroupId = knownOwnedOptionGroupId;

    if (editingCategory.value) {
      if (submission.isOptionGroup) {
        savedOwnedOptionGroupId = await ensureOwnedOptionGroup(
          knownOwnedOptionGroupId,
          submission.category.name,
        );
      } else if (knownOwnedOptionGroupId) {
        await store.deleteOptionGroup(knownOwnedOptionGroupId);
        savedOwnedOptionGroupId = "";
      }

      await store.updateCategory(
        editingCategory.value.menuCategoryId,
        submission.category,
      );
      if (savedOwnedOptionGroupId) {
        ownedOptionGroupMap[editingCategory.value.menuCategoryId] =
          savedOwnedOptionGroupId;
      } else {
        delete ownedOptionGroupMap[editingCategory.value.menuCategoryId];
      }
    } else {
      const previousCategoryIds = new Set(
        categories.value.map((category) => category.menuCategoryId),
      );
      const createCategorySnapshot = await store.createCategory(
        submission.category,
      );

      if (submission.isOptionGroup) {
        savedOwnedOptionGroupId = await ensureOwnedOptionGroup(
          "",
          submission.category.name,
        );
        const createdCategory = findCreatedCategory(
          createCategorySnapshot.categories,
          previousCategoryIds,
        );
        if (createdCategory && savedOwnedOptionGroupId) {
          ownedOptionGroupMap[createdCategory.menuCategoryId] =
            savedOwnedOptionGroupId;
        }
      }
    }

    closeCategoryDialog();
  } catch {
    localError.value = null;
  }
}

async function deleteCurrentCategory(): Promise<void> {
  if (!editingCategory.value || !window.confirm("Удалить группу меню?")) {
    return;
  }

  try {
    const ownedOptionGroupId =
      ownedOptionGroupMap[editingCategory.value.menuCategoryId] ??
      findCategoryOwnedOptionGroup(editingCategory.value, optionGroups.value)
        ?.optionGroupId ??
      "";

    await store.deleteCategory(editingCategory.value.menuCategoryId);
    if (ownedOptionGroupId) {
      await store.deleteOptionGroup(ownedOptionGroupId);
      delete ownedOptionGroupMap[editingCategory.value.menuCategoryId];
    }
    closeCategoryDialog();
  } catch {
    localError.value = null;
  }
}

function openCreateItemDialog(category?: MenuCategory): void {
  clearError();
  editingItem.value = null;
  defaultItemCategoryId.value =
    category?.menuCategoryId ?? categories.value[0]?.menuCategoryId ?? "";
  itemDialogOpen.value = true;
}

function openEditItemDialog(item: MenuItem): void {
  clearError();
  editingItem.value = item;
  defaultItemCategoryId.value = item.menuCategoryId;
  itemDialogOpen.value = true;
}

function closeItemDialog(): void {
  itemDialogOpen.value = false;
  defaultItemCategoryId.value = "";
  clearError();
}

async function submitItem(payload: MenuItemPayload): Promise<void> {
  clearError();
  const validation = validateMenuItemPayload(payload);
  if (!validation.valid) {
    localError.value = validation.message;
    return;
  }

  try {
    if (editingItem.value) {
      await store.updateItem(editingItem.value.menuItemId, payload);
    } else {
      await store.createItem(payload);
    }

    closeItemDialog();
  } catch {
    localError.value = null;
  }
}

async function deleteCurrentItem(): Promise<void> {
  if (!editingItem.value || !window.confirm("Удалить товар?")) {
    return;
  }

  try {
    await store.deleteItem(editingItem.value.menuItemId);
    closeItemDialog();
  } catch {
    localError.value = null;
  }
}

function clearError(): void {
  localError.value = null;
  errorToastOpen.value = false;
}

function categoryGroupLabel(count: number): string {
  return `${count} ${count === 1 ? "группа" : "групп"}`;
}

function optionGroupLabel(count: number): string {
  return `${count} ${count === 1 ? "группа опций" : "групп опций"}`;
}

async function ensureOwnedOptionGroup(
  ownedOptionGroupId: string,
  name: string,
): Promise<string> {
  const payload = createOwnedOptionGroupPayload(ownedOptionGroupId, name);
  if (ownedOptionGroupId) {
    const snapshot = await store.updateOptionGroup(ownedOptionGroupId, payload);
    return (
      snapshot.optionGroups.find(
        (group) => group.optionGroupId === ownedOptionGroupId,
      )?.optionGroupId ?? ownedOptionGroupId
    );
  }

  const previousGroupIds = new Set(
    optionGroups.value.map((group) => group.optionGroupId),
  );
  const snapshot = await store.createOptionGroup(payload);
  return (
    findCreatedOptionGroup(snapshot.optionGroups, previousGroupIds)
      ?.optionGroupId ?? ""
  );
}

function createOwnedOptionGroupPayload(
  ownedOptionGroupId: string,
  name: string,
): OptionGroupPayload {
  const existingGroup = optionGroups.value.find(
    (group) => group.optionGroupId === ownedOptionGroupId,
  );

  return {
    name,
    selectionMode: existingGroup?.selectionMode ?? "multiple",
    options:
      existingGroup?.options.map((option) => ({
        optionId: option.optionId,
        name: option.name,
        priceDelta: option.priceDelta,
        availability: option.availability,
      })) ?? [],
  };
}

function findCreatedCategory(
  nextCategories: readonly MenuCategory[],
  previousCategoryIds: Set<string>,
): MenuCategory | null {
  return (
    nextCategories.find(
      (category) => !previousCategoryIds.has(category.menuCategoryId),
    ) ?? null
  );
}

function findCreatedOptionGroup(
  nextOptionGroups: readonly OptionGroup[],
  previousGroupIds: Set<string>,
): OptionGroup | null {
  return (
    nextOptionGroups.find(
      (optionGroup) => !previousGroupIds.has(optionGroup.optionGroupId),
    ) ?? null
  );
}
</script>

<style scoped lang="scss">
.menu-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--app-color-background-secondary);
}

@media (min-width: 960px) {
  .menu-view {
    background: var(--app-color-background-primary);
  }
}

.menu-view__header {
  display: none;
}

@media (min-width: 960px) {
  .menu-view__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--app-spacing-md);
    padding: var(--app-spacing-lg) var(--app-spacing-lg) 0;
  }
}

.menu-view__title {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

.menu-view__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--app-color-text-secondary);
}

.menu-view__actions {
  display: flex;
  gap: var(--app-spacing-sm);
  padding: var(--app-spacing-md) var(--app-spacing-md) 12px;
}

@media (min-width: 960px) {
  .menu-view__actions {
    justify-content: flex-start;
    padding: var(--app-spacing-md) var(--app-spacing-lg) 12px;
  }
}

.menu-view__body {
  flex: 1;
  display: block;
  padding: 4px var(--app-spacing-md) 88px;
}

@media (min-width: 960px) {
  .menu-view__body {
    padding: 12px var(--app-spacing-lg) var(--app-spacing-lg);
  }
}

.action-button {
  flex: 1;
}

.menu-view__tooltip-group {
  position: relative;
  flex: 1;
  display: flex;
}

.menu-view__tooltip {
  display: none;
}

.loading-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: var(--app-color-text-secondary);
  font-size: 14px;
}

@media (min-width: 960px) {
  .action-button,
  .menu-view__tooltip-group {
    flex: 0 0 auto;
  }

  .menu-view__tooltip-group:hover .menu-view__tooltip {
    display: block;
  }

  .menu-view__tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
    padding: 8px 12px;
    border-radius: var(--app-radius-md);
    background: #111111;
    color: #ffffff;
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    pointer-events: none;
  }

  .menu-view__tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #111111;
  }
}
</style>
