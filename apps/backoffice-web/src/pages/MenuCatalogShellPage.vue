<template>
  <v-row class="menu-shell">
    <v-col cols="12">
      <v-card class="menu-shell__hero" rounded="xl" data-testid="menu-catalog-shell">
        <div>
          <p class="menu-shell__label">FEATURE-002 · Структурный снимок каталога</p>
          <h3 class="menu-shell__title">Категории, товары и группы дополнительных опций</h3>
          <p class="menu-shell__text">
            Вкладка `menu` читает и хранит единый снимок каталога из `apps/server`, а экранные
            подпотоки используют только согласованные DTO без локальных источников данных.
          </p>
        </div>

        <div class="menu-shell__actions">
          <v-chip variant="flat" color="primary">Категорий {{ counts.categories }}</v-chip>
          <v-chip variant="tonal" color="primary">Товаров {{ counts.items }}</v-chip>
          <v-chip variant="tonal" color="primary">Групп допов {{ counts.optionGroups }}</v-chip>
          <v-btn
            color="primary"
            variant="flat"
            :loading="isBusy"
            :disabled="!accessToken"
            @click="reloadCatalog"
          >
            Обновить снимок
          </v-btn>
        </div>
      </v-card>
    </v-col>

    <v-col v-if="showInitialLoading" cols="12">
      <v-card class="menu-shell__state" rounded="xl">
        <v-progress-circular indeterminate color="primary" />
        <div>
          <h4 class="menu-shell__state-title">Каталог загружается</h4>
          <p class="menu-shell__state-text">
            Клиентская часть читает категории, товары и группы дополнительных опций через
            `GET /api/backoffice/menu/catalog`.
          </p>
        </div>
      </v-card>
    </v-col>

    <v-col v-else-if="showBlockingError" cols="12">
      <v-card class="menu-shell__state menu-shell__state--error" rounded="xl">
        <v-chip color="error" variant="flat" size="small">Ошибка загрузки</v-chip>
        <div>
          <h4 class="menu-shell__state-title">Не удалось получить структурный снимок</h4>
          <p class="menu-shell__state-text">{{ menuState.error?.message }}</p>
        </div>
        <v-btn color="primary" variant="flat" :disabled="!accessToken" @click="reloadCatalog">
          Повторить
        </v-btn>
      </v-card>
    </v-col>

    <v-col v-else cols="12">
      <v-card
        v-if="showNonBlockingError"
        class="menu-shell__warning"
        rounded="xl"
        variant="tonal"
        data-testid="menu-catalog-warning"
      >
        <p class="menu-shell__warning-label">Снимок сохранён локально, но последнее обновление завершилось ошибкой</p>
        <p class="menu-shell__warning-text">{{ menuState.error?.message }}</p>
      </v-card>

      <router-view />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
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

function reloadCatalog() {
  if (!accessToken.value) {
    return;
  }

  void menuCatalogStore.reload(accessToken.value);
}

onMounted(() => {
  if (menuState.status === 'idle' && accessToken.value) {
    void menuCatalogStore.initialize(accessToken.value);
  }
});
</script>

<style scoped lang="scss">
.menu-shell {
  &__hero,
  &__state,
  &__warning {
    border: 1px solid var(--expressa-border);
    background: rgba(255, 255, 255, 0.94);
  }

  &__hero {
    display: grid;
    gap: 1.25rem;
    padding: 1.5rem;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(229, 243, 255, 0.88)),
      rgba(255, 255, 255, 0.94);
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
  &__state-text,
  &__warning-text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  &__state {
    display: grid;
    gap: 1rem;
    align-items: center;
    padding: 1.5rem;
  }

  &__state--error {
    background: linear-gradient(180deg, rgba(255, 246, 246, 0.98), rgba(255, 255, 255, 0.94));
  }

  &__warning {
    margin-bottom: 1rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(180deg, rgba(255, 250, 240, 0.96), rgba(255, 255, 255, 0.94));
  }
}

@media (min-width: 900px) {
  .menu-shell {
    &__hero {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      padding: 1.75rem;
    }

    &__state {
      grid-template-columns: auto minmax(0, 1fr) auto;
      padding: 1.75rem;
    }
  }
}
</style>
