<template>
  <ui-dialog-shell
    :open="open"
    :max-width="720"
    :title="
      editingOptionGroup ? 'Редактировать группу опций' : 'Новая группа опций'
    "
    @close="$emit('close')"
  >
    <template #headerActions>
      <ui-icon-button
        v-if="editingOptionGroup"
        title="Удалить группу опций"
        @click="$emit('delete')"
      >
        <Trash2 :size="20" />
      </ui-icon-button>
      <ui-icon-button title="Закрыть" @click="$emit('close')">
        <X :size="20" />
      </ui-icon-button>
    </template>

    <form @submit.prevent="submit">
      <div class="dialog-card__body">
        <ui-form-field label="Название группы опций">
          <v-text-field
            v-model="form.name"
            placeholder="Например: Молоко, Сиропы"
            variant="outlined"
            density="comfortable"
            autofocus
            hide-details
          />
        </ui-form-field>

        <ui-form-field label="Тип выбора">
          <v-select
            v-model="form.selectionMode"
            :items="selectionModeItems"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </ui-form-field>

        <ui-section-card
          class="choice-block"
          title="Назначить на группы меню"
          body-class="choice-block__body"
        >
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
        </ui-section-card>

        <div class="options-editor">
          <div class="options-editor__header">
            <span>Опции</span>
            <ui-inline-action @click="addEditableOption"
              >Добавить опцию</ui-inline-action
            >
          </div>

          <ui-section-card
            v-for="(option, index) in form.options"
            :key="option.optionId ?? index"
            body-class="option-edit-row"
          >
            <ui-form-field label="Название опции">
              <v-text-field
                v-model="option.name"
                placeholder="Название опции"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </ui-form-field>
            <ui-form-field label="Доплата">
              <v-text-field
                v-model="option.priceDelta"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </ui-form-field>
            <v-checkbox
              v-model="option.availability"
              label="Доступна"
              hide-details
              color="primary"
            />
            <ui-icon-button
              class="option-delete-button"
              title="Удалить опцию"
              @click="removeEditableOption(index)"
            >
              <Trash2 :size="18" />
            </ui-icon-button>
          </ui-section-card>
        </div>
      </div>

      <div class="dialog-card__actions">
        <ui-button block type="submit" :loading="isBusy" :disabled="isBusy">
          {{
            editingOptionGroup ? "Сохранить изменения" : "Добавить группу опций"
          }}
        </ui-button>
        <ui-button block variant="ghost" @click="$emit('close')"
          >Отмена</ui-button
        >
      </div>
    </form>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { Trash2, X } from "lucide-vue-next";
import { reactive, watch } from "vue";
import UiButton from "../../ui/UiButton.vue";
import UiDialogShell from "../../ui/UiDialogShell.vue";
import UiFormField from "../../ui/UiFormField.vue";
import UiIconButton from "../../ui/UiIconButton.vue";
import UiInlineAction from "../../ui/UiInlineAction.vue";
import UiSectionCard from "../../ui/UiSectionCard.vue";
import { formatMoney, parseMoney } from "../../modules/menu-catalog/validation";
import type {
  EditableOption,
  MenuCategory,
  OptionGroup,
  OptionGroupFormState,
  OptionGroupPayload,
  OptionPayload,
  SelectionMode,
} from "../../modules/menu-catalog/types";

const selectionModeItems: Array<{ title: string; value: SelectionMode }> = [
  { title: "Несколько вариантов", value: "multiple" },
  { title: "Один вариант", value: "single" },
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
  options: [createEditableOption()],
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
      .filter((category) =>
        category.optionGroupRefs.includes(editingOptionGroup.optionGroupId),
      )
      .map((category) => category.menuCategoryId);
    form.options =
      editingOptionGroup.options.length > 0
        ? editingOptionGroup.options.map((option) => ({
            optionId: option.optionId,
            name: option.name,
            priceDelta: formatMoney(option.priceDelta),
            availability: option.availability,
          }))
        : [createEditableOption()];
  },
  { immediate: true },
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
          availability: option.availability,
        })),
    },
    assignedCategoryIds: [...form.assignedCategoryIds],
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
    availability: true,
  };
}
</script>

<style scoped lang="scss">
.options-editor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  padding: 0;
}

.options-editor__header > span {
  display: block;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.choice-block :deep(.choice-block__body) {
  padding-top: 0;
}

.choice-block p {
  margin: 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.choice-block__list {
  display: flex;
  flex-direction: column;
}

:deep(.option-edit-row) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

@media (min-width: 640px) {
  :deep(.option-edit-row) {
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
</style>
