<script setup lang="ts">
import { computed } from "vue";
import { useAuthSession } from "./modules/auth/session-store";

const auth = useAuthSession();
const showOverlay = computed(() => auth.state.status === "loading" && !auth.state.actor);
</script>

<template>
  <v-app>
    <router-view />
    <div v-if="showOverlay" class="app-overlay" aria-live="polite" aria-busy="true">
      <div class="app-overlay__content">
        <v-progress-circular indeterminate color="primary" :size="44" :width="4" />
        <p class="app-overlay__text">Проверяем вход через Telegram</p>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
.app-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 245, 247, 0.92);
  z-index: 1000;
}

.app-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.app-overlay__text {
  margin: 0;
  font-size: 14px;
  color: #555555;
}
</style>
