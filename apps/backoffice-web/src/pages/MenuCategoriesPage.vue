<template>
  <div class="menu-page">
    <section class="menu-page__header">
      <div>
        <p class="menu-page__label">menu.menu_categories</p>
        <h3 class="menu-page__title" data-testid="page-title">Категории каталога</h3>
        <p class="menu-page__text">
          Категории редактируются в общем черновике и сохраняются одним структурным снимком.
        </p>
      </div>

      <div class="menu-page__actions">
        <v-btn
          color="primary"
          variant="flat"
          data-testid="create-category"
          @click="openCreateDialog"
        >
          Создать категорию
        </v-btn>
      </div>
    </section>

    <MenuCategoryList
      :categories="categoryCards"
      @edit-category="openEditDialog"
      @open-addon-group="openAddonGroup"
      @open-products="openProducts"
    />

    <MenuCategoryFormDialog
      v-model="isDialogOpen"
      :initial-name="dialogInitialName"
      :mode="dialogMode"
      @submit="submitCategory"
    />
  </div>
</template>

<script setup lang="ts">
import type { MenuCatalogOptionGroup } from '@expressa/shared-types';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import MenuCategoryFormDialog from '../components/MenuCategoryFormDialog.vue';
import MenuCategoryList from '../components/MenuCategoryList.vue';
import {
  createMenuAddonGroupDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  menuCatalogStore,
  resolveMenuCategoryOptionGroups,
  resolveMenuCategoryProducts,
} from '../stores/menu-catalog-store';

interface MenuCategoryListItem {
  categoryId: string;
  name: string;
  optionGroupCount: number;
  optionGroups: Pick<MenuCatalogOptionGroup, 'name' | 'optionGroupId'>[];
  productCount: number;
}

const router = useRouter();
const menuState = menuCatalogStore.state;
const isDialogOpen = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const editingCategoryId = ref<string | null>(null);

const dialogInitialName = computed(() => {
  if (!editingCategoryId.value) {
    return '';
  }

  return findMenuCatalogCategory(menuState.catalog, editingCategoryId.value)?.name ?? '';
});
const categoryCards = computed<MenuCategoryListItem[]>(() =>
  (menuState.catalog?.categories ?? []).map((category) => {
    const optionGroups = resolveMenuCategoryOptionGroups(menuState.catalog, category.menuCategoryId);

    return {
      categoryId: category.menuCategoryId,
      name: category.name,
      optionGroupCount: category.optionGroupRefs.length,
      optionGroups: optionGroups.map((optionGroup) => ({
        optionGroupId: optionGroup.optionGroupId,
        name: optionGroup.name,
      })),
      productCount: resolveMenuCategoryProducts(menuState.catalog, category.menuCategoryId).length,
    };
  }),
);

function openCreateDialog() {
  dialogMode.value = 'create';
  editingCategoryId.value = null;
  isDialogOpen.value = true;
}

function openEditDialog(categoryId: string) {
  dialogMode.value = 'edit';
  editingCategoryId.value = categoryId;
  isDialogOpen.value = true;
}

function submitCategory(name: string) {
  if (dialogMode.value === 'edit' && editingCategoryId.value) {
    menuCatalogStore.updateCategoryName(editingCategoryId.value, name);
  } else {
    menuCatalogStore.addCategory(name);
  }

  isDialogOpen.value = false;
}

function openProducts(categoryId: string) {
  void router.push(createMenuProductsRoute(categoryId));
}

function openAddonGroup(categoryId: string, optionGroupId: string) {
  void router.push(createMenuAddonGroupDetailRoute(categoryId, optionGroupId));
}
</script>

<style scoped lang="scss">
.menu-page {
  display: grid;
  gap: 1rem;

  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: end;
    justify-content: space-between;
  }

  &__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.4vw, 1.65rem);
    font-weight: 800;
  }

  &__text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>
