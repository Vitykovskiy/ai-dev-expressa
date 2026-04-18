<template>
  <MenuSurfaceCard
    v-bind="$attrs"
    class="menu-empty-state"
    padding="lg"
  >
    <div v-if="$slots.icon" class="menu-empty-state__icon">
      <slot name="icon" />
    </div>
    <p class="menu-empty-state__label">{{ label }}</p>
    <h4 class="menu-empty-state__title">{{ title }}</h4>
    <p class="menu-empty-state__text">{{ text }}</p>
    <div v-if="$slots.actions" class="menu-empty-state__actions">
      <slot name="actions" />
    </div>
  </MenuSurfaceCard>
</template>

<script setup lang="ts">
import MenuSurfaceCard from './MenuSurfaceCard.vue';

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  label: string;
  text: string;
  title: string;
}>();
</script>

<style scoped lang="scss">
.menu-empty-state {
  display: grid;
  gap: 0.85rem;
  justify-items: start;
  text-align: left;

  &__icon {
    color: var(--expressa-muted);
  }

  &__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    color: var(--expressa-text);
    font-size: var(--expressa-menu-title-size);
    font-weight: 800;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  &__text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>
