<template>
  <ui-section-list class="option-panel" title="Группы опций" subtitle="Допы назначаются на группы меню">
    <template #actions>
      <ui-icon-button title="Добавить группу опций" @click="$emit('create')">
        <Plus :size="18" />
      </ui-icon-button>
    </template>

    <div v-if="optionGroups.length === 0" class="option-panel__empty">Нет групп опций</div>

    <ui-button
      v-for="group in optionGroups"
      :key="group.optionGroupId"
      class="option-group-row"
      variant="ghost"
      @click="$emit('edit', group)"
    >
      <span class="option-group-row__content">
        <span>
          <strong>{{ group.name }}</strong>
          <small>{{ selectionModeLabel(group.selectionMode) }} · {{ group.options.length }} опций</small>
        </span>
        <ChevronRight :size="18" />
      </span>
    </ui-button>
  </ui-section-list>
</template>

<script setup lang="ts">
import { ChevronRight, Plus } from "lucide-vue-next";
import UiButton from "../../ui/UiButton.vue";
import UiIconButton from "../../ui/UiIconButton.vue";
import UiSectionList from "../../ui/UiSectionList.vue";
import { selectionModeLabel } from "../../modules/menu-catalog/presentation";
import type { OptionGroup } from "../../modules/menu-catalog/types";

defineProps<{
  optionGroups: readonly OptionGroup[];
}>();

defineEmits<{
  create: [];
  edit: [group: OptionGroup];
}>();
</script>

<style scoped lang="scss">
.option-panel {
  align-self: stretch;
  overflow: hidden;
}

.option-panel__empty {
  padding: 36px 16px;
  text-align: center;
  color: var(--app-color-text-muted);
}

.option-group-row {
  width: 100%;
  min-height: 56px;
  justify-content: flex-start;
  padding: 0 16px;
  border-radius: 0;
  border-bottom: 1px solid var(--app-color-border);
}

.option-group-row__content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
}

.option-group-row__content > span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.option-group-row strong {
  color: var(--app-color-text-primary);
}

.option-group-row small {
  color: var(--app-color-text-muted);
  font-size: 12px;
}
</style>
