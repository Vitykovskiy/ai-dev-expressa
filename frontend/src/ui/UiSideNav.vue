<template>
  <nav class="app-side-nav" aria-label="Основная навигация">
    <div class="app-side-nav__brand">
      <h1 class="app-side-nav__title">Expressa</h1>
      <p class="app-side-nav__role">{{ roleLabel }}</p>
    </div>

    <div class="app-side-nav__tabs">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.id"
        :to="tab.path"
        class="app-side-nav__link"
        :class="{ 'app-side-nav__link--active': activePath === tab.path }"
      >
        <component :is="tab.icon" :size="20" />
        <span>{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { BackofficeTab } from "../../modules/navigation/tabs";

defineProps<{
  tabs: readonly BackofficeTab[];
  roleLabel: string;
  activePath: string;
}>();
</script>

<style scoped lang="scss">
.app-side-nav {
  display: none;
}

@media (min-width: 960px) {
  .app-side-nav {
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--app-side-nav-width);
    display: flex;
    flex-direction: column;
    padding: var(--app-spacing-md);
    background: var(--app-color-background-secondary);
    border-right: 1px solid var(--app-color-border);
  }
}

.app-side-nav__brand {
  margin-bottom: 32px;
}

.app-side-nav__title {
  margin: 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: var(--app-color-text-primary);
}

.app-side-nav__role {
  margin: 4px 0 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 16px;
}

.app-side-nav__tabs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-side-nav__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--app-radius-md);
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  transition: background-color var(--app-motion-default) var(--app-motion-easing);
}

.app-side-nav__link:hover {
  background: var(--app-color-border);
}

.app-side-nav__link--active {
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
}
</style>
