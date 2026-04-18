<template>
  <v-card
    v-bind="$attrs"
    class="menu-surface-card"
    :class="[
      `menu-surface-card--${variant}`,
      `menu-surface-card--${padding}`,
      { 'menu-surface-card--full-height': fullHeight },
    ]"
    rounded="xl"
  >
    <slot />
  </v-card>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    fullHeight?: boolean;
    padding?: 'none' | 'md' | 'lg';
    variant?: 'default' | 'hero' | 'subtle' | 'warning' | 'danger';
  }>(),
  {
    fullHeight: false,
    padding: 'md',
    variant: 'default',
  },
);
</script>

<style scoped lang="scss">
.menu-surface-card {
  border: 1px solid var(--expressa-border);
  background: var(--expressa-menu-surface);
  box-shadow: var(--expressa-menu-shadow-soft);

  &--full-height {
    height: 100%;
  }

  &--none {
    padding: 0;
  }

  &--md {
    padding: 1rem;
  }

  &--lg {
    padding: 1.5rem;
  }

  &--hero {
    border-color: var(--expressa-menu-border-accent);
    background: var(--expressa-menu-surface-hero);
    box-shadow: var(--expressa-menu-shadow-card);
  }

  &--subtle {
    background: linear-gradient(
      180deg,
      rgba(245, 245, 247, 0.92),
      rgba(255, 255, 255, 0.98)
    );
  }

  &--warning {
    border-color: var(--expressa-menu-border-warning);
    background: var(--expressa-menu-surface-warning);
  }

  &--danger {
    border-color: var(--expressa-menu-border-danger);
    background: var(--expressa-menu-surface-danger);
  }
}
</style>
