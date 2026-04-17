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
        <p class="backoffice-app__brand-subtitle">
          Каркас FEATURE-001 уже запущен и готов для следующих задач по bootstrap доступа.
        </p>
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
          <span class="backoffice-app__footer-label">API</span>
          <code class="backoffice-app__footer-value">{{ environment.apiBaseUrl }}</code>
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
            <p class="backoffice-app__eyebrow">Vue 3 · Vite · Vuetify · Vue Router · Vitest</p>
            <h2 class="backoffice-app__hero-title">{{ currentItem.label }}</h2>
            <p class="backoffice-app__hero-text">
              Каркас маршрутов и root layout зафиксированы. HTTP-bootstrap, хранение контекста и guard-правила будут добавлены следующими задачами.
            </p>
          </div>

          <v-chip color="primary" variant="flat" size="large">
            FEATURE-001 / FE-001
          </v-chip>
        </div>

        <router-view />
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
import { backofficeNavigation, defaultBackofficeRoute } from '../router/backoffice-navigation';

const router = useRouter();
const route = useRoute();
const display = useDisplay();

const environment = appEnvironment;
const navigationItems = backofficeNavigation;
const isDesktop = computed(() => display.mdAndUp.value);
const currentTab = computed(() =>
  typeof route.name === 'string' ? route.name : defaultBackofficeRoute.tab,
);
const currentItem = computed(
  () =>
    navigationItems.find((item) => item.tab === currentTab.value) ??
    defaultBackofficeRoute,
);

function goToTab(path: string) {
  if (route.path === path) {
    return;
  }

  void router.push(path);
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

  &__footer-value {
    color: var(--expressa-text);
    font-family: 'Consolas', 'SFMono-Regular', monospace;
    font-size: 0.9rem;
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
  }
}
</style>
