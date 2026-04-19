<template>
  <ui-dialog-shell
    :open="open"
    :title="editingCategory ? 'Редактировать группу' : 'Новая группа'"
    :description="
      editingCategory ? 'Измените название и назначенные группы опций' : 'Создайте новую группу для товаров'
    "
    @close="$emit('close')"
  >
    <template #headerActions>
      <ui-icon-button v-if="editingCategory" variant="ghost" title="Удалить группу" @click="$emit('delete')">
        <Trash2 :size="20" />
      </ui-icon-button>
    </template>

    <form @submit.prevent="submit">
      <div class="dialog-card__body">
        <ui-form-field label="Название группы">
          <v-text-field
            v-model="form.name"
            placeholder="Например: Кофе, Чай, Десерты"
            variant="outlined"
            density="comfortable"
            autofocus
            hide-details
          />
        </ui-form-field>

        <ui-section-card class="choice-block" title="Группы опций" body-class="choice-block__body">
          <p v-if="optionGroups.length === 0">Нет доступных групп опций</p>
          <div v-else class="choice-block__list">
            <v-checkbox
              v-for="group in optionGroups"
              :key="group.optionGroupId"
              v-model="form.optionGroupRefs"
              :label="group.name"
              :value="group.optionGroupId"
              density="comfortable"
              hide-details
              color="primary"
            />
          </div>
        </ui-section-card>
      </div>

      <div class="dialog-card__actions">
        <ui-button block type="submit" :loading="isBusy" :disabled="isBusy">
          {{ editingCategory ? "Сохранить изменения" : "Добавить категорию" }}
        </ui-button>
        <ui-button block variant="ghost" @click="$emit('close')">Отмена</ui-button>
      </div>
    </form>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { reactive, watch } from "vue";
import UiButton from "../../ui/UiButton.vue";
import UiDialogShell from "../../ui/UiDialogShell.vue";
import UiFormField from "../../ui/UiFormField.vue";
import UiIconButton from "../../ui/UiIconButton.vue";
import UiSectionCard from "../../ui/UiSectionCard.vue";
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
.dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}

.choice-block {
  padding: 0;
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

.dialog-card__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0 0;
}
</style>
