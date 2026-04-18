<template>
  <div
    class="filter-tabs"
    :class="{ 'filter-tabs--sticky': sticky }"
    :data-testid="testId"
    role="tablist"
  >
    <button
      v-for="item in items"
      :key="String(item.id)"
      class="filter-tabs__item"
      :class="{ 'filter-tabs__item--active': item.id === modelValue }"
      :disabled="item.disabled"
      :aria-selected="item.id === modelValue"
      role="tab"
      type="button"
      @click="selectItem(item)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
type FilterTabItem = {
  disabled?: boolean;
  id: string | number;
  label: string;
};

const props = withDefaults(
  defineProps<{
    items: FilterTabItem[];
    modelValue: string | number;
    sticky?: boolean;
    testId?: string;
  }>(),
  {
    sticky: false,
    testId: 'filter-tabs',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

function selectItem(item: FilterTabItem) {
  if (item.disabled) {
    return;
  }

  emit('update:modelValue', item.id);
}
</script>

<style scoped lang="scss">
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0 0.5rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &--sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 0.75rem 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.9));
    backdrop-filter: blur(12px);
  }

  &__item {
    flex: 0 0 auto;
    border: 0;
    border-radius: 999px;
    background: var(--expressa-color-neutral-light, #f5f5f7);
    color: var(--expressa-secondary, #555555);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.2;
    padding: 0.625rem 1rem;
    white-space: nowrap;
    transition:
      background-color 0.18s ease,
      color 0.18s ease,
      transform 0.18s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    &--active {
      background: var(--expressa-text, #111111);
      color: var(--expressa-color-text-on-accent, #ffffff);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
  }
}
</style>
