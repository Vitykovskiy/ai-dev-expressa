<template>
  <ui-dialog-shell
    :open="open"
    :title="editingItem ? 'Редактировать товар' : 'Новый товар'"
    :description="dialogDescription"
    @close="$emit('close')"
  >
    <template #headerActions>
      <ui-icon-button
        v-if="editingItem"
        title="Удалить товар"
        @click="$emit('delete')"
      >
        <Trash2 :size="20" />
      </ui-icon-button>
    </template>

    <form id="menu-item-dialog-form" @submit.prevent="submit">
      <div class="dialog-card__body">
        <ui-form-field label="Категория" input-id="menu-item-category">
          <v-select
            id="menu-item-category"
            v-model="form.menuCategoryId"
            :items="categoryItems"
            item-title="title"
            item-value="value"
            name="menuItemCategory"
            placeholder="Выберите категорию"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </ui-form-field>

        <ui-form-field label="Название товара" input-id="menu-item-name">
          <v-text-field
            id="menu-item-name"
            v-model="form.name"
            name="menuItemName"
            placeholder="Например: Капучино, Латте"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </ui-form-field>

        <ui-toggle-row
          :model-value="form.itemType === 'drink'"
          label="Размеры S / M / L"
          description="Включить разные размеры с отдельными ценами"
          @update:model-value="updateItemType"
        />

        <ui-section-card
          v-if="form.itemType === 'drink'"
          title="Цены по размерам, ₽"
          body-class="size-price-list"
        >
          <div v-for="size in DRINK_SIZES" :key="size" class="size-field">
            <strong>{{ size }}</strong>
            <span
              :id="`menu-item-size-price-${size.toLowerCase()}-label`"
              class="size-field__label"
            >
              Цена размера {{ size }}
            </span>
            <v-text-field
              :id="`menu-item-size-price-${size.toLowerCase()}`"
              v-model="form.sizePrices[size]"
              :name="`menuItemSizePrice${size}`"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </div>
        </ui-section-card>

        <ui-form-field v-else label="Цена, ₽" input-id="menu-item-base-price">
          <v-text-field
            id="menu-item-base-price"
            v-model="form.basePrice"
            name="menuItemBasePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            variant="outlined"
            density="comfortable"
            hide-details
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
        {{ editingItem ? "Сохранить изменения" : "Добавить товар" }}
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
import UiSectionCard from "@/ui/UiSectionCard.vue";
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
const hasValidPrice = computed(() => {
  if (form.itemType === "regular") {
    return parseMoney(form.basePrice) > 0;
  }

  return normalizeDrinkSizePrices(form.sizePrices).length > 0;
});
const isFormValid = computed(
  () => Boolean(form.menuCategoryId && form.name.trim()) && hasValidPrice.value,
);
const isSubmitDisabled = computed(() => props.isBusy || !isFormValid.value);
const dialogDescription = computed(() =>
  props.editingItem
    ? `Категория: "${editingCategoryName.value}"`
    : "Добавьте новый товар в меню",
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
  { immediate: true },
);

function updateItemType(value: boolean | null): void {
  form.itemType = value ? "drink" : "regular";
}

function submit(): void {
  emit("submit", {
    menuCategoryId: form.menuCategoryId,
    name: form.name.trim(),
    itemType: form.itemType,
    basePrice:
      form.itemType === "regular" ? parseMoney(form.basePrice) : undefined,
    drinkSizePrices:
      form.itemType === "drink"
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
</script>

<style scoped lang="scss">
.dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dialog-card__body :deep(.size-price-list) {
  display: flex;
  flex-direction: column;
  gap: 18px;
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
