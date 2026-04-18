<template>
  <v-row class="menu-shell">
    <v-col cols="12">
      <MenuSurfaceCard data-testid="menu-catalog-shell" padding="lg" variant="hero">
        <MenuSectionHeader
          label="FEATURE-002 · Структурный снимок каталога"
          size="hero"
          text="Вкладка `menu` читает и хранит единый снимок каталога из `apps/server`, а экранные подпотоки используют только согласованные DTO без локальных источников данных."
          title="Категории, товары и группы дополнительных опций"
        >
          <template #actions>
            <div class="menu-shell__actions">
              <MenuBadge emphasis="solid">Категорий {{ counts.categories }}</MenuBadge>
              <MenuBadge tone="neutral">Товаров {{ counts.items }}</MenuBadge>
              <MenuBadge tone="neutral">Групп допов {{ counts.optionGroups }}</MenuBadge>
              <MenuActionButton
                :disabled="!accessToken || menuState.isDirty"
                :loading="isBusy"
                @click="reloadCatalog"
              >
                Обновить снимок
              </MenuActionButton>
            </div>
          </template>
        </MenuSectionHeader>
      </MenuSurfaceCard>
    </v-col>

    <v-col v-if="menuState.catalog" cols="12">
      <MenuCatalogSavePanel
        :disabled="!accessToken"
        :error="saveError"
        :is-dirty="menuState.isDirty"
        :status="menuState.status"
        @save="saveCatalog"
      />
    </v-col>

    <v-col v-if="showInitialLoading" cols="12">
      <MenuSurfaceCard class="menu-shell__state" padding="lg">
        <v-progress-circular indeterminate color="primary" />
        <MenuSectionHeader
          label="Загрузка каталога"
          text="Клиентская часть читает категории, товары и группы дополнительных опций через `GET /api/backoffice/menu/catalog`."
          title="Каталог загружается"
        />
      </MenuSurfaceCard>
    </v-col>

    <v-col v-else-if="showBlockingError" cols="12">
      <MenuSurfaceCard class="menu-shell__state" padding="lg" variant="danger">
        <MenuBadge emphasis="solid" size="compact" tone="danger">Ошибка загрузки</MenuBadge>
        <MenuSectionHeader
          :text="menuState.error?.message ?? ''"
          title="Не удалось получить структурный снимок"
        />
        <MenuActionButton :disabled="!accessToken" @click="reloadCatalog">
          Повторить
        </MenuActionButton>
      </MenuSurfaceCard>
    </v-col>

    <v-col v-else cols="12">
      <MenuSurfaceCard
        v-if="showNonBlockingError"
        class="menu-shell__warning"
        data-testid="menu-catalog-warning"
        variant="warning"
      >
        <MenuSectionHeader
          label="Внимание"
          :text="menuState.error?.message ?? ''"
          title="Снимок сохранён локально, но последнее обновление завершилось ошибкой"
        />
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
  }

  &__warning {
    margin-bottom: 1rem;
  }
}

@media (min-width: 900px) {
  .menu-shell__state {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
}
</style>
