<template>
  <div class="menu-shell">
    <section class="menu-shell__hero" data-testid="menu-catalog-shell">
      <div class="menu-shell__hero-copy">
        <p class="menu-shell__label">FEATURE-002 · Структурный снимок каталога</p>
        <h3 class="menu-shell__title">Категории, товары и группы дополнительных опций</h3>
        <p class="menu-shell__text">
          Вкладка `menu` читает и хранит единый снимок каталога из `apps/server`, а экранные
          подпотоки используют только согласованные DTO без локальных источников данных.
        </p>
      </div>

      <div class="menu-shell__hero-actions">
        <StatusBadge label="Категорий" variant="accent" />
        <strong class="menu-shell__hero-metric">{{ counts.categories }}</strong>
        <StatusBadge label="Товаров" variant="neutral" />
        <strong class="menu-shell__hero-metric">{{ counts.items }}</strong>
        <StatusBadge label="Групп допов" variant="neutral" />
        <strong class="menu-shell__hero-metric">{{ counts.optionGroups }}</strong>
        <Button
          :disabled="!accessToken || menuState.isDirty"
          :loading="isBusy"
          type="button"
          variant="secondary"
          @click="reloadCatalog"
        >
          Обновить снимок
        </Button>
      </div>
    </section>

    <section v-if="menuState.catalog" class="menu-shell__save-panel">
      <MenuCatalogSavePanel
        :disabled="!accessToken"
        :error="saveError"
        :is-dirty="menuState.isDirty"
        :status="menuState.status"
        @save="saveCatalog"
      />
    </section>

    <section v-if="showInitialLoading" class="menu-shell__state">
      <SectionList
        subtitle="Клиентская часть читает категории, товары и группы дополнительных опций через `GET /api/backoffice/menu/catalog`."
        title="Каталог загружается"
      >
        <div class="menu-shell__skeletons">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </SectionList>
    </section>

    <section v-else-if="showBlockingError" class="menu-shell__state">
      <EmptyState
        subtitle="Загрузка структурного снимка завершилась ошибкой. Повторите запрос, чтобы восстановить синхронизацию вкладки `menu`."
        title="Не удалось получить каталог меню"
      >
        <template #actions>
          <Button :disabled="!accessToken" type="button" @click="reloadCatalog">Повторить</Button>
        </template>
        <p class="menu-shell__error-message">{{ menuState.error?.message }}</p>
      </EmptyState>
    </section>

    <section v-else class="menu-shell__content">
      <div
        v-if="showNonBlockingError"
        class="menu-shell__warning"
        data-testid="menu-catalog-warning"
      >
        <p class="menu-shell__warning-label">
          Снимок сохранён локально, но последнее обновление завершилось ошибкой
        </p>
        <p class="menu-shell__warning-text">{{ menuState.error?.message }}</p>
      </div>

      <router-view />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Button, EmptyState, SectionList, Skeleton, StatusBadge } from '../components/base';
import MenuCatalogSavePanel from '../components/menu/MenuCatalogSavePanel.vue';
import { backofficeAccessStore } from '../stores/backoffice-access-store';
import { menuCatalogStore } from '../stores/menu-catalog-store';

const menuState = menuCatalogStore.state;
const accessToken = computed(() => backofficeAccessStore.state.accessToken);
const isBusy = computed(() => menuState.status === 'loading' || menuState.status === 'saving');
const counts = computed(() => ({
  categories: menuState.catalog?.categories.length ?? 0,
  items: menuState.catalog?.items.length ?? 0,
  optionGroups: menuState.catalog?.optionGroups.length ?? 0,
}));
const showInitialLoading = computed(() => menuState.status === 'loading' && !menuState.catalog);
const showBlockingError = computed(() => menuState.status === 'error' && !menuState.catalog);
const showNonBlockingError = computed(() => menuState.status === 'error' && !!menuState.catalog);
const saveError = computed(() =>
  menuState.status === 'error' && !!menuState.catalog ? menuState.error : null,
);

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
  display: grid;
  gap: 1rem;

  &__hero {
    display: grid;
    gap: 1.25rem;
    padding: 1.5rem;
    border: 1px solid rgba(26, 26, 255, 0.12);
    border-radius: 1.5rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(229, 243, 255, 0.88));
    box-shadow: var(--expressa-shadow-card);
  }

  &__hero-copy {
    display: grid;
    gap: 0.75rem;
  }

  &__label,
  &__warning-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title,
  &__state-title {
    margin: 0.75rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.35rem, 1.6vw, 1.9rem);
    font-weight: 800;
    line-height: 1.15;
  }

  &__text,
  &__warning-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__hero-actions {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    align-content: start;
    justify-content: start;
    gap: 0.75rem 1rem;
  }

  &__hero-metric {
    color: var(--expressa-text);
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1;
  }

  &__save-panel,
  &__state,
  &__content {
    min-width: 0;
  }

  &__warning {
    margin-bottom: 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid rgba(230, 81, 0, 0.16);
    border-radius: 1.25rem;
    background: linear-gradient(180deg, rgba(255, 250, 240, 0.96), rgba(255, 255, 255, 0.94));
  }

  &__skeletons {
    display: grid;
    gap: 1rem;
  }

  &__error-message {
    margin: 0.75rem 0 0;
    color: var(--expressa-color-destructive);
    font-weight: 700;
    line-height: 1.6;
  }
}

@media (min-width: 900px) {
  .menu-shell {
    &__hero {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
      padding: 1.75rem;
    }

    &__hero-actions {
      grid-template-columns: repeat(6, auto) minmax(11rem, auto);
      justify-content: end;
      gap: 0.75rem;
    }

    &__skeletons {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
