<template>
  <MenuStickyActionDock
    class="save-panel"
    data-testid="menu-catalog-save-panel"
    placement="top"
    :variant="panelState.cardVariant"
  >
    <template #content>
      <div class="save-panel__content">
        <MenuBadge
          class="save-panel__badge"
          :emphasis="panelState.badge.emphasis"
          size="compact"
          :tone="panelState.badge.tone"
        >
          {{ panelState.badge.label }}
        </MenuBadge>
        <MenuSectionHeader label="Панель сохранения" :text="panelState.text" :title="panelState.title" />
        <p
          v-if="panelState.inlineError"
          class="save-panel__error"
          data-testid="menu-catalog-save-error"
        >
          {{ panelState.inlineError.message }}
        </p>
        <p class="save-panel__hint">{{ panelState.actionHint }}</p>
      </div>
    </template>

    <template #actions>
      <MenuActionButton
        :disabled="disabled || !isDirty || isSaving"
        :loading="isSaving"
        :variant="panelState.actionVariant"
        data-testid="save-menu-catalog"
        @click="$emit('save')"
      >
        {{ panelState.actionLabel }}
      </MenuActionButton>
    </template>
  </MenuStickyActionDock>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MenuStickyActionDock from './MenuStickyActionDock.vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuSectionHeader from './menu/MenuSectionHeader.vue';
import { resolveMenuCatalogSavePanelState } from '../composables/menu-catalog-shell-state';
import type { MenuCatalogError, MenuCatalogStatus } from '../types';

const props = defineProps<{
  disabled?: boolean;
  error: MenuCatalogError | null;
  isDirty: boolean;
  status: MenuCatalogStatus;
}>();

defineEmits<{
  save: [];
}>();

const isSaving = computed(() => props.status === 'saving');
const panelState = computed(() => resolveMenuCatalogSavePanelState(props));
</script>

<style scoped lang="scss">
.save-panel {
  &__content {
    min-width: 0;
  }

  &__badge {
    margin-bottom: 0.85rem;
  }

  &__error {
    margin: 0.85rem 0 0;
    color: #b71c1c;
    font-weight: 700;
  }

  &__hint {
    margin: 0.85rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
  }

  :deep(.menu-sticky-dock__actions) {
    justify-content: flex-start;
  }
}
</style>
