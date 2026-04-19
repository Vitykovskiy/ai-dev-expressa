<script setup lang="ts">
import { computed } from "vue";
import SideNav from "../components/SideNav.vue";
import TabBar from "../components/TabBar.vue";
import { useAuthSession } from "../modules/auth/session-store";

const auth = useAuthSession();
const actor = computed(() => auth.state.actor);
const roleLabel = computed(() => {
  const roles = actor.value?.roles ?? [];
  return roles.includes("administrator") ? "Администратор" : "Бариста";
});
</script>

<template>
  <div class="root-layout">
    <SideNav v-if="actor" :capabilities="actor.capabilities" :role-label="roleLabel" />

    <main class="root-layout__content">
      <router-view />
    </main>

    <TabBar v-if="actor" :capabilities="actor.capabilities" />
  </div>
</template>

<style scoped>
.root-layout {
  min-height: 100vh;
  display: flex;
  background: #f5f5f7;
}

.root-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (min-width: 960px) {
  .root-layout__content {
    margin-left: 220px;
  }
}
</style>
