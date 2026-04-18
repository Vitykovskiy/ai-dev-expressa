<template>
  <div class="menu-category-products">
    <MenuSurfaceCard class="menu-category-products__summary" variant="subtle">
      <div class="menu-category-products__summary-grid">
        <div class="menu-category-products__summary-copy">
          <p class="menu-category-products__summary-label">Выбранная категория</p>
          <h4 class="menu-category-products__summary-title">
            {{ categoryName ?? 'Категория не найдена' }}
          </h4>
          <p class="menu-category-products__summary-text">{{ summaryText }}</p>
        </div>

        <div class="menu-category-products__summary-badges">
          <MenuBadge>
            {{ products.length }}
            {{ pluralize(products.length, 'товар', 'товара', 'товаров') }}
          </MenuBadge>
          <MenuBadge tone="neutral">
            {{ optionGroups.length }}
            {{
              pluralize(
                optionGroups.length,
                'группа допов',
                'группы допов',
                'групп допов',
              )
            }}
          </MenuBadge>
        </div>
      </div>
    </MenuSurfaceCard>

    <MenuSurfaceCard
      v-if="products.length > 0"
      class="menu-category-products__list"
      data-testid="menu-products-list"
      padding="none"
      variant="subtle"
    >
      <div
        v-for="(product, index) in products"
        :key="product.productId"
        class="menu-category-products__list-item"
        :class="{
          'menu-category-products__list-item--bordered': index < products.length - 1,
        }"
      >
        <MenuListRow
          :data-testid="`product-row-${product.productId}`"
          interactive
          tag="button"
          type="button"
          @click="$emit('openProduct', product.productId)"
        >
          <span class="menu-category-products__product-name">{{ product.name }}</span>

          <template #leading>
            <span class="menu-category-products__product-type">
              {{ product.itemTypeShortLabel }}
            </span>
          </template>

          <template #meta>
            {{ product.itemTypeLabel }} · {{ product.priceSummary }}
          </template>

          <template #trailing>
            <span class="menu-category-products__product-link">Открыть</span>
          </template>
        </MenuListRow>
      </div>
    </MenuSurfaceCard>

    <MenuEmptyState
      v-else
      data-testid="menu-products-empty"
      label="Категория пока без товаров"
      text="Добавьте первую позицию в общий черновик, чтобы затем перейти в карточку товара без смены маршрутов вкладки `menu`."
      title="Список товаров для выбранной категории ещё пуст"
    >
      <template #actions>
        <MenuActionButton data-testid="create-product-empty" @click="$emit('createProduct')">
          Добавить товар
        </MenuActionButton>
      </template>
    </MenuEmptyState>

    <MenuSurfaceCard class="menu-category-products__addons" variant="subtle">
      <div class="menu-category-products__addons-header">
        <div class="menu-category-products__addons-copy">
          <p class="menu-category-products__addons-label">
            Наследуемые группы дополнительных опций
          </p>
          <p class="menu-category-products__addons-text">
            {{ optionGroupsText }}
          </p>
        </div>

        <MenuActionButton
          data-testid="create-addon-group"
          variant="secondary"
          @click="$emit('createAddonGroup')"
        >
          Создать группу допов
        </MenuActionButton>
      </div>

      <div
        v-if="optionGroups.length > 0"
        class="menu-category-products__addon-groups"
        data-testid="menu-product-option-groups"
      >
        <MenuActionButton
          v-for="optionGroup in optionGroups"
          :key="optionGroup.optionGroupId"
          :data-testid="`open-addon-group-${optionGroup.optionGroupId}`"
          size="compact"
          variant="ghost"
          @click="$emit('openAddonGroup', optionGroup.optionGroupId)"
        >
          {{ optionGroup.name }}
        </MenuActionButton>
      </div>

      <div v-else class="menu-category-products__addon-empty">
        Группы дополнительных опций ещё не назначены. Их можно подготовить до наполнения списка
        товаров или после создания первой позиции.
      </div>
    </MenuSurfaceCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuEmptyState from './menu/MenuEmptyState.vue';
import MenuListRow from './menu/MenuListRow.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';

interface MenuCategoryProductListItem {
  itemTypeLabel: string;
  itemTypeShortLabel: string;
  name: string;
  priceSummary: string;
  productId: string;
}

interface MenuCategoryOptionGroupListItem {
  name: string;
  optionGroupId: string;
}

const props = defineProps<{
  categoryName: string | null;
  optionGroups: MenuCategoryOptionGroupListItem[];
  products: MenuCategoryProductListItem[];
}>();

defineEmits<{
  createAddonGroup: [];
  createProduct: [];
  openAddonGroup: [optionGroupId: string];
  openProduct: [productId: string];
}>();

const optionGroupsText = computed(() => {
  if (props.optionGroups.length === 0) {
    return 'Товары этой категории пока не наследуют дополнительные опции. Подготовьте группу заранее, чтобы следующий товар сразу получил нужные настройки.';
  }

  return `Все товары категории получают ${props.optionGroups.length} ${pluralize(
    props.optionGroups.length,
    'группу дополнительных опций',
    'группы дополнительных опций',
    'групп дополнительных опций',
  )} без локального переопределения в строках списка.`;
});

const summaryText = computed(() => {
  if (props.products.length === 0 && props.optionGroups.length === 0) {
    return 'Категория готова к наполнению. Добавьте первый товар или сначала подготовьте группы дополнительных опций для будущих позиций.';
  }

  if (props.products.length === 0) {
    return `Категория пока без товаров, но уже наследует ${props.optionGroups.length} ${pluralize(
      props.optionGroups.length,
      'группу дополнительных опций',
      'группы дополнительных опций',
      'групп дополнительных опций',
    )}.`;
  }

  if (props.optionGroups.length === 0) {
    return 'Откройте строку товара, чтобы перейти в карточку и продолжить редактирование общего черновика категории.';
  }

  return `Откройте строку товара, чтобы перейти в карточку. Все позиции категории наследуют ${props.optionGroups.length} ${pluralize(
    props.optionGroups.length,
    'группу дополнительных опций',
    'группы дополнительных опций',
    'групп дополнительных опций',
  )}.`;
});

function pluralize(count: number, one: string, few: string, many: string) {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return one;
  }

  if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
    return few;
  }

  return many;
}
</script>

<style scoped lang="scss">
.menu-category-products {
  display: grid;
  gap: 1rem;

  &__summary,
  &__addons {
    display: grid;
    gap: 1rem;
  }

  &__summary-grid,
  &__addons-header {
    display: grid;
    gap: 1rem;
  }

  &__summary-copy,
  &__addons-copy {
    min-width: 0;
  }

  &__summary-label,
  &__addons-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__summary-title {
    margin: 0.4rem 0 0;
    color: var(--expressa-text);
    font-size: var(--expressa-menu-title-size);
    font-weight: 800;
    line-height: 1.15;
  }

  &__summary-text,
  &__addons-text {
    margin: 0.55rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  &__summary-badges,
  &__addon-groups {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  &__list {
    overflow: hidden;
  }

  &__list-item {
    padding: 1rem;
  }

  &__list-item--bordered {
    border-bottom: 1px solid var(--expressa-border);
  }

  &__product-name {
    color: var(--expressa-text);
    font-weight: 700;
    line-height: 1.4;
  }

  &__product-type {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.35rem;
    min-height: 2rem;
    padding: 0.25rem 0.65rem;
    border-radius: var(--expressa-menu-radius-pill);
    background: rgba(232, 232, 255, 0.72);
    color: var(--accent);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0;
  }

  &__product-link {
    color: var(--accent);
    font-size: 0.82rem;
    font-weight: 700;
    white-space: nowrap;
  }

  &__addon-empty {
    padding: 0.9rem 1rem;
    border: 1px dashed var(--expressa-border);
    border-radius: var(--expressa-menu-radius-md);
    background: rgba(255, 255, 255, 0.72);
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 759px) {
  .menu-category-products__addons-header > .menu-action-button {
    width: 100%;
  }
}

@media (min-width: 900px) {
  .menu-category-products__summary-grid,
  .menu-category-products__addons-header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .menu-category-products__summary-badges,
  .menu-category-products__addons-header > .menu-action-button {
    justify-content: flex-end;
  }
}
</style>
