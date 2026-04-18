<template>
  <form
    :id="formId"
    class="product-editor"
    data-testid="menu-product-editor"
    @submit.prevent="submit"
  >
    <div class="product-editor__body">
      <MenuSurfaceCard class="product-editor__summary" variant="subtle">
        <div class="product-editor__summary-head">
          <MenuSectionHeader
            :label="mode === 'create' ? 'Новый товар' : 'Карточка товара'"
            :text="categoryLine"
            :title="mode === 'create' ? 'Подготовьте позицию для черновика' : 'Обновите товар в черновике'"
          />
          <MenuBadge :tone="completionState.tone">
            {{ completionState.badge }}
          </MenuBadge>
        </div>

        <div class="product-editor__summary-grid">
          <article class="product-editor__summary-item">
            <p class="product-editor__summary-label">Тип позиции</p>
            <strong class="product-editor__summary-value">{{ selectedTypeCard.title }}</strong>
            <p class="product-editor__summary-text">{{ selectedTypeCard.description }}</p>
          </article>

          <article class="product-editor__summary-item">
            <p class="product-editor__summary-label">Ценовая модель</p>
            <strong class="product-editor__summary-value">{{ priceSummary }}</strong>
            <p class="product-editor__summary-text">{{ priceSummaryHint }}</p>
          </article>
        </div>
      </MenuSurfaceCard>

      <MenuSurfaceCard class="product-editor__section" variant="subtle">
        <MenuSectionHeader
          label="Основное"
          text="Наименование обязательно и используется в списке товаров, карточке и общем структурном снимке каталога."
          title="Название позиции"
        />

        <v-text-field
          v-model="form.name"
          data-testid="product-name-input"
          hide-details="auto"
          label="Название товара"
          placeholder="Например: Капучино, круассан, фильтр"
          :error-messages="errors.name ? [errors.name] : []"
        />
      </MenuSurfaceCard>

      <MenuSurfaceCard class="product-editor__section" variant="subtle">
        <MenuSectionHeader
          label="Тип позиции"
          text="Обычный товар использует одну цену. Напиток требует обязательную матрицу размеров S, M и L."
          title="Выберите модель товара"
        />

        <div class="product-editor__type-grid">
          <button
            v-for="item in itemTypeCards"
            :key="item.value"
            :data-testid="`select-${item.value}-type`"
            class="product-editor__type-card"
            :class="{
              'product-editor__type-card--selected': form.itemType === item.value,
            }"
            type="button"
            @click="selectItemType(item.value)"
          >
            <span class="product-editor__type-label">{{ item.label }}</span>
            <strong class="product-editor__type-title">{{ item.title }}</strong>
            <span class="product-editor__type-text">{{ item.description }}</span>
          </button>
        </div>
      </MenuSurfaceCard>

      <MenuSurfaceCard class="product-editor__section" variant="subtle">
        <MenuSectionHeader
          label="Цены"
          :text="priceSectionText"
          :title="priceSectionTitle"
        />

        <div v-if="form.itemType === 'product'" class="product-editor__single-price">
          <v-text-field
            v-model="form.basePrice"
            data-testid="product-base-price-input"
            hide-details="auto"
            inputmode="decimal"
            label="Цена"
            placeholder="0"
            suffix="₽"
            :error-messages="errors.basePrice ? [errors.basePrice] : []"
          />
          <p class="product-editor__hint">
            Используйте одну цену для товаров без обязательного выбора размера.
          </p>
        </div>

        <div v-else class="product-editor__sizes">
          <div
            v-for="size in drinkSizes"
            :key="size"
            class="product-editor__size-card"
          >
            <div class="product-editor__size-head">
              <MenuBadge size="compact">{{ size }}</MenuBadge>
              <span class="product-editor__size-text">Обязательное значение</span>
            </div>

            <v-text-field
              v-model="form.sizePrices[size]"
              :data-testid="`drink-size-price-${size}`"
              hide-details="auto"
              inputmode="decimal"
              :label="`Цена ${size}`"
              placeholder="0"
              suffix="₽"
              :error-messages="readSizePriceErrors(size)"
            />
          </div>
        </div>

        <div
          v-if="validationSummary.length > 0"
          class="product-editor__issues"
          data-testid="product-validation-summary"
        >
          <p class="product-editor__issues-title">Проверьте обязательные поля</p>
          <ul class="product-editor__issues-list">
            <li
              v-for="issue in validationSummary"
              :key="issue"
              class="product-editor__issues-item"
            >
              {{ issue }}
            </li>
          </ul>
        </div>

        <p v-if="submitError" class="product-editor__submit-error" data-testid="product-submit-error">
          {{ submitError }}
        </p>
      </MenuSurfaceCard>
    </div>

    <MenuStickyActionDock class="product-editor__actions" placement="bottom">
      <template #content>
        <div class="product-editor__dock-copy">
          <MenuBadge size="compact" :tone="completionState.tone">
            {{ completionState.badge }}
          </MenuBadge>
          <p class="product-editor__dock-text">
            {{ dockText }}
          </p>
        </div>
      </template>

      <template #actions>
        <MenuActionButton type="button" variant="ghost" @click="$emit('cancel')">
          К списку товаров
        </MenuActionButton>
        <MenuActionButton
          :disabled="submitPending"
          :loading="submitPending"
          data-testid="submit-product-form"
          type="submit"
        >
          {{ submitLabel }}
        </MenuActionButton>
      </template>
    </MenuStickyActionDock>
  </form>
</template>

<script setup lang="ts">
import type { DrinkSize, MenuCatalogItem, MenuCatalogItemType } from '@expressa/shared-types';
import { computed, watch } from 'vue';
import MenuStickyActionDock from './MenuStickyActionDock.vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuSectionHeader from './menu/MenuSectionHeader.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';
import {
  MENU_PRODUCT_EDITOR_DRINK_SIZES,
  createMenuProductDraft,
  useMenuProductEditor,
  validateMenuProductEditorForm,
} from '../composables/menu-product-editor';
import type { MenuCatalogProductDraft } from '../types';

interface MenuProductTypeCard {
  description: string;
  label: string;
  title: string;
  value: MenuCatalogItemType;
}

const props = withDefaults(
  defineProps<{
    categoryName: string | null;
    formId?: string;
    mode: 'create' | 'edit';
    product: MenuCatalogItem | null;
    submitError?: string | null;
    submitPending?: boolean;
  }>(),
  {
    formId: 'menu-product-editor-form',
    submitError: null,
    submitPending: false,
  },
);

const emit = defineEmits<{
  cancel: [];
  submit: [productDraft: MenuCatalogProductDraft];
}>();

const itemTypeCards: MenuProductTypeCard[] = [
  {
    label: 'Обычный товар',
    title: 'Одна цена без размеров',
    description: 'Подходит для выпечки, десертов и любых позиций без выбора S/M/L.',
    value: 'product',
  },
  {
    label: 'Напиток',
    title: 'Матрица цен S / M / L',
    description: 'Используйте для кофе и других напитков, где размер обязателен.',
    value: 'drink',
  },
];
const drinkSizes = MENU_PRODUCT_EDITOR_DRINK_SIZES;
const { errors, form, reset, setItemType, validate } = useMenuProductEditor(props.product);

watch(
  () => [props.mode, props.product?.menuItemId] as const,
  () => {
    reset(props.product);
  },
  { immediate: true },
);

const selectedTypeCard = computed(
  () => itemTypeCards.find((item) => item.value === form.itemType) ?? itemTypeCards[0],
);
const previewErrors = computed(() => validateMenuProductEditorForm(form));
const validationSummary = computed(() => {
  const issues: string[] = [];

  if (errors.name) {
    issues.push(errors.name);
  }

  if (errors.basePrice) {
    issues.push(errors.basePrice);
  }

  for (const size of drinkSizes) {
    const issue = errors.sizePrices[size];

    if (issue) {
      issues.push(issue);
    }
  }

  return issues;
});
const completionState = computed(() => {
  const missingFields = [
    previewErrors.value.name,
    previewErrors.value.basePrice,
    ...drinkSizes.map((size) => previewErrors.value.sizePrices[size]),
  ].filter((issue): issue is string => issue !== null);

  if (missingFields.length === 0) {
    return {
      badge: 'Можно сохранять',
      tone: 'success' as const,
    };
  }

  return {
    badge: `Нужно заполнить: ${missingFields.length}`,
    tone: 'warning' as const,
  };
});
const categoryLine = computed(() =>
  props.categoryName
    ? `Категория: ${props.categoryName}. Изменения попадут в общий черновик вкладки menu.`
    : 'Категория недоступна. Проверьте выбранный маршрут и состояние общего черновика.',
);
const priceSectionTitle = computed(() =>
  form.itemType === 'drink' ? 'Матрица размеров и цен' : 'Базовая цена товара',
);
const priceSectionText = computed(() =>
  form.itemType === 'drink'
    ? 'Для напитка обязательны все три размера. Серверная часть проверит итоговую модель цен при общем сохранении каталога.'
    : 'Укажите одну цену для позиции без выбора размера.',
);
const priceSummary = computed(() => {
  if (form.itemType === 'product') {
    return form.basePrice.trim() ? `${form.basePrice.trim()} ₽` : 'Цена ещё не задана';
  }

  return drinkSizes
    .map((size) => `${size} ${form.sizePrices[size].trim() || '—'}`)
    .join(' · ');
});
const priceSummaryHint = computed(() =>
  form.itemType === 'drink'
    ? 'Размеры S, M и L попадут в `sizePrices` после локального сохранения формы.'
    : 'Значение попадёт в `basePrice` после локального сохранения формы.',
);
const submitLabel = computed(() =>
  props.mode === 'create' ? 'Добавить в черновик' : 'Обновить черновик',
);
const dockText = computed(() =>
  props.mode === 'create'
    ? 'Новая позиция сначала попадёт в общий черновик вкладки menu, а публикация на сервер произойдёт позже через общую панель сохранения.'
    : 'Изменение обновит только общий черновик вкладки menu. Публикация на сервер остаётся в верхней панели сохранения.',
);

function submit() {
  if (props.submitPending) {
    return;
  }

  if (!validate()) {
    return;
  }

  emit('submit', createMenuProductDraft(form));
}

function selectItemType(nextItemType: MenuCatalogItemType) {
  if (form.itemType === nextItemType) {
    return;
  }

  setItemType(nextItemType);
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

  &__summary,
  &__section {
    display: grid;
    gap: 1rem;
  }

  &__summary-head {
    display: grid;
    gap: 0.85rem;
  }

  &__summary-grid {
    display: grid;
    gap: 0.85rem;
  }

  &__summary-item {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-md);
    background: rgba(255, 255, 255, 0.72);
  }

  &__summary-label,
  &__type-label {
    color: var(--expressa-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__summary-value,
  &__type-title {
    color: var(--expressa-text);
    font-size: 1rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__summary-text,
  &__type-text,
  &__hint,
  &__size-text {
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  &__type-grid,
  &__sizes {
    display: grid;
    gap: 0.75rem;
  }

  &__type-card {
    display: grid;
    gap: 0.4rem;
    min-width: 0;
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-lg);
    background: rgba(255, 255, 255, 0.86);
    text-align: left;
    transition:
      border-color var(--expressa-menu-transition-default),
      box-shadow var(--expressa-menu-transition-default),
      transform var(--expressa-menu-transition-fast);
  }

  &__type-card:hover {
    border-color: var(--expressa-menu-border-accent);
    transform: translateY(-1px);
  }

  &__type-card--selected {
    border-color: var(--accent);
    box-shadow: var(--expressa-menu-shadow-focus);
  }

  &__single-price {
    display: grid;
    gap: 0.75rem;
  }

  &__size-card {
    display: grid;
    gap: 0.85rem;
    min-width: 0;
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-lg);
    background: rgba(255, 255, 255, 0.78);
  }

  &__size-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
  }

  &__issues {
    padding: 1rem;
    border: 1px solid var(--expressa-menu-border-warning);
    border-radius: var(--expressa-menu-radius-md);
    background: rgba(255, 243, 224, 0.88);
  }

  &__issues-title {
    margin: 0;
    color: #e65100;
    font-weight: 800;
  }

  &__issues-list {
    margin: 0.6rem 0 0;
    padding-left: 1rem;
    color: #7c4d12;
  }

  &__issues-item + &__issues-item {
    margin-top: 0.35rem;
  }

  &__submit-error {
    margin: 0;
    color: #b71c1c;
    font-weight: 700;
    line-height: 1.6;
  }

  &__dock-copy {
    display: grid;
    gap: 0.6rem;
  }

  &__dock-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
}

@media (min-width: 760px) {
  .product-editor__summary-head {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .product-editor__summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-editor__type-grid,
  .product-editor__sizes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .product-editor__sizes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
