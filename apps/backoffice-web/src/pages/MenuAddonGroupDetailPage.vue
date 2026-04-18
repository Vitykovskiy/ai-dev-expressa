<template>
  <div class="addon-detail">
    <MenuPageHeader
      label="menu.addon_group_detail"
      text="Редактор меняет группу дополнительных опций и её связи с категориями в общем черновике структурного снимка. Сохранение на сервер выполняет панель вкладки `menu`."
      :title="pageTitle"
    >
      <template #actions>
        <Button variant="ghost" @click="goBackToProducts">К товарам категории</Button>
      </template>
    </MenuPageHeader>

    <v-alert
      v-if="draftMessage"
      class="addon-detail__alert"
      color="primary"
      data-testid="addon-group-draft-message"
      variant="tonal"
    >
      {{ draftMessage }}
    </v-alert>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="detail-card" rounded="lg">
          <MenuAddonGroupEditorForm
            :categories="categoryOptions"
            :initial-category-id="categoryId"
            :mode="isCreateMode ? 'create' : 'edit'"
            :option-group="optionGroup"
            @cancel="goBackToProducts"
            @submit="submitAddonGroup"
          />
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="detail-card detail-card--summary" rounded="lg">
          <p class="detail-card__section-label">Текущее назначение</p>
          <h4 class="detail-card__summary-title">{{ summaryTitle }}</h4>
          <p class="detail-card__summary-text">
            Категории получают группу через `optionGroupRefs`, поэтому товары наследуют её без
            локальных переопределений.
          </p>

          <div class="detail-card__bindings">
            <v-chip
              v-for="category in assignedCategories"
              :key="category.menuCategoryId"
              color="primary"
              variant="tonal"
            >
              {{ category.name }}
            </v-chip>
            <span v-if="assignedCategories.length === 0" class="detail-card__muted">
              Группа ещё не назначена.
            </span>
          </div>

          <div v-if="optionGroup" class="detail-card__options">
            <div
              v-for="option in optionGroup.options"
              :key="option.optionId"
              class="detail-card__option"
            >
              <strong>{{ option.name }}</strong>
              <span>
                {{ option.priceDelta === 0 ? 'Бесплатно' : `+${option.priceDelta} ₽` }}
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '../components/base';
import { MenuAddonGroupEditorForm, MenuPageHeader } from '../components/menu';
import {
  NEW_MENU_OPTION_GROUP_ID,
  createMenuAddonGroupDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  findMenuCatalogOptionGroup,
  menuCatalogStore,
  resolveMenuCategoryProducts,
} from '../stores/menu-catalog-store';
import type { MenuCatalogOptionGroupDraft } from '../types';

const route = useRoute();
const router = useRouter();
const draftMessage = ref<string | null>(null);
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const routeOptionGroupId = computed(() =>
  typeof route.params.optionGroupId === 'string' ? route.params.optionGroupId : null,
);
const isCreateMode = computed(() => routeOptionGroupId.value === NEW_MENU_OPTION_GROUP_ID);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const optionGroup = computed(() =>
  isCreateMode.value
    ? null
    : findMenuCatalogOptionGroup(menuCatalogStore.state.catalog, routeOptionGroupId.value),
);
const categoryOptions = computed(() =>
  (menuCatalogStore.state.catalog?.categories ?? []).map((category) => ({
    ...category,
    productCount: resolveMenuCategoryProducts(
      menuCatalogStore.state.catalog,
      category.menuCategoryId,
    ).length,
  })),
);
const assignedCategories = computed(() => {
  const optionGroupId = optionGroup.value?.optionGroupId;

  if (!optionGroupId) {
    return [];
  }

  return categoryOptions.value.filter((category) =>
    category.optionGroupRefs.includes(optionGroupId),
  );
});
const pageTitle = computed(() => {
  if (isCreateMode.value) {
    return 'Новая группа дополнительных опций';
  }

  return optionGroup.value?.name ?? 'Группа дополнительных опций';
});
const summaryTitle = computed(() => {
  if (isCreateMode.value) {
    return category.value
      ? `Новая группа для «${category.value.name}»`
      : 'Новая группа без выбранной категории';
  }

  return optionGroup.value?.selectionMode === 'multiple'
    ? 'Множественный выбор'
    : 'Один вариант';
});

function goBackToProducts() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuProductsRoute(categoryId.value));
}

function resolveTargetCategoryId(categoryIds: string[]): string | null {
  if (categoryId.value && categoryIds.includes(categoryId.value)) {
    return categoryId.value;
  }

  return categoryIds[0] ?? null;
}

function submitAddonGroup(optionGroupDraft: MenuCatalogOptionGroupDraft) {
  const targetCategoryId = resolveTargetCategoryId(optionGroupDraft.categoryIds);

  if (!targetCategoryId) {
    return;
  }

  if (isCreateMode.value) {
    const optionGroup = menuCatalogStore.addOptionGroup(optionGroupDraft);

    if (!optionGroup) {
      return;
    }

    draftMessage.value = 'Группа дополнительных опций добавлена в черновик каталога.';
    void router.replace(
      createMenuAddonGroupDetailRoute(targetCategoryId, optionGroup.optionGroupId),
    );
    return;
  }

  if (
    !routeOptionGroupId.value ||
    !menuCatalogStore.updateOptionGroup(routeOptionGroupId.value, optionGroupDraft)
  ) {
    return;
  }

  draftMessage.value = 'Группа дополнительных опций обновлена в черновике каталога.';

  if (categoryId.value !== targetCategoryId) {
    void router.replace(createMenuAddonGroupDetailRoute(targetCategoryId, routeOptionGroupId.value));
  }
}
</script>

<style scoped lang="scss">
.addon-detail {
  display: grid;
  gap: 1rem;
}

.detail-card {
  height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);

  &__section-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__summary-title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.5vw, 1.7rem);
    font-weight: 800;
  }

  &__summary-text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__bindings,
  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  &__options {
    display: grid;
  }

  &__option {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.96);
  }

  &__muted {
    color: var(--expressa-muted);
  }
}
</style>
