<template>
  <v-btn-toggle
    class="users-filter-tabs"
    :model-value="activeFilter"
    mandatory
    role="tablist"
    aria-label="Фильтр пользователей"
    @update:model-value="emitFilterChange"
  >
    <v-btn
      v-for="tab in tabs"
      :key="tab.id"
      class="users-filter-tabs__button"
      :value="tab.id"
      variant="outlined"
      rounded="pill"
      density="comfortable"
      role="tab"
      :aria-selected="tab.id === activeFilter"
    >
      {{ tab.label }}
    </v-btn>
  </v-btn-toggle>
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

function emitFilterChange(value: unknown): void {
  if (isUsersFilter(value)) {
    emit("change", value);
  }
}

function isUsersFilter(value: unknown): value is UsersFilter {
  return value === "all" || value === "barista" || value === "blocked";
}
</script>

<style scoped lang="scss">
.users-filter-tabs {
  display: flex;
  gap: 6px;
  padding: 0 var(--app-spacing-md) var(--app-spacing-sm);
  overflow-x: auto;
  background: transparent;
}

@media (min-width: 960px) {
  .users-filter-tabs {
    padding: 0;
  }
}

.users-filter-tabs__button {
  min-height: 34px;
  border-color: var(--app-color-border);
  background: var(--app-color-background-surface) !important;
  color: var(--app-color-text-secondary) !important;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.users-filter-tabs__button.v-btn--active {
  border-color: var(--app-color-accent) !important;
  background: var(--app-color-accent-light) !important;
  color: var(--app-color-accent) !important;
}

.users-filter-tabs__button :deep(.v-btn__content) {
  white-space: nowrap;
}
</style>
