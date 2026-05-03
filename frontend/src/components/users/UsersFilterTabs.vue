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
  padding: 0 16px !important;
  border-color: transparent !important;
  background: var(--app-color-background-secondary) !important;
  color: var(--app-color-text-secondary) !important;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.users-filter-tabs__button.v-btn--active {
  border-color: transparent !important;
  background: var(--app-color-accent) !important;
  color: var(--app-color-text-on-accent) !important;
}

.users-filter-tabs__button :deep(.v-btn__content) {
  white-space: nowrap;
}
</style>
