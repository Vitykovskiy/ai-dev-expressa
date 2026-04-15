<template>
  <v-container class="fill-height d-flex align-center justify-center py-10">
    <v-card class="entry-card pa-6 pa-sm-8" rounded="xl" elevation="10">
      <div class="eyebrow text-uppercase mb-3">Feature 002</div>
      <h1 class="text-h3 text-sm-h2 font-weight-bold mb-3">
        Administrator auth/session
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        {{ entryHint }}
      </p>

      <v-alert
        :type="alert.type"
        variant="tonal"
        class="mb-4"
      >
        <div class="text-subtitle-1 font-weight-bold mb-1">{{ alert.title }}</div>
        <div>{{ alert.message }}</div>
      </v-alert>

      <v-sheet
        v-if="userSnapshot"
        class="user-sheet pa-4 mb-4"
        rounded="lg"
      >
        <div class="text-subtitle-2 font-weight-bold mb-2">Контекст пользователя</div>
        <div class="text-body-2 mb-1">
          Telegram ID: <strong>{{ userSnapshot.telegramId }}</strong>
        </div>
        <div class="text-body-2">
          Роли: <strong>{{ userSnapshot.roles.join(', ') }}</strong>
        </div>
      </v-sheet>

      <div class="d-flex flex-wrap ga-3">
        <v-btn
          color="primary"
          size="large"
          variant="flat"
          :loading="isBootstrapping"
          @click="attemptBootstrap()"
        >
          {{ actionLabel }}
        </v-btn>

        <v-btn
          v-if="status === 'authenticated'"
          color="secondary"
          size="large"
          variant="outlined"
          @click="openShell()"
        >
          Открыть shell
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthSessionStore } from '@/features/auth-session/composables/authSessionStore';
import { useAuthSessionViewModel } from '@/features/auth-session/composables/authSessionViewModel';

const router = useRouter();
const store = useAuthSessionStore();
const { actionLabel, alert, entryHint, userSnapshot } = useAuthSessionViewModel(store);
const { isBootstrapping, status } = store;

async function openShell(): Promise<void> {
  if (router.currentRoute.value.name !== 'backoffice-shell') {
    await router.replace({ name: 'backoffice-shell' });
  }
}

async function attemptBootstrap(): Promise<void> {
  try {
    const result = await store.bootstrap();

    if (result.kind === 'authenticated') {
      await openShell();
    }
  } catch {
    // UI branch is rendered from reactive store state.
  }
}

onMounted(() => {
  if (status.value === 'idle') {
    void attemptBootstrap();
    return;
  }

  if (status.value === 'authenticated') {
    void openShell();
  }
});

watch(status, (nextStatus) => {
  if (nextStatus === 'authenticated') {
    void openShell();
  }
});
</script>

<style scoped>
.entry-card {
  backdrop-filter: blur(18px);
  background: rgba(255, 250, 244, 0.94);
  border: 1px solid rgba(94, 54, 28, 0.08);
  max-width: 760px;
  width: min(100%, 760px);
}

.eyebrow {
  color: rgb(123, 63, 29);
  font-family: 'Aptos', 'Segoe UI Variable', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

h1 {
  color: rgb(57, 31, 15);
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.05;
}

.user-sheet {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(94, 54, 28, 0.08);
}
</style>
