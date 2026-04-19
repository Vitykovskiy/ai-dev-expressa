<template>
  <v-dialog :model-value="open" max-width="480" @update:model-value="handleDialogModelUpdate">
    <v-card class="dialog-card" rounded="lg">
      <form @submit.prevent="submit">
        <div class="dialog-card__header">
          <div>
            <h2>{{ editingItem ? "Редактировать товар" : "Новый товар" }}</h2>
            <p class="dialog-card__description">Настройте группу, название и ценовую модель</p>
          </div>
          <v-btn
            v-if="editingItem"
            color="error"
            variant="text"
            icon
            title="Удалить товар"
            @click="$emit('delete')"
          >
            <Trash2 :size="20" />
          </v-btn>
        </div>

        <div class="dialog-card__body">
          <v-select
            v-model="form.menuCategoryId"
            :items="categoryItems"
            item-title="title"
            item-value="value"
            label="Категория"
            placeholder="Выберите категорию"
            variant="outlined"
            density="comfortable"
            hide-details
          />

          <v-text-field
            v-model="form.name"
            label="Название товара"
            placeholder="Например: Капучино, Латте"
            variant="outlined"
            density="comfortable"
            hide-details
          />

          <v-sheet class="switch-row" rounded="lg" border>
            <span>
              <strong>Размеры S / M / L</strong>
              <small>Включить разные размеры с отдельными ценами</small>
            </span>
            <v-switch
              :model-value="form.itemType === 'drink'"
              color="primary"
              density="comfortable"
              hide-details
              inset
              @update:model-value="updateItemType"
            />
          </v-sheet>

          <div v-if="form.itemType === 'drink'" class="size-price-list">
            <span class="field-title">Цены по размерам, ₽</span>
            <div v-for="size in DRINK_SIZES" :key="size" class="size-field">
              <strong>{{ size }}</strong>
              <v-text-field
                v-model="form.sizePrices[size]"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </div>
          </div>

          <v-text-field
            v-else
            v-model="form.basePrice"
            label="Цена, ₽"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </div>

        <v-card-actions class="dialog-card__actions">
          <v-btn class="dialog-action" color="primary" type="submit" :loading="isBusy" :disabled="isBusy">
            {{ editingItem ? "Сохранить изменения" : "Добавить товар" }}
          </v-btn>
          <v-btn class="dialog-action" color="secondary" variant="text" @click="$emit('close')">Отмена</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { computed, reactive, watch } from "vue";
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
const categoryItems = computed(() =>
  props.categories.map((category) => ({
    title: category.name,
    value: category.menuCategoryId
  }))
);

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

function handleDialogModelUpdate(value: boolean): void {
  if (!value) {
    emit("close");
  }
}

function updateItemType(value: boolean | null): void {
  form.itemType = value ? "drink" : "regular";
}

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
.dialog-card {
  padding: 24px;
  background: #ffffff;
}

.dialog-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.dialog-card h2 {
  margin: 0;
  color: #111111;
}

.dialog-card__description {
  margin: 4px 0 0;
  color: #777777;
  font-size: 13px;
  line-height: 20px;
}

.dialog-card__body,
.size-price-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dialog-card__body {
  margin-top: 20px;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
}

.switch-row span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.switch-row strong {
  color: #111111;
}

.switch-row small {
  color: #999999;
  font-size: 12px;
}

.field-title {
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.size-field {
  display: flex;
  align-items: center;
  gap: 12px;
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

.dialog-card__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0 0;
}

.dialog-action {
  min-height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}
</style>
