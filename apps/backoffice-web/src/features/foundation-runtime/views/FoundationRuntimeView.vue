<template>
  <v-container class="fill-height d-flex align-center justify-center py-10">
    <v-card class="foundation-card pa-6 pa-sm-8" rounded="xl" elevation="8">
      <div class="eyebrow text-uppercase mb-3">Feature 001</div>
      <h1 class="text-h3 text-sm-h2 font-weight-bold mb-3">
        Foundation runtime smoke
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Frontend foundation проверяет связку
        <strong>client -&gt; server</strong>
        через typed контракт health endpoint.
      </p>

      <v-alert
        v-if="isLoading"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Запрашиваем <code>GET /api/foundation/health</code>.
      </v-alert>

      <v-alert
        v-else-if="status === 'success' && response"
        type="success"
        variant="tonal"
        class="mb-4"
      >
        Ответ получен:
        <code>{{ JSON.stringify(response) }}</code>
      </v-alert>

      <v-alert
        v-else-if="status === 'error'"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-btn
        color="primary"
        size="large"
        variant="flat"
        :loading="isLoading"
        @click="load()"
      >
        Повторить проверку
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useFoundationHealth } from '@/features/foundation-runtime/composables/foundationHealth';

const { errorMessage, isLoading, load, response, status } = useFoundationHealth();

onMounted(() => {
  void load();
});
</script>

<style scoped>
.foundation-card {
  backdrop-filter: blur(16px);
  background: rgba(255, 250, 244, 0.92);
  border: 1px solid rgba(123, 63, 29, 0.08);
  max-width: 720px;
  width: min(100%, 720px);
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

code {
  background: rgba(123, 63, 29, 0.08);
  border-radius: 6px;
  padding: 0.15rem 0.35rem;
}
</style>
