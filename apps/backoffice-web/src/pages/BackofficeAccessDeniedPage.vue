<template>
  <v-row>
    <v-col cols="12">
      <v-card class="access-denied-page" rounded="xl" data-testid="route-access-denied-page">
        <div class="access-denied-page__header">
          <v-chip color="error" variant="flat" size="small">403</v-chip>
          <p class="access-denied-page__eyebrow">Route guard</p>
        </div>

        <h3 class="access-denied-page__title" data-testid="route-access-denied-title">
          Доступ к вкладке запрещён
        </h3>
        <p class="access-denied-page__summary">
          Текущая сессия не содержит вкладку
          <strong>{{ deniedTabLabel }}</strong>
          в серверном списке `availableTabs`, поэтому прямой переход по URL остановлен.
        </p>

        <div class="access-denied-page__grid">
          <section class="access-denied-page__panel">
            <p class="access-denied-page__panel-label">Запрошенный путь</p>
            <code class="access-denied-page__code" data-testid="route-access-denied-path">
              {{ deniedPath }}
            </code>
          </section>

          <section class="access-denied-page__panel">
            <p class="access-denied-page__panel-label">Разрешённые вкладки</p>
            <div class="access-denied-page__chips">
              <v-chip
                v-for="item in availableNavigationItems"
                :key="item.tab"
                :data-testid="`allowed-tab-${item.tab}`"
                size="small"
                variant="tonal"
              >
                {{ item.label }}
              </v-chip>
            </div>
          </section>
        </div>

        <div class="access-denied-page__actions">
          <v-btn color="primary" variant="flat" @click="goToAllowedRoute">
            Перейти в разрешённый раздел
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { backofficeAccessStore } from '../stores/backoffice-access-store';
import {
  resolveAllowedBackofficeRoute,
  resolveBackofficeNavigation,
  resolveBackofficeNavigationItem,
} from '../router/backoffice-navigation';

const route = useRoute();
const router = useRouter();

const availableNavigationItems = computed(() =>
  resolveBackofficeNavigation(backofficeAccessStore.state.context?.availableTabs ?? []),
);

const deniedTabLabel = computed(() => {
  const deniedTab = route.query.deniedTab;

  return typeof deniedTab === 'string'
    ? resolveBackofficeNavigationItem(deniedTab).label
    : 'неизвестная вкладка';
});

const deniedPath = computed(() => {
  const path = route.query.deniedPath;
  return typeof path === 'string' && path.length > 0 ? path : '/';
});

function goToAllowedRoute() {
  const allowedRoute = resolveAllowedBackofficeRoute(
    backofficeAccessStore.state.context?.availableTabs ?? [],
  );

  void router.push(allowedRoute.path);
}
</script>

<style scoped lang="scss">
.access-denied-page {
  border: 1px solid rgba(183, 28, 28, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 245, 245, 0.96), rgba(255, 255, 255, 0.94));

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.5rem 0;
  }

  &__eyebrow,
  &__panel-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 1rem 1.5rem 0;
    color: var(--expressa-text);
    font-size: clamp(1.4rem, 1.7vw, 2rem);
    font-weight: 800;
    line-height: 1.1;
  }

  &__summary {
    margin: 0.75rem 1.5rem 0;
    max-width: 44rem;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__grid {
    display: grid;
    gap: 1rem;
    padding: 1.5rem;
  }

  &__panel {
    padding: 1rem;
    border: 1px solid rgba(183, 28, 28, 0.12);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.9);
  }

  &__code {
    display: inline-block;
    margin-top: 0.75rem;
    color: var(--expressa-text);
    font-family: 'Consolas', 'SFMono-Regular', monospace;
    font-size: 0.9rem;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  &__actions {
    padding: 0 1.5rem 1.5rem;
  }
}

@media (min-width: 768px) {
  .access-denied-page {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding: 2rem 1.5rem 1.5rem;
    }
  }
}
</style>
