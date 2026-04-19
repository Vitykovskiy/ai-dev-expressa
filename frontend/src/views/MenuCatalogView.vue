<script setup lang="ts">
import { BookOpen, ChevronDown, ChevronRight, Coffee, Edit3, Plus, Trash2, X } from "lucide-vue-next";
import { computed, onMounted, reactive, ref } from "vue";
import TopBar from "../components/TopBar.vue";
import { useMenuCatalogStore } from "../modules/menu-catalog/store";
import {
  DRINK_SIZES,
  type MenuCategory,
  type MenuItem,
  type OptionGroup,
  type OptionPayload,
  type SelectionMode
} from "../modules/menu-catalog/types";
import {
  formatMoney,
  mapMenuCatalogError,
  normalizeDrinkSizePrices,
  parseMoney,
  validateMenuItemPayload,
  validateOptionGroupPayload
} from "../modules/menu-catalog/validation";

const store = useMenuCatalogStore();
const expandedCategoryIds = ref<Set<string>>(new Set());
const localError = ref<string | null>(null);

const categoryDialogOpen = ref(false);
const editingCategory = ref<MenuCategory | null>(null);
const categoryForm = reactive({
  name: "",
  optionGroupRefs: [] as string[]
});

const itemDialogOpen = ref(false);
const editingItem = ref<MenuItem | null>(null);
const itemForm = reactive({
  menuCategoryId: "",
  name: "",
  itemType: "regular" as "regular" | "drink",
  basePrice: "",
  sizePrices: {
    S: "",
    M: "",
    L: ""
  } as Record<string, string>
});

const optionGroupDialogOpen = ref(false);
const editingOptionGroup = ref<OptionGroup | null>(null);
const optionGroupForm = reactive({
  name: "",
  selectionMode: "multiple" as SelectionMode,
  assignedCategoryIds: [] as string[],
  options: [] as EditableOption[]
});

interface EditableOption {
  optionId?: string;
  name: string;
  priceDelta: string;
  availability: boolean;
}

const snapshot = computed(() => store.state.snapshot);
const categories = computed(() => snapshot.value.categories);
const optionGroups = computed(() => snapshot.value.optionGroups);
const isBusy = computed(() => store.state.status === "loading" || store.state.status === "saving");
const errorMessage = computed(() => localError.value ?? mapMenuCatalogError(store.state.errorCode));
const hasError = computed(() => Boolean(localError.value || store.state.errorCode));

onMounted(() => {
  void store.loadCatalog().catch(() => undefined);
});

function categoryItems(menuCategoryId: string): MenuItem[] {
  return snapshot.value.items.filter((item) => item.menuCategoryId === menuCategoryId);
}

function categoryOptionGroups(category: MenuCategory): OptionGroup[] {
  return optionGroups.value.filter((group) => category.optionGroupRefs.includes(group.optionGroupId));
}

function toggleCategory(menuCategoryId: string): void {
  const next = new Set(expandedCategoryIds.value);
  if (next.has(menuCategoryId)) {
    next.delete(menuCategoryId);
  } else {
    next.add(menuCategoryId);
  }

  expandedCategoryIds.value = next;
}

function openCreateCategoryDialog(): void {
  editingCategory.value = null;
  categoryForm.name = "";
  categoryForm.optionGroupRefs = [];
  categoryDialogOpen.value = true;
}

function openEditCategoryDialog(category: MenuCategory): void {
  editingCategory.value = category;
  categoryForm.name = category.name;
  categoryForm.optionGroupRefs = [...category.optionGroupRefs];
  categoryDialogOpen.value = true;
}

async function submitCategory(): Promise<void> {
  localError.value = null;
  const name = categoryForm.name.trim();
  if (!name) {
    localError.value = "Введите название группы";
    return;
  }

  const payload = {
    name,
    optionGroupRefs: [...categoryForm.optionGroupRefs]
  };

  try {
    if (editingCategory.value) {
      await store.updateCategory(editingCategory.value.menuCategoryId, payload);
    } else {
      await store.createCategory(payload);
    }

    categoryDialogOpen.value = false;
  } catch {
    localError.value = null;
  }
}

async function deleteCurrentCategory(): Promise<void> {
  if (!editingCategory.value) {
    return;
  }

  const confirmed = window.confirm("Удалить группу меню?");
  if (!confirmed) {
    return;
  }

  try {
    await store.deleteCategory(editingCategory.value.menuCategoryId);
    categoryDialogOpen.value = false;
  } catch {
    localError.value = null;
  }
}

function openCreateItemDialog(category?: MenuCategory): void {
  editingItem.value = null;
  itemForm.menuCategoryId = category?.menuCategoryId ?? categories.value[0]?.menuCategoryId ?? "";
  itemForm.name = "";
  itemForm.itemType = "regular";
  itemForm.basePrice = "";
  itemForm.sizePrices = { S: "", M: "", L: "" };
  itemDialogOpen.value = true;
}

function openEditItemDialog(item: MenuItem): void {
  editingItem.value = item;
  itemForm.menuCategoryId = item.menuCategoryId;
  itemForm.name = item.name;
  itemForm.itemType = item.itemType;
  itemForm.basePrice = formatMoney(item.basePrice);
  itemForm.sizePrices = { S: "", M: "", L: "" };

  for (const sizePrice of item.drinkSizePrices ?? []) {
    itemForm.sizePrices[sizePrice.size] = formatMoney(sizePrice.price);
  }

  itemDialogOpen.value = true;
}

async function submitItem(): Promise<void> {
  localError.value = null;
  const payload = {
    menuCategoryId: itemForm.menuCategoryId,
    name: itemForm.name.trim(),
    itemType: itemForm.itemType,
    basePrice: itemForm.itemType === "regular" ? parseMoney(itemForm.basePrice) : undefined,
    drinkSizePrices:
      itemForm.itemType === "drink" ? normalizeDrinkSizePrices(itemForm.sizePrices) : undefined
  };
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

    itemDialogOpen.value = false;
  } catch {
    localError.value = null;
  }
}

async function deleteCurrentItem(): Promise<void> {
  if (!editingItem.value) {
    return;
  }

  const confirmed = window.confirm("Удалить товар?");
  if (!confirmed) {
    return;
  }

  try {
    await store.deleteItem(editingItem.value.menuItemId);
    itemDialogOpen.value = false;
  } catch {
    localError.value = null;
  }
}

function openCreateOptionGroupDialog(): void {
  editingOptionGroup.value = null;
  optionGroupForm.name = "";
  optionGroupForm.selectionMode = "multiple";
  optionGroupForm.assignedCategoryIds = [];
  optionGroupForm.options = [createEditableOption()];
  optionGroupDialogOpen.value = true;
}

function openEditOptionGroupDialog(group: OptionGroup): void {
  editingOptionGroup.value = group;
  optionGroupForm.name = group.name;
  optionGroupForm.selectionMode = group.selectionMode;
  optionGroupForm.assignedCategoryIds = categories.value
    .filter((category) => category.optionGroupRefs.includes(group.optionGroupId))
    .map((category) => category.menuCategoryId);
  optionGroupForm.options =
    group.options.length > 0
      ? group.options.map((option) => ({
          optionId: option.optionId,
          name: option.name,
          priceDelta: formatMoney(option.priceDelta),
          availability: option.availability
        }))
      : [createEditableOption()];
  optionGroupDialogOpen.value = true;
}

function addEditableOption(): void {
  optionGroupForm.options.push(createEditableOption());
}

function removeEditableOption(index: number): void {
  optionGroupForm.options.splice(index, 1);
  if (optionGroupForm.options.length === 0) {
    addEditableOption();
  }
}

async function submitOptionGroup(): Promise<void> {
  localError.value = null;
  const payload = {
    name: optionGroupForm.name.trim(),
    selectionMode: optionGroupForm.selectionMode,
    options: optionGroupForm.options
      .filter((option) => option.name.trim())
      .map<OptionPayload>((option) => ({
        optionId: option.optionId,
        name: option.name.trim(),
        priceDelta: parseMoney(option.priceDelta),
        availability: option.availability
      }))
  };
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
      await syncOptionGroupAssignments(savedGroup.optionGroupId);
    }

    optionGroupDialogOpen.value = false;
  } catch {
    localError.value = null;
  }
}

async function syncOptionGroupAssignments(optionGroupId: string): Promise<void> {
  const assigned = new Set(optionGroupForm.assignedCategoryIds);
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

async function deleteCurrentOptionGroup(): Promise<void> {
  if (!editingOptionGroup.value) {
    return;
  }

  const confirmed = window.confirm("Удалить группу опций?");
  if (!confirmed) {
    return;
  }

  try {
    await store.deleteOptionGroup(editingOptionGroup.value.optionGroupId);
    optionGroupDialogOpen.value = false;
  } catch {
    localError.value = null;
  }
}

function createEditableOption(): EditableOption {
  return {
    name: "",
    priceDelta: "0",
    availability: true
  };
}

function itemPriceLabel(item: MenuItem): string {
  if (item.itemType === "drink") {
    const prices = item.drinkSizePrices ?? [];
    const minPrice = Math.min(...prices.map((price) => price.price));
    return Number.isFinite(minPrice) ? `от ${minPrice} ₽` : "Нет цены";
  }

  return typeof item.basePrice === "number" ? `${item.basePrice} ₽` : "Нет цены";
}

function selectionModeLabel(mode: SelectionMode): string {
  return mode === "single" ? "Один вариант" : "Несколько вариантов";
}
</script>

<template>
  <section class="menu-view">
    <TopBar title="Меню" />

    <div class="menu-view__header">
      <div>
        <h1 class="menu-view__title">Меню</h1>
        <p class="menu-view__subtitle">
          {{ categories.length }} {{ categories.length === 1 ? "группа" : "групп" }},
          {{ snapshot.items.length }} {{ snapshot.items.length === 1 ? "товар" : "товаров" }}
        </p>
      </div>
      <button type="button" class="guide-button" @click="openCreateOptionGroupDialog">
        <Plus :size="18" />
        Группа опций
      </button>
    </div>

    <div class="menu-view__actions">
      <button type="button" class="primary-button" :disabled="isBusy" @click="openCreateCategoryDialog">
        Добавить группу
      </button>
      <button
        type="button"
        class="secondary-button"
        :disabled="categories.length === 0 || isBusy"
        title="Сначала создайте группу"
        @click="openCreateItemDialog()"
      >
        Добавить товар
      </button>
    </div>

    <div v-if="hasError" class="error-banner" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="store.state.status === 'loading'" class="loading-panel" aria-live="polite">
      <v-progress-circular indeterminate color="primary" :size="36" :width="4" />
      <span>Загружаем каталог</span>
    </div>

    <div v-else class="menu-view__body">
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
                  <small>
                    {{ categoryItems(category.menuCategoryId).length }}
                    {{ categoryItems(category.menuCategoryId).length === 1 ? "товар" : "товаров" }}
                  </small>
                </span>
              </button>
              <button
                type="button"
                class="icon-button"
                title="Редактировать группу"
                @click="openEditCategoryDialog(category)"
              >
                <Edit3 :size="18" />
              </button>
            </div>

            <div v-if="expandedCategoryIds.has(category.menuCategoryId)" class="category-detail">
              <div v-if="categoryOptionGroups(category).length > 0" class="assigned-groups">
                <span v-for="group in categoryOptionGroups(category)" :key="group.optionGroupId">
                  {{ group.name }}
                </span>
              </div>

              <div v-if="categoryItems(category.menuCategoryId).length === 0" class="category-empty">
                <Coffee :size="32" />
                <p>Товаров в этой группе пока нет</p>
                <button type="button" class="inline-button" @click="openCreateItemDialog(category)">
                  Добавить товар
                </button>
              </div>

              <button
                v-for="item in categoryItems(category.menuCategoryId)"
                :key="item.menuItemId"
                type="button"
                class="product-row"
                @click="openEditItemDialog(item)"
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

      <aside class="option-panel">
        <div class="option-panel__header">
          <div>
            <h2>Группы опций</h2>
            <p>Допы назначаются на группы меню</p>
          </div>
          <button type="button" class="icon-button" title="Добавить группу опций" @click="openCreateOptionGroupDialog">
            <Plus :size="18" />
          </button>
        </div>

        <div v-if="optionGroups.length === 0" class="option-panel__empty">
          Нет групп опций
        </div>

        <button
          v-for="group in optionGroups"
          :key="group.optionGroupId"
          type="button"
          class="option-group-row"
          @click="openEditOptionGroupDialog(group)"
        >
          <span>
            <strong>{{ group.name }}</strong>
            <small>{{ selectionModeLabel(group.selectionMode) }} · {{ group.options.length }} опций</small>
          </span>
          <ChevronRight :size="18" />
        </button>
      </aside>
    </div>

    <div v-if="categoryDialogOpen" class="dialog-shell" role="dialog" aria-modal="true">
      <button type="button" class="dialog-shell__overlay" aria-label="Закрыть" @click="categoryDialogOpen = false" />
      <form class="dialog-panel" @submit.prevent="submitCategory">
        <div class="dialog-panel__title-row">
          <h2>{{ editingCategory ? "Редактировать группу" : "Новая группа" }}</h2>
          <button
            v-if="editingCategory"
            type="button"
            class="danger-icon-button"
            title="Удалить группу"
            @click="deleteCurrentCategory"
          >
            <Trash2 :size="20" />
          </button>
        </div>
        <p class="dialog-panel__description">
          {{ editingCategory ? "Измените название и назначенные группы опций" : "Создайте новую группу для товаров" }}
        </p>

        <label class="field">
          <span>Название группы</span>
          <input v-model="categoryForm.name" type="text" placeholder="Например: Кофе, Чай, Десерты" autofocus />
        </label>

        <div class="choice-block">
          <span>Группы опций</span>
          <p v-if="optionGroups.length === 0">Нет доступных групп опций</p>
          <label v-for="group in optionGroups" :key="group.optionGroupId" class="check-row">
            <input v-model="categoryForm.optionGroupRefs" type="checkbox" :value="group.optionGroupId" />
            {{ group.name }}
          </label>
        </div>

        <div class="dialog-panel__actions">
          <button type="submit" class="primary-button" :disabled="isBusy">
            {{ editingCategory ? "Сохранить изменения" : "Добавить категорию" }}
          </button>
          <button type="button" class="ghost-button" @click="categoryDialogOpen = false">Отмена</button>
        </div>
      </form>
    </div>

    <div v-if="itemDialogOpen" class="dialog-shell" role="dialog" aria-modal="true">
      <button type="button" class="dialog-shell__overlay" aria-label="Закрыть" @click="itemDialogOpen = false" />
      <form class="dialog-panel" @submit.prevent="submitItem">
        <div class="dialog-panel__title-row">
          <h2>{{ editingItem ? "Редактировать товар" : "Новый товар" }}</h2>
          <button
            v-if="editingItem"
            type="button"
            class="danger-icon-button"
            title="Удалить товар"
            @click="deleteCurrentItem"
          >
            <Trash2 :size="20" />
          </button>
        </div>
        <p class="dialog-panel__description">Настройте группу, название и ценовую модель</p>

        <label class="field">
          <span>Категория</span>
          <select v-model="itemForm.menuCategoryId">
            <option value="">Выберите категорию</option>
            <option v-for="category in categories" :key="category.menuCategoryId" :value="category.menuCategoryId">
              {{ category.name }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Название товара</span>
          <input v-model="itemForm.name" type="text" placeholder="Например: Капучино, Латте" />
        </label>

        <div class="switch-row">
          <span>
            <strong>Размеры S / M / L</strong>
            <small>Включить разные размеры с отдельными ценами</small>
          </span>
          <input v-model="itemForm.itemType" type="checkbox" true-value="drink" false-value="regular" />
        </div>

        <div v-if="itemForm.itemType === 'drink'" class="size-price-list">
          <span class="field-title">Цены по размерам, ₽</span>
          <label v-for="size in DRINK_SIZES" :key="size" class="size-field">
            <strong>{{ size }}</strong>
            <input v-model="itemForm.sizePrices[size]" type="number" min="0" step="0.01" placeholder="0" />
          </label>
        </div>

        <label v-else class="field">
          <span>Цена, ₽</span>
          <input v-model="itemForm.basePrice" type="number" min="0" step="0.01" placeholder="0" />
        </label>

        <div class="dialog-panel__actions">
          <button type="submit" class="primary-button" :disabled="isBusy">
            {{ editingItem ? "Сохранить изменения" : "Добавить товар" }}
          </button>
          <button type="button" class="ghost-button" @click="itemDialogOpen = false">Отмена</button>
        </div>
      </form>
    </div>

    <div v-if="optionGroupDialogOpen" class="dialog-shell" role="dialog" aria-modal="true">
      <button type="button" class="dialog-shell__overlay" aria-label="Закрыть" @click="optionGroupDialogOpen = false" />
      <form class="dialog-panel dialog-panel--wide" @submit.prevent="submitOptionGroup">
        <div class="dialog-panel__sticky">
          <div class="dialog-panel__title-row">
            <h2>{{ editingOptionGroup ? "Редактировать группу опций" : "Новая группа опций" }}</h2>
            <div class="dialog-panel__icons">
              <button
                v-if="editingOptionGroup"
                type="button"
                class="danger-icon-button"
                title="Удалить группу опций"
                @click="deleteCurrentOptionGroup"
              >
                <Trash2 :size="20" />
              </button>
              <button type="button" class="plain-icon-button" title="Закрыть" @click="optionGroupDialogOpen = false">
                <X :size="20" />
              </button>
            </div>
          </div>
        </div>

        <label class="field">
          <span>Название группы опций</span>
          <input v-model="optionGroupForm.name" type="text" placeholder="Например: Молоко, Сиропы" autofocus />
        </label>

        <label class="field">
          <span>Тип выбора</span>
          <select v-model="optionGroupForm.selectionMode">
            <option value="multiple">Несколько вариантов</option>
            <option value="single">Один вариант</option>
          </select>
        </label>

        <div class="choice-block">
          <span>Назначить на группы меню</span>
          <p v-if="categories.length === 0">Сначала создайте группу меню</p>
          <label v-for="category in categories" :key="category.menuCategoryId" class="check-row">
            <input v-model="optionGroupForm.assignedCategoryIds" type="checkbox" :value="category.menuCategoryId" />
            {{ category.name }}
          </label>
        </div>

        <div class="options-editor">
          <div class="options-editor__header">
            <span>Опции</span>
            <button type="button" class="inline-button" @click="addEditableOption">Добавить опцию</button>
          </div>

          <div v-for="(option, index) in optionGroupForm.options" :key="index" class="option-edit-row">
            <input v-model="option.name" type="text" placeholder="Название опции" />
            <input v-model="option.priceDelta" type="number" min="0" step="0.01" placeholder="Доплата" />
            <label>
              <input v-model="option.availability" type="checkbox" />
              Доступна
            </label>
            <button type="button" class="danger-icon-button" title="Удалить опцию" @click="removeEditableOption(index)">
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

        <div class="dialog-panel__actions">
          <button type="submit" class="primary-button" :disabled="isBusy">
            {{ editingOptionGroup ? "Сохранить изменения" : "Добавить группу опций" }}
          </button>
          <button type="button" class="ghost-button" @click="optionGroupDialogOpen = false">Отмена</button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.menu-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f7;
}

@media (min-width: 960px) {
  .menu-view {
    background: #ffffff;
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
    gap: 16px;
    padding: 24px 24px 0;
  }
}

.menu-view__title,
.option-panel h2,
.dialog-panel h2,
.empty-state h2 {
  margin: 0;
  color: #111111;
}

.menu-view__title {
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

.menu-view__subtitle,
.option-panel p,
.dialog-panel__description,
.empty-state p {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: #777777;
}

.menu-view__actions {
  display: flex;
  gap: 8px;
  padding: 16px 16px 12px;
}

@media (min-width: 960px) {
  .menu-view__actions {
    justify-content: flex-start;
    padding: 16px 24px 12px;
  }
}

.primary-button,
.secondary-button,
.ghost-button,
.guide-button,
.inline-button {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  flex: 1;
  background: #1a1aff;
  color: #ffffff;
}

.secondary-button,
.guide-button {
  flex: 1;
  background: #ffffff;
  color: #111111;
  border: 1px solid #e0e0e0;
}

.guide-button {
  flex: initial;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ghost-button {
  width: 100%;
  background: transparent;
  color: #555555;
}

.inline-button {
  min-height: 34px;
  background: #e8e8ff;
  color: #1a1aff;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.error-banner {
  margin: 0 16px 12px;
  padding: 12px 14px;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  background: #ffebee;
  color: #b71c1c;
  font-size: 13px;
  line-height: 20px;
}

@media (min-width: 960px) {
  .error-banner {
    margin: 0 24px 12px;
  }
}

.loading-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: #555555;
  font-size: 14px;
}

.menu-view__body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 4px 16px 88px;
}

@media (min-width: 960px) {
  .menu-view__body {
    grid-template-columns: minmax(0, 1fr) 340px;
    align-items: start;
    padding: 12px 24px 24px;
  }
}

.catalog-panel,
.option-panel {
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
}

.empty-state,
.category-empty,
.option-panel__empty {
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

.category-block + .category-block {
  border-top: 1px solid #e0e0e0;
}

.category-row {
  display: flex;
  align-items: stretch;
  background: #f5f5f7;
}

.category-row__main,
.product-row,
.option-group-row {
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
.product-row span,
.option-group-row span,
.switch-row span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.category-row__main small,
.product-row small,
.option-group-row small,
.switch-row small {
  color: #999999;
  font-size: 12px;
}

.icon-button,
.danger-icon-button,
.plain-icon-button {
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #1a1aff;
  cursor: pointer;
}

.danger-icon-button {
  color: #d32f2f;
}

.plain-icon-button {
  color: #555555;
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

.option-panel {
  align-self: stretch;
}

.option-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.option-panel__header h2 {
  font-size: 18px;
}

.option-group-row {
  padding: 14px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-shell {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.dialog-shell__overlay {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.4);
}

.dialog-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  border-radius: 8px 8px 0 0;
  background: #ffffff;
}

.dialog-panel--wide {
  max-height: 85vh;
}

@media (min-width: 640px) {
  .dialog-shell {
    align-items: center;
  }

  .dialog-panel {
    max-width: 480px;
    border-radius: 8px;
  }

  .dialog-panel--wide {
    max-width: 720px;
  }
}

.dialog-panel__sticky {
  position: sticky;
  top: -24px;
  z-index: 1;
  margin: -24px -24px 20px;
  padding: 20px 24px 14px;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
}

.dialog-panel__title-row,
.dialog-panel__icons,
.options-editor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dialog-panel__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
}

.field,
.choice-block,
.options-editor,
.size-price-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.field span,
.choice-block > span,
.field-title,
.options-editor__header > span {
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.field input,
.field select,
.size-field input,
.option-edit-row input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  color: #111111;
  background: #ffffff;
  font-size: 14px;
}

.choice-block {
  padding: 14px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.choice-block p {
  margin: 0;
  color: #999999;
  font-size: 12px;
}

.check-row,
.switch-row,
.size-field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.check-row {
  min-height: 30px;
  color: #111111;
  font-size: 14px;
}

.switch-row {
  justify-content: space-between;
  margin-top: 18px;
  padding: 14px 0;
  border-bottom: 1px solid #e0e0e0;
}

.switch-row input,
.check-row input {
  width: 18px;
  height: 18px;
  accent-color: #1a1aff;
}

.size-field strong {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f5f5f7;
  color: #555555;
}

.option-edit-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid #e0e0e0;
}

@media (min-width: 640px) {
  .option-edit-row {
    grid-template-columns: minmax(0, 1fr) 120px 110px 44px;
    align-items: center;
  }
}
</style>
