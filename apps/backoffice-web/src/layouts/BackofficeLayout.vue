<template>
  <v-app class="backoffice-layout">
    <SideNav
      v-if="isDesktop"
      :api-base-url="environment.apiBaseUrl"
      :brand-summary="layoutState.brandSummary"
      :brand-title="environment.appTitle"
      :current-tab="layoutState.currentTab"
      :items="layoutState.navigationItems"
      :role-label="layoutState.roleLabel"
      :session-label="layoutState.sessionLabel"
      :session-summary="layoutState.sessionSummary"
      @navigate="goToTab"
    />

    <div class="backoffice-layout__shell">
      <TopBar
        v-if="!isDesktop"
        :title="layoutState.heroTitle"
        class="backoffice-layout__topbar"
      >
        <template #left>
          <v-chip
            size="x-small"
            variant="tonal"
            color="primary"
            class="backoffice-layout__topbar-chip"
          >
            {{ layoutState.sessionLabel }}
          </v-chip>
        </template>
      </TopBar>

      <v-main class="backoffice-layout__main">
        <v-container class="backoffice-layout__container" fluid>
          <section class="backoffice-layout__hero" data-testid="backoffice-hero">
            <div class="backoffice-layout__hero-copy">
              <p class="backoffice-layout__eyebrow">{{ layoutState.heroEyebrow }}</p>
              <h1 class="backoffice-layout__hero-title" data-testid="hero-title">
                {{ layoutState.heroTitle }}
              </h1>
              <p class="backoffice-layout__hero-text">{{ layoutState.heroText }}</p>
            </div>

            <div class="backoffice-layout__hero-meta">
              <v-chip color="primary" variant="flat" size="small" data-testid="hero-chip">
                {{ layoutState.heroChip }}
              </v-chip>
              <div class="backoffice-layout__hero-session">
                <span class="backoffice-layout__hero-session-label">{{ layoutState.sessionLabel }}</span>
                <strong class="backoffice-layout__hero-session-value" data-testid="session-label">
                  {{ layoutState.roleLabel }}
                </strong>
                <span class="backoffice-layout__hero-session-summary" data-testid="session-summary">
                  {{ layoutState.sessionSummary }}
                </span>
              </div>
            </div>
          </section>

          <section
            v-if="layoutState.blockingState"
            data-testid="blocking-state"
            class="backoffice-layout__state-card"
            :class="{
              'backoffice-layout__state-card--error': layoutState.blockingState.kind === 'error',
              'backoffice-layout__state-card--denied':
                layoutState.blockingState.kind === 'access-denied',
            }"
          >
            <div class="backoffice-layout__state-icon">
              <v-progress-circular
                v-if="layoutState.blockingState.kind === 'loading'"
                indeterminate
                color="primary"
              />
              <v-chip
                v-else-if="layoutState.blockingState.kind === 'access-denied'"
                color="error"
                variant="flat"
                size="small"
              >
                403
              </v-chip>
              <v-chip v-else color="warning" variant="flat" size="small">Ошибка</v-chip>
            </div>

            <div class="backoffice-layout__state-copy">
              <h2 class="backoffice-layout__state-title" data-testid="blocking-state-title">
                {{ layoutState.blockingState.title }}
              </h2>
              <p class="backoffice-layout__state-text">{{ layoutState.blockingState.text }}</p>
              <p
                v-if="layoutState.blockingState.reason"
                class="backoffice-layout__state-meta"
                data-testid="blocking-state-reason"
              >
                Причина: <code>{{ layoutState.blockingState.reason }}</code>
              </p>
            </div>

            <div class="backoffice-layout__state-actions">
              <v-btn
                v-if="layoutState.blockingState.kind !== 'loading'"
                color="primary"
                variant="flat"
                @click="retryBootstrap"
              >
                Повторить
              </v-btn>
            </div>
          </section>

          <router-view v-else />
        </v-container>
      </v-main>

      <TabBar
        v-if="!isDesktop"
        :current-tab="layoutState.currentTab"
        :items="layoutState.navigationItems"
        @navigate="goToTab"
      />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { SideNav, TabBar, TopBar } from '../components/layout';
import { useBackofficeLayoutState } from '../composables/backoffice-layout-state';
import { appEnvironment } from '../services/app-environment';
import { backofficeAccessStore } from '../stores/backoffice-access-store';

const router = useRouter();
const route = useRoute();
const display = useDisplay();

const environment = appEnvironment;
const accessState = backofficeAccessStore.state;
const isDesktop = computed(() => display.mdAndUp.value);
const layoutState = useBackofficeLayoutState(accessState, computed(() => route.name));

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
.backoffice-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(26, 26, 255, 0.12), transparent 22rem),
    radial-gradient(circle at top right, rgba(46, 125, 50, 0.12), transparent 18rem),
    var(--expressa-background);

  :deep(.v-application__wrap) {
    min-height: 100vh;
    display: flex;
    flex-direction: row;
  }

  &__shell {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__topbar {
    position: sticky;
    top: 0;
    z-index: 20;
  }

  &__topbar-chip {
    max-width: 7.5rem;
  }

  &__main {
    flex: 1;
  }

  &__container {
    margin: 0 auto;
    width: 100%;
    max-width: 1120px;
    padding: 1rem 1rem calc(6rem + env(safe-area-inset-bottom, 0px));
  }

  &__hero {
    display: grid;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1.25rem;
    border: 1px solid rgba(26, 26, 255, 0.1);
    border-radius: 1.5rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(232, 232, 255, 0.84));
    box-shadow: var(--expressa-shadow-card);
  }

  &__hero-copy {
    display: grid;
    gap: 0.75rem;
  }

  &__hero-meta {
    display: grid;
    gap: 0.75rem;
    align-content: start;
  }

  &__eyebrow,
  &__hero-session-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__hero-title {
    margin: 0;
    color: var(--expressa-text);
    font-size: clamp(1.6rem, 4vw, 2.3rem);
    font-weight: 800;
    line-height: 1.08;
  }

  &__hero-text,
  &__hero-session-summary {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
  }

  &__hero-session {
    display: grid;
    gap: 0.2rem;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.64);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.7);
  }

  &__hero-session-value {
    color: var(--expressa-text);
    font-size: 0.95rem;
    font-weight: 700;
  }

  &__state-card {
    display: grid;
    gap: 1rem;
    align-items: start;
    padding: 1.25rem;
    border: 1px solid var(--expressa-border);
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: var(--expressa-shadow-card);
  }

  &__state-card--error {
    border-color: rgba(183, 28, 28, 0.16);
    background: linear-gradient(180deg, rgba(255, 245, 245, 0.96), rgba(255, 255, 255, 0.94));
  }

  &__state-card--denied {
    border-color: rgba(183, 28, 28, 0.18);
    background: linear-gradient(180deg, rgba(255, 243, 243, 0.98), rgba(255, 252, 252, 0.94));
  }

  &__state-icon,
  &__state-actions {
    display: flex;
    align-items: center;
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
  .backoffice-layout {
    &__container {
      padding: 2rem 2rem 2.5rem;
    }

    &__hero {
      grid-template-columns: minmax(0, 1fr) minmax(15rem, 18rem);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding: 1.75rem;
    }

    &__state-card {
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      padding: 1.75rem;
    }
  }
}
</style>
