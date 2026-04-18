<template>
  <component
    :is="tag"
    v-bind="$attrs"
    class="menu-list-row"
    :class="[
      `menu-list-row--${tone}`,
      {
        'menu-list-row--interactive': interactive,
        'menu-list-row--selected': selected,
      },
    ]"
  >
    <div v-if="$slots.leading" class="menu-list-row__leading">
      <slot name="leading" />
    </div>

    <div class="menu-list-row__body">
      <div class="menu-list-row__primary">
        <slot />
      </div>
      <div v-if="$slots.meta" class="menu-list-row__meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="$slots.trailing" class="menu-list-row__trailing">
      <slot name="trailing" />
    </div>
  </component>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    interactive?: boolean;
    selected?: boolean;
    tag?: string;
    tone?: 'default' | 'accent';
  }>(),
  {
    interactive: false,
    selected: false,
    tag: 'div',
    tone: 'default',
  },
);
</script>

<style scoped lang="scss">
.menu-list-row {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--expressa-border);
  border-radius: var(--expressa-menu-radius-md);
  background: var(--expressa-menu-surface);
  color: var(--expressa-text);
  text-align: left;
  overflow-wrap: anywhere;
  transition:
    background-color var(--expressa-menu-transition-fast),
    border-color var(--expressa-menu-transition-fast),
    transform var(--expressa-menu-transition-fast);

  &--accent {
    background: rgba(232, 232, 255, 0.45);
  }

  &--interactive {
    cursor: pointer;
  }

  &--interactive:hover {
    border-color: var(--expressa-menu-border-accent);
    background: rgba(232, 232, 255, 0.66);
    transform: translateY(-1px);
  }

  &--selected {
    border-color: var(--expressa-menu-border-accent);
    background: rgba(232, 232, 255, 0.72);
  }

  &__leading,
  &__trailing {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    max-width: 100%;
  }

  &__body {
    display: grid;
    gap: 0.3rem;
    min-width: 0;
    flex: 1;
  }

  &__primary,
  &__meta {
    min-width: 0;
  }

  &__meta {
    overflow-wrap: anywhere;
    color: var(--expressa-muted);
    font-size: 0.88rem;
    line-height: 1.5;
  }
}

@media (max-width: 599px) {
  .menu-list-row {
    flex-wrap: wrap;
    align-items: flex-start;

    &__body {
      flex-basis: calc(100% - 3rem);
    }

    &__trailing {
      width: 100%;
      padding-left: 2.85rem;
    }
  }
}
</style>
