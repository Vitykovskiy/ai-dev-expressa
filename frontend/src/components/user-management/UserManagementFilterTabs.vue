<template>
  <div
    class="user-filter-tabs"
    role="tablist"
    aria-label="Фильтр пользователей"
  >
    <button
      v-for="tab in USER_FILTER_TABS"
      :key="tab.id"
      class="user-filter-tabs__tab"
      :class="{ 'user-filter-tabs__tab--active': activeFilter === tab.id }"
      :disabled="disabled"
      :aria-selected="activeFilter === tab.id"
      type="button"
      @click="$emit('select', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { USER_FILTER_TABS } from "@/modules/user-management/presentation";
import type { UserListFilter } from "@/modules/user-management/types";

defineProps<{
  activeFilter: UserListFilter;
  disabled?: boolean;
}>();

defineEmits<{
  select: [value: UserListFilter];
}>();
</script>

<style scoped lang="scss">
.user-filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 16px;
}

@media (min-width: 960px) {
  .user-filter-tabs {
    padding: 0;
  }
}

.user-filter-tabs__tab {
  flex: 0 0 auto;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 16px;
  transition:
    background var(--app-motion-fast) var(--app-motion-easing),
    color var(--app-motion-fast) var(--app-motion-easing),
    border-color var(--app-motion-fast) var(--app-motion-easing);
}

.user-filter-tabs__tab--active {
  border-color: var(--app-color-accent-light);
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
}

.user-filter-tabs__tab:disabled {
  opacity: 0.6;
}
</style>
