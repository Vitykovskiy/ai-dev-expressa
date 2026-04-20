<template>
  <nav class="app-tab-bar" aria-label="Мобильная навигация">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.id"
      :to="tab.path"
      class="app-tab-bar__link"
      :class="{ 'app-tab-bar__link--active': activePath === tab.path }"
    >
      <span
        v-if="activePath === tab.path"
        class="app-tab-bar__indicator"
        aria-hidden="true"
      />
      <component :is="tab.icon" :size="22" />
      <span class="app-tab-bar__label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { BackofficeTab } from "@/modules/navigation/tabs";

defineProps<{
  tabs: readonly BackofficeTab[];
  activePath: string;
}>();
</script>

<style scoped lang="scss">
.app-tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: var(--app-tab-bar-height);
  padding-bottom: max(env(safe-area-inset-bottom), 0px);
  background: var(--app-color-background-primary);
  border-top: 1px solid var(--app-color-border);
  box-shadow: var(--app-shadow-tab-bar);
}

@media (min-width: 960px) {
  .app-tab-bar {
    display: none;
  }
}

.app-tab-bar__link {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--app-color-text-muted);
}

.app-tab-bar__link--active {
  color: var(--app-color-accent);
}

.app-tab-bar__indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--app-color-accent);
}

.app-tab-bar__label {
  font-size: 12px;
  line-height: 16px;
}
</style>
