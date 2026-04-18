<template>
  <v-row class="menu-shell">
    <v-col cols="12">
      <MenuSurfaceCard
        class="menu-shell__hero"
        data-testid="menu-catalog-shell"
        padding="lg"
        variant="hero"
      >
        <div class="menu-shell__hero-grid">
          <div class="menu-shell__hero-copy">
            <MenuBadge
              class="menu-shell__hero-badge"
              :emphasis="shellState.heroBadge.emphasis"
              size="compact"
              :tone="shellState.heroBadge.tone"
            >
              {{ shellState.heroBadge.label }}
            </MenuBadge>
            <MenuSectionHeader
              label="FEATURE-002 · Структурный снимок каталога"
              size="hero"
              text="Вкладка `menu` читает и хранит единый снимок каталога из `apps/server`, а экранные подпотоки используют согласованные DTO и общий визуальный слой FE-010."
              title="Категории, товары и группы дополнительных опций"
            />
          </div>

          <div class="menu-shell__hero-metrics" aria-label="Счетчики каталога">
            <article
              v-for="metric in shellState.heroMetrics"
              :key="metric.label"
              class="menu-shell__metric"
            >
              <p class="menu-shell__metric-label">{{ metric.label }}</p>
              <strong class="menu-shell__metric-value">{{ metric.value }}</strong>
              <p class="menu-shell__metric-hint">{{ metric.hint }}</p>
            </article>
          </div>
        </div>

        <div class="menu-shell__action-bar">
          <div class="menu-shell__action-copy">
            <p class="menu-shell__action-label">Панель действий</p>
            <p class="menu-shell__action-text">
              Обновление доступно только для синхронизированного состояния без локального черновика;
              сохранение и предупреждения остаются в `menuCatalogStore`.
            </p>
          </div>

          <div class="menu-shell__actions">
            <MenuBadge size="compact" tone="neutral">
              Статус {{ shellState.statusSummary }}
            </MenuBadge>
            <MenuBadge
              size="compact"
              :tone="menuState.isDirty ? 'warning' : 'neutral'"
            >
              {{ menuState.isDirty ? 'Есть черновик' : 'Черновик пуст' }}
            </MenuBadge>
            <MenuActionButton
              :disabled="!shellState.canReload"
              :loading="shellState.isReloading"
              variant="secondary"
              @click="reloadCatalog"
            >
              Обновить снимок
            </MenuActionButton>
          </div>
        </div>
      </MenuSurfaceCard>
    </v-col>

    <v-col v-if="shellState.showSavePanel" cols="12">
      <MenuCatalogSavePanel
        :disabled="!accessToken"
        :error="shellState.savePanelError"
        :is-dirty="menuState.isDirty"
        :status="menuState.status"
        @save="saveCatalog"
      />
    </v-col>

    <v-col v-if="shellState.blockingState" cols="12">
      <MenuSurfaceCard
        class="menu-shell__feedback"
        padding="lg"
        :variant="shellState.blockingState.kind === 'error' ? 'danger' : 'default'"
      >
        <div
          class="menu-shell__feedback-icon"
          :class="{
            'menu-shell__feedback-icon--error': shellState.blockingState.kind === 'error',
          }"
        >
          <v-progress-circular
            v-if="shellState.blockingState.kind !== 'error'"
            indeterminate
            color="primary"
          />
          <span v-else>!</span>
        </div>

        <div class="menu-shell__feedback-copy">
          <MenuBadge
            size="compact"
            :tone="shellState.blockingState.kind === 'error' ? 'danger' : 'neutral'"
          >
            {{ shellState.blockingState.label }}
          </MenuBadge>
          <MenuSectionHeader
            :text="shellState.blockingState.text"
            :title="shellState.blockingState.title"
          />
        </div>

        <div v-if="shellState.blockingState.actionLabel" class="menu-shell__feedback-actions">
          <MenuActionButton :disabled="!shellState.canReload" @click="reloadCatalog">
            {{ shellState.blockingState.actionLabel }}
          </MenuActionButton>
        </div>
      </MenuSurfaceCard>
    </v-col>

    <v-col v-else cols="12">
      <MenuSurfaceCard
        v-if="shellState.warningState"
        class="menu-shell__feedback menu-shell__feedback--warning"
        data-testid="menu-catalog-warning"
        variant="warning"
      >
        <div class="menu-shell__feedback-copy">
          <MenuBadge size="compact" tone="warning">
            {{ shellState.warningState.label }}
          </MenuBadge>
          <MenuSectionHeader
            :text="`${shellState.warningState.text} ${menuState.error?.message ?? ''}`"
            :title="shellState.warningState.title"
          />
        </div>
        <div class="menu-shell__feedback-actions">
          <MenuActionButton
            :disabled="!shellState.canReload"
            variant="secondary"
            @click="reloadCatalog"
          >
            {{ shellState.warningState.actionLabel }}
          </MenuActionButton>
        </div>
      </MenuSurfaceCard>

      <router-view />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import MenuCatalogSavePanel from '../components/MenuCatalogSavePanel.vue';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuBadge from '../components/menu/MenuBadge.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import MenuSurfaceCard from '../components/menu/MenuSurfaceCard.vue';
import { useMenuCatalogShellState } from '../composables/menu-catalog-shell-state';
import { backofficeAccessStore } from '../stores/backoffice-access-store';
import { menuCatalogStore } from '../stores/menu-catalog-store';

const menuState = menuCatalogStore.state;
const accessToken = computed(() => backofficeAccessStore.state.accessToken);
const shellState = useMenuCatalogShellState(menuState, computed(() => !!accessToken.value));

function reloadCatalog() {
  if (!accessToken.value) {
    return;
  }

  void menuCatalogStore.reload(accessToken.value);
}

function saveCatalog() {
  if (!accessToken.value) {
    return;
  }

  void menuCatalogStore.save(accessToken.value);
}

onMounted(() => {
  if (menuState.status === 'idle' && accessToken.value) {
    void menuCatalogStore.initialize(accessToken.value);
  }
});
</script>

<style scoped lang="scss">
.menu-shell {
  &__hero {
    display: grid;
    gap: 1.25rem;
  }

  &__hero-grid {
    display: grid;
    gap: 1.25rem;
  }

  &__hero-copy {
    min-width: 0;
  }

  &__hero-badge {
    margin-bottom: 0.85rem;
  }

  &__hero-metrics {
    display: grid;
    gap: 0.85rem;
  }

  &__metric {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid rgba(17, 17, 17, 0.08);
    border-radius: var(--expressa-menu-radius-lg);
    background: rgba(255, 255, 255, 0.7);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  &__metric-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__metric-value {
    color: var(--expressa-text);
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.1;
  }

  &__metric-hint {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.5;
  }

  &__action-bar {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid rgba(17, 17, 17, 0.08);
    border-radius: var(--expressa-menu-radius-lg);
    background: rgba(255, 255, 255, 0.72);
  }

  &__action-copy {
    min-width: 0;
  }

  &__action-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__action-text {
    margin: 0.35rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  &__feedback {
    display: grid;
    gap: 1.25rem;
    align-items: center;
  }

  &__feedback-icon {
    display: grid;
    width: 3.5rem;
    height: 3.5rem;
    place-items: center;
    border-radius: 50%;
    background: var(--expressa-menu-surface-subtle);
    color: var(--accent);
    font-size: 1.6rem;
    font-weight: 800;
  }

  &__feedback-icon--error {
    background: #ffebee;
    color: #b71c1c;
  }

  &__feedback-copy {
    min-width: 0;
    display: grid;
    gap: 0.85rem;
  }

  &__feedback-actions {
    display: flex;
    justify-content: flex-start;
  }

  &__feedback--warning {
    margin-bottom: 1rem;
  }
}

@media (min-width: 760px) {
  .menu-shell__hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .menu-shell {
    &__hero-grid {
      grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.95fr);
      align-items: start;
    }

    &__action-bar,
    &__feedback {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    &__feedback {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    &__actions,
    &__feedback-actions {
      justify-content: flex-end;
    }
  }
}
</style>
