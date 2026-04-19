<template>
  <v-dialog :model-value="open" max-width="480" @update:model-value="handleDialogModelUpdate">
    <v-card class="dialog-card" rounded="lg">
      <form @submit.prevent="submit">
        <div class="dialog-card__header">
          <div>
            <h2>{{ editingCategory ? "Редактировать группу" : "Новая группа" }}</h2>
            <p class="dialog-card__description">
              {{ editingCategory ? "Измените название и назначенные группы опций" : "Создайте новую группу для товаров" }}
            </p>
          </div>
          <v-btn
            v-if="editingCategory"
            color="error"
            variant="text"
            icon
            title="Удалить группу"
            @click="$emit('delete')"
          >
            <Trash2 :size="20" />
          </v-btn>
        </div>

        <div class="dialog-card__body">
          <v-text-field
            v-model="form.name"
            label="Название группы"
            placeholder="Например: Кофе, Чай, Десерты"
            variant="outlined"
            density="comfortable"
            autofocus
            hide-details
          />

          <v-sheet class="choice-block" rounded="lg" border>
            <span class="choice-block__title">Группы опций</span>
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
          </v-sheet>
        </div>

        <v-card-actions class="dialog-card__actions">
          <v-btn class="dialog-action" color="primary" type="submit" :loading="isBusy" :disabled="isBusy">
            {{ editingCategory ? "Сохранить изменения" : "Добавить категорию" }}
          </v-btn>
          <v-btn class="dialog-action" color="secondary" variant="text" @click="$emit('close')">Отмена</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
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

function handleDialogModelUpdate(value: boolean): void {
  if (!value) {
    emit("close");
  }
}

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
.dialog-card {
  padding: 24px;
  background: #ffffff;
}

.dialog-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.dialog-card h2 {
  margin: 0;
  color: #111111;
}

.dialog-card__description {
  margin: 4px 0 0;
  color: #777777;
  font-size: 13px;
  line-height: 20px;
}

.dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}

.choice-block {
  padding: 14px 16px;
}

.choice-block__title {
  display: block;
  margin-bottom: 8px;
  color: #555555;
  font-size: 13px;
  font-weight: 600;
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

.dialog-card__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0 0;
}

.dialog-action {
  min-height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}
</style>
