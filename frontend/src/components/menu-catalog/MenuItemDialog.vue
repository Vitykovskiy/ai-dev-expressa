<template>
  <div v-if="open" class="dialog-shell" role="dialog" aria-modal="true">
    <button type="button" class="dialog-shell__overlay" aria-label="Закрыть" @click="$emit('close')" />
    <form class="dialog-panel" @submit.prevent="submit">
      <div class="dialog-panel__title-row">
        <h2>{{ editingItem ? "Редактировать товар" : "Новый товар" }}</h2>
        <button
          v-if="editingItem"
          type="button"
          class="danger-icon-button"
          title="Удалить товар"
          @click="$emit('delete')"
        >
          <Trash2 :size="20" />
        </button>
      </div>
      <p class="dialog-panel__description">Настройте группу, название и ценовую модель</p>

      <label class="field">
        <span>Категория</span>
        <select v-model="form.menuCategoryId">
          <option value="">Выберите категорию</option>
          <option v-for="category in categories" :key="category.menuCategoryId" :value="category.menuCategoryId">
            {{ category.name }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Название товара</span>
        <input v-model="form.name" type="text" placeholder="Например: Капучино, Латте" />
      </label>

      <div class="switch-row">
        <span>
          <strong>Размеры S / M / L</strong>
          <small>Включить разные размеры с отдельными ценами</small>
        </span>
        <input v-model="form.itemType" type="checkbox" true-value="drink" false-value="regular" />
      </div>

      <div v-if="form.itemType === 'drink'" class="size-price-list">
        <span class="field-title">Цены по размерам, ₽</span>
        <label v-for="size in DRINK_SIZES" :key="size" class="size-field">
          <strong>{{ size }}</strong>
          <input v-model="form.sizePrices[size]" type="number" min="0" step="0.01" placeholder="0" />
        </label>
      </div>

      <label v-else class="field">
        <span>Цена, ₽</span>
        <input v-model="form.basePrice" type="number" min="0" step="0.01" placeholder="0" />
      </label>

      <div class="dialog-panel__actions">
        <button type="submit" class="primary-button" :disabled="isBusy">
          {{ editingItem ? "Сохранить изменения" : "Добавить товар" }}
        </button>
        <button type="button" class="ghost-button" @click="$emit('close')">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { reactive, watch } from "vue";
import {
  DRINK_SIZES,
  type DrinkSize,
  type MenuCategory,
  type MenuItem,
  type MenuItemFormState,
  type MenuItemPayload
} from "../../modules/menu-catalog/types";
import { formatMoney, normalizeDrinkSizePrices, parseMoney } from "../../modules/menu-catalog/validation";

const props = defineProps<{
  open: boolean;
  isBusy: boolean;
  editingItem: MenuItem | null;
  categories: readonly MenuCategory[];
  defaultCategoryId: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: MenuItemPayload];
  delete: [];
}>();

const form = reactive<MenuItemFormState>(createEmptyItemForm());

watch(
  () => [props.open, props.editingItem, props.defaultCategoryId] as const,
  ([open, editingItem, defaultCategoryId]) => {
    if (!open) {
      resetForm();
      return;
    }

    if (!editingItem) {
      resetForm(defaultCategoryId || props.categories[0]?.menuCategoryId || "");
      return;
    }

    form.menuCategoryId = editingItem.menuCategoryId;
    form.name = editingItem.name;
    form.itemType = editingItem.itemType;
    form.basePrice = formatMoney(editingItem.basePrice);
    form.sizePrices = createEmptySizePrices();

    for (const sizePrice of editingItem.drinkSizePrices ?? []) {
      form.sizePrices[sizePrice.size] = formatMoney(sizePrice.price);
    }
  },
  { immediate: true }
);

function submit(): void {
  emit("submit", {
    menuCategoryId: form.menuCategoryId,
    name: form.name.trim(),
    itemType: form.itemType,
    basePrice: form.itemType === "regular" ? parseMoney(form.basePrice) : undefined,
    drinkSizePrices: form.itemType === "drink" ? normalizeDrinkSizePrices(form.sizePrices) : undefined
  });
}

function resetForm(menuCategoryId = ""): void {
  form.menuCategoryId = menuCategoryId;
  form.name = "";
  form.itemType = "regular";
  form.basePrice = "";
  form.sizePrices = createEmptySizePrices();
}

function createEmptyItemForm(): MenuItemFormState {
  return {
    menuCategoryId: "",
    name: "",
    itemType: "regular",
    basePrice: "",
    sizePrices: createEmptySizePrices()
  };
}

function createEmptySizePrices(): Record<DrinkSize, string> {
  return {
    S: "",
    M: "",
    L: ""
  };
}
</script>

<style scoped lang="scss">
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

@media (min-width: 640px) {
  .dialog-shell {
    align-items: center;
  }

  .dialog-panel {
    max-width: 480px;
    border-radius: 8px;
  }
}

.dialog-panel__title-row,
.dialog-panel__actions,
.switch-row,
.size-field {
  display: flex;
  gap: 12px;
}

.dialog-panel__title-row {
  align-items: center;
  justify-content: space-between;
}

.dialog-panel__actions {
  flex-direction: column;
  margin-top: 24px;
}

.dialog-panel h2 {
  margin: 0;
  color: #111111;
}

.dialog-panel__description {
  margin: 4px 0 0;
  color: #777777;
  font-size: 13px;
  line-height: 20px;
}

.field,
.size-price-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.field span,
.field-title {
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.field input,
.field select,
.size-field input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  color: #111111;
  background: #ffffff;
  font-size: 14px;
}

.switch-row {
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding: 14px 0;
  border-bottom: 1px solid #e0e0e0;
}

.switch-row span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.switch-row small {
  color: #999999;
  font-size: 12px;
}

.switch-row input {
  width: 18px;
  height: 18px;
  accent-color: #1a1aff;
}

.size-field {
  align-items: center;
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

.primary-button,
.ghost-button {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  background: #1a1aff;
  color: #ffffff;
}

.ghost-button {
  width: 100%;
  background: transparent;
  color: #555555;
}

.danger-icon-button {
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #d32f2f;
  cursor: pointer;
}
</style>
