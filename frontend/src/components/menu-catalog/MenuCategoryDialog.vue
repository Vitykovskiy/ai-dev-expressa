<template>
  <AppDialogShell
    :open="open"
    :title="editingCategory ? 'Редактировать группу' : 'Новая группа'"
    :description="
      editingCategory ? 'Измените название и назначенные группы опций' : 'Создайте новую группу для товаров'
    "
    @close="$emit('close')"
  >
    <template #headerActions>
      <AppIconButton v-if="editingCategory" variant="ghost" title="Удалить группу" @click="$emit('delete')">
        <Trash2 :size="20" />
      </AppIconButton>
    </template>

    <form @submit.prevent="submit">
      <div class="dialog-card__body">
        <AppFormField label="Название группы">
          <v-text-field
            v-model="form.name"
            placeholder="Например: Кофе, Чай, Десерты"
            variant="outlined"
            density="comfortable"
            autofocus
            hide-details
          />
        </AppFormField>

        <AppSectionCard class="choice-block" title="Группы опций" body-class="choice-block__body">
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
        </AppSectionCard>
      </div>

      <div class="dialog-card__actions">
        <AppButton block type="submit" :loading="isBusy" :disabled="isBusy">
          {{ editingCategory ? "Сохранить изменения" : "Добавить категорию" }}
        </AppButton>
        <AppButton block variant="ghost" @click="$emit('close')">Отмена</AppButton>
      </div>
    </form>
  </AppDialogShell>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { reactive, watch } from "vue";
import AppButton from "../ui/AppButton.vue";
import AppDialogShell from "../ui/AppDialogShell.vue";
import AppFormField from "../ui/AppFormField.vue";
import AppIconButton from "../ui/AppIconButton.vue";
import AppSectionCard from "../ui/AppSectionCard.vue";
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
