<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { getVisibleTabs } from "../modules/navigation/tabs";
import type { BackofficeCapability } from "../modules/auth/types";

const props = defineProps<{
  capabilities: readonly BackofficeCapability[];
  roleLabel: string;
}>();

const route = useRoute();
const tabs = computed(() => getVisibleTabs(props.capabilities));
</script>

<template>
  <nav class="side-nav" aria-label="Основная навигация">
    <div class="side-nav__brand">
      <h1 class="side-nav__title">Expressa</h1>
      <p class="side-nav__role">{{ roleLabel }}</p>
    </div>

    <div class="side-nav__tabs">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.id"
        :to="tab.path"
        class="side-nav__link"
        :class="{ 'side-nav__link--active': route.path === tab.path }"
      >
        <component :is="tab.icon" :size="20" />
        <span>{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.side-nav {
  display: none;
}

@media (min-width: 960px) {
  .side-nav {
    position: fixed;
    inset: 0 auto 0 0;
    width: 220px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: #f5f5f7;
    border-right: 1px solid #e0e0e0;
  }
}

.side-nav__brand {
  margin-bottom: 32px;
}

.side-nav__title {
  margin: 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: #111111;
}

.side-nav__role {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 16px;
  color: #999999;
}

.side-nav__tabs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.side-nav__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #555555;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}

.side-nav__link:hover {
  background: #e0e0e0;
}

.side-nav__link--active {
  background: #e8e8ff;
  color: #1a1aff;
}
</style>
