<template>
  <div class="menu-page">
    <MenuSectionHeader
      label="menu.menu_categories"
      text="Разверните категорию, чтобы просмотреть товары, связанные группы дополнительных опций и перейти в выбранный подпоток без смены общего черновика."
      title="Дерево категорий меню"
      title-test-id="page-title"
    >
      <template #actions>
        <MenuActionButton data-testid="create-category" @click="openCreateDialog">
          Новая категория
        </MenuActionButton>
      </template>
    </MenuSectionHeader>

    <MenuCategoryList
      :categories="categoryCards"
      @create-category="openCreateDialog"
      @create-addon-group="createAddonGroup"
      @edit-category="openEditDialog"
      @open-addon-group="openAddonGroup"
      @open-products="openProducts"
    />

    <MenuCategoryFormDialog
      v-model="isDialogOpen"
      :initial-name="dialogInitialName"
      :mode="dialogMode"
      :product-count="dialogProductCount"
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
  resolveMenuProductPriceSummary,
} from '../stores/menu-catalog-store';

interface MenuCategoryProductListItem {
  name: string;
  priceSummary: string;
  productId: string;
}

interface MenuCategoryListItem {
  categoryId: string;
  name: string;
  optionGroupCount: number;
  optionGroups: Pick<MenuCatalogOptionGroup, 'name' | 'optionGroupId'>[];
  products: MenuCategoryProductListItem[];
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
const dialogProductCount = computed(() => {
  if (!editingCategoryId.value) {
    return 0;
  }

  return resolveMenuCategoryProducts(menuState.catalog, editingCategoryId.value).length;
});
const categoryCards = computed<MenuCategoryListItem[]>(() =>
  (menuState.catalog?.categories ?? []).map((category) => {
    const optionGroups = resolveMenuCategoryOptionGroups(menuState.catalog, category.menuCategoryId);
    const products = resolveMenuCategoryProducts(menuState.catalog, category.menuCategoryId);

    return {
      categoryId: category.menuCategoryId,
      name: category.name,
      optionGroupCount: category.optionGroupRefs.length,
      optionGroups: optionGroups.map((optionGroup) => ({
        optionGroupId: optionGroup.optionGroupId,
        name: optionGroup.name,
      })),
      products: products.map((product) => ({
        productId: product.menuItemId,
        name: product.name,
        priceSummary: resolveMenuProductPriceSummary(product),
      })),
      productCount: products.length,
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
    const updated = menuCatalogStore.updateCategoryName(editingCategoryId.value, name);

    if (updated) {
      menuCatalogStore.pushToast({
        text: `Категория «${name.trim()}» обновлена в общем черновике каталога.`,
        title: 'Черновик обновлён',
        tone: 'success',
      });
    } else {
      menuCatalogStore.pushToast({
        text: 'Не удалось обновить категорию в общем черновике каталога.',
        title: 'Категория не обновлена',
        tone: 'danger',
      });
    }
  } else {
    const category = menuCatalogStore.addCategory(name);

    if (category) {
      menuCatalogStore.pushToast({
        text: `Категория «${category.name}» добавлена в общий черновик каталога.`,
        title: 'Черновик обновлён',
        tone: 'success',
      });
    } else {
      menuCatalogStore.pushToast({
        text: 'Не удалось добавить категорию в общий черновик каталога.',
        title: 'Категория не добавлена',
        tone: 'danger',
      });
    }
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
