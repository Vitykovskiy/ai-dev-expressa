<template>
  <form class="product-editor" data-testid="menu-product-editor" @submit.prevent="submit">
    <div class="product-editor__body">
      <MenuSectionHeader
        :label="mode === 'create' ? 'Новый товар' : 'Карточка товара'"
        :text="categoryName ? `Категория: ${categoryName}` : 'Выбранная категория не найдена.'"
        :title="mode === 'create' ? 'Создать товар' : 'Изменить товар'"
      />

      <v-text-field
        v-model="form.name"
        data-testid="product-name-input"
        label="Название товара"
        :error-messages="errors.name ? [errors.name] : []"
      />

      <v-select
        v-model="form.itemType"
        data-testid="product-type-select"
        item-title="label"
        item-value="value"
        label="Тип позиции"
        :items="itemTypeItems"
      />

      <v-text-field
        v-if="form.itemType === 'product'"
        v-model="form.basePrice"
        data-testid="product-base-price-input"
        inputmode="decimal"
        label="Базовая цена"
        suffix="₽"
        :error-messages="errors.basePrice ? [errors.basePrice] : []"
      />

      <div v-else class="product-editor__sizes">
        <v-text-field
          v-for="size in drinkSizes"
          :key="size"
          v-model="form.sizePrices[size]"
          :data-testid="`drink-size-price-${size}`"
          inputmode="decimal"
          :label="`Цена ${size}`"
          suffix="₽"
          :error-messages="readSizePriceErrors(size)"
        />
      </div>
    </div>

    <div class="product-editor__actions">
      <MenuActionButton type="button" variant="ghost" @click="$emit('cancel')">
        К списку товаров
      </MenuActionButton>
      <MenuActionButton type="submit" data-testid="submit-product-form">
        {{ mode === 'create' ? 'Добавить в черновик' : 'Обновить черновик' }}
      </MenuActionButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { DrinkSize, MenuCatalogItem, MenuCatalogItemType } from '@expressa/shared-types';
import { watch } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuSectionHeader from './menu/MenuSectionHeader.vue';
import {
  MENU_PRODUCT_EDITOR_DRINK_SIZES,
  createMenuProductDraft,
  useMenuProductEditor,
} from '../composables/menu-product-editor';
import type { MenuCatalogProductDraft } from '../types';

const props = defineProps<{
  categoryName: string | null;
  mode: 'create' | 'edit';
  product: MenuCatalogItem | null;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [productDraft: MenuCatalogProductDraft];
}>();

const itemTypeItems: { label: string; value: MenuCatalogItemType }[] = [
  {
    label: 'Товар без обязательного размера',
    value: 'product',
  },
  {
    label: 'Напиток с размерами S/M/L',
    value: 'drink',
  },
];
const drinkSizes = MENU_PRODUCT_EDITOR_DRINK_SIZES;
const { errors, form, reset, validate } = useMenuProductEditor(props.product);

watch(
  () => [props.mode, props.product?.menuItemId] as const,
  () => {
    reset(props.product);
  },
  { immediate: true },
);

function submit() {
  if (!validate()) {
    return;
  }

  emit('submit', createMenuProductDraft(form));
}

function readSizePriceErrors(size: DrinkSize): string[] {
  const error = errors.sizePrices[size];

  return error ? [error] : [];
}
</script>

<style scoped lang="scss">
.product-editor {
  display: grid;
  gap: 1.25rem;

  &__body {
    display: grid;
    gap: 1rem;
  }

  &__sizes {
    display: grid;
    gap: 0.75rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}

@media (min-width: 760px) {
  .product-editor__sizes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
