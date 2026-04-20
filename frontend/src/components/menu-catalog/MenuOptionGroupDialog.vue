<template>
  <ui-dialog-shell
    :open="open"
    :max-width="720"
    :title="
      editingOptionGroup ? 'Редактировать группу опций' : 'Новая группа опций'
    "
    description="Настройте тип выбора и состав опций"
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
    </template>

    <form id="menu-option-group-dialog-form" @submit.prevent="submit">
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
    </form>

    <template #actions>
      <ui-button
        block
        type="submit"
        form="menu-option-group-dialog-form"
        :loading="isBusy"
        :disabled="isBusy"
      >
        {{
          editingOptionGroup ? "Сохранить изменения" : "Добавить группу опций"
        }}
      </ui-button>
      <ui-button block variant="ghost" @click="$emit('close')"
        >Отмена</ui-button
      >
    </template>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
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
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: OptionGroupPayload];
  delete: [];
}>();

const form = reactive<OptionGroupFormState>({
  name: "",
  selectionMode: "multiple",
  assignedCategoryIds: [],
  options: [createEditableOption()],
});

watch(
  () => [props.open, props.editingOptionGroup] as const,
  ([open, editingOptionGroup]) => {
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
  margin: 0;
}

.options-editor__header > span {
  display: block;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
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
</style>
