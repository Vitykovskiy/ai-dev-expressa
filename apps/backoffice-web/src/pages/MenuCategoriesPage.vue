<template>
  <div class="menu-page">
    <MenuSectionHeader
      label="menu.menu_categories"
      text="Категории редактируются в общем черновике и сохраняются одним структурным снимком."
      title="Категории каталога"
      title-test-id="page-title"
    >
      <template #actions>
        <MenuActionButton data-testid="create-category" @click="openCreateDialog">
          Создать категорию
        </MenuActionButton>
      </template>
    </MenuSectionHeader>

    <MenuCategoryList
      :categories="categoryCards"
      @create-addon-group="createAddonGroup"
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
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import {
  createMenuAddonGroupDetailRoute,
  createMenuNewAddonGroupRoute,
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

function createAddonGroup(categoryId: string) {
  void router.push(createMenuNewAddonGroupRoute(categoryId));
}

function openAddonGroup(categoryId: string, optionGroupId: string) {
  void router.push(createMenuAddonGroupDetailRoute(categoryId, optionGroupId));
}
</script>

<style scoped lang="scss">
.menu-page {
  display: grid;
  gap: 1rem;
}
</style>
