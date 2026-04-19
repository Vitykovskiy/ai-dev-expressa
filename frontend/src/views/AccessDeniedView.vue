<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const reason = computed(() => {
  const value = route.query.reason;
  return typeof value === "string" ? value : "telegram-init-data-required";
});
</script>

<template>
  <section class="access-denied">
    <div class="access-denied__content">
      <p class="access-denied__eyebrow">Expressa</p>
      <h1 class="access-denied__title">Вход в backoffice недоступен</h1>
      <p class="access-denied__text">
        Откройте backoffice из служебного Telegram-бота. Прямой вход по URL в
        продуктовой среде не поддерживается.
      </p>
      <p class="access-denied__reason">Причина: {{ reason }}</p>
    </div>
  </section>
</template>

<style scoped>
.access-denied {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f5f7;
}

.access-denied__content {
  max-width: 440px;
  text-align: center;
}

.access-denied__eyebrow {
  margin: 0 0 8px;
  color: #1a1aff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.access-denied__title {
  margin: 0 0 12px;
  color: #111111;
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

.access-denied__text,
.access-denied__reason {
  margin: 0;
  color: #555555;
  font-size: 15px;
  line-height: 24px;
}

.access-denied__reason {
  margin-top: 16px;
  color: #999999;
}
</style>
