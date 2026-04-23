<template>
  <ui-dialog-shell
    :open="open"
    :title="dialogTitle"
    :description="dialogDescription"
    @close="$emit('close')"
  >
    <template #headerActions>
      <ui-icon-button
        v-if="editingItem"
        class="delete-item-button"
        :title="deleteButtonTitle"
        @click="$emit('delete')"
      >
        <Trash2 :size="20" />
      </ui-icon-button>
    </template>

    <form id="menu-item-dialog-form" @submit.prevent="submit">
      <div class="dialog-card__body">
        <ui-form-field label="Категория" input-id="menu-item-category">
          <ui-select
            id="menu-item-category"
            v-model="form.menuCategoryId"
            :items="categoryItems"
            item-title="title"
            item-value="value"
            name="menuItemCategory"
            placeholder="Выберите категорию"
          />
        </ui-form-field>

        <ui-form-field label="Название товара" input-id="menu-item-name">
          <ui-text-field
            id="menu-item-name"
            v-model="form.name"
            name="menuItemName"
            placeholder="Например: Капучино, Латте"
          />
        </ui-form-field>

        <ui-toggle-row
          :model-value="sizePricesEnabled"
          label="Размеры S / M / L"
          description="Включить разные размеры с отдельными ценами"
          :disabled="isSelectedCategoryOptionGroup"
          @update:model-value="updateItemType"
        />

        <div v-if="sizePricesEnabled" class="size-price-group">
          <span class="size-price-group__label">Цены по размерам, ₽</span>

          <div class="size-price-list">
            <div v-for="size in DRINK_SIZES" :key="size" class="size-field">
              <strong>{{ size }}</strong>
              <span
                :id="`menu-item-size-price-${size.toLowerCase()}-label`"
                class="size-field__label"
              >
                Цена размера {{ size }}
              </span>
              <ui-text-field
                :id="`menu-item-size-price-${size.toLowerCase()}`"
                v-model="form.sizePrices[size]"
                :name="`menuItemSizePrice${size}`"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <ui-form-field v-else label="Цена, ₽" input-id="menu-item-base-price">
          <ui-text-field
            id="menu-item-base-price"
            v-model="form.basePrice"
            name="menuItemBasePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
          />
        </ui-form-field>
      </div>
    </form>

    <template #actions>
      <ui-button
        block
        type="submit"
        form="menu-item-dialog-form"
        :loading="isBusy"
        :disabled="isSubmitDisabled"
      >
        {{ submitButtonLabel }}
      </ui-button>
      <ui-button block variant="ghost" @click="$emit('close')"
        >Отмена</ui-button
      >
    </template>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { computed, reactive, watch } from "vue";
import UiButton from "@/ui/UiButton.vue";
import UiDialogShell from "@/ui/UiDialogShell.vue";
import UiFormField from "@/ui/UiFormField.vue";
import UiIconButton from "@/ui/UiIconButton.vue";
import UiSelect from "@/ui/UiSelect.vue";
import UiTextField from "@/ui/UiTextField.vue";
import UiToggleRow from "@/ui/UiToggleRow.vue";
import {
  DRINK_SIZES,
  type DrinkSize,
  type MenuCategory,
  type MenuItem,
  type MenuItemFormState,
  type MenuItemPayload,
} from "@/modules/menu-catalog/types";
import {
  formatMoney,
  normalizeDrinkSizePrices,
  parseMoney,
} from "@/modules/menu-catalog/validation";

const props = defineProps<{
  open: boolean;
  isBusy: boolean;
  editingItem: MenuItem | null;
  categories: readonly MenuCategory[];
  optionGroupCategoryIds: readonly string[];
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
    value: category.menuCategoryId,
  })),
);
const editingCategoryName = computed(
  () =>
    props.categories.find(
      (category) =>
        category.menuCategoryId === props.editingItem?.menuCategoryId,
    )?.name ?? "",
);
const isSelectedCategoryOptionGroup = computed(() =>
  props.optionGroupCategoryIds.includes(form.menuCategoryId),
);
const isEditingOption = computed(() =>
  props.optionGroupCategoryIds.includes(
    props.editingItem?.menuCategoryId ?? "",
  ),
);
const sizePricesEnabled = computed(
  () => !isSelectedCategoryOptionGroup.value && form.itemType === "drink",
);
const hasValidPrice = computed(() => {
  if (!sizePricesEnabled.value) {
    return hasNonNegativeMoneyInput(form.basePrice);
  }

  return DRINK_SIZES.every((size) =>
    hasPositiveMoneyInput(form.sizePrices[size]),
  );
});
const isFormValid = computed(
  () => Boolean(form.menuCategoryId && form.name.trim()) && hasValidPrice.value,
);
const isSubmitDisabled = computed(() => props.isBusy || !isFormValid.value);
const dialogDescription = computed(() =>
  props.editingItem
    ? `Категория: "${editingCategoryName.value}"`
    : isSelectedCategoryOptionGroup.value
      ? "Добавьте новую опцию в группу"
      : "Добавьте новый товар в меню",
);
const dialogTitle = computed(() => {
  if (props.editingItem) {
    return isEditingOption.value
      ? "Редактировать опцию"
      : "Редактировать товар";
  }

  return isSelectedCategoryOptionGroup.value ? "Новая опция" : "Новый товар";
});
const deleteButtonTitle = computed(() =>
  isEditingOption.value ? "Удалить опцию" : "Удалить товар",
);
const submitButtonLabel = computed(() => {
  if (props.editingItem) {
    return "Сохранить изменения";
  }

  return isSelectedCategoryOptionGroup.value
    ? "Добавить опцию"
    : "Добавить товар";
});

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
  { immediate: true },
);

watch(isSelectedCategoryOptionGroup, (selectedCategoryIsOptionGroup) => {
  if (selectedCategoryIsOptionGroup) {
    resetDrinkSizeModel();
  }
});

function updateItemType(value: boolean | null): void {
  if (isSelectedCategoryOptionGroup.value || !value) {
    resetDrinkSizeModel();
    return;
  }

  form.itemType = "drink";
}

function submit(): void {
  const itemType = sizePricesEnabled.value ? "drink" : "regular";

  emit("submit", {
    menuCategoryId: form.menuCategoryId,
    name: form.name.trim(),
    itemType,
    basePrice: itemType === "regular" ? parseMoney(form.basePrice) : undefined,
    drinkSizePrices:
      itemType === "drink"
        ? normalizeDrinkSizePrices(form.sizePrices)
        : undefined,
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
    sizePrices: createEmptySizePrices(),
  };
}

function createEmptySizePrices(): Record<DrinkSize, string> {
  return {
    S: "",
    M: "",
    L: "",
  };
}

function resetDrinkSizeModel(): void {
  form.itemType = "regular";
  form.sizePrices = createEmptySizePrices();
}

function hasNonNegativeMoneyInput(value: string): boolean {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return false;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0;
}

function hasPositiveMoneyInput(value: string): boolean {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return false;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0;
}
</script>

<style scoped lang="scss">
.dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delete-item-button {
  color: var(--app-color-destructive) !important;
}

.delete-item-button:hover {
  background: var(--app-color-destructive-light) !important;
}

.delete-item-button :deep(svg) {
  stroke: currentcolor;
}

.size-price-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.size-price-group__label {
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
}

.size-price-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.size-field {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.size-field :deep(.v-input) {
  flex: 1 1 0;
  min-width: 0;
}

.size-field strong {
  display: inline-flex;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: var(--app-radius-md);
  background: var(--app-color-background-secondary);
  color: var(--app-color-text-secondary);
}

.size-field__label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
