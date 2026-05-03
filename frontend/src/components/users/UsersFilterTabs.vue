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
      @click="emit('change', tab.id)"
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

const emit = defineEmits<{
  change: [filter: UsersFilter];
}>();
</script>

<style scoped lang="scss">
.users-filter-tabs {
  display: flex;
  gap: 8px;
  padding: 12px var(--app-spacing-md);
  overflow-x: auto;
  background: var(--app-color-background-primary);
  border-bottom: 1px solid var(--app-color-border);
}

@media (min-width: 960px) {
  .users-filter-tabs {
    padding: 0;
    border-bottom: 0;
  }
}

.users-filter-tabs__button {
  min-height: 34px;
  padding: 8px 16px;
  border: 0;
  border-radius: var(--app-radius-pill);
  background: var(--app-color-background-secondary) !important;
  color: var(--app-color-text-secondary) !important;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.users-filter-tabs__button--active {
  background: var(--app-color-accent) !important;
  color: var(--app-color-text-on-accent) !important;
}
</style>
