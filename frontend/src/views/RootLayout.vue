<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import UiSideNav from "@/ui/UiSideNav.vue";
import UiTabBar from "@/ui/UiTabBar.vue";
import { useAuthSession } from "@/modules/auth/session-store";
import { getVisibleTabs } from "@/modules/navigation/tabs";

const auth = useAuthSession();
const route = useRoute();
const actor = computed(() => auth.state.actor);
const visibleTabs = computed(() =>
  getVisibleTabs(actor.value?.capabilities ?? []),
);
const roleLabel = computed(() => {
  const roles = actor.value?.roles ?? [];
  return roles.includes("administrator") ? "Администратор" : "Бариста";
});
</script>

<template>
  <div class="root-layout">
    <ui-side-nav
      v-if="actor"
      :tabs="visibleTabs"
      :role-label="roleLabel"
      :active-path="route.path"
    />

    <main class="root-layout__content">
      <router-view />
    </main>

    <ui-tab-bar v-if="actor" :tabs="visibleTabs" :active-path="route.path" />
  </div>
</template>

<style scoped lang="scss">
.root-layout {
  min-height: 100vh;
  display: flex;
  background: var(--app-color-background-secondary);
}

.root-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (min-width: 960px) {
  .root-layout__content {
    margin-left: var(--app-side-nav-width);
  }
}
</style>
