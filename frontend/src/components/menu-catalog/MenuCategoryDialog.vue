<template>
  <div v-if="open" class="dialog-shell" role="dialog" aria-modal="true">
    <button type="button" class="dialog-shell__overlay" aria-label="Закрыть" @click="$emit('close')" />
    <form class="dialog-panel" @submit.prevent="submit">
      <div class="dialog-panel__title-row">
        <h2>{{ editingCategory ? "Редактировать группу" : "Новая группа" }}</h2>
        <button
          v-if="editingCategory"
          type="button"
          class="danger-icon-button"
          title="Удалить группу"
          @click="$emit('delete')"
        >
          <Trash2 :size="20" />
        </button>
      </div>
      <p class="dialog-panel__description">
        {{ editingCategory ? "Измените название и назначенные группы опций" : "Создайте новую группу для товаров" }}
      </p>

      <label class="field">
        <span>Название группы</span>
        <input v-model="form.name" type="text" placeholder="Например: Кофе, Чай, Десерты" autofocus />
      </label>

      <div class="choice-block">
        <span>Группы опций</span>
        <p v-if="optionGroups.length === 0">Нет доступных групп опций</p>
        <label v-for="group in optionGroups" :key="group.optionGroupId" class="check-row">
          <input v-model="form.optionGroupRefs" type="checkbox" :value="group.optionGroupId" />
          {{ group.name }}
        </label>
      </div>

      <div class="dialog-panel__actions">
        <button type="submit" class="primary-button" :disabled="isBusy">
          {{ editingCategory ? "Сохранить изменения" : "Добавить категорию" }}
        </button>
        <button type="button" class="ghost-button" @click="$emit('close')">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { reactive, watch } from "vue";
import type { MenuCategoryPayload } from "../../modules/menu-catalog/types";
import type { MenuCategory, MenuCategoryFormState, OptionGroup } from "../../modules/menu-catalog/types";

const props = defineProps<{
  open: boolean;
  isBusy: boolean;
  editingCategory: MenuCategory | null;
  optionGroups: readonly OptionGroup[];
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: MenuCategoryPayload];
  delete: [];
}>();

const form = reactive<MenuCategoryFormState>({
  name: "",
  optionGroupRefs: []
});

watch(
  () => [props.open, props.editingCategory] as const,
  ([open, editingCategory]) => {
    if (!open) {
      resetForm();
      return;
    }

    form.name = editingCategory?.name ?? "";
    form.optionGroupRefs = editingCategory ? [...editingCategory.optionGroupRefs] : [];
  },
  { immediate: true }
);

function submit(): void {
  emit("submit", {
    name: form.name.trim(),
    optionGroupRefs: [...form.optionGroupRefs]
  });
}

function resetForm(): void {
  form.name = "";
  form.optionGroupRefs = [];
}
</script>

<style scoped lang="scss">
.dialog-shell {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.dialog-shell__overlay {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.4);
}

.dialog-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  border-radius: 8px 8px 0 0;
  background: #ffffff;
}

@media (min-width: 640px) {
  .dialog-shell {
    align-items: center;
  }

  .dialog-panel {
    max-width: 480px;
    border-radius: 8px;
  }
}

.dialog-panel__title-row,
.dialog-panel__actions {
  display: flex;
  gap: 12px;
}

.dialog-panel__title-row {
  align-items: center;
  justify-content: space-between;
}

.dialog-panel__actions {
  flex-direction: column;
  margin-top: 24px;
}

.dialog-panel h2 {
  margin: 0;
  color: #111111;
}

.dialog-panel__description {
  margin: 4px 0 0;
  color: #777777;
  font-size: 13px;
  line-height: 20px;
}

.field,
.choice-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.field span,
.choice-block > span {
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.field input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  color: #111111;
  background: #ffffff;
  font-size: 14px;
}

.choice-block {
  padding: 14px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.choice-block p {
  margin: 0;
  color: #999999;
  font-size: 12px;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 30px;
  color: #111111;
  font-size: 14px;
}

.check-row input {
  width: 18px;
  height: 18px;
  accent-color: #1a1aff;
}

.primary-button,
.ghost-button {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  background: #1a1aff;
  color: #ffffff;
}

.ghost-button {
  width: 100%;
  background: transparent;
  color: #555555;
}

.danger-icon-button {
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #d32f2f;
  cursor: pointer;
}
</style>
