<template>
  <aside class="option-panel">
    <div class="option-panel__header">
      <div>
        <h2>Группы опций</h2>
        <p>Допы назначаются на группы меню</p>
      </div>
      <button type="button" class="icon-button" title="Добавить группу опций" @click="$emit('create')">
        <Plus :size="18" />
      </button>
    </div>

    <div v-if="optionGroups.length === 0" class="option-panel__empty">Нет групп опций</div>

    <button
      v-for="group in optionGroups"
      :key="group.optionGroupId"
      type="button"
      class="option-group-row"
      @click="$emit('edit', group)"
    >
      <span>
        <strong>{{ group.name }}</strong>
        <small>{{ selectionModeLabel(group.selectionMode) }} · {{ group.options.length }} опций</small>
      </span>
      <ChevronRight :size="18" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ChevronRight, Plus } from "lucide-vue-next";
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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
}

.option-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.option-panel__header h2 {
  margin: 0;
  color: #111111;
  font-size: 18px;
}

.option-panel__header p {
  margin: 4px 0 0;
  color: #777777;
  font-size: 13px;
  line-height: 20px;
}

.option-panel__empty {
  padding: 36px 16px;
  text-align: center;
  color: #999999;
}

.option-group-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 0;
  border-bottom: 1px solid #e0e0e0;
  background: transparent;
  color: #111111;
  text-align: left;
  cursor: pointer;
}

.option-group-row span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.option-group-row small {
  color: #999999;
  font-size: 12px;
}

.icon-button {
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #1a1aff;
  cursor: pointer;
}
</style>
