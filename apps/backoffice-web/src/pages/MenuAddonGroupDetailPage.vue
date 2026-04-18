<template>
  <div class="addon-detail">
    <MenuSectionHeader
      label="menu.addon_group_detail"
      text="Редактор меняет группу дополнительных опций и её связи с категориями в общем черновике структурного снимка. Сохранение на сервер выполняет панель вкладки `menu`."
      :title="pageTitle"
      title-test-id="page-title"
    >
      <template #actions>
        <MenuActionButton variant="ghost" @click="goBackToProducts">
          К товарам категории
        </MenuActionButton>
      </template>
    </MenuSectionHeader>

    <MenuSurfaceCard
      v-if="draftMessage"
      class="addon-detail__draft"
      data-testid="addon-group-draft-message"
      variant="subtle"
    >
      <MenuBadge size="compact">Черновик обновлён</MenuBadge>
      <p class="addon-detail__draft-text">{{ draftMessage }}</p>
    </MenuSurfaceCard>

    <v-row>
      <v-col cols="12" lg="8">
        <MenuSurfaceCard class="detail-card" full-height>
          <MenuAddonGroupEditorForm
            :categories="categoryOptions"
            :initial-category-id="categoryId"
            :mode="isCreateMode ? 'create' : 'edit'"
            :option-group="optionGroup"
            @cancel="goBackToProducts"
            @submit="submitAddonGroup"
          />
        </MenuSurfaceCard>
      </v-col>

      <v-col cols="12" lg="4">
        <MenuSurfaceCard class="detail-card detail-card--summary" full-height>
          <MenuSectionHeader
            label="Текущее назначение"
            text="Категории получают группу через `optionGroupRefs`, поэтому товары наследуют её без локальных переопределений."
            :title="summaryTitle"
          />

          <div class="detail-card__bindings">
            <MenuBadge
              v-for="category in assignedCategories"
              :key="category.menuCategoryId"
            >
              {{ category.name }}
            </MenuBadge>
            <span v-if="assignedCategories.length === 0" class="detail-card__muted">
              Группа ещё не назначена.
            </span>
          </div>

          <div v-if="optionGroup" class="detail-card__options">
            <MenuListRow
              v-for="option in optionGroup.options"
              :key="option.optionId"
              tone="accent"
            >
              <strong>{{ option.name }}</strong>
              <template #trailing>
                <span>
                  {{ option.priceDelta === 0 ? 'Бесплатно' : `+${option.priceDelta} ₽` }}
                </span>
              </template>
            </MenuListRow>
          </div>
        </MenuSurfaceCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MenuAddonGroupEditorForm from '../components/MenuAddonGroupEditorForm.vue';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuBadge from '../components/menu/MenuBadge.vue';
import MenuListRow from '../components/menu/MenuListRow.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import MenuSurfaceCard from '../components/menu/MenuSurfaceCard.vue';
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

  &__draft {
    display: grid;
    gap: 0.75rem;
  }

  &__draft-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
  }
}

.detail-card {
  display: grid;
  gap: 1rem;

  &__bindings,
  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__options {
    display: grid;
  }

  &__muted {
    color: var(--expressa-muted);
  }
}
</style>
