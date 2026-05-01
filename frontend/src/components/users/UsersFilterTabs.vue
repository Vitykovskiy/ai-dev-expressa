<template>
  <div
    class="users-filter-tabs"
    role="tablist"
    aria-label="Фильтр пользователей"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="users-filter-tabs__button"
      :class="{ 'users-filter-tabs__button--active': tab.id === activeFilter }"
      type="button"
      role="tab"
      :aria-selected="tab.id === activeFilter"
      @click="$emit('change', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { UsersFilter } from "@/modules/users/types";

defineProps<{
  tabs: readonly {
    readonly id: UsersFilter;
    readonly label: string;
  }[];
  activeFilter: UsersFilter;
}>();

defineEmits<{
  change: [filter: UsersFilter];
}>();
</script>

<style scoped lang="scss">
.users-filter-tabs {
  display: flex;
  gap: 6px;
  padding: 0 var(--app-spacing-md) var(--app-spacing-sm);
  overflow-x: auto;
}

@media (min-width: 960px) {
  .users-filter-tabs {
    padding: 0;
  }
}

.users-filter-tabs__button {
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-pill);
  background: var(--app-color-background-surface);
  color: var(--app-color-text-secondary);
  cursor: pointer;
  font-size: 13px;
  line-height: 18px;
  white-space: nowrap;
  transition:
    background-color var(--app-motion-fast) var(--app-motion-easing),
    border-color var(--app-motion-fast) var(--app-motion-easing),
    color var(--app-motion-fast) var(--app-motion-easing);
}

.users-filter-tabs__button--active {
  border-color: var(--app-color-accent);
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
}
</style>
