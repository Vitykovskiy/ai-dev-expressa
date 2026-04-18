<template>
  <v-btn
    v-bind="$attrs"
    class="menu-action-button"
    :class="[
      `menu-action-button--${variant}`,
      `menu-action-button--${size}`,
      { 'menu-action-button--block': block },
    ]"
    :rounded="rounded"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    block?: boolean;
    rounded?: 'lg' | 'pill';
    size?: 'default' | 'compact';
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  }>(),
  {
    block: false,
    rounded: 'lg',
    size: 'default',
    variant: 'primary',
  },
);
</script>

<style scoped lang="scss">
.menu-action-button {
  max-width: 100%;
  border: 1px solid transparent;
  border-radius: var(--expressa-menu-radius-md);
  box-shadow: none;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: none;
  transition:
    background-color var(--expressa-menu-transition-fast),
    border-color var(--expressa-menu-transition-fast),
    color var(--expressa-menu-transition-fast),
    transform var(--expressa-menu-transition-fast);

  &:deep(.v-btn__content) {
    gap: 0.45rem;
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: center;
  }

  &:deep(.v-btn__overlay) {
    opacity: 0;
  }

  &:deep(.v-btn__underlay) {
    display: none;
  }

  &:focus-visible {
    box-shadow: var(--expressa-menu-shadow-focus);
    outline: none;
  }

  &--default {
    min-height: 2.75rem;
    min-width: 7rem;
    padding-inline: 1rem;
  }

  &--compact {
    min-height: 2.2rem;
    min-width: 5.25rem;
    padding-inline: 0.85rem;
    font-size: 0.88rem;
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background: var(--accent);
    color: var(--text-on-accent);
  }

  &--primary:hover {
    background: #1010eb;
    transform: translateY(-1px);
  }

  &--secondary {
    border-color: var(--expressa-border);
    background: var(--expressa-menu-surface-subtle);
    color: var(--expressa-text);
  }

  &--secondary:hover {
    border-color: var(--expressa-menu-border-accent);
    background: var(--accent-light);
    color: var(--accent);
  }

  &--ghost {
    background: transparent;
    color: var(--expressa-secondary);
  }

  &--ghost:hover {
    background: rgba(17, 17, 17, 0.05);
    color: var(--expressa-text);
  }

  &--danger {
    background: #ffebee;
    color: #d32f2f;
  }

  &--danger:hover {
    background: #ffd7dc;
  }

  &.v-btn--disabled {
    opacity: 0.45;
  }
}
</style>
