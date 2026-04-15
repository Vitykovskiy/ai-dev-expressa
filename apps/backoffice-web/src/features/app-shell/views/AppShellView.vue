<template>
  <v-container class="fill-height d-flex align-center justify-center py-10">
    <v-card class="shell-card pa-6 pa-sm-8" rounded="xl" elevation="10">
      <div class="eyebrow text-uppercase mb-3">Backoffice shell</div>
      <h1 class="text-h3 text-sm-h2 font-weight-bold mb-3">
        Administrator session active
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Этот reviewable slice подтверждает session bootstrap и administrator guard.
        Управление меню, пользователями и настройками будет доставлено отдельными feature.
      </p>

      <v-alert
        v-if="session"
        type="success"
        variant="tonal"
        class="mb-5"
      >
        Вход выполнен для <strong>{{ session.displayName }}</strong>
        через канал <strong>{{ channelLabel }}</strong>.
      </v-alert>

      <v-alert
        v-else
        type="error"
        variant="tonal"
        class="mb-5"
      >
        Административная сессия не найдена. Вернитесь к auth/session bootstrap.
      </v-alert>

      <div class="text-subtitle-2 font-weight-bold mb-3">Доступные секции administrator</div>
      <div class="d-flex flex-wrap ga-3 mb-6">
        <v-chip
          v-for="section in sections"
          :key="section"
          color="primary"
          variant="tonal"
          size="large"
        >
          {{ section }}
        </v-chip>
      </div>

      <v-sheet
        v-if="session"
        class="session-sheet pa-4"
        rounded="lg"
      >
        <div class="text-body-2 mb-1">
          User ID: <strong>{{ session.userId }}</strong>
        </div>
        <div class="text-body-2 mb-1">
          Telegram ID: <strong>{{ session.telegramId }}</strong>
        </div>
        <div class="text-body-2">
          Роли: <strong>{{ session.roles.join(', ') }}</strong>
        </div>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useAuthSessionStore } from '@/features/auth-session/composables/authSessionStore';

const { session } = useAuthSessionStore();
const sections = ['Меню', 'Пользователи', 'Настройки'];

const channelLabel = computed(() => {
  switch (session.value?.accessChannel) {
    case 'backoffice-telegram-entry':
      return 'Telegram backoffice entry';
    case 'test-mode-without-telegram':
      return 'test mode fallback';
    default:
      return 'unknown channel';
  }
});
</script>

<style scoped>
.shell-card {
  backdrop-filter: blur(18px);
  background: rgba(255, 251, 246, 0.96);
  border: 1px solid rgba(56, 80, 53, 0.08);
  max-width: 820px;
  width: min(100%, 820px);
}

.eyebrow {
  color: rgb(72, 93, 57);
  font-family: 'Aptos', 'Segoe UI Variable', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

h1 {
  color: rgb(30, 44, 22);
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.05;
}

.session-sheet {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(56, 80, 53, 0.08);
}
</style>
