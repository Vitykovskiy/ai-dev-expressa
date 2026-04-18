<template>
  <section class="menu-catalog-hero" data-testid="menu-catalog-shell">
    <div class="menu-catalog-hero__content">
      <p class="menu-catalog-hero__label">FEATURE-002 · Структурный снимок каталога</p>
      <h3 class="menu-catalog-hero__title">
        Категории, товары и группы дополнительных опций
      </h3>
      <p class="menu-catalog-hero__text">
        Вкладка `menu` читает и хранит единый снимок каталога из `apps/server`, а экранные
        подпотоки используют только согласованные DTO без локальных источников данных.
      </p>
    </div>

    <div class="menu-catalog-hero__actions">
      <StatusBadge :label="`Категорий ${counts.categories}`" variant="accent" />
      <StatusBadge :label="`Товаров ${counts.items}`" variant="neutral" />
      <StatusBadge :label="`Групп допов ${counts.optionGroups}`" variant="warning" />
      <Button
        :disabled="disabled"
        :loading="loading"
        data-testid="reload-menu-catalog"
        @click="$emit('reload')"
      >
        Обновить снимок
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button, StatusBadge } from '../base';

defineProps<{
  counts: {
    categories: number;
    items: number;
    optionGroups: number;
  };
  disabled?: boolean;
  loading?: boolean;
}>();

defineEmits<{
  reload: [];
}>();
</script>

<style scoped lang="scss">
.menu-catalog-hero {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--expressa-border);
  border-radius: 1.25rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(229, 243, 255, 0.88)),
    rgba(255, 255, 255, 0.94);
}

.menu-catalog-hero__content {
  display: grid;
  gap: 0.75rem;
}

.menu-catalog-hero__label {
  margin: 0;
  color: var(--expressa-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.menu-catalog-hero__title {
  margin: 0;
  color: var(--expressa-text);
  font-size: clamp(1.35rem, 1.6vw, 1.9rem);
  font-weight: 800;
  line-height: 1.15;
}

.menu-catalog-hero__text {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.7;
}

.menu-catalog-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

@media (min-width: 900px) {
  .menu-catalog-hero {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: 1.75rem;
  }
}
</style>
