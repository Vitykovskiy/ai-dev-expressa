<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { getVisibleTabs } from "../modules/navigation/tabs";
import type { BackofficeCapability } from "../modules/auth/types";

const props = defineProps<{
  capabilities: readonly BackofficeCapability[];
}>();

const route = useRoute();
const tabs = computed(() => getVisibleTabs(props.capabilities));
</script>

<template>
  <nav class="tab-bar" aria-label="Мобильная навигация">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.id"
      :to="tab.path"
      class="tab-bar__link"
      :class="{ 'tab-bar__link--active': route.path === tab.path }"
    >
      <span
        v-if="route.path === tab.path"
        class="tab-bar__indicator"
        aria-hidden="true"
      />
      <component :is="tab.icon" :size="22" />
      <span class="tab-bar__label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -1px 0 #e0e0e0;
}

@media (min-width: 960px) {
  .tab-bar {
    display: none;
  }
}

.tab-bar__link {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #999999;
}

.tab-bar__link--active {
  color: #1a1aff;
}

.tab-bar__indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #1a1aff;
}

.tab-bar__label {
  font-size: 12px;
  line-height: 16px;
}
</style>
