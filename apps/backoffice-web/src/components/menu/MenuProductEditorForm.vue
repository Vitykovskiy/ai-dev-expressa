<template>
  <form class="product-editor" data-testid="menu-product-editor" @submit.prevent="submit">
    <div class="product-editor__body">
      <div class="product-editor__header">
        <p class="product-editor__label">{{ mode === 'create' ? 'Новый товар' : 'Карточка товара' }}</p>
        <h3 class="product-editor__title">
          {{ mode === 'create' ? 'Создать товар' : 'Изменить товар' }}
        </h3>
        <p class="product-editor__text">
          {{ categoryName ? `Категория: ${categoryName}` : 'Выбранная категория не найдена.' }}
        </p>
      </div>

      <FormField label="Название товара" :error="errors.name ?? undefined" required>
        <v-text-field
          v-model="form.name"
          data-testid="product-name-input"
          hide-details="auto"
          placeholder="Например, Флэт уайт"
          variant="outlined"
        />
      </FormField>

      <section class="product-editor__mode">
        <ToggleRow
          v-model="isDrinkModel"
          label="Напиток с размерами S/M/L"
          sublabel="Отключите переключатель для товара с одной базовой ценой."
        />
      </section>

      <FormField
        v-if="form.itemType === 'product'"
        label="Базовая цена"
        :error="errors.basePrice ?? undefined"
        required
      >
        <v-text-field
          v-model="form.basePrice"
          data-testid="product-base-price-input"
          hide-details="auto"
          inputmode="decimal"
          placeholder="0"
          suffix="₽"
          variant="outlined"
        />
      </FormField>

      <section v-else class="product-editor__sizes">
        <header class="product-editor__section-header">
          <p class="product-editor__section-label">Цены размеров</p>
          <p class="product-editor__section-text">
            Для напитка обязательны цены размеров `S`, `M` и `L`.
          </p>
        </header>

        <div class="product-editor__size-grid">
          <FormField
            v-for="size in drinkSizes"
            :key="size"
            :label="`Цена ${size}`"
            :error="readSizePriceError(size)"
            required
          >
            <v-text-field
              v-model="form.sizePrices[size]"
              :data-testid="`drink-size-price-${size}`"
              hide-details="auto"
              inputmode="decimal"
              placeholder="0"
              suffix="₽"
              variant="outlined"
            />
          </FormField>
        </div>
      </section>
    </div>

    <div class="product-editor__actions">
      <Button type="button" variant="ghost" @click="$emit('cancel')">К списку товаров</Button>
      <Button type="submit" data-testid="submit-product-form">
        {{ mode === 'create' ? 'Добавить в черновик' : 'Обновить черновик' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { DrinkSize, MenuCatalogItem } from '@expressa/shared-types';
import { computed, watch } from 'vue';
import { Button, FormField, ToggleRow } from '../base';
import {
  MENU_PRODUCT_EDITOR_DRINK_SIZES,
  createMenuProductDraft,
  useMenuProductEditor,
} from '../../composables/menu-product-editor';
import type { MenuCatalogProductDraft } from '../../types';

const props = defineProps<{
  categoryName: string | null;
  mode: 'create' | 'edit';
  product: MenuCatalogItem | null;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [productDraft: MenuCatalogProductDraft];
}>();

const drinkSizes = MENU_PRODUCT_EDITOR_DRINK_SIZES;
const { errors, form, reset, validate } = useMenuProductEditor(props.product);

const isDrinkModel = computed({
  get: () => form.itemType === 'drink',
  set: (value: boolean) => {
    form.itemType = value ? 'drink' : 'product';
  },
});

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

  const productDraft = createMenuProductDraft(form);

  emit('submit', productDraft);
}

function readSizePriceError(size: DrinkSize): string {
  return errors.sizePrices[size] ?? '';
}
</script>

<style scoped lang="scss">
.product-editor {
  display: grid;
  gap: 1.5rem;
}

.product-editor__body,
.product-editor__header,
.product-editor__sizes {
  display: grid;
  gap: 1rem;
}

.product-editor__header {
  gap: 0.5rem;
}

.product-editor__label,
.product-editor__title,
.product-editor__text,
.product-editor__section-label,
.product-editor__section-text {
  margin: 0;
}

.product-editor__label {
  color: var(--expressa-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-editor__title {
  color: var(--expressa-color-text-primary);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
}

.product-editor__text,
.product-editor__section-text {
  color: var(--expressa-color-text-secondary);
  line-height: 1.6;
}

.product-editor__mode,
.product-editor__sizes {
  padding: 1rem;
  border: 1px solid var(--expressa-color-border);
  border-radius: 1rem;
  background: rgba(245, 245, 247, 0.55);
}

.product-editor__section-header {
  display: grid;
  gap: 0.25rem;
}

.product-editor__section-label {
  color: var(--expressa-color-text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.product-editor__size-grid {
  display: grid;
  gap: 0.75rem;
}

.product-editor__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (min-width: 760px) {
  .product-editor__size-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
