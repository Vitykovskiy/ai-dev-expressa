<template>
  <v-dialog :model-value="open" max-width="720" @update:model-value="handleDialogModelUpdate">
    <v-card class="dialog-card dialog-card--wide" rounded="lg">
      <form @submit.prevent="submit">
        <div class="dialog-card__header">
          <div>
            <h2>{{ editingOptionGroup ? "Редактировать группу опций" : "Новая группа опций" }}</h2>
          </div>
          <div class="dialog-card__icons">
            <v-btn
              v-if="editingOptionGroup"
              color="error"
              variant="text"
              icon
              title="Удалить группу опций"
              @click="$emit('delete')"
            >
              <Trash2 :size="20" />
            </v-btn>
            <v-btn color="secondary" variant="text" icon title="Закрыть" @click="$emit('close')">
              <X :size="20" />
            </v-btn>
          </div>
        </div>

        <div class="dialog-card__body">
          <v-text-field
            v-model="form.name"
            label="Название группы опций"
            placeholder="Например: Молоко, Сиропы"
            variant="outlined"
            density="comfortable"
            autofocus
            hide-details
          />

          <v-select
            v-model="form.selectionMode"
            :items="selectionModeItems"
            item-title="title"
            item-value="value"
            label="Тип выбора"
            variant="outlined"
            density="comfortable"
            hide-details
          />

          <v-sheet class="choice-block" rounded="lg" border>
            <span class="choice-block__title">Назначить на группы меню</span>
            <p v-if="categories.length === 0">Сначала создайте группу меню</p>
            <div v-else class="choice-block__list">
              <v-checkbox
                v-for="category in categories"
                :key="category.menuCategoryId"
                v-model="form.assignedCategoryIds"
                :label="category.name"
                :value="category.menuCategoryId"
                density="comfortable"
                hide-details
                color="primary"
              />
            </div>
          </v-sheet>

          <div class="options-editor">
            <div class="options-editor__header">
              <span>Опции</span>
              <v-btn class="inline-button" color="primary" variant="tonal" @click="addEditableOption">
                Добавить опцию
              </v-btn>
            </div>

            <v-sheet
              v-for="(option, index) in form.options"
              :key="option.optionId ?? index"
              class="option-edit-row"
              rounded="lg"
              border
            >
              <v-text-field
                v-model="option.name"
                label="Название опции"
                placeholder="Название опции"
                variant="outlined"
                density="comfortable"
                hide-details
              />
              <v-text-field
                v-model="option.priceDelta"
                label="Доплата"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                hide-details
              />
              <v-checkbox v-model="option.availability" label="Доступна" hide-details color="primary" />
              <v-btn
                class="option-delete-button"
                color="error"
                variant="text"
                icon
                title="Удалить опцию"
                @click="removeEditableOption(index)"
              >
                <Trash2 :size="18" />
              </v-btn>
            </v-sheet>
          </div>
        </div>

        <v-card-actions class="dialog-card__actions">
          <v-btn class="dialog-action" color="primary" type="submit" :loading="isBusy" :disabled="isBusy">
            {{ editingOptionGroup ? "Сохранить изменения" : "Добавить группу опций" }}
          </v-btn>
          <v-btn class="dialog-action" color="secondary" variant="text" @click="$emit('close')">Отмена</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
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
  OptionPayload,
  SelectionMode
} from "../../modules/menu-catalog/types";

const selectionModeItems: Array<{ title: string; value: SelectionMode }> = [
  { title: "Несколько вариантов", value: "multiple" },
  { title: "Один вариант", value: "single" }
];

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

function handleDialogModelUpdate(value: boolean): void {
  if (!value) {
    emit("close");
  }
}

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
.dialog-card {
  padding: 24px;
  background: #ffffff;
}

.dialog-card__header,
.dialog-card__icons,
.options-editor__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-card__header,
.options-editor__header {
  justify-content: space-between;
}

.dialog-card h2 {
  margin: 0;
  color: #111111;
}

.dialog-card__body,
.options-editor {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dialog-card__body {
  margin-top: 20px;
}

.choice-block {
  padding: 14px 16px;
}

.choice-block__title,
.options-editor__header > span {
  display: block;
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.choice-block__title {
  margin-bottom: 8px;
}

.choice-block p {
  margin: 0;
  color: #999999;
  font-size: 12px;
}

.choice-block__list {
  display: flex;
  flex-direction: column;
}

.inline-button,
.dialog-action {
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.inline-button {
  min-height: 34px;
}

.option-edit-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
}

@media (min-width: 640px) {
  .option-edit-row {
    grid-template-columns: minmax(0, 1fr) 140px 140px 44px;
    align-items: center;
  }
}

.option-delete-button {
  justify-self: end;
}

.dialog-card__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0 0;
}

.dialog-action {
  min-height: 42px;
}
</style>
