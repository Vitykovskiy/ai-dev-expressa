<template>
  <div v-if="open" class="dialog-shell" role="dialog" aria-modal="true">
    <button type="button" class="dialog-shell__overlay" aria-label="Закрыть" @click="$emit('close')" />
    <form class="dialog-panel dialog-panel--wide" @submit.prevent="submit">
      <div class="dialog-panel__sticky">
        <div class="dialog-panel__title-row">
          <h2>{{ editingOptionGroup ? "Редактировать группу опций" : "Новая группа опций" }}</h2>
          <div class="dialog-panel__icons">
            <button
              v-if="editingOptionGroup"
              type="button"
              class="danger-icon-button"
              title="Удалить группу опций"
              @click="$emit('delete')"
            >
              <Trash2 :size="20" />
            </button>
            <button type="button" class="plain-icon-button" title="Закрыть" @click="$emit('close')">
              <X :size="20" />
            </button>
          </div>
        </div>
      </div>

      <label class="field">
        <span>Название группы опций</span>
        <input v-model="form.name" type="text" placeholder="Например: Молоко, Сиропы" autofocus />
      </label>

      <label class="field">
        <span>Тип выбора</span>
        <select v-model="form.selectionMode">
          <option value="multiple">Несколько вариантов</option>
          <option value="single">Один вариант</option>
        </select>
      </label>

      <div class="choice-block">
        <span>Назначить на группы меню</span>
        <p v-if="categories.length === 0">Сначала создайте группу меню</p>
        <label v-for="category in categories" :key="category.menuCategoryId" class="check-row">
          <input v-model="form.assignedCategoryIds" type="checkbox" :value="category.menuCategoryId" />
          {{ category.name }}
        </label>
      </div>

      <div class="options-editor">
        <div class="options-editor__header">
          <span>Опции</span>
          <button type="button" class="inline-button" @click="addEditableOption">Добавить опцию</button>
        </div>

        <div v-for="(option, index) in form.options" :key="index" class="option-edit-row">
          <input v-model="option.name" type="text" placeholder="Название опции" />
          <input v-model="option.priceDelta" type="number" min="0" step="0.01" placeholder="Доплата" />
          <label>
            <input v-model="option.availability" type="checkbox" />
            Доступна
          </label>
          <button type="button" class="danger-icon-button" title="Удалить опцию" @click="removeEditableOption(index)">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>

      <div class="dialog-panel__actions">
        <button type="submit" class="primary-button" :disabled="isBusy">
          {{ editingOptionGroup ? "Сохранить изменения" : "Добавить группу опций" }}
        </button>
        <button type="button" class="ghost-button" @click="$emit('close')">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Trash2, X } from "lucide-vue-next";
import { reactive, watch } from "vue";
import { formatMoney, parseMoney } from "../../modules/menu-catalog/validation";
import type {
  EditableOption,
  MenuCategory,
  OptionGroup,
  OptionGroupFormState,
  OptionGroupPayload,
  OptionPayload
} from "../../modules/menu-catalog/types";

const props = defineProps<{
  open: boolean;
  isBusy: boolean;
  editingOptionGroup: OptionGroup | null;
  categories: readonly MenuCategory[];
}>();

const emit = defineEmits<{
  close: [];
  submit: [{ payload: OptionGroupPayload; assignedCategoryIds: string[] }];
  delete: [];
}>();

const form = reactive<OptionGroupFormState>({
  name: "",
  selectionMode: "multiple",
  assignedCategoryIds: [],
  options: [createEditableOption()]
});

watch(
  () => [props.open, props.editingOptionGroup, props.categories] as const,
  ([open, editingOptionGroup, categories]) => {
    if (!open) {
      resetForm();
      return;
    }

    if (!editingOptionGroup) {
      resetForm();
      return;
    }

    form.name = editingOptionGroup.name;
    form.selectionMode = editingOptionGroup.selectionMode;
    form.assignedCategoryIds = categories
      .filter((category) => category.optionGroupRefs.includes(editingOptionGroup.optionGroupId))
      .map((category) => category.menuCategoryId);
    form.options =
      editingOptionGroup.options.length > 0
        ? editingOptionGroup.options.map((option) => ({
            optionId: option.optionId,
            name: option.name,
            priceDelta: formatMoney(option.priceDelta),
            availability: option.availability
          }))
        : [createEditableOption()];
  },
  { immediate: true }
);

function addEditableOption(): void {
  form.options.push(createEditableOption());
}

function removeEditableOption(index: number): void {
  form.options.splice(index, 1);
  if (form.options.length === 0) {
    addEditableOption();
  }
}

function submit(): void {
  emit("submit", {
    payload: {
      name: form.name.trim(),
      selectionMode: form.selectionMode,
      options: form.options
        .filter((option) => option.name.trim())
        .map<OptionPayload>((option) => ({
          optionId: option.optionId,
          name: option.name.trim(),
          priceDelta: parseMoney(option.priceDelta),
          availability: option.availability
        }))
    },
    assignedCategoryIds: [...form.assignedCategoryIds]
  });
}

function resetForm(): void {
  form.name = "";
  form.selectionMode = "multiple";
  form.assignedCategoryIds = [];
  form.options = [createEditableOption()];
}

function createEditableOption(): EditableOption {
  return {
    name: "",
    priceDelta: "0",
    availability: true
  };
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

.dialog-panel--wide {
  max-height: 85vh;
}

@media (min-width: 640px) {
  .dialog-shell {
    align-items: center;
  }

  .dialog-panel {
    max-width: 480px;
    border-radius: 8px;
  }

  .dialog-panel--wide {
    max-width: 720px;
  }
}

.dialog-panel__sticky {
  position: sticky;
  top: -24px;
  z-index: 1;
  margin: -24px -24px 20px;
  padding: 20px 24px 14px;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
}

.dialog-panel__title-row,
.dialog-panel__icons,
.options-editor__header,
.dialog-panel__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-panel__title-row,
.options-editor__header {
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

.field,
.choice-block,
.options-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.field span,
.choice-block > span,
.options-editor__header > span {
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.field input,
.field select,
.option-edit-row input {
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

.check-row input,
.option-edit-row label input {
  width: 18px;
  height: 18px;
  accent-color: #1a1aff;
}

.option-edit-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid #e0e0e0;
}

.option-edit-row label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111111;
  font-size: 14px;
}

@media (min-width: 640px) {
  .option-edit-row {
    grid-template-columns: minmax(0, 1fr) 120px 110px 44px;
    align-items: center;
  }
}

.primary-button,
.ghost-button,
.inline-button {
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

.inline-button {
  min-height: 34px;
  background: #e8e8ff;
  color: #1a1aff;
}

.danger-icon-button,
.plain-icon-button {
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.danger-icon-button {
  color: #d32f2f;
}

.plain-icon-button {
  color: #555555;
}
</style>
