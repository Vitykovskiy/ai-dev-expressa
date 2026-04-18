<template>
  <section
    class="menu-section-header"
    :class="[`menu-section-header--${size}`, { 'menu-section-header--split': hasActions }]"
  >
    <div class="menu-section-header__content">
      <p v-if="label" class="menu-section-header__label">{{ label }}</p>
      <h3 class="menu-section-header__title" :data-testid="titleTestId || undefined">{{ title }}</h3>
      <p v-if="text" class="menu-section-header__text">{{ text }}</p>
    </div>

    <div v-if="hasActions" class="menu-section-header__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    size?: 'default' | 'hero';
    text?: string;
    title: string;
    titleTestId?: string;
  }>(),
  {
    label: '',
    size: 'default',
    text: '',
    titleTestId: undefined,
  },
);

const slots = useSlots();
const hasActions = computed(() => !!slots.actions);
</script>

<style scoped lang="scss">
.menu-section-header {
  display: grid;
  gap: 1rem;

  &--split {
    align-items: end;
  }

  &__content {
    min-width: 0;
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
    margin: 0.45rem 0 0;
    color: var(--expressa-text);
    font-size: var(--expressa-menu-title-size);
    font-weight: 800;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  &__text {
    margin: 0.7rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  &--hero &__title {
    font-size: var(--expressa-menu-hero-title-size);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: flex-start;
  }
}

@media (min-width: 900px) {
  .menu-section-header--split {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .menu-section-header__actions {
    justify-content: flex-end;
  }
}
</style>
