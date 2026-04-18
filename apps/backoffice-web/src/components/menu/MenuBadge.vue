<template>
  <v-chip
    v-bind="$attrs"
    class="menu-badge"
    :class="[
      `menu-badge--${tone}`,
      `menu-badge--${emphasis}`,
      `menu-badge--${size}`,
    ]"
    rounded="pill"
  >
    <slot>{{ label }}</slot>
  </v-chip>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    emphasis?: 'soft' | 'solid';
    label?: string;
    size?: 'default' | 'compact';
    tone?: 'menu' | 'neutral' | 'success' | 'warning' | 'danger';
  }>(),
  {
    emphasis: 'soft',
    label: '',
    size: 'default',
    tone: 'menu',
  },
);
</script>

<style scoped lang="scss">
.menu-badge {
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 0.01em;

  &:deep(.v-chip__content) {
    white-space: nowrap;
  }

  &--default {
    min-height: 2rem;
    padding-inline: 0.7rem;
  }

  &--compact {
    min-height: 1.6rem;
    padding-inline: 0.6rem;
    font-size: 0.75rem;
  }

  &--menu.menu-badge--soft {
    border-color: var(--expressa-menu-border-accent);
    background: var(--accent-light);
    color: var(--accent);
  }

  &--menu.menu-badge--solid {
    background: var(--accent);
    color: var(--text-on-accent);
  }

  &--neutral.menu-badge--soft {
    border-color: var(--expressa-border);
    background: var(--expressa-menu-surface-subtle);
    color: var(--expressa-secondary);
  }

  &--neutral.menu-badge--solid {
    background: var(--expressa-secondary);
    color: var(--text-on-accent);
  }

  &--success.menu-badge--soft {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &--success.menu-badge--solid {
    background: #2e7d32;
    color: var(--text-on-accent);
  }

  &--warning.menu-badge--soft {
    background: #fff3e0;
    color: #e65100;
  }

  &--warning.menu-badge--solid {
    background: #e65100;
    color: var(--text-on-accent);
  }

  &--danger.menu-badge--soft {
    background: #ffebee;
    color: #d32f2f;
  }

  &--danger.menu-badge--solid {
    background: #d32f2f;
    color: var(--text-on-accent);
  }
}
</style>
