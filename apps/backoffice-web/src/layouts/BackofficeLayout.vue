<template>
  <v-app class="backoffice-app">
    <v-navigation-drawer
      v-if="isDesktop"
      :model-value="true"
      :rail="false"
      :width="280"
      class="backoffice-app__drawer"
    >
      <div class="backoffice-app__brand">
        <p class="backoffice-app__eyebrow">Внутренний административный контур</p>
        <h1 class="backoffice-app__brand-title">{{ environment.appTitle }}</h1>
        <p class="backoffice-app__brand-subtitle">{{ brandSummary }}</p>
      </div>

      <v-list nav class="backoffice-app__nav-list">
        <v-list-item
          v-for="item in navigationItems"
          :key="item.tab"
          :active="item.tab === currentTab"
          :title="item.label"
          :subtitle="item.summary"
          rounded="xl"
          @click="goToTab(item.path)"
        />
      </v-list>

      <template #append>
        <div class="backoffice-app__drawer-footer">
          <span class="backoffice-app__footer-label">Сессия</span>
          <strong class="backoffice-app__footer-status">{{ sessionLabel }}</strong>
          <span class="backoffice-app__footer-value">{{ sessionSummary }}</span>
          <code class="backoffice-app__footer-api">{{ environment.apiBaseUrl }}</code>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar v-else flat class="backoffice-app__topbar">
      <v-app-bar-title>{{ currentItem.label }}</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="backoffice-app__container" fluid>
        <div class="backoffice-app__hero">
          <div>
            <p class="backoffice-app__eyebrow">{{ heroEyebrow }}</p>
            <h2 class="backoffice-app__hero-title">{{ heroTitle }}</h2>
            <p class="backoffice-app__hero-text">{{ heroText }}</p>
          </div>

          <v-chip color="primary" variant="flat" size="large">
            {{ heroChip }}
          </v-chip>
        </div>

        <div v-if="isLoading" class="backoffice-app__state-card">
          <v-progress-circular indeterminate color="primary" />
          <div>
            <h3 class="backoffice-app__state-title">Инициализация контекста доступа</h3>
            <p class="backoffice-app__state-text">
              Клиентская часть синхронизирует текущую сессию с `apps/server` и готовит навигацию вкладок.
            </p>
          </div>
        </div>

        <div v-else-if="accessState.error" class="backoffice-app__state-card backoffice-app__state-card--error">
          <div>
            <h3 class="backoffice-app__state-title">Не удалось получить контекст доступа</h3>
            <p class="backoffice-app__state-text">{{ accessState.error.message }}</p>
            <p class="backoffice-app__state-meta">
              Причина: <code>{{ accessState.error.reason }}</code>
            </p>
          </div>

          <v-btn color="primary" variant="flat" @click="retryBootstrap">Повторить</v-btn>
        </div>

        <router-view v-else />
      </v-container>
    </v-main>

    <v-bottom-navigation
      v-if="!isDesktop"
      :model-value="currentItem.path"
      class="backoffice-app__bottom-nav"
      grow
    >
      <v-btn
        v-for="item in navigationItems"
        :key="item.tab"
        :value="item.path"
        @click="goToTab(item.path)"
      >
        <span>{{ item.label }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { appEnvironment } from '../services/app-environment';
import {
  backofficeNavigation,
  defaultBackofficeRoute,
  resolveBackofficeNavigation,
} from '../router/backoffice-navigation';
import { backofficeAccessStore } from '../stores/backoffice-access-store';

const router = useRouter();
const route = useRoute();
const display = useDisplay();

const environment = appEnvironment;
const accessState = backofficeAccessStore.state;
const isDesktop = computed(() => display.mdAndUp.value);
const isLoading = computed(
  () => accessState.status === 'idle' || accessState.status === 'restoring' || accessState.status === 'bootstrapping',
);
const navigationItems = computed(() =>
  accessState.context
    ? resolveBackofficeNavigation(accessState.context.availableTabs)
    : backofficeNavigation,
);
const currentTab = computed(() =>
  typeof route.name === 'string' ? route.name : defaultBackofficeRoute.tab,
);
const currentItem = computed(
  () =>
    backofficeNavigation.find((item) => item.tab === currentTab.value) ?? defaultBackofficeRoute,
);
const brandSummary = computed(() => {
  if (accessState.context) {
    return `Контекст ${accessState.context.user.telegramId} синхронизирован с server, навигация строится по availableTabs.`;
  }

  if (accessState.error) {
    return 'Bootstrap доступа завершился ошибкой. Контекст можно запросить повторно без перезагрузки страницы.';
  }

  return 'Клиентская часть восстанавливает текущую сессию и готовит серверно-управляемую навигацию вкладок.';
});
const heroEyebrow = computed(() => {
  if (accessState.context) {
    return 'Контекст доступа получен из apps/server';
  }

  return 'Vue 3 · Vite · Vuetify · Vue Router · Vitest';
});
const heroTitle = computed(() => {
  if (accessState.error) {
    return 'Bootstrap доступа требует повторной попытки';
  }

  if (!accessState.context) {
    return 'Контекст доступа инициализируется';
  }

  return currentItem.value.label;
});
const heroText = computed(() => {
  if (accessState.error) {
    return 'HTTP-клиент получил ответ об ошибке или не смог связаться с server. Финальные guard-правила и экран отказа остаются задачей FE-003.';
  }

  if (!accessState.context) {
    return 'Клиентская часть восстанавливает accessToken, читает текущий контекст через GET /api/backoffice/access/me и при необходимости выполняет POST /api/backoffice/access/bootstrap.';
  }

  return `Доступные вкладки приходят из server без локального вычисления ролей. Активная сессия: ${accessState.context.user.roles.join(', ')}.`;
});
const heroChip = computed(() => {
  if (accessState.context?.isTestMode) {
    return 'FEATURE-001 / test-mode session';
  }

  if (accessState.context) {
    return 'FEATURE-001 / Telegram session';
  }

  return 'FEATURE-001 / FE-002';
});
const sessionLabel = computed(() => {
  if (accessState.context?.isTestMode) {
    return 'Test environment';
  }

  if (accessState.context) {
    return 'Telegram-вход';
  }

  if (accessState.error) {
    return 'Ошибка bootstrap';
  }

  return 'Инициализация';
});
const sessionSummary = computed(() => {
  if (accessState.context) {
    return `@${accessState.context.user.telegramId} · вкладок: ${accessState.context.availableTabs.length}`;
  }

  if (accessState.error) {
    return accessState.error.message;
  }

  return 'Ожидается серверный контекст текущего пользователя.';
});

function goToTab(path: string) {
  if (route.path === path) {
    return;
  }

  void router.push(path);
}

function retryBootstrap() {
  void backofficeAccessStore.retry();
}
</script>

<style scoped lang="scss">
.backoffice-app {
  background:
    radial-gradient(circle at top left, rgba(26, 26, 255, 0.14), transparent 24rem),
    radial-gradient(circle at top right, rgba(46, 125, 50, 0.12), transparent 18rem),
    var(--expressa-background);

  &__drawer {
    border-right: 1px solid var(--expressa-border);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 247, 0.98));
  }

  &__brand {
    padding: 1.5rem;
  }

  &__eyebrow {
    margin: 0 0 0.5rem;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__brand-title,
  &__hero-title {
    margin: 0;
    color: var(--expressa-text);
    font-size: clamp(1.8rem, 2vw, 2.4rem);
    font-weight: 800;
    line-height: 1.05;
  }

  &__brand-subtitle,
  &__hero-text {
    margin: 0.75rem 0 0;
    max-width: 36rem;
    color: var(--expressa-secondary);
    font-size: 1rem;
    line-height: 1.6;
  }

  &__nav-list {
    padding: 0 1rem;
  }

  &__drawer-footer {
    margin: 1rem;
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.9);
  }

  &__footer-label {
    display: block;
    margin-bottom: 0.4rem;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__footer-status {
    display: block;
    color: var(--expressa-text);
    font-size: 0.95rem;
    font-weight: 700;
  }

  &__footer-value {
    display: block;
    margin-top: 0.35rem;
    color: var(--expressa-text);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  &__footer-api {
    display: block;
    margin-top: 0.75rem;
    color: var(--expressa-secondary);
    font-family: 'Consolas', 'SFMono-Regular', monospace;
    font-size: 0.8rem;
  }

  &__topbar {
    border-bottom: 1px solid var(--expressa-border);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(14px);
  }

  &__container {
    margin: 0 auto;
    max-width: 1120px;
    padding: 1.25rem 1rem 6rem;
  }

  &__hero {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding: 1.5rem;
    border: 1px solid rgba(26, 26, 255, 0.1);
    border-radius: 1.5rem;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(232, 232, 255, 0.86));
  }

  &__bottom-nav {
    border-top: 1px solid var(--expressa-border);
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(16px);
  }

  &__state-card {
    display: grid;
    gap: 1rem;
    align-items: center;
    padding: 1.5rem;
    border: 1px solid var(--expressa-border);
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.94);
  }

  &__state-card--error {
    border-color: rgba(183, 28, 28, 0.16);
    background: linear-gradient(180deg, rgba(255, 245, 245, 0.96), rgba(255, 255, 255, 0.94));
  }

  &__state-title {
    margin: 0;
    color: var(--expressa-text);
    font-size: 1.2rem;
    font-weight: 800;
  }

  &__state-text,
  &__state-meta {
    margin: 0.5rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
  }
}

@media (min-width: 768px) {
  .backoffice-app {
    &__container {
      padding: 2rem;
    }

    &__hero {
      align-items: end;
      grid-template-columns: minmax(0, 1fr) auto;
      padding: 2rem;
    }

    &__state-card {
      grid-template-columns: auto minmax(0, 1fr) auto;
      padding: 2rem;
    }
  }
}
</style>
