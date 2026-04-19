<template>
  <section class="menu-view">
    <AppTopBar title="Меню" />

    <div class="menu-view__header">
      <div>
        <h1 class="menu-view__title">Меню</h1>
        <p class="menu-view__subtitle">
          {{ categoryCountLabel(categories.length) }}, {{ itemCountLabel(snapshot.items.length) }}
        </p>
      </div>
      <AppButton class="guide-button" variant="outlined" @click="openCreateOptionGroupDialog">
        <Plus :size="18" />
        <span>Группа опций</span>
      </AppButton>
    </div>

    <div class="menu-view__actions">
      <AppButton class="action-button" :disabled="isBusy" @click="openCreateCategoryDialog">
        Добавить группу
      </AppButton>
      <AppButton
        class="action-button"
        variant="outlined"
        :disabled="categories.length === 0 || isBusy"
        title="Сначала создайте группу"
        @click="openCreateItemDialog()"
      >
        Добавить товар
      </AppButton>
    </div>

    <v-alert v-if="hasError" class="error-banner" type="error" variant="tonal" density="comfortable">
      {{ errorMessage }}
    </v-alert>

    <v-sheet v-if="isLoading" class="loading-panel" rounded="lg" color="surface">
      <v-progress-circular indeterminate color="primary" :size="36" :width="4" />
      <span>Загружаем каталог</span>
    </v-sheet>

    <div v-else class="menu-view__body">
      <MenuCatalogCategoryList
        :categories="categories"
        :category-items-map="categoryItemsMap"
        :category-option-groups-map="categoryOptionGroupsMap"
        @edit-category="openEditCategoryDialog"
        @create-item="openCreateItemDialog"
        @edit-item="openEditItemDialog"
      />

      <MenuCatalogOptionGroupsPanel
        :option-groups="optionGroups"
        @create="openCreateOptionGroupDialog"
        @edit="openEditOptionGroupDialog"
      />
    </div>

    <MenuCategoryDialog
      :open="categoryDialogOpen"
      :is-busy="isBusy"
      :editing-category="editingCategory"
      :option-groups="optionGroups"
      @close="closeCategoryDialog"
      @submit="submitCategory"
      @delete="deleteCurrentCategory"
    />

    <MenuItemDialog
      :open="itemDialogOpen"
      :is-busy="isBusy"
      :editing-item="editingItem"
      :categories="categories"
      :default-category-id="defaultItemCategoryId"
      @close="closeItemDialog"
      @submit="submitItem"
      @delete="deleteCurrentItem"
    />

    <MenuOptionGroupDialog
      :open="optionGroupDialogOpen"
      :is-busy="isBusy"
      :editing-option-group="editingOptionGroup"
      :categories="categories"
      @close="closeOptionGroupDialog"
      @submit="submitOptionGroup"
      @delete="deleteCurrentOptionGroup"
    />
  </section>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import MenuCatalogCategoryList from "../components/menu-catalog/MenuCatalogCategoryList.vue";
import MenuCatalogOptionGroupsPanel from "../components/menu-catalog/MenuCatalogOptionGroupsPanel.vue";
import MenuCategoryDialog from "../components/menu-catalog/MenuCategoryDialog.vue";
import MenuItemDialog from "../components/menu-catalog/MenuItemDialog.vue";
import MenuOptionGroupDialog from "../components/menu-catalog/MenuOptionGroupDialog.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppTopBar from "../components/ui/AppTopBar.vue";
import { categoryCountLabel, itemCountLabel } from "../modules/menu-catalog/presentation";
import { useMenuCatalogStore } from "../modules/menu-catalog/store";
import type {
  MenuCategory,
  MenuCategoryPayload,
  MenuItem,
  MenuItemPayload,
  OptionGroup,
  OptionGroupPayload
} from "../modules/menu-catalog/types";
import {
  mapMenuCatalogError,
  validateMenuItemPayload,
  validateOptionGroupPayload
} from "../modules/menu-catalog/validation";

const store = useMenuCatalogStore();
const localError = ref<string | null>(null);

const categoryDialogOpen = ref(false);
const editingCategory = ref<MenuCategory | null>(null);

const itemDialogOpen = ref(false);
const editingItem = ref<MenuItem | null>(null);
const defaultItemCategoryId = ref("");

const optionGroupDialogOpen = ref(false);
const editingOptionGroup = ref<OptionGroup | null>(null);

const snapshot = computed(() => store.state.snapshot);
const categories = computed(() => snapshot.value.categories);
const optionGroups = computed(() => snapshot.value.optionGroups);
const categoryItemsMap = computed<Record<string, MenuItem[]>>(() =>
  snapshot.value.items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const list = acc[item.menuCategoryId] ?? [];
    list.push(item);
    acc[item.menuCategoryId] = list;
    return acc;
  }, {})
);
const categoryOptionGroupsMap = computed<Record<string, OptionGroup[]>>(() =>
  categories.value.reduce<Record<string, OptionGroup[]>>((acc, category) => {
    acc[category.menuCategoryId] = optionGroups.value.filter((group) =>
      category.optionGroupRefs.includes(group.optionGroupId)
    );
    return acc;
  }, {})
);
const isBusy = computed(() => store.state.status === "loading" || store.state.status === "saving");
const isLoading = computed(() => store.state.status === "loading");
const errorMessage = computed(() => localError.value ?? mapMenuCatalogError(store.state.errorCode));
const hasError = computed(() => Boolean(localError.value || store.state.errorCode));

onMounted(() => {
  void store.loadCatalog().catch(() => undefined);
});

function openCreateCategoryDialog(): void {
  clearError();
  editingCategory.value = null;
  categoryDialogOpen.value = true;
}

function openEditCategoryDialog(category: MenuCategory): void {
  clearError();
  editingCategory.value = category;
  categoryDialogOpen.value = true;
}

function closeCategoryDialog(): void {
  categoryDialogOpen.value = false;
  clearError();
}

async function submitCategory(payload: MenuCategoryPayload): Promise<void> {
  clearError();
  if (!payload.name.trim()) {
    localError.value = "Введите название группы";
    return;
  }

  try {
    if (editingCategory.value) {
      await store.updateCategory(editingCategory.value.menuCategoryId, payload);
    } else {
      await store.createCategory(payload);
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
    await store.deleteCategory(editingCategory.value.menuCategoryId);
    closeCategoryDialog();
  } catch {
    localError.value = null;
  }
}

function openCreateItemDialog(category?: MenuCategory): void {
  clearError();
  editingItem.value = null;
  defaultItemCategoryId.value = category?.menuCategoryId ?? categories.value[0]?.menuCategoryId ?? "";
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

function openCreateOptionGroupDialog(): void {
  clearError();
  editingOptionGroup.value = null;
  optionGroupDialogOpen.value = true;
}

function openEditOptionGroupDialog(group: OptionGroup): void {
  clearError();
  editingOptionGroup.value = group;
  optionGroupDialogOpen.value = true;
}

function closeOptionGroupDialog(): void {
  optionGroupDialogOpen.value = false;
  clearError();
}

async function submitOptionGroup({
  payload,
  assignedCategoryIds
}: {
  payload: OptionGroupPayload;
  assignedCategoryIds: string[];
}): Promise<void> {
  clearError();
  const validation = validateOptionGroupPayload(payload);
  if (!validation.valid) {
    localError.value = validation.message;
    return;
  }

  try {
    const nextSnapshot = editingOptionGroup.value
      ? await store.updateOptionGroup(editingOptionGroup.value.optionGroupId, payload)
      : await store.createOptionGroup(payload);
    const savedGroup =
      editingOptionGroup.value ??
      nextSnapshot.optionGroups.find((group) => group.name === payload.name);

    if (savedGroup) {
      await syncOptionGroupAssignments(savedGroup.optionGroupId, assignedCategoryIds);
    }

    closeOptionGroupDialog();
  } catch {
    localError.value = null;
  }
}

async function deleteCurrentOptionGroup(): Promise<void> {
  if (!editingOptionGroup.value || !window.confirm("Удалить группу опций?")) {
    return;
  }

  try {
    await store.deleteOptionGroup(editingOptionGroup.value.optionGroupId);
    closeOptionGroupDialog();
  } catch {
    localError.value = null;
  }
}

async function syncOptionGroupAssignments(optionGroupId: string, assignedCategoryIds: string[]): Promise<void> {
  const assigned = new Set(assignedCategoryIds);
  for (const category of categories.value) {
    const hasRef = category.optionGroupRefs.includes(optionGroupId);
    const shouldHaveRef = assigned.has(category.menuCategoryId);
    if (hasRef === shouldHaveRef) {
      continue;
    }

    const nextRefs = shouldHaveRef
      ? [...category.optionGroupRefs, optionGroupId]
      : category.optionGroupRefs.filter((ref) => ref !== optionGroupId);
    await store.updateCategory(category.menuCategoryId, {
      name: category.name,
      optionGroupRefs: nextRefs
    });
  }
}

function clearError(): void {
  localError.value = null;
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
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--app-spacing-md);
  padding: 4px var(--app-spacing-md) 88px;
}

@media (min-width: 960px) {
  .menu-view__body {
    grid-template-columns: minmax(0, 1fr) 340px;
    align-items: start;
    padding: 12px var(--app-spacing-lg) var(--app-spacing-lg);
  }
}

.action-button {
  flex: 1;
}

.guide-button {
  gap: 8px;
}

.error-banner {
  margin: 0 var(--app-spacing-md) 12px;
}

@media (min-width: 960px) {
  .error-banner {
    margin: 0 var(--app-spacing-lg) 12px;
  }
}

.loading-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: var(--app-color-text-secondary);
  font-size: 14px;
}
</style>
