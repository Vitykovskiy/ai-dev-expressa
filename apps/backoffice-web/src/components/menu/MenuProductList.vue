<template>
  <div class="menu-product-list">
    <div v-if="products.length > 0" class="menu-product-list__grid">
      <article
        v-for="product in products"
        :key="product.menuItemId"
        class="menu-product-card"
        data-testid="menu-product-card"
      >
        <div class="menu-product-card__badges">
          <StatusBadge
            :label="product.itemType === 'drink' ? 'Напиток' : 'Товар'"
            variant="accent"
          />
          <StatusBadge :label="priceSummary(product)" variant="neutral" />
        </div>

        <div class="menu-product-card__content">
          <h4 class="menu-product-card__title">{{ product.name }}</h4>
          <p class="menu-product-card__text">
            Категория наследует {{ optionGroups.length }} групп дополнительных опций, поэтому
            карточка товара опирается на них без локальных переопределений.
          </p>
        </div>

        <div class="menu-product-card__actions">
          <Button @click="$emit('openProduct', product.menuItemId)">Открыть карточку</Button>
        </div>
      </article>
    </div>

    <EmptyState
      v-else
      subtitle="Навигация к категории уже работает, а детальное наполнение и редакторы будут дополняться в следующем шаге."
      title="Снимок каталога не содержит позиций для этой категории"
    />

    <SectionList
      v-if="optionGroups.length > 0"
      subtitle="Категория передаёт эти группы товаровым карточкам через общий черновик."
      title="Наследуемые группы дополнительных опций"
    >
      <div class="menu-product-list__groups">
        <Button
          v-for="optionGroup in optionGroups"
          :key="optionGroup.optionGroupId"
          variant="ghost"
          @click="$emit('openAddonGroup', optionGroup.optionGroupId)"
        >
          {{ optionGroup.name }}
        </Button>
      </div>
    </SectionList>
  </div>
</template>

<script setup lang="ts">
import type { MenuCatalogItem, MenuCatalogOptionGroup } from '@expressa/shared-types';
import { Button, EmptyState, SectionList, StatusBadge } from '../base';

defineProps<{
  optionGroups: Pick<MenuCatalogOptionGroup, 'name' | 'optionGroupId'>[];
  priceSummary: (product: MenuCatalogItem) => string;
  products: MenuCatalogItem[];
}>();

defineEmits<{
  openAddonGroup: [optionGroupId: string];
  openProduct: [productId: string];
}>();
</script>

<style scoped lang="scss">
.menu-product-list {
  display: grid;
  gap: 1rem;
}

.menu-product-list__grid {
  display: grid;
  gap: 1rem;
}

.menu-product-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--expressa-border);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.94);
}

.menu-product-card__badges,
.menu-product-card__actions,
.menu-product-list__groups {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.menu-product-card__content {
  display: grid;
  gap: 0.75rem;
}

.menu-product-card__title {
  margin: 0;
  color: var(--expressa-text);
  font-size: clamp(1.1rem, 1.35vw, 1.5rem);
  font-weight: 800;
}

.menu-product-card__text {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.7;
}

@media (min-width: 960px) {
  .menu-product-list__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
